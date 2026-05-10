// src/settings/appSettings.ts
export type OwlMode = 'off' | 'auto' | 'on';

export type AppSettings = {
  owlMode: OwlMode;
  devToolsEnabled: boolean;
  remindersEnabled: boolean;
};

const KEY = 'aym_settings_v1';

const DEFAULTS: AppSettings = {
  owlMode: 'auto',
  devToolsEnabled: Boolean(import.meta.env.DEV),
  remindersEnabled: false,
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
