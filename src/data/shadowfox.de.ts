import type { Character, Course } from '../common/types';

import amyAvatar from '../assets/characters/amy.png';
import chiomaAvatar from '../assets/characters/chioma.png';
import miaAvatar from '../assets/characters/mia.png';
import dominikAvatar from '../assets/characters/dominik.png';
import finnAvatar from '../assets/characters/finn.png';
import tomAvatar from '../assets/characters/tom.png';
import carlosAvatar from '../assets/characters/carlos.png';
import jonasAvatar from '../assets/characters/jonas.png';
import miroAvatar from '../assets/characters/miro.png';
import shadowfoxAvatar from '../assets/characters/shadowfox.png';

import titleImage from '../assets/stories/shadowfox/title.png';
import shadowfox1 from '../assets/stories/shadowfox/shadowfox1.png';
import shadowfox2 from '../assets/stories/shadowfox/shadowfox2.png';
import shadowfox3 from '../assets/stories/shadowfox/shadowfox3.png';
import shadowfox4 from '../assets/stories/shadowfox/shadowfox4.png';
import shadowfox5 from '../assets/stories/shadowfox/shadowfox5.png';
import shadowfox6 from '../assets/stories/shadowfox/shadowfox6.png';
import shadowfox7 from '../assets/stories/shadowfox/shadowfox7.png';
import shadowfox8 from '../assets/stories/shadowfox/shadowfox8.png';
import shadowfox9 from '../assets/stories/shadowfox/shadowfox9.png';
import shadowfox10 from '../assets/stories/shadowfox/shadowfox10.png';
import shadowfox11 from '../assets/stories/shadowfox/shadowfox11.png';
import shadowfox12 from '../assets/stories/shadowfox/shadowfox12.png';
import shadowfox13 from '../assets/stories/shadowfox/shadowfox13.png';
import shadowfox14 from '../assets/stories/shadowfox/shadowfox14.png';
import shadowfoxEnd from '../assets/stories/shadowfox/end.png';

const characters: { [key: string]: Character } = {
  amy: { name: 'Amy', avatar: amyAvatar },
  chioma: { name: 'Chioma', avatar: chiomaAvatar },
  mia: { name: 'Mia', avatar: miaAvatar },
  dominik: { name: 'Dominik', avatar: dominikAvatar },
  finn: { name: 'Finn', avatar: finnAvatar },
  tom: { name: 'Tom', avatar: tomAvatar },
  carlos: { name: 'Carlos', avatar: carlosAvatar },
  jonas: { name: 'Jonas', avatar: jonasAvatar },
  miro: { name: 'Miro', avatar: miroAvatar },
  shadowfox: { name: 'ShadowFox', avatar: shadowfoxAvatar },
};

