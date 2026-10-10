// src/story-v02/content/en/sp0e01.en.ts
// Halloween Special: "Voices in the Net"

import type { Reaction } from '../../../common/types';
import { STORY_CHARACTERS as ch } from '../../../content/characters';
import type { StoryEpisodeV02 } from '../../types/storyTypes';
import {
  m, img, audio, divider, bonusLink, ghostLink, sysMsg, sysImg, poll,
  privateChat, classChat, amyChat,
  GR, OR, AR, CH, MIT, AF,
  rc, inp, opt,
  S, C,
} from '../storyBuilder';

const R = (emoji: string, type?: string): Reaction => ({ emoji, type });

const B = (n: string) => `/media/story/episodes/sp0e01/${n}`;
const A = (n: string) => `/media/story/episodes/sp0e01/${n}`;

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 1 — Digital Ghost
// ─────────────────────────────────────────────────────────────────────────────

const c01 = C('sp0e01c01', 0, 'Amic 1', 'Digital Ghost', [

  S('sp0e01c01_klassenchat_start', [
    classChat('Class 7b'),
    m(ch.carlos, "Have you seen it? Chioma's new Weekly is online!", '14:02'),
        sysImg(B('Halloween_1-512.webp'), '14:02'),
    bonusLink('chioma-news-stimmen-im-netz', "Chioma's Weekly", '/newspaper/chioma-news-stimmen-im-netz', 'Listen now →'),
    m(ch.markus, 'Schubert at Halloween. Lame. 🥱', '14:10'),
    m(ch.dominik, 'One thing might still save Halloween tonight. 😏', '14:11'),
    m(ch.markus, '?', '14:11'),
    m(ch.yasmin, 'Are you dressing up? 💅', '14:04'),
    m(ch.carlos, 'Claro. 😈', '14:04'),
    m(ch.dominik, "That's for babies.", '14:04'),
    m(ch.lukas, 'Actually, adults dressed up for Halloween back in the Victorian era. Later, teenagers became famous for their pranks.', '14:05'),
    m(ch.dominik, 'Thanks, Wikipedia. 🙄', '14:05'),
    m(ch.lukas, 'Always happy to help.', '14:06'),
    m(ch.yasmin, '@Carlos: What are you going as?', '14:06'),
    m(ch.carlos, 'Big secret. 🔒', '14:06'),
    m(ch.chioma, "He wouldn't tell me either.", '14:07'),
    m(ch.dominik, 'Whoever pulls the best Halloween prank tonight gets a giant bag of sweets from me.', '14:07', { replyTo: { text: '?', speakerName: 'Markus' } }),
    m(ch.markus, 'Really?', '14:07'),
    m(ch.dominik, 'If you dare. 😏', '14:08'),
    m(ch.chioma, "Guys, haven't you listened to my Weekly?", '14:08', { reactions: [R('🥱')] }),
    m(ch.carlos, "I'm heading out at 6:30 pm, who's coming?", '14:09'),
  ]),

  S('sp0e01c01_carlos_user_private', [
    privateChat('Carlos', 'You'),
    m(ch.carlos, "I'm such a huge Halloween fan.", '14:25'),
    m(ch.carlos, 'What about you? Are you dressing up?', '14:25'),
  ]),

  inp('sp0e01c01_input_halloween', 'stories:sp0e01.c01.input.halloween', {
    topics: ['talk-act'],
    promptSpeakerId: 'carlos',
  }),

  S('sp0e01c01_lisa_ghost_private', [
    privateChat('Lisa', 'digitalghost7b'),
    audio(ch.digitalghost7b, A('VoiceMessage_1.m4a'), '15:00', 'Voice message'),
    m(ch.lisa, 'Chioma?', '15:00'),
    m(ch.lisa, 'Why are you calling yourself digitalghost?', '15:01'),
    m(ch.lisa, 'Hey, Chioma!?', '15:01'),
  ]),

  S('sp0e01c01_amy_switch_unknown', [
    amyChat(),
  ]),

  MIT('sp0e01c01_item_unknown_account',
    'What would you do if you got a message from an unknown account?',
    'judgement',
    'judgement_explain',
    [
      opt('a', "I don't reply at first.", 1),
      opt('b', 'I click on links or files to find out who it is.', 0),
      opt('c', 'I tell a trusted adult about it.', 1),
      opt('d', 'I block or report the account if the message seems strange.', 1),
      opt('e', 'I send personal info or photos if the person asks.', 0),
      opt('f', 'I ask friends if they know the account.', 1),
    ],
    {
      minSelections: 1,
      maxSelections: 6,
      helperText: 'Multiple answers can be correct.',
      topics: ['safe-online', 'reflect-understand'],
    },
  ),

  AF('sp0e01c01_amy_feedback_unknown_account', 'sp0e01c01_item_unknown_account'),

  S('sp0e01c01_lisa_chioma_private', [
    privateChat('Lisa', 'Chioma'),
    m(ch.lisa, 'What was that about?', '15:05'),
    m(ch.chioma, 'What?', '15:05'),
    m(ch.lisa, 'Your weird spooky message.', '15:05'),
    m(ch.chioma, "I don't understand.", '15:06'),
    m(ch.lisa, "We're not in first grade any more.", '15:06'),
  ]),

  S('sp0e01c01_chioma_carlos_private', [
    privateChat('Chioma', 'Carlos'),
    m(ch.carlos, 'Chioma, why did you just call me? What is this?', '15:08'),
    m(ch.chioma, "I didn't. What do you all want from me?", '15:08'),
  ]),

  S('sp0e01c01_chioma_aylin_private', [
    privateChat('Chioma', 'Aylin'),
    m(ch.aylin, 'Hi Chioma, did you just call me as "digitalghost7b"?', '15:10'),
    m(ch.chioma, 'No. But Lisa and Carlos just asked me the same thing.', '15:10'),
    m(ch.chioma, 'Why would I call you as a digital ghost?', '15:11'),
    m(ch.aylin, "It was your voice!", '15:11'),
    m(ch.chioma, "What's going on? 🤔", '15:11'),
  ]),
]);

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 2 — Ghost Voices
// ─────────────────────────────────────────────────────────────────────────────

