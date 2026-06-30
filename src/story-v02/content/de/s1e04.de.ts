import type { Reaction } from '../../../common/types';
import { STORY_CHARACTERS as ch } from '../../../content/characters';
import type { StoryEpisodeV02 } from '../../types/storyTypes';
import {
  m, img, audio, typing, divider, bonusLink, sysMsg, sysImg,
  privateChat, classChat, amyChat,
  opt, optSegs, rc,
  S, inp, IT, MIT, AF, GR, OR, AR, CH, C,
} from '../storyBuilder';

const R = (emoji: string, type?: string): Reaction => ({ emoji, type });

// ── Kapitel 1 — Amic 1 (Tag 1) ───────────────────────────────────────────────

const c01 = C('s1e04c01', 0, 'Amic 1', 'Am Skatepark', [

  S('s1e04c01_story_classChat_skatepark', [
    classChat(),
    m(ch.mia, '@ Finn Wir waren doch um 15:00 verabredet.', '15:15'),
    m(ch.mia, 'Wo bist du?', '15:15'),
    m(ch.tom, 'Sag bitte nicht wieder „bin gleich da"…', '15:15'),
    m(ch.finn, 'bin gleich da 😉', '15:16'),
    m(ch.mia, 'hoffentlich 😅', '15:16'),
    m(ch.tom, 'Du spielst noch, oder?', '15:16'),
    m(ch.finn, 'nein nein', '15:16'),
    img(ch.igor, 'media/story/episodes/s1e04/s1e04c01-512.webp', '15:17', { reactions: [R('👍')] }),
    m(ch.yasmin, 'Schickt mir jemand die Adresse?', '15:17'),
    m(ch.tom, 'Hab ich dir privat geschickt.', '15:19'),
    m(ch.tom, 'Cool, dass du auch mal kommst 👍', '15:19'),
    m(ch.elsa, 'Yasmin liked das Foto aber schnell 😂', '15:20', { replyTo: { speakerName: 'Tom', text: '📷' } }),
    m(ch.dominik, 'Sie kommt doch nur für den Typen auf dem Foto 😏', '15:20'),
    m(ch.elsa, '💋💋', '15:20'),
    m(ch.yasmin, 'Gar nicht. 🙄', '15:21'),
    m(ch.yasmin, 'Ich hab einfach Bock.', '15:21'),
    m(ch.dominik, 'Wer´s glaubt.', '15:21'),
    m(ch.tom, 'Ist richtig voll heute.', '15:22'),
    m(ch.tom, 'Es ist gefühlt die halbe Schule hier.', '15:22'),
    m(ch.farida, 'Wie schön.', '15:22'),
    m(ch.farida, 'Kann man da auch einfach mal zugucken?', '15:23'),
    m(ch.mia, 'Klar 🙂', '15:23'),
    m(ch.mia, 'Komm vorbei.', '15:23'),
    m(ch.amir, 'Klingt interessant.', '15:24'),
    m(ch.dominik, '😐', '15:24'),
    m(ch.dominik, 'Und was habt ihr da verloren?', '15:24'),
    m(ch.dominik, 'Was wollt ihr überhaupt hier bei uns??', '15:25'),
    m(ch.igor, '@Dominik Was willst du damit sagen?', '15:25'),
    m(ch.markus, 'Ohhh 😏', '15:25'),
    m(ch.markus, 'Das wird spannend.', '15:25'),
    m(ch.igor, 'Das ist ein öffentlicher Skatepark. Kein Club.', '15:26'),
    m(ch.igor, '@Farida @Amir Klar könnt ihr kommen.', '15:26'),
    m(ch.dominik, 'Ja klar.', '15:26'),
    m(ch.dominik, 'Kommt ruhig 😂', '15:26'),
    m(ch.dominik, 'Dann sehen wir ja, wie gut ihr hier reinpasst.', '15:27'),
    m(ch.dominik, '@Mia Amir kann ja Finns Platz einnehmen. Der kommt eh nicht mehr. 😂', '15:27'),
    m(ch.mia, '🙄', '15:27'),
  ], ['reflect-understand', 'fairness']),

  S('s1e04c01_story_farida_amir_1', [
    privateChat('Farida', 'Amir'),
    m(ch.farida, 'Gehst du?', '15:27'),
    m(ch.amir, 'Weiß nicht.', '15:27'),
    m(ch.farida, 'Ich glaub, ich trau mich nicht. Außer du gehst… dann vielleicht.', '15:28'),
  ], ['reflect-understand']),

  CH('s1e04c01_challenge_dare',
    '👉 Schaffst du es heute, eine Sache zu tun, die du dich sonst nicht traust? Egal wie klein.',
  ),

  S('s1e04c01_story_farida_amir_2', [
    m(ch.amir, 'Was hat das mit mir zu tun?', '15:28'),
    m(ch.farida, 'Naja… wir könnten zusammen hingehen.', '15:29'),
    m(ch.amir, 'Wozu? Die denken noch, wir sind ein Paar.', '15:29'),
    m(ch.farida, 'Allein trau ich mich nicht.', '15:29'),
    m(ch.farida, 'Was, wenn Dominik wieder so ist?', '15:30'),
    m(ch.amir, 'Der ist immer so.', '15:30'),
    m(ch.amir, 'Auch wenn ich dabei bin.', '15:30'),
    m(ch.amir, 'Dann geh halt lieber nicht.', '15:30'),
    m(ch.farida, 'Oh.', '15:30'),
    m(ch.amir, 'Ich mein doch nur…', '15:31'),
    m(ch.amir, '… dass Dominik nicht plötzlich nett wird.', '15:31'),
    m(ch.farida, 'Ach so.', '15:31'),
    m(ch.farida, 'Ich will da nicht irgendwie… auffallen.', '15:31'),
    m(ch.amir, 'Du fällst sowieso auf.', '15:32'),
    m(ch.amir, 'Weil du neu bist.', '15:32'),
    m(ch.farida, '😶', '15:32'),
    m(ch.amir, 'Ich ja auch.', '15:33'),
    m(ch.amir, 'Alle denken, weil wir beide neu sind,…', '15:33'),
    m(ch.amir, '… sind wir gleich.', '15:33'),
    m(ch.farida, 'Was meinst du?', '15:34'),
    m(ch.amir, 'Als würden wir automatisch zusammen gehören.', '15:34'),
    m(ch.farida, 'Ich hab das gar nicht so gedacht.', '15:34'),
    m(ch.farida, 'Wir sind doch nicht mal aus dem gleichen Land.', '15:35'),
    m(ch.amir, 'Die anderen schon.', '15:35', {
      replyTo: { speakerName: 'Farida', text: 'Ich hab das gar nicht so gedacht.' },
    }),
    m(ch.farida, 'Ich will einfach nur kurz schauen.', '15:35'),
    m(ch.amir, 'Und ich hab keine Lust, mich da hinzustellen und nett zu lächeln, damit es für alle passt.', '15:36'),
    m(ch.farida, 'Aber ich hab auch keine Lust auf Stress.', '15:36'),
    m(ch.amir, 'Dann geh nicht.', '15:37'),
    m(ch.farida, 'Die sind doch bestimmt nicht alle so.', '15:37'),
    m(ch.amir, 'Es reicht ja einer.', '15:37'),
    m(ch.amir, 'Und die anderen sagen nichts.', '15:37'),
    m(ch.farida, 'Und, kommst du?', '15:38'),
  ], ['reflect-understand', 'fairness']),

  S('s1e04c01_story_farida_user', [
    privateChat('Farida', 'Du'),
    m(ch.farida, '@ {{chatName}} Würdest du an meiner Stelle gehen?', '15:39'),
  ], ['reflect-understand']),

  inp('s1e04c01_input_farida_user', 'stories:s1e04.c01.input.farida_user', {
    topics: ['talk-act', 'reflect-understand'],
    promptSpeakerId: 'farida',
  }),

  S('s1e04c01_story_switch_amy', [
    amyChat(),
  ]),

  IT('s1e04c01_item_farida_situation',
    'Farida überlegt, ob sie zum Skatepark gehen soll.\nWarum ist die Situation für sie so schwierig?',
    'perspective',
    'perspectives_distinguish',
    [
      optSegs('a', 'Es ist doch gar nicht schwierig. Wenn sie Lust hat, kann sie einfach hingehen.', 0,
        'Für manche ist es so einfach. Aber Farida hat Angst, am Ende allein dazustehen.',
        '💡 Vielleicht kennst du das auch: Du möchtest etwas gern machen, traust dich aber nicht so richtig.',
      ),
      optSegs('b', 'Farida hat Angst vor Dominik und will deshalb lieber nicht alleine gehen.', 1,
        'Das ist richtig. Schwierig ist es für Farida, weil sie gleichzeitig gern dabei sein würde.',
        '💡 Vielleicht kennst du das auch: Du möchtest etwas gern machen, traust dich aber nicht so richtig.',
      ),
      optSegs('c', 'Farida möchte zwar hingehen, aber sie fühlt sich irgendwie unsicher.', 2,
        'Genau, Farida möchte dazugehören. Aber sie hat Angst, am Ende allein dazustehen.',
        '💡 Vielleicht kennst du das auch: Du möchtest etwas gern machen, traust dich aber nicht so richtig.',
      ),
      optSegs('d', 'Farida möchte dazugehören. Aber sie hat Angst, am Ende allein dazustehen.', 3,
        'Genau, du hast die Schwierigkeit erkannt. Farida will dazugehören und hat gleichzeitig Angst, dass es schiefgeht.',
        '💡 Vielleicht kennst du das auch: Du möchtest etwas gern machen, traust dich aber nicht so richtig.',
      ),
    ],
    ['reflect-understand'],
  ),

  AF('s1e04c01_amy_feedback_farida', 's1e04c01_item_farida_situation'),

]);

