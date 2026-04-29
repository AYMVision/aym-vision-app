// src/story-v02/content/en/s1e01.en.ts
// Episode content – compact via storyBuilder helpers.

import type { Reaction } from '../../../common/types';
import { STORY_CHARACTERS as ch } from '../../../content/characters';
import type { StoryEpisodeV02 } from '../../types/storyTypes';
import {
  m, img, audio, typing, divider, amyTip, bonusLink, sysMsg,
  privateChat, classChat, amyChat,
  opt, optSegs, rc,
  S, inp, IT, MIT, AF, GR, OR, AR, CH, C,
} from '../storyBuilder';

const R = (emoji: string, type?: string): Reaction => ({ emoji, type });

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 1 — Summer Holidays
// ─────────────────────────────────────────────────────────────────────────────

const c01 = C('s1e01c01', 0, 'Amic 1', 'Summer Holidays', [

  S('s1e01c01_story_intro_private', [
    privateChat('You', 'Yasmin'),
    m(ch.yasmin, 'Hi 👋 Are you new here in class?', '10:05'),
  ]),

  inp('s1e01c01_input_intro_reply', 'stories:s1e01.c01.input.introReply', {
    topics: ['talk-act'], promptSpeakerId: 'yasmin',
  }),

  S('s1e01c01_story_private_after_intro', [
    m(ch.yasmin, 'Cool.', '10:06'),
    m(ch.yasmin, 'What would you like to be called here in the chat?', '10:06'),
  ], ['reflect-understand', 'talk-act']),

  inp('s1e01c01_input_chat_name', 'stories:s1e01.c01.input.chatName', {
    required: true,
    emptySubmitsAllowed: false,
    placeholderKey: 'stories:common.chatNamePlaceholder',
    maxLength: 40,
    topics: ['talk-act'],
    promptSpeakerId: 'yasmin',
  }),

  S('s1e01c01_story_private_after_name', [
    m(ch.yasmin, 'Hey {{chatName}}, please don\'t tell anyone… But I\'m sooo annoyed with Lisa right now.', '10:07'),
    amyTip('You can change your name anytime in your profile.'),
    classChat(),
    m(ch.igor, 'Did you see Lisa\'s status? Amazing photos from Paris 🇫🇷', '11:12', { reactions: [R('👍')] }),
    m(ch.carlos, 'Sure, and from Italy too. 🇮🇹', '11:12'),
    m(ch.chioma, 'Really beautiful 😍', '11:13'),
    m(ch.finn, 'wasn’t she somewhere else too?', '11:13'),
    m(ch.yasmin, 'Yeah, in Scotland.', '11:14'),
    m(ch.yasmin, 'She keeps sending pictures just to remind us. 🙄', '11:14'),
    m(ch.finn, 'not bad. you were in scotland?', '11:15', {
      replyTo: { speakerName: 'Yasmin', text: 'Yeah, in Scotland.' },
    }),
    m(ch.yasmin, 'Not me 😞', '11:15'),
    m(ch.yasmin, 'Lisa, obviously.', '11:15'),
    m(ch.yasmin, 'I was here the whole vacation 🥱', '11:16'),
    m(ch.carlos, 'It\'s already the last vacation weekend too.', '11:17'),
    m(ch.finn, 'don’t remind me', '11:17'),
    m(ch.jonas, 'I think Aylin is still with her grandma in Turkey.', '11:18'),
    m(ch.finn, 'lol, she just sits at the computer all day messing around with her pictures', '11:18'),
    m(ch.carlos, 'Some of her AI images are really strong. 👍', '11:19'),
    img(ch.lisa, '/media/story/episodes/s1e01/s1e01c01_1-512.webp', '11:19', {
      content: 'Greetings from the South of France 😘',
      reactions: [R('❤️'), R('🤩'), R('❤️'), R('🔥'), R('🤩')],
    }),
    m(ch.tom, 'awesome 🤩', '11:20'),
    m(ch.dominik, 'Crazy 🔥', '11:20'),
    m(ch.igor, 'Are you in the Cévennes ⛰️?', '11:20'),
    m(ch.lisa, 'Yeah. You recognized it?', '11:21'),
    m(ch.igor, 'Been there once too. Awesome views. Perfect for a stunt video 😭🔥', '11:21'),
    m(ch.lisa, 'Totally. Exactly, super for photos.', '11:22', { reactions: [R('👍')] }),
    m(ch.lisa, 'And the croissants!', '11:22', { reactions: [R('👍')] }),
    m(ch.carlos, 'Delicious!', '11:23'),
    m(ch.lisa, 'And the smell of lavender….', '11:23'),
    m(ch.lisa, 'And sunshine every single day 😎☀️', '11:24'),
    m(ch.igor, 'It\'s raining here. I\'d rather be in France right now too.', '11:24'),
    m(ch.lisa, 'With me? ☺️', '11:24'),
    m(ch.lisa, 'Yasmin? You\'re so quiet today 🤔 Everything okay?', '11:25'),
    typing('Yasmin is typing ...'),
    typing('Yasmin deletes'),
    typing('Yasmin is typing ...'),
  ], ['reflect-understand', 'talk-act']),

  S('s1e01c01_story_switch_to_amy_chat', [
    amyChat(),
  ], ['reflect-understand']),

  IT('s1e01c01_item_yasmin_feeling',
    'Yasmin doesn\'t seem able to decide what to write. Why? How might Yasmin be feeling right now?',
    'perspective', 'perspectives_recognize',
    [
      opt('a', 'Yasmin is probably thinking about what she can write so it comes across well in class.', 1),
      opt('b', 'Yasmin probably feels left out and is unsure what to write.', 3),
      opt('c', 'Yasmin feels left out or jealous because she didn\'t experience anything exciting herself.', 2),
      opt('d', 'Yasmin is annoyed with Lisa and doesn\'t feel like reacting anymore.', 1),
    ],
    ['reflect-understand'],
  ),

  GR('s1e01c01_reflection_chat_reply',
    'What would you write in the class chat if you were Yasmin?',
    [
      rc('a', '“Nah, all good.”',
        'For the others, the situation now seems settled. But she still doesn\'t express how she really feels.',
        '👉 On the outside, the reply seems calm. But the feeling stays inside and might come back later.',
        '💡 Personal thoughts could also be sorted out in a conversation or private chat, for example.',
      ),
      rc('b', '“I think I\'m just feeling a little jealous right now 😅”',
        'Yasmin openly says how she feels without attacking Lisa.',
        '👉 In the chat, that comes across as honest and others can understand better what\'s going on with her. For Yasmin, being that open may feel unusual, but it also takes some pressure off.',
        '💡 Personal thoughts could also be sorted out in a conversation or private chat, for example.',
      ),
      rc('c', '“You always have to show how perfect everything is for you, don’t you? 🙄”',
        'Yasmin expresses her frustration as an accusation.',
        '👉 In the chat, that can quickly come across as harsh and hurt Lisa. For Yasmin, it might feel relieving in the moment to let it out – but at the same time, it can easily lead to an argument.',
        '💡 Personal thoughts could also be sorted out in a conversation or private chat, for example.',
      ),
      rc('d', '”So happy for you. 😍”',
        'That sounds friendly and fits the mood in the chat.',
        '👉 For the others, that settles everything. Yasmin\'s own feelings stay in the background and may continue to bother her.',
        '💡 Personal thoughts could also be sorted out in a conversation or private chat, for example.',
      ),
    ],
    { topics: ['talk-act', 'reflect-understand'] },
  ),

  AR('s1e01c01_amy_reaction_chat_reply', 's1e01c01_reflection_chat_reply'),

  S('s1e01c01_story_amy_wrapup', [
    m(ch.amy, 'Let\'s take a look at how Yasmin reacts.'),
  ], ['talk-act', 'reflect-understand']),

  S('s1e01c01_story_switch_back_to_class', [
    classChat(),
  ], ['talk-act', 'reflect-understand']),

  S('s1e01c01_story_resolution', [
    m(ch.yasmin, 'Nah, what could be wrong?', '11:27'),
    m(ch.lisa, 'Okay then. Otherwise let me know.', '11:27'),
    m(ch.yasmin, 'Are you coming back today?', '11:28'),
    m(ch.lisa, 'No, we\'re flying back tomorrow. I still have one more day.', '11:28'),
    m(ch.carlos, 'Sounds really great. 😊 That waterfall photo is strong.', '11:29'),
    m(ch.carlos, 'I\'m checking out the area in Google Earth right now - the 3D views are pretty good. It almost feels like being there 👍', '11:29'),
    m(ch.igor, 'Feel free to keep sending cool photos like that.', '11:30'),
    img(ch.lisa, '/media/story/episodes/s1e01/s1e01c01_2-512.webp', '11:30', {
      reactions: [R('❤️'), R('🤩')],
    }),
    m(ch.carlos, 'Great!', '11:31'),
    m(ch.tom, 'Brilliant.', '11:31'),
    m(ch.dominik, 'Respect. 🔥', '11:31'),
    typing('Yasmin is typing ...'),
    typing('Yasmin deletes'),
  ], ['talk-act', 'reflect-understand']),

  S('s1e01c01_story_amy_intro_diary', [
    amyChat(),
    m(ch.amy, 'Yasmin isn\'t showing everything in the chat. In her diary, you can find out what\'s going on inside her.'),
  ]),

  S('s1e01c01_story_diary_bonus', [
    bonusLink('diary-yasmin-entry1', 'Diary entry Yasmin – 1st entry',
      '/diaries/diary_yasmin?entry=s1e01c01_0001', 'Open entry →'),
  ]),
]);

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 2 — Cool Stunts
// ─────────────────────────────────────────────────────────────────────────────

