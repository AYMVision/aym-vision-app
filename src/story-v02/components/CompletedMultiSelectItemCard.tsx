import { useTranslation } from 'react-i18next';
import type { ItemOption } from '../types/storyTypes';

type Props = {
  selectedOptionIds: string[];
  allOptions: ItemOption[];
};

export default function CompletedMultiSelectItemCard({
  selectedOptionIds,
  allOptions,
}: Props) {
  const { t } = useTranslation();

  const selectedSet = new Set(selectedOptionIds);

  const selectedOptions = allOptions.filter((opt) => selectedSet.has(opt.id));
  const missedCorrectOptions = allOptions.filter(
    (opt) => !selectedSet.has(opt.id) && opt.score > 0,
  );

  return (
    <div className="mx-auto my-3 max-w-[560px] rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">
        {t('stories:multiSelect.completed.selectedTitle')}
      </div>

      <div className="flex flex-col gap-1.5">
        {selectedOptions.map((opt) => {
          const isCorrect = opt.score > 0;

          return (
            <div
              key={opt.id}
              className={`flex items-start gap-2 rounded-lg px-3 py-2 text-sm ${
                isCorrect
                  ? 'bg-emerald-100 text-emerald-950'
                  : 'bg-amber-50 text-amber-900'
              }`}
            >
              <span
                className={`mt-0.5 flex-shrink-0 ${
                  isCorrect ? 'text-emerald-600' : 'text-amber-600'
                }`}
                aria-hidden="true"
              >
                {isCorrect ? '✓' : '🤔'}
              </span>

              <span>
                {opt.text}
                {!isCorrect && (
                  <span className="mt-0.5 block text-xs text-amber-700">
                    {t('stories:multiSelect.completed.incorrectLabel')}
                  </span>
                )}
              </span>
            </div>
          );
        })}
      </div>

      {missedCorrectOptions.length > 0 && (
        <>
          <div className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            {t('stories:multiSelect.completed.missedCorrectTitle')}
          </div>

          <div className="flex flex-col gap-1.5">
            {missedCorrectOptions.map((opt) => (
              <div
                key={opt.id}
                className="flex items-start gap-2 rounded-lg bg-emerald-100 px-3 py-2 text-sm text-emerald-950"
              >
                <span
                  className="mt-0.5 flex-shrink-0 text-emerald-600"
                  aria-hidden="true"
                >
                  ✓
                </span>
                <span>{opt.text}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}