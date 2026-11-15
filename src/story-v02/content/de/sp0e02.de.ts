// src/story-v02/content/de/sp0e02.de.ts
// Weihnachts-Spezial: "Anstoß im Weihnachtslicht"

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

const B = (n: string) => `/media/story/episodes/sp0e02/${n}`;

// ─────────────────────────────────────────────────────────────────────────────
// KAPITEL 1 — Ein ziemlich schlechter Ball
// ─────────────────────────────────────────────────────────────────────────────

const c01 = C('sp0e02c01', 0, 'Amic 1', 'Ein ziemlich schlechter Ball', [

  S('sp0e02c01_klassenchat_start', [
    classChat('Klasse 7b'),
    divider('Freitag, 27. November'),
    sysImg(B('sp0e02c01_0-512.webp'), ''),
    m(ch.markus, 'Hab im Testspiel den letzten Elfer gehalten. Und trotzdem muss ich am Sonntag wieder auf die Ersatzbank. Echt jetzt?!', '18:42'),
    m(ch.dominik, 'Du hast dir den Stammplatz gesichert. Ganz links neben der Trinkflasche.', '18:42', { reactions: [R('😂')] }),
    m(ch.markus, '😂', '18:43'),
    m(ch.tom, 'Kommst du trotzdem nachher zum Kicken?', '18:43'),
    m(ch.markus, 'Heute nicht. Online werde ich wenigstens gebraucht.', '18:44'),
    m(ch.finn, 'mit wem spielst du?', '18:44'),
    m(ch.markus, 'Falke. Der spielt vorn, ich im Tor. Wir sind echt ganz gut.', '18:45'),
    m(ch.chioma, 'Bevor ihr wieder zum Zocken abhaut: Habt ihr schon eure Weihnachtsgeschichten für die Schülerzeitung?', '18:45'),
    m(ch.emma, 'Hab dir meine schon geschickt: Meine Oma hat als Kind einmal ihren Wunschzettel gegessen. 🤔', '18:46', { reactions: [R('🤢')] }),
    m(ch.emma, 'Nur weil ihr kleiner Bruder ihn lesen wollte. 😭', '18:46'),
    m(ch.chioma, 'Genau solche Sachen! Herr Alvarenz meinte: Fragt eure Großeltern oder andere ältere Menschen, wie Weihnachten bei ihnen war.', '18:47'),
    m(ch.dominik, 'Bei meinem Opa? Schwarz-weiß!', '18:47'),
    m(ch.lisa, 'Meiner erzählt nur wieder wie gut wir es heutzutage haben. 😳', '18:48'),
  ]),

  S('sp0e02c01_privat_opa', [
    privateChat('Markus', 'Opa'),
    m(ch.markus, 'Opa, ich hab ´ne Frage für die Schule. Was habt ihr früher an Weihnachten gemacht? Etwas Spannendes, in der Vorweihnachtszeit.', '18:54'),
    m(ch.opa, 'Hm… Am zweiten Adventssonntag haben wir immer ein Fußball-Spiel organisiert. Warte, ich suche schnell etwas.', '18:55'),
    m(ch.markus, 'Aber beeil dich. Mein Spiel lädt ein Update, noch 11 Minuten. Dann muss in unbedingt wieder los.', '18:55'),
    m(ch.opa, 'Ist ja gut. Ich habe es schon gefunden.', '18:56'),
    m(ch.opa, 'Schau mal. Hinter der Kirche. Unser Weihnachtskick.', '18:56'),
    img(ch.opa, B('sp0e02c01_1-512.webp'), '18:56'),
    m(ch.markus, 'Mit DEM Ball? 😂', '18:57'),
    m(ch.opa, 'Wir hatten nur den einen. Aber das war uns egal.', '18:57'),
    m(ch.markus, 'Wer bist du auf dem Foto?', '18:58'),
    m(ch.opa, 'Der hervorragende Torwart rechts.', '18:58'),
    m(ch.markus, 'Mein Weihnachtswunsch ist ein Stammplatz in der ersten Mannschaft. Im Tor. Nicht auf der Bank.', '18:59'),
    m(ch.opa, 'Das wünsche ich dir auch, mein Junge. Du hältst inzwischen Bälle, bei denen ich mich vorsichtshalber geduckt hätte.', '18:59'),
    m(ch.opa, 'Meine Schwester war bei uns im Angriff. Sie war gut. Bloß wollte sie sonst niemand in seiner Mannschaft haben.', '19:00'),
    m(ch.markus, 'Warum?', '19:00'),
    m(ch.opa, 'Weil die anderen meinten, Mädchen könnten das nicht. So war das damals leider öfter. Aber nicht beim Weihnachtskick. Da durfte jeder mitspielen.', '19:01'),
    m(ch.markus, 'Auch Leute, die gar nichts konnten?', '19:01'),
    m(ch.opa, 'Klar!', '19:01'),
    m(ch.markus, 'War das nicht chaotisch?', '19:02'),
    m(ch.opa, 'War es. Einmal stand bei uns der Nachbar mit Hut und Tasche im Tor. Er wollte eigentlich nur kurz zusehen.', '19:02'),
    m(ch.markus, 'Habt ihr trotzdem gewonnen?', '19:03'),
    m(ch.opa, 'Keine Ahnung mehr. Ich weiß noch, dass er dann geblieben ist, weil es so lustig war.', '19:03'),
    m(ch.opa, 'Den Ball hab ich noch. Im Schrank. Neben all den Erinnerungen, die deine Oma längst wegwerfen wollte. Ich habe das kürzlich gerade mal ordentlich aufgeräumt.', '19:04'),
    m(ch.markus, 'Können wir das noch mal machen?', '19:04'),
    m(ch.opa, 'Was? Den Schrank aufräumen?', '19:04'),
    m(ch.markus, 'Fußball zu Weihnachten. Alle zusammen.', '19:05'),
  ]),

  S('sp0e02c01_switch_amy', [
    amyChat(),
  ]),

  OR('sp0e02c01_reflection_spiel',
    'Was macht für dich ein richtig gutes Spiel aus – egal ob online oder draußen?',
    {
      topics: ['reflect-understand'],
      category: 'PERSPECTIVE',
      bypassAi: true,
      fixedAmyReply: 'Danke fürs Teilen. Manchmal merkt man beim Spielen ganz nebenbei, was einem wirklich wichtig ist.',
    },
  ),

  AR('sp0e02c01_amy_reaction_spiel', 'sp0e02c01_reflection_spiel'),
]);

// ─────────────────────────────────────────────────────────────────────────────
// KAPITEL 2 — Die Idee
// ─────────────────────────────────────────────────────────────────────────────

