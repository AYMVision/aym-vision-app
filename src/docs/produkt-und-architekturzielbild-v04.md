# Anforderungs- und Zielkatalog v04  
## Neue Story-, Interaktions- und Mess-Engine für Amy Surfwing

---

## 1. Zweck dieses Dokuments

Dieses Dokument dient gleichzeitig als:

- fachliche Leitplanke
- Umsetzungsgrundlage für den Code
- Entscheidungsdokument
- Startpunkt für die konkrete Implementierungsplanung

Es beschreibt die Zielarchitektur und die fachlichen Anforderungen für die neue Story-, Interaktions- und Mess-Engine der PWA **Amy Surfwing**.

---

## 2. Zielbild des Systems

Die PWA soll künftig vier Dinge gleichzeitig leisten:

1. eine emotionale, chatartige, kindgerechte Story-Erfahrung bieten
2. Kinder aktiv und natürlich in die Handlung einbinden
3. verdeckte Wirkungsmessung über ausgewählte Interaktionen ermöglichen
4. langfristig ausbaufähig bleiben, ohne dass die Story-Engine unbeherrschbar wird

Die App darf sich **nicht** wie ein Test, Arbeitsblatt oder Diagnose-Tool anfühlen.

Sichtbar für Kinder bleiben primär:

- Story
- Entscheidungen
- Reaktionen von Amy oder anderen Figuren
- Reflexion
- kleinere Impulse und Challenges
- Belohnungen / Fortschritt

Die Messung läuft im Hintergrund und ist strukturell von der Story getrennt, ohne die Story zu zerstören.

---

## 3. Produktprinzipien

### 3.1 Story first

Die Story bleibt das führende Element.  
Interaktionen dürfen sie ergänzen, aber nicht dominieren.

### 3.2 Kein Testgefühl

Es gibt:

- kein „richtig/falsch“
- keine rote/grüne Bewertungslogik
- keine offene Punktanzeige im Storyfluss
- keine schulische Prüfungsoptik

### 3.3 Lernspur statt Diagnose

Das System erzeugt intern Lern- und Entscheidungsspuren.  
Es darf sich weder intern noch im UI als psychologische Diagnostik verhalten.

### 3.4 Technische Trennung statt Vermischung

Folgende Bereiche müssen sauber getrennt modelliert werden:

- Story
- Input / Beteiligung
- Mess-Item
- Reflexion
- Amy-Reaktion
- Challenge
- Fortschritt
- Gating
- Belohnung
- lokale Speicherung

### 3.5 Zukunftsfähige Architektur

Die neue Struktur muss so gebaut werden, dass später möglich sind:

- neue Step-Typen
- neue Dimensionen
- neue Indikatoren
- Auswertungen
- Elternübersichten
- lokaler Export/Import
- optionales Backend

ohne das gesamte System neu aufbrechen zu müssen.

---

## 4. Bestehende Randbedingungen des Produkts

### 4.1 Bestehendes UI-Grundgefühl bleibt erhalten

Das aktuelle Layout, der visuelle Stil und die chatartige Darstellung bleiben grundsätzlich erhalten.

Insbesondere:

- `Layout`
- `Phone`
- `ChatMessage`
- existierende Story-Optik
- Belohnungseffekte
- bestehende Navigation
- bestehende Profil-, Album- und Elternseiten

sollen nicht grundlos neu erfunden werden.

### 4.2 i18n ist durchgängig verpflichtend

Alle neuen **sichtbaren Texte** müssen i18n-fähig modelliert werden.

Das gilt insbesondere für:

- Step-Texte
- Labels
- Buttontexte
- Statusanzeigen
- Kompetenz- / Lernspurtexte
- Elterntexte
- Fehlermeldungen
- Validierungstexte

Es dürfen keine neuen harten UI-Texte ungeplant im Code landen.

### 4.3 Bestehende Medienstrategie bleibt erhalten

Wo Bilder genutzt werden, soll die bestehende Strategie weiter genutzt werden:

- `SmartImage`
- `assetUrl`
- responsive Candidate-Logik
- performante Assets
- PWA-freundliche Mediennutzung

Neue Step-Komponenten sollen sich daran orientieren.

### 4.4 Gating bleibt Bestandteil des Systems

Die bestehende Logik für:

- Reihenfolge
- Daily Limit
- Weekly Limit
- Rewatch
- Bypass / Entitlements

