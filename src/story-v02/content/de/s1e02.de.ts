// src/story-v02/content/de/s1e02.de.ts
// Episode content – compact via storyBuilder helpers.

import type { Reaction } from '../../../common/types';
import { STORY_CHARACTERS as ch } from '../../../content/characters';
import type { StoryEpisodeV02 } from '../../types/storyTypes';
import {
  m, img, sysImg, audio, typing, divider, amyTip, bonusLink, sysMsg,
  privateChat, classChat, amyChat,
  opt, optSegs, rc,
  S, inp, IT, MIT, AF, GR, OR, AR, CH, C,
} from '../storyBuilder';

const R = (emoji: string, type?: string): Reaction => ({ emoji, type });

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 1 — Alarm im Klassenchat
// ─────────────────────────────────────────────────────────────────────────────

const c01 = C('s1e02c01', 0, 'Amic 1', 'Alarm im Klassenchat', [

  S('s1e02c01_story_intro_private', [
    privateChat('Lisa', 'Yasmin', 'Chioma'),
    m(ch.yasmin, 'Und? Sag schon: Was gibt\'s Neues aus der Gerüchteküche?', '18:52'),
    m(ch.lisa, 'Kann gerade echt nicht 🙈 bin schon auf dem Weg zum Sushi.', '18:52'),
    m(ch.lisa, 'Das mit Dominik heute Morgen hab ich dir ja schon erzählt.', '18:53'),
  ], ['reflect-understand', 'talk-act']),

  S('s1e02c01_story_chioma_private', [
    privateChat('Du', 'Chioma'),
    m(ch.chioma, 'Yasmin und Lisa sind ja echt nett. Aber dass sie immer auf der Jagd nach Updates und Insidern sind 🙄🤦🏾‍♀️', '18:54'),
    m(ch.chioma, 'Gibt es sowas in deiner Klasse auch?', '18:54'),
  ], ['reflect-understand', 'talk-act']),

  inp('s1e02c01_input_chioma_gossip_reply', 'stories:s1e02.c01.input.chiomaGossipReply', {
    topics: ['talk-act'],
    promptSpeakerId: 'chioma',
  }),

  S('s1e02c01_story_classchat_escalation', [
    classChat(),
    divider('Nächster Tag'),
    m(ch.mia, 'Boah, Sport war heute echt lame.', '14:05'),
    m(ch.finn, 'ich fand´s eigentlich ganz okay 😅 jeder hat halt sein ding gemacht.', '14:05'),
    m(ch.dominik, 'Kein Wunder 😂 Mit Volleyball-Nieten wie Yasmin im Team kann ja nix laufen.', '14:06'),
    m(ch.markus, 'lol 😂😂😂', '14:06'),
    m(ch.dominik, 'Sie kennt nicht mal die Basics!! 🤦‍♂️ Digga, dass man den Ball nicht zweimal hintereinander berühren darf, weiß doch jeder.', '14:06'),
    m(ch.elsa, '🤣🙈', '14:07'),
    m(ch.yasmin, 'Mir sind deine Regeln gerade echt egal!! 🙄🔥', '14:07'),
    m(ch.dominik, 'Bro, geht´s noch?? 😂 Ohne Regeln kein Sport, logisch!! Dann chill halt auf der Bank, du Loser 💀💀', '14:07'),
    m(ch.yasmin, 'Ey, ich warne dich jetzt echt! 😤😤', '14:08'),
    m(ch.yasmin, 'Und was hast du in dieser Zeit noch so getrieben? 😶 Soll ich dir auf die Sprünge helfen oder lieber nicht?', '14:08'),
    m(ch.finn, 'hä?', '14:08'),
    m(ch.mia, 'Ey, worum geht´s hier eigentlich?', '14:09'),
    m(ch.dominik, '@Yasmin Bro, was soll das denn jetzt heißen??', '14:09'),
    m(ch.lisa, 'Yasmin, bitte! 😕', '14:09'),
    m(ch.dominik, 'Lisa? Hast du…?', '14:10'),
    m(ch.yasmin, '[[omg]], war doch nur Spaß 😂✨😂✨', '14:10'),
    m(ch.dominik, 'Spaß??', '14:10'),
    m(ch.dominik, 'Willst du mir grad drohen, oder was?', '14:10'),
    m(ch.mia, 'Hä, was hat Lisa denn nun gesagt?', '14:11'),
    m(ch.dominik, 'Ey, haltet mal alle die Klappe jetzt!', '14:11'),
    m(ch.lisa, 'Ganz ehrlich, ich hab wirklich nichts gesagt 😳', '14:11'),
    m(ch.chioma, 'Kurze Frage: Was passiert hier gerade?', '14:11'),
    m(ch.chioma, 'Wollt ihr das wirklich hier im Klassenchat ausrollen? Privat wäre fairer.', '14:12'),
    m(ch.dominik, 'Willst du mir jetzt den Mund verbieten, Digga?', '14:12'),
    m(ch.igor, 'Ey Dominik, lass gut sein.', '14:12'),
    m(ch.dominik, 'Yasmin ist doch die, die hier rumdroht!!! 🔥🔥🔥 Und Verräter sollten echt aufpassen, no cap.', '14:13'),
    m(ch.markus, 'Genau 👍', '14:13'),
    m(ch.yasmin, 'Ey, lass es jetzt einfach 🙄', '14:13'),
    m(ch.mia, 'Ich check hier grad gar nichts mehr.', '14:13'),
    sysImg('/media/story/episodes/s1e02/s1e02c01-512.webp', 's1e02c01-img-01'),
    m(ch.chioma, 'Okay, kurze Pause.', '14:14'),
    m(ch.dominik, 'Hä? Wer hat dich überhaupt gefragt?', '14:14'),
    m(ch.chioma, 'Es gibt offenbar etwas, das nicht öffentlich sein soll. Dann gehört es doch nicht in den Klassenchat, oder?', '14:14'),
    m(ch.dominik, 'Und du bist bitte wer? 😂 Polizei 🚨 oder Frau Lehrerin 🤓 oder was? 😂', '14:15'),
    m(ch.mia, 'Naja… mich würde schon interessieren, was Yasmin eigentlich meint.', '14:15'),
    m(ch.chioma, 'So kommen wir nicht weiter. Wie gehen wir jetzt damit um?', '14:15'),
    m(ch.dominik, 'So ´ne Spaßbremse braucht hier echt keiner. Du bist raus 💀', '14:16'),
    m(ch.markus, 'Stimmt 😅', '14:16'),
    sysMsg('Dominik hat Chioma entfernt.', '14:16'),
  ], ['reflect-understand', 'talk-act', 'fairness']),

  S('s1e02c01_story_switch_to_amy', [
    amyChat(),
  ], ['reflect-understand']),

    IT('s1e02c01_item_chat_escalation',
    'Warum greift Chioma ein? (Suche Chiomas wichtigsten Grund aus.)',
    'perspective',
    'perspectives_recognize',
    [
      optSegs('a', 'Sie möchte wissen, was zwischen Yasmin und Dominik passiert ist.', 0,
        'Chioma ist nicht neugierig, sie fragt nicht nach Details, sondern möchte den Streit stoppen und verhindern, dass Privates im Klassenchat landet.',
        '💡 Du kennst selten die ganze Geschichte. Versuche deshalb auch die Sicht anderer zu verstehen.',
      ),
      optSegs('b', 'Sie findet Dominik unfair und möchte Yasmin verteidigen.', 1,
        'Chioma hält Dominiks Verhalten wahrscheinlich für unfair. Aber hauptsächlich möchte sie verhindern, dass Privates im Klassenchat landet.',
        '💡 Du kennst selten die ganze Geschichte. Versuche deshalb auch die Sicht anderer zu verstehen.',
      ),
      optSegs('c', 'Sie möchte nicht, dass etwas Privates vor vielen Mitschülern ausgetragen wird.', 3,
        'Genau. Chioma merkt, dass hier etwas Privates öffentlich diskutiert wird.',
        '💡 Du kennst selten die ganze Geschichte. Versuche deshalb auch die Sicht anderer zu verstehen.',
      ),
      optSegs('d', 'Sie möchte verhindern, dass der Streit noch größer wird.', 2,
        'Genau. Chioma möchte verhindern, dass der Streit noch größer wird. Außerdem versucht sie, zu vermeiden, dass Privates im Klassenchat landet.',
        '💡 Du kennst selten die ganze Geschichte. Versuche deshalb auch die Sicht anderer zu verstehen.',
      ),
    ],
    ['reflect-understand', 'fairness'],
  ),

  AF('s1e02c01_amy_feedback_chat_escalation', 's1e02c01_item_chat_escalation'),

  S('s1e02c01_story_dominik_private', [
    privateChat('Du', 'Dominik'),
    m(ch.dominik, 'Hey Bro.', '14:27'),
    m(ch.dominik, 'Endlich ist die raus.', '14:27'),
    m(ch.dominik, 'Man sieht sich.', '14:28'),
  ], ['talk-act']),

  inp('s1e02c01_input_dominik_reply', 'stories:s1e02.c01.input.dominikReply', {
    topics: ['talk-act'],
    promptSpeakerId: 'dominik',
  }),
]);

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 2 — Rausgeworfen
// ─────────────────────────────────────────────────────────────────────────────

