// src/story-v02/content/de/s1e02.de.ts

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

// ─────────────────────────────────────────────────────────────
// KAPITEL 1 — Alarm im Klassenchat
// ─────────────────────────────────────────────────────────────

const c01 = C('s1e02c01', 0, 'Amic 1', 'Alarm im Klassenchat', [

  S('s1e02c01_story_intro_private', [
    privateChat('Yasmin', 'Lisa', 'Chioma'),
    m(ch.yasmin, 'Und? Sag schon: Was gibt’s Neues aus der Gerüchteküche?', '10:05'),
    m(ch.lisa, 'Kann gerade echt nicht 🙈 bin schon auf dem Weg zum Sushi.', '10:05'),
    m(ch.lisa, 'Das mit Dominik heute Morgen hab ich dir ja schon erzählt.', '10:06'),
  ]),

  S('s1e02c01_story_chioma_user', [
    privateChat('Chioma', 'Du'),
    m(ch.chioma, 'Yasmin und Lisa sind ja echt nett. Aber dass sie immer auf der Jagd nach Updates sind 🙄', '10:07'),
    m(ch.chioma, 'Gibt es sowas in deiner Klasse auch?', '10:07'),
  ]),

  inp('s1e02c01_input_user_reply', 'stories:s1e02.c01.input.reply', {
    topics: ['reflect-understand'],
    promptSpeakerId: 'chioma',
  }),

  S('s1e02c01_story_classchat_escalation', [
    classChat(),
    m(ch.mia, 'Boah, Sport war heute echt lame.', '11:00'),
    m(ch.finn, 'ich fand’s eigentlich ganz okay 😅', '11:01'),
    m(ch.dominik, 'Mit Volleyball-Nieten wie Yasmin kein Wunder 😂', '11:01'),
    m(ch.markus, 'lol 😂😂', '11:02'),
    m(ch.yasmin, 'Mir sind deine Regeln gerade echt egal!! 🙄🔥', '11:03'),
    m(ch.dominik, 'Dann chill halt auf der Bank, du Loser 💀', '11:03'),
    m(ch.yasmin, 'Ey, ich warne dich jetzt echt! 😤', '11:04'),
    m(ch.lisa, 'Yasmin, bitte! 😕', '11:05'),
    m(ch.dominik, 'Ey, haltet mal alle die Klappe jetzt!', '11:06'),
    m(ch.chioma, 'Kurze Frage: Was passiert hier gerade?', '11:06'),
    m(ch.chioma, 'Privat wäre fairer.', '11:07'),
    m(ch.dominik, 'Willst du mir jetzt den Mund verbieten? 😂', '11:07'),
    m(ch.igor, 'Ey Dominik, lass gut sein.', '11:08'),
    m(ch.markus, 'Genau 👍', '11:08'),
    sysMsg('Dominik hat Chioma entfernt.', '11:09'),
    bonusLink('char-dominik', 'Charakterkarte Dominik', '/cards/char-dominik', 'Karte ansehen →'),
  ], ['reflect-understand', 'talk-act']),

  S('s1e02c01_story_switch_amy', [
    amyChat(),
  ]),

  IT('s1e02c01_item_chat_dynamics',
    'Was passiert hier gerade im Chat?',
    'perspective',
    'perspectives_recognize',
    [
      optSegs('a', 'Viele lesen mit und reagieren – der Streit breitet sich aus.', 3,
        'Der Konflikt betrifft nicht mehr nur zwei Personen.',
        '👉 Immer mehr mischen sich ein.',
        '💡 In Gruppenchats eskalieren Konflikte schnell.',
      ),
      optSegs('b', 'Der Streit wird größer und immer mehr schreiben etwas dazu.', 2,
        'Der Chat wird unübersichtlich.',
        '👉 Viele Stimmen verstärken den Konflikt.',
        '💡 Je mehr mitmachen, desto schwieriger wird es.',
      ),
      opt('c', 'Yasmin und Dominik streiten sich.', 1),
      opt('d', 'Das ist normaler Streit im Chat.', 0),
    ],
    ['reflect-understand'],
  ),

  AF('s1e02c01_amy_feedback_chat', 's1e02c01_item_chat_dynamics'),

]);

