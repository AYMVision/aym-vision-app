// src/story-v02/content/de/s1e01.de.ts
// Episoden-Content – kompakt über storyBuilder-Helfer.

import type { Reaction } from '../../../common/types';
import { STORY_CHARACTERS as ch } from '../../../content/characters';
import type { StoryEpisodeV02 } from '../../types/storyTypes';
import {
  m, img, audio, typing, divider, amyTip, bonusLink, sysMsg,
  privateChat, classChat, amyChat,
  opt, optSegs, rc,
  S, inp, IT, MIT, AF, GR, OR, AR, CH, C,
} from '../storyBuilder';

const R = (emoji: string, type?: string): Reaction => ({ emoji, type });

// ─────────────────────────────────────────────────────────────────────────────
// KAPITEL 1 — Sommerferien
// ─────────────────────────────────────────────────────────────────────────────

const c01 = C('s1e01c01', 0, 'Amic 1', 'Sommerferien', [

  S('s1e01c01_story_intro_private', [
    privateChat('Du', 'Yasmin'),
    m(ch.yasmin, 'Hi 👋 Bist du neu hier im Chat?', '10:05'),
  ]),

  inp('s1e01c01_input_intro_reply', 'stories:s1e01.c01.input.introReply', {
    topics: ['talk-act'], promptSpeakerId: 'yasmin',
  }),

  S('s1e01c01_story_private_after_intro', [
    m(ch.yasmin, 'Cool.', '10:06'),
    m(ch.yasmin, 'Wie möchtest du hier im Chat genannt werden?', '10:06'),
  ], ['reflect-understand', 'talk-act']),

  inp('s1e01c01_input_chat_name', 'stories:s1e01.c01.input.chatName', {
    required: true,
    emptySubmitsAllowed: false,
    placeholderKey: 'stories:common.chatNamePlaceholder',
    maxLength: 40,
    topics: ['talk-act'],
    promptSpeakerId: 'yasmin',
  }),

  S('s1e01c01_story_private_after_name', [
    m(ch.yasmin, 'Hey {{chatName}}, sag\'s bitte nicht weiter… Aber ich bin grad sooo genervt von Lisa.', '10:07'),
    amyTip('Du kannst deinen Namen jederzeit im Profil ändern.'),
    classChat(),
    m(ch.igor, 'Habt ihr Lisas Status gesehen? Mega Fotos aus Paris 🇫🇷', '11:12', { reactions: [R('👍')] }),
    m(ch.carlos, 'Klar, auch aus Italien. 🇮🇹', '11:12'),
    m(ch.chioma, 'Echt schön 😍', '11:13'),
    m(ch.finn, 'war sie nicht noch irgendwo?', '11:13'),
    m(ch.yasmin, 'Ja, in Schottland.', '11:14'),
    m(ch.yasmin, 'Sie schickt ja ständig Bilder, um uns daran zu erinnern. 🙄', '11:14'),
    m(ch.finn, 'nicht übel. du warst in schottland?', '11:15', {
      replyTo: { speakerName: 'Yasmin', text: 'Ja, in Schottland.' },
    }),
    m(ch.yasmin, 'Nicht ich 😞', '11:15'),
    m(ch.yasmin, 'Lisa natürlich.', '11:15'),
    m(ch.yasmin, 'Ich war die ganzen Ferien hier 🥱', '11:16'),
    m(ch.carlos, 'Ist auch schon das letzte Ferienwochenende.', '11:17'),
    m(ch.finn, 'hör bloß auf', '11:17'),
    m(ch.jonas, 'Aylin ist noch bei ihrer Oma in der Türkei, glaub ich.', '11:18'),
    m(ch.finn, 'lol, die sitzt doch den ganzen tag am rechner und bastelt an ihren bildern rum', '11:18'),
    m(ch.carlos, 'Einige von ihren KI-Bildern sind wirklich stark. 👍', '11:19'),
    img(ch.lisa, '/media/story/episodes/s1e01/s1e01c01_1-512.webp', '11:19', {
      content: 'Viele Grüße aus Südfrankreich 😘',
      reactions: [R('❤️'), R('🤩'), R('❤️'), R('🔥'), R('🤩')],
    }),
    m(ch.tom, 'Klasse 🤩', '11:20'),
    m(ch.dominik, 'Krass 🔥', '11:20'),
    m(ch.igor, 'Bist du in den Cevennen ⛰️?', '11:20'),
    m(ch.lisa, 'Ja. Das hast du erkannt?', '11:21'),
    m(ch.igor, 'War auch mal da. Geile Views. Perfekt für ein Stunt-Video 😭🔥', '11:21'),
    m(ch.lisa, 'Mega. Genau, super für Fotos.', '11:22', { reactions: [R('👍')] }),
    m(ch.lisa, 'Und die Croissants!', '11:22', { reactions: [R('👍')] }),
    m(ch.carlos, 'Lecker!', '11:23'),
    m(ch.lisa, 'Und der Lavendelduft….', '11:23'),
    m(ch.lisa, 'Und jeden Tag Sonne 😎☀️', '11:24'),
    m(ch.igor, 'Hier regnet es. In Frankreich wär ich jetzt auch gern.', '11:24'),
    m(ch.lisa, 'Mit mir? ☺️', '11:24', {
      replyTo: { speakerName: 'Igor', text: 'Hier regnet es. In Frankreich wär ich jetzt auch gern.' },
    }),
    m(ch.lisa, 'Yasmin? Du bist heute so still 🤔 Ist was?', '11:25'),
    typing('Yasmin tippt ...'),
    typing('Yasmin löscht'),
    typing('Yasmin tippt ...'),
  ], ['reflect-understand', 'talk-act']),

  S('s1e01c01_story_switch_to_amy_chat', [
    amyChat(),
    m(ch.amy, 'Ich bin gespannt, was du denkst.'),
  ], ['reflect-understand']),

  IT('s1e01c01_item_yasmin_feeling',
    'Yasmin scheint sich nicht entscheiden zu können, was sie schreiben soll. Warum? Wie könnte sich Yasmin gerade fühlen?',
    'perspective', 'media_effect_understand',
    [
      opt('a', 'Yasmin überlegt wahrscheinlich, was sie schreiben kann, damit es in der Klasse gut rüberkommt.', 1),
      opt('b', 'Yasmin fühlt sich wohl ausgeschlossen und unsicher, was sie schreiben soll.', 3),
      opt('c', 'Yasmin fühlt sich ausgeschlossen oder neidisch, weil sie selbst nichts Spannendes erlebt hat.', 2),
      opt('d', 'Yasmin ist genervt von Lisa und hat keine Lust mehr, darauf zu reagieren.', 1),
    ],
    ['reflect-understand'],
  ),

  GR('s1e01c01_reflection_chat_reply',
    'Was würdest du an Yasmins Stelle in den Klassenchat schreiben?',
    [
      rc('a', '„Ne, alles gut."',
        'Für die anderen wirkt die Situation damit geklärt. Aber Yasmins eigene Gefühle stauen sich vielleicht weiter auf.',
        '💡 Persönliche Gedanken kannst du gut in einem Gespräch oder privaten Chat ansprechen.',
      ),
      rc('b', '„Ich glaube, ich bin gerade einfach ein bisschen neidisch 😅"',
        'Yasmin spricht offen aus, wie es ihr gerade geht. Und andere können besser verstehen, was bei ihr los ist.',
        '💡 Persönliche Gedanken kannst du auch gut in einem Gespräch oder privaten Chat ansprechen.',
      ),
      rc('c', '„Du musst auch echt immer zeigen, wie perfekt alles bei dir ist, oder? 🙄"',
        'Yasmin bringt ihren Frust als Vorwurf rüber. Das kann Lisa verletzen und es kann leicht ein Streit entstehen.',
        '💡 Persönliche Gedanken kannst du besser in einem Gespräch oder privaten Chat ansprechen.',
      ),
      rc('d', '„Freu mich so für dich 😍."',
        'Das wirkt freundlich, aber Yasmins eigene Gefühle stauen sich vielleicht weiter auf.',
        '💡 Persönliche Gedanken kannst du gut in einem Gespräch oder privaten Chat ansprechen.',
      ),
    ],
    { topics: ['talk-act', 'reflect-understand'] },
  ),

  AR('s1e01c01_amy_reaction_chat_reply', 's1e01c01_reflection_chat_reply'),

  S('s1e01c01_story_amy_wrapup', [
    m(ch.amy, 'Schauen wir uns an, wie Yasmin reagiert.'),
  ], ['talk-act', 'reflect-understand']),

  S('s1e01c01_story_switch_back_to_class', [
    classChat(),
  ], ['talk-act', 'reflect-understand']),

  S('s1e01c01_story_resolution', [
    m(ch.yasmin, 'Ne, was soll schon sein?', '11:27'),
    m(ch.lisa, 'Dann ist gut. Sonst sag Bescheid.', '11:27'),
    m(ch.yasmin, 'Kommst du heute zurück?', '11:28'),
    m(ch.lisa, 'Nein, morgen fliegen wir zurück. Einen Tag hab ich noch. ☀️🌻', '11:28'),
    m(ch.carlos, 'Klingt richtig gut. 😊 Das Foto am Wasserfall ist stark.', '11:29'),
    m(ch.carlos, 'Ich schau mir die Gegend gerade in [[google-earth]] an - die 3D-Ansichten sind ziemlich gut. Fühlt sich fast so an, als wär man dort 👍', '11:29'),
    m(ch.igor, 'Schick ruhig weiter so coole Fotos.', '11:30'),
    img(ch.lisa, '/media/story/episodes/s1e01/s1e01c01_2-512.webp', '11:30', {
      reactions: [R('❤️'), R('🤩')],
    }),
    m(ch.carlos, 'Super!', '11:31'),
    m(ch.tom, 'Genial.', '11:31'),
    m(ch.dominik, 'Respekt. 🔥', '11:31'),
    typing('Yasmin tippt ...'),
    typing('Yasmin löscht'),
  ], ['talk-act', 'reflect-understand']),

  S('s1e01c01_story_amy_intro_diary', [
    amyChat(),
    m(ch.amy, 'Hast du Lust in Yasmins Tagebuch zu schauen? Dort erfährst du, was in ihr vorgeht.'),
  ]),

  S('s1e01c01_story_diary_bonus', [
    bonusLink('diary-yasmin-entry1', 'Tagebucheintrag Yasmin – 1. Eintrag',
      '/diaries/diary_yasmin?entry=s1e01c01_0001', 'Eintrag öffnen →'),
  ]),
]);