const c02 = C('s1e02c02', 1, 'Amic 2', 'Rausgeworfen', [

  S('s1e02c02_story_yasmin_lisa_chioma', [
    privateChat('Yasmin', 'Lisa', 'Chioma'),
    m(ch.chioma, 'Was ging denn da ab? Jetzt habt ihr im Klassenchat jedenfalls Ruhe vor mir 😔', '14:42'),
    m(ch.yasmin, 'Ruhe vor dir? lol 😂 Da ist erst richtig Chaos ausgebrochen.', '14:43'),
    m(ch.lisa, 'Dominik hat jetzt auch noch Amir und Farida rausgeworfen. Und keiner weiß, warum.', '14:43'),
    m(ch.chioma, 'Warum hast du nichts gesagt?', '14:44'),
    m(ch.lisa, 'Dann werfen die mich doch auch raus. Und dann?', '14:44'),
    sysImg('/media/story/episodes/s1e02/s1e02c02_1-512.webp', 's1e02c02-img-01'),
  ], ['reflect-understand', 'talk-act', 'fairness']),

  S('s1e02c02_story_switch_to_amy', [
    amyChat(),
  ], ['reflect-understand', 'fairness']),

  IT('s1e02c02_item_lisa_intervene',
    'Lisa schreibt im Klassenchat nichts, obwohl sich einige unfair verhalten. Was würdest du in so einer Situation tun?',
    'responsibility',
    'intervene',
    [
      optSegs('a', 'Wenn andere beleidigen oder Fakes schicken, würde ich auch das Gleiche machen.', 0,
        'Wenn du so reagierst, wird der Streit im Chat eher noch stärker.',
        '💡 Bevor du etwas schreibst, frag dich: Hilft das gerade jemandem oder macht es den Streit vielleicht sogar größer?',
      ),
      optSegs('b', 'Ich würde mich raushalten, weil ich das Verhalten nicht gut finde und damit nichts zu tun haben will.', 2,
        'So wird der Streit zumindest nicht noch größer.',
        '💡 Bevor du etwas schreibst, frag dich: Hilft das gerade jemandem oder macht es den Streit vielleicht sogar größer?',
      ),
      optSegs('c', 'Ich würde sagen, dass das Verhalten nicht okay ist.', 3,
        'Je mehr Leute sich gegen das unfaire Verhalten stellen, desto leichter kann man den Chat wieder beruhigen.',
        'Das kostet Mut, weil du nicht weißt, wie die anderen reagieren.',
        '💡 Bevor du etwas schreibst, frag dich: Hilft das gerade jemandem oder macht es den Streit vielleicht sogar größer?',
      ),
      optSegs('d', 'Ich würde nichts schreiben, damit ich keinen Ärger bekomme.', 1,
        'Im Chat ändert sich nichts und das Chaos geht weiter.',
        '💡 Bevor du etwas schreibst, frag dich: Hilft das gerade jemandem oder macht es den Streit vielleicht sogar größer?',
      ),
    ],
    ['talk-act', 'fairness'],
  ),

  AF('s1e02c02_amy_feedback_lisa_intervene', 's1e02c02_item_lisa_intervene'),

  S('s1e02c02_story_after_item_private', [
    privateChat('Yasmin', 'Lisa', 'Chioma'),
    m(ch.lisa, 'Wer nicht im Klassenchat ist, kriegt absolut gar nichts mit. Ist voll außen vor.', '14:52'),
    m(ch.lisa, 'Oh, sorry. Das meinte ich nicht so.', '14:52'),
    m(ch.chioma, 'Verstehe.', '14:53'),
    m(ch.lisa, 'Bist du sauer auf mich?', '14:53'),
    m(ch.chioma, 'Nee, kannst ja nichts dafür.', '14:53'),
    m(ch.lisa, 'Ich find´s auch total doof alles! 😔', '14:54'),
    m(ch.lisa, '@ Yasmin: Und warum hast du im Klassenchat ausposaunt, dass ich dir von Dominiks Videos erzählt hab?', '14:54'),
    m(ch.yasmin, 'Hab ich doch gar nicht!', '14:55'),
    m(ch.lisa, 'Doch!', '14:55'),
    m(ch.yasmin, 'Und was hast du in dieser Zeit noch so getrieben? 😶 Soll ich dir auf die Sprünge helfen oder lieber nicht?', '14:55', { forwarded: { fromChatLabel: 'Klassenchat' } }),
    m(ch.yasmin, 'Das hätte ich auch selbst gesehen haben können. Du hast dich doch selbst verraten mit deinem „Yasmin, bitte!”', '14:56'),
    m(ch.lisa, 'Jetzt hacken sie alle auf mir rum.', '14:56'),
    m(ch.yasmin, 'Die haben wohl alle Schiss, dass du was ausplauderst. Haha 😂 Lisa-Tratschtante weiß einfach alles', '14:57'),
    m(ch.lisa, 'Ich find das gar nicht witzig 😔', '14:57'),
    m(ch.yasmin, 'Und, hast du wieder spannende Infos über jemanden?', '14:57'),
    m(ch.lisa, 'Lass mich bitte in Ruhe. Ich sag bestimmt nichts mehr! Außerdem erzählt mir eh niemand mehr irgendwas. 😢 Schon gar nicht Dominik.', '14:58'),
    m(ch.yasmin, 'Und wenn du ihn einfach auffliegen lässt?', '14:58'),
    m(ch.lisa, 'Quatsch! Das würd ich nie.', '14:58'),
    m(ch.lisa, 'Und Dominik und seine Leute posten jetzt auch noch ständig Fakes. Da weiß man doch eh nicht mehr, was man glauben kann 🤦‍♀️', '14:59'),
    img(ch.lisa, '/media/story/episodes/s1e02/s1e02c02_2-512.webp', '14:59', { forwarded: { fromChatLabel: 'Klassenchat' } }),
    m(ch.yasmin, 'Echt jetzt?? Ist ja krass!', '15:00'),
    m(ch.lisa, 'Quatsch, das Bild ist mit KI generiert. Die finden das witzig!', '15:00'),
    m(ch.chioma, 'Woher weißt du das?', '15:00'),
    m(ch.lisa, 'Hab kurz eine [[reverse-image-search]] gemacht. Bild hochladen, fertig. Das Original taucht in einem völlig anderen Kontext auf — hat mit unserer Schule null zu tun.', '15:01'),
    m(ch.chioma, 'Oder Dominik will von sich ablenken?', '15:01'),
    m(ch.yasmin, 'Komisch, unsere Klasse.', '15:01'),
    m(ch.lisa, 'Alles war irgendwie gut, bis dieser Klassenchat angefangen hat. Irgendwie denken manche, sie könnten jeden Müll dort abladen. Die einzige Regel im Klassenchat: Gehirn bleibt draußen 🙈', '15:02'),
  ], ['info-check', 'reflect-understand', 'talk-act', 'fairness']),

  S('s1e02c02_story_yasmin_diary_intro', [
    privateChat('Du', 'Yasmin'),
    m(ch.yasmin, 'Keine Ahnung, ob das irgendwie out ist? Aber ist mir echt egal! Wenn ich einen beschissenen Tag hatte, lieb ich mein Tagebuch einfach.', '15:06'),
    m(ch.yasmin, 'Naja, eigentlich nicht nur dann. Auch wenn´s voll toll war und so.', '15:06'),
    bonusLink('diary-yasmin-entry3', 'Tagebuch Yasmin – 3. Eintrag', '/diaries/diary_yasmin?entry=s1e02c02_0003', 'Eintrag öffnen →'),
    m(ch.yasmin, 'Hast du das auch schon mal versucht?', '15:07'),
  ], ['talk-act', 'reflect-understand']),

  inp('s1e02c02_input_yasmin_diary_reply', 'stories:s1e02.c02.input.yasminDiaryReply', {
    topics: ['talk-act', 'reflect-understand'],
    promptSpeakerId: 'yasmin',
  }),
]);

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 3 — Dazugehören
// ─────────────────────────────────────────────────────────────────────────────

