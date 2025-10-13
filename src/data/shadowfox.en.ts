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
import shadowfox15 from '../assets/stories/shadowfox/shadowfox15.png';

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
  id: 'shadowfox-network',
  title: 'ShadowFox',
  image: titleImage,
  description:
    'ShadowFox hacks into class 7b’s group chat and knows some embarrassing secrets. Can Tom, Mia & Co. unmask the fox in time? (Recommended for ages 9–12)',
  script: [
    {
      chapter: 1,
      messages: [
        {
          type: 'main',
          speaker: characters.amy,
          image: shadowfox1,
          timestamp: '07:01',
        },
        {
          type: 'main',
          speaker: characters.shadowfox,
          content: 'Hello 7b… 😎',
          timestamp: '19:24',
        },
        {
          type: 'other',
          speaker: characters.finn,
          content: 'Hi 😊! Who are you?!',
          timestamp: '19:24',
        },
        {
          type: 'main',
          speaker: characters.shadowfox,
          content: 'You can guess three times 🕵️‍♀️🔎🧩❓',
          timestamp: '19:25',
        },
        {
          type: 'other',
          speaker: characters.tom,
          content: 'Hmm, no idea.',
          timestamp: '19:25',
        },
        {
          type: 'other',
          speaker: characters.chioma,
          content: 'Probably some gaming buddy from Roblox again?',
          timestamp: '19:25',
          reactions: ['🧐'],
        },
        {
          type: 'other',
          speaker: characters.mia,
          content:
            "Or someone's cousin or something? There are way too many people here! 🙄",
          timestamp: '19:26',
        },
        {
          type: 'other',
          speaker: characters.finn,
          content: 'Are you new here or have you always been in the group?',
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
          content: 'Definitely not me!',
          timestamp: '19:28',
        },
        {
          type: 'other',
          speaker: characters.chioma,
          replyTo: {
            speakerName: characters.shadowfox.name,
            text: 'Hello 7b… 😎',
          },
          content: 'Come on, who are you?',
          timestamp: '19:35',
        },
        {
          type: 'main',
          speaker: characters.shadowfox,
          content: 'Maybe you’ll get to know me soon… better than you’d like.',
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
          content: '?😳',
          timestamp: '19:36',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'What could you do if someone in a chat suddenly seems strange to you?',
          timestamp: '19:37',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Regularly check who’s in your chats before you share private messages.',
          timestamp: '19:37',
        },
      ],
    },
    {
      chapter: 2,
      messages: [
        {
          type: 'main',
          speaker: characters.shadowfox,
          content: 'Good luck today, Mia 😉 – don’t get nervous.',
          timestamp: '07:06',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'Huh? Why?',
          timestamp: '07:08',
        },
        {
          type: 'main',
          speaker: characters.shadowfox,
          content: 'Well, for your English test. You’ll do fine.',
          timestamp: '07:08',
        },
        {
          type: 'other',
          speaker: characters.tom,
          content: 'What test? 🤨',
          timestamp: '07:12',
        },
        {
          type: 'other',
          speaker: characters.dominik,
          content: 'Seriously? Mia has a make-up test 🤣.',
          timestamp: '07:13',
          reactions: ['😂'],
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'Oh man, that’s embarrassing…',
          timestamp: '07:14',
          reactions: ['🙈'],
        },
        {
          type: 'main',
          speaker: characters.amy,
          image: shadowfox2,
          timestamp: '07:14',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'How do YOU even know that?!',
          timestamp: '07:14',
        },
        {
          type: 'main',
          speaker: characters.shadowfox,
          content: '🦊😈 I have my sources…',
          timestamp: '07:15',
        },
        {
          type: 'other',
          speaker: characters.chioma,
          content: 'Creepy.',
          timestamp: '07:16',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'He’s spying on us!',
          timestamp: '07:16',
        },
        {
          type: 'main',
          speaker: characters.shadowfox,
          content: '... 👀',
          timestamp: '07:17',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content: 'What does “private” mean to you on the internet?',
          timestamp: '07:18',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content: 'If something feels weird, say “Stop!” or leave the group.',
          timestamp: '07:18',
        },
      ],
    },
    {
      chapter: 3,
      messages: [
        {
          type: 'main',
          speaker: characters.amy,
          image: shadowfox3,
          timestamp: '07:40',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'We should kick ShadowFox out; we don’t even know him.',
          timestamp: '07:40',
        },
        {
          type: 'other',
          speaker: characters.carlos,
          content:
            'Maybe we do know him. It could be someone who just changed their profile name. In WhatsApp you can do that anytime – suddenly there’s a new name.',
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
          content: 'Doesn’t matter why he’s here – he needs to go!',
          timestamp: '07:42',
          reactions: ['👍🏻'],
        },
        {
          type: 'other',
          speaker: characters.tom,
          content:
            'I agree with Mia: It was funny at first, but now it’s over!! Who are you??',
          timestamp: '07:44',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'If you don’t tell us now, you’re out!',
          timestamp: '07:44',
        },
        {
          type: 'main',
          speaker: characters.shadowfox,
          content: 'You won’t get rid of me that easily. 🦊😈',
          timestamp: '07:45',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content: 'What kind of chat rules make everyone feel comfortable?',
          timestamp: '07:46',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'The same rules apply online as on the playground: Only those who act fair can join in.',
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
          content: 'Okay, the fox is out!',
          timestamp: '16:12',
        },
        {
          type: 'other',
          speaker: characters.dominik,
          content: 'Didn’t think you were such a scaredy-cat 😆',
          timestamp: '16:12',
          reactions: ['😂'],
        },
        {
          type: 'other',
          speaker: characters.mia,
          replyTo: {
            speakerName: characters.dominik.name,
            text: 'Didn’t think you were such a scaredy-cat 😆',
          },
          content: 'Leave Tom alone. That’s super creepy! Tom, kick him out!',
          timestamp: '16:13',
        },
        {
          type: 'other',
          speaker: characters.tom,
          content: 'I can’t delete him...',
          timestamp: '16:15',
          reactions: ['😱'],
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'What?!?!',
          timestamp: '16:15',
        },
        {
          type: 'other',
          speaker: characters.carlos,
          content: 'Wait… maybe you’re not admin.',
          timestamp: '16:16',
        },
        {
          type: 'other',
          speaker: characters.carlos,
          content: 'I’ll try.',
          timestamp: '16:16',
        },
        {
          type: 'other',
          speaker: characters.dominik,
          content: 'You’re such losers!',
          timestamp: '16:16',
          reactions: ['👎'],
        },
        {
          type: 'other',
          speaker: characters.carlos,
          content: 'Nope, doesn’t work. I’m not admin either. The admin is...',
          timestamp: '16:17',
        },
        {
          type: 'other',
          speaker: characters.carlos,
          content: 'Oh… you won’t believe this…',
          timestamp: '16:18',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'Come on, tell us!',
          timestamp: '16:18',
        },
        {
          type: 'other',
          speaker: characters.carlos,
          content: 'It’s… ShadowFox.',
          timestamp: '16:19',
          reactions: ['😳'],
        },
        {
          type: 'main',
          speaker: characters.amy,
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
            'Important groups (like a class chat) should have several admins, so one person doesn’t control everything.',
          timestamp: '16:20',
        },
      ],
    },
    {
      chapter: 5,
      messages: [
        {
          type: 'main',
          speaker: characters.shadowfox,
          image: shadowfox5,
          content: 'How he gives her a kiss at last year’s class party.',
          timestamp: '19:54',
        },
        {
          type: 'other',
          speaker: characters.dominik,
          content: 'Oooooh! 😏',
          timestamp: '19:54',
        },
        {
          type: 'other',
          speaker: characters.tom,
          content: 'So cute! ❤️',
          timestamp: '19:54',
        },
        {
          type: 'other',
          speaker: characters.dominik,
          content: 'Haha, embarrassing! 🤣',
          timestamp: '19:54',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'Are you crazy?! Delete that right now!',
          timestamp: '19:56',
        },
        {
          type: 'other',
          speaker: characters.finn,
          content: 'That’s not funny. This doesn’t belong here! Stop it.',
          timestamp: '19:56',
          reactions: ['👍🏻'],
        },
        {
          type: 'main',
          speaker: characters.shadowfox,
          content: 'Well… looks like others are enjoying it 😂😈.',
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
            'Once it’s in a chat or someone saved it, it can pop up anytime — even if you deleted it.',
          timestamp: '20:02',
        },
        {
          type: 'main',
          speaker: characters.shadowfox,
          content: 'Some memories never fade… 😈',
          timestamp: '20:02',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Imagine someone posts an old picture of you that’s embarrassing — how would you react, and what would you hope others would do?',
          timestamp: '20:04',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Always ask before sharing someone’s photo – and be careful what you send yourself.',
          timestamp: '20:04',
        },
      ],
    },
    {
      chapter: 6,
      messages: [
        {
          type: 'main',
          speaker: characters.shadowfox,
          content: 'Hey Mia… how’s that presentation you keep putting off?',
          timestamp: '06:25',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'How do you know ABOUT THAT again?!',
          timestamp: '07:02',
          reactions: ['😱'],
        },
        {
          type: 'other',
          speaker: characters.finn,
          content: 'What presentation? Is that posted somewhere?',
          timestamp: '07:05',
        },
        {
          type: 'main',
          speaker: characters.shadowfox,
          content: 'You just have to know where to listen… 🦊',
          timestamp: '07:05',
        },
        {
          type: 'other',
          speaker: characters.chioma,
          content: 'What do you mean – you stalker?',
          timestamp: '07:06',
        },
        {
          type: 'main',
          speaker: characters.shadowfox,
          content:
            'I don’t just read here. Some of you talk louder than you think.',
          timestamp: '07:06',
        },
        {
          type: 'main',
          speaker: characters.shadowfox,
          content: 'And Finn… how was Tower of Hell last night? 😉',
          timestamp: '07:08',
        },
        {
          type: 'other',
          speaker: characters.finn,
          content: '? How do you…?',
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
            'Finn, did you play with that guy yesterday? Do you actually know ShadowFox?? Tell us!',
          timestamp: '07:09',
        },
        {
          type: 'main',
          speaker: characters.amy,
          image: shadowfox6,
          timestamp: '07:09',
        },
        {
          type: 'other',
          speaker: characters.finn,
          content: 'I don’t think so. Maybe he was just in the same game…',
          timestamp: '07:10',
        },
        {
          type: 'main',
          speaker: characters.shadowfox,
          content: 'Maybe I’m closer than you think.',
          timestamp: '07:10',
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
            'What would you do if someone knew more about you than you’d like?',
          timestamp: '07:12',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Be aware that through all your channels you share little puzzle pieces about yourself.',
          timestamp: '07:12',
        },
      ],
    },
    {
      chapter: 7,
      messages: [
        {
          type: 'main',
          speaker: characters.shadowfox,
          content: '🧨🧨🧨 I think it’s time to show you my ace up my sleeve…',
          timestamp: '07:35',
        },
        {
          type: 'other',
          speaker: characters.tom,
          content: 'What’s that supposed to mean?',
          timestamp: '07:35',
        },
        {
          type: 'main',
          speaker: characters.shadowfox,
          content:
            'Let’s just say… I’ve got something your teacher will find very interesting.',
          timestamp: '07:35',
        },
        {
          type: 'other',
          speaker: characters.chioma,
          content: 'Cut it out. Nobody believes you.',
          timestamp: '07:35',
        },
        {
          type: 'main',
          speaker: characters.shadowfox,
          content:
            'Oh really? Maybe she will when she gives you all an F for your project. 🦊😈',
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
          type: 'main',
          speaker: characters.shadowfox,
          content:
            'Because I know how your sustainability project was really made — with AI.',
          timestamp: '07:37',
        },
        {
          type: 'main',
          speaker: characters.shadowfox,
          image: shadowfox15,
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
          content: 'What 😱',
          timestamp: '07:37',
        },
        {
          type: 'main',
          speaker: characters.shadowfox,
          content: 'I’ve got the proof — and Mrs Schubert won’t like it.',
          timestamp: '07:38',
        },
        {
          type: 'main',
          speaker: characters.shadowfox,
          content: 'Time for a little surprise for her… 📤',
          timestamp: '07:40',
        },
        {
          type: 'main',
          speaker: characters.shadowfox,
          image: shadowfox7,
          timestamp: '07:40',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Who would you ask for help if someone threatened you online?',
          timestamp: '07:41',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Never panic and react blindly – get help first. Then you can figure out together what’s really behind the threat.',
          timestamp: '07:41',
        },
      ],
    },
    {
      chapter: 8,
      messages: [
        {
          type: 'main',
          speaker: characters.shadowfox,
          image: shadowfox8,
          content: 'Hey Finn… how long will you stay number 1? 😏',
          timestamp: '17:41',
        },
        {
          type: 'other',
          speaker: characters.finn,
          content: 'What?! That’s my account!',
          timestamp: '17:41',
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
          content: 'That’s insane…',
          timestamp: '17:42',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content:
            'What do you want from us? What should we do so you leave Finn’s account alone??',
          timestamp: '17:42',
        },
        {
          type: 'main',
          speaker: characters.shadowfox,
          content: 'Maybe I just want you to finally take me seriously.',
          timestamp: '17:45',
        },
        {
          type: 'other',
          speaker: characters.chioma,
          content: 'Didn’t we? What do you think we did to you?',
          timestamp: '17:45',
        },
        {
          type: 'main',
          speaker: characters.shadowfox,
          content: 'You have no idea what it’s like to be forgotten.',
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
          type: 'system',
          content: '— Private chat between Tom, Mia, Finn, Chioma, Carlos —',
          timestamp: '17:47',
        },
        {
          type: 'main',
          speaker: characters.amy,
          image: shadowfox9,
          timestamp: '17:47',
        },
        {
          type: 'other',
          speaker: characters.tom,
          content: 'Honestly… why shouldn’t we use AI to research things?',
          timestamp: '17:47',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'Well, we should’ve told her.',
          timestamp: '17:48',
        },
        {
          type: 'other',
          speaker: characters.tom,
          content: 'But we checked the sources!',
          timestamp: '17:48',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'Yeah, but do you think Mrs Schubert sees it that way?',
          timestamp: '17:49',
        },
        {
          type: 'other',
          speaker: characters.tom,
          content:
            'We should talk to her ourselves. If we’re honest, she’ll probably handle it well.',
          timestamp: '17:49',
          reactions: ['🤞'],
        },
        {
          type: 'other',
          speaker: characters.finn,
          content: 'Hey guys, that’s nice and all! But what about my account??',
          timestamp: '17:50',
        },
        {
          type: 'other',
          speaker: characters.carlos,
          content:
            'Calm down. Log in and set a new password – you should’ve done that ages ago.',
          timestamp: '17:50',
        },
        {
          type: 'other',
          speaker: characters.finn,
          content:
            'Uh, right. Where exactly is he logged in? Let me zoom in on the photo…',
          timestamp: '17:51',
        },
        {
          type: 'other',
          speaker: characters.finn,
          content:
            '…Wait. Do you see that? On the right edge of the monitor there’s a… mirror.',
          timestamp: '17:51',
          reactions: ['🧐'],
        },
        {
          type: 'main',
          speaker: characters.amy,
          content: 'What’s your opinion on using AI for a school project?',
          timestamp: '17:52',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Always be transparent when you use AI. If you have to hide it, it was probably not allowed.',
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
          speaker: characters.finn,
          image: shadowfox10,
          timestamp: '17:51',
        },
        {
          type: 'other',
          speaker: characters.chioma,
          content: 'Yeah… and there’s part of his face!',
          timestamp: '17:51',
        },
        {
          type: 'other',
          speaker: characters.tom,
          content: 'Wait… I think I know him…',
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
          content: 'It’s Miro, definitely!',
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
            'Miro. Don’t you remember? He used to be in our class but never said a word. A total loner. Haven’t heard from him since he moved away.',
          timestamp: '17:53',
        },
        {
          type: 'other',
          speaker: characters.tom,
          content: 'But wait... let’s decide what to do before we report him.',
          timestamp: '17:53',
        },
        {
          type: 'other',
          speaker: characters.finn,
          content: 'Why? He’s been bothering us for days!',
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
            'Take a breath and stay calm so you can make the best decision.',
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
          content: 'Yeah, but maybe we can solve this without a big fight.',
          timestamp: '17:54',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content:
            'Exactly. What if we get him to explain his tricks? Then we can all learn something.',
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
            'It might work. Maybe he acts like this because he feels left out – if he joins in, he’ll get appreciation instead of trouble and use his skills for something good.',
          timestamp: '17:56',
        },
        {
          type: 'other',
          speaker: characters.tom,
          content:
            'Okay, let’s message him that we know who he is – and he should explain everything he did.',
          timestamp: '17:57',
          reactions: ['👍🏻'],
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'I’ll text him privately.',
          timestamp: '17:57',
        },
        {
          type: 'system',
          content: 'Added: ShadowFox',
          timestamp: '18:05',
        },
        {
          type: 'main',
          speaker: characters.shadowfox,
          content: '…Are you serious? I thought you’d just expose me??',
          timestamp: '18:05',
        },
        {
          type: 'other',
          speaker: characters.tom,
          content: 'Yes. But only if you’re honest.',
          timestamp: '18:05',
        },
        {
          type: 'main',
          speaker: characters.shadowfox,
          content:
            'Okay… I’m Miro. And you have no idea how many mistakes you all make online.',
          timestamp: '18:06',
        },
        {
          type: 'system',
          content: 'ShadowFox changed his name to Miro.',
          timestamp: '18:06',
        },
        {
          type: 'main',
          speaker: characters.miro,
          image: shadowfox11,
          timestamp: '18:06',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'How does it feel to be excluded, and how does it feel when others show interest in you?',
          timestamp: '18:07',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content: 'Use your skills to help others, not to hurt them.',
          timestamp: '18:07',
        },
      ],
    },
    {
      chapter: 12,
      messages: [
        {
          type: 'system',
          content: 'Class chat of 7b',
          timestamp: '06:55',
        },
        {
          type: 'main',
          speaker: characters.miro,
          content:
            'Hey everyone… I just wanted to apologize. I didn’t mean to get revenge — well, maybe a little 😉. BUT: I also noted everything I noticed, so we can all learn from it. 😇',
          timestamp: '06:56',
        },
        {
          type: 'main',
          speaker: characters.amy,
          image: shadowfox12,
          timestamp: '17:47',
        },
        {
          type: 'other',
          speaker: characters.chioma,
          content: 'Can’t wait to hear it! 🤞',
          timestamp: '06:57',
          reactions: ['🤞'],
        },
        {
          type: 'main',
          speaker: characters.miro,
          content:
            'Finn, you used your birthday as a password — easy to guess. 💥',
          timestamp: '06:58',
        },
        {
          type: 'other',
          speaker: characters.finn,
          content: 'Yeah, not smart 🤦',
          timestamp: '06:58',
        },
        {
          type: 'main',
          speaker: characters.miro,
          content:
            'Mia – I found out about your exam because the link to the school folder 🗂️ once appeared in the class chat. It’s still open to anyone with the link. The exam schedule is there too 📆. The date has already been changed a few times...',
          timestamp: '06:59',
        },
        {
          type: 'other',
          speaker: characters.carlos,
          content: 'Wow… I didn’t know anyone could open that.',
          timestamp: '06:59',
        },
        {
          type: 'main',
          speaker: characters.miro,
          content:
            'Links are like keys 🔑 – if you share the link, anyone can enter.',
          timestamp: '07:00',
          reactions: ['🧐'],
        },
        {
          type: 'main',
          speaker: characters.amy,
          content: 'What can you do to protect your information better online?',
          timestamp: '07:01',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Passwords protect you, links are digital keys, and open folders need encryption – otherwise your data is open to everyone.',
          timestamp: '07:01',
        },
      ],
    },
    {
      chapter: 13,
      messages: [
        {
          type: 'main',
          speaker: characters.miro,
          content:
            'And your English exam, Mia… I read about it on your mom’s Facebook page.',
          timestamp: '07:04',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content:
            'Oops. So embarrassing! I have to tell her not to post stuff like that publicly.',
          timestamp: '07:04',
          reactions: ['🙈'],
        },
        {
          type: 'main',
          speaker: characters.miro,
          content:
            'Yeah – even family can accidentally share information. She meant well: “Everyone keep your fingers crossed for Mia’s English test tomorrow.”',
          timestamp: '07:06',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'Wow. Thanks, Miro. 🙏',
          timestamp: '07:06',
          reactions: ['❤️'],
        },
        {
          type: 'main',
          speaker: characters.miro,
          content:
            'It’s really nice to be part of the group again. I also made a poster for your class so everyone can learn from this.',
          timestamp: '07:07',
        },
        {
          type: 'main',
          speaker: characters.miro,
          image: shadowfox13,
          timestamp: '07:07',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content: 'Which of these tips could you put into practice today?',
          timestamp: '07:08',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            'Write down what you’ve learned. Share it with your friends if it could help them too.',
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
            'Thanks, Miro. The poster’s already hanging in the classroom. Mrs Schubert loved it and says hi 👋🏾. But one thing I still don’t get: how did you know we used AI for the project?',
          timestamp: '16:35',
        },
        {
          type: 'main',
          speaker: characters.miro,
          content:
            'That one was easy. In your presentation link, there was a tiny extra bit at the end – …/xyz-chatgpt. That means the content came from AI. You might not have noticed, but I did.',
          timestamp: '16:36',
        },
        {
          type: 'main',
          speaker: characters.miro,
          image: shadowfox15,
          timestamp: '16:36',
        },
        {
          type: 'other',
          speaker: characters.carlos,
          content: 'Crazy – I never noticed that!',
          timestamp: '16:37',
          reactions: ['😳'],
        },
        {
          type: 'main',
          speaker: characters.miro,
          content:
            'Links are like footprints – they reveal more than you think.',
          timestamp: '16:38',
        },
        {
          type: 'other',
          speaker: characters.mia,
          content: 'Thanks, Miro. And welcome back.',
          timestamp: '16:38',
          reactions: ['❤️'],
        },
        {
          type: 'other',
          speaker: characters.dominik,
          content: 'Though I kinda miss ShadowFox 🤣',
          timestamp: '16:38',
          reactions: ['😂'],
        },
        {
          type: 'main',
          speaker: characters.amy,
          image: shadowfox14,
          timestamp: '16:38',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content: 'Who could you give kind feedback to?',
          timestamp: '16:40',
        },
        {
          type: 'main',
          speaker: characters.amy,
          content:
            '🦊 Do the ShadowFox Challenge: see who can stay offline the longest while hanging out together outdoors!',
          timestamp: '16:40',
        },
      ],
    },
  ],
};
