// src/story-v02/content/de/sp0e01.de.ts
// Halloween-Spezial: "Stimmen im Netz"

import type { Reaction } from '../../../common/types';
import { STORY_CHARACTERS as ch } from '../../../content/characters';
import type { StoryEpisodeV02 } from '../../types/storyTypes';
import {
  m, img, audio, typing, divider, bonusLink, ghostLink, sysMsg, sysImg, poll,
  privateChat, classChat, amyChat,
  GR, OR, AR, CH, MIT, AF,
  rc, inp, opt,
  S, C,
} from '../storyBuilder';

const R = (emoji: string, type?: string): Reaction => ({ emoji, type });

// Bild-Pfade — Dateinamen entsprechen exakt den Originalen aus assets_master/story/episodes/sp0e01/
const B = (n: string) => `/media/story/episodes/sp0e01/${n}`;
const A = (n: string) => `/media/story/episodes/sp0e01/${n}`;

// ─────────────────────────────────────────────────────────────────────────────
// KAPITEL 1 — Digital Ghost
// ─────────────────────────────────────────────────────────────────────────────

const c01 = C('sp0e01c01', 0, 'Amic 1', 'Digital Ghost', [

  S('sp0e01c01_klassenchat_start', [
    classChat('Klasse 7b'),
    m(ch.carlos, 'Habt ihr schon gesehen? Chiomas neues Weekly ist online!', '14:02'),
        sysImg(B('Halloween_1-512.webp'), '14:02'),
    bonusLink('chioma-news-stimmen-im-netz', 'Chiomas Weekly', '/newspaper/chioma-news-stimmen-im-netz', 'Jetzt anhören →'),
    m(ch.markus, 'Schubert an Halloween. Lame. 🥱', '14:10'),
    m(ch.dominik, 'Eine Sache könnte Halloween heute Abend vielleicht doch noch retten. 😏', '14:11'),
    m(ch.markus, '?', '14:11'),
    m(ch.yasmin, 'Verkleidet ihr euch? 💅', '14:04'),
    m(ch.carlos, 'Claro. 😈', '14:04'),
    m(ch.dominik, 'Das ist doch was für Babys.', '14:04'),
    m(ch.lukas, 'Schon im viktorianischen Zeitalter haben sich Erwachsene zu Halloween verkleidet. Später waren dann Jugendliche berüchtigt für ihre Streiche.', '14:05'),
    m(ch.dominik, 'Danke, Wikipedia. 🙄', '14:05'),
    m(ch.lukas, 'Immer gerne.', '14:06'),
    m(ch.yasmin, '@Carlos: Als was gehst du?', '14:06'),
    m(ch.carlos, 'Großes Geheimnis. 🔒', '14:06'),
    m(ch.chioma, 'Mir wollte er es auch nicht verraten.', '14:07'),
    m(ch.dominik, 'Wer heute den besten Halloween-Streich bringt, kriegt von mir eine XXL-Süßigkeiten-Mischung.', '14:07', { replyTo: { text: '?', speakerName: 'Markus' } }),
    m(ch.markus, 'Echt?', '14:07'),
    m(ch.dominik, 'Wenn du dich traust. 😏', '14:08'),
    m(ch.chioma, 'Leute, habt ihr mein Weekly nicht gehört?', '14:08', { reactions: [R('🥱')] }),
    m(ch.carlos, 'Ich geh um 18:30 Uhr los, wer kommt mit?', '14:09'),
  ]),

  S('sp0e01c01_carlos_user_private', [
    privateChat('Carlos', 'Du'),
    m(ch.carlos, 'Ich bin voll der Halloween-Fan.', '14:25'),
    m(ch.carlos, 'Wie ist das bei dir? Verkleidest du dich?', '14:25'),
  ]),

  inp('sp0e01c01_input_halloween', 'stories:sp0e01.c01.input.halloween', {
    topics: ['talk-act'],
    promptSpeakerId: 'carlos',
  }),

  S('sp0e01c01_lisa_ghost_private', [
    privateChat('Lisa', 'digitalghost7b'),
    audio(ch.digitalghost7b, A('VoiceMessage_1.m4a'), '15:00', 'Sprachnachricht'),
    m(ch.lisa, 'Chioma?', '15:00'),
    m(ch.lisa, 'Warum nennst du dich digitalghost?', '15:01'),
    m(ch.lisa, 'Hey, Chioma!?', '15:01'),
  ]),

  S('sp0e01c01_amy_switch_unknown', [
    amyChat(),
  ]),

  MIT('sp0e01c01_item_unknown_account',
    'Was würdest du tun, wenn du eine Nachricht von einem unbekannten Account bekommst?',
    'judgement',
    'judgement_explain',
    [
      opt('a', 'Ich antworte erstmal nicht.', 1),
      opt('b', 'Ich klicke auf Links oder Dateien, um herauszufinden, wer es ist.', 0), 
      opt('c', 'Ich erzähle einer erwachsenen Person davon, der ich vertraue.', 1),
      opt('d', 'Ich blockiere oder melde den Account, wenn mir die Nachricht komisch vorkommt.', 1),
      opt('e', 'Ich schicke persönliche Informationen oder Fotos, wenn die Person danach fragt.', 0),
      opt('f', 'Ich frage Freundinnen oder Freunde, ob sie den Account kennen.', 1),
    ],
    {
      minSelections: 1,
      maxSelections: 6,
      helperText: 'Mehrere Antworten können richtig sein.',
      topics: ['safe-online', 'reflect-understand'],
    },
  ),

  AF('sp0e01c01_amy_feedback_unknown_account', 'sp0e01c01_item_unknown_account'),

  S('sp0e01c01_lisa_chioma_private', [
    privateChat('Lisa', 'Chioma'),
    m(ch.lisa, 'Was sollte das denn?', '15:05'),
    m(ch.chioma, 'Was?', '15:05'),
    m(ch.lisa, 'Na, deine komische Spooky-Nachricht.', '15:05'),
    m(ch.chioma, 'Ich versteh nicht.', '15:06'),
    m(ch.lisa, 'Wir sind doch nicht mehr in der ersten Klasse.', '15:06'),
  ]),

  S('sp0e01c01_chioma_carlos_private', [
    privateChat('Chioma', 'Carlos'),
    m(ch.carlos, 'Chioma, warum hast du mich gerade angerufen? Was soll der Quatsch?', '15:08'),
    m(ch.chioma, 'Habe ich nicht. Was wollt ihr alle von mir?', '15:08'),
  ]),

  S('sp0e01c01_chioma_aylin_private', [
    privateChat('Chioma', 'Aylin'),
    m(ch.aylin, 'Hi Chioma, hast du mich gerade als „digitalghost7b" angerufen?', '15:10'),
    m(ch.chioma, 'Nein. Aber Lisa und Carlos haben mich gerade dasselbe gefragt.', '15:10'),
    m(ch.chioma, 'Wieso sollte ich euch als digitaler Geist anrufen?', '15:11'),
    m(ch.aylin, 'Es war deine Stimme!', '15:11'),
    m(ch.chioma, 'Was geht hier vor? 🤔', '15:11'),
  ]),
]);

