// src/ai/lang/en/amyPhrases.en.ts
// All Amy strings centralized (i18n-ready). Core stays text-free.

export const AMY_PHRASES_EN = {
  emojis: {
    owl: '🦉',
  },

  // Bridge into the tip. Calm, short, not pushy.
  bridge: {
    aligned: [
      'That fits the topic well.',
      'Yes — that’s right on track.',
      'Yeah — that hits the core.',
      'That’s a strong link to the question.',
      'You picked up the main idea well.',
      'That sounds consistent with it.',
      'That really fits here.',
      'You’re close to the key point.',
    ],
    generic: [
      'That’s a good start — the tip will help you place it.',
      'Good direction — the tip will help you sort it out.',
      'Partly there — the tip will make it clearer.',
      'There’s something in it — the tip will help you organize it.',
      'That works as a start — the tip adds a helpful clue.',
      'You’ve got a direction — the tip connects it in a moment.',
      'That’s not wrong — the tip helps with the main point.',
      'You’re heading the right way — the tip adds one more piece.',
    ],
    offTopic: [
      'Let’s come back to the main point — the tip will help in a moment.',
      'Let’s refocus on the key idea — the tip will help right after this.',
      'Let’s sort it out briefly — the tip is coming to help.',
      'That’s a different topic right now — the tip brings us back.',
      'Let’s turn back to the question — the tip helps you focus.',
      'Quick step back to the core — then it gets easier.',
      'That’s a side path — the tip shows the core idea.',
      'Let’s put the question back in the center — the tip will help.',
    ],
  },

  // --------------------
  // A (warm, attentive, not over-the-top)
  // --------------------
  aIntro: [
    'Thanks for sharing that. 🦉',
    'That sounds honest. 🦉',
    'I see your point. 🦉',
    'That feels well thought out. 🦉',
    'That’s a strong thought. 🦉',
    'I can really follow what you mean. 🦉',
    'That’s brave — you said it clearly. 🦉',
    'I like how you explained that. 🦉',
    'That has structure — nice. 🦉',
    'You really thought about it. 🦉',
  ],

  // If no mirroring is used:
  aOutroGeneric: [
    'Let that sink in — the tip is next.',
    'Let’s take the next step.',
    'That helps you think forward — the tip is next.',
    'Good step. The tip is coming right after this.',
    'That sets you up well — the tip will help next.',
    'Let’s hold onto that — then we’ll look at the tip.',
    'That’s a solid base — the tip is next.',
    'Okay — we can move on from here.',
  ],

  // --------------------
  // B (short, but supportive — not dismissive)
  // --------------------
  bIntro: [
    'Okay — I get you. 🦉',
    'Alright — that works. 🦉',
    'Got it. 🦉',
    'Thanks — that’s enough already. 🦉',
    'Short and clear — nice. 🦉',
    'Yes — that’s a good point. 🦉',
    'Okay — that counts. 🦉',
    'That’s brief, but it fits. 🦉',
    'All good — short is okay too. 🦉',
    'I’m with you. 🦉',
  ],

  bOutro: [
    'The tip will help you place it in a moment.',
    'Let’s keep going.',
    'The tip adds one more piece in a moment.',
    'Okay — moving on.',
    'A quick hint is coming next.',
    'We’ll take that and move on.',
    'That works — next step.',
    'Okay — let’s continue.',
  ],

  // --------------------
  // Retry (C/UNSURE) – calm, not shaming
  // --------------------
  retryGeneric: [
    'I can’t place that yet.',
    'Hmm — I’m not sure what you mean yet.',
    'It’s not clear to me what you want to say.',
    'I need a little more to understand.',
    'That’s still a bit too unclear for me.',
    'I’m still missing the main point.',
    'I don’t see how it connects to the question yet.',
    'I can follow you — but the key point is still missing.',
  ],

  // Off-topic steering: statements only (no second question)
  steerBackStatements: [
    'Take a quick look back at the question above.',
    'Stay with the question — one sentence is enough.',
    'Come back to the core of the question for a moment.',
    'Let’s stick to what the question really wants to know.',
    'Quickly back to the question — then it fits.',
    'Just the core idea — super short is fine.',
    'Let’s bring the question to the front again — one sentence is enough.',
  ],

  // --------------------
  // MiniTipType strings (fixed, no generation)
  // Invitation, not command. (no slang, no irony)
  // --------------------
  miniTips: {
    focus_question: [
      'This might help: write only the most important point for the question.',
      'If you want: one short sentence about the core is enough.',
      'Often it helps: name just one thing that matters most.',
      'No rush: just write the core idea — that’s enough.',
      'If you like: one sentence that fits the question is totally fine.',
      'Short and clear: just the main thought.',
    ],
    example_from_story: [
      'This might help: think briefly about the scene in the story.',
      'If you want: use one example from the story scene.',
      'Picture the story situation — and stick to one example.',
      'Sometimes a tiny example from the scene helps.',
      'You can lean on the story: what would fit there?',
      'Pick one moment from the scene — just one.',
    ],
    personal_feeling: [
      'This might help: check in with your feeling for a second.',
      'If you want: does it feel more good, weird, or unsafe?',
      'You can keep it simple: which feeling is strongest?',
      'One feeling is enough: calm, sad, angry, scared, or okay?',
      'If you like: name a feeling — and one reason.',
      'You can keep feelings very short.',
    ],
    simple_rephrase: [
      'This might help: say it again in very simple words.',
      'If you want: short and simple is enough.',
      'Say it like you’d explain it to a friend — super short.',
      'One simple sentence is enough — nothing extra.',
      'You can restart: one short sentence.',
      'Plain wording often helps.',
    ],
    none: [''],
  },

  // --------------------
  // Adult Gate & Safety (clear, steady, no drama)
  // --------------------
  adultGate: [
    'This matters. Please talk to a trusted adult for a moment.',
    'This is a good moment to get help from a trusted adult.',
    'This is something you should not handle alone. Please get a trusted adult.',
    'I don’t want you to be alone with this. Please talk to a trusted adult.',
    'This is important enough that you should get support now.',
    'Please bring an adult in for a moment — then you can continue together.',
  ],

  safety: [
    'That sounds really heavy. You don’t have to carry it alone. Please get help from a trusted adult now.',
    'That sounds very overwhelming. Please talk to a trusted adult now.',
    'I’m here with you. And still: please get real help from a trusted adult now.',
    'This is a moment where help matters. Please talk to a trusted adult now.',
    'That sounds like a lot of pressure. Please get support from a trusted adult now.',
  ],

  // --------------------
  // Norm / provocation (neutral, clear boundary, no shaming)
  // --------------------
  normStop: [
    'Hold on — that could hurt someone. Let’s rethink it calmly.',
    'Hmm — that wouldn’t be fair to others. Let’s look again.',
    'Stop for a second: that can harm someone. Let’s redo the thought.',
    'I can’t leave it like that: it could hurt someone. Let’s rethink it.',
    'Quick pause: that wouldn’t be okay for others. Let’s think differently.',
    'I’ll stay calm, but clear: that can hurt. Let’s sort it again.',
  ],

  // --------------------
  // Micro tasks (exactly 1 question)
  // Tone: invitation, not a test.
  // --------------------
  microTask: {
    FEELING: [
      'Which feeling fits — and why?',
      'What feeling is strongest for you — and why?',
      'Which feeling would show up most in that situation?',
      'Does it feel more okay or not okay — and why?',
      'Which feeling fits best — and what makes it that one?',
    ],
    ACTION: [
      'What would you do now — very specifically?',
      'What would your next step be — very specifically?',
      'What would you do first in a situation like that?',
      'What would be a safe, fitting action right now?',
      'What would you do to make it better?',
    ],
    PERSPECTIVE: [
      'What is the most important point here?',
      'What is the core of it for you?',
      'Why does that matter — in one sentence?',
      'How would you place it, briefly?',
      'How would you explain it to someone?',
    ],
    KNOWLEDGE: [
      'What is the most important fact here?',
      'Which information matters most here?',
      'What should someone definitely know about this?',
      'Which fact helps understanding the most?',
      'What is the key fact here?',
    ],
    CHALLENGE: [
      'What small practice could fit?',
      'What small exercise could you try?',
      'What mini-task would help?',
      'What small training step could you test?',
      'What small thing could you try today?',
    ],
    GENERAL: [
      'What thought would fit here?',
      'What is your most important thought here?',
      'What would you say about it in one sentence?',
      'How would you describe it in one sentence?',
      'What is your core point?',
    ],
  },
};