// ─────────────────────────────────────────────────────────────
// KAPITEL 2 — Verantwortung zeigen
// ─────────────────────────────────────────────────────────────

const c02 = C('s1e02c02', 1, 'Amic 2', 'Verantwortung zeigen', [

  S('s1e02c02_story_private', [
    privateChat('Yasmin', 'Lisa', 'Chioma'),
    m(ch.chioma, 'Was ging denn da ab?', '12:00'),
    m(ch.yasmin, 'Da ist erst richtig Chaos ausgebrochen.', '12:01'),
    m(ch.lisa, 'Ich hab nichts gesagt… sonst flieg ich auch raus.', '12:02'),
  ]),

  S('s1e02c02_story_switch_amy', [
    amyChat(),
  ]),

  IT('s1e02c02_item_responsibility',
    'Was würdest du in so einer Situation tun?',
    'responsibility',
    'intervene',
    [
      optSegs('a', 'Ich würde auch zurück beleidigen.', 0,
        'Das verstärkt den Streit.',
        '👉 Es wird nur schlimmer.',
        '💡 Mitmachen heizt Konflikte an.',
      ),
      optSegs('b', 'Ich halte mich raus.', 2,
        'Du machst nicht mit.',
        '👉 Der Streit bleibt bestehen.',
        '💡 Ein guter erster Schritt.',
      ),
      optSegs('c', 'Ich sage, dass das Verhalten nicht okay ist.', 3,
        'Du setzt ein Zeichen.',
        '👉 Das braucht Mut.',
        '💡 Eine Stimme kann viel verändern.',
      ),
      optSegs('d', 'Ich sage nichts aus Angst.', 1,
        'Du schützt dich.',
        '👉 Aber es ändert nichts.',
        '💡 Sicherheit ist wichtig – aber Wirkung auch.',
      ),
    ],
    ['talk-act'],
  ),

  AF('s1e02c02_amy_feedback_responsibility', 's1e02c02_item_responsibility'),

]);

// ─────────────────────────────────────────────────────────────
// KAPITEL 3 — Chioma unter Druck
// ─────────────────────────────────────────────────────────────

const c03 = C('s1e02c03', 2, 'Amic 3', 'Chioma unter Druck', [

  S('s1e02c03_story_private', [
    privateChat('Jonas', 'Chioma'),
    m(ch.jonas, 'Hey, ist alles okay bei dir?', '13:00'),
    m(ch.chioma, 'Fühlt sich mies an.', '13:01'),
    m(ch.jonas, 'Sie posten Memes über dich.', '13:02'),
    m(ch.chioma, 'Ernsthaft?', '13:02'),
  ]),

  S('s1e02c03_story_switch_amy', [
    amyChat(),
  ]),

  IT('s1e02c03_item_selfcontrol',
    'Was würdest du Chioma raten?',
    'self_regulation',
    'interrupt_impulse',
    [
      opt('a', 'Einfach ignorieren.', 0),
      opt('b', 'Abwarten.', 1),
      opt('c', 'Gedanken sortieren.', 2),
      opt('d', 'Aktiv etwas ändern.', 3),
    ],
    ['reflect-understand'],
  ),

  AF('s1e02c03_amy_feedback_selfcontrol', 's1e02c03_item_selfcontrol'),

]);

// ─────────────────────────────────────────────────────────────
// KAPITEL 4 — Die Idee
// ─────────────────────────────────────────────────────────────

const c04 = C('s1e02c04', 3, 'Amic 4', 'Die Idee', [

  S('s1e02c04_story_newspaper', [
    privateChat('Schülerzeitung'),
    m(ch.jonas, 'Ich hab Chioma eingeladen.', '14:00'),
    m(ch.aylin, 'Wir brauchen Inhalte.', '14:01'),
    m(ch.chioma, 'Ich hab eine Idee…', '14:02'),
  ]),

  OR('s1e02c04_reflection',
    'Was würdest du gern mal für einen Beitrag machen?',
    { topics: ['creative'] },
  ),

  AR('s1e02c04_amy_reaction', 's1e02c04_reflection'),

  CH('s1e02c04_challenge',
    '👉 Schreib heute eine Idee auf, die dir wichtig ist.',
  ),
]);