// ─────────────────────────────────────────────────────────────────────────────
// KAPITEL 2 — Geisterstimmen
// ─────────────────────────────────────────────────────────────────────────────

const c02 = C('sp0e01c02', 1, 'Amic 2', 'Geisterstimmen', [

  S('sp0e01c02_klassenchat_ghost_posts', [
    classChat('Klasse 7b'),
    img(ch.digitalghost7b, B('Halloween_2-512.webp'), '15:30', { content: 'ICH BIN ZU SCHNELL FÜR DICH.' }),
    img(ch.digitalghost7b, B('Halloween_3-512.webp'), '15:30', { content: 'TOO LATE.' }),
    img(ch.digitalghost7b, B('Halloween_4-512.webp'), '15:31', { content: 'DU MUSST DICH SCHNELLER UMDREHEN.' }),
    m(ch.aylin, 'Mach keinen Quatsch! War jetzt gruselig genug.', '15:31'),
    m(ch.lisa, '@digitalghost7b: Wer bist du?', '15:31'),
    m(ch.yasmin, 'Spooky 👀', '15:32'),
    m(ch.digitalghost7b, 'Habt ihr Angst? 😱', '15:32'),
  ]),

  S('sp0e01c02_aylin_ghost_private', [
    privateChat('Aylin', 'digitalghost7b'),
    audio(ch.digitalghost7b, A('VoiceMessage_2.m4a'), '15:33', 'Anruf'),
    m(ch.aylin, 'Hey, warum hast du einfach aufgelegt?', '15:34'),
    m(ch.aylin, 'Woher weißt du von Hugo?', '15:35'),
    m(ch.digitalghost7b, 'Ich weiß alles.', '15:35'),
    m(ch.aylin, 'Sag das nicht weiter. Ich warn dich.', '15:35'),
  ]),

  S('sp0e01c02_carlos_ghost_private', [
    privateChat('Carlos', 'digitalghost7b'),
    audio(ch.digitalghost7b, A('VoiceMessage_5.m4a'), '15:36', 'Anruf'),
    m(ch.carlos, 'Du kennst…', '15:40'),
    m(ch.carlos, 'Woher kennst du mein Kostüm?!', '15:40'),
  ]),

  S('sp0e01c02_lisa_ghost_private2', [
    privateChat('Lisa', 'digitalghost7b'),
    audio(ch.digitalghost7b, A('VoiceMessage_9.m4a'), '15:38', 'Anruf'),
    m(ch.lisa, 'Chioma, das ist doch deine Stimme.', '15:40'),
    m(ch.digitalghost7b, 'Dann bin ich das wohl.', '15:40'),
    m(ch.digitalghost7b, '🤡', '15:41'),
    m(ch.lisa, '😱', '15:41'),
    audio(ch.digitalghost7b, A('VoiceMessage_10.m4a'), '15:40', 'Sprachnachricht'),
    m(ch.digitalghost7b, 'Hab ich dich erschreckt? Ups, das wollte ich nicht.', '15:41'),
  ]),

  S('sp0e01c02_lisa_chioma_2', [
    privateChat('Lisa', 'Chioma'),
    m(ch.lisa, 'Chioma, echt. Sage mir bitte die Wahrheit. Hast du mich gerade angerufen?', '15:45'),
    m(ch.chioma, 'Nein! Ich schwöre. Ich war mit der ganzen Familie in der Küche.', '15:45'),
    m(ch.lisa, 'Du, ich krieg wirklich Angst. Mich ruft der digitalghost an. Mit DEINER Stimme. Wenn ich zurück rufe, geht niemand ran.', '15:46'),
    m(ch.chioma, 'Das muss ein fieser Trick sein.', '15:46'),
    m(ch.lisa, 'Ich weiß nicht. Vielleicht gibt es digitale Geister ja wirklich.', '15:47'),
    m(ch.chioma, 'Carlos und Aylin sagen auch, ich hätte sie angerufen. Ich füge sie mal unserem Chat hinzu.', '15:48'),
    sysMsg('Carlos hinzugefügt.', '15:48'),
    sysMsg('Aylin hinzugefügt.', '15:48'),
    m(ch.lisa, 'Digitalghost... Wie heute Morgen im Weekly. Meint ihr es gibt wirklich digitale Geister?', '15:49'),
    m(ch.carlos, 'Das ist doch Quatsch.', '15:49'),
    m(ch.aylin, 'Naja, wer weiß…', '15:49'),
    m(ch.chioma, 'Habt ihr beim Weekly nicht zugehört? Ein digitaler Geist ist kein echter Geist. Dahinter steckt KI.', '15:50'),
    m(ch.carlos, 'Moment. Und die Stimme kann aus Videos kommen? 🤔', '15:50'),
    m(ch.chioma, 'Genau.', '15:50'),
    m(ch.carlos, 'Also auch aus Podcast-Aufnahmen 🤔 ... Dein Weekly!', '15:51'),
    m(ch.lisa, 'Stimmt. Davon gibt\'s genug Aufnahmen.', '15:51'),
    m(ch.chioma, 'Aber ohne meine Zustimmung ist das doch verboten!', '15:51'),
  ]),

  S('sp0e01c01_amy_intro', [
    amyChat(),
  ], ['info-check']),

  GR('sp0e01c01_reflection_voice_knowledge',
    'Du bekommst eine ungewöhnliche Sprachnachricht von einem Freund. Die Stimme klingt genau wie er. Was weißt du sicher?',
    [
      rc('a', 'Die Nachricht ist von ihm.',
        'Nicht unbedingt. Stimmen können heute mit KI ziemlich echt nachgemacht werden.',
      ),
      rc('b', 'Die Stimme klingt wie seine. Wer die Nachricht geschickt hat, weiß ich noch nicht.',
        'Genau! Eine vertraute Stimme ist ein Hinweis, aber noch kein sicherer Beweis dafür, wer gesprochen hat.',
      ),
      rc('c', 'Wenn die Stimme perfekt klingt, kann es keine KI sein.',
        'Leider nein. KI-Stimmen können inzwischen sehr echt klingen.',
      ),
      rc('d', 'Wenn ich seine Nummer sehe, ist die Nachricht echt.',
        'Auch eine bekannte Nummer ist kein sicherer Beweis dafür, wer die Nachricht wirklich geschickt hat.',
      ),
    ],
    { topics: ['info-check', 'reflect-understand'] },
  ),

  AR('sp0e01c01_amy_reaction', 'sp0e01c01_reflection_voice_knowledge'),

  S('sp0e01c01_amy_tip', [
    m(ch.amy, 'Kommt dir eine Nachricht komisch vor? Frag die Person über einen anderen Weg, zum Beispiel persönlich oder über einen Chat, den ihr sonst benutzt.'),
  ]),
]);

