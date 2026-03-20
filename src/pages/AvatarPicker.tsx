// src/pages/AvatarPicker.tsx
// Avatar Picker (AYM-Vision Aufräum-Leitfaden):
// - i18n: keine hardcodierten Texte (nur defaultValue sparsam)
// - Type-safety: Location-State typisieren, kein `any`
// - UI: klar, ruhig, konsistent

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Layout from '../components/Layout';
import { AVATAR_BASES } from '../data/avatars';
import { useProfile } from '../profile/useProfile';
import AvatarHeadImage from '../components/AvatarHeadImage';
import AvatarFullImage from '../components/AvatarFullImage';

type AvatarPickerLocationState = {
  backTo?: string;
};

export default function AvatarPicker() {
  const { t } = useTranslation('avatar');
  const { profile, updateProfile } = useProfile();

  const location = useLocation();
  const state = (location.state ?? null) as AvatarPickerLocationState | null;
  const backTo = state?.backTo ?? '/profile';

  const selectedId = profile.avatarBaseId;

  return (
    <Layout hideFooter>
      <div className="w-full max-w-xl px-4 py-8">
        <div className="mt-2 mb-4 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-anthracite-950">
            {t('title', { defaultValue: 'Wähle deinen Avatar' })}
          </h1>

          <Link
            to={backTo}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold hover:bg-slate-50"
            aria-label={t('backAria', { defaultValue: 'Zurück' })}
          >
            ← {t('backCta', { defaultValue: 'Profil' })}
          </Link>
        </div>

        <p className="text-sm text-slate-600 mb-5">
          {t('hint', { defaultValue: 'Tippe auf ein Bild. Unten siehst du die Vorschau.' })}
        </p>

        <div className="grid grid-cols-3 gap-3">
          {AVATAR_BASES.map((a) => {
            const selected = selectedId === a.id;

            return (
              <button
                key={a.id}
                type="button"
                onClick={() =>
                  updateProfile((p) => ({
                    ...p,
                    avatarBaseId: a.id,
                    updatedAt: Date.now(),
                  }))
                }
                className={
                  'p-2 rounded-2xl border bg-white shadow-sm transition ' +
                  (selected
                    ? 'border-slate-900 ring-2 ring-slate-900/10'
                    : 'border-slate-200 hover:border-slate-300')
                }
                aria-pressed={selected}
                aria-label={
                  selected
                    ? t('avatar.selectedAria', {
                        defaultValue: '{{label}} (ausgewählt)',
                        label: a.label,
                      })
                    : t('avatar.selectAria', {
                        defaultValue: '{{label}} auswählen',
                        label: a.label,
                      })
                }
                title={
                  selected
                    ? t('avatar.selectedTitle', { defaultValue: 'Ausgewählt' })
                    : t('avatar.selectTitle', { defaultValue: 'Klicken zum Auswählen' })
                }
              >
                <div className="w-full aspect-square rounded-full bg-white border border-slate-200 flex items-center justify-center overflow-hidden">
                  <AvatarHeadImage
  id={a.id}
  size={150}
  alt={a.label}
  fit="contain"
  className="w-full h-full"
/>
                </div>

                <div className="text-xs mt-2 text-slate-700">{a.label}</div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 rounded-2xl border border-black/5 bg-white shadow-sm p-4">
          <div className="text-sm font-semibold text-anthracite-900 mb-3">
            {t('preview.title', { defaultValue: 'So siehst du aus' })}
          </div>

          <div className="flex justify-center">
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3">
              <div className="relative h-[360px] w-[280px] max-w-full">
                <AvatarFullImage
                  id={selectedId}
                  width={280}
                  alt={t('preview.alt', { defaultValue: 'Vorschau' })}
                  className="absolute inset-0 w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            {t('preview.note', { defaultValue: 'Items findest du im Profil.' })}
          </p>
        </div>
      </div>
    </Layout>
  );
}
