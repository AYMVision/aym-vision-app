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

  const { i18n } = useTranslation();
  const courseLanguage = i18n.language.split('-')[0];

  const course = courses[courseLanguage as 'de' | 'en'].find(
    (c) => c.id === courseId
  );

  const allMessages = useMemo(
    () => course?.script[chapter]?.messages || [],
    [course, chapter]
  );

  // Beim Kurswechsel zurücksetzen (nicht beim Kapitelwechsel!)
  useEffect(() => {
    if (!course || allMessages.length === 0) return;
    setDisplayedMessages([]);
    setCurrentMessageIndex(0);
    setChapter(0);
  }, [courseId]); // nur wenn ein anderer Kurs geladen wird

  // --- Emoji-Helpers ---
  const extractEmojis = (s: string) =>
    (s.match(
      /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/gu
    ) as string[]) || [];

  const isReactionOnlyMessage = (m: Message) => {
    // 1) Explizite Reaktionen im Feld reactions
    if (Array.isArray(m.reactions) && m.reactions.length > 0) return true;

    // 2) Inhalt besteht "im Wesentlichen" aus Emojis (keine Buchstaben/Ziffern, kurz)
    const c = (m.content || '').trim();
    if (!c) return false;
    const hasEmoji = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(c);
    const hasLettersOrDigits = /[A-Za-zÄÖÜäöüẞ0-9]/.test(c);
    const tooLong = c.length > 6; // kurze Reaktions-Snippets erlauben
    return hasEmoji && !hasLettersOrDigits && !tooLong;
  };

  // Nachrichtenticker (appendet neue Messages; mappt Reaktions-only an die letzte Bubble)
  useEffect(() => {
    if (!course || allMessages.length === 0) return;
    if (currentMessageIndex >= allMessages.length) return;

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
      const contentLen = content.length;
      const readingMs =
        contentLen > 0 ? (contentLen / charsPerSecond) * 1000 : 900;

      const raw = baseOverheadMs + readingMs + imageExtraMs;
      const clamped = Math.min(maxDelayMs, Math.max(minDelayMs, raw));
      return clamped * jitter;
    };

    const delay = getDelayForMessage(nextMsg, currentMessageIndex);

    const timer = setTimeout(() => {
      if (isReactionOnlyMessage(nextMsg)) {
        // Reaktion an die letzte sichtbare Bubble anhängen (statt eigene Bubble)
        setDisplayedMessages((prev) => {
          if (prev.length === 0) {
            // Falls keine vorherige Nachricht existiert, zur Not als eigene Message anhängen
            return [...prev, nextMsg];
          }
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
  }, [currentMessageIndex, allMessages, course]);

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
            // Eingaben nur zulassen, wenn der aktuelle Auto-Dialog fertig ist
            if (currentMessageIndex < allMessages.length) return;

            // Nutzerantwort IMMER anhängen (sichtbar lassen)
            setDisplayedMessages((prev) => [
              ...prev,
              {
                type: 'user',
                content: message,
                timestamp: new Date().toLocaleTimeString(),
              },
            ]);

            // Nächstes Kapitel starten – Historie NICHT löschen
            if (typeof course.script[chapter + 1] !== 'undefined') {
              setChapter((prev) => prev + 1);
              setCurrentMessageIndex(0);
            }
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
