import type { Character } from '../../../common/types';
import type { Reaction } from '../../../common/types';
import { STORY_CHARACTERS as ch } from '../../../content/characters';
import type { StoryEpisodeV02 } from '../../types/storyTypes';
import {
  m, img, sysMsg, sysImg, typing, divider, bonusLink, amyTip,
  privateChat, classChat, amyChat,
  opt, optSegs, rc,
  S, inp, IT, MIT, AF, GR, OR, AR, CH, C,
} from '../storyBuilder';

const R = (emoji: string, type?: string): Reaction => ({ emoji, type });

// Episodenlokaler Charakter: Emmas Freundin vom Häkelkurs
const freundin: Character = { id: 'freundin_haekelkurs', name: 'Freundin', avatar: 'freundin_haekelkurs' };

// ── Kapitel 1 — Amic 1 · Mittwoch Nachmittag ─────────────────────────────────

const c01 = C('s1e05c01', 0, 'Amic 1', 'Nur ein Sticker', [

  S('s1e05c01_story_groupchat_sticker', [
    privateChat('Dominik', 'Markus', 'Lisa', 'Elsa'),
    m(ch.elsa, '@Lisa: Ich denk du bist mit Yasmin verabredet?', '15:16'),
    m(ch.lisa, '😕', '15:16'),
    m(ch.elsa, 'Was hat sie denn so Wichtiges vor?', '15:17'),
    m(ch.lisa, 'Keine Ahnung.', '15:17'),
    m(ch.dominik, 'Mimimi, herrscht wieder mal dicke Luft bei den BFFs?', '15:18'),
    m(ch.lisa, 'Lass mich.', '15:18'),
    m(ch.elsa, 'Also ich hab Yasmin vorhin mit Noah gesehen. Guckt sie beim Basketball zu?', '15:19'),
    m(ch.lisa, 'Was weiß ich.', '15:19'),
    m(ch.dominik, '🤔', '15:20'),
    m(ch.dominik, 'Dann sorgen wir jetzt für gute Laune. 😂', '15:20'),
    m(ch.lisa, 'Was meinst du?', '15:20'),
    m(ch.dominik, 'Ein süßer kleiner Sticker von den beiden.', '15:20'),
    m(ch.lisa, 'Lass Yasmin da raus, ich krieg nur noch mehr Ärger.', '15:21'),
    m(ch.dominik, 'Och menno. Langweilig.', '15:21'),
    m(ch.dominik, 'Na gut, dann vielleicht jemand, der sich immer so richtig schön aufregt. 😈', '15:21'),
    m(ch.dominik, '@Markus: Erstell mal irgendwas... du weißt schon.', '15:21'),
    m(ch.markus, 'Ich?', '15:21'),
    m(ch.dominik, 'Natürlich du. Mach schon!', '15:21'),
    m(ch.markus, 'Leute! Ich hab\'s. 😂', '15:21'),
    img(ch.markus, 'media/story/episodes/s1e05/s1e05c01-512.webp', '15:21'),
    m(ch.lisa, 'NEIN 😭', '15:22'),
    m(ch.elsa, 'HAHAHAHAHA', '15:22'),
    m(ch.dominik, '😂😂😂😂😂', '15:22'),
    m(ch.dominik, 'Ich wusste es.', '15:23'),
    m(ch.dominik, 'Die beiden passen perfekt zusammen.', '15:23'),
    m(ch.lisa, 'Emma bringt dich um!', '15:23'),
    m(ch.markus, 'Mich??', '15:23'),
    m(ch.markus, 'Das war Dominiks Idee!', '15:24'),
    m(ch.dominik, 'Ich hab halt die besten Ideen 🤟🏼', '15:24'),
    m(ch.elsa, 'Seit wann ist Noah so romantisch? 😂', '15:24'),
    m(ch.markus, '[[ki]] kann alles.', '15:25'),
    m(ch.lisa, 'Woher hattest du überhaupt das Foto von Noah?', '15:25'),
    m(ch.markus, 'Aus dem Klassenchat.', '15:25'),
    m(ch.lisa, 'Und daraus hast du den Sticker gemacht?', '15:25'),
    m(ch.markus, 'Ja klar.', '15:26'),
    m(ch.markus, 'Machen doch alle.', '15:26'),
    m(ch.elsa, 'Naja, Noah bestimmt nicht. 😂', '15:26'),
    m(ch.markus, 'Ups.', '15:26'),
    m(ch.lisa, 'Ich weiß nicht, ob die das so toll finden.', '15:27'),
    m(ch.elsa, 'Sie sind ja gar nicht im Chat.', '15:27'),
    m(ch.dominik, 'Jetzt heult mal nicht rum.', '15:27'),
    m(ch.dominik, 'Ist doch lustig.', '15:27'),
    m(ch.lisa, 'Darf man sowas denn überhaupt?', '15:28'),
    m(ch.dominik, 'Was weiß ich 🤨', '15:28'),
    m(ch.lisa, 'Naja, die sehen den Sticker ja eh nicht.', '15:28'),
    m(ch.markus, 'Ja Leute, nicht [[weiterleiten]]. Klar?', '15:29'),
    sysMsg('Dominik hat den Sticker gespeichert.'),
    m(ch.markus, '@Dominik: Hast du den Sticker gespeichert? Wir wollten ihn doch nicht weiterleiten. 😳', '15:30'),
    m(ch.dominik, 'Bleib locker. Mach ich schon nicht.', '15:30'),
    m(ch.dominik, 'Wer kommt jetzt dran?', '15:31'),
  ], ['fairness', 'safe-online']),

  S('s1e05c01_story_switch_amy', [
    amyChat(),
  ]),

  IT('s1e05c01_item_sticker_folgen',
    'Markus schreibt, dass niemand den Sticker weiterleiten soll. Warum ist die Sache damit noch nicht unbedingt erledigt?',
    'judgement',
    'rules_consequences',
    [
      optSegs('a', 'Weil Dominik den Sticker schon gespeichert hat. Niemand weiß, was er jetzt damit macht.', 3,
        'Genau.',
        '💡 Wenn du unsicher bist, ob das Verhalten im Chat okay ist, frag dich:\n• Was könnte als Nächstes passieren?\n• Könnte sich jemand verletzt fühlen?\n• Würde ich das auch posten, wenn die betroffene Person direkt dabei wäre?',
      ),
      optSegs('b', 'Weil Dominik wohl nicht aufhört, Sticker von anderen Kindern zu erstellen.', 3,
        'Genau.',
        '💡 Wenn du unsicher bist, ob das Verhalten im Chat okay ist, frag dich:\n• Was könnte als Nächstes passieren?\n• Könnte sich jemand verletzt fühlen?\n• Würde ich das auch posten, wenn die betroffene Person direkt dabei wäre?',
      ),
      optSegs('c', 'Weil Noah und Emma den Sticker bestimmt auch gern sehen würden.', 1,
        'Das könnte sein. In dem Fall müssten Emma und Noah direkt darauf angesprochen werden.',
        '💡 Würde ich den Inhalt auch posten, wenn die betroffene Person direkt dabei wäre?',
      ),
      optSegs('d', 'Für mich wäre die Situation damit geklärt.', 0,
        'Auch wenn Markus bittet, den Sticker nicht weiterzuleiten, heißt das nicht, dass alle sich daran halten.',
        '💡 Wenn du unsicher bist, ob das Verhalten im Chat okay ist, frag dich: Was könnte als Nächstes passieren?',
      ),
    ],
    ['info-check', 'fairness'],
  ),

  AF('s1e05c01_af_sticker_folgen', 's1e05c01_item_sticker_folgen'),

  S('s1e05c01_story_amy_bonus_sticker', [
    m(ch.amy, 'Chioma fragt sich: „Ist es eigentlich erlaubt, Sticker von anderen zu erstellen?'),
    bonusLink('sticker-rechte-schutz',
      'Ist es eigentlich erlaubt, Sticker von anderen Menschen zu erstellen?',
      '/newspaper/sticker-rechte-schutz',
      'Artikel öffnen →',
    ),
  ], ['safe-online']),

]);

// ── Kapitel 2 — Amic 2 · Mittwoch Nachmittag ─────────────────────────────────

