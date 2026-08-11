# Profile-Scoped First-Run Flag Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `aym_first_run_done` profil-gebunden statt device-weit, damit neue Profile (bei Multi-Profil-Setup) korrekt als Erstbesucher erkannt werden und auf `/start` (Onboarding) geleitet werden.

**Architecture:** `firstRun.ts` liest/schreibt das Flag künftig über `pStorage` (profil-scoped), mit einem Legacy-Fallback, der den alten device-weiten Key migriert. `profileIndex.ts` bekommt den Key als `LEGACY_STATIC_KEY`, damit er bei Neu-Installationen mit flachem Legacy-State korrekt migriert wird.

**Tech Stack:** TypeScript, localStorage via `pStorage` (`src/profile/profileStorage.ts`)

## Global Constraints

- Kein neues npm-Paket
- Kein UI-Change — nur Storage-Schicht
- Bestehende Nutzer dürfen NICHT erneut Onboarding sehen
- `pStorage` ist der kanonische Profil-Storage — niemals rohe `localStorage`-Calls für profil-gebundene Daten

---

### Task 1: `firstRun.ts` auf pStorage umstellen + Legacy-Migration

**Files:**
- Modify: `src/common/firstRun.ts` (vollständige Neufassung, ~45 Zeilen)

**Interfaces:**
- Consumes: `pStorage` aus `../profile/profileStorage` (getItem, setItem, allScopedKeys)
- Produces: `isFirstRunDone(): boolean`, `markFirstRunDone(): void`, `shouldSkipOnboarding(): boolean` — gleiche Signaturen wie bisher

**Kontext / warum:**
- Aktuell: `localStorage.getItem('aym_first_run_done')` → device-weit → neues Profil B sieht immer `true` wenn Profil A Onboarding abgeschlossen hat
- Fix: `pStorage.getItem('aym_first_run_done')` → wird zu `aym_p_{id}__aym_first_run_done` → profil-isoliert
- Legacy-Fallback: Falls `pStorage` noch kein Eintrag existiert aber `localStorage` den alten Key hat → in `pStorage` migrieren und alten Key löschen
- Story-Progress-Fallback: Altes Scan-Muster (`aym_story_progress_`) funktioniert nicht mehr mit profil-scoped Keys → durch Scan über `pStorage.allScopedKeys()` ersetzen

- [ ] **Step 1: Aktuelle Datei lesen und verstehen**

Lese `src/common/firstRun.ts` vollständig. Verstehe die drei exportierten Funktionen:
- `isFirstRunDone()` — prüft Flag in localStorage
- `markFirstRunDone()` — setzt Flag in localStorage
- `shouldSkipOnboarding()` — kombiniert Flag + Story-Progress-Fallback

- [ ] **Step 2: Datei neu schreiben**

Ersetze den gesamten Inhalt von `src/common/firstRun.ts` mit:

```typescript
// src/common/firstRun.ts
// Tracks whether the active profile has completed onboarding.
// Flag is profile-scoped (via pStorage). Legacy device-wide key is migrated on first read.

import { pStorage } from '../profile/profileStorage';

const KEY = 'aym_first_run_done';
const LEGACY_KEY = 'aym_first_run_done'; // same name, but raw localStorage

export function isFirstRunDone(): boolean {
  try {
    // 1. Check profil-scoped flag
    if (pStorage.getItem(KEY) === 'true') return true;

    // 2. Legacy migration: device-wide flag from before multi-profile
    if (localStorage.getItem(LEGACY_KEY) === 'true') {
      pStorage.setItem(KEY, 'true');
      localStorage.removeItem(LEGACY_KEY);
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

export function markFirstRunDone(): void {
  try {
    pStorage.setItem(KEY, 'true');
    // Clean up legacy device-wide key if it still exists
    localStorage.removeItem(LEGACY_KEY);
  } catch {
    // ignore
  }
}

/**
 * Returns true if the active profile should skip onboarding.
 * Falls back to checking profil-scoped story-progress keys for existing users
 * who never had the flag set explicitly.
 */
export function shouldSkipOnboarding(): boolean {
  if (isFirstRunDone()) return true;

  // Fallback: if profil-scoped story-progress keys exist, treat as returning user
  try {
    const scopedKeys = pStorage.allScopedKeys();
    const hasProgress = scopedKeys.some((k) => k.includes('aym_story_progress_'));
    if (hasProgress) {
      markFirstRunDone(); // backfill the flag for this profile
      return true;
    }
  } catch {
    // ignore
  }

  return false;
}
```

- [ ] **Step 3: Manuell testen — Szenario A (Erstbesucher, kein Profil)**

