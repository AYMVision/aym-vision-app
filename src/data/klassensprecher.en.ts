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
  title: 'Class Representative',
  image: titleImage,
  description:
    'Learn through a chat how quickly information spreads on the internet – and how to protect yourself.',
  script: [
    {
      chapter: 1,
      messages: [
        {
          type: 'other',
          speaker: characters.yasmin,
          content: 'Drumroll… And the winner is…',
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
          content: 'Wait… SERIOUSLY?!',
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
          content: 'Congrats Lukas',
          timestamp: '16:25',
        },
        {
          type: 'other',
          speaker: characters.dominik,
          content: 'Wow. And without any social media campaign – respect 😂',
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
          content: 'Maybe EXACTLY because of that 🤫',
          timestamp: '16:25',
        },
        {
          type: 'other',
          speaker: characters.yasmin,
          content: 'Class rep energy without drama 💪',
          timestamp: '16:26',
        },
        {
          type: 'other',
          speaker: characters.lisa,
          content: 'But now he has to officially post something, right?',
          timestamp: '16:27',
          reactions: ['👍'],
        },
        {
          type: 'other',
          speaker: characters.meron,
          content: 'Yes! And new group description + profile pic!',
          timestamp: '16:27',
        },
        {
          type: 'other',
          speaker: characters.dominik,
          content: '…and please take an "oath of office" selfie 😂',
          timestamp: '16:28',
        },
        {
          type: 'main',
          speaker: characters.lukas,
          content: 'What exactly do you all expect from me? Seriously.',
          timestamp: '16:28',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            "What do you think: Why do some people trust Lukas, even though (or maybe because) he's not as loud as the others?",
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
            'Now you have to post when teachers say something embarrassing again.',
          timestamp: '16:35',
        },
        {
          type: 'other',
          speaker: characters.yasmin,
          content:
            'Please NO motivational quotes, Lukas 🤢 Like with sunrises and "You can do it!" and stuff',
          timestamp: '16:35',
        },
        {
          type: 'other',
          speaker: characters.meron,
          content:
            "If you come with group rules now, I'm out – we want memes, not moral lessons.",
          timestamp: '16:36',
        },
        {
          type: 'other',
          speaker: characters.yasmin,
          content:
            'Main thing is you share the homework results. Everything else we can figure out later 😅',
          timestamp: '16:36',
          reactions: ['👍'],
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: "Guys… he's a class representative, not a content creator.",
          timestamp: '16:37',
        },
        {
          type: 'main',
          speaker: characters.lukas,
          content:
            'Interesting what you all imagine. I think I need to sort things out first.',
          timestamp: '16:38',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            "What do you do when others expect you to post something – but you're unsure if you want to?",
          timestamp: '16:38',
        },
      ],
    },
    {
      chapter: 3,
      messages: [
        {
          type: 'system',
          content: 'Lukas changed the group picture.',
          image: gruppenbild,
          timestamp: '21:38',
        },
        {
          type: 'system',
          content: 'Lukas changed the group description: > "I listen first."',
          timestamp: '21:38',
        },
        {
          type: 'other',
          speaker: characters.lisa,
          content: "That's your statement now?",
          timestamp: '07:46',
        },
        {
          type: 'other',
          speaker: characters.meron,
          content: 'So… minimalist 🤔',
          timestamp: '07:46',
        },
        {
          type: 'other',
          speaker: characters.dominik,
          content: "Huh? What's that supposed to mean??",
          timestamp: '07:47',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'I find it kind of strong. No fuss.',
          timestamp: '07:47',
        },
        {
          type: 'other',
          speaker: characters.yasmin,
          content: 'I like it. Quiet, but clear.',
          timestamp: '07:47',
        },
        {
          type: 'other',
          speaker: characters.chioma,
          content: "That's just typical Lukas. No show – but with attitude.",
          timestamp: '07:48',
          reactions: ['👍'],
        },
        {
          type: 'other',
          speaker: characters.meron,
          content: 'Yeah, okay. At least no sunset.',
          timestamp: '07:48',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'User, how would you feel if someone in your group posted a picture like this?',
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
            'Your notebook post was cool. Such a quiet "I\'m here" move. I loved it.',
          timestamp: '07:53',
        },
        {
          type: 'main',
          speaker: characters.lukas,
          content:
            'It was more "I don\'t know" than "I\'m above it all". But yeah – I\'m here.',
          timestamp: '07:54',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content:
            "I'm just wondering: And now? So… are you just going to be a quiet class rep? Or is there more coming?",
          timestamp: '07:54',
        },
        {
          type: 'main',
          speaker: characters.lukas,
          content:
            "Honestly? No idea. I'm listening right now, yeah – but at some point you all expect me to say something. Or do something. Or delete something 😅",
          timestamp: '07:55',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content:
            'Well. If everyone just listens, nothing changes. Someone has to start sometime. Otherwise expectations just keep hanging there.',
          timestamp: '07:55',
        },
        {
          type: 'main',
          speaker: characters.lukas,
          content:
            'True. But if I post something now just to "do something" – is that real? Or just loud?',
          timestamp: '07:56',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'When does something feel real to you (when speaking, listening, doing)? OR "When are you yourself – without a mask, without a role, just as you are?"',
          timestamp: '07:56',
        },
      ],
    },
  ],
};

export default course;