// ─────────────────────────────────────────────────────────────────────────────
// KAPITEL 3 — Auf der Spur
// ─────────────────────────────────────────────────────────────────────────────

const c03 = C('sp0e01c03', 2, 'Amic 3', 'Auf der Spur', [

  S('sp0e01c02_start', [
    privateChat('Lisa', 'Chioma, Aylin, Carlos'),
    m(ch.lisa, 'Woher hat der Geist eigentlich unsere Fotos?', '16:00'),
    m(ch.carlos, 'Er muss mich heute fotografiert haben, als er mich angerufen hat … genau das hatte ich heute an.', '16:01'),
    m(ch.lisa, 'Leute, ihr glaub\'s nicht!', '16:01'),
    m(ch.lisa, 'Diesen Zopf hatte ich mir nur für die Schule gemacht. Als der Geist mich angerufen hat…', '16:02'),
    m(ch.carlos, 'Was denn?', '16:02'),
    m(ch.lisa, '… da hatte ich die Haare offen. Das Foto hat der Geist also gar nicht gemacht, als er angerufen hat. Er hat nur so getan, um uns zu erschrecken.', '16:02'),
    m(ch.aylin, 'Wahnsinn!', '16:03'),
    m(ch.aylin, 'Aber…', '16:03'),
    m(ch.aylin, 'Er wusste auch Dinge von mir, die niemand wissen kann. 🤔', '16:03'),
    m(ch.carlos, 'Was denn?', '16:03'),
    m(ch.aylin, 'Das… em, das möchte ich nicht sagen.', '16:04'),
    m(ch.carlos, 'Ja, von mir auch. Er kannte mein Halloween-Kostüm. Davon habe ich niemandem erzählt. 😱', '16:04'),
    m(ch.chioma, 'Lisa, wusste der Geist… äh, ich meine der Unbekannte auch etwas von dir?', '16:04'),
    m(ch.lisa, 'Von mir? Em… nein.', '16:05'),
    m(ch.chioma, 'Komisch. Na egal. Der Unbekannte muss irgendwie von euren Geheimnissen erfahren haben.', '16:05'),
    m(ch.carlos, 'Unmöglich!', '16:05'),
    m(ch.aylin, 'Nichts ist unmöglich.', '16:06'),
    m(ch.carlos, 'Recherchieren wir. Wir müssen die Social Media Accounts von allen unseren Freunden durchsuchen.', '16:06'),
    m(ch.aylin, 'Und von der Familie.', '16:06'),
    m(ch.lisa, 'Und den Klassenchat, besonders die alten Bilder.', '16:06'),
    m(ch.lisa, 'Dafür brauchen wir aber alle Informationen. Aylin?', '16:07'),
    m(ch.aylin, 'So kommen wir nicht weiter.', '16:07'),
  ]),

  S('sp0e01c02_klassenchat_ghost_aylin', [
    classChat('Klasse 7b'),
    m(ch.digitalghost7b, '@Aylin: Viele Grüße von Hugo.', '16:20'),
    m(ch.aylin, 'Lass mich in Ruhe.', '16:20'),
    m(ch.digitalghost7b, 'Hugo ist schon müde.', '16:21'),
    m(ch.aylin, 'Lass mich.', '16:21'),
    img(ch.digitalghost7b, B('Halloween_5-512.webp'), '16:21', { content: '' }),
    m(ch.dominik, 'Wie süß 😂 Ich schmeiß mich weg.', '16:22'),
    m(ch.finn, 'so einen hatte ich auch mal … als ich 4 war', '16:22', { reactions: [R('😂')] }),
    m(ch.digitalghost7b, '@Carlos: Kleb deine Zähne heute Abend besser an, du Vampir 🧛.', '16:23'),
    m(ch.carlos, 'Och manno, das sollte doch noch niemand wissen. 🫤', '16:23'),
    m(ch.dominik, 'Oh, willst du jetzt weinen. 😭', '16:24'),
    m(ch.digitalghost7b, 'Das tut mir jetzt aber Leid.', '16:24'),
    m(ch.carlos, 'Ihr seid gemein!', '16:24'),
    m(ch.dominik, 'Uuh 😭', '16:25'),
    m(ch.digitalghost7b, '@Lisa: Sieh dich vor heute Nacht. Du weißt schon... 🤡', '16:25'),
  ]),

  S('sp0e01c03_amy_switch_private_public', [
    amyChat(),
  ]),

  OR('sp0e01c03_reflection_private_public',
    'Der Geist hat Geheimnisse von anderen ohne ihre Erlaubnis im Klassenchat veröffentlicht. Wie würdest du dich fühlen, wenn etwas Privates von dir plötzlich alle wissen würden?',
    {
      category: 'FEELING',
      topics: ['reflect-understand', 'fairness'],
    },
  ),

  AR('sp0e01c03_amy_reaction_private_public', 'sp0e01c03_reflection_private_public'),

  S('sp0e01c03_amy_tip_private_public', [
    m(ch.amy, 'Von mir wurde auch ein Geheimnis weiter erzählt: Ich hatte eine 5 in Bio. Am nächsten Tag wussten es auf einmal alle. Ich war so wütend, weil meine Freundin mein Vertrauen missbraucht hat.'),
  ]),

    S('sp0e01c03_group_investigation', [
    privateChat('Lisa', 'Chioma', 'Carlos', 'Aylin'),
    m(ch.carlos, 'Hat dein Geheimnis etwas mit diesem Hugo zu tun?', '16:30'),
    m(ch.aylin, 'Na schön. Ja, Hugo ist mein uraltes Kuscheltier. Ein Hund. Er schläft unter meinem Bett, um mich zu beschützen.', '16:30'),
    m(ch.carlos, 'Wie süß.', '16:31'),
    m(ch.aylin, 'Sei bloß vorsichtig 💪!', '16:31'),
    m(ch.aylin, '… Von Hugo weiß nun wirklich niemand.', '16:31'),
    m(ch.carlos, 'Ich tippe auf Dominik. Der hat heute Morgen irgendwas von einem Streich gesagt.', '16:32'),
    m(ch.aylin, 'Das passt zu ihm. 🙄', '16:32'),
    m(ch.lisa, 'Beweisen tut das noch nichts. Hast du nichts herausgefunden?', '16:33'),
    m(ch.carlos, 'Nichts.', '16:33'),
    m(ch.aylin, 'Ernsthaft? Ich denk du bist unser Computer-Genie.', '16:33'),
    m(ch.carlos, 'Ja und?', '16:34'),
    m(ch.aylin, 'Hast du nicht gesagt, du hättest niemandem von deinem Halloween-Kostüm erzählt?', '16:34'),
    m(ch.carlos, 'Hab ich auch nicht.', '16:34'),
    m(ch.aylin, 'Und nichts gepostet?', '16:34'),
    m(ch.carlos, 'Wirklich nicht.', '16:35'),
    m(ch.aylin, 'Dein Bruder aber schon 😂 ... Ich hab was gefunden.', '16:45'),
    img(ch.aylin, B('Halloween_6-512.webp'), '16:45', { content: '' }),
    m(ch.carlos, 'Was?? Der Spion! Mein Bruder kann was erleben!', '16:45'),
    m(ch.lisa, 'So kenn ich dich ja gar nicht 😂.', '16:46'),
    m(ch.lisa, 'Ich habe auch etwas gefunden. Aylin, dieses Foto hast DU SELBST in den Klassenchat gestellt. Ein Selfie vor deinem Laptop. Aber dahinter…', '16:46'),
    img(ch.lisa, B('Halloween_7-512.webp'), '16:46', { content: '' }),
    m(ch.aylin, 'Hugo! Ich glaub´s nicht!', '16:47'),
    m(ch.aylin, 'Ich mach Dominik fertig. 😡', '16:47'),
    m(ch.carlos, 'Wir wissen doch gar nicht, dass er es war.', '16:47'),
    m(ch.lisa, 'Er wohnt doch bei dir um die Ecke. Frag ihn einfach.', '16:48'),
  ]),

  S('sp0e01c02_amy_intro', [
    amyChat(),
  ], ['info-check', 'reflect-understand']),

  MIT('sp0e01c02_item_digital_footprint',
    'Wo könnte jemand online Informationen über dich finden?',
    'judgement',
    'information_classify',
    [
      opt('a', 'In Fotos mit erkennbarem Hintergrund (z.B. Zuhause/ Schule).', 1),
      opt('b', 'In Livestreams, Videos oder TikTok.', 1),
      opt('c', 'Über mein Gaming-Profil oder anderen Accounts.', 1),
      opt('d', 'In Beiträgen, die meine Eltern oder Geschwister über mich geteilt haben.', 1),
      opt('e', 'In Klassenchats, Gruppen oder Foren.', 1),
      opt('f', 'Auf der Website meiner Schule oder meines Vereins.', 1),
      opt('g', 'Durch Suchanfragen – wenn mein Name irgendwo öffentlich auftaucht.', 1),
    ],
    {
      minSelections: 1,
      maxSelections: 7,
      helperText: 'Mehrere Antworten können richtig sein.',
      topics: ['info-check', 'reflect-understand'],
      scored: false,
    },
  ),

  AF('sp0e01c02_amy_feedback_digital_footprint', 'sp0e01c02_item_digital_footprint'),
    S('sp0e01c02_amy_tip', [
    m(ch.amy, 'Schau bei Fotos und Posts auch auf die anderen: Verrätst du vielleicht etwas über jemanden, das die Person lieber für sich behalten würde?'),
  ]),

  CH('sp0e01c02_challenge_digital_footprint',
    'Finde heraus, was du online über dich finden kannst.',
  ),
]);

