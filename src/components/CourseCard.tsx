import { useTranslation } from 'react-i18next';
import { getProgress } from '../common/utils';

interface Props {
  title: string;
  description: string;
  image: string;
  progressKey: string;
  onClick: () => void;
}
export default function CourseCard({
  title,
  description,
  image,
  progressKey,
  onClick,
}: Props) {
  const progress = getProgress(progressKey);
  const { t } = useTranslation('courses');
  const state =
    progress && progress.finished
      ? { label: t('done'), color: 'bg-green-200 text-green-700' }
      : progress
      ? { label: t('inProgress'), color: 'bg-yellow-100 text-gold-700' }
      : { label: t('new'), color: 'bg-gold-100 text-gold-700' };

  return (
    <button
      onClick={onClick}
      className="w-full cursor-pointer text-left rounded-xl border-2 border-blue-50 hover:border-anthracite-950 shadow-md bg-white transition p-6 flex flex-col gap-2 focus:outline-none scale-100 hover:scale-105"
    >
      <div className="w-full h-32 rounded-lg overflow-hidden bg-white">
        <img src={image} alt={title} className="w-full h-full object-contain" />
      </div>

      <div className="flex justify-center items-center gap-4">
        <span className="text-lg font-bold text-black">{title}</span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${state.color}`}
        >
          {state.label}
        </span>
      </div>
      <div className="text-gray-700 mt-2">{description}</div>
    </button>
  );
}