// ─────────────────────────────────────────────────────────────────────────────
// KAPITEL 2 — Coole Stunts
// ─────────────────────────────────────────────────────────────────────────────

const c02 = C('s1e01c02', 1, 'Amic 2', 'Coole Stunts', [

  S('s1e01c02_story_igor_private', [
    privateChat('Igor', 'Yasmin'),
    m(ch.igor, 'Letzter Ferientag 😬', '12:04'),
    m(ch.igor, 'Bock abzuhängen? Grieswald-Berge. War da noch nie, obwohl´s echt nicht weit ist. Will da mal mit´m Bike runter. 🚵‍♂️🔥', '12:05'),
    m(ch.yasmin, 'Gucke gerade Shorts. Viele coole Ideen.', '12:06'),
    m(ch.igor, 'Guck doch später weiter.', '12:06'),
  ], ['reflect-understand', 'talk-act']),

  S('s1e01c02_story_switch_to_amy', [
    amyChat(),
  ]),

  IT('s1e01c02_item_selfcontrol',
    'Was würdest du an Yasmins Stelle tun?',
    'self_regulation', 'interrupt_impulse',
    [
      optSegs('a', 'Ich schaue einfach weiter Videos.', 0,
        'Dann findet das Treffen mit Igor ohne Yasmin statt. Ob sie das später vielleicht bereut?',
        '💡 Frag dich immer: „Worüber freue ich mich auch morgen noch?"',
      ),
      optSegs('b', 'Ich schaue noch ein bisschen weiter und entscheide dann.', 2,
        'Yasmin verschiebt die Entscheidung. Häufig vergeht dabei mehr Zeit als gedacht und die Gelegenheit ist vorbei.',
        '💡 Frag dich immer: „Worüber freue ich mich auch morgen noch?"',
      ),
      optSegs('c', 'Ich lege das Handy weg und gehe mit Igor raus.', 3,
        'Yasmin unterbricht das Scrollen. Oft entstehen genau daraus Momente, an die man sich später gern erinnert.',
        '💡 Frag dich immer: „Worüber freue ich mich auch morgen noch?"',
      ),
      optSegs('d', 'Ich bleibe bei den Videos, auch wenn ich weiß, dass ich mich später vielleicht ärgere.', 1,
        'Sich loszureißen ist manchmal schwer. Doch oft bleibt später das Gefühl: \u201eDas hätte ich gern miterlebt.\u201c',
        '💡 Frag dich immer: „Worüber freue ich mich auch morgen noch?"',
      ),
    ],
    ['reflect-understand'],
  ),

  AF('s1e01c02_amy_feedback_selfcontrol', 's1e01c02_item_selfcontrol'),

  S('s1e01c02_story_amy_wrapup', [
    m(ch.amy, 'Schauen wir uns an, wie Yasmin reagiert.'),
    m(ch.amy, 'Hast du Lust auf eine kleine Challenge?'),
    m(ch.amy, '👉 Schaffst du es, einmal ein Video NICHT zu schauen, obwohl du draufklicken willst?'),
  ]),

  S('s1e01c02_story_switch_back_igor', [
    privateChat('Igor', 'Yasmin'),
    m(ch.yasmin, 'Ok, vielleicht.', '12:30'),
    m(ch.igor, 'Kannst ja Lisa mitbringen.', '12:30'),
    m(ch.yasmin, 'Lisa? Warum?', '12:31'),
    m(ch.igor, 'Ja, warum nicht?', '12:31'),
    m(ch.yasmin, 'Ist nicht da.', '12:31'),
    m(ch.igor, 'Ach ja.', '12:32'),
    m(ch.igor, 'Also, kommst du?', '12:32'),
    m(ch.yasmin, 'Und ich darf Filmchen von deinen Stunts drehen? 🙄', '12:33'),
    m(ch.yasmin, 'Nee.', '12:33'),
    m(ch.igor, 'Okay 😅', '12:34'),
    m(ch.igor, 'Überleg´s dir. Vielleicht später.', '12:34'),
    m(ch.igor, 'Lukas kommt übrigens auch.', '12:34'),
  ]),

  S('s1e01c02_story_klassenchat', [
    classChat(),
    img(ch.lukas, '/media/story/episodes/s1e01/s1e01c02_1-512.webp', '13:12', { reactions: [R('🔥')] }),
    m(ch.lukas, 'Igor ist heute wirklich on fire. 🤓🚵‍♂️', '13:13'),
    m(ch.igor, 'Haben hier ein cooles Plätzchen gefunden.', '13:13'),
    m(ch.igor, 'Felsige Abhänge, ein rauschender Fluss und voll wenig Leute hier.', '13:14'),
    audio(ch.chioma, '/media/story/episodes/s1e01/chiomas-sprachnachricht-s1e01c01.mp3', '13:14'),
    m(ch.lisa, 'Sieht mega aus. 😍', '13:15'),
    img(ch.lisa, '/media/story/episodes/s1e01/s1e01c02_2-512.webp', '13:15', { reactions: [R('❤️')] }),
    m(ch.igor, 'Nice.', '13:16'),
    m(ch.carlos, 'Sehr schön. 😊', '13:16'),
    typing('Yasmin tippt ...'),
    typing('Yasmin löscht'),
    m(ch.yasmin, 'Ach, Lukas musst duuu jetzt filmen??', '13:18', {
      replyTo: { speakerName: 'Lukas', text: 'Igor ist heute wirklich on fire. 🤓🚵‍♂️' },
    }),
    m(ch.lukas, 'Du sagst es. Dabei könnte ich jetzt gepflegt zu Hause sitzen und Schach spielen. 😅', '13:18'),
    m(ch.lukas, 'Yasmin, du hattest doch nach einem „spektakulären Wasserfall" hier in der Nähe gefragt. 🏞️ Weiter flussabwärts soll einer sein. Ob der „spektakulär" ist, weiß ich allerdings nicht.', '13:19'),
    m(ch.yasmin, 'Was meinst du? Ich habe gar nicht gefragt!', '13:20'),
    m(ch.lukas, 'Wie? Ich meine heute morgen.', '13:20'),
    m(ch.yasmin, 'Hab ich nicht. War wohl ein Missverständnis.', '13:21'),
  ], ['reflect-understand', 'talk-act']),

  inp('s1e01c02_input_yasmin_reply', 'stories:s1e01.c01.input.introReply', {
    topics: ['talk-act'], promptSpeakerId: 'yasmin',
  }),

  S('s1e01c02_story_yasmin_card', [
    privateChat('Du', 'Yasmin'),
    m(ch.yasmin, 'Hi {{chatName}}, voll cool dein Freundebuch.', '13:31'),
    m(ch.yasmin, 'Ich habe meine Freunde-Seite ausgefüllt, schau mal.', '13:32'),
    bonusLink('char-yasmin', 'Charakterkarte Yasmin', '/cards/char-yasmin', 'Karte ansehen →'),
  ], ['talk-act']),

  S('s1e01c02_story_amy_challenge_intro', [
    privateChat('Amy'),
    m(ch.amy, 'Hast du Lust auf eine kleine Challenge?'),
  ], ['problem-solving']),

  CH('s1e01c02_challenge_video',
    '👉 Schaffst du es, einmal ein Video NICHT zu schauen, obwohl du draufklicken willst?',
  ),
]);