const c02 = C('sp0e02c02', 1, 'Amic 2', 'Die Idee', [

  S('sp0e02c02_klassenchat_idee', [
    classChat('Klasse 7b'),
    m(ch.markus, 'Hey Leute, ich hab mal ´ne andere Idee zu Weihnachten, als Artikel für die Schülerzeitung: Wir schreiben nicht nur über früher. Wir machen es noch mal. Was haltet ihr von einem Weihnachtskick auf dem großen Platz hinter der Kirche? 🎄 ⚽', '19:02'),
    m(ch.chioma, 'Und wer kann teilnehmen?', '19:03'),
    m(ch.markus, 'Alle. Auch Kleinere, Eltern, Großeltern.', '19:03'),
    m(ch.tom, 'Cool. Ich bin dabei.', '19:03'),
    m(ch.lukas, 'Ich auch. Also als Zuschauer. Ich spiel ja nicht im Verein.', '19:04'),
    m(ch.markus, 'Das macht doch nichts. Beim Weihnachtskick dürfen alle mitmachen.', '19:04'),
    m(ch.lisa, 'Echt? Dann komm ich auch.', '19:04'),
    m(ch.dominik, 'Markus spielt gegen Rentner? Dann könnte es diesmal reichen.', '19:05'),
    m(ch.markus, 'Ja, haha.', '19:05'),
    m(ch.chioma, '@Dominik: Können wir vielleicht Leute einladen, ohne sie schon vorher auszulachen?', '19:05'),
    m(ch.dominik, 'Die Fairness-Polizistin im Einsatz. 🫤', '19:06'),
    m(ch.markus, 'Schreibt mir, wer alles mitmacht.', '19:06', { reactions: [R('👍')] }),
  ]),

  S('sp0e02c02_privat_user_switch', [
    privateChat('Markus', 'Du'),
    m(ch.markus, 'Du bist auch dabei, oder? Du kannst spielen, anfeuern oder beim Punsch helfen. Worauf hättest du Bock?'),
  ]),

  inp('sp0e02c02_input_bock', 'stories:sp0e02.c02.input.bock', {
    topics: ['talk-act'],
    promptSpeakerId: 'markus',
  }),

  S('sp0e02c02_privat_opa_samstag', [
    privateChat('Markus', 'Opa'),
    divider('Samstag, 28. November'),
    m(ch.markus, 'Opa 🥳', '10:20'),
    m(ch.opa, 'Was gibt´s?', '10:20'),
    m(ch.markus, 'Mama hat die Erlaubnis bekommen. Dass wir den Platz hinter der Kirche für den Weihnachtskick benutzen können. Am zweiten Advent.', '10:21'),
    m(ch.opa, 'Dann streiche ich meine Verabredung mit dem Sofa.', '10:21'),
    m(ch.markus, 'Treffen ist um 14 Uhr. Kannst du schon vorher kommen? Ich will alles wissen von früher, auch deine Tricks als Torwart.', '10:22'),
    m(ch.opa, 'Du kannst auf mich zählen.', '10:22'),
    m(ch.opa, 'Und den alten Ball darfst du dir auch abholen. Ich pumpe ihn gleich auf.', '10:23'),
    m(ch.markus, 'Aber zum Spielen nehmen wir lieber einen neuen.', '10:23'),
    m(ch.opa, 'Vernünftig.', '10:23'),
    m(ch.markus, 'Bring auch deine Handschuhe mit. Für den Fall, dass ich dich einwechsle.', '10:24'),
    m(ch.opa, 'Oh, da fange ich besser gleich mit dem Training an.', '10:24'),
    sysImg(B('sp0e02c02_1-512.webp')),
  ]),

  S('sp0e02c02_privat_falke_konflikt', [
    privateChat('Markus', 'Falke27'),
    m(ch.falke27, 'Winterpokal ist angekündigt! Unsere Punkte von nächster Woche zählen. Am Nikolaus-Tag können wir uns für die Finalrunde qualifizieren.', '15:43'),
    m(ch.falke27, 'Wer dann genug Punkte hat, darf in der Finalrunde spielen.', '15:43'),
    m(ch.markus, 'Das Ding holen wir! 🔥', '15:44'),
    m(ch.falke27, 'Meine Mom war nicht so begeistert, dass ich am Advents-Sonntag spiel. Aber unser Team geht vor. 💪', '15:44'),
    m(ch.markus, 'Am Sonntag? Am zweiten Advent?', '15:45'),
    m(ch.falke27, 'Ja. Wir waren noch nie so nah dran. Mit dir im Tor schaffen wir das!', '15:45'),
  ]),

  S('sp0e02c02_switch_amy_falke', [
    amyChat(),
  ]),

  GR('sp0e02c02_reflection_falke',
    'Falke schreibt: „Unser Team geht vor!" Aber Opa freut sich schon auf den Weihnachtskick. Stell dir vor, du bist Markus und dir ist beides wichtig: Was würdest du Falke jetzt antworten?',
    [
      rc('a', '„Wann genau spielen wir? Ich habe am Sonntag auch den Weihnachtskick mit Opa geplant."',
        'Erst nachfragen ist eine gute Idee. Vielleicht lässt sich beides verbinden. Wenn du die Zeiten kennst, kannst du besser entscheiden.',
      ),
      rc('b', '„Ich möchte mitspielen. Aber beim Weihnachtskick bin ich weg. Können wir das vorher zusammen planen?"',
        'Du möchtest mitspielen und sagst trotzdem klar, wann du weg bist. Das ist eine gute Idee, denn so kann dein Team gemeinsam mit dir planen.',
      ),
      rc('c', '„Beim Weihnachtskick habe ich schon zugesagt. Wenn beides gleichzeitig stattfindet, braucht ihr diesmal jemand anderen."',
        'Du hältst deine Zusage für den Weihnachtskick ein. Es ist richtig, dass du rechtzeitig Bescheid sagst, so kann dein Team nach Ersatz suchen.',
      ),
      rc('d', '„Ich würde etwas anderes schreiben: …"',
        'Du weißt am besten, was dir wichtig ist. Prüfe deine Nachricht immer bevor du sie abschickst: Bleibst du höflich? Versteht Falke, dass du bereits verabredet bist? Weiß er, wann du mitspielen kannst?',
      ),
    ],
    { topics: ['talk-act', 'reflect-understand'] },
  ),

  AR('sp0e02c02_amy_reaction_falke', 'sp0e02c02_reflection_falke'),

  S('sp0e02c02_amy_tipp_falke', [
    m(ch.amy, 'Frag dich: Was möchte ich selbst und was habe ich schon zugesagt? Kläre die Zeiten und sag deinem Team immer rechtzeitig, wann du dabei sein kannst. Du darfst eine Grenze setzen, auch wenn andere gern länger mit dir spielen würden.'),
  ]),

  S('sp0e02c02_klassenchat_montag', [
    classChat('Klasse 7b'),
    divider('Montag, 30. November'),
    m(ch.markus, 'Weihnachtskick steht! Sonntag 14 bis 16 Uhr hinter der Kirche. Die Mamas und Papas kümmern sich um Würstchen und Getränke.', '16:05', { reactions: [R('👍')] }),
    m(ch.tom, 'Ich kann die Mannschaften zusammenstellen.', '16:05', { reactions: [R('🙏')] }),
    m(ch.markus, 'Das wär super.', '16:06'),
    m(ch.tom, 'Dann schicke mir später eine Liste mit den Namen derer, die bei dir schon zugesagt haben.', '16:06'),
    m(ch.markus, 'Klar, mach ich dann.', '16:07'),
    m(ch.tom, 'Bitte vor 18:30 Uhr, danach kann ich nicht mehr.', '16:07'),
    m(ch.markus, '👍', '16:07'),
    m(ch.chioma, 'Für die Schülerzeitung brauch ich noch Fotos von früher. Wenn jemand eins beisteuern kann: Bitte erst fragen, ob ihr es weitergeben dürft.', '16:08'),
    m(ch.markus, 'Mein Opa erzählt bestimmt gern von den ersten Weihnachtskicks für die Zeitung. Das alte Foto bleibt aber privat.', '16:08'),
    m(ch.dominik, 'Die alte Kartoffel muss ich sehen. 😂', '16:09'),
    m(ch.markus, 'Hab ihn noch nicht abgeholt.', '16:09', { reactions: [R('🙄')] }),
    m(ch.dominik, 'Mit so einem schweren Lederteil will eh keiner spielen.', '16:10'),
    m(ch.lisa, 'Wir haben es echt gut heutzutage. 🤔', '16:10'),
    m(ch.emma, 'Wieso? Der ist doch voll angesagt, so vintage. ❤️', '16:10'),
  ]),

  S('sp0e02c02_privat_falke_abend', [
    privateChat('Markus', 'Falke27'),
    m(ch.markus, 'Eine Runde. Muss danach noch was für Sonntag vorbereiten.', '16:38'),
    m(ch.falke27, 'Passt.', '16:39'),
    m(ch.markus, 'Ich schwöre, heute lasse ich keinen rein.', '16:39', { reactions: [R('💪')] }),
  ]),

  S('sp0e02c02_privat_falke_sieg', [
    m(ch.falke27, 'Drei gehalten!! Du bist eine Wand.', '17:53'),
    m(ch.falke27, 'Noch ein Sieg bis zur nächsten Stufe.', '17:53'),
    m(ch.markus, 'Okay. Aber dann ist wirklich Schluss.', '17:54'),
  ]),
]);

