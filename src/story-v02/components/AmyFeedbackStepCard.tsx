import { STORY_CHARACTERS as characters } from '../../content/characters';
import ChatMessage from '../../components/ChatMessage';

type Props = {
  lines: string[];
  onContinue?: () => void;
};

export default function AmyFeedbackStepCard({ lines, onContinue }: Props) {
  return (
    <div className="w-full">
      {lines.map((line, index) => (
        <ChatMessage
          key={`amy-feedback-${index}`}
          message={{
            id: `amy-feedback-${index}`,
            type: 'main',
            speaker: characters.amy,
            content: line,
            timestamp: '',
          }}
        />
      ))}

      {onContinue ? (
        <div className="mx-auto mt-2 mb-3 max-w-[560px] flex justify-end">
          <button
            type="button"
            onClick={onContinue}
            className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-500"
          >
            Weiter
          </button>
        </div>
      ) : null}
    </div>
  );
}