// ─────────────────────────────────────────────────────────────────────────────
// KAPITEL 3 — Der Plan mit dem Foto
// ─────────────────────────────────────────────────────────────────────────────

const c03 = C('s1e01c03', 2, 'Amic 3', 'Der Plan mit dem Foto', [

  S('s1e01c03_story_groupchat_hike', [
    privateChat('Igor', 'Lukas', 'Yasmin'),
    m(ch.yasmin, 'Wo seid ihr eigentlich genau?', '13:35'),
    m(ch.igor, 'kp 😂', '13:38'),
    m(ch.igor, 'Irgendwo im Wald. Richtig cool hier. 🌲🚲🐿️', '13:38'),
    m(ch.lukas, 'Ich habe meinen Standort geteilt, dann siehst du es genau.', '13:38'),
    img(ch.lukas, '/media/story/episodes/s1e01/s1e01c03_3-512.webp', '13:38'),
    m(ch.lukas, 'Ich bin ehrlich gesagt ziemlich erschöpft. 😰', '13:39'),
    img(ch.lukas, '/media/story/episodes/s1e01/s1e01c03_1-512.webp', '13:39'),
    m(ch.lukas, 'Ich hoffe nur, es ist nicht mehr allzu weit. Meine Kräfte sind nicht unbegrenzt.', '13:40'),
    m(ch.lukas, 'Aber ehrlich: Die Gegend hier ist unglaublich schön.', '13:40'),
        m(ch.lukas, 'Das soll echt gut sein für die Stimmung. Steht hier.', '13:40'),
    bonusLink('tip-amy-staunen', 'Artikel: Staunen', '/newspaper/tip-amy-staunen', 'Artikel öffnen →'),
    m(ch.yasmin, 'Und da ist ein Wasserfall?', '13:41'),
    m(ch.lukas, 'Ich sehe ihn noch nicht. Wir sind noch ein Stück weit entfernt.', '13:41'),
    m(ch.lukas, 'Igor wollte für seine Stunts unbedingt hierher – sehr abenteuerlich. 😬', '13:42'),
    m(ch.igor, 'Überleg doch, ob du nicht doch kommen möchtest.', '13:42'),
    m(ch.yasmin, 'Klingt ganz cool.', '13:43'),
    m(ch.yasmin, 'Aber mit dem Rad? 😝', '13:43'),
    m(ch.yasmin, 'Ich weiß nicht…', '13:43'),
    m(ch.lukas, 'Die Bahnstation liegt nicht weit vom Bach entfernt.', '13:44'),
    m(ch.lukas, 'Wir könnten uns am Wasserfall treffen.', '13:44'),
    m(ch.lukas, 'Vorausgesetzt ich komme da überhaupt lebend an. 😰', '13:45'),
    m(ch.lukas, 'Und?', '13:45'),
  ], ['reflect-understand', 'talk-act']),

  S('s1e01c03_story_private_yasmin_lisa', [
    privateChat('Yasmin', 'Lisa'),
    m(ch.lisa, 'Hast du Igors Posts gesehen? So cool!', '14:12'),
    img(ch.lisa, '/media/story/episodes/s1e01/s1e01c03_2-512.webp', '14:12', { forwarded: { fromName: 'Igor' } }),
    m(ch.yasmin, 'Ja.', '14:12'),
    m(ch.yasmin, 'Bist du schon zurück?', '14:12'),
    m(ch.lisa, 'Sind gerade erst zwischengelandet ✈️', '14:13'),
    m(ch.lisa, 'So schade. Ich würd so gern auch zu dieser Stunt-Strecke. 🙁', '14:13'),
    m(ch.yasmin, 'Ach ja? 🤔', '14:14'),
    m(ch.lisa, 'Klar, morgen redet bestimmt die ganze Klasse davon.', '14:14'),
    m(ch.yasmin, 'Hm. Stimmt eigentlich…', '14:15'),
  ], ['reflect-understand', 'talk-act']),

  S('s1e01c03_story_switch_to_amy', [
    amyChat(),
  ], ['reflect-understand']),

  IT('s1e01c03_item_judgement_posts',
    'Yasmin hatte eigentlich schon entschieden, zu Hause zu bleiben. Jetzt bringen sie die Nachrichten von Igor, Lukas und Lisa durcheinander. Was könnte sie darüber denken?',
    'judgement', 'judgement_explain',
    [
      optSegs('a', 'Die sind vor Ort, das ist schon ein Unterschied… aber ich bin mir trotzdem nicht sicher.', 2,
        'Yasmin merkt: Igor und Lukas sind wirklich dort und berichten aus erster Hand.',
        '👉 Gleichzeitig bleibt dieses „Hm… ich weiß nicht so recht" bei ihr bestehen.',
        '💡 Genau solche Momente sind spannend. Da beginnt Yasmin zu überlegen, was sie selbst wirklich möchte.',
      ),
      optSegs('b', 'Klingt schon gut… vielleicht lohnt es sich ja doch.', 1,
        'Yasmin merkt: Das klingt schon ziemlich gut und plötzlich fühlt sich ihre Entscheidung gar nicht mehr so sicher an.',
        '👉 Gerade wenn einem langweilig ist, wirkt das, was die anderen machen, oft noch spannender.',
        '💡 Man kann sich in so einem Moment kurz fragen: Will ich das wirklich oder will ich nur nichts verpassen?',
      ),
      optSegs('c', 'Wenn Igor und Lukas sagen, dass es gut ist, wird es schon stimmen.', 0,
        'Yasmin übernimmt hier einfach, was Igor und Lukas sagen.',
        '👉 Das wirkt erstmal logisch, weil sie vor Ort sind. Dabei geht aber leicht unter, was Yasmin selbst eigentlich will.',
        '💡 Es hilft, kurz zu überlegen: Was denke ich eigentlich selbst dazu?',
      ),
      optSegs('d', 'Igor und Lukas sind wirklich dort. Lisa denkt eher daran, was die anderen sagen werden. Und ich muss entscheiden, was für mich passt.', 3,
        'Yasmin erkennt, dass hier verschiedene Einflüsse zusammenkommen.',
        '👉 Igor und Lukas erzählen von ihrer Erfahrung. Lisa denkt eher daran, was die anderen später sagen könnten.',
        '💡 Wenn man merkt, warum man etwas denkt oder fühlt, wird Entscheiden oft leichter.',
      ),
    ],
    ['reflect-understand'],
  ),

  AF('s1e01c03_amy_feedback_judgement_posts', 's1e01c03_item_judgement_posts'),

  S('s1e01c03_story_amy_wrapup', [
    m(ch.amy, 'Mal sehen, wie Yasmin sich entscheidet – und auf welche Idee sie plötzlich kommt.'),
  ], ['reflect-understand']),

  S('s1e01c03_story_lukas_friendbook', [
    privateChat('Du', 'Yasmin'),
    m(ch.yasmin, 'Ja, wirklich, ich weiß nicht…', '14:20'),
    m(ch.yasmin, 'Übrigens... Ich hab Lukas auch gefragt, ob er dir ins Freundebuch schreibt. Er hat schon angefangen...', '14:21'),
  ], ['talk-act']),
]);

