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
    () => course?.script[chapter].messages || [],
    [course, chapter]
  );

  useEffect(() => {
    if (!course || allMessages.length === 0) return;

    setDisplayedMessages([]);
    setCurrentMessageIndex(0);
  }, [courseId]);

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
      setDisplayedMessages((prev) => [...prev, nextMsg]);
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
            if (currentMessageIndex < allMessages.length) {
              return;
            }

            if (typeof course.script[chapter + 1] !== 'undefined') {
              setChapter((prev) => prev + 1);
              setDisplayedMessages([]);
              setCurrentMessageIndex(0);
            } else {
              setDisplayedMessages((prev) => [
                ...prev,
                {
                  type: 'user',
                  content: message,
                  timestamp: new Date().toLocaleTimeString(),
                },
              ]);
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
