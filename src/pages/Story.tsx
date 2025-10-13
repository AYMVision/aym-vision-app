import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import Phone from '../components/Phone';
import courses from '../data/index';
import type { Message } from '../common/types';
import ChatMessage from '../components/ChatMessage';
import { useTranslation } from 'react-i18next';

const Story = () => {
  const { courseId } = useParams();
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [chapter, setChapter] = useState(0);
  const [awaitingUserAnswer, setAwaitingUserAnswer] = useState(false);

  const { i18n } = useTranslation();
  const courseLanguage = i18n.language.split('-')[0];

  const course = courses[courseLanguage as 'de' | 'en'].find(
    (c) => c.id === courseId
  );

  const allMessages = useMemo(
    () => course?.script[chapter]?.messages || [],
    [course, chapter]
  );

  // Index der letzten MAIN-Nachricht (z. B. Amys Tipp)
  const lastMainIndex = useMemo(() => {
    if (!allMessages.length) return -1;
    for (let i = allMessages.length - 1; i >= 0; i--) {
      const m = allMessages[i];
      if (m.type === 'main') {
        // Optional enger machen: nur Amy als letzte main
        // if (m.speaker?.name === 'Amy') return i;
        return i;
      }
    }
    return -1;
  }, [allMessages]);

  // Beim Kurswechsel zurücksetzen (nicht beim Kapitelwechsel!)
  useEffect(() => {
    if (!course || allMessages.length === 0) return;
    setDisplayedMessages([]);
    setCurrentMessageIndex(0);
    setChapter(0);
    setAwaitingUserAnswer(false);
  }, [courseId]);

  // --- Emoji-Helpers ---
  const extractEmojis = (s: string) =>
    (s.match(
      /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/gu
    ) as string[]) || [];

  // Eine Message ist nur dann "reaction-only", wenn:
  // 1) kein Text aber reactions ODER
  // 2) kurzer Emoji-only Text (<=6 Zeichen, keine Buchstaben/Ziffern)
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

  // Nachrichtenticker
  useEffect(() => {
    if (!course || allMessages.length === 0) return;
    if (currentMessageIndex >= allMessages.length) return;

    // Stoppe VOR der allerletzten MAIN-Nachricht (Amys Tipp).
    // D. h. wenn der nächste Index genau der letzte MAIN ist, warten wir auf die User-Antwort.
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
        // Reaktionen an die letzte sichtbare Bubble hängen
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
        // Normale Nachricht anhängen
        setDisplayedMessages((prev) => [...prev, nextMsg]);
      }

      setCurrentMessageIndex((prev) => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [currentMessageIndex, allMessages, course, lastMainIndex]);

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

  return (
    <Layout backPath="/stories">
      <div className="flex flex-col grow h-full w-full sm:items-center sm:justify-center sm:w-80 sm:p-4">
        <Phone
          inputPlaceholder="Deine Antwort…"
          onSubmitMessage={(message) => {
            // Nur reagieren, wenn wir gerade auf die Antwort warten
            if (!awaitingUserAnswer) return;

            // 1) Nutzerantwort sichtbar anhängen
            setDisplayedMessages((prev) => [
              ...prev,
              {
                type: 'user',
                content: message,
                timestamp: new Date().toLocaleTimeString(),
              },
            ]);

            // 2) Danach die WIRKLICH letzte MAIN-Nachricht des Kapitels anhängen (Amys Tipp)
            const lastMain =
              lastMainIndex !== -1
                ? allMessages[lastMainIndex]
                : allMessages[allMessages.length - 1];

            setTimeout(() => {
              setDisplayedMessages((prev) => [...prev, lastMain]);
              setAwaitingUserAnswer(false);

              // 3) Danach ins nächste Kapitel wechseln
              setTimeout(() => {
                if (typeof course.script[chapter + 1] !== 'undefined') {
                  setChapter((prev) => prev + 1);
                  setCurrentMessageIndex(0);
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
