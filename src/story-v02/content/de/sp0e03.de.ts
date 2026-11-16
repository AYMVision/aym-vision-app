// src/story-v02/content/de/sp0e03.de.ts
// Advents-Challenge: "Freundschaft auf Probe"

import type { Reaction } from '../../../common/types';
import { STORY_CHARACTERS as ch } from '../../../content/characters';
import type { StoryEpisodeV02 } from '../../types/storyTypes';
import {
  m, img, sysImg, typing, divider, bonusLink,
  privateChat, classChat, amyChat,
  GR, OR, AR, MIT, AF, CH,
  rc, inp, opt,
  S, C,
} from '../storyBuilder';

const R = (emoji: string, type?: string): Reaction => ({ emoji, type });

const B = (n: string) => `/media/story/episodes/sp0e03/${n}`;

// ─────────────────────────────────────────────────────────────────────────────
// KAPITEL 1 — Der fünfte Stern
// ─────────────────────────────────────────────────────────────────────────────

const c01 = C('sp0e03c01', 0, 'Amic 1', 'Der fünfte Stern', [

  S('sp0e03c01_privat_yasmin_lisa', [
    privateChat('Yasmin', 'Lisa'),
    divider('Privat · Yasmin und Lisa'),
    sysImg(B('sp0e03c01_01-512.webp')),
    m(ch.yasmin, 'Ihr habt die Sterne schon aufgehängt?', '15:21'),
    m(ch.lisa, 'Hast du sie schon gesehen? Ja, sieht doch toll aus, oder?', '15:22'),
    m(ch.yasmin, 'Ja.', '15:22'),
    m(ch.yasmin, 'Und meiner?', '15:23'),
    m(ch.lisa, 'Du warst nach der Sechsten doch schon weg. Oder?', '15:23'),
    typing('Yasmin schreibt'),
   typing('Yasmin löscht'),
    m(ch.yasmin, 'Ja.', '15:24'),
  ]),

  S('sp0e03c01_diary_entry1', [
    bonusLink('diary-yasmin-entry5', 'Yasmins Tagebuch', '/diaries/diary_yasmin?entry=sp0e03c01_0005', 'Eintrag lesen →'),
  ]),

  S('sp0e03c01_klassenchat_quiz', [
    classChat('Klasse 7b'),
    m(ch.lisa, '[[freundschaftsquiz]]: Wie gut kennst du mich?', '15:30'),
    img(ch.lisa, B('sp0e03c01_02-512.webp'), '15:30'),
    m(ch.yasmin, '9 von 10', '15:35', { reactions: [] }),
    m(ch.dominik, 'Lisas [[challenge]] Fanclub kennt natürlich alles.', '15:36'),
    m(ch.markus, 'Autogramm schon abgeholt?', '15:36'),
    m(ch.yasmin, '@Markus: Damit, wie man jemandem in den A.... kriecht, kennst du dich doch am besten aus.', '15:37'),
  ]),

  S('sp0e03c01_privat_yasmin_user_quiz', [
    privateChat('Yasmin', 'Du'),
    m(ch.yasmin, 'Hi, kennst du solche Freundschaftsquizze?'),
  ]),

  inp('sp0e03c01_input_quiz', 'stories:sp0e03.c01.input.quiz', {
    topics: ['reflect-understand'],
    promptSpeakerId: 'yasmin',
  }),

  S('sp0e03c01_privat_yasmin_user_erklärung', [
    m(ch.yasmin, 'Bei uns schickt die gerade jeder rum. Heute hat Lisa eine verschickt, dafür musste sie zuerst Fragen über sich beantworten. Das Quiz hat sie dann an mich und andere Freunde geschickt. Wir bekommen einen Punkt für jede Antwort, die mit der von Lisa übereinstimmt. Klingt ja erstmal ganz süß. Aber ganz ehrlich? Ich hab immer einen riesigen Stress, ob die anderen mehr Punkte haben als ich. Oder ich Fragen falsch beantworte. Dann fühle ich mich wie eine schlechtere Freundin. Ist das dumm?'),
  ]),

  inp('sp0e03c01_input_quiz2', 'stories:sp0e03.c01.input.quiz2', {
    topics: ['reflect-understand'],
    promptSpeakerId: 'yasmin',
  }),

  S('sp0e03c01_klassenchat_challenge_start', [
    classChat('Klasse 7b'),
    m(ch.lisa, 'Meine Cousine hatte mich für eine Challenge nominiert. War mega witzig. Jetzt starte ich meine eigene Weihnachts-Challenge. Igor, machst du auch mit?', '15:48'),
    m(ch.igor, 'Challenge wozu?', '15:49'),
    m(ch.lisa, 'Freundschaft 😊', '15:49'),
    m(ch.igor, 'Ich passe.', '15:50'),
    m(ch.dominik, 'Für jede Skate-Challenge zu haben, aber hier kneifst du? 😂', '15:50'),
    m(ch.igor, 'Ich mach, was ich für richtig halte.', '15:50'),
    m(ch.lisa, 'Wie du willst. Lukas und Tom machen mit. Drei Tage kann jeder Challenges für die Gruppe einstellen. Das wird witzig!', '15:51'),
    m(ch.carlos, 'Ich bin auch dabei.', '15:51'),
    m(ch.yasmin, 'Ich hätte schon eine Idee.', '15:52'),
    m(ch.yasmin, 'Ach so, darf ich überhaupt mitmachen?', '15:52'),
    typing('Markus schreibt'),
    typing('Markus löscht'),
    m(ch.lisa, 'Klar.', '15:53'),
    m(ch.lisa, 'Welche Idee?', '15:53'),
    m(ch.lisa, 'Warte, ich hab euch in eine private Gruppe eingeladen, dann stören wir die anderen nicht mit unseren Nachrichten.', '15:54'),
    typing('Markus schreibt'),
    m(ch.dominik, 'Besser so. Macht eure Kuschel-Challenge lieber woanders.', '15:55'),
    m(ch.carlos, 'Du bist ja nur neidisch.', '15:55'),
    typing('Markus schreibt'),
    typing('Markus löscht'),
  ]),

  S('sp0e03c01_gruppe_weihnachtscrew', [
    privateChat('Gruppe', 'Weihnachtscrew'),
    m(ch.lisa, 'Jetzt sind wir fünf ❤️', '15:56'),
    m(ch.lisa, '@Yasmin: Was war deine Idee von vorhin?', '15:56'),
    m(ch.yasmin, 'Unser erstes Weihnachts-Gruppenbild. Herausforderung: keiner darf darauf ein Mensch sein 😂', '15:57'),
    m(ch.lukas, 'Wann wollen wir uns dafür treffen?', '15:57'),
    m(ch.lukas, 'Moment mal... kein Mensch, wie stellst du dir das vor? 🤔 Magie?', '15:58'),
    m(ch.lisa, 'Ich könnte was malen.', '15:58'),
    m(ch.lukas, 'Oder wir kneten.', '15:59'),
    m(ch.lisa, 'Was sollen wir denn sein?', '15:59'),
    m(ch.yasmin, 'Rentiere? Schneemänner?', '16:00'),
    m(ch.lisa, 'Engel beim Schlittschuhlaufen vielleicht?', '16:00'),
    m(ch.carlos, 'Wartet. Ich hab eine Idee...', '16:01'),
  ]),

  S('sp0e03c01_privat_yasmin_user_figur', [
    privateChat('Yasmin', 'Du'),
    m(ch.yasmin, 'Was hat Carlos vor? Doch vielleicht Magie? 😂'),
  ]),

  S('sp0e03c01_amy_challenge_figur', [
    amyChat(),
    m(ch.amy, 'Was wärst du gern auf einem fiktiven Weihnachts-Gruppenbild? Denk dir eine Figur aus und gib ihr ein besonderes Merkmal. Ein Schneemann mit Kopfhörern? Ein Rentier auf Rollschuhen?'),
  ]),

  inp('sp0e03c01_input_figur', 'stories:sp0e03.c01.input.figur', {
    topics: ['talk-act'],
    promptSpeakerId: 'amy',
  }),

  S('sp0e03c01_gruppe_carlos_ergebnis', [
    privateChat('Gruppe', 'Weihnachtscrew'),
    divider('etwas später'),
    m(ch.carlos, 'Fertig. Die Weihnachtscrew ist jetzt essbar 😂', '16:20', { reactions: [R('❤️')] }),
    m(ch.lisa, 'Wie süß, du hast für uns gebacken?', '16:21'),
    img(ch.carlos, B('sp0e03c01_03-512.webp'), '16:21'),
    m(ch.lisa, '😂❤️ Das ist ja der Hammer! Wie hast du das denn gemacht?', '16:21'),
    m(ch.lukas, 'Respekt.', '16:21'),
    m(ch.yasmin, 'Wow, das könnte ich nie! Das essen wir aber nicht!', '16:22'),
    m(ch.carlos, 'Natürlich nicht. 😂 Ist KI.', '16:22'),
    m(ch.lisa, 'Was meinst du?', '16:22'),
    m(ch.carlos, 'Ich hab der KI beschrieben, wie wir als Lebkuchenfiguren aussehen sollen.', '16:23'),
    m(ch.lisa, 'Echt jetzt? 😕', '16:23'),
    m(ch.yasmin, 'Also ich find´s super! Wir alle 5 zusammen.', '16:23'),
    m(ch.tom, 'Hatte mich schon auf den Lebkuchen gefreut.', '16:24'),
    m(ch.lisa, 'Ich mich auch!', '16:24'),
    m(ch.lisa, '@Carlos: Den musst du uns jetzt aber trotzdem backen!', '16:24'),
    m(ch.lukas, 'Lisa hat recht. Wer uns virtuelle Kekse vorsetzt, schuldet uns echte.', '16:25'),
    m(ch.yasmin, 'Ich find das Bild trotzdem süß. Ich poste es gleich in meinen Status. ❤️', '16:25'),
    m(ch.carlos, '„Schreib [[ki-bild]] dazu. Sonst wollen nachher alle Kekse. 😂', '16:25'),
  ]),

  S('sp0e03c01_switch_amy', [
    amyChat(),
  ]),

  OR('sp0e03c01_or_freundschaft',
    'Yasmin macht sich Sorgen, ob andere die besseren Freunde sind, wenn sie mehr Quizpunkte haben. Was ist für dich an einer Freundschaft wichtig?',
    {
      topics: ['reflect-understand'],
      category: 'PERSPECTIVE',
      bypassAi: true,
      fixedAmyReply: 'Für mich ist Freundschaft wie ein guter Ast. Man muss nicht immer draufsitzen, aber es ist gut zu wissen, dass er da ist.',
    },
  ),

  AR('sp0e03c01_ar_freundschaft', 'sp0e03c01_or_freundschaft'),

  S('sp0e03c01_amy_tipp_quiz', [
    m(ch.amy, '💡 Über ein Quiz könnt ihr gemeinsam lachen. Die Punkte zeigen einfach, welche Antworten übereinstimmen. Sie sind keine Noten für eure Freundschaft.'),
  ]),

]);