const c02 = C('s1e05c02', 1, 'Amic 2', 'Sagen oder schweigen?', [

  S('s1e05c02_story_lisa_yasmin', [
    privateChat('Lisa', 'Yasmin'),
    m(ch.lisa, 'Hey...', '15:32'),
    m(ch.lisa, 'Hast du kurz Zeit?', '15:32'),
    m(ch.yasmin, 'Wieso?', '15:32'),
    m(ch.lisa, 'Ich muss dir was erzählen.', '15:32'),
    m(ch.yasmin, 'Lass mich raten, heute Abend gehts zum Sushi? ... Nein, du hast einen Traum-Urlaub geplant! Oder kriegst du ein neues Pferdchen? 🤨', '15:33'),
    m(ch.lisa, 'Nee...', '15:33'),
    m(ch.lisa, 'Also...', '15:33'),
    m(ch.yasmin, 'Ich muss gleich los.', '15:34'),
    m(ch.yasmin, 'Schreib einfach.', '15:34'),
    m(ch.lisa, 'Ach, egal.', '15:34'),
    m(ch.yasmin, 'Na dann.', '15:35'),
    sysImg('/media/story/episodes/s1e05/s1e05c02-512.webp', 's1e05c02-img-01'),
  ], ['talk-act', 'fairness']),

  S('s1e05c02_story_lisa_user', [
    privateChat('Lisa', 'Du'),
    m(ch.lisa, '😕', '15:35'),
    m(ch.lisa, 'Ich weiß gerade echt nicht, was richtig ist.', '15:35'),
    m(ch.lisa, 'Also ich hoffe, dass sie von mir nicht solche [[fake-sticker]] machen. 😟', '15:36'),
    m(ch.lisa, 'Aber bei uns machen das grad alle. Bei euch auch?', '15:36'),
  ], ['talk-act', 'fairness']),

  inp('s1e05c02_inp_lisa_user_sticker', 'stories:s1e05.c02.input.lisa_user_sticker', {
    topics: ['talk-act'],
    promptSpeakerId: 'lisa',
    emptySubmitsAllowed: true,
  }),

  S('s1e05c02_story_lisa_user_2', [
    m(ch.lisa, 'Der Sticker vorhin...', '15:37'),
    m(ch.lisa, 'Markus hat doch extra gesagt, dass es niemand weiterschicken soll.', '15:37'),
    m(ch.lisa, 'Wenn ich Noah oder Emma jetzt was sage...', '15:38'),
    m(ch.lisa, '...dann sind die wieder sauer auf mich.', '15:38'),
    m(ch.lisa, 'Aber...', '15:38'),
    m(ch.lisa, '😣', '15:38'),
  ], ['talk-act', 'fairness']),

  S('s1e05c02_story_switch_amy', [
    amyChat(),
  ]),

  IT('s1e05c02_item_lisa_handeln',
    'Lisa fühlt sich nicht wohl bei dem Gedanken an den Sticker. Was sollte sie jetzt tun?',
    'responsibility',
    'intervene',
    [
      optSegs('a', 'Nichts sagen. Markus hat ja extra geschrieben, dass ihn niemand weiterleiten soll.', 1,
        'Es ist gut, den Sticker nicht weiterzuverbreiten. Was die beste Lösung ist, weiß man oft nicht vorher, es kommt auf verschiedene Dinge an.',
        '💡 Wenn du mitbekommst, dass peinliche Sticker von Mitschülern erstellt werden, frage dich: Kann ich verhindern, dass der Sticker weitergeleitet wird?',
      ),
      optSegs('b', 'Erst versuchen, dass der Sticker gelöscht und nicht weiterverbreitet wird. Im Zweifel Hilfe holen oder Emma und Noah informieren.', 3,
        'Genau. Hier braucht es Fingerspitzengefühl.',
        '💡 Wer könnte helfen, das Problem zu lösen? Würde es den Betroffenen helfen, davon zu wissen?',
      ),
      optSegs('c', 'Emma und Noah den Sticker sofort schicken, damit sie wissen, was passiert.', 2,
        'Das kann die fairste Option sein. Manchmal lässt sich ein Problem aber sogar vorher noch stoppen. Was die beste Lösung ist, weiß man oft nicht vorher.',
        '💡 Wenn du mitbekommst, dass peinliche Sticker von Mitschülern erstellt werden, frage dich: Kann ich verhindern, dass der Sticker weitergeleitet wird?',
      ),
      optSegs('d', 'Den Sticker im Klassenchat posten und alle fragen, ob sie ihn okay finden.', 0,
        'So würden noch viel mehr Kinder den Sticker sehen. Das könnte für Emma und Noah peinlich werden. Fair wäre es, sich für die beiden einzusetzen.',
        '💡 Wenn du mitbekommst, dass peinliche Sticker von Mitschülern erstellt werden, frage dich: Würde es den Betroffenen helfen, davon zu wissen?',
      ),
    ],
    ['talk-act', 'fairness'],
  ),

  AF('s1e05c02_af_lisa_handeln', 's1e05c02_item_lisa_handeln'),

  S('s1e05c02_story_amy_chioma_weekly', [
    m(ch.amy, 'So wie Lisa geht es vielen Jugendlichen. Würde sie im Archiv der Schülerzeitung suchen, könnte sie dazu diesen Audio-Beitrag hören.'),
    bonusLink('chioma-news-fuer-jemanden-einsetzen',
      'Wie setze ich mich für jemanden im Chat ein?',
      '/newspaper/chioma-news-fuer-jemanden-einsetzen',
      'Anhören →',
    ),
  ], ['talk-act']),

  S('s1e05c02_story_klassenchat_camping', [
    classChat(),
    m(ch.igor, 'Wer kommt mit am Wochenende? Mit den Bikes durch den Wald und dann zelten am See 😎', '15:38'),
    m(ch.tom, 'Klingt cool!', '15:39'),
    m(ch.lisa, 'Ich weiß nicht. Ist das nicht gefährlich?', '15:39'),
    m(ch.carlos, 'Ich bin raus. Habt ihr nicht gelesen?', '15:39'),
    m(ch.carlos, 'In den Wäldern da draußen wurden wieder Wölfe gesehen. 🐺', '15:40', { reactions: [R('😍'), R('😳')] }),
    m(ch.mia, 'Oha.', '15:40'),
    m(ch.dominik, 'Ich zeig dem Wolf schon, wer hier der Boss ist. 💪', '15:40'),
    m(ch.mia, '😂', '15:41'),
    m(ch.emma, 'Ich find Wölfe richtig schön. 😍', '15:41'),
    m(ch.elsa, 'Da könnt ihr ohne mich hin. 💅', '15:41'),
    m(ch.finn, 'hoffentlich seh ich mal einen', '15:42'),
    m(ch.jonas, 'Hoffentlich nicht!', '15:42'),
    m(ch.aylin, '@Jonas: Angst? Keine Sorge, ich beschütz dich. 😉', '15:42'),
    m(ch.jonas, '🙏', '15:43'),
    typing('Chioma tippt'),
    typing('Chioma löscht'),
    m(ch.chioma, 'Menschen stehen normalerweise gar nicht auf dem Speiseplan.', '15:44'),
    m(ch.elsa, 'Normalerweise? 😝 Das reicht mir nicht.', '15:44'),
  ], ['reflect-understand']),

]);

// ── Kapitel 3 — Amic 3 · Mittwoch Nachmittag ─────────────────────────────────

const c03 = C('s1e05c03', 2, 'Amic 3', 'Nur an einen', [

  S('s1e05c03_story_dominik_finn', [
    privateChat('Dominik', 'Finn'),
    sysImg('/media/story/episodes/s1e05/s1e05c03-512.webp', 's1e05c03-img-01'),
    m(ch.dominik, '😂', '15:45'),
    m(ch.dominik, 'Musst du sehen.', '15:45'),
    img(ch.dominik, 'media/story/episodes/s1e05/s1e05c01-512.webp', '15:45'),
    m(ch.dominik, 'Aber nicht [[weiterleiten]].', '15:45'),
    m(ch.finn, '😂', '15:46'),
    m(ch.finn, 'Niemals.', '15:46'),
  ], ['fairness', 'info-check']),

  S('s1e05c03_story_finn_amir', [
    privateChat('Finn', 'Amir'),
    m(ch.finn, 'guck mal 😂', '15:47'),
    img(ch.finn, 'media/story/episodes/s1e05/s1e05c01-512.webp', '15:47', { reactions: [R('😂')] }),
    m(ch.finn, 'aber nicht weiterschicken', '15:47'),
    m(ch.amir, 'Wer macht denn sowas?', '15:47'),
    m(ch.finn, 'kp', '15:47'),
    m(ch.amir, 'Ich zeig\'s nur kurz Jonas.', '15:48'),
  ], ['fairness']),

  S('s1e05c03_story_amir_jonas', [
    privateChat('Amir', 'Jonas'),
    img(ch.amir, 'media/story/episodes/s1e05/s1e05c01-512.webp', '15:48', { reactions: [R('😂')] }),
    m(ch.amir, 'Schon gesehen?', '15:48'),
  ], ['fairness']),

  S('s1e05c03_story_switch_amy_challenge', [
    amyChat(),
  ]),

  CH('s1e05c03_challenge_weiterleiten',
    '👉 Bevor du etwas weiterleitest: Warte einen Moment und frage dich: Ist es für alle fair, wenn ich das weiterleite?\nNimmst du die Herausforderung an?',
  ),

  S('s1e05c03_story_jonas_lukas', [
    privateChat('Jonas', 'Lukas'),
    m(ch.jonas, 'Kennst du das schon?', '15:50'),
    img(ch.jonas, 'media/story/episodes/s1e05/s1e05c01-512.webp', '15:50'),
    m(ch.lukas, '😐', '15:50'),
    m(ch.lukas, 'Ich finde das gar nicht lustig.', '15:51'),
    m(ch.jonas, 'Ach komm.', '15:51'),
    m(ch.lukas, 'Weiß Noah überhaupt davon?', '15:51'),
    m(ch.jonas, 'Ich glaub nicht.', '15:52'),
    m(ch.lukas, 'Dann würd ich\'s ihm sagen.', '15:52'),
    m(ch.jonas, '🤔', '15:52'),
    m(ch.jonas, 'Stimmt eigentlich.', '15:52'),
    m(ch.lukas, 'Ich warne Noah. Du meldest dich bei Emma.', '15:53'),
    m(ch.jonas, 'Ok, ist gut.', '15:53'),
  ], ['fairness', 'talk-act']),

  S('s1e05c03_story_jonas_emma', [
    privateChat('Jonas', 'Emma'),
    m(ch.jonas, 'Kurze Frage.', '15:53'),
    m(ch.jonas, 'Hat dir heute jemand ein komisches Bild geschickt?', '15:53'),
    m(ch.emma, 'Nein. Wieso? 🤔', '15:53'),
    m(ch.jonas, 'Also…', '15:54'),
  ], ['talk-act', 'fairness']),

  S('s1e05c03_story_lukas_noah', [
    privateChat('Lukas', 'Noah'),
    m(ch.lukas, 'Hey.', '15:53'),
    m(ch.lukas, 'Hast du kurz Zeit?', '15:53'),
    m(ch.noah, 'Klar.', '15:53'),
    m(ch.lukas, 'Ich glaub, du solltest etwas wissen...', '15:54'),
  ], ['talk-act', 'fairness']),

  S('s1e05c03_story_switch_amy', [
    amyChat(),
  ]),

  IT('s1e05c03_item_geheimnis_schneeball',
    'Jeder schreibt: „Nicht weiterleiten." Trotzdem kennen das Bild immer mehr Kinder. Warum passiert das?',
    'judgement',
    'rules_consequences',
    [
      optSegs('a', 'Jeder denkt, dass eine einzige Person mehr keinen großen Unterschied macht und vertraut dem Freund oder der Freundin.', 3,
        'Genau. Viele denken: „Eine Person macht doch nichts." So kann sich ein Bild trotzdem Schritt für Schritt immer weiter verbreiten.',
        '💡 Frag dich vor dem Weiterleiten: „Was könnte passieren, wenn alle so handeln wie ich?"',
      ),
      optSegs('b', 'Viele denken gar nicht darüber nach, was passiert, wenn alle das Bild jeweils einer Person zeigen.', 2,
        'Richtig. Und so kann sich ein Bild dann Schritt für Schritt immer weiter verbreiten.',
        '💡 Frag dich vor dem Weiterleiten: „Was könnte passieren, wenn alle so handeln wie ich?"',
      ),
      optSegs('c', 'Weil es normal ist, Bilder im Internet an andere weiterzuschicken.', 1,
        'Das stimmt. Das heißt aber nicht, dass das in jeder Situation eine gute Idee ist, weil sich so ein Bild Schritt für Schritt immer weiter verbreiten kann.',
        '💡 Frag dich vor dem Weiterleiten: „Was könnte passieren, wenn alle so handeln wie ich?"',
      ),
      optSegs('d', 'Das ist doch nicht schlimm. Jeder entscheidet schließlich selbst.', 0,
        'Jeder sollte bei seiner Entscheidung auch an die anderen denken. Denn sonst kann sich ein Bild Schritt für Schritt immer weiter verbreiten, obwohl es möglicherweise anderen schadet.',
        '💡 Frag dich vor dem Weiterleiten: „Was könnte passieren, wenn alle so handeln wie ich?"',
      ),
    ],
    ['info-check', 'fairness'],
  ),

  AF('s1e05c03_af_geheimnis_schneeball', 's1e05c03_item_geheimnis_schneeball'),

  S('s1e05c03_story_amy_schneeball_bonus', [
    m(ch.amy, 'Du verrätst nur 2 Freunden ein Geheimnis. Jeder von ihnen verrät es wieder 2 Freunden. Und die wiederum 2 Freunden. Wie viele Menschen kennen das „Geheimnis"?'),
    bonusLink('schneeballsystem',
      'Schneeballsystem',
      '/newspaper/schneeballsystem',
      'Ansehen →',
    ),
  ], ['info-check']),

]);