const course: Course = {
  id: 'im-netz-von-shadowfox',
  title: 'ShadowFox',
  image: titleImage,
  description:
    'Ein mehrteiliger Chat-Thriller über Identität, Privatsphäre und Sicherheit online – und was du tun kannst.',
  script: [
    {
      chapter: 1,
      messages: [
        {
          type: 'other',
          speaker: characters.shadowfox,
          content: 'Hallo 7b… 😎',
          timestamp: '19:24',
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          image: shadowfox1,
          timestamp: '19:24',
          reactions: ['🫵'],
        },
        {
          type: 'other',
          speaker: characters.finn,
          content: 'Hi 😊! Wer bist du?!',
          timestamp: '19:24',
          reactions: ['😊'],
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          content: '3x dürft ihr raten 🕵️‍♀️🔎🧩❓',
          timestamp: '19:25',
        },
        {
          type: 'other',
          speaker: characters.tom,
          content: 'Hm, keine Ahnung.',
          timestamp: '19:25',
        },
        {
          type: 'other',
          speaker: characters.chioma,
          content:
            'Bestimmt wieder so ein Gaming-Buddy von irgendwem aus Roblox?',
          timestamp: '19:25',
          reactions: ['🧐'],
        },
        {
          type: 'other',
          speaker: characters.mia,
          content:
            'Oder, Mias Cousin, oder so? Wir sind echt viel zu viele Leute hier!',
          timestamp: '19:26',
        },
        {
          type: 'other',
          speaker: characters.finn,
          content: 'Bist du neu oder warst du schon immer in der Gruppe?',
          timestamp: '19:27',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'Hat dich jemand eingeladen?',
          timestamp: '19:27',
        },
        {
          type: 'other',
          speaker: characters.tom,
          content: 'Ich bestimmt nicht!',
          timestamp: '19:28',
        },
        {
          type: 'other',
          speaker: characters.chioma,
          content: 'Sag schon, wer bist du?',
          timestamp: '19:35',
          reactions: ['😳'],
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          content:
            'Vielleicht lernt ihr mich ja noch kennen… besser als euch lieb ist.',
          timestamp: '19:36',
        },
        {
          type: 'other',
          speaker: characters.chioma,
          content: '??',
          timestamp: '19:36',
        },
        {
          type: 'other',
          speaker: characters.tom,
          content: '😳',
          timestamp: '19:36',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Was könntest du tun, wenn dir plötzlich jemand im Chat fremd vorkommt?',
          timestamp: '19:37',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Prüfe regelmäßig, wer in deinen Chats ist, bevor du private Nachrichten veröffentlichst.',
          timestamp: '19:37',
        },
      ],
    },
    {
      chapter: 2,
      messages: [
        {
          type: 'other',
          speaker: characters.shadowfox,
          content: 'Viel Glück heute, Mia 😉 – nicht nervös werden.',
          timestamp: '07:06',
          reactions: ['😉'],
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'Hä? Wieso?',
          timestamp: '07:08',
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          content: 'Na, für die Nachprüfung in Englisch. Wird schon klappen.',
          timestamp: '07:08',
        },
        {
          type: 'other',
          speaker: characters.tom,
          content: 'Was für eine Nachprüfung?',
          timestamp: '07:12',
        },
        {
          type: 'other',
          speaker: characters.dominik,
          content: 'Echt jetzt? Mia hat ne Nachprüfung 🤣.',
          timestamp: '07:13',
          reactions: ['😂'],
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'Oh man, das ist mir peinlich…',
          timestamp: '07:14',
          reactions: ['🙈'],
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          image: shadowfox2,
          timestamp: '07:14',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'Woher weißt DU das?!',
          timestamp: '07:14',
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          content: '🦊😈 Ich hab meine Quellen…',
          timestamp: '07:15',
        },
        {
          type: 'other',
          speaker: characters.chioma,
          content: 'Wie unheimlich.',
          timestamp: '07:16',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'Er spioniert uns aus!',
          timestamp: '07:16',
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          content: '👀',
          timestamp: '07:17',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content: 'Was bedeutet für dich „Privatsache“ im Internet?',
          timestamp: '07:18',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Wenn dir etwas ein komisches Gefühl macht, sage „Stopp!“ oder trete aus der Gruppe aus.',
          timestamp: '07:18',
        },
      ],
    },
    {
      chapter: 3,
      messages: [
        {
          type: 'other',
          speaker: characters.shadowfox,
          image: shadowfox3,
          timestamp: '07:39',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content:
            'Wir sollten den ShadowFox wieder rauswerfen, wir kennen den doch gar nicht.',
          timestamp: '07:40',
        },
        {
          type: 'other',
          speaker: characters.carlos,
          content:
            'Vielleicht kennen wir ihn ja doch. Kann auch sein, dass jemand aus der Gruppe nur seinen Profilnamen geändert hat. In WhatsApp kann man das jederzeit machen – dann steht plötzlich ein neuer Name da.',
          timestamp: '07:41',
        },
        {
          type: 'other',
          speaker: characters.dominik,
          content: 'Irgendwer muss den ShadowFox ja eingeladen haben!',
          timestamp: '07:41',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'Egal wieso er hier ist – der Typ muss raus!',
          timestamp: '07:42',
          reactions: ['👍🏻'],
        },
        {
          type: 'other',
          speaker: characters.tom,
          content:
            'Ich geb´ Mia recht: War ja lustig, aber der Spaß ist vorbei!! Wer bist du??',
          timestamp: '07:44',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'Wenn du´s jetzt nicht sagst, fliegst du!',
          timestamp: '07:44',
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          content: 'So einfach werdet ihr mich nicht los. 🦊😈',
          timestamp: '07:45',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Welche Regeln muss es in einem Chat geben, damit sich alle wohlfühlen?',
          timestamp: '07:46',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Im Chat gilt das gleiche wie auf dem Pausenhof: Nur wer sich fair verhält, darf mitspielen. Deine Freiheit hört dort auf, wo die des anderen beginnt.',
          timestamp: '07:46',
        },
      ],
    },
    {
      chapter: 4,
      messages: [
        {
          type: 'other',
          speaker: characters.tom,
          content: 'So, der Fuchs fliegt jetzt!',
          timestamp: '16:12',
        },
        {
          type: 'other',
          speaker: characters.dominik,
          content: 'Hätte nicht gedacht, dass du so´n Schisser bist 😆',
          timestamp: '16:12',
          reactions: ['😂'],
        },
        {
          type: 'other',
          speaker: characters.mia,
          content:
            'Antwort auf: „Hätte nicht gedacht…“ — Lass Tom in Ruhe. Das ist echt creepy! Tom, wirf ihn raus!',
          timestamp: '16:13',
        },
        {
          type: 'other',
          speaker: characters.tom,
          content: 'Ich kann ihn nicht löschen...',
          timestamp: '16:15',
          reactions: ['😱'],
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'Hä?!?!',
          timestamp: '16:15',
        },
        {
          type: 'other',
          speaker: characters.carlos,
          content: 'Warte… vielleicht bist du kein Admin.',
          timestamp: '16:16',
        },
        {
          type: 'other',
          speaker: characters.carlos,
          content: 'Ich probier’s.',
          timestamp: '16:16',
        },
        {
          type: 'other',
          speaker: characters.dominik,
          content: 'Ihr seid echt ´n Haufen Lappen!',
          timestamp: '16:16',
          reactions: ['👎'],
        },
        {
          type: 'other',
          speaker: characters.carlos,
          content: 'Geht auch nicht. Ich bin auch nicht Admin. Admin ist...',
          timestamp: '16:17',
        },
        {
          type: 'other',
          speaker: characters.carlos,
          content: 'Oh… das glaubt ihr nicht…',
          timestamp: '16:18',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'Los, sag schon!',
          timestamp: '16:18',
        },
        {
          type: 'other',
          speaker: characters.carlos,
          content: 'Es ist… ShadowFox.',
          timestamp: '16:19',
          reactions: ['😳'],
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          image: shadowfox4,
          timestamp: '16:19',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content: 'Welche Personen haben in deinen Chats die Admin-Rechte?',
          timestamp: '16:20',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Bei wichtigen Gruppen (z. B. Klassenchat) sollte es mehrere Admins geben, damit nicht eine Person allein alles bestimmt.',
          timestamp: '16:20',
        },
      ],
    },
    {
      chapter: 5,
      messages: [
        {
          type: 'other',
          speaker: characters.shadowfox,
          image: shadowfox5,
          content:
            'Wie er ihr bei der Klassenfeier im letzten Jahr einen Kuss gibt.',
          timestamp: '19:54',
        },
        {
          type: 'other',
          speaker: characters.dominik,
          content: 'Oooooh!',
          timestamp: '19:54',
          reactions: ['😏'],
        },
        {
          type: 'other',
          speaker: characters.tom,
          content: 'Wie süß!',
          timestamp: '19:54',
          reactions: ['❤️'],
        },
        {
          type: 'other',
          speaker: characters.dominik,
          content: 'Hahaha, peinlich! 🤣',
          timestamp: '19:54',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'Bist du irre?! Lösch das sofort!',
          timestamp: '19:56',
          reactions: ['🫷'],
        },
        {
          type: 'other',
          speaker: characters.finn,
          content:
            'Das ist nicht witzig. Das gehört hier nicht her! Lass den Spaß.',
          timestamp: '19:56',
          reactions: ['👍🏻'],
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          content: 'Tja… den Spaß haben dabei wohl eher die Anderen 😂😈.',
          timestamp: '19:57',
        },
        {
          type: 'other',
          speaker: characters.chioma,
          content: 'Wo hast du das überhaupt her?',
          timestamp: '19:59',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'Das war vor über einem Jahr! Ich dachte, das ist gelöscht!',
          timestamp: '20:01',
        },
        {
          type: 'other',
          speaker: characters.carlos,
          content:
            'Wenn’s mal im Chat war oder jemand’s gespeichert hat, kann es jederzeit wieder auftauchen. Selbst wenn’s längst gelöscht wurde.',
          timestamp: '20:02',
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          content: 'Manche Erinnerungen vergisst man nicht… 😈',
          timestamp: '20:02',
        },
        {
          type: 'other',
          speaker: characters.dominik,
          content: '😘🤣',
          timestamp: '20:03',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Stell dir vor, jemand postet heute ein altes Foto von dir, das dir peinlich ist – wie würdest du reagieren und was würdest du dir von den anderen wünschen?',
          timestamp: '20:04',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Frage immer vorher, bevor du ein Foto von jemandem teilst – und sei vorsichtig, was du selbst von dir verschickst.',
          timestamp: '20:04',
        },
      ],
    },
    {
      chapter: 6,
      messages: [
        {
          type: 'other',
          speaker: characters.shadowfox,
          image: shadowfox6,
          timestamp: '06:24',
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          content:
            'Na, Mia… wie läuft’s mit deinem Referat, das du immer vor dir herschiebst?',
          timestamp: '06:25',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'Woher weißt du DAVON schon wieder?!',
          timestamp: '07:02',
          reactions: ['😱'],
        },
        {
          type: 'other',
          speaker: characters.finn,
          content: 'Was für Referat? Steht das irgendwo?',
          timestamp: '07:05',
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          content: 'Man muss nur wissen, wo man zuhört. 🦊',
          timestamp: '07:05',
        },
        {
          type: 'other',
          speaker: characters.chioma,
          content: 'Was willst du damit sagen - du Stalker?',
          timestamp: '07:06',
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          content:
            'Dass ich nicht nur hier lese. Manche von euch reden lauter, als sie denken.',
          timestamp: '07:06',
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          content: 'Und Finn… wie war’s gestern Abend in Tower of Hell? 😉',
          timestamp: '07:08',
        },
        {
          type: 'other',
          speaker: characters.finn,
          content: '? Woher weißt du…?',
          timestamp: '07:08',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'Creepy!',
          timestamp: '07:08',
        },
        {
          type: 'other',
          speaker: characters.tom,
          content:
            'Finn, hast du gestern mit dem Kerl gezockt? Kennst du ShadowFox etwa doch?? Sag schon!',
          timestamp: '07:09',
        },
        {
          type: 'other',
          speaker: characters.finn,
          content:
            'Glaub ich nicht. Vielleicht war er einfach auch im gleichen Spiel…',
          timestamp: '07:10',
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          content: 'Vielleicht bin ich euch näher, als ihr denkt.',
          timestamp: '07:10',
          reactions: ['🥱'],
        },
        {
          type: 'system',
          content: 'Lisa hat den Chat verlassen.',
          timestamp: '07:11',
        },
        {
          type: 'system',
          content: 'Jonas hat den Chat verlassen.',
          timestamp: '07:11',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Was würdest du tun, wenn du mitbekommst, dass jemand mehr Informationen über dich hat als dir lieb ist?',
          timestamp: '07:12',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Sei dir bewusst, dass du über alle verschiedenen Kanäle, die du nutzt, lauter Puzzleteile von dir preisgibst.',
          timestamp: '07:12',
        },
      ],
    },
    {
      chapter: 7,
      messages: [
        {
          type: 'system',
          content: 'Pling!',
          timestamp: '07:35',
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          content: 'Ich glaube, es ist Zeit, euch mein Ass im Ärmel zu zeigen…',
          timestamp: '07:35',
        },
        {
          type: 'other',
          speaker: characters.tom,
          content: 'Was soll das jetzt heißen?',
          timestamp: '07:35',
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          content:
            'Sagen wir mal so… ich habe etwas, das eure Lehrerin sehr interessant finden würde.',
          timestamp: '07:35',
        },
        {
          type: 'other',
          speaker: characters.chioma,
          content: 'Hör auf mit dem Quatsch. Niemand glaubt dir.',
          timestamp: '07:35',
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          content:
            'Ach nein? Dann glaubt ihr mir vielleicht, wenn sie eure Projektnote auf 6 setzt. 🦊😈',
          timestamp: '07:35',
          reactions: ['👎'],
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'Hä? Wieso sollte sie das?',
          timestamp: '07:36',
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          content:
            'Weil ich weiß, wie euer Nachhaltigkeitsprojekt wirklich entstanden ist - Mit KI.',
          timestamp: '07:37',
        },
        {
          type: 'other',
          speaker: characters.finn,
          content: 'Äh?!',
          timestamp: '07:37',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: '😱',
          timestamp: '07:37',
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          content:
            'Ich hab den Beweis – und er wird Frau Schubert nicht gefallen.',
          timestamp: '07:38',
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          content: 'Dann bekommt die Dame jetzt eine kleine Überraschung… 📤',
          timestamp: '07:40',
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          image: shadowfox7,
          timestamp: '07:40',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Wen würdest du um Hilfe bitten, wenn dir online jemand droht?',
          timestamp: '07:41',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Niemals in Panik blind reagieren – suche erst Hilfe. Dann könnt ihr gemeinsam prüfen, was hinter der Drohung steckt.',
          timestamp: '07:41',
        },
      ],
    },
    {
      chapter: 8,
      messages: [
        {
          type: 'other',
          speaker: characters.shadowfox,
          image: shadowfox8,
          content: 'Na, Finn… wie lange bleibst du wohl noch auf Platz 1? 😏',
          timestamp: '17:41',
        },
        {
          type: 'other',
          speaker: characters.finn,
          content: 'Was?! Das ist mein Account!',
          timestamp: '17:41',
          reactions: ['😱'],
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'Wie ist der Fuchs da reingekommen?',
          timestamp: '17:41',
        },
        {
          type: 'other',
          speaker: characters.tom,
          content: 'Das ist ja völlig irre…',
          timestamp: '17:42',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content:
            'Was willst du von uns? Was müssen wir tun, damit du uns nicht verpetzt und Finns Account in Ruhe lässt??',
          timestamp: '17:42',
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          content:
            'Vielleicht will ich nur, dass ihr mich endlich ernst nehmt.',
          timestamp: '17:45',
        },
        {
          type: 'other',
          speaker: characters.chioma,
          content: 'Haben wir das nicht? Was haben wir dir angeblich getan?',
          timestamp: '17:45',
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          content:
            'Ihr habt ja keine Ahnung, wie’s ist, wenn man einfach vergessen wird.',
          timestamp: '17:47',
          reactions: ['🥱'],
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Wie würdest du reagieren, wenn sich jemand in dein Account hacken würde?',
          timestamp: '17:47',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content: 'Nutze für jeden Account ein starkes, eigenes Passwort.',
          timestamp: '17:47',
        },
      ],
    },
    {
      chapter: 9,
      messages: [
        {
          type: 'other',
          speaker: characters.mia,
          content:
            '@ShadowFox: Was müssen wir tun, damit du uns in Ruhe lässt?',
          timestamp: '17:47',
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          image: shadowfox9,
          timestamp: '17:47',
        },
        {
          type: 'system',
          content: '— Privatchat zwischen Tom, Mia, Finn, Chioma, Carlos —',
          timestamp: '17:47',
        },
        {
          type: 'other',
          speaker: characters.tom,
          content:
            'Ganz ehrlich... Warum sollten wir eigentlich nicht KI benutzen, um zu recherchieren.',
          timestamp: '17:47',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'Naja, wir hätten es halt sagen müssen.',
          timestamp: '17:48',
        },
        {
          type: 'other',
          speaker: characters.tom,
          content: 'Aber wir haben die Quellen doch sogar geprüft.',
          timestamp: '17:48',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'Ich weiß, aber ob Frau Schubert das auch so locker sieht?',
          timestamp: '17:49',
        },
        {
          type: 'other',
          speaker: characters.tom,
          content:
            'Am besten wir sprechen sie selbst darauf an. Wenn wir transparent damit umgehen, reagiert sie bestimmt cool.',
          timestamp: '17:49',
          reactions: ['🤞'],
        },
        {
          type: 'other',
          speaker: characters.finn,
          content:
            'Hej, Leute, das ist ja schön für euch! Aber was mache ich mit meinem Account??',
          timestamp: '17:50',
        },
        {
          type: 'other',
          speaker: characters.carlos,
          content:
            'Ganz ruhig, Junge. Log dich ein und vergib ein neues Passwort – das hättest du eh schon längst tun sollen.',
          timestamp: '17:50',
          reactions: ['🫷'],
        },
        {
          type: 'other',
          speaker: characters.finn,
          content:
            'Äh, stimmt. Wo ist er da eigentlich genau drin? Ich zoome mal ins Foto…',
          timestamp: '17:51',
        },
        {
          type: 'other',
          speaker: characters.finn,
          content:
            '…Moment. Seht ihr das? Rechts am Rand des Monitors steht ein... Spiegel.',
          timestamp: '17:51',
          reactions: ['🧐'],
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Was ist deine Meinung dazu, KI für eine Projektarbeit zu benutzen?',
          timestamp: '17:52',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Gehe immer transparent damit um, wenn du KI benutzt. Wenn du es verheimlichen musst, war es wahrscheinlich nicht erlaubt.',
          timestamp: '17:52',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Wechsle deine Passwörter regelmäßig und benachrichtige sofort einen Erwachsenen, wenn sich jemand Zutritt zu deinen Konten verschafft.',
          timestamp: '17:52',
        },
      ],
    },
    {
      chapter: 10,
      messages: [
        {
          type: 'system',
          content: '— Privatchat zwischen Tom, Mia, Finn, Chioma, Carlos —',
          timestamp: '17:51',
        },
        {
          type: 'other',
          speaker: characters.tom,
          image: shadowfox10,
          timestamp: '17:51',
        },
        {
          type: 'other',
          speaker: characters.chioma,
          content: 'Ja… und da ist ein Stück von seinem Gesicht!',
          timestamp: '17:51',
        },
        {
          type: 'other',
          speaker: characters.tom,
          content: 'Moment… ich glaube, ich erkenne ihn…',
          timestamp: '17:52',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'Wer ist es?',
          timestamp: '17:52',
        },
        {
          type: 'other',
          speaker: characters.tom,
          content: 'Es ist Miro, eindeutig!',
          timestamp: '17:52',
          reactions: ['😳'],
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'Wer??',
          timestamp: '17:52',
        },
        {
          type: 'other',
          speaker: characters.tom,
          content:
            'Miro. Wisst ihr nicht mehr? Er war früher in der Klasse, hat aber nie was gesagt. Ein richtiger Loner. Seit er weggezogen ist, hab´ ich nichts mehr von ihm gehört.',
          timestamp: '17:53',
        },
        {
          type: 'other',
          speaker: characters.tom,
          content:
            'Aber wartet... Lasst uns erst beraten, was wir tun, bevor wir ihn anschwärzen.',
          timestamp: '17:53',
        },
        {
          type: 'other',
          speaker: characters.finn,
          content: 'Warum? Er belästigt uns seit Tagen!',
          timestamp: '17:54',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Was würdest du tun, wenn du jemanden erkennst, der etwas Falsches getan hat?',
          timestamp: '17:54',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Atme immer durch und bewahre Ruhe, damit du die besten Entscheidungen treffen kannst.',
          timestamp: '17:54',
        },
      ],
    },
    {
      chapter: 11,
      messages: [
        {
          type: 'other',
          speaker: characters.carlos,
          content: 'Ja, aber vielleicht können wir’s ohne Riesenstreit lösen.',
          timestamp: '17:54',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content:
            'Genau. Was, wenn wir ihn dazu bringen, dass er seine Tricks erklärt? Dann lernen wir alle was.',
          timestamp: '17:55',
        },
        {
          type: 'other',
          speaker: characters.finn,
          content: 'Du willst echt mit ihm reden?',
          timestamp: '17:56',
        },
        {
          type: 'other',
          speaker: characters.chioma,
          content:
            'Es könnte klappen. Vielleicht ist er nur so drauf, weil er sich ausgeschlossen fühlt – wenn er mitmacht, kriegt er Anerkennung statt Ärger - und nutzt seine Fähigkeiten dafür, dass wir gemeinsam etwas Gutes draus machen können.',
          timestamp: '17:56',
        },
        {
          type: 'other',
          speaker: characters.tom,
          content:
            'Okay, also: Wir schreiben ihm, dass wir ihn erkannt haben – und dass er uns alles erklärt, was er gemacht hat. Aber nur, wenn er ehrlich ist.',
          timestamp: '17:57',
          reactions: ['👍🏻'],
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'Ich schreib’s ihm privat.',
          timestamp: '17:57',
        },
        {
          type: 'system',
          content: 'Gruppenchat 7b — Hinzugefügt: Miro',
          timestamp: '18:05',
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          content: '…Meint ihr das ernst? Ich wollt mich nicht verpfeifen??',
          timestamp: '18:05',
        },
        {
          type: 'other',
          speaker: characters.tom,
          content: 'Ja. Aber nur, wenn du wirklich ehrlich bist.',
          timestamp: '18:05',
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          content:
            'Okay… Ich bin Miro. Und ihr habt keine Ahnung, wie viele Fehler ihr online macht.',
          timestamp: '18:06',
        },
        {
          type: 'other',
          speaker: characters.miro,
          image: shadowfox11,
          timestamp: '18:06',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Wie fühlt es sich an, ausgeschlossen zu werden, und wie, wenn andere Interesse an dir zeigen?',
          timestamp: '18:07',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Nutze deine Fähigkeiten, um anderen zu helfen, nicht, um ihnen zu schaden.',
          timestamp: '18:07',
        },
      ],
    },
    {
      chapter: 12,
      messages: [
        {
          type: 'system',
          image: shadowfox12,
          content: 'Klassenchat der 7b',
          timestamp: '06:55',
        },
        {
          type: 'other',
          speaker: characters.miro,
          content:
            'Hey zusammen… ich wollte mich nochmal bei allen entschuldigen. Ich wollte mich nicht an euch rächen - naja, vielleicht ein bisschen 😉. ABER: Ich hab auch alles notiert, was mir aufgefallen ist. Damit wir alle daraus lernen. 😇',
          timestamp: '06:56',
        },
        {
          type: 'other',
          speaker: characters.chioma,
          content: 'Da bin ich gespannt! 🤞',
          timestamp: '06:57',
          reactions: ['🤞'],
        },
        {
          type: 'other',
          speaker: characters.miro,
          content:
            'Finn, du hast als Passwort einfach dein Geburtsdatum benutzt, das war natürlich leicht zu knacken.',
          timestamp: '06:58',
        },
        {
          type: 'other',
          speaker: characters.finn,
          content: 'Jo, war nicht smart 🤦',
          timestamp: '06:58',
        },
        {
          type: 'other',
          speaker: characters.miro,
          content:
            'Mia – deinen Prüfungstermin hab ich entdeckt, weil der Link zum Schulordner mal im Klassenchat aufgetaucht ist. Er ist nicht verschlüsselt und immer noch offen für jeden mit dem Link. Dort liegt auch der Prüfungskalender. Das Datum wurde schon ein paar Mal verschoben...',
          timestamp: '06:59',
        },
        {
          type: 'other',
          speaker: characters.carlos,
          content: 'Oha… ich wusste nicht, dass sowas jeder öffnen kann.',
          timestamp: '06:59',
        },
        {
          type: 'other',
          speaker: characters.miro,
          content:
            'Links sind wie Schlüssel – wenn du den Link rausgibst, kann jeder rein.',
          timestamp: '07:00',
          reactions: ['🧐'],
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Was kannst du tun, damit deine Infos im Internet besser geschützt sind?',
          timestamp: '07:01',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Passwörter schützen dich, Links sind digitale Schlüssel, und offene Ordner brauchen Verschlüsselung – sonst sind deine Daten für jeden zugänglich.',
          timestamp: '07:01',
        },
      ],
    },
    {
      chapter: 13,
      messages: [
        {
          type: 'other',
          speaker: characters.miro,
          content:
            'Und deine Englisch-Nachprüfung, Mia… davon hab ich auf der Facebook-Seite deiner Mutter gelesen.',
          timestamp: '07:04',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content:
            'Ups. Wie peinlich! Ich muss ihr sagen, dass sie sowas nicht öffentlich posten sollte.',
          timestamp: '07:04',
          reactions: ['🙈'],
        },
        {
          type: 'other',
          speaker: characters.miro,
          content:
            'Ja – auch Familie kann unabsichtlich Infos verraten. Dabei war es nur nett gemeint: „Drückt alle die Daumen für Mias Nachprüfung in Englisch morgen.“',
          timestamp: '07:06',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'Krass. Aber danke, Miro. 🙏',
          timestamp: '07:06',
          reactions: ['❤️'],
        },
        {
          type: 'other',
          speaker: characters.miro,
          content:
            'Es ist echt schön, jetzt dazu zu gehören. Ich hab auch ein Plakat für eure Klasse gemacht. Das könnt ihr in der Schule aufhängen, damit alle etwas daraus lernen können.',
          timestamp: '07:07',
        },
        {
          type: 'other',
          speaker: characters.miro,
          image: shadowfox13,
          timestamp: '07:07',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content: 'Welche dieser Tipps kannst du gleich heute umsetzen?',
          timestamp: '07:08',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Halte schriftlich fest, was du gelernt hast. Teile es mit deinen Freundinnen und Freunden, wenn es für sie auch interessant sein könnte.',
          timestamp: '07:08',
        },
      ],
    },
    {
      chapter: 14,
      messages: [
        {
          type: 'other',
          speaker: characters.chioma,
          content:
            'Danke, Miro. Das Plakat hängt schon in der Klasse. Frau Schubert hat sich sehr gefreut und sagt Hi 👋🏾. Aber was ich immer noch nicht checke: Woher weißt du, dass wir für die Projektarbeit KI benutzt haben?',
          timestamp: '16:35',
        },
        {
          type: 'other',
          speaker: characters.miro,
          content:
            'Bei eurer Präsentation war’s besonders einfach. Ihr habt einen Link geteilt, der hinten noch einen kleinen Zusatz hatte – …/xyz-chatgpt. Das heißt, der Inhalt kam von einer KI. Ihr habt den Zusatz nicht gesehen, aber ich schon.',
          timestamp: '16:36',
        },
        {
          type: 'other',
          speaker: characters.miro,
          image: shadowfox14,
          timestamp: '16:36',
        },
        {
          type: 'other',
          speaker: characters.carlos,
          content: 'Crazy – darauf hab ich gar nicht geachtet!',
          timestamp: '16:37',
          reactions: ['😳'],
        },
        {
          type: 'other',
          speaker: characters.miro,
          content:
            'Links sind wie Fußspuren – sie verraten oft mehr, als man denkt.',
          timestamp: '16:38',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'Danke, Miro. Und willkommen zurück.',
          timestamp: '16:38',
          reactions: ['❤️'],
        },
        {
          type: 'other',
          speaker: characters.dominik,
          content: 'Obwohl, ShadowFox fehlt mir fast ein bisschen 🤣',
          timestamp: '16:38',
          reactions: ['😂'],
        },
        {
          type: 'system',
          image: shadowfoxEnd,
          content: 'Gruppenfoto: Ende gut, alles gut.',
          timestamp: '16:39',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Wem könntest du auf nette Art sagen, was er oder sie für einen Fehler macht?',
          timestamp: '16:40',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Halte schriftlich fest, was du gelernt hast. Teile es mit deinen Freunden, wenn es ihnen hilft.',
          timestamp: '16:40',
        },
      ],
    },
  ],
};

export default course;