bleibt relevant und muss mit der neuen Engine zusammengedacht werden.

---

## 5. Grundmodell der neuen Story-Engine

### 5.1 Bisheriges Modell

Bisher ist ein Chapter im Kern vor allem:

- `messages[]`
- mit Frageindex
- Tippindex
- Stopindex
- einer User-Antwort
- Amy-Reaktion
- anschließendem Weiterlauf

Dieses Modell ist für die neue Zielsetzung zu starr.

### 5.2 Neues Modell

Ein Chapter besteht künftig aus einer geordneten Sequenz von **Steps**.

Ein Step ist eine fachlich eigenständige Einheit, zum Beispiel:

- Storyblock
- Inputblock
- Mess-Item
- Amy-Feedback
- Reflexion
- Amy-Reaktion
- Challenge

Die Runtime arbeitet daher nicht mehr nur mit:

- Chapter
- Message-Index

sondern mit:

- Chapter
- Step
- Step-Phase / Interaktionszustand

---

## 6. Verbindliche Step-Typen

Die Engine muss mindestens folgende Step-Typen unterstützen.

### 6.1 `story`

**Zweck**  
Darstellung normaler Story-Nachrichten.

**Eigenschaften**

- enthält klassische Chat-Messages
- kann Bilder, Audio, Reaktionen und Systemnachrichten enthalten
- keine Eingabe
- keine Messung
- läuft automatisch oder im Instant-Modus durch
- kann wie bisher gruppiert und in Chat-Räume eingebettet sein

**Anforderung**  
`story` ist der Standardtyp und muss vollständig mit der bestehenden Chatdarstellung kompatibel sein.

---

### 6.2 `input`

**Zweck**  
Leichte Beteiligung des Kindes innerhalb der Story, ohne Messung.

**Beispiele**

- „Hallo, bist du neu hier?“
- „Wie würdest du dich nennen?“
- „Was würdest du hier antworten?“

**Eigenschaften**

- keine Messung
- kein Score
- keine Dimension
- kein Indikator
- offen oder choice-basiert möglich
- Antwort wird nur für Verlauf / Resume gespeichert
- Amy muss hier nicht bewerten

**Sicherheitsregel für v1**

- leere Eingabe nicht zulassen, wenn `required`
- Maximallänge begrenzen
- trimmen / normalisieren
- keine komplexe Inhaltsprüfung
- keine pädagogische Bewertung
- kein Retry-System

**Produktregel**  
Auch unspezifische oder alberne Eingaben dürfen in der Regel akzeptiert und überspielt werden.

---

### 6.3 `item`

**Zweck**  
Verdeckte Wirkungsmessung.

**Eigenschaften**

- genau 4 Antwortoptionen
- jede Option hat einen Score von `0` bis `3`
- jedes Item gehört genau zu:
  - einer Dimension
  - einem Indikator
- Antwortauswahl wird gespeichert
- direkte sichtbare Wertung unterbleibt
- aus der Auswahl kann ein Amy-Feedback folgen

**Produktregel**  
Ein `item` darf sich für Kinder nicht wie ein Test anfühlen.

**Validierungsregel**  
Ein Item ist nur gültig, wenn:

- `id` vorhanden
- `dimension` vorhanden
- `indicatorId` vorhanden
- Frage vorhanden
- genau 4 Optionen vorhanden
- jede Option hat:
  - `id`
  - sichtbaren Text
  - Score `0–3`

---

### 6.4 `amy_feedback`

**Zweck**  
Sichtbare Reaktion auf die gewählte Item-Option.

**Eigenschaften**

- eigener Step-Typ
- gehört nicht als UI-Einheit direkt zum Item selbst
- basiert auf der gewählten Option
- ist optional
- kann aus einfachem Text oder mehreren Segmenten bestehen

**Produktregel**  
Amy reagiert beschreibend, öffnend und weiterführend – nicht strafend.

**Architekturregel**  
Im Content darf Feedback an einer Option hängen.  
In der Runtime wird es aber als eigener darstellbarer Step behandelt.

---

### 6.5 `reflection`

**Zweck**  
Weiterdenken nach einer Situation oder Entscheidung, ohne Messung.

**Eigenschaften**

- kein Score
- keine Dimension
- kein Indikator
- offen oder choice-basiert
- optional mit nachfolgender Amy-Reaktion
- Antwort wird lokal gespeichert
- standardmäßig keine Auswertung in Kompetenzwerte

