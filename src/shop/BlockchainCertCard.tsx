import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode';
import { getActiveProfileId } from '../profile/profileStorage';
import { useQuery } from '@tanstack/react-query';

type Cert = { hash: string; salt: string; verifyUrl: string };

type Props = {
  chatName?: string;
};

function loadCert(profileId: string): Cert | null {
  try {
    const raw = localStorage.getItem(`aym_p_${profileId}__aym_registration_cert`);
    return raw ? (JSON.parse(raw) as Cert) : null;
  } catch {
    return null;
  }
}

function buildUrl(cert: Cert, name?: string): string {
  const base = cert.verifyUrl;
  return name?.trim() ? `${base}&name=${encodeURIComponent(name.trim())}` : base;
}

type MpfRoot = { root: string; treeVersion: number; anchorTxHash: string | null; anchoredAt: string | null };

function useAnchorStatus() {
  const base = (import.meta.env.VITE_AYM_BACKEND_URL ?? '').replace(/\/$/, '');
  return useQuery<MpfRoot | null>({
    queryKey: ['mpf-root'],
    queryFn: async () => {
      if (!base) return null;
      try {
        const res = await fetch(`${base}/api/v1/aym/mpf/root`);
        if (!res.ok) return null;
        return await res.json() as MpfRoot;
      } catch {
        return null;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 min
    enabled: !!base,
  });
}

export default function BlockchainCertCard({ chatName }: Props) {
  const { t } = useTranslation('profile');
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { data: mpfRoot } = useAnchorStatus();

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

      {mpfRoot !== undefined && (
        <div className="mt-3 pt-3 border-t border-teal-100 text-xs">
          {mpfRoot?.anchorTxHash ? (
            <span className="text-emerald-700 font-semibold">
              {t('blockchain.anchorDone')}
              {mpfRoot.anchoredAt && (
                <span className="ml-1 text-emerald-600 font-normal">
                  ({new Date(mpfRoot.anchoredAt).toLocaleDateString('de-DE')})
                </span>
              )}
            </span>
          ) : (
            <span className="text-amber-700">{t('blockchain.anchorPending')}</span>
          )}
        </div>
      )}
    </div>
  );
}