// ─────────────────────────────────────────────────────────────────────────────
// KAPITEL 4 — Am Wasserfall wird es kritisch
// ─────────────────────────────────────────────────────────────────────────────

const c04 = C('s1e01c04', 3, 'Amic 4', 'Am Wasserfall', [

  S('s1e01c04_story_lukas_friendbook', [
    privateChat('Du', 'Lukas', 'Yasmin'),
    m(ch.lukas, 'Hi {{chatName}}, ich habe mich in deinem Freundebuch verewigt.', '14:22'),
    bonusLink('char-lukas', 'Charakterkarte Lukas', '/cards/char-lukas', 'Karte ansehen →'),
    m(ch.yasmin, 'Hi {{chatName}}, wie geht\'s?', '14:22'),
  ], ['talk-act']),

  inp('s1e01c04_input_howru', 'stories:s1e01.c04.input.howru', {
    required: false,
    emptySubmitsAllowed: true,
    maxLength: 200,
    topics: ['talk-act'],
    promptSpeakerId: 'yasmin',
  }),

  S('s1e01c04_story_groupchat_waterfall', [
    privateChat('Igor', 'Lukas', 'Yasmin'),
    m(ch.yasmin, 'Wie sieht\'s aus auf eurem Ausflug?', '14:23'),
    m(ch.lukas, 'Ziemlich anstrengend 😅', '14:23'),
    m(ch.lukas, 'Die Sonne kommt durch, das sieht schon malerisch aus. Aber alles ist immer noch durchnässt. ☀️💧', '14:23'),
    m(ch.lukas, 'Gar nicht optimal für meinen guten alten Drahtesel.', '14:24'),
    m(ch.lukas, 'Schon bei wenig Druck dreht das Hinterrad durch.', '14:24'),
    m(ch.lukas, 'Die nassen Wurzeln bieten den Reifen keinen Halt. Ein kleiner Lenkfehler und ich rutsche.', '14:25'),
    m(ch.igor, 'Chill mal. Alles easy 😎', '14:25'),
    m(ch.lukas, 'Das ist kein Anstellen. Das ist Physik.', '14:26'),
    m(ch.yasmin, 'Was ist mit dem Fluss?', '14:26'),
    m(ch.lukas, 'Naja, der Geräuschkulisse nach zu urteilen, gibt es ordentlich Strömung.', '14:27'),
    m(ch.lukas, 'Der Wasserstand muss weit über dem Normalniveau liegen. 🌊 Wir sollten vorsichtig sein.', '14:28'),
    m(ch.igor, 'Hör nicht auf Lukas Gelaber: Ist echt krass hier, coole Kulisse und geile Abfahrten. 👍', '14:29'),
    m(ch.yasmin, 'Okay, mache mich auf den Weg 😊', '14:29'),
    m(ch.yasmin, 'Ich hab einen [[blog]] gefunden. Da sind Fotos - Leute im Wasser vorm Wasserfall. Sieht so cool aus… ich hätte voll Bock. Habt ihr auch Badesachen dabei?', '14:30'),
    m(ch.lukas, 'Das ist Unsinn ❌', '14:30'),
    m(ch.lukas, 'Dieser Ort ist definitiv nicht zum Baden geeignet. Erst recht nicht nach dem Regen.', '14:31'),
    m(ch.igor, 'Lasst das nachher bequatschen. Jetzt geht\'s weiter.', '14:31'),
    m(ch.lukas, 'Yasmin, warte bitte auf jeden Fall am Wasserfall auf uns. Hörst du?', '14:32'),
  ], ['reflect-understand', 'talk-act']),

  S('s1e01c04_story_private_yasmin_aylin_before_item', [
    privateChat('Yasmin', 'Aylin'),
    m(ch.yasmin, 'Sieht krass aus hier. Der Wasserfall ist beeindruckend. Umwerfend.', '15:31'),
    img(ch.yasmin, '/media/story/episodes/s1e01/s1e01c04-512.webp', '15:31'),
    m(ch.yasmin, 'Aber zum Baden? Ungemütlich und kalt am Wasser. 😰 Sieht komplett anders aus als auf den Bildern im Internet mit den badenden Leuten.', '15:32'),
    m(ch.yasmin, 'Mega laut. Kann mein eigenes Wort nicht verstehen.', '15:32'),
    m(ch.yasmin, 'Und der Boden ist nach dem Regen richtig rutschig. Musste mich eben sogar festhalten. 💧', '15:33'),
    m(ch.yasmin, 'Was meinst du, soll ich ins Wasser gehen? Das war doch eigentlich mein Plan. 🤔', '15:33'),
    m(ch.yasmin, 'Wenn ich nur ein Selfie vom Rand schicke, komme ich ja nicht gegen Lisas Bild an…', '15:34'),
  ], ['reflect-understand', 'talk-act']),

  S('s1e01c04_story_switch_to_amy', [
    amyChat(),
  ], ['reflect-understand']),

  IT('s1e01c04_item_safe_action_waterfall',
    'Yasmin hatte sich das alles ganz anders vorgestellt… Was sollte Yasmin jetzt tun?',
    'responsibility', 'do_not_harm',
    [
      optSegs('a', 'Yasmin entscheidet sich, nicht ins Wasser zu gehen.', 3,
        'Yasmin nimmt die Situation vor Ort ernst und bleibt sicher.',
        '💡 Ein guter Plan hilft. Doch manchmal muss man ihn anpassen, wenn sich etwas ändert.',
      ),
      optSegs('b', 'Yasmin entscheidet sich dafür, ins Wasser zu gehen.', 0,
        'Wenn Yasmin ausrutscht oder von der Strömung erfasst wird, kann sie sich ernsthaft verletzen. Ein Foto bekommt sie dann auch nicht.',
        '💡 Ein guter Plan hilft. Doch manchmal muss man ihn anpassen, wenn sich etwas ändert.',
      ),
      optSegs('c', 'Yasmin wartet auf Igor und Lukas und entscheidet dann mit ihnen zusammen.', 2,
        'Andere können helfen. Deine eigene Einschätzung bleibt trotzdem entscheidend.',
        '💡 Ein guter Plan hilft. Doch manchmal muss man ihn anpassen, wenn sich etwas ändert.',
      ),
      optSegs('d', 'Yasmin geht nur kurz ins Wasser, um ihr Foto zu machen.', 1,
        '\u201eNur kurz\u201c fühlt sich oft sicherer an, aber das Risiko wird dadurch nicht kleiner.',
        '💡 Ein guter Plan hilft. Doch manchmal muss man ihn anpassen, wenn sich etwas ändert.',
      ),
    ],
    ['reflect-understand'],
  ),

  AF('s1e01c04_amy_feedback_safe_action_waterfall', 's1e01c04_item_safe_action_waterfall'),

  S('s1e01c04_story_back_to_yasmin_aylin', [
    privateChat('Yasmin', 'Aylin'),
    m(ch.yasmin, 'Jetzt bin ich schon mal hier… Aber… sieht gar nicht nach Badesee aus.', '15:36'),
    m(ch.yasmin, 'Eher nach Wildwasser-Abenteuer. Was mach ich bloß?', '15:36'),
    m(ch.yasmin, 'Warte… Ich habe ´ne Idee. Vielleicht kannst du mir kurz helfen. Du kennst dich doch gut mit [[ki]] aus.', '15:37'),
    m(ch.yasmin, 'Aylin? Bist du online?', '15:37'),
  ], ['reflect-understand', 'talk-act']),

]);


 