**Zusätzliche Typisierung**  
Ein Reflection-Step kann optional eine Zusatzklassifikation tragen, zum Beispiel:

- `FEELING`
- `ACTION`
- `PERSPECTIVE`
- `KNOWLEDGE`
- `CHALLENGE`
- `GENERAL`

Diese Zusatzklassifikation ist Hilfslogik, nicht der primäre Step-Typ.

---

### 6.6 `amy_reaction`

**Zweck**  
Sichtbare Reaktion auf eine Reflection-Antwort.

**Eigenschaften**

- eigener Step-Typ
- nicht gescort
- eher spiegelnd, vertiefend, öffnend
- optional
- kann einfach oder segmentiert modelliert sein

**Produktregel**  
Amy bleibt Coach, nicht Prüferin.

---

### 6.7 `challenge`

**Zweck**  
Kurzer Impuls für Transfer in den Alltag.

**Eigenschaften**

- eigener Step-Typ
- kein Score
- keine Dimension
- keine Bewertung
- zunächst nur Text
- optional kann später ein Status gespeichert werden

**Festlegung für v1**

Für die erste Ausbaustufe reicht:

- Anzeige des Challenge-Texts
- optional Speicherung `seen = true`

Nicht nötig für v1:

- `done`
- `skipped`
- Challenge-Erfolg

---

## 7. Zulässige Step-Sequenzen

Die Engine darf keinen festen Universalablauf voraussetzen.

Zulässige Beispiele:

- `story → item → story`
- `story → item → amy_feedback → story`
- `story → input → story → item → amy_feedback → reflection → amy_reaction → story`
- `story → item → reflection → amy_reaction → challenge → story`
- `story → input → story → challenge → story`
- `story → input → story → item → story`

Die Runtime muss deshalb pro Step-Typ entscheiden, was als Nächstes passiert.

---

## 8. Sichtbarkeits- und Verlaufsregeln

### 8.1 Grundregel

Story muss nachlesbar bleiben.

### 8.2 Story-Nachrichten

Bleiben immer sichtbar.

### 8.3 Input-Antworten

Bleiben als User-Verlaufsbestandteil sichtbar.

Nicht sichtbar bleiben soll:

- die aktive offene Input-Karte nach Abschluss

Stattdessen:

- abgeschlossene Darstellung im Verlauf

### 8.4 Item-Antworten

Die Auswahl soll nach Abschluss sichtbar bleiben, aber nicht als aktive Karte.

**Empfohlene Darstellung**

- kompakte abgeschlossene Entscheidungsdarstellung
- gewählte Option sichtbar
- keine offenen Buttons mehr

### 8.5 Amy-Feedback / Amy-Reaktion

Bleiben sichtbar.

### 8.6 Reflection-Antworten

Bleiben als abgeschlossene Verlaufsbestandteile sichtbar.

### 8.7 Challenge

Bleibt als kurzer Impuls sichtbar, aber nicht als aktive Eingabekarte.

### 8.8 Resume-Regel

Bereits abgeschlossene Interaktionen dürfen im Resume nicht erneut als offene Interaktion erscheinen.

---

## 9. Runtime-Modell

### 9.1 Mindestinformationen der Runtime

Sie muss mindestens kennen:

- aktuelles Chapter
- aktuellen Step
- aktuellen Phasenzustand
- bereits gezeigte Story-Nachrichten
- welche Step-Interaktionen bereits abgeschlossen wurden

### 9.2 Minimale Runtime-Phasen

Empfohlen für v1:

- `playing_story`
- `awaiting_input`
- `awaiting_item_choice`
- `showing_amy_feedback`
- `awaiting_reflection`
- `showing_amy_reaction`
- `showing_challenge`
- `chapter_finished`
- `episode_finished`

Technische Namen dürfen abweichen, die Unterscheidung muss aber vorhanden sein.

### 9.3 Konsequenz

Die bisherige Logik mit:

- `questionIndex`
- `tipIndex`
- `stopIndex`

ist für die neue Engine kein tragfähiges Hauptmodell mehr.

---

## 10. Datenmodell für Wirkungsmessung

### 10.1 Verbindliche Dimensionen

Die Engine muss folgende Dimensionen unterstützen:

- Perspektivfähigkeit
- Urteilsvermögen
- Selbststeuerung
- Verantwortung

### 10.2 Indikatoren

Indikatoren werden als IDs geführt.

**Anforderung**

