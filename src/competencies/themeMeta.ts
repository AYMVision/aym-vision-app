// src/competencies/themeMeta.ts

export type ThemeId =
  | 'info-check'
  | 'talk-act'
  | 'creative'
  | 'safe-online'
  | 'problem-solving'
  | 'reflect-understand'
  | 'fairness';

export type ThemeMetaItem = {
  id: ThemeId;
  emoji: string;
  childLabelKey: string;
  parentLabelKey: string;
  childShortKey?: string;
  parentShortKey?: string;
};

export const THEME_META: Record<ThemeId, ThemeMetaItem> = {
  'info-check': {
    id: 'info-check',
    emoji: '🕵️',
    childLabelKey: 'themes.infoCheck.child',
    parentLabelKey: 'themes.infoCheck.parent',
    childShortKey: 'themes.infoCheck.short',
    parentShortKey: 'themes.infoCheck.parentShort',
  },
  'talk-act': {
    id: 'talk-act',
    emoji: '🤝',
    childLabelKey: 'themes.talkAct.child',
    parentLabelKey: 'themes.talkAct.parent',
    childShortKey: 'themes.talkAct.short',
    parentShortKey: 'themes.talkAct.parentShort',
  },
  'creative': {
    id: 'creative',
    emoji: '🎨',
    childLabelKey: 'themes.creative.child',
    parentLabelKey: 'themes.creative.parent',
    childShortKey: 'themes.creative.short',
    parentShortKey: 'themes.creative.parentShort',
  },
  'safe-online': {
    id: 'safe-online',
    emoji: '🛡️',
    childLabelKey: 'themes.safeOnline.child',
    parentLabelKey: 'themes.safeOnline.parent',
    childShortKey: 'themes.safeOnline.short',
    parentShortKey: 'themes.safeOnline.parentShort',
  },
  'problem-solving': {
    id: 'problem-solving',
    emoji: '🧩',
    childLabelKey: 'themes.problemSolving.child',
    parentLabelKey: 'themes.problemSolving.parent',
    childShortKey: 'themes.problemSolving.short',
    parentShortKey: 'themes.problemSolving.parentShort',
  },
  'reflect-understand': {
    id: 'reflect-understand',
    emoji: '🔍',
    childLabelKey: 'themes.reflectUnderstand.child',
    parentLabelKey: 'themes.reflectUnderstand.parent',
    childShortKey: 'themes.reflectUnderstand.short',
    parentShortKey: 'themes.reflectUnderstand.parentShort',
  },
  'fairness': {
    id: 'fairness',
    emoji: '⚖️',
    childLabelKey: 'themes.fairness.child',
    parentLabelKey: 'themes.fairness.parent',
    childShortKey: 'themes.fairness.short',
    parentShortKey: 'themes.fairness.parentShort',
  },
};

export const THEME_ORDER: ThemeId[] = [
  'info-check',
  'talk-act',
  'creative',
  'safe-online',
  'problem-solving',
  'reflect-understand',
  'fairness',
];