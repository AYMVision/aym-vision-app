import { useParams, useNavigate } from 'react-router-dom';
import * as React from 'react';
import { ArrowLeft } from 'lucide-react';
import Layout from '../components/Layout';
import { courses } from '../data/courses';
import { getProgress, resetProgress, setProgress } from '../common/utils';
import type { Bubble } from '../common/types';
import amy from '../assets/amy.png';
import lisa from '../assets/lisa.png';
import fabian from '../assets/fabian.png';
import chioma from '../assets/chioma.png';
import coolguy24 from '../assets/coolguy24.png';
import carlos from '../assets/carlos.png';

const ProgressDialog: React.FC<{
  onContinue: () => void;
  onReset: () => void;
}> = ({ onContinue, onReset }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
      <div className="flex flex-col gap-2 mb-4">
        <h2 className="text-lg font-bold">Weiter chatten?</h2>
        <p className="text-gray-700">
          Du hast diesen Kurs schon mal besucht. Möchtest du beim letzten Stand
          weitermachen oder von vorne beginnen?
        </p>
      </div>
      <div className="flex justify-end gap-2">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={onContinue}
        >
          Weitermachen
        </button>
        <button
          className="border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition"
          onClick={onReset}
        >
          Von vorne beginnen
        </button>
      </div>
    </div>
  </div>
);

const ChatHeader: React.FC<{ title: string }> = ({ title }) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between px-3 bg-[#0084ff] text-white h-[54px]">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center mr-2 group"
        aria-label="Zurück"
      >
        <ArrowLeft className="w-7 h-7 group-hover:scale-110 transition" />
      </button>
      <span className="mx-auto text-lg font-bold">{title}</span>
      <img
        src="https://api.dicebear.com/7.x/thumbs/svg?seed=Lisa"
        alt="Lisa"
        className="rounded-full w-9 h-9 object-cover border-2 border-white"
      />
    </div>
  );
};

function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (answer: string) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = React.useState('');
  return (
    <form
      className="flex items-center px-4 py-4 bg-white w-full"
      style={{
        boxSizing: 'border-box',
        minHeight: 68,
      }}
      onSubmit={(e) => {
        e.preventDefault();
        if (!value.trim()) return;
        onSend(value.trim());
        setValue('');
      }}
    >
      <input
        className="flex-1 px-4 py-2 rounded-full border bg-gray-50 outline-none"
        placeholder="Deine Antwort…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        autoFocus
      />
      <button
        type="submit"
        className="bg-[#0084ff] text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition disabled:opacity-60"
        disabled={disabled}
        style={{
          marginRight: 0,
        }}
      >
        Senden
      </button>
    </form>
  );
}

const generatedAvatars: Record<string, string> = {
  Lisa: lisa,
  Chioma: chioma,
  Carlos: carlos,
  Amy: amy,
  coolguy24: coolguy24,
  Fabian: fabian,
};

function getAvatar(speaker: string) {
  return generatedAvatars[speaker];
}