// ─────────────────────────────────────────────────────────────────────────────
// KAPITEL 2 — Nur du fehlst noch
// ─────────────────────────────────────────────────────────────────────────────

const c02 = C('sp0e03c02', 1, 'Amic 2', 'Nur du fehlst noch', [

  S('sp0e03c02_gruppe_selfie_runde1', [
    privateChat('Gruppe', 'Weihnachtscrew'),
    m(ch.carlos, 'Zusatzrunde "Weihnachts-[[selfie]]". Zehn Minuten ab JETZT.', '16:30'),
    img(ch.lisa, B('sp0e03c02_01-512.webp'), '16:31'),
    img(ch.lukas, B('sp0e03c02_02-512.webp'), '16:32'),
    img(ch.yasmin, B('sp0e03c02_03-512.webp'), '16:33'),
    img(ch.carlos, B('sp0e03c02_04-512.webp'), '16:34'),
    m(ch.tom, 'Bin unterwegs, mache ich später.', '16:40'),
    m(ch.yasmin, '@Tom: Alle sind fertig. 😾 Nur du fehlst noch.', '16:41'),
    m(ch.yasmin, 'Komm schon. Ein Foto dauert doch nur zehn Sekunden.', '16:42'),
    m(ch.carlos, 'Er meldet sich nicht mehr.', '16:45'),
    m(ch.lukas, 'Wir brauchen einfach künftig feste Regeln. Wer zweimal zu spät postet, fliegt raus?', '16:46', { reactions: [R('👍')] }),
    m(ch.yasmin, "Sonst kann man's ja gleich lassen.", '16:46'),
    m(ch.tom, 'Das meint ihr doch nicht ernst? Ist doch nur ein Spiel.', '16:50'),
    m(ch.lisa, 'Markus macht ständig Andeutungen. Ich glaub, er würde auch gern mitmachen.', '16:51'),
    m(ch.yasmin, 'Markus?', '16:52'),
    m(ch.yasmin, 'Aber wir sind doch schon 5.', '16:52'),
    m(ch.tom, 'Dann wären wir halt 6.', '16:52'),
    m(ch.yasmin, 'Also ich glaub, das wäre zu viel.', '16:53'),
    m(ch.lisa, 'Ja, du hast recht.', '16:53'),
  ]),

  S('sp0e03c02_gruppe_selfie_runde2', [
    divider('16:54'),
    m(ch.carlos, 'Zusatzrunde: Foto mit etwas Rotem. Zehn Minuten.', '16:54'),
    img(ch.carlos, B('sp0e03c02_05-512.webp'), '16:55'),
    img(ch.lisa, B('sp0e03c02_06-512.webp'), '16:56'),
    img(ch.tom, B('sp0e03c02_07-512.webp'), '16:58'),
    img(ch.lukas, B('sp0e03c02_08-512.webp'), '17:00'),
    divider('17:05'),
    img(ch.yasmin, B('sp0e03c02_09-512.webp'), '17:06'),
    m(ch.yasmin, 'Mein Notenheft.', '17:06'),
    m(ch.carlos, '@Yasmin: Du warst eine Minute zu spät.', '17:06'),
    m(ch.yasmin, 'Ich war bei der Chorprobe.', '17:07'),
    m(ch.lukas, 'Das war Verspätung Nummer 1. Einmal hast du noch.', '17:07'),
  ]),

  S('sp0e03c02_gruppe_bart_challenge', [
    divider('später'),
    m(ch.tom, 'Mein Bruder hat sich beim Zähneputzen einen Weihnachtsmannbart gemacht 😂 Schafft ihr das auch?', '17:30'),
    m(ch.lukas, 'Bonus-Challenge! Zehn Minuten. Postet euer Foto im Status.', '17:31'),
  ]),

  S('sp0e03c02_klassenchat_falscher_chat', [
    classChat('Klasse 7b'),
    m(ch.yasmin, '@Tom: Mein Rasierschaum-Bart ist im Status. Gerade noch geschafft 😎', '17:39'),
  ]),

  S('sp0e03c02_privat_chioma_yasmin', [
    privateChat('Chioma', 'Yasmin'),
    m(ch.chioma, 'Zur Info: Du schreibst gerade im Klassenchat.', '17:40'),
    m(ch.yasmin, 'Ups, ein Versehen. Das passiert mir ständig. Ich lösche es schnell.', '17:41'),
    m(ch.yasmin, 'Oh nein, hoffentlich zählt mein Foto noch.', '17:41'),
    m(ch.chioma, 'Dein Foto? Yasmin, wir wollten doch zusammen Sterne basteln. Du wolltest längst bei mir sein.', '17:42'),
    m(ch.yasmin, 'Oh Mist.', '17:42'),
  ]),

  S('sp0e03c02_diary_entry2', [
    bonusLink('diary-yasmin-entry6', 'Yasmins Tagebuch', '/diaries/diary_yasmin?entry=sp0e03c02_0006', 'Eintrag lesen →'),
  ]),

  S('sp0e03c02_gruppe_weihnachtswunsch', [
    privateChat('Gruppe', 'Weihnachtscrew'),
    m(ch.lisa, 'Für morgen: Was haltet ihr davon? Was ist euer größter Weihnachtswunsch? Keine Geschenke, sondern was Persönliches.', '19:10'),
    m(ch.tom, 'Ich wünsche mir weniger Druck, immer erreichbar zu sein. 🙄', '19:12'),
    m(ch.yasmin, 'Meinst du damit unsere Challenge?', '19:13'),
  ]),

  S('sp0e03c02_switch_amy', [
    amyChat(),
  ]),

  GR('sp0e03c02_gr_backen',
    'Stell dir vor, du backst gerade. Im Chat startet eine Challenge, die du sofort beantworten sollst. Was würdest du machen?',
    [
      rc('a', 'Ich würde die Challenge sofort angehen.',
        'Das kann ich gut verstehen. Mich würde interessieren: Was würde dich daran eher reizen: die Aufgabe oder zur Gruppe dazuzugehören?',
      ),
      rc('b', 'Ich würde weiterbacken, aber immer wieder in den Chat gucken.',
        'Das kann ich gut verstehen. Mich würde interessieren: Warum? Was würdest du im Chat auf keinen Fall verpassen wollen?',
      ),
      rc('c', 'Ich würde schreiben: Geht auch später? Ich backe gerade.',
        'Das kann ich gut verstehen. Mich würde interessieren: Und was wäre, wenn die anderen sagen: „Dann bist du raus"?',
      ),
      rc('d', 'Ich würde diesmal aussetzen und weiterbacken.',
        'Das kann ich gut verstehen. Mich würde interessieren: Wie wäre es für dich, später die Fotos der anderen zu sehen?',
      ),
      rc('e', 'Ich würde mitmachen, obwohl ich gerade eigentlich keine Lust darauf habe.',
        'Das kann ich gut verstehen. Mich würde interessieren: Warum würdest du mitmachen, wenn du auf die Aufgabe keine Lust hättest?',
      ),
    ],
    { topics: ['talk-act', 'reflect-understand'] },
  ),

  AR('sp0e03c02_ar_backen', 'sp0e03c02_gr_backen'),

  S('sp0e03c02_amy_tipp_backen', [
    m(ch.amy, '💡 Auch wenn im Chat „sofort!" steht, solltest du dir einen Moment Zeit nehmen: Wenn du erst fertig backen möchtest, kannst du schreiben: „Ich schaue danach rein", und den Chat kurz stummschalten. Dann wirst du nicht von jeder Nachricht wieder neu abgelenkt.'),
  ]),

]);