// ── Kapitel 2 — Amic 2 (Tag 1, Abend) ───────────────────────────────────────

const c02 = C('s1e04c02', 1, 'Amic 2', 'Kommt Finn noch?', [

  S('s1e04c02_story_classChat_finn_arrives', [
    classChat(),
    m(ch.dominik, 'Ich glaub, unser Gamer hängt wieder fest. Zockt er oder mäht er wieder Schuberts Rasen? 😂', '15:38'),
    m(ch.mia, '😳', '15:39'),
    m(ch.finn, 'bin da', '15:40'),
    m(ch.finn, 'Wo??', '15:40'),
    img(ch.igor, 'media/story/episodes/s1e04/s1e04c02_1-512.webp', '15:40', { reactions: [R('👍')] }),
    m(ch.mia, '😄', '15:41'),
    m(ch.mia, 'Du hast es wirklich geschafft.', '15:41'),
    m(ch.tom, 'Ich bin überrascht.', '15:42'),
    m(ch.finn, '😒', '15:42'),
    m(ch.finn, 'habt ihr was anderes von mir erwartet?', '15:43'),
    m(ch.dominik, '😂', '15:43'),
    m(ch.mia, '🙄', '15:44'),
    m(ch.finn, 'genug gelabert. los gehts', '15:44'),
    img(ch.igor, 'media/story/episodes/s1e04/s1e04c02_2-512.webp', '15:46', { reactions: [R('🔥')] }),
    m(ch.yasmin, '😳🔥🔥', '15:47'),
    m(ch.yasmin, 'Das sieht richtig gut aus.', '15:47'),
    img(ch.yasmin, 'media/story/episodes/s1e04/s1e04c02_3-512.webp', '15:50'),
    m(ch.elsa, 'Solltest du im Skatepark nicht lieber ein Stunt-Foto von dir schicken? 😘😘', '15:52'),
    typing('Yasmin tippt'),
    typing('Yasmin löscht'),
    m(ch.dominik, '@Elsa: Yasmin macht die Deko für Igor 😂', '15:53'),
  ], ['reflect-understand', 'fairness']),

  S('s1e04c02_story_yasmin_lisa', [
    privateChat('Yasmin', 'Lisa', 'Du'),
    m(ch.yasmin, 'Was dissen die mich ständig wegen Igor? Sieht es echt so aus, als wenn ich ihn gut finde?', '15:55'),
    m(ch.lisa, 'Naja, schon ein bisschen 😄', '15:56'),
    m(ch.yasmin, 'Aber… stimmt ja gar nicht!', '15:56'),
    m(ch.lisa, 'Nein, gaaar nicht 😉', '15:56'),
    m(ch.yasmin, 'Fang du nicht auch an.', '15:56'),
    m(ch.lisa, 'Nur Spaß! Hör nicht auf die.', '15:57'),
    m(ch.yasmin, 'Alle kriegen 1000 Likes auf ihre Fotos.', '15:57'),
    m(ch.yasmin, 'Nur ich krieg keine.', '15:58'),
    typing('Yasmin löscht Nachricht'),
    m(ch.yasmin, 'Kennst du auch das Gefühl?', '15:58'),
  ], ['reflect-understand']),

  inp('s1e04c02_reflection_likes_feeling', 'stories:s1e04.c02.reflection.likes_feeling', {
    topics: ['reflect-understand'],
    emptySubmitsAllowed: true,
  }),

  S('s1e04c02_story_switch_to_amy_challenge', [
    amyChat(),
  ]),

  AR('s1e04c02_amy_reaction_amir', 's1e04c02_reflection_likes_feeling'),

  S('s1e04c02_story_amy_challenge_bonus', [
    m(ch.amy, 'Apropos vergleichen – ich hab eine Challenge für dich:'),
  ], ['reflect-understand']),

  CH('s1e04c02_challenge_comparison',
    '👉 Wenn du dich mit jemandem vergleichst: Sage eine Sache, die du an dir magst. Nimmst du die Herausforderung an?',
  ),

  S('s1e04c02_story_bonus_article', [
    m(ch.amy, 'Wenn du mehr wissen willst, hab ich noch etwas für dich:'),
    bonusLink('vergleichs-falle',
      'Amys Bonus-Challenge: Raus aus der Vergleichs-Falle',
      '/newspaper/vergleichs-falle',
      'Artikel öffnen →',
    ),
  ], ['reflect-understand']),

  S('s1e04c02_story_classChat_farida_arrives', [
    classChat(),
    m(ch.farida, 'Wir finden nicht den Platz.', '16:15'),
    m(ch.dominik, 'Das muss ein Zeichen sein. 👀', '16:15'),
    img(ch.igor, 'media/story/episodes/s1e04/s1e04c02_4-512.webp', '16:16', { reactions: [R('❤️')] }),
    m(ch.igor, 'Von der Bushaltestelle aus siehst du einen Basketball-Court. Gleich dahinter ist der Skatepark.', '16:16'),
    m(ch.dominik, 'Ihr habt euch ja doch getraut.', '16:17', { reactions: [R('😂'), R('😂')], }),
    m(ch.markus, 'Respekt 😂', '16:17'),
    m(ch.amir, 'Interessant, wie viele lachen, obwohl nichts lustig ist.', '16:18', { reactions: [R('👍')] }),
    m(ch.dominik, 'Also Amir…', '16:18'),
    m(ch.dominik, 'Wenn du alles besser weißt…', '16:18'),
    m(ch.amir, 'Ich hab nie gesagt, dass ich besser weiß.', '16:18'),
    m(ch.dominik, '„Dass ich besser weiß" 😂 Was ist das für ein Deutsch?', '16:19'),
    m(ch.dominik, 'Nimm lieber ein paar Privatstunden nach der Schule. 📖', '16:19'),
    m(ch.amir, 'Dich geht meine Freizeit gar nichts an! 💢', '16:20'),
    m(ch.dominik, 'Wow. Da hat wohl jemand Probleme mit der Selbstkontrolle 😂😤', '16:20'),
  ], ['fairness', 'talk-act']),

  inp('s1e04c02_input_classChat_response', 'stories:s1e04.c02.input.classChat_response', {
    topics: ['talk-act', 'fairness'],
  }),

  S('s1e04c02_story_carlos_jonas_user', [
    m(ch.carlos, 'Hab Amir gestern bei der Bank gesehen. Der hat für seine Eltern alles übersetzt.', '18:45'),
    m(ch.jonas, 'Im Ernst? Meine Eltern helfen immer mir. Nicht anders herum.', '18:46'),
    m(ch.carlos, 'Igual. Bei mir auch. Aber wenn sie es halt nicht können…', '18:47'),
    m(ch.jonas, 'Das muss schwierig sein. Dass er sich gar nicht beschwert. 🤔', '18:48'),
    m(ch.carlos, 'Naja, was hat er für eine Wahl?', '18:49'),
  ], ['reflect-understand']),

  S('s1e04c02_story_jonas_user_freundebuch', [
    privateChat('Jonas', 'Du'),
    m(ch.jonas, 'Hey, ich hab in dein Freundebuch geschrieben.', '17:53'),
    bonusLink('char-jonas', 'Charakterkarte Jonas', '/cards/char-jonas', 'Karte ansehen →'),
  ], ['reflect-understand']),

  S('s1e04c02_story_switch_amy', [
    amyChat(),
  ]),

  OR('s1e04c02_reflection_amir',
    'Wie wirkt Amir auf dich?\nSchreibe drei Adjektive (beschreibende Wie-Wörter) über ihn und suche 3 Emojis dazu aus.',
    {
      topics: ['reflect-understand'],
      category: 'PERSPECTIVE',
      bypassAi: true,
      fixedAmyReply: 'Es könnte vieles hinter seiner rauen Schale stecken. Wir lernen ihn gerade erst kennen.',
    },
  ),

]);

// ── Kapitel 3 — Amic 3 (Tag 2) ───────────────────────────────────────────────