const c02 = C('s1e01c02', 1, 'Amic 2', 'Cool Stunts', [

  S('s1e01c02_story_igor_private', [
    privateChat('Igor', 'Yasmin'),
    m(ch.igor, 'Last day of vacation 😬', '12:04'),
    m(ch.igor, 'Wanna hang out? Grieswald Mountains. Never been there, even though it\'s really not far. Wanna ride down there with my bike 🚵‍♂️🔥', '12:05'),
    m(ch.yasmin, 'Watching Shorts right now. Lots of cool ideas.', '12:06'),
    m(ch.igor, 'Watch more later.', '12:06'),
  ], ['reflect-understand', 'talk-act']),

  S('s1e01c02_story_switch_to_amy', [
    amyChat(),
  ]),

  IT('s1e01c02_item_selfcontrol',
    'What would you do if you were Yasmin?',
    'self_regulation', 'interrupt_impulse',
    [
      optSegs('a', 'I\'d just keep watching videos.', 0,
        'Yasmin decides to stay with the videos.',
        '👉 In the moment, that feels easy and pleasant.',
        '👉 The meetup with Igor happens without her, and she misses the outdoor experience.',
        '💡 Decisions like that often feel good in the short term. You often only notice later what you missed because of them.',
      ),
      optSegs('b', 'I\'d watch a little longer and decide afterward.', 2,
        'Yasmin postpones the decision and keeps watching.',
        '👉 In the moment, it seems like a compromise.',
        '👉 Often, more time passes than expected – and at some point, the opportunity is gone.',
        '💡 Putting things off can mean you never really make a conscious decision at all.',
      ),
      optSegs('c', 'I\'d put the phone away and go out with Igor.', 3,
        'Yasmin decides to put her phone away and go along.',
        '👉 She interrupts the scrolling and becomes part of the meetup right away.',
        '👉 Decisions like that sometimes take effort, but they change what you get to experience.',
        '💡 Often, those are exactly the moments people like to remember later.',
      ),
      optSegs('d', 'I\'d stay with the videos, even though I know I might regret it later.', 1,
        'Yasmin stays with the videos, even though she realizes she might regret it later.',
        '👉 She chooses what feels easier right now.',
        '👉 The feeling of having missed out can become stronger afterward.',
        '💡 Almost everyone knows situations like that – they show how hard it can be to decide differently.',
      ),
    ],
    ['reflect-understand'],
  ),

  AF('s1e01c02_amy_feedback_selfcontrol', 's1e01c02_item_selfcontrol'),

  S('s1e01c02_story_amy_wrapup', [
    m(ch.amy, 'Let\'s take a look at how Yasmin reacts.'),
  ]),

  S('s1e01c02_story_switch_back_igor', [
    privateChat('Igor', 'Yasmin'),
    m(ch.yasmin, 'Okay, maybe.', '12:30'),
    m(ch.igor, 'You could bring Lisa.', '12:30'),
    m(ch.yasmin, 'Lisa? Why?', '12:31'),
    m(ch.igor, 'Yeah, why not?', '12:31'),
    m(ch.yasmin, 'She\'s not there.', '12:31'),
    m(ch.igor, 'Oh right.', '12:32'),
    m(ch.igor, 'So, are you coming?', '12:32'),
    m(ch.yasmin, 'And I get to film your stunt clips? 🙄', '12:33'),
    m(ch.yasmin, 'Nope.', '12:33'),
    m(ch.igor, 'Okay 😅', '12:34'),
    m(ch.igor, 'Think about it. Maybe later.', '12:34'),
    m(ch.igor, 'By the way, Lukas is coming too.', '12:34'),
  ]),

  S('s1e01c02_story_klassenchat', [
    classChat(),
    img(ch.lukas, '/media/story/episodes/s1e01/s1e01c02_1-512.webp', '13:12', { reactions: [R('🔥')] }),
    m(ch.lukas, 'Igor is really on fire today 🤓🚵‍♂️', '13:13'),
    m(ch.igor, 'We found a cool spot here.', '13:13'),
    m(ch.igor, 'Rocky slopes, a rushing river, and hardly any people around.', '13:14'),
    audio(ch.chioma, '/media/story/episodes/s1e01/chiomas-sprachnachricht-s1e01c01.mp3', '13:14'),
    m(ch.lisa, 'Looks amazing 😍', '13:15'),
    img(ch.lisa, '/media/story/episodes/s1e01/s1e01c02_2-512.webp', '13:15', { reactions: [R('❤️')] }),
    m(ch.igor, 'Nice.', '13:16'),
    m(ch.carlos, 'Very beautiful. 😊', '13:16'),
    typing('Yasmin is typing ...'),
    typing('Yasmin deletes'),
    m(ch.yasmin, 'Oh wow, Lukas, do you haaave to film him now??', '13:18', {
      replyTo: { speakerName: 'Lukas', text: 'Igor is really on fire today 🤓🚵‍♂️' },
    }),
    m(ch.lukas, 'You said it. I could be sitting at home playing chess right now 😅', '13:18'),
    m(ch.lukas, 'Yasmin, didn\'t you ask about a “spectacular waterfall” nearby? 🏞️ There\'s supposed to be one further downstream. No idea if it\'s really “spectacular,” though.', '13:19'),
    m(ch.yasmin, 'What do you mean? I never asked that!', '13:20'),
    m(ch.lukas, 'What? I mean this morning.', '13:20'),
    m(ch.yasmin, 'I didn\'t. Must have been a misunderstanding.', '13:21'),
  ], ['reflect-understand', 'talk-act']),

  inp('s1e01c02_input_yasmin_reply', 'stories:s1e01.c01.input.introReply', {
    topics: ['talk-act'], promptSpeakerId: 'yasmin',
  }),

  S('s1e01c02_story_yasmin_card', [
    privateChat('You', 'Yasmin'),
    m(ch.yasmin, 'Hi {{chatName}}, your friend book is really cool.', '14:02'),
    m(ch.yasmin, 'I filled out my friends page, take a look.', '14:02'),
    bonusLink('char-yasmin', 'Character card Yasmin', '/cards/char-yasmin', 'View card →'),
  ], ['talk-act']),

  S('s1e01c02_story_amy_challenge_intro', [
    privateChat('Amy'),
    m(ch.amy, 'Do you feel like trying a little challenge?'),
  ], ['problem-solving']),

  CH('s1e01c02_challenge_video',
    '👉 Can you manage not to watch one video today, even though you want to click on it?',
  ),
]);

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 3 — The Plan with the Photo
// ─────────────────────────────────────────────────────────────────────────────

