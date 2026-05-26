import React from 'react';
import { useTranslation } from 'react-i18next';

export default function UnlockedToast({
  title,
  subtitle,
  onOpen,
  onDismiss,
  primaryLabel,
  secondaryLabel,
}: {
  title: string;
  subtitle?: string;
  onOpen: () => void;
  onDismiss: () => void;
  primaryLabel?: string;
  secondaryLabel?: string;
}) {
  const { t } = useTranslation('common');
  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50">
      <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white shadow-lg overflow-hidden">
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="font-extrabold text-slate-900">{title}</div>
              {subtitle ? (
                <div className="mt-1 text-sm text-slate-600">{subtitle}</div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={onDismiss}
              className="shrink-0 rounded-xl px-2 py-1 text-sm border border-slate-200 hover:bg-slate-50"
              aria-label={t('close', { defaultValue: 'Schließen' })}
            >
              ✕
            </button>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={onOpen}
              className="flex-1 rounded-2xl px-4 py-2 font-extrabold bg-slate-900 text-white hover:bg-slate-800"
            >
              {primaryLabel ?? 'Freundebuch ansehen →'}
            </button>

            <button
              type="button"
              onClick={onDismiss}
              className="rounded-2xl px-4 py-2 font-semibold border border-slate-200 hover:bg-slate-50"
            >
              {secondaryLabel ?? 'Später'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