// ─────────────────────────────────────────────────────────────────────────────
// KAPITEL 3 — Bewerbung um Freundschaft
// ─────────────────────────────────────────────────────────────────────────────

const c03 = C('sp0e03c03', 2, 'Amic 3', 'Bewerbung um Freundschaft', [

  S('sp0e03c03_klassenchat_freitag', [
    classChat('Klasse 7b'),
    divider('Freitag nach der Schule'),
    m(ch.lisa, 'Endlich Wochenende! 🌟', '14:03'),
    m(ch.yasmin, 'Hier noch für die Challenge von heute mein persönlicher Weihnachtswunsch.', '14:05'),
    m(ch.yasmin, 'Ich wünsche mir, dass wir auch nach den Challenges noch was zusammen machen. Ich hab manchmal Angst, dass ich nicht dazugehöre. Klingt blöd, ich weiß. Egal. Frohe Weihnachten.', '14:05'),
    m(ch.dominik, 'Yasmin sucht Freunde, lol. Die Bewerbung um Freundschaft ist eingegangen.', '14:06'),
    m(ch.markus, 'Darüber müssen wir erst noch beraten. 😂', '14:06'),
    m(ch.yasmin, '🙈 Schon wieder der falsche Chat. Das passiert mir ständig. Hab´s gelöscht.', '14:07'),
    m(ch.dominik, 'Das ist längst rum. 😈', '14:07'),
    m(ch.elsa, '🤭', '14:08'),
    m(ch.chioma, 'Lasst sie. Das war privat.', '14:08'),
    m(ch.yasmin, 'War doch nur gespielt. 😂', '14:09'),
  ]),

  S('sp0e03c03_privat_lisa_yasmin', [
    privateChat('Lisa', 'Yasmin'),
    m(ch.lisa, 'War das wirklich nur gespielt?', '14:12'),
    m(ch.yasmin, "Ja. Mir geht's super.", '14:13'),
  ]),

  S('sp0e03c03_diary_entry3', [
    bonusLink('diary-yasmin-entry7', 'Yasmins Tagebuch', '/diaries/diary_yasmin?entry=sp0e03c03_0007', 'Eintrag lesen →'),
  ]),

  S('sp0e03c03_switch_amy', [
    amyChat(),
  ]),

  OR('sp0e03c03_or_yasmin_nachricht',
    'Nach Yasmins Nachricht im falschen Chat: Was könntest du schreiben, damit sie sich weniger allein fühlt? Formuliere eine kurze Nachricht – für den Klassenchat oder direkt an sie.',
    {
      topics: ['talk-act'],
      category: 'ACTION',
    },
  ),

  AR('sp0e03c03_ar_yasmin_nachricht', 'sp0e03c03_or_yasmin_nachricht'),

  S('sp0e03c03_amy_tipp_nachricht', [
    m(ch.amy, '💡 Stell dir vor, dir wäre die Nachricht im falschen Chat gelandet. Was würdest du jetzt gern von den anderen lesen? Das kann dir helfen, eigene Worte für Yasmin zu finden. Ein kurzer, freundlicher Satz kann schon viel bedeuten.'),
  ]),

  S('sp0e03c03_gruppe_finale_ankuendigung', [
    privateChat('Gruppe', 'Weihnachtscrew'),
    divider('später'),
    m(ch.lisa, 'Jetzt kommt das große Finale. 💙 Hab die vier Sterne heute Morgen vom Fenster abgehängt. Challenge-Finale: Jeder hängt seinen an die Tanne am Schlittenhügel im Wald. Bis 18 Uhr.', '15:00'),
    m(ch.yasmin, 'Diesmal fehlt meiner nicht wieder. Die Weihnachtscrew rockt!', '15:02'),
    m(ch.tom, 'Bist du nicht bei deiner Oma?', '15:03'),
    m(ch.yasmin, 'Der erzähle ich schon irgendwas.', '15:04'),
    m(ch.tom, 'Eigentlich könnte ich jetzt fies sein, aber... Kein Stress, morgen wäre doch auch noch okay.', '15:05'),
    m(ch.yasmin, 'Challenge ist Challenge.', '15:06'),
  ]),

]);