const c03 = C('s1e02c03', 2, 'Amic 3', 'Dazugehören', [

  S('s1e02c03_story_jonas_chioma_private', [
    privateChat('Du', 'Jonas', 'Chioma'),
    sysImg('/media/story/episodes/s1e02/s1e02c03-512.webp', 's1e02c03-img-01'),
    m(ch.jonas, 'Hey Chioma 😊, ich wollte mal fragen, ob alles okay bei dir ist.', '15:30'),
    m(ch.chioma, 'Geht so. Ich wollte doch nur helfen.', '15:30'),
    m(ch.jonas, 'Manchen ist da echt nicht zu helfen. Die stehen irgendwie auf Chaos.', '15:31'),
    m(ch.chioma, 'Ich nicht.', '15:31'),
    m(ch.jonas, 'Ich auch nicht.', '15:31'),
    m(ch.jonas, 'Vielleicht ist es sogar gut, dass du da gerade raus bist.', '15:32'),
    m(ch.chioma, 'Ich weiß nicht…', '15:32'),
    m(ch.jonas, 'Ja, wirklich. Ich sag´s dir nicht gern, aber…', '15:32'),
    m(ch.jonas, 'Sie posten jetzt auch [[meme]]s über dich.', '15:33'),
    m(ch.jonas, '„Regel-Queen“ und so.', '15:33'),
    m(ch.chioma, 'Ernsthaft?', '15:33'),
    m(ch.jonas, 'Ja. Deshalb wollte ich dir sagen, dass ich da nicht mit mache.', '15:34'),
    m(ch.jonas, 'Und mal hören, wie es dir geht.', '15:34'),
    m(ch.chioma, 'Danke. Fühlt sich mies an.', '15:34'),
    m(ch.chioma, '🙈 Wieso fühlt es sich bloß so mies an, obwohl doch immer nur Streit ist!?', '15:35'),
    m(ch.jonas, 'Ich könnte mit den Jungs reden, wenn du willst.', '15:35'),
    m(ch.chioma, 'Und wenn ich das nächste Mal etwas schreibe, bin ich gleich wieder raus? Nein danke!', '15:36'),
    m(ch.chioma, 'Wenn ich einfach nur zurück in den Chat gehe, muss ich nach Dominiks Regeln spielen.', '15:36'),
    m(ch.chioma, 'Dann ändert sich gar nichts.', '15:37'),
  ], ['reflect-understand', 'talk-act', 'fairness']),

  S('s1e02c03_story_switch_to_amy', [
    amyChat(),
  ], ['reflect-understand', 'problem-solving']),

  IT('s1e02c03_item_chioma_self_regulation',
    'Chioma ist raus aus dem Klassenchat und fühlt sich machtlos. Was würdest du Chioma in dieser Situation raten?',
    'self_regulation',
    'regulate_emotions',
    [
      optSegs('a', 'Sie soll es einfach vergessen und sich denken: „Dann halt nicht. Ich hab keine Lust mehr auf den Chat.“', 0,
        'Wenn Chioma ihren Ärger ignoriert, kann sie die Situation für sich nicht verbessern.',
        '💡 Wenn dich etwas stört, überlege, was dir helfen würde und mache einen ersten Schritt. So entsteht Veränderung.',
      ),
      optSegs('b', 'Sie soll erstmal abwarten, ob sich die Situation von selbst beruhigt.', 1,
        'Abwarten kann helfen, um kurz durchzuatmen. Weiter kommt Chioma nur, wenn sie selbst aktiv wird.',
        '💡 Wenn dich etwas stört, überlege, was dir helfen würde und mache einen ersten Schritt. So entsteht Veränderung.',
      ),
      optSegs('c', 'Sie soll sich in Ruhe überlegen, was sie stört, und was ihr jetzt helfen würde.', 2,
        'Die Gedanken zu sortieren, ist ein wichtiger Schritt. Dann kann Chioma entscheiden, wie sie handeln möchte.',
        '💡 Wenn dich etwas stört, überlege, was dir helfen würde und mache einen ersten Schritt. So entsteht Veränderung.',
      ),
      optSegs('d', 'Sie soll überlegen, was sie ändern will, und einen Weg suchen, selbst etwas dafür zu tun.', 3,
        'Genau. Das gibt Chioma die Kontrolle zurück und sie verliert sich nicht in Gefühlen.',
        '💡 Wenn dich etwas stört, überlege, was dir helfen würde und mache einen ersten Schritt. So entsteht Veränderung.',
      ),
    ],
    ['reflect-understand', 'problem-solving'],
  ),

  AF('s1e02c03_amy_feedback_chioma_self_regulation', 's1e02c03_item_chioma_self_regulation'),

  S('s1e02c03_story_after_item_private', [
    privateChat('Jonas', 'Chioma'),
    m(ch.chioma, 'Schrecklich, nichts tun zu können 😔. Ich möchte wirklich etwas ändern!', '15:44'),
    m(ch.jonas, 'Hast du mal an die Schülerzeitung gedacht?', '15:44'),
    m(ch.chioma, 'Wieso?', '15:45'),
    m(ch.jonas, 'Es macht echt Spaß und man hat das Gefühl, nicht nur rumzusitzen.', '15:45'),
    m(ch.chioma, 'Meinst du echt?', '15:45'),
    m(ch.jonas, 'Klar. 😊', '15:46'),
    m(ch.jonas, 'Deine Weeklys gibst du uns doch eh schon. Komm doch mal mit zur Redaktion. Wir sitzen immer Dienstags zusammen.', '15:46'),
    m(ch.jonas, 'Hast du Lust?', '15:46'),
    m(ch.chioma, 'Ja, Lust hab ich schon.', '15:47'),
    m(ch.chioma, 'Aber was, wenn die jetzt auch sauer auf mich sind?', '15:47'),
  ], ['talk-act', 'problem-solving']),

  S('s1e02c03_story_amy_reflection_intro', [
    amyChat(),
  ], ['reflect-understand']),

  OR('s1e02c03_reflection_belonging',
    'Warum fühlt es sich für Chioma mies an, nicht mehr im Klassenchat zu sein – obwohl dort viel Streit ist?',
    {
      topics: ['reflect-understand'],
      category: 'PERSPECTIVE',
      bypassAi: true,
      fixedAmyReply: 'Dazugehören ist für viele wichtig. Aber du musst dich nicht verstellen, um dabei zu sein. Es gibt auch andere Orte, an denen man dazugehören kann.',
    },
  ),

  AR('s1e02c03_amy_reaction_belonging', 's1e02c03_reflection_belonging'),


]);

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 4 — Die Schülerzeitung
// ─────────────────────────────────────────────────────────────────────────────