- jedes Item hat genau eine Dimension
- jedes Item hat genau einen Indikator
- Indikatoren dürfen nicht frei erfundene Autorenstrings sein
- sie müssen aus einem zentralen validierbaren Katalog kommen

### 10.3 Empfehlung

Zentrale Registry-Dateien:

- `dimensionMeta.ts`
- `indicatorMeta.ts`

Spätere Änderungen an Indikatoren dürfen nicht still bestehende Daten zerstören.

---

## 11. Themen- und Medienkompetenz-Tracking

Neben den Messdimensionen gibt es thematische Lernfelder bzw. Medienkompetenz-Themen.

Beispielhaft bereits vorhanden über Theme-System:

- `info-check`
- `talk-act`
- `creative`
- `safe-online`
- `problem-solving`
- `reflect-understand`
- `fairness`

**Anforderungen**

- Themen dürfen getrennt von Messdimensionen gespeichert werden
- Themen werden nicht gescort
- Themen werden nicht als Kompetenzwerte interpretiert
- Themen dienen Lernhistorie, Sichtbarkeit und thematischer Auswertung

**Speicherebene**

Empfehlung:

- Speicherung auf Step-Ebene
- spätere Ableitung auf Chapter-, Episode- und Profil-Ebene

**Resume-Regel**

- Themen werden nicht im Story-Resume angezeigt

---

## 12. Amy-Feedback und Amy-Reaktionen: Modellierungsregeln

Es gibt zwei fachlich verschiedene Reaktionsarten.

### 12.1 Reaktion auf Item

- bezogen auf gewählte Option
- kann Wirkung, Risiko, Perspektive oder Impuls enthalten
- ist optional
- wird als `amy_feedback` modelliert

### 12.2 Reaktion auf Reflection

- bezogen auf Reflexionsantwort
- eher spiegelnd / weiterführend
- kein Score
- wird als `amy_reaction` modelliert

**Modellierungsempfehlung**

Die Datenstruktur soll nicht zu früh überverhärtet werden.

Amy-Inhalte sollen mindestens unterstützen:

- einfacher Text
- mehrere Textsegmente
- spätere strukturierte Ausbaustufen

---

## 13. Authoring- und Validierungsregeln

### 13.1 `story`

- beliebig viele Messages erlaubt

### 13.2 `input`

- keine Dimension
- kein Score
- offen oder choice
- bei choice nur definierte Optionen

### 13.3 `item`

- genau 4 Optionen
- jede Option braucht Score `0–3`
- jede Option braucht sichtbaren Text
- jedes Item braucht Dimension und Indikator

### 13.4 `reflection`

- kein Score
- offen oder choice
- optionale Amy-Reaktion

### 13.5 `challenge`

- kurzer Text
- keine Bewertung

### 13.6 Validierung

Beim Laden, Builden oder Authoring-Check muss geprüft werden, ob ein Chapter formal konsistent ist.

---

## 14. Lokale Speicherung

Da zunächst kein Backend vorgesehen ist, gilt:

### 14.1 Grundsatz

- lokal by default
- keine automatische Cloud
- keine automatische Synchronisierung
- keine stille Weitergabe

### 14.2 Zu speichernde Bereiche

#### A. Story-Fortschritt

- aktuelles Chapter
- aktueller Step
- aktuelle Phase
- angezeigte Story-Messages
- Snapshots für Resume

#### B. Item-Antworten

- Item-ID
- Dimension
- Indikator
- gewählte Option
- Score
- Timestamp

#### C. Reflection-Antworten

- Reflection-ID
- Antwort oder Option
- Timestamp

#### D. Input-Antworten

- Input-ID
- Eingabe oder Option

#### E. Challenge-Status

Für v1 mindestens:

- Challenge-ID
- `seen`

#### F. Themenhistorie

- welche Themen in welchen Steps vorkamen
- wie oft sie gesehen wurden

---

## 15. Umgang mit Freitext

### 15.1 Festlegung v1

Freitext aus `input` und `reflection` darf lokal gespeichert werden, damit:

- der Verlauf natürlich bleibt
- Kinder ihre Antwort wiedersehen
- Resume nicht bricht
- Storyfluss erhalten bleibt

### 15.2 Gleichzeitig gilt

Freitext soll in v1:

- nicht gescort werden
- nicht in Kompetenzwerte eingehen
- nicht standardmäßig in anonymen Export einfließen

