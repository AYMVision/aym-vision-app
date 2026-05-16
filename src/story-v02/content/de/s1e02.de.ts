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
    privateChat('Du', 'Lisa', 'Yasmin', 'Chioma'),
    m(ch.yasmin, 'Und? Sag schon: Was gibt’s Neues aus der Gerüchteküche?', '07:12'),
    m(ch.lisa, 'Kann gerade echt nicht 🙈 bin schon auf dem Weg zum Sushi.', '07:13'),
    m(ch.lisa, 'Das mit Dominik heute Morgen hab ich dir ja schon erzählt.', '07:13'),
  ], ['reflect-understand', 'talk-act']),

  S('s1e02c01_story_chioma_private', [
    privateChat('Du', 'Chioma'),
    m(ch.chioma, 'Yasmin und Lisa sind ja echt nett. Aber dass sie immer auf der Jagd nach Updates und Insidern sind 🙄🤦🏾‍♀️', '07:15'),
    m(ch.chioma, 'Gibt es sowas in deiner Klasse auch?', '07:15'),
  ], ['reflect-understand', 'talk-act']),

  inp('s1e02c01_input_chioma_gossip_reply', 'stories:s1e02.c01.input.chiomaGossipReply', {
    topics: ['talk-act'],
    promptSpeakerId: 'chioma',
  }),

  S('s1e02c01_story_classchat_escalation', [
    classChat(),
    m(ch.mia, 'Boah, Sport war heute echt lame.', '09:41'),
    m(ch.finn, 'ich fand’s eigentlich ganz okay 😅 jeder hat halt sein ding gemacht.', '09:41'),
    m(ch.dominik, 'Kein Wunder 😂 Mit Volleyball-Nieten wie Yasmin im Team kann ja nix laufen.', '09:42'),
    m(ch.markus, 'lol 😂😂😂', '09:42'),
    m(ch.dominik, 'Sie kennt nicht mal die Basics!! 🤦‍♂️ Digga, dass man den Ball nicht zweimal hintereinander berühren darf, weiß doch jeder.', '09:42'),
    m(ch.elsa, '🤣🙈', '09:43'),
    m(ch.yasmin, 'Mir sind deine Regeln gerade echt egal!! 🙄🔥', '09:43'),
    m(ch.dominik, 'Bro, geht’s noch?? 😂 Ohne Regeln kein Sport, logisch!! Dann chill halt auf der Bank, du Loser 💀💀', '09:43'),
    m(ch.yasmin, 'Ey, ich warne dich jetzt echt! 😤😤', '09:44'),
    m(ch.yasmin, 'Und was hast du eigentlich in der Zeit gemacht? 😶 Soll ich dir auf die Sprünge helfen oder lieber nicht?', '09:44'),
    m(ch.finn, 'hä?', '09:44'),
    m(ch.mia, 'Ey, worum geht’s hier eigentlich?', '09:45'),
    m(ch.dominik, '@Yasmin Bro, was soll das denn jetzt heißen??', '09:45'),
    m(ch.lisa, 'Yasmin, bitte! 😕', '09:45'),
    m(ch.dominik, 'Lisa? Hast du…?', '09:46'),
    m(ch.yasmin, '[[omg]], war doch nur Spaß 😂✨😂✨', '09:46'),
    m(ch.dominik, 'Spaß??', '09:46'),
    m(ch.dominik, 'Willst du mir grad drohen, oder was?', '09:46'),
    m(ch.dominik, 'Ey, haltet mal alle die Klappe jetzt!', '09:47'),
    m(ch.lisa, 'Ganz ehrlich, ich hab wirklich nichts gesagt 😳', '09:47'),
    m(ch.chioma, 'Kurze Frage: Was passiert hier gerade?', '09:47'),
    m(ch.chioma, 'Wollt ihr das wirklich hier im Klassenchat ausrollen? Privat wäre fairer.', '09:48'),
    m(ch.dominik, 'Willst du mir jetzt den Mund verbieten, Digga?', '09:48'),
    m(ch.igor, 'Ey Dominik, lass gut sein.', '09:48'),
    m(ch.dominik, 'Yasmin ist doch die, die hier rumdroht!!! 🔥🔥🔥 Und Verräter sollten echt aufpassen, no cap.', '09:49'),
    m(ch.markus, 'Genau 👍', '09:49'),
    m(ch.yasmin, 'Ey, lass es jetzt einfach 🙄', '09:49'),
    m(ch.mia, 'Ich check hier grad gar nichts mehr.', '09:49'),
    sysImg('/media/story/episodes/s1e02/s1e02c01-512.webp', 's1e02c01-img-01'),
    m(ch.chioma, 'Okay, kurze Pause.', '09:50'),
    m(ch.dominik, 'Hä? Wer hat dich überhaupt gefragt?', '09:50'),
    m(ch.chioma, 'Es gibt offenbar etwas, das nicht öffentlich sein soll. Dann gehört es doch nicht in den Klassenchat, oder?', '09:50'),
    m(ch.dominik, 'Und du bist bitte wer? 😂 Polizei 🚨 oder Frau Lehrerin 🤓 oder was? 😂', '09:51'),
    m(ch.mia, 'Naja… mich würde schon interessieren, was Yasmin eigentlich meint.', '09:51'),
    m(ch.chioma, 'So kommen wir nicht weiter. Wie gehen wir jetzt damit um?', '09:51'),
    m(ch.dominik, 'So ’ne Spaßbremse braucht hier echt keiner. Du bist raus 💀', '09:52'),
    m(ch.markus, 'Stimmt 😅', '09:52'),
    sysMsg('Dominik hat Chioma entfernt.', '09:52'),
    bonusLink('char-dominik', 'Charakterkarte Dominik', '/cards/char-dominik', 'Karte ansehen →'),
  ], ['reflect-understand', 'talk-act', 'fairness']),

  S('s1e02c01_story_switch_to_amy', [
    amyChat(),
  ], ['reflect-understand']),

  IT('s1e02c01_item_chat_escalation',
    'Was passiert hier gerade im Chat?',
    'perspective',
    'perspectives_recognize',
    [
      optSegs('a', 'Die Klasse liest mit und viele reagieren. Der Streit breitet sich aus.', 3,
        'Du siehst, dass hier nicht nur zwei streiten. Viele lesen mit und reagieren – so wird der Streit schnell größer.',
        '👉 Dadurch wird es für alle im Chat spürbar, auch für die, die gar nichts schreiben.',
        '💡 Wenn viele mitlesen und reagieren, kann sich ein Streit schnell ausbreiten. Ich empfehle, Streit im Privatchat oder im Gespräch zu klären.',
      ),
      optSegs('b', 'Der Streit wird größer und immer mehr aus der Klasse schreiben etwas dazu.', 2,
        'Du erkennst, dass der Streit größer wird und immer mehr aus der Klasse etwas dazu schreiben.',
        '👉 Dadurch verliert man schnell den Überblick, und es wird immer lauter im Chat.',
        '💡 Wenn viele sich einmischen, kann ein Streit schnell wachsen. Ich empfehle deshalb, Streit im Privatchat oder Gespräch zu klären.',
      ),
      optSegs('c', 'Yasmin und Dominik streiten sich, es ist aber noch nicht klar, worum es genau geht.', 1,
        'Du erkennst, dass Yasmin und Dominik streiten.',
        '👉 Das war der Ausgangspunkt, aber im Chat passiert gerade noch mehr drum herum.',
        '💡 In Gruppenchats betrifft ein Streit schnell mehr als nur zwei Personen. Ich empfehle deshalb, Streit im Privatchat oder Gespräch zu klären.',
      ),
      optSegs('d', 'Im Chat gibt es öfter Streit, das ist hier jetzt auch so.', 0,
        'Es stimmt, Streit kommt in Chats vor. Besonders, wenn es keine Regeln für respektvollen Umgang gibt.',
        '👉 Hier eskaliert die Situation bereits und betrifft mehrere aus der Klasse.',
        '💡 Es lohnt sich, genauer hinzuschauen, was im Chat passiert.',
      ),
    ],
    ['reflect-understand', 'fairness'],
  ),

  AF('s1e02c01_amy_feedback_chat_escalation', 's1e02c01_item_chat_escalation'),

  S('s1e02c01_story_dominik_private', [
    privateChat('Du', 'Dominik'),
    m(ch.dominik, 'Hey Bro.', '10:03'),
    m(ch.dominik, 'Endlich ist die raus.', '10:03'),
    m(ch.dominik, 'Ich hab übrigens in dein Freundebuch geschrieben. Hier der Link.', '10:04'),
    m(ch.dominik, 'Man sieht sich.', '10:04'),
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
    privateChat('Du', 'Yasmin', 'Lisa', 'Chioma'),
    m(ch.chioma, 'Was ging denn da ab? Jetzt habt ihr im Klassenchat jedenfalls Ruhe vor mir 😔', '10:18'),
    m(ch.yasmin, 'Ruhe vor dir? lol 😂 Da ist erst richtig Chaos ausgebrochen.', '10:19'),
    m(ch.lisa, 'Dominik hat jetzt auch noch Amir und Farida rausgeworfen. Und keiner weiß, warum.', '10:19'),
    m(ch.chioma, 'Warum hast du nichts gesagt?', '10:20'),
    m(ch.lisa, 'Dann werfen die mich doch auch raus. Und dann?', '10:20'),
    sysImg('/media/story/episodes/s1e02/s1e02c02-512.webp', 's1e02c02-img-01'),
  ], ['reflect-understand', 'talk-act', 'fairness']),

  S('s1e02c02_story_switch_to_amy', [
    amyChat(),
    m(ch.amy, 'Lisa schreibt im Klassenchat nichts, obwohl sich einige unfair verhalten.', '10:22'),
    m(ch.amy, 'Was würdest du in so einer Situation tun?', '10:22'),
  ], ['reflect-understand', 'fairness']),

  IT('s1e02c02_item_lisa_intervene',
    'Lisa schreibt im Klassenchat nichts, obwohl sich einige unfair verhalten. Was würdest du in so einer Situation tun?',
    'responsibility',
    'intervene',
    [
      optSegs('a', 'Wenn andere beleidigen oder Fakes schicken, würde ich auch zurückschreiben oder das Gleiche machen.', 0,
        '👉 Wenn du so reagierst, wird der Streit im Chat eher noch stärker. Es kommen immer neue Nachrichten dazu und das Chaos hört nicht so schnell auf.',
        '👉 Erst fühlt es sich vielleicht fair an, „zurückzugeben“. Danach bleibt oft ein ungutes Gefühl zurück und der Streit wird immer größer.',
        '💡 Wenn man mitmacht, wird aus einem Streit schnell ein größeres Chaos.',
      ),
      optSegs('b', 'Ich würde mich raushalten, weil ich das Verhalten nicht gut finde und damit nichts zu tun haben will.', 2,
        '👉 Du steigst nicht in den Streit ein und machst nicht mit. So wird das Ganze zumindest nicht noch größer.',
        '👉 Du fühlst deutlich, dass du das Verhalten im Chat nicht gut findest. Merkst aber auch, dass sich dadurch im Chat nichts verändert.',
        '💡 Nicht mitzumachen ist ein wichtiger Schritt. Du könntest sogar überlegen, ob du die Situation zusätzlich noch positiv beeinflussen kannst.',
      ),
      optSegs('c', 'Ich würde sagen, dass das Verhalten nicht okay ist, auch wenn die anderen das vielleicht nicht gut finden.', 3,
        '👉 Du sprichst offen an, dass das Verhalten nicht okay ist. Das kann helfen, den Chat wieder etwas zu beruhigen.',
        '👉 Das kostet Mut, weil du nicht weißt, wie die anderen reagieren. Gleichzeitig fühlt es sich besser an, zu seiner Meinung zu stehen.',
        '💡 Manchmal reicht eine Stimme, um den Anfang zu machen, damit auch andere sich trauen, fair zu sein.',
      ),
      optSegs('d', 'Ich würde nichts schreiben, damit ich keinen Ärger bekomme oder rausgeworfen werde.', 1,
        '👉 Du hältst dich raus und schützt dich selbst. Im Chat ändert sich nichts und das Chaos geht weiter.',
        '👉 Für dich kann das anstrengend werden, weil du merkst, dass etwas nicht okay ist, aber nichts sagst.',
        '💡 Dich zu schützen ist wichtig. Manchmal hilft es zusätzlich, sich Unterstützung von jemandem zu holen.',
      ),
    ],
    ['talk-act', 'fairness'],
  ),

  AF('s1e02c02_amy_feedback_lisa_intervene', 's1e02c02_item_lisa_intervene'),

  S('s1e02c02_story_after_item_private', [
    privateChat('Du', 'Yasmin', 'Lisa', 'Chioma'),
    m(ch.lisa, 'Wer nicht im Klassenchat ist, kriegt absolut gar nichts mit. Ist voll außen vor.', '10:28'),
    m(ch.lisa, 'Oh, sorry. Das meinte ich nicht so.', '10:28'),
    m(ch.chioma, 'Verstehe.', '10:29'),
    m(ch.lisa, 'Bist du sauer auf mich?', '10:29'),
    m(ch.chioma, 'Nee, kannst ja nichts dafür.', '10:29'),
    m(ch.lisa, 'Ich find´s auch total doof alles! 😔', '10:30'),
    m(ch.lisa, '@ Yasmin: Und warum hast du im Klassenchat ausposaunt, dass ich dir von Dominiks Videos erzählt hab?', '10:30'),
    m(ch.yasmin, 'Hab ich doch gar nicht!', '10:31'),
    m(ch.lisa, 'Doch!', '10:31'),
    m(ch.lisa, 'Was hast du denn wohl in der Zeit getrieben? Na, soll ich dir auf die Sprünge helfen?', '10:31', { forwarded: { fromName: 'Yasmin' } }),
    m(ch.yasmin, 'Das hätte ich auch selbst gesehen haben können. Du hast dich doch selbst verraten mit deinem „Yasmin, bitte!”', '10:32'),
    m(ch.lisa, 'Jetzt hacken sie alle auf mir rum.', '10:32'),
    m(ch.yasmin, 'Die haben wohl alle Schiss, dass du was ausplauderst. Haha 😂 Lisa-Tratschtante weiß einfach alles', '10:33'),
    m(ch.lisa, 'Ich find das gar nicht witzig 😔', '10:33'),
    m(ch.yasmin, 'Und, hast du wieder spannende Infos über jemanden?', '10:33'),
    m(ch.lisa, 'Lass mich bitte in Ruhe. Ich sag bestimmt nichts mehr! Außerdem erzählt mir eh niemand mehr irgendwas. 😢 Schon gar nicht Dominik.', '10:34'),
    m(ch.yasmin, 'Und wenn du ihn einfach auffliegen lässt?', '10:34'),
    m(ch.lisa, 'Quatsch! Das würd ich nie.', '10:34'),
    m(ch.lisa, 'Und Dominik und seine Leute posten jetzt auch noch ständig Fakes. Da weiß man doch eh nicht mehr, was man glauben kann 🤦‍♀️', '10:35'),
    img(ch.lisa, '/media/story/episodes/s1e02/s1e02c02_2-512.webp', '10:35', { forwarded: { fromChatLabel: 'Klassenchat' } }),
    m(ch.lisa, 'Fake-Nachricht: Foto von Schlägerei auf dem Schulhof.', '10:35'),
    m(ch.yasmin, 'Echt jetzt?? Ist ja krass!', '10:36'),
    m(ch.lisa, 'Quatsch, das Bild ist mit KI generiert. Die finden das witzig!', '10:36'),
    m(ch.chioma, 'Oder Dominik will von sich ablenken?', '10:37'),
    m(ch.yasmin, 'Komisch, unsere Klasse.', '10:37'),
    m(ch.lisa, 'Alles war irgendwie gut, bis dieser Klassenchat angefangen hat. Irgendwie denken manche, sie könnten jeden Müll dort abladen. Die einzige Regel im Klassenchat: Gehirn bleibt draußen 🙈', '10:38'),
  ], ['info-check', 'reflect-understand', 'talk-act', 'fairness']),

  S('s1e02c02_story_yasmin_diary_intro', [
    privateChat('Du', 'Yasmin'),
    m(ch.yasmin, 'Keine Ahnung, ob das irgendwie out ist? Aber ist mir echt egal! Wenn ich einen beschissenen Tag hatte, lieb ich mein Tagebuch einfach.', '10:42'),
    m(ch.yasmin, 'Naja, eigentlich nicht nur dann. Auch wenn’s voll toll war und so.', '10:42'),
    bonusLink('diary-yasmin-entry3', 'Tagebuch Yasmin – 3. Eintrag', '/diaries/diary_yasmin?entry=s1e02c02_0003', 'Eintrag öffnen →'),
    m(ch.yasmin, 'Hast du das auch schon mal versucht?', '10:43'),
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
    m(ch.jonas, 'Hey Chioma 😊, ich wollte mal fragen, ob alles okay bei dir ist.', '11:06'),
    m(ch.chioma, 'Geht so. Ich wollte doch nur helfen.', '11:06'),
    m(ch.jonas, 'Manchen ist da echt nicht zu helfen. Die stehen irgendwie auf Chaos.', '11:07'),
    m(ch.chioma, 'Ich nicht.', '11:07'),
    m(ch.jonas, 'Ich auch nicht.', '11:07'),
    m(ch.jonas, 'Vielleicht ist es sogar gut, dass du da gerade raus bist.', '11:08'),
    m(ch.chioma, 'Ich weiß nicht…', '11:08'),
    m(ch.jonas, 'Ja, wirklich. Ich sag’s dir nicht gern, aber…', '11:08'),
    m(ch.jonas, 'Sie posten jetzt auch [[meme]] über dich.', '11:09'),
    m(ch.jonas, '„Regel-Queen“ und so.', '11:09'),
    m(ch.chioma, 'Ernsthaft?', '11:09'),
    m(ch.jonas, 'Ja. Deshalb wollte ich dir sagen, dass ich da nicht mit mache.', '11:10'),
    m(ch.jonas, 'Und mal hören, wie es dir geht.', '11:10'),
    m(ch.chioma, 'Danke. Fühlt sich mies an.', '11:10'),
    m(ch.chioma, '🙈 Wieso fühlt es sich bloß so mies an, obwohl doch immer nur Streit ist!?', '11:11'),
    m(ch.jonas, 'Ich könnte mit den Jungs reden, wenn du willst.', '11:11'),
    m(ch.chioma, 'Und wenn ich das nächste Mal etwas schreibe, bin ich gleich wieder raus? Nein danke!', '11:12'),
    m(ch.chioma, 'Wenn ich einfach nur zurück in den Chat gehe, muss ich nach Dominiks Regeln spielen.', '11:12'),
    m(ch.chioma, 'Dann ändert sich gar nichts.', '11:13'),
  ], ['reflect-understand', 'talk-act', 'fairness']),

  S('s1e02c03_story_switch_to_amy', [
    amyChat(),
    m(ch.amy, 'Chioma ist raus aus dem Klassenchat und fühlt sich machtlos.', '11:15'),
    m(ch.amy, 'Was würdest du Chioma in dieser Situation raten?', '11:15'),
  ], ['reflect-understand', 'problem-solving']),

  IT('s1e02c03_item_chioma_self_regulation',
    'Chioma ist raus aus dem Klassenchat und fühlt sich machtlos. Was würdest du Chioma in dieser Situation raten?',
    'self_regulation',
    'regulate_emotions',
    [
      optSegs('a', 'Sie soll es einfach vergessen und sich denken: „Dann halt nicht. Ich hab keine Lust mehr auf den Chat.“', 0,
        'Wenn sie alles einfach abhakt, bleibt der Ärger im Kopf – und die Situation ist nicht aus der Welt.',
        '👉 Kurz wirkt das wie Erleichterung. Aber das, was sie stört, kommt wieder hoch.',
        '💡 Wegschieben löst nichts. Der erste Schritt ist, hinzuschauen, was dich wirklich stört.',
      ),
      optSegs('b', 'Sie soll erstmal abwarten, ob sich die Situation von selbst beruhigt.', 1,
        'Wenn sie nur abwartet, passiert erstmal nichts. Die Situation bleibt, wie sie ist.',
        '👉 Das fühlt sich sicher an. Gleichzeitig gibt sie die Kontrolle aus der Hand.',
        '💡 Abwarten kann helfen, um kurz durchzuatmen. Weiter kommst du, wenn du selbst aktiv wirst.',
      ),
      optSegs('c', 'Sie soll sich in Ruhe überlegen, was sie stört, und was ihr jetzt helfen würde.', 2,
        'Sie nimmt sich Zeit und sortiert ihre Gedanken. So wird klar, was eigentlich das Problem ist.',
        '👉 Das gibt ihr mehr Überblick und Sicherheit. Sie versteht, was sie wirklich will.',
        '💡 Klarheit ist ein starker Schritt. Jetzt kannst du entscheiden, was du daraus machst.',
      ),
      optSegs('d', 'Sie soll überlegen, was sie ändern will, und einen Weg suchen, selbst etwas dafür zu tun.', 3,
        'Sie entscheidet sich, etwas zu verändern und selbst aktiv zu werden.',
        '👉 Das gibt ihr Kontrolle zurück. Sie bleibt nicht im Gefühl hängen, sondern kommt ins Handeln.',
        '💡 Wenn dich etwas stört, geh den nächsten Schritt. So entsteht Veränderung.',
      ),
    ],
    ['reflect-understand', 'problem-solving'],
  ),

  AF('s1e02c03_amy_feedback_chioma_self_regulation', 's1e02c03_item_chioma_self_regulation'),

  S('s1e02c03_story_after_item_private', [
    privateChat('Du', 'Jonas', 'Chioma'),
    m(ch.chioma, 'Schrecklich, nichts tun zu können. 😔 Ich möchte wirklich etwas ändern!', '11:20'),
    m(ch.jonas, 'Hast du mal an die Schülerzeitung gedacht?', '11:20'),
    m(ch.chioma, 'Schülerzeitung? Ach ja, wir haben an der Schule eine Online-Zeitung oder? Machst du da mit?', '11:21'),
    m(ch.jonas, 'Ja. Schon seit einer Weile. Wir machen im Moment nicht viel, aber sitzen immer Dienstags zusammen. Hast du Lust?', '11:21'),
    m(ch.chioma, 'Klar! 😊', '11:22'),
    m(ch.chioma, 'Aber was, wenn die jetzt auch sauer auf mich sind?', '11:22'),
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
      fixedAmyReply: 'Dazugehören ist für viele wichtig. Aber du musst dich nicht verstellen, um dabei zu sein.',
    },
  ),

  AR('s1e02c03_amy_reaction_belonging', 's1e02c03_reflection_belonging'),

  S('s1e02c03_story_amy_tip', [
    m(ch.amy, 'Es gibt auch andere Orte, an denen man dazugehören kann.', '11:24'),
  ], ['reflect-understand']),
]);

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 4 — Die Schülerzeitung
// ─────────────────────────────────────────────────────────────────────────────

