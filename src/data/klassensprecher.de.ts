import type { Character, Course } from '../common/types';
import yasminAvatar from '../assets/characters/yasmin.png';
import meronAvatar from '../assets/characters/meron.png';
import igorAvatar from '../assets/characters/igor.png';
import elenaAvatar from '../assets/characters/elena.png';
import dominikAvatar from '../assets/characters/dominik.png';
import amyAvatar from '../assets/characters/amy.png';
import lisaAvatar from '../assets/characters/lisa.png';
import lukasAvatar from '../assets/characters/lukas.png';
import titleImage from '../assets/stories/klassensprecher/title.png';
import klassensprecherMeme from '../assets/stories/klassensprecher/meme.jpg';
import gruppenbild from '../assets/stories/klassensprecher/gruppenbild.png';
import chiomaAvatar from '../assets/characters/chioma.png';
import miaAvatar from '../assets/characters/mia.png';

const characters: { [key: string]: Character } = {
  yasmin: { name: 'Yasmin', avatar: yasminAvatar },
  meron: { name: 'Meron', avatar: meronAvatar },
  igor: { name: 'Igor', avatar: igorAvatar },
  elena: { name: 'Elena', avatar: elenaAvatar },
  dominik: { name: 'Dominik', avatar: dominikAvatar },
  amy: { name: 'Amy', avatar: amyAvatar },
  lisa: { name: 'Lisa', avatar: lisaAvatar },
  lukas: { name: 'Lukas', avatar: lukasAvatar },
  chioma: { name: 'Chioma', avatar: chiomaAvatar },
  mia: { name: 'Mia', avatar: miaAvatar },
};