// ── Kapitel 4 — Amic 4 · Mittwoch Nachmittag ─────────────────────────────────

const c04 = C('s1e05c04', 3, 'Amic 4', 'Gar nicht lustig', [

  S('s1e05c04_story_klassenchat_emma', [
    classChat(),
    sysImg('/media/story/episodes/s1e05/s1e05c04-512.webp', 's1e05c04-img-01'),
    m(ch.emma, '😳', '15:54'),
    m(ch.emma, 'Ernsthaft jetzt??', '15:54'),
    m(ch.emma, 'Wer hat diesen Sticker gemacht??', '15:54'),
    m(ch.mia, 'Wovon redest du?', '15:55'),
    m(ch.chioma, 'Was ist passiert?', '15:55'),
    m(ch.emma, 'Jetzt tut doch nicht so! Alle wissen es doch schon.', '15:55'),
    m(ch.chioma, 'Ich weiß wirklich nicht, worum es geht.', '15:55'),
    m(ch.emma, 'Von dir haben diese Vollidioten bestimmt auch schon Fakes erstellt.', '15:56'),
    m(ch.chioma, 'Fakes?', '15:56'),
    m(ch.dominik, 'Jetzt chill mal.', '15:56'),
    m(ch.emma, 'Chill?? 😤🤬', '15:56'),
    m(ch.dominik, 'Reg dich ab. Calm down.', '15:57'),
    m(ch.emma, 'Du... Dann warst du das wieder?', '15:57'),
    m(ch.dominik, 'Gar nichts war ich. Ich will bloß dass du dich abreagierst.', '15:57'),
    m(ch.emma, 'Das werd ich nicht! So eine Beleidigung! Ich muss kotzen 🤮', '15:58'),
    m(ch.emma, '@Noah: Warst du das??', '15:58'),
    m(ch.noah, 'Ganz sicher nicht.', '15:58'),
    m(ch.emma, 'Jonas! Wer war das?', '15:59'),
    m(ch.jonas, 'Ich weiß es nicht. Tut mir leid.', '15:59'),
    m(ch.jonas, 'Ich dachte aber, ihr solltet es lieber wissen.', '15:59'),
    m(ch.emma, 'Das ist ja wohl mega peinlich.', '16:00'),
    m(ch.emma, 'Und ausgerechnet mit Noah?? Niemals! 🤢', '16:00'),
    m(ch.noah, 'Danke, Jonas.', '16:00', {
      replyTo: { speakerName: 'Jonas', text: 'Ich dachte aber, ihr solltet es lieber wissen.' },
    }),
    m(ch.noah, 'Besser so als später.', '16:00'),
    m(ch.elsa, 'Also ich war es nicht.', '16:01'),
    m(ch.dominik, 'Was regt ihr euch denn so auf?', '16:01'),
    m(ch.markus, 'Ist doch bloß Spaß.', '16:01'),
    m(ch.emma, 'Spaß??', '16:01'),
    m(ch.mia, 'Was war denn nun genau? Ich kenne nichts.', '16:02'),
    img(ch.finn, 'media/story/episodes/s1e05/s1e05c01-512.webp', '16:02'),
    m(ch.emma, 'Finn! Lass das gefälligst!!!', '16:02'),
    m(ch.chioma, 'Der Sticker soll doch gerade nicht mehr geteilt werden!', '16:02'),
    m(ch.finn, 'ist doch gar nicht so schlimm', '16:03'),
    sysMsg('Tom kommt online.', '16:03'),
    m(ch.tom, 'Hi Leute. Cooles Bild. Emma und Noah? Ich wusste gar nicht, dass ihr was miteinander habt 👍', '16:03'),
    m(ch.emma, 'Grrr 😤🤬', '16:03'),
    m(ch.noah, 'Hi Tom. Haben wir auch nicht.', '16:04'),
    m(ch.noah, 'Jemand hat einen [[fake-sticker]] von uns rumgeschickt.', '16:04'),
    m(ch.noah, 'Finn und alle hier: Löscht bitte das Bild überall und schickt es nicht mehr rum.', '16:04', { reactions: [R('👍')] }),
    m(ch.jonas, 'Ja, klar, mach ich.', '16:05'),
    m(ch.mia, 'Ich wär auch sauer.', '16:05'),
    m(ch.dominik, 'Und was soll das bitte bringen?', '16:05'),
    m(ch.noah, 'Kann bitte jeder JETZT sofort das Bild löschen?', '16:06'),
    m(ch.carlos, 'Hoffen wir, dass das jetzt noch nicht zu spät ist ...', '16:06'),
    m(ch.emma, '😳😭😫', '16:06'),
    m(ch.dominik, 'Also ich hab Wichtigeres zu tun.', '16:07'),
    m(ch.noah, 'Dann fang damit gleich danach an. Zuerst darf das Bild nicht weiter rumgehen.', '16:07'),
  ], ['reflect-understand', 'fairness']),

  S('s1e05c04_story_switch_amy', [
    amyChat(),
  ]),

  IT('s1e05c04_item_emma_noah_reaktion',
    'Emma und Noah reagieren ganz unterschiedlich auf den Sticker. Warum?',
    'perspective',
    'perspectives_distinguish',
    [
      optSegs('a', 'Sie nehmen die Situation unterschiedlich wahr. Deshalb fühlt sich Emma schlecht behandelt, Noah bleibt ruhiger.', 3,
        'Genau. Und du oder ich würden das noch wieder anders wahrnehmen und vielleicht auch anders darauf reagieren.',
        '💡 Wenn du mit anderen zusammen bist, frage dich nicht nur: „Wie würde ich reagieren?" Sondern auch: „Wie könnte sich die Situation für die andere Person anfühlen?"',
      ),
      optSegs('b', 'Emma ist empfindlicher als Noah. Deshalb reagieren die beiden unterschiedlich.', 2,
        'Das kann ein Grund sein. Auch unterschiedliche Erfahrungen und Gefühle spielen oft eine Rolle. Du oder ich würden das noch wieder anders wahrnehmen und vielleicht auch anders reagieren.',
        '💡 Wenn du mit anderen zusammen bist, frage dich nicht nur: „Wie würde ich reagieren?" Sondern auch: „Wie könnte sich die Situation für die andere Person anfühlen?"',
      ),
      optSegs('c', 'Ich verstehe nicht, wie Noah in dieser Situation noch so ruhig bleiben kann.', 1,
        'Unterschiedliche Erfahrungen und Gefühle spielen oft eine Rolle. Du oder ich würden das noch wieder anders wahrnehmen und vielleicht auch anders reagieren.',
        '💡 Wenn du mit anderen zusammen bist, frage dich nicht nur: „Wie würde ich reagieren?" Sondern auch: „Wie könnte sich die Situation für die andere Person anfühlen?"',
      ),
      optSegs('d', 'Ich würde ganz anders reagieren.', 0,
        'Das glaube ich sofort. Jeder nimmt eine Situation anders wahr und reagiert auch unterschiedlich. Erfahrungen und Gefühle spielen dabei oft eine Rolle.',
        '💡 Wenn du mit anderen zusammen bist, frage dich nicht nur: „Wie würde ich reagieren?" Sondern auch: „Wie könnte sich die Situation für die andere Person anfühlen?"',
      ),
    ],
    ['reflect-understand'],
  ),

  AF('s1e05c04_af_emma_noah_reaktion', 's1e05c04_item_emma_noah_reaktion'),

]);

// ── Kapitel 5 — Amic 5 · Mittwoch Abend / Donnerstag Morgen ─────────────────