const c03 = C('s1e01c03', 2, 'Amic 3', 'The Plan with the Photo', [

  S('s1e01c03_story_groupchat_hike', [
    privateChat('Igor', 'Lukas', 'Yasmin'),
    m(ch.yasmin, 'Where exactly are you guys?', '14:08'),
    m(ch.igor, 'idk 😂', '14:08'),
    m(ch.igor, 'Somewhere in the woods. Really cool here 🌲🚲🐿️', '14:09'),
    m(ch.lukas, 'I shared my location, so you can see exactly where.', '14:09'),
    m(ch.lukas, 'To be honest, I\'m pretty exhausted 😰', '14:10'),
    img(ch.lukas, '/media/story/episodes/s1e01/s1e01c03_1-512.webp', '14:10'),
    m(ch.lukas, 'I just hope it\'s not much farther. My strength is not unlimited.', '14:11'),
    m(ch.lukas, 'But honestly: this area is incredibly beautiful.', '14:11'),
    bonusLink('tip-amy-staunen', 'Article: Wonder', '/newspaper/tip-amy-staunen', 'Open article →'),
    m(ch.yasmin, 'And there\'s a waterfall there?', '14:12'),
    m(ch.lukas, 'I can\'t see it yet. We\'re still some way off.', '14:12'),
    m(ch.lukas, 'Igor absolutely wanted to come here for his stunts – very adventurous 😬', '14:13'),
    m(ch.igor, 'Think about whether you might want to come after all.', '14:13'),
    m(ch.yasmin, 'Sounds kind of cool.', '14:14'),
    m(ch.yasmin, 'But by bike? 😝', '14:14'),
    m(ch.yasmin, 'I don\'t know…', '14:14'),
    m(ch.lukas, 'The train station isn\'t far from the creek.', '14:15'),
    m(ch.lukas, 'We could meet at the waterfall.', '14:15'),
    m(ch.lukas, 'Assuming I even make it there alive 😰', '14:16'),
    m(ch.lukas, 'So?', '14:16'),
  ], ['reflect-understand', 'talk-act']),

  S('s1e01c03_story_private_yasmin_lisa', [
    privateChat('Yasmin', 'Lisa'),
    m(ch.lisa, 'Did you see Igor\'s posts? So cool!', '14:19'),
    img(ch.lisa, '/media/story/episodes/s1e01/s1e01c03_2-512.webp', '14:19', { content: 'Forwarded:' }),
    m(ch.yasmin, 'Yeah.', '14:20'),
    m(ch.yasmin, 'Are you back yet?', '14:20'),
    m(ch.lisa, 'We just landed ✈️', '14:21'),
    m(ch.lisa, 'So sad. I\'d really love to go to that stunt trail too 🙁', '14:21'),
    m(ch.yasmin, 'Oh yeah? 🤔', '14:22'),
    m(ch.lisa, 'Of course, tomorrow the whole class will probably be talking about it.', '14:22'),
    m(ch.yasmin, 'Hm. True, actually…', '14:23'),
  ], ['reflect-understand', 'talk-act']),

  S('s1e01c03_story_switch_to_amy', [
    amyChat(),
  ], ['reflect-understand']),

  IT('s1e01c03_item_judgement_posts',
    'Yasmin had actually already decided to stay at home. Now the messages from Igor, Lukas, and Lisa are throwing her off. What could she be thinking about it?',
    'judgement', 'judgement_explain',
    [
      optSegs('a', 'They\'re there in person, that does make a difference… but I\'m still not sure.', 2,
        'Yasmin realizes: Igor and Lukas are really there and reporting firsthand.',
        '👉 At the same time, that “Hmm… I\'m not really sure” feeling still stays with her.',
        '💡 Moments like that are exactly what makes things interesting. That\'s when Yasmin starts thinking about what she herself really wants.',
      ),
      optSegs('b', 'It does sound good… maybe it really is worth it after all.', 1,
        'Yasmin realizes: It does sound pretty good, and suddenly her decision doesn\'t feel all that certain anymore.',
        '👉 Especially when you\'re bored, what other people are doing often feels even more exciting.',
        '💡 In a moment like that, you can ask yourself briefly: Do I really want this, or do I just not want to miss out?',
      ),
      optSegs('c', 'If Igor and Lukas say it\'s good, then it must be true.', 0,
        'Here, Yasmin is simply adopting what Igor and Lukas are saying.',
        '👉 That seems logical at first because they\'re there in person. But it also makes it easy to lose sight of what Yasmin herself actually wants.',
        '💡 It helps to stop and think for a moment: What do I actually think about this myself?',
      ),
      optSegs('d', 'Igor and Lukas really are there. Lisa is thinking more about what other people will say. And I need to decide what fits me.', 3,
        'Yasmin realizes that different influences are coming together here.',
        '👉 Igor and Lukas are talking about their experience. Lisa is thinking more about what other people might say later.',
        '💡 When you notice why you think or feel something, making decisions often gets easier.',
      ),
    ],
    ['reflect-understand'],
  ),

  AF('s1e01c03_amy_feedback_judgement_posts', 's1e01c03_item_judgement_posts'),

  S('s1e01c03_story_amy_wrapup', [
    m(ch.amy, 'Let\'s see what Yasmin decides – and what idea suddenly pops into her head.'),
  ], ['reflect-understand']),
]);

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 4 — Things Get Critical at the Waterfall
// ─────────────────────────────────────────────────────────────────────────────

