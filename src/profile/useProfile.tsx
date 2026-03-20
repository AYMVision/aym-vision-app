// src/profile/useProfile.tsx
// EINZIGER Provider – keine zweite Version behalten!
// Fast Refresh stabil: keine zusätzlichen Exporte/Logik, nur Context + Hook.

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { UserProfile } from './types';
import { loadProfile, saveProfile } from './storage';

type ProfileContextValue = {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  updateProfile: (updater: (p: UserProfile) => UserProfile) => void;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(() => loadProfile());

  const updateProfile = (updater: (p: UserProfile) => UserProfile) => {
    setProfile((p) => updater(p));
  };

  // Debounced save
  useEffect(() => {
    const id = window.setTimeout(() => {
      saveProfile(profile);
    }, 200);

    return () => window.clearTimeout(id);
  }, [profile]);

  const value = useMemo(
    () => ({ profile, setProfile, updateProfile }),
    [profile]
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