const c02 = C('sp0e01c02', 1, 'Amic 2', 'Ghost Voices', [

  S('sp0e01c02_klassenchat_ghost_posts', [
    classChat('Class 7b'),
    img(ch.digitalghost7b, B('Halloween_2-512.webp'), '15:30', { content: 'I AM TOO FAST FOR YOU.' }),
    img(ch.digitalghost7b, B('Halloween_3-512.webp'), '15:30', { content: 'TOO LATE.' }),
    img(ch.digitalghost7b, B('Halloween_4-512.webp'), '15:31', { content: 'YOU NEED TO TURN AROUND FASTER.' }),
    m(ch.aylin, 'Cut it out! That was creepy enough already.', '15:31'),
    m(ch.lisa, '@digitalghost7b: Who are you?', '15:31'),
    m(ch.yasmin, 'Spooky 👀', '15:32'),
    m(ch.digitalghost7b, 'Are you scared? 😱', '15:32'),
  ]),

  S('sp0e01c02_aylin_ghost_private', [
    privateChat('Aylin', 'digitalghost7b'),
    audio(ch.digitalghost7b, A('VoiceMessage_2.m4a'), '15:33', 'Voice call'),
    m(ch.aylin, 'Hey, why did you just hang up?', '15:34'),
    m(ch.aylin, 'How do you know about Hugo?', '15:35'),
    m(ch.digitalghost7b, 'I know everything.', '15:35'),
    m(ch.aylin, "Don't tell anyone. I'm warning you.", '15:35'),
  ]),

  S('sp0e01c02_carlos_ghost_private', [
    privateChat('Carlos', 'digitalghost7b'),
    audio(ch.digitalghost7b, A('VoiceMessage_5.m4a'), '15:36', 'Voice call'),
    m(ch.carlos, 'You know…', '15:40'),
    m(ch.carlos, 'How do you know my costume?!', '15:40'),
  ]),

  S('sp0e01c02_lisa_ghost_private2', [
    privateChat('Lisa', 'digitalghost7b'),
    audio(ch.digitalghost7b, A('VoiceMessage_9.m4a'), '15:38', 'Voice call'),
    m(ch.lisa, 'Chioma, that is your voice.', '15:40'),
    m(ch.digitalghost7b, 'I guess it is then.', '15:40'),
    m(ch.digitalghost7b, '🤡', '15:41'),
    m(ch.lisa, '😱', '15:41'),
    audio(ch.digitalghost7b, A('VoiceMessage_10.m4a'), '15:40', 'Voice message'),
    m(ch.digitalghost7b, 'Did I scare you? Oops, that wasn\'t my intention.', '15:41'),
  ]),

  S('sp0e01c02_lisa_chioma_2', [
    privateChat('Lisa', 'Chioma'),
    m(ch.lisa, 'Chioma, honestly. Please tell me the truth. Did you just call me?', '15:45'),
    m(ch.chioma, "No! I swear. I was in the kitchen with my whole family.", '15:45'),
    m(ch.lisa, "I'm actually getting scared. The digitalghost is calling me. With YOUR voice. When I call back, nobody picks up.", '15:46'),
    m(ch.chioma, 'This must be some nasty trick.', '15:46'),
    m(ch.lisa, "I don't know. Maybe digital ghosts really do exist.", '15:47'),
    m(ch.chioma, 'Carlos and Aylin also say I called them. Let me add them to a chat.', '15:48'),
    sysMsg('Carlos added.', '15:48'),
    sysMsg('Aylin added.', '15:48'),
    m(ch.lisa, 'Digitalghost... Like in the Weekly this morning. Do you think there are really such things as digital ghosts?', '15:49'),
    m(ch.carlos, "That's nonsense.", '15:49'),
    m(ch.aylin, 'Well, who knows…', '15:49'),
    m(ch.chioma, "Didn't you listen to the Weekly? A digital ghost isn't a real ghost. There's AI behind it.", '15:50'),
    m(ch.carlos, 'Wait. And the voice can come from videos? 🤔', '15:50'),
    m(ch.chioma, 'Exactly.', '15:50'),
    m(ch.carlos, 'So also from podcast recordings 🤔 … Your Weekly!', '15:51'),
    m(ch.lisa, "Right. There are enough recordings of you.", '15:51'),
    m(ch.chioma, "But using my voice without permission must be illegal!", '15:51'),
  ]),

  S('sp0e01c01_amy_intro', [
    amyChat(),
  ], ['info-check']),

  GR('sp0e01c01_reflection_voice_knowledge',
    'You get an unusual voice message from a friend. The voice sounds exactly like theirs. What do you know for certain?',
    [
      rc('a', 'The message is from them.',
        "Not necessarily. Voices can be cloned pretty convincingly with AI these days.",
      ),
      rc('b', "The voice sounds like theirs. I don't know yet who actually sent the message.",
        'Exactly! A familiar voice is a clue, but not solid proof of who really sent it.',
      ),
      rc('c', "If the voice sounds perfect, it can't be AI.",
        'Unfortunately not. AI voices can sound very realistic now.',
      ),
      rc('d', "If I see their number, the message is real.",
        "Even a familiar number isn't definitive proof of who really sent the message.",
      ),
    ],
    { topics: ['info-check', 'reflect-understand'] },
  ),

  AR('sp0e01c01_amy_reaction', 'sp0e01c01_reflection_voice_knowledge'),

  S('sp0e01c01_amy_tip', [
    m(ch.amy, 'If a message seems strange, check with the person through a different channel — in person or via a chat you normally use together.'),
  ]),
]);

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 3 — On the Trail
// ─────────────────────────────────────────────────────────────────────────────

