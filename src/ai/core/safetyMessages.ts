// src/ai/core/safetyMessages.ts
// Feste Texte für alle Safety-Stufen — kein AI-Call nötig.

export const CRISIS_MESSAGE =
  'Das klingt ernst. 🦉 Ich mache mir Sorgen um dich.\n\nBitte sprich mit jemandem, dem du vertraust — einem Elternteil, einem Lehrer oder einem Freund.\n\nDu kannst auch jederzeit anonym anrufen:\n📞 Telefonseelsorge: 0800 111 0 111\nKostenlos · rund um die Uhr.';

// Wird im AR-Step angezeigt, ersetzt die normale fixedAmyReply nach einer Krisenaussage.
export const CRISIS_AMY_REPLY =
  'Ich hoffe, es geht dir gut. Falls du reden möchtest — die Telefonseelsorge ist immer für dich da: 0800 111 0 111.';

export const ABUSE_MESSAGE =
  'Das klingt schwer. Du hast es richtig gemacht, dass du das sagst. 🦉\n\nSprich bitte mit jemandem, dem du wirklich vertraust — einer Lehrerin, einem Lehrer oder einem anderen Erwachsenen, dem du sicher bist.\n\nDu kannst auch anonym anrufen:\n📞 Nummer gegen Kummer: 116 111\nKostenlos · Mo–Sa 14–20 Uhr';

export const EATING_DISORDER_MESSAGE =
  'Das klingt, als wärst du gerade unter Druck. Es ist mutig, dass du das sagst. 🦉\n\nDu verdienst Unterstützung — sprich bitte mit jemandem, dem du wirklich vertraust.\n\nDu kannst auch anonym anrufen:\n📞 Nummer gegen Kummer: 116 111\nKostenlos · Mo–Sa 14–20 Uhr';

export const NORM_VIOLATION_MESSAGE =
  'Hmm, so möchte ich das lieber nicht stehen lassen. Versuch es nochmal. 🙃';

export const PERSONAL_DATA_MESSAGE =
  'Echte Telefonnummern oder Adressen würde ich hier lieber nicht speichern. Schreib einfach etwas anderes. 🦉';

export const LANGUAGE_WARNING_MESSAGE =
  'Das klingt nicht so nett. Hast du andere Worte dafür?';
