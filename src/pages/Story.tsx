import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import Phone from '../components/Phone';
import courses from '../data/index';
import type { Message } from '../common/types';
import ChatMessage from '../components/ChatMessage';

const Story = () => {
  const { courseId } = useParams();
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [chapter, setChapter] = useState(0);

  const course = courses.find((c) => c.id === courseId);

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

    const timer = setTimeout(
      () => {
        const message = allMessages[currentMessageIndex];
        setDisplayedMessages((prev) => [...prev, message]);
        setCurrentMessageIndex((prev) => prev + 1);
      },
      currentMessageIndex === 0 ? 0 : Math.random() * 2000 + 1000
    );

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