const c03 = C('sp0e01c03', 2, 'Amic 3', 'On the Trail', [

  S('sp0e01c02_start', [
    privateChat('Lisa', 'Chioma, Aylin, Carlos'),
    m(ch.lisa, "How did the ghost even get our photos?", '16:00'),
    m(ch.carlos, 'They must have photographed me today while calling me … that\'s exactly what I was wearing.', '16:01'),
    m(ch.lisa, "Guys, you won't believe this!", '16:01'),
    m(ch.lisa, 'I only did this braid for school. When the ghost called me…', '16:02'),
    m(ch.carlos, 'What?', '16:02'),
    m(ch.lisa, '… I had my hair down. So the ghost didn\'t take the photo while calling — they just pretended to, to scare us.', '16:02'),
    m(ch.aylin, 'Unbelievable!', '16:03'),
    m(ch.aylin, 'But…', '16:03'),
    m(ch.aylin, 'They also knew things about me that nobody could possibly know. 🤔', '16:03'),
    m(ch.carlos, 'Like what?', '16:03'),
    m(ch.aylin, 'I … I don\'t want to say.', '16:04'),
    m(ch.carlos, "Same here. They knew my Halloween costume. I hadn't told anyone. 😱", '16:04'),
    m(ch.chioma, 'Lisa, did the ghost know something about you too?', '16:04'),
    m(ch.lisa, 'About me? Em… no.', '16:05'),
    m(ch.chioma, "Strange. Anyway. The unknown person must have found out your secrets somehow.", '16:05'),
    m(ch.carlos, 'Impossible!', '16:05'),
    m(ch.aylin, 'Nothing is impossible.', '16:06'),
    m(ch.carlos, "Let's do some research. We need to go through the social media accounts of all our friends.", '16:06'),
    m(ch.aylin, 'And family.', '16:06'),
    m(ch.lisa, 'And the class chat, especially old photos.', '16:06'),
    m(ch.lisa, "But we'll need all the information. Aylin?", '16:07'),
    m(ch.aylin, "We're not getting anywhere like this.", '16:07'),
  ]),

  S('sp0e01c02_klassenchat_ghost_aylin', [
    classChat('Class 7b'),
    m(ch.digitalghost7b, '@Aylin: Greetings from Hugo.', '16:20'),
    m(ch.aylin, 'Leave me alone.', '16:20'),
    m(ch.digitalghost7b, 'Hugo is already tired.', '16:21'),
    m(ch.aylin, 'Stop it.', '16:21'),
    img(ch.digitalghost7b, B('Halloween_5-512.webp'), '16:21', { content: '' }),
    m(ch.dominik, 'How cute 😂 I\'m dying.', '16:22'),
    m(ch.finn, "I had one of those too … when I was 4", '16:22', { reactions: [R('😂')] }),
    m(ch.digitalghost7b, "@Carlos: Better glue your teeth in tonight, you vampire 🧛.", '16:23'),
    m(ch.carlos, 'Oh come on, nobody was supposed to know that yet. 🫤', '16:23'),
    m(ch.dominik, 'Aw, are you going to cry now. 😭', '16:24'),
    m(ch.digitalghost7b, 'Now I feel bad.', '16:24'),
    m(ch.carlos, "You're so mean!", '16:24'),
    m(ch.dominik, 'Boo 😭', '16:25'),
    m(ch.digitalghost7b, "@Lisa: Watch yourself tonight. You know what I mean... 🤡", '16:25'),
  ]),

  S('sp0e01c03_amy_switch_private_public', [
    amyChat(),
  ]),

  OR('sp0e01c03_reflection_private_public',
    "The ghost shared other people's secrets in the class chat without permission. How would you feel if something private about you suddenly became public?",
    {
      category: 'FEELING',
      topics: ['reflect-understand', 'fairness'],
    },
  ),

  AR('sp0e01c03_amy_reaction_private_public', 'sp0e01c03_reflection_private_public'),

  S('sp0e01c03_amy_tip_private_public', [
    m(ch.amy, 'A secret of mine was shared without permission too: I once failed a biology test. The next day everyone suddenly knew. I was so angry because my friend had betrayed my trust.'),
  ]),

  S('sp0e01c03_group_investigation', [
    privateChat('Lisa', 'Chioma', 'Carlos', 'Aylin'),
    m(ch.carlos, 'Does your secret have something to do with this Hugo?', '16:30'),
    m(ch.aylin, "Fine. Yes, Hugo is my ancient stuffed animal. A dog. He sleeps under my bed to protect me.", '16:30'),
    m(ch.carlos, 'How cute.', '16:31'),
    m(ch.aylin, 'Watch it 💪!', '16:31'),
    m(ch.aylin, '… Literally nobody knows about Hugo.', '16:31'),
    m(ch.carlos, "My money's on Dominik. He said something this morning about a prank.", '16:32'),
    m(ch.aylin, 'That fits him. 🙄', '16:32'),
    m(ch.lisa, "That doesn't prove anything. Have you found anything?", '16:33'),
    m(ch.carlos, 'Nothing.', '16:33'),
    m(ch.aylin, 'Seriously? I thought you were our computer genius.', '16:33'),
    m(ch.carlos, 'So?', '16:34'),
    m(ch.aylin, "Didn't you say you hadn't told anyone about your costume?", '16:34'),
    m(ch.carlos, "I didn't.", '16:34'),
    m(ch.aylin, "And you didn't post anything?", '16:34'),
    m(ch.carlos, 'Really not.', '16:35'),
    m(ch.aylin, "But your brother did 😂 ... I found something.", '16:45'),
    img(ch.aylin, B('Halloween_6-512.webp'), '16:45', { content: '' }),
    m(ch.carlos, 'What?? That spy! My brother is in so much trouble!', '16:45'),
    m(ch.lisa, "I've never seen you like this 😂.", '16:46'),
    m(ch.lisa, "I found something too. Aylin, YOU posted this photo yourself in the class chat. A selfie in front of your laptop. But behind you…", '16:46'),
    img(ch.lisa, B('Halloween_7-512.webp'), '16:46', { content: '' }),
    m(ch.aylin, "Hugo! I can't believe it!", '16:47'),
    m(ch.aylin, "I'm going to get Dominik back. 😡", '16:47'),
    m(ch.carlos, "We don't actually know it was him.", '16:47'),
    m(ch.lisa, 'He lives round the corner from you. Just ask him.', '16:48'),
  ]),

  S('sp0e01c02_amy_intro', [
    amyChat(),
  ], ['info-check', 'reflect-understand']),

  MIT('sp0e01c02_item_digital_footprint',
    'Where could someone find information about you online?',
    'judgement',
    'information_classify',
    [
      opt('a', 'In photos with a recognisable background (e.g. home/school).', 1),
      opt('b', 'In livestreams, videos or TikTok.', 1),
      opt('c', 'Through my gaming profile or other accounts.', 1),
      opt('d', 'In posts that my parents or siblings shared about me.', 1),
      opt('e', 'In class chats, groups or forums.', 1),
      opt('f', "On my school's or club's website.", 1),
      opt('g', 'Through search results – if my name appears somewhere publicly.', 1),
    ],
    {
      minSelections: 1,
      maxSelections: 7,
      helperText: 'Multiple answers can be correct.',
      topics: ['info-check', 'reflect-understand'],
      scored: false,
    },
  ),

  AF('sp0e01c02_amy_feedback_digital_footprint', 'sp0e01c02_item_digital_footprint'),

  S('sp0e01c02_amy_tip', [
    m(ch.amy, 'Also look at others when sharing photos or posts: are you accidentally revealing something about someone that they would rather keep private?'),
  ]),

  CH('sp0e01c02_challenge_digital_footprint',
    'Find out what others can find about you online.',
  ),
]);

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 4 — My Voice
// ─────────────────────────────────────────────────────────────────────────────