const c03 = C('s1e04c03', 2, 'Amic 3', 'Gut gemeint', [

  S('s1e04c03_story_classChat_tag2', [
    classChat(),
    divider('nächster Tag'),
    img(ch.markus, 'media/story/episodes/s1e04/s1e04c03_1b.webp', '10:05', { reactions: [R('👀')] }),
    m(ch.markus, 'Live vom Rand des Skateparks 😂', '10:05'),
    m(ch.dominik, 'Sieht gemütlich aus da hinten.', '10:06'),
    m(ch.markus, 'Und so richtig nach Spaß 😂', '10:07'),
    m(ch.tom, '@Finn: Wenn du noch nachkommst, bring eine Tüte Chips mit.', '10:08'),
    m(ch.markus, 'Mach 2 draus.', '10:08'),
    m(ch.finn, 'seid ihr schon wieder im skatepark?', '10:09'),
    m(ch.tom, 'Ist doch Wochenende 😀', '10:10'),
    m(ch.tom, 'Kommst du?', '10:10'),
    m(ch.finn, 'vielleicht später.', '10:11'),
    m(ch.tom, '@User: Und du?', '10:12'),
  ], ['reflect-understand']),

  inp('s1e04c03_input_coming_tom', 'stories:s1e04.c03.input.coming_tom', {
    topics: ['talk-act'],
    promptSpeakerId: 'tom',
  }),

  S('s1e04c03_story_classChat_lisa_amir', [
    img(ch.markus, 'media/story/episodes/s1e04/s1e04c03_3-512.webp', '10:45'),
    m(ch.markus, 'Integration läuft 🔥', '10:45'),
    m(ch.farida, '😕', '10:46'),
    m(ch.chioma, '@Farida @Amir: Lasst euch von Dominik und Markus nicht ärgern. 🙂', '10:47'),
    m(ch.lisa, 'Ein Glück habt ihr ja euch gegenseitig. 👍', '10:48'),
    m(ch.amir, 'Was meinst du? Die Neuen müssen unter sich bleiben?', '10:49'),
    m(ch.lisa, 'Nein, ich meinte nur…', '10:50'),
    m(ch.lisa, 'Also weil ihr beide…', '10:50'),
    m(ch.amir, '… „anders seid"? Wolltest du das sagen?', '10:51'),
    m(ch.lisa, 'Naja, ich meine ihr seid doch beide neu in Deutschland… Da habt ihr doch bestimmt Ähnliches erlebt.', '10:52'),
    m(ch.farida, 'Amir meint glaube ich, dass wir uns auch noch nicht länger kennen.', '10:53'),
    m(ch.farida, 'Und wir sind auch nicht aus dem gleichen Land.', '10:53'),
    m(ch.lisa, 'Aber…', '10:54'),
    m(ch.yasmin, '@Lisa: Denkst du: alle die nicht deutsch sind, sind gleich?', '10:55'),
    m(ch.lisa, 'Nein, natürlich nicht.', '10:56'),
    m(ch.dominik, '😂😂😂', '10:56'),
    m(ch.yasmin, 'Ich bin auch nicht in Deutschland geboren.', '10:57'),
    m(ch.yasmin, 'Und ich hab echt keinen Bock, dass Leute reden.', '10:57'),
    m(ch.lisa, 'Nein… so meinte ich das nicht!', '10:58'),
    m(ch.lisa, 'Yasmin, bitte.', '10:58'),
    m(ch.amir, 'Ich seh schon…', '10:59'),
    m(ch.lisa, 'Entschuldigt, so meinte ich das wirklich nicht.', '11:00'),
    m(ch.farida, 'Ist schon gut. Ich verstehe.', '11:01'),
    m(ch.dominik, 'Wenn hier jemand übertreibt, ist das Amir.', '11:02'),
    img(ch.markus, 'media/story/episodes/s1e04/s1e04c03_4-512.webp', '11:03'),
    m(ch.markus, 'Der Blick 💀', '11:03'),
    m(ch.igor, 'Lass das mit den Fotos.', '11:04'),
    m(ch.markus, 'Entspann dich.', '11:05'),
    img(ch.markus, 'media/story/episodes/s1e04/s1e04c03_5_neu-512.webp', '11:05'),
  ], ['fairness', 'reflect-understand']),

  S('s1e04c03_story_switch_amy', [
    amyChat(),
  ]),

  MIT('s1e04c03_item_lisa_post',
    'Lisa wollte eigentlich nett sein.\nTrotzdem fühlt sich ihr Post für Amir und Yasmin nicht gut an.\nWas könnte daran verletzend sein?',
    'judgement',
    'judgement_explain',
    [
      opt('a', 'Sie steckt Amir und Farida in eine gemeinsame Gruppe, obwohl sie sich kaum kennen.', 1),
      opt('b', 'Sie geht davon aus, dass sie sich „automatisch besser verstehen".', 1),
      opt('c', 'Sie reduziert beide auf das „Anderssein".', 1),
      opt('d', 'Sie meint es gut, merkt aber nicht, wie es bei anderen ankommt.', 1),
      opt('e', 'Sie spricht über sie, statt sie direkt zu fragen.', 1),
      opt('f', 'Für Amir und Yasmin fühlt es sich so an, als würden sie nicht richtig dazugehören.', 1),
    ],
    {
      minSelections: 1,
      maxSelections: 6,
      helperText: 'Du kannst mehrere Antworten auswählen.',
      topics: ['reflect-understand', 'fairness'],
    },
  ),

  AF('s1e04c03_amy_feedback_lisa_post', 's1e04c03_item_lisa_post'),

  S('s1e04c03_story_amy_followup', [
    amyChat(),
    m(ch.amy, 'Lisa meinte es gut, es ist aber falsch angekommen. Ist dir sowas auch schon mal passiert?'),
  ]),

  inp('s1e04c03_input_lisa_experience', 'stories:s1e04.c03.input.lisa_experience', {
    topics: ['reflect-understand'],
    promptSpeakerId: 'amy',
  }),

  S('s1e04c03_story_lisa_yasmin', [
    privateChat('Lisa', 'Yasmin'),
    m(ch.lisa, 'Tut mir leid. 🙏', '11:20'),
    m(ch.yasmin, 'Schon gut.', '11:21'),
    m(ch.lisa, 'Das klingt aber nicht danach, als wär alles gut.', '11:22'),
    m(ch.lisa, 'Ich wollte wirklich niemanden verletzen. Dich schon gar nicht. 💛', '11:22'),
    m(ch.yasmin, 'Aber hast du.', '11:24'),
    m(ch.lisa, 'Warum bist du eigentlich so wütend? Das geht schon länger.', '11:25'),
    m(ch.yasmin, 'Bin ich nicht.', '11:26'),
    m(ch.lisa, 'Doch. Ich bin doch nicht blöd.', '11:27'),
    m(ch.yasmin, 'Vielleicht nervt es mich einfach, dass du immer denkst, du weißt alles über andere.', '11:28'),
    m(ch.lisa, 'Was?', '11:29'),
    m(ch.yasmin, 'Vergiss es einfach.', '11:30'),
    m(ch.lisa, 'Yasmin…?', '11:31'),
    m(ch.yasmin, 'Du verstehst es eh nicht.', '11:32'),
    m(ch.lisa, 'Dann erklär es mir. 🙏', '11:33'),
    m(ch.yasmin, 'Wozu?', '11:34'),
    m(ch.lisa, 'Weil wir Freundinnen sind?', '11:35'),
    divider('...'),
    m(ch.yasmin, 'Vielleicht.', '11:38'),
    m(ch.yasmin, 'Im Moment fühlt es sich jedenfalls nicht so an.', '11:38'),
  ], ['talk-act', 'reflect-understand']),

  S('s1e04c03_story_amy_chioma_bonus', [
    amyChat(),
    m(ch.amy, 'Nachdem einige aus der Klasse auf dem Skatepark waren, hat sich Chioma mit Lukas getroffen. Hör doch mal rein.'),
    bonusLink('chioma-news-denkst-du-kennst-jemanden',
      'Chiomas Weekly: „Du denkst, du kennst jemanden?" (Audio)',
      '/newspaper/chioma-news-denkst-du-kennst-jemanden',
      'Anhören →',
    ),
  ], ['reflect-understand']),

]);

// ── Kapitel 4 — Amic 4 (Tag 3) ───────────────────────────────────────────────

