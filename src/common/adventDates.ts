// src/common/adventDates.ts
// Berechnet Adventssonntage für ein gegebenes Jahr.
// Algorithmus: Der 4. Advent ist der letzte Sonntag vor oder am 25. Dezember.
// Die Advente 1–3 liegen jeweils 7, 14, 21 Tage früher.

export function getAdventSunday(year: number, advent: 1 | 2 | 3 | 4): Date {
  const christmas = new Date(year, 11, 25); // 25. Dezember
  const dow = christmas.getDay(); // 0=Sonntag, 1=Montag, ...
  const advent4 = new Date(year, 11, 25 - dow);
  const offset = (4 - advent) * 7;
  return new Date(advent4.getFullYear(), advent4.getMonth(), advent4.getDate() - offset);
}

/** Gibt zurück, ob heute auf oder nach dem nth Adventssonntag des aktuellen Jahres liegt. */
export function isAdventUnlocked(advent: 1 | 2 | 3 | 4): boolean {
  const now = new Date();
  const year = now.getFullYear();
  const unlockDate = getAdventSunday(year, advent);
  // Mitternacht des Freischaltdatums
  const unlockMidnight = new Date(unlockDate.getFullYear(), unlockDate.getMonth(), unlockDate.getDate());
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return todayMidnight >= unlockMidnight;
}

/** Formatiert das Freischaltdatum für die Anzeige (z. B. "30. November"). */
export function formatAdventUnlockDate(advent: 1 | 2 | 3 | 4, lang: 'de' | 'en' = 'de'): string {
  const now = new Date();
  const year = now.getFullYear();
  const d = getAdventSunday(year, advent);
  return d.toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-GB', {
    day: 'numeric',
    month: 'long',
  });
}