const c05 = C('s1e05c05', 4, 'Amic 5', 'Du wusstest davon?', [

  S('s1e05c05_story_yasmin_lisa_konfrontation', [
    privateChat('Yasmin', 'Lisa'),
    divider('Mittwoch Abend'),
    m(ch.yasmin, 'Ganz ehrlich: Emma übertreibt komplett.', '16:30'),
    m(ch.lisa, 'Findest du?', '16:30'),
    m(ch.yasmin, 'Ja.', '16:31'),
    m(ch.yasmin, 'Das war doch offensichtlich nur Spaß.', '16:31'),
    m(ch.lisa, 'Markus wollte bestimmt nicht, dass das überall landet.', '16:31'),
    m(ch.yasmin, 'Markus war das? Woher weißt du das?', '16:32'),
    m(ch.lisa, '🤐', '16:32'),
    m(ch.yasmin, 'Lisa?', '16:32'),
    m(ch.lisa, 'Ich...', '16:33'),
    m(ch.lisa, 'Ich war in der Gruppe.', '16:33'),
    m(ch.yasmin, 'Du?', '16:33'),
    m(ch.lisa, 'Em, ja...?', '16:33'),
    m(ch.yasmin, 'Warum laden die dich immer ein? 😠', '16:34'),
    m(ch.lisa, 'Ich weiß nicht.', '16:34'),
    m(ch.yasmin, 'Du warst in der Gruppe und hast die einfach machen lassen? 🤨', '16:34'),
    m(ch.lisa, 'Was hätte ich denn tun sollen?', '16:35'),
    m(ch.yasmin, 'Du hättest die stoppen müssen!! Natürlich.', '16:35'),
    m(ch.lisa, 'Du hast doch gerade gesagt: Emma übertreibt und das war doch nur Spaß...', '16:35'),
    m(ch.yasmin, 'Da wusste ich noch nicht, dass du in der Gruppe warst und was hättest sagen können.', '16:36'),
    m(ch.lisa, 'Aber Markus hat gesagt, niemand soll das weiterschicken.', '16:36'),
    m(ch.yasmin, 'Und deshalb hast du einfach nichts gesagt??? 🤨', '16:37'),
    m(ch.lisa, 'Ich dachte wirklich, das war nur ein Witz und dann vergessen es alle wieder.', '16:37'),
    m(ch.yasmin, 'Emma und Noah hätten es von dir erfahren müssen.', '16:38'),
    m(ch.lisa, 'Dann hätten alle wieder gesagt, ich petze.', '16:38'),
    m(ch.yasmin, 'Ja und? Es wäre richtig gewesen.', '16:38'),
    sysImg('/media/story/episodes/s1e05/s1e05c05-512.webp', 's1e05c05-img-01'),
    m(ch.yasmin, 'Du hast wieder nur an dich gedacht, dass niemand sauer auf dich ist.', '16:39'),
    m(ch.lisa, 'Das stimmt nicht.', '16:39'),
    m(ch.yasmin, 'Doch.', '16:39'),
    m(ch.yasmin, 'Du hast zugeschaut.', '16:40'),
    m(ch.lisa, '😞', '16:40'),
    m(ch.yasmin, 'Weißt du was?', '16:41'),
    m(ch.yasmin, 'Genau deshalb vertraut dir niemand mehr.', '16:41'),
    m(ch.lisa, '...', '16:41'),
  ], ['reflect-understand', 'talk-act']),

  S('s1e05c05_story_lisa_user_freundebuch', [
    privateChat('Lisa', 'Du'),
    m(ch.lisa, 'Oh je. Mach ich wirklich immer alles falsch?', '16:42'),
    m(ch.lisa, 'Da muss ich erstmal tief durchatmen.', '16:42'),
    m(ch.lisa, 'Liebe {{chatName}}, ich habe dir jetzt auch in dein Freundebuch geschrieben. 😊', '16:43'),
    bonusLink('char-lisa', 'Charakterkarte Lisa', '/cards/char-lisa', 'Karte ansehen →'),
  ], ['reflect-understand']),

  inp('s1e05c05_inp_lisa_user_response', 'stories:s1e05.c05.input.lisa_user_response', {
    topics: ['talk-act'],
    promptSpeakerId: 'lisa',
    emptySubmitsAllowed: true,
  }),

  S('s1e05c05_story_switch_amy', [
    amyChat(),
  ]),

  OR('s1e05c05_reflection_yasmin_meinung',
    'Warum ändert Yasmin ihre Meinung? Erst verharmlost sie den Sticker, dann wirft sie Lisa vor, nichts getan zu haben.',
    {
      topics: ['reflect-understand'],
      category: 'ACTION',
      fixedAmyReply: 'Von außen ist es oft leicht zu sagen, was jemand hätte tun sollen. Viel schwieriger ist es, wenn man selbst in dieser Situation ist.',
      bypassAi: true,
    },
  ),

  S('s1e05c05_story_klassenchat_wolf_nacht', [
    classChat(),
    m(ch.carlos, '@Igor: Du solltest dir das mit dem Zelten nochmal überlegen. Jetzt soll sogar schon ein Schaf gerissen worden sein.', '16:44'),
    m(ch.igor, 'Ich überleg´s mir nochmal.', '16:44'),
    m(ch.lisa, 'Das arme Schaf. Hoffentlich kommen die Wölfe nicht noch näher.', '16:45'),
    m(ch.dominik, 'Dann gibt\'s eben Wolfsburger. 🍔😂', '16:45'),
    m(ch.mia, '🤦‍♀️', '16:46'),
  ], ['info-check']),

  S('s1e05c05_story_emma_lisa_wolfsfoto', [
    privateChat('Emma', 'Lisa'),
    divider('Donnerstag Morgen'),
    m(ch.emma, 'Lisa... a propos näher kommen.', '7:32'),
    m(ch.emma, 'Guck mal.', '7:32'),
    img(ch.emma, 'media/story/episodes/s1e05/s1e05c06-512.webp', '7:32', { reactions: [R('😳')] }),
    m(ch.emma, 'Meine Freundin hat das heute früh geschickt. 😳', '7:32'),
   m(ch.lisa, '😳', '7:33'),
  ], ['info-check']),

]);

// ── Kapitel 6 — Amic 6 · Donnerstag Morgen ───────────────────────────────────

const c06 = C('s1e05c06', 5, 'Amic 6', 'Jetzt sind sie schon hier', [

  S('s1e05c06_story_emma_lisa_wolf', [
    privateChat('Emma', 'Lisa'),
    m(ch.lisa, 'Wo ist das??', '7:33'),
    m(ch.emma, 'Im Hain hinter der Schule.', '7:33'),
    m(ch.lisa, 'Echt???', '7:33'),
    m(ch.emma, 'Meine Freundin vom Häkelkurs schwört.', '7:34'),
    m(ch.lisa, 'Hat sie den Wolf selbst gesehen?', '7:34'),
    m(ch.emma, 'Ja. Und jetzt kommt´s:', '7:34'),
    m(ch.emma, 'Ich hab ihn sogar auch gesehen. 🙌', '7:34'),
    m(ch.emma, 'Wir haben gestern noch spät´ne Runde mit den Hunden gedreht und dachten, da wäre ein großer Hund. Ein Husky oder so. Aber ohne Leine!', '7:35'),
    m(ch.emma, 'Aber...', '7:35'),
    m(ch.emma, 'Dann hat sie im Internet gesucht und dieses Foto gefunden!', '7:36'),
    m(ch.emma, 'Und plötzlich waren wir uns sicher, dass es genau das Tier war. 🥹', '7:36'),
    m(ch.lisa, '😳', '7:36'),
    m(ch.emma, 'Das ist ja so aufregend. 😱', '7:37'),
    m(ch.emma, 'Echt. Der war wirklich hier.', '7:37'),
    m(ch.lisa, 'Wahnsinn. Da mag ich ja gar nicht mehr allein zur Schule gehen. 😨', '7:37'),
  ], ['info-check']),

  S('s1e05c06_story_switch_amy', [
    amyChat(),
  ]),

  OR('s1e05c06_reflection_wolf_story',
    'Stell dir vor, Emma erzählt dir von einem Wolf vor der Schule. Was würde dir durch den Kopf gehen?',
    {
      topics: ['info-check'],
      category: 'ACTION',
      fixedAmyReply: 'Spannende Geschichten fühlen sich oft besonders glaubwürdig an. Bevor du sie weitererzählst, hilft es, noch einmal nachzufragen oder nach weiteren Informationen zu suchen.',
      bypassAi: true,
    },
  ),

  S('s1e05c06_story_groupchat_wolf_weitergabe', [
    privateChat('Lisa', 'Dominik', 'Markus', 'Igor', 'Lukas', 'Elsa'),
    m(ch.lisa, 'Guckt mal. Seid bloß vorsichtig, wenn ihr mal spät draußen seid. Das hier gleich vor der Schule. Im Hain.', '7:53'),
    img(ch.lisa, 'media/story/episodes/s1e05/s1e05c06-512.webp', '7:53'),
    m(ch.dominik, '😳', '7:53'),
    m(ch.markus, 'Alter...', '7:54'),
    m(ch.elsa, 'Was ist DAS??', '7:54'),
    m(ch.lisa, 'Ein Wolf. Hier gleich hinter der Schule.', '7:54'),
    m(ch.igor, 'Niemals.', '7:54'),
    m(ch.lisa, 'Doch.', '7:55'),
    m(ch.lisa, 'Hat eine Freundin von Emma heute früh fotografiert.', '7:55'),
    m(ch.lukas, 'Sicher?', '7:55'),
    m(ch.lisa, 'Em... ja.', '7:55'),
    m(ch.dominik, 'Ich wollte eh mal gegen einen Wolf kämpfen. 💪 Jetzt muss ich nicht mal mehr mein Zelt einpacken.', '7:56'),
    m(ch.igor, 'Das ist ja jetzt echt krass.', '7:56'),
    m(ch.markus, 'Schick das mal in den Klassenchat.', '7:57'),
    m(ch.markus, 'Oder noch besser: zu Aylin und den von der Schülerzeitung.', '7:57'),
    m(ch.lisa, '🤔', '7:57'),
    m(ch.lukas, 'Lasst uns das lieber erst abklären.', '7:58'),
    m(ch.dominik, 'Haben wir doch.', '7:58'),
    m(ch.dominik, 'Das müssen alle wissen.', '7:58'),
    m(ch.elsa, 'Aber echt!', '7:58'),
    m(ch.lisa, 'Ist gut, ich schick\'s.', '7:59'),
  ], ['info-check']),

]);

// ── Kapitel 7 — Amic 7 · Donnerstag Mittag ───────────────────────────────────