// ─────────────────────────────────────────────────────────────────────────────
// KAPITEL 5 — Das Bild
// ─────────────────────────────────────────────────────────────────────────────

const c05 = C('s1e01c05', 4, 'Amic 5', 'Das Bild', [

  S('s1e01c05_story_class_chat_escalation', [
    classChat(),
    img(ch.yasmin, '/media/story/episodes/s1e01/s1e01c05-512.webp', '16:02', { reactions: [R('🤩')] }),
    m(ch.dominik, 'Krass.', '16:03'),
    m(ch.lisa, 'Wow', '16:03'),
    m(ch.igor, 'Geiles Bild🔥💦 Da will ich auch rein. 😎', '16:03'),
  ], ['reflect-understand', 'talk-act']),

  inp('s1e01c05_input', 'stories:s1e01.c01.input.introReply', {
    topics: ['talk-act'], promptSpeakerId: 'yasmin',
  }),

  S('s1e01c05_story_class_chat_escalation_2', [
    classChat(),
    m(ch.lukas, '😳', '16:04'),
    m(ch.lukas, 'Baden ist dort ausdrücklich nicht gestattet. Du solltest doch warten.', '16:04'),
    m(ch.lukas, 'Und zwar aus gutem Grund. Es ist äußerst gefährlich.', '16:05'),
    m(ch.chioma, '😟 Oh nein. Yasmin?', '16:05'),
    m(ch.lukas, 'Nach dem starken Regen ist das noch gefährlicher.', '16:06'),
    m(ch.dominik, 'Chill, bro. Das heißt doch nix 😤', '16:06'),
    m(ch.chioma, 'Igor, Lukas, seid ihr bei Yasmin?', '16:07'),
    m(ch.lisa, 'Sagt ihr, dass sie sofort da rauskommen soll.', '16:07'),
    m(ch.igor, 'Wir sind noch auf der Mountainbike-Strecke, aber wollen sie nachher treffen.', '16:08'),
    m(ch.chioma, 'Dann beeilt euch bitte.', '16:08'),
    m(ch.lisa, 'Und wer hat das Bild dann gemacht? 🤔', '16:09'),
    m(ch.lukas, 'Wir beeilen uns.', '16:09'),
    m(ch.lukas, 'Sind allerdings noch ziemlich weit entfernt.', '16:09'),
    m(ch.dominik, 'Immer locker. Sie hat sicher einen Riesen-Blast.', '16:10'),
    m(ch.igor, 'Klare Sache. Kein Stress.', '16:10'),
    m(ch.lukas, 'Doch. Los. Wir müssen sie sofort warnen.', '16:11'),
    m(ch.lukas, 'Der Wasserstand ist deutlich höher als gewöhnlich 🌊', '16:11'),
    m(ch.dominik, 'Ja und?', '16:12'),
    m(ch.chioma, 'Was soll das heißen?', '16:12'),
    m(ch.lukas, 'Das soll heißen, dass wir keine Zeit verlieren dürfen.', '16:12'),
    m(ch.lukas, 'Das Wasser könnte sie wegreißen. Sicher gibt es versteckte Strömungen.', '16:13'),
    m(ch.lukas, 'Jemand muss Hilfe organisieren.', '16:13'),
  ], ['reflect-understand', 'talk-act']),

  S('s1e01c05_story_switch_to_amy_trust', [
    amyChat(),
  ], ['reflect-understand']),

  OR('s1e01c05_reflection_trust',
    'Wem würdest du glauben und warum?',
    {
      topics: ['reflect-understand'],
      category: 'PERSPECTIVE',
    },
  ),

  AR('s1e01c05_amy_reaction_trust', 's1e01c05_reflection_trust'),

  S('s1e01c05_story_class_chat_escalation_3', [
    classChat(),
    m(ch.chioma, 'Das machen wir.', '16:14'),
    m(ch.lukas, 'Ich fürchte, Igor und ich könnten zu spät kommen. 😰', '16:14'),
    m(ch.lukas, 'Wir geben jetzt alles. Los!', '16:15'),
    m(ch.chioma, 'Wartet.', '16:15'),
    m(ch.chioma, 'Wo ist denn der Wasserfall?', '16:16'),
    m(ch.chioma, 'Lukas??', '16:17'),
    m(ch.chioma, 'Igor??', '16:17'),
    m(ch.chioma, 'Lukas, meldet euch!', '16:18'),
    m(ch.lisa, 'Sie antworten nicht mehr.', '16:18'),
    m(ch.chioma, 'Das fühlt sich gar nicht gut an…', '16:19'),
  ], ['reflect-understand', 'talk-act']),

  S('s1e01c05_story_amy_intro_me_diary', [
    amyChat(),
    m(ch.amy, 'Schwierige Momente kann man manchmal besser verarbeiten, wenn man sie aufschreibt.'),
    m(ch.amy, 'Gibt es etwas, das dich gerade beschäftigt?'),
  ], ['reflect-understand']),

  S('s1e01c05_story_my_diary_bonus', [
    bonusLink('diary-me', 'Mein Tagebuch',
      '/diaries/diary_me', 'Tagebuch öffnen →'),
  ]),
]);

// ─────────────────────────────────────────────────────────────────────────────
// KAPITEL 6 — Spuren im Bild
// ─────────────────────────────────────────────────────────────────────────────