const c04 = C('s1e04c04', 3, 'Amic 4', 'Für die Schülerzeitung', [

  S('s1e04c04_story_redaktionssitzung', [
    privateChat('Chioma', 'Carlos', 'Aylin', 'Jonas'),
    m(ch.aylin, 'Redaktionssitzung online? 🤔', '15:05'),
    m(ch.aylin, 'Was soll das denn?', '15:05'),
    m(ch.chioma, 'Wenn wir uns schon Themen überlegen, kann jeder schon anfangen zu schreiben.', '15:06'),
    m(ch.chioma, 'Dann haben wir beim nächsten regulären Treffen schon etwas, über das wir sprechen können.', '15:06'),
    img(ch.chioma, 'media/story/episodes/s1e04/s1e04c04_1-512.webp', '15:03'),
    m(ch.chioma, 'Ich verabrede einen Termin für uns mit Herrn Alvarez.', '15:07'),
    m(ch.aylin, 'Das übernehme ich. 😊', '15:07'),
    m(ch.carlos, 'Es wird echt wieder Zeit für den einen oder anderen Artikel!', '15:08'),
    m(ch.chioma, 'Habt ihr schon Ideen?', '15:09'),
    m(ch.chioma, 'Was ist mit: Jeder schreibt 3 Dinge über sich, die keiner erwartet.', '15:09'),
    m(ch.carlos, 'Ich hasse Tomaten.', '15:10'),
    m(ch.aylin, 'Wow, Skandal 😂 Nee.', '15:10'),
    m(ch.jonas, 'Ich würde ungern öffentlich was über mich schreiben. Sowas kommt höchstens in mein Tagebuch.', '15:11'),
    m(ch.aylin, 'Dann lieber irgendwas mit Social Media.', '15:12'),
    m(ch.chioma, 'Oder… wie schnell man Leute falsch einschätzt.', '15:13'),
    m(ch.aylin, 'Aber das ist doch voll offensichtlich.', '15:14'),
    m(ch.carlos, 'Ist es nicht.', '15:15'),
    m(ch.carlos, 'Leute merken das nicht mal. 🤔', '15:15'),
    m(ch.aylin, 'Man denkt schnell, man weiß alles über jemanden - vor allem online!', '15:16'),
    m(ch.carlos, 'Weil man nur die Ausschnitte sieht, die perfekt zu passen scheinen.', '15:17'),
    m(ch.aylin, 'Zum Beispiel: Jemand postet nur coole Sachen → alle denken, er ist immer gut drauf. 😎', '15:18'),
    m(ch.carlos, 'Oder jemand sagt einmal was Falsches. Alle denken, der ist immer so verplant. 🤪', '15:19'),
    m(ch.aylin, 'Das ist ein Thema für mich.', '15:20'),
    m(ch.jonas, 'Manchmal reicht ein Satz und alle denken, sie wissen, wie jemand ist.', '15:21', {
      replyTo: { speakerName: 'Carlos', text: 'Weil man nur die Ausschnitte sieht, die perfekt zu passen scheinen.' },
    }),
    m(ch.chioma, 'Ja. Oder eine Situation.', '15:22'),
    m(ch.aylin, 'Manchmal wirkt jemand unsympathisch…', '15:23'),
    m(ch.aylin, '…dabei war es nur ein Missverständnis.', '15:23'),
    m(ch.jonas, 'Vielleicht sollte einer von uns genau darüber schreiben.', '15:24'),
    m(ch.chioma, 'Über was genau?', '15:25'),
    m(ch.jonas, 'Wie schnell man jemanden in eine Schublade steckt.', '15:25'),
    m(ch.jonas, 'Das interessiert mich. 👍', '15:26'),
    m(ch.aylin, 'Viel zu kompliziert. Das liest doch keiner. 🙃', '15:27'),
    m(ch.jonas, 'Und genau deshalb müssen wir es EINFACH machen.', '15:28'),
    m(ch.jonas, 'Ich führe dazu vielleicht ein Interview.', '15:28'),
    m(ch.chioma, 'Mit wem?', '15:29'),
    m(ch.jonas, 'Ich bin noch nicht sicher, ob\'s klappt…', '15:30'),
    m(ch.jonas, 'Lasst euch überraschen.', '15:30'),
  ], ['info-check', 'reflect-understand']),

  S('s1e04c04_story_switch_amy', [
    amyChat(),
  ]),

  IT('s1e04c04_item_first_impression',
    'Im Chat sagen sie: Wenn man ein Foto oder einen Satz von jemandem gesehen hat, weiß man, wie die Person ist.\nGlaubst du das auch?',
    'judgement',
    'manipulation_recognize',
    [
      optSegs('a', 'Ja. Der erste Eindruck sagt viel.', 0,
        'Stell dir vor, jemand macht genau jetzt ein Foto von dir. Würde dieses eine Bild wirklich zeigen, wie du als Mensch bist?',
        '💡 Ein erster Eindruck ist wie ein Blick durch ein Schlüsselloch: Du siehst nur einen kleinen Teil. Nimm dir Zeit, den ganzen Menschen kennenzulernen.',
      ),
      optSegs('b', 'Manchmal stimmt das, manchmal aber vielleicht auch nicht.', 1,
        'Es kann sein, dass ein Post oder ein Foto gut zu einer Person passt. Es ist aber immer nur ein Ausschnitt und zeigt meist nicht den Zusammenhang.',
        '💡 Ein erster Eindruck ist wie ein Blick durch ein Schlüsselloch: Du siehst nur einen kleinen Teil. Nimm dir Zeit, den ganzen Menschen kennenzulernen.',
      ),
      optSegs('c', 'Nein, da sieht man nur einen kleinen Teil der Person, den Rest sieht man gar nicht.', 2,
        'Richtig. Dazu kommt, dass Posts den Zusammenhang meist nicht zeigen.',
        '💡 Ein erster Eindruck ist wie ein Blick durch ein Schlüsselloch: Du siehst nur einen kleinen Teil. Nimm dir Zeit, den ganzen Menschen kennenzulernen.',
      ),
      optSegs('d', 'Nein, wir sehen zu wenig und kennen den Zusammenhang nicht.', 3,
        'Richtig, ein Post zeigt nicht alles. Erst wenn wir mehr kennen, können wir eine faire Einschätzung treffen.',
        '💡 Ein erster Eindruck ist wie ein Blick durch ein Schlüsselloch: Du siehst nur einen kleinen Teil. Nimm dir Zeit, den ganzen Menschen kennenzulernen.',
      ),
    ],
    ['reflect-understand', 'info-check'],
  ),

  AF('s1e04c04_amy_feedback_first_impression', 's1e04c04_item_first_impression'),

  S('s1e04c04_story_jonas_chioma', [
    privateChat('Jonas', 'Chioma'),
    typing('Jonas schreibt'),
    typing('Jonas löscht'),
    m(ch.jonas, 'Hast du morgen nach der Schule…', '15:45'),
    typing('Jonas schreibt'),
    typing('Jonas löscht'),
    m(ch.jonas, '… auch so viel zu tun? Für Mathe und so?', '15:46'),
    m(ch.chioma, 'Meinst du für die Arbeit?', '15:47'),
    m(ch.jonas, 'Ähm, ja, genau.', '15:48'),
    m(ch.chioma, 'Ähm, ja.', '15:49'),
    img(ch.chioma, 'media/story/episodes/s1e04/s1e04c04_2-512.webp', '15:50'),
  ], ['reflect-understand']),

  S('s1e04c04_story_amy_jonas_diary', [
    amyChat(),
    m(ch.amy, 'Wollte Jonas Chioma wirklich nach der Mathearbeit fragen?'),
    m(ch.amy, 'Ich glaube, da lohnt es sich, ein Blick in Jonas\' Tagebuchseiten zu werfen.'),
    bonusLink('diary-jonas-entry1',
      'Jonas\' Tagebuch – Eintrag 1',
      '/diaries/diary_jonas?entry=s1e04c04_0001',
      'Tagebuch öffnen →',
    ),
  ], ['reflect-understand']),

  S('s1e04c04_story_classChat_end', [
    classChat(),
    m(ch.dominik, 'Ooooh, die BFFs sprechen nicht mehr miteinander. 😢', '16:20'),
    m(ch.lisa, '🙄', '16:21'),
    m(ch.markus, '😭', '16:21'),
    m(ch.yasmin, 'Klappe.', '16:22'),
    divider('…'),
    m(ch.jonas, 'Hat heute eigentlich jemand Amir gesehen?', '16:35'),
  ], ['fairness']),

]);

// ── Kapitel 5 — Amic 5 ───────────────────────────────────────────────────────

