import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import Phone from '../components/Phone';
import courses from '../data/index';
import type { Message } from '../common/types';
import ChatMessage from '../components/ChatMessage';
import { useTranslation } from 'react-i18next';
import { AmyAI } from '../ai/amyAI';
import amyAvatar from '../assets/characters/amy.png';

import { buildAmyReply } from '../ai/amyReply';
import { decideAmyFlow } from '../ai/amyDecision';
import { detectQuestionType } from '../ai/amyQuestionType';
import { extractKeyIdea } from '../ai/extractKeyIdea';
import { getAnswerTipRelation } from '../ai/answerRelation';

// Progress store
import {
  getProgress,
  clearProgress,
  pushAnswer,
  markChapterCompleted,
} from '../common/utils';

import ConfirmDialog from '../components/ConfirmDialog';

// ----------------------
// Reading Mode (Produkt-Feature)
// ----------------------
type ReadingMode = 'cinematic' | 'instant';
const READING_MODE_KEY = 'aym_reading_mode';

const Story = () => {
  const AMY_SPEAKER = { name: 'Amy', avatar: amyAvatar };

  // -------------------------------
  // Routing / Course
  // -------------------------------
  const { courseId } = useParams();
  const location = useLocation();

  // ---------- Lesetempo ----------
  const urlSpeed = Number(new URLSearchParams(location.search).get('speed'));
  const initialSpeedMultiplier =
    Number.isFinite(urlSpeed) && urlSpeed > 0 ? urlSpeed : 1.4;
  const [speedMultiplier, setSpeedMultiplier] = useState(initialSpeedMultiplier);

  const speedOptions = [
    { value: 0.9, label: 'Schnell' },
    { value: 1.4, label: 'Normal' },
    { value: 1.8, label: 'Langsam' },
  ];

  // ---------- Reading Mode ----------
  const [readingMode, setReadingMode] = useState<ReadingMode>(() => {
    const saved = localStorage.getItem(READING_MODE_KEY);
    return saved === 'instant' || saved === 'cinematic' ? saved : 'cinematic';
  });

  useEffect(() => {
    localStorage.setItem(READING_MODE_KEY, readingMode);
  }, [readingMode]);

  const isInstant = readingMode === 'instant';

  // Timing-Konstanten
  const MIN_DELAY_MS = 1100;
  const MAX_DELAY_MS = 9000;
  const CHARS_PER_SECOND = 12;
  const BASE_OVERHEAD_MS = 350;
  const IMAGE_EXTRA_MS = 700;
  const JITTER_MIN = 0.9;
  const JITTER_MAX = 1.3;

  const calcDelayForText = (text: string, hasImage = false) => {
    if (isInstant) return 0; // ✅ Sofort-Modus: keine Delays

    const readingMs =
      BASE_OVERHEAD_MS +
      (text.length / CHARS_PER_SECOND) * 1000 +
      (hasImage ? IMAGE_EXTRA_MS : 0);

    const clamped = Math.min(MAX_DELAY_MS, Math.max(MIN_DELAY_MS, readingMs));
    return clamped * speedMultiplier;
  };

  // -------------------------------
  // State
  // -------------------------------
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [chapter, setChapter] = useState(0);
  const [awaitingUserAnswer, setAwaitingUserAnswer] = useState(false);

  // ✅ attemptCount pro Frage (Startwert 1)
  const [attemptByQuestion, setAttemptByQuestion] = useState<Record<string, number>>({});

  // ✅ blockiert Story-Ticker & user send während Amy “spricht”
  const [amyIsSpeaking, setAmyIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [resumeMode, setResumeMode] = useState<'partial' | 'complete' | null>(null);

  const { i18n } = useTranslation();
  const courseLanguage = i18n.language.split('-')[0];
  const course = courses[courseLanguage as 'de' | 'en'].find((c) => c.id === courseId);

  const allMessages = useMemo(
    () => course?.script[chapter]?.messages || [],
    [course, chapter]
  );

  const lastMainIndex = useMemo(() => {
    if (!allMessages.length) return -1;
    for (let i = allMessages.length - 1; i >= 0; i--) {
      if (allMessages[i].type === 'main') return i;
    }
    return -1;
  }, [allMessages]);

  const amyAI = useMemo(() => new AmyAI(), []);

  const shellRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  // -------------------------------
  // attempt helpers
  // -------------------------------
  function makeQuestionKey(cId: string | undefined, ch: number, lm: number) {
    return `${cId ?? 'no-course'}::ch${ch}::q${lm}`;
  }
  function getAttempt(questionKey: string) {
    return attemptByQuestion[questionKey] ?? 1; // ✅ Startwert 1
  }
  function incAttempt(questionKey: string) {
    setAttemptByQuestion((prev) => ({
      ...prev,
      [questionKey]: (prev[questionKey] ?? 1) + 1,
    }));
  }
  function resetAttempt(questionKey: string) {
    setAttemptByQuestion((prev) => {
      if (!(questionKey in prev)) return prev;
      const copy = { ...prev };
      delete copy[questionKey];
      return copy;
    });
  }

  // -------------------------------
  // Helper: Frage & Tipp sauber trennen
  // -------------------------------
  function normalizeText(v: unknown): string {
    return String(v ?? '').trim();
  }

  function looksLikeQuestion(text: string): boolean {
    const t = text.trim();
    if (!t) return false;
    if (t.includes('?')) return true;

    const starters = [
      'was','warum','wie','wieso','wann','wer','wo','welche','welcher','welches',
      'würdest du','wie würdest du','was würdest du','was machst du','wie reagierst du',
      'stell dir vor','denk mal','meinst du',
    ];
    const low = t.toLowerCase();
    return starters.some((s) => low.startsWith(s));
  }

  function getTipText(msgs: any[], lm: number): string {
    if (!msgs?.length) return '';
    if (lm < 0) return '';
    return normalizeText(msgs[lm]?.content);
  }

  function getQuestionText(msgs: any[], lm: number): string {
    if (!msgs?.length) return '';
    const start = lm > 0 ? lm - 1 : msgs.length - 1;

    for (let i = start; i >= 0; i--) {
      const m = msgs[i];
      if (m?.type !== 'main') continue;
      const text = normalizeText(m?.content);
      if (looksLikeQuestion(text)) return text;
    }
    for (let i = start; i >= 0; i--) {
      const m = msgs[i];
      if (m?.type !== 'main') continue;
      const text = normalizeText(m?.content);
      if (text) return text;
    }
    return '';
  }

  // Emoji helpers
  const extractEmojis = (s: string) =>
    (s.match(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/gu) as string[]) || [];

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

  // -------------------------------
  // Resume / Reset
  // -------------------------------
  useEffect(() => {
    if (!course || !courseId) return;

    const p = getProgress(courseId);
    if (p) {
      const totalChapters = course.script.length || 1;
      const pct = p.finished ? 100 : Math.floor((p.unlockedEpisode / totalChapters) * 100);

      if (pct >= 100) {
        setResumeMode('complete');
        setShowResumeDialog(true);
        setIsPaused(true);
      } else if (pct > 0) {
        setResumeMode('partial');
        setShowResumeDialog(true);
        setIsPaused(true);
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
    setIsPaused(false);
    setAmyIsSpeaking(false);
    setAttemptByQuestion({});
    appendedChaptersRef.current = {};
  }

  // -------------------------------
  // ✅ Sofort-Modus: Kapitelblock anhängen (niemals überschreiben!)
  // -------------------------------
  const appendedChaptersRef = useRef<Record<number, boolean>>({});

  useEffect(() => {
    if (!isInstant) return;
    if (isPaused || amyIsSpeaking) return;
    if (!course || allMessages.length === 0) return;

    if (appendedChaptersRef.current[chapter]) return;

    const stopIndex = lastMainIndex !== -1 ? lastMainIndex : allMessages.length;
    const chunk = allMessages.slice(0, stopIndex) as Message[];

    setDisplayedMessages((prev) => (prev.length === 0 ? chunk : [...prev, ...chunk]));
    setCurrentMessageIndex(stopIndex);
    setAwaitingUserAnswer(true);

    appendedChaptersRef.current[chapter] = true;
  }, [isInstant, chapter, course, allMessages, lastMainIndex, isPaused, amyIsSpeaking]);

  // -------------------------------
  // Cinematic ticker (nur wenn NICHT instant)
  // -------------------------------
  useEffect(() => {
    if (isInstant) return;
    if (isPaused || amyIsSpeaking) return;
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
      const jitter = JITTER_MIN + Math.random() * (JITTER_MAX - JITTER_MIN);

      const content = typeof msg.content === 'string' ? msg.content : '';
      const base = calcDelayForText(content, !!msg.image);
      return base * jitter;
    };

    const delay = getDelayForMessage(nextMsg, currentMessageIndex);

    const timer = setTimeout(() => {
      if (isReactionOnlyMessage(nextMsg)) {
        setDisplayedMessages((prev) => {
          if (prev.length === 0) return [...prev, nextMsg];
          const last = { ...prev[prev.length - 1] };
          const merged = [...(last.reactions || [])];

          if (Array.isArray(nextMsg.reactions) && nextMsg.reactions.length > 0) {
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
  }, [
    isInstant,
    isPaused,
    amyIsSpeaking,
    currentMessageIndex,
    allMessages,
    course,
    lastMainIndex,
    speedMultiplier,
  ]);

  // ✅ Auto-scroll zum Ende nur im cinematic Modus
  useEffect(() => {
    if (isInstant) return;
    if (awaitingUserAnswer && endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [awaitingUserAnswer, isInstant]);

  if (!course) {
    return (
      <Layout backPath="/stories" hideFooter>
        <div className="w-full max-w-4xl px-4 py-12">
          <h2 className="text-3xl font-bold mb-8 text-[#0084ff]">Kurs nicht gefunden</h2>
          <p>Der angeforderte Kurs konnte nicht gefunden werden.</p>
        </div>
      </Layout>
    );
  }

  // -------------------------------
  // Transcript for resume (unverändert)
  // -------------------------------
  function buildTranscriptUpTo({
    targetChapter,
    includeFinishedChapters,
    answers,
  }: {
    targetChapter: number;
    includeFinishedChapters: boolean;
    answers: { chapter: number; text: string; timestamp?: string }[];
  }): { messages: Message[]; chapterStartIndex: number } {
    const msgs: Message[] = [];

    for (let ch = 0; ch < targetChapter; ch++) {
      const chMsgs = course!.script[ch]?.messages ?? [];
      const lastMainIdx = (() => {
        for (let i = chMsgs.length - 1; i >= 0; i--) {
          if (chMsgs[i].type === 'main') return i;
        }
        return -1;
      })();

      const until = lastMainIdx > -1 ? lastMainIdx : chMsgs.length;
      for (let i = 0; i < until; i++) msgs.push(chMsgs[i]);

      const answersForChapter = answers.filter((a) => a.chapter === ch);
      answersForChapter.forEach((a) => {
        msgs.push({
          type: 'user',
          content: a.text,
          timestamp: a.timestamp ? new Date(a.timestamp).toLocaleTimeString() : undefined,
        });
      });

      if (lastMainIdx > -1 && includeFinishedChapters) {
        msgs.push(chMsgs[lastMainIdx]);
      }
    }

    const chMsgs = course!.script[targetChapter]?.messages ?? [];
    const lastMainIdx = (() => {
      for (let i = chMsgs.length - 1; i >= 0; i--) {
        if (chMsgs[i].type === 'main') return i;
      }
      return -1;
    })();

    if (targetChapter < course!.script.length) {
      const until = lastMainIdx > -1 ? lastMainIdx : chMsgs.length;
      for (let i = 0; i < until; i++) msgs.push(chMsgs[i]);

      const answersForCurrent = answers.filter((a) => a.chapter === targetChapter);
      answersForCurrent.forEach((a) => {
        msgs.push({
          type: 'user',
          content: a.text,
          timestamp: a.timestamp ? new Date(a.timestamp).toLocaleTimeString() : undefined,
        });
      });

      if (answersForCurrent.length > 0 && lastMainIdx > -1) {
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

    const total = course.script.length;
    const isFinished = p.finished;
    const targetChapter = Math.min(
      Math.max(0, isFinished ? total - 1 : p.unlockedEpisode),
      Math.max(0, total - 1)
    );

    const { messages } = buildTranscriptUpTo({
      targetChapter,
      includeFinishedChapters: true,
      answers: p.answers || [],
    });

    setDisplayedMessages(messages);

    if (!isFinished) {
      setChapter(targetChapter);
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
    } else {
      setChapter(total - 1);
      setCurrentMessageIndex(course.script[total - 1].messages.length);
      setAwaitingUserAnswer(false);
    }

    setIsPaused(false);
    setAmyIsSpeaking(false);
  };

  const rewatchFinishedChat = () => {
    if (!courseId || !course) return;
    const p = getProgress(courseId);
    setShowResumeDialog(false);
    setResumeMode(null);

    const answers = p?.answers || [];
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
      for (let i = 0; i < until; i++) full.push(chMsgs[i]);

      const answersForChapter = answers.filter((a) => a.chapter === ch);
      answersForChapter.forEach((a) => {
        full.push({
          type: 'user',
          content: a.text,
          timestamp: a.timestamp ? new Date(a.timestamp).toLocaleTimeString() : undefined,
        });
      });

      if (lastMainIdx > -1) full.push(chMsgs[lastMainIdx]);
    }

    setDisplayedMessages(full);
    setChapter(course.script.length - 1);
    setCurrentMessageIndex(course.script[course.script.length - 1].messages.length);
    setAwaitingUserAnswer(false);
    setIsPaused(false);
    setAmyIsSpeaking(false);
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
            setAmyIsSpeaking(false);
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
          setAmyIsSpeaking(false);
        }}
      />
    );
  };

  return (
    <Layout backPath="/stories">
      <style>{`
        .ios-anti-zoom {
          -webkit-text-size-adjust: 100%;
        }
        .ios-anti-zoom input,
        .ios-anti-zoom textarea,
        .ios-anti-zoom select,
        .ios-anti-zoom button {
          font-size: 16px !important;
          line-height: 1.4;
        }
      `}</style>

      {renderResumeDialog()}

      <div
        ref={shellRef}
        className="ios-anti-zoom flex flex-col grow h-full w-full sm:items-center sm:justify-center sm:w-80 sm:p-4"
      >
        <Phone
          // ✅ Instant: kein Auto-Scroll (bleib exakt an deiner Stelle)
          autoScroll={!isInstant}
          inputPlaceholder="Deine Antwort…"
  onSubmitMessage={async (message) => {
  if (!awaitingUserAnswer || amyIsSpeaking) return;

  const trimmed = (message ?? '').trim();
  if (!trimmed) return;

  // ✅ pro Frage eindeutiger Key + attemptCount
  const questionKey = makeQuestionKey(courseId, chapter, lastMainIndex);
  const attemptCount = getAttempt(questionKey);

  // ✅ Tipp & Frage zuerst bestimmen (damit questionType verfügbar ist)
  const tipText = getTipText(allMessages as any[], lastMainIndex);
  const questionText = getQuestionText(allMessages as any[], lastMainIndex);

  // ✅ Frage-Typ bestimmen (vor der Klassifikation!)
  const questionType = detectQuestionType({
    questionText,
    tipText,
  });

  // ✅ Relation Antwort ↔ Tipp
  const relation = getAnswerTipRelation(trimmed, tipText);

  // 1) Klassifikation (jetzt mit Kontext)
  let label: 'A' | 'B' | 'C' | 'UNSICHER' = 'C';
  try {
    label = await amyAI.classifyAnswer(trimmed, { questionType });
  } catch (e) {
    console.error('AmyAI classify failed', e);
  }

  // 2) User-Nachricht anzeigen (IMMER sichtbar lassen)
  setDisplayedMessages((prev) => [
    ...prev,
    {
      type: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  // 3) Entscheidung
  const decision = decideAmyFlow({
    label,
    attemptCount,
    questionType,
  });

  // 4) Kernaussage extrahieren (lokal/offline)
  const keyIdea = await extractKeyIdea(tipText, { useML: true });

  // 5) Amy-Antwort bauen
  const amyText = buildAmyReply(decision, tipText, keyIdea, relation);

  setAmyIsSpeaking(true);

  setDisplayedMessages((prev) => [
    ...prev,
    {
      type: 'main',
      speaker: AMY_SPEAKER,
      content: amyText,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const amyDelay = calcDelayForText(amyText);

  // 6) Nach Amy-Antwort entscheiden
  setTimeout(() => {
    setAmyIsSpeaking(false);

    if (decision.action === 'RETRY') {
      incAttempt(questionKey);
      return;
    }

    // ✅ UNLOCK
    resetAttempt(questionKey);

    if (courseId) {
      pushAnswer(courseId, chapter, trimmed);
    }

    const lastMain =
      lastMainIndex !== -1
        ? allMessages[lastMainIndex]
        : allMessages[allMessages.length - 1];

    setDisplayedMessages((prev) => [...prev, lastMain]);
    setAwaitingUserAnswer(false);

    if (courseId && course) {
      const lastChapterIndex = course.script.length - 1;
      markChapterCompleted(courseId, chapter, chapter >= lastChapterIndex);
    }

    setTimeout(() => {
      if (typeof course.script[chapter + 1] !== 'undefined') {
        setChapter((prev) => prev + 1);
        setCurrentMessageIndex(0);
      } else {
        setCurrentMessageIndex(allMessages.length);
      }
    }, 600);
  }, amyDelay);
}}

        >
          {/* Anzeige-Modus (Produkt-Feature) */}
          <div className="w-full text-center my-2 flex flex-col items-center gap-2">
            <div className="text-xs text-gray-600">Anzeige-Modus:</div>
            <div className="flex gap-4 items-center">
              <label className="text-xs text-gray-700 flex items-center gap-2">
                <input
                  type="radio"
                  name="readingMode"
                  checked={readingMode === 'cinematic'}
                  onChange={() => setReadingMode('cinematic')}
                />
                Live-Chat
              </label>
              <label className="text-xs text-gray-700 flex items-center gap-2">
                <input
                  type="radio"
                  name="readingMode"
                  checked={readingMode === 'instant'}
                  onChange={() => setReadingMode('instant')}
                />
                Sofort anzeigen
              </label>
            </div>
          </div>

          {/* Lesegeschwindigkeit (nur sinnvoll im Live-Chat) */}
          {readingMode === 'cinematic' && (
            <div className="w-full text-center my-4 flex flex-col items-center">
              <span className="text-gray-600 text-xs mb-1">Lesegeschwindigkeit wählen:</span>
              <div className="flex gap-3">
                {speedOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSpeedMultiplier(opt.value)}
                    className={[
                      'text-xs underline-offset-2',
                      speedMultiplier === opt.value
                        ? 'font-semibold underline'
                        : 'text-gray-500 hover:text-gray-700',
                    ].join(' ')}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {displayedMessages.map((m, idx) => (
            <ChatMessage key={idx} message={m} />
          ))}

          <div ref={endRef} />
        </Phone>
      </div>
    </Layout>
  );
};

export default Story;
