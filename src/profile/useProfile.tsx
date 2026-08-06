// src/profile/useProfile.tsx
// EINZIGER Provider – keine zweite Version behalten!
// Fast Refresh stabil: keine zusätzlichen Exporte/Logik, nur Context + Hook.

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { UserProfile } from './types';
import { loadProfile, saveProfile } from './storage';
import { getActiveProfileId } from './profileStorage';
import { updateProfileMeta } from './profileIndex';

type ProfileContextValue = {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  updateProfile: (updater: (p: UserProfile) => UserProfile) => void;
  reloadProfile: () => void;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(() => loadProfile());
  const prevChatNameRef = useRef<string>(profile.chatName ?? '');

  const updateProfile = (updater: (p: UserProfile) => UserProfile) => {
    setProfile((p) => updater(p));
  };

  const reloadProfile = React.useCallback(() => setProfile(loadProfile()), []);

  // Debounced save + chatName → displayName sync
  useEffect(() => {
    const id = window.setTimeout(() => {
      saveProfile(profile);

      // Wenn chatName gesetzt wird, auch displayName im Profil-Index aktualisieren
      const chatName = profile.chatName?.trim() ?? '';
      if (chatName && chatName !== prevChatNameRef.current) {
        prevChatNameRef.current = chatName;
        const activeId = getActiveProfileId();
        if (activeId) {
          updateProfileMeta(activeId, { displayName: chatName });
        }
      }

      // Avatar-Sync
      if (profile.avatarBaseId) {
        const activeId = getActiveProfileId();
        if (activeId) {
          updateProfileMeta(activeId, { avatarBaseId: profile.avatarBaseId });
        }
      }
    }, 200);

    return () => window.clearTimeout(id);
  }, [profile]);

  const value = useMemo(
    () => ({ profile, setProfile, updateProfile, reloadProfile }),
    [profile, reloadProfile]
  );

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error('useProfile must be used within <ProfileProvider>');
  }
  return ctx;
}