const c04 = C('s1e01c04', 3, 'Amic 4', 'Things Get Critical at the Waterfall', [

  S('s1e01c04_story_groupchat_waterfall', [
    privateChat('Igor', 'Lukas', 'Yasmin'),
    m(ch.yasmin, 'How\'s your trip going?', '15:06'),
    m(ch.lukas, 'Pretty exhausting 😅', '15:07'),
    m(ch.lukas, 'The sun is coming through, so it looks really picturesque. But everything is still soaked ☀️💧', '15:07'),
    m(ch.lukas, 'Not exactly ideal for my good old bike.', '15:08'),
    m(ch.lukas, 'Even with little pressure, the rear wheel spins out.', '15:08'),
    m(ch.lukas, 'The wet roots give the tires no grip. One small steering mistake - and I slip.', '15:09'),
    m(ch.igor, 'Relax. Everything\'s easy 😎', '15:09'),
    m(ch.lukas, 'That\'s not overreacting. That\'s physics.', '15:10'),
    m(ch.yasmin, 'What about the river?', '15:10'),
    m(ch.lukas, 'Well, judging by the noise, there\'s a strong current.', '15:11'),
    m(ch.lukas, 'The water level must be way above normal. 🌊 We should be careful.', '15:11'),
    m(ch.igor, 'Don\'t listen to Lukas rambling: it\'s seriously awesome here, cool scenery and awesome downhill sections 👍', '15:12'),
    m(ch.yasmin, 'Okay, I\'m on my way 😊', '15:13'),
    m(ch.yasmin, 'I found a blog. There are photos - people in the water in front of the waterfall. It looks so cool… I\'d totally be up for it. Did you bring swimwear too?', '15:14'),
    m(ch.lukas, 'That\'s nonsense ❌', '15:14'),
    m(ch.lukas, 'This place is definitely not suitable for swimming – especially not after the rain.', '15:15'),
    m(ch.igor, 'Let\'s talk about it later. We\'re moving on now.', '15:15'),
    m(ch.lukas, 'Yasmin, please wait for us at the waterfall no matter what. Do you hear me?', '15:16'),
  ], ['reflect-understand', 'talk-act']),

  S('s1e01c04_story_private_yasmin_aylin_before_item', [
    privateChat('Yasmin', 'Aylin'),
    m(ch.yasmin, 'It looks crazy here. The waterfall is impressive. Stunning.', '15:31'),
    img(ch.yasmin, '/media/story/episodes/s1e01/s1e01c04-512.webp', '15:31'),
    m(ch.yasmin, 'But for swimming? It\'s uncomfortable and cold by the water. 😰 It looks completely different from the pictures online with people swimming there.', '15:32'),
    m(ch.yasmin, 'So loud. I can\'t even hear my own words.', '15:32'),
    m(ch.yasmin, 'And the ground is really slippery after the rain. I even had to hold on a second ago 💧', '15:33'),
    m(ch.yasmin, 'What do you think, should I go into the water? That was actually my plan 🤔', '15:33'),
    m(ch.yasmin, 'If I only send a selfie from the edge, there\'s no way I can compete with Lisa\'s picture…', '15:34'),
  ], ['reflect-understand', 'talk-act']),

  S('s1e01c04_story_switch_to_amy', [
    amyChat(),
  ], ['reflect-understand']),

  IT('s1e01c04_item_safe_action_waterfall',
    'Yasmin had imagined all this very differently… What should Yasmin do now?',
    'responsibility', 'do_not_harm',
    [
      optSegs('a', 'Yasmin decides not to go into the water.', 3,
        '👉 Yasmin takes seriously what she notices on site: slippery ground, strong current, and uncertainty.',
        '👉 That way, she stays safe in a situation that could quickly become dangerous.',
        '💡 If something goes wrong, there won\'t be any cool photo in the end anyway. Without taking risks, there will still be plenty of moments when great pictures can happen.',
      ),
      optSegs('b', 'Yasmin decides to go into the water.', 0,
        '👉 Yasmin goes ahead with her plan even though it\'s slippery and the current is strong.',
        '👉 She ignores her own doubts. If she slips or gets caught by the current, she could be seriously injured.',
        '💡 If something is different on site than expected, then the plan or the photo doesn\'t matter – what matters is what is actually happening right now.',
      ),
      optSegs('c', 'Yasmin waits for Igor and Lukas and then decides together with them.', 2,
        '👉 Yasmin wants to assess the situation better and relies on others to help with that.',
        '👉 Not having to decide alone gives her some security. In the end, though, she still has to decide for herself.',
        '💡 Other people can help. But your own judgment still matters most.',
      ),
      optSegs('d', 'Yasmin only goes into the water briefly to take her photo.', 1,
        '👉 This decision feels like a quick compromise.',
        '👉 Yasmin uses it to reassure herself. But the danger stays exactly the same: slippery, loud, unpredictable.',
        '💡 “Just for a moment” often feels safe, but it doesn\'t actually make the risk any smaller.',
      ),
    ],
    ['reflect-understand'],
  ),

  AF('s1e01c04_amy_feedback_safe_action_waterfall', 's1e01c04_item_safe_action_waterfall'),

  S('s1e01c04_story_back_to_yasmin_aylin', [
    privateChat('Yasmin', 'Aylin'),
    m(ch.yasmin, 'And now I\'m already here… But… this doesn\'t look like a lake for swimming at all.', '15:36'),
    m(ch.yasmin, 'More like a whitewater adventure. What am I supposed to do?', '15:36'),
    m(ch.yasmin, 'Wait… I\'ve got an idea. Maybe you can help me for a second. You know a lot about AI, right?', '15:37'),
    m(ch.yasmin, 'Aylin? Are you online?', '15:37'),
  ], ['reflect-understand', 'talk-act']),
]);

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 5 — The Picture Causes Alarm
// ─────────────────────────────────────────────────────────────────────────────

