// src/story/engine/storyTranscript.ts

import type { Course, Message } from '../../common/types';

const AMY_SPEAKER = { id: 'amy', name: 'Amy', avatar: 'amy' };

type AnswerItem = {
  chapter: number;
  text: string;
  timestamp?: string;
};

export function buildTranscriptUpTo(args: {
  course: Pick<Course, 'script'>;
  targetChapter: number;
  includeFinishedChapters: boolean;
  answers: AnswerItem[];
  safetySelfHarmText: string;
}): { messages: Message[] } {
  const { course, targetChapter, includeFinishedChapters, answers, safetySelfHarmText } = args;
  const msgs: Message[] = [];

  for (let ch = 0; ch < targetChapter; ch++) {
    const chMsgs = course.script[ch]?.messages ?? [];
    const lastMainIdx = (() => {
      for (let i = chMsgs.length - 1; i >= 0; i--) if (chMsgs[i].type === 'main') return i;
      return -1;
    })();

    const until = lastMainIdx > -1 ? lastMainIdx : chMsgs.length;
    for (let i = 0; i < until; i++) msgs.push(chMsgs[i]);

    const answersForChapter = answers.filter((a) => a.chapter === ch);
    answersForChapter.forEach((a) => {
      if (a.text === '__SAFETY_SELF_HARM__') {
        msgs.push({
          id: `resume-safety-${ch}-${msgs.length}`,
          type: 'main',
          speaker: AMY_SPEAKER,
          kind: 'safety-self-harm',
          content: safetySelfHarmText,
        });
      } else {
        msgs.push({
          id: `resume-user-${ch}-${msgs.length}`,
          type: 'user',
          content: a.text,
        });
      }
    });

    if (lastMainIdx > -1 && includeFinishedChapters) msgs.push(chMsgs[lastMainIdx]);
  }

  const currentMsgs = course.script[targetChapter]?.messages ?? [];
  const lastMainIdxCurrent = (() => {
    for (let i = currentMsgs.length - 1; i >= 0; i--) if (currentMsgs[i].type === 'main') return i;
    return -1;
  })();

  const untilCurrent = lastMainIdxCurrent > -1 ? lastMainIdxCurrent : currentMsgs.length;
  for (let i = 0; i < untilCurrent; i++) msgs.push(currentMsgs[i]);

  const answersForCurrent = answers.filter((a) => a.chapter === targetChapter);
  answersForCurrent.forEach((a) => {
    if (a.text === '__SAFETY_SELF_HARM__') {
      msgs.push({
        id: `resume-safety-${targetChapter}-${msgs.length}`,
        type: 'main',
        speaker: AMY_SPEAKER,
        kind: 'safety-self-harm',
        content: safetySelfHarmText,
      });
    } else {
      msgs.push({
        id: `resume-user-${targetChapter}-${msgs.length}`,
        type: 'user',
        content: a.text,
        timestamp: a.timestamp ? new Date(a.timestamp).toLocaleTimeString() : undefined,
      });
    }
  });

  if (answersForCurrent.length > 0 && lastMainIdxCurrent > -1) {
    msgs.push(currentMsgs[lastMainIdxCurrent]);
  }

  return { messages: msgs };
}

export function buildFullTranscript(args: {
  course: Pick<Course, 'script'>;
  answers: AnswerItem[];
  safetySelfHarmText: string;
}): Message[] {
  const { course, answers, safetySelfHarmText } = args;
  const full: Message[] = [];

  for (let ch = 0; ch < course.script.length; ch++) {
    const chMsgs = course.script[ch]?.messages ?? [];
    const lastMainIdx = (() => {
      for (let i = chMsgs.length - 1; i >= 0; i--) if (chMsgs[i].type === 'main') return i;
      return -1;
    })();

    const until = lastMainIdx > -1 ? lastMainIdx : chMsgs.length;
    for (let i = 0; i < until; i++) full.push(chMsgs[i]);

    const answersForChapter = answers.filter((a) => a.chapter === ch);
    answersForChapter.forEach((a) => {
      if (a.text === '__SAFETY_SELF_HARM__') {
        full.push({
          id: `rewatch-safety-${ch}-${full.length}`,
          type: 'main',
          speaker: AMY_SPEAKER,
          kind: 'safety-self-harm',
          content: safetySelfHarmText,
        });
      } else {
        full.push({
          id: `rewatch-user-${ch}-${full.length}`,
          type: 'user',
          content: a.text,
          timestamp: a.timestamp ? new Date(a.timestamp).toLocaleTimeString() : undefined,
        });
      }
    });

    if (lastMainIdx > -1) full.push(chMsgs[lastMainIdx]);
  }

  return full;
}