const c07 = C('s1e05c07', 6, 'Amic 7', 'Alle reden darüber', [

  S('s1e05c07_story_klassenchat_wolf', [
    classChat(),
    divider('Donnerstag Mittag'),
    m(ch.lisa, 'Leute...', '12:12'),
    m(ch.lisa, 'Bitte passt heute auf, wenn ihr nach Hause geht.', '12:12'),
    img(ch.lisa, 'media/story/episodes/s1e05/s1e05c06-512.webp', '12:12', { reactions: [R('😳'), R('🐺'), R('👀'), R('😱')] }),
    m(ch.mia, 'Was ist das???', '12:13'),
    m(ch.dominik, 'Hallo? Ein Wolf. 😏', '12:13'),
    m(ch.mia, '🙄 Schlaumeier. Ich mein, woher ist das?', '12:13'),
    m(ch.emma, 'Das hat meine Freundin heute früh geschickt.', '12:14'),
    m(ch.dominik, 'Was macht sie mitten in der Nacht in der Schule? 😂', '12:14'),
    m(ch.lisa, 'Wir gehen da immer mit den Hunden längs. Und das ist nicht mitten  in der Nacht, sondern spät Abends. 🙄', '12:14'),
    m(ch.carlos, 'Ich mach ab jetzt Homeschooling.', '12:14'),
    m(ch.noah, 'Ich schließ´ mich dir an. Mit meinem Rollstuhl bin ich nur auf asphaltierter Strecke unschlagbar. 😎', '12:15'),
    m(ch.dominik, 'Ihr seid echt zwei Heulsusen. 😂', '12:15'),
    m(ch.elsa, 'Also, ich hab auch keinen Bock zerfleischt zu werden.', '12:15'),
    m(ch.finn, '😳', '12:16'),
    m(ch.mia, 'Wenn ich dafür Mathe verpasse, kann der Wolf mich gern mitnehmen.', '12:16'),
    m(ch.carlos, 'Wo war denn das genau? Ist so dunkel auf dem Bild.', '12:16'),
    m(ch.emma, 'Im Hain.', '12:17'),
    m(ch.igor, 'Krass. Da wär ich ja sogar beim Zelten noch besser aufgehoben.', '12:17'),
    m(ch.dominik, 'Mir doch egal, wo ich den Wolf plattmach. 💪🐺', '12:17'),
    m(ch.igor, 'Na dann viel Erfolg.', '12:18'),
    m(ch.aylin, 'Darf ich das Bild für die Schülerzeitung haben?', '12:18'),
    m(ch.emma, 'Klar.', '12:18'),
    m(ch.aylin, '👍', '12:18'),
  ], ['info-check']),

  S('s1e05c07_story_schuelerzeitung_redaktion', [
    privateChat('Schülerzeitung'),
    sysImg('/media/story/episodes/s1e05/s1e05c07-512.webp', 's1e05c07-img-01'),
    m(ch.aylin, 'Das ist DIE Titelstory.', '15:23'),
    m(ch.jonas, 'Du meinst das mit dem Wolf? Schon heftig.', '15:23'),
    m(ch.carlos, 'Wenn\'s stimmt.', '15:24'),
    m(ch.aylin, 'Spielverderber. 🙄', '15:24'),
    m(ch.aylin, 'Emma würde sich sowas doch nicht ausdenken.', '15:24'),
    m(ch.jonas, 'Aber echt.', '15:25'),
    m(ch.carlos, 'Emma nicht.', '15:25'),
    m(ch.carlos, 'Aber woher weiß ihre Freundin das?', '15:25'),
    m(ch.aylin, 'Hat sie doch gesagt. Sie hat den Wolf gesehen.', '15:25'),
    m(ch.carlos, 'Angeblich.', '15:26'),
    m(ch.aylin, 'Carlos 🙄', '15:26'),
    m(ch.jonas, 'Ist Chioma heute gar nicht dabei?', '15:26'),
    m(ch.aylin, 'Keine Ahnung, online ist sie nicht.', '15:26'),
    m(ch.carlos, 'Ich glaub, sie muss heute Babysitten.', '15:27'),
    m(ch.aylin, 'Ist doch egal. Wir berichten ihr später davon.', '15:27'),
    m(ch.aylin, 'Lasst uns doch zu der Sache mit dem Wolf erstmal recherchieren.', '15:27', { reactions: [R('👍')] }),
    m(ch.jonas, 'Okay. Machen wir das.', '15:28'),
  ], ['info-check']),

  S('s1e05c07_story_switch_amy', [
    amyChat(),
  ]),

  IT('s1e05c07_item_carlos_satz',
    'Carlos schreibt: „Wenn\'s stimmt." Warum könnte dieser kurze Satz wichtig sein?',
    'judgement',
    'credibility_assess',
    [
      optSegs('a', 'Weil Carlos damit zeigt, dass man Informationen erst prüfen sollte, bevor man sie glaubt.', 3,
        'Genau! Carlos erinnert hier daran, dass man nicht sofort davon ausgehen kann, dass eine Geschichte stimmt.',
        '💡 Wenn viele Leute über dasselbe sprechen, wirkt es leicht als würde es stimmen.',
      ),
      optSegs('b', 'Weil Carlos damit zeigt, dass er sich noch nicht sicher ist, ob die Geschichte stimmt.', 2,
        'Ja. Noch wichtiger ist, dass Carlos daran erinnert: Bevor man etwas glaubt oder weitererzählt, sollte man erst prüfen, ob es stimmt.',
        '💡 Wenn viele Leute über dasselbe sprechen, wirkt es leicht als würde es stimmen.',
      ),
      optSegs('c', 'Weil Carlos zeigt, dass er vorsichtig ist.', 0,
        'Ja. Noch wichtiger ist, dass Carlos daran erinnert: Bevor man etwas glaubt oder weitererzählt, sollte man erst prüfen, ob es stimmt.',
        '💡 Wenn viele Leute über dasselbe sprechen, wirkt es leicht als würde es stimmen.',
      ),
      optSegs('d', 'Der Satz von Carlos ist nicht relevant. Alle wissen doch schon von dem Wolf.', 0,
        'Gerade wenn viele Menschen über etwas sprechen, wirkt es oft glaubwürdig. Trotzdem kann eine Geschichte falsch oder unvollständig sein.',
        '💡 Bevor man etwas glaubt oder weitererzählt, sollte man erst prüfen, ob es stimmt.',
      ),
    ],
    ['info-check'],
  ),

  AF('s1e05c07_af_carlos_satz', 's1e05c07_item_carlos_satz'),

]);

// ── Kapitel 8 — Amic 8 · Donnerstag Nachmittag ───────────────────────────────

const c08 = C('s1e05c08', 7, 'Amic 8', 'Zwei Quellen', [

  S('s1e05c08_story_jonas_user_freundebuch', [
    privateChat('Jonas', 'Du'),
    m(ch.jonas, 'Hi {{chatName}}, wie geht\'s?', '16:30'),
  ], ['reflect-understand']),

  inp('s1e05c08_inp_jonas_user', 'stories:s1e05.c08.input.jonas_user', {
    topics: ['talk-act'],
    promptSpeakerId: 'jonas',
    emptySubmitsAllowed: true,
  }),

  S('s1e05c08_story_jonas_karte', [
    m(ch.jonas, 'Ich hab dir in dein Freundebuch geschrieben.', '16:31'),
    bonusLink('char-jonas', 'Charakterkarte Jonas', '/cards/char-jonas', 'Karte ansehen →'),
  ], ['reflect-understand']),

  S('s1e05c08_story_aylin_jonas_recherche', [
    privateChat('Aylin', 'Jonas'),
    sysImg('/media/story/episodes/s1e05/s1e05c08-512.webp', 's1e05c08-img-01'),
    m(ch.aylin, 'Ich hab noch was gefunden!', '17:15'),
    m(ch.aylin, '[Link]', '17:15'),
    m(ch.jonas, '😳', '17:16'),
    m(ch.carlos, 'Ein [[blog]]. Aktuell ist er.', '17:16'),
    m(ch.carlos, 'Die anderen Beiträge sind auch aus der Gegend.', '17:16'),
    m(ch.aylin, 'Da! Der Artikel über den Wolf. Unseren Wolf.', '17:17'),
    m(ch.jonas, 'Damit haben wir die zweite [[quelle]]! 👍', '17:17'),
    m(ch.carlos, 'Aber...', '17:17'),
    m(ch.aylin, 'Aber die saugen sich doch nicht einfach irgendwas aus den Fingern.', '17:18'),
    m(ch.carlos, '🤔', '17:18'),
    m(ch.jonas, 'Warten wir auf Chioma?', '17:18'),
    m(ch.aylin, 'Die ist gerade nicht da.', '17:19'),
    m(ch.aylin, 'Wir können doch nicht jedes Mal warten, wenn sie beim Babysitten ist. Und früher haben wir die Schülerzeitung auch ganz gut ohne sie hinbekommen.', '17:19'),
    m(ch.jonas, 'Meint ihr nicht, es wäre fairer?', '17:20'),
    m(ch.aylin, 'Das klingt jetzt aber verdächtig nach einer Ausrede. Wenn du was besseres zu tun hast, als an dem Artikel zu arbeiten, sag es ruhig.', '17:20'),
    m(ch.jonas, 'Nein, überhaupt nicht.', '17:21'),
    m(ch.aylin, 'Außerdem ist Alvarez sowieso der Letzte, der freigibt.', '17:21'),
    m(ch.jonas, 'Also gut.', '17:21'),
    m(ch.carlos, 'Mist, so spät schon? Ich muss los. Prüft die Story aber ordentlich und vergesst nicht, euch das Okay geben zu lassen.', '17:22'),
    m(ch.aylin, 'Alles klar.', '17:22'),
    sysMsg('1,5 Stunden später …'),
    m(ch.jonas, 'Fertig. 🥳', '18:56', { reactions: [R('⭐')] }),
    m(ch.aylin, 'Klasse Teamwork!', '18:57'),
    m(ch.jonas, 'Dann lass uns den Artikel jetzt zu Carlos und Chioma schicken. Wenn wir uns für eine Redaktionssitzung verabreden, kann der Artikel vielleicht schon morgen oder übermorgen rausgehen. 😀', '18:57'),
    m(ch.aylin, 'Oder überübermorgen oder überüberübermorgen.', '18:58'),
    m(ch.aylin, '🙄 Die Neuigkeit ist morgen überall, dann weiß eh die ganze Schule davon und niemand liest mehr unseren Artikel.', '18:58'),
    m(ch.jonas, 'Aber ohne Alvarez geht\'s doch sowieso nicht.', '18:59'),
    m(ch.aylin, 'Überlass das einfach mir. 😎', '18:59'),
    sysMsg('Eine Stunde später …'),
    m(ch.aylin, '✅ Freigegeben!', '19:54'),
    m(ch.jonas, 'Echt schon?', '19:54'),
    m(ch.aylin, 'Hab ich doch gesagt. 😎', '19:55'),
    m(ch.aylin, 'Und er lobt, dass wir alle zusammen im Team arbeiten und unsere [[quelle]] gegenchecken. 😊', '19:55'),
    m(ch.jonas, '„Wir alle"? Wir sind doch nur zu zweit.', '19:56'),
    m(ch.aylin, 'Egal. Veröffentlichen?', '19:56'),
    typing('Jonas tippt'),
    typing('Jonas löscht'),
    m(ch.jonas, 'Mach.', '19:57'),
    sysMsg('✅ Artikel veröffentlicht.', '19:57'),
    m(ch.jonas, '😳', '19:57'),
    m(ch.aylin, 'Wir waren die Ersten!!', '20:34'),
  ], ['info-check', 'reflect-understand']),

  S('s1e05c08_story_switch_amy', [
    amyChat(),
  ]),

  IT('s1e05c08_item_jonas_gefuehle',
    'Wie glaubst du, fühlt sich Jonas in diesem Moment?',
    'perspective',
    'perspectives_recognize',
    [
      optSegs('a', 'Stolz, aber auch unsicher.', 3,
        'Genau. Jonas zeigt hier gleichzeitig unterschiedliche Gefühle. Das geht jedem mal so.',
        '💡 Manchmal haben wir alle mehrere Gefühle gleichzeitig. Das ist ganz normal.',
      ),
      optSegs('b', 'Er freut sich nicht so wie Aylin, weil er den Artikel noch mit Carlos und Chioma besprechen wollte.', 2,
        'Genau, das ist ein wichtiger Teil seiner Gefühle. Gleichzeitig ist er auch stolz und freut sich mit Aylin.',
        '💡 Manchmal haben wir alle mehrere Gefühle gleichzeitig. Das ist ganz normal.',
      ),
      optSegs('c', 'Er freut sich, dass sie den Artikel so schnell fertig haben.', 1,
        'Genau. Gleichzeitig wirkt Jonas auch unsicher. Es sieht so aus, als hätte er den Artikel lieber erst noch mit Carlos und Chioma besprochen.',
        '💡 Manchmal haben wir alle mehrere Gefühle gleichzeitig. Das ist ganz normal.',
      ),
      optSegs('d', 'Ich hätte anders reagiert.', 0,
        'Das glaube ich dir. Wir alle fühlen und handeln unterschiedlich. Versuche das nächste Mal, dich auch in die andere Person hineinzuversetzen.',
        '💡 Manchmal haben wir alle mehrere Gefühle gleichzeitig. Das ist ganz normal.',
      ),
    ],
    ['reflect-understand'],
  ),

  AF('s1e05c08_af_jonas_gefuehle', 's1e05c08_item_jonas_gefuehle'),

]);

