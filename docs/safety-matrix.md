# Amy Surfwing – Safety-Matrix

Zielgruppe: Kinder 9–13 Jahre · Sprachen: DE, EN (IT/ES geplant)
Stand: 2026-09-22

Diese Matrix legt fest, wie das System bei jeder Eingabe-Kategorie reagiert.
Sie ist Grundlage für die technische Umsetzung und kann bei Jugendschutz-Prüfungen vorgelegt werden.

---

## Reaktionsstufen (Übersicht)

| Stufe | Name | Bedeutung |
|---|---|---|
| 0 | Durchlassen | Kein Eingriff, Text wird normal verarbeitet |
| 1 | Sprachnudge | Freundlicher Hinweis, Kind kann nochmal schreiben oder trotzdem fortfahren |
| 2 | Soft-Block | Text wird nicht übernommen, Amy reagiert mit pädagogischer Antwort, Story pausiert kurz |
| 3 | Safety-Flow | Story pausiert vollständig, Amy zeigt Unterstützungs-/Krisentext, Kind muss bestätigen bevor es weitergeht |
| 4 | Silent-Lock | Kein Amy-Text mehr, nur Erwachsenen-Hinweis, Story kann nicht alleine fortgesetzt werden |

---

## Kategorie 1 — Vulgarität / Schimpfwörter

**Was gemeint ist:** Kraftausdrücke ohne direkten Angriff auf eine Person.

**Beispiele DE:** Scheiße, Mist, Verdammt, Kacke
**Beispiele EN:** Shit, Damn, Crap, Hell

**Erkennungsmethode:** Wortliste (LANGUAGE_WARNING_PATTERNS in contentFlags.ts)

| Frage | Antwort |
|---|---|
| Text gespeichert? | Ja |
| Amy-Reaktion | Stufe 1 — "Das klingt nicht so nett. Hast du andere Worte dafür?" |
| Flow unterbrochen? | Nein – Hinweis erscheint, beim zweiten Mal wird durchgelassen |
| Notfallressource? | Nein |

---

## Kategorie 2 — Persönliche Beleidigung / Mobbing

**Was gemeint ist:** Kind beleidigt eine andere Person direkt oder beschreibt Mobbing-Absicht.

**Beispiele DE:** "Du bist ein Arschloch", "Ich mach sie fertig", "Ich lache den aus"
**Beispiele EN:** "You're an idiot", "I'll destroy her"

**Erkennungsmethode:** Wortliste + Muster (SLUR_PATTERNS, BULLYING_APPROVAL_PATTERNS)

| Frage | Antwort |
|---|---|
| Text gespeichert? | Nein |
| Amy-Reaktion | Stufe 2 — "Hmm, so möchte ich das lieber nicht stehen lassen. Versuch es nochmal." |
| Flow unterbrochen? | Kurz – einmal Retry, danach weiter |
| Notfallressource? | Nein |

---

## Kategorie 3 — Diskriminierende Sprache / Hate Speech

**Was gemeint ist:** Slurs sowie gruppenbasierte Hassaussagen — rassistisch, homophob, transphob, ableistisch, antisemitisch oder sexistisch.

Das System erkennt zwei Typen:

**Typ A — Slurs (wortbasiert):** Werden unabhängig vom Satzkontext erkannt. Ein Slur ist ein Slur, egal ob als Frage, Zitat oder Aussage. Abgedeckte Kategorien:
- Ableistisch (DE/EN): z. B. Begriffe für Menschen mit Behinderung als Schimpfwort
- Homophob / transphob (DE/EN): einschlägige Slurs
- Rassistisch (DE/EN): häufigste Slurs im deutschen und englischen Sprachraum, inkl. Zahlersatz-Varianten (z. B. `n3gger`)
- Antisemitisch (DE): zusammengesetzte Schimpfwörter
- Sexistisch: abwertende Bezeichnungen gegenüber Frauen

**Typ B — Gruppenbasierter Hass (Satzmuster):** Hassparolen und -konstruktionen wie "X raus", "alle X sind kriminell", Vernichtungsrhetorik, "ich hasse alle X".

