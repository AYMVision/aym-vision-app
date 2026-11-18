// src/settings/appSettings.ts
export type OwlMode = 'off' | 'auto' | 'on';

export type AppSettings = {
  owlMode: OwlMode;
  devToolsEnabled: boolean;
  remindersEnabled: boolean;
  educationMode: boolean;
  unlockPerWeek: number;
  dailyLockEnabled: boolean;
};

const KEY = 'aym_settings_v1';

const DEFAULTS: AppSettings = {
  owlMode: 'auto',
  devToolsEnabled: Boolean(import.meta.env.DEV),
  remindersEnabled: false,
  educationMode: false,
  unlockPerWeek: 0,
  dailyLockEnabled: true,
};

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULTS };

    const parsed = JSON.parse(raw) as Partial<AppSettings>;

    return {
      owlMode:
        parsed.owlMode === 'off' || parsed.owlMode === 'auto' || parsed.owlMode === 'on'
          ? parsed.owlMode
          : DEFAULTS.owlMode,

      devToolsEnabled:
        typeof parsed.devToolsEnabled === 'boolean'
          ? parsed.devToolsEnabled
          : DEFAULTS.devToolsEnabled,

      remindersEnabled:
        typeof parsed.remindersEnabled === 'boolean'
          ? parsed.remindersEnabled
          : DEFAULTS.remindersEnabled,

      educationMode:
        typeof parsed.educationMode === 'boolean'
          ? parsed.educationMode
          : DEFAULTS.educationMode,

      unlockPerWeek:
        typeof parsed.unlockPerWeek === 'number' && parsed.unlockPerWeek >= 0
          ? parsed.unlockPerWeek
          : DEFAULTS.unlockPerWeek,

      dailyLockEnabled:
        typeof parsed.dailyLockEnabled === 'boolean'
          ? parsed.dailyLockEnabled
          : DEFAULTS.dailyLockEnabled,
    };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveSettings(patch: Partial<AppSettings>) {
  const current = loadSettings();
  const next: AppSettings = { ...current, ...patch };

  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // ignore
  }

  return next;
}

export function getSettingsSync(): AppSettings {
  return loadSettings();
}

export function isEducationMode(): boolean {
  return loadSettings().educationMode === true;
}