const c06 = C('s1e01c06', 5, 'Amic 6', 'Spuren im Bild', [

  S('s1e01c06_story_class_find_location', [
    classChat(),
    m(ch.chioma, 'Weiß sonst noch jemand, WO das ist?', '16:20'),
    m(ch.finn, 'kein plan', '16:20'),
    m(ch.lisa, 'Keine Ahnung 🤷‍♀️', '16:21'),
    m(ch.carlos, 'Wartet kurz.', '16:21'),
    m(ch.carlos, 'Das kriegen wir raus.', '16:21'),
    m(ch.carlos, 'Im Bild könnten [[geodaten]] stecken. 📍', '16:22'),
    m(ch.lisa, 'Geodaten?', '16:22'),
    m(ch.carlos, 'Ja, aus einem Bild kann man oft ableiten, wo es aufgenommen wurde.', '16:23'),
    m(ch.carlos, 'Wenn du ein Foto mit dem Handy machst, speichert es oft Infos dazu: Ort, Uhrzeit, manchmal sogar das Gerät. Das nennt man „[[metadaten]]".', '16:23'),
    m(ch.lisa, 'Perfekt. Genau das brauchen wir. 🗺️', '16:24'),
    m(ch.carlos, 'Moment. Ay no! Im Chat werden die Koordinaten meistens entfernt.', '16:24'),
    m(ch.lisa, 'Was?', '16:25'),
    m(ch.chioma, 'Warum?', '16:25'),
    m(ch.carlos, 'Wenn ein Foto im Chat gepostet wird, werden die [[metadaten]] gelöscht. Für den [[datenschutz]].', '16:25'),
    m(ch.lisa, 'Mist.', '16:26'),
    m(ch.carlos, 'Naja, eigentlich ist das auch gut so. Damit nicht alle Zugriff auf die Daten haben.', '16:26'),
    m(ch.chioma, 'Was machen wir jetzt?', '16:27'),
    m(ch.carlos, 'Trotzdem verrät ein Bild oft etwas über den Ort. Nur nicht als genaue Koordinaten.', '16:27'),
    m(ch.lisa, 'Was meinst du?', '16:28'),
    m(ch.carlos, 'Schaut euch das Foto noch mal genau an. 🔍', '16:28'),
    m(ch.carlos, 'Was seht ihr darauf?', '16:28'),
    m(ch.lisa, 'Da ist ein Bach, man sieht Felsen.', '16:29'),
    m(ch.chioma, 'Und natürlich den Wasserfall. 💦', '16:29'),
    m(ch.carlos, 'Genau.', '16:29'),
    m(ch.chioma, 'Und das reicht?', '16:30'),
    m(ch.lisa, 'Also ich kenne den Ort nicht.', '16:30'),
    m(ch.carlos, 'Ich auch nicht. Aber ich probier Reverse Image Search. 🔍', '16:30'),
    m(ch.lisa, 'Reverse Image Search? Und was soll das sein?', '16:31'),
    m(ch.carlos, 'Statt in der Suchmaschine nach Worten zu suchen, gebe ich Yasmins Foto ein.', '16:31'),
    m(ch.chioma, 'Nicht schlecht. Das hör ich zum ersten Mal.', '16:32'),
    m(ch.chioma, 'Und? Findest du etwas?', '16:32'),
    m(ch.carlos, 'Moment…', '16:32'),
    m(ch.carlos, 'Ja, ich habe was gefunden. Es gibt Bilder im Netz, die sehr ähnlich aussehen.', '16:33'),
    m(ch.carlos, 'Nicht exakt gleich, weniger groß, weniger spektakulär. Das liegt wahrscheinlich an dem vielen Regen.', '16:33'),
    m(ch.carlos, 'Hm… espera. 🤔 Einer von diesen Wasserfällen könnte passen.', '16:34'),
    m(ch.lisa, 'Nicht schlecht.', '16:34'),
  ], ['info-check', 'problem-solving', 'talk-act']),

  S('s1e01c06_story_switch_to_amy', [
    amyChat(),
  ], ['info-check', 'problem-solving']),

  IT('s1e01c06_item_find_location',
    'Die Gruppe hat verschiedene Hinweise gesammelt, aber noch keine sichere Lösung. Was könnten sie jetzt tun?',
    'judgement', 'judgement_explain',
    [
      optSegs('a', 'Wenn sie nicht wissen, wo genau Yasmin ist, können sie nichts weiter tun.', 0,
        'Erwachsene können in so einer Situation einschätzen, was zu tun ist.',
        '💡 Wenn jemand in Gefahr sein könnte, ist es richtig, nicht zu zögern und sofort die Eltern, die Polizei oder andere Helfer zu informieren.',
      ),
      optSegs('b', 'Sie suchen nach der Adresse zu den Fotos im Internet und vergleichen, ob der Ort hinkommen kann. Dann können sie Hilfe holen.', 3,
        'Wenn man Informationen richtig nutzt, kann man gezielt helfen.',
        '💡 Wenn jemand in Gefahr sein könnte, ist es richtig, nicht zu zögern und sofort die Eltern, die Polizei oder andere Helfer zu informieren.',
      ),
      optSegs('c', 'Sie rufen Hilfe, auch wenn sie keine Anhaltspunkte zu Yasmins Aufenthaltsort haben.', 3,
        'Erwachsene haben viele Möglichkeiten, um einen unbekannten Standort herauszufinden.',
        '💡 Wenn jemand in Gefahr sein könnte, ist es richtig, nicht zu zögern und sofort die Eltern, die Polizei oder andere Helfer zu informieren.',
      ),
      optSegs('d', 'Sie versuchen weiter, Yasmin zu erreichen, um herauszufinden, was passiert ist.', 1,
        'Während die Gruppe wartet, geht wertvolle Zeit verloren. Erwachsene haben viele Möglichkeiten, um einen unbekannten Standort herauszufinden.',
        '💡 Wenn jemand in Gefahr sein könnte, ist es richtig, nicht zu zögern und sofort die Eltern, die Polizei oder andere Helfer zu informieren.',
      ),
    ],
    ['info-check', 'problem-solving'],
  ),

  AF('s1e01c06_amy_feedback_find_location', 's1e01c06_item_find_location'),

  S('s1e01c06_story_back_to_class', [
    classChat(),
    m(ch.carlos, 'Jetzt suche ich noch die Adressen dazu.', '16:36'),
    m(ch.lisa, 'Und?', '16:36'),
    m(ch.carlos, 'Nein. Dieser Wasserfall ist es nicht. Viel zu weit weg.', '16:37'),
    m(ch.carlos, 'Aber vielleicht dieser…', '16:37'),
    m(ch.chioma, 'Wo ist der?', '16:38'),
    img(ch.carlos, '/media/story/episodes/s1e01/s1e01c06-512.webp', '15:31'),
    m(ch.lisa, 'Das ist in den Grieswald-Bergen!', '16:38'),
    m(ch.lisa, 'Könnte hinkommen 🤔', '16:38'),
    m(ch.carlos, '@Lukas, @Igor Ist das die richtige Location?', '16:39'),
    m(ch.lisa, 'Sie antworten nicht.', '16:39'),
    m(ch.lisa, 'Was sollen wir tun?', '16:39'),
    audio(ch.chioma, '/media/story/episodes/s1e01/chiomas-sprachnachricht-s1e01c06.mp3', '16:40'),
  ], ['info-check', 'problem-solving', 'talk-act']),

  S('s1e01c06_story_carlos_card', [
    privateChat('Du', 'Carlos'),
    m(ch.carlos, 'Hi {{chatName}}', '16:42'),
    m(ch.carlos, 'Das mit den Geodaten und Bildanalyse ist echt ganz spannend. 🤓 Hab dazu mal was zusammengeschrieben. Falls du es dir anschauen willst:', '16:42'),
    bonusLink('tip-carlos-geodaten', 'Artikel: Geodaten', '/newspaper/tip-carlos-geodaten', 'Artikel öffnen →'),
  ], ['talk-act']),

  S('s1e01c06_story_amy_challenge_intro', [
    privateChat('Amy'),
    m(ch.amy, 'Hast du Lust auf eine kleine Challenge?'),
  ], ['problem-solving']),

  CH('s1e01c06_challenge_metadata',
    '👉 Schau dir heute ein Foto an. Weißt du, welche unsichtbaren Infos darin stecken könnten?',
  ),
]);