const c05 = C('s1e04c05', 4, 'Amic 5', 'Amir fehlt', [

  S('s1e04c05_story_classChat_amir_returns', [
    classChat(),
    sysImg('media/story/episodes/s1e04/s1e04c05_1-512.webp'),
    m(ch.igor, 'Nein, in der Schule war er nicht.', '16:36'),
    m(ch.igor, 'Meinst du, es ist was nicht in Ordnung?', '16:36'),
    m(ch.dominik, 'Wer sollte ihn schon vermissen?', '16:37'),
    m(ch.mia, 'Vielleicht ist er einfach krank?', '16:38'),
    m(ch.lisa, '@Farida: Hat er sich bei dir gemeldet?', '16:39'),
    m(ch.farida, 'Warum sollte er?', '16:40'),
    m(ch.lisa, 'Ich mein ja nur.', '16:40'),
    m(ch.farida, 'Nein, ich weiß auch nicht, warum er nicht in der Schule war.', '16:41'),
    m(ch.dominik, 'Kein Wunder, nach seinem starken Auftritt gestern. 💪', '16:42'),
    m(ch.markus, '😂', '16:42'),
    divider('…'),
    m(ch.amir, 'Du meinst, ihr macht ein paar miese Fotos von mir und ich schmeiß die Schule?', '16:50'),
    m(ch.dominik, 'Du meinst, das reichte dir noch nicht? ⚔️', '16:51'),
    m(ch.amir, 'Lass das Schwert stecken. Ich kämpfe nicht.', '16:52'),
    m(ch.dominik, 'Da hat wohl jemand die Hosen voll?', '16:53'),
    m(ch.markus, '😂', '16:53'),
    typing('Amir schreibt'),
    typing('Amir löscht'),
    typing('Amir schreibt'),
    typing('Amir löscht'),
    m(ch.jonas, 'Hör nicht auf die.', '16:55'),
    m(ch.jonas, 'Alles in Ordnung?', '16:55'),
    typing('Amir schreibt'),
    typing('Amir löscht'),
    m(ch.amir, 'Ja.', '16:57'),
    m(ch.dominik, 'Sieht man 😂', '16:58'),
    m(ch.markus, 'Voll entspannt der Typ 😭', '16:58'),
    typing('Amir schreibt'),
    typing('Amir löscht'),
    m(ch.amir, '😤', '17:00'),
    divider('…'),
    m(ch.amir, 'Morgen ist doch die Mathearbeit. Kann mir jemand die Papiere von heute schicken?', '17:05'),
    m(ch.dominik, 'Im Ernst?', '17:06'),
    m(ch.dominik, 'Du schwänzt gemütlich. Und jetzt willst du unsere harte Arbeit einfach gratis?', '17:06'),
    m(ch.amir, 'Ich habe nicht „gemütlich geschwänzt".', '17:07'),
    m(ch.amir, 'Ich konnte nicht.', '17:07'),
    m(ch.dominik, 'Er konnte nicht…', '17:08'),
    m(ch.dominik, 'Und er kann auch nicht „bitte" sagen.', '17:08'),
    m(ch.amir, '…', '17:09'),
    m(ch.amir, 'Kann mir bitte jemand die Papiere schicken?', '17:10'),
    divider('…'),
  ], ['fairness', 'reflect-understand']),

  inp('s1e04c05_input_classChat_amir', 'stories:s1e04.c05.input.classChat_amir', {
    topics: ['talk-act', 'fairness'],
  }),

  S('s1e04c05_story_switch_amy', [
    amyChat(),
  ]),

  IT('s1e04c05_item_support_amir',
    'Amir wird im Chat gereizt und traut sich trotzdem zu fragen, ob ihm jemand hilft.\nWie würdest du darauf reagieren?',
    'responsibility',
    'intervene',
    [
      optSegs('a', 'Ich würde nichts sagen und die Papiere nicht schicken.', 0,
        'Aus welchem Grund möchtest du Amir nicht helfen? Sich gegenseitig zu unterstützen, macht eine Klassengemeinschaft stärker.',
        '💡 Ein anderes Mal brauchst du vielleicht selbst Hilfe bei etwas.',
      ),
      optSegs('b', 'Ich würde mich lieber raushalten. Das geht mich nichts an.', 0,
        'Aus welchem Grund möchtest du Amir nicht helfen? Sich gegenseitig zu unterstützen, macht eine Klassengemeinschaft stärker.',
        '💡 Ein anderes Mal brauchst du vielleicht selbst Hilfe bei etwas.',
      ),
      optSegs('c', 'Ich würde ihm die Papiere schicken, aber nichts im Chat schreiben.', 2,
        'Es ist ein fairer Zug von dir, einem Mitschüler zu helfen. Sich gegenseitig zu unterstützen, macht eine Klassengemeinschaft stärker.',
        '💡 Ein anderes Mal brauchst du vielleicht selbst Hilfe bei etwas.',
      ),
      optSegs('d', 'Ich würde ihn im Chat unterstützen und die Papiere schicken.', 3,
        'Es ist ein fairer Zug von dir, einem Mitschüler zu helfen. Sich gegenseitig zu unterstützen, macht eine Klassengemeinschaft stärker.',
        '💡 Ein anderes Mal brauchst du vielleicht selbst Hilfe bei etwas.',
      ),
    ],
    ['fairness', 'talk-act'],
  ),

  AF('s1e04c05_amy_feedback_support', 's1e04c05_item_support_amir'),

  S('s1e04c05_story_amy_watch_class', [
    amyChat(),
    m(ch.amy, 'Schauen wir uns an, wie die Klasse reagiert.'),
    classChat(),
    m(ch.jonas, 'Klar. Ich schick sie dir privat.', '17:12'),
    m(ch.amir, 'Echt? 😀', '17:13'),
    m(ch.amir, 'Danke!', '17:13'),
    m(ch.jonas, 'Kein Ding.', '17:14'),
    m(ch.amir, 'Danke, echt!', '17:14'),
  ], ['fairness', 'talk-act']),

  S('s1e04c05_story_aylin_chioma', [
    privateChat('Aylin', 'Chioma'),
    m(ch.chioma, 'Hast du mit Herrn Alvarez schon einen Termin für die Redaktionssitzung klargemacht?', '17:20'),
    m(ch.aylin, 'Ich hab ihn gefragt, aber er meinte, er kann\'s noch nicht fest zusagen.', '17:21'),
    m(ch.chioma, 'Wieso?', '17:22'),
    m(ch.aylin, 'Wegen Jugend forscht. Er betreut da ein paar Teams von unserer Schule und hat wohl gerade ständig irgendwelche Termine.', '17:23'),
    m(ch.chioma, 'Das wird dann auch ein spannendes Thema für die Schülerzeitung. 😉', '17:24'),
    m(ch.aylin, 'Darüber hat Jonas schon letztes Jahr einen coolen Artikel geschrieben.', '17:25'),
    m(ch.aylin, 'Sag mal…', '17:26'),
    m(ch.aylin, 'Wie findest du eigentlich Jonas?', '17:26'),
    m(ch.chioma, 'Wie meinst du das?', '17:28'),
    m(ch.aylin, 'Na komm 😄', '17:29'),
    m(ch.aylin, 'Du weißt genau, was ich meine.', '17:29'),
    divider('…'),
    m(ch.chioma, 'Er ist nett.', '17:31'),
    m(ch.aylin, 'Nur nett? 😏', '17:31'),
    divider('…'),
    m(ch.chioma, 'Ja. Nur nett.', '17:33'),
    m(ch.chioma, 'Also, dann sagst du mir Bescheid, wann wir uns mit Herrn Alvarez zusammen setzen können?', '17:34'),
    m(ch.aylin, 'Klar.', '17:34'),
  ], ['reflect-understand']),

  S('s1e04c05_story_user_chioma', [
    privateChat('Du', 'Chioma'),
    m(ch.chioma, 'Was war das denn?', '17:36'),
    m(ch.chioma, 'Als ob ich gerade Aylin mein Herz ausschütten würde.', '17:36'),
    m(ch.chioma, 'Die läuft dann noch durch die ganze Schule und ruft: „Chioma steht auf Jonas!"', '17:37'),
    m(ch.chioma, 'Oder hättest du ihr dein Herz ausgeschüttet?', '17:38'),
  ], ['reflect-understand']),

  inp('s1e04c05_input_chioma_heart', 'stories:s1e04.c05.input.chioma_heart', {
    topics: ['reflect-understand', 'talk-act'],
    promptSpeakerId: 'chioma',
  }),

]);

// ── Kapitel 6 — Amic 6 (Tag 4) ───────────────────────────────────────────────

const c06 = C('s1e04c06', 5, 'Amic 6', 'Der Sportbeutel', [

  S('s1e04c06_story_classChat_sportbeutel', [
    classChat(),
    sysImg('media/story/episodes/s1e04/s1e04c06_1_a-512.webp', ''),
    m(ch.finn, 'hat jemand meine sportsachen gesehen? 🤔', '09:35'),
    m(ch.finn, 'hab sie eben gerade in der umkleide vergessen. bin grad zurück gelaufen', '09:35'),
    m(ch.finn, 'sie sind weg', '09:35'),
    m(ch.dominik, 'Kannst du nicht auf deine Sachen aufpassen?', '09:36'),
    m(ch.markus, 'Mir wurde letzte Woche auch was aus der Turnhalle geklaut. 👀', '09:36'),
    m(ch.finn, 'echt jetzt?', '09:36'),
    m(ch.finn, 'wenn meine neuen schuhe weg sind, gibts ärger zu hause', '09:37'),
    m(ch.mia, 'Vielleicht im Geräteraum oder schon im Fundbüro? 🤔', '09:37'),
    m(ch.finn, 'nein. nichts.', '09:40'),
    m(ch.markus, 'Wo ist Amir eigentlich?', '09:40'),
    m(ch.dominik, '😏', '09:40'),
    m(ch.igor, 'Was soll das heißen?', '09:40'),
    m(ch.dominik, 'Ach komm. Das passt doch.', '09:40'),
    m(ch.amir, 'Was passt?', '09:41'),
    m(ch.dominik, 'Wo bist du grad?', '09:41'),
    m(ch.amir, 'Vor der Klasse.', '09:41'),
    m(ch.dominik, '@Finn: Wir haben deinen Beutel!', '09:43'),
    m(ch.dominik, '3 Mal darfst du raten, wer ihn hatte. 💀', '09:43'),
    m(ch.elsa, 'Amir?', '09:43'),
    m(ch.dominik, 'Bingo 🏆', '09:43'),
    m(ch.markus, 'Hier ist das Beweisfoto', '09:46'),
    img(ch.markus, 'media/story/episodes/s1e04/s1e04c04_3-512.webp', '09:43'),
    m(ch.dominik, 'Amir hat ihn geklaut.', '09:44'),
    m(ch.amir, 'Ich hab nichts geklaut.', '09:44'),
    m(ch.dominik, 'Klar! Hast du.', '09:44'),
    m(ch.dominik, 'Markus und ich haben dich doch grad auf frischer Tat ertappt.', '09:45'),
    m(ch.dominik, 'Genau vor der Klasse, mit Finns Sportbeutel.', '09:45'),
    sysImg('media/story/episodes/s1e04/s1e04c06_2-512.webp', '09:45'),
    m(ch.amir, 'Lasst mich in Ruhe.', '09:45'),
    m(ch.markus, 'Na, hattest du den Sportbeutel oder nicht?', '09:46'),
    m(ch.amir, 'Ja.', '09:46'),
    m(ch.finn, 'echt??', '09:46'),
    m(ch.emma, '👀', '09:46'),
    m(ch.lisa, 'Vielleicht hat er ihn aus Versehen mitgenommen?', '11:15'),
    m(ch.markus, 'Ja klar. „Aus Versehen" 😂', '11:15'),
    m(ch.dominik, 'Erst Stress machen und dann Sachen klauen', '11:16'),
    m(ch.dominik, 'und dann einen auf „ich war\'s nicht" 😂', '11:16'),
    m(ch.markus, 'Und MEINE Sachen?', '11:16'),
    m(ch.markus, 'Rück sofort meine Sachen raus, du Dieb! 💪', '11:17'),
    m(ch.amir, 'Ich hab nichts von dir.', '11:17'),
    m(ch.lisa, 'Vielleicht stimmt es ja…', '11:17'),
    m(ch.markus, 'Blödsinn. Gestern hatte Amir genau die gleichen Socken an.', '11:18'),
    m(ch.dominik, 'Das wird ja immer besser. 💀💀💀', '11:18'),
    m(ch.mia, 'Was? Ein Dieb in unserer Klasse?', '11:18'),
    m(ch.emma, 'Das hört man jetzt überall.', '11:18'),
    m(ch.emma, 'Fast schon wie ne Mafia 👀', '11:19'),
    m(ch.igor, 'Hast du wieder zu viel TikTok gesehen?', '11:19'),
    m(ch.emma, 'Hm, vielleicht auch das.', '11:19'),
    m(ch.markus, 'Hey, was ist jetzt mit meinen Strümpfen?', '11:19'),
    m(ch.igor, '😂 Chill, die Socken gibt\'s überall. Jeder kann die haben.', '11:20'),
    m(ch.chioma, 'Jetzt wartet doch mal.', '11:20'),
    m(ch.chioma, 'Vielleicht ist das nur ein Missverständnis.', '11:20'),
    m(ch.dominik, 'Oder vielleicht auch nicht.', '11:20'),
    m(ch.farida, 'Amir?', '11:21'),
    typing('Amir schreibt'),
    typing('Amir löscht'),
    m(ch.amir, 'Jemandem wie mir glaubt doch eh niemand.', '11:22'),
    m(ch.markus, 'Und meine Sachen?', '11:22'),
    m(ch.markus, 'Ich geh zur Schulleiterin!', '11:22'),
  ], ['fairness', 'info-check', 'reflect-understand']),

  S('s1e04c06_story_switch_amy', [
    amyChat(),
  ]),

  IT('s1e04c06_item_amir_guilt',
    'Finns Sportbeutel ist verschwunden. Amir hatte ihn. Jetzt wird im Chat sofort diskutiert, was passiert ist.\nWie siehst du das?',
    'judgement',
    'manipulation_recognize',
    [
      optSegs('a', 'Wenn Amir den Beutel hatte, muss er ihn ja geklaut haben.', 0,
        'Ein einzelner Hinweis zeigt selten alles. Was ist sicher – und was vermutest du nur?',
        '💡 Solange du nicht sicher sein kannst, halte dich mit Anschuldigungen zurück.',
      ),
      optSegs('b', 'Er wirkt schon verdächtig. Ich würde erst mal davon ausgehen, dass etwas dran ist.', 0,
        'Du lässt dich vom ersten Eindruck leiten. Das kann aber schnell in die falsche Richtung gehen. Was ist sicher – und was vermutest du nur?',
        '💡 Solange du nicht sicher sein kannst, halte dich mit Anschuldigungen zurück.',
      ),
      optSegs('c', 'Ich finde es schwierig. Man weiß nicht genug, um sich sicher zu sein.', 2,
        'Korrekt, zu diesem Zeitpunkt weiß man noch zu wenig. Es ist richtig, dich mit Anschuldigungen zurückzuhalten.',
        '💡 Solange du nicht sicher sein kannst, ist es richtig, dich mit Anschuldigungen zurückzuhalten.',
      ),
      optSegs('d', 'Ich würde erst wissen wollen, was wirklich passiert ist, bevor ich jemanden beschuldige.', 3,
        'Korrekt, zu diesem Zeitpunkt weiß man noch zu wenig. Genau diese Haltung macht einen fairen Umgang aus.',
        '💡 Solange du nicht sicher sein kannst, ist es richtig, dich mit Anschuldigungen zurückzuhalten.',
      ),
    ],
    ['info-check', 'reflect-understand'],
  ),

  AF('s1e04c06_amy_feedback_amir_guilt', 's1e04c06_item_amir_guilt'),

  S('s1e04c06_story_amy_char_amir', [
    amyChat(),
    m(ch.amy, 'Hier hast du die Möglichkeit, Amir von einer anderen Seite kennenzulernen.'),
    m(ch.amy, 'Er hat dir in dein Freundebuch geschrieben.'),
    bonusLink('char-amir',
      'Charakterkarte Amir',
      '/cards/char-amir',
      'Karte ansehen →',
    ),
  ], ['reflect-understand']),

]);