// ─────────────────────────────────────────────────────────────
// KAPITEL 5 — Der Plan
// ─────────────────────────────────────────────────────────────

const c05 = C('s1e02c05', 4, 'Amic 5', 'Der Plan', [

  S('s1e02c05_story_plan', [
    privateChat('Chioma', 'Carlos'),
    m(ch.chioma, 'Ich will das als Audio machen.', '15:00'),
    m(ch.carlos, 'Spannend 🤔', '15:01'),
    m(ch.chioma, 'Ein Gespräch statt Chat.', '15:02'),
  ]),

  S('s1e02c05_story_switch_amy', [
    amyChat(),
  ]),

  IT('s1e02c05_item_action',
    'Wie würdest du entscheiden?',
    'responsibility',
    'take_responsibility',
    [
      opt('a', 'Nichts machen.', 0),
      opt('b', 'Sicher bleiben.', 1),
      opt('c', 'Eigenen Weg suchen.', 3),
      opt('d', 'Öffentlich machen.', 3),
    ],
  ),

  AF('s1e02c05_amy_feedback_action', 's1e02c05_item_action'),

]);

// ─────────────────────────────────────────────────────────────
// KAPITEL 6 — Veröffentlichung
// ─────────────────────────────────────────────────────────────

const c06 = C('s1e02c06', 5, 'Amic 6', 'Veröffentlichung', [

  S('s1e02c06_story_publish', [
    privateChat('Carlos', 'Chioma'),
    m(ch.carlos, 'Der Upload ist um 15:00 Uhr.', '14:55'),
    m(ch.chioma, 'Ich hab eine Idee!', '14:56'),
    m(ch.carlos, 'Platzhalter?', '14:57'),
    m(ch.chioma, 'Genau 😊', '14:57'),
  ]),

]);

// ─────────────────────────────────────────────────────────────
// KAPITEL 7 — Ergebnis
// ─────────────────────────────────────────────────────────────

const c07 = C('s1e02c07', 6, 'Amic 7', 'Ergebnis', [

  S('s1e02c07_story_result', [
    classChat(),
    m(ch.dominik, '58% 🙄', '16:00'),
    m(ch.jonas, 'Glückwunsch!', '16:01'),
    m(ch.chioma, 'Hat geklappt 😊', '16:01'),
  ]),

]);

// ─────────────────────────────────────────────────────────────
// KAPITEL 8 — Reflexion
// ─────────────────────────────────────────────────────────────

const c08 = C('s1e02c08', 7, 'Amic 8', 'Reflexion', [

  OR('s1e02c08_reflection',
    'Was wäre dir in einem Klassenchat besonders wichtig?',
    { topics: ['reflect-understand'] },
  ),

  AR('s1e02c08_amy_reaction', 's1e02c08_reflection'),

]);

// ─────────────────────────────────────────────────────────────
// KAPITEL 9 — Epilog
// ─────────────────────────────────────────────────────────────

const c09 = C('s1e02c09', 8, 'Epilog', '', [
  S('s1e02c09_story', [
    privateChat('Tom', 'Mia'),
    m(ch.tom, 'Hast du gesehen, wie lange Finn online ist?', '07:20'),
    m(ch.mia, 'kp 🤔', '07:21'),
    m(ch.tom, 'Irgendwas ist anders.', '07:22'),
  ]),
], { isEpilogue: true });

// ─────────────────────────────────────────────────────────────
// EPISODE
// ─────────────────────────────────────────────────────────────

const s1e02De: StoryEpisodeV02 = {
  id: 's1e02',
  seasonId: 's1',
  episodeId: 's1e02',
  courseId: 's1e02',
  chapters: [c01, c02, c03, c04, c05, c06, c07, c08, c09],
};

export default s1e02De;