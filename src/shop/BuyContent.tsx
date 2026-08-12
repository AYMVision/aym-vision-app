import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { loadIdentity } from '../identity/storage';
import { getActiveProfileId } from '../profile/profileStorage';
import { isOwnedLocally } from './ownership';
import { paymentLinkFor, computeProfileHash } from './stripe';
import { isParentUnlocked } from '../settings/parentLock';
import ParentGateDialog from '../components/ParentGateDialog';

type Props = {
  contentId: string;
};

export default function BuyContent({ contentId }: Props) {
  const { t } = useTranslation('profile');
  const [showParentGate, setShowParentGate] = useState(false);

  const profileId = getActiveProfileId();
  const owned = profileId ? isOwnedLocally(profileId, contentId) : false;

  function handleBuyClick() {
    if (owned) return;
    if (!isParentUnlocked()) {
      setShowParentGate(true);
      return;
    }
    openStripe();
  }

  function openStripe() {
    const identity = loadIdentity();
    const profileId = getActiveProfileId();
    if (!identity || !profileId) return;

    let link: string;
    try {
      const profileHash = computeProfileHash(identity.publicKeyHex, profileId);
      link = paymentLinkFor(contentId, profileHash);
    } catch {
      return;
    }

    window.location.href = link;
  }

  if (owned) {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
        {t('shop.buy.owned')}
      </span>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleBuyClick}
        className="px-4 py-2 bg-teal-500 text-white text-sm font-bold rounded-xl hover:bg-teal-600 active:scale-[0.97] transition-all"
      >
        {t('shop.buy.button')}
      </button>

      <ParentGateDialog
        open={showParentGate}
        onClose={() => setShowParentGate(false)}
        onUnlocked={() => { setShowParentGate(false); openStripe(); }}
      />
    </>
  );
}
