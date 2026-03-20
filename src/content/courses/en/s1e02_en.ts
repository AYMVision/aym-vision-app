// src/content/courses/de/s1e01.ts
import type { Course, Reaction } from '../../../common/types';
import { STORY_CHARACTERS as characters } from '../../characters';

const R = (emoji: string, type?: string): Reaction => ({ emoji, type });

const course: Course = {
  id: 's1e02', // ✅ MUST match contentIndex.courseId

  // ❗ Platzhalter – NICHT im UI verwenden
  title: '',
  image: '',
  description: '',

  script: [
    // ------------------------------------
    // Chapter 1 — Alarm im Klassenchat
    // ------------------------------------
    {
      chapter: 1,
      messages: [

{
  id: 's1e02c01-0001',
  type: 'system',
  kind: 'chat-switch',
scene: {
  tone: 'private',
  labelKey: 'stories:chatSwitch.private',
  title: '', // <- leer
  participants: [{name:'Lisa'}, {name:'Chioma'}, {name:'Yasmin'}],
},
  timestamp: '',
},

// Privatchat: Lisa - Yasmin - Chioma
{ id: 's1e02c01-0002', type: 'other', speaker: characters.yasmin, content: 'Und? Sag schon: Was gibt’s Neues aus der Gerüchteküche?', timestamp: '19:24' },
{ id: 's1e02c01-0003', type: 'other', speaker: characters.lisa, content: 'Kann gerade echt nicht 🙈 bin schon auf dem Weg zum Sushi.', timestamp: '19:24' },
{ id: 's1e02c01-0004', type: 'other', speaker: characters.lisa, content: 'Das mit Dominik heute Morgen hab ich dir ja schon erzählt.', timestamp: '19:25' },

{
  id: 's1e02c01-0002a',
  type: 'system',
  kind: 'chat-switch',
  timestamp: '',
scene: {
  tone: 'class',
  labelKey: 'stories:chatSwitch.class',
  title: 'Klasse 7b',
  participants: [], // <- leer lassen
}
},



        // Klassenchat
        { type: 'other', speaker: characters.mia, content: 'Boah, Sport war heute echt lame.', timestamp: '19:26' },
        { type: 'other', speaker: characters.finn, content: 'ich fand’s eigentlich ganz okay 😅 jeder hat halt sein ding gemacht.', timestamp: '19:26' },
        { type: 'other', speaker: characters.dominik, content: 'Kein Wunder 😂 Mit Volleyball-Nieten wie Yasmin im Team kann ja nix laufen.', timestamp: '19:27' },
        { type: 'other', speaker: characters.markus, content: 'lol 😂', timestamp: '19:27'},
        { type: 'other', speaker: characters.dominik, content: 'Sie kennt nicht mal die Basics!! 🤦‍♂️ Digga, dass man den Ball nicht zweimal hintereinander berühren darf, weiß doch jeder.', timestamp: '19:28' },
        { type: 'other', speaker: characters.elsa, content: '🤣🙈', timestamp: '19:28' },

        { type: 'other', speaker: characters.yasmin, content: 'Mir sind deine Regeln gerade echt egal!! 🙄🔥', timestamp: '19:29' },
        { type: 'other', speaker: characters.dominik, content: 'Bro, geht’s noch?? 😂 Ohne Regeln kein Sport, logisch!! Dann chill halt auf der Bank, du Loser 💀', timestamp: '19:30' },

        { type: 'other', speaker: characters.yasmin, content: 'Ey, ich warne dich jetzt echt! 😤', timestamp: '19:31' },
        { type: 'other', speaker: characters.yasmin, content: 'Und was hast du eigentlich in der Zeit gemacht? 😶 Soll ich dir auf die Sprünge helfen oder lieber nicht?', timestamp: '19:31' },

        { type: 'other', speaker: characters.finn, content: 'hä?', timestamp: '19:32' },
        { type: 'other', speaker: characters.mia, content: 'Ey, worum geht’s hier eigentlich?', timestamp: '19:32' },

        { type: 'other', speaker: characters.dominik, content: '@Yasmin Bro, was soll das denn jetzt heißen??', timestamp: '19:33' },
        { type: 'other', speaker: characters.lisa, content: 'Yasmin, bitte! 😕', timestamp: '19:33' },

        { type: 'other', speaker: characters.dominik, content: 'Lisa? Hast du…?', timestamp: '19:34' },
        { type: 'other', speaker: characters.yasmin, content: 'OMG, war doch nur Spaß 😂✨', timestamp: '19:34' },

        { type: 'other', speaker: characters.dominik, content: 'Spaß??', timestamp: '19:35' },
        { type: 'other', speaker: characters.dominik, content: 'Willst du mir grad drohen, oder was?', timestamp: '19:35' },
        { type: 'other', speaker: characters.dominik, content: 'Ey, haltet mal alle die Klappe jetzt!', timestamp: '19:36' },

        { type: 'other', speaker: characters.lisa, content: 'Ganz ehrlich, ich hab wirklich nichts gesagt 😳', timestamp: '19:36', reactions: [R('😳')] },

                // Amy image (chapter header vibe)
        {
  type: 'system',
  image: '/media/story/episodes/s1e02/s1e02c01-512.webp',
  timestamp: '18:35'
},

        // Chioma (main in this story)
        { type: 'main', speaker: characters.chioma, content: 'Kurze Frage: Was passiert hier gerade?', timestamp: '19:37' },
        { type: 'main', speaker: characters.chioma, content: 'Wollt ihr das wirklich hier im Klassenchat ausrollen? Privat wäre fairer.', timestamp: '19:37' },

        { type: 'other', speaker: characters.dominik, content: 'Willst du mir jetzt den Mund verbieten, Digga?', timestamp: '19:38' },
        { type: 'other', speaker: characters.igor, content: 'Ey Dominik, lass gut sein.', timestamp: '19:38' },

        { type: 'other', speaker: characters.dominik, content: 'Yasmin ist doch die, die hier rumdroht!!! 🔥 Und Verräter sollten echt aufpassen, no cap.', timestamp: '19:39' },
        { type: 'other', speaker: characters.markus, content: 'Ja man 👍', timestamp: '19:39', reactions: [R('👍')] },

        { type: 'other', speaker: characters.yasmin, content: 'Ey, lass es jetzt einfach 🙄', timestamp: '19:39' },
        { type: 'other', speaker: characters.mia, content: 'Ich check hier grad gar nichts mehr.', timestamp: '19:40' },

        { type: 'main', speaker: characters.chioma, content: 'Okay, kurze Pause.', timestamp: '19:40' },
        { type: 'other', speaker: characters.dominik, content: 'Hä? Wer hat dich überhaupt gefragt?', timestamp: '19:40' },

        { type: 'main', speaker: characters.chioma, content: 'Es gibt offenbar etwas, das nicht öffentlich sein soll. Dann gehört es doch nicht in den Klassenchat, oder?', timestamp: '19:41' },
        { type: 'other', speaker: characters.dominik, content: 'Und du bist bitte wer? 😂 Polizei 🚨 oder Frau Lehrerin 🤓 oder was?', timestamp: '19:41' },

        { type: 'other', speaker: characters.mia, content: 'Naja… mich würde schon interessieren, was Yasmin eigentlich meint.', timestamp: '19:42' },

        { type: 'main', speaker: characters.chioma, content: 'So kommen wir nicht weiter. Wie gehen wir jetzt damit um?', timestamp: '19:42' },
        { type: 'other', speaker: characters.dominik, content: 'So ’ne Spaßbremse braucht hier echt keiner. Du bist raus 💀', timestamp: '19:43' },
        { type: 'other', speaker: characters.markus, content: 'Stimmt 😅', timestamp: '19:43' },

        { type: 'system', content: 'Dominik hat Chioma entfernt.', timestamp: '' },

        // Amy reflection (question + tip)
        { type: 'main', speaker: characters.amy, content: 'Für wen wurde der Chat unangenehm – und warum?', timestamp: '19:44' },
        { type: 'main', speaker: characters.amy, content: 'Wenn die Stimmung im Chat kippt, gibt es oft nur noch Verlierer. Viele fühlen sich schlecht – auch die, die laut waren 😕', timestamp: '19:44' },
      ],
    },

    // ------------------------------------
    // Chapter 2 — Nachbeben im Privat-Chat
    // ------------------------------------
    {
      chapter: 2,
      messages: [


{
  id: 's1e02c02-0001',
  type: 'system',
  kind: 'chat-switch',
scene: {
  tone: 'private',
  labelKey: 'stories:chatSwitch.private',
  title: '', // <- leer
  participants: [{name:'Lisa'}, {name:'Chioma'}, {name:'Yasmin'}],
},
  timestamp: '',
},



        { type: 'main', speaker: characters.chioma, content: 'Was ging denn da ab? Jetzt habt ihr im Klassenchat jedenfalls Ruhe vor mir 😔', timestamp: '19:45' },
        { type: 'other', speaker: characters.yasmin, content: 'Ruhe vor dir? lol 😂 Da ist erst richtig Chaos ausgebrochen.', timestamp: '19:46' },
        { type: 'other', speaker: characters.lisa, content: 'Dominik hat jetzt auch noch Amir und Farida rausgeworfen. Und keiner weiß, warum.', timestamp: '19:46' },

        { type: 'main', speaker: characters.chioma, content: 'Warum hast du nichts gesagt?', timestamp: '19:47' },
        { type: 'other', speaker: characters.lisa, content: 'Dann werfen die mich doch auch raus. Und dann?', timestamp: '19:47' },
        { type: 'other', speaker: characters.lisa, content: 'Wer nicht im Klassenchat ist, kriegt absolut gar nichts mit. Ist voll außen vor.', timestamp: '19:48' },
        { type: 'other', speaker: characters.lisa, content: 'Oh, sorry. Das meinte ich nicht so.', timestamp: '19:48' },
        { type: 'main', speaker: characters.chioma, content: 'Verstehe.', timestamp: '19:49' },

        { type: 'other', speaker: characters.lisa, content: 'Bist du sauer auf mich?', timestamp: '19:49' },
        { type: 'main', speaker: characters.chioma, content: 'Nee, kannst ja nichts dafür.', timestamp: '19:49' },

        { type: 'other', speaker: characters.lisa, content: 'Ich find´s auch total doof alles!', timestamp: '19:50' },
        { type: 'other', speaker: characters.lisa, content: '@ Yasmin: Und warum hast du im Klassenchat ausposaunt, dass ich dir von Dominiks Videos erzählt hab?', timestamp: '19:50' },
        { type: 'other', speaker: characters.yasmin, content: 'Hab ich doch gar nicht!', timestamp: '19:51' },
        { type: 'other', speaker: characters.lisa, content: 'Doch!', timestamp: '19:51' },

        { type: 'other', speaker: characters.lisa, content: 'Weitergeleitet: (Yasmin: Was hast du denn wohl in der Zeit getrieben? Na, soll ich dir auf die Sprünge helfen?)', timestamp: '19:52' },

        { type: 'other', speaker: characters.yasmin, content: 'Das hätte ich auch selbst gesehen haben können. Du hast dich doch selbst verraten mit deinem „Yasmin, bitte!”', timestamp: '19:52' },
        { type: 'other', speaker: characters.lisa, content: 'Jetzt hacken sie alle auf mir rum.', timestamp: '19:53' },

                {
          type: 'system',
          image: '/media/story/episodes/s1e02/s1e02c02-512.webp',
          timestamp: '',
        },

        { type: 'other', speaker: characters.yasmin, content: 'Die haben wohl alle Schiss, dass du was ausplauderst. Haha 😂 Lisa-Tratschtante weiß einfach alles', timestamp: '19:54' },
        { type: 'other', speaker: characters.lisa, content: 'Ich find das gar nicht witzig.', timestamp: '19:54' },

        { type: 'other', speaker: characters.yasmin, content: 'Und, hast du wieder spannende Infos über jemanden?', timestamp: '19:55' },
        { type: 'other', speaker: characters.lisa, content: 'Lass mich bitte in Ruhe. Ich sag bestimmt nichts mehr! Außerdem erzählt mir eh niemand mehr irgendwas. Schon gar nicht Dominik.', timestamp: '19:56' },

        { type: 'other', speaker: characters.yasmin, content: 'Und wenn du ihn einfach auffliegen lässt?', timestamp: '19:56' },
        { type: 'other', speaker: characters.lisa, content: 'Quatsch! Das würd ich nie.', timestamp: '19:57' },

        { type: 'other', speaker: characters.lisa, content: 'Und Dominik und seine Leute posten jetzt auch noch ständig Fakes. Da weiß man doch eh nicht mehr, was man glauben kann.', timestamp: '19:58' },

        { type: 'other', speaker: characters.lisa, content: 'Weitergeleitet: (Fake-Nachricht: Foto von Schlägerei auf dem Schulhof.)', timestamp: '19:59' },

        { type: 'other', speaker: characters.yasmin, content: 'Echt jetzt?? Ist ja krass!', timestamp: '19:59', reactions: [R('😳')] },
        { type: 'other', speaker: characters.lisa, content: 'Quatsch, das ist KI. Die finden das witzig!', timestamp: '20:00' },
        { type: 'main', speaker: characters.chioma, content: 'Oder Dominik will von sich ablenken?', timestamp: '20:00' },
        { type: 'other', speaker: characters.yasmin, content: 'Komisch, unsere Klasse.', timestamp: '20:01' },
        { type: 'other', speaker: characters.lisa, content: 'Alles war irgendwie gut, bis dieser Klassenchat angefangen hat. Irgendwie denken manche, sie könnten jeden Müll dort abladen. Die einzige Regel im Klassenchat: Gehirn bleibt draußen 🙈', timestamp: '20:02' },

        { type: 'main', speaker: characters.amy, content: 'Was könntest du tun, wenn in deinem Chat plötzlich Fake-Nachrichten auftauchen?', timestamp: '20:03' },
        { type: 'main', speaker: characters.amy, content: 'Fake News werden nur stark, wenn man sie teilt oder liked. Deshalb: Nicht liken. Nicht teilen. Erst prüfen. Dann entscheiden 💡', timestamp: '20:03' },
      ],
    },

    // ------------------------------------
    // Chapter 3 — Jonas checkt nach
    // ------------------------------------
    {
      chapter: 3,
      messages: [

        {
  id: 's1e02c03-0001',
  type: 'system',
  kind: 'chat-switch',
scene: {
  tone: 'private',
  labelKey: 'stories:chatSwitch.private',
  title: '', // <- leer
  participants: [{name:'Jonas'}, {name:'Chioma'}],
},
  timestamp: '',
},

        { type: 'system', image: '/media/story/episodes/s1e02/s1e02c03-512.webp', timestamp: '' },

        { type: 'other', speaker: characters.jonas, content: 'Hey Chioma, ich wollte mal fragen, ob alles okay bei dir ist.', timestamp: '20:15' },
        { type: 'main', speaker: characters.chioma, content: 'Geht so. Ich wollte doch nur helfen.', timestamp: '20:16' },
        { type: 'other', speaker: characters.jonas, content: 'Manchen ist da echt nicht zu helfen. Die stehen irgendwie auf Chaos.', timestamp: '20:16' },
        { type: 'main', speaker: characters.chioma, content: 'Ich nicht.', timestamp: '20:17' },
        { type: 'other', speaker: characters.jonas, content: 'Ich auch nicht.', timestamp: '20:17' },
        { type: 'other', speaker: characters.jonas, content: 'Vielleicht ist es sogar gut, dass du da gerade raus bist.', timestamp: '20:18' },
        { type: 'main', speaker: characters.chioma, content: 'Trotzdem doof. Ich wär schon gern dabei. Fühlt sich mies an.', timestamp: '20:18' },
        { type: 'other', speaker: characters.jonas, content: 'Ich könnte mit den Jungs reden, wenn du willst.', timestamp: '20:19' },
        { type: 'main', speaker: characters.chioma, content: 'Und wenn ich das nächste Mal etwas schreibe, bin ich gleich wieder raus? Nein danke!', timestamp: '20:19' },
        { type: 'main', speaker: characters.chioma, content: 'Ich kann nicht einfach nur zugucken. Ich möchte wirklich etwas bewegen!', timestamp: '20:20' },
        { type: 'other', speaker: characters.jonas, content: 'Hast du mal an die Schülerzeitung gedacht?', timestamp: '20:20' },
        { type: 'main', speaker: characters.chioma, content: 'Schülerzeitung? Ach ja, wir haben an der Schule eine Online-Zeitung oder? Machst du da mit?', timestamp: '20:21' },
        { type: 'other', speaker: characters.jonas, content: 'Ja. Schon seit einer Weile. Wir machen im Moment nicht viel, aber sitzen immer Dienstags zusammen. Hast du Lust?', timestamp: '20:22' },
        { type: 'main', speaker: characters.chioma, content: 'Klar!', timestamp: '20:22' },
        { type: 'main', speaker: characters.chioma, content: 'Aber was, wenn die jetzt auch sauer auf mich sind?', timestamp: '20:23' },

        { type: 'main', speaker: characters.amy, content: 'Warum fühlt es sich für Chioma mies an, nicht mehr im Klassenchat zu sein – obwohl dort viel Streit ist?', timestamp: '20:24' },
        { type: 'main', speaker: characters.amy, content: 'Dazugehören ist für viele wichtig. Aber du musst dich nicht verstellen, um dabei zu sein. Es gibt auch andere Orte, an denen man dazugehören kann.', timestamp: '20:24' },
      ],
    },

    // ------------------------------------
    // Chapter 4 — Schülerzeitung
    // ------------------------------------
   
    {
      chapter: 4,
      messages: [

        {
  id: 's1e02c04-0001',
  type: 'system',
  kind: 'chat-switch',
scene: {
  tone: 'newsroom',
  labelKey: 'stories:chatSwitch.private',
  title: 'Redaktion Schülerzeitung', // <- leer
  participants: [{name:'Jonas'}, {name:'Chioma'}, {name:'Aylin'}, {name:'Carlos'}],
},
  timestamp: '',
},


        { type: 'other', speaker: characters.jonas, content: 'Hey Leute, ich hab Chioma auch mal eingeladen.', timestamp: '13:05' },
        { type: 'other', speaker: characters.carlos, content: 'Geht klar.', timestamp: '13:06' },
        { type: 'other', speaker: characters.aylin, content: 'Cool! Wir brauchen unbedingt jemanden, der auch mal seinen Mund aufmacht!', timestamp: '13:06' },
        { type: 'other', speaker: characters.aylin, content: 'Carlos macht die Programmierung, Jonas interessiert sich nur für Musik und ich mach die Grafik. Wenn wir niemanden für die Artikel finden, verlangt Herr A. das noch von uns 🙄', timestamp: '13:07' },

        { type: 'main', speaker: characters.chioma, content: 'Herr A.? Der Englisch-Lehrer, oder?', timestamp: '13:08' },
        { type: 'other', speaker: characters.aylin, content: 'Ja, super cool, ich weiß! Der leitet die Online-Schülerzeitung.', timestamp: '13:08' },
        { type: 'main', speaker: characters.chioma, content: 'Ach ja. Der ist echt total nett.', timestamp: '13:09' },
        { type: 'other', speaker: characters.aylin, content: 'Aber echt! Neulich hat er sogar hammer leckere Tapas mitgebracht!', timestamp: '13:09' },
        { type: 'other', speaker: characters.carlos, content: 'Ist ja gut, Aylin, wir wissen, wie toll du ihn findest.', timestamp: '13:10' },

        { type: 'other', speaker: characters.aylin, content: 'Jedenfalls haben wir genug Leute am Start, die sich um Technik-Kram kümmern, aber es fehlen uns mehr Inhalte.', timestamp: '13:11' },
      
        { type: 'system', image: '/media/story/episodes/s1e02/s1e02c04-512.webp', timestamp: '' },
      
        { type: 'main', speaker: characters.chioma, content: 'Bin auf jeden Fall dabei 👍🏾', timestamp: '13:11', reactions: [R('👍🏾')] },
        { type: 'main', speaker: characters.chioma, content: 'Ich hab da schon so eine Idee…', timestamp: '13:12' },

        { type: 'main', speaker: characters.amy, content: 'Challenge: Welche Ideen hättest du für einen Artikel in der Schülerzeitung?', timestamp: '13:13' },
        { type: 'main', speaker: characters.amy, content: 'Wenn du dein Thema hast, hilft es, kurz festzuhalten, worum es dir dabei geht und warum es dir wichtig ist. 💡', timestamp: '13:13' },
      ],
    },

    // ------------------------------------
    // Chapter 5 — Debatte: Regeln ja/nein
    // ------------------------------------
    {
      chapter: 5,
      messages: [

               {
  id: 's1e02c05-0001',
  type: 'system',
  kind: 'chat-switch',
scene: {
  tone: 'private',
  labelKey: 'stories:chatSwitch.private',
  title: '', // <- leer
  participants: [{name:'Dominik'}, {name:'Chioma'}],
},
  timestamp: '',
},

        { type: 'system', image: '/media/story/episodes/s1e02/s1e02c05-512.webp', timestamp: '18:30' },

        { type: 'main', speaker: characters.chioma, content: 'Du meinst also ein Klassenchat braucht keine Regeln?', timestamp: '18:30' },
        { type: 'other', speaker: characters.dominik, content: 'Natürlich! Meinungsfreiheit, logisch! Niemand will deine verdammten Regeln!', timestamp: '18:31' },
        { type: 'main', speaker: characters.chioma, content: 'Bist du dir da so sicher?', timestamp: '18:31' },
        { type: 'other', speaker: characters.dominik, content: 'Klar! 100%', timestamp: '18:32' },
        { type: 'main', speaker: characters.chioma, content: 'Dann hast du ja nichts zu verlieren. Lass uns das klären.', timestamp: '18:32' },
        { type: 'other', speaker: characters.dominik, content: '??', timestamp: '18:33' },
        { type: 'main', speaker: characters.chioma, content: 'Ein Gespräch zwischen dir und mir. Öffentlich. Die Schüler entscheiden.', timestamp: '18:33' },
        { type: 'main', speaker: characters.chioma, content: 'Gewinnst du, akzeptiere ich deine Gruppe. Gewinne ich, gelten Regeln.', timestamp: '18:34' },
        { type: 'other', speaker: characters.dominik, content: 'Lass das Gelaber! Du hast eh keine Chance.', timestamp: '18:35' },
        { type: 'main', speaker: characters.chioma, content: 'Na dann ist ja alles klar.', timestamp: '18:35' },
        { type: 'other', speaker: characters.dominik, content: 'Nichts ist klar. Auf so einen Dreck lass ich mich doch nicht ein.', timestamp: '18:36' },
        { type: 'main', speaker: characters.chioma, content: 'Oder hast du etwa Angst?', timestamp: '18:36' },
        { type: 'other', speaker: characters.dominik, content: 'Quatsch!', timestamp: '18:37' },
        { type: 'main', speaker: characters.chioma, content: 'Dann also morgen in der Freistunde, 10 Uhr vor Raum 116', timestamp: '18:38' },

        // next day note (system)
        { type: 'system', content: 'Nächster Tag – Freistunde.', timestamp: '' },

        { type: 'main', speaker: characters.chioma, content: 'Ach und übrigens: Die Regeln der Debatte: 1. Ausreden lassen. 2. Keine Beleidigungen. 3. Zeitlimit.', timestamp: '10:00' },
        { type: 'other', speaker: characters.dominik, content: 'Grrr', timestamp: '10:01' },

        { type: 'main', speaker: characters.amy, content: 'Warum ist es wichtig, beide Seiten zu zeigen – und nicht nur die eigene Meinung?', timestamp: '10:02' },
        { type: 'main', speaker: characters.amy, content: 'Fair ist, wenn alle ihre Sicht sagen dürfen. Nur so kann man wirklich verstehen, worum es geht.', timestamp: '10:02' },
      ],
    },

    // ------------------------------------
    // Chapter 6 — Carlos hilft
    // ------------------------------------
    {
      chapter: 6,
      messages: [

               {
  id: 's1e02c06-0001',
  type: 'system',
  kind: 'chat-switch',
scene: {
  tone: 'private',
  labelKey: 'stories:chatSwitch.private',
  title: '', // <- leer
  participants: [ {name:'Chioma'}, {name:'Carlos'}],
},
  timestamp: '',
},


        { type: 'main', speaker: characters.chioma, content: 'Carlos, ich brauche deine Hilfe!', timestamp: '12:10' },
        { type: 'other', speaker: characters.carlos, content: 'Worum geht’s?', timestamp: '12:11' },
        { type: 'main', speaker: characters.chioma, content: 'Mein Artikel, er ist nicht wirklich ein klassischer Artikel.', timestamp: '12:11' },
        { type: 'other', speaker: characters.carlos, content: 'Was meinst du?', timestamp: '12:12' },
        { type: 'main', speaker: characters.chioma, content: 'Ich möchte etwas Anderes versuchen. Interaktiv. Wozu sind wir sonst eine Online-Schülerzeitung?', timestamp: '12:12' },

        { type: 'system', image: '/media/story/episodes/s1e02/s1e02c06-512.webp', timestamp: '' },

        { type: 'other', speaker: characters.carlos, content: 'Cool. Jetzt bin ich gespannt.', timestamp: '12:13' },
        { type: 'main', speaker: characters.chioma, content: 'Das wollte ich hören 👍🏾.', timestamp: '12:13', reactions: [R('👍🏾')] },
        { type: 'main', speaker: characters.chioma, content: 'Morgen bin ich mit Dominik verabredet, um einen Audiobeitrag aufzunehmen. Dazu gibt’s einen Meinungs-Check unter den Hörern.', timestamp: '12:14' },
        { type: 'main', speaker: characters.chioma, content: 'Wärst du dabei? Könntest du das aufnehmen? Und online stellen?', timestamp: '12:14' },
        { type: 'other', speaker: characters.carlos, content: 'Immer langsam. So viele Fragen auf einmal…', timestamp: '12:15' },
        { type: 'main', speaker: characters.chioma, content: 'Und?', timestamp: '12:15' },
        { type: 'other', speaker: characters.carlos, content: 'Klingt spannend!', timestamp: '12:16' },
        { type: 'main', speaker: characters.chioma, content: 'Das heißt?', timestamp: '12:16' },
        { type: 'other', speaker: characters.carlos, content: 'Ich bin dabei 🙂', timestamp: '12:17' },

        { type: 'main', speaker: characters.amy, content: 'Wobei hast du erlebt, dass etwas zusammen besser klappt als allein?', timestamp: '12:18' },
        { type: 'main', speaker: characters.amy, content: 'Wenn etwas zusammen besser klappt, liegt das oft daran, dass jede Person etwas anderes gut kann. 💡', timestamp: '12:18' },
      ],
    },

    // ------------------------------------
    // Chapter 7 — Upload geplant, Dominik raus
    // ------------------------------------
    {
      chapter: 7,
      messages: [

                       {
  id: 's1e02c07-0001',
  type: 'system',
  kind: 'chat-switch',
scene: {
  tone: 'private',
  labelKey: 'stories:chatSwitch.private',
  title: '', // <- leer
  participants: [{name:'Dominik'}, {name:'Chioma'}, {name:'Carlos'}],
},
  timestamp: '',
},


        { type: 'other', speaker: characters.carlos, content: 'Ich hab den Beitrag fertig geschnitten.', timestamp: '16:30' },
        { type: 'other', speaker: characters.carlos, content: 'Hier der Link zum Audiobeitrag. (Link)', timestamp: '16:31' },
        { type: 'other', speaker: characters.carlos, content: '@Chioma: Dann kannst du noch die Anmoderation dazu schreiben, wenn du magst.', timestamp: '16:31' },

        { type: 'other', speaker: characters.dominik, content: 'Anmoderation?', timestamp: '16:32' },
        { type: 'other', speaker: characters.carlos, content: 'Ja, den Teaser, die Einleitung.', timestamp: '16:32' },
        { type: 'main', speaker: characters.chioma, content: 'Ist gut, mach ich.', timestamp: '16:33' },

        { type: 'other', speaker: characters.carlos, content: 'Weiterleitung (Carlos: Hier der Link zum Audiobeitrag.) Passt so?', timestamp: '16:34' },
        { type: 'main', speaker: characters.chioma, content: 'Ja.', timestamp: '16:34' },

{
  id: 's1e02c07-news-0001',
  type: 'system',
  kind: 'bonus-link',
  content: '📰 Extra: Schülerzeitung',
  linkTo: '/newspaper/chatrules-chioma-dominik',
  linkLabel: 'Jetzt öffnen',
},


       { type: 'system', image: '/media/story/episodes/s1e02/s1e02c07-512.webp', timestamp: '' },

        { type: 'other', speaker: characters.dominik, content: 'Klar, das wird easy. Ey Chioma, das wird maximal cringe für dich 🤣', timestamp: '16:35', reactions: [R('🤣')] },
        { type: 'other', speaker: characters.dominik, content: 'Und, wann geht das live?', timestamp: '16:36' },
        { type: 'other', speaker: characters.carlos, content: 'Morgen, Punkt 15:00 Uhr wird alles freigeschaltet.', timestamp: '16:36' },

        { type: 'system', content: 'Dominik left', timestamp: '16:37' },

        { type: 'other', speaker: characters.carlos, content: 'Ich hab dir zum Artikel schon ´ne kleine Umfrage gebastelt. Schau mal rein: „zur Umfrage“ (Link)', timestamp: '16:38' },
        { type: 'main', speaker: characters.chioma, content: 'Was, wenn mich morgen alle auslachen?', timestamp: '16:39' },

        { type: 'main', speaker: characters.carlos, content: 'Carlos´ Extra-Tipp: Meine Mini-Anleitung: So wird aus einer Idee ein echter Audio-Beitrag', timestamp: '16:40' },

        {
  id: 's1e02c07-news-0002',
  type: 'system',
  kind: 'bonus-link',
  content: '📰 Extra: Meine Mini-Anleitung: So wird aus einer Idee ein echter Audio-Beitrag',
  linkTo: '/newspaper/articles/tip-carlos-audio',
  linkLabel: 'Jetzt öffnen',
},

        {
  id: 's1e02c07-news-0003',
  type: 'system',
  kind: 'bonus-link',
  content: '📰 Extra: Meine Mini-Anleitung: So erstellst du eine Umfrage',
  linkTo: '/newspaper/articles/tip-carlos-survey',
  linkLabel: 'Jetzt öffnen',
},

        { type: 'main', speaker: characters.amy, content: 'Warum wärst du eher für Chatregeln – oder warum eher dagegen?', timestamp: '16:41' },
        { type: 'main', speaker: characters.amy, content: 'Gute Regeln sollen schützen. Sie sollen helfen, nicht nerven.', timestamp: '16:41' },
      ],
    },

    // ------------------------------------
    // Chapter 8 — Regeln der Schülerzeitung
    // ------------------------------------
    {
      chapter: 8,
      messages: [

                {
  id: 's1e02c08-0001',
  type: 'system',
  kind: 'chat-switch',
scene: {
  tone: 'newsroom',
  labelKey: 'stories:chatSwitch.private',
  title: 'Redaktion Schülerzeitung', // <- leer
  participants: [{name:'Jonas'}, {name:'Chioma'}, {name:'Aylin'}, {name:'Carlos'}],
},
  timestamp: '',
},

        { type: 'system', image: '/media/story/episodes/s1e02/s1e02c08-512.webp', timestamp: '' },

        { type: 'other', speaker: characters.aylin, content: 'War doch eine super Redaktionssitzung 🤩', timestamp: '14:40', reactions: [R('🤩')] },
        { type: 'other', speaker: characters.aylin, content: 'Bestätigt nur noch kurz, dass Herr A. sein OK für eure Artikel gegeben hat. Und dann geht die neue Ausgabe um Punkt 15 Uhr online 🚀', timestamp: '14:41' },
        { type: 'other', speaker: characters.aylin, content: 'Umfrage mit Check-Box: „📋 Bitte abhaken, wenn ihr Herrn A.s Bestätigung eingeholt habt”', timestamp: '14:41' },

        { type: 'main', speaker: characters.chioma, content: 'Warte mal. OK von Herrn A.?', timestamp: '14:42' },
        { type: 'other', speaker: characters.aylin, content: 'Ja, natürlich.', timestamp: '14:42' },
        { type: 'other', speaker: characters.carlos, content: 'Herr A. muss jeden Artikel absegnen, bevor wir ihn veröffentlichen dürfen.', timestamp: '14:43' },

        { type: 'main', speaker: characters.chioma, content: 'Okay…', timestamp: '14:43' },
        { type: 'main', speaker: characters.chioma, content: 'Muss das unbedingt vorher sein?', timestamp: '14:44' },

        { type: 'other', speaker: characters.aylin, content: 'Ja, sicher. Carlos, hast du Chioma nicht gefragt, als sie dir den Artikel geschickt hat?', timestamp: '14:44' },
        { type: 'other', speaker: characters.carlos, content: 'Ich dachte, das wär klar. Ist doch Regel Nummer 2: „Jeder Artikel muss vor der Veröffentlichung genehmigt werden.”', timestamp: '14:45' },

        { type: 'main', speaker: characters.chioma, content: 'Und was ist Regel Nummer 1?', timestamp: '14:46' },
        { type: 'other', speaker: characters.carlos, content: 'Auf dem großen Wandplakat steht’s: „Keine Fake News!”', timestamp: '14:46' },
        { type: 'other', speaker: characters.carlos, content: 'Ohne Regeln müssten wir alles jedes Mal neu ausdiskutieren.', timestamp: '14:47' },

        { type: 'main', speaker: characters.chioma, content: 'Das leuchtet ein. Aber…', timestamp: '14:48' },
        { type: 'other', speaker: characters.aylin, content: 'So können wir das leider nicht veröffentlichen, tut mir leid. Aber dein Artikel kann ja in die Ausgabe vom nächsten Monat 📅', timestamp: '14:48' },
        { type: 'main', speaker: characters.chioma, content: 'Was?? Das ist noch viel zu lange hin. Könnt ihr nicht noch bis morgen mit der Veröffentlichung warten?', timestamp: '14:49' },
        { type: 'other', speaker: characters.aylin, content: 'Das geht leider nicht. Sorry!', timestamp: '14:49' },
        { type: 'other', speaker: characters.aylin, content: 'Worüber ist dein Artikel eigentlich, Chioma?', timestamp: '14:50' },
        { type: 'main', speaker: characters.chioma, content: 'Em…', timestamp: '14:50' },
        { type: 'main', speaker: characters.chioma, content: 'Regeln im Klassenchat', timestamp: '14:51' },
        { type: 'other', speaker: characters.aylin, content: 'Hm 🤔 Das ist… interessant.', timestamp: '14:52', reactions: [R('🤔')] },

        { type: 'main', speaker: characters.amy, content: 'Wie fühlt sich Chioma in diesem Kapitel – und welche Emojis passen dazu?', timestamp: '14:53' },
        { type: 'main', speaker: characters.amy, content: 'Wenn du Gefühle anderer erkennst, kannst du besser reagieren. Manchmal helfen Emojis.', timestamp: '14:53' },
      ],
    },

    // ------------------------------------
    // Chapter 9 — Platzhalter-Link Trick
    // ------------------------------------
    {
      chapter: 9,
      messages: [

               {
  id: 's1e02c09-0001',
  type: 'system',
  kind: 'chat-switch',
scene: {
  tone: 'private',
  labelKey: 'stories:chatSwitch.private',
  title: '', // <- leer
  participants: [ {name:'Chioma'}, {name:'Carlos'}],
},
  timestamp: '',
},

        { type: 'system', image: '/media/story/episodes/s1e02/s1e02c09-512.webp', timestamp: '' },

        { type: 'main', speaker: characters.chioma, content: 'Das ist kaum auszuhalten. Herr A. antwortet einfach nicht. Ich hab’s schon so oft probiert.', timestamp: '14:50' },
        { type: 'other', speaker: characters.carlos, content: 'Er ist bei einer Konferenz, das kannst du vergessen.', timestamp: '14:51' },

        { type: 'main', speaker: characters.chioma, content: 'Verdammt! Das war so wichtig für mich! Kannst du nicht vielleicht doch…?', timestamp: '14:52' },
        { type: 'other', speaker: characters.carlos, content: 'Dein Beitrag ist echt gut. Endlich mal was Ehrliches, die ganze Schule würde das hören!', timestamp: '14:52' },
        { type: 'other', speaker: characters.carlos, content: 'Ich will auch nicht einen Monat warten, dann ist das Schnee von gestern.', timestamp: '14:53' },
        { type: 'other', speaker: characters.carlos, content: 'Aber wenn ich den einfach ohne Genehmigung hochlade, bin ICH dran.', timestamp: '14:53' },

        { type: 'main', speaker: characters.chioma, content: 'Könntest du mir etwas mehr Zeit geben? Ausnahmsweise?', timestamp: '14:54' },
        { type: 'other', speaker: characters.carlos, content: 'Der Upload ist um 15:00 Uhr – automatisch 😬', timestamp: '14:54' },
        { type: 'other', speaker: characters.carlos, content: 'Dann wird an alle Schüler der Newsletter mit der frischen Ausgabe verschickt.', timestamp: '14:55' },
        { type: 'other', speaker: characters.carlos, content: 'Wenn wir deinen Beitrag nachträglich hochladen, erscheint er nicht im Newsletter 😬', timestamp: '14:55' },

        { type: 'other', speaker: characters.carlos, content: 'Ich muss los.', timestamp: '14:56' },
        { type: 'main', speaker: characters.chioma, content: 'Warte', timestamp: '14:56' },
        { type: 'main', speaker: characters.chioma, content: 'Ich hab eine Idee!', timestamp: '14:57' },
        { type: 'other', speaker: characters.carlos, content: 'Chioma, akzeptier doch, dass es nicht mehr geht.', timestamp: '14:57' },
        { type: 'main', speaker: characters.chioma, content: 'Vielleicht doch!', timestamp: '14:57' },
        { type: 'main', speaker: characters.chioma, content: 'Tu doch einfach so, als wäre der Beitrag schon da.', timestamp: '14:58' },
        { type: 'other', speaker: characters.carlos, content: 'Hä, was?', timestamp: '14:58' },
        { type: 'main', speaker: characters.chioma, content: 'Ja, du erstellst schon die Seite, auf der der Artikel mit dem Audio-Beitrag erscheinen wird.', timestamp: '14:58' },
        { type: 'other', speaker: characters.carlos, content: 'Wie bitte? Warum sollte ich das tun?', timestamp: '14:59' },
        { type: 'main', speaker: characters.chioma, content: 'Damit du im Newsletter schon den richtigen Link setzen kannst 😊', timestamp: '14:59' },
        { type: 'other', speaker: characters.carlos, content: 'Aber da steht nur ein Platzhalter! Und sobald die Freigabe da ist…', timestamp: '14:59' },
        { type: 'other', speaker: characters.carlos, content: 'Got it! Ja, das könnte klappen.', timestamp: '14:59' },

        { type: 'main', speaker: characters.chioma, content: 'Ich schreib schnell einen Text.', timestamp: '14:59' },
        { type: 'other', speaker: characters.carlos, content: 'Es ist schon fast 3 Uhr, beeil dich! Ich bereite die Artikel-Verlinkung vor.', timestamp: '14:59' },

        { type: 'other', speaker: characters.carlos, content: '14:56 – Hast du’s?', timestamp: '14:56' },
        { type: 'main', speaker: characters.chioma, content: 'Fast.', timestamp: '14:57' },
        { type: 'other', speaker: characters.carlos, content: 'Beeil dich!', timestamp: '14:58' },

        { type: 'main', speaker: characters.chioma, content: '„Über diesen Link werdet ihr zu Chiomas Artikel kommen, sobald er freigegeben wurde. Ich hoffe, ihr versteht.“ (Entwurf)', timestamp: '14:58' },
        { type: 'other', speaker: characters.carlos, content: 'Grrr, abgestürzt.', timestamp: '14:59' },
        { type: 'main', speaker: characters.chioma, content: 'Waaaas??', timestamp: '14:59' },
        { type: 'other', speaker: characters.carlos, content: 'Reingelegt 😊 Done!', timestamp: '15:00' },
        { type: 'main', speaker: characters.chioma, content: 'Yay!', timestamp: '15:00' },
        { type: 'other', speaker: characters.carlos, content: 'Freu dich nicht zu früh! Jetzt darf uns Herr A. nicht für diese Aktion den Kopf abreißen!', timestamp: '15:00' },

        { type: 'main', speaker: characters.amy, content: 'Was könnte passieren, wenn Artikel veröffentlicht werden, ohne sie vorher zu prüfen?', timestamp: '15:01' },
        { type: 'main', speaker: characters.amy, content: 'Wer veröffentlicht, trägt Verantwortung. Eine zweite Meinung hilft, damit Beiträge fair und glaubwürdig bleiben – und niemand verletzt wird.', timestamp: '15:01' },
      ],
    },

    // ------------------------------------
    // Chapter 10 — Wirkung & Cliffhanger
    // ------------------------------------
    {
      chapter: 10,
      messages: [


{
  id: 's1e02c10-0001',
  type: 'system',
  kind: 'chat-switch',
  timestamp: '',
scene: {
  tone: 'class',
  labelKey: 'stories:chatSwitch.class',
  title: 'Klasse 7b',
  participants: [], // <- leer lassen
}
},

        // Klassenchat
        { type: 'other', speaker: characters.dominik, content: 'Wow. 58 %. Glückwunsch. Demokratie und so 🙄 Wer hätte gedacht, dass hier so viele Verräter sitzen?!', timestamp: '15:05' },
        { type: 'other', speaker: characters.jonas, content: 'Glückwunsch, Chioma, tolles Interview! Wie hast du’s doch noch rechtzeitig geschafft?', timestamp: '15:06' },
        { type: 'main', speaker: characters.chioma, content: 'Naja, gaaanz rechtzeitig nicht. Aber ich hab auf Herrn A. vor der Konferenz gewartet und er hat sein OK noch gegeben.', timestamp: '15:07' },
        { type: 'main', speaker: characters.chioma, content: 'Bestimmt hatte noch kaum jemand den Link geöffnet.', timestamp: '15:07' },
        { type: 'other', speaker: characters.dominik, content: 'Nice 🙄', timestamp: '15:08' },

        { type: 'other', speaker: characters.tom, content: 'Wovon sprecht ihr eigentlich?', timestamp: '15:08' },
        { type: 'other', speaker: characters.finn, content: 'Typisch! Hattest du dein Handy wieder nicht am Start?', timestamp: '15:09' },
        { type: 'other', speaker: characters.tom, content: 'Nee. Wieso, was war?', timestamp: '15:09' },
        { type: 'other', speaker: characters.finn, content: 'Hör selbst: (Link)', timestamp: '15:10' },
        { type: 'other', speaker: characters.tom, content: 'Respekt! Klare Sache.', timestamp: '15:11' },

        { type: 'other', speaker: characters.dominik, content: 'Grrr. Und das heißt jetzt, ich darf nicht mehr schreiben, was ich will?', timestamp: '15:12' },
        { type: 'main', speaker: characters.chioma, content: 'Niemand wird gezwungen, hier zu bleiben. Aber wer bleibt, hält sich dran.', timestamp: '15:13' },
        { type: 'other', speaker: characters.dominik, content: 'Hält sich woran??', timestamp: '15:13' },
        { type: 'main', speaker: characters.chioma, content: 'An das, was wir gemeinsam abstimmen.', timestamp: '15:14' },

        {
  id: 's1e02c07-news-0004',
  type: 'system',
  kind: 'bonus-link',
  content: '📰 Extra: Chiomas Anleitung für Gruppenchats',
  linkTo: '/newspaper/articeles/news-audio-chatrules',
  linkLabel: 'Jetzt öffnen',
},

          {
  id: 's1e02c10-0002',
  type: 'system',
  kind: 'chat-switch',
scene: {
  tone: 'newsroom',
  labelKey: 'stories:chatSwitch.private',
  title: 'Redaktion Schülerzeitung', // <- leer
  participants: [{name:'Jonas'}, {name:'Chioma'}, {name:'Aylin'}, {name:'Carlos'}],
},
  timestamp: '',
},

        // Privatchat Schülerzeitung
        { type: 'other', speaker: characters.jonas, content: 'Krass! Es hat geklappt 🥳', timestamp: '15:16', reactions: [R('🥳')] },
        { type: 'other', speaker: characters.aylin, content: 'Und Chioma? Fühlt es sich gut an? Dein erster Beitrag gleich so eine Wirkung!', timestamp: '15:16' },
        { type: 'main', speaker: characters.chioma, content: 'Ja kaum zu glauben. Genial!!', timestamp: '15:17' },
        { type: 'main', speaker: characters.chioma, content: '… Aber auch komisch.', timestamp: '15:17' },
        { type: 'other', speaker: characters.jonas, content: 'Wieso?', timestamp: '15:18' },
        { type: 'main', speaker: characters.chioma, content: 'Weil Regeln nur helfen, wenn man sich auch dran hält.', timestamp: '15:18' },
        { type: 'main', speaker: characters.chioma, content: 'Ich glaub, das hier war erst der Anfang.', timestamp: '15:19' },

        { type: 'main', speaker: characters.amy, content: 'Was würdest du dir in einem Chat wünschen, damit sich alle sicher fühlen?', timestamp: '15:20' },
        { type: 'main', speaker: characters.amy, content: 'Sicherheit entsteht, wenn man respektvoll miteinander umgeht. Gute Absprachen helfen dabei. 💡 Schau dir gern Chiomas Vorschlag an und überlege, was dir helfen würde.', timestamp: '15:20' },
      ],
    },
     ],


epilogue: [
  {
    id: 's1e02_ep_0001',
    type: 'system',
    kind: 'chat-switch',
    scene: {
      tone: 'private',
      labelKey: 'stories:chatSwitch.newsroom',
      title: '',
      participants: [{name:'Lisa'}, {name:'Chioma'}, {name:'Yasmin'}],
    },
    timestamp: '',
  },

        // Cliffhanger: Wasserfall / Bild gelöscht

        { type: 'system', image: '/media/story/episodes/s1e02/s1e02c10-512.webp', timestamp: '' },

        { type: 'other', speaker: characters.lisa, content: 'Ich hab da noch was gehört übrigens …', timestamp: '18:10' },
        { type: 'other', speaker: characters.yasmin, content: 'Über wen?', timestamp: '18:10' },
        { type: 'other', speaker: characters.lisa, content: 'Sag ich euch später, bin beschäftigt. Schaut mal:', timestamp: '18:11' },
        { type: 'other', speaker: characters.lisa, content: '(Foto vom coolen Wasserfall)', timestamp: '18:11' },

        { type: 'system', content: 'Bild wurde gelöscht.', timestamp: '18:12' },

        { type: 'system', content: 'Zeitlich später…', timestamp: '18:35' },

        { type: 'other', speaker: characters.yasmin, content: 'Boah, das Bild wurde schon zig-mal geteilt.', timestamp: '18:36' },
        { type: 'other', speaker: characters.mia, content: 'Warte mal …', timestamp: '18:36' },
        { type: 'other', speaker: characters.mia, content: 'Lisa, warum ist das Foto plötzlich weg?', timestamp: '18:37' },

        { type: 'system', content: 'Beitrag gelöscht.', timestamp: '18:37' },
  ],
};

export default course;