const c04 = C('sp0e01c04', 3, 'Amic 4', 'My Voice', [

  S('sp0e01c03_klassenchat_lisas_secret', [
    privateChat('Lisa', 'Chioma', 'Carlos', 'Aylin'),
    m(ch.carlos, "It can't be Dominik. At the exact moment I was talking to him, a post arrived in our class chat for both of us.", '17:00'),
    m(ch.carlos, 'Watch out in the dark. Ghosts are stirring.', '17:00', { forwarded: { fromName: 'digitalghost7b', fromChatLabel: 'Class chat' } }),
    m(ch.lisa, "I got that too. 😱 I'm not going anywhere alone tonight.", '17:01'),
    m(ch.carlos, 'We can pick you up. 6:40 pm?', '17:01'),
    m(ch.lisa, "Deal.", '17:01'),
    m(ch.lisa, 'I asked around a bit, by the way.', '17:02'),
    m(ch.lisa, 'Yasmin saw Markus taking photos this morning. She found it strange because he wasn\'t waiting for people to look at the camera.', '17:02'),
    m(ch.aylin, 'Suspicious 🤔', '17:03'),
    m(ch.aylin, 'Lisa, what did the ghost actually mean with the clown?', '17:03'),
    m(ch.lisa, 'Oh, nothing.', '17:04'),
    m(ch.aylin, "I don't believe you.", '17:04'),
    m(ch.carlos, "Right. The ghost gave all three of us a similar scare. Why would they not send you a second message? And then that thing about the clown…", '17:05'),
    m(ch.aylin, 'Out with it.', '17:05'),
    m(ch.lisa, "All right. I'm terrified of clowns.", '17:06'),
    m(ch.carlos, 'So?', '17:06'),
    m(ch.lisa, "Super embarrassing! Who's scared of clowns? I have a real panic attack. Especially now at night. 😱", '17:06'),
    m(ch.aylin, "I didn't know that.", '17:07'),
    m(ch.lisa, "Nobody does. Except my mum. And she doesn't gossip about it online.", '17:07'),
    m(ch.aylin, "Not online? But has she told anyone?", '17:07'),
    m(ch.lisa, "She discusses everything with her best friend. But nobody else, I think.", '17:08'),
    m(ch.aylin, "Wait. Her best friend? That's…", '17:08'),
    m(ch.lisa, "Markus's mum!! 😱", '17:08'),
  ]),

  S('sp0e01c03_klassenchat_markus_arrives', [
    classChat('Class 7b'),
    m(ch.markus, "@Carlos, I'm here. Coming?", '18:20'),
    m(ch.carlos, "Claro. I'll head out in a minute.", '18:20'),
  ]),

  S('sp0e01c03_markus_ghost_private', [
    privateChat('Markus', 'digitalghost7b'),
    audio(ch.digitalghost7b, A('VoiceMessage_11.m4a'), '18:20', 'Voice message'),
    m(ch.markus, 'Chioma?', '18:21'),
    audio(ch.digitalghost7b, A('VoiceMessage_12.m4a'), '18:21', 'Voice message'),
    m(ch.markus, 'Hey, what is this?!', '18:21'),
    m(ch.digitalghost7b, "How dare you pull pranks in my name?", '17:21'),
  ]),

  S('sp0e01c03_markus_confesses', [
    classChat('Class 7b'),
    img(ch.digitalghost7b, B('Halloween_8-512.webp'), '18:22', { content: '' }),
    m(ch.markus, "What's going on? 😱", '18:22'),
    m(ch.aylin, "Don't act innocent.", '18:22'),
    m(ch.aylin, "Markus, you traitor. Posting private photos of me.", '18:22'),
    m(ch.markus, "But… now the ghost is sending photos of me too 😧.", '18:22'),
    m(ch.aylin, "Don't change the subject. Admit it!", '18:22'),
    m(ch.markus, "Okay, it was me.", '18:23'),
    m(ch.markus, 'It was just a joke.', '18:23'),
    m(ch.chioma, 'You cloned my voice!', '18:23'),
    audio(ch.digitalghost7b, A('VoiceMessage_13.m4a'), '18:23', 'Voice message'),
    m(ch.chioma, 'Stop it right now.', '18:24'),
    m(ch.markus, "That's not me any more.", '18:24'),
    m(ch.chioma, "Tell that to someone who believes you.", '18:25'),
    audio(ch.digitalghost7b, A('VoiceMessage_14.m4a'), '18:25', 'Voice message'),
    m(ch.markus, "Leave me alone. It's already dark.", '18:26'),
    m(ch.dominik, "Poor thing. Don't you have to be home by now? 😂", '18:26'),
  ]),

  S('sp0e01c03_amy_switch_prank_ethics', [
    amyChat(),
  ]),

  OR('sp0e01c03_reflection_prank_ethics',
    '"I just wanted to scare you." You hear that a lot at Halloween. When do you think a prank goes too far?',
    {
      category: 'PERSPECTIVE',
      topics: ['reflect-understand', 'fairness'],
    },
  ),

  AR('sp0e01c03_amy_reaction', 'sp0e01c03_reflection_prank_ethics'),

  S('sp0e01c03_amy_tip_prank_ethics', [
    m(ch.amy, "What matters isn't just the intention. Look at the impact too: is everyone still having fun, or does someone feel threatened, embarrassed, or hurt?"),
  ]),

  S('sp0e01c03_confirmation_group', [
    privateChat('Lisa', 'Chioma', 'Carlos', 'Aylin'),
    m(ch.carlos, 'Markus just confessed everything to me.', '18:31'),
    m(ch.chioma, 'My voice?', '18:32'),
    m(ch.carlos, 'Cloned.', '18:32'),
    m(ch.lisa, 'And our photos?', '18:33'),
    m(ch.carlos, 'Also him.', '18:33'),
    m(ch.aylin, '😡', '18:33'),
    m(ch.lisa, 'Why?!', '18:34'),
    m(ch.carlos, "Dominik's Halloween challenge.", '18:34'),
    m(ch.chioma, 'Unbelievable.', '18:34'),
    m(ch.carlos, 'But …', '18:34'),
    m(ch.carlos, "We have a new problem.", '18:35'),
    m(ch.lisa, 'What?', '18:35'),
    m(ch.carlos, "Markus really wasn't behind that message in the class chat just now.", '18:35'),
    m(ch.lisa, 'Excuse me?', '18:35'),
    m(ch.carlos, 'He was standing right next to me.', '18:36'),
  ]),
]);

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 5 — Who Laughs Last
// ─────────────────────────────────────────────────────────────────────────────