const course: Course = {
  id: 'klassensprecher-in',
  title: 'Klassensprecher*in',
  image: titleImage,
  description:
    'Lerne an einem Chat, wie schnell Informationen im Internet die Runde machen – und wie du dich schützt.',
  script: [
    {
      chapter: 1,
      messages: [
        {
          type: 'other',
          speaker: characters.yasmin,
          content: 'Trommelwirbel…. And the winner is…',
          timestamp: '16:24',
        },
        {
          type: 'other',
          speaker: characters.yasmin,
          content: 'LUKAS!',
          timestamp: '16:24',
          reactions: ['👍'],
        },
        {
          type: 'other',
          speaker: characters.meron,
          content: 'Wait… WIRKLICH jetzt?!',
          timestamp: '16:24',
        },
        {
          type: 'other',
          speaker: characters.igor,
          content: '🫣',
          timestamp: '16:24',
        },
        {
          type: 'other',
          speaker: characters.elena,
          content: 'Glückwunsch Lukas',
          timestamp: '16:25',
        },
        {
          type: 'other',
          speaker: characters.dominik,
          content: 'Oha. Und das ganz ohne Social-Media-Kampagne– Respekt 😂',
          timestamp: '16:25',
        },
        {
          type: 'other',
          speaker: characters.dominik,
          image: klassensprecherMeme,
          timestamp: '16:25',
          reactions: ['😂'],
        },
        {
          type: 'other',
          speaker: characters.elena,
          content: 'Vielleicht GERADE deshalb 🤫',
          timestamp: '16:25',
        },
        {
          type: 'other',
          speaker: characters.yasmin,
          content: 'Klassensprecher-Energy ohne Drama 💪',
          timestamp: '16:26',
        },
        {
          type: 'other',
          speaker: characters.lisa,
          content: 'Aber dann muss er jetzt auch offiziell was posten, oder?',
          timestamp: '16:27',
          reactions: ['👍'],
        },
        {
          type: 'other',
          speaker: characters.meron,
          content: 'Ja! Und neue Gruppenbeschreibung + Profilbild!',
          timestamp: '16:27',
        },
        {
          type: 'other',
          speaker: characters.dominik,
          content: '…und einmal bitte „Amtseid“ per Selfie 😂',
          timestamp: '16:28',
        },
        {
          type: 'main',
          speaker: characters.lukas,
          content: 'Was genau erwartet ihr eigentlich von mir? Also wirklich.',
          timestamp: '16:28',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Was denkst du: Warum vertrauen manche Lukas, obwohl (oder gerade weil) er nicht so laut ist wie die anderen?',
          timestamp: '16:28',
        },
      ],
    },
    {
      chapter: 2,
      messages: [
        {
          type: 'other',
          speaker: characters.dominik,
          content:
            'Jetzt musst du posten, wenn Lehrer wieder was Peinliches sagen.',
          timestamp: '16:35',
        },
        {
          type: 'other',
          speaker: characters.yasmin,
          content:
            'Bitte KEINE Motivationssprüche, Lukas 🤢 So mit Sonnenaufgang und „Ihr schafft das!" und so',
          timestamp: '16:35',
        },
        {
          type: 'other',
          speaker: characters.meron,
          content:
            'Wenn du jetzt mit Gruppenregeln kommst, bin ich raus – wir wollen Memes, keinen Moralunterricht.',
          timestamp: '16:36',
        },
        {
          type: 'other',
          speaker: characters.yasmin,
          content:
            'Hauptsache, du teilst die Hausaufgaben-Ergebnisse. Alles andere können wir später klären 😅',
          timestamp: '16:36',
          reactions: ['👍'],
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'Leute… er ist Klassensprecher und kein Content Creator.',
          timestamp: '16:37',
        },
        {
          type: 'main',
          speaker: characters.lukas,
          content:
            'Interessant, was ihr euch alles vorstellt. Ich glaub, ich muss erstmal sortieren.',
          timestamp: '16:38',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Was machst du, wenn andere erwarten, dass du etwas postest – aber du selbst bist unsicher, ob du das willst?',
          timestamp: '16:38',
        },
      ],
    },
    {
      chapter: 3,
      messages: [
        {
          type: 'system',
          content: 'Lukas hat das Gruppenbild geändert.',
          image: gruppenbild,
          timestamp: '21:38',
        },
        {
          type: 'system',
          content:
            'Lukas hat die Gruppenbeschreibung geändert: > „Ich hör erst zu."',
          timestamp: '21:38',
        },
        {
          type: 'other',
          speaker: characters.lisa,
          content: 'Das ist jetzt dein Statement?',
          timestamp: '07:46',
        },
        {
          type: 'other',
          speaker: characters.meron,
          content: 'Also… minimalistisch 🤔',
          timestamp: '07:46',
        },
        {
          type: 'other',
          speaker: characters.dominik,
          content: 'Hä? Was soll das heißen??',
          timestamp: '07:47',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'Find ich irgendwie stark. Kein Getue.',
          timestamp: '07:47',
        },
        {
          type: 'other',
          speaker: characters.yasmin,
          content: 'Ich mag das. Still, aber klar.',
          timestamp: '07:47',
        },
        {
          type: 'other',
          speaker: characters.chioma,
          content: 'Ist halt typisch Lukas. Keine Show – aber mit Haltung.',
          timestamp: '07:48',
          reactions: ['👍'],
        },
        {
          type: 'other',
          speaker: characters.meron,
          content: 'Ja, okay. Wenigstens kein Sonnenuntergang.',
          timestamp: '07:48',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'User, wie fändest du es, wenn jemand in deiner Gruppe so ein Bild posten würde?',
          timestamp: '07:49',
        },
      ],
    },
    {
      chapter: 4,
      messages: [
        {
          type: 'other',
          speaker: characters.mia,
          content:
            'Dein Notizbuch-Post war cool. So ein stiller „Ich bin da"-Move. Hab ich gefeiert.',
          timestamp: '07:53',
        },
        {
          type: 'main',
          speaker: characters.lukas,
          content:
            'War mehr „Ich weiß nicht" als „Ich steh drüber". Aber ja – ich bin da.',
          timestamp: '07:54',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content:
            'Ich frag mich halt: Und jetzt? Also… bist du dann einfach leise Klassensprecher? Oder kommt da noch was?',
          timestamp: '07:54',
        },
        {
          type: 'main',
          speaker: characters.lukas,
          content:
            'Boah, ehrlich? Keine Ahnung. Ich hör grad zu, ja – aber irgendwann erwartet ihr doch, dass ich was sage. Oder was mache. Oder was lösche 😅',
          timestamp: '07:55',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content:
            'Na ja. Wenn alle nur zuhören, ändert sich halt nix. Irgendwer muss auch mal anfangen. Sonst bleiben immer nur Erwartungen stehen.',
          timestamp: '07:55',
        },
        {
          type: 'main',
          speaker: characters.lukas,
          content:
            'True. Aber wenn ich jetzt irgendwas poste, nur um „was zu machen" – ist das dann echt? Oder einfach laut?',
          timestamp: '07:56',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Wann fühlt sich etwas für dich echt an (beim Sagen, beim Zuhören, beim Tun)? ODER „Wann bist du du – ohne Maske, ohne Rolle, einfach so wie du bist?',
          timestamp: '07:56',
        },
      ],
    },
  ],
};

export default course;
