import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode';
import { getActiveProfileId } from '../profile/profileStorage';

type Cert = { hash: string; verifyUrl: string };

type Props = {
  chatName?: string;
};

function loadCert(profileId: string): Cert | null {
  try {
    const raw = localStorage.getItem(`aym_p_${profileId}__aym_completion_cert`);
    return raw ? (JSON.parse(raw) as Cert) : null;
  } catch {
    return null;
  }
}

function buildUrl(cert: Cert, name?: string): string {
  const base = cert.verifyUrl;
  return name?.trim() ? `${base}&name=${encodeURIComponent(name.trim())}` : base;
}

export default function BlockchainCertCard({ chatName }: Props) {
  const { t } = useTranslation('profile');
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const profileId = getActiveProfileId();
  const cert = profileId ? loadCert(profileId) : null;

  const fullUrl = cert ? buildUrl(cert, chatName) : null;

  useEffect(() => {
    if (!fullUrl) return;
    QRCode.toDataURL(fullUrl, { margin: 1, width: 200 })
      .then(setQrDataUrl)
      .catch(() => {});
  }, [fullUrl]);

  if (!cert || !fullUrl) return null;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(fullUrl!);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* */ }
  }

  return (
    <div className="mt-4 p-4 rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 via-white to-cyan-50 shadow-sm">
      <div className="flex items-start gap-3">
        {qrDataUrl && (
          <img
            src={qrDataUrl}
            alt="QR-Code Zertifikat"
            className="w-24 h-24 rounded-lg flex-shrink-0 border border-teal-100"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-extrabold text-teal-900 mb-0.5">
            {t('blockchain.certCardTitle')}
          </div>
          <p className="text-xs text-teal-700 mb-3 leading-snug">
            {t('blockchain.certCardSubtitle')}
          </p>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-teal-100 text-teal-800 rounded-lg hover:bg-teal-200 transition-colors"
          >
            {copied ? t('blockchain.certCopied') : t('blockchain.certCopy')}
          </button>
        </div>
      </div>
    </div>
  );
}