const c05 = C('s1e01c05', 4, 'Amic 5', 'The Picture Causes Alarm', [

  S('s1e01c05_story_class_chat_escalation', [
    classChat(),
    img(ch.yasmin, '/media/story/episodes/s1e01/s1e01c05-512.webp', '16:02', { reactions: [R('🤩')] }),
    m(ch.dominik, 'Wow.', '16:03'),
    m(ch.lisa, 'Wow', '16:03'),
    m(ch.igor, 'Awesome pic🔥💦 I wanna get in there too 😎', '16:03'),
  ], ['reflect-understand', 'talk-act']),

  inp('s1e01c05_input', 'stories:s1e01.c01.input.introReply', {
    topics: ['talk-act'], promptSpeakerId: 'yasmin',
  }),

  S('s1e01c05_story_class_chat_escalation_2', [
    m(ch.lukas, '😳', '16:04'),
    m(ch.lukas, 'Swimming there is explicitly forbidden. You were supposed to wait.', '16:04'),
    m(ch.lukas, 'And for good reason. It\'s extremely dangerous.', '16:05'),
    m(ch.chioma, 'Oh no. Yasmin?', '16:05'),
    m(ch.lukas, 'After the heavy rain, it\'s even more dangerous.', '16:06'),
    m(ch.dominik, 'Chill, bro. That doesn\'t mean anything 😤', '16:06'),
    m(ch.chioma, 'Igor, Lukas, are you with Yasmin?', '16:07'),
    m(ch.lisa, 'Tell her to get out of there immediately.', '16:07'),
    m(ch.igor, 'We\'re still on the mountain bike trail, but we want to meet up with her later.', '16:08'),
    m(ch.chioma, 'Then hurry up, please.', '16:08'),
    m(ch.lisa, 'And who even took the picture then? 🤔', '16:09'),
    m(ch.lukas, 'We\'re hurrying.', '16:09'),
    m(ch.lukas, 'But we\'re still pretty far away.', '16:09'),
    m(ch.dominik, 'Take it easy. She\'s probably having a huge blast.', '16:10'),
    m(ch.igor, 'Exactly. No stress.', '16:10'),
    m(ch.lukas, 'Yes, stress. Come on. We need to warn her immediately.', '16:11'),
    m(ch.lukas, 'The water level is much higher than usual 🌊', '16:11'),
    m(ch.dominik, 'So what?', '16:12'),
    m(ch.chioma, 'What\'s that supposed to mean?', '16:12'),
    m(ch.lukas, 'It means we can\'t afford to waste time.', '16:12'),
    m(ch.lukas, 'The water could sweep her away. There are definitely hidden currents.', '16:13'),
    m(ch.lukas, 'Someone has to organize help.', '16:13'),
    m(ch.chioma, 'We\'ll do that.', '16:14'),
    m(ch.lukas, 'I\'m afraid Igor and I might be too late. 😰', '16:14'),
    m(ch.lukas, 'We\'re giving it everything now. Go!', '16:15'),
    m(ch.chioma, 'Wait.', '16:15'),
    m(ch.chioma, 'Where even is the waterfall?', '16:16'),
    typing('…'),
    m(ch.chioma, 'Lukas??', '16:17'),
    m(ch.chioma, 'Igor??', '16:17'),
    m(ch.chioma, 'Lukas, answer us!', '16:18'),
    m(ch.lisa, 'They\'re not replying anymore.', '16:18'),
    m(ch.chioma, 'This doesn\'t feel good at all…', '16:19'),
  ], ['reflect-understand', 'talk-act']),

  S('s1e01c05_story_switch_to_amy', [
    amyChat(),
    m(ch.amy, 'The situation is escalating. Yasmin isn\'t answering anymore, and nobody knows exactly what happened.'),
  ], ['reflect-understand']),

  IT('s1e01c05_item_emergency_help',
    'What should someone in the group do now?',
    'responsibility', 'intervene',
    [
      optSegs('a', 'They all wait for now. Maybe Yasmin will message again in a moment.', 0,
        '👉 Nothing happens in the group at first. Everyone hopes the situation will resolve itself.',
        '👉 Meanwhile, time passes. If something really has happened, that doesn\'t make it any better.',
        '💡 If it might be serious, it\'s important not to just wait, but to get help.',
      ),
      optSegs('b', 'They keep trying together to find out where Yasmin is and stay on it.', 2,
        '👉 The group stays active. They try to find out more.',
        '👉 That can help, but it doesn\'t necessarily replace getting fast outside support.',
        '💡 The more serious the situation seems, the more important it is not only to keep searching yourselves, but also to get help in addition.',
      ),
      optSegs('c', 'Someone organizes help.', 3,
        'The situation should be taken seriously, and help should be called in, even if it\'s still unclear what exactly happened.',
        '👉 Informing parents, the police, or other helpers can feel like a big step. But that is exactly how something terrible can be prevented.',
        '💡 If something could be dangerous, it\'s better to act too early than too late.',
      ),
      optSegs('d', 'Someone in the group texts Yasmin again and hopes she replies.', 1,
        '👉 Yasmin is messaged again. If she sees her phone, she might respond.',
        '👉 At the same time, everything depends on whether she is even able to answer. If not, the situation stays unclear.',
        '💡 Sometimes one message isn\'t enough to really help.',
      ),
    ],
    ['reflect-understand', 'talk-act'],
  ),

  AF('s1e01c05_amy_feedback_emergency_help', 's1e01c05_item_emergency_help'),
]);

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 6 — Clues in the Picture
// ─────────────────────────────────────────────────────────────────────────────

