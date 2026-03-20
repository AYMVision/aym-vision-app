// src/components/ProfileAvatarButton.tsx
// Profile avatar button (AYM-Vision Aufräum-Leitfaden):
// - i18n: keine Hardcodes (nur defaultValue sparsam)
// - merkt die aktuelle Route via location.state.backTo

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useProfile } from '../profile/useProfile';
import AvatarHeadImage from './AvatarHeadImage';

type Props = {
  size?: number;
  className?: string;
};

export default function ProfileAvatarButton({
  size = 40,
  className = '',
}: Props) {
  const { t } = useTranslation('navigation');
  const { profile } = useProfile();

  const location = useLocation();
  const backTo = location.pathname + location.search + (location.hash || '');

  return (
    <Link
      to="/profile"
      state={{ backTo }}
      aria-label={t('profileMeta.openAria', { defaultValue: 'Profil öffnen' })}
      className={className}
    >
      <AvatarHeadImage
        id={profile.avatarBaseId}
        size={size}
        alt={t('profileMeta.avatarAlt', { defaultValue: 'Profil' })}
        className="rounded-full border border-slate-200 bg-white"
      />
    </Link>
  );
}