// ── Kapitel 9 — Amic 9 · Freitag Mittag ──────────────────────────────────────

const c09 = C('s1e05c09', 8, 'Amic 9', 'Chioma', [

  S('s1e05c09_story_chioma_jonas', [
    privateChat('Chioma', 'Jonas'),
    divider('Freitag'),
    m(ch.chioma, 'Jonas.', '12:03'),
    m(ch.jonas, 'Chioma 😊', '12:03'),
    m(ch.jonas, 'Wir haben dich gestern vermisst. Bei der Besprechung für die [[redaktion]].', '12:03'),
    m(ch.chioma, 'Das glaub ich sofort. 😠', '12:04'),
    m(ch.chioma, 'Ihr habt meine Abwesenheit ja gleich für einen Riesen-Knaller genutzt.', '12:04'),
    m(ch.jonas, 'Der Wolfs-Artikel kommt super an. Hast du ihn gelesen?', '12:04'),
    m(ch.chioma, '…', '12:05'),
    m(ch.jonas, 'Bist du sauer?', '12:05'),
    m(ch.chioma, 'Das wäre untertrieben!!', '12:05'),
    m(ch.jonas, 'Nur weil mal jemand anders Erfolg hat als du? Müssen wir dir immer hinterher laufen und alles von „der großen Chefin" absegnen lassen?', '12:06'),
    m(ch.chioma, 'Das hat damit gar nichts zu tun.', '12:06'),
    m(ch.jonas, 'Oh doch. Darum bist du doch sauer. Weil du einmal nicht im Mittelpunkt stehst!', '12:07'),
    m(ch.chioma, 'Im Mittelpunkt stehe ich sehr wohl! Herr Alvarez kocht vor Wut. Ich musste sogar aus dem Unterricht raus, weil er mit mir sprechen wollte…', '12:07'),
    m(ch.chioma, '… mich runtermachen wollte trifft es wohl eher. 😭', '12:08'),
    sysImg('/media/story/episodes/s1e05/s1e05c09-512.webp', 's1e05c09-img-01'),
    m(ch.jonas, 'Warum? Was ist passiert? Er wusste doch von dem Artikel…?', '12:08'),
    m(ch.chioma, 'Er hat mir vertraut.', '12:09'),
    m(ch.jonas, 'Das ist doch super.', '12:09'),
    m(ch.chioma, 'Nein, das ist es nicht!', '12:09'),
    m(ch.chioma, 'Ich habe sein Vertrauen missbraucht. Sagt er.', '12:10'),
    m(ch.chioma, 'Er war im Stress. Hat „UNSEREN" 🙃😡 Artikel nur überflogen. Gesehen, dass ihr die [[quelle]] „GEPRÜFT" habt. Das ich nicht lache!!', '12:10'),
    m(ch.chioma, 'Jonas.', '12:11'),
    m(ch.jonas, 'Ja?', '12:11'),
    m(ch.chioma, 'Wem gehörte eigentlich dieser Blog?', '12:11'),
    m(ch.jonas, 'Keine Ahnung. Künstler Name.', '12:12'),
    m(ch.chioma, 'Denk nach.', '12:12'),
    m(ch.jonas, '...', '12:13'),
    m(ch.jonas, '😳', '12:13'),
    m(ch.jonas, 'Emmas Freundin?', '12:13'),
    m(ch.chioma, 'Bingo.', '12:13'),
    m(ch.chioma, 'Das waren nie zwei Quellen.', '12:14'),
    m(ch.jonas, 'Oh.', '12:14'),
    m(ch.chioma, 'Ja: Oh.', '12:14'),
  ], ['info-check', 'reflect-understand']),

  S('s1e05c09_story_switch_amy_challenge', [
    amyChat(),
  ]),

  CH('s1e05c09_challenge_quellen',
    '👉 Wenn dir jemand etwas erzählt, das unglaublich klingt, stelle eine zusätzliche Frage, bevor du es glaubst.\nZum Beispiel:\nWoher weißt du das?\nWer hat das gesehen?\nGibt es noch eine andere Erklärung?\nNimmst du die Herausforderung an?',
  ),

  S('s1e05c09_story_chioma_jonas_alvarez', [
    privateChat('Chioma', 'Jonas'),
    m(ch.chioma, 'Herr Alvarez kriegt jetzt echt Probleme. Wegen euch.', '12:15'),
    m(ch.jonas, 'Oh. Das wollte ich nicht. Und es tut mir Leid.', '12:16'),
    m(ch.jonas, 'Aber: Ist Alvarez nicht auch irgendwie dafür da, unsere Artikel zu checken?', '12:16'),
    m(ch.chioma, 'Du…', '12:17'),
    sysMsg('Chioma ist offline.', '12:17'),
  ], ['info-check', 'reflect-understand']),

  S('s1e05c09_story_jonas_user', [
    privateChat('Jonas', 'Du'),
    m(ch.jonas, 'Oh nein. Was soll ich nur machen?', '12:18'),
  ], ['reflect-understand']),

  inp('s1e05c09_inp_jonas_user_ratschlag', 'stories:s1e05.c09.input.jonas_user_ratschlag', {
    topics: ['talk-act'],
    promptSpeakerId: 'jonas',
    emptySubmitsAllowed: true,
  }),

  S('s1e05c09_story_jonas_tagebuch', [
    m(ch.jonas, 'Ich hab Tagebuch geschrieben. Aber! Nur für dich. Zeig es niemandem.', '12:20'),
    bonusLink('diary-jonas-entry3', 'Jonas\' Tagebuch', '/diaries/diary_jonas', 'Tagebuch lesen →'),
  ], ['reflect-understand']),


  S('s1e05c09_story_emma_freundin', [
    privateChat('Emma', 'Freundin'),
    m(freundin, 'Emma!!', '12:15'),
    m(freundin, 'Warum schickt mir meine Cousine gerade den Artikel aus eurer Schülerzeitung?? 😠', '12:15'),
    m(ch.emma, '?', '12:16'),
    m(freundin, 'Na, über den Wolf!', '12:16'),
    m(ch.emma, '😳', '12:16'),
    m(freundin, 'Ich hab das DIR geschickt. Nur dir.', '12:17'),
    m(ch.emma, 'Ich hab es nur Lisa gezeigt.', '12:17'),
    m(freundin, 'Ja toll.', '12:17'),
    m(freundin, 'Und jetzt hat es auch mein Vater in seiner Feuerwehrgruppe. Und alle sehen MEINEN Blog als [[quelle]]. Meinen Blog lesen sonst nur 2 Leute. Dieser Artikel wurde schon 258 Mal aufgerufen! 😳', '12:18'),
    m(ch.emma, 'Was??', '12:18'),
    m(freundin, 'Außerdem...', '12:19'),
    m(freundin, 'Ich habe das Tier eben noch einmal gesehen.', '12:19'),
    m(ch.emma, 'Und?', '12:19'),
    m(freundin, 'Wir haben einen Riesen-Fehler gemacht.', '12:20'),
  ], ['info-check']),

  S('s1e05c09_story_switch_amy_2', [
    amyChat(),
  ]),

  IT('s1e05c09_item_jonas_fehler',
    'Jonas merkt plötzlich, dass der Artikel viel größere Folgen hat als gedacht. Was hätte er im Nachhinein lieber anders machen sollen?',
    'judgement',
    'rules_consequences',
    [
      optSegs('a', 'Sich noch etwas Zeit nehmen mit der Recherche und den Artikel in der Redaktion besprechen.', 3,
        'Genau. Manchmal lohnt es sich, vor einer wichtigen Entscheidung kurz innezuhalten.',
        '💡 Bevor du etwas veröffentlichst oder weiterleitest, frag dich immer: Was könnte dadurch passieren und wen betrifft das vielleicht noch?',
      ),
      optSegs('b', 'Den Artikel erst noch mit Chioma und Carlos besprechen, bevor sie ihn veröffentlichen.', 2,
        'Stimmt. Und es lohnt sich, vor einer wichtigen Entscheidung kurz innezuhalten.',
        '💡 Bevor du etwas veröffentlichst oder weiterleitest, frag dich immer: Was könnte dadurch passieren und wen betrifft das vielleicht noch?',
      ),
      optSegs('c', 'Das war schon okay. Herr Alvarez hat den Artikel schließlich freigegeben.', 1,
        'Ja, trotzdem trägt auch Jonas Verantwortung für das, was er veröffentlicht. Deshalb lohnt es sich, vor einer wichtigen Entscheidung kurz innezuhalten.',
        '💡 Bevor du etwas veröffentlichst oder weiterleitest, frag dich immer: Was könnte dadurch passieren und wen betrifft das vielleicht noch?',
      ),
      optSegs('d', 'Das ist jetzt eben passiert. Daran kann man eh nichts mehr ändern.', 0,
        'Fehler passieren. Wichtig ist, daraus zu lernen und beim nächsten Mal vorher über mögliche Folgen nachzudenken.',
        '💡 Bevor du etwas veröffentlichst oder weiterleitest, frag dich immer: Was könnte dadurch passieren und wen betrifft das vielleicht noch?',
      ),
    ],
    ['info-check', 'reflect-understand'],
  ),

  AF('s1e05c09_af_jonas_fehler', 's1e05c09_item_jonas_fehler'),

]);