const c05 = C('sp0e01c05', 4, 'Amic 5', 'Who Laughs Last', [

  S('sp0e01c04_group_new_problem', [
    privateChat('Lisa', 'Carlos', 'Markus', 'Aylin'),
    m(ch.carlos, "@Lisa, when are you coming out? Markus and I are already waiting.", '18:45'),
    m(ch.lisa, 'Markus?? 😡', '18:45'),
    m(ch.markus, "Yeah, sorry. But don't make me walk alone.", '18:47'),
    m(ch.lisa, "Fine. Coming in 2 minutes.", '18:47'),
    m(ch.lisa, 'And Aylin?', '18:47'),
    m(ch.carlos, "She needs to take care of something quickly and we'll meet her in front of school.", '18:47'),
  ]),

  S('sp0e01c04_klassenchat_aylin_gone', [
    classChat('Class 7b'),
    m(ch.chioma, "Is anyone there yet? Emma and I are on our way.", '18:50'),
    m(ch.dominik, "Everyone in little groups 😂 Nobody dares to go out alone?", '18:51'),
    m(ch.aylin, "Guys, I just ran into Mr Alvarez. He was acting really weird.", '18:52'),
    m(ch.aylin, "He says the party is off. He was really angry at Ms Schubert for planning something at school tonight.", '18:52'),
    m(ch.dominik, "What is he on about? Does that make any sense?", '18:52'),
    m(ch.aylin, "He says: 700 years ago, where our gym stands today, there was a graveyard. So many people were buried there during a plague that some graves were left without names.", '18:53'),
    m(ch.aylin, "According to the legend, on the night before All Saints' Day, those whom no one remembers any more return.\nNot every night.\nOnly this one.", '18:53'),
    m(ch.chioma, "The night before All Saints' Day? That's tonight!", '18:54'),
    m(ch.dominik, '💀', '18:54'),
    m(ch.carlos, "I don't know about this.", '18:54'),
    m(ch.aylin, "He was serious. He told me to leave. We shouldn't go onto the school grounds after dark. You never know.", '18:55'),
    m(ch.lisa, 'Does he actually mean that?', '18:55'),
    divider('later'),
    m(ch.digitalghost7b, "THE DEAD DO NOT FORGET.\nWE HAVE WAITED FOR CENTURIES.\nNOW THE TRUTH SHALL COME TO LIGHT.\nONE OF YOU I WILL TAKE AS COLLATERAL.", '18:55'),
    m(ch.dominik, "Please let it be Chioma, she's always so annoying 😂", '18:55'),
    m(ch.chioma, "You wish.", '18:56'),
    m(ch.aylin, "There was a cracking sound behind me. I think someone is following me.", '18:56'),
    m(ch.lisa, "Shouldn't we all just go home?", '18:56'),
    audio(ch.aylin, A('VoiceMessage_15.m4a'), '18:56', 'Voice message'),
    img(ch.digitalghost7b, B('Halloween_9-512.webp'), '18:58', { content: '' }),
    m(ch.digitalghost7b, "WANT HER BACK? THEN FIND THE GRAVE WITH NO NAME.", '18:58'),
    img(ch.digitalghost7b, B('Halloween_10-512.webp'), '18:58', { content: '' }),
    m(ch.carlos, "Could all of this be fake?", '18:58'),
    m(ch.carlos, "The voice could be cloned again and the photo could be AI.", '18:58'),
    m(ch.chioma, "I don't think so. She was supposed to be here ages ago.", '18:58'),
    m(ch.chioma, "I'd better call her.", '18:58'),
    m(ch.chioma, "She's not picking up.", '18:58'),
    m(ch.lisa, "I'm genuinely worried.", '18:58'),
  ]),

  S('sp0e01c04_amy_switch_pressure', [
    amyChat(),
  ]),

  OR('sp0e01c04_reflection_pressure',
    'The ghost keeps putting pressure on the group: "Come quickly", "find the grave", "if you want her back …". Why can pressure lead to worse decisions online?',
    {
      category: 'PERSPECTIVE',
      topics: ['reflect-understand', 'safe-online'],
    },
  ),

  AR('sp0e01c04_amy_reaction', 'sp0e01c04_reflection_pressure'),

  S('sp0e01c04_amy_tip_pressure', [
    m(ch.amy, "Someone who deliberately pressures or frightens you often wants to stop you from thinking clearly. That's exactly when it's worth pausing and staying calm."),
  ]),

  S('sp0e01c04_private_investigation', [
    privateChat('Carlos', 'Lisa', 'Markus', 'Chioma', 'Emma', 'Aylin', 'Dominik', 'Lukas'),
    m(ch.chioma, "Let's chat here instead so the ghost can't read it.", '18:59'),
    m(ch.lisa, "Good idea. What do we do now? What does the ghost mean?", '18:59'),
    m(ch.chioma, 'Does anyone recognise this?', '18:59'),
    m(ch.carlos, 'No.', '18:59'),
    m(ch.lukas, 'Wait.', '18:59'),
    m(ch.lukas, 'I know that stone.', '18:59'),
    m(ch.carlos, 'How?', '19:00'),
    m(ch.lukas, 'Ms Schubert showed us it on that geology tour.', '19:00'),
    m(ch.carlos, 'When?', '19:01'),
    m(ch.lukas, 'Last year. You were there.', '19:01'),
    m(ch.carlos, 'You remember a stone from last year?', '19:01'),
    m(ch.dominik, 'Of course you do.', '19:01'),
    m(ch.lukas, 'Behind the school. By the ditch.', '19:02'),
    m(ch.carlos, "Where are you? Wait for me.", '19:02'),
    divider('later'),
  ]),

  S('sp0e01c04_ar_moment', [
    classChat('Class 7b'),
    m(ch.carlos, 'Found it.', '19:08'),
    m(ch.lisa, "You sure? Where's Lukas?", '19:08'),
    m(ch.carlos, 'Covered in ivy and moss. Acorns. This is the stone.', '19:09'),
    m(ch.chioma, 'And now?', '19:09'),
    m(ch.digitalghost7b, 'SOME THINGS CAN ONLY BE SEEN THROUGH THE RIGHT EYE. 👁️', '19:10'),
    ghostLink('OPEN THE EYE'),
    m(ch.carlos, '"The right eye"?', '19:11'),
    m(ch.lukas, 'The camera, genius.', '19:11'),
    m(ch.lisa, 'Go on then.', '19:11'),
    m(ch.carlos, 'Me?', '19:11'),
    m(ch.lisa, "Stop stalling. Press it.", '19:12'),
    m(ch.carlos, "It wants access to my camera.", '19:12'),
    m(ch.lisa, 'Then the eye must be your camera.', '19:12'),
    m(ch.carlos, "Uhh … guys? There's someone standing there.", '19:13'),
    m(ch.lisa, 'Where?', '19:13'),
    m(ch.carlos, "You can only see them through the camera.", '19:13'),
    m(ch.dominik, "What? What do you see? Guys, where are you?", '19:14'),
    img(ch.carlos, B('Halloween_11-512.webp'), '19:44', { content: 'A… ghost.' }),
    m(ch.emma, "WHAT?! Don't go there!", '19:14'),
    m(ch.chioma, "But we have to find Aylin!", '19:15'),
    m(ch.emma, "First digital ghosts, then nameless plague victims and now an actual ghost? Maybe the dead just don't want to wander the internet as bots forever! 😱", '19:15'),
    m(ch.dominik, "She's lost the plot.", '19:15'),
    m(ch.dominik, "Let me know when you've found the old bed sheet.", '19:16'),
    m(ch.carlos, "You have to help us! Aylin could be in danger.", '19:16'),
    m(ch.dominik, "I'll meet you at the gym — no interest in your ghost hunt. Good luck, Ghost Busters! 🚫👻", '19:17'),
    m(ch.lisa, "Carlos, wait for me. Don't leave me behind. I'm scared. Can I hold your hand?", '19:17'),
    m(ch.dominik, 'How sweet 😙😂', '19:18'),
  ]),

  S('sp0e01c04_group_final', [
    privateChat('Carlos', 'Lisa', 'Chioma'),
    m(ch.chioma, "Is Dominik genuinely that cool or is he involved somehow?", '19:20'),
    m(ch.carlos, "We'll find out.", '19:20'),
    m(ch.lisa, "There's someone back there.", '19:20'),
    m(ch.carlos, "That's Dominik.", '19:21'),
  ]),

  S('sp0e01c04_resolution', [
    classChat('Class 7b'),
    m(ch.dominik, 'COME QUICK!!', '19:22'),
    m(ch.lisa, "You had something to do with this, didn't you?!", '19:22'),
    m(ch.dominik, "What? Nonsense. But I can see something by the oak tree.", '19:22'),
    m(ch.lisa, "The ghost! Oh no, with a scythe. 😱", '19:23'),
    m(ch.dominik, "And there's Aylin, tied to the trunk.", '19:23'),
    m(ch.emma, "I can't take this! I'm out of here!", '19:23'),
    m(ch.lisa, "We need to stay together.", '19:24'),
    m(ch.dominik, "That's not real. I'm going in. 💪", '19:24'),
    m(ch.emma, "WHAT?? NO!", '19:24'),
    m(ch.dominik, "What? I'll just poke it.", '19:25'),
    img(ch.carlos, B('Halloween_12-512.webp'), '19:25', { content: '' }),
    m(ch.carlos, 'Dominik is running to the gym.', '19:25'),
    m(ch.emma, "Everyone: we need HELP! NOW! By the old oak tree!", '19:26'),
    m(ch.yasmin, 'Come to the gym. Quick!', '19:26'),
    img(ch.yasmin, B('Halloween_13-512.webp'), '19:26', { content: '' }),
  ]),

  S('sp0e01c04_party', [
    privateChat('Carlos', 'Lisa', 'Aylin'),
    m(ch.carlos, 'Great party.', '20:30'),
    m(ch.lisa, "Didn't think Schubert could throw such a cool party.", '20:30'),
    m(ch.carlos, "Well, with help. Aylin's prank was epic.", '20:31'),
    m(ch.lisa, 'A bit too epic. I was genuinely scared.', '20:31'),
    m(ch.aylin, "Okay, sorry. 😬 But thank Markus. I just used his trick against him. 😇", '20:32'),
    m(ch.lisa, 'And the ghost?', '20:32'),
    m(ch.aylin, "Ms Schubert. She was worried her party would be boring anyway.", '20:32'),
    m(ch.lisa, 'The scythe too?', '20:33'),
    m(ch.aylin, "Cardboard. That's all she allowed. 😂", '20:33'),
    m(ch.lisa, 'And Alvarez?', '20:33'),
    m(ch.aylin, "Never met him. 😇", '20:33'),

    classChat('Class 7b'),
    m(ch.lisa, "Wasn't there still a vote to settle?", '20:35'),
    m(ch.aylin, "Right. How was that again, Markus?", '20:35'),
    m(ch.dominik, 'Traitor.', '20:35'),
    m(ch.markus, "Yeah. Who pulled the best Halloween prank.", '20:36'),
    m(ch.carlos, "That was clearly Aylin.", '20:36'),
    m(ch.markus, "Hey. She just stole my [[voice-clone]] trick.", '20:36'),
    m(ch.lisa, "So you weren't scared at all?", '20:37'),
    m(ch.markus, "Well, a little bit.", '20:37'),
    m(ch.dominik, "I clearly won! The whole challenge was my idea.", '20:38'),
    m(ch.aylin, '😂😂', '20:38'),
    m(ch.dominik, "Besides, the ghost was completely lame. I saw through it straight away.", '20:38'),
    m(ch.aylin, "Want me to show that photo again? 😇", '20:39'),
    m(ch.dominik, "Don't you dare.", '20:39'),
    poll(ch.carlos, 'Who had the best Halloween prank?', [
      { text: 'Aylin', votes: 15 },
      { text: 'Dominik', votes: 1 },
      { text: 'Markus', votes: 1 },
    ], '20:40'),
    m(ch.aylin, "Right, I'd like my prize now.", '20:40'),
    m(ch.dominik, 'What prize?', '20:41'),
    img(ch.markus, B('Halloween_14-512.webp'), '19:55', { content: '' }),
    m(ch.dominik, 'Markus!! Traitor…', '20:41'),
    m(ch.carlos, 'Screenshots never forget.', '20:42'),
    m(ch.dominik, 'I hate digital literacy.', '20:42'),
  ]),

  S('sp0e01c04_carlos_user_ar', [
    privateChat('Carlos', 'You'),
    m(ch.carlos, 'Aylin used [[augmented-reality]] technology. So cool! I wrote something about it. Check it out if you\'re interested.', '20:45'),
    bonusLink('ar-halloween-special', 'Article: What is Augmented Reality?', '/newspaper/ar-halloween-special', 'Open article →'),
  ]),

  CH('sp0e01c04_challenge_ghost_story',
    'Make up a short horror story. What makes a story truly scary? Tell it to someone today and watch how they react.',
  ),
]);

// ─────────────────────────────────────────────────────────────────────────────
// EPISODE
// ─────────────────────────────────────────────────────────────────────────────

const sp0e01En: StoryEpisodeV02 = {
  id: 'sp0e01',
  seasonId: 'sp',
  episodeId: 'sp0e01',
  courseId: 'sp0e01',
  chapters: [c01, c02, c03, c04, c05],
};

export default sp0e01En;
