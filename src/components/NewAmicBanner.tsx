// src/components/NewAmicBanner.tsx
// Dismissible in-app banner: "Finn hat dir eine Nachricht hinterlassen →"

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { NextAmicInfo } from '../notifications/amicNotif';
import { clearNextAmicInfo } from '../notifications/amicNotif';

interface NewAmicBannerProps {
  info: NextAmicInfo;
  onDismiss: () => void;
}

export default function NewAmicBanner({ info, onDismiss }: NewAmicBannerProps) {
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  function handleOpen() {
    clearNextAmicInfo();
    onDismiss();
    navigate(`/stories-v02/${info.courseId}/${info.chapterId}`);
  }

  function handleDismiss() {
    clearNextAmicInfo();
    onDismiss();
  }

  return (
    <div className="fixed bottom-20 inset-x-0 z-[200] flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-sm bg-white border border-teal-200 rounded-2xl shadow-lg flex items-center gap-3 px-4 py-3">
        {/* Avatar placeholder — messenger icon */}
        <div className="shrink-0 w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-xl">
          💬
        </div>

        <button
          onClick={handleOpen}
          className="flex-1 text-left min-w-0"
        >
          <p className="text-sm font-semibold text-anthracite-900 leading-snug truncate">
            {info.senderName} hat dir eine Nachricht hinterlassen
          </p>
          <p className="text-xs text-teal-600 mt-0.5">Jetzt lesen →</p>
        </button>

        <button
          onClick={handleDismiss}
          className="shrink-0 text-slate-400 hover:text-slate-600 text-lg leading-none"
          aria-label={t('close', { defaultValue: 'Schließen' })}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
