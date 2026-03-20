import React from 'react';
import { useTranslation } from 'react-i18next';
import { useProfile } from '../profile/useProfile';
import { getVisibleThemes } from '../competencies/getVisibleThemes';

export default function ParentThemeCard() {
  const { profile } = useProfile();
  const { t } = useTranslation('adult');
  const themes = getVisibleThemes(profile.progress);

  if (themes.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-semibold text-slate-900">
          {t('themes.titleParent', {
            defaultValue: 'Bisher sichtbare Themenfelder',
          })}
        </div>
        <p className="mt-2 text-sm text-slate-600">
          {t('themes.emptyParent', {
            defaultValue: 'Hier siehst du, welche Themen in den bisher gespielten Kapiteln vorkamen.',
          })}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm font-semibold text-slate-900">
        {t('themes.titleParent', {
          defaultValue: 'Bisher sichtbare Themenfelder',
        })}
      </div>

      <div className="mt-3 space-y-2">
        {themes.map((theme) => (
          <div
            key={theme.id}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
          >
            <div className="min-w-0 pr-3 text-sm text-slate-800">
              {t(theme.parentLabelKey)}
            </div>
            <div className="shrink-0 text-sm font-bold text-slate-900">
              {theme.points}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}