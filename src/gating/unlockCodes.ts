// src/gating/unlockCodes.ts

import {
  resetEntitlements,
  setBypassAll,
  setBypassUntil,
  setUnlockAllEpisodes,
  unlockEpisode,
  unlockEpisodeUntil,
} from './entitlements';
import { setFastGateActive } from './gateEngine';

import { grantTestAccess, clearTestAccess } from '../settings/testAccess';

export type ApplyUnlockCodeResult =
  | { ok: true; message: string }
  | { ok: false; message: string };

type NamedCodeAction =
  | { type: 'test-access'; message: string }
  | { type: 'bypass-all'; message: string }
  | { type: 'unlock-episode'; episodeId: string; message: string }
  | { type: 'unlock-episode-until'; episodeId: string; date: string; message: string }
  | { type: 'bypass-until'; date: string; message: string }
  | { type: 'unlock-all-episodes'; message: string };

const NAMED_CODES: Record<string, NamedCodeAction> = {
  // ===== Sichtbarer Standard-Testcode =====
  'AMY-TEST': {
    type: 'test-access',
    message: 'Testbereich wurde freigeschaltet.',
  },

  // ===== Beispielhafte individuelle Codes =====
  // Diese Codes kannst du pro Person / Gruppe vergeben.
  'ELTERN-ANNA': {
    type: 'test-access',
    message: 'Testbereich wurde freigeschaltet.',
  },
  'SCHULE-7B': {
    type: 'test-access',
    message: 'Testbereich wurde freigeschaltet.',
  },
  'PILOT-MAX': {
    type: 'test-access',
    message: 'Testbereich wurde freigeschaltet.',
  },

  // ===== Beispiel: individueller Episoden-Code =====
  'FREUND-S1E01': {
    type: 'unlock-episode',
    episodeId: 's1e01',
    message: 'Episode S1E01 wurde freigeschaltet.',
  },

  // ===== Beispiel: individueller Zeit-Code =====
  'PILOT-BIS-OSTERN': {
    type: 'bypass-until',
    date: '2026-04-12',
    message: 'Freischaltung bis 2026-04-12 aktiviert.',
  },

  // ===== Individuelle Trainer-Codes =====
  'TRAINER-KEMAL': {
    type: 'unlock-episode-until',
    episodeId: 's1e01',
    date: '2026-06-30',
    message: 'Trainer-Zugang für S1E01 aktiviert (bis 30.06.2026).',
  },

  // ===== Beta-Tester: Erste Welle =====
  // bypass-until: alle Kapitel + Daily Gate aufgehoben bis Beta-Ende
  'ERSTEWELLE': {
    type: 'bypass-until',
    date: '2026-06-30',
    message: 'Beta-Zugang aktiviert. Willkommen in der ersten Welle!',
  },
};

function applyNamedCode(action: NamedCodeAction): ApplyUnlockCodeResult {
  if (action.type === 'test-access') {
    grantTestAccess();
    return { ok: true, message: action.message };
  }

  if (action.type === 'bypass-all') {
    setBypassAll(true);
    return { ok: true, message: action.message };
  }

  if (action.type === 'unlock-episode') {
    unlockEpisode(action.episodeId);
    return { ok: true, message: action.message };
  }

  if (action.type === 'unlock-episode-until') {
    unlockEpisodeUntil(action.episodeId, action.date);
    return { ok: true, message: action.message };
  }

  if (action.type === 'bypass-until') {
    setBypassUntil(action.date);
    return { ok: true, message: action.message };
  }

  if (action.type === 'unlock-all-episodes') {
    setUnlockAllEpisodes(true);
    return { ok: true, message: action.message };
  }

  return { ok: false, message: 'Dieser Code ist ungültig.' };
}

export function applyUnlockCode(rawCode: string): ApplyUnlockCodeResult {
  const code = rawCode.trim().toUpperCase();

  if (!code) {
    return { ok: false, message: 'Bitte gib einen Code ein.' };
  }

  // ===== 1) Feste individuelle / benannte Codes =====
  const named = NAMED_CODES[code];
  if (named) {
    return applyNamedCode(named);
  }

  // ===== 2) Standard-Systemcodes =====
  if (code === 'AMY-DEV') {
    setBypassAll(true);
    return { ok: true, message: 'Testfreischaltung aktiviert.' };
  }

  if (code === 'AMY-RESET') {
    resetEntitlements();
    clearTestAccess();
    setFastGateActive(false);
    return { ok: true, message: 'Freischaltungen wurden entfernt.' };
  }

  // ===== Geheimer Entwickler-Code: 30-Sekunden-Gate =====
  if (code === 'AMY-FASTGATE') {
    setFastGateActive(true);
    return { ok: true, message: 'Fast-Gate aktiviert: Sperre läuft nach 30 Sekunden ab.' };
  }

  if (code === 'AMY-TEST') {
    grantTestAccess();
    return { ok: true, message: 'Testbereich wurde freigeschaltet.' };
  }

  // Beispiel: AMY-S1E01
  const episodeMatch = code.match(/^AMY-(S\d+E\d+)$/);
  if (episodeMatch) {
    const episodeId = episodeMatch[1].toLowerCase();
    unlockEpisode(episodeId);
    return {
      ok: true,
      message: `Episode ${episodeId.toUpperCase()} wurde freigeschaltet.`,
    };
  }

  // Beispiel: AMY-UNTIL-2026-03-30
  const untilMatch = code.match(/^AMY-UNTIL-(\d{4}-\d{2}-\d{2})$/);
  if (untilMatch) {
    setBypassUntil(untilMatch[1]);
    return {
      ok: true,
      message: `Freischaltung bis ${untilMatch[1]} aktiviert.`,
    };
  }

  return { ok: false, message: 'Dieser Code ist ungültig.' };
}