const c04 = C('s1e02c04', 3, 'Amic 4', 'Die Schülerzeitung', [

  S('s1e02c04_story_student_newsroom', [
    privateChat('Carlos', 'Jonas', 'Chioma', 'Aylin'),
    sysImg('/media/story/episodes/s1e02/s1e02c04-512.webp', 's1e02c04-img-01'),
    m(ch.jonas, 'Hey Leute, ich hab Chioma auch mal eingeladen.', '12:05'),
    m(ch.carlos,'Geht klar 👍', '12:05'),
    m(ch.aylin, 'Bevor wir anfangen: Wir sind hier keine Bühne für persönliche Abrechnungen.', '12:06'),
    m(ch.chioma, 'Darum geht´s mir auch gar nicht.', '12:06'),
    m(ch.aylin, 'Das hoffe ich.', '12:06'),
    m(ch.carlos, 'Entspann dich. Man kennt Chioma doch sowieso schon von den Weeklys.', '12:06'),
    m(ch.aylin, 'Die Weeklys sind okay. Redaktion ist trotzdem etwas anderes.', '12:07'),
    m(ch.chioma, 'Aus Rachegelüsten bin ich nicht hier. Aber einfach den Mund verbieten lasse ich mir auch nicht.', '12:07'),
    m(ch.aylin, 'Das klingt fair. Wir brauchen unbedingt jemanden, der auch mal seinen Mund aufmacht!', '12:07'),
    m(ch.jonas, 'Carlos macht die Programmierung und Aylin die Grafik.', '12:08'),
    m(ch.jonas, 'Ich schreibe am liebsten nur über Musik. Für eine Schülerzeitung ist das nicht genug.', '12:08'),
    m(ch.aylin, 'Wenn wir niemanden für weitere Inhalte finden, verlangt Alvarez das noch von uns 🙄', '12:09'),
    m(ch.chioma, 'Herr Alvarez? Der Englisch-Lehrer, oder?', '12:09'),
    m(ch.aylin, 'Ja, super cool, ich weiß! Der leitet die Online-Schülerzeitung 😄', '12:09'),
    m(ch.chioma, 'Ach ja. Der ist echt total nett.', '12:10'),
    m(ch.aylin, 'Aber echt! Neulich hat er sogar hammer leckere Tapas mitgebracht! 😋', '12:10'),
    m(ch.carlos, 'Ist ja gut, Aylin, wir wissen, wie toll du ihn findest.', '12:10'),
    m(ch.aylin, 'Jedenfalls haben wir genug Leute am Start, die sich um Technik-Kram kümmern, aber es fehlen uns mehr Inhalte.', '12:11'),
    m(ch.chioma, 'Bin auf jeden Fall dabei 👍🏾', '12:11'),
    m(ch.chioma, 'Ich hab da schon so eine Idee…', '12:11'),
  ], ['problem-solving', 'talk-act', 'creative']),

  S('s1e02c04_story_switch_to_amy', [
    amyChat(),
  ], ['creative', 'talk-act']),

  OR('s1e02c04_reflection_own_contribution',
    'Chioma hat direkt eine Idee und will etwas beitragen. Und du? Was für einen Beitrag würdest du gern mal machen?',
    {
      topics: ['creative', 'talk-act'],
      category: 'ACTION',
      bypassAi: true,
      fixedAmyReply: 'Kreative Beiträge machen eine Schülerzeitung lebendig.',
    },
  ),

  AR('s1e02c04_amy_reaction_own_contribution', 's1e02c04_reflection_own_contribution'),

  S('s1e02c04_story_amy_challenge_intro', [
    privateChat('Amy'),
    m(ch.amy, 'Hast du Lust auf eine kleine Challenge?'),
  ], ['creative', 'problem-solving']),

  CH('s1e02c04_challenge_write_idea',
    '👉 Wenn du Lust hast, nimm dir gleich einen Block und einen Stift und setze deine Idee um.',
  ),

  S('s1e02c04_story_chioma_friendbook', [
    privateChat('Du', 'Chioma'),
    m(ch.chioma, '😄 Herr Alvarez, der Lieblingslehrer der ganzen Schule!', '12:18'),
    m(ch.chioma, '…hat in dein Freundebuch geschrieben 💪', '12:18'),
    bonusLink('char-alvarez', 'Charakterkarte Alvarez', '/cards/char-alvarez', 'Karte ansehen →'),
    m(ch.chioma, 'Hier der Link, viel Spaß!', '12:18'),
  ], ['talk-act']),
]);

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 5 — Die Debatte
// ─────────────────────────────────────────────────────────────────────────────

const c05 = C('s1e02c05', 4, 'Amic 5', 'Die Debatte', [

  S('s1e02c05_story_chioma_dominik', [
    privateChat('Chioma', 'Dominik'),
    sysImg('/media/story/episodes/s1e02/s1e02c05-512.webp', 's1e02c05-img-01'),
    m(ch.chioma, 'Du meinst also ein Klassenchat braucht keine Regeln❓', '13:02'),
    m(ch.dominik, 'Exakt! Meinungsfreiheit, logisch! Niemand will deine verdammten Regeln! 😤', '13:02'),
    m(ch.dominik, 'Regeln sind doch nur dafür da, Leute zu bremsen.', '13:03'),
    m(ch.dominik, 'Dann ist es doch kein echter Chat mehr.', '13:03'),
    m(ch.chioma, 'Kein echter Chat für wen?', '13:03'),
    m(ch.dominik, 'Für Leute, die halt sagen, was sie denken.', '13:04'),
    m(ch.chioma, 'Sonst ist es aber kein Chat mehr für die Anderen.', '13:04'),
    m(ch.dominik, 'Willst du jetzt diskutieren?', '13:04'),
    m(ch.chioma, 'Nicht jetzt. Aber morgen.', '13:05'),
    m(ch.dominik, 'Wozu? Niemand will deine Regeln!', '13:05'),
    m(ch.chioma, 'Bist du dir da so sicher?', '13:05'),
    m(ch.dominik, 'Logisch! 100%', '13:05'),
    m(ch.chioma, 'Dann hast du ja nichts zu verlieren. Lass uns das klären.', '13:06'),
    m(ch.dominik, '??', '13:06'),
    m(ch.chioma, 'Ein Gespräch zwischen dir und mir. Öffentlich. Die Schüler entscheiden.', '13:06'),
    m(ch.chioma, 'Gewinnst du, akzeptiere ich deine Gruppe. Gewinne ich, gelten Regeln.', '13:07'),
    m(ch.dominik, 'Lass das Gelaber! Du hast eh keine Chance 😂💀', '13:07'),
    m(ch.chioma, 'Na dann ist ja alles klar 😊', '13:07'),
    m(ch.dominik, 'Nichts ist klar. Auf so einen Dreck lass ich mich doch nicht ein.', '13:08'),
    m(ch.chioma, 'Oder hast du etwa Angst?', '13:08'),
    m(ch.dominik, 'Quatsch!', '13:08'),
    m(ch.chioma, 'Dann also morgen in der Freistunde, 10 Uhr vor Raum 116', '13:09'),
    audio(ch.chioma, '/media/story/episodes/s1e02/chiomas-sprachnachricht-s1e02c05.mp3', '13:10'),
    m(ch.dominik, 'Grrr', '13:09'),
  ], ['fairness', 'talk-act', 'problem-solving']),


  S('s1e02c05_story_lisa_forwarded', [
    divider('Später'),
    privateChat('Chioma', 'Lisa'),
    m(ch.lisa, 'Chioma will mit mir über Regeln labern 😂 Die hat doch zero chance! Klickt rein und voted für mich 🔥', '13:40', { forwarded: { fromChatLabel: 'Klassenchat', fromName: 'Dominik' } }),
    m(ch.lisa, 'Ich bring Popcorn mit! 😂🍿 Klare Sache, kannst auf mich zählen.', '13:40', { forwarded: { fromChatLabel: 'Klassenchat', fromName: 'Markus' } }),
    m(ch.lisa, 'Was hast du vor?', '13:41'),
    m(ch.lisa, 'Ich weiß nicht, ob das eine gute Idee ist. Glaubst du echt, du hast eine Chance gegen den?', '13:41'),
  ], ['reflect-understand', 'talk-act']),

  S('s1e02c05_story_amy_reflection', [
    amyChat(),
  ], ['reflect-understand', 'fairness']),

  OR('s1e02c05_reflection_both_sides',
    'Warum ist es wichtig, beide Seiten zu zeigen und nicht nur die eigene Meinung?',
    { topics: ['reflect-understand', 'fairness'], category: 'PERSPECTIVE' },
  ),

  AR('s1e02c05_amy_reaction_both_sides', 's1e02c05_reflection_both_sides'),

  S('s1e02c05_story_amy_tip', [
    m(ch.amy, 'Fair ist, wenn alle ihre Sicht sagen dürfen. Nur so kann man wirklich verstehen, worum es geht.', '13:46'),
  ], ['fairness', 'reflect-understand']),

  S('s1e02c05_story_chioma_friendbook_teaser', [
    privateChat('Du', 'Chioma'),
    m(ch.chioma, 'Hey {{chatName}}, cool dein Freundebuch. Soll ich vielleicht auch reinschreiben? Ich schicke dir die Seite, wenn wir uns das nächste Mal sehen.', '13:44'),
  ], ['talk-act']),
]);



// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 6 — Nicht allein
// ─────────────────────────────────────────────────────────────────────────────

const c06 = C('s1e02c06', 5, 'Amic 6', 'Nicht allein', [

  S('s1e02c06_story_chioma_user', [
    privateChat('Du', 'Chioma'),
    bonusLink('char-chioma', 'Charakterkarte Chioma', '/cards/char-chioma', 'Karte ansehen →'),
    m(ch.chioma, 'Hey {{chatName}}, ich hab die Seite ausgefüllt.', '14:02'),
    m(ch.chioma, 'Ich bin gerade echt nervös. Meinst du, ich krieg das alleine hin?', '14:03'),
  ], ['talk-act', 'reflect-understand']),

  inp('s1e02c06_input_chioma_nervous_reply', 'stories:s1e02.c06.input.chiomaNervousReply', {
    topics: ['talk-act', 'reflect-understand'],
    promptSpeakerId: 'chioma',
  }),

  S('s1e02c06_story_chioma_followup', [
    m(ch.chioma, 'Ich glaube, ich weih Carlos ein. Zusammen ist man einfach stärker.', '14:05'),
    m(ch.chioma, 'Hast du auch schon erlebt, dass etwas zusammen besser klappt als allein?', '14:05'),
  ], ['talk-act', 'reflect-understand']),

  inp('s1e02c06_input_together_better', 'stories:s1e02.c06.input.togetherBetter', {
    topics: ['talk-act', 'reflect-understand'],
    promptSpeakerId: 'chioma',
  }),

  S('s1e02c06_story_chioma_carlos', [
    privateChat('Chioma', 'Carlos'),
    sysImg('/media/story/episodes/s1e02/s1e02c06-512.webp', 's1e02c06-img-01'),
    m(ch.chioma, 'Carlos, ich brauche deine Hilfe! 🙏', '14:09'),
    m(ch.carlos, 'Worum geht\'s?', '14:09'),
    m(ch.chioma, 'Mein Artikel, ich möchte echt, dass er gut wird.', '14:09'),
    m(ch.carlos, 'Das kriegst du schon hin. Machst du wieder ein Weekly?', '14:10'),
    m(ch.chioma, 'Nein, ich möchte etwas Neues probieren.', '14:10'),
    m(ch.carlos, 'Was meinst du?', '14:10'),
    m(ch.chioma, 'Eine Debatte. Mit Dominik.', '14:11'),
    m(ch.carlos, 'Jetzt doch über Dominik? Ich dachte du bist nicht aus Rache zur Schülerzeitung gekommen. 🤔', '14:11'),
    m(ch.chioma, 'Ich möchte nicht ÜBER Dominik sprechen.', '14:11'),
    m(ch.chioma, 'Sondern MIT ihm.', '14:11'),
    m(ch.carlos, 'Du willst ihn interviewen?', '14:12'),
    m(ch.chioma, 'Nein.', '14:12'),
    m(ch.carlos, 'Diskussion?', '14:12'),
    m(ch.chioma, 'Auch nicht.', '14:12'),
    m(ch.chioma, 'Ich will BEIDE Seiten zeigen und die Schüler in einer Abstimmung entscheiden lassen.', '14:12'),
  ], ['problem-solving', 'talk-act', 'fairness']),

  S('s1e02c06_story_amy_challenge_intro', [
    privateChat('Amy'),
    m(ch.amy, 'Hast du Lust auf eine kleine Challenge?'),
  ], ['creative', 'problem-solving']),

  CH('s1e02c06_challenge_write_idea',
    '👉 Finde heute eine Meinung, die du nicht teilst. Suche einen guten Grund, den die andere Person haben könnte?',
  ),

  S('s1e02c06_story_chioma_carlos_followup', [
    privateChat('Chioma', 'Carlos'),
    sysImg('/media/story/episodes/s1e02/s1e02c06-512.webp', 's1e02c06-img-01'),
    m(ch.carlos, 'Jetzt bin ich gespannt.', '14:13'),
    m(ch.chioma, 'Das wollte ich hören 👍🏾.', '14:13'),
    m(ch.chioma, 'Morgen bin ich mit Dominik verabredet, um einen Audiobeitrag aufzunehmen. Dazu gibt\'s einen Meinungs-Check unter den Hörern. Wärst du dabei? Könntest du das aufnehmen? Und online stellen?', '14:13'),
    m(ch.carlos, 'Immer langsam. So viele Fragen auf einmal…', '14:14'),
    m(ch.chioma, 'Sorry 😉. Was hältst du davon?', '14:14'),
    m(ch.chioma, 'In einem Chat ohne Regeln gewinnt der Lautere, der Fiesere, der Admin, der andere rauswerfen kann.', '14:14'),
    m(ch.chioma, 'In einem Gespräch muss jeder dem anderen zuhören.', '14:15'),
    m(ch.carlos, 'Du willst das Spielfeld ändern 🤔', '14:15'),
    m(ch.chioma, 'Genau.', '14:13'),
    m(ch.carlos, 'Nicht schlecht.', '14:13'),
    m(ch.carlos, 'Aber nur damit das klar ist ⚠️', '14:14'),
    m(ch.carlos, 'Sobald das online ist, können wir es nicht einfach wieder zurückholen.', '14:14'),
  ], ['problem-solving', 'talk-act', 'fairness']),

  S('s1e02c06_story_switch_to_amy', [
    amyChat(),
  ], ['reflect-understand', 'fairness']),

  IT('s1e02c06_item_audio_decision',
    'Chioma weiß: Wenn der Audiobeitrag online geht, hört ihn die ganze Schule. Und wenn es schiefgeht, kann man ihn nicht einfach zurückholen. Wie hättest du in dieser Situation entschieden?',
    'responsibility',
    'take_responsibility',
    [
      optSegs('a', 'Ich hätte mich schon vorher der Stimmung im Klassenchat angepasst, damit ich nicht selbst rausfliege. Einen öffentlichen Audiobeitrag würde ich deshalb gar nicht erst machen.', 0,
        'Das schützt dich davor, selbst in den Fokus zu geraten. Gleichzeitig bleibt das Verhalten im Chat unfair.',
        '💡 Die eigene Sicherheit ist wichtig. Überleg dir trotzdem, ob du das wirklich so stehen lassen oder ob du einen eigenen Standpunkt einnehmen willst.',
      ),
      optSegs('b', 'Ich würde keinen zusätzlichen Ärger wollen und den Audiobeitrag lieber nicht veröffentlichen.', 1,
        'Damit bleibst du auf der sicheren Seite. Gleichzeitig tut erstmal niemand etwas gegen das unfaire Verhalten im Chat.',
        '💡 Die eigene Sicherheit ist wichtig. Du kannst trotzdem überlegen, wie du etwas beitragen kannst, ohne dich zu überfordern.',
      ),
      optSegs('c', 'Ich würde etwas gegen das unfaire Verhalten im Chat tun wollen, aber nicht mit einem öffentlichen Audiobeitrag.', 3,
        'Gut so. Du willst etwas verändern und suchst einen eigenen kreativen Weg.',
        '💡 Wenn dir etwas wichtig ist, steh dafür ein. So entsteht echte Veränderung.',
      ),
      optSegs('d', 'Ich würde den Audiobeitrag veröffentlichen, obwohl es riskant ist. Dieses unfaire Verhalten im Chat darf nicht weitergehen.', 3,
        'Gut so. Du tust etwas, um das unfaire Verhalten zu stoppen und gibst anderen die Chance, sich auch zu äußern.',
        '💡 Wenn dir etwas wichtig ist, steh dafür ein. So entsteht echte Veränderung.',
      ),
    ],
    ['reflect-understand', 'fairness', 'problem-solving'],
  ),

  AF('s1e02c06_amy_feedback_audio_decision', 's1e02c06_item_audio_decision'),

  S('s1e02c06_story_resolution_private', [
    privateChat('Chioma', 'Carlos'),
    m(ch.chioma, 'Ich weiß 🙂', '14:20'),
    m(ch.carlos, 'Nein, ich meine ernsthaft.', '14:20'),
    m(ch.carlos, 'Das hören nicht nur deine Freunde. Das hören alle.', '14:20'),
    m(ch.carlos, 'Und wenn es kippt, kriegen es alle mit.', '14:21'),
    m(ch.chioma, 'Genau deshalb.', '14:21'),
    m(ch.chioma, 'Wenn es kippt, sehen es alle.', '14:21'),
    m(ch.carlos, 'Entiendo. Ich verstehe.', '14:22'),
    m(ch.chioma, 'Und?', '14:22'),
    m(ch.carlos, 'Klingt spannend!', '14:22'),
    m(ch.chioma, 'Das heißt?', '14:22'),
    m(ch.carlos, 'Ich bin dabei 🙂', '14:23'),
    bonusLink('tip-carlos-audio-howto', 'Artikel Audiobeiträge erstellen', '/newspaper/tip-carlos-audio-howto', 'Artikel öffnen →'),
  ], ['problem-solving', 'talk-act']),
]);

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 7 — Der Beitrag geht live
// ─────────────────────────────────────────────────────────────────────────────