const c06 = C('s1e01c06', 5, 'Amic 6', 'Clues in the Picture', [

  S('s1e01c06_story_class_find_location', [
    classChat(),
    m(ch.chioma, 'Does anyone else know WHERE this is?', '16:20'),
    m(ch.finn, 'no idea', '16:20'),
    m(ch.lisa, 'No clue 🤷‍♀️', '16:21'),
    m(ch.carlos, 'Wait a second.', '16:21'),
    m(ch.carlos, 'We can figure it out.', '16:21'),
    m(ch.carlos, 'There could be geodata in the picture. 📍', '16:22'),
    m(ch.lisa, 'Geodata?', '16:22'),
    m(ch.carlos, 'Yeah, you can often infer where a photo was taken from an image.', '16:23'),
    m(ch.carlos, 'When you take a photo with your phone, it often saves information with it: location, time, sometimes even the device. That\'s called “metadata.”', '16:23'),
    m(ch.lisa, 'Perfect. That\'s exactly what we need. 🗺️', '16:24'),
    m(ch.carlos, 'Vale… no.', '16:24'),
    m(ch.carlos, 'Wait. In chats, the coordinates are usually removed.', '16:24'),
    m(ch.lisa, 'What?', '16:25'),
    m(ch.chioma, 'Why?', '16:25'),
    m(ch.carlos, 'When a photo is posted in a chat, the geodata is deleted. For privacy reasons.', '16:25'),
    m(ch.lisa, 'Darn.', '16:26'),
    m(ch.carlos, 'Well, actually that\'s a good thing too. So not everyone has access to the data.', '16:26'),
    m(ch.chioma, 'What do we do now?', '16:27'),
    m(ch.carlos, 'Even so, a picture often still reveals something about the place. Just not as exact coordinates.', '16:27'),
    m(ch.lisa, 'What do you mean?', '16:28'),
    m(ch.carlos, 'Look at the photo again closely. 🔍', '16:28'),
    m(ch.carlos, 'What do you see in it?', '16:28'),
    m(ch.lisa, 'There\'s a stream, and you can see rocks.', '16:29'),
    m(ch.chioma, 'And of course the waterfall. 💦', '16:29'),
    m(ch.carlos, 'Exactly.', '16:29'),
    m(ch.chioma, 'And that\'s enough?', '16:30'),
    m(ch.lisa, 'Well, I don\'t know the place.', '16:30'),
    m(ch.carlos, 'Neither do I. But I\'ll try reverse image search. 🔍', '16:30'),
    m(ch.lisa, 'Reverse image search? And what is that supposed to be?', '16:31'),
    m(ch.carlos, 'Instead of searching with words in a search engine, I upload Yasmin\'s photo.', '16:31'),
    m(ch.chioma, 'Not bad. First time I\'ve heard of that.', '16:32'),
    m(ch.chioma, 'And? Do you find anything?', '16:32'),
    m(ch.carlos, 'Wait…', '16:32'),
    m(ch.carlos, 'Yes, I found something. There are pictures online that look very similar.', '16:33'),
    m(ch.carlos, 'Not exactly the same, smaller, less spectacular. That\'s probably because of all the rain.', '16:33'),
    m(ch.carlos, 'Hm… espera. 🤔 One of those waterfalls could fit.', '16:34'),
    m(ch.lisa, 'Not bad.', '16:34'),
  ], ['info-check', 'problem-solving', 'talk-act']),

  S('s1e01c06_story_switch_to_amy', [
    amyChat(),
  ], ['info-check', 'problem-solving']),

  IT('s1e01c06_item_find_location',
    'The group has gathered different clues, but still no certain solution. Do you have an idea what they could do now?',
    'judgement', 'information_classify',
    [
      optSegs('a', 'If they don\'t know exactly where Yasmin is, they can\'t do anything else. Maybe she\'ll message again in a moment.', 0,
        '👉 Nothing happens in the group at first. Everyone hopes the situation will resolve itself, even though it could be dangerous.',
        '👉 If Yasmin really needs help, valuable time is lost.',
        '💡 Especially when you\'re unsure, you should get help.',
      ),
      optSegs('b', 'They look up the addresses for the photos online and compare whether the place could match. Then they can get help.', 3,
        '👉 The group uses the clues in a targeted way to narrow down the location.',
        '👉 That way, they can find out where Yasmin is.',
        '👉 That gives them orientation. And they know what they can say when they get help.',
      ),
      optSegs('c', 'They wait only for an answer from Lukas and Igor for now. There\'s nothing else they can do anyway.', 1,
        '👉 The group focuses only on Lukas and Igor.',
        '👉 That may feel understandable, but it\'s not enough if the two of them are not replying either.',
        '💡 If important information is missing, it helps to use several paths at the same time.',
      ),
      optSegs('d', 'They just send Yasmin\'s photo to even more chats. Someone is bound to recognize the place.', 1,
        '👉 More people might see the picture, but the group would then be spreading Yasmin\'s photo without control.',
        '👉 That can be problematic in terms of privacy and may not help fast enough.',
        '💡 It\'s better to work specifically with the clues you already have and get help.',
      ),
    ],
    ['info-check', 'problem-solving'],
  ),

  AF('s1e01c06_amy_feedback_find_location', 's1e01c06_item_find_location'),

  S('s1e01c06_story_back_to_class', [
    classChat(),
    m(ch.carlos, 'Now I\'m looking up the addresses too.', '16:36'),
    m(ch.lisa, 'And?', '16:36'),
    m(ch.carlos, 'No. That waterfall isn\'t it. Way too far away.', '16:37'),
    m(ch.carlos, 'But maybe this one…', '16:37'),
    m(ch.chioma, 'Where is it?', '16:38'),
    m(ch.carlos, 'In the Grieswald Mountains.', '16:38'),
    m(ch.lisa, 'Could fit 🤔', '16:38'),
    m(ch.carlos, '@Lukas, @Igor Is that the right location?', '16:39'),
    m(ch.lisa, 'They\'re not answering.', '16:39'),
    m(ch.lisa, 'What should we do?', '16:39'),
    audio(ch.chioma, '/media/story/episodes/s1e01/chioma-sprachnachricht-s1e01c06.mp3', '16:40'),
  ], ['info-check', 'problem-solving', 'talk-act']),

  S('s1e01c06_story_carlos_card', [
    privateChat('You', 'Carlos'),
    m(ch.carlos, 'Hi {{chatName}}', '16:42'),
    m(ch.carlos, 'That whole geodata and image analysis thing is really pretty exciting 🤓 I wrote something up about it. In case you want to check it out:', '16:42'),
    bonusLink('tip-carlos-geodaten', 'Article: Geodata', '/newspaper/tip-carlos-geodaten', 'Open article →'),
  ], ['talk-act']),
]);

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 7 — Relief and Doubt
// ─────────────────────────────────────────────────────────────────────────────

