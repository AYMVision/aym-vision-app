// src/content/courses/de/s1e01.ts
import type { Course, Reaction } from '../../../common/types';
import { STORY_CHARACTERS as characters } from '../../characters';

const R = (emoji: string, type?: string): Reaction => ({ emoji, type });

const course: Course = {
  id: 's1e01', // ✅ MUST match contentIndex.courseId

  // ❗ Placeholder – DO NOT use in UI
  title: '',
  image: '',
  description: '',

  script: [


    // ------------------------------------
    // Chapter 1 — Class chat: end of vacation
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

        { id: 's1e01c01-0002', type: 'main', speaker: characters.amy, content: 'The class chat had been quiet all week.', timestamp: '10:05' },
        { id: 's1e01c01-0003', type: 'main', speaker: characters.amy, content: 'It was one of those Saturdays when nothing special happens.', timestamp: '10:06',},
        { id: 's1e01c01-0004', type: 'main', speaker: characters.amy, content: 'And exactly on days like that, something seemingly unimportant sometimes happens that changes everything…', timestamp: '10:06',},

        {
          id: 's1e01c01-0005',
          type: 'system',
          kind: 'chat-switch',
          scene: {
            tone: 'class',
            labelKey: 'stories:chatSwitch.class',
            title: 'Class 7b',
            participants: [],
          },
          timestamp: '',
        },

        // Class chat
        { id: 's1e01c01-0006', type: 'other', speaker: characters.carlos, content: 'Are you all back from vacation already? Last weekend of the holidays, then it starts again.', timestamp: '11:12' },
        { id: 's1e01c01-0007', type: 'other', speaker: characters.finn, content: 'don’t even start', timestamp: '11:13' },
        { id: 's1e01c01-0008', type: 'other', speaker: characters.jonas, content: 'I think Aylin is still with her grandma in Turkey.', timestamp: '11:13' },
        { id: 's1e01c01-0009', type: 'other', speaker: characters.finn, content: 'lol, she’s sitting at the computer all day anyway messing around with her pictures', timestamp: '11:14' },
        { id: 's1e01c01-0010', type: 'other', speaker: characters.carlos, content: 'Some of her AI pictures are really strong 👍.', timestamp: '11:14' },
        { id: 's1e01c01-0011', type: 'other', speaker: characters.jonas, content: 'And isn’t Dominik at sports camp?', timestamp: '11:14' },
        { id: 's1e01c01-0012', type: 'other', speaker: characters.dominik, content: 'Been back for ages, bro.', timestamp: '11:15' },
        { id: 's1e01c01-0013', type: 'other', speaker: characters.finn, content: 'i saw pictures of lisa from italy and then from paris', timestamp: '11:15' },
        { id: 's1e01c01-0014', type: 'other', speaker: characters.yasmin, content: 'Yeah.', timestamp: '11:16' },
        { id: 's1e01c01-0015', type: 'other', speaker: characters.yasmin, content: 'She traveled around a lot.', timestamp: '11:16' },
        { id: 's1e01c01-0016', type: 'other', speaker: characters.yasmin, content: 'Also in Scotland.', timestamp: '11:16' },
        { id: 's1e01c01-0017', type: 'other', speaker: characters.finn, content: 'not bad. you were in scotland?', timestamp: '11:17' },
        { id: 's1e01c01-0018', type: 'other', speaker: characters.yasmin, content: 'Not me 😞', timestamp: '11:17' },
        { id: 's1e01c01-0019', type: 'other', speaker: characters.yasmin, content: 'Lisa, obviously.', timestamp: '11:17' },
        { id: 's1e01c01-0020', type: 'other', speaker: characters.yasmin, content: 'I was here the whole vacation 🥱', timestamp: '11:18' },

        // Photo: Lisa from southern France (S1e01c01_1)
        { id: 's1e01c01-0021', type: 'other', speaker: characters.lisa, image: '/media/story/episodes/s1e01/s1e01c01_1-512.webp', content: 'Greetings from southern France 😘', timestamp: '11:19', reactions: [R('❤️'), R('🤩'), R('❤️'), R('🔥')] },


        { id: 's1e01c01-0023', type: 'other', speaker: characters.tom, content: 'awesome 🤩', timestamp: '11:20' },

        { id: 's1e01c01-0024', type: 'other', speaker: characters.dominik, content: 'Crazy 🔥', timestamp: '11:20' },
        { id: 's1e01c01-0025', type: 'other', speaker: characters.igor, content: 'Are you in the Cévennes ⛰️?', timestamp: '11:20' },
        { id: 's1e01c01-0026', type: 'other', speaker: characters.lisa, content: 'Yes. You recognized it?', timestamp: '11:21' },
        { id: 's1e01c01-0027', type: 'other', speaker: characters.igor, content: 'Been there before. Awesome views. Perfect for a stunt video 😭🔥', timestamp: '11:21' },
        { id: 's1e01c01-0028', type: 'other', speaker: characters.lisa, content: 'Mega. Then you know how special it is there.', timestamp: '11:22', reactions: [R('👍')] },
        { id: 's1e01c01-0029', type: 'other', speaker: characters.lisa, content: 'So delicious - the croissants!', timestamp: '11:22' },
        { id: 's1e01c01-0030', type: 'other', speaker: characters.lisa, content: 'And those fragrant lavender fields….', timestamp: '11:23' },
        { id: 's1e01c01-0031', type: 'other', speaker: characters.lisa, content: 'Sun every day ☀️', timestamp: '11:23' },
        { id: 's1e01c01-0032', type: 'other', speaker: characters.igor, content: 'I’d like to be in France right now too - it’s raining here.', timestamp: '11:24' },
        { id: 's1e01c01-0033', type: 'other', speaker: characters.lisa, content: 'With me? ☺️', timestamp: '11:24' },
        { id: 's1e01c01-0034', type: 'other', speaker: characters.lisa, content: 'The sun is shining here 😎☀️', timestamp: '11:25' },
        { id: 's1e01c01-0035', type: 'other', speaker: characters.lisa, content: 'Yasmin? You’re so quiet today 🤔', timestamp: '11:26' },
        { id: 's1e01c01-0036', type: 'other', speaker: characters.yasmin, content: '@Lisa why?', timestamp: '11:26' },
        { id: 's1e01c01-0037', type: 'other', speaker: characters.yasmin, content: 'Are you coming back today?', timestamp: '11:26' },
        { id: 's1e01c01-0038', type: 'other', speaker: characters.lisa, content: 'No, I still have one more day. We’re flying back tomorrow. Phew, and the day after tomorrow school starts again already.', timestamp: '11:27' },
        { id: 's1e01c01-0039', type: 'other', speaker: characters.carlos, content: 'Sounds really nice 🙂. The waterfall photo is strong.', timestamp: '11:28' },
        { id: 's1e01c01-0040', type: 'other', speaker: characters.carlos, content: 'Send another one sometime if you want.', timestamp: '11:28' },
        { id: 's1e01c01-0041', type: 'other', speaker: characters.carlos, content: 'I’m looking at the area in Google Earth right now - the 3D views are pretty good. Almost feels like being there 👍', timestamp: '11:29' },

        // Photo: waterfall (s1e01c01_2)
        { id: 's1e01c01-0042', type: 'other', speaker: characters.lisa, content: '❤️', timestamp: '11:30'},
        { id: 's1e01c01-0043', type: 'other', speaker: characters.lisa, image: '/media/story/episodes/s1e01/s1e01c01_2-512.webp', content: '', timestamp: '11:30'},

        { id: 's1e01c01-0044', type: 'other', speaker: characters.carlos, content: 'Great!', timestamp: '11:31' },
        { id: 's1e01c01-0045', type: 'other', speaker: characters.tom, content: 'Brilliant.', timestamp: '11:31' },
        { id: 's1e01c01-0046', type: 'other', speaker: characters.dominik, content: 'Respect 🔥.', timestamp: '11:31' },

        // Typing/deleting
        { id: 's1e01c01-0047', type: 'system', content: 'Yasmin is typing ...', timestamp: '' },
        { id: 's1e01c01-0048', type: 'system', content: 'Yasmin deletes', timestamp: '' },

        { id: 's1e01c01-0049', type: 'other', speaker: characters.yasmin, content: 'Carlos, how was it at your grandma’s in Spain?', timestamp: '11:33' },



        // Reflection (Amy)
        {
          id: 's1e01c01-0051',
          type: 'main',
          speaker: characters.amy,
          kind: 'amy-question',
          content: 'Yasmin doesn’t seem to know what to write. What would you post in the class chat if you were in her place?',
          timestamp: '',
        },
        {
          id: 's1e01c01-0052',
          type: 'main',
          speaker: characters.amy,
          kind: 'amy-tip',
          content:
            'You don’t always have to react in a group chat. If you don’t have anything productive or kind to say right now, it’s always okay not to post anything at all. That’s better than writing something you’ll regret later.',
          timestamp: '',
        },


                // “1st entry Yasmin”
{
  id: 's1e01c01-bonus-diary-yasmin-1',
  type: 'system',
  kind: 'bonus-link',
  content: 'Bonus: Do you want to know what Yasmin is thinking?',
  linkTo: '/diaries/diary_yasmin?entry=s1e01c01_0001',
  linkLabel: 'Open entry →',
  bonusId: 'diary-yasmin-entry1',
},

      ],
    },

    // ------------------------------------
    // Chapter 2 — Private chat Igor - Yasmin + class chat bike
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

        // Private chat Igor - Yasmin
        { id: 's1e01c02-0002', type: 'other', speaker: characters.igor, content: 'Last day of vacation 😬', timestamp: '12:04' },
        { id: 's1e01c02-0003', type: 'other', speaker: characters.igor, content: 'Wanna hang out? Grieswald mountains. Never been there, even though it’s really not far. Wanna ride down there on my bike 🚵‍♂️🔥', timestamp: '12:05' },
        { id: 's1e01c02-0004', type: 'system', content: 'Yasmin is typing ...', timestamp: '' },
        { id: 's1e01c02-0005', type: 'system', content: 'Yasmin deletes', timestamp: '' },
        { id: 's1e01c02-0006', type: 'system', content: 'Yasmin is typing ...', timestamp: '' },
        { id: 's1e01c02-0007', type: 'other', speaker: characters.yasmin, content: 'Maybe 🤷', timestamp: '12:06' },
        { id: 's1e01c02-0008', type: 'other', speaker: characters.igor, content: 'You could bring Lisa?', timestamp: '12:06' },
        { id: 's1e01c02-0009', type: 'other', speaker: characters.yasmin, content: 'Lisa?', timestamp: '12:07' },
        { id: 's1e01c02-0010', type: 'other', speaker: characters.igor, content: 'Yeah, why not?', timestamp: '12:07' },
        { id: 's1e01c02-0011', type: 'other', speaker: characters.yasmin, content: 'She’s not here.', timestamp: '12:07' },
        { id: 's1e01c02-0012', type: 'other', speaker: characters.igor, content: 'Oh right.', timestamp: '12:08' },
        { id: 's1e01c02-0013', type: 'other', speaker: characters.igor, content: 'So, are you coming?', timestamp: '12:08' },
        { id: 's1e01c02-0014', type: 'other', speaker: characters.yasmin, content: 'And I’m allowed to film little videos of your stunts?', timestamp: '12:09' },
        { id: 's1e01c02-0015', type: 'other', speaker: characters.yasmin, content: 'Nope.', timestamp: '12:09' },
        { id: 's1e01c02-0016', type: 'other', speaker: characters.yasmin, content: 'Can’t.', timestamp: '12:09' },
        { id: 's1e01c02-0017', type: 'other', speaker: characters.igor, content: 'Okay 😅', timestamp: '12:10' },
        { id: 's1e01c02-0018', type: 'other', speaker: characters.igor, content: 'Then maybe later.', timestamp: '12:10' },
        { id: 's1e01c02-0019', type: 'other', speaker: characters.igor, content: 'Lukas is coming too.', timestamp: '12:10' },
        { id: 's1e01c02-0020', type: 'system', content: 'Lukas added.', timestamp: '12:11' },

        // Switch: Class chat
        {
          id: 's1e01c02-0021',
          type: 'system',
          kind: 'chat-switch',
          scene: {
            tone: 'class',
            labelKey: 'stories:chatSwitch.class',
            title: 'Class 7b',
            participants: [],
          },
          timestamp: '',
        },

        { id: 's1e01c02-0022', type: 'other', speaker: characters.lukas, image: '/media/story/episodes/s1e01/s1e01c02_1-512.webp', content: '', timestamp: '13:12', reactions: [R('🔥')] },
    

        { id: 's1e01c02-0024', type: 'other', speaker: characters.lukas, content: 'Igor is really on fire today 🤓🚵‍♂️', timestamp: '13:13' },
        { id: 's1e01c02-0025', type: 'other', speaker: characters.igor, content: 'We found a cool little spot here.', timestamp: '13:13' },
        { id: 's1e01c02-0026', type: 'other', speaker: characters.igor, content: 'Rocky slopes, a rushing river, and hardly any people here.', timestamp: '13:14' },

                {
  id: 's1e01c02-audio-0001',
  type: 'audio',
  speaker: characters.chioma,
  audioSrc: '/media/story/episodes/s1e01/chiomas-sprachnachricht-s1e01c01.mp3',
  timestamp: '13:14'
},

        { id: 's1e01c02-0028', type: 'other', speaker: characters.lisa, content: 'Looks amazing 😍', timestamp: '13:15' },
        { id: 's1e01c02-0029', type: 'other', speaker: characters.lisa, image: '/media/story/episodes/s1e01/s1e01c02_2-512.webp', content: '', timestamp: '13:15', reactions: [R('❤️')] },

        { id: 's1e01c02-0031', type: 'other', speaker: characters.igor, content: 'Nice.', timestamp: '13:16' },
        { id: 's1e01c02-0032', type: 'system', content: 'Yasmin is typing ...', timestamp: '' },
        { id: 's1e01c02-0033', type: 'system', content: 'Yasmin deletes', timestamp: '' },
        { id: 's1e01c02-0034', type: 'system', content: 'Yasmin is typing ...', timestamp: '' },
        { id: 's1e01c02-0035', type: 'other', speaker: characters.yasmin, content: 'Cool.', timestamp: '13:17' },
        { id: 's1e01c02-0036', type: 'system', content: 'Yasmin’s message was deleted.', timestamp: '' },
        { id: 's1e01c02-0037', type: 'other', speaker: characters.yasmin, content: 'Oh, so Lukas, you haaad to film now??', timestamp: '13:18' },

        { id: 's1e01c02-0038', type: 'other', speaker: characters.lukas, content: 'Exactly. I could be sitting at home playing chess in peace right now 😅', timestamp: '13:18' },
        { id: 's1e01c02-0039', type: 'other', speaker: characters.lukas, content: 'Yasmin, you asked earlier about a “spectacular waterfall” nearby. There’s supposed to be one farther downstream. Though I don’t know whether it’s actually “spectacular.”', timestamp: '13:19' },
        { id: 's1e01c02-0040', type: 'other', speaker: characters.yasmin, content: 'I didn’t ask at all!', timestamp: '13:20' },
        { id: 's1e01c02-0041', type: 'other', speaker: characters.lukas, content: 'What? I mean this morning.', timestamp: '13:20' },
        { id: 's1e01c02-0042', type: 'other', speaker: characters.yasmin, content: 'I didn’t. Must have been a misunderstanding.', timestamp: '13:21' },


        // Reflection (Amy)
        { id: 's1e01c02-0043', type: 'main', speaker: characters.amy, kind: 'amy-question', content: 'The posts from Igor, Lukas, and Lisa look really cool. How might classmates feel who aren’t experiencing anything cool right now, and why? ', timestamp: '' },
        {
          id: 's1e01c02-0044',
          type: 'main',
          speaker: characters.amy,
          kind: 'amy-tip',
          content: 'Sometimes it feels uncomfortable when others post cool selfies. This feeling is called FOMO (“Fear of Missing Out”). It’s the feeling of missing out on something because other people are showing it right now. ',
          timestamp: '',
        },
      ],
    },

    // ------------------------------------
    // Chapter 3 — Private chat Igor, Lukas, Yasmin + private chat Yasmin, Lisa
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

        // Private chat Igor, Lukas, Yasmin
        { id: 's1e01c03-0002', type: 'other', speaker: characters.yasmin, content: 'Where exactly are you guys?', timestamp: '13:35' },
        { id: 's1e01c03-0003', type: 'other', speaker: characters.igor, content: 'idk 😂', timestamp: '13:35' },
        { id: 's1e01c03-0004', type: 'other', speaker: characters.igor, content: 'Somewhere in the woods. Really cool here.', timestamp: '13:36' },
        { id: 's1e01c03-0005', type: 'other', speaker: characters.lukas, content: 'I shared my location, so you can see exactly.', timestamp: '13:36' },
        { id: 's1e01c03-0006', type: 'other', speaker: characters.lukas, content: 'To be honest, I’m pretty exhausted.', timestamp: '13:37' },
        { id: 's1e01c03-0007', type: 'other', speaker: characters.lukas, image: '/media/story/episodes/s1e01/s1e01c03_1-512.webp',content: '', timestamp: '13:37' },
        { id: 's1e01c03-0009', type: 'other', speaker: characters.lukas, content: 'I just hope it’s not much farther. My strength is not unlimited. But honestly: the area here is unbelievably beautiful.', timestamp: '13:38' },
        { id: 's1e01c03-0010', type: 'other', speaker: characters.yasmin, content: 'And there’s a waterfall there?', timestamp: '13:39' },
        { id: 's1e01c03-0011', type: 'other', speaker: characters.lukas, content: 'I can’t see it yet. We’re still some distance away.', timestamp: '13:39' },
        { id: 's1e01c03-0012', type: 'other', speaker: characters.lukas, content: 'Igor absolutely wanted to come here for his stunts – very adventurous 😬', timestamp: '13:40' },
        { id: 's1e01c03-0013', type: 'other', speaker: characters.igor, content: 'Think about whether you might want to come after all.', timestamp: '13:41' },
        { id: 's1e01c03-0014', type: 'other', speaker: characters.yasmin, content: 'Sounds pretty cool.', timestamp: '13:41' },
        { id: 's1e01c03-0015', type: 'other', speaker: characters.yasmin, content: 'But by bike? 😝', timestamp: '13:41' },
        { id: 's1e01c03-0016', type: 'other', speaker: characters.yasmin, content: 'I don’t know…', timestamp: '13:42' },
        { id: 's1e01c03-0017', type: 'other', speaker: characters.lukas, content: 'The train station isn’t far from the stream.', timestamp: '13:42' },
        { id: 's1e01c03-0018', type: 'other', speaker: characters.lukas, content: 'We could meet at the waterfall.', timestamp: '13:43' },
        { id: 's1e01c03-0019', type: 'other', speaker: characters.lukas, content: 'Assuming I even make it there alive 😰', timestamp: '13:43' },
        { id: 's1e01c03-0020', type: 'other', speaker: characters.lukas, content: 'So?', timestamp: '13:44' },

        // Switch: Private chat Yasmin, Lisa
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

        { id: 's1e01c03-0022', type: 'other', speaker: characters.lisa, content: 'Did you see Igor’s posts? So cool!', timestamp: '13:50' },
        { id: 's1e01c03-0023', type: 'other', speaker: characters.lisa, content: 'Forwarded:', image: '/media/story/episodes/s1e01/s1e01c03_2-512.webp', timestamp: '13:50' },

        { id: 's1e01c03-0025', type: 'other', speaker: characters.yasmin, content: 'Yeah.', timestamp: '13:51' },
        { id: 's1e01c03-0026', type: 'other', speaker: characters.yasmin, content: 'Are you already back?', timestamp: '13:51' },
        { id: 's1e01c03-0027', type: 'other', speaker: characters.lisa, content: 'We just had a stopover.', timestamp: '13:52' },
        { id: 's1e01c03-0028', type: 'other', speaker: characters.lisa, content: 'Such a shame. I’d really love to go to that stunt track too.', timestamp: '13:52' },
        { id: 's1e01c03-0029', type: 'other', speaker: characters.yasmin, content: 'Oh yeah?', timestamp: '13:53' },
        { id: 's1e01c03-0030', type: 'other', speaker: characters.lisa, content: 'Of course, tomorrow the whole class will probably be talking about it.', timestamp: '13:53' },
        { id: 's1e01c03-0031', type: 'other', speaker: characters.yasmin, content: 'Hm. True actually…', timestamp: '13:54' },

        {
  id: 's1e01c03-tip-amy-staunen',
  type: 'system',
  kind: 'bonus-link',
  content: 'Bonus: Read Amy’s thoughts about wonder.',
  linkTo: '/newspaper/tip-amy-staunen',
  linkLabel: 'Open article →',
  bonusId: 'tip-amy-staunen',
},

        // Reflection (Amy)
        { id: 's1e01c03-0033', type: 'main', speaker: characters.amy, kind: 'amy-question', content: 'Have you ever noticed that chats or posts have influenced your decisions, or not really? Explain what it’s like for you in everyday life.', timestamp: '' },
        {
          id: 's1e01c03-0034',
          type: 'main',
          speaker: characters.amy,
          kind: 'amy-tip',
          content:
            'Posts, photos, and videos only show a selected moment – not the whole day. Even with cool posts, there is often stress before, boredom afterward, and sometimes even trouble. If a picture puts you under pressure: don’t react right away, put the phone away, think: “This is only a snapshot,” and do something else (music, go outside, draw)',
          timestamp: '',
        },
      ],
    },

    // ------------------------------------
    // Chapter 4 — Water level, decision, ask Aylin for advice
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

        // Private chat Igor, Lukas, Yasmin
        { id: 's1e01c04-0002', type: 'other', speaker: characters.yasmin, content: 'How’s it looking over there?', timestamp: '14:05' },
        { id: 's1e01c04-0003', type: 'other', speaker: characters.lukas, content: 'Pretty exhausting 😅', timestamp: '14:06' },
        { id: 's1e01c04-0004', type: 'other', speaker: characters.lukas, content: 'The sun is coming through, so it looks picturesque. But everything is still soaked.', timestamp: '14:06' },
        { id: 's1e01c04-0005', type: 'other', speaker: characters.lukas, content: 'Not ideal at all for my good old bike.', timestamp: '14:07' },
        { id: 's1e01c04-0006', type: 'other', speaker: characters.lukas, content: 'Even with little pressure, the back wheel spins out.', timestamp: '14:07' },
        { id: 's1e01c04-0007', type: 'other', speaker: characters.lukas, content: 'The wet roots give the tires no grip. One small steering mistake - and I slip.', timestamp: '14:08' },
        { id: 's1e01c04-0008', type: 'other', speaker: characters.igor, content: 'Chill. Everything’s easy.', timestamp: '14:08' },
        { id: 's1e01c04-0009', type: 'other', speaker: characters.lukas, content: 'That’s not overreacting. That’s physics.', timestamp: '14:09' },
        { id: 's1e01c04-0010', type: 'other', speaker: characters.yasmin, content: 'What about the river?', timestamp: '14:09' },
        { id: 's1e01c04-0011', type: 'other', speaker: characters.lukas, content: 'Well, judging by the soundscape…', timestamp: '14:10' },
        { id: 's1e01c04-0012', type: 'other', speaker: characters.lukas, content: 'So far we can only see the mountain stream. The water level must be way above normal. We should be careful.', timestamp: '14:10' },
        { id: 's1e01c04-0013', type: 'other', speaker: characters.igor, content: 'Don’t listen to Lukas’s chatter: it’s really awesome here, cool scenery and great downhill runs.', timestamp: '14:11' },
        { id: 's1e01c04-0014', type: 'other', speaker: characters.yasmin, content: 'Okay, I’m on my way.', timestamp: '14:12' },
        { id: 's1e01c04-0015', type: 'other', speaker: characters.yasmin, content: 'I found a blog. There are photos - people in the water in front of the waterfall. Looks so cool… I’d be up for that too. Did you bring swimwear as well?', timestamp: '14:13' },
        { id: 's1e01c04-0016', type: 'other', speaker: characters.lukas, content: 'That’s nonsense.', timestamp: '14:13' },
        { id: 's1e01c04-0017', type: 'other', speaker: characters.lukas, content: 'This place is definitely not suitable for swimming – especially not after the rain.', timestamp: '14:14' },
        { id: 's1e01c04-0018', type: 'other', speaker: characters.igor, content: 'Let’s talk about that later. For now we keep going.', timestamp: '14:14' },
        { id: 's1e01c04-0019', type: 'other', speaker: characters.lukas, content: 'Yasmin, please definitely wait for us at the waterfall. Do you hear me?', timestamp: '14:15' },

        // Switch: Private chat Yasmin, Aylin
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

        { id: 's1e01c04-0021', type: 'other', speaker: characters.yasmin, content: 'Looks crazy here. The waterfall is impressive. Stunning.', timestamp: '14:42' },
        { id: 's1e01c04-0022', type: 'other', speaker: characters.yasmin, image: '/media/story/episodes/s1e01/s1e01c04-512.webp', content: '', timestamp: '14:42' },


        { id: 's1e01c04-0024', type: 'other', speaker: characters.yasmin, content: 'But for swimming? Uncomfortable and cold by the water 😰. Looks completely different from the pictures online with the people swimming.', timestamp: '14:43' },
        { id: 's1e01c04-0025', type: 'other', speaker: characters.yasmin, content: 'Mega loud. I can’t even hear my own voice.', timestamp: '14:44' },
        { id: 's1e01c04-0026', type: 'other', speaker: characters.yasmin, content: 'And the ground is really slippery after the rain. I even had to hold on a moment ago.', timestamp: '14:44' },
        { id: 's1e01c04-0027', type: 'other', speaker: characters.yasmin, content: 'What do you think, should I go into the water? That was my plan.', timestamp: '14:45' },
        { id: 's1e01c04-0028', type: 'other', speaker: characters.yasmin, content: 'If I only send a selfie from the edge, I can’t compete with Lisa’s picture…', timestamp: '14:46' },
        { id: 's1e01c04-0029', type: 'other', speaker: characters.yasmin, content: 'And now I’m already here… But… it doesn’t look like a swimming lake at all.', timestamp: '14:46' },
        { id: 's1e01c04-0030', type: 'other', speaker: characters.yasmin, content: 'More like a white-water adventure. What am I supposed to do?', timestamp: '14:47' },
        { id: 's1e01c04-0031', type: 'other', speaker: characters.yasmin, content: 'Wait… I have an idea. Maybe you can help me for a second. You know a lot about AI, right.', timestamp: '14:47' },
        { id: 's1e01c04-0032', type: 'other', speaker: characters.yasmin, content: 'Aylin? Are you online?', timestamp: '14:48' },

        // Reflection (Amy)
        { id: 's1e01c04-0033', type: 'main', speaker: characters.amy, kind: 'amy-question', content: 'Yasmin asks her friend for advice. Who would you turn to when you feel unsure, and what gives you a good feeling about that person?', timestamp: '' },
        { id: 's1e01c04-0034', type: 'main', speaker: characters.amy, kind: 'amy-tip', content: 'If you’re unsure, get advice from someone you trust.', timestamp: '' },
      ],
    },

    // ------------------------------------
    // Chapter 5 — Class chat: photo, alarm, radio silence
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
            title: 'Class 7b',
            participants: [],
          },
          timestamp: '',
        },

        // Yasmin’s photo (s1e01c05)
        { id: 's1e01c05-0002', type: 'other', speaker: characters.yasmin, image: '/media/story/episodes/s1e01/s1e01c05-512.webp', content: '', timestamp: '14:55', reactions: [R('🤩')] },

        { id: 's1e01c05-0004', type: 'other', speaker: characters.dominik, content: 'Crazy.', timestamp: '14:56' },
        { id: 's1e01c05-0005', type: 'other', speaker: characters.lisa, content: 'Wow', timestamp: '14:56' },
        { id: 's1e01c05-0006', type: 'other', speaker: characters.igor, content: 'Awesome pic🔥💦 I wanna get in there too 😎', timestamp: '14:56' },
        { id: 's1e01c05-0007', type: 'other', speaker: characters.lukas, content: '😳', timestamp: '14:57' },
        { id: 's1e01c05-0008', type: 'other', speaker: characters.lukas, content: 'Swimming there is explicitly not allowed. You were supposed to wait.', timestamp: '14:57' },
        { id: 's1e01c05-0009', type: 'other', speaker: characters.lukas, content: 'And for good reason. It’s extremely dangerous.', timestamp: '14:58' },
        { id: 's1e01c05-0010', type: 'other', speaker: characters.chioma, content: 'Oh no. Yasmin?', timestamp: '14:58' },
        { id: 's1e01c05-0011', type: 'other', speaker: characters.lukas, content: 'After the heavy rain it’s even more dangerous.', timestamp: '14:59' },
        { id: 's1e01c05-0012', type: 'other', speaker: characters.dominik, content: 'Chill, bro. That doesn’t mean anything 😤', timestamp: '14:59' },
        { id: 's1e01c05-0013', type: 'other', speaker: characters.chioma, content: 'Igor, Lukas, are you with Yasmin?', timestamp: '15:00' },
        { id: 's1e01c05-0014', type: 'other', speaker: characters.lisa, content: 'Tell her she has to get out of there immediately.', timestamp: '15:00' },
        { id: 's1e01c05-0015', type: 'other', speaker: characters.igor, content: 'We’re still on the mountain bike trail, but we were going to meet her later.', timestamp: '15:01' },
        { id: 's1e01c05-0016', type: 'other', speaker: characters.chioma, content: 'Then hurry, please.', timestamp: '15:01' },
        { id: 's1e01c05-0017', type: 'other', speaker: characters.lisa, content: 'And then who took the picture? 🤔', timestamp: '15:02' },
        { id: 's1e01c05-0018', type: 'other', speaker: characters.lukas, content: 'We’re hurrying.', timestamp: '15:02' },
        { id: 's1e01c05-0019', type: 'other', speaker: characters.lukas, content: 'But we’re still pretty far away.', timestamp: '15:03' },
        { id: 's1e01c05-0020', type: 'other', speaker: characters.dominik, content: 'Take it easy. She’s probably having a huge blast.', timestamp: '15:03' },
        { id: 's1e01c05-0021', type: 'other', speaker: characters.igor, content: 'Clearly. No stress.', timestamp: '15:03' },
        { id: 's1e01c05-0022', type: 'other', speaker: characters.lukas, content: 'Yes, stress. Come on. We need to warn her immediately.', timestamp: '15:04' },
        { id: 's1e01c05-0023', type: 'other', speaker: characters.lukas, content: 'The water level is significantly higher than usual.', timestamp: '15:04' },
        { id: 's1e01c05-0024', type: 'other', speaker: characters.dominik, content: 'So what?', timestamp: '15:05' },
        { id: 's1e01c05-0025', type: 'other', speaker: characters.chioma, content: 'What is that supposed to mean?', timestamp: '15:05' },
        { id: 's1e01c05-0026', type: 'other', speaker: characters.lukas, content: 'It means we can’t waste any time.', timestamp: '15:06' },
        { id: 's1e01c05-0027', type: 'other', speaker: characters.lukas, content: 'The water could sweep her away. There are definitely hidden currents.', timestamp: '15:06' },
        { id: 's1e01c05-0028', type: 'other', speaker: characters.lukas, content: 'Someone has to organize help.', timestamp: '15:07' },
        { id: 's1e01c05-0029', type: 'other', speaker: characters.chioma, content: 'We’ll do that.', timestamp: '15:07' },
        { id: 's1e01c05-0030', type: 'other', speaker: characters.lukas, content: 'I’m afraid Igor and I might be too late 😰.', timestamp: '15:08' },
        { id: 's1e01c05-0031', type: 'other', speaker: characters.lukas, content: 'We’re giving it everything now. Go!', timestamp: '15:08' },
        { id: 's1e01c05-0032', type: 'other', speaker: characters.chioma, content: 'Wait.', timestamp: '15:09' },
        { id: 's1e01c05-0033', type: 'other', speaker: characters.chioma, content: 'Where is the waterfall?', timestamp: '15:10' },
        { id: 's1e01c05-0034', type: 'other', speaker: characters.chioma, content: '…', timestamp: '15:10' },
        { id: 's1e01c05-0035', type: 'other', speaker: characters.chioma, content: 'Lukas??', timestamp: '15:11' },
        { id: 's1e01c05-0036', type: 'other', speaker: characters.chioma, content: 'Igor??', timestamp: '15:11' },
        { id: 's1e01c05-0037', type: 'other', speaker: characters.chioma, content: 'Lukas, answer us!', timestamp: '15:12' },
        { id: 's1e01c05-0038', type: 'other', speaker: characters.lisa, content: 'They’re not replying anymore.', timestamp: '15:12' },

        // Reflection (Amy)
        { id: 's1e01c05-0039', type: 'main', speaker: characters.amy, kind: 'amy-question', content: 'When is the right moment to get help for others - describe it?', timestamp: '' },
        {
          id: 's1e01c05-0040',
          type: 'main',
          speaker: characters.amy,
          kind: 'amy-tip',
          content: 'If nobody is answering anymore and it could be dangerous → get help immediately. Better once too often than once too little. Getting help is not snitching, it’s taking responsibility.',
          timestamp: '',
        },
      ],
    },

    // ------------------------------------
    // Chapter 6 — Class chat: geodata / reverse image search
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
            title: 'Class 7b',
            participants: [],
          },
          timestamp: '',
        },

        { id: 's1e01c06-0002', type: 'other', speaker: characters.chioma, content: 'Does anyone else know WHERE this is?', timestamp: '15:16' },
        { id: 's1e01c06-0003', type: 'other', speaker: characters.finn, content: 'no idea', timestamp: '15:16' },
        { id: 's1e01c06-0004', type: 'other', speaker: characters.lisa, content: 'No idea 🤷‍♀️.', timestamp: '15:17' },
        { id: 's1e01c06-0005', type: 'other', speaker: characters.carlos, content: 'Wait a second.', timestamp: '15:17' },
        { id: 's1e01c06-0006', type: 'other', speaker: characters.carlos, content: 'We’ll figure it out.', timestamp: '15:18' },
        { id: 's1e01c06-0007', type: 'other', speaker: characters.carlos, content: 'There could be geodata in the picture📍.', timestamp: '15:18' },
        { id: 's1e01c06-0008', type: 'other', speaker: characters.lisa, content: 'Geodata?', timestamp: '15:19' },
        { id: 's1e01c06-0009', type: 'other', speaker: characters.carlos, content: 'Yes, you can often infer where a picture was taken from an image. If you take a photo with your phone, it often stores information with it: place, time, sometimes even the device. That’s called “metadata.”', timestamp: '15:19' },
        { id: 's1e01c06-0010', type: 'other', speaker: characters.lisa, content: 'Perfect. That’s exactly what we need 🗺️.', timestamp: '15:20' },
        { id: 's1e01c06-0011', type: 'other', speaker: characters.carlos, content: 'Vale… no.', timestamp: '15:20' },
        { id: 's1e01c06-0012', type: 'other', speaker: characters.carlos, content: 'Wait. In chat, the coordinates are usually removed.', timestamp: '15:21' },
        { id: 's1e01c06-0013', type: 'other', speaker: characters.lisa, content: 'What?', timestamp: '15:21' },
        { id: 's1e01c06-0014', type: 'other', speaker: characters.chioma, content: 'Why?', timestamp: '15:21' },
        { id: 's1e01c06-0015', type: 'other', speaker: characters.carlos, content: 'When a photo is posted in chat, the geodata is deleted. For privacy.', timestamp: '15:22' },
        { id: 's1e01c06-0016', type: 'other', speaker: characters.lisa, content: 'Damn.', timestamp: '15:22' },
        { id: 's1e01c06-0017', type: 'other', speaker: characters.carlos, content: 'Well, actually that’s a good thing. So not everyone has access to the data.', timestamp: '15:23' },
        { id: 's1e01c06-0018', type: 'other', speaker: characters.chioma, content: 'What do we do now?', timestamp: '15:23' },
        { id: 's1e01c06-0019', type: 'other', speaker: characters.carlos, content: 'Still, a picture often reveals something about the place. Just not as exact coordinates.', timestamp: '15:24' },
        { id: 's1e01c06-0020', type: 'other', speaker: characters.lisa, content: 'What do you mean?', timestamp: '15:24' },
        { id: 's1e01c06-0021', type: 'other', speaker: characters.carlos, content: 'Look at the photo closely again 🔍.', timestamp: '15:25' },
        { id: 's1e01c06-0022', type: 'other', speaker: characters.carlos, content: 'What do you see in it?', timestamp: '15:25' },
        { id: 's1e01c06-0023', type: 'other', speaker: characters.lisa, content: 'There’s a stream, you can see rocks.', timestamp: '15:26' },
        { id: 's1e01c06-0024', type: 'other', speaker: characters.chioma, content: 'And of course the waterfall 💦.', timestamp: '15:26' },
        { id: 's1e01c06-0025', type: 'other', speaker: characters.carlos, content: 'Exactly.', timestamp: '15:26' },
        { id: 's1e01c06-0026', type: 'other', speaker: characters.chioma, content: 'And that’s enough?', timestamp: '15:27' },
        { id: 's1e01c06-0027', type: 'other', speaker: characters.lisa, content: 'I don’t know the place.', timestamp: '15:27' },
        { id: 's1e01c06-0028', type: 'other', speaker: characters.carlos, content: 'Me neither. But I’ll try reverse image search.', timestamp: '15:28' },
        { id: 's1e01c06-0029', type: 'other', speaker: characters.lisa, content: 'Okay.', timestamp: '15:28' },
        { id: 's1e01c06-0030', type: 'other', speaker: characters.lisa, content: 'And what is that?', timestamp: '15:28' },
        { id: 's1e01c06-0031', type: 'other', speaker: characters.carlos, content: 'Instead of searching in a search engine with words, I upload Yasmin’s photo.', timestamp: '15:29' },
        { id: 's1e01c06-0032', type: 'other', speaker: characters.chioma, content: 'And?', timestamp: '15:29' },
        { id: 's1e01c06-0033', type: 'other', speaker: characters.carlos, content: 'Wait…', timestamp: '15:30' },
        { id: 's1e01c06-0034', type: 'other', speaker: characters.carlos, content: 'I found something. There are pictures online that look very similar.', timestamp: '15:31' },
        { id: 's1e01c06-0035', type: 'other', speaker: characters.carlos, content: 'Not exactly the same, less spectacular. That’s probably because of all the rain.', timestamp: '15:31' },
        { id: 's1e01c06-0036', type: 'other', speaker: characters.carlos, content: 'Hm…espera. This one could fit.', timestamp: '15:32' },
        { id: 's1e01c06-0037', type: 'other', speaker: characters.lisa, content: 'Not bad.', timestamp: '15:32' },
        { id: 's1e01c06-0038', type: 'other', speaker: characters.carlos, content: 'Now I’m searching for the address too.', timestamp: '15:33' },
        { id: 's1e01c06-0039', type: 'other', speaker: characters.lisa, content: 'And?', timestamp: '15:33' },
        { id: 's1e01c06-0040', type: 'other', speaker: characters.carlos, content: 'Nope. That’s not the waterfall. Way too far away.', timestamp: '15:34' },
        { id: 's1e01c06-0041', type: 'other', speaker: characters.carlos, content: 'But maybe this one…', timestamp: '15:35' },

        // Carlos finds image (s1e01c06)
        { id: 's1e01c06-0042', type: 'other', speaker: characters.carlos, image: '/media/story/episodes/s1e01/s1e01c06-512.webp', content: '', timestamp: '15:35' },

        { id: 's1e01c06-0044', type: 'other', speaker: characters.lisa, content: 'In the Grieswald mountains? Could fit 🤔.', timestamp: '15:36' },
        { id: 's1e01c06-0045', type: 'other', speaker: characters.carlos, content: '@ Lukas @Igor  Is that the right location?', timestamp: '15:36' },

        { id: 's1e01c06-0046', type: 'other', speaker: characters.lisa, content: 'They’re not answering.', timestamp: '15:37' },
        { id: 's1e01c06-0047', type: 'other', speaker: characters.lisa, content: 'What should we do?', timestamp: '15:37' },
        {
  id: 's1e01c06-0048',
  type: 'audio',
  speaker: characters.chioma,
  audioSrc: '/media/story/episodes/s1e01/chiomas-sprachnachricht-s1e01c06.mp3',
  timestamp: '15:38'
},



        // Reflection (Amy)
        { id: 's1e01c06-0049', type: 'main', speaker: characters.amy, kind: 'amy-question', content: 'Carlos says that pictures are sent without geodata for privacy. Why is privacy important?', timestamp: '' },
        {
          id: 's1e01c06-0050',
          type: 'main',
          speaker: characters.amy,
          kind: 'amy-tip',
          content:
            'In this case, privacy prevents strangers from finding out where you live or where you often spend time. \n\nWhat data is specifically protected in images? \nPhotos often contain invisible extra information. \nFor example: \n📍 Place – where the photo was taken (home, school, playground) \n🕒 Time – exactly when the photo was taken \n📱 Device – which phone was used \n📅 Pattern – if many photos show the same place: “Someone is there often.”',
          timestamp: '',
        },


        // Bonus: Geodata

       {
  id: 's1e01c06-tip-carlos-geodaten',
  type: 'system',
  kind: 'bonus-link',
  content: 'Bonus: Carlos’s info about geodata in images.',
  linkTo: '/newspaper/tip-carlos-geodaten',
  linkLabel: 'Open article →',
  bonusId: 'tip-carlos-geodaten',
}

      ],
    },

    // ------------------------------------
    // Chapter 7 — Class chat: all-clear / debrief
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
            title: 'Class 7b',
            participants: [],
          },
          timestamp: '',
        },

        { id: 's1e01c07-0002', type: 'other', speaker: characters.chioma, content: 'Please answer. I can’t stand this waiting anymore.', timestamp: '15:45' },
        { id: 's1e01c07-0003', type: 'other', speaker: characters.igor, content: 'Yeah?', timestamp: '15:47' },
        { id: 's1e01c07-0004', type: 'other', speaker: characters.chioma, content: 'Finally! Are you okay? What’s going on?', timestamp: '15:47' },
        { id: 's1e01c07-0005', type: 'other', speaker: characters.igor, content: 'I can’t see Yasmin anywhere.', timestamp: '15:48' },
        { id: 's1e01c07-0006', type: 'other', speaker: characters.igor, content: 'But there are emergency responders there.', timestamp: '15:48' },
        { id: 's1e01c07-0007', type: 'other', speaker: characters.lisa, content: 'Thank goodness.', timestamp: '15:49' },
        { id: 's1e01c07-0008', type: 'other', speaker: characters.igor, content: 'They must have just arrived too.', timestamp: '15:49' },
        { id: 's1e01c07-0009', type: 'other', speaker: characters.igor, content: 'Did you call them?', timestamp: '15:50' },
        { id: 's1e01c07-0010', type: 'other', speaker: characters.igor, content: 'Ah and Yasmin’s parents are there too.', timestamp: '15:50' },
        { id: 's1e01c07-0011', type: 'other', speaker: characters.chioma, content: 'And Yasmin?', timestamp: '15:50' },
        { id: 's1e01c07-0012', type: 'other', speaker: characters.igor, content: 'I can’t see her anywhere.', timestamp: '15:51' },
        { id: 's1e01c07-0013', type: 'other', speaker: characters.chioma, content: 'That can’t be true 😰', timestamp: '15:51' },
        { id: 's1e01c07-0014', type: 'other', speaker: characters.igor, content: 'I have to look for her. I’m jumping in.', timestamp: '15:52' },
        { id: 's1e01c07-0015', type: 'other', speaker: characters.lisa, content: 'No, absolutely not! That’s way too dangerous!', timestamp: '15:52' },
        { id: 's1e01c07-0016', type: 'other', speaker: characters.chioma, content: 'There’s no point if you put yourself in danger too.', timestamp: '15:53' },
        { id: 's1e01c07-0017', type: 'other', speaker: characters.chioma, content: 'Where is Yasmin?', timestamp: '15:53' },

        { id: 's1e01c07-0018', type: 'other', speaker: characters.yasmin, content: 'Where else would I be?', timestamp: '15:54' },
        { id: 's1e01c07-0019', type: 'other', speaker: characters.carlos, content: 'Yasmin?', timestamp: '15:54' },
        { id: 's1e01c07-0020', type: 'other', speaker: characters.chioma, content: 'Yasmin? Finally.', timestamp: '15:54' },

        // Photo Igor: all-clear (s1e01c07)
        { id: 's1e01c07-0021', type: 'other', speaker: characters.igor, image: '/media/story/episodes/s1e01/s1e01c07-512.webp', content: '', timestamp: '15:55' },

        { id: 's1e01c07-0024', type: 'other', speaker: characters.lukas, content: 'This is really unbelievable.', timestamp: '15:56' },
        { id: 's1e01c07-0025', type: 'other', speaker: characters.igor, content: 'Yasmin is okay.', timestamp: '15:56' },
        { id: 's1e01c07-0026', type: 'other', speaker: characters.igor, content: 'But Lukas is totally wiped out 🥴', timestamp: '15:56' },

        { id: 's1e01c07-0027', type: 'system', content: 'Later in time', timestamp: '' },

        { id: 's1e01c07-0028', type: 'other', speaker: characters.yasmin, content: 'Sorry, Lukas, that you were worried 🙈', timestamp: '16:20' },
        { id: 's1e01c07-0029', type: 'other', speaker: characters.lukas, content: 'What kind of questionable blog was that supposed to be?', timestamp: '16:21' },
        { id: 's1e01c07-0030', type: 'other', speaker: characters.lukas, content: 'One that seriously recommends swimming at a waterfall like that?', timestamp: '16:21' },
        { id: 's1e01c07-0031', type: 'other', speaker: characters.yasmin, content: 'I’m looking for the blog again right now…', timestamp: '16:22' },
        { id: 's1e01c07-0032', type: 'other', speaker: characters.lisa, content: 'And?', timestamp: '16:22' },
        { id: 's1e01c07-0033', type: 'other', speaker: characters.yasmin, content: 'The article is still there.', timestamp: '16:23' },
        { id: 's1e01c07-0034', type: 'other', speaker: characters.yasmin, content: 'But the sentence about swimming is gone.', timestamp: '16:23' },
        { id: 's1e01c07-0035', type: 'other', speaker: characters.lukas, content: '🤨', timestamp: '16:24' },
        { id: 's1e01c07-0036', type: 'other', speaker: characters.yasmin, content: 'No really, I swear. It really said you could swim there.', timestamp: '16:24' },
        { id: 's1e01c07-0037', type: 'other', speaker: characters.lisa, content: 'Lisa is right. I’d also seen that people had photographed themselves in the water there. But then the water was very low. Now the pictures are deleted.', timestamp: '16:25' },
        { id: 's1e01c07-0038', type: 'other', speaker: characters.lukas, content: 'Better that way.', timestamp: '16:26' },
        { id: 's1e01c07-0039', type: 'other', speaker: characters.lukas, content: 'Anything else would be irresponsible.', timestamp: '16:26' },
        { id: 's1e01c07-0040', type: 'other', speaker: characters.lisa, content: '@Yasmin How did you even get back out of there? 😳 That’s totally crazy.', timestamp: '16:27' },

        // Reflection (Amy)
        { id: 's1e01c07-0041', type: 'main', speaker: characters.amy, kind: 'amy-question', content: 'How can you check whether you can trust a tip from the internet?', timestamp: '' },
        { id: 's1e01c07-0042', type: 'main', speaker: characters.amy, kind: 'amy-tip', content: 'Before you follow an online tip, you should first check whether the information is still current and who wrote it. \nBecause information on the internet is not always correct and can be outdated. Never rely on it blindly. \n\n Safety comes first.\n\n You can see concrete things you can actually check in the following bonus link.', timestamp: '' },
      ],
    },

    // ------------------------------------
    // Chapter 8 — Class chat: AI image, discussion, spread
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
            title: 'Class 7b',
            participants: [],
          },
          timestamp: '',
        },

        { id: 's1e01c08-0002', type: 'other', speaker: characters.aylin, content: 'So a lot really happened here. And I missed the best part? 😳', timestamp: '18:10' },
        { id: 's1e01c08-0003', type: 'other', speaker: characters.lisa, content: 'We didn’t hear anything from you at all.', timestamp: '18:10' },
        { id: 's1e01c08-0004', type: 'other', speaker: characters.aylin, content: 'Airplane mode 🤨', timestamp: '18:11' },
        { id: 's1e01c08-0005', type: 'other', speaker: characters.aylin, content: 'But what happened then?', timestamp: '18:11' },
        { id: 's1e01c08-0006', type: 'other', speaker: characters.aylin, content: 'You were at the waterfall. And then?', timestamp: '18:11' },
        { id: 's1e01c08-0007', type: 'other', speaker: characters.yasmin, content: 'Suddenly my parents were there - and even paramedics!', timestamp: '18:12' },
        { id: 's1e01c08-0008', type: 'other', speaker: characters.yasmin, content: 'The full program.', timestamp: '18:12' },
        { id: 's1e01c08-0009', type: 'other', speaker: characters.yasmin, content: 'Igor and Lukas looked as if the devil was after them.', timestamp: '18:13' },
        { id: 's1e01c08-0010', type: 'other', speaker: characters.yasmin, content: 'I was just lying in the grass. All the noise around me. And I was simply staring at the rushing water.', timestamp: '18:13' },
        { id: 's1e01c08-0011', type: 'other', speaker: characters.yasmin, content: 'Igor laughed when he saw me.', timestamp: '18:14' },
        { id: 's1e01c08-0012', type: 'other', speaker: characters.yasmin, content: 'But Lukas was really angry - and completely exhausted.', timestamp: '18:14' },
        { id: 's1e01c08-0013', type: 'other', speaker: characters.yasmin, content: 'He ranted like crazy 😂', timestamp: '18:14' },
        { id: 's1e01c08-0014', type: 'other', speaker: characters.lisa, content: 'Of course!', timestamp: '18:15' },
        { id: 's1e01c08-0015', type: 'other', speaker: characters.lisa, content: 'Why didn’t you answer when we called you?', timestamp: '18:15' },
        { id: 's1e01c08-0016', type: 'other', speaker: characters.yasmin, content: 'Sorry, really. I didn’t hear it at all and only saw it much later.', timestamp: '18:16' },
        { id: 's1e01c08-0017', type: 'other', speaker: characters.yasmin, content: 'It was way too loud at the waterfall.', timestamp: '18:16' },
        { id: 's1e01c08-0018', type: 'other', speaker: characters.lisa, content: 'That was totally dangerous!', timestamp: '18:17' },
        { id: 's1e01c08-0019', type: 'other', speaker: characters.yasmin, content: 'I wasn’t even in the water.', timestamp: '18:17' },
        { id: 's1e01c08-0020', type: 'other', speaker: characters.chioma, content: 'What?? 😳', timestamp: '18:17' },
        { id: 's1e01c08-0021', type: 'other', speaker: characters.yasmin, content: 'I was really scared.', timestamp: '18:18' },
        { id: 's1e01c08-0022', type: 'other', speaker: characters.yasmin, content: 'The water was way too wild. And…', timestamp: '18:18' },
        { id: 's1e01c08-0023', type: 'other', speaker: characters.lisa, content: 'But the picture—', timestamp: '18:19' },
        { id: 's1e01c08-0024', type: 'other', speaker: characters.yasmin, content: 'I only wanted a picture. Also one of those … cool pictures…', timestamp: '18:19' },
        { id: 's1e01c08-0025', type: 'other', speaker: characters.lisa, content: '?', timestamp: '18:19' },
        { id: 's1e01c08-0026', type: 'other', speaker: characters.yasmin, content: 'In the photo, that is me… but at the swimming pool.', timestamp: '18:20' },
        { id: 's1e01c08-0027', type: 'other', speaker: characters.yasmin, content: 'Last summer.', timestamp: '18:20' },
        { id: 's1e01c08-0028', type: 'other', speaker: characters.yasmin, content: 'I just layered it on top 🙈', timestamp: '18:20' },
        { id: 's1e01c08-0029', type: 'other', speaker: characters.finn, content: 'so the picture wasn’t even real?', timestamp: '18:21' },
        { id: 's1e01c08-0030', type: 'other', speaker: characters.yasmin, content: 'No.', timestamp: '18:21' },
        { id: 's1e01c08-0031', type: 'other', speaker: characters.yasmin, content: 'I was never in it.', timestamp: '18:21' },
        { id: 's1e01c08-0032', type: 'other', speaker: characters.chioma, content: 'Was that AI?', timestamp: '18:22' },
        { id: 's1e01c08-0033', type: 'other', speaker: characters.yasmin, content: 'Yes.', timestamp: '18:22' },
        { id: 's1e01c08-0034', type: 'other', speaker: characters.lisa, content: 'I can’t believe it 😳 It looked completely real.', timestamp: '18:22' },
        { id: 's1e01c08-0035', type: 'other', speaker: characters.lisa, content: 'But I was already wondering who was supposed to have taken the photo!!', timestamp: '18:23' },
        { id: 's1e01c08-0036', type: 'other', speaker: characters.finn, content: 'crazy… i really thought you were in the water', timestamp: '18:23' },
        { id: 's1e01c08-0037', type: 'other', speaker: characters.aylin, content: 'Let me see again…', timestamp: '18:24' },
        { id: 's1e01c08-0038', type: 'other', speaker: characters.finn, content: 'Forwarded:', image: '/media/story/episodes/s1e01/s1e01c05.webp', timestamp: '18:24' },
        { id: 's1e01c08-0040', type: 'other', speaker: characters.aylin, content: 'Hey, that’s technically really good 👍', timestamp: '18:25' },
        { id: 's1e01c08-0041', type: 'other', speaker: characters.aylin, content: 'The light and perspective fit. Nicely done.', timestamp: '18:25' },
        { id: 's1e01c08-0042', type: 'other', speaker: characters.lisa, content: '😕', timestamp: '18:26' },
        { id: 's1e01c08-0043', type: 'other', speaker: characters.chioma, content: 'And you didn’t think of us? Or your parents?', timestamp: '18:26' },
        { id: 's1e01c08-0044', type: 'other', speaker: characters.lisa, content: 'Yeah, Yasmin, you can’t just send an AI image without writing that it was made with AI. Honestly!', timestamp: '18:27' },
        { id: 's1e01c08-0045', type: 'other', speaker: characters.yasmin, content: 'But you sent cool photos too.', timestamp: '18:27' },
        { id: 's1e01c08-0046', type: 'other', speaker: characters.chioma, content: 'Yasmin, this isn’t about likes or attention.', timestamp: '18:28' },
        { id: 's1e01c08-0047', type: 'other', speaker: characters.chioma, content: 'This could have gone really wrong.', timestamp: '18:28' },
        { id: 's1e01c08-0048', type: 'other', speaker: characters.finn, content: 'but nothing happened though.', timestamp: '18:29' },
        { id: 's1e01c08-0049', type: 'other', speaker: characters.lukas, content: 'I see that differently. And so do the rescue workers.', timestamp: '18:29' },
        { id: 's1e01c08-0050', type: 'other', speaker: characters.finn, content: 'if she had really been swimming there it would’ve been worse.', timestamp: '18:30' },
        { id: 's1e01c08-0051', type: 'other', speaker: characters.lisa, content: 'The picture is everywhere now.', timestamp: '18:30' },
        { id: 's1e01c08-0052', type: 'other', speaker: characters.tom, content: 'Really everywhere?', timestamp: '18:30' },
        { id: 's1e01c08-0053', type: 'other', speaker: characters.dominik, content: 'Yeah. In two other classes already too.', timestamp: '18:31' },
        { id: 's1e01c08-0054', type: 'other', speaker: characters.yasmin, content: '😳', timestamp: '18:31' },
        { id: 's1e01c08-0055', type: 'other', speaker: characters.yasmin, content: 'Can it still be deleted?', timestamp: '18:32' },
        { id: 's1e01c08-0056', type: 'other', speaker: characters.carlos, content: 'We can delete it in our chat. But once it’s been shared, you can’t get it back from everywhere.', timestamp: '18:32' },


        // Private chat Yasmin, Igor (cliff)
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
        { id: 's1e01c08-0059', type: 'other', speaker: characters.igor, content: 'Got anything planned for tomorrow?', timestamp: '18:36' },

        {
  id: 's1e01c08-bonus-diary-yasmin-2',
  type: 'system',
  kind: 'bonus-link',
  content: 'Bonus: Do you want to know what Yasmin is thinking?',
  linkTo: '/diaries/diary_yasmin?entry=s1e01c08_0002',
  linkLabel: 'Open entry →',
  bonusId: 'diary-yasmin-entry2',
},

        // Reflection (Amy)
        { id: 's1e01c08-0060', type: 'main', speaker: characters.amy, kind: 'amy-question', content: 'Would you post an AI image? And if yes: would you write that you made it with AI?', timestamp: '' },
        {
          id: 's1e01c08-0061',
          type: 'main',
          speaker: characters.amy,
          kind: 'amy-tip',
          content: 'One more little challenge for you: create an image with AI yourself if you want. Ask your parents for help with it. There are a few things you should pay attention to. Click the following bonus link for that.',
          timestamp: '',
        },

        {
  id: 's1e01c08-bonus-tip-aylin-kileitfaden',
  type: 'system',
  kind: 'bonus-link',
  content: 'Bonus: Aylin has an AI guide – so you can stay fair and still be strong.',
  linkTo: '/newspaper/tip-aylin-kileitfaden',
  linkLabel: 'Open article →',
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

    // Epilogue
    { id: 's1e01_ep_0002', type: 'other', speaker: characters.yasmin, content: 'Lisa is finally back.', timestamp: '20:05' },
    { id: 's1e01_ep_0003', type: 'other', speaker: characters.yasmin, content: 'Fewer perfectly styled selfies from Rome and Paris.', timestamp: '20:06' },
    { id: 's1e01_ep_0004', type: 'other', speaker: characters.yasmin, content: 'But more interesting stories about others and more drama.', timestamp: '20:06' },
    { id: 's1e01_ep_0005', type: 'other', speaker: characters.chioma, content: '🙈 Gossip almost always causes trouble…', timestamp: '20:07' },

    { id: 's1e01_ep_0006', type: 'system', content: 'Lisa added.', timestamp: '20:08' },

    { id: 's1e01_ep_0007', type: 'other', speaker: characters.yasmin, content: 'So? Come on, tell me: what’s new from the rumor mill?', timestamp: '20:08' },
    { id: 's1e01_ep_0008', type: 'other', speaker: characters.lisa, content: 'Can’t right now 🙈 already on my way to sushi.', timestamp: '20:09' },
    { id: 's1e01_ep_0009', type: 'other', speaker: characters.lisa, content: 'I already told you about the thing with Dominik this morning.', timestamp: '20:09' },

      {
    id: 's1e01-ep-01',
    type: 'main',
    speaker: characters.amy,
    content:
      "🎬 This episode is over.\n\nThink about it a little more today.\nTomorrow the next chapter will be waiting for you.",
    timestamp: ''
  }
  ],
};

export default course;