const c07 = C('s1e02c07', 6, 'Amic 7', 'Der Beitrag geht live', [

  S('s1e02c07_story_carlos_dominik_chioma', [
    privateChat('Du', 'Carlos', 'Dominik', 'Chioma'),
    sysImg('/media/story/episodes/s1e02/s1e02c07-512.webp', 's1e02c07-img-01'),
    m(ch.carlos, 'Ich hab den Beitrag fertig geschnitten.', '14:30', {
  reactions: [R('🙏')],
}),
m(ch.carlos, 'Hier der Audiobeitrag „Regeln im Klassenchat?”', '14:31'),
audio(ch.carlos, 'media/newspaper/articles/chatrules-chioma-dominik/audio.mp3', '14:31', 'Audiobeitrag'),
    m(ch.carlos, '@Chioma: Dann kannst du noch die Anmoderation dazu schreiben, wenn du magst.', '14:31'),
    m(ch.dominik, 'Anmoderation?', '14:31'),
    m(ch.carlos, 'Ja, den Teaser, die Einleitung.', '14:31'),
    m(ch.chioma, 'Ist gut, mach ich. 🙂', '14:31'),
    m(ch.chioma, 'Ja.', '14:32'),
    m(ch.dominik, 'Klar, das wird easy. Ey Chioma, das wird maximal cringe für dich 🤣', '14:32'),
    m(ch.dominik, 'Und, wann geht das live?', '14:33'),
    m(ch.carlos, 'Morgen, Punkt 15:00 Uhr wird alles freigeschaltet.', '14:33'),
    sysMsg('Dominik hat den Chat verlassen.', '14:34'),

    m(ch.chioma, 'Was, wenn mich morgen alle auslachen?', '14:36'),
  ], ['talk-act', 'problem-solving', 'fairness']),


  GR('s1e02c07_reflection_rules_or_no_rules',
    'Was findest du wichtiger in einem Klassenchat?',
    [
      rc('a', 'Dass alle sagen können, was sie denken – ohne Regeln.',
      ),
      rc('b', 'Dass es klare Regeln gibt, damit alle respektvoll behandelt werden.',
      ),
      rc('c', 'Ich bin mir nicht sicher.',
      ),
    ],
    { topics: ['fairness', 'reflect-understand'] },
  ),

  OR('s1e02c07_reflection_rules_why',
    'Warum?',
    {
      topics: ['reflect-understand', 'fairness'],
      category: 'PERSPECTIVE',
      bypassAi: true,
      fixedAmyReply: 'Gute Regeln schützen alle — und sie helfen, dass sich niemand ausgeschlossen fühlt.',
      fixedAmyReplyVague: 'Magst du noch einen Satz dazu schreiben?',
    },
  ),

  AR('s1e02c07_amy_reaction_rules_why', 's1e02c07_reflection_rules_why'),

  S('s1e02c07_story_amy_wrapup', [
    m(ch.amy, 'Gute Regeln sollen schützen, nicht nerven. Und dabei helfen, dass sich niemand ausgeschlossen fühlt.', '14:41'),
  ], ['fairness', 'reflect-understand']),
]);

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 8 — Regeln gelten auch hier
// ─────────────────────────────────────────────────────────────────────────────