**Bekannte Einschränkung:** Reine Wortlisten erkennen keine umschriebenen oder abgeleiteten Formulierungen. Wörter mit Doppelbedeutung (z. B. neutrale Selbstbezeichnung vs. Slur) werden im Zweifel konservativ geflaggt — bei einer Kinder-App ist das vertretbar.

| Frage | Antwort |
|---|---|
| Text gespeichert? | Nein |
| Amy-Reaktion | Stufe 2 — pädagogische Antwort, kein Begriff wird wiederholt |
| Flow unterbrochen? | Kurz – einmal Retry |
| Notfallressource? | Nein |

**Implementierung:** `SLUR_PATTERNS` + `GROUP_HATE_PATTERNS` in `src/ai/core/contentFlags.ts`

---

## Kategorie 4 — Sexuelle Inhalte

**Was gemeint ist:** Sexuelle Begriffe, Beschreibungen, Andeutungen.

**Beispiele DE:** Pornos, nackt, explizite Begriffe
**Beispiele EN:** Porn, nude, explicit terms

**Erkennungsmethode:** Wortliste (SEXUAL_PATTERNS)

| Frage | Antwort |
|---|---|
| Text gespeichert? | Nein |
| Amy-Reaktion | Stufe 4 — "Hol bitte kurz einen Erwachsenen dazu." |
| Flow unterbrochen? | Ja – vollständig, kein Weiterkommen ohne Bestätigung |
| Notfallressource? | Nein (außer Kontext deutet auf Missbrauch hin → siehe Kategorie 6) |

---

## Kategorie 5 — Gewalt / Drohung

**Was gemeint ist:** Kind droht einer anderen Person oder beschreibt Gewaltabsicht.

**Beispiele DE:** "Ich bring dich um", "Ich steche dich ab"
**Beispiele EN:** "I'll kill you", "I'm gonna hurt you"

**Erkennungsmethode:** Muster (VIOLENCE_PATTERNS)

| Frage | Antwort |
|---|---|
| Text gespeichert? | Nein |
| Amy-Reaktion | Stufe 4 — Erwachsenen-Hinweis |
| Flow unterbrochen? | Ja – vollständig |
| Notfallressource? | Nein (außer Selbstgefährdungskontext) |

---

## Kategorie 6 — Selbstverletzung / Suizid

**Was gemeint ist:** Kind äußert Gedanken zur Selbstverletzung, Suizid oder extremer Hoffnungslosigkeit.

**Beispiele DE:** "Ich will nicht mehr leben", "Ich ritz mich", "Es wäre besser wenn ich nicht mehr da wäre"
**Beispiele EN:** "I want to die", "I hurt myself", "I can't take it anymore"

**Erkennungsmethode:** Muster (SELF_HARM_PATTERNS) – bereits gut ausgebaut, kontextsensitiv

**Wichtiger Hinweis:** Ein Kind, das das schreibt, teilt möglicherweise etwas Wichtiges mit. Der Text darf nicht einfach blockiert werden.

| Frage | Antwort |
|---|---|
| Text gespeichert? | Ja – das Kind soll gehört werden |
| Amy-Reaktion | Stufe 3 — Krisentext mit Telefonseelsorge-Nummer (0800 111 0 111), kein Vorwurf |
| Flow unterbrochen? | Ja – Story pausiert, Kind bestätigt "Ich hab's gelesen" bevor es weitergeht |
| Notfallressource? | Ja – Telefonseelsorge immer anzeigen |

---

## Kategorie 7 — Misshandlung / Gewalt durch Erwachsene

**Was gemeint ist:** Kind beschreibt, dass es zuhause oder von Erwachsenen Gewalt erfährt.

**Beispiele DE:** "Mein Vater schlägt mich", "Zuhause passieren schlimme Dinge", "Ich hab Angst vor zu Hause"
**Beispiele EN:** "My dad hits me", "Bad things happen at home"