Öffne die App im Browser. Öffne DevTools → Application → Local Storage.
Stelle sicher, dass weder `aym_first_run_done` noch irgendwelche `aym_p_*` Keys vorhanden sind.
Lade die App. Erwartung: `shouldSkipOnboarding()` gibt `false` zurück → Home-Seite zeigt Amy-Intro-Block und `isFirstTime = true`.

- [ ] **Step 4: Manuell testen — Szenario B (Legacy-Migration)**

Setze in DevTools → Local Storage manuell: Key `aym_first_run_done`, Value `true`.
Lade die App (mit einem aktiven Profil).
Erwartung: `isFirstRunDone()` liest den legacy Key, migriert ihn zu `aym_p_{id}__aym_first_run_done`, löscht den alten Key.
Prüfen: Nach Reload existiert nur noch `aym_p_{id}__aym_first_run_done = 'true'`, kein `aym_first_run_done` mehr.

- [ ] **Step 5: Manuell testen — Szenario C (Neues Profil bei bestehendem Setup)**

Gehe zu Einstellungen → neues Profil anlegen (z.B. "Lena").
Wähle das neue Profil aus.
Erwartung: App leitet auf `/start` (Onboarding) weiter — ProfileSelect macht das bereits mit `window.location.hash = '#/start'`.
Gehe danach zu `/` (Home). Erwartung: `isFirstTime = true` → Amy-Intro sichtbar, da `aym_p_{lena_id}__aym_first_run_done` noch nicht gesetzt.

- [ ] **Step 6: Manuell testen — Szenario D (bestehendes Profil unverändert)**

Wechsle zurück zu Profil A (dem alten).
Erwartung: `isFirstRunDone()` findet `aym_p_{A_id}__aym_first_run_done = 'true'` → `isFirstTime = false` → keine Intro, normaler Home-Content.

- [ ] **Step 7: Commit**

```bash
git add src/common/firstRun.ts
git commit -m "fix: make first-run flag profile-scoped via pStorage

New profiles in a multi-profile setup were incorrectly treated as
returning users because aym_first_run_done was stored device-wide.
Now uses pStorage so each profile has its own onboarding state.
Legacy device-wide flag is migrated on first read and then removed."
```

---

### Task 2: `aym_first_run_done` zu LEGACY_STATIC_KEYS hinzufügen

**Files:**
- Modify: `src/profile/profileIndex.ts` — Array `LEGACY_STATIC_KEYS` (Zeile ~19)

**Interfaces:**
- Consumes: nichts Neues
- Produces: `LEGACY_STATIC_KEYS` enthält `'aym_first_run_done'`

**Kontext / warum:**
- `migrateToMultiProfile()` kopiert bei Erst-Migration alle LEGACY_STATIC_KEYS ins neue Profil-Format
- Ohne diesen Eintrag würde ein Nutzer, der die App zum allerersten Mal nach unserem Fix installiert und bereits einen alten localStorage-Dump importiert hat, den Key verpassen
- Für die meisten bestehenden Nutzer ist das irrelevant (Migration lief schon), aber es ist die korrekte Deklaration

- [ ] **Step 1: Zeile in LEGACY_STATIC_KEYS einfügen**

Öffne `src/profile/profileIndex.ts`. Finde `const LEGACY_STATIC_KEYS = [` (ca. Zeile 19).
Füge `'aym_first_run_done'` zur Liste hinzu, nach `'aym_transfer_last_export_v1'`:

```typescript
const LEGACY_STATIC_KEYS = [
  'aym_user_profile',
  'aym_seen_bonus_v1',
  'aym_bonus_markers_v1',
  'aym_story_v02_input_responses',
  'aym_story_v02_item_responses',
  'aym_story_v02_reflection_responses',
  'aym_story_v02_challenge_status',
  'aym_story_v02_topic_seen',
  'aym_article_read_v1',
  'aym_article_reactions_v1',
  'aym_seen_stickers_v1',
  'aym_diary_me_v1',
  'aym_diary_pin_hash_v1',
  'aym_diary_pin_hint_v1',
  'aym-gate-last-completed-ts',
  'aym_fast_gate',
  'aym_transfer_last_export_v1',
  'aym_first_run_done',       // ← NEU: profil-scoped seit 2026-08-06
];
```

- [ ] **Step 2: TypeScript-Build prüfen**

```bash
npx tsc --noEmit
```

Erwartung: Keine Fehler.

- [ ] **Step 3: Commit**

```bash
git add src/profile/profileIndex.ts
git commit -m "fix: add aym_first_run_done to LEGACY_STATIC_KEYS for migration"
```