// ─────────────────────────────────────────────────────────────────────────────
// KAPITEL 3 — Gleich nach diesem Spiel
// ─────────────────────────────────────────────────────────────────────────────

const c03 = C('sp0e02c03', 2, 'Amic 3', 'Gleich nach diesem Spiel', [

  S('sp0e02c03_klassenchat_namen', [
    classChat('Klasse 7b'),
    m(ch.tom, 'Du wolltest mir doch die Namen der Teilnehmer schicken?', '18:39'),
    m(ch.markus, 'Namen?', '18:39'),
    m(ch.tom, 'Weihnachtskick 🙄', '18:40'),
    m(ch.markus, 'Mist. Vergessen.', '18:40'),
    m(ch.tom, 'Dann morgen. Aber wirklich.', '18:40'),
    m(ch.markus, 'Mach ich.', '18:41'),
  ]),

  S('sp0e02c03_privat_opa_dienstag', [
    privateChat('Markus', 'Opa'),
    divider('Dienstag, 1. Dezember'),
    m(ch.opa, 'Wann holst du den Ball? Er hat schon wieder seine Luft verloren. Das Aufpumpen ist jetzt mein tägliches Fitness-Training.', '18:34'),
    m(ch.markus, 'Morgen hole ich ihn. Heute war Training.', '18:35'),
  ]),

  S('sp0e02c03_privat_tom_training', [
    privateChat('Markus', 'Tom'),
    m(ch.tom, 'Wo warst du heute beim Training?', '19:06'),
    m(ch.markus, 'Hä? Ich war doch im Tor.', '19:07'),
    m(ch.tom, 'Aber mit dem Kopf warst du ganz wo anders. Nach jedem Schuss hast du auf die Uhr geguckt.', '19:07'),
    sysImg(B('sp0e02c03_1-512.webp'), ''),
    m(ch.markus, 'Gar nicht.', '19:08'),
    m(ch.tom, 'Klar. Warst du mit Falke verabredet?', '19:08'),
    m(ch.markus, 'Ja. Ich wollte halt nicht zu spät kommen.', '19:08'),
    m(ch.tom, 'Und mir fehlen immer noch die Namen.', '19:09'),
    m(ch.markus, 'Morgen. Ehrlich.', '19:09'),
  ]),

  S('sp0e02c03_privat_falke_mittwoch', [
    privateChat('Markus', 'Falke27'),
    divider('Mittwoch, 2. Dezember'),
    m(ch.markus, 'Den hätte ich halten müssen.', '16:51'),
    m(ch.falke27, 'War schwer. Macht nichts. Schluss für heute?', '16:52'),
    m(ch.markus, 'Nicht mit so einem Spiel. Noch eins. Ich will das wieder gutmachen.', '16:52'),
    m(ch.falke27, 'Okay. Eins geht bei mir noch.', '16:52'),
  ]),

  S('sp0e02c03_privat_opa_mittwoch', [
    privateChat('Markus', 'Opa'),
    m(ch.opa, 'Du wolltest heute kommen. Ist etwas dazwischengekommen?', '18:18'),
    m(ch.markus, 'Sorry. Ist gerade ein bisschen viel. Morgen?', '18:19'),
    m(ch.opa, 'Dann morgen.', '18:19'),
    m(ch.markus, 'Der Ball läuft ja nicht weg.', '18:20'),
    m(ch.opa, 'Nein. Dafür ist er zu schlapp.', '18:20'),
  ]),

  S('sp0e02c03_klassenchat_donnerstag', [
    classChat('Klasse 7b'),
    divider('Donnerstag, 3. Dezember'),
    m(ch.tom, 'Markus, wie viele Leibchen brauchen wir? Papa kann welche aus dem Verein mitbringen.', '16:08'),
    m(ch.markus, 'Links frei. Flach in die Mitte.', '16:08'),
    m(ch.lisa, 'Mein Leibchen hat gar keine Mitte. Was?', '16:09'),
    m(ch.markus, 'Falscher Chat. 😂 Sorry.', '16:09'),
    m(ch.tom, 'Wie viele? 🙄', '16:10'),
    m(ch.markus, 'Muss ich noch zählen. Gleich nach dem Spiel.', '16:10'),
    m(ch.chioma, 'Und wann ist das? Sonst weiß Toms Papa nicht, bis wann er warten soll.', '16:10'),
    m(ch.markus, 'Chill mal, Chioma. Ich bin ja nicht der einzige Mensch hier, der zählen kann.', '16:11'),
    m(ch.chioma, 'Aber der Einzige mit den Namen der Teilnehmer.', '16:11'),
    m(ch.tom, 'Genau, die brauch ich auch noch.', '16:11'),
  ]),

  S('sp0e02c03_switch_amy_raten', [
    amyChat(),
  ]),

  OR('sp0e02c03_reflection_markus_raten',
    'Was würdest du Markus raten?',
    {
      topics: ['reflect-understand'],
      category: 'ACTION',
      bypassAi: true,
      placeholderKey: 'stories:sp0e02.c03.reflection.markusRatenPlaceholder',
      fixedAmyReply: 'Manchmal muss man sich entscheiden. Denn wenn man zu viele Dinge gleichzeitig machen will, bleibt am Ende für nichts richtig Zeit. Und dann bringt es auch keinen Spaß mehr.',
      fixedAmyReplyVague: 'Hast du vielleicht noch einen eigenen Gedanken? Schreib, was dir als erstes einfällt.',
    },
  ),

  AR('sp0e02c03_amy_reaction_markus_raten', 'sp0e02c03_reflection_markus_raten'),

  S('sp0e02c03_privat_carlos_stumm', [
    privateChat('Markus', 'Carlos'),
    m(ch.markus, 'Wie mache ich aus, dass auf meinem Handy dauernd Nachrichten aufploppen?', '19:15'),
    m(ch.carlos, 'Welche willst du ausschalten? Alle oder bestimmte?', '19:16'),
    m(ch.markus, 'Dauernd der Klassenchat und die ganzen Anmeldungen für den Weihnachtskick. Das nervt.', '19:16'),
    m(ch.carlos, 'Du kannst [[gruppen-stummschalten]]. Das ist sehr nützlich.', '19:17'),
    sysImg(B('Carlos_Gruppe_stummschalten-512.webp')),
    m(ch.carlos, 'Aber die Anmeldungen musst du dann irgendwann trotzdem lesen.', '19:17'),
    m(ch.markus, 'Danke. Ja ja, ich weiß.', '19:18'),
    m(ch.carlos, 'Aber ich glaub, du solltest auch einen kurzen Blick in meinen Artikel werfen.', '19:18'),
    bonusLink('tip-carlos-game-tricks', 'Carlos checkt: Die Tricks der Online-Spiele', '/newspaper/tip-carlos-game-tricks', 'Artikel öffnen →'),
    m(ch.markus, 'Der war doch schon neulich in der Schülerzeitung. Ich kenn die Überschrift.', '19:19'),
    m(ch.carlos, 'Gelesen hast du ihn nicht?', '19:19'),
    m(ch.markus, 'Noch nicht. Lese ich später.', '19:20'),
    m(ch.carlos, 'Ich mach mein Handy jetzt aus. Aber noch schnell ein Tipp...', '19:20'),
    m(ch.markus, 'Du klingst langsam wie Chioma!', '19:21'),
    m(ch.carlos, 'Du kannst mal nachgucken, ob sich der [[automatischer-rundenstart]] ausschalten lässt. Das ist je nach Spiel verschieden. Dann geht nicht immer von allein das nächste Spiel los.', '19:21'),
    m(ch.markus, 'Schaue ich morgen.', '19:22'),
    m(ch.carlos, 'Dein Lieblingsdatum.', '19:22'),
  ]),

  S('sp0e02c03_privat_tom_aerger', [
    privateChat('Markus', 'Tom'),
    m(ch.tom, 'Wir wollten doch zusammen den Weihnachtskick organisieren. 😒', '20:03'),
    m(ch.markus, 'Ich weiß. Sorry.', '20:04'),
    m(ch.markus, 'Echt ätzend, dass das Online-Turnier mit Falke auch ausgerechnet jetzt sein muss.', '20:04'),
    m(ch.tom, 'Es gibt noch viel zu tun und du bist nie zu erreichen.', '20:05'),
    m(ch.markus, 'Hast ja recht. Heute habe ich mich sogar geärgert, als Opa geschrieben hat.', '20:05'),
    m(ch.tom, 'Und?', '20:05'),
    m(ch.markus, 'Hab behauptet, ich müsste noch Hausaufgaben machen.', '20:06'),
    m(ch.tom, 'Was ist eigentlich so wichtig an dem Pokal?', '20:06'),
    m(ch.markus, 'Naja... Falke sagt nie „Du beginnst auf der Ersatzbank". Er sagt: "Ohne dich sind wir aufgeschmissen."', '20:07'),
    m(ch.tom, 'Das sage ich bei unserer Teilnehmer-Liste inzwischen auch.', '20:07'),
    m(ch.markus, 'Ja, aber anders.', '20:07'),
    m(ch.tom, 'Du bist die letzten Tage aber auch echt schlecht gelaunt. Und das, obwohl Falke und du grad alles gewinnen. Denk mal drüber nach.', '20:08'),
    m(ch.markus, '@Du, würdest du an meiner Stelle zuerst die Liste machen oder erst kurz den Kopf frei kriegen? Ich weiß echt nicht weiter.', '20:09'),
  ]),

  S('sp0e02c03_switch_amy_nachricht', [
    amyChat(),
    m(ch.amy, 'Du kannst Markus eine kurze Nachricht schreiben. Seine Aufgabe erledigt sich dadurch natürlich nicht. Aber er bekommt vielleicht bessere Laune und ist motiviert.'),
  ]),

  inp('sp0e02c03_input_nachricht', 'stories:sp0e02.c03.input.nachricht', {
    topics: ['talk-act'],
    promptSpeakerId: 'amy',
    maxLength: 300,
  }),

  S('sp0e02c03_privat_tom_entschuldigung', [
    privateChat('Markus', 'Tom'),
    m(ch.markus, 'Hi Tom. Ich weiß, du bist jetzt nicht mehr online. Treffen morgen nach der Schule? Ich nehme mir die Zeit dafür, ich versprech´s. Ich suche vorher alles raus.', '22:19'),
    divider('Freitag, 4. Dezember'),
    m(ch.tom, 'Das ist alles? Du hast mir vier Namen geschickt. Die hatte ich schon. Und die anderen?', '16:42'),
    m(ch.markus, 'Muss in den Chats suchen.', '16:43'),
    m(ch.tom, 'Das wolltest du vorher machen. Und ich dachte, wir treffen uns wirklich und du schickst nicht nur kurz eine Sprachnachricht.', '16:43'),
    m(ch.markus, 'Hatte heute morgen verschlafen, konnte es nicht mehr raussuchen, sorry.', '16:44'),
  ]),

  S('sp0e02c03_privat_opa_ball_kommt', [
    privateChat('Markus', 'Opa'),
    m(ch.opa, 'Ich bringe den Ball morgen zu euch. Auf dein „Morgen" können wir nicht mehr warten.', '18:06'),
    m(ch.markus, 'Musst du nicht. Ich komme noch.', '18:07'),
    m(ch.opa, 'Ich bin sowieso in der Nähe. Dann können wir auch ein bisschen zusammensitzen.', '18:07'),
  ]),

  S('sp0e02c03_switch_amy_wenn_dann', [
    amyChat(),
  ]),

  MIT('sp0e02c03_item_wenn_dann',
    'Markus möchte Tom die Liste der Teilnehmer schicken. Beim Spielen denkt er trotzdem immer wieder: „Nur noch eine Runde.“ Welche kleine Hilfe würdest du an seiner Stelle ausprobieren, damit du rechtzeitig an deine andere Aufgabe denkst?',
    'self_regulation',
    'interrupt_impulse',
    [
      opt('a', 'Eine Erinnerung stellen: „Wenn mein Wecker klingelt, dann starte ich keine neue Runde/Video. Sofort nach der laufenden Runde kümmere ich mich um meine andere Aufgabe.“', 1),
      opt('b', 'Etwas vorher erledigen: „Wenn ich spielen/gucken möchte, dann erledige ich vorher die Aufgabe, die ich jemandem versprochen habe.“', 1),
      opt('c', 'Zwischendurch bewusst nachsehen: „Wenn eine Runde/Video/Kapitel zu Ende ist, dann schaue ich auf die Uhr und prüfe, was ich noch vorhabe.“', 1),
    ],
    {
      minSelections: 1,
      maxSelections: 3,
      helperText: 'Du kannst eins oder mehrere Beispiele ankreuzen.',
      topics: ['reflect-understand'],
    },
  ),

    AF('sp0e02c03_amy_feedback_wenn_dann', 'sp0e02c03_item_wenn_dann'),

  CH('sp0e02c03_challenge_wenn_dann',
    '👉 Schreibe dir deinen eigenen Wenn..., dann... Satz auf ein Blatt Papier. Was würde bei dir funktionieren?',
  ),
]);

