import { getProgress } from '../common/utils';

interface Props {
  title: string;
  description: string;
  progressKey: string;
  onClick: () => void;
}
export default function CourseCard({
  title,
  description,
  progressKey,
  onClick,
}: Props) {
  const progress = getProgress(progressKey);
  const state =
    progress && progress.finished
      ? { label: 'Abgeschlossen', color: 'bg-green-200 text-green-700' }
      : progress
      ? { label: 'Läuft...', color: 'bg-yellow-100 text-yellow-700' }
      : { label: 'Neu', color: 'bg-blue-100 text-blue-700' };

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl border-2 border-blue-50 hover:border-[#0084ff] shadow-md bg-white transition p-6 flex flex-col gap-2 focus:outline-none scale-100 hover:scale-105"
    >
      <div className="flex items-center gap-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${state.color}`}
        >
          {state.label}
        </span>
        <span className="text-lg font-bold text-black">{title}</span>
      </div>
      <div className="text-gray-700 mt-2">{description}</div>
    </button>
  );
}