const c08 = C('s1e02c08', 7, 'Amic 8', 'Regeln gelten auch hier', [

  S('s1e02c08_story_student_newsroom_rule_conflict', [
    privateChat('Du', 'Jonas', 'Carlos', 'Aylin', 'Chioma'),
    sysImg('/media/story/episodes/s1e02/s1e02c08-512.webp', 's1e02c08-img-01'),
    m(ch.aylin, 'War doch eine super Redaktionssitzung 🤩', '14:46', { reactions: [R('👍')] }),
    m(ch.aylin, 'Die neueste Ausgabe steht.', '14:46', { reactions: [R('👍')] }),
    m(ch.aylin, 'Bestätigt nur noch kurz, dass Alvarez sein ok für eure Artikel gegeben hat. Und dann geht die neue Ausgabe um Punkt 15 Uhr online 🚀', '14:47'),
    m(ch.aylin, '📋 Bitte abhaken, wenn ihr Alvarez´ Bestätigung eingeholt habt: ☐ Carlos  ☐ Jonas  ☐ Chioma', '14:47'),
    m(ch.chioma, 'Warte mal. Ok von Herrn Alvarez? 🤔', '14:48'),
    m(ch.aylin, 'Ja, natürlich.', '14:48'),
    m(ch.carlos, 'Alvarez muss jeden Artikel absegnen, bevor wir ihn veröffentlichen dürfen.', '14:48'),
    m(ch.chioma, 'Okay…', '14:49'),
    m(ch.chioma, 'Muss das unbedingt vorher sein?', '14:49'),
    m(ch.aylin, 'Ja, sicher.', '14:49'),
    m(ch.aylin, 'Carlos, hast du Chioma nicht gefragt, als sie dir den Teaser geschickt hat?', '14:49'),
    m(ch.carlos, 'Ich dachte, das wär klar. Ist doch Regel Nummer 2: „Jeder Artikel muss vor der Veröffentlichung genehmigt werden.”', '14:50'),
    m(ch.chioma, 'Und was ist Regel Nummer 1?', '14:50'),
    m(ch.carlos, 'Auf dem großen Wandplakat steht´s: „Keine [[fake-news]]!”', '14:50'),
    m(ch.carlos, 'Ohne Regeln müssten wir alles jedes Mal neu ausdiskutieren.', '14:51'),
    m(ch.chioma, 'Das leuchtet ein. Aber…', '14:51'),
    m(ch.aylin, 'So können wir das leider nicht veröffentlichen, tut mir leid. Aber dein Artikel kann ja in die Ausgabe vom nächsten Monat', '14:52'),
    m(ch.chioma, 'Was?? Das ist noch viel zu lange hin. Könnt ihr nicht noch bis morgen mit der Veröffentlichung warten? 🙏', '14:52'),
    m(ch.aylin, 'Das geht leider nicht. Sorry!', '14:53'),
    m(ch.aylin, 'Worüber ist dein Artikel eigentlich, Chioma?', '14:53'),
    m(ch.chioma, 'Em…', '14:53'),
    m(ch.chioma, 'Regeln im Klassenchat', '14:54'),
    m(ch.aylin, 'Hm 🤔 Das ist… interessant.', '14:54'),
  ], ['reflect-understand', 'fairness', 'problem-solving']),

  S('s1e02c08_story_switch_to_amy', [
    amyChat(),
  ], ['reflect-understand', 'fairness']),

  IT('s1e02c08_item_goal_conflict',
    'Chioma hat sich so viel Mühe gegeben und jetzt das. Was macht die Situation für Chioma gerade so schwierig?',
    'perspective',
    'goal_conflicts',
    [
      optSegs('a', 'Carlos hat Chioma nichts von den Regeln gesagt. Deshalb ist sie jetzt sauer auf ihn.', 0,
        'Das erklärt das eigentliche Problem noch nicht: Chioma will ihren Beitrag in dieser Ausgabe veröffentlichen, darf es aber wegen der Regeln nicht.',
        '💡 Solche Momente gibt es oft. Dann kommt es im nächsten Schritt darauf an, wie du damit umgehst.',
      ),
      optSegs('b', 'Chioma hat sich so viel Mühe gegeben, aber der Beitrag muss erst freigegeben werden.', 1,
        'Das stimmt, aber das allein macht die Situation noch nicht so schwierig. Chioma will ihren Beitrag jetzt veröffentlichen, darf es aber wegen der Regeln nicht.',
        '💡 Solche Momente gibt es oft. Dann kommt es im nächsten Schritt darauf an, wie du damit umgehst.',
      ),
      optSegs('c', 'Chioma möchte den Beitrag veröffentlichen und kann nicht bis zur nächsten Ausgabe warten.', 2,
        'Du erkennst einen Teil des Problems. Sie möchte den Beitrag sofort veröffentlichen, darf es aber wegen der Regeln nicht.',
        '💡 Solche Momente gibt es oft. Dann kommt es im nächsten Schritt darauf an, wie du damit umgehst.',
      ),
      optSegs('d', 'Chioma möchte ihren Beitrag sofort veröffentlichen, aber gleichzeitig gelten Regeln für alle. Beides passt gerade nicht zusammen.', 3,
        'Du erkennst den Kern: Chiomas Wunsch und die Regeln passen gerade nicht zusammen.',
        '💡 Solche Momente gibt es oft. Dann kommt es im nächsten Schritt darauf an, wie du damit umgehst.',
      ),
    ],
    ['reflect-understand', 'fairness', 'problem-solving'],
  ),

  AF('s1e02c08_amy_feedback_goal_conflict', 's1e02c08_item_goal_conflict'),

  S('s1e02c08_story_amy_input_intro', [
    amyChat(),
    m(ch.amy, 'Wie fühlt sich Chioma gerade? Wenn du Lust hast, wähle 3 Emojis aus, die ihre Stimmung beschreiben.', '14:58'),
  ], ['reflect-understand']),
  inp('s1e02c08_input_chioma_emojis', 'stories:s1e02.c08.input.chiomaEmojis', {
    topics: ['reflect-understand'], promptSpeakerId: 'chioma',
  }),
]);

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 9 — Die Lösung mit dem Platzhalter
// ─────────────────────────────────────────────────────────────────────────────

const c09 = C('s1e02c09', 8, 'Amic 9', 'Die Lösung mit dem Platzhalter', [

  S('s1e02c09_story_carlos_chioma_problem', [
    privateChat('Du', 'Carlos', 'Chioma'),
    sysImg('/media/story/episodes/s1e02/s1e02c09-512.webp', 's1e02c09-img-01'),
    m(ch.chioma, 'Das ist kaum auszuhalten. Herr Alvarez antwortet einfach nicht. Ich hab´s schon so oft probiert 🙈😳', '14:40'),
    m(ch.carlos, 'Er ist bei einer Konferenz, das kannst du vergessen.', '14:40'),
    m(ch.chioma, 'Verdammt! Das war so wichtig für mich! Kannst du nicht vielleicht doch…?', '14:41'),
  ], ['problem-solving', 'reflect-understand']),

  S('s1e02c09_story_switch_to_amy', [
    amyChat(),
  ], ['reflect-understand', 'problem-solving']),

  IT('s1e02c09_item_rules_and_solution',
    'Wir haben schon erkannt, dass Chioma Regeln im Weg stehen. Wie würdest du mit den Regeln umgehen?',
    'responsibility',
    'take_responsibility',
    [
      optSegs('a', 'Mir wären die Regeln in diesem Fall egal. Hauptsache, der Beitrag kommt rechtzeitig raus.', 0,
        'Auch wenn du gute Gründe hast: So kannst du anderen schaden oder selbst Ärger bekommen.',
        '💡 Ein gutes Ergebnis zählt, aber der Weg dorthin ist genauso wichtig.',
      ),
      optSegs('b', 'Ich weiß nicht.', 1,
        'Auch wenn es gute Gründe gibt: Wer Regeln bricht, kann anderen schaden oder selbst Ärger bekommen.',
        '💡 Ein gutes Ergebnis zählt, aber der Weg dorthin ist genauso wichtig.',
      ),
      optSegs('c', 'Ich würde mich an die Regeln halten und den Beitrag erst später veröffentlichen, auch wenn es nervt.', 2,
        'Es ist richtig, dass du dich an die Regeln hältst.',
        '💡 Regeln geben Orientierung. Manchmal lohnt es sich zusätzlich, nach einer alternativen Lösung zu suchen.',
      ),
      optSegs('d', 'Ich würde überlegen, wie ich das Problem lösen kann, ohne die Regeln zu brechen.', 3,
        'Du suchst aktiv nach einer Lösung, die funktioniert und respektierst gleichzeitig die Regeln.',
        '💡 Wenn etwas wichtig ist, such einen Weg, der funktioniert – ohne andere dabei zu übergehen.',
      ),
    ],
    ['reflect-understand', 'problem-solving', 'fairness'],
  ),

  AF('s1e02c09_amy_feedback_rules_and_solution', 's1e02c09_item_rules_and_solution'),

  S('s1e02c09_story_placeholder_solution', [
    privateChat('Du', 'Carlos', 'Chioma'),
    m(ch.carlos, 'Dein Beitrag ist echt gut. Endlich mal was Ehrliches, die ganze Schule würde das hören! Ich will auch nicht einen Monat warten, dann ist das Schnee von gestern.', '14:50'),
    m(ch.carlos, 'Aber wenn ich den einfach ohne Genehmigung hochlade, bin ICH dran.', '14:50'),
    m(ch.chioma, 'Könntest du mir etwas mehr Zeit geben? Ausnahmsweise? 🙏', '14:51'),
    m(ch.carlos, 'Der Upload ist um 15:00 Uhr - automatisch 😬', '14:51'),
    m(ch.carlos, 'Dann wird an alle Schüler der [[newsletter]] mit der frischen Ausgabe verschickt. Wenn wir deinen Beitrag nachträglich hochladen, erscheint er nicht im Newsletter.', '14:52'),
    divider('…'),
    m(ch.carlos, 'Ich muss los. Sorry.', '14:53'),
    m(ch.chioma, 'Warte', '14:53'),
    m(ch.chioma, 'Ich hab eine Idee!', '14:53'),
    m(ch.carlos, 'Chioma, akzeptier doch, dass es nicht mehr geht.', '14:54'),
    m(ch.chioma, 'Vielleicht doch!', '14:54'),
    m(ch.carlos, '?', '14:54'),
    m(ch.chioma, 'Tu doch einfach so, als wäre der Beitrag schon da.', '14:54'),
    m(ch.carlos, 'Hä, was? 👀', '14:54'),
    m(ch.chioma, 'Ja, du erstellst schon die Seite, auf der der Artikel mit dem Audiobeitrag erscheinen wird.', '14:55'),
    m(ch.carlos, 'Wie bitte? Warum sollte ich das tun?', '14:55'),
    m(ch.chioma, 'Damit du im Newsletter schon den richtigen Link setzen kannst 😊', '14:55'),
    m(ch.carlos, 'Entiendo. Ich verstehe 💡 Du meinst, da steht nur ein Platzhalter! Und sobald die Freigabe da ist…', '14:56'),
    m(ch.chioma, 'Tauschen wir den Platzhalter gegen den richtigen Einleitungstext und das Audio aus 😊', '14:56'),
    m(ch.carlos, 'Ja, das könnte klappen.', '14:56'),
    m(ch.chioma, 'Ich schreib schnell einen Platzhalter-Text.', '14:56'),
    m(ch.carlos, 'Es ist schon fast 3 Uhr, beeil dich! Ich bereite die Artikel-Verlinkung vor.', '14:57'),
    m(ch.carlos, 'Hast du´s?', '14:57'),
    m(ch.chioma, 'Fast.', '14:57'),
    m(ch.carlos, 'Beeil dich!', '14:58'),
    m(ch.chioma, '„Hallo Leute, hier findet ihr in Kürze die Debatte „Regeln im Klassenchat”. Wir warten noch auf die Freigabe. Bitte habt bis dahin Geduld. Danke für euer Verständnis.”', '14:58'),
    m(ch.carlos, 'Grrr, abgestürzt.', '14:59'),
    m(ch.chioma, 'Waaaas??', '14:59'),
    m(ch.carlos, 'Reingelegt 😊 Listo!', '15:00'),
    m(ch.chioma, 'Yay! 🥳', '15:00'),
    m(ch.carlos, 'Freu dich nicht zu früh! Jetzt darf uns Alvarez nicht noch für diese Aktion den Kopf abreißen!', '15:00', {
      reactions: [R('😬')],
    }),
    m(ch.carlos, '@{{chatName}}, hoffentlich geht das gut.', '15:01'),
    m(ch.carlos, 'Ich habe hier auch noch die Freundebuchseite für dich ausgefüllt', '15:01'),
    bonusLink('char-carlos', 'Charakterkarte Carlos', '/cards/char-carlos', 'Karte ansehen →'),
  ], ['problem-solving', 'talk-act', 'fairness']),
]);

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 10 — Wirkung
// ─────────────────────────────────────────────────────────────────────────────