const c04 = C('s1e02c04', 3, 'Amic 4', 'Die Schülerzeitung', [

  S('s1e02c04_story_student_newsroom', [
    privateChat('Du', 'Carlos', 'Jonas', 'Chioma', 'Aylin'),
    sysImg('/media/story/episodes/s1e02/s1e02c04-512.webp', 's1e02c04-img-01'),
    m(ch.jonas, 'Hey Leute, ich hab Chioma auch mal eingeladen.', '12:05'),
    m(ch.carlos, 'Geht klar 👍', '12:05'),
    m(ch.aylin, 'Wir sind hier keine Bühne für persönliche Abrechnungen.', '12:06'),
    m(ch.chioma, 'Darum geht’s mir auch gar nicht.', '12:06'),
    m(ch.aylin, 'Das hoffe ich.', '12:06'),
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
    m(ch.amy, 'Chioma hat direkt eine Idee und will etwas beitragen.', '12:13'),
    m(ch.amy, 'Und du? Was für einen Beitrag würdest du gern mal machen?', '12:13'),
  ], ['creative', 'talk-act']),

  OR('s1e02c04_reflection_own_contribution',
    'Chioma hat direkt eine Idee und will etwas beitragen. Und du? Was für einen Beitrag würdest du gern mal machen?',
    {
      topics: ['creative', 'talk-act'],
      category: 'ACTION',
      bypassAi: true,
      fixedAmyReply: 'Tolle Idee! Solche Beiträge machen eine Schülerzeitung lebendig.',
    },
  ),

  AR('s1e02c04_amy_reaction_own_contribution', 's1e02c04_reflection_own_contribution'),

  S('s1e02c04_story_amy_challenge', [
    m(ch.amy, 'Eine kleine Challenge für dich:', '12:15'),
    m(ch.amy, 'Wenn du Lust hast, nimm dir gleich einen Block und einen Stift und setze deine Idee um.', '12:15'),
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
    privateChat('Du', 'Chioma', 'Dominik'),
    sysImg('/media/story/episodes/s1e02/s1e02c05-512.webp', 's1e02c05-img-01'),
    m(ch.chioma, 'Du meinst also ein Klassenchat braucht keine Regeln❓', '13:02'),
    m(ch.dominik, 'Exakt! Meinungsfreiheit, logisch! Niemand will deine verdammten Regeln! 😤', '13:02'),
    m(ch.dominik, 'Regeln sind doch nur dafür da, Leute zu bremsen.', '13:03'),
    m(ch.dominik, 'Dann ist es doch kein echter Chat mehr.', '13:03'),
    m(ch.chioma, 'Kein echter Chat für wen?', '13:03'),
    m(ch.dominik, 'Für Leute, die halt sagen, was sie denken.', '13:04'),
    m(ch.chioma, 'Dann ist es aber kein Chat mehr für die Anderen.', '13:04'),
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
    privateChat('Du', 'Chioma', 'Lisa'),
    m(ch.lisa, 'Chioma will mit mir über Regeln labern 😂 Die hat doch zero chance! Klickt rein und voted für mich 🔥', '13:40', { forwarded: { fromName: 'Dominik' } }),
    m(ch.lisa, 'Ich bring Popcorn mit! 😂🍿 Klare Sache, kannst auf mich zählen.', '13:40', { forwarded: { fromName: 'Markus' } }),
    m(ch.lisa, 'Was hast du vor?', '13:41'),
    m(ch.lisa, 'Ich weiß nicht, ob das eine gute Idee ist. Glaubst du echt, du hast eine Chance gegen den?', '13:41'),
  ], ['reflect-understand', 'talk-act']),

  S('s1e02c05_story_amy_reflection', [
    amyChat(),
  ], ['reflect-understand', 'fairness']),

  OR('s1e02c05_reflection_both_sides',
    'Warum ist es wichtig, beide Seiten zu zeigen - und nicht nur die eigene Meinung?',
    { topics: ['reflect-understand', 'fairness'], category: 'PERSPECTIVE' },
  ),

  AR('s1e02c05_amy_reaction_both_sides', 's1e02c05_reflection_both_sides'),

  S('s1e02c05_story_amy_tip', [
    m(ch.amy, 'Fair ist, wenn alle ihre Sicht sagen dürfen.', '13:46'),
    m(ch.amy, 'Nur so kann man wirklich verstehen, worum es geht.', '13:46'),
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
    privateChat('Du', 'Chioma', 'Carlos'),
    sysImg('/media/story/episodes/s1e02/s1e02c06-512.webp', 's1e02c06-img-01'),
    m(ch.chioma, 'Carlos, ich brauche deine Hilfe! 🙏', '14:09'),
    m(ch.carlos, 'Worum geht’s?', '14:09'),
    m(ch.chioma, 'Mein Artikel, er ist nicht wirklich ein klassischer Artikel.', '14:09'),
    m(ch.carlos, 'Was meinst du?', '14:10'),
    m(ch.chioma, 'Ich möchte etwas Anderes versuchen. Interaktiv. Wozu sind wir sonst eine Online-Schülerzeitung?', '14:10'),
    m(ch.carlos, 'Cool. Jetzt bin ich gespannt.', '14:10'),
    m(ch.chioma, 'Das wollte ich hören. 👍🏾', '14:11'),
    m(ch.chioma, 'Morgen bin ich mit Dominik verabredet, um einen Audiobeitrag aufzunehmen. Dazu gibt’s einen Meinungs-Check unter den Hörern. Wärst du dabei? Könntest du das aufnehmen? Und online stellen?', '14:11'),
    m(ch.carlos, 'Immer langsam. So viele Fragen auf einmal…', '14:12'),
    m(ch.chioma, 'Sorry. Was hältst du von dem Audioformat?', '14:12'),
    m(ch.chioma, 'In einem Chat ohne Regeln gewinnt der Lautere, der Fiesere, der Admin, der andere rauswerfen kann.', '14:12'),
    m(ch.chioma, 'In einem Gespräch muss jeder dem anderen zuhören.', '14:13'),
    m(ch.carlos, 'Du willst das Spielfeld ändern 🤔', '14:13'),
    m(ch.chioma, 'Genau.', '14:13'),
    m(ch.carlos, 'Nicht schlecht.', '14:13'),
    m(ch.carlos, 'Aber nur damit das klar ist ⚠️', '14:14'),
    m(ch.carlos, 'Sobald das online ist, können wir es nicht einfach wieder zurückholen.', '14:14'),
  ], ['problem-solving', 'talk-act', 'fairness']),

  S('s1e02c06_story_switch_to_amy', [
    amyChat(),
    m(ch.amy, 'Chioma weiß: Wenn der Audiobeitrag online geht, hört ihn die ganze Schule. Und wenn es schiefgeht, kann man ihn nicht einfach zurückholen.', '14:16'),
    m(ch.amy, 'Wie hättest du in dieser Situation entschieden?', '14:16'),
  ], ['reflect-understand', 'fairness']),

  IT('s1e02c06_item_audio_decision',
    'Chioma weiß: Wenn der Audiobeitrag online geht, hört ihn die ganze Schule. Und wenn es schiefgeht, kann man ihn nicht einfach zurückholen. Wie hättest du in dieser Situation entschieden?',
    'responsibility',
    'take_responsibility',
    [
      optSegs('a', 'Ich hätte mich schon vorher der Stimmung im Klassenchat angepasst, damit ich nicht selbst rausfliege. Einen öffentlichen Audiobeitrag würde ich deshalb gar nicht erst machen.', 0,
        'Du passt dich schon im Chat an. Der Grund für einen Audiobeitrag entsteht gar nicht erst.',
        '👉 Das schützt dich davor, selbst in den Fokus zu geraten. Gleichzeitig bleibt das Verhalten im Chat unfair.',
        '💡 Auch wenn du dich schützen möchtest: Überleg dir, ob du das wirklich so stehen lassen oder ob du einen eigenen Standpunkt einnehmen willst.',
      ),
      optSegs('b', 'Ich würde keinen zusätzlichen Ärger wollen und den Audiobeitrag lieber nicht veröffentlichen.', 1,
        'Du entscheidest dich gegen den Beitrag, um keinen zusätzlichen Ärger zu riskieren. Das Thema wird nicht öffentlich.',
        '👉 Das fühlt sich ruhig und sicher an. Gleichzeitig bleibt offen, wer etwas gegen das unfaire Verhalten im Chat unternimmt.',
        '💡 Sicherheit ist wichtig. Du kannst trotzdem überlegen, wie du etwas beitragen kannst, ohne dich zu überfordern.',
      ),
      optSegs('c', 'Ich würde etwas gegen das unfairen Verhalten im Chat tun wollen, aber nicht mit einem öffentlichen Audiobeitrag.', 3,
        'Du willst etwas verändern und suchst einen eigenen kreativen Weg.',
        '👉 Du merkst klar, dass etwas nicht stimmt und bist bereit etwas dafür zu tun.',
        '💡 Wenn dir etwas wichtig ist, steh dafür ein. So entsteht echte Veränderung.',
      ),
      optSegs('d', 'Ich würde den Audiobeitrag veröffentlichen, obwohl es riskant ist. Dieses unfaire Verhalten im Chat darf nicht einfach so weitergehen.', 3,
        'Du gehst das Risiko bewusst ein und machst das Thema öffentlich. So kann das unfairen Verhalten nicht einfach weiterlaufen.',
        '👉 Das kostet Mut. Gleichzeitig setzt du ein klares Zeichen und gibst anderen die Chance, sich auch zu äußern.',
        '💡 Wenn dir etwas wichtig ist, steh dafür ein. So entsteht echte Veränderung.',
      ),
    ],
    ['reflect-understand', 'fairness', 'problem-solving'],
  ),

  AF('s1e02c06_amy_feedback_audio_decision', 's1e02c06_item_audio_decision'),

  S('s1e02c06_story_resolution_private', [
    privateChat('Du', 'Chioma', 'Carlos'),
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
    bonusLink('article-audiobeitraege-erstellen', 'Artikel Audiobeiträge erstellen', '/newspaper/tip-carlos-audio-howto', 'Artikel öffnen →'),
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
audio(ch.carlos, '/media/newspaper/audio/chatrules-chioma-dominik.mp3', '14:31', 'Audiobeitrag'),
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
        'Du setzt stark auf Freiheit im Chat.',
        '👉 Das kann sich erst einmal offen anfühlen. Gleichzeitig kann es schnell unfair werden, wenn niemand Grenzen achtet.',
        '💡 Freiheit und Rücksicht müssen zusammenpassen, damit sich alle sicher fühlen können.',
      ),
      rc('b', 'Dass es klare Regeln gibt, damit alle respektvoll behandelt werden.',
        'Du betonst, dass Regeln Schutz geben können.',
        '👉 So wird klarer, was okay ist und was nicht.',
        '💡 Gute Regeln sollen nicht nerven, sondern helfen, dass sich niemand ausgeschlossen fühlt.',
      ),
      rc('c', 'Ich bin mir nicht sicher.',
        'Du merkst, dass beides wichtig sein kann.',
        '👉 Genau das macht die Frage spannend: Freiheit ist wichtig, aber Respekt auch.',
        '💡 Es lohnt sich zu überlegen, welche Regeln wirklich helfen und welche eher stören.',
      ),
    ],
    { topics: ['fairness', 'reflect-understand'] },
  ),

  AR('s1e02c07_amy_reaction_rules_or_no_rules', 's1e02c07_reflection_rules_or_no_rules'),

  OR('s1e02c07_reflection_rules_why',
    'Warum?',
    { topics: ['reflect-understand', 'fairness'], category: 'PERSPECTIVE' },
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
    m(ch.aylin, 'Umfrage mit Check-Box: „📋 Bitte abhaken, wenn ihr Alvarez´ Bestätigung eingeholt habt”', '14:47'),
    m(ch.chioma, 'Warte mal. Ok von Herrn Alvarez? 🤔', '14:48'),
    m(ch.aylin, 'Ja, natürlich.', '14:48'),
    m(ch.carlos, 'Alvarez muss jeden Artikel absegnen, bevor wir ihn veröffentlichen dürfen.', '14:48'),
    m(ch.chioma, 'Okay…', '14:49'),
    m(ch.chioma, 'Muss das unbedingt vorher sein?', '14:49'),
    m(ch.aylin, 'Ja, sicher.', '14:49'),
    m(ch.aylin, 'Carlos, hast du Chioma nicht gefragt, als sie dir den Teaser geschickt hat?', '14:49'),
    m(ch.carlos, 'Ich dachte, das wär klar. Ist doch Regel Nummer 2: „Jeder Artikel muss vor der Veröffentlichung genehmigt werden.”', '14:50'),
    m(ch.chioma, 'Und was ist Regel Nummer 1?', '14:50'),
    m(ch.carlos, 'Auf dem großen Wandplakat steht’s: „Keine [[fake-news]]!”', '14:50'),
    m(ch.carlos, 'Ohne Regeln müssten wir alles jedes Mal neu ausdiskutieren.', '14:51'),
    m(ch.chioma, 'Das leuchtet ein. Aber…', '14:51'),
    m(ch.aylin, 'So können wir das leider nicht veröffentlichen, tut mir leid. Aber dein Artikel kann ja in die Ausgabe vom nächsten Monat 📅', '14:52'),
    m(ch.chioma, 'Was?? Das ist noch viel zu lange hin. Könnt ihr nicht noch bis morgen mit der Veröffentlichung warten? 🙏', '14:52'),
    m(ch.aylin, 'Das geht leider nicht. Sorry!', '14:53'),
    m(ch.aylin, 'Worüber ist dein Artikel eigentlich, Chioma?', '14:53'),
    m(ch.chioma, 'Em…', '14:53'),
    m(ch.chioma, 'Regeln im Klassenchat', '14:54'),
    m(ch.aylin, 'Hm 🤔 Das ist… interessant.', '14:54'),
  ], ['reflect-understand', 'fairness', 'problem-solving']),

  S('s1e02c08_story_switch_to_amy', [
    amyChat(),
    m(ch.amy, 'Chioma hat sich so viel Mühe gegeben und jetzt das.', '14:56'),
    m(ch.amy, 'Was macht die Situation für Chioma gerade so schwierig?', '14:56'),
  ], ['reflect-understand', 'fairness']),

  IT('s1e02c08_item_goal_conflict',
    'Chioma hat sich so viel Mühe gegeben und jetzt das. Was macht die Situation für Chioma gerade so schwierig?',
    'perspective',
    'goal_conflicts',
    [
      optSegs('a', 'Carlos hat Chioma nichts von den Regeln gesagt. Deshalb ist sie jetzt sauer auf ihn.', 0,
        'Du suchst nach einem Schuldigen. So wirkt es, als läge das Problem nur bei Carlos.',
        '👉 Das erklärt aber nicht, warum die Situation für Chioma schwierig ist: Sie will ihren Beitrag veröffentlichen, darf es aber wegen der Regeln nicht.',
        '💡 Schau auf das ganze Problem: Wenn du verstehst, was aufeinanderprallt, findest du eher eine Lösung.',
      ),
      optSegs('b', 'Der Beitrag müsste erst freigegeben werden, aber dafür bleibt keine Zeit.', 1,
        'Du siehst ein Hindernis: Die Freigabe fehlt und die Zeit ist knapp.',
        '👉 Das stimmt, aber das allein macht die Situation noch nicht so schwierig. Chioma will ihren Beitrag jetzt veröffentlichen, darf es aber wegen der Regeln nicht.',
        '💡 Wenn du eine Lösung suchst und dafür das Problem verstehen willst, schau dir an: Was will die Person – und was steht dem im Weg?',
      ),
      optSegs('c', 'Chioma möchte den Beitrag sofort veröffentlichen und kann nicht bis zur nächsten Ausgabe warten.', 2,
        'Du erkennst klar, was Chioma will: Sie möchte den Beitrag sofort veröffentlichen.',
        '👉 Genau da entsteht das Problem: Sie will etwas – aber die Regeln lassen es gerade nicht zu.',
        '💡 Wenn Wünsche und Regeln aufeinandertreffen, wird es oft kompliziert.',
      ),
      optSegs('d', 'Chioma will ihren Beitrag veröffentlichen, aber gleichzeitig gelten Regeln für alle. Beides passt gerade nicht zusammen.', 3,
        'Du erkennst den Kern: Chiomas Wunsch und die Regeln passen gerade nicht zusammen.',
        '👉 Genau das macht die Situation schwierig. Beides ist wichtig – und beides geht gerade nicht gleichzeitig.',
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
   inp('s1e01c01_input_intro_reply', 'stories:s1e01.c01.input.introReply', {
    topics: ['talk-act'], promptSpeakerId: 'yasmin',
  }),

  AR('s1e02c08_amy_reaction_chioma_emojis', 's1e02c08_reflection_chioma_emojis'),
]);

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 9 — Die Lösung mit dem Platzhalter
// ─────────────────────────────────────────────────────────────────────────────

const c09 = C('s1e02c09', 8, 'Amic 9', 'Die Lösung mit dem Platzhalter', [

  S('s1e02c09_story_carlos_chioma_problem', [
    privateChat('Du', 'Carlos', 'Chioma'),
    sysImg('/media/story/episodes/s1e02/s1e02c09-512.webp', 's1e02c09-img-01'),
    m(ch.chioma, 'Das ist kaum auszuhalten. Herr Alvarez antwortet einfach nicht. Ich hab’s schon so oft probiert 🙈😳', '14:40'),
    m(ch.carlos, 'Er ist bei einer Konferenz, das kannst du vergessen.', '14:40'),
    m(ch.chioma, 'Verdammt! Das war so wichtig für mich! Kannst du nicht vielleicht doch…?', '14:41'),
  ], ['problem-solving', 'reflect-understand']),

  S('s1e02c09_story_switch_to_amy', [
    amyChat(),
    m(ch.amy, 'Chioma will, dass ihr Beitrag noch rechtzeitig erscheint. Dafür stehen ihr aber Regeln im Weg.', '14:42'),
    m(ch.amy, 'Was würdest du in so einer Situation tun?', '14:42'),
  ], ['reflect-understand', 'problem-solving']),

  IT('s1e02c09_item_rules_and_solution',
    'Chioma will, dass ihr Beitrag noch rechtzeitig erscheint. Dafür stehen ihr aber Regeln im Weg. Was würdest du in so einer Situation tun?',
    'responsibility',
    'take_responsibility',
    [
      optSegs('a', 'Mir wären die Regeln in diesem Fall egal. Hauptsache, der Beitrag kommt rechtzeitig raus.', 0,
        'Du stellst das Ziel über alles. Der Beitrag kommt zwar schnell raus, aber Regeln haben ihren Sinn.',
        '👉 Auch wenn du gute Gründe hast: So kannst du anderen schaden oder selbst Ärger bekommen.',
        '💡 Ein gutes Ergebnis zählt – aber der Weg dorthin ist genauso wichtig.',
      ),
      optSegs('b', 'Ich würde mich da raushalten. Ich würde die Regeln selbst zwar nicht brechen, aber was Chioma macht, ist ihre Sache.', 1,
        'Du hältst dich raus und überlässt die Entscheidung anderen. So bleibst du selbst aus dem Risiko raus.',
        '👉 Das fühlt sich sicher an. Gleichzeitig verpasst du die Chance, etwas mitzugestalten.',
        '💡 Auch wenn es nicht direkt deine Aufgabe ist: Deine Entscheidung kann einen Unterschied machen.',
      ),
      optSegs('c', 'Ich würde mich an die Regeln halten und den Beitrag erst später veröffentlichen, auch wenn es nervt.', 2,
        'Du hältst dich an die Regeln, auch wenn es für dich Nachteile hat.',
        '👉 Das sorgt für Fairness und Klarheit. Gleichzeitig bleibt das eigentliche Problem ungelöst.',
        '💡 Regeln geben Orientierung. Manchmal lohnt es sich zusätzlich, nach einer Lösung zu suchen, die beides verbindet.',
      ),
      optSegs('d', 'Ich würde überlegen, wie ich das Problem lösen kann, ohne die Regeln zu brechen.', 3,
        '👉 Du suchst aktiv nach einer Lösung, die funktioniert und gleichzeitig die Regeln respektiert.',
        '👉 So übernimmst du Verantwortung und bleibst fair gegenüber allen.',
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
    m(ch.carlos, 'Hast du’s?', '14:57'),
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
    m(ch.jonas, 'Glückwunsch, Chioma, tolles Interview! Wie hast du’s doch noch rechtzeitig geschafft?', '15:39'),
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
audio(ch.carlos, '/media/newspaper/audio/chatrules-chioma-dominik.mp3', '15:43', 'Audiobeitrag'),
    //divider('…'),
    m(ch.tom, 'Respekt! Klare Sache.', '15:44'),
    m(ch.dominik, 'Grrr. Und dein hauchdünner Vorsprung heißt jetzt, ich darf nicht mehr schreiben, was ich will?', '15:44'),
    m(ch.chioma, 'Niemand wird gezwungen, hier zu bleiben. Aber wer bleibt, hält sich dran.', '15:45'),
    m(ch.dominik, 'Hält sich woran??', '15:45'),
    m(ch.chioma, 'An das, was wir gemeinsam abstimmen.', '15:45'),
    audio(ch.chioma, '/media/story/episodes/s1e02/chiomas-sprachnachricht-s1e02c10.mp3', '15:46'),
    bonusLink('article-chioma-gruppenchats', 'Chiomas Anleitung für Gruppenchats', '/newspaper/article-chioma-gruppenchats', 'Artikel öffnen →'),
  ], ['fairness', 'talk-act', 'problem-solving']),

  S('s1e02c10_story_student_newsroom_aftermath', [
    privateChat('Du', 'Jonas', 'Carlos', 'Aylin', 'Chioma'),
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
    bonusLink('article-regeln-im-chat', 'Artikel Regeln im Chat', '/newspaper/s1e01c10-chiomas-chatrules', 'Artikel öffnen →'),
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