// ── Kapitel 7 — Amic 7 (Tag 4, Abend) ───────────────────────────────────────

const c07 = C('s1e04c07', 6, 'Amic 7', 'Mehr als Stress', [

  S('s1e04c07_story_carlos_jonas_aylin_amt', [
    privateChat('Carlos', 'Jonas', 'Aylin'),
    m(ch.carlos, 'Ich war gestern mit meiner Mutter beim Amt.', '18:00'),
    m(ch.aylin, 'Und?', '18:01'),
    m(ch.carlos, 'Da hab ich Amir gesehen.', '18:01'),
    sysImg('media/story/episodes/s1e04/s1e04c07-512.webp'),
    m(ch.jonas, 'Hattest du ihn nicht neulich schon mit seinen Eltern bei der Bank gesehen?', '18:02'),
    m(ch.carlos, 'Ja, richtig.', '18:03'),
    m(ch.carlos, 'Er hat wieder die ganze Zeit für seine Eltern übersetzt.', '18:03'),
    m(ch.carlos, 'Die hatten voll viele Briefe dabei.', '18:04'),
    m(ch.carlos, 'Und irgendwas wurde nicht genehmigt.', '18:04'),
    m(ch.carlos, 'Seine Eltern waren komplett fertig.', '18:05'),
    m(ch.jonas, 'Und er?', '18:06'),
    m(ch.carlos, 'Er musste das alles übersetzen und erklären.', '18:07'),
    m(ch.jonas, 'Aber versteht er das überhaupt alles?', '18:08'),
    m(ch.carlos, 'Keine Ahnung.', '18:08'),
    m(ch.aylin, 'Krass.', '18:09'),
    m(ch.jonas, 'Und das nach dem ganzen Stress in der Schule.', '18:10'),
    m(ch.carlos, 'Die Familie hat nichts mehr. Und jetzt solche Probleme.', '18:11'),
    m(ch.carlos, 'Da weiß man sich vielleicht echt nicht mehr anders zu helfen…', '18:12'),
    m(ch.aylin, 'Was meinst du?', '18:13'),
    m(ch.carlos, 'Naja, vielleicht kommt man da auf dumme Gedanken.', '18:13'),
    m(ch.jonas, 'Was? 😮', '18:14'),
    m(ch.carlos, 'Naja, ich versteh ihn irgendwie.', '18:15'),
    m(ch.jonas, 'Du jetzt auch noch?', '18:16'),
    m(ch.jonas, 'Es ist doch gar nicht gesagt, dass er geklaut hat!', '18:16'),
    m(ch.carlos, 'Hoffentlich nicht.', '18:17'),
    m(ch.carlos, 'Ich muss los Leute. Hasta luego.', '18:18'),
    sysMsg('Carlos hat den Chat verlassen.', '18:18'),
  ], ['reflect-understand', 'info-check']),

  S('s1e04c07_story_switch_amy', [
    amyChat(),
  ]),

  IT('s1e04c07_item_amir_family',
    'Du erfährst mehr über Amirs Situation zu Hause.\nWie gehst du jetzt damit um?',
    'judgement',
    'information_classify',
    [
      optSegs('a', 'Ein weiterer Hinweis. Jetzt ist klar, dass Amir schuldig ist.', 0,
        'Ein Beweis ist Amirs Situation zu Hause nicht. Hat das überhaupt etwas mit dem Sportbeutel zu tun?',
        '💡 Genau hier lohnt es sich, bewusst zu unterscheiden: Was weißt du wirklich und was vermutest du nur?',
      ),
      optSegs('b', 'Der arme Amir. Bei so viel Stress muss man Verständnis haben.', 0,
        'Ein Beweis ist Amirs Situation zu Hause nicht. Hat das überhaupt etwas mit dem Sportbeutel zu tun?',
        '💡 Genau hier lohnt es sich, bewusst zu unterscheiden: Was weißt du wirklich und was vermutest du nur?',
      ),
      optSegs('c', 'Ich bin unsicher. Vielleicht erklärt das sein Verhalten, aber ich weiß nicht, was wirklich passiert ist.', 1,
        'Richtig, man weiß immer noch nicht, was passiert ist. Hat Amirs Situation zu Hause überhaupt etwas mit dem Sportbeutel zu tun?',
        '💡 Genau hier lohnt es sich, bewusst zu unterscheiden: Was weißt du wirklich und was vermutest du nur?',
      ),
      optSegs('d', 'Jetzt wissen wir zwar mehr über Amirs Situation, aber mit dem Sportbeutel hat das erstmal nichts zu tun.', 3,
        'Gut. Du trennst die Informationen voneinander.',
        '💡 Genau so bleibst du fair: Du nimmst neue Infos ernst, aber vermischst sie nicht mit der eigentlichen Frage.',
      ),
    ],
    ['info-check', 'reflect-understand'],
  ),

  AF('s1e04c07_amy_feedback_amir_family', 's1e04c07_item_amir_family'),

  S('s1e04c07_story_jonas_aylin', [
    privateChat('Jonas', 'Aylin'),
    m(ch.aylin, 'Ich verabschiede mich auch. Muss Chioma noch schreiben.', '18:20'),
    m(ch.jonas, 'Ich wusste gar nicht, dass ihr auch außerhalb der Redaktion in Kontakt seid.', '18:21'),
    m(ch.aylin, 'Nicht viel, aber gestern hab ich ihr gesagt, dass ich mich um den Termin mit Alvarez kümmere.', '18:22'),
    m(ch.jonas, 'Ach ne. 😅', '18:23'),
    m(ch.jonas, 'Habt ihr auch über mich geredet?', '18:23'),
    m(ch.aylin, 'Über dich? Wieso?', '18:24'),
    m(ch.aylin, 'Ja, haben wir tatsächlich.', '18:24'),
    m(ch.jonas, 'Echt? 🧐', '18:25'),
    m(ch.jonas, 'Was denn?', '18:25'),
    m(ch.aylin, 'Naja, ich dachte, zwischen euch läuft vielleicht was.', '18:26'),
    m(ch.jonas, 'Und hast du sie gefragt?', '18:27'),
    m(ch.aylin, 'Naja, nicht so direkt.', '18:27'),
    m(ch.aylin, 'Ich hab erstmal gefragt, wie sie dich findet. So… du weißt schon…', '18:28'),
    m(ch.jonas, 'Und? Sag schon, was hat sie gesagt?', '18:29'),
    m(ch.aylin, 'Nett.', '18:30'),
    m(ch.jonas, 'Nett was?', '18:31'),
    m(ch.aylin, 'Ja, nett.', '18:31'),
    m(ch.aylin, 'Ich hab auch gefragt: „Nur nett?"', '18:32'),
    m(ch.aylin, 'Und sie hat gesagt: „Ja".', '18:32'),
    typing('Jonas tippt'),
    typing('Jonas löscht'),
    m(ch.aylin, 'Zwischen euch läuft also nichts?', '18:35'),
    m(ch.jonas, 'Ähm.', '18:37'),
    m(ch.jonas, 'Nein. Gar nichts.', '18:38'),
    m(ch.aylin, 'Oh, hab ich was Falsches gesagt?', '18:39'),
  ], ['reflect-understand']),

  S('s1e04c07_story_amy_jonas_diary2', [
    amyChat(),
    m(ch.amy, 'Schau dir an, was Jonas denkt.'),
    bonusLink('diary-jonas-entry2',
      'Jonas\' Tagebuch – Eintrag 2',
      '/diaries/diary_jonas?entry=s1e04c07_0002',
      'Tagebuch öffnen →',
    ),
  ], ['reflect-understand']),

]);