// ─────────────────────────────────────────────────────────────────────────────
// KAPITEL 4 — Alle warten auf Markus
// ─────────────────────────────────────────────────────────────────────────────

const c04 = C('sp0e02c04', 3, 'Amic 4', 'Alle warten auf Markus', [

  S('sp0e02c04_privat_tom_samstag', [
    privateChat('Markus', 'Tom'),
    divider('Samstag, 5. Dezember'),
    m(ch.tom, 'Ich habe die Anmeldungen verglichen. Lisa steht dreimal drin. Lea gar nicht. Von Finns Cousin wissen wir nur, dass er vielleicht kommt. Morgen ist Anpfiff!', '14:02'),
    m(ch.markus, 'Dann streich Lisa halt zweimal.', '14:03'),
    m(ch.tom, 'Und Lea?', '14:03'),
    m(ch.markus, 'Keine Ahnung. Frag Lisa.', '14:03'),
    m(ch.tom, 'Ich frag dich. DU hattest ihre Nachricht.', '14:04'),
    m(ch.markus, 'Ich kann nicht alles machen.', '14:04'),
    m(ch.tom, 'Du machst gar nichts. Deshalb habe ich gerade den ganzen Samstag-Vormittag mit deiner Hälfte verbracht.', '14:04'),
    m(ch.markus, 'Dann lassen wir den blöden Kick eben.', '14:05'),
    m(ch.tom, 'Im Ernst jetzt?', '14:05'),
  ]),

  S('sp0e02c04_privat_opa_ball_da', [
    m(ch.opa, 'War vorhin mit dem Ball bei euch. Habe dich wohl verpasst. Er liegt bei euch im Flur.', '14:09'),
    m(ch.markus, 'Warst du schon da?', '14:10'),
    m(ch.opa, 'Vor einer guten halben Stunde. Deine Mutter hat dich gerufen. Du warst wohl beschäftigt.', '14:10'),
    m(ch.markus, 'Ja. Warte, ich melde mich gleich.', '14:11'),
    m(ch.opa, 'Bis morgen dann.', '14:11'),
    sysImg(B('sp0e02c04-512.webp')),
    m(ch.markus, 'Du hast sogar meine alten Torwarthandschuhe gefunden! Wie toll! 😁', '14:45'),
    m(ch.markus, 'Und den Ball hast du aber gut aufgepumpt.', '14:45'),
    m(ch.markus, 'Opa?', '14:46'),
    m(ch.opa, 'Ja?', '14:46'),
    m(ch.markus, 'Ich habe dich nicht verpasst. Also doch. Aber nicht richtig.', '14:47'),
    m(ch.opa, 'Wie denn?', '14:47'),
    m(ch.markus, 'Mama hat mich gerufen. Ich wollte nur schnell die Runde fertig spielen. Aber es hat etwas länger gedauert. Ich dachte, du wartest noch.', '14:48'),
    m(ch.opa, 'Ich habe gewartet.', '14:48'),
    m(ch.markus, 'Tut mir leid.', '14:49'),
    m(ch.opa, 'Ich hatte mich darauf gefreut, ein bisschen mit dir zu sitzen.', '14:49'),
    m(ch.markus, 'Ich wollte dich wirklich sehen.', '14:49'),
    m(ch.opa, 'Das glaube ich dir. Angekommen ist bei mir trotzdem: Ich sitze hier, und du kommst nicht.', '14:50'),
    m(ch.markus, 'Ich weiß manchmal selbst nicht, warum ich das mache.', '14:50'),
    m(ch.opa, 'Dann sag mir lieber, wann du wirklich Zeit hast. Ich warte gern bis vier. Aber nicht den ganzen Nachmittag auf „gleich".', '14:51'),
    m(ch.markus, 'Können wir das Treffen nachholen?', '14:51'),
    m(ch.opa, 'Natürlich.', '14:51'),
    m(ch.opa, 'Markus?', '14:52'),
    m(ch.markus, 'Ja?', '14:52'),
    m(ch.opa, 'Du musst dich jetzt entscheiden.', '14:52'),
    m(ch.opa, 'Willst du überhaupt noch morgen spielen?', '14:52'),
    m(ch.markus, '…', '14:53'),
    m(ch.markus, 'Auf jeden Fall!!', '14:53'),
  ]),

  S('sp0e02c04_klassenchat_liste', [
    classChat('Klasse 7b'),
    m(ch.markus, 'Hallo Leute, ich habe die Anmeldungen durcheinandergebracht. Mein Fehler. Ich habe jetzt versucht, es in Ordnung zu bringen. Prüft bitte kurz die Liste, die ich euch gleich schicke, ob ihr korrekt als Teilnehmer drin steht.', '15:13'),
    m(ch.lisa, 'Lea fragt seit heute Morgen, ob sie wirklich mitspielen darf. Ich habe ihr Ja gesagt. Das stimmt doch?', '15:14'),
    m(ch.dominik, 'Für das Hauptspiel nehmen wir richtige Spieler. Die Kleine kann vielleicht danach ein bisschen kicken.', '15:14'),
    m(ch.markus, 'Nein. Lea spielt mit.', '15:15'),
    m(ch.dominik, 'Seit wann entscheidest du das allein?', '15:15'),
    m(ch.markus, 'Wir haben alle eingeladen. Auch Leute, die sonst zuletzt gewählt werden. Das ist die ganze Idee.', '15:15'),
    m(ch.dominik, 'Na dann viel Spaß im Kindergarten. 😆', '15:16'),
    m(ch.markus, 'Lass Lea in Ruhe. Sie ist erst sechs und freut sich schon riesig.', '15:16'),
    m(ch.chioma, 'Wir können kleine Teams machen und immer wechseln. Dann steht niemand ewig herum.', '15:17'),
    m(ch.tom, 'Und gemischt. Nicht erst die Besten wählen und dann den Rest verteilen.', '15:17'),
    m(ch.markus, 'Ja, genau. So machen wir es.', '15:17'),
  ]),

  S('sp0e02c04_privat_tom_liste_fertig', [
    privateChat('Markus', 'Tom'),
    m(ch.markus, 'Die Liste ist fertig. Bei allen, die "vielleicht" geschrieben haben, habe ich noch mal nachgefragt. Und die Erwachsenenanzahl an Mama weitergegeben.', '15:22'),
    m(ch.tom, 'Passt jetzt. Papa bringt Leibchen und zwei Bälle.', '15:23'),
    m(ch.markus, 'Danke, dass du nicht abgesprungen bist. Das vergesse ich dir nie.', '15:23'),
    m(ch.tom, 'Ich war kurz davor. 💪', '15:24'),
    m(ch.tom, 'Morgen halb zwei am Treffpunkt? Dann bauen wir mit auf.', '15:24'),
    m(ch.markus, 'Ja. Aber ich spiele vorher noch mit Falke. Da ist die Qualifikation.', '15:25'),
    m(ch.tom, 'Vorher??', '15:25'),
  ]),

  S('sp0e02c04_privat_carlos_aufhoer', [
    privateChat('Markus', 'Carlos'),
    m(ch.markus, 'Morgen muss bei mir um halb zwei Schluss sein. Wie mache ich das so, dass ich es nicht wieder vergesse?', '15:41'),
    m(ch.carlos, 'Nicht erst halb zwei darüber nachdenken.', '15:42'),
    m(ch.markus, 'Ich merke, dein Lexikon hat schlechte Laune.', '15:42'),
    m(ch.carlos, 'Ich zitiere: „Carlos\' Onlinelexikon: [[aufhoerplan]]. Bestimme vorher, wann du fertig sein willst. Plane das Spiel so früh ein, dass es rechtzeitig zu Ende ist. Sag den Mitspielern vorher rechtzeitig Bescheid. Ein Wecker kann dich erinnern."', '15:43'),
    m(ch.markus, 'Klingt zu simpel.', '15:43'),
    m(ch.carlos, 'Probiere es halt mal.', '15:44'),
  ]),

  S('sp0e02c04_privat_falke_plan', [
    privateChat('Markus', 'Falke27'),
    m(ch.markus, 'Morgen muss ich um 13:30 offline sein. Echt. Organisiere mit meiner Klasse einen Weihnachtskick.', '16:02'),
    m(ch.falke27, 'Ach, deshalb warst du diese Woche so durch.', '16:03'),
    m(ch.markus, 'Können wir um zwölf anfangen? Und die letzte Runde spätestens um Viertel nach eins starten? Dauert meistens acht Minuten, dann haben wir noch Luft.', '16:03'),
    m(ch.falke27, 'Meinetwegen. Aber dann sei auch bei der Sache. 💪', '16:04'),
    m(ch.falke27, 'Ne warte. Das geht nicht. Die Finalrunde ist um 2!', '16:04'),
    m(ch.markus, 'Ja. Für die Finalrunde brauchst du eventuell jemand anderen.', '16:05'),
    m(ch.falke27, 'Ne Digga, das geht nicht!', '16:05'),
    m(ch.markus, 'Frag halt Ben. Der wird sich riesig freuen.', '16:06'),
    m(ch.falke27, 'Och nö! Du bist viel besser! 😒', '16:06'),
    m(ch.markus, 'Komplimente von dir. Das merk ich mir. 😁', '16:07'),
    m(ch.falke27, 'Ist dir der Kick echt so wichtig? Da kann doch jemand anders für dich einspringen.', '16:07'),
    m(ch.falke27, 'Frag doch Ben! 😂', '16:08'),
    m(ch.markus, '😂', '16:08'),
    m(ch.markus, 'Mein Opa kommt.', '16:08'),
  ]),

  S('sp0e02c04_privat_tom_abholung', [
    privateChat('Markus', 'Tom'),
    m(ch.markus, 'Kannst du mich morgen von zu Hause abholen?', '16:14'),
    m(ch.tom, 'Ich schmeiß mich weg! Brauchst du Begleitung zum Kirchplatz? Lässt dich deine Mami noch nicht allein raus? 😂 😂', '16:14'),
    m(ch.markus, 'Du bist meine Versicherung, dass ich nicht die Zeit verpasse.', '16:15'),
    m(ch.tom, 'Was springt für mich dabei raus?', '16:15'),
    m(ch.markus, 'Meine Mom backt gerade Weihnachtsstollen...', '16:15'),
    m(ch.tom, 'Mein Magen knurrt schon. Abgemacht!', '16:16'),
    m(ch.tom, 'Aber wenn du wieder „gleich" sagst, stehst du am Grill statt im Tor!', '16:16'),
  ]),

  S('sp0e02c04_privat_opa_morgen', [
    privateChat('Markus', 'Opa'),
    m(ch.markus, 'Morgen treffen wir uns um zehn vor zwei am Platz? Du kommst mit Mama?', '17:05'),
    m(ch.opa, 'Ja. Und mit einer warmen Decke.', '17:05'),
    m(ch.markus, 'Der alte Ball liegt schon neben meinen Sachen.', '17:06'),
    m(ch.opa, 'Ich dachte, der wäre dir zu schlecht?', '17:06'),
    m(ch.markus, 'Quatsch. Der ist das beste Maskottchen aller Zeiten.', '17:06'),
  ]),

  S('sp0e02c04_switch_amy_gleich', [
    amyChat(),
  ]),

  MIT('sp0e02c04_item_gleich_warten',
    'Markus sagt immer wieder „gleich" und die anderen sind genervt. Kennst du das, wenn jemand „gleich" sagt und du dann lange wartest? Was kann daran schwierig sein? Kreuze die Gründe an, die dich dabei am meisten stören.',
    'perspective',
    'perspectives_recognize',
    [
      opt('a', 'Ich weiß nicht, ob ich noch zwei Minuten oder eine Stunde warten muss.', 1),
      opt('b', 'Ich kann meine Zeit schlecht planen, weil ich nicht weiß, wann es losgeht.', 1),
      opt('c', 'Ich muss immer wieder nachfragen, statt mich auf die Antwort verlassen zu können.', 1),
      opt('d', 'Ich fühle mich unwichtig, wenn die andere Person mich immer weiter warten lässt.', 1),
      opt('e', 'Irgendwann glaube ich auch einem neuen „gleich" nicht mehr.', 1),
    ],
    {
      minSelections: 1,
      maxSelections: 5,
      helperText: 'Kreuze die Gründe an, die dich dabei am meisten stören.',
      topics: ['reflect-understand'],
    },
  ),

  AF('sp0e02c04_amy_feedback_gleich', 'sp0e02c04_item_gleich_warten'),
]);