// ─────────────────────────────────────────────────────────────────────────────
// KAPITEL 7 — Zweifel
// ─────────────────────────────────────────────────────────────────────────────

const c07 = C('s1e01c07', 6, 'Amic 7', 'Zweifel', [

  S('s1e01c07_story_class_relief', [
    classChat(),
    m(ch.chioma, 'Antwortet bitte. Ich halte dieses Warten nicht mehr aus.', '16:55'),
    m(ch.igor, 'Ja?', '17:10'),
    m(ch.chioma, 'Endlich! Seid ihr ok? Was ist los?', '17:10'),
    m(ch.igor, 'Ich sehe Yasmin nirgends.', '17:11'),
    m(ch.igor, 'Aber da sind Einsatzkräfte.', '17:11'),
    m(ch.lisa, 'Ein Glück.', '17:12'),
    m(ch.igor, 'Die müssen auch gerade eingetroffen sein.', '17:12'),
    m(ch.igor, 'Habt ihr sie gerufen?', '17:12'),
    m(ch.igor, 'Ah und da sind Yasmins Eltern.', '17:13'),
    m(ch.chioma, 'Und Yasmin?', '17:13'),
    m(ch.igor, 'Ich sehe sie nirgends.', '17:13'),
    m(ch.lisa, 'Das kann doch nicht sein. 😰', '17:14'),
    m(ch.igor, 'Ich spring rein und such sie.', '17:14'),
    m(ch.chioma, 'Nein, auf keinen Fall! Das ist viel zu gefährlich!', '17:14'),
    m(ch.chioma, 'Es bringt doch nichts, wenn du dich auch in Gefahr bringst.', '17:15'),
    m(ch.chioma, 'Wo ist Yasmin nur?', '17:15'),
    m(ch.yasmin, 'Hä? Was ist los?', '17:15'),
    m(ch.yasmin, 'Wo sollte ich denn sein?', '17:15'),
    m(ch.carlos, 'Yasmin?', '17:16'),
    m(ch.chioma, 'Yasmin? Endlich.', '17:16'),
    img(ch.igor, '/media/story/episodes/s1e01/s1e01c07-512.webp', '17:16', { content: 'Entwarnung!' }),
    m(ch.lukas, 'Das ist jetzt wirklich unglaublich…', '17:17'),
    m(ch.igor, 'Yasmin ist ok.', '17:17'),
    m(ch.igor, 'Aber Lukas ist total k.o. 🥴', '17:17'),
  ], ['info-check', 'reflect-understand', 'talk-act']),

  S('s1e01c07_story_class_blog_confusion', [
    divider('Zeitlich später'),
    m(ch.yasmin, 'Sorry, Lukas, dass du dir Sorgen gemacht hast 🙈', '18:12'),
    m(ch.lukas, 'Was bitte war das für ein fragwürdiger Blog?', '18:13'),
    m(ch.lukas, 'Einer, der ernsthaft empfiehlt, an so einem Wasserfall zu baden? 😐', '18:13'),
    m(ch.yasmin, 'Ich suche den Blog gerade nochmal…', '18:14'),
    m(ch.lisa, 'Und?', '18:14'),
    m(ch.yasmin, 'Der Artikel ist noch da.', '18:15'),
    m(ch.yasmin, 'Aber der Satz mit dem Baden ist raus.', '18:15'),
    m(ch.lukas, '🤨', '18:15'),
    m(ch.yasmin, 'Doch ehrlich, ich schwör. Das stand da echt drin, dass man da baden kann.', '18:16'),
    m(ch.lisa, 'Yasmin hat recht. Ich hatte auch Bilder von Leuten dort im Wasser gesehen. Da war das Wasser aber ganz niedrig.', '18:16'),
    m(ch.lisa, 'Jetzt sind die Bilder gelöscht. 🤷‍♀️', '18:17'),
    m(ch.lukas, 'Besser so.', '18:17'),
    m(ch.lukas, 'Alles andere wäre unverantwortlich.', '18:17'),
    m(ch.lisa, '@Yasmin Wie bist du denn da wieder rausgekommen? 😳 Ist ja voll krass.', '18:18'),
  ], ['info-check', 'reflect-understand', 'talk-act']),

  S('s1e01c07_story_switch_to_amy', [
    amyChat(),
  ], ['info-check', 'reflect-understand']),

  MIT('s1e01c07_item_outdated_tip',
    'Woran hätte Yasmin merken können, dass der Tipp aus dem Internet nicht mehr stimmt?',
    'judgement', 'information_classify',
    [
      opt('a', 'Sie hätte nachgucken können, wann der Artikel geschrieben wurde und ob er noch aktuell ist.', 1),
      opt('b', 'Sie hätte prüfen können, ob es Warnungen oder Hinweise zur aktuellen Situation gibt (z. B. Wetter, Wasserstand).', 1),
      opt('c', 'Sie hätte suchen können, ob andere Seiten oder Quellen das Gleiche sagen.', 1),
      opt('d', 'Sie hätte darauf achten können, ob Bilder oder Infos nicht zur aktuellen Situation passen.', 1),
      opt('e', 'Sie hätte überlegen können, ob die Situation vielleicht gefährlich ist – auch wenn es online harmlos wirkt.', 1),
      opt('f', 'Sie hätte jemanden fragen können, der sich vor Ort auskennt oder mehr Erfahrung hat.', 1),
    ],
    { minSelections: 1, maxSelections: 6, helperText: 'Du kannst mehrere Antwortoptionen auswählen.', topics: ['info-check', 'reflect-understand'] },
  ),

  AF('s1e01c07_amy_feedback_outdated_tip', 's1e01c07_item_outdated_tip'),

  S('s1e01c07_story_amy_challenge_intro', [
    privateChat('Amy'),
    m(ch.amy, 'Hast du Lust auf eine kleine Challenge?'),
  ], ['problem-solving']),

  CH('s1e01c07_challenge_info_check',
    '👉 Such heute eine Info, der du normalerweise einfach glauben würdest – und prüf nach, ob sie noch aktuell ist.',
  ),

]);

// ─────────────────────────────────────────────────────────────────────────────
// KAPITEL 8 — Das Bild war nicht echt
// ─────────────────────────────────────────────────────────────────────────────

