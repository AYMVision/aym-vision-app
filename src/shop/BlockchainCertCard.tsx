import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getActiveProfileId } from '../profile/profileStorage';

type Cert = { hash: string; verifyUrl: string };

function loadCert(profileId: string): Cert | null {
  try {
    const raw = localStorage.getItem(`aym_p_${profileId}__aym_completion_cert`);
    return raw ? (JSON.parse(raw) as Cert) : null;
  } catch {
    return null;
  }
}

export default function BlockchainCertCard() {
  const { t } = useTranslation('profile');

  const profileId = getActiveProfileId();
  const cert = profileId ? loadCert(profileId) : null;

  if (!cert) return null;

  return (
    <div className="mt-4 p-4 rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 via-white to-cyan-50 shadow-sm">
      <div className="text-sm font-extrabold text-teal-900 mb-0.5">
        {t('blockchain.certCardTitle')}
      </div>
      <p className="text-xs text-teal-700 mb-3 leading-snug">
        {t('blockchain.certCardSubtitle')}
      </p>
      <Link
        to="/zertifikat"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
      >
        {t('blockchain.viewCert')}
      </Link>
    </div>
  );
}