const c07 = C('s1e01c07', 6, 'Amic 7', 'Relief and Doubt', [

  S('s1e01c07_story_class_relief', [
    classChat(),
    m(ch.chioma, 'Please answer. I can\'t take this waiting anymore.', '16:48'),
    m(ch.igor, 'Yeah?', '16:49'),
    m(ch.chioma, 'Finally! Are you okay? What\'s going on?', '16:49'),
    m(ch.igor, 'I can\'t see Yasmin anywhere.', '16:49'),
    m(ch.igor, 'But there are emergency responders there.', '16:50'),
    m(ch.lisa, 'Thank goodness.', '16:50'),
    m(ch.igor, 'They must have just arrived too.', '16:50'),
    m(ch.igor, 'Did you call them?', '16:51'),
    m(ch.igor, 'Oh, and Yasmin\'s parents are there too.', '16:51'),
    m(ch.chioma, 'And Yasmin?', '16:51'),
    m(ch.igor, 'I can\'t see her anywhere.', '16:52'),
    m(ch.chioma, 'That can\'t be 😰', '16:52'),
    m(ch.igor, 'I\'m jumping in and looking for her.', '16:52'),
    m(ch.lisa, 'No, absolutely not! That\'s way too dangerous!', '16:53'),
    m(ch.chioma, 'There\'s no point if you put yourself in danger too.', '16:53'),
    m(ch.chioma, 'Where is Yasmin?', '16:54'),
    m(ch.yasmin, 'Huh? What\'s going on?', '16:55'),
    m(ch.yasmin, 'Where was I supposed to be?', '16:55'),
    m(ch.carlos, 'Yasmin?', '16:55'),
    m(ch.chioma, 'Yasmin? Finally.', '16:56'),
    img(ch.igor, '/media/story/episodes/s1e01/s1e01c07-512.webp', '16:56', { content: 'All clear!' }),
    m(ch.lukas, 'This is really unbelievable now…', '16:57'),
    m(ch.igor, 'Yasmin is okay.', '16:57'),
    m(ch.igor, 'But Lukas is totally wiped out 🥴', '16:57'),
  ], ['info-check', 'reflect-understand', 'talk-act']),

  S('s1e01c07_story_class_blog_confusion', [
    divider('Later on'),
    m(ch.yasmin, 'Sorry, Lukas, that you were worried 🙈', '18:12'),
    m(ch.lukas, 'What kind of questionable blog was that, exactly?', '18:13'),
    m(ch.lukas, 'One that seriously recommends swimming at a waterfall like that? 😐', '18:13'),
    m(ch.yasmin, 'I\'m looking up the blog again right now…', '18:14'),
    m(ch.lisa, 'And?', '18:14'),
    m(ch.yasmin, 'The article is still there.', '18:15'),
    m(ch.yasmin, 'But the sentence about swimming is gone.', '18:15'),
    m(ch.lukas, '🤨', '18:15'),
    m(ch.yasmin, 'Seriously, I swear. It really said in there that you could swim there.', '18:16'),
    m(ch.lisa, 'Yasmin is right. I also saw pictures of people in the water there. But then the water level was much lower.', '18:16'),
    m(ch.lisa, 'Now the pictures are deleted 🤷‍♀️', '18:17'),
    m(ch.lukas, 'Good thing.', '18:17'),
    m(ch.lukas, 'Anything else would be irresponsible.', '18:17'),
    m(ch.lisa, '@Yasmin How did you even get back out of there? 😳 That\'s so intense.', '18:18'),
  ], ['info-check', 'reflect-understand', 'talk-act']),

  S('s1e01c07_story_switch_to_amy', [
    amyChat(),
  ], ['info-check', 'reflect-understand']),

  MIT('s1e01c07_item_outdated_tip',
    'How could Yasmin have noticed that the tip from the internet was no longer correct?',
    'judgement', 'information_classify',
    [
      opt('a', 'She could have checked when the article was written and whether it was still current.', 1),
      opt('b', 'She could have checked whether there were warnings or notes about the current situation (e.g. weather, water level).', 1),
      opt('c', 'She could have searched whether other websites or sources said the same thing.', 1),
      opt('d', 'She could have paid attention to whether pictures or information didn\'t match the current situation.', 1),
      opt('e', 'She could have considered whether the situation might be dangerous – even if it looked harmless online.', 1),
      opt('f', 'She could have asked someone who knows the area or has more experience there.', 1),
    ],
    { minSelections: 1, maxSelections: 6, helperText: 'You can choose several answer options.', topics: ['info-check', 'reflect-understand'] },
  ),

  AF('s1e01c07_amy_feedback_outdated_tip', 's1e01c07_item_outdated_tip'),

  S('s1e01c07_story_amy_wrapup', [
    m(ch.amy, 'By the way, I can see that Lukas is writing in your friend book. Come back tomorrow and you can take a look. 😊'),
  ], ['info-check', 'reflect-understand']),
]);

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 8 — The Picture Wasn’t Real
// ─────────────────────────────────────────────────────────────────────────────

