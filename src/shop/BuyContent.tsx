import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getActiveProfileId } from '../profile/profileStorage';
import { isOwnedLocally } from './ownership';

type Props = {
  contentId: string;
};

export default function BuyContent({ contentId }: Props) {
  const { t } = useTranslation('profile');
  const [showHint, setShowHint] = useState(false);

  const profileId = getActiveProfileId();
  const owned = profileId ? isOwnedLocally(profileId, contentId) : false;

  if (owned) {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
        {t('shop.buy.owned')}
      </span>
    );
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setShowHint(true)}
        className="px-4 py-2 bg-teal-500 text-white text-sm font-bold rounded-xl hover:bg-teal-600 active:scale-[0.97] transition-all"
      >
        {t('shop.buy.button')}
      </button>
      {showHint && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 leading-snug">
          {t('shop.buy.parentRequired')}
        </div>
      )}
    </div>
  );
}