const c08 = C('s1e01c08', 7, 'Amic 8', 'Nächster Tag', [

  S('s1e01c08_story_class_reveal', [
    classChat(),
    m(ch.aylin, 'Hier ging ja ordentlich was ab. Und ich hab das Beste verpasst? 😳', '18:26'),
    m(ch.lisa, 'Von dir haben wir ja gar nichts gehört.', '18:26'),
    m(ch.aylin, 'Airplane mode 🤨', '18:27'),
    m(ch.aylin, 'Aber was war denn nun?', '18:27'),
    m(ch.aylin, 'Du warst beim Wasserfall. Und dann?', '18:27'),
    m(ch.yasmin, 'Plötzlich waren meine Eltern da und sogar Rettungs-Sanitäter!', '18:28'),
    m(ch.yasmin, 'Das volle Programm.', '18:28'),
    m(ch.yasmin, 'Igor und Lukas sahen aus, als wäre der Teufel hinter ihnen her.', '18:29'),
    m(ch.yasmin, 'Ich lag nur im Gras. Um mich das Getöse. Und hab einfach ins rauschende Wasser gestarrt.', '18:29'),
    m(ch.yasmin, 'Igor hat gelacht, als er mich gesehen hat.', '18:30'),
    m(ch.yasmin, 'Aber Lukas war total sauer und völlig fertig.', '18:30'),
    m(ch.yasmin, 'Er hat geschimpft wie ein Rohrspatz. 😂', '18:30'),
    m(ch.lisa, 'Klar!', '18:31'),
    m(ch.lisa, 'Warum hast du nicht geantwortet, als wir dich angerufen haben?', '18:31'),
    m(ch.yasmin, 'Sorry, echt. Das habe ich überhaupt nicht gehört und erst viel später gesehen.', '18:32'),
    m(ch.yasmin, 'Es war viel zu laut am Wasserfall.', '18:32'),
    m(ch.lisa, 'Das war total gefährlich!', '18:32'),
    m(ch.yasmin, 'Ich war doch gar nicht im Wasser.', '18:33'),
    m(ch.chioma, 'Was?? 😳', '18:33'),
    m(ch.yasmin, 'Ich hatte richtig Angst.', '18:33'),
    m(ch.yasmin, 'Das Wasser war viel zu wild. Und…', '18:34'),
    m(ch.lisa, 'Aber das Foto', '18:34'),
    m(ch.yasmin, 'Ich wollte doch nur ein Bild. Auch so ein … cooles Bild…', '18:34'),
    m(ch.lisa, '?', '18:35'),
    m(ch.yasmin, 'Auf dem Foto, das bin ich schon… aber im Schwimmbad.', '18:35'),
    m(ch.yasmin, 'Letzten Sommer.', '18:35'),
    m(ch.yasmin, 'Ich hab\'s nur drübergelegt. 🙈', '18:36'),
    m(ch.finn, 'also war das bild gar nicht echt?', '18:36'),
    m(ch.yasmin, 'Nein.', '18:36'),
    m(ch.yasmin, 'Ich war nie drin.', '18:36'),
    m(ch.chioma, 'War das… KI?', '18:37'),
    m(ch.yasmin, 'Ja.', '18:37'),
    m(ch.lisa, 'Ich glaube es nicht. 😳 Sah voll echt aus.', '18:37'),
    m(ch.lisa, 'Aber ich habe mich schon gewundert, wer das Foto gemacht haben soll!!', '18:38'),
    m(ch.finn, 'krass… ich dachte echt, du bist da im wasser', '18:38'),
    m(ch.aylin, 'Lass noch mal sehen…', '18:39'),
    img(ch.finn, '/media/story/episodes/s1e01/s1e01c05-512.webp', '18:39', { forwarded: { fromName: 'Yasmin', fromChatLabel: 'Klassenchat' } }),
    m(ch.aylin, 'Ey, das ist technisch echt gut. 👍', '18:40'),
    m(ch.aylin, 'Licht und Perspektive passen. Sauber gemacht.', '18:40'),
    m(ch.lisa, '😕', '18:40'),
    m(ch.chioma, 'Und an uns hast du nicht gedacht? Oder an deine Eltern?', '18:41'),
    m(ch.lisa, 'Ja, Yasmin, du kannst doch nicht ein KI-Bild verschicken ohne es dazu zu schreiben. Ehrlich!', '18:41'),
    m(ch.yasmin, 'Ihr habt doch auch so coole Fotos geschickt.', '18:42'),
    m(ch.chioma, 'Yasmin, es geht hier nicht um Likes oder Aufmerksamkeit.', '18:42'),
    m(ch.chioma, 'Das hätte richtig schiefgehen können.', '18:42'),
    m(ch.finn, 'aber ist doch nix passiert.', '18:43'),
    m(ch.lukas, 'Das sehe ich anders. Und die Rettungskräfte auch.', '18:43'),
    m(ch.finn, 'hätte sie da echt gebadet wär es schlimmer.', '18:43'),
    m(ch.lisa, 'Das Bild ist jetzt überall.', '18:44'),
    m(ch.tom, 'Wirklich überall?', '18:44'),
    m(ch.dominik, 'Ja. In zwei anderen Klassen auch schon.', '18:44'),
    m(ch.yasmin, '😳', '18:45'),
    m(ch.yasmin, 'Kann man das noch löschen?', '18:45'),
    m(ch.carlos, 'In unserem Chat können wir\'s löschen. Aber wenn es geteilt wurde, kriegst du es nicht überall zurück.', '18:46'),
  ], ['info-check', 'reflect-understand', 'talk-act']),

  S('s1e01c08_story_diary_bonus', [
    amyChat(),
    m(ch.amy, 'Yasmin denkt noch lange darüber nach. Möchtest du wissen was sie denkt?.'),
    bonusLink('diary-yasmin-entry2', 'Tagebucheintrag Yasmin – 2. Eintrag',
      '/diaries/diary_yasmin?entry=s1e01c08_0002', 'Eintrag öffnen →'),
  ]),

  S('s1e01c08_story_private_yasmin_igor', [
    privateChat('Yasmin', 'Igor'),
    m(ch.igor, 'Hi Yasmin, hast du morgen schon was vor?', '19:03'),
    typing('Yasmin tippt ...'),
  ], ['talk-act']),

  S('s1e01c08_story_switch_to_amy', [
    amyChat(),
  ], ['reflect-understand', 'talk-act']),

  OR('s1e01c08_reflection_ai_image_post',
    'Was würdest du tun, bevor du ein KI-Bild teilst?',
    { topics: ['reflect-understand', 'talk-act'] },
  ),

  AR('s1e01c08_amy_reaction_ai_image_post', 's1e01c08_reflection_ai_image_post'),

  S('s1e01c08_story_amy_wrapup_bonus', [
    m(ch.amy, 'Mein Tipp für dich: Sei fair zu anderen und sag dazu, wenn dein Bild mit KI gemacht ist.'),
  ], ['reflect-understand', 'talk-act']),

  S('s1e01c08_story_outro_private', [
    privateChat('Du', 'Aylin'),
    m(ch.aylin, '{{chatName}}, wenn du mal ausprobieren möchtest, ein Bild mit KI zu generieren, kannst du das gern tun.'),
    m(ch.aylin, 'Aber es gibt einige Dinge, die du beachten solltest. Ich habe dazu einen Artikel geschrieben. Guck doch mal rein:'),
    bonusLink('tip-aylin-kileitfaden', 'Artikel: KI-Leitfaden', '/newspaper/tip-aylin-kileitfaden', 'Artikel öffnen →'),
  ]),

  S('s1e01c08_story_epilogue', [
    divider('Epilog'),
    privateChat('Yasmin', 'Chioma'),
    m(ch.yasmin, 'Lisa ist endlich zurück.', '20:05'),
    m(ch.yasmin, 'Weniger top-gestylte Selfies aus Rom und Paris.', '20:06'),
    m(ch.yasmin, 'Dafür mehr interessante Storys über andere und mehr Drama.', '20:06'),
    m(ch.chioma, '🙈 Klatsch und Tratsch bringen fast immer Ärger…', '20:07'),
    sysMsg('Lisa hinzugefügt.', '20:08'),
    m(ch.yasmin, 'Und? Sag schon: Was gibt\'s Neues aus der Gerüchteküche?', '20:08'),
    m(ch.lisa, 'Kann gerade echt nicht 🙈 bin schon auf dem Weg zum Sushi.', '20:09'),
    m(ch.lisa, 'Das mit Dominik heute Morgen hab ich dir ja schon erzählt.', '20:09'),
  ]),
]);

// ─────────────────────────────────────────────────────────────────────────────
// EPISODE
// ─────────────────────────────────────────────────────────────────────────────

const s1e01De: StoryEpisodeV02 = {
  id: 's1e01',
  seasonId: 's1',
  episodeId: 's1e01',
  courseId: 's1e01',
  chapters: [c01, c02, c03, c04, c05, c06, c07, c08],
};

export default s1e01De;