// ─────────────────────────────────────────────────────────────────────────────
// KAPITEL 4 — Bleib da
// ─────────────────────────────────────────────────────────────────────────────

const c04 = C('sp0e03c04', 3, 'Amic 4', 'Bleib da', [

  S('sp0e03c04_gruppe_finale_unterwegs', [
    privateChat('Gruppe', 'Weihnachtscrew'),
    m(ch.carlos, 'Lukas und ich waren auch vorhin beim Hügel, Mission erfüllt.', '17:10'),
    m(ch.lukas, 'Achtung, es war ganz schön glatt.', '17:11'),
    m(ch.tom, 'Ich auch und auf dem Weg hab ich Lisa getroffen. 4 Sterne hängen.', '17:12', { replyTo: { text: 'Lukas und ich waren auch vorhin beim Hügel, Mission erfüllt.', speakerName: 'Carlos' } }),
    m(ch.lisa, 'Dieselben 4 wie am Fenster in der Schule. ⭐', '17:13'),
    m(ch.yasmin, '4 Sterne? Meiner kommt gleich.', '17:14'),
    m(ch.lisa, 'Wo bist du? Warst du noch gar nicht bei der Tanne?', '17:15'),
    m(ch.yasmin, 'Meine Oma... Ich konnte nicht früher.', '17:15'),
    m(ch.tom, 'Es ist längst dunkel. Da im Wald ist nicht mal Licht. Mach´s halt morgen.', '17:16'),
    m(ch.yasmin, 'Nein. Ich schaff das!', '17:16'),
  ]),

  S('sp0e03c04_gruppe_unterwegs', [
    divider('17:35'),
    m(ch.yasmin, 'Fast da.', '17:35'),
    img(ch.yasmin, B('sp0e03c03_01-512.webp'), '17:36'),
    m(ch.yasmin, 'Hier ist mein Stern. Nur noch ein kleines Stück.', '17:37'),
    m(ch.carlos, 'Der alte Zaun? Warte… Du bist auf dem falschen Weg!', '17:38'),
    m(ch.lisa, 'Yasmin, geh wieder zurück.', '17:38'),
    m(ch.yasmin, 'Ich nehme nur die Abkürzung. Passt schon.', '17:39'),
  ]),

  S('sp0e03c04_gruppe_sturz', [
    divider('17:49'),
    m(ch.yasmin, 'Hier liegt bloß mehr Schnee als …', '17:49'),
    m(ch.lisa, 'Als was?', '17:49'),
    m(ch.lisa, 'Yasmin?', '17:50'),
    m(ch.tom, 'Melde dich!', '17:50'),
  ]),

  S('sp0e03c04_privat_lisa_yasmin_sturz', [
    privateChat('Lisa', 'Yasmin'),
    divider('17:51'),
    m(ch.lisa, '📞 Anruf in Abwesenheit', '17:51'),
    m(ch.yasmin, 'Ich bin ausgerutscht. So ein Mist. Autsch.', '17:52'),
    m(ch.lisa, 'Bist du verletzt?', '17:52'),
    m(ch.yasmin, 'Weiß nicht. Ja. Mein Fuß tut weh. Aber es ist schon fast 6. Ich muss mich beeilen.', '17:52'),
    m(ch.lisa, 'Denk jetzt nicht an die Challenge. Sag mir lieber, wo du jetzt bist.', '17:53'),
    m(ch.yasmin, 'Ich weiß nicht genau. Und meine Mutter wär bestimmt super sauer.', '17:53'),
    m(ch.lisa, 'Schicke mir deinen Standort.', '17:54'),
    m(ch.yasmin, 'Mir ist so kalt.', '17:55'),
  ]),

  S('sp0e03c04_switch_amy_notfall', [
    amyChat(),
  ]),

  OR('sp0e03c04_or_verletzt',
    'Stell dir vor, ein Freund oder eine Freundin schreibt dir, er oder sie sei verletzt. Hat aber Angst davor, Ärger zu bekommen. Was würdest du antworten? Schreibe in deiner Nachricht auch, wie du Hilfe holen würdest.',
    {
      topics: ['talk-act'],
      category: 'ACTION',
    },
  ),

  AR('sp0e03c04_ar_verletzt', 'sp0e03c04_or_verletzt'),

  S('sp0e03c04_amy_tipp_notfall', [
    m(ch.amy, '💡 Du kannst die Angst vor Ärger ernst nehmen und trotzdem Hilfe holen: „Ich bleibe am Telefon und hole einen Erwachsenen dazu." Bei einem Notfall ruf 112, beschreibe den Ort und lass dich durch das Gespräch führen. Du musst die Situation nicht allein lösen.'),
  ]),

  S('sp0e03c04_privat_lisa_yasmin_rettung', [
    privateChat('Lisa', 'Yasmin'),
    divider('17:56'),
    m(ch.lisa, 'Gut, dass du deinen Standort geteilt hast. Ich habe deine Mutter angerufen. Keine Angst, sie ist nicht böse auf dich, aber besorgt. Sie muss gleich da sein. Mein Vater ist auch auf dem Weg, mit einer großen Taschenlampe und einer Decke.', '17:56'),
    m(ch.lisa, 'Bleib, wo du bist.', '17:56'),
  ]),

  S('sp0e03c04_privat_lisa_yasmin_zuhause', [
    divider('20:32'),
    img(ch.yasmin, B('sp0e03c04_01-512.webp'), '20:32'),
    m(ch.yasmin, 'Ich bin wieder zu Hause. Ich hab voll versagt. 🙈', '20:33'),
    m(ch.lisa, 'Was schreibst du denn? Hast du gar nicht.', '20:34'),
    m(ch.yasmin, 'Ich hab alle enttäuscht. Meinetwegen haben wir die letzte Challenge nicht geschafft.', '20:34'),
    m(ch.lisa, 'Das ist doch nur ein Spiel. Zum Spaß.', '20:35'),
    m(ch.yasmin, 'Das dachte Tom auch. Aber ich hab ihm Stress gemacht. 🙈', '20:35'),
    m(ch.lisa, 'Ja. Das war blöd.', '20:36'),
    m(ch.yasmin, 'Danke. Genau das brauche ich jetzt.', '20:36'),
    m(ch.lisa, 'Soll ich lügen?', '20:36'),
    m(ch.lisa, "Wie geht's deinem Fuß?", '20:37'),
    m(ch.yasmin, 'Nur geprellt, sagt die Ärztin. Aber mein Stern ist ganz verknickt. Er und ich, wir passen gut zusammen.', '20:37'),
    m(ch.lisa, 'Die Frist war einfach bescheuert.', '20:38'),
    m(ch.lisa, 'Aber wieso war dir die Challenge sooo wichtig? Ist doch klar, dass man im Dunkeln nicht mehr alleine durch den Wald läuft!', '20:38'),
    m(ch.yasmin, 'Weil...', '20:39'),
    typing('Yasmin schreibt'),
    typing('Yasmin löscht'),
    m(ch.yasmin, 'Immer schließt ihr mich aus!', '20:40'),
    m(ch.lisa, 'Was?', '20:40'),
    m(ch.yasmin, 'Ja! Immer seid ihr zusammen. Du stehst immer im Mittelpunkt! Und ich?', '20:41'),
    m(ch.lisa, 'Moment mal: 😖 Jetzt bin ich schuld?', '20:41'),
    m(ch.yasmin, 'ICH hatte die Sterne gefaltet. Und dann hängt ihr sie ohne mich auf.', '20:42'),
    m(ch.lisa, 'In der Schule meinst du? Weil du schon weg warst!', '20:42'),
    m(ch.yasmin, 'Ich saß vor dem Musikraum...', '20:43'),
    m(ch.yasmin, 'Und hab auf dich gewartet.', '20:43'),
    m(ch.lisa, 'Aber du hast doch geschrieben, dass du weg warst.', '20:44'),
    m(ch.yasmin, 'Ich wollte nicht auch noch fragen müssen, ob ich mitdarf.', '20:44'),
    m(ch.lisa, 'Natürlich durftest du mit.', '20:45'),
    m(ch.yasmin, 'Hat sich nicht so angefühlt.', '20:45'),
    m(ch.lisa, 'Und deshalb musstest du heute unbedingt noch zu dem Baum? 🤨', '20:46'),
    m(ch.yasmin, 'Mein Stern sollte nicht schon wieder fehlen. ☹️', '20:47'),
    m(ch.lisa, 'Hm.', '20:47'),
    m(ch.lisa, 'Darf ich morgen zu dir kommen?', '20:48'),
    m(ch.yasmin, 'Ohne Challenge? Einfach so?', '20:48'),
    m(ch.lisa, 'Einfach so.', '20:49'),
  ]),

  S('sp0e03c04_privat_yasmin_user_ausgeschlossen', [
    privateChat('Yasmin', 'Du'),
    m(ch.yasmin, 'Kennst du solche Situationen auch, in denen du dich ausgeschlossen fühlst?'),
  ]),

  S('sp0e03c04_switch_amy_ausgeschlossen', [
    amyChat(),
  ]),

  OR('sp0e03c04_or_ausgeschlossen',
    'Kennst du solche Situationen auch, in denen du dich ausgeschlossen fühlst?',
    {
      topics: ['reflect-understand'],
      category: 'PERSPECTIVE',
      bypassAi: true,
      fixedAmyReply: 'Danke, dass du das teilst. Solche Gefühle sind ganz normal – und manchmal hilft es schon, sie jemandem zu sagen.',
    },
  ),

  AR('sp0e03c04_ar_ausgeschlossen', 'sp0e03c04_or_ausgeschlossen'),

]);