**Produktregel**  
Freitext wird nur für Verlauf und Resume gebraucht, nicht für Wirkungsmessung.

---

## 16. Score-Logik

### 16.1 Pro Item

Antwortoptionen erhalten intern Scores von `0` bis `3`.

### 16.2 Pro Dimension

Späterer Aggregationswert über beantwortete Items dieser Dimension.

### 16.3 Wichtig

Rohscores werden intern berechnet, aber nicht im Storyfluss angezeigt.

### 16.4 Später möglich

- gleitende Durchschnitte
- letzte `n` Antworten
- Zeitverlauf
- stabilisierte Kompetenzspuren

---

## 17. Sichtbare Lernspur für Kinder und Eltern

### 17.1 Für Kinder

Die Anzeige muss weich, motivierend und entwicklungsorientiert sein.

**Empfohlene Sprachlogik**

- das zeigst du schon oft
- das wächst gerade weiter
- hier sammelst du noch Erfahrungen
- das kannst du weiter erkunden

### 17.2 Für Eltern

Sachlicher, aber nicht diagnostisch.

**Empfohlene Sprachlogik**

- schon häufiger sichtbar
- entwickelt sich weiter
- aktuell im Aufbau
- bisher noch wenig sichtbar

### 17.3 Nicht verwenden

- Anfänger
- schwach
- schlecht
- falsch

### 17.4 Fachregel

Die sichtbare Anzeige ist eine Lernspur, keine Diagnose.

---

## 18. Resume und Restore

### 18.1 Resume muss mindestens wiederherstellen können

- Chapter
- Step
- Phase
- bereits gezeigte Story-Nachrichten
- abgeschlossene Interaktionen
- sichtbares Amy-Feedback / Amy-Reaktion
- offene nächste Interaktion

### 18.2 Sichtbarkeitsregel bei Restore

**Sichtbar bleiben**

- bereits abgeschlossene Story- und Interaktionsverläufe

**Nicht wieder offen erscheinen**

- alte Auswahlbuttons
- alte offene Eingabekarten
- bereits abgeschlossene Items

### 18.3 Konsequenz

Der aktuelle Snapshot-Mechanismus muss erweitert oder neu modelliert werden.

---

## 19. UI-Anforderungen

Die Engine muss mehrere UI-Typen rendern können.

Mindestens nötig:

- Story-Nachricht
- System-Nachricht
- Input-Karte
- Item-Karte
- abgeschlossene Item-Darstellung
- Amy-Feedback-Karte
- Reflection-Karte
- Amy-Reaction-Karte
- Challenge-Karte

**Architekturregel**

Diese UI-Bausteine dürfen nicht alle direkt in `Story.tsx` landen.

**Empfohlene Richtung**

- `ChatMessage` bleibt für klassische Nachrichten
- neue Step-Komponenten werden separat gebaut

---

## 20. Gating und Entitlements

Die bestehende Gate-Logik bleibt Bestandteil des Systems und muss mit der neuen Engine kompatibel bleiben.

### 20.1 Bestehende Gate-Arten

- `need_previous`
- `daily_limit`
- `weekly_limit`
- `rewatch`
- `bypass`

### 20.2 Neue Anforderung

Gating darf nicht nur auf Message- oder Chapter-Ebene gedacht werden, sondern muss mit der Step-basierten Engine sauber zusammenspielen.

### 20.3 Fachregel

Gating blockiert:

- Start neuer Kapitel
- Fortsetzung regulär gesperrter Inhalte

Gating blockiert nicht:

- Rewatch
- Resume bereits zulässiger Inhalte
- Bypass- / Entitlement-Inhalte

### 20.4 UI-Regel

Daily- und Weekly-Hinweise bleiben kindgerecht und handlungsorientiert.

---

## 21. Belohnungen und Engine-Zusammenspiel

Das bestehende Reward-System bleibt relevant:

- Coins
- Episodensticker
- Sondersticker
- Wochenbadge
- Freundebuch
- Album

Die neue Engine muss diese Logik nicht neu erfinden, aber:

- sauber anbinden
- nicht verkomplizieren
- Interaktions- und Abschlusslogik damit kompatibel halten

---

## 22. Datenschutz, Sensibilität und Produktgrenzen

Die neue Architektur speichert Entscheidungen und Entwicklungsbereiche. Das ist sensibel und muss begrenzt werden.

Für v1 gilt verbindlich:

- lokale Speicherung als Standard
- Datenminimierung
- keine automatische Weitergabe
- Freitext nicht scoren
- keine psychologische Diagnostik
- später Elterntransparenz einplanen

**Fachliche Grenzziehung**

Die App sammelt:

- Entwicklungsbereiche
- Entscheidungsmuster im Storykontext
- thematische Nutzungsspuren

Sie betreibt **keine Diagnose**.

---

## 23. Backup, Export und Import

Diese Funktionen sind jetzt noch nicht Teil des direkten Umbaus, müssen aber architektonisch mitgedacht werden.

### 23.1 Später gewünschte Funktionen

- lokales Backup exportieren
- auf anderem Gerät importieren
- freiwilliger anonymer Export
- kein Freitext standardmäßig in Wirkungs-Export

### 23.2 Konsequenz für jetzt

Die Datenstruktur muss so sauber und modular sein, dass später Export/Import ohne Grundumbau möglich sind.

---

## 24. Löschung und lokale Kontrolle

Auch wenn lokal gespeichert wird, muss die Architektur eine saubere Löschbarkeit vorsehen.

Später muss möglich sein:

- Storyfortschritt löschen
- Interaktionsantworten löschen
- Messdaten löschen
- Themenhistorie löschen
- Snapshots löschen
- alle lokalen Lerndaten komplett löschen

**Architekturregel**  
Dafür soll ein zentraler Löschpfad vorgesehen werden, statt vieler verteilter Einzellösungen.

---

## 25. Migration

Die alte Story-Engine wird perspektivisch ersetzt.

### 25.1 Festlegung

Langfristig soll es kein Altformat parallel geben.

### 25.2 Empfohlene Vorgehensweise

Trotzdem nicht alles gleichzeitig umbauen:

1. neue Engine-Struktur bauen
2. Pilot-Chapter / Pilot-Episode migrieren
3. Runtime und Resume testen
4. UI validieren
5. erst danach restliche Stories umstellen

---

## 26. Technische Konsequenzen des Umbaus

Betroffen sind mindestens:

- Story-Datenmodell
- Runtime
- Resume / Restore
- lokale Speicherung
- neue UI-Komponenten
- Validierung
- Authoring-Struktur
- Gate-Übergänge
- Reward-Anbindung
- Profil- / Elternsicht für spätere Auswertung

Besonders kritisch:

- Step-State-Logik
- Restore
- Sichtbarkeitsregeln
- Trennung von Messung und Reflexion
- Vermeidung von `Story.tsx`-Monolithen

---

## 27. Nicht empfohlene Lösungswege

Folgende Ansätze sollen bewusst vermieden werden:

- weitere Logik auf `questionIndex`, `tipIndex`, `stopIndex` stapeln
- neue Interaktionen als Sonderfälle in `messages[]` hineinpressen
- Messung und Reflexion im selben Antwortarray vermischen
- Freitext in Messlogik einbauen
- alle neuen UI-Typen direkt in `Story.tsx` implementieren
- Indikatoren als freie Autorenstrings behandeln
- Themen-Tracking und Messdimensionen vermengen

---

## 28. MVP-Scope für den Umbau

Für die erste neue Architektur müssen zwingend umgesetzt werden:

- neue Step-Struktur
- `story`
- `input`
- `item`
- `amy_feedback`
- `reflection`
- `amy_reaction`
- `challenge`
- Step-basierte Runtime
- lokale Speicherung getrennt nach Typ
- Step-basiertes Resume / Restore
- Score-Berechnung im Hintergrund
- Themen-Tracking
- Validierungsgrundlagen
- Sichtbarkeitsregeln für abgeschlossene Interaktionen

Noch nicht nötig für den ersten Umbau:

- Backend
- Multi-Device-Sync
- finaler Elternbereich
- Export- / Import-UI
- anonymer Export
- vollständiges Kompetenzdashboard
- finale Forschungsansicht

---

## 29. Qualitätsanforderungen an die Umsetzung

### 29.1 Modularität

Neue Step-Komponenten, Runtime-Logik und Datenspeicherung müssen modular aufgebaut sein.

### 29.2 Lesbarkeit

Der Code soll langfristig wartbar bleiben.  
Fachliche Logik darf nicht unkontrolliert in `Story.tsx` wachsen.

### 29.3 Idempotenz

Restore, Rewarding und Completion dürfen bei Wiederholung keine Doppelzustände erzeugen.

### 29.4 Stabilität