const c08 = C('s1e01c08', 7, 'Amic', 'The Picture Wasn’t Real', [

  S('s1e01c08_story_lukas_friendbook', [
    privateChat('You', 'Lukas'),
    m(ch.lukas, 'I took the liberty of writing an entry for your friend book as well.', '08:14'),
    bonusLink('char-lukas', 'Character card Lukas', '/cards/char-lukas', 'View card →'),
    m(ch.lukas, 'You can look at it if you want.', '08:14'),
  ], ['talk-act']),

  S('s1e01c08_story_class_reveal', [
    classChat(),
    m(ch.aylin, 'A lot really happened here. And I missed the best part? 😳', '18:26'),
    m(ch.lisa, 'We haven\'t heard from you at all.', '18:26'),
    m(ch.aylin, 'Airplane mode 🤨', '18:27'),
    m(ch.aylin, 'But what actually happened?', '18:27'),
    m(ch.aylin, 'You were at the waterfall. And then?', '18:27'),
    m(ch.yasmin, 'Suddenly my parents were there - and even paramedics!', '18:28'),
    m(ch.yasmin, 'The full package.', '18:28'),
    m(ch.yasmin, 'Igor and Lukas looked like the devil himself was after them.', '18:29'),
    m(ch.yasmin, 'I was just lying in the grass. The roar all around me. And I was just staring into the rushing water.', '18:29'),
    m(ch.yasmin, 'Igor laughed when he saw me.', '18:30'),
    m(ch.yasmin, 'But Lukas was really angry - and completely exhausted.', '18:30'),
    m(ch.yasmin, 'He was ranting like crazy 😂', '18:30'),
    m(ch.lisa, 'Of course!', '18:31'),
    m(ch.lisa, 'Why didn\'t you answer when we called you?', '18:31'),
    m(ch.yasmin, 'Sorry, really. I didn\'t hear it at all and only saw it much later.', '18:32'),
    m(ch.yasmin, 'It was way too loud at the waterfall.', '18:32'),
    m(ch.lisa, 'That was so dangerous!', '18:32'),
    m(ch.yasmin, 'I wasn\'t even in the water.', '18:33'),
    m(ch.chioma, 'What?? 😳', '18:33'),
    m(ch.yasmin, 'I was really scared.', '18:33'),
    m(ch.yasmin, 'The water was way too wild. And…', '18:34'),
    m(ch.lisa, 'But the photo—', '18:34'),
    m(ch.yasmin, 'I only wanted a picture. A… cool picture… like that too.', '18:34'),
    m(ch.lisa, '?', '18:35'),
    m(ch.yasmin, 'In the photo, that is me… but at the pool.', '18:35'),
    m(ch.yasmin, 'Last summer.', '18:35'),
    m(ch.yasmin, 'I just layered it over 🙈', '18:36'),
    m(ch.finn, 'so the picture wasn’t even real?', '18:36'),
    m(ch.yasmin, 'No.', '18:36'),
    m(ch.yasmin, 'I was never in it.', '18:36'),
    m(ch.chioma, 'Was that… AI?', '18:37'),
    m(ch.yasmin, 'Yeah.', '18:37'),
    m(ch.lisa, 'I can\'t believe it 😳 It looked totally real.', '18:37'),
    m(ch.lisa, 'But I already wondered who was supposed to have taken the photo!!', '18:38'),
    m(ch.finn, 'crazy… i really thought you were in the water', '18:38'),
    m(ch.aylin, 'Let me see it again…', '18:39'),
    img(ch.finn, '/media/story/episodes/s1e01/s1e01c05-512.webp', '18:39', { content: 'forwarded:' }),
    m(ch.aylin, 'Wow, technically that\'s really good 👍', '18:40'),
    m(ch.aylin, 'The light and perspective match. Nicely done.', '18:40'),
    m(ch.lisa, '😕', '18:40'),
    m(ch.chioma, 'And you didn\'t think about us? Or about your parents?', '18:41'),
    m(ch.lisa, 'Yeah, Yasmin, you can\'t send an AI image without saying so. Honestly!', '18:41'),
    m(ch.yasmin, 'You all sent cool photos too, though.', '18:42'),
    m(ch.chioma, 'Yasmin, this isn\'t about likes or attention.', '18:42'),
    m(ch.chioma, 'That could have gone really badly.', '18:42'),
    m(ch.finn, 'but nothing happened though.', '18:43'),
    m(ch.lukas, 'I see that differently. And so do the emergency responders.', '18:43'),
    m(ch.finn, 'if she had really swum there it would’ve been worse.', '18:43'),
    m(ch.lisa, 'The picture is everywhere now.', '18:44'),
    m(ch.tom, 'Really everywhere?', '18:44'),
    m(ch.dominik, 'Yeah. In two other classes already too.', '18:44'),
    m(ch.yasmin, '😳', '18:45'),
    m(ch.yasmin, 'Can that still be deleted?', '18:45'),
    m(ch.carlos, 'We can delete it in our chat. But if it was shared, you can\'t get it back from everywhere.', '18:46'),
  ], ['info-check', 'reflect-understand', 'talk-act']),

  S('s1e01c08_story_diary_bonus', [
    amyChat(),
    m(ch.amy, 'Yasmin keeps thinking about it for a long time. Read her thoughts.'),
    bonusLink('diary-yasmin-entry2', 'Diary entry Yasmin – 2nd entry',
      '/diaries/diary_yasmin?entry=s1e01c08_0002', 'Open entry →'),
  ]),

  S('s1e01c08_story_private_yasmin_igor', [
    privateChat('Yasmin', 'Igor'),
    m(ch.igor, 'Hi Yasmin, do you already have plans for tomorrow?', '19:03'),
    typing('Yasmin is typing ...'),
  ], ['talk-act']),

  S('s1e01c08_story_switch_to_amy', [
    amyChat(),
  ], ['reflect-understand', 'talk-act']),

  OR('s1e01c08_reflection_ai_image_post',
    'If you create an image with AI yourself: what would be important to you?',
    { topics: ['reflect-understand', 'talk-act'] },
  ),

  AR('s1e01c08_amy_reaction_ai_image_post', 's1e01c08_reflection_ai_image_post'),

  S('s1e01c08_story_amy_wrapup_bonus', [
    m(ch.amy, 'My tip for you: be fair to others and say so if your picture was made with AI.'),
  ], ['reflect-understand', 'talk-act']),

  S('s1e01c08_story_outro_private', [
    privateChat('You', 'Aylin'),
    m(ch.aylin, '{{chatName}}, if you ever want to try generating an image with AI, you can do that.'),
    m(ch.aylin, 'But there are a few things you should keep in mind. I wrote an article about it. Take a look:'),
    bonusLink('tip-aylin-kileitfaden', 'Article: AI Guide', '/newspaper/tip-aylin-kileitfaden', 'Open article →'),
  ]),
]);

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 9 — Epilogue
// ─────────────────────────────────────────────────────────────────────────────

const c09 = C('s1e01c09', 8, 'Epilogue', '', [
  S('s1e01c09_story_epilogue', [
    privateChat('Yasmin', 'Chioma'),
    m(ch.yasmin, 'Lisa is finally back.', '20:05'),
    m(ch.yasmin, 'Fewer perfectly styled selfies from Rome and Paris.', '20:06'),
    m(ch.yasmin, 'But more interesting stories about other people and more drama.', '20:06'),
    m(ch.chioma, '🙈 Gossip almost always brings trouble…', '20:07'),
    sysMsg('Lisa added.', '20:08'),
    m(ch.yasmin, 'So? Spill it already: what\'s new in the rumor mill?', '20:08'),
    m(ch.lisa, 'I really can’t right now 🙈 already on my way to sushi.', '20:09'),
    m(ch.lisa, 'I already told you about that thing with Dominik this morning.', '20:09'),
  ]),
], { isEpilogue: true });

// ─────────────────────────────────────────────────────────────────────────────
// EPISODE
// ─────────────────────────────────────────────────────────────────────────────

const s1e01En: StoryEpisodeV02 = {
  id: 's1e01',
  seasonId: 's1',
  episodeId: 's1e01',
  courseId: 's1e01',
  chapters: [c01, c02, c03, c04, c05, c06, c07, c08, c09],
};

export default s1e01En;