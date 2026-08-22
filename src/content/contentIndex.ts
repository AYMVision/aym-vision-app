// src/content/contentIndex.ts
import { assetUrl } from '../common/assetUrl';
import type { Message } from '../common/types';
import type { ThemeId } from '../competencies/themeMeta';


export type Lang = 'de' | 'en';

export type EpisodeTopicTag = ThemeId;


export type EpisodeMeta = {
  seasonId: string;
  episodeId: string;
  courseId: string;

  titleKey: string;
  descriptionKey: string;

  coverImage: string;
  stickerImage: string;

  chapterCount: number;

  topicTags?: EpisodeTopicTag[];
 chapterTopicTags?: Partial<Record<number, ThemeId[]>>;

  released?: boolean;
  comingSoon?: boolean;
  order?: number;

  /** 'v2' = StoryV02 engine (/stories-v02/:courseId), default 'v1' = legacy */
  storyEngine?: 'v1' | 'v2';

  previewMessages?: Record<Lang, Message[]>;
};

export type SeasonMeta = {
  seasonId: string;
  seasonTitle: string;
  seasonName?: string;
  badgeImage?: string;
  episodes: EpisodeMeta[];
};

export const CONTENT_INDEX: SeasonMeta[] = [
  {
    seasonId: 's1',
    seasonTitle: 'Staffel 1',
    badgeImage: '/media/stickers/seasons/s1-badge-512.webp',
    episodes: [
      {
        seasonId: 's1',
        episodeId: 's1e01',
        courseId: 's1e01',

        titleKey: 'stories:episodes.s1e01.title',
        descriptionKey: 'stories:episodes.s1e01.description',

        coverImage: '/media/story/episodes/s1e01/s1e01-512.webp',
        stickerImage: '/media/stickers/episodes/s1e01-512.webp',

        chapterCount: 8,
        released: true,
        order: 1,
        storyEngine: 'v2',

        topicTags: [
          'talk-act',
          'reflect-understand',
          'safe-online',
          'info-check',
          'creative',
          'fairness',
          'problem-solving',
        ],

        chapterTopicTags: {
          1: ['talk-act', 'safe-online'],
          2: ['reflect-understand', 'talk-act'],
          3: ['info-check', 'talk-act', 'fairness'],
          4: ['info-check', 'reflect-understand', 'fairness'],
          5: ['talk-act', 'fairness'],
          6: ['info-check', 'talk-act', 'problem-solving', 'safe-online', 'reflect-understand'],
          7: ['info-check', 'reflect-understand', 'fairness'],
          8: ['info-check', 'creative', 'talk-act', 'reflect-understand', 'fairness'],
        },
      },

      {
        seasonId: 's1',
        episodeId: 's1e02',
        courseId: 's1e02',

        titleKey: 'stories:episodes.s1e02.title',
        descriptionKey: 'stories:episodes.s1e02.description',

        coverImage: '/media/story/episodes/s1e02/s1e02-512.webp',
        stickerImage: '/media/stickers/episodes/s1e02-512.webp',

        chapterCount: 10,
        released: true,
        order: 2,
        storyEngine: 'v2',

        topicTags: [
          'talk-act',
          'reflect-understand',
          'safe-online',
          'creative',
          'fairness',
          'problem-solving',
        ],

        chapterTopicTags: {
          1:  ['talk-act', 'fairness'],
          2:  ['talk-act'],
          3:  ['reflect-understand'],
          4:  ['talk-act', 'creative', 'fairness'],
          5:  ['talk-act', 'fairness'],
          6:  ['talk-act', 'creative', 'problem-solving', 'reflect-understand', 'fairness'],
          7:  ['talk-act', 'creative', 'fairness'],
          8:  ['talk-act', 'creative', 'fairness'],
          9:  ['problem-solving', 'fairness'],
          10: ['talk-act', 'safe-online', 'reflect-understand', 'fairness'],
        },
      },

      {
  seasonId: 's1',
  episodeId: 's1e03',
  courseId: 's1e03',

  titleKey: 'stories:episodes.s1e03.title',
  descriptionKey: 'stories:episodes.s1e03.description',

  coverImage: '/media/story/episodes/s1e03/s1e03-512.webp',
  stickerImage: '/media/stickers/episodes/s1e03-512.webp',

  chapterCount: 10,
  released: true,
  order: 3,
  storyEngine: 'v2',

        topicTags: [
          'talk-act',
          'reflect-understand',
          'safe-online',
          'info-check',
          'fairness',
        ],

        chapterTopicTags: {
          1:  ['talk-act', 'reflect-understand', 'safe-online'],
          2:  ['safe-online', 'reflect-understand'],
          3:  ['info-check', 'reflect-understand'],
          4:  ['talk-act', 'safe-online'],
          5:  ['talk-act', 'safe-online', 'reflect-understand', 'fairness'],
          6:  ['safe-online', 'reflect-understand'],
          7:  ['info-check', 'safe-online', 'reflect-understand', 'fairness'],
          8:  ['talk-act', 'safe-online', 'reflect-understand', 'fairness'],
          9:  ['talk-act', 'safe-online', 'fairness'],
          10: ['safe-online', 'reflect-understand', 'fairness'],
        },
},
      {
        seasonId: 's1',
        episodeId: 's1e04',
        courseId: 's1e04',

        titleKey: 'stories:episodes.s1e04.title',
        descriptionKey: 'stories:episodes.s1e04.description',

        coverImage: '/media/story/episodes/s1e04/s1e04-512.webp',
        stickerImage: '/media/stickers/episodes/s1e04-512.webp',

        chapterCount: 10,
        released: true,
        order: 4,
        storyEngine: 'v2',

        topicTags: [
          'talk-act',
          'reflect-understand',
          'info-check',
          'fairness',
        ],

        chapterTopicTags: {
          1:  ['talk-act', 'reflect-understand', 'fairness'],
          2:  ['talk-act', 'reflect-understand'],
          3:  ['reflect-understand', 'fairness'],
          4:  ['reflect-understand'],
          5:  ['talk-act', 'fairness'],
          6:  ['reflect-understand', 'fairness'],
          7:  ['info-check', 'reflect-understand'],
          8:  ['talk-act', 'fairness'],
          9:  ['reflect-understand', 'fairness'],
          10: ['info-check', 'reflect-understand', 'fairness'],
        },
      },

      {
        seasonId: 's1',
        episodeId: 's1e05',
        courseId: 's1e05',

        titleKey: 'stories:episodes.s1e05.title',
        descriptionKey: 'stories:episodes.s1e05.description',

        coverImage: '/media/story/episodes/s1e05/s1e05-512.webp',
        stickerImage: '/media/stickers/episodes/s1e05-512.webp',

        chapterCount: 11,
        released: true,
        order: 5,
        storyEngine: 'v2',

        topicTags: [
          'talk-act',
          'reflect-understand',
          'safe-online',
          'info-check',
          'creative',
          'fairness',
          'problem-solving',
        ],

        chapterTopicTags: {
          1:  ['creative', 'safe-online', 'reflect-understand', 'fairness'],
          2:  ['reflect-understand', 'fairness'],
          3:  ['talk-act', 'problem-solving', 'reflect-understand', 'fairness'],
          4:  ['talk-act', 'safe-online', 'reflect-understand', 'fairness'],
          5:  ['reflect-understand', 'fairness'],
          6:  ['info-check', 'talk-act', 'reflect-understand'],
          7:  ['info-check', 'creative', 'reflect-understand'],
          8:  ['info-check', 'creative', 'reflect-understand', 'fairness'],
          9:  ['info-check', 'fairness'],
          10: ['reflect-understand', 'fairness'],
          11: ['info-check', 'reflect-understand', 'fairness'],
        },
      },
    ],
  },
];