**Erkennungsmethode:** Muster (ABUSE_PATTERNS in contentFlags.ts) — implementiert

**Wichtiger Hinweis:** Amy sagt hier NICHT "Hol einen Erwachsenen dazu" — der Täter könnte genau diese Person sein. Stattdessen: Vertrauensperson + Nummer gegen Kummer.

| Frage | Antwort |
|---|---|
| Text gespeichert? | Ja |
| Amy-Reaktion | Stufe 3 — ABUSE_MESSAGE: einfühlsam, kein Vorwurf, Hinweis auf Vertrauensperson + 116 111 |
| Flow unterbrochen? | Ja – Story pausiert, Kind bestätigt "Ich hab's gelesen" |
| Notfallressource? | Ja – Nummer gegen Kummer (116 111) |

---

## Kategorie 8 — Grooming / Kontaktanbahnung durch Fremde

**Was gemeint ist:** Kind beschreibt, dass eine fremde Person Kontakt sucht, Bilder schickt oder zur Geheimhaltung auffordert.

**Beispiele DE:** "Jemand will mich treffen", "Er hat mir Bilder geschickt und gesagt ich soll nichts sagen", "Ein Fremder schreibt mir"
**Beispiele EN:** "Someone wants to meet me", "He sent me pictures and said keep it secret"

**Erkennungsmethode:** Bekanntes Risiko — technisch nicht zuverlässig umsetzbar mit Wortmustern.

**Grund:** Amy Surfwing behandelt Grooming und Online-Sicherheit als Lerninhalt in den Stories. Kinder beschreiben Story-Situationen ("Mia hat Bilder bekommen und sollte nichts sagen") in denselben Worten wie echte Erlebnisse — ein Wortmuster kann beides nicht unterscheiden. Eine Implementierung würde zu vielen Fehlalarmen führen und das Vertrauen der Kinder beschädigen.

**Konsequenz:** Keine Implementierung im Code. Die Kategorie bleibt hier dokumentiert als offene Lücke, die mit einem semantisch-kontextuellen Ansatz (z.B. KI-Moderation) in Zukunft angegangen werden kann.

| Frage | Antwort |
|---|---|
| Text gespeichert? | — |
| Amy-Reaktion | Nicht implementiert |
| Flow unterbrochen? | Nein |
| Notfallressource? | Nicht implementiert |

---

## Kategorie 9 — Essstörung / Körperbild

**Was gemeint ist:** Kind äußert problematische Gedanken zu Essen, Gewicht oder Körper.

**Beispiele DE:** "Ich esse schon Tage nichts", "Ich bin zu fett", "Ich will abnehmen egal wie"
**Beispiele EN:** "I haven't eaten in days", "I'm too fat", "I need to lose weight no matter what"

**Erkennungsmethode:** Muster (EATING_DISORDER_PATTERNS in contentFlags.ts) — implementiert

Vier Mustergruppen: Nahrungsrestriktion mit Zeitangabe, extremes Abnehmziel, Körperhass/negatives Körperbild, Purging. Erste-Person-Formulierungen reduzieren Fehlalarme durch Story-Beschreibungen.

**Wichtiger Hinweis:** Die Reaktion enthält bewusst keinen Kommentar zu Gewicht, Essen oder Aussehen — das kann bei Essstörungen schaden.

| Frage | Antwort |
|---|---|
| Text gespeichert? | Ja |
| Amy-Reaktion | Stufe 3 — EATING_DISORDER_MESSAGE: empathisch, kein Kommentar zu Körper/Gewicht, Hinweis auf Vertrauensperson + 116 111 |
| Flow unterbrochen? | Ja – Story pausiert, Kind bestätigt "Ich hab's gelesen" |
| Notfallressource? | Ja – Nummer gegen Kummer (116 111) |

---

## Kategorie 10 — Persönliche Daten

**Was gemeint ist:** Kind gibt echte Kontaktdaten ein, die im Story-Kontext nichts verloren haben.

