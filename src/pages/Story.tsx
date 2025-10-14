import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import Phone from '../components/Phone';
import courses from '../data/index';
import type { Message } from '../common/types';
import ChatMessage from '../components/ChatMessage';
import { useTranslation } from 'react-i18next';

// Progress store
import {
  getProgress,
  clearProgress,
  pushAnswer,
  markChapterCompleted,
} from '../common/utils';

import ConfirmDialog from '../components/ConfirmDialog';

const Story = () => {
  const { courseId } = useParams();
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [chapter, setChapter] = useState(0);
  const [awaitingUserAnswer, setAwaitingUserAnswer] = useState(false);

  // NEW: pause ticker while dialog is open
  const [isPaused, setIsPaused] = useState(false);

  // Resume dialog
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [resumeMode, setResumeMode] = useState<'partial' | 'complete' | null>(
    null
  );

  const { i18n } = useTranslation();
  const courseLanguage = i18n.language.split('-')[0];

  const course = courses[courseLanguage as 'de' | 'en'].find(
    (c) => c.id === courseId
  );

  const allMessages = useMemo(
    () => course?.script[chapter]?.messages || [],
    [course, chapter]
  );

  const lastMainIndex = useMemo(() => {
    if (!allMessages.length) return -1;
    for (let i = allMessages.length - 1; i >= 0; i--) {
      const m = allMessages[i];
      if (m.type === 'main') return i;
    }
    return -1;
  }, [allMessages]);

  // On story mount, check progress and offer resume
  useEffect(() => {
    if (!course || !courseId) return;

    const p = getProgress(courseId);
    if (p) {
      const totalChapters = course.script.length || 1;
      const pct = p.finished
        ? 100
        : Math.floor((p.unlockedEpisode / totalChapters) * 100);
      if (pct >= 100) {
        setResumeMode('complete');
        setShowResumeDialog(true);
        setIsPaused(true); // NEW: pause while choosing
      } else if (pct > 0) {
        setResumeMode('partial');
        setShowResumeDialog(true);
        setIsPaused(true); // NEW: pause while choosing
      } else {
        resetToStart();
      }
    } else {
      resetToStart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, course]);

  function resetToStart() {
    setDisplayedMessages([]);
    setCurrentMessageIndex(0);
    setChapter(0);
    setAwaitingUserAnswer(false);
    setIsPaused(false); // ensure not paused for fresh run
  }

  // Emoji helpers
  const extractEmojis = (s: string) =>
    (s.match(
      /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/gu
    ) as string[]) || [];

  const isReactionOnlyMessage = (m: Message) => {
    const content = (m.content ?? '').trim();
    const hasExplicit = Array.isArray(m.reactions) && m.reactions.length > 0;
    if (content.length === 0 && hasExplicit) return true;

    const emojiOnly =
      content.length > 0 &&
      /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(content) &&
      !/[A-Za-zÄÖÜäöüẞ0-9]/.test(content) &&
      content.length <= 6;

    return emojiOnly;
  };

  // Message ticker
  useEffect(() => {
    if (isPaused) return; // NEW: do nothing while paused (dialog open)
    if (!course || allMessages.length === 0) return;
    if (currentMessageIndex >= allMessages.length) return;

    // Stop before last MAIN to await user
    if (lastMainIndex !== -1 && currentMessageIndex === lastMainIndex) {
      setAwaitingUserAnswer(true);
      return;
    }

    const nextMsg = allMessages[currentMessageIndex];

    const getDelayForMessage = (msg: any, index: number) => {
      if (index === 0) return 0;
      const minDelayMs = 800;
      const maxDelayMs = 8000;
      const charsPerSecond = 14;
      const baseOverheadMs = 300;
      const imageExtraMs = msg.image ? 600 : 0;
      const jitter = 0.85 + Math.random() * 0.6;

      const content = typeof msg.content === 'string' ? msg.content : '';
      const readingMs =
        content.length > 0 ? (content.length / charsPerSecond) * 1000 : 900;

      const raw = baseOverheadMs + readingMs + imageExtraMs;
      const clamped = Math.min(maxDelayMs, Math.max(minDelayMs, raw));
      return clamped * jitter;
    };

    const delay = getDelayForMessage(nextMsg, currentMessageIndex);

    const timer = setTimeout(() => {
      if (isReactionOnlyMessage(nextMsg)) {
        setDisplayedMessages((prev) => {
          if (prev.length === 0) return [...prev, nextMsg];
          const last = { ...prev[prev.length - 1] };
          const merged = [...(last.reactions || [])];

          if (
            Array.isArray(nextMsg.reactions) &&
            nextMsg.reactions.length > 0
          ) {
            merged.push(...nextMsg.reactions);
          }
          if (nextMsg.content) {
            merged.push(...extractEmojis(nextMsg.content));
          }

          last.reactions = merged;
          const copy = [...prev];
          copy[copy.length - 1] = last;
          return copy;
        });
      } else {
        setDisplayedMessages((prev) => [...prev, nextMsg]);
      }

      setCurrentMessageIndex((prev) => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [isPaused, currentMessageIndex, allMessages, course, lastMainIndex]);

  if (!course) {
    return (
      <Layout backPath="/stories">
        <div className="w-full max-w-4xl px-4 py-12">
          <h2 className="text-3xl font-bold mb-8 text-[#0084ff]">
            Kurs nicht gefunden
          </h2>
          <p>Der angeforderte Kurs konnte nicht gefunden werden.</p>
        </div>
      </Layout>
    );
  }

  // NEW: Reconstruct transcript including user answers up to a resume point
  function buildTranscriptUpTo({
    targetChapter,
    includeFinishedChapters,
    answers,
  }: {
    targetChapter: number;
    includeFinishedChapters: boolean; // include tip and user message for finished chapters
    answers: { chapter: number; text: string; timestamp?: string }[];
  }): { messages: Message[]; chapterStartIndex: number } {
    const msgs: Message[] = [];

    // Go through each chapter up to targetChapter - 1 (fully finished)
    for (let ch = 0; ch < targetChapter; ch++) {
      const chMsgs = course!.script[ch]?.messages ?? [];
      const lastMainIdx = (() => {
        for (let i = chMsgs.length - 1; i >= 0; i--) {
          if (chMsgs[i].type === 'main') return i;
        }
        return -1;
      })();

      // Play all messages except stopping rule; historical transcript had:
      // ... all messages up to lastMainIdx-1, user answer, then lastMain (tip)
      const until = lastMainIdx > -1 ? lastMainIdx : chMsgs.length; // messages before tip
      for (let i = 0; i < until; i++) {
        msgs.push(chMsgs[i]);
      }

      // Insert any recorded user answers for this chapter in order
      const answersForChapter = answers.filter((a) => a.chapter === ch);
      answersForChapter.forEach((a) => {
        msgs.push({
          type: 'user',
          content: a.text,
          timestamp: a.timestamp
            ? new Date(a.timestamp).toLocaleTimeString()
            : undefined,
        });
      });

      // Include the tip (last MAIN) if it existed
      if (lastMainIdx > -1 && includeFinishedChapters) {
        msgs.push(chMsgs[lastMainIdx]);
      }
    }

    // For current chapter (targetChapter), we rebuild up to the stopping point
    const chMsgs = course!.script[targetChapter]?.messages ?? [];
    const lastMainIdx = (() => {
      for (let i = chMsgs.length - 1; i >= 0; i--) {
        if (chMsgs[i].type === 'main') return i;
      }
      return -1;
    })();

    if (targetChapter < course!.script.length) {
      // Replay up to just before lastMain (so the app can pause for input)
      const until = lastMainIdx > -1 ? lastMainIdx : chMsgs.length;
      for (let i = 0; i < until; i++) {
        msgs.push(chMsgs[i]);
      }

      // If we already have a stored user answer for this current chapter (rare if mid-chapter),
      // show it as well and then push the tip if it existed (meaning chapter finished earlier).
      const answersForCurrent = answers.filter(
        (a) => a.chapter === targetChapter
      );
      answersForCurrent.forEach((a) => {
        msgs.push({
          type: 'user',
          content: a.text,
          timestamp: a.timestamp
            ? new Date(a.timestamp).toLocaleTimeString()
            : undefined,
        });
      });

      if (answersForCurrent.length > 0 && lastMainIdx > -1) {
        // If an answer existed, the chapter had concluded previously; include the tip
        msgs.push(chMsgs[lastMainIdx]);
      }
    }

    return { messages: msgs, chapterStartIndex: 0 };
  }

  // Resume handlers
  const startOver = () => {
    if (courseId) clearProgress(courseId);
    setShowResumeDialog(false);
    setResumeMode(null);
    resetToStart();
  };

  const continueFromProgress = () => {
    if (!courseId || !course) return;
    const p = getProgress(courseId);
    setShowResumeDialog(false);
    setResumeMode(null);

    if (!p) {
      resetToStart();
      return;
    }

    // Determine target chapter:
    // - If finished => start at last chapter ended but show full transcript
    // - If partial => resume from unlockedEpisode (which is "next to play")
    const total = course.script.length;
    const isFinished = p.finished;
    const targetChapter = Math.min(
      Math.max(0, isFinished ? total - 1 : p.unlockedEpisode), // if finished, point to last chapter to show; else next-to-play
      Math.max(0, total - 1)
    );

    // Rebuild transcript up to target point, including all user answers recorded
    const { messages } = buildTranscriptUpTo({
      targetChapter,
      includeFinishedChapters: true, // include tips for finished chapters
      answers: p.answers || [],
    });

    setDisplayedMessages(messages);

    // If finished: we won’t auto-advance — user can rewatch.
    // If partial and we stopped before last MAIN in targetChapter: set up to pause for input.
    if (!isFinished) {
      setChapter(targetChapter);
      // Determine where we are in the current chapter message flow:
      // If we already inserted an answer for targetChapter, then we had finished it previously.
      const hadAnswerForCurrent = (p.answers || []).some(
        (a) => a.chapter === targetChapter
      );
      if (hadAnswerForCurrent) {
        // Chapter completed previously — advance to next if exists, else stay
        if (typeof course.script[targetChapter + 1] !== 'undefined') {
          setChapter(targetChapter + 1);
          setCurrentMessageIndex(0);
          setAwaitingUserAnswer(false);
        } else {
          setCurrentMessageIndex(course.script[targetChapter].messages.length);
          setAwaitingUserAnswer(false);
        }
      } else {
        // We’re at the point before lastMain => ticker will pause at awaitingUserAnswer
        // Find the index we should start from (we replayed messages up to lastMain)
        const lastMainIdxCurrent = (() => {
          const m = course.script[targetChapter]?.messages ?? [];
          for (let i = m.length - 1; i >= 0; i--) {
            if (m[i].type === 'main') return i;
          }
          return -1;
        })();
        const startIdx =
          lastMainIdxCurrent > -1
            ? lastMainIdxCurrent
            : course.script[targetChapter]?.messages?.length ?? 0;
        setCurrentMessageIndex(startIdx);
        setAwaitingUserAnswer(true);
      }
    } else {
      // Finished: no auto-advance
      setChapter(total - 1);
      setCurrentMessageIndex(course.script[total - 1].messages.length);
      setAwaitingUserAnswer(false);
    }

    // Unpause after state is ready
    setIsPaused(false);
  };

  const rewatchFinishedChat = () => {
    // For rewatch, show full transcript from the beginning (messages + user answers + tips)
    if (!courseId || !course) return;
    const p = getProgress(courseId);
    setShowResumeDialog(false);
    setResumeMode(null);

    const answers = p?.answers || [];

    // Build a full transcript of ALL chapters
    const full: Message[] = [];
    for (let ch = 0; ch < course.script.length; ch++) {
      const chMsgs = course.script[ch]?.messages ?? [];
      const lastMainIdx = (() => {
        for (let i = chMsgs.length - 1; i >= 0; i--) {
          if (chMsgs[i].type === 'main') return i;
        }
        return -1;
      })();

      const until = lastMainIdx > -1 ? lastMainIdx : chMsgs.length;
      for (let i = 0; i < until; i++) {
        full.push(chMsgs[i]);
      }

      const answersForChapter = answers.filter((a) => a.chapter === ch);
      answersForChapter.forEach((a) => {
        full.push({
          type: 'user',
          content: a.text,
          timestamp: a.timestamp
            ? new Date(a.timestamp).toLocaleTimeString()
            : undefined,
        });
      });

      if (lastMainIdx > -1) {
        full.push(chMsgs[lastMainIdx]);
      }
    }

    setDisplayedMessages(full);
    setChapter(course.script.length - 1);
    setCurrentMessageIndex(
      course.script[course.script.length - 1].messages.length
    );
    setAwaitingUserAnswer(false);
    setIsPaused(false);
  };

  const renderResumeDialog = () => {
    if (!resumeMode) return null;

    if (resumeMode === 'complete') {
      return (
        <ConfirmDialog
          open={showResumeDialog}
          title="Du hast diesen Kurs bereits fertiggestellt."
          description="Möchtest du den Chatverlauf erneut ansehen oder neu starten?"
          primaryLabel="Nochmal ansehen"
          secondaryLabel="Neu starten"
          onPrimary={rewatchFinishedChat}
          onSecondary={startOver}
          onClose={() => {
            setShowResumeDialog(false);
            setIsPaused(false);
          }}
        />
      );
    }

    return (
      <ConfirmDialog
        open={showResumeDialog}
        title="Möchtest du fortfahren?"
        description="Es gibt einen gespeicherten Fortschritt. Fortfahren oder neu starten?"
        primaryLabel="Fortfahren"
        secondaryLabel="Neu starten"
        onPrimary={continueFromProgress}
        onSecondary={startOver}
        onClose={() => {
          setShowResumeDialog(false);
          setIsPaused(false);
        }}
      />
    );
  };

  return (
    <Layout backPath="/stories">
      {renderResumeDialog()}
      <div className="flex flex-col grow h-full w-full sm:items-center sm:justify-center sm:w-80 sm:p-4">
        <Phone
          inputPlaceholder="Deine Antwort…"
          onSubmitMessage={(message) => {
            if (!awaitingUserAnswer) return;

            // 1) Show user's answer in UI
            setDisplayedMessages((prev) => [
              ...prev,
              {
                type: 'user',
                content: message,
                timestamp: new Date().toLocaleTimeString(),
              },
            ]);

            // 1a) Persist answer immediately
            if (courseId) {
              pushAnswer(courseId, chapter, message);
            }

            // 2) Append the last MAIN of the chapter (tip), then complete chapter
            const lastMain =
              lastMainIndex !== -1
                ? allMessages[lastMainIndex]
                : allMessages[allMessages.length - 1];

            setTimeout(() => {
              setDisplayedMessages((prev) => [...prev, lastMain]);
              setAwaitingUserAnswer(false);

              // 2a) Mark chapter completion in progress store
              if (courseId && course) {
                const lastChapterIndex = course.script.length - 1;
                const isLast = chapter >= lastChapterIndex;
                markChapterCompleted(courseId, chapter, isLast);
              }

              // 3) Move to next chapter (or end)
              setTimeout(() => {
                if (typeof course.script[chapter + 1] !== 'undefined') {
                  setChapter((prev) => prev + 1);
                  setCurrentMessageIndex(0);
                } else {
                  // End, stop ticker naturally
                  setCurrentMessageIndex(allMessages.length);
                }
              }, 1000);
            }, 800);
          }}
        >
          {displayedMessages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </Phone>
      </div>
    </Layout>
  );
};

export default Story;
