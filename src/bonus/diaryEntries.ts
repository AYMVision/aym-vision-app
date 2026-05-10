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
  ],

  diary_mia: [
    {
      entryId: 's1e03c02_0004',
      bonusId: 'diary-mia-entry4',
      order: 1,
      dateKey: 'diaries.entries.mia.s1e03c02_0004.date',
      titleKey: 'diaries.entries.mia.s1e03c02_0004.title',
      bodyKey: 'diaries.entries.mia.s1e03c02_0004.body',
      unlock: { afterChapterId: 's1e03c02' },
      decor: { moodEmoji: '🙂', tape: true, marker: true, accent: 'amber' },
    },
    {
      entryId: 's1e03c08_0002',
      bonusId: 'diary-mia-entry2',
      order: 2,
      dateKey: 'diaries.entries.mia.s1e03c08_0002.date',
      titleKey: 'diaries.entries.mia.s1e03c08_0002.title',
      bodyKey: 'diaries.entries.mia.s1e03c08_0002.body',
      unlock: { afterChapterId: 's1e03c08' },
      decor: { moodEmoji: '😤', tape: true, marker: true, accent: 'amber' },
    },
  ],

  diary_jonas: [
    // später…
  ],
    diary_me: [
    // später…
  ],
};