// ─────────────────────────────────────────────────────────────────────────────
// KAPITEL 5 — Anpfiff ohne Markus?
// ─────────────────────────────────────────────────────────────────────────────

const c05 = C('sp0e02c05', 4, 'Amic 5', 'Anpfiff ohne Markus?', [

  S('sp0e02c05_privat_falke_sonntag', [
    privateChat('Markus', 'Falke27'),
    divider('Sonntag, 6. Dezember'),
    m(ch.markus, 'Mein Wecker klingelt. Mist, jetzt schon.', '13:14'),
    m(ch.markus, 'Letzte Runde, dann muss ich los.', '13:14'),
    m(ch.falke27, 'Mist. Ben kann erst ab zwei.', '13:15'),
    m(ch.markus, 'Vielleicht reicht unser Punktestand schon.', '13:15'),
    m(ch.falke27, 'Im Moment ja. Aber die hinter uns können noch aufholen.', '13:16'),
    m(ch.markus, 'Dann halten wir jetzt die Bude sauber. 💪', '13:16'),
    m(ch.falke27, 'GEHALTEN! Wie hast du den noch rausgefischt?!', '13:25'),
    m(ch.falke27, 'Wir sind wieder drüber! Ein Sieg mehr wäre sicherer. Noch eine?', '13:25'),
    m(ch.markus, 'Ich …', '13:26'),
    m(ch.markus, 'Na gut. Noch fünf Minuten.', '13:26'),
    m(ch.falke27, 'Eine Runde dauert acht.', '13:26'),
  ]),

  S('sp0e02c05_privat_tom_abholung', [
    privateChat('Markus', 'Tom'),
    m(ch.tom, 'Bin gleich da. Hast du die Jacke schon an?', '13:27'),
    m(ch.tom, 'Deine Mutter hat mich reingelassen. Bin unten.', '13:30'),
    m(ch.markus, 'Spiel ist aus. Ziehe mich an. Stollen steht in der Küche.', '13:31'),
    m(ch.tom, 'Dann hast du noch genau ein Stück KUCHEN Zeit. 😋', '13:31'),
    m(ch.tom, 'Hab gleich den ganzen Stollen verdrückt. Wo bleibst du?', '13:36'),
    m(ch.markus, 'Muss kurz weg. Erklär ich dir gleich.', '13:37'),
    m(ch.markus, 'Wir treffen uns am alten Kirchentor.', '13:37'),
    m(ch.tom, 'Willst du mich verarschen? Du spielst doch schon wieder. 😠', '13:37'),
    m(ch.tom, 'Ich bin jetzt da. Wie der letzte Trottel. Hab kein Bock mehr auf deine Ausreden! Geh spielen!', '13:44'),
    m(ch.markus, 'Warte. Bin fast da, meine Großtante ist nicht mehr so schnell.', '13:44'),
    m(ch.tom, 'Großtante? Verarschen kann ich mich alleine.', '13:45'),
  ]),

  S('sp0e02c05_klassenchat_anpfiff', [
    classChat('Klasse 7b'),
    m(ch.lisa, 'Fahren jetzt los. Fehlt noch was?', '13:44'),
    m(ch.tom, 'Ein Torwart. 😠', '13:44'),
    m(ch.lisa, 'Markus?', '13:45'),
    m(ch.tom, 'Wollte noch „seine Tante" abholen.', '13:45'),
    m(ch.dominik, 'Heißt die zufällig Falke? 😂', '13:45'),
    m(ch.tom, 'Er war schon unten. Mit Jacke.', '13:46'),
    m(ch.dominik, 'Alles Tarnung.', '13:46'),
    m(ch.dominik, 'Bin in zehn Minuten da. Wenn er fehlt, fangen wir halt ohne ihn an.', '13:47'),
    m(ch.tom, 'Wenn der zu spät kommt, steht er am Grill!!', '13:47'),
  ]),

  S('sp0e02c05_privat_opa_warten', [
    privateChat('Markus', 'Opa'),
    m(ch.opa, 'Wir sind da.', '13:48'),
    m(ch.opa, 'Markus?', '13:49'),
    m(ch.opa, 'Nicht wieder „gleich". Bitte.', '13:50'),
  ]),

  S('sp0e02c05_klassenchat_markus_da', [
    classChat('Klasse 7b'),
    m(ch.lisa, 'Stehen noch an der Ampel. Habt ihr schon angefangen?', '13:53'),
    m(ch.chioma, 'Noch nicht.', '13:53'),
    m(ch.chioma, 'Markus ist gerade gekommen. Mit seiner Tante.', '13:54'),
    m(ch.chioma, 'Sein Opa hat fast geweint vor Freude, sie zu sehen! ❤️', '13:54'),
    m(ch.lisa, 'Also war die Tante doch echt?!', '13:55'),
  ]),

  S('sp0e02c05_sysimg_ankunft', [
    sysImg(B('sp0e02c04_4a-512.webp')),
  ]),

  S('sp0e02c05_klassenchat_nachher', [
    classChat('Klasse 7b'),
    m(ch.lisa, 'Das war ein super Nachmittag!', '17:08'),
    m(ch.lisa, 'Lea schläft mit ihren roten Stiefeln auf dem Sofa.', '17:08'),
    m(ch.finn, 'Starker Einsatz.', '17:09'),
    m(ch.dominik, 'Ich habe vier Tore geschossen.', '17:09'),
    m(ch.tom, 'Wissen wir.', '17:09'),
    m(ch.lisa, 'Lea ist so stolz, dass sie fast eins geschossen hat. Erzählt sie jedem, den sie trifft.', '17:10'),
    m(ch.markus, 'War ja auch wirklich knapp.', '17:10'),
    m(ch.dominik, 'Du hättest selbst schießen können.', '17:10'),
    m(ch.markus, 'Lea stand besser.', '17:11'),
    m(ch.dominik, 'Hat trotzdem vorbeigeschossen.', '17:11'),
    m(ch.lisa, 'Danke Markus. Meine Schwester hat gesagt: „Markus hat MIR den Ball gegeben. Zweimal!" und war richtig stolz. Ich glaub, sie ist ein bisschen verliebt in dich. 😻', '17:11'),
    m(ch.markus, 'Lisa, sie ist 6!', '17:12'),
    m(ch.chioma, 'Und ich war froh, dass Jonas seine Gitarre dabei hatte und mein Lieblingslied gespielt hat. 😊', '17:12'),
    m(ch.dominik, 'Zufällig! Ausgerechnet ihr Lieblingslied. Verrückt.', '17:13'),
    m(ch.jonas, 'Das wusste ich gar nicht.', '17:13'),
    m(ch.dominik, 'Das wusste er gar nicht. 😂', '17:13'),
    m(ch.jonas, '🙄', '17:14'),
  ]),

  S('sp0e02c05_klassenchat_artikel', [
    m(ch.chioma, 'Mein Artikel für die Schülerzeitung ist fertig. ⚽🎄', '18:10'),
    bonusLink('anstoss-weihnachtskick', 'Schülerzeitung 7b – Ein alter Ball bringt alle zusammen', '/newspaper/anstoss-weihnachtskick', 'Artikel öffnen →'),
  ]),

  S('sp0e02c05_switch_amy_vertrauen', [
    amyChat(),
  ]),

  MIT('sp0e02c05_item_tom_vertrauen',
    'Diesmal schreibt Markus die Wahrheit. Aber nach all dem Warten glaubt Tom ihm kaum noch. Stell dir vor, du wärst Tom: Was bräuchtest du, um dich wieder auf Markus verlassen zu können? Wähle zwei Dinge, die dir besonders wichtig wären.',
    'responsibility',
    'take_responsibility',
    [
      opt('a', 'Dass er die nächsten verabredeten Zeiten wirklich einhält.', 1),
      opt('b', 'Dass er früh Bescheid sagt, wenn sich etwas ändert.', 1),
      opt('c', 'Dass er zugibt, was schiefgelaufen ist, ohne ständig neue Ausreden zu suchen.', 1),
      opt('d', 'Dass er mir zuhört und ernst nimmt, warum ich sauer bin.', 1),
    ],
    {
      minSelections: 1,
      maxSelections: 2,
      helperText: 'Wähle zwei Dinge, die dir besonders wichtig wären.',
      topics: ['reflect-understand', 'talk-act'],
    },
  ),

  AF('sp0e02c05_amy_feedback_vertrauen', 'sp0e02c05_item_tom_vertrauen'),

  S('sp0e02c05_amy_tipp_vertrauen', [
    m(ch.amy, 'Amy-Tipp: Alle Antworten sind möglich. Wenn du selbst Vertrauen zurückgewinnen möchtest: Mach eine kleine Zusage, die du wirklich einhalten kannst. Dass es klappt, zählt mehr als noch ein großes „Versprochen!".'),
  ]),

  S('sp0e02c05_privat_falke_naechste', [
    privateChat('Markus', 'Falke27'),
    m(ch.falke27, 'Ben fragt, ob ihr das wieder macht.', '19:02'),
    m(ch.markus, 'Klar! Nächstes Weihnachten.', '19:03'),
    m(ch.falke27, 'Der meint nächste Woche 😂', '19:03'),
    m(ch.markus, 'Cool, dass ihr noch gekommen seid.', '19:03'),
    m(ch.falke27, 'Besser als sich über die Finalrunde aufzuregen.', '19:04'),
    m(ch.falke27, 'Morgen um sechs wieder online?', '19:04'),
    m(ch.markus, 'Klar. Kann 30 Minuten.', '19:04'),
    m(ch.falke27, 'Passt. Ben kommt auch dazu, will diesmal vorne spielen.', '19:05'),
  ]),

  S('sp0e02c05_privat_opa_abschluss', [
    privateChat('Markus', 'Opa'),
    m(ch.markus, 'Das war lustig. Viel besser als immer nur auf der Bank zu sitzen.', '19:16'),
    m(ch.opa, 'Da saßt du heute doch auch.', '19:17'),
    m(ch.markus, '?', '19:17'),
    m(ch.opa, 'Neben mir und Tante Hanne.', '19:17'),
    m(ch.markus, '😂 Ach ja! Mit euch sitz ich gern auf der Bank.', '19:18'),
    sysImg(B('sp0e02c04_4b-512.webp')),
    m(ch.markus, 'Übrigens: Der Trainer hat zugeguckt. Er hat mein Team-Play gelobt. 😊 Er sagt, das macht eine Mannschaft aus und möchte mich jetzt häufiger aufstellen.', '19:18'),
    m(ch.opa, 'Da freue ich mich für dich.', '19:19'),
    m(ch.opa, 'Du hast deine Handschuhe vergessen. Habe sie eingesteckt. Liegen jetzt bei mir.', '19:19'),
    m(ch.markus, 'Hol ich morgen. Vier Uhr?', '19:20'),
    m(ch.opa, 'Vier Uhr klingt gut.', '19:20'),
    m(ch.markus, 'Und dann erzählst du mir von deinem besten Spiel.', '19:20'),
    m(ch.opa, 'Das war heute.', '19:21'),
  ]),
]);

// ─────────────────────────────────────────────────────────────────────────────
// EPISODE
// ─────────────────────────────────────────────────────────────────────────────

const sp0e02De: StoryEpisodeV02 = {
  id: 'sp0e02',
  seasonId: 'sp',
  episodeId: 'sp0e02',
  courseId: 'sp0e02',
  chapters: [c01, c02, c03, c04, c05],
};

export default sp0e02De;