function ChatEpisode({
  bubbles,
  userAnswers,
  renderInput,
  canAnswer,
  onUserAnswer,
  typing = false,
}: {
  bubbles: Bubble[];
  userAnswers: string[];
  renderInput: (
    onSend: (answer: string) => void,
    disabled: boolean
  ) => React.ReactNode;
  canAnswer: boolean;
  onUserAnswer: (answer: string) => void;
  typing?: boolean;
}) {
  const chatRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [bubbles, userAnswers, typing]);

  return (
    <div
      ref={chatRef}
      className="flex-1 pt-2 flex flex-col gap-3 overflow-y-auto bg-[#e5ddd5]"
    >
      {bubbles.map((bubble, idx) => {
        const isUser =
          bubble.type === 'user' || (bubble.isQuestion && userAnswers[idx]);
        return (
          <div
            key={idx}
            className={`relative max-w-[80%] shadow-md px-5 pt-3 pb-6 rounded-xl mb-3
              ${
                bubble.type === 'main'
                  ? 'bg-[#C7F2D8] self-end mr-5 ml-10'
                  : bubble.type === 'user' || isUser
                  ? 'bg-[#C7F2D8] self-end mr-5 ml-10'
                  : bubble.type === 'other'
                  ? 'bg-white self-start ml-5 mr-10'
                  : ''
              }
            `}
            style={{
              position: 'relative',
              marginTop: '0.5rem',
              marginBottom: '1.5rem',
              minHeight: 42,
            }}
          >
            {/* Avatar */}
            {bubble.type !== 'user' && (
              <img
                src={getAvatar(bubble.speaker)}
                alt={bubble.speaker}
                className={`absolute w-8 h-8 rounded-full object-cover bg-white border-2 border-white
                  ${
                    ['main', 'user'].includes(bubble.type)
                      ? 'right-[-24px]'
                      : 'left-[-24px]'
                  }
                  bottom-[-14px]`}
                style={{ zIndex: 1 }}
              />
            )}
            {/* Image */}
            {bubble.image && (
              <img
                src={bubble.image}
                alt=""
                className="rounded-lg mb-2 max-w-full max-h-48"
              />
            )}
            {/* Quote */}
            {bubble.quote && (
              <div className="bg-blue-50 border-l-4 border-[#0084ff] px-3 py-2 mb-2 italic">
                {bubble.quote}
              </div>
            )}
            {/* Content */}
            <div className="whitespace-pre-line">{bubble.content}</div>
            {/* User answer (for isQuestion) */}
            {bubble.isQuestion && userAnswers[idx] && (
              <div className="mt-3 text-sm text-blue-900 font-semibold">
                {userAnswers[idx]}
              </div>
            )}
            {/* Timestamp */}
            <div
              className={`absolute text-xs text-gray-500 top-[-1rem] ${
                ['main', 'user'].includes(bubble.type) ? 'right-8' : 'left-8'
              }`}
            >
              {bubble.timestamp
                ? `${bubble.timestamp} ${bubble.speaker}`
                : bubble.speaker}
            </div>
            {/* Reactions */}
            {bubble.reactions && (
              <div
                className={`absolute flex flex-row gap-1 bottom-[-1rem] ${
                  ['main', 'user'].includes(bubble.type)
                    ? 'right-10'
                    : 'left-10'
                }`}
              >
                {bubble.reactions.map((r, i) => (
                  <span key={i} className="text-2xl">
                    {r.emoji}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
      {/* Show typing indicator if enabled */}
      {typing && (
        <div
          className="bg-white ml-5 mr-10 self-start rounded-xl shadow-md px-5 pt-3 pb-6 mb-3 flex items-center gap-2 min-h-[44px]"
          style={{ maxWidth: '80%' }}
        >
          <img
            src={getAvatar('Amy')}
            alt="Amy"
            className="w-8 h-8 rounded-full object-cover bg-white border-2 border-white left-[-24px] bottom-[-14px]"
            style={{ zIndex: 1 }}
          />
          <span className="animate-pulse text-gray-500">Amy tippt…</span>
        </div>
      )}
      {/* Input for user answer if required */}
      {canAnswer && renderInput(onUserAnswer, false)}
    </div>
  );
}

// --- ChatWindow
function ChatWindow({
  course,
  id,
  initialProgress,
  progressChoiceMade,
}: {
  course: (typeof courses)[number];
  id: string;
  initialProgress: {
    episodeIdx: number;
    answers: string[];
  };
  progressChoiceMade: boolean;
  setProgressChoiceMade: (v: boolean) => void;
}) {
  const [episodeIdx, setEpisodeIdx] = React.useState(
    initialProgress.episodeIdx
  );
  const [answers, setAnswers] = React.useState<string[]>(
    initialProgress.answers
  );
  const [typing, setTyping] = React.useState(false);
  const [visibleBubbleCount, setVisibleBubbleCount] = React.useState<
    number | null
  >(null);
  const [delayedRevealTriggered, setDelayedRevealTriggered] =
    React.useState(false);

  React.useEffect(() => {
    if (!progressChoiceMade) return;
    if (delayedRevealTriggered) {
      const bubbles = course.script[episodeIdx].bubbles;
      let count = 0;
      setVisibleBubbleCount(0);
      const interval = setInterval(() => {
        count++;
        setVisibleBubbleCount(count);
        if (count >= bubbles.length) {
          clearInterval(interval);
          setVisibleBubbleCount(null);
          setDelayedRevealTriggered(false);
        }
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [delayedRevealTriggered, episodeIdx, course, progressChoiceMade]);

  React.useEffect(() => {
    if (!progressChoiceMade) return;
    if (episodeIdx === 0 && answers.length === 0) {
      setDelayedRevealTriggered(true);
    }
  }, [progressChoiceMade, episodeIdx, course]);

  React.useEffect(() => {
    if (!id || !progressChoiceMade || !course) return;
    setProgress(id, {
      unlockedEpisode: episodeIdx + 1,
      answers,
      finished: episodeIdx + 1 === course.script.length,
    });
  }, [episodeIdx, JSON.stringify(answers), progressChoiceMade, course, id]);

  function handleUserAnswer(answer: string) {
    const currentEp = course.script[episodeIdx];
    if (!currentEp) return;
    const newAnswers = [...answers];
    const questionIdx = currentEp.bubbles.findIndex((b) => b.inputExpected);
    newAnswers[questionIdx] = answer;
    setAnswers(newAnswers);

    setTyping(true);
    setVisibleBubbleCount(null);

    setTimeout(() => {
      setTyping(false);
      if (episodeIdx + 1 < course.script.length) {
        setEpisodeIdx(episodeIdx + 1);
        setDelayedRevealTriggered(true);
      }
    }, 2000);
  }

  const visibleEpisodes = course.script.slice(0, episodeIdx + 1);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-[360px] min-h-[640px] max-w-full shadow-xl bg-white flex flex-col overflow-hidden">
        <div className="flex-1 flex flex-col overflow-y-auto bg-[#e5ddd5] pt-2">
          {visibleEpisodes.map((ep, idx) => {
            let bubblesToShow: Bubble[] = ep.bubbles;
            if (idx === episodeIdx && typeof visibleBubbleCount === 'number') {
              bubblesToShow = ep.bubbles.slice(
                0,
                visibleBubbleCount
              ) as Bubble[];
            }
            return (
              <ChatEpisode
                key={ep.id}
                bubbles={bubblesToShow}
                userAnswers={answers}
                canAnswer={
                  ep.bubbles.some(
                    (b) =>
                      b.inputExpected && (!answers[idx] || answers[idx] === '')
                  ) &&
                  idx === episodeIdx &&
                  !typing &&
                  bubblesToShow.length === ep.bubbles.length
                }
                renderInput={(onSend, disabled) => (
                  <ChatInput onSend={onSend} disabled={disabled} />
                )}
                onUserAnswer={(answer) => handleUserAnswer(answer)}
                typing={idx === episodeIdx && typing}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

// --- Main Page
export default function ChatCourse() {
  const { id } = useParams();
  const course = courses.find((c) => c.id === id);

  const [savedProgress, setSavedProgress] = React.useState<
    ReturnType<typeof getProgress> | null | 'checked'
  >('checked');
  const [progressChoiceMade, setProgressChoiceMade] = React.useState(false);

  React.useEffect(() => {
    if (!id) return;
    const prog = getProgress(id);
    if (prog && prog.unlockedEpisode > 1) {
      setSavedProgress(prog);
      setProgressChoiceMade(false);
    } else {
      setSavedProgress(null);
      setProgressChoiceMade(true);
    }
  }, [id]);

  function handleProgressChoice(action: 'continue' | 'reset') {
    if (!id) return;
    if (
      action === 'continue' &&
      typeof savedProgress === 'object' &&
      savedProgress !== null
    ) {
      setProgressChoiceMade(true);
    } else if (action === 'reset') {
      resetProgress(id);
      setSavedProgress(null);
      setProgressChoiceMade(true);
    }
  }

  if (!course) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-96 text-lg text-gray-700">
          Kurs nicht gefunden!
        </div>
      </Layout>
    );
  }

  if (!progressChoiceMade) {
    return (
      <Layout>
        <ProgressDialog
          onContinue={() => handleProgressChoice('continue')}
          onReset={() => handleProgressChoice('reset')}
        />
      </Layout>
    );
  }

  const initialProgress =
    typeof savedProgress === 'object' && savedProgress !== null
      ? {
          episodeIdx: savedProgress.unlockedEpisode - 1,
          answers: savedProgress.answers,
        }
      : { episodeIdx: 0, answers: [] };

  return (
    <Layout>
      <div>
        <ChatHeader title={course.title} />
        <ChatWindow
          course={course}
          id={id!}
          initialProgress={initialProgress}
          progressChoiceMade={progressChoiceMade}
          setProgressChoiceMade={setProgressChoiceMade}
        />
      </div>
    </Layout>
  );
}
