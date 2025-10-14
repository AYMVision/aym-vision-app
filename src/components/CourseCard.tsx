import { useTranslation } from 'react-i18next';

interface Props {
  title: string;
  description: string;
  image: string;
  progressKey?: string;
  progressPercent?: number;
  onClick: () => void;
}

export default function CourseCard({
  title,
  description,
  image,
  onClick,
  progressPercent,
}: Props) {
  const { t } = useTranslation('courses');

  const pct = Math.max(0, Math.min(100, Math.floor(progressPercent ?? 0)));

  const state =
    pct >= 100
      ? { label: t('done'), color: 'bg-green-200 text-green-700' }
      : pct > 0
      ? { label: t('inProgress'), color: 'bg-yellow-100 text-gold-700' }
      : { label: t('new'), color: 'bg-gold-100 text-gold-700' };

  const showProgressBar = pct > 0 || pct === 100;

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
          {showProgressBar && (
            <span className="ml-2 text-[11px] opacity-80">{pct}%</span>
          )}
        </span>
      </div>

      <div className="text-gray-700 mt-2">{description}</div>

      {showProgressBar && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] text-gray-600 mb-1">
            <span>{t('progress', 'Fortschritt')}</span>
            <span>{pct}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-100">
            <div
              className={`h-2 rounded-full ${
                pct === 100 ? 'bg-emerald-500' : 'bg-[#0084ff]'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
          {pct === 100 && (
            <div className="mt-1 text-[11px] text-emerald-700 font-medium">
              {t('completed', 'Abgeschlossen')}
            </div>
          )}
        </div>
      )}
    </button>
  );
}
