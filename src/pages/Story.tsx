import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
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
  const location = useLocation();

  // ---------- Lesetempo ----------
  const urlSpeed = Number(new URLSearchParams(location.search).get('speed'));
  const initialSpeed =
    Number.isFinite(urlSpeed) && urlSpeed > 0 ? urlSpeed : 1.4;

  const [speedMultiplier, setSpeedMultiplier] = useState(initialSpeed);

  const speedOptions = [
    { value: 0.9, label: 'Schnell' },
    { value: 1.4, label: 'Normal' },
    { value: 1.8, label: 'Langsam' },
  ];

  // ---------- Story States ----------
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [chapter, setChapter] = useState(0);
  const [awaitingUserAnswer, setAwaitingUserAnswer] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
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
      if (allMessages[i].type === 'main') return i;
    }
    return -1;
  }, [allMessages]);

  const endRef = useRef<HTMLDivElement | null>(null);

  // ---------- Story Restore ----------
  useEffect(() => {
    if (!course || !courseId) return;
    const p = getProgress(courseId);
    if (!p) {
      resetToStart();
      return;
    }

    const total = course.script.length;
    const pct = p.finished
      ? 100
      : Math.floor((p.unlockedEpisode / total) * 100);

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
  }, [course, courseId]);

  function resetToStart() {
    setDisplayedMessages([]);
    setCurrentMessageIndex(0);
    setChapter(0);
    setAwaitingUserAnswer(false);
    setIsPaused(false);
  }

  // ---------- Story Auto-Play ----------
  const MIN_DELAY_MS = 1100;
  const MAX_DELAY_MS = 9000;
  const CHARS_PER_SECOND = 12;
  const BASE_OVERHEAD_MS = 350;
  const IMAGE_EXTRA_MS = 700;
  const JITTER_MIN = 0.9;
  const JITTER_MAX = 1.3;

  const isReactionOnlyMessage = (msg: Message) => {
    const c = msg.content?.trim() || '';
    const hasReactions =
      Array.isArray(msg.reactions) && msg.reactions.length > 0;

    if (c.length === 0 && hasReactions) return true;
    const emojiOnly =
      /[\p{Extended_Pictographic}]/u.test(c) && !/[A-Za-z0-9]/.test(c);
    return emojiOnly && c.length <= 6;
  };

  useEffect(() => {
    if (isPaused) return;
    if (!course || allMessages.length === 0) return;
    if (currentMessageIndex >= allMessages.length) return;

    // Stop before last MAIN until user answers
    if (lastMainIndex !== -1 && currentMessageIndex === lastMainIndex) {
      setAwaitingUserAnswer(true);
      return;
    }

    const msg = allMessages[currentMessageIndex];

    const delay = (() => {
      const jitter = JITTER_MIN + Math.random() * (JITTER_MAX - JITTER_MIN);
      const text = typeof msg.content === 'string' ? msg.content : '';
      const readingMs =
        text.length > 0 ? (text.length / CHARS_PER_SECOND) * 1000 : 900;

      const base =
        BASE_OVERHEAD_MS + readingMs + (msg.image ? IMAGE_EXTRA_MS : 0);
      const bounded = Math.min(MAX_DELAY_MS, Math.max(MIN_DELAY_MS, base));
      return bounded * jitter * speedMultiplier;
    })();

    const t = setTimeout(() => {
      // Reaction merging
      if (isReactionOnlyMessage(msg)) {
        setDisplayedMessages((prev) => {
          if (prev.length === 0) return [...prev, msg];
          const last = { ...prev[prev.length - 1] };
          last.reactions = [
            ...(last.reactions || []),
            ...(msg.reactions || []),
          ];
          return [...prev.slice(0, -1), last];
        });
      } else {
        setDisplayedMessages((prev) => [...prev, msg]);
      }

      setCurrentMessageIndex((v) => v + 1);
    }, delay);

    return () => clearTimeout(t);
  }, [
    isPaused,
    currentMessageIndex,
    allMessages,
    speedMultiplier,
    lastMainIndex,
    course,
  ]);

  // ---------- Scroll only when awaiting answer ----------
  useEffect(() => {
    if (awaitingUserAnswer && endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [awaitingUserAnswer]);

  // ---------- Resume dialog ----------
  const renderResumeDialog = () => {
    if (!resumeMode) return null;

    return (
      <ConfirmDialog
        open={showResumeDialog}
        title={
          resumeMode === 'complete'
            ? 'Du hast diesen Kurs bereits fertiggestellt.'
            : 'Möchtest du fortfahren?'
        }
        description={
          resumeMode === 'complete'
            ? 'Möchtest du den Chatverlauf erneut ansehen oder neu starten?'
            : 'Es gibt einen gespeicherten Fortschritt.'
        }
        primaryLabel={
          resumeMode === 'complete' ? 'Nochmal ansehen' : 'Fortfahren'
        }
        secondaryLabel="Neu starten"
        onPrimary={() => {
          setShowResumeDialog(false);
          setIsPaused(false);
        }}
        onSecondary={() => {
          if (courseId) clearProgress(courseId);
          resetToStart();
          setShowResumeDialog(false);
          setIsPaused(false);
        }}
        onClose={() => {
          setShowResumeDialog(false);
          setIsPaused(false);
        }}
      />
    );
  };

  if (!course)
    return (
      <Layout backPath="/stories">
        <p>Kurs nicht gefunden</p>
      </Layout>
    );

  return (
    <Layout backPath="/stories">
      {renderResumeDialog()}

      <div className="flex flex-col grow h-full w-full sm:items-center sm:justify-center sm:w-80 sm:p-4">
        <Phone
          inputPlaceholder="Deine Antwort…"
          onSubmitMessage={(message) => {
            if (!awaitingUserAnswer) return;

            setDisplayedMessages((prev) => [
              ...prev,
              {
                type: 'user',
                content: message,
                timestamp: new Date().toLocaleTimeString(),
              },
            ]);

            if (courseId) {
              pushAnswer(courseId, chapter, message);
            }

            const lastMain =
              lastMainIndex !== -1
                ? allMessages[lastMainIndex]
                : allMessages[allMessages.length - 1];

            setTimeout(() => {
              setDisplayedMessages((prev) => [...prev, lastMain]);
              setAwaitingUserAnswer(false);

              if (courseId && course) {
                const isLast = chapter >= course.script.length - 1;
                markChapterCompleted(courseId, chapter, isLast);
              }

              setTimeout(() => {
                if (typeof course.script[chapter + 1] !== 'undefined') {
                  setChapter((v) => v + 1);
                  setCurrentMessageIndex(0);
                } else {
                  setCurrentMessageIndex(allMessages.length);
                }
              }, 800);
            }, 800);
          }}
        >
          {/* 👉 MINIMALISTISCHE GESCHWINDIGKEIT-AUSWAHL IM CHAT, ZENTRIERT */}
          <div className="w-full text-center my-4 flex flex-col items-center">
            <span className="text-gray-600 text-xs mb-1">
              Lesegeschwindigkeit wählen:
            </span>

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
          {/* Ende Speed-Auswahl */}

          {/* Chat-Nachrichten */}
          {displayedMessages.map((msg, i) => (
            <ChatMessage key={i} message={msg} />
          ))}

          <div ref={endRef} />
        </Phone>
      </div>
    </Layout>
  );
};

export default Story;