Unterbrechungen wie:

- Modal öffnen
- zurückkehren
- neu laden
- Instant- / Cinematic-Modus
- Tageslimit-Hinweise

dürfen den Zustand nicht kaputt machen.

### 29.5 Internationalisierung

Alle neuen sichtbaren Texte müssen i18n-fähig modelliert werden.

### 29.6 Performance

Medien, Step-Rendering und Resume dürfen die PWA nicht unnötig schwer machen.

---

## 30. Zusammenfassung in einem Satz

Die neue Engine schafft eine flexible, step-basierte Story-Architektur, in der Story, Beteiligung, verdeckte Messung, Reflexion, Amy-Reaktionen, Challenges, Gating, Rewards und lokale Speicherung sauber getrennt, kindgerecht sichtbar und langfristig ausbaubar zusammenspielen – ohne dass sich die App wie ein Test anfühlt.

---

## 31. Umsetzungsreihenfolge

### Phase 1 – Technische Zielarchitektur festziehen

Als Nächstes braucht das Projekt:

- konkrete TypeScript-Typen
- Dateistruktur
- Zustandsmodell
- Speichermodell
- Umbaureihenfolge

### Phase 2 – Pilot-Engine bauen

Dann:

- neue Engine-Skeletons
- neue Step-Komponenten
- neue Runtime
- Speicheradapter
- ein Pilot-Chapter migrieren

### Phase 3 – Verhalten testen

Dann:

- Resume
- Restore
- Übergänge
- Sichtbarkeit
- Rewards
- Daily / Weekly Gates
- Instant / Cinematic

### Phase 4 – restliche Stories migrieren

Erst wenn der Pilot stabil ist.

---

## 32. Rolle der KI in der neuen Architektur

Die KI-Integration ist relevant, aber **nicht als erster Architekturkern**.

### 32.1 Grundsatz

Die Engine-Struktur wird nicht von KI bestimmt.  
KI ist ein austauschbarer Reaktionsbaustein.

### 32.2 Architekturprinzip

Die Engine entscheidet, **wann** eine Amy-Reaktion gebraucht wird.  
Der jeweilige Step liefert den Kontext.  
Ein Amy-Reaktionsmodul entscheidet dann, **wie** der sichtbare Text entsteht.  
Die Runtime rendert das Ergebnis.

### 32.3 Relevante Step-Typen für KI

Primär relevant für:

- `amy_feedback`
- `amy_reaction`

Optional später:

- adaptive Challenges
- personalisierte Impulse
- Variation von Formulierungen

Nicht primär KI-getrieben sein sollten:

- `story`
- `input`
- `item`
- `challenge`
- Resume
- Storage
- Gating

### 32.4 Empfehlung für v04

Die Architektur trennt zwei Ebenen:

#### A. Fachliche Reaktion

Was soll Amy inhaltlich tun?

Zum Beispiel:

- spiegeln
- beschreiben
- Konsequenz benennen
- Perspektive öffnen
- Impuls geben

#### B. Text-Erzeugung

Wie wird daraus Text?

Zum Beispiel:

- fest im Content definiert
- regelbasiert gebaut
- über bestehendes `runAmy`
- später über andere Engines

### 32.5 Ziel

Nicht:

> „Story ruft irgendwo Amy auf und hofft, dass etwas zurückkommt“

Sondern:

> „Step X braucht jetzt eine Amy-Reaktion dieses Typs mit diesem Kontext“

---

## 33. Empfohlene technische Zielstruktur

```text
src/story-v02/
  content/
    de/
      s1e01.de.ts
      s1e02.de.ts
    en/
      s1e01.en.ts
      s1e02.en.ts
    getPlayableEpisodeV02.ts

  types/
    storyTypes.ts
    storyRuntimeTypes.ts
    measurementTypes.ts
    dimensionMeta.ts
    indicatorMeta.ts

  runtime/
    storyRuntimeReducer.ts
    storyStepNavigator.ts
    storySessionSnapshotStore.ts
    storyResponseStore.ts
    storyTopicStore.ts
    storyCompletionBridge.ts

  components/
    StoryMessageStep.tsx
    InputStepCard.tsx
    ItemStepCard.tsx
    CompletedItemStepCard.tsx
    AmyFeedbackStepCard.tsx
    ReflectionStepCard.tsx
    AmyReactionStepCard.tsx
    ChallengeStepCard.tsx
    StoryStepRenderer.tsx