**Beispiele:** Straße + Hausnummer, Telefonnummer (Muster: viele Ziffern), vollständiger Nachname + Ort

**Erkennungsmethode:** Muster (PERSONAL_DATA_PATTERNS in contentFlags.ts) — implementiert

Erkennt: deutsche Telefonnummern (0xxx, +49), Straßennamen + Hausnummer. Namen + Ortsangaben werden nicht erkannt (zu viele Fehlalarme).

**Hinweis:** Da Daten lokal gespeichert werden und nicht nach außen gehen, ist das Risiko begrenzt. Die Erkennung sensibilisiert Kinder trotzdem für den Umgang mit persönlichen Daten.

| Frage | Antwort |
|---|---|
| Text gespeichert? | Nein — Text wird geleert |
| Amy-Reaktion | Stufe 1 — PERSONAL_DATA_MESSAGE: freundlicher Hinweis, kein Block |
| Flow unterbrochen? | Einmalig — beim zweiten Versuch wird durchgelassen |
| Notfallressource? | Nein |

---

## Wo welche Kategorien aktiv sind

**Legende:** ✅ aktiv · ❌ bewusst weggelassen · — nicht sinnvoll

| Eingabebereich | Kat. 1–3 (Sprache/Hass) | Kat. 4–5 (Sexual/Gewalt) | Kat. 6 (Selbstverletzung) | Kat. 7+9 (Misshandlung/Essstörung) | Kat. 10 (Daten) |
|---|---|---|---|---|---|
| Story – Reflexionsschritte | ✅ | ✅ | ✅ | ✅ | ✅ |
| Story – Eingabeschritte ("Möchtest du schreiben…") | ❌ kein Amy-Response, kein pädagog. Nutzen | ✅ | ✅ | ✅ | ✅ |
| Charakter-Editor | ❌ kreatives Werkzeug, bewusst offen | ❌ | ❌ | ❌ | ❌ |
| Tagebuch | ❌ freies Schreiben wie Word, bewusst offen | ❌ | ❌ | ❌ | ❌ |
| Studio | ❌ freies Schreiben wie Word, bewusst offen | ❌ | ❌ | ❌ | ❌ |
| Profilname | — | — | — | — | — |

**Kat. 8 (Grooming)** ist in keinem Eingabebereich implementiert — bewusste Entscheidung wegen des Story-Kontext-Problems (siehe Kategorie 8).

---

## Notfallressourcen (DE)

- **Telefonseelsorge:** 0800 111 0 111 (kostenlos, 24/7) — bei Selbstverletzung / Suizid
- **Nummer gegen Kummer (Kinder):** 116 111 (kostenlos, Mo–Sa 14–20 Uhr) — bei Misshandlung, Grooming, Essstörung
- **Polizei:** 110 — bei akuter Gefahr (noch nicht in der App)

---

## Offene Punkte / Nächste Schritte

- [ ] Schimpfwortliste (Kat. 1) erweitern — LDNOOBW-DE als Rohstoffquelle
- [ ] Normalisierung verbessern: Leerzeichen zwischen Buchstaben, Zahlersetzungen (z. B. f*ck, arsch1och)
- [ ] IT/ES Sprachunterstützung: Wortlisten für Kategorien 1–3 ergänzen

---

## Offene Ideen (optional — Umsetzung prüfen)

**Elternbereich-Benachrichtigung bei kritischen Ereignissen**

Idee: Wenn eine Kategorie der Stufe 3 oder 4 ausgelöst wird, erscheint beim nächsten Öffnen des Elternbereichs ein diskreter Hinweis — ohne den genauen Text des Kindes zu zeigen, aber mit Kategorie und Zeitstempel. Dazu ein kleiner Badge am Elternbereich-Einstieg solange der Hinweis ungelesen ist. Speicherung lokal (localStorage), kein Server. Ziel: Eltern bekommen mit, dass etwas passiert ist, ohne dass das Vertrauen des Kindes gebrochen wird. Setzt voraus, dass Eltern den Elternbereich regelmäßig öffnen — kein Push möglich.