// ─────────────────────────────────────────────────────────────────────────────
// KAPITEL 4 — Meine Stimme
// ─────────────────────────────────────────────────────────────────────────────

const c04 = C('sp0e01c04', 3, 'Amic 4', 'Meine Stimme', [



  S('sp0e01c03_klassenchat_lisas_secret', [
    privateChat('Lisa', 'Chioma', 'Carlos', 'Aylin'),
    m(ch.carlos, 'Dominik kann es nicht sein. Genau als ich mit ihm gesprochen habe, kam bei uns beiden im Klassenchat ein Post an.', '17:00'),
    m(ch.carlos, 'Seht euch vor im Dunkeln. Es treiben Geister ihr Unwesen.', '17:00', { forwarded: { fromName: 'digitalghost7b', fromChatLabel: 'Klassenchat' } }),
    m(ch.lisa, 'Die habe ich auch bekommen. 😱 Ich geh heute nirgends mehr alleine hin.', '17:01'),
    m(ch.carlos, 'Wir können dich abholen. 18:40?', '17:01'),
    m(ch.lisa, 'Abgemacht.', '17:01'),
    m(ch.lisa, 'Ich habe mich übrigens ein bisschen umgehört.', '17:02'),
    m(ch.lisa, 'Yasmin hat heute morgen gesehen, wie Markus fotografiert hat. Sie hat sich gewundert, weil er gar nicht gewartet hat, bis die Leute in die Kamera geguckt haben.', '17:02'),
    m(ch.aylin, 'Verdächtig 🤔', '17:03'),
    m(ch.aylin, 'Lisa, was meinte der Geist eigentlich mit dem Clown?', '17:03'),
    m(ch.lisa, 'Ach nichts.', '17:04'),
    m(ch.aylin, 'Das glaube ich nicht.', '17:04'),
    m(ch.carlos, 'Stimmt. Der Geist hat uns dreien immer einen ähnlichen Schrecken eingejagt. Warum sollte er dir keine zweite Nachricht geschickt haben? Und dann das mit dem Clown…', '17:05'),
    m(ch.aylin, 'Raus mit der Sprache.', '17:05'),
    m(ch.lisa, 'Also schön. Ich habe wahnsinnige Angst vor Clowns.', '17:06'),
    m(ch.carlos, 'Ja und?', '17:06'),
    m(ch.lisa, 'Super peinlich! Wer hat schon Angst vor Clowns? Ich krieg richtig Panik. Besonders jetzt bei Nacht. 😱', '17:06'),
    m(ch.aylin, 'Das wusste ich gar nicht.', '17:07'),
    m(ch.lisa, 'Das weiß niemand. Außer meine Mutter. Und die tratscht das nicht online weiter.', '17:07'),
    m(ch.aylin, 'Nicht online? Aber hat sie jemandem davon erzählt?', '17:07'),
    m(ch.lisa, 'Mit ihrer besten Freundin bespricht sie einfach alles. Aber sonst nicht, glaub ich.', '17:08'),
    m(ch.aylin, 'Moment mal. Ihre beste Freundin? Das ist doch…', '17:08'),
    m(ch.lisa, 'Markus´ Mutter!! 😱', '17:08'),
  ]),

  S('sp0e01c03_klassenchat_markus_arrives', [
    classChat('Klasse 7b'),
    m(ch.markus, '@Carlos, ich bin da. Kommst du?', '18:20'),
    m(ch.carlos, 'Claro. Ich mach mich gleich auf den Weg.', '18:20'),
  ]),

  S('sp0e01c03_markus_ghost_private', [
    privateChat('Markus', 'digitalghost7b'),
    audio(ch.digitalghost7b, A('VoiceMessage_11.m4a'), '18:20', 'Sprachnachricht'),
    m(ch.markus, 'Chioma?', '18:21'),
    audio(ch.digitalghost7b, A('VoiceMessage_12.m4a'), '18:21', 'Sprachnachricht'),
    m(ch.markus, 'Hey, was soll das?!', '18:21'),
    m(ch.digitalghost7b, 'Du wagst es, Streiche in meinem Namen zu spielen?', '17:21'),
  ]),

  S('sp0e01c03_markus_confesses', [
    classChat('Klasse 7b'),
    img(ch.digitalghost7b, B('Halloween_8-512.webp'), '18:22', { content: '' }),
    m(ch.markus, 'Was geht hier ab? 😱', '18:22'),
    m(ch.aylin, 'Jetzt tu nicht so.', '18:22'),
    m(ch.aylin, 'Markus, du Verräter. Postest private Fotos von mir.', '18:22'),
    m(ch.markus, 'Aber… Jetzt schickt der Geist auch Fotos von mir 😧.', '18:22'),
    m(ch.aylin, 'Lenk nicht ab. Gib\'s zu!', '18:22'),
    m(ch.markus, 'Okay, ich war\'s.', '18:23'),
    m(ch.markus, 'War doch nur ein Spaß.', '18:23'),
    m(ch.chioma, 'Du hast meine Stimme geklont!', '18:23'),
    audio(ch.digitalghost7b, A('VoiceMessage_13.m4a'), '18:23', 'Sprachnachricht'),
    m(ch.chioma, 'Hör jetzt gefälligst damit auf.', '18:24'),
    m(ch.markus, 'Das bin ich nicht mehr.', '18:24'),
    m(ch.chioma, 'Das kannst du deiner Großmutter erzählen.', '18:25'),
    audio(ch.digitalghost7b, A('VoiceMessage_14.m4a'), '18:25', 'Sprachnachricht'),
    m(ch.markus, 'Lasst mich in Ruhe. Es ist doch schon dunkel.', '18:26'),
    m(ch.dominik, 'Du Armer. Musst du um diese Zeit nicht schon zu Hause sein? 😂', '18:26'),
  ]),


  S('sp0e01c03_amy_switch_prank_ethics', [
    amyChat(),
  ]),

  OR('sp0e01c03_reflection_prank_ethics',
    '„Ich wollte dich nur erschrecken." Das hört man zu Halloween öfter. Wann denkst du, geht ein Streich zu weit?',
    {
      category: 'PERSPECTIVE',
      topics: ['reflect-understand', 'fairness'],
    },
  ),

  AR('sp0e01c03_amy_reaction', 'sp0e01c03_reflection_prank_ethics'),

  S('sp0e01c03_amy_tip_prank_ethics', [
    m(ch.amy, 'Entscheidend ist nicht nur die Absicht. Schau auch auf die Folgen: Hat jeder noch Spaß oder fühlt sich jemand bedroht, bloßgestellt oder verletzt?'),
  ]),

  S('sp0e01c03_confirmation_group', [
    privateChat('Lisa', 'Chioma', 'Carlos', 'Aylin'),
    m(ch.carlos, 'Markus hat mir gerade alles gestanden.', '18:31'),
    m(ch.chioma, 'Meine Stimme?', '18:32'),
    m(ch.carlos, 'Geklont.', '18:32'),
    m(ch.lisa, 'Und unsere Fotos?', '18:33'),
    m(ch.carlos, 'Auch er.', '18:33'),
    m(ch.aylin, '😡', '18:33'),
    m(ch.lisa, 'Warum?!', '18:34'),
    m(ch.carlos, 'Dominiks Halloween-Challenge.', '18:34'),
    m(ch.chioma, 'Unglaublich.', '18:34'),
    m(ch.carlos, 'Aber …', '18:34'),
    m(ch.carlos, 'Wir haben ein neues Problem.', '18:35'),
    m(ch.lisa, 'Was denn?', '18:35'),
    m(ch.carlos, 'Markus war das im Klassenchat gerade wirklich nicht.', '18:35'),
    m(ch.lisa, 'Wie bitte?', '18:35'),
    m(ch.carlos, 'Er stand neben mir.', '18:36'),
  ]),
]);