const c10 = C('s1e02c10', 9, 'Amic 10', 'Wirkung', [

  S('s1e02c10_story_classchat_result', [
    classChat(),
    sysImg('/media/story/episodes/s1e02/s1e02c10-512.webp', 's1e02c10-img-01'),
    m(ch.dominik, 'Wow. 58 %. Glückwunsch. Demokratie und so 🙄 Wer hätte gedacht, dass hier so viele Verräter sitzen?!', '15:38'),
    m(ch.jonas, 'Glückwunsch, Chioma, tolles Interview! Wie hast du´s doch noch rechtzeitig geschafft?', '15:39'),
    m(ch.chioma, 'Naja, gaaanz rechtzeitig nicht. Aber ich hab auf Herrn Alvaro vor der Konferenz gewartet und er hat sein Okay gleich gegeben. Weil die Verlinkung schon im Newsletter war, konnte Carlos gegen halb vier den Beitrag ganz offiziell veröffentlichen 😊', '15:39'),
    m(ch.aylin, 'Und Alvarez war nicht sauer?', '15:40'),
    m(ch.chioma, 'Nein. Er hat gesagt, wir hätten das „geschickt gelöst, ohne gegen die Regeln zu verstoßen”.', '15:40'),
    m(ch.dominik, 'Haha, der war stark - Als würde die Regelqueen je gegen Regeln verstoßen.', '15:41'),
    m(ch.chioma, 'Ich? Niemals.', '15:41'),
    m(ch.dominik, '🙄', '15:41'),
    m(ch.tom, 'Wovon sprecht ihr eigentlich?', '15:42'),
    m(ch.finn, 'typisch! hattest du dein handy wieder nicht am start?', '15:42'),
    m(ch.tom, 'Nee. Wieso, was war?', '15:42'),
    m(ch.finn, 'Hör selbst: „Regeln im Klassenchat?"', '15:43'),
audio(ch.carlos, 'media/newspaper/articles/chatrules-chioma-dominik/audio.mp3', '15:43', 'Audiobeitrag'),
    //divider('…'),
    m(ch.tom, 'Respekt! Klare Sache.', '15:44'),
    m(ch.dominik, 'Grrr. Und dein hauchdünner Vorsprung heißt jetzt, ich darf nicht mehr schreiben, was ich will?', '15:44'),
    m(ch.chioma, 'Niemand wird gezwungen, hier zu bleiben. Aber wer bleibt, hält sich dran.', '15:45'),
    m(ch.dominik, 'Hält sich woran??', '15:45'),
    m(ch.chioma, 'An das, was wir gemeinsam abstimmen.', '15:45'),
  ], ['fairness', 'talk-act', 'problem-solving']),

  S('s1e02c10_story_student_newsroom_aftermath', [
    privateChat('Jonas', 'Carlos', 'Aylin', 'Chioma'),
    m(ch.jonas, 'Es hat geklappt 🥳', '16:02'),
    m(ch.aylin, 'Und Chioma? Fühlt es sich gut an? Dein erster Beitrag gleich so eine Wirkung!', '16:02'),
    m(ch.chioma, 'Ja kaum zu glauben. Genial!!', '16:03'),
    m(ch.chioma, '… Aber auch komisch.', '16:03'),
    m(ch.jonas, 'Wieso? 🤔', '16:03'),
    m(ch.chioma, 'Weil Regeln nur helfen, wenn man sich auch dran hält.', '16:04'),
    m(ch.chioma, 'Ich glaub, das hier war erst der Anfang…', '16:04'),
  ], ['reflect-understand', 'talk-act', 'fairness']),

  OR('s1e02c10_reflection_classchat_values',
    'Jetzt, wo du die Geschichte gelesen hast: Was wäre dir in einem Klassenchat besonders wichtig?',
    {
      topics: ['reflect-understand', 'fairness', 'talk-act'],
      category: 'PERSPECTIVE',
      bypassAi: true,
      fixedAmyReply: 'Ein guter Chat entsteht nicht von allein. Es kommt darauf an, wie die User miteinander umgehen und was sie gemeinsam vereinbaren.',
    },
  ),

  AR('s1e02c10_amy_reaction_classchat_values', 's1e02c10_reflection_classchat_values'),

  S('s1e02c10_story_amy_wrapup_article', [
    m(ch.amy, '👉 Schau dir gern Chiomas Vorschlag an und überlege, was dir davon wichtig wäre.', '16:08'),
    audio(ch.chioma, '/media/story/episodes/s1e02/chiomas-sprachnachricht-s1e02c10.mp3', '15:46'),
    bonusLink('tip-chioma-groupchats', 'Chiomas Anleitung für Gruppenchats', '/newspaper/tip-chioma-groupchats', 'Artikel öffnen →'),
  ], ['fairness', 'reflect-understand']),

  S('s1e02c10_story_cliffhanger', [
    divider('Cliffhanger'),
    privateChat('Du', 'Tom', 'Mia'),
    m(ch.tom, 'Hast du mal gesehen, bis wann Finn nachts online ist? 🤔', '07:20'),
    m(ch.mia, 'kp. Er war doch schon immer Gamer und so', '07:21'),
    m(ch.tom, 'Aber nicht so..', '07:21'),
    m(ch.tom, 'Irgendwas ist anders.', '07:22'),
  ], ['reflect-understand']),
]);

// ─────────────────────────────────────────────────────────────────────────────
// EPISODE
// ─────────────────────────────────────────────────────────────────────────────

const s1e02De: StoryEpisodeV02 = {
  id: 's1e02',
  seasonId: 's1',
  episodeId: 's1e02',
  courseId: 's1e02',
  chapters: [c01, c02, c03, c04, c05, c06, c07, c08, c09, c10],
};

export default s1e02De;