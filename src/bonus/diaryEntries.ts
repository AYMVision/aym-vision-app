// src/bonus/diaryEntries.ts

export type DiaryId = 'diary_mia' | 'diary_yasmin' | 'diary_jonas' | 'diary_me';

export type DiaryEntry = {
  entryId: string;     // für URL ?entry=...
  bonusId: string;     // ✅ z.B. 'diary-yasmin-entry1' (für unlock/seen)
  order: number;

  dateKey?: string;
  titleKey?: string;
  bodyKey: string;

  unlock: { afterChapterId: string }; // ✅ z.B. 's1e01c03'
  decor?: {
    moodEmoji?: string;
    tape?: boolean;
    marker?: boolean;
    accent?: 'rose' | 'amber' | 'sky' | 'violet';
  };
};

export const DIARY_ENTRIES: Record<DiaryId, DiaryEntry[]> = {
  diary_yasmin: [
    {
      entryId: 's1e01c01_0001',
      bonusId: 'diary-yasmin-entry1',
      order: 1,
      dateKey: 'diaries.entries.yasmin.s1e01c01_0001.date',
      titleKey: 'diaries.entries.yasmin.s1e01c01_0001.title',
      bodyKey: 'diaries.entries.yasmin.s1e01c01_0001.body',
      unlock: { afterChapterId: 's1e01c01' },
      decor: { moodEmoji: '😤', tape: true, marker: true, accent: 'rose' },
    },
    {
      entryId: 's1e01c08_0002',
      bonusId: 'diary-yasmin-entry2',
      order: 2,
      dateKey: 'diaries.entries.yasmin.s1e01c08_0002.date',
      titleKey: 'diaries.entries.yasmin.s1e01c08_0002.title',
      bodyKey: 'diaries.entries.yasmin.s1e01c08_0002.body',
      unlock: { afterChapterId: 's1e01c08' },
      decor: { moodEmoji: '🫣', tape: true, marker: true, accent: 'rose' },
    },
    {
      entryId: 's1e02c02_0003',
      bonusId: 'diary-yasmin-entry3',
      order: 3,
      dateKey: 'diaries.entries.yasmin.s1e02c02_0003.date',
      titleKey: 'diaries.entries.yasmin.s1e02c02_0003.title',
      bodyKey: 'diaries.entries.yasmin.s1e02c02_0003.body',
      unlock: { afterChapterId: 's1e02c02' },
      decor: { moodEmoji: '✨', tape: true, marker: true, accent: 'rose' },
    },
    {
      entryId: 's1e05c10_0004',
      bonusId: 'diary-yasmin-entry4',
      order: 4,
      dateKey: 'diaries.entries.yasmin.s1e05c10_0004.date',
      bodyKey: 'diaries.entries.yasmin.s1e05c10_0004.body',
      unlock: { afterChapterId: 's1e05c10' },
      decor: { moodEmoji: '😤', tape: true, marker: true, accent: 'rose' },
    },
  ],

  diary_mia: [
    {
      entryId: 's1e03c02_0005',
      bonusId: 'diary-mia-entry1',
      order: 1,
      dateKey: 'diaries.entries.mia.s1e03c02_0005.date',
      bodyKey: 'diaries.entries.mia.s1e03c02_0005.body',
      unlock: { afterChapterId: 's1e03c02' },
      decor: { moodEmoji: '😶', tape: true, marker: true, accent: 'amber' },
    },
    {
      entryId: 's1e03c08_0006',
      bonusId: 'diary-mia-entry2',
      order: 2,
      dateKey: 'diaries.entries.mia.s1e03c08_0006.date',
      bodyKey: 'diaries.entries.mia.s1e03c08_0006.body',
      unlock: { afterChapterId: 's1e03c08' },
      decor: { moodEmoji: '😫', tape: true, marker: true, accent: 'amber' },
    },
  ],

  diary_jonas: [
    {
      entryId: 's1e04c04_0001',
      bonusId: 'diary-jonas-entry1',
      order: 1,
      dateKey: 'diaries.entries.jonas.s1e04c04_0001.date',
      titleKey: 'diaries.entries.jonas.s1e04c04_0001.title',
      bodyKey: 'diaries.entries.jonas.s1e04c04_0001.body',
      unlock: { afterChapterId: 's1e04c04' },
      decor: { moodEmoji: '💭', tape: true, marker: true, accent: 'sky' },
    },
    {
      entryId: 's1e04c07_0002',
      bonusId: 'diary-jonas-entry2',
      order: 2,
      dateKey: 'diaries.entries.jonas.s1e04c07_0002.date',
      titleKey: 'diaries.entries.jonas.s1e04c07_0002.title',
      bodyKey: 'diaries.entries.jonas.s1e04c07_0002.body',
      unlock: { afterChapterId: 's1e04c07' },
      decor: { moodEmoji: '😔', tape: true, marker: true, accent: 'sky' },
    },
    {
      entryId: 's1e05c09_0003',
      bonusId: 'diary-jonas-entry3',
      order: 3,
      dateKey: 'diaries.entries.jonas.s1e05c09_0003.date',
      titleKey: 'diaries.entries.jonas.s1e05c09_0003.title',
      bodyKey: 'diaries.entries.jonas.s1e05c09_0003.body',
      unlock: { afterChapterId: 's1e05c09' },
      decor: { moodEmoji: '😳', tape: true, marker: true, accent: 'sky' },
    },
  ],
    diary_me: [
    // später…
  ],
};