// ─────────────────────────────────────────────────────────────────────────────
// KAPITEL 5 — Wer zuletzt lacht
// ─────────────────────────────────────────────────────────────────────────────

const c05 = C('sp0e01c05', 4, 'Amic 5', 'Wer zuletzt lacht', [

  S('sp0e01c04_group_new_problem', [
    privateChat('Lisa', 'Carlos', 'Markus', 'Aylin'),
    m(ch.carlos, '@Lisa, wann kommst du endlich raus? Markus und ich warten schon hier.', '18:45'),
    m(ch.lisa, 'Markus?? 😡', '18:45'),
    m(ch.markus, 'Ja, sorry. Aber lasst mich nicht allein gehen.', '18:47'),
    m(ch.lisa, 'Ist ja gut. Komme in 2 Minuten.', '18:47'),
    m(ch.lisa, 'Und Aylin?', '18:47'),
    m(ch.carlos, 'Die muss noch kurz was erledigen und wir treffen sie gleich vor der Schule.', '18:47'),
  ]),

  S('sp0e01c04_klassenchat_aylin_gone', [
    classChat('Klasse 7b'),
    m(ch.chioma, 'Ist schon jemand da? Emma und ich sind auf dem Weg.', '18:50'),
    m(ch.dominik, 'Alle in Grüppchen unterwegs 😂 Traut sich niemand allein auf die Straße?', '18:51'),
    m(ch.aylin, 'Leute, ich hab gerade Herrn Alvarez getroffen. Der war total komisch.', '18:52'),
    m(ch.aylin, 'Er sagt, die Party fällt aus. Er war richtig sauer auf Frau Schubert, dass sie für heute was in der Schule geplant hat.', '18:52'),
    m(ch.dominik, 'Was labert der? Soll das einer verstehen?', '18:52'),
    m(ch.aylin, 'Er sagt: Vor 700 Jahren gab es dort, wo heute unsere Turnhalle steht, einen Friedhof. Dort wurden während einer Seuche so viele Menschen begraben, dass einige Gräber ohne Namen blieben.', '18:53'),
    m(ch.aylin, 'Der Sage nach kehren in der Nacht vor Allerheiligen diejenigen zurück, an die sich niemand mehr erinnert.\nNicht jede Nacht.\nNur diese eine.', '18:53'),
    m(ch.chioma, 'Die Nacht vor Allerheiligen? Das ist heute!', '18:54'),
    m(ch.dominik, '💀', '18:54'),
    m(ch.carlos, 'Na, ich weiß nicht.', '18:54'),
    m(ch.aylin, 'Kein Witz. Er hat mich richtig weggejagt. Wir sollen nach Einbruch der Dunkelheit heute nicht mehr aufs Schulgelände. Man könne nie wissen.', '18:55'),
    m(ch.lisa, 'Meint er das wirklich ernst?', '18:55'),
    divider('später'),
    m(ch.digitalghost7b, 'DIE TOTEN VERGESSEN NICHT.\nJAHRHUNDERTE HABEN WIR GEWARTET.\nJETZT SOLL DIE WAHRHEIT ANS LICHT.\nEINE VON EUCH HOLE ICH MIR ALS PFAND.', '18:55'),
    m(ch.dominik, 'Bitte lass es Chioma sein, die nervt eh immer 😂', '18:55'),
    m(ch.chioma, 'Das hättest du wohl gern.', '18:56'),
    m(ch.aylin, 'Da war ein Knacken hinter mir. Ich glaube da ist jemand hinter mir her.', '18:56'),
    m(ch.lisa, 'Wollen wir nicht alle lieber nach Hause gehen?', '18:56'),
    audio(ch.aylin, A('VoiceMessage_15.m4a'), '18:56', 'Sprachnachricht'),
    img(ch.digitalghost7b, B('Halloween_9-512.webp'), '18:58', { content: '' }),
    m(ch.digitalghost7b, 'WOLLT IHR SIE ZURÜCK? DANN FINDET DAS GRAB, DAS KEINEN NAMEN TRÄGT.', '18:58'),
    img(ch.digitalghost7b, B('Halloween_10-512.webp'), '18:58', { content: '' }),
    m(ch.carlos, 'Ob das alles Fake ist?', '18:58'),
    m(ch.carlos, 'Die Stimme könnte wieder geklont und das Bild KI sein.', '18:58'),
    m(ch.chioma, 'Das glaube ich nicht. Sie wollte doch längst hier sein.', '18:58'),
    m(ch.chioma, 'Ich ruf sie lieber an.', '18:58'),
    m(ch.chioma, 'Sie nimmt nicht ab.', '18:58'),
    m(ch.lisa, 'Ich mach mir echt Sorgen.', '18:58'),
  ]),

  S('sp0e01c04_amy_switch_pressure', [
    amyChat(),
  ]),

  OR('sp0e01c04_reflection_pressure',
    'Der Geist setzt die Gruppe ständig unter Druck: „Kommt schnell", „findet das Grab", „wenn ihr sie zurückwollt …". Warum kann Druck dazu führen, dass man online schlechter entscheidet?',
    {
      category: 'PERSPECTIVE',
      topics: ['reflect-understand', 'safe-online'],
    },
  ),

  AR('sp0e01c04_amy_reaction', 'sp0e01c04_reflection_pressure'),

  S('sp0e01c04_amy_tip_pressure', [
    m(ch.amy, 'Wer dich absichtlich hetzt oder verängstigt, will oft verhindern, dass du nachdenkst. Gerade dann lohnt sich innezuhalten und ruhig zu bleiben.'),
  ]),

  S('sp0e01c04_private_investigation', [
    privateChat('Carlos', 'Lisa', 'Markus', 'Chioma', 'Emma', 'Aylin', 'Dominik', 'Lukas'),
    m(ch.chioma, 'Wir schreiben lieber im Privatchat, damit der Geist nicht mitliest.', '18:59'),
    m(ch.lisa, 'Gute Idee. Was machen wir jetzt? Was meint der Geist?', '18:59'),
    m(ch.chioma, 'Kennt das jemand?', '18:59'),
    m(ch.carlos, 'Nein.', '18:59'),
    m(ch.lukas, 'Wartet.', '18:59'),
    m(ch.lukas, 'Den Stein kenne ich.', '18:59'),
    m(ch.carlos, 'Woher?', '19:00'),
    m(ch.lukas, 'Frau Schubert hat uns den bei dieser Geo-Führung gezeigt.', '19:00'),
    m(ch.carlos, 'Wann?', '19:01'),
    m(ch.lukas, 'Letztes Jahr. Du warst dabei.', '19:01'),
    m(ch.carlos, 'Du erinnerst dich an einen Stein aus dem letzten Jahr?', '19:01'),
    m(ch.dominik, 'Natürlich tust du das.', '19:01'),
    m(ch.lukas, 'Hinter der Schule. Am Graben.', '19:02'),
    m(ch.carlos, 'Wo seid ihr? Wartet auf mich.', '19:02'),
    divider('später'),
  ]),

  S('sp0e01c04_ar_moment', [
    classChat('Klasse 7b'),
     m(ch.carlos, 'Gefunden.', '19:08'),
    m(ch.lisa, 'Sicher? Wo bleibt Lukas?', '19:08'),
    m(ch.carlos, 'Mit Efeu und Moos bewachsen. Die Eicheln. Das ist der Stein.', '19:09'),
    m(ch.chioma, 'Und jetzt?', '19:09'),
    m(ch.digitalghost7b, 'MANCHES SIEHT MAN ERST, WENN MAN DURCH DAS RICHTIGE AUGE SCHAUT. 👁️', '19:10'),
    ghostLink('DAS AUGE ÖFFNEN'),
    m(ch.carlos, '„Das richtige Auge"?', '19:11'),
    m(ch.lukas, 'Die Kamera, du Genie.', '19:11'),
    m(ch.lisa, 'Mach schon.', '19:11'),
    m(ch.carlos, 'Ich?', '19:11'),
    m(ch.lisa, 'Stell dich nicht so an. Drück drauf.', '19:12'),
    m(ch.carlos, 'Es will Zugriff auf meine Kamera.', '19:12'),
    m(ch.lisa, 'Dann ist das Auge wohl deine Kamera.', '19:12'),
    m(ch.carlos, 'Äh … Leute? Da steht jemand.', '19:13'),
    m(ch.lisa, 'Wo?', '19:13'),
    m(ch.carlos, 'Man sieht\'s nur durch die Kamera.', '19:13'),
    m(ch.dominik, 'Was? Was seht ihr? Leute, wo seid ihr denn?', '19:14'),
    img(ch.carlos, B('Halloween_11-512.webp'), '19:44', { content: 'Ein… Geist.' }),
    m(ch.emma, 'WAAAS?! Geht da bloß nicht hin!', '19:14'),
    m(ch.chioma, 'Aber wir müssen Aylin finden!', '19:15'),
    m(ch.emma, 'Erst digitale Geister, dann namenlose Pesttote und jetzt ein Gespenst? Vielleicht wollen die Toten einfach nicht für immer als Bots durchs Internet geistern! 😱', '19:15'),
    m(ch.dominik, 'Die hat sie doch nicht alle.', '19:15'),
    m(ch.dominik, 'Sagt Bescheid, wenn ihr das alte Bettlaken gefunden habt.', '19:16'),
    m(ch.carlos, 'Du musst uns helfen! Aylin könnte in Gefahr sein.', '19:16'),
    m(ch.dominik, 'Ich seh euch an der Turnhalle, auf eure Gespenstersuche hab ich kein Bock. Viel Glück ihr Ghost busters! 🚫👻', '19:17'),
    m(ch.lisa, 'Carlos, wartet auf mich. Lasst mich nicht zurück. Ich hab Angst. Kann ich deine Hand nehmen?', '19:17'),
    m(ch.dominik, 'Wie süß 😙😂', '19:18'),
  ]),

  S('sp0e01c04_group_final', [
    privateChat('Carlos', 'Lisa', 'Chioma'),
    m(ch.chioma, 'Ist Dominik wirklich so cool oder hat er etwas mit der Sache zu tun?', '19:20'),
    m(ch.carlos, 'Das werden wir herausfinden.', '19:20'),
    m(ch.lisa, 'Da hinten ist doch jemand.', '19:20'),
    m(ch.carlos, 'Das ist Dominik.', '19:21'),
  ]),

  S('sp0e01c04_resolution', [
    classChat('Klasse 7b'),
    m(ch.dominik, 'Kommt SCHNELL!!', '19:22'),
    m(ch.lisa, 'Du hast doch irgendwas mit der Sache zu tun?!', '19:22'),
    m(ch.dominik, 'Was? Quatsch. Aber ich sehe da was an der Eiche.', '19:22'),
    m(ch.lisa, 'Der Ghost! Oh nein, mit Sense. 😱', '19:23'),
    m(ch.dominik, 'Und da ist Aylin, gefesselt an den Stamm.', '19:23'),
    m(ch.emma, 'Ich halt das nicht aus! Weg hier!', '19:23'),
    m(ch.lisa, 'Wir müssen jetzt zusammen bleiben.', '19:24'),
    m(ch.dominik, 'Das ist doch nicht echt. Ich geh hin. 💪', '19:24'),
    m(ch.emma, 'WAS?? NEIN!', '19:24'),
    m(ch.dominik, 'Was denn? Ich stups ihn an.', '19:25'),
    img(ch.carlos, B('Halloween_12-512.webp'), '19:25', { content: '' }),
    m(ch.carlos, 'Dominik rennt zur Turnhalle.', '19:25'),
    m(ch.emma, 'An alle: Wir brauchen HILFE! SOFORT! An der alten Eiche!', '19:26'),
    m(ch.yasmin, 'Kommt zur Turnhalle. Schnell!', '19:26'),
    img(ch.yasmin, B('Halloween_13-512.webp'), '19:26', { content: '' }),
  ]),

  S('sp0e01c04_party', [
    privateChat('Carlos', 'Lisa', 'Aylin'),
    m(ch.carlos, 'Super Party.', '20:30'),
    m(ch.lisa, 'Hätte nicht gedacht, dass die Schubert so eine coole Party planen kann.', '20:30'),
    m(ch.carlos, 'Naja, mit Hilfe. Aylins Streich war der Hammer.', '20:31'),
    m(ch.lisa, 'Ein bisschen zu sehr Hammer. Ich hatte echt Angst.', '20:31'),
    m(ch.aylin, 'Okay, sorry. 😬 Aber bedankt euch bei Markus. Ich hab seinen Trick einfach gegen ihn verwendet. 😇', '20:32'),
    m(ch.lisa, 'Und der Geist?', '20:32'),
    m(ch.aylin, 'Frau Schubert. Sie hatte sowieso Angst, dass ihre Feier langweilig wird.', '20:32'),
    m(ch.lisa, 'Die Sense auch?', '20:33'),
    m(ch.aylin, 'Pappe. Mehr hat sie nicht erlaubt. 😂', '20:33'),
    m(ch.lisa, 'Und Alvarez?', '20:33'),
    m(ch.aylin, 'Nie getroffen. 😇', '20:33'),
    
    classChat('Klasse 7b'),
    m(ch.lisa, 'Stand nicht noch eine Wahl aus?', '20:35'),
    m(ch.aylin, 'Ja, genau. Wie war das noch Markus?', '20:35'),
    m(ch.dominik, 'Verräter.', '20:35'),
    m(ch.markus, 'Ja. Wer den besten Halloween-Streich bringt.', '20:36'),
    m(ch.carlos, 'Das war ja wohl Aylin.', '20:36'),
    m(ch.markus, 'Hey. Die hat ja bloß meinen [[voice-clone]]-Trick geklaut.', '20:36'),
    m(ch.lisa, 'Du hast dich also nicht erschrocken?', '20:37'),
    m(ch.markus, 'Naja, schon ein bisschen.', '20:37'),
    m(ch.dominik, 'Ich hab klar gewonnen! War alles meine Idee mit der Challenge.', '20:38'),
    m(ch.aylin, '😂😂', '20:38'),
    m(ch.dominik, 'Außerdem war der Geist doch voll lame. Hab ich gleich durchschaut.', '20:38'),
    m(ch.aylin, 'Soll ich das Foto nochmal zeigen? 😇', '20:39'),
    m(ch.dominik, 'Wag es nicht.', '20:39'),
    poll(ch.carlos, 'Wer hatte den besten Halloween-Streich?', [
      { text: 'Aylin', votes: 15 },
      { text: 'Dominik', votes: 1 },
      { text: 'Markus', votes: 1 },
    ], '20:40'),
    m(ch.aylin, 'Gut. Dann hätte ich jetzt gern meinen Preis.', '20:40'),
    m(ch.dominik, 'Welchen Preis?', '20:41'),
    img(ch.markus, B('Halloween_14-512.webp'), '19:55', { content: '' }),
    m(ch.dominik, 'Markus!! Verräter…', '20:41'),
    m(ch.carlos, 'Screenshots vergessen nichts.', '20:42'),
    m(ch.dominik, 'Ich hasse Medienkompetenz.', '20:42'),
  ]),

  S('sp0e01c04_carlos_user_ar', [
    privateChat('Carlos', 'Du'),
    m(ch.carlos, 'Aylin hat [[augmented-reality]]-Technik benutzt. Super cool! Ich hab dazu mal etwas aufgeschrieben. Schau rein, wenn es dich interessiert.', '20:45'),
    bonusLink('ar-halloween-special', 'Artikel: Was ist Augmented Reality?', '/newspaper/ar-halloween-special', 'Artikel öffnen →'),
  ]),

  CH('sp0e01c04_challenge_ghost_story',
    'Erfinde eine kurze Gruselgeschichte. Was macht eine Geschichte wirklich gruselig? Erzähl sie heute noch jemandem und beobachte, wie die Person reagiert.',
  ),
]);

// ─────────────────────────────────────────────────────────────────────────────
// EPISODE
// ─────────────────────────────────────────────────────────────────────────────

const sp0e01De: StoryEpisodeV02 = {
  id: 'sp0e01',
  seasonId: 'sp',
  episodeId: 'sp0e01',
  courseId: 'sp0e01',
  chapters: [c01, c02, c03, c04, c05],
};

export default sp0e01De;