export function coverUrl(ep: EpisodeMeta) {
  return assetUrl(ep.coverImage);
}

export function stickerUrl(ep: EpisodeMeta) {
  return assetUrl(ep.stickerImage);
}

export function badgeUrl(season: SeasonMeta) {
  return season.badgeImage ? assetUrl(season.badgeImage) : null;
}

export function getAllSeasons(): SeasonMeta[] {
  return CONTENT_INDEX;
}

export function getAllEpisodes(): EpisodeMeta[] {
  return CONTENT_INDEX.flatMap((s) => s.episodes);
}

export function getEpisodesBySeason(seasonId: string): EpisodeMeta[] {
  const season = CONTENT_INDEX.find((s) => s.seasonId === seasonId);
  if (!season) return [];
  return [...season.episodes].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

export function getEpisodeMeta(episodeId: string): EpisodeMeta | null {
  for (const s of CONTENT_INDEX) {
    const e = s.episodes.find((ep) => ep.episodeId === episodeId);
    if (e) return e;
  }
  return null;
}

export function getEpisodeMetaByCourseId(courseId: string): EpisodeMeta | null {
  for (const s of CONTENT_INDEX) {
    const e = s.episodes.find((ep) => ep.courseId === courseId);
    if (e) return e;
  }
  return null;
}

export function isReleased(ep: EpisodeMeta): boolean {
  return ep.released !== false;
}

export function getPreviewMessagesByCourseId(courseId: string, lang: Lang): Message[] {
  const ep = getEpisodeMetaByCourseId(courseId);
  return ep?.previewMessages?.[lang] ?? [];
}

export type StoryCardMeta = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  cover: string;
  released: boolean;
  chaptersTotal: number;
  seasonId: string;
  episodeId: string;
  topicTags?: EpisodeTopicTag[];
  storyEngine?: 'v1' | 'v2';
};

export function getStoryCards(): StoryCardMeta[] {
  const eps = getAllEpisodes()
    .slice()
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  return eps.map((ep) => ({
    id: ep.courseId,
    titleKey: ep.titleKey,
    descriptionKey: ep.descriptionKey,
    cover: ep.coverImage,
    released: isReleased(ep),
    chaptersTotal: ep.chapterCount,
    seasonId: ep.seasonId,
    episodeId: ep.episodeId,
    topicTags: ep.topicTags,
    storyEngine: ep.storyEngine,
  }));
}