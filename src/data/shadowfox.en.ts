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
    'A multi-part chat thriller about identity, privacy, and safety online—and what you can do.',
  script: [
    {
      chapter: 1,
      messages: [
        {
          type: 'other',
          speaker: characters.shadowfox,
          content: 'Hello 7b… 😎',
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
          content: 'Hi 😊! Who are you?!',
          timestamp: '19:24',
          reactions: ['😊'],
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          content: 'You get 3 guesses 🕵️‍♀️🔎🧩❓',
          timestamp: '19:25',
        },
        {
          type: 'other',
          speaker: characters.tom,
          content: 'Hm, no idea.',
          timestamp: '19:25',
        },
        {
          type: 'other',
          speaker: characters.chioma,
          content: 'Probably another gaming buddy of someone from Roblox?',
          timestamp: '19:25',
          reactions: ['🧐'],
        },
        {
          type: 'other',
          speaker: characters.mia,
          content:
            'Or Mia’s cousin, or something? There are way too many people here!',
          timestamp: '19:26',
        },
        {
          type: 'other',
          speaker: characters.finn,
          content: 'Are you new or have you always been in the group?',
          timestamp: '19:27',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'Did someone invite you?',
          timestamp: '19:27',
        },
        {
          type: 'other',
          speaker: characters.tom,
          content: 'Certainly not me!',
          timestamp: '19:28',
        },
        {
          type: 'other',
          speaker: characters.chioma,
          content: 'Come on, who are you?',
          timestamp: '19:35',
          reactions: ['😳'],
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          content: 'Maybe you will get to know me… better than you would like.',
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
            'What could you do if someone suddenly seems unfamiliar in the chat?',
          timestamp: '19:37',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Regularly check who is in your chats before you post private messages.',
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
          content: 'Good luck today, Mia 😉—do not get nervous.',
          timestamp: '07:06',
          reactions: ['😉'],
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'Huh? Why?',
          timestamp: '07:08',
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          content: 'For the make-up exam in English. You will be fine.',
          timestamp: '07:08',
        },
        {
          type: 'other',
          speaker: characters.tom,
          content: 'What make-up exam?',
          timestamp: '07:12',
        },
        {
          type: 'other',
          speaker: characters.dominik,
          content: 'Seriously? Mia has a make-up exam 🤣.',
          timestamp: '07:13',
          reactions: ['😂'],
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'Oh man, that is embarrassing…',
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
          content: 'How do YOU know that?!',
          timestamp: '07:14',
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          content: '🦊😈 I have my sources…',
          timestamp: '07:15',
        },
        {
          type: 'other',
          speaker: characters.chioma,
          content: 'How creepy.',
          timestamp: '07:16',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'He is spying on us!',
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
          content: 'What does “private matter” on the internet mean to you?',
          timestamp: '07:18',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'If something gives you a strange feeling, say “Stop!” or leave the group.',
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
            'We should kick ShadowFox out again; we do not even know him.',
          timestamp: '07:40',
        },
        {
          type: 'other',
          speaker: characters.carlos,
          content:
            'Maybe we do know him after all. It could also be that someone in the group just changed their profile name. In WhatsApp you can do that at any time—then suddenly there is a new name.',
          timestamp: '07:41',
        },
        {
          type: 'other',
          speaker: characters.dominik,
          content: 'Someone must have invited ShadowFox!',
          timestamp: '07:41',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'No matter why he is here—the guy has to go!',
          timestamp: '07:42',
          reactions: ['👍🏻'],
        },
        {
          type: 'other',
          speaker: characters.tom,
          content:
            'I agree with Mia: It was funny, but the fun is over!! Who are you??',
          timestamp: '07:44',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'If you do not say it now, you are out!',
          timestamp: '07:44',
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          content: 'You will not get rid of me that easily. 🦊😈',
          timestamp: '07:45',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'What rules should there be in a chat so that everyone feels comfortable?',
          timestamp: '07:46',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'The same applies in the chat as on the Playground: only those who behave fairly may play along. Your freedom ends where that of others begins.',
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
          content: 'Okay, the fox is out now!',
          timestamp: '16:12',
        },
        {
          type: 'other',
          speaker: characters.dominik,
          content: 'Did not think you were such a wimp 😆',
          timestamp: '16:12',
          reactions: ['😂'],
        },
        {
          type: 'other',
          speaker: characters.mia,
          content:
            'Reply to: “Did not think…” — Leave Tom alone. This is really creepy! Tom, kick him out!',
          timestamp: '16:13',
        },
        {
          type: 'other',
          speaker: characters.tom,
          content: 'I cannot remove him...',
          timestamp: '16:15',
          reactions: ['😱'],
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'Huh?!?!',
          timestamp: '16:15',
        },
        {
          type: 'other',
          speaker: characters.carlos,
          content: 'Wait… maybe you are not an admin.',
          timestamp: '16:16',
        },
        {
          type: 'other',
          speaker: characters.carlos,
          content: 'I will try.',
          timestamp: '16:16',
        },
        {
          type: 'other',
          speaker: characters.dominik,
          content: 'You really are a bunch of losers!',
          timestamp: '16:16',
          reactions: ['👎'],
        },
        {
          type: 'other',
          speaker: characters.carlos,
          content:
            'Does not work either. I am not an admin either. Admin is...',
          timestamp: '16:17',
        },
        {
          type: 'other',
          speaker: characters.carlos,
          content: 'Oh... you will not believe this...',
          timestamp: '16:18',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'Come on, say it!',
          timestamp: '16:18',
        },
        {
          type: 'other',
          speaker: characters.carlos,
          content: 'It is... ShadowFox.',
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
          content: 'Who has admin rights in your chats?',
          timestamp: '16:20',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'For important groups (e.g., class chat) there should be multiple admins so that not one person alone decides everything.',
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
          content: 'How he gives her a kiss at last year’s class party.',
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
          content: 'How cute!',
          timestamp: '19:54',
          reactions: ['❤️'],
        },
        {
          type: 'other',
          speaker: characters.dominik,
          content: 'Hahaha, embarrassing! 🤣',
          timestamp: '19:54',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'Are you crazy?! Delete that immediately!',
          timestamp: '19:56',
          reactions: ['🫷'],
        },
        {
          type: 'other',
          speaker: characters.finn,
          content: 'That is not funny. That does not belong here! Cut it out.',
          timestamp: '19:56',
          reactions: ['👍🏻'],
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          content: 'Well… it seems the others are having the fun 😂😈.',
          timestamp: '19:57',
        },
        {
          type: 'other',
          speaker: characters.chioma,
          content: 'Where did you even get that?',
          timestamp: '19:59',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'That was over a year ago! I thought it was deleted!',
          timestamp: '20:01',
        },
        {
          type: 'other',
          speaker: characters.carlos,
          content:
            'Once something has been in the chat or someone saved it, it can reappear at any time. Even if it was deleted long ago.',
          timestamp: '20:02',
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          content: 'Some memories you do not forget… 😈',
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
            'Imagine someone posts an old photo of you today that embarrasses you—how would you react and what would you wish from the others?',
          timestamp: '20:04',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Always ask first before you share a photo of someone—and be careful what you send of yourself.',
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
            'So, Mia… how is that presentation going that you keep putting off?',
          timestamp: '06:25',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'How do you know about THAT again?!',
          timestamp: '07:02',
          reactions: ['😱'],
        },
        {
          type: 'other',
          speaker: characters.finn,
          content: 'What presentation? Is that written somewhere?',
          timestamp: '07:05',
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          content: 'You just have to know where to listen. 🦊',
          timestamp: '07:05',
        },
        {
          type: 'other',
          speaker: characters.chioma,
          content: 'What are you trying to say—you stalker?',
          timestamp: '07:06',
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          content:
            'That I do not only read here. Some of you speak louder than you think.',
          timestamp: '07:06',
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          content: 'And Finn… how was last night in Tower of Hell? 😉',
          timestamp: '07:08',
        },
        {
          type: 'other',
          speaker: characters.finn,
          content: '? How do you know...?',
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
            'Finn, did you play with that guy yesterday? Do you actually know ShadowFox after all?? Spit it out!',
          timestamp: '07:09',
        },
        {
          type: 'other',
          speaker: characters.finn,
          content: 'I do not think so. Maybe he was simply in the same game…',
          timestamp: '07:10',
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          content: 'Maybe I am closer to you than you think.',
          timestamp: '07:10',
          reactions: ['🥱'],
        },
        {
          type: 'system',
          content: 'Lisa left the chat.',
          timestamp: '07:11',
        },
        {
          type: 'system',
          content: 'Jonas left the chat.',
          timestamp: '07:11',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'What would you do if you noticed that someone has more information about you than you are comfortable with?',
          timestamp: '07:12',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Be aware that through all the different channels you use, you reveal lots of little puzzle pieces about yourself.',
          timestamp: '07:12',
        },
      ],
    },
    {
      chapter: 7,
      messages: [
        {
          type: 'system',
          content: 'Ping!',
          timestamp: '07:35',
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          content: 'I think it is time to show you my ace up the sleeve…',
          timestamp: '07:35',
        },
        {
          type: 'other',
          speaker: characters.tom,
          content: 'What is that supposed to mean?',
          timestamp: '07:35',
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          content:
            'Let us put it this way… I have something your teacher would find very interesting.',
          timestamp: '07:35',
        },
        {
          type: 'other',
          speaker: characters.chioma,
          content: 'Stop the nonsense. Nobody believes you.',
          timestamp: '07:35',
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          content:
            'Oh no? Then maybe you will believe me when she sets your project grade to 6. 🦊😈',
          timestamp: '07:35',
          reactions: ['👎'],
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'Huh? Why would she do that?',
          timestamp: '07:36',
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          content:
            'Because I know how your sustainability project really came about—with AI.',
          timestamp: '07:37',
        },
        {
          type: 'other',
          speaker: characters.finn,
          content: 'Uh?!',
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
          content: 'I have proof—and Ms. Schubert will not like it.',
          timestamp: '07:38',
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          content: 'Then the lady is getting a little surprise now… 📤',
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
            'Whom would you ask for help if someone threatens you online?',
          timestamp: '07:41',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Never react blindly in panic—seek help first. Then together you can check what is behind the threat.',
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
          content:
            'So, Finn… how long do you think you will stay in first place? 😏',
          timestamp: '17:41',
        },
        {
          type: 'other',
          speaker: characters.finn,
          content: 'What?! That is my account!',
          timestamp: '17:41',
          reactions: ['😱'],
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'How did the fox get in there?',
          timestamp: '17:41',
        },
        {
          type: 'other',
          speaker: characters.tom,
          content: 'That is completely insane…',
          timestamp: '17:42',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content:
            'What do you want from us? What do we have to do so you do not tell on us and leave Finn’s account alone??',
          timestamp: '17:42',
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          content: 'Maybe I just want you to finally take me seriously.',
          timestamp: '17:45',
        },
        {
          type: 'other',
          speaker: characters.chioma,
          content: 'Have we not? What did we supposedly do to you?',
          timestamp: '17:45',
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          content: 'You have no idea what it is like to simply be forgotten.',
          timestamp: '17:47',
          reactions: ['🥱'],
        },
        {
          type: 'main',
          speaker: characters.amy,
          content: 'How would you react if someone hacked into your account?',
          timestamp: '17:47',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content: 'Use a strong, unique password for every account.',
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
            '@ShadowFox: What do we have to do for you to leave us alone?',
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
          content: '— Private chat between Tom, Mia, Finn, Chioma, Carlos —',
          timestamp: '17:47',
        },
        {
          type: 'other',
          speaker: characters.tom,
          content: 'Honestly... why should we not use AI to research.',
          timestamp: '17:47',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'Well, we should have said so.',
          timestamp: '17:48',
        },
        {
          type: 'other',
          speaker: characters.tom,
          content: 'But we even checked the sources.',
          timestamp: '17:48',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'I know, but will Ms. Schubert see it that relaxed?',
          timestamp: '17:49',
        },
        {
          type: 'other',
          speaker: characters.tom,
          content:
            'It is best if we bring it up to her ourselves. If we handle it transparently, she will probably react cool.',
          timestamp: '17:49',
          reactions: ['🤞'],
        },
        {
          type: 'other',
          speaker: characters.finn,
          content:
            'Hey, folks, that is nice for you! But what do I do about my account??',
          timestamp: '17:50',
        },
        {
          type: 'other',
          speaker: characters.carlos,
          content:
            'Calm down, man. Log in and set a new password—you should have done that long ago anyway.',
          timestamp: '17:50',
          reactions: ['🫷'],
        },
        {
          type: 'other',
          speaker: characters.finn,
          content:
            'Uh, right. Where exactly is he in there? I will zoom into the photo…',
          timestamp: '17:51',
        },
        {
          type: 'other',
          speaker: characters.finn,
          content:
            '...Wait. Do you see that? On the right edge of the monitor there is a... mirror.',
          timestamp: '17:51',
          reactions: ['🧐'],
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'What is your opinion about using AI for a project assignment?',
          timestamp: '17:52',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Always be transparent when you use AI. If you have to hide it, it was probably not allowed.',
          timestamp: '17:52',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Change your passwords regularly and inform an adult immediately if someone gains access to your accounts.',
          timestamp: '17:52',
        },
      ],
    },
    {
      chapter: 10,
      messages: [
        {
          type: 'system',
          content: '— Private chat between Tom, Mia, Finn, Chioma, Carlos —',
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
          content: 'Yes… and there is a piece of his face!',
          timestamp: '17:51',
        },
        {
          type: 'other',
          speaker: characters.tom,
          content: 'Wait… I think I recognize him…',
          timestamp: '17:52',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'Who is it?',
          timestamp: '17:52',
        },
        {
          type: 'other',
          speaker: characters.tom,
          content: 'It is Miro, definitely!',
          timestamp: '17:52',
          reactions: ['😳'],
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'Who??',
          timestamp: '17:52',
        },
        {
          type: 'other',
          speaker: characters.tom,
          content:
            'Miro. Do you not remember? He used to be in the class but never said anything. A real loner. Since he moved away, I have not heard anything from him.',
          timestamp: '17:53',
        },
        {
          type: 'other',
          speaker: characters.tom,
          content:
            'But wait... let us first discuss what we should do before we report him.',
          timestamp: '17:53',
        },
        {
          type: 'other',
          speaker: characters.finn,
          content: 'Why? He has been harassing us for days!',
          timestamp: '17:54',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'What would you do if you recognized someone who did something wrong?',
          timestamp: '17:54',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Always take a breath and stay calm so you can make the best decisions.',
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
          content: 'Yes, but maybe we can solve it without a huge fight.',
          timestamp: '17:54',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content:
            'Exactly. What if we get him to explain his tricks? Then we all learn something.',
          timestamp: '17:55',
        },
        {
          type: 'other',
          speaker: characters.finn,
          content: 'You really want to talk to him?',
          timestamp: '17:56',
        },
        {
          type: 'other',
          speaker: characters.chioma,
          content:
            'It might work. Maybe he is only like this because he feels excluded—if he joins in, he gets recognition instead of trouble—and uses his skills so we can make something good out of it together.',
          timestamp: '17:56',
        },
        {
          type: 'other',
          speaker: characters.tom,
          content:
            'Okay, so: we write to him that we have recognized him—and that he should explain everything he did. But only if he is honest.',
          timestamp: '17:57',
          reactions: ['👍🏻'],
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'I will write to him privately.',
          timestamp: '17:57',
        },
        {
          type: 'system',
          content: 'Group chat 7b — Added: Miro',
          timestamp: '18:05',
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          content: '…Are you serious? I did not want to snitch on myself??',
          timestamp: '18:05',
        },
        {
          type: 'other',
          speaker: characters.tom,
          content: 'Yes. But only if you are really honest.',
          timestamp: '18:05',
        },
        {
          type: 'other',
          speaker: characters.shadowfox,
          content:
            'Okay… I am Miro. And you have no idea how many mistakes you make online.',
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
            'What does it feel like to be excluded, and how does it feel when others show interest in you?',
          timestamp: '18:07',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content: 'Use your skills to help others, not to harm them.',
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
          content: 'Class chat of 7b',
          timestamp: '06:55',
        },
        {
          type: 'other',
          speaker: characters.miro,
          content:
            'Hey everyone… I wanted to apologize to all of you again. I did not want to take revenge on you—well, maybe a little 😉. BUT: I also wrote down everything I noticed. So we can all learn from it. 😇',
          timestamp: '06:56',
        },
        {
          type: 'other',
          speaker: characters.chioma,
          content: 'I am curious! 🤞',
          timestamp: '06:57',
          reactions: ['🤞'],
        },
        {
          type: 'other',
          speaker: characters.miro,
          content:
            'Finn, you simply used your date of birth as the password; that was of course easy to crack.',
          timestamp: '06:58',
        },
        {
          type: 'other',
          speaker: characters.finn,
          content: 'Yeah, not smart 🤦',
          timestamp: '06:58',
        },
        {
          type: 'other',
          speaker: characters.miro,
          content:
            'Mia— I discovered your exam date because the link to the school folder popped up once in the class chat. It is not protected and is still open to anyone with the link. The exam calendar is there too. The date has already been changed a few times...',
          timestamp: '06:59',
        },
        {
          type: 'other',
          speaker: characters.carlos,
          content:
            'Wow… I did not know that anyone can open something like that.',
          timestamp: '06:59',
        },
        {
          type: 'other',
          speaker: characters.miro,
          content:
            'Links are like keys—if you give out the link, anyone can get in.',
          timestamp: '07:00',
          reactions: ['🧐'],
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'What can you do to better protect your info on the internet?',
          timestamp: '07:01',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Passwords protect you, links are digital keys, and open folders need encryption—otherwise your data is accessible to anyone.',
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
            'And your English retake, Mia… I read about that on your mother’s Facebook page.',
          timestamp: '07:04',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content:
            'Oops. How embarrassing! I need to tell her she should not post things like that publicly.',
          timestamp: '07:04',
          reactions: ['🙈'],
        },
        {
          type: 'other',
          speaker: characters.miro,
          content:
            'Yes—even family can accidentally reveal info. It was only meant nicely: “Everyone keep your fingers crossed for Mia’s English retake tomorrow.”',
          timestamp: '07:06',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'Wow. But thank you, Miro. 🙏',
          timestamp: '07:06',
          reactions: ['❤️'],
        },
        {
          type: 'other',
          speaker: characters.miro,
          content:
            'It is really nice to belong now. I also made a poster for your class. You can hang it up at school so everyone can learn something from it.',
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
          content: 'Which of these tips can you put into practice today?',
          timestamp: '07:08',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Write down what you have learned. Share it with your friends if it could be interesting for them too.',
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
            'Thank you, Miro. The poster is already hanging in the classroom. Ms. Schubert was very pleased and says hi 👋🏾. But what I still do not get: how do you know that we used AI for the project work?',
          timestamp: '16:35',
        },
        {
          type: 'other',
          speaker: characters.miro,
          content:
            'In your presentation it was particularly easy. You shared a link that had a little suffix at the end — …/xyz-chatgpt. That means the content came from an AI. You did not see the suffix, but I did.',
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
          content: 'Crazy—I did not pay attention to that at all!',
          timestamp: '16:37',
          reactions: ['😳'],
        },
        {
          type: 'other',
          speaker: characters.miro,
          content:
            'Links are like footprints—they often reveal more than you think.',
          timestamp: '16:38',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'Thank you, Miro. And welcome back.',
          timestamp: '16:38',
          reactions: ['❤️'],
        },
        {
          type: 'other',
          speaker: characters.dominik,
          content: 'Although, I almost miss ShadowFox a little 🤣',
          timestamp: '16:38',
          reactions: ['😂'],
        },
        {
          type: 'system',
          image: shadowfoxEnd,
          content: 'Group photo: All is well that ends well.',
          timestamp: '16:39',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'To whom could you kindly say what mistake he or she is making?',
          timestamp: '16:40',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Write down what you have learned. Share it with your friends if it helps them.',
          timestamp: '16:40',
        },
      ],
    },
  ],
};

export default course;