// ── Kapitel 8 — Amic 8 (Tag 5) ───────────────────────────────────────────────

const c08 = C('s1e04c08', 7, 'Amic 8', 'Im Probenraum', [

  S('s1e04c08_story_jonas_amir_musikraum', [
    privateChat('Jonas', 'Amir'),
    m(ch.jonas, 'Du hast mich echt überrascht.', '16:10'),
    m(ch.amir, 'Hatte nicht damit gerechnet, dass noch jemand nach der Schule im Probenraum ist.', '16:11'),
    m(ch.jonas, 'Zum Proben halt. Wie es der Name schon sagt. 😅', '16:12'),
    m(ch.jonas, 'Das war echt krass.', '16:12'),
    sysImg('media/story/episodes/s1e04/s1e04c08-512.webp', '16:13'),
    m(ch.amir, 'War nichts.', '16:14'),
    m(ch.jonas, 'Du hast das einfach so gemacht? Wie kommst du so spontan auf den Text?', '16:15'),
    m(ch.jonas, 'Und dann auch noch zweisprachig. Respekt!', '16:15'),
    m(ch.amir, 'Texte, das Spiel mit Worten… das ist das Einzige, was ich wirklich mag.', '16:16'),
    m(ch.amir, 'Dabei kann ich abschalten.', '16:16'),
    m(ch.jonas, '…', '16:17'),
    m(ch.jonas, 'Bei dir ist gerade viel los, oder?', '16:18'),
    m(ch.amir, 'Ja, ziemlich.', '16:19'),
    m(ch.jonas, 'Lust, dass wir uns die Tage nochmal im Probenraum treffen?', '16:20'),
    m(ch.amir, 'Weiß nicht.', '16:21'),
    m(ch.amir, 'Markus geht wegen des Sportbeutels zur Schulleiterin und ich flieg von der Schule.', '16:23'),
    m(ch.amir, 'Ich denk jeden Moment, sie ruft mich zu sich.', '16:23'),
    m(ch.jonas, 'Du warst das doch gar nicht.', '16:24'),
    m(ch.amir, 'Du glaubst mir?', '16:25'),
    m(ch.jonas, 'Klar. Du stellst dich doch nicht mit Finns geklautem Sportbeutel vor unser Klassenzimmer.', '16:25'),
    m(ch.amir, '😅 Ja, echt wahr. Man könnte drüber lachen, wenn es nicht so traurig wäre.', '16:26'),
    m(ch.jonas, 'Wenn du es nicht warst, kann dir doch nichts passieren.', '16:27'),
    m(ch.amir, 'Und wie beweise ich das?', '16:28'),
    m(ch.amir, 'Niemand außer dir glaubt mir.', '16:28'),
    m(ch.amir, 'Lass einfach.', '16:29'),
  ], ['reflect-understand', 'talk-act']),

  S('s1e04c08_story_switch_amy', [
    amyChat(),
  ]),

  IT('s1e04c08_item_support_jonas',
    'Amir hat das Gefühl, dass ihm sowieso niemand glaubt und gibt auf.\nWas würdest du jetzt an Jonas\' Stelle tun?',
    'responsibility',
    'intervene',
    [
      optSegs('a', 'Ich würde mich raushalten. Das ist nicht mein Problem.', 0,
        'Gerade wenn jemand denkt, dass ihm niemand glaubt, kann Unterstützung viel helfen. Man muss nicht alles lösen.',
        '💡 Aber zu zeigen „Ich bin da" kann einen großen Unterschied machen.',
      ),
      optSegs('b', 'Ich würde ihm sagen, dass er sich nicht so anstellen soll. Wenn er unschuldig ist, wird sich das schon klären.', 1,
        'Wenn jemand unsicher ist, kannst du helfen, wenn du zuhörst und die Person ernst nimmst. Man muss nicht alles lösen.',
        '💡 Aber zu zeigen „Ich bin da" kann einen großen Unterschied machen.',
      ),
      optSegs('c', 'Ich würde ihm sagen, dass ich ihm glaube und er nicht aufgeben soll.', 2,
        'Das kann ihm helfen, nicht aufzugeben. Man muss nicht alles lösen.',
        '💡 Aber zu zeigen „Ich bin da" kann einen großen Unterschied machen.',
      ),
      optSegs('d', 'Ich würde ihm zeigen, dass ich ihm glaube und fragen, wie ich ihm helfen kann.', 3,
        'So fühlt Amir sich nicht allein und kann leichter einen nächsten Schritt gehen. Man muss keine Lösung haben.',
        '💡 Oft reicht es, gemeinsam zu überlegen: „Was könnte jetzt helfen?"',
      ),
    ],
    ['reflect-understand', 'talk-act'],
  ),

  AF('s1e04c08_amy_feedback_support_jonas', 's1e04c08_item_support_jonas'),

  S('s1e04c08_story_jonas_amir_probenraum', [
    privateChat('Jonas', 'Amir'),
    m(ch.jonas, 'Also morgen im Probenraum?', '16:32'),
  ], ['talk-act']),

]);

// ── Kapitel 9 — Amic 9 (Tag 5, Abend) ────────────────────────────────────────

