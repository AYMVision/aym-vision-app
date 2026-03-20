import React from 'react';
import { useTranslation } from 'react-i18next';
import { useProfile } from '../profile/useProfile';
import { getVisibleThemes } from '../competencies/getVisibleThemes';

export default function ProfileThemeCard() {
  const { profile } = useProfile();
  const { t } = useTranslation(['profile', 'themes']);
  const themes = getVisibleThemes(profile.progress);

  if (themes.length === 0) {
    return (
      <div className="rounded-2xl border border-black/5 bg-white shadow-sm p-4">
        <div className="text-sm font-semibold text-anthracite-900">
          {t('themes.title', { ns: 'profile', defaultValue: 'So viele Themen hast du schon entdeckt' })}
        </div>
        <p className="mt-2 text-sm text-slate-500">
          {t('themes.empty', {
            ns: 'profile',
            defaultValue: 'Mit jeder Folge sammelst du Themen aus der digitalen Welt.',
          })}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-black/5 bg-white shadow-sm p-4">
      <div className="text-sm font-semibold text-anthracite-900">
        {t('themes.title', { ns: 'profile', defaultValue: 'So viele Themen hast du schon entdeckt' })}
      </div>

      <div className="mt-3 space-y-2">
        {themes.map((theme) => (
          <div
            key={theme.id}
            className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 px-3 py-2"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span aria-hidden="true">{theme.emoji}</span>
              <span className="text-sm font-medium text-slate-800 truncate">
                {t(theme.childLabelKey, { ns: 'themes' })}
              </span>
            </div>

            <div className="text-sm font-bold text-slate-900">
              {theme.points}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}