// ── Kapitel 10 — Amic 10 · Freitag Nachmittag ────────────────────────────────

const c10 = C('s1e05c10', 9, 'Amic 10', 'Das war gar kein Wolf', [

  S('s1e05c10_story_yasmin_lisa_wolf', [
    privateChat('Yasmin', 'Lisa'),
    sysImg('/media/story/episodes/s1e05/s1e05c10-512.webp', 's1e05c10-img-01'),
    m(ch.yasmin, 'Na?', '14:48'),
    m(ch.lisa, '?', '14:48'),
    m(ch.yasmin, 'Hast du den Wolf inzwischen eingefangen? 🐺😏', '14:48'),
    m(ch.lisa, 'Hä?', '14:48'),
    m(ch.yasmin, 'Oje...', '14:49'),
    m(ch.yasmin, 'Dann weißt du\'s echt noch nicht.', '14:49'),
    m(ch.lisa, 'Was denn??', '14:49'),
    m(ch.yasmin, 'Das war gar kein Wolf.', '14:50'),
    m(ch.lisa, '😳', '14:50'),
    m(ch.yasmin, 'Ein Husky.', '14:50'),
    m(ch.lisa, 'Was??', '14:50'),
    m(ch.yasmin, 'Tja.', '14:51'),
    m(ch.yasmin, 'Diesmal weiß ICH mal mehr als du. 😌', '14:51'),
    m(ch.lisa, 'Woher?', '14:51'),
    m(ch.yasmin, 'Tja...', '14:52'),
    m(ch.yasmin, 'Emma.', '14:52'),
    m(ch.yasmin, 'Wie fühlt man sich so als Tratschtante?', '14:52'),
    m(ch.lisa, 'Jetzt hör aber mal auf!', '14:52'),
    m(ch.yasmin, 'Ich? Du kannst doch deinen Mund nicht halten und musst gleich alle mit reinziehen?', '14:53'),
    m(ch.lisa, 'Wie bitte?', '14:53'),
    m(ch.yasmin, 'Du hast das Foto doch weitergeschickt!', '14:53'),
    m(ch.lisa, 'Ja!', '14:54'),
    m(ch.lisa, 'Weil du mich letztes Mal fertiggemacht hast, dass ich nichts gesagt habe!', '14:54'),
    m(ch.yasmin, 'Das ist doch was ganz anderes.', '14:54'),
    m(ch.lisa, 'Nein!', '14:55'),
    m(ch.lisa, 'Als ich geschwiegen habe, war ich feige.', '14:55'),
    m(ch.lisa, 'Jetzt hab ich etwas gesagt.', '14:55'),
    m(ch.lisa, 'Jetzt bin ich auch wieder die Dumme.', '14:55'),
    m(ch.lisa, 'IMMER! Immer gibst du mir die Schuld an allem. 😭', '14:56'),
    m(ch.lisa, 'Egal, was ich mache...', '14:56'),
    m(ch.lisa, 'Für dich ist es immer falsch.', '14:56'),
    m(ch.lisa, 'Was hab ich dir denn getan, dass du so über mich denkst? 😢', '14:57'),
    m(ch.yasmin, 'Das stimmt doch alles überhaupt nicht. 😠', '14:57'),
    m(ch.lisa, 'Doch.', '14:57'),
    m(ch.yasmin, 'Du bist doch eh immer perfekt! Perfekte Selfies, perfekte Stories, perfekte Connections, perfekte Outfits, perfekt, perfekt, perfekt!!', '14:58'),
    m(ch.lisa, 'Perfekt? Ich? Nie im Leben!', '14:58'),
    m(ch.lisa, 'Ich bin es satt, dass ich mich bei dir entschuldigen muss, wenn bei mir mal was Schönes passiert. 😔', '14:59'),
    m(ch.lisa, 'ICH freue mich, wenn dir etwas Schönes passiert.', '14:59'),
    m(ch.lisa, 'Aber weißt du was das Traurige ist?', '15:00'),
    m(ch.lisa, 'Du freust dich gar nicht mehr mit mir.', '15:00'),
  ], ['reflect-understand', 'fairness']),

  S('s1e05c10_story_switch_amy_challenge', [
    amyChat(),
  ]),

  CH('s1e05c10_challenge_mitfreuen',
    '👉 Freu dich einmal bewusst für jemanden.\nSag dann auch:\n„Super." oder „Da freue ich mich für dich."\nDas macht den anderen glücklicher.\nUnd meistens sogar dich selbst. 😊',
  ),

  S('s1e05c10_story_lisa_schluss', [
    privateChat('Yasmin', 'Lisa'),
    m(ch.lisa, 'Soll ich dir in Zukunft nur noch die blöden Sachen zeigen?', '15:01'),
    m(ch.lisa, 'Wenn ich krank bin?', '15:01'),
    m(ch.lisa, 'Oder wenn ich heule?', '15:01'),
    m(ch.lisa, 'Darf ich dann vielleicht deine Freundin sein? 💔', '15:02'),
    m(ch.yasmin, '...', '15:03'),
    m(ch.lisa, 'Mir reicht´s. Tschüß.', '15:03'),
    sysMsg('Lisa ist offline.', '15:03'),
  ], ['reflect-understand', 'fairness']),

  S('s1e05c10_story_yasmin_user', [
    privateChat('Yasmin', 'Du'),
    m(ch.yasmin, 'Autsch. Das saß.', '15:04'),
    m(ch.yasmin, 'In so einem Moment hilft mir nur mein Tagebuch.', '15:04'),
    bonusLink('diary-yasmin-entry4', 'Yasmins Tagebuch', '/diaries/diary_yasmin', 'Tagebuch lesen →'),
  ], ['reflect-understand']),

  S('s1e05c10_story_switch_amy', [
    amyChat(),
  ]),

  IT('s1e05c10_item_yasmin_aerger',
    'Was könnte hinter Yasmins Ärger auf Lisa wirklich stecken?',
    'perspective',
    'goal_conflicts',
    [
      optSegs('a', 'Yasmin ist nicht nur wegen des Wolfsbildes wütend. Sie vergleicht sich schon länger mit Lisa und ist eifersüchtig auf sie.', 3,
        'Genau. Es passiert oft, dass hinter einem Streit viel mehr steckt.',
        '💡 Wenn jemand plötzlich heftig reagiert, steckt oft mehr dahinter als das, worüber gerade gestritten wird. Es kann helfen, darüber zu sprechen.',
      ),
      optSegs('b', 'Yasmin ärgert sich hauptsächlich darüber, dass Lisa das Wolfsfoto einfach weitergeschickt hat.', 2,
        'Das spielt eine Rolle. Im Chat merkt man aber, dass Yasmin noch etwas anderes beschäftigt: Sie ist eifersüchtig auf ihre Freundin.',
        '💡 Wenn jemand plötzlich heftig reagiert, steckt oft mehr dahinter als das, worüber gerade gestritten wird. Es kann helfen, darüber zu sprechen.',
      ),
      optSegs('c', 'Yasmin ist sauer, weil sie glaubt, dass Lisa einfach immer alles falsch macht.', 1,
        'Im Chat merkt man, dass Yasmin eigentlich etwas ganz anderes beschäftigt: Sie ist eifersüchtig auf Lisa. Hinter einem Streit steckt oft viel mehr, als man zuerst denkt.',
        '💡 Wenn jemand plötzlich heftig reagiert, steckt oft mehr dahinter als das, worüber gerade gestritten wird. Es kann helfen, darüber zu sprechen.',
      ),
      optSegs('d', 'Yasmin ist gemein. Das hat mit Lisa gar nichts zu tun.', 0,
        'Manchmal wirkt jemand unfair oder gemein. Dahinter können aber auch verletzte Gefühle oder Unsicherheiten stecken. Im Chat merkt man, dass Yasmin eifersüchtig auf Lisa ist.',
        '💡 Wenn jemand plötzlich heftig reagiert, steckt oft mehr dahinter als das, worüber gerade gestritten wird. Es kann helfen, darüber zu sprechen.',
      ),
    ],
    ['reflect-understand'],
  ),

  AF('s1e05c10_af_yasmin_aerger', 's1e05c10_item_yasmin_aerger'),

]);

// ── Kapitel 11 — Amic 11 · Freitag Nachmittag ────────────────────────────────

const c11 = C('s1e05c11', 10, 'Amic 11', 'Das Schaf im Wolfspelz', [

  S('s1e05c11_story_schuelerzeitung_korrektur', [
    classChat(),
    sysMsg('Die Schülerzeitung hat einen neuen Beitrag veröffentlicht.', '15:52'),
    amyTip('Korrektur: Kein Wolf im Hain vor der Schule\n\nIn unserem Artikel stand, dass ein Wolf hinter der Schule gesehen wurde. Das stimmt nach aktuellem Stand nicht. Das Tier war sehr wahrscheinlich ein Husky.\n\nDas Foto zeigte zwar einen echten Wolf, wurde aber nicht vor unserer Schule aufgenommen.\n\nUnser Fehler: Wir hatten zwei Quellen, aber beide gingen auf dieselbe ursprüngliche Annahme zurück. Deshalb waren es keine zwei unabhängigen Belege, sondern nur einer – den wir nicht ordentlich überprüft haben.\n\nWir hätten gründlicher prüfen müssen.\n\nEs tut uns leid.\n— Die Redaktion'),
  ], ['info-check', 'reflect-understand']),

  S('s1e05c11_story_switch_amy_challenge', [
    amyChat(),
  ]),

  CH('s1e05c11_challenge_wolf_moment',
    '👉 Es gibt immer irgendwo einen „Wolf".\nEtwas, das erst völlig eindeutig wahr aussieht ...\n... und sich später als etwas ganz anderes herausstellt.\nWenn dir so ein Wolf-Moment begegnet, schreibe ihn in dein Tagebuch.\nDas kann eine Nachricht, ein Streit, ein Foto, ein Gerücht oder auch nur ein Missverständnis sein.\nNimmst du die Herausforderung an?',
  ),

  S('s1e05c11_story_klassenchat_epilog', [
    classChat(),
    m(ch.mia, 'Also kein Wolf?', '15:58'),
    m(ch.tom, 'Nur ein Husky.', '15:58'),
    m(ch.emma, 'Huskys mag ich auch.', '15:58'),
    m(ch.finn, 'huskys sind aber nicht gefährlich.', '15:59'),
    m(ch.igor, 'Wölfe für Menschen eigentlich auch nicht.', '15:59'),
    m(ch.carlos, 'Aber sie haben scharfe Zähne.', '15:59'),
    m(ch.emma, 'Die haben Huskys auch.', '16:00'),
    m(ch.dominik, 'Ich leg mich auch mit einem Killer-Husky an. 💪', '16:00'),
    m(ch.noah, 'Ich hatte mich schon auf den freien Schultag gefreut.', '16:00'),
    m(ch.carlos, 'Wegen eines Huskys?', '16:01'),
    m(ch.noah, 'Ich nehme, was ich kriegen kann.', '16:01'),
    m(ch.emma, '😔 Sorry.', '16:01'),
    m(ch.noah, 'Immerhin war diesmal niemand mit mir verlobt.', '16:02', { reactions: [R('😂')] }),
    m(ch.mia, '😭😂', '16:02'),
    m(ch.carlos, '@Emma: Stopp jetzt, du hast dich schon gefühlt 2000 Mal entschuldigt. Lappen drüber.', '16:02'),
    m(ch.emma, 'Lappen drüber? 😂', '16:02', { reactions: [R('😂')] }),
    m(ch.carlos, 'Ich wollte dich nur zum Lachen bringen. Ich weiß natürlich, dass es Schwamm drüber heißt. 😏', '16:03'),
    m(ch.dominik, 'Schnell gegoogelt, Alter? 😂', '16:03'),
    m(ch.carlos, 'Verrat mich doch nicht!', '16:03'),
    sysImg('/media/story/episodes/s1e05/s1e05c11-512.webp', 's1e05c11-img-01'),
  ], ['reflect-understand']),

  S('s1e05c11_story_chioma_jonas_versoehn', [
    privateChat('Chioma', 'Jonas'),
    m(ch.jonas, 'Hi Chioma 😊', '16:04'),
    m(ch.jonas, 'Und, war unsere Entschuldigung gut genug?', '16:04'),
    m(ch.chioma, 'Naja.', '16:04'),
    m(ch.jonas, 'Wie gnädig.', '16:05'),
    m(ch.jonas, 'Immer noch sauer?', '16:05'),
    m(ch.chioma, '...', '16:06'),
    m(ch.jonas, 'Ich hab mich doch entschuldigt.', '16:06'),
    m(ch.chioma, '...', '16:07'),
    m(ch.chioma, 'Ich muss dir was sagen.', '16:07'),
    m(ch.chioma, 'Deine verdammte Entschuldigung interessiert mich absolut gar nicht. Darum geht es mir doch eigentlich überhaupt nicht!', '16:07'),
    m(ch.jonas, 'Sorry, Chioma. Ich verstehe dich einfach nicht.', '16:08'),
    m(ch.chioma, 'Wie auch?', '16:08'),
    m(ch.chioma, 'Weil du das alles mit...', '16:08'),
    m(ch.chioma, 'Aylin gemacht hast.', '16:09'),
    m(ch.chioma, 'Und nicht mit mir.', '16:09'),
    m(ch.chioma, 'Weil... ich dich mag, du Dödel. 🙈', '16:09'),
    m(ch.jonas, '😳 Was?', '16:10'),
    m(ch.jonas, 'Das ist ja komplett verrückt!! Das ist ja... Ich dreh durch!! 🤩', '16:10'),
    m(ch.jonas, '… Aber. … Ich versteh gar nichts mehr.', '16:11'),
    m(ch.jonas, 'Du hast doch gesagt, du findest mich nur nett?', '16:11'),
    m(ch.chioma, 'Wann das denn?', '16:11'),
    m(ch.jonas, 'Zu Aylin. Hat sie gesagt.', '16:12'),
    m(ch.chioma, 'Aylin hat das gesagt?', '16:12'),
    m(ch.jonas, 'Em, ja.', '16:12'),
    m(ch.chioma, 'Und warum sollte ich ausgerechnet Aylin...?', '16:13'),
    m(ch.chioma, 'Sollen wir endlich aufhören zu schreiben und ein Eis essen gehen?', '16:13'),
    m(ch.jonas, 'In 20 Minuten beim Café Fritz. Ich bin als erstes da 🤩😃', '16:13'),
  ], ['reflect-understand']),

  S('s1e05c11_story_yasmin_lisa_versoehn', [
    privateChat('Yasmin', 'Lisa'),
    m(ch.yasmin, 'Lisa?', '16:14'),
    sysMsg('Lisa ist offline.', '16:16'),
    m(ch.yasmin, 'Okay.', '16:17'),
    m(ch.yasmin, 'Dann lies es halt später.', '16:17'),
    m(ch.yasmin, 'Ich glaub, du hattest Recht.', '16:17'),
    m(ch.yasmin, 'Mist.', '16:18'),
    m(ch.yasmin, 'Ich glaub, ich war unfair. Jedenfalls ein bisschen.', '16:18'),
    m(ch.yasmin, 'Und...', '16:19'),
    m(ch.yasmin, 'vielleicht hab ich etwas zu viel an dir rumgemeckert.', '16:19'),
    sysMsg('Lisa ist online.', '16:22'),
    m(ch.lisa, 'Vielleicht?', '16:22'),
    m(ch.yasmin, '🙄', '16:22'),
    m(ch.yasmin, 'Okay, nicht nur vielleicht.', '16:23'),
    m(ch.lisa, 'Danke.', '16:23'),
    m(ch.yasmin, 'Und ich war gemein.', '16:23'),
    m(ch.lisa, 'Ja!', '16:23'),
    m(ch.yasmin, 'Musst du das so schnell bestätigen?', '16:24'),
    m(ch.lisa, 'Ja.', '16:24'),
    m(ch.yasmin, 'Und: Ja, weil ich ein bisschen neidisch war.', '16:24'),
    m(ch.yasmin, 'Echt?', '16:24'),
    m(ch.yasmin, 'So. Jetzt aber genug.', '16:25'),
    m(ch.lisa, 'Ich war auch nicht perfekt.', '16:25'),
    m(ch.yasmin, 'Doch. Bist du immer.', '16:25'),
    m(ch.lisa, 'Yasmin!', '16:26'),
    m(ch.yasmin, 'Okay, war nur Spaß. 😉', '16:26'),
    m(ch.lisa, 'Schlechter Witz. 😂', '16:26', { reactions: [R('❤️')] }),
    m(ch.lisa, 'Bei mir ist auch nicht immer alles toll.', '16:27'),
    m(ch.lisa, 'Aber das zeig ich nicht auf Fotos.', '16:27'),
    m(ch.yasmin, 'Weiß ich jetzt.', '16:27'),
    m(ch.yasmin, 'Freundinnen?', '16:28'),
    m(ch.lisa, 'Freundinnen.', '16:28'),
    m(ch.yasmin, 'Sollen wir zur Versöhnung einen Sticker von uns posten?', '16:28'),
    m(ch.lisa, 'Aus unseren Profilbildern?', '16:29'),
    m(ch.yasmin, 'Mit unseren Gesichtern drauf? Bist du verrückt?', '16:29'),
    m(ch.lisa, 'Und was dann?', '16:29'),
    m(ch.yasmin, 'Egal. Aber dieses Mal sehe ich schöner aus als du.', '16:30'),
    m(ch.lisa, 'Träum weiter. 😂', '16:30'),
    img(ch.yasmin, 'media/story/episodes/s1e05/s1e05c11-2-512.webp', '16:30'),
    m(ch.lisa, 'Perfekt.', '16:31'),
    m(ch.yasmin, 'Nicht perfekt.', '16:31'),
    m(ch.yasmin, 'Aber gut genug.', '16:31', { reactions: [R('👍')] }),
  ], ['reflect-understand', 'talk-act']),


  S('s1e05c11_story_amy_entschuldigung_bonus', [
    amyChat(),
    m(ch.amy, 'Sich zu entschuldigen, ist nicht immer leicht. Dabei weiß die Psychologie recht genau, was eine gute Entschuldigung ausmacht. Guck doch mal rein:'),
    bonusLink('gute-entschuldigung',
      'Wie funktioniert eigentlich eine wirklich gute Entschuldigung?',
      '/newspaper/gute-entschuldigung',
      'Artikel öffnen →',
    ),
  ], ['reflect-understand']),


  OR('s1e05c11_reflection_abschluss',
    'Was aus dieser Geschichte wirst du dir für dein eigenes Leben merken?',
    {
      topics: ['reflect-understand'],
      category: 'ACTION',
      fixedAmyReply: 'Was ich mitgenommen habe: Manchmal braucht es Mut, Fragen zu stellen. Manchmal braucht es Mut, einen Fehler zuzugeben. Und manchmal braucht es Mut, seine Meinung zu ändern. Es lohnt sich.',
      bypassAi: true,
    },
  ),

  AR('s1e05c11_ar_abschluss', 's1e05c11_reflection_abschluss'),

], { isEpilogue: false });

// ── Episode ───────────────────────────────────────────────────────────────────

const s1e05De: StoryEpisodeV02 = {
  id: 's1e05',
  seasonId: 's1',
  episodeId: 's1e05',
  courseId: 's1e05',
  chapters: [c01, c02, c03, c04, c05, c06, c07, c08, c09, c10, c11],
};

export default s1e05De;