const c09 = C('s1e04c09', 8, 'Amic 9', 'Im Park', [

  S('s1e04c09_story_classChat_markus_danger', [
    divider('Am Abend'),
    classChat(),
    m(ch.markus, 'Muss hier grad durch so einen Park.', '20:10'),
    m(ch.markus, 'Aber hier sind so Typen…', '20:11'),
    m(ch.dominik, '😂 Viel Spaß', '20:12'),
    m(ch.markus, 'Ne im Ernst…', '20:13'),
    m(ch.markus, 'Die nerven.', '20:13'),
    m(ch.markus, 'Was mach ich bloß?', '20:14'),
    m(ch.tom, 'Was für Typen?', '20:15'),
    m(ch.markus, 'Keine Ahnung.', '20:15'),
    m(ch.markus, 'Schon ein paar Jahre älter.', '20:16'),
    m(ch.markus, 'Die wollen Stress.', '20:16'),
    m(ch.mia, 'Geh da weg.', '20:17'),
    m(ch.markus, 'Geht nicht so einfach.', '20:17'),
    m(ch.markus, 'Die versperren den Weg.', '20:18'),

    m(ch.markus, 'Helft mir.', '20:20'),
    m(ch.dominik, 'Wie stellst du dir das vor. 😂', '20:20'),
    m(ch.dominik, 'Jetzt wird\'s spannend', '20:21'),
    m(ch.igor, '@Markus: Hau lieber ab.', '20:21'),
    m(ch.markus, 'Wie denn?', '20:22'),
    m(ch.markus, 'Die lassen mich nicht.', '20:22'),

    img(ch.markus, 'media/story/episodes/s1e04/s1e04c09-512.webp', '20:25'),
    m(ch.chioma, 'Halt durch. Wir rufen die Polizei.', '20:26'),
    m(ch.chioma, 'Wo bist du denn genau?', '20:26'),

    m(ch.markus, 'Alles wieder gut. 😮‍💨', '20:35'),
    m(ch.markus, 'Ich bin zu Hause. Aber…', '20:35'),
    m(ch.markus, 'Ich bin völlig fertig.', '20:36'),
    m(ch.tom, 'Was ist passiert?', '20:37'),
    m(ch.markus, 'Erklär ich später.', '20:37'),
  ], ['safe-online', 'reflect-understand']),

  S('s1e04c09_story_markus_amir_user', [
    privateChat('Markus', 'Amir'),
    m(ch.markus, 'Das warst doch du?', '20:40'),
    m(ch.amir, 'Und wenn?', '20:41'),
    m(ch.markus, 'Also warst du es wirklich.', '20:42'),
    m(ch.amir, 'War doch dunkel. Das kann jeder gewesen sein.', '20:42'),
  ], ['reflect-understand']),

  S('s1e04c09_story_switch_amy', [
    amyChat(),
  ]),

  OR('s1e04c09_reflection_amir_explanation',
    'Was denkst du ist im Park passiert?',
    {
      topics: ['reflect-understand', 'info-check'],
      category: 'PERSPECTIVE',
      bypassAi: true,
      fixedAmyReply: 'Schau mal, was als Nächstes passiert.',
    },
  ),

  AR('s1e04c09_amy_reaction_explanation', 's1e04c09_reflection_amir_explanation'),

  S('s1e04c09_story_markus_amir_reveal', [
    privateChat('Markus', 'Amir'),
    m(ch.markus, 'Ich hab dich erkannt.', '20:45'),
    m(ch.markus, 'Das vergess ich dir nie.', '20:45'),
    m(ch.amir, 'Schon gut.', '20:46'),
    m(ch.markus, 'Warum hast du das gemacht?', '20:47'),
    m(ch.markus, 'Warum hast du mir geholfen? Die Typen hätten mich fertig gemacht.', '20:47'),
    m(ch.markus, 'Danke!', '20:48'),
    m(ch.markus, 'Echt Alter, danke!', '20:48'),
    m(ch.amir, 'Schon gut.', '20:49'),
    m(ch.markus, 'Warum?', '20:50'),
    m(ch.markus, 'Nach allem, was … passiert ist. 🫣', '20:50'),
    m(ch.amir, 'Ich bin nicht wie du.', '20:52'),
    m(ch.amir, 'Was die gemacht haben, war unfair.', '20:53'),
    m(ch.amir, '4 gegen 1. Immer auf die Schwächeren.', '20:53'),
  ], ['reflect-understand', 'fairness']),

  S('s1e04c09_story_markus_user', [
    privateChat('Markus', 'Du'),
    m(ch.markus, 'Krass, dass Amir mir geholfen hat. Ich war ja nicht gerade nett zu ihm. Was meinst du?', '21:00'),
  ], ['reflect-understand']),

  inp('s1e04c09_input_markus_user', 'stories:s1e04.c09.input.markus_user', {
    topics: ['reflect-understand', 'fairness'],
    promptSpeakerId: 'markus',
  }),

  S('s1e04c09_story_classChat_tag6', [
    classChat(),
    m(ch.dominik, 'Na Markus 😂', '09:05'),
    m(ch.dominik, 'Hast du überlebt?', '09:05'),
    m(ch.chioma, 'Was ist passiert?', '09:06'),
    m(ch.dominik, 'Erzähl doch mal.', '09:07'),
    m(ch.markus, 'Also…', '09:08'),
    m(ch.amir, '@Markus: Nichts weiter, oder?', '09:09'),
    m(ch.markus, 'Ne, ist nichts weiter passiert.', '09:10'),
    m(ch.dominik, 'Langweilig. 🥱', '09:10'),
    m(ch.amir, '@Dominik: Bist du nur zufrieden, wenn jemand leidet?', '09:11', { reactions: [R('👍')] }),
    m(ch.markus, '🤔', '09:12'),
    m(ch.mia, '@Markus: Ich war heute im Fundbüro. Ich soll dir sagen, dass sie deinen Sportbeutel letzte Woche in der Umkleide gefunden haben. Du sollst ihn endlich abholen.', '09:15'),
    m(ch.markus, '🫣 Echt? Dann hab ich ihn wohl nur vergessen…', '09:16'),
    m(ch.igor, 'Ich glaube, da ist eine Entschuldigung fällig!', '09:17'),
    m(ch.mia, 'Das glaube ich auch.', '09:18'),
    m(ch.markus, 'Ups. Oh Mann, jetzt auch das noch.', '09:19'),
    m(ch.markus, 'Tut mir echt Leid, Amir!', '09:20'),
    m(ch.amir, 'Bin nicht nachtragend.', '09:21'),
    m(ch.jonas, 'Und Finns Sportbeutel?', '09:22'),
    m(ch.jonas, 'Den wolltest du…', '09:22'),
    m(ch.amir, 'Den wollte ich ihm mitbringen. Er hatte ihn vergessen.', '09:23'),
    m(ch.finn, 'respekt. das war echt cool von dir', '09:24'),
    m(ch.amir, 'Ist doch selbstverständlich.', '09:25'),
    audio(ch.chioma, 'media/story/episodes/s1e04/s1e04c09_chioma_selbstverstaendlich.m4a', '09:26', 'Sprachnachricht'),
    m(ch.mia, 'Wir sollten anfangen, weniger Detektiv zu spielen.', '09:27'),
    m(ch.mia, 'Wäre vielleicht entspannter.', '09:27'),
    m(ch.carlos, 'Aber echt. Ich hab kurz überlegt, ob wir jetzt eine Kriminal-AG gründen müssen. 😂', '09:28', { reactions: [R('😂')] }),
    m(ch.jonas, 'Leute, wir sind echt gut darin, uns Geschichten über Leute auszudenken. 😉', '09:29'),
  ], ['reflect-understand', 'info-check']),

  inp('s1e04c09_input_classChat_end', 'stories:s1e04.c09.input.classChat_end', {
    topics: ['talk-act', 'reflect-understand'],
  }),

  S('s1e04c09_story_amy_insight', [
    amyChat(),
    m(ch.amy, 'Hast du Amir auch kurz verdächtigt?'),
    m(ch.amy, 'Unser Gehirn reimt sich eine plausible Lösung zusammen, wenn Informationen fehlen. Das ist ganz normal. Erst wenn weitere Fakten dazukommen, zeigt sich, ob die Vermutung stimmte. Da sollten wir also vorsichtig sein.'),
  ], ['reflect-understand']),

  CH('s1e04c09_challenge_firstimpression',
    '👉 Denke über eine Person, die du nicht so gut kennst, zuerst etwas Nettes.',
  ),

  S('s1e04c09_story_amy_challenge_bonus', [
    m(ch.amy, 'Die Situation mit Amir hat gezeigt, wie schnell ein Urteil falsch sein kann. Wenn du mehr wissen willst:'),
    bonusLink('urteilen-ueber-andere',
      'Was steckt hinter dem ersten Eindruck?',
      '/newspaper/urteilen-ueber-andere',
      'Artikel öffnen →',
    ),
  ], ['reflect-understand']),

]);

// ── Kapitel 10 — Amic 10 (Tag 8) ─────────────────────────────────────────────

const c10 = C('s1e04c10', 9, 'Amic 10', 'Das Interview', [

  S('s1e04c10_story_classChat_skatepark2', [
    classChat(),
    m(ch.mia, 'Super Wetter heute Abend. Wer kommt zum Skatepark?', '17:05'),
    img(ch.igor, 'media/story/episodes/s1e04/s1e04c10_1-512.webp', '17:20', { reactions: [R('❤️'), R('🔥')] }),
    m(ch.yasmin, 'Ich komme auch.', '17:22'),
    m(ch.jonas, '@Amir: Du wolltest doch auch vorbei kommen. Wo bleibst du?', '17:22'),
    m(ch.amir, 'Ich komm gleich.', '17:23'),
    m(ch.jonas, 'Ich hab für die Schülerzeitung ein Interview mit Amir geführt.', '17:23'),
    m(ch.jonas, 'Vielleicht interessiert euch das auch.', '17:23'),
    bonusLink('article-jonas-amir-interview',
      'Artikel: Jonas interviewt Amir',
      '/newspaper/article-jonas-amir-interview',
      'Artikel öffnen →',
    ),
  ], ['reflect-understand', 'info-check']),

  S('s1e04c10_story_amir_markus_private', [
    privateChat('Amir', 'Markus'),
    m(ch.markus, 'Ich weiß, du willst keine Entschuldigung.', '17:23'),
    m(ch.markus, 'Aber ich hab echt Mist gebaut.', '17:23'),
    m(ch.markus, 'Als meine Mutter davon gehört hat, hätte sie fast geheult.', '17:24'),
    m(ch.markus, 'Wenn es etwas gibt, bei dem ich helfen kann oder meine Mutter: Du hast was gut.', '17:24'),
    m(ch.markus, 'Sie ist Anwältin und hat echt viel Erfahrung mit Migrationsrecht…', '17:24'),
    m(ch.markus, 'Und ich sag\'s in der Schule nicht weiter.', '17:25'),
    m(ch.amir, 'Du nimmst mich auf den Arm.', '17:25'),
    m(ch.markus, 'Du musst das Angebot nicht jetzt annehmen.', '17:26'),
    m(ch.markus, 'Meld dich einfach bei mir.', '17:26'),
    m(ch.amir, '🤨', '17:26'),
  ], ['talk-act', 'fairness']),

  S('s1e04c10_story_classChat_together', [
    classChat(),
    m(ch.markus, 'Wir kommen ja schon.', '17:35'),
    m(ch.mia, 'Wir?', '17:35'),
    img(ch.jonas, 'media/story/episodes/s1e04/s1e04c10_2-512.webp', '17:36'),
    audio(ch.chioma, 'media/story/episodes/s1e04/s1e04c10_chioma_cooles-foto.m4a', '17:37', 'Sprachnachricht'),
    m(ch.jonas, 'Danke. ☺️', '17:38'),
    m(ch.aylin, 'Genug geflirtet. 😊', '17:39'),
    sysMsg('1 Woche später'),
    m(ch.amir, 'Du meintest es echt ernst. Jetzt muss ich auch nicht mehr ständig in der Schule fehlen. 😊', '20:06'),
    m(ch.amir, 'Danke.', '20:06'),
    img(ch.amir, 'media/story/episodes/s1e04/s1e04c10_2-512.webp', '20:05'),
  ], ['fairness', 'reflect-understand']),

  S('s1e04c10_story_switch_amy', [
    amyChat(),
  ]),

  OR('s1e04c10_reflection_markus_amir',
    'Stelle dir vor, es wäre nicht zu der Situation im Park gekommen:\nGlaubst du, Markus hätte trotzdem aufgehört, Amir auszugrenzen? Was hätte er dafür tun können?',
    {
      topics: ['reflect-understand', 'fairness'],
      category: 'PERSPECTIVE',
      bypassAi: true,
      fixedAmyReply: 'Übrigens: Es ist viel leichter, als man denkt, plötzlich die schlechte Stimmung aufzugeben und nett zu sein.',
    },
  ),

  AR('s1e04c10_amy_reaction_markus', 's1e04c10_reflection_markus_amir'),

  CH('s1e04c10_challenge_mood',
    '👉 Wenn du gerade schlechte Laune hast: Stelle dir in Gedanken ein Stopp-Schild vor, atme einmal tief durch und fange noch einmal mit guter Laune an.',
  ),

]);

// ── Episode ───────────────────────────────────────────────────────────────────

const s1e04De: StoryEpisodeV02 = {
  id: 's1e04',
  seasonId: 's1',
  episodeId: 's1e04',
  courseId: 's1e04',
  chapters: [c01, c02, c03, c04, c05, c06, c07, c08, c09, c10],
};

export default s1e04De;