// ─────────────────────────────────────────────────────────────────────────────
// KAPITEL 5 — Für deinen ist Platz
// ─────────────────────────────────────────────────────────────────────────────

const c05 = C('sp0e03c05', 4, 'Amic 5', 'Für deinen ist Platz', [

  S('sp0e03c05_privat_yasmin_markus_1', [
    privateChat('Yasmin', 'Markus'),
    divider('Samstagvormittag'),
    img(ch.yasmin, B('sp0e03c05_01-512.webp'), '10:15'),
    m(ch.yasmin, 'Mein Weihnachtsstern. ☹️', '10:15'),
    m(ch.markus, 'Autsch.', '10:16'),
    m(ch.yasmin, 'Weißt du, was ich brauche? Einen, der noch schlechter aussieht als meiner. Sonst fällt er so auf. 😉', '10:16'),
    m(ch.markus, 'Und da denkst du an mich?', '10:17'),
    m(ch.yasmin, 'Hast du Lust? Ich glaube an dein Talent.', '10:17'),
    m(ch.markus, '😂', '10:18'),
    typing('Markus schreibt'),
        typing('Markus löscht'),
    m(ch.yasmin, 'Heute ab vier bei mir. Bist du dabei?', '10:19'),
    m(ch.markus, 'Claro.', '10:19'),
    m(ch.yasmin, 'Bring den Stern mit.', '10:20'),
  ]),

  S('sp0e03c05_privat_yasmin_tom', [
    privateChat('Yasmin', 'Tom'),
    m(ch.yasmin, 'Fünf unverbrannte Plätzchen suchen ein Zuhause.', '10:30'),
    m(ch.tom, 'Nur fünf?', '10:30'),
    m(ch.yasmin, 'Seltene Exemplare, der Rest ist Kohle.', '10:31'),
    m(ch.yasmin, 'Heute ab vier bei mir. Kommst du? 🙏🥺', '10:31'),
    m(ch.tom, '😠 Und wenn ich erst um halb fünf kann?', '10:32'),
    m(ch.yasmin, 'Dann bewache ich deine Plätzchen so lange.', '10:32'),
  ]),

  S('sp0e03c05_privat_yasmin_markus_2', [
    privateChat('Yasmin', 'Markus'),
    divider('15:09'),
    m(ch.markus, 'Ein schiefer Stern aus kariertem Papier.', '15:09'),
    m(ch.markus, 'Schlechter als deiner. Auftrag erledigt.', '15:09'),
    m(ch.yasmin, 'Streber.', '15:10'),
    m(ch.markus, 'Darf der trotzdem mit?', '15:10'),
    m(ch.yasmin, 'Gerade der.', '15:10'),
  ]),

  S('sp0e03c05_privat_yasmin_user', [
    privateChat('Yasmin', 'Du'),
    m(ch.yasmin, 'Weißt du noch, was ich mir gewünscht hab? Dass wir auch nach den Challenges noch was zusammen machen.'),
    m(ch.yasmin, 'Heute kommen sie einfach so. Und wir hängen unsere Sterne auf. ⭐'),
    m(ch.yasmin, 'Wenn du einen Stern dazuhängen könntest, welchen Wunsch würdest du damit verbinden? Kann auch was ganz Kleines sein.'),
  ]),

  inp('sp0e03c05_input_wunsch', 'stories:sp0e03.c05.input.wunsch', {
    topics: ['reflect-understand'],
    promptSpeakerId: 'yasmin',
  }),

  S('sp0e03c05_amy_challenge_wunsch', [
    amyChat(),
    m(ch.amy, 'Wenn du einen Stern dazuhängen könntest, welchen Wunsch würdest du damit verbinden? Kann auch was ganz Kleines sein.'),
  ]),

  inp('sp0e03c05_input_wunsch_amy', 'stories:sp0e03.c05.input.wunsch', {
    topics: ['reflect-understand'],
    promptSpeakerId: 'amy',
  }),

  S('sp0e03c05_diary_entry4', [
    bonusLink('diary-yasmin-entry8', 'Yasmins Tagebuch', '/diaries/diary_yasmin?entry=sp0e03c05_0008', 'Eintrag lesen →'),
  ]),

  S('sp0e03c05_klassenchat_gruppenfoto', [
    classChat('Klasse 7b'),
    divider('Alle wieder zu Hause'),
    m(ch.yasmin, 'Meine Mutter hat ein Bild von uns gemacht.', '21:10'),
    img(ch.yasmin, B('sp0e03c05_02-512.webp'), '21:10'),
    m(ch.dominik, '@Markus, hast du deinen Stern aus den Mathehausaufgaben gebastelt?', '21:12'),
    m(ch.markus, 'Schuldig. 😬', '21:12'),
    m(ch.chioma, '@Yasmin, morgen um 11 steht noch?', '21:13'),
    m(ch.yasmin, 'Ja. Diesmal wirklich.', '21:13'),
    m(ch.igor, 'Der geflickte Stern gefällt mir.', '21:14'),
    m(ch.yasmin, 'Das ist meiner.', '21:14'),
    m(ch.igor, 'Dachte ich mir.', '21:14'),
  ]),

  S('sp0e03c05_privat_lisa_yasmin_abschluss', [
    privateChat('Lisa', 'Yasmin'),
    m(ch.lisa, 'Schon irgendwie blöd, dass du denkst, ich mag dich nur mit neun Quizpunkten und einem pünktlichen Stern.', '21:20'),
    m(ch.yasmin, 'Acht wären also auch okay?', '21:21'),
    m(ch.lisa, 'Yasmin 🙄', '21:21'),
    m(ch.yasmin, '😂', '21:21'),
    m(ch.lisa, '😂', '21:22'),
  ]),

  S('sp0e03c05_switch_amy', [
    amyChat(),
  ]),

  MIT('sp0e03c05_item_regel',
    'Welche Regel würdest du vorschlagen, damit du gern bei der nächsten Runde der Weihnachtscrew dabei wärst?',
    'responsibility',
    'rules_consequences',
    [
      opt('a', 'Jede Aufgabe ist freiwillig. Auch eine Zusage darf man ändern.', 1),
      opt('b', 'Wer aussetzt, kann beim nächsten Mal wieder mitmachen.', 1),
      opt('c', 'Ein Nein braucht keine Erklärung. Niemand wird überredet oder ausgelacht.', 1),
      opt('d', 'Aufgaben werden rechtzeitig angekündigt. Für Antworten bleibt genug Zeit.', 1),
      opt('e', 'Punkte und erledigte Aufgaben bestimmen nicht, wer der bessere Freund ist.', 1),
      opt('f', 'Alle dürfen Ideen einbringen und Regeln infrage stellen.', 1),
    ],
    {
      minSelections: 1,
      maxSelections: 6,
      helperText: 'Du kannst eine oder mehrere Regeln auswählen.',
      topics: ['talk-act'],
    },
  ),

  AF('sp0e03c05_amy_feedback_regel', 'sp0e03c05_item_regel'),

  S('sp0e03c05_amy_tipp_regeln', [
    m(ch.amy, '💡 Hier findet ihr Ideen für eure Gruppe. Sucht gemeinsam aus, was zu euch passt:\n\n– Jede Aufgabe ist freiwillig. Auch eine Zusage darf man ändern.\n– Wer aussetzt, kann beim nächsten Mal wieder mitmachen.\n– Ein Nein braucht keine Erklärung. Niemand wird überredet oder ausgelacht.\n– Aufgaben werden rechtzeitig angekündigt. Für Antworten bleibt genug Zeit.\n– Niemand muss ständig erreichbar sein. Chats dürfen [[gruppen-stummschalten]].\n– Training, Familienzeit, Schlaf und andere Verabredungen werden respektiert.\n– Aufgaben kosten nichts und brauchen keine besondere Ausrüstung.\n– Niemand wird in Gefahr gebracht, erschreckt oder bloßgestellt.\n– Niemand muss sich fotografieren lassen oder etwas Privates erzählen.\n– Bilder, Aufnahmen und persönliche Nachrichten anderer werden nur mit deren Einverständnis geteilt.\n– Punkte und erledigte Aufgaben bestimmen nicht, wer der bessere Freund ist.\n– Alle dürfen Ideen einbringen und Regeln infrage stellen.\n– Wenn sich jemand unwohl fühlt, wird die Aufgabe unterbrochen und gemeinsam verändert.\n– Bei Gefahr wird Hilfe geholt – auch wenn jemand aus Angst um Geheimhaltung bittet.'),
  ]),

]);

// ─────────────────────────────────────────────────────────────────────────────
// EPISODE
// ─────────────────────────────────────────────────────────────────────────────

const sp0e03De: StoryEpisodeV02 = {
  id: 'sp0e03',
  seasonId: 'sp',
  episodeId: 'sp0e03',
  courseId: 'sp0e03',
  chapters: [c01, c02, c03, c04, c05],
};

export default sp0e03De;
