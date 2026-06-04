// src/pages/StudioEducatorsPage.tsx
// Dedicated page for educators: workshop links and instructions

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import { assetUrl } from '../common/assetUrl';
import {
  STUDIO_TOPICS,
  TOPIC_ICONS,
  buildWorkshopUrl,
  buildCustomWorkshopUrl,
  copyToClipboard,
} from '../studio/studioTopics';

export default function StudioEducatorsPage() {
  const { t } = useTranslation('studio');
  const { t: tBonus } = useTranslation('bonus');
  const [copiedTag, setCopiedTag] = useState<string | null>(null);
  const [customLabel, setCustomLabel] = useState('');
  const [customCopied, setCustomCopied] = useState(false);

  function handleCopyTopic(topicId: string) {
    copyToClipboard(buildWorkshopUrl(topicId)).then(() => {
      setCopiedTag(topicId);
      setTimeout(() => setCopiedTag(null), 2000);
    });
  }

  function handleCopyCustom() {
    if (!customLabel.trim()) return;
    copyToClipboard(buildCustomWorkshopUrl(customLabel)).then(() => {
      setCustomCopied(true);
      setTimeout(() => setCustomCopied(false), 2000);
    });
  }

  return (
    <Layout>
      <div className="w-full max-w-lg mx-auto px-4 py-6 flex flex-col gap-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <img
            src={assetUrl('media/story/characters/amy-256.webp')}
            alt="Amy"
            className="w-12 h-12 rounded-full object-cover object-top flex-shrink-0 border-2 border-teal-100 shadow-sm"
          />
          <div>
            <h1 className="text-lg font-extrabold text-slate-900 leading-tight">
              {t('educators.title')}
            </h1>
            <p className="text-sm text-teal-700 font-medium">{t('educators.amyIntro')}</p>
          </div>
        </div>

        {/* Explanation */}
        <p className="text-sm text-slate-600 leading-relaxed bg-teal-50 border border-teal-100 rounded-2xl px-4 py-3">
          {t('educators.explanation')}
        </p>

        {/* How it works */}
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
            {t('educators.howItWorks')}
          </p>
          <div className="flex flex-col gap-2">
            {[
              { num: '1', text: t('educators.step1') },
              { num: '2', text: t('educators.step2') },
              { num: '3', text: t('educators.step3') },
            ].map(({ num, text }) => (
              <div key={num} className="flex items-center gap-3 bg-white border border-slate-100 rounded-xl px-3 py-2.5 shadow-sm">
                <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {num}
                </span>
                <span className="text-sm text-slate-700">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Topic links */}
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
            {t('educators.topicsTitle')}
          </p>
          <p className="text-xs text-slate-400 mb-3">{t('educators.topicsHint')}</p>
          <div className="grid grid-cols-2 gap-2">
            {(STUDIO_TOPICS as readonly string[]).map((topicId) => {
              const label = topicId === 'free'
                ? t('step1.tagFree')
                : tBonus(`newspaper.topics.${topicId}`);
              const copied = copiedTag === topicId;
              return (
                <button
                  key={topicId}
                  type="button"
                  onClick={() => handleCopyTopic(topicId)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all text-left ${
                    copied
                      ? 'border-teal-300 bg-teal-50 text-teal-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-violet-200 hover:bg-violet-50'
                  }`}
                >
                  <span className="text-base">{TOPIC_ICONS[topicId]}</span>
                  <span className="leading-tight truncate flex-1">
                    {copied ? '✓ Kopiert!' : label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom topic */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
            {t('educators.customTitle')}
          </p>
          <p className="text-xs text-slate-400 mb-3">{t('educators.customHint')}</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={customLabel}
              onChange={(e) => { setCustomLabel(e.target.value); setCustomCopied(false); }}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleCopyCustom(); } }}
              placeholder={t('educators.customPlaceholder')}
              className="flex-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white"
              maxLength={60}
            />
            <button
              type="button"
              onClick={handleCopyCustom}
              disabled={!customLabel.trim()}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 ${
                customCopied
                  ? 'bg-teal-50 border border-teal-300 text-teal-700'
                  : 'bg-violet-50 border border-violet-200 text-violet-700 hover:bg-violet-100'
              }`}
            >
              {customCopied ? '✓' : '🔗'}
            </button>
          </div>
        </div>

        {/* Back */}
        <Link
          to="/studio"
          className="text-center text-sm text-slate-400 hover:text-slate-600 transition-colors py-1"
        >
          {t('educators.backToStudio')}
        </Link>

      </div>
    </Layout>
  );
}
