// src/content/courses/de/s1e01.ts
import type { Course, Reaction } from '../../../common/types';
import { STORY_CHARACTERS as characters } from '../../characters';

const R = (emoji: string, type?: string): Reaction => ({ emoji, type });

const course: Course = {
  id: 's1e01', // ✅ MUST match contentIndex.courseId

  // ❗ Platzhalter – NICHT im UI verwenden
  title: '',
  image: '',
  description: '',

  script: [


    // ------------------------------------
    // Chapter 1 — Klassenchat: Ferienende
    // ------------------------------------
    {
      chapter: 1,
      messages: [

        {
          id: 's1e01c01-0001',
          type: 'system',
          kind: 'chat-switch',
          scene: {
            tone: 'private',
            labelKey: 'stories:chatSwitch.private',
            title: '',
            participants: [{ name: 'Amy' }],
          },
          timestamp: '',
        },
         // Amy Intro

        { id: 's1e01c01-0002', type: 'main', speaker: characters.amy, content: 'Der Klassenchat war die ganze Woche still.', timestamp: '10:05' },
        { id: 's1e01c01-0003', type: 'main', speaker: characters.amy, content: 'Es war einer dieser Samstage, an denen nichts Besonderes passiert.', timestamp: '10:06',},
        { id: 's1e01c01-0004', type: 'main', speaker: characters.amy, content: 'Und genau an solchen Tagen passiert manchmal etwas scheinbar Unbedeutendes, das alles verändert…', timestamp: '10:06',},

        {
          id: 's1e01c01-0005',
          type: 'system',
          kind: 'chat-switch',
          scene: {
            tone: 'class',
            labelKey: 'stories:chatSwitch.class',
            title: 'Klasse 7b',
            participants: [],
          },
          timestamp: '',
        },

        // Klassenchat
        { id: 's1e01c01-0006', type: 'other', speaker: characters.carlos, content: 'Seid ihr schon alle zurück aus dem Urlaub? Letztes Ferienwochenende, dann geht es wieder los.', timestamp: '11:12' },
        { id: 's1e01c01-0007', type: 'other', speaker: characters.finn, content: 'hör bloß auf', timestamp: '11:13' },
        { id: 's1e01c01-0008', type: 'other', speaker: characters.jonas, content: 'Aylin ist noch bei ihrer Oma in der Türkei, glaub ich.', timestamp: '11:13' },
        { id: 's1e01c01-0009', type: 'other', speaker: characters.finn, content: 'lol, die sitzt doch den ganzen tag am rechner und bastelt an ihren bildern rum', timestamp: '11:14' },
        { id: 's1e01c01-0010', type: 'other', speaker: characters.carlos, content: 'Einige von ihren KI-Bildern sind wirklich stark 👍.', timestamp: '11:14' },
        { id: 's1e01c01-0011', type: 'other', speaker: characters.jonas, content: 'Und ist Dominik nicht im Sportcamp?', timestamp: '11:14' },
        { id: 's1e01c01-0012', type: 'other', speaker: characters.dominik, content: 'Längst zurück, Bro.', timestamp: '11:15' },
        { id: 's1e01c01-0013', type: 'other', speaker: characters.finn, content: 'von lisa hab ich bilder aus italien gesehen und dann aus paris', timestamp: '11:15' },
        { id: 's1e01c01-0014', type: 'other', speaker: characters.yasmin, content: 'Ja.', timestamp: '11:16' },
        { id: 's1e01c01-0015', type: 'other', speaker: characters.yasmin, content: 'Sie war viel unterwegs.', timestamp: '11:16' },
        { id: 's1e01c01-0016', type: 'other', speaker: characters.yasmin, content: 'Auch in Schottland.', timestamp: '11:16' },
        { id: 's1e01c01-0017', type: 'other', speaker: characters.finn, content: 'nicht übel. du warst in schottland?', timestamp: '11:17' },
        { id: 's1e01c01-0018', type: 'other', speaker: characters.yasmin, content: 'Nicht ich 😞', timestamp: '11:17' },
        { id: 's1e01c01-0019', type: 'other', speaker: characters.yasmin, content: 'Lisa natürlich.', timestamp: '11:17' },
        { id: 's1e01c01-0020', type: 'other', speaker: characters.yasmin, content: 'Ich war die ganzen Ferien hier 🥱', timestamp: '11:18' },

        // Foto: Lisa aus Südfrankreich (S1e01c01_1)
        { id: 's1e01c01-0021', type: 'other', speaker: characters.lisa, image: '/media/story/episodes/s1e01/s1e01c01_1-512.webp', content: 'Viele Grüße aus Südfrankreich 😘', timestamp: '11:19', reactions: [R('❤️'), R('🤩'), R('❤️'), R('🔥')] },


        { id: 's1e01c01-0023', type: 'other', speaker: characters.tom, content: 'klasse 🤩', timestamp: '11:20' },

        { id: 's1e01c01-0024', type: 'other', speaker: characters.dominik, content: 'Krass 🔥', timestamp: '11:20' },
        { id: 's1e01c01-0025', type: 'other', speaker: characters.igor, content: 'Bist du in den Cevennen ⛰️?', timestamp: '11:20' },
        { id: 's1e01c01-0026', type: 'other', speaker: characters.lisa, content: 'Ja. Das hast du erkannt?', timestamp: '11:21' },
        { id: 's1e01c01-0027', type: 'other', speaker: characters.igor, content: 'War auch mal da. Geile Views. Perfekt für ein Stunt-Video 😭🔥', timestamp: '11:21' },
        { id: 's1e01c01-0028', type: 'other', speaker: characters.lisa, content: 'Mega. Dann weißt du ja, wie besonders es dort ist.', timestamp: '11:22', reactions: [R('👍')] },
        { id: 's1e01c01-0029', type: 'other', speaker: characters.lisa, content: 'So lecker - die Croissants!', timestamp: '11:22' },
        { id: 's1e01c01-0030', type: 'other', speaker: characters.lisa, content: 'Und diese duftenden Lavendelfelder….', timestamp: '11:23' },
        { id: 's1e01c01-0031', type: 'other', speaker: characters.lisa, content: 'Jeden Tag Sonne ☀️', timestamp: '11:23' },
        { id: 's1e01c01-0032', type: 'other', speaker: characters.igor, content: 'In Frankreich wär ich jetzt auch gern - hier regnet es.', timestamp: '11:24' },
        { id: 's1e01c01-0033', type: 'other', speaker: characters.lisa, content: 'Mit mir? ☺️', timestamp: '11:24' },
        { id: 's1e01c01-0034', type: 'other', speaker: characters.lisa, content: 'Hier scheint die Sonne 😎☀️', timestamp: '11:25' },
        { id: 's1e01c01-0035', type: 'other', speaker: characters.lisa, content: 'Yasmin? Du bist heute so still 🤔', timestamp: '11:26' },
        { id: 's1e01c01-0037', type: 'other', speaker: characters.yasmin, content: 'Kommst du heute zurück?', timestamp: '11:26' },
        { id: 's1e01c01-0038', type: 'other', speaker: characters.lisa, content: 'Nein, einen Tag hab ich noch. Morgen fliegen wir zurück. Puh und übermorgen geht die Schule dann schon wieder los.', timestamp: '11:27' },
        { id: 's1e01c01-0039', type: 'other', speaker: characters.carlos, content: 'Klingt richtig gut 🙂. Das Foto am Wasserfall ist stark.', timestamp: '11:28' },
        { id: 's1e01c01-0040', type: 'other', speaker: characters.carlos, content: 'Schicke gern bei Gelegenheit noch mal eins.', timestamp: '11:28' },
        { id: 's1e01c01-0041', type: 'other', speaker: characters.carlos, content: 'Ich schau mir die Gegend gerade in Google Earth an - die 3D-Ansichten sind ziemlich gut. Fühlt sich fast so an, als wär man dort 👍', timestamp: '11:29' },

        // Foto: Wasserfall (s1e01c01_2)
        { id: 's1e01c01-0042', type: 'other', speaker: characters.lisa, content: '❤️', timestamp: '11:30'},
        { id: 's1e01c01-0043', type: 'other', speaker: characters.lisa, image: '/media/story/episodes/s1e01/s1e01c01_2-512.webp', content: '', timestamp: '11:30'},

        { id: 's1e01c01-0044', type: 'other', speaker: characters.carlos, content: 'Super!', timestamp: '11:31' },
        { id: 's1e01c01-0045', type: 'other', speaker: characters.tom, content: 'Genial.', timestamp: '11:31' },
        { id: 's1e01c01-0046', type: 'other', speaker: characters.dominik, content: 'Respekt 🔥.', timestamp: '11:31' },

        // Tippen/Löschen
        { id: 's1e01c01-0047', type: 'system', content: 'Yasmin tippt ...', timestamp: '' },
        { id: 's1e01c01-0048', type: 'system', content: 'Yasmin löscht', timestamp: '' },

        { id: 's1e01c01-0049', type: 'other', speaker: characters.yasmin, content: 'Carlos, wie wars bei deiner Oma in Spanien?', timestamp: '11:33' },



        // Reflexion (Amy)
        {
          id: 's1e01c01-0051',
          type: 'main',
          speaker: characters.amy,
          kind: 'amy-question',
          content: 'Yasmin scheint nicht zu wissen, was sie schreiben soll. Was würdest du an ihrer Stelle in den Klassenchat posten?',
          timestamp: '',
        },
        {
          id: 's1e01c01-0052',
          type: 'main',
          speaker: characters.amy,
          kind: 'amy-tip',
          content:
            'Man muss im Gruppenchat nicht immer reagieren. Wenn du gerade nichts Produktives oder Nettes zu sagen hast, ist es immer ok, gar nichts zu posten. Das ist besser als etwas zu schreiben, das man später bereut.',
          timestamp: '',
        },


                // “1. Eintrag Yasmin”
{
  id: 's1e01c01-bonus-diary-yasmin-1',
  type: 'system',
  kind: 'bonus-link',
  content: 'Bonus: Möchtest du wissen, was Yasmin denkt?',
  linkTo: '/diaries/diary_yasmin?entry=s1e01c01_0001',
  linkLabel: 'Eintrag öffnen →',
  bonusId: 'diary-yasmin-entry1',
},

      ],
    },

    // ------------------------------------
    // Chapter 2 — Privatchat Igor - Yasmin + Klassenchat Bike
    // ------------------------------------
    {
      chapter: 2,
      messages: [
        {
          id: 's1e01c02-0001',
          type: 'system',
          kind: 'chat-switch',
          scene: {
            tone: 'private',
            labelKey: 'stories:chatSwitch.private',
            title: '',
            participants: [{ name: 'Igor' }, { name: 'Yasmin' }],
          },
          timestamp: '',
        },

        // Privatchat Igor - Yasmin
        { id: 's1e01c02-0002', type: 'other', speaker: characters.igor, content: 'Letzter Ferientag 😬', timestamp: '12:04' },
        { id: 's1e01c02-0003', type: 'other', speaker: characters.igor, content: 'Bock abzuhängen? Grieswald-Berge. War da noch nie, obwohl´s echt nicht weit ist. Will da mal mit´m Bike runter 🚵‍♂️🔥', timestamp: '12:05' },
        { id: 's1e01c02-0004', type: 'system', content: 'Yasmin tippt ...', timestamp: '' },
        { id: 's1e01c02-0005', type: 'system', content: 'Yasmin löscht', timestamp: '' },
        { id: 's1e01c02-0006', type: 'system', content: 'Yasmin tippt ...', timestamp: '' },
        { id: 's1e01c02-0007', type: 'other', speaker: characters.yasmin, content: 'Vielleicht 🤷', timestamp: '12:06' },
        { id: 's1e01c02-0008', type: 'other', speaker: characters.igor, content: 'Kannst ja Lisa mitbringen?', timestamp: '12:06' },
        { id: 's1e01c02-0009', type: 'other', speaker: characters.yasmin, content: 'Lisa?', timestamp: '12:07' },
        { id: 's1e01c02-0010', type: 'other', speaker: characters.igor, content: 'Ja, warum nicht?', timestamp: '12:07' },
        { id: 's1e01c02-0011', type: 'other', speaker: characters.yasmin, content: 'Ist nicht da.', timestamp: '12:07' },
        { id: 's1e01c02-0012', type: 'other', speaker: characters.igor, content: 'Ach ja.', timestamp: '12:08' },
        { id: 's1e01c02-0013', type: 'other', speaker: characters.igor, content: 'Also, kommst du?', timestamp: '12:08' },
        { id: 's1e01c02-0014', type: 'other', speaker: characters.yasmin, content: 'Und ich darf Filmchen von deinen Stunts drehen?', timestamp: '12:09' },
        { id: 's1e01c02-0015', type: 'other', speaker: characters.yasmin, content: 'Nee.', timestamp: '12:09' },
        { id: 's1e01c02-0016', type: 'other', speaker: characters.yasmin, content: 'Kann nicht.', timestamp: '12:09' },
        { id: 's1e01c02-0017', type: 'other', speaker: characters.igor, content: 'Okay 😅', timestamp: '12:10' },
        { id: 's1e01c02-0018', type: 'other', speaker: characters.igor, content: 'Dann vielleicht später.', timestamp: '12:10' },
        { id: 's1e01c02-0019', type: 'other', speaker: characters.igor, content: 'Lukas kommt auch.', timestamp: '12:10' },
        { id: 's1e01c02-0020', type: 'system', content: 'Lukas hinzugefügt.', timestamp: '12:11' },

        // Switch: Klassenchat
        {
          id: 's1e01c02-0021',
          type: 'system',
          kind: 'chat-switch',
          scene: {
            tone: 'class',
            labelKey: 'stories:chatSwitch.class',
            title: 'Klasse 7b',
            participants: [],
          },
          timestamp: '',
        },

        { id: 's1e01c02-0022', type: 'other', speaker: characters.lukas, image: '/media/story/episodes/s1e01/s1e01c02_1-512.webp', content: '', timestamp: '13:12', reactions: [R('🔥')] },
    

        { id: 's1e01c02-0024', type: 'other', speaker: characters.lukas, content: 'Igor ist heute wirklich on fire 🤓🚵‍♂️', timestamp: '13:13' },
        { id: 's1e01c02-0025', type: 'other', speaker: characters.igor, content: 'Haben hier ein cooles Plätzchen gefunden.', timestamp: '13:13' },
        { id: 's1e01c02-0026', type: 'other', speaker: characters.igor, content: 'Felsige Abhänge, ein rauschender Fluss und voll wenig Leute hier.', timestamp: '13:14' },

                {
  id: 's1e01c02-audio-0001',
  type: 'audio',
  speaker: characters.chioma,
  audioSrc: '/media/story/episodes/s1e01/chiomas-sprachnachricht-s1e01c01.mp3',
  timestamp: '13:14'
},

        { id: 's1e01c02-0028', type: 'other', speaker: characters.lisa, content: 'Sieht mega aus 😍', timestamp: '13:15' },
        { id: 's1e01c02-0029', type: 'other', speaker: characters.lisa, image: '/media/story/episodes/s1e01/s1e01c02_2-512.webp', content: '', timestamp: '13:15', reactions: [R('❤️')] },

        { id: 's1e01c02-0031', type: 'other', speaker: characters.igor, content: 'Nice.', timestamp: '13:16' },
        { id: 's1e01c02-0032', type: 'system', content: 'Yasmin tippt ...', timestamp: '' },
        { id: 's1e01c02-0033', type: 'system', content: 'Yasmin löscht', timestamp: '' },
        { id: 's1e01c02-0034', type: 'system', content: 'Yasmin tippt ...', timestamp: '' },
        { id: 's1e01c02-0035', type: 'other', speaker: characters.yasmin, content: 'Cool.', timestamp: '13:17' },
        { id: 's1e01c02-0036', type: 'system', content: 'Yasmins Nachricht wurde gelöscht.', timestamp: '' },
        { id: 's1e01c02-0037', type: 'other', speaker: characters.yasmin, content: 'Ach, Lukas musst duuu jetzt filmen??', timestamp: '13:18' },

        { id: 's1e01c02-0038', type: 'other', speaker: characters.lukas, content: 'Du sagst es. Dabei könnte ich jetzt gepflegt zu Hause sitzen und Schach spielen 😅', timestamp: '13:18' },
        { id: 's1e01c02-0039', type: 'other', speaker: characters.lukas, content: 'Yasmin, du hattest doch nach einem „spektakulären Wasserfall” hier in der Nähe gefragt. Weiter flussabwärts soll einer sein. Ob der „spektakulär” ist, weiß ich allerdings nicht.', timestamp: '13:19' },
        { id: 's1e01c02-0040', type: 'other', speaker: characters.yasmin, content: 'Ich habe gar nicht gefragt!', timestamp: '13:20' },
        { id: 's1e01c02-0041', type: 'other', speaker: characters.lukas, content: 'Wie? Ich meine heute morgen.', timestamp: '13:20' },
        { id: 's1e01c02-0042', type: 'other', speaker: characters.yasmin, content: 'Hab ich nicht. War wohl ein Missverständnis.', timestamp: '13:21' },


        // Reflexion (Amy)
        { id: 's1e01c02-0043', type: 'main', speaker: characters.amy, kind: 'amy-question', content: 'Die Posts von Igor, Lukas und Lisa wirken richtig cool. Wie könnten sich die Mitschüler fühlen, die gerade nichts Cooles erleben und warum? ', timestamp: '' },
        {
          id: 's1e01c02-0044',
          type: 'main',
          speaker: characters.amy,
          kind: 'amy-tip',
          content: 'Manchmal fühlt es sich unangenehm an, wenn Andere coole Selfies posten. Dieses Gefühl nennt man FOMO („Fear of Missing Out“). Es ist das Gefühl, etwas zu verpassen, weil andere es gerade zeigen. ',
          timestamp: '',
        },
      ],
    },

    // ------------------------------------
    // Chapter 3 — Privatchat Igor, Lukas, Yasmin + Privatchat Yasmin, Lisa
    // ------------------------------------
    {
      chapter: 3,
      messages: [
        {
          id: 's1e01c03-0001',
          type: 'system',
          kind: 'chat-switch',
          scene: {
            tone: 'private',
            labelKey: 'stories:chatSwitch.private',
            title: '',
            participants: [{ name: 'Igor' }, { name: 'Lukas' }, { name: 'Yasmin' }],
          },
          timestamp: '',
        },

        // Privatchat Igor, Lukas, Yasmin
        { id: 's1e01c03-0002', type: 'other', speaker: characters.yasmin, content: 'Wo seid ihr eigentlich genau?', timestamp: '13:35' },
        { id: 's1e01c03-0003', type: 'other', speaker: characters.igor, content: 'kp 😂', timestamp: '13:35' },
        { id: 's1e01c03-0004', type: 'other', speaker: characters.igor, content: 'Irgendwo im Wald. Richtig cool hier.', timestamp: '13:36' },
        { id: 's1e01c03-0005', type: 'other', speaker: characters.lukas, content: 'Ich habe meinen Standort geteilt, dann siehst du es genau.', timestamp: '13:36' },
        { id: 's1e01c03-0006', type: 'other', speaker: characters.lukas, content: 'Ich bin ehrlich gesagt ziemlich erschöpft.', timestamp: '13:37' },
        { id: 's1e01c03-0007', type: 'other', speaker: characters.lukas, image: '/media/story/episodes/s1e01/s1e01c03_1-512.webp',content: '', timestamp: '13:37' },
        { id: 's1e01c03-0009', type: 'other', speaker: characters.lukas, content: 'Ich hoffe nur, es ist nicht mehr allzu weit. Meine Kräfte sind nicht unbegrenzt. Aber ehrlich: Die Gegend hier ist unglaublich schön.', timestamp: '13:38' },
        { id: 's1e01c03-0010', type: 'other', speaker: characters.yasmin, content: 'Und da ist ein Wasserfall?', timestamp: '13:39' },
        { id: 's1e01c03-0011', type: 'other', speaker: characters.lukas, content: 'Ich sehe ihn noch nicht. Wir sind noch ein Stück weit entfernt.', timestamp: '13:39' },
        { id: 's1e01c03-0012', type: 'other', speaker: characters.lukas, content: 'Igor wollte für seine Stunts unbedingt hierher – sehr abenteuerlich 😬', timestamp: '13:40' },
        { id: 's1e01c03-0013', type: 'other', speaker: characters.igor, content: 'Überleg doch, ob du nicht doch kommen möchtest.', timestamp: '13:41' },
        { id: 's1e01c03-0014', type: 'other', speaker: characters.yasmin, content: 'Klingt ganz cool.', timestamp: '13:41' },
        { id: 's1e01c03-0015', type: 'other', speaker: characters.yasmin, content: 'Aber mit dem Rad? 😝', timestamp: '13:41' },
        { id: 's1e01c03-0016', type: 'other', speaker: characters.yasmin, content: 'Ich weiß nicht…', timestamp: '13:42' },
        { id: 's1e01c03-0017', type: 'other', speaker: characters.lukas, content: 'Die Bahnstation liegt nicht weit vom Bach entfernt.', timestamp: '13:42' },
        { id: 's1e01c03-0018', type: 'other', speaker: characters.lukas, content: 'Wir könnten uns am Wasserfall treffen.', timestamp: '13:43' },
        { id: 's1e01c03-0019', type: 'other', speaker: characters.lukas, content: 'Vorausgesetzt ich komme da überhaupt lebend an 😰', timestamp: '13:43' },
        { id: 's1e01c03-0020', type: 'other', speaker: characters.lukas, content: 'Und?', timestamp: '13:44' },

        // Switch: Privatchat Yasmin, Lisa
        {
          id: 's1e01c03-0021',
          type: 'system',
          kind: 'chat-switch',
          scene: {
            tone: 'private',
            labelKey: 'stories:chatSwitch.private',
            title: '',
            participants: [{ name: 'Yasmin' }, { name: 'Lisa' }],
          },
          timestamp: '',
        },

        { id: 's1e01c03-0022', type: 'other', speaker: characters.lisa, content: 'Hast du Igors Posts gesehen? So cool!', timestamp: '13:50' },
        { id: 's1e01c03-0023', type: 'other', speaker: characters.lisa, content: 'Weitergeleitet:', image: '/media/story/episodes/s1e01/s1e01c03_2-512.webp', timestamp: '13:50' },

        { id: 's1e01c03-0025', type: 'other', speaker: characters.yasmin, content: 'Ja.', timestamp: '13:51' },
        { id: 's1e01c03-0026', type: 'other', speaker: characters.yasmin, content: 'Bist du schon zurück?', timestamp: '13:51' },
        { id: 's1e01c03-0027', type: 'other', speaker: characters.lisa, content: 'Sind gerade erst zwischengelandet.', timestamp: '13:52' },
        { id: 's1e01c03-0028', type: 'other', speaker: characters.lisa, content: 'So schade. Ich würd so gern auch zu dieser Stunt-Strecke.', timestamp: '13:52' },
        { id: 's1e01c03-0029', type: 'other', speaker: characters.yasmin, content: 'Ach ja?', timestamp: '13:53' },
        { id: 's1e01c03-0030', type: 'other', speaker: characters.lisa, content: 'Klar, morgen redet bestimmt die ganze Klasse davon.', timestamp: '13:53' },
        { id: 's1e01c03-0031', type: 'other', speaker: characters.yasmin, content: 'Hm. Stimmt eigentlich…', timestamp: '13:54' },

        {
  id: 's1e01c03-tip-amy-staunen',
  type: 'system',
  kind: 'bonus-link',
  content: 'Bonus: Lies Amys Gedanken zum Staunen.',
  linkTo: '/newspaper/tip-amy-staunen',
  linkLabel: 'Artikel öffnen →',
  bonusId: 'tip-amy-staunen',
},

        // Reflexion (Amy)
        { id: 's1e01c03-0033', type: 'main', speaker: characters.amy, kind: 'amy-question', content: 'Ist dir schon mal aufgefallen, dass Chats oder Posts deine Entscheidungen beeinflusst haben, oder eher nicht? Erkläre, wie es bei dir im Alltag ist.', timestamp: '' },
        {
          id: 's1e01c03-0034',
          type: 'main',
          speaker: characters.amy,
          kind: 'amy-tip',
          content:
            'Posts, Fotos und Videos zeigen nur einen ausgewählten Moment – nicht den ganzen Tag. Auch bei coolen Posts gibt es oft davor Stress, danach Langeweile und manchmal sogar Ärger. Wenn ein Bild dich unter Druck setzt: nicht sofort reagieren, Handy weglegen, denken: „Das ist nur ein Ausschnitt“ und etwas anderes machen (Musik, rausgehen, malen)',
          timestamp: '',
        },
      ],
    },

    // ------------------------------------
    // Chapter 4 — Wasserstand, Entscheidung, Aylin um Rat
    // ------------------------------------
    {
      chapter: 4,
      messages: [
        {
          id: 's1e01c04-0001',
          type: 'system',
          kind: 'chat-switch',
          scene: {
            tone: 'private',
            labelKey: 'stories:chatSwitch.private',
            title: '',
            participants: [{ name: 'Igor' }, { name: 'Lukas' }, { name: 'Yasmin' }],
          },
          timestamp: '',
        },

        // Privatchat Igor, Lukas, Yasmin
        { id: 's1e01c04-0002', type: 'other', speaker: characters.yasmin, content: 'Wie sieht’s bei euch aus?', timestamp: '14:05' },
        { id: 's1e01c04-0003', type: 'other', speaker: characters.lukas, content: 'Ziemlich anstrengend 😅', timestamp: '14:06' },
        { id: 's1e01c04-0004', type: 'other', speaker: characters.lukas, content: 'Die Sonne kommt durch, das sieht schon malerisch aus. Aber alles ist immer noch durchnässt.', timestamp: '14:06' },
        { id: 's1e01c04-0005', type: 'other', speaker: characters.lukas, content: 'Gar nicht optimal für meinen guten alten Drahtesel.', timestamp: '14:07' },
        { id: 's1e01c04-0006', type: 'other', speaker: characters.lukas, content: 'Schon bei wenig Druck dreht das Hinterrad durch.', timestamp: '14:07' },
        { id: 's1e01c04-0007', type: 'other', speaker: characters.lukas, content: 'Die nassen Wurzeln bieten den Reifen keinen Halt. Ein kleiner Lenkfehler - und ich rutsche.', timestamp: '14:08' },
        { id: 's1e01c04-0008', type: 'other', speaker: characters.igor, content: 'Chill mal. Alles easy.', timestamp: '14:08' },
        { id: 's1e01c04-0009', type: 'other', speaker: characters.lukas, content: 'Das ist kein Anstellen. Das ist Physik.', timestamp: '14:09' },
        { id: 's1e01c04-0010', type: 'other', speaker: characters.yasmin, content: 'Was ist mit dem Fluss?', timestamp: '14:09' },
        { id: 's1e01c04-0011', type: 'other', speaker: characters.lukas, content: 'Naja, der Geräuschkulisse nach zu urteilen…', timestamp: '14:10' },
        { id: 's1e01c04-0012', type: 'other', speaker: characters.lukas, content: 'Wir sehen bisher nur den Bergbach. Der Wasserstand muss weit über dem Normalniveau liegen. Wir sollten vorsichtig sein.', timestamp: '14:10' },
        { id: 's1e01c04-0013', type: 'other', speaker: characters.igor, content: 'Hör nicht auf Lukas Gelaber: Ist echt krass hier, coole Kulisse und geile Abfahrten.', timestamp: '14:11' },
        { id: 's1e01c04-0014', type: 'other', speaker: characters.yasmin, content: 'Okay, mache mich auf den Weg.', timestamp: '14:12' },
        { id: 's1e01c04-0015', type: 'other', speaker: characters.yasmin, content: 'Ich hab einen Blog gefunden. Da sind Fotos - Leute im Wasser vorm Wasserfall. Sieht so cool aus… ich hätte auch Bock. Habt ihr auch Badesachen dabei?', timestamp: '14:13' },
        { id: 's1e01c04-0016', type: 'other', speaker: characters.lukas, content: 'Das ist Unsinn.', timestamp: '14:13' },
        { id: 's1e01c04-0017', type: 'other', speaker: characters.lukas, content: 'Dieser Ort ist definitiv nicht zum Baden geeignet – erst recht nicht nach dem Regen.', timestamp: '14:14' },
        { id: 's1e01c04-0018', type: 'other', speaker: characters.igor, content: 'Lasst das nachher bequatschen. Jetzt geht’s weiter.', timestamp: '14:14' },
        { id: 's1e01c04-0019', type: 'other', speaker: characters.lukas, content: 'Yasmin, warte bitte auf jeden Fall am Wasserfall auf uns. Hörst du?', timestamp: '14:15' },

        // Switch: Privatchat Yasmin, Aylin
        {
          id: 's1e01c04-0020',
          type: 'system',
          kind: 'chat-switch',
          scene: {
            tone: 'private',
            labelKey: 'stories:chatSwitch.private',
            title: '',
            participants: [{ name: 'Yasmin' }, { name: 'Aylin' }],
          },
          timestamp: '',
        },

        { id: 's1e01c04-0021', type: 'other', speaker: characters.yasmin, content: 'Sieht krass aus hier. Der Wasserfall ist beeindruckend. Umwerfend.', timestamp: '14:42' },
        { id: 's1e01c04-0022', type: 'other', speaker: characters.yasmin, image: '/media/story/episodes/s1e01/s1e01c04-512.webp', content: '', timestamp: '14:42' },


        { id: 's1e01c04-0024', type: 'other', speaker: characters.yasmin, content: 'Aber zum Baden? Ungemütlich und kalt am Wasser 😰. Sieht komplett anders aus als auf den Bildern im Internet mit den badenden Leuten.', timestamp: '14:43' },
        { id: 's1e01c04-0025', type: 'other', speaker: characters.yasmin, content: 'Mega laut. Kann mein eigenes Wort nicht verstehen.', timestamp: '14:44' },
        { id: 's1e01c04-0026', type: 'other', speaker: characters.yasmin, content: 'Und der Boden ist nach dem Regen richtig rutschig. Musste mich eben sogar festhalten.', timestamp: '14:44' },
        { id: 's1e01c04-0027', type: 'other', speaker: characters.yasmin, content: 'Was meinst du, soll ich ins Wasser gehen? Das war mein Plan.', timestamp: '14:45' },
        { id: 's1e01c04-0028', type: 'other', speaker: characters.yasmin, content: 'Wenn ich nur ein Selfie vom Rand schicke, komme ich ja nicht gegen Lisas Bild an…', timestamp: '14:46' },
        { id: 's1e01c04-0029', type: 'other', speaker: characters.yasmin, content: 'Und jetzt bin ich schon mal hier… Aber… sieht gar nicht nach Badesee aus.', timestamp: '14:46' },
        { id: 's1e01c04-0030', type: 'other', speaker: characters.yasmin, content: 'Eher nach Wildwasser-Abenteuer. Was mach ich bloß?', timestamp: '14:47' },
        { id: 's1e01c04-0031', type: 'other', speaker: characters.yasmin, content: 'Warte… Ich habe ´ne Idee. Vielleicht kannst du mir kurz helfen. Du kennst dich doch gut mit KI aus.', timestamp: '14:47' },
        { id: 's1e01c04-0032', type: 'other', speaker: characters.yasmin, content: 'Aylin? Bist du online?', timestamp: '14:48' },

        // Reflexion (Amy)
        { id: 's1e01c04-0033', type: 'main', speaker: characters.amy, kind: 'amy-question', content: 'Yasmin fragt ihre Freundin um Rat. An wen würdest du dich wenden, wenn du mal unsicher bist, und was gibt dir bei dieser Person ein gutes Gefühl?', timestamp: '' },
        { id: 's1e01c04-0034', type: 'main', speaker: characters.amy, kind: 'amy-tip', content: 'Wenn du unsicher bist, hol dir Rat bei jemandem, dem du vertraust.', timestamp: '' },
      ],
    },

    // ------------------------------------
    // Chapter 5 — Klassenchat: Foto, Alarm, Funkstille
    // ------------------------------------
    {
      chapter: 5,
      messages: [
        {
          id: 's1e01c05-0001',
          type: 'system',
          kind: 'chat-switch',
          scene: {
            tone: 'class',
            labelKey: 'stories:chatSwitch.class',
            title: 'Klasse 7b',
            participants: [],
          },
          timestamp: '',
        },

        // Yasmins Foto (s1e01c05)
        { id: 's1e01c05-0002', type: 'other', speaker: characters.yasmin, image: '/media/story/episodes/s1e01/s1e01c05-512.webp', content: '', timestamp: '14:55', reactions: [R('🤩')] },

        { id: 's1e01c05-0004', type: 'other', speaker: characters.dominik, content: 'Krass.', timestamp: '14:56' },
        { id: 's1e01c05-0005', type: 'other', speaker: characters.lisa, content: 'Wow', timestamp: '14:56' },
        { id: 's1e01c05-0006', type: 'other', speaker: characters.igor, content: 'Geiles Bild🔥💦 Da will ich auch rein 😎', timestamp: '14:56' },
        { id: 's1e01c05-0007', type: 'other', speaker: characters.lukas, content: '😳', timestamp: '14:57' },
        { id: 's1e01c05-0008', type: 'other', speaker: characters.lukas, content: 'Baden ist dort ausdrücklich nicht gestattet. Du solltest doch warten.', timestamp: '14:57' },
        { id: 's1e01c05-0009', type: 'other', speaker: characters.lukas, content: 'Und zwar aus gutem Grund. Es ist äußerst gefährlich.', timestamp: '14:58' },
        { id: 's1e01c05-0010', type: 'other', speaker: characters.chioma, content: 'Oh nein. Yasmin?', timestamp: '14:58' },
        { id: 's1e01c05-0011', type: 'other', speaker: characters.lukas, content: 'Nach dem starken Regen ist das noch gefährlicher.', timestamp: '14:59' },
        { id: 's1e01c05-0012', type: 'other', speaker: characters.dominik, content: 'Chill, bro. Das heißt doch nix 😤', timestamp: '14:59' },
        { id: 's1e01c05-0013', type: 'other', speaker: characters.chioma, content: 'Igor, Lukas, seid ihr bei Yasmin?', timestamp: '15:00' },
        { id: 's1e01c05-0014', type: 'other', speaker: characters.lisa, content: 'Sagt ihr, dass sie sofort da rauskommen soll.', timestamp: '15:00' },
        { id: 's1e01c05-0015', type: 'other', speaker: characters.igor, content: 'Wir sind noch auf der Mountainbike-Strecke, aber wollen sie nachher treffen.', timestamp: '15:01' },
        { id: 's1e01c05-0016', type: 'other', speaker: characters.chioma, content: 'Dann beeilt euch bitte.', timestamp: '15:01' },
        { id: 's1e01c05-0017', type: 'other', speaker: characters.lisa, content: 'Und wer hat das Bild dann gemacht? 🤔', timestamp: '15:02' },
        { id: 's1e01c05-0018', type: 'other', speaker: characters.lukas, content: 'Wir beeilen uns.', timestamp: '15:02' },
        { id: 's1e01c05-0019', type: 'other', speaker: characters.lukas, content: 'Sind allerdings noch ziemlich weit entfernt.', timestamp: '15:03' },
        { id: 's1e01c05-0020', type: 'other', speaker: characters.dominik, content: 'Immer locker. Sie hat sicher einen Riesen-Blast.', timestamp: '15:03' },
        { id: 's1e01c05-0021', type: 'other', speaker: characters.igor, content: 'Klare Sache. Kein Stress.', timestamp: '15:03' },
        { id: 's1e01c05-0022', type: 'other', speaker: characters.lukas, content: 'Doch. Los. Wir müssen sie sofort warnen.', timestamp: '15:04' },
        { id: 's1e01c05-0023', type: 'other', speaker: characters.lukas, content: 'Der Wasserstand ist deutlich höher als gewöhnlich.', timestamp: '15:04' },
        { id: 's1e01c05-0024', type: 'other', speaker: characters.dominik, content: 'Ja und?', timestamp: '15:05' },
        { id: 's1e01c05-0025', type: 'other', speaker: characters.chioma, content: 'Was soll das heißen?', timestamp: '15:05' },
        { id: 's1e01c05-0026', type: 'other', speaker: characters.lukas, content: 'Das soll heißen, dass wir keine Zeit verlieren dürfen.', timestamp: '15:06' },
        { id: 's1e01c05-0027', type: 'other', speaker: characters.lukas, content: 'Das Wasser könnte sie wegreißen. Sicher gibt es versteckte Strömungen.', timestamp: '15:06' },
        { id: 's1e01c05-0028', type: 'other', speaker: characters.lukas, content: 'Jemand muss Hilfe organisieren.', timestamp: '15:07' },
        { id: 's1e01c05-0029', type: 'other', speaker: characters.chioma, content: 'Das machen wir.', timestamp: '15:07' },
        { id: 's1e01c05-0030', type: 'other', speaker: characters.lukas, content: 'Ich fürchte, Igor und ich könnten zu spät kommen 😰.', timestamp: '15:08' },
        { id: 's1e01c05-0031', type: 'other', speaker: characters.lukas, content: 'Wir geben jetzt alles. Los!', timestamp: '15:08' },
        { id: 's1e01c05-0032', type: 'other', speaker: characters.chioma, content: 'Wartet.', timestamp: '15:09' },
        { id: 's1e01c05-0033', type: 'other', speaker: characters.chioma, content: 'Wo ist denn der Wasserfall?', timestamp: '15:10' },
        { id: 's1e01c05-0034', type: 'other', speaker: characters.chioma, content: '…', timestamp: '15:10' },
        { id: 's1e01c05-0035', type: 'other', speaker: characters.chioma, content: 'Lukas??', timestamp: '15:11' },
        { id: 's1e01c05-0036', type: 'other', speaker: characters.chioma, content: 'Igor??', timestamp: '15:11' },
        { id: 's1e01c05-0037', type: 'other', speaker: characters.chioma, content: 'Lukas, meldet euch!', timestamp: '15:12' },
        { id: 's1e01c05-0038', type: 'other', speaker: characters.lisa, content: 'Sie antworten nicht mehr.', timestamp: '15:12' },

        // Reflexion (Amy)
        { id: 's1e01c05-0039', type: 'main', speaker: characters.amy, kind: 'amy-question', content: 'Wann ist der richtige Zeitpunkt, für andere Hilfe zu holen - beschreibe?', timestamp: '' },
        {
          id: 's1e01c05-0040',
          type: 'main',
          speaker: characters.amy,
          kind: 'amy-tip',
          content: 'Wenn niemand mehr antwortet und es gefährlich sein könnte → sofort Hilfe holen. Lieber einmal zu viel als einmal zu wenig. Hilfe holen ist kein Petzen, sondern Verantwortung übernehmen.',
          timestamp: '',
        },
      ],
    },

    // ------------------------------------
    // Chapter 6 — Klassenchat: Geodaten / Reverse Image Search
    // ------------------------------------
    {
      chapter: 6,
      messages: [
        {
          id: 's1e01c06-0001',
          type: 'system',
          kind: 'chat-switch',
          scene: {
            tone: 'class',
            labelKey: 'stories:chatSwitch.class',
            title: 'Klasse 7b',
            participants: [],
          },
          timestamp: '',
        },

        { id: 's1e01c06-0002', type: 'other', speaker: characters.chioma, content: 'Weiß sonst noch jemand, WO das ist?', timestamp: '15:16' },
        { id: 's1e01c06-0003', type: 'other', speaker: characters.finn, content: 'kein plan', timestamp: '15:16' },
        { id: 's1e01c06-0004', type: 'other', speaker: characters.lisa, content: 'Keine Ahnung 🤷‍♀️.', timestamp: '15:17' },
        { id: 's1e01c06-0005', type: 'other', speaker: characters.carlos, content: 'Wartet kurz.', timestamp: '15:17' },
        { id: 's1e01c06-0006', type: 'other', speaker: characters.carlos, content: 'Das kriegen wir raus.', timestamp: '15:18' },
        { id: 's1e01c06-0007', type: 'other', speaker: characters.carlos, content: 'Im Bild könnten Geodaten stecken📍.', timestamp: '15:18' },
        { id: 's1e01c06-0008', type: 'other', speaker: characters.lisa, content: 'Geodaten?', timestamp: '15:19' },
        { id: 's1e01c06-0009', type: 'other', speaker: characters.carlos, content: 'Ja, aus einem Bild kann man oft ableiten, wo es aufgenommen wurde. Wenn du ein Foto mit dem Handy machst, speichert es oft Infos dazu: Ort, Uhrzeit, manchmal sogar das Gerät. Das nennt man „Metadaten”.', timestamp: '15:19' },
        { id: 's1e01c06-0010', type: 'other', speaker: characters.lisa, content: 'Perfekt. Genau das brauchen wir 🗺️.', timestamp: '15:20' },
        { id: 's1e01c06-0011', type: 'other', speaker: characters.carlos, content: 'Vale… nein.', timestamp: '15:20' },
        { id: 's1e01c06-0012', type: 'other', speaker: characters.carlos, content: 'Moment. Im Chat werden die Koordinaten meistens entfernt.', timestamp: '15:21' },
        { id: 's1e01c06-0013', type: 'other', speaker: characters.lisa, content: 'Was?', timestamp: '15:21' },
        { id: 's1e01c06-0014', type: 'other', speaker: characters.chioma, content: 'Warum?', timestamp: '15:21' },
        { id: 's1e01c06-0015', type: 'other', speaker: characters.carlos, content: 'Wenn ein Foto im Chat gepostet wird, werden die Geodaten gelöscht. Für den Datenschutz.', timestamp: '15:22' },
        { id: 's1e01c06-0016', type: 'other', speaker: characters.lisa, content: 'Mist.', timestamp: '15:22' },
        { id: 's1e01c06-0017', type: 'other', speaker: characters.carlos, content: 'Naja, eigentlich ist das auch gut so. Damit nicht alle Zugriff auf die Daten haben.', timestamp: '15:23' },
        { id: 's1e01c06-0018', type: 'other', speaker: characters.chioma, content: 'Was machen wir jetzt?', timestamp: '15:23' },
        { id: 's1e01c06-0019', type: 'other', speaker: characters.carlos, content: 'Trotzdem verrät ein Bild oft etwas über den Ort. Nur nicht als genaue Koordinaten.', timestamp: '15:24' },
        { id: 's1e01c06-0020', type: 'other', speaker: characters.lisa, content: 'Was meinst du?', timestamp: '15:24' },
        { id: 's1e01c06-0021', type: 'other', speaker: characters.carlos, content: 'Schaut euch das Foto noch mal genau an 🔍.', timestamp: '15:25' },
        { id: 's1e01c06-0022', type: 'other', speaker: characters.carlos, content: 'Was seht ihr darauf?', timestamp: '15:25' },
        { id: 's1e01c06-0023', type: 'other', speaker: characters.lisa, content: 'Da ist ein Bach, man sieht Felsen.', timestamp: '15:26' },
        { id: 's1e01c06-0024', type: 'other', speaker: characters.chioma, content: 'Und natürlich den Wasserfall 💦.', timestamp: '15:26' },
        { id: 's1e01c06-0025', type: 'other', speaker: characters.carlos, content: 'Genau.', timestamp: '15:26' },
        { id: 's1e01c06-0026', type: 'other', speaker: characters.chioma, content: 'Und das reicht?', timestamp: '15:27' },
        { id: 's1e01c06-0027', type: 'other', speaker: characters.lisa, content: 'Ich kenn den Ort nicht.', timestamp: '15:27' },
        { id: 's1e01c06-0028', type: 'other', speaker: characters.carlos, content: 'Ich auch nicht. Aber ich probier Reverse Image Search.', timestamp: '15:28' },
        { id: 's1e01c06-0029', type: 'other', speaker: characters.lisa, content: 'Okay.', timestamp: '15:28' },
        { id: 's1e01c06-0030', type: 'other', speaker: characters.lisa, content: 'Und das ist was?', timestamp: '15:28' },
        { id: 's1e01c06-0031', type: 'other', speaker: characters.carlos, content: 'Statt in der Suchmaschine nach Worten zu suchen, gebe ich Yasmins Foto ein.', timestamp: '15:29' },
        { id: 's1e01c06-0032', type: 'other', speaker: characters.chioma, content: 'Und?', timestamp: '15:29' },
        { id: 's1e01c06-0033', type: 'other', speaker: characters.carlos, content: 'Moment…', timestamp: '15:30' },
        { id: 's1e01c06-0034', type: 'other', speaker: characters.carlos, content: 'Ich habe was gefunden. Es gibt Bilder im Netz, die sehr ähnlich aussehen.', timestamp: '15:31' },
        { id: 's1e01c06-0035', type: 'other', speaker: characters.carlos, content: 'Nicht exakt gleich, weniger spektakulär. Das liegt wahrscheinlich an dem vielen Regen.', timestamp: '15:31' },
        { id: 's1e01c06-0036', type: 'other', speaker: characters.carlos, content: 'Hm…espera. Dieser hier könnte passen.', timestamp: '15:32' },
        { id: 's1e01c06-0037', type: 'other', speaker: characters.lisa, content: 'Nicht schlecht.', timestamp: '15:32' },
        { id: 's1e01c06-0038', type: 'other', speaker: characters.carlos, content: 'Jetzt suche ich noch die Adresse dazu.', timestamp: '15:33' },
        { id: 's1e01c06-0039', type: 'other', speaker: characters.lisa, content: 'Und?', timestamp: '15:33' },
        { id: 's1e01c06-0040', type: 'other', speaker: characters.carlos, content: 'Doch nicht. Der Wasserfall ist es nicht. Viel zu weit weg.', timestamp: '15:34' },
        { id: 's1e01c06-0041', type: 'other', speaker: characters.carlos, content: 'Aber vielleicht dieser…', timestamp: '15:35' },

        // Carlos findet Bild (s1e01c06)
        { id: 's1e01c06-0042', type: 'other', speaker: characters.carlos, image: '/media/story/episodes/s1e01/s1e01c06-512.webp', content: '', timestamp: '15:35' },

        { id: 's1e01c06-0044', type: 'other', speaker: characters.lisa, content: 'In den Grieswald-Bergen? Könnte hinkommen 🤔.', timestamp: '15:36' },
        { id: 's1e01c06-0045', type: 'other', speaker: characters.carlos, content: '@ Lukas @Igor  Ist das die richtige Location?', timestamp: '15:36' },

        { id: 's1e01c06-0046', type: 'other', speaker: characters.lisa, content: 'Sie antworten nicht.', timestamp: '15:37' },
        { id: 's1e01c06-0047', type: 'other', speaker: characters.lisa, content: 'Was sollen wir tun?', timestamp: '15:37' },
        {
  id: 's1e01c06-0048',
  type: 'audio',
  speaker: characters.chioma,
  audioSrc: '/media/story/episodes/s1e01/chiomas-sprachnachricht-s1e01c06.mp3',
  timestamp: '15:38'
},



        // Reflexion (Amy)
        { id: 's1e01c06-0049', type: 'main', speaker: characters.amy, kind: 'amy-question', content: 'Carlos sagt, dass Bilder für den Datenschutz ohne Geodaten verschickt werden. Warum ist Datenschutz wichtig?', timestamp: '' },
        {
          id: 's1e01c06-0050',
          type: 'main',
          speaker: characters.amy,
          kind: 'amy-tip',
          content:
            'Datenschutz verhindert in diesem Fall, dass Fremde herausfinden, wo du wohnst oder wo du dich oft aufhältst. \n\nWelche Daten werden bei Bildern konkret geschützt? \nBei Fotos sind oft unsichtbare Zusatzinfos gespeichert. \nZum Beispiel: \n📍 Ort – wo das Foto gemacht wurde (Zuhause, Schule, Spielplatz) \n🕒 Zeit – wann genau das Foto aufgenommen wurde \n📱 Gerät – mit welchem Handy \n📅 Muster – wenn viele Bilder denselben Ort zeigen: „Da ist jemand oft.“',
          timestamp: '',
        },


        // Bonus: Geodaten

       {
  id: 's1e01c06-tip-carlos-geodaten',
  type: 'system',
  kind: 'bonus-link',
  content: 'Bonus: Carlos Infos zu Geodaten in Bildern.',
  linkTo: '/newspaper/tip-carlos-geodaten',
  linkLabel: 'Artikel öffnen →',
  bonusId: 'tip-carlos-geodaten',
}

      ],
    },

    // ------------------------------------
    // Chapter 7 — Klassenchat: Entwarnung / Nachbesprechung
    // ------------------------------------
    {
      chapter: 7,
      messages: [
        {
          id: 's1e01c07-0001',
          type: 'system',
          kind: 'chat-switch',
          scene: {
            tone: 'class',
            labelKey: 'stories:chatSwitch.class',
            title: 'Klasse 7b',
            participants: [],
          },
          timestamp: '',
        },

        { id: 's1e01c07-0002', type: 'other', speaker: characters.chioma, content: 'Antwortet bitte. Ich halte dieses Warten nicht mehr aus.', timestamp: '15:45' },
        { id: 's1e01c07-0003', type: 'other', speaker: characters.igor, content: 'Ja?', timestamp: '15:47' },
        { id: 's1e01c07-0004', type: 'other', speaker: characters.chioma, content: 'Endlich! Seid ihr ok? Was ist los?', timestamp: '15:47' },
        { id: 's1e01c07-0005', type: 'other', speaker: characters.igor, content: 'Ich sehe Yasmin nirgends.', timestamp: '15:48' },
        { id: 's1e01c07-0006', type: 'other', speaker: characters.igor, content: 'Aber da sind Einsatzkräfte.', timestamp: '15:48' },
        { id: 's1e01c07-0007', type: 'other', speaker: characters.lisa, content: 'Ein Glück.', timestamp: '15:49' },
        { id: 's1e01c07-0008', type: 'other', speaker: characters.igor, content: 'Die müssen auch gerade eingetroffen sein.', timestamp: '15:49' },
        { id: 's1e01c07-0009', type: 'other', speaker: characters.igor, content: 'Habt ihr sie gerufen?', timestamp: '15:50' },
        { id: 's1e01c07-0010', type: 'other', speaker: characters.igor, content: 'Ah und da sind Yasmins Eltern.', timestamp: '15:50' },
        { id: 's1e01c07-0011', type: 'other', speaker: characters.chioma, content: 'Und Yasmin?', timestamp: '15:50' },
        { id: 's1e01c07-0012', type: 'other', speaker: characters.igor, content: 'Ich sehe sie nirgends.', timestamp: '15:51' },
        { id: 's1e01c07-0013', type: 'other', speaker: characters.chioma, content: 'Das kann doch nicht sein 😰', timestamp: '15:51' },
        { id: 's1e01c07-0014', type: 'other', speaker: characters.igor, content: 'Ich muss sie suchen. Ich spring rein.', timestamp: '15:52' },
        { id: 's1e01c07-0015', type: 'other', speaker: characters.lisa, content: 'Nein, auf keinen Fall! Das ist viel zu gefährlich!', timestamp: '15:52' },
        { id: 's1e01c07-0016', type: 'other', speaker: characters.chioma, content: 'Es bringt doch nichts, wenn du dich auch in Gefahr bringst.', timestamp: '15:53' },
        { id: 's1e01c07-0017', type: 'other', speaker: characters.chioma, content: 'Wo ist Yasmin nur?', timestamp: '15:53' },

        { id: 's1e01c07-0018', type: 'other', speaker: characters.yasmin, content: 'Wo sollte ich sein?', timestamp: '15:54' },
        { id: 's1e01c07-0019', type: 'other', speaker: characters.carlos, content: 'Yasmin?', timestamp: '15:54' },
        { id: 's1e01c07-0020', type: 'other', speaker: characters.chioma, content: 'Yasmin? Endlich.', timestamp: '15:54' },

        // Foto Igor: Entwarnung (s1e01c07)
        { id: 's1e01c07-0021', type: 'other', speaker: characters.igor, image: '/media/story/episodes/s1e01/s1e01c07-512.webp', content: '', timestamp: '15:55' },

        { id: 's1e01c07-0024', type: 'other', speaker: characters.lukas, content: 'Das ist wirklich unglaublich.', timestamp: '15:56' },
        { id: 's1e01c07-0025', type: 'other', speaker: characters.igor, content: 'Yasmin ist ok.', timestamp: '15:56' },
        { id: 's1e01c07-0026', type: 'other', speaker: characters.igor, content: 'Aber Lukas ist total k.o. 🥴', timestamp: '15:56' },

        { id: 's1e01c07-0027', type: 'system', content: 'Zeitlich später', timestamp: '' },

        { id: 's1e01c07-0028', type: 'other', speaker: characters.yasmin, content: 'Sorry, Lukas, dass du dir Sorgen gemacht hast 🙈', timestamp: '16:20' },
        { id: 's1e01c07-0029', type: 'other', speaker: characters.lukas, content: 'Was bitte war das für ein fragwürdiger Blog?', timestamp: '16:21' },
        { id: 's1e01c07-0030', type: 'other', speaker: characters.lukas, content: 'Einer, der ernsthaft empfiehlt, an so einem Wasserfall zu baden?', timestamp: '16:21' },
        { id: 's1e01c07-0031', type: 'other', speaker: characters.yasmin, content: 'Ich suche den Blog gerade nochmal…', timestamp: '16:22' },
        { id: 's1e01c07-0032', type: 'other', speaker: characters.lisa, content: 'Und?', timestamp: '16:22' },
        { id: 's1e01c07-0033', type: 'other', speaker: characters.yasmin, content: 'Der Artikel ist noch da.', timestamp: '16:23' },
        { id: 's1e01c07-0034', type: 'other', speaker: characters.yasmin, content: 'Aber der Satz mit dem Baden ist raus.', timestamp: '16:23' },
        { id: 's1e01c07-0035', type: 'other', speaker: characters.lukas, content: '🤨', timestamp: '16:24' },
        { id: 's1e01c07-0036', type: 'other', speaker: characters.yasmin, content: 'Doch ehrlich, ich schwör. Das stand da echt drin, das man da Baden kann.', timestamp: '16:24' },
        { id: 's1e01c07-0037', type: 'other', speaker: characters.lisa, content: 'Lisa hat recht. Ich hatte auch gesehen, dass sich Leute davor im Wasser fotografiert hatten. Da war das Wasser aber ganz niedrig. Jetzt sind die Bilder gelöscht.', timestamp: '16:25' },
        { id: 's1e01c07-0038', type: 'other', speaker: characters.lukas, content: 'Besser so.', timestamp: '16:26' },
        { id: 's1e01c07-0039', type: 'other', speaker: characters.lukas, content: 'Alles andere wäre unverantwortlich.', timestamp: '16:26' },
        { id: 's1e01c07-0040', type: 'other', speaker: characters.lisa, content: '@Yasmin Wie bist du denn da wieder rausgekommen? 😳 Ist ja voll krass.', timestamp: '16:27' },

        // Reflexion (Amy)
        { id: 's1e01c07-0041', type: 'main', speaker: characters.amy, kind: 'amy-question', content: 'Wie kannst du prüfen, ob du einem Tipp aus dem Internet vertrauen kannst?', timestamp: '' },
        { id: 's1e01c07-0042', type: 'main', speaker: characters.amy, kind: 'amy-tip', content: 'Bevor du einem Online-Tipp folgst, solltest du zuerst prüfen, ob die Information noch aktuell ist und wer sie geschrieben hat. \nDenn Informationen, die im Internet stehen, stimmen nicht immer oder können veraltet sein. Verlasse dich nie darauf. \n\n Sicherheit geht vor.\n\n Konkrete Dinge, die du wirklich prüfen kannst, siehst du im folgenden Bonus-Link.', timestamp: '' },
      ],
    },

    // ------------------------------------
    // Chapter 8 — Klassenchat: KI-Bild, Diskussion, Verbreitung
    // ------------------------------------
    {
      chapter: 8,
      messages: [
        {
          id: 's1e01c08-0001',
          type: 'system',
          kind: 'chat-switch',
          scene: {
            tone: 'class',
            labelKey: 'stories:chatSwitch.class',
            title: 'Klasse 7b',
            participants: [],
          },
          timestamp: '',
        },

        { id: 's1e01c08-0002', type: 'other', speaker: characters.aylin, content: 'Hier ging ja ordentlich was ab. Und ich hab das beste verpasst? 😳', timestamp: '18:10' },
        { id: 's1e01c08-0003', type: 'other', speaker: characters.lisa, content: 'Von dir haben wir ja gar nichts gehört.', timestamp: '18:10' },
        { id: 's1e01c08-0004', type: 'other', speaker: characters.aylin, content: 'Airplane mode 🤨', timestamp: '18:11' },
        { id: 's1e01c08-0005', type: 'other', speaker: characters.aylin, content: 'Aber was war denn nun?', timestamp: '18:11' },
        { id: 's1e01c08-0006', type: 'other', speaker: characters.aylin, content: 'Du warst beim Wasserfall. Und dann?', timestamp: '18:11' },
        { id: 's1e01c08-0007', type: 'other', speaker: characters.yasmin, content: 'Plötzlich waren meine Eltern da - und sogar Rettungs-Sanitäter!', timestamp: '18:12' },
        { id: 's1e01c08-0008', type: 'other', speaker: characters.yasmin, content: 'Das volle Programm.', timestamp: '18:12' },
        { id: 's1e01c08-0009', type: 'other', speaker: characters.yasmin, content: 'Igor und Lukas sahen aus, als wäre der Teufel hinter ihnen her.', timestamp: '18:13' },
        { id: 's1e01c08-0010', type: 'other', speaker: characters.yasmin, content: 'Ich lag nur im Gras. Um mich das Getöse. Und hab einfach ins rauschende Wasser gestarrt.', timestamp: '18:13' },
        { id: 's1e01c08-0011', type: 'other', speaker: characters.yasmin, content: 'Igor hat gelacht, als er mich gesehen hat.', timestamp: '18:14' },
        { id: 's1e01c08-0012', type: 'other', speaker: characters.yasmin, content: 'Aber Lukas war total sauer - und völlig fertig.', timestamp: '18:14' },
        { id: 's1e01c08-0013', type: 'other', speaker: characters.yasmin, content: 'Er hat geschimpft wie ein Rohrspatz 😂', timestamp: '18:14' },
        { id: 's1e01c08-0014', type: 'other', speaker: characters.lisa, content: 'Klar!', timestamp: '18:15' },
        { id: 's1e01c08-0015', type: 'other', speaker: characters.lisa, content: 'Warum hast du nicht geantwortet, als wir dich angerufen haben?', timestamp: '18:15' },
        { id: 's1e01c08-0016', type: 'other', speaker: characters.yasmin, content: 'Sorry, echt. Das habe ich überhaupt nicht gehört und erst viel später gesehen.', timestamp: '18:16' },
        { id: 's1e01c08-0017', type: 'other', speaker: characters.yasmin, content: 'Es war viel zu laut am Wasserfall.', timestamp: '18:16' },
        { id: 's1e01c08-0018', type: 'other', speaker: characters.lisa, content: 'Das war total gefährlich!', timestamp: '18:17' },
        { id: 's1e01c08-0019', type: 'other', speaker: characters.yasmin, content: 'Ich war doch gar nicht im Wasser.', timestamp: '18:17' },
        { id: 's1e01c08-0020', type: 'other', speaker: characters.chioma, content: 'Was?? 😳', timestamp: '18:17' },
        { id: 's1e01c08-0021', type: 'other', speaker: characters.yasmin, content: 'Ich hatte richtig Angst.', timestamp: '18:18' },
        { id: 's1e01c08-0022', type: 'other', speaker: characters.yasmin, content: 'Das Wasser war viel zu wild. Und…', timestamp: '18:18' },
        { id: 's1e01c08-0023', type: 'other', speaker: characters.lisa, content: 'Aber das Foto—', timestamp: '18:19' },
        { id: 's1e01c08-0024', type: 'other', speaker: characters.yasmin, content: 'Ich wollte doch nur ein Bild. Auch so ein … cooles Bild…', timestamp: '18:19' },
        { id: 's1e01c08-0025', type: 'other', speaker: characters.lisa, content: '?', timestamp: '18:19' },
        { id: 's1e01c08-0026', type: 'other', speaker: characters.yasmin, content: 'Auf dem Foto, das bin ich schon… aber im Schwimmbad.', timestamp: '18:20' },
        { id: 's1e01c08-0027', type: 'other', speaker: characters.yasmin, content: 'Letzten Sommer.', timestamp: '18:20' },
        { id: 's1e01c08-0028', type: 'other', speaker: characters.yasmin, content: 'Ich hab’s nur drübergelegt 🙈', timestamp: '18:20' },
        { id: 's1e01c08-0029', type: 'other', speaker: characters.finn, content: 'also war das bild gar nicht echt?', timestamp: '18:21' },
        { id: 's1e01c08-0030', type: 'other', speaker: characters.yasmin, content: 'Nein.', timestamp: '18:21' },
        { id: 's1e01c08-0031', type: 'other', speaker: characters.yasmin, content: 'Ich war nie drin.', timestamp: '18:21' },
        { id: 's1e01c08-0032', type: 'other', speaker: characters.chioma, content: 'War das KI?', timestamp: '18:22' },
        { id: 's1e01c08-0033', type: 'other', speaker: characters.yasmin, content: 'Ja.', timestamp: '18:22' },
        { id: 's1e01c08-0034', type: 'other', speaker: characters.lisa, content: 'Ich glaube es nicht 😳 Sah voll echt aus.', timestamp: '18:22' },
        { id: 's1e01c08-0035', type: 'other', speaker: characters.lisa, content: 'Aber ich habe mich schon gewundert, wer das Foto gemacht haben soll!!', timestamp: '18:23' },
        { id: 's1e01c08-0036', type: 'other', speaker: characters.finn, content: 'krass… ich dachte echt, du bist da im wasser', timestamp: '18:23' },
        { id: 's1e01c08-0037', type: 'other', speaker: characters.aylin, content: 'Lass noch mal sehen…', timestamp: '18:24' },
        { id: 's1e01c08-0038', type: 'other', speaker: characters.finn, content: 'Weitergeleitet:', image: '/media/story/episodes/s1e01/s1e01c05.webp', timestamp: '18:24' },
        { id: 's1e01c08-0040', type: 'other', speaker: characters.aylin, content: 'Ey, das ist technisch echt gut 👍', timestamp: '18:25' },
        { id: 's1e01c08-0041', type: 'other', speaker: characters.aylin, content: 'Licht und Perspektive passen. Sauber gemacht.', timestamp: '18:25' },
        { id: 's1e01c08-0042', type: 'other', speaker: characters.lisa, content: '😕', timestamp: '18:26' },
        { id: 's1e01c08-0043', type: 'other', speaker: characters.chioma, content: 'Und an uns hast du nicht gedacht? Oder an deine Eltern?', timestamp: '18:26' },
        { id: 's1e01c08-0044', type: 'other', speaker: characters.lisa, content: 'Ja, Yasmin, du kann doch nicht ein KI-Bild verschicken ohne es dazu zu schreiben. Ehrlich!', timestamp: '18:27' },
        { id: 's1e01c08-0045', type: 'other', speaker: characters.yasmin, content: 'Ihr habt doch auch so coole Fotos geschickt.', timestamp: '18:27' },
        { id: 's1e01c08-0046', type: 'other', speaker: characters.chioma, content: 'Yasmin, es geht hier nicht um Likes oder Aufmerksamkeit.', timestamp: '18:28' },
        { id: 's1e01c08-0047', type: 'other', speaker: characters.chioma, content: 'Das hätte richtig schiefgehen können.', timestamp: '18:28' },
        { id: 's1e01c08-0048', type: 'other', speaker: characters.finn, content: 'aber ist doch nix passiert.', timestamp: '18:29' },
        { id: 's1e01c08-0049', type: 'other', speaker: characters.lukas, content: 'Das sehe ich anders. Und die Rettungskräfte auch.', timestamp: '18:29' },
        { id: 's1e01c08-0050', type: 'other', speaker: characters.finn, content: 'hätte sie da echt gebadet wär es schlimmer.', timestamp: '18:30' },
        { id: 's1e01c08-0051', type: 'other', speaker: characters.lisa, content: 'Das Bild ist jetzt überall.', timestamp: '18:30' },
        { id: 's1e01c08-0052', type: 'other', speaker: characters.tom, content: 'Wirklich überall?', timestamp: '18:30' },
        { id: 's1e01c08-0053', type: 'other', speaker: characters.dominik, content: 'Ja. In zwei anderen Klassen auch schon.', timestamp: '18:31' },
        { id: 's1e01c08-0054', type: 'other', speaker: characters.yasmin, content: '😳', timestamp: '18:31' },
        { id: 's1e01c08-0055', type: 'other', speaker: characters.yasmin, content: 'Kann man das noch löschen?', timestamp: '18:32' },
        { id: 's1e01c08-0056', type: 'other', speaker: characters.carlos, content: 'In unserem Chat können wir’s löschen. Aber wenn es geteilt wurde, kriegst du es nicht überall zurück.', timestamp: '18:32' },


        // Privatchat Yasmin, Igor (Cliff)
        {
          id: 's1e01c08-0058',
          type: 'system',
          kind: 'chat-switch',
          scene: {
            tone: 'private',
            labelKey: 'stories:chatSwitch.private',
            title: '',
            participants: [{ name: 'Yasmin' }, { name: 'Igor' }],
          },
          timestamp: '',
        },
        { id: 's1e01c08-0059', type: 'other', speaker: characters.igor, content: 'Hast du morgen schon was vor?', timestamp: '18:36' },

        {
  id: 's1e01c08-bonus-diary-yasmin-2',
  type: 'system',
  kind: 'bonus-link',
  content: 'Bonus: Möchtest du wissen, was Yasmin denkt?',
  linkTo: '/diaries/diary_yasmin?entry=s1e01c08_0002',
  linkLabel: 'Eintrag öffnen →',
  bonusId: 'diary-yasmin-entry2',
},

        // Reflexion (Amy)
        { id: 's1e01c08-0060', type: 'main', speaker: characters.amy, kind: 'amy-question', content: 'Würdest du ein KI-Bild posten? Und wenn ja: Würdest du dazu schreiben, dass du es mit KI gemacht hast?', timestamp: '' },
        {
          id: 's1e01c08-0061',
          type: 'main',
          speaker: characters.amy,
          kind: 'amy-tip',
          content: 'Noch eine kleine Challenge für dich: Erstelle selbst ein Bild mit KI, wenn du Lust hast. Bitte dafür deine Eltern um Hilfe. Es gibt einige Dinge, die du beachten solltest. Klicke dazu den folgenden Bonus-Link.',
          timestamp: '',
        },

        {
  id: 's1e01c08-bonus-tip-aylin-kileitfaden',
  type: 'system',
  kind: 'bonus-link',
  content: 'Bonus: Aylin hat einen KI-Leitfaden – damit du fair bleibst und trotzdem stark bist.',
  linkTo: '/newspaper/tip-aylin-kileitfaden',
  linkLabel: 'Artikel öffnen →',
  bonusId: 'tip-aylin-kileitfaden',
}

      ],
    },
  ],

  epilogue: [
    {
      id: 's1e01_ep_0001',
      type: 'system',
      kind: 'chat-switch',
      scene: {
        tone: 'private',
        labelKey: 'stories:chatSwitch.private',
        title: '',
        participants: [{ name: 'Yasmin' }, { name: 'Chioma' }],
      },
      timestamp: '',
    },

    // Epilog
    { id: 's1e01_ep_0002', type: 'other', speaker: characters.yasmin, content: 'Lisa ist endlich zurück.', timestamp: '20:05' },
    { id: 's1e01_ep_0003', type: 'other', speaker: characters.yasmin, content: 'Weniger top-gestylte Selfies aus Rom und Paris.', timestamp: '20:06' },
    { id: 's1e01_ep_0004', type: 'other', speaker: characters.yasmin, content: 'Dafür mehr interessante Storys über andere und mehr Drama.', timestamp: '20:06' },
    { id: 's1e01_ep_0005', type: 'other', speaker: characters.chioma, content: '🙈 Klatsch und Tratsch bringen fast immer Ärger…', timestamp: '20:07' },

    { id: 's1e01_ep_0006', type: 'system', content: 'Lisa hinzugefügt.', timestamp: '20:08' },

    { id: 's1e01_ep_0007', type: 'other', speaker: characters.yasmin, content: 'Und? Sag schon: Was gibt’s Neues aus der Gerüchteküche?', timestamp: '20:08' },
    { id: 's1e01_ep_0008', type: 'other', speaker: characters.lisa, content: 'Kann gerade echt nicht 🙈 bin schon auf dem Weg zum Sushi.', timestamp: '20:09' },
    { id: 's1e01_ep_0009', type: 'other', speaker: characters.lisa, content: 'Das mit Dominik heute Morgen hab ich dir ja schon erzählt.', timestamp: '20:09' },

      {
    id: 's1e01-ep-01',
    type: 'main',
    speaker: characters.amy,
    content:
      "🎬 Diese Episode ist zu Ende.\n\nDenk heute noch ein bisschen darüber nach.\nMorgen wartet das nächste Kapitel auf dich.",
    timestamp: ''
  }
  ],
};

export default course;
