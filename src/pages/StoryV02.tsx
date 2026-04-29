// src/pages/StoryV02.tsx

import { useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Layout from '../components/Layout';
import Phone from '../components/Phone';
import ChatMessage from '../components/ChatMessage';

import { useProfile } from '../profile/useProfile';
import { getEpisodeMetaByCourseId } from '../content/contentIndex';
import { unlockBonusById } from '../bonus/unlockBonusById';
import { hasCompletedChapter } from '../progress/storyProgress';

import { getPlayableEpisodeV02 } from '../story-v02/content/getPlayableEpisodeV02';
import type { StoryEpisodeV02 } from '../story-v02/types/storyTypes';
import type {
  ItemOptionReaction,
  ReflectionChoiceReaction,
  StoryChapterV02,
  StoryStep,
} from '../story-v02/types/storyTypes';
import type {
  StoryRuntimeState,
  StorySessionSnapshot,
  TranscriptEntry,
} from '../story-v02/types/storyRuntimeTypes';
import { storyRuntimeReducer } from '../story-v02/runtime/storyRuntimeReducer';
import {
  clearStorySessionSnapshot,
  loadStorySessionSnapshot,
  saveStorySessionSnapshot,
} from '../story-v02/runtime/storySessionSnapshotStore';
import {
  saveChallengeStatus,
  saveInputResponse,
  saveItemResponse,
  saveReflectionResponse,
} from '../story-v02/runtime/storyResponseStore';
import { markTopicsSeen } from '../story-v02/runtime/storyTopicStore';
import { completeStoryV02Chapter } from '../story-v02/runtime/storyCompletionBridge';

import { STORY_CHARACTERS as characters } from '../content/characters';
import InputStepCard from '../story-v02/components/InputStepCard';
import ItemStepCard from '../story-v02/components/ItemStepCard';
import MultiSelectItemCard from '../story-v02/components/MultiSelectItemCard';
import CompletedMultiSelectItemCard from '../story-v02/components/CompletedMultiSelectItemCard';
import AmyFeedbackStepCard from '../story-v02/components/AmyFeedbackStepCard';
import ReflectionStepCard from '../story-v02/components/ReflectionStepCard';
import AmyReactionStepCard from '../story-v02/components/AmyReactionStepCard';
import ChallengeStepCard from '../story-v02/components/ChallengeStepCard';
import { getNextChapterGateState, getHighestPlayableChapterIndex0 } from '../gating/storyGateHelpers';
import UnlockedToast from '../components/UnlockedToast';
import { useRewardFx } from '../progress/rewardFx';
import { getStickerById } from '../progress/rewardCatalog';
import { assetUrl } from '../common/assetUrl';
import { playEpisodeSound } from '../common/soundPlayer';
import EpisodeSummaryCard from '../story-v02/components/EpisodeSummaryCard';

type SceneTone = 'private' | 'class' | 'newsroom';
type Lang = 'de' | 'en';

const FALLBACK_STATE: StoryRuntimeState = {
  courseId: '',
  chapterId: '',
  chapterIndex0: 0,
  stepIndex0: 0,
  phase: 'chapter_finished',
  transcript: [],
  completedStepIds: [],
  activeStepId: undefined,
  storyCursor: undefined,
  inputDraft: '',
  reflectionDraft: '',
};

function resolveItemReactionLines(
  reaction: ItemOptionReaction | undefined,
  t: (key: string, options?: any) => string
): string[] {
  if (!reaction) return [];

  if (reaction.kind === 'static_text') {
    return [reaction.text ?? t(reaction.textKey ?? '', { defaultValue: '' })];
  }

  return reaction.segments.map(
    (segment) => segment.text ?? t(segment.textKey ?? '', { defaultValue: '' })
  );
}

function resolveReflectionReactionLines(
  reaction: ReflectionChoiceReaction | undefined,
  t: (key: string, options?: any) => string
): string[] {
  if (!reaction) return [];

  if (reaction.kind === 'static_text') {
    return [reaction.text ?? t(reaction.textKey ?? '', { defaultValue: '' })];
  }

  return reaction.segments.map(
    (segment) => segment.text ?? t(segment.textKey ?? '', { defaultValue: '' })
  );
}

function findAmyFeedbackLines(
  transcript: TranscriptEntry[],
  sourceStepId: string
): string[] {
  const match = transcript.find(
    (entry): entry is Extract<TranscriptEntry, { kind: 'amy_feedback' }> =>
      entry.kind === 'amy_feedback' && entry.stepId === sourceStepId
  );

  return match?.lines ?? [];
}

function findAmyReactionLines(
  transcript: TranscriptEntry[],
  sourceStepId: string
): string[] {
  const match = transcript.find(
    (entry): entry is Extract<TranscriptEntry, { kind: 'amy_reaction' }> =>
      entry.kind === 'amy_reaction' && entry.stepId === sourceStepId
  );

  return match?.lines ?? [];
}

function findLatestSceneMessage(
  transcript: TranscriptEntry[]
): Extract<TranscriptEntry, { kind: 'message' }>['message'] | null {
  const messages = transcript.filter(
    (entry): entry is Extract<TranscriptEntry, { kind: 'message' }> =>
      entry.kind === 'message'
  );

  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const msg = messages[i].message;
    if (msg.kind === 'chat-switch' && msg.scene) {
      return msg;
    }
  }

  return null;
}

type ChapterDividerMeta = {
  id: string;
  title: string;
  subtitle?: string;
};

type TranscriptGroup = {
  key: string;
  tone: SceneTone;
  labelKey: string;
  title: string;
  participants: string[];
  items: TranscriptEntry[];
  chapterDivider?: ChapterDividerMeta;
};

function toneToBg(tone: SceneTone) {
  switch (tone) {
    case 'class':
      return 'chat-bg-class';
    case 'newsroom':
      return 'chat-bg-newsroom';
    default:
      return 'chat-bg-private';
  }
}

function buildTranscriptGroups(transcript: TranscriptEntry[]): TranscriptGroup[] {
  const groups: TranscriptGroup[] = [];

  let currentTone: SceneTone = 'private';
  let currentLabelKey = 'stories:chatSwitch.private';
  let currentTitle = '';
  let currentParticipants: string[] = [];
  let pendingChapterDivider: ChapterDividerMeta | null = null;

  const ensureGroup = () => {
    if (groups.length === 0) {
      groups.push({
        key: 'group-0',
        tone: currentTone,
        labelKey: currentLabelKey,
        title: currentTitle,
        participants: currentParticipants,
        items: [],
      });
    }
  };

  for (const entry of transcript) {
    if (entry.kind === 'message') {
      const msg = entry.message;

      if (msg.kind === 'chapter-divider') {
        pendingChapterDivider = {
          id: entry.id,
          title: msg.chapterMeta?.title ?? msg.content ?? '',
          subtitle: msg.chapterMeta?.subtitle,
        };
        continue;
      }

      if (msg.kind === 'chat-switch' && msg.scene) {
        currentTone = msg.scene.tone;
        currentLabelKey = msg.scene.labelKey ?? 'stories:chatSwitch.private';
        currentTitle = msg.scene.title ?? '';
        currentParticipants = msg.scene.participants?.map((p) => p.name) ?? [];

        groups.push({
          key: entry.id,
          tone: currentTone,
          labelKey: currentLabelKey,
          title: currentTitle,
          participants: currentParticipants,
          items: [],
          chapterDivider: pendingChapterDivider ?? undefined,
        });
        pendingChapterDivider = null;
        continue;
      }
    }

    ensureGroup();
    groups[groups.length - 1].items.push(entry);
  }

  return groups;
}

function snapshotMatchesCourseId(
  snap: StorySessionSnapshot | null,
  courseId: string
): boolean {
  if (!snap) return true;

  if (snap.courseId !== courseId) return false;

  if (snap.chapterId && !snap.chapterId.startsWith(courseId)) {
    return false;
  }

  for (const entry of snap.transcript) {
    if (entry.kind === 'message') {
      const messageId = entry.message?.id ?? '';
      if (messageId && !messageId.startsWith(courseId) && !messageId.includes(`${courseId}-`)) {
        if (
          !messageId.includes('chapter-divider') &&
          !messageId.includes('episode-summary')
        ) {
          return false;
        }
      }
      continue;
    }

    if ('stepId' in entry && entry.stepId && !entry.stepId.startsWith(courseId)) {
      return false;
    }
  }

  return true;
}

// Speichert Scrollpositionen pro location.key — überlebt Remounts, nicht Page-Reloads
const storyScrollPositions = new Map<string, number>();

export default function StoryV02() {
  const { courseId } = useParams();
  console.log('[V02] route courseId =', courseId);
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { profile, updateProfile } = useProfile();

  const lang: Lang =
    (i18n.resolvedLanguage ?? i18n.language).startsWith('en') ? 'en' : 'de';

  const episodeMeta = useMemo(() => {
    if (!courseId) return null;
    return getEpisodeMetaByCourseId(courseId);
  }, [courseId]);

  const [episode, setEpisode] = useState<StoryEpisodeV02 | null>(null);
  useEffect(() => {
    if (!courseId) { setEpisode(null); return; }
    getPlayableEpisodeV02(courseId, lang).then(ep => {
      setEpisode(ep);
      if (import.meta.env.DEV) {
        console.log('[V02] loaded episode', {
          routeCourseId: courseId,
          episodeId: ep?.id,
          episodeCourseId: ep?.courseId,
          firstChapterId: ep?.chapters?.[0]?.id,
        });
      }
    });
  }, [courseId, lang]);

  const [state, dispatch] = useReducer(storyRuntimeReducer, FALLBACK_STATE);

  const chapterIndex0 = state.chapterIndex0 ?? 0;

  const chapter: StoryChapterV02 | null = episode
    ? episode.chapters[chapterIndex0] ?? null
    : null;

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const completionHandledRef = useRef<Record<string, true>>({});
  const restoredAsFinishedRef = useRef(false);

  const restoreScrollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingReturnScrollRef = useRef<number | null>(null);

  const courseIdRef = useRef(courseId);
  courseIdRef.current = courseId;

  const [showNextChapterLockedHint, setShowNextChapterLockedHint] = useState(false);
  const [nextChapterLockedReason, setNextChapterLockedReason] = useState<
    'daily_limit' | 'weekly_limit' | null
  >(null);
  const [dismissedNextChapterLockedHint, setDismissedNextChapterLockedHint] =
    useState(false);

  const [unlockedToast, setUnlockedToast] = useState<{
    title: string;
    subtitle?: string;
    linkTo?: string;
  } | null>(null);

  // Belohnungen warten bis der letzte Chapter-Eintrag sichtbar ist (IntersectionObserver)
  const [pendingChapterRewards, setPendingChapterRewards] = useState<{
    lastEntryId: string;
    coinAwarded: boolean;
    themeStickerIds: string[];
    milestoneStickerIds: string[];
    starterStickerAwarded: boolean;
    weeklyBadgeAwarded: boolean;
  } | null>(null);

  const { flyStickerFromRect, flyCoinFromRect } = useRewardFx();

  function restoreScrollToValue(target: number) {
    pendingReturnScrollRef.current = target;

    if (restoreScrollTimerRef.current != null) {
      clearInterval(restoreScrollTimerRef.current);
      restoreScrollTimerRef.current = null;
    }

    let tries = 0;
    const maxTries = 160;

    const apply = () => {
      tries += 1;

      const el = scrollRef.current;
      const wanted = pendingReturnScrollRef.current;

      if (!el || wanted == null) {
        if (restoreScrollTimerRef.current != null) {
          clearInterval(restoreScrollTimerRef.current);
          restoreScrollTimerRef.current = null;
        }
        return;
      }

      const maxScrollable = Math.max(0, el.scrollHeight - el.clientHeight);
      const clamped = Math.min(wanted, maxScrollable);

      el.scrollTop = clamped;

      const closeEnough = Math.abs(el.scrollTop - clamped) < 4;
      // Only stop early when content is actually tall enough to reach the wanted position.
      // If content hasn't rendered yet, maxScrollable is near 0 — keep retrying.
      const contentReady = maxScrollable >= wanted - 8;

      if ((closeEnough && contentReady) || tries >= maxTries) {
        if (restoreScrollTimerRef.current != null) {
          clearInterval(restoreScrollTimerRef.current);
          restoreScrollTimerRef.current = null;
        }
      }
    };

    apply();
    restoreScrollTimerRef.current = setInterval(apply, 50);
  }

  const STORY_V02_MIGRATION_KEY = 'story-v02-migrations';

function loadStoryMigrations(): Record<string, true> {
  try {
    const raw = localStorage.getItem(STORY_V02_MIGRATION_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function saveStoryMigrationDone(key: string) {
  try {
    const current = loadStoryMigrations();
    current[key] = true;
    localStorage.setItem(STORY_V02_MIGRATION_KEY, JSON.stringify(current));
  } catch {
    // ignore
  }
}

function hasStoryMigrationDone(key: string): boolean {
  const current = loadStoryMigrations();
  return !!current[key];
}

  // Scrollposition pro location.key speichern (beim Scrollen)
  // Zusätzlich in sessionStorage per courseId — überlebt neue Navigationen ("Weiter"-Button)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const key = location.key;
    const ssKey = courseId ? `aym_story_scroll_${courseId}` : null;

    const onScroll = () => {
      const top = el.scrollTop;
      storyScrollPositions.set(key, top);
      if (ssKey && top > 0) {
        try { sessionStorage.setItem(ssKey, String(top)); } catch { /* ignore */ }
        try { localStorage.setItem(ssKey, String(top)); } catch { /* ignore */ }
      }
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [location.key, courseId]);

  // Interval aufräumen wenn Komponente unmountet
  useLayoutEffect(() => {
    return () => {
      if (restoreScrollTimerRef.current != null) {
        clearInterval(restoreScrollTimerRef.current);
        restoreScrollTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!courseId || !episodeMeta || !episode) return;

    const scope = {
      seasonId: episodeMeta.seasonId,
      episodeId: episodeMeta.episodeId,
      courseId,
    };

    const migrationKey = `reset-bad-snapshot-${courseId}`;
    const shouldResetThisEpisodeOnce =
      courseId === 's1e02' && !hasStoryMigrationDone(migrationKey);

    if (shouldResetThisEpisodeOnce) {
      clearStorySessionSnapshot(scope);
      saveStoryMigrationDone(migrationKey);
    }

    const snap = loadStorySessionSnapshot(scope);

    if (snap) {
      restoredAsFinishedRef.current = snap.phase === 'chapter_finished';

      // Bonus-Marker für bereits abgeschlossene Story-Steps neu setzen.
      // Nötig wenn localStorage gecleart wurde aber der Session-Snapshot noch existiert:
      // completedStepIds enthält den Step, aber der Marker ist weg → Karte wirkt locked.
      if (snap.completedStepIds.length > 0) {
        for (const chapter of episode.chapters) {
          for (const step of chapter.steps) {
            if (!snap.completedStepIds.includes(step.id)) continue;
            if (step.type !== 'story') continue;
            for (const message of step.messages) {
              if (message.type === 'system' && message.kind === 'bonus-link' && message.bonusId) {
                unlockBonusById(message.bonusId);
              }
            }
          }
        }
      }

      dispatch({
        type: 'RESTORE_SNAPSHOT',
        payload: snap,
      });

      if (snap.phase === 'chapter_finished') {
        const gateState = getNextChapterGateState({
          courseId,
          course: { script: episode.chapters },
          currentChapterIndex0: snap.chapterIndex0,
          bypassAll: false,
          maxPerWeek: 5,
        });

        if (gateState.hasNext && gateState.structuralAllowed && gateState.timeAllowed) {
          const nextChapter = episode.chapters[gateState.nextChapterIndex0] ?? null;

          if (nextChapter) {
            restoredAsFinishedRef.current = false;

            dispatch({
              type: 'APPEND_STORY_MESSAGE',
              payload: {
                message: {
                  id: `${courseId}-${nextChapter.id}-chapter-divider`,
                  type: 'system',
                  kind: 'chapter-divider',
                  content:
                    nextChapter.chapterTitle ??
                    `Kapitel ${nextChapter.chapterIndex0 + 1}`,
                  chapterMeta: {
                    title:
                      nextChapter.chapterTitle ??
                      `Kapitel ${nextChapter.chapterIndex0 + 1}`,
                    subtitle: nextChapter.chapterSubtitle,
                  },
                  timestamp: '',
                },
              },
            });

            dispatch({
              type: 'ADVANCE_TO_CHAPTER',
              payload: {
                courseId,
                chapter: nextChapter,
              },
            });

            return;
          }
        }

        if (gateState.hasNext && !gateState.timeAllowed && gateState.shouldShowLockedHint) {
          setShowNextChapterLockedHint(true);
          setNextChapterLockedReason(
            gateState.blockedReason === 'daily_limit' ||
              gateState.blockedReason === 'weekly_limit'
              ? gateState.blockedReason
              : null
          );
          setDismissedNextChapterLockedHint(false);
        }
      }

      return;
    }

    // Kein Snapshot vorhanden — Startposition aus gespeichertem Fortschritt lesen.
    // Ohne diesen Fix würde nach einem Browser-Neustart immer Kapitel 0 gestartet,
    // obwohl unlockedEpisode in localStorage bereits weiter ist.
    const highestPlayable = getHighestPlayableChapterIndex0(courseId ?? undefined);
    const startIndex = Math.min(highestPlayable, episode.chapters.length - 1);
    const startChapter = episode.chapters[startIndex] ?? null;
    if (!startChapter) return;

    dispatch({
      type: 'START_CHAPTER',
      payload: {
        courseId,
        chapter: startChapter,
      },
    });
  }, [courseId, episodeMeta, episode]);

  useEffect(() => {
    if (!courseId || !episodeMeta) return;
    if (!state.courseId || !state.chapterId) return;

    saveStorySessionSnapshot(
      {
        seasonId: episodeMeta.seasonId,
        episodeId: episodeMeta.episodeId,
        courseId,
      },
      {
        courseId: state.courseId,
        chapterId: state.chapterId,
        chapterIndex0: state.chapterIndex0,
        stepIndex0: state.stepIndex0,
        phase: state.phase,
        storyCursor: state.storyCursor,
        transcript: state.transcript,
        completedStepIds: state.completedStepIds,
        activeStepId: state.activeStepId,
      }
    );
  }, [state, courseId, episodeMeta]);

  const currentStep: StoryStep | null = useMemo(() => {
    if (!chapter) return null;
    return chapter.steps[state.stepIndex0] ?? null;
  }, [chapter, state.stepIndex0]);

  // Scrollposition wiederherstellen wenn location.key wechselt
  // (Modal schließt, Vollnavigation zurück, oder "Weiter"-Button)
  useLayoutEffect(() => {
    const saved = storyScrollPositions.get(location.key);
    if (typeof saved === 'number' && saved > 0) {
      restoreScrollToValue(saved);
      return;
    }
    // Fallback: sessionStorage → localStorage per courseId (überlebt iOS-Tab-Suspension)
    if (courseId) {
      try {
        const ssKey = `aym_story_scroll_${courseId}`;
        const rawSS = sessionStorage.getItem(ssKey);
        const rawLS = localStorage.getItem(ssKey);
        const fromStorage = rawSS ? Number(rawSS) : rawLS ? Number(rawLS) : 0;
        if (fromStorage > 0) restoreScrollToValue(fromStorage);
      } catch { /* ignore */ }
    }
  }, [location.key, courseId]);

  // IntersectionObserver: Coin + Theme-Sticker fliegen wenn der letzte Chapter-Eintrag sichtbar wird
  useEffect(() => {
    if (!pendingChapterRewards) return;
    const { lastEntryId, coinAwarded, themeStickerIds, milestoneStickerIds, starterStickerAwarded, weeklyBadgeAwarded } = pendingChapterRewards;

    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const targetEl = scrollEl.querySelector(`[data-story-entry-id="${CSS.escape(lastEntryId)}"]`);
    if (!targetEl) {
      // Element nicht im DOM (sollte nicht vorkommen) — direkt auslösen
      if (coinAwarded) flyCoinFromRect(new DOMRect(window.innerWidth / 2 - 24, window.innerHeight * 0.7, 48, 48));
      setPendingChapterRewards(null);
      return;
    }

    const fire = (el: Element) => {
      const rect = el.getBoundingClientRect();
      // from: Mitte des letzten sichtbaren Eintrags
      const from = new DOMRect(
        rect.left + rect.width / 2 - 24,
        rect.top + rect.height / 2 - 24,
        48, 48
      );
      if (coinAwarded) flyCoinFromRect(from);

      let nextDelay = 200;
      themeStickerIds.forEach((stickerId, idx) => {
        const def = getStickerById(stickerId);
        if (!def?.image) return;
        setTimeout(() => flyStickerFromRect(from, assetUrl(def.image!), { durationMs: 2800 }), nextDelay + idx * 700);
      });
      nextDelay += themeStickerIds.length * 700;

      milestoneStickerIds.forEach((stickerId) => {
        const def = getStickerById(stickerId);
        if (!def?.image) return;
        setTimeout(() => flyStickerFromRect(from, assetUrl(def.image!), { durationMs: 2800 }), nextDelay);
        nextDelay += 700;
      });

      if (starterStickerAwarded) {
        setTimeout(
          () => flyStickerFromRect(from, assetUrl('media/stickers/milestones/chapters-5-512.webp'), { durationMs: 2800 }),
          nextDelay
        );
        nextDelay += 700;
      }
      if (weeklyBadgeAwarded) {
        setTimeout(
          () => flyStickerFromRect(from, assetUrl('media/stickers/streaks/streak-5-512.webp'), { durationMs: 2800 }),
          nextDelay
        );
      }

      setPendingChapterRewards(null);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          fire(entry.target);
        }
      },
      { root: scrollEl, threshold: 0 }
    );
    observer.observe(targetEl);
    return () => observer.disconnect();
  }, [pendingChapterRewards, flyCoinFromRect, flyStickerFromRect]);

  useEffect(() => {
    if (!courseId || !chapter || !currentStep) return;
    if (state.courseId !== courseId) return;
    if (currentStep.type !== 'amy_reaction') return;
    if (state.completedStepIds.includes(currentStep.id)) return;

    const lines = findAmyReactionLines(state.transcript, currentStep.sourceStepId);
    if (lines.length > 0) return;

    dispatch({ type: 'COMPLETE_STORY_STEP', payload: { step: currentStep } });
    dispatch({ type: 'GO_TO_NEXT_STEP', payload: { chapter } });
  }, [currentStep, state.completedStepIds, state.transcript, chapter, courseId, state.courseId]);

  useEffect(() => {
    if (!courseId || !chapter || !currentStep) return;
    if (state.courseId !== courseId) return;
    if (currentStep.type !== 'challenge') return;
    if (state.completedStepIds.includes(currentStep.id)) return;

    const challengeText =
      currentStep.prompt ?? t(currentStep.promptKey ?? '', { defaultValue: '' });

    saveChallengeStatus({
      challengeId: currentStep.id,
      courseId,
      chapterId: chapter.id,
      chapterIndex0: chapter.chapterIndex0,
      seen: true,
      timestamp: new Date().toISOString(),
    });

    markTopicsSeen({
      topicIds: currentStep.topicIds ?? [],
      courseId,
      chapterId: chapter.id,
      chapterIndex0: chapter.chapterIndex0,
      stepId: currentStep.id,
    });

    dispatch({
      type: 'SHOW_CHALLENGE',
      payload: { stepId: currentStep.id, text: challengeText },
    });

    dispatch({
      type: 'GO_TO_NEXT_STEP',
      payload: { chapter },
    });
  }, [currentStep, state.completedStepIds, chapter, courseId, state.courseId, t]);

  useEffect(() => {
    if (!courseId || !chapter || !currentStep) return;
    if (state.courseId !== courseId) return;

    if (currentStep.type !== 'story') return;
    if (state.completedStepIds.includes(currentStep.id)) return;

    for (const message of currentStep.messages) {
      dispatch({
        type: 'APPEND_STORY_MESSAGE',
        payload: { message },
      });

      if (message.type === 'system' && message.kind === 'bonus-link' && message.bonusId) {
        unlockBonusById(message.bonusId);
      }
    }

    markTopicsSeen({
      topicIds: currentStep.topicIds ?? [],
      courseId,
      chapterId: chapter.id,
      chapterIndex0: chapter.chapterIndex0,
      stepId: currentStep.id,
    });

    dispatch({
      type: 'COMPLETE_STORY_STEP',
      payload: { step: currentStep },
    });

    dispatch({
      type: 'GO_TO_NEXT_STEP',
      payload: { chapter },
    });
  }, [currentStep, state.completedStepIds, chapter, courseId, state.courseId]);

  useEffect(() => {
    if (!courseId || !episodeMeta || !chapter) return;
    if (state.phase !== 'chapter_finished') return;
    if (!state.courseId) return;
    if (restoredAsFinishedRef.current) return;
    if ((chapter.steps?.length ?? 0) === 0) return;

    const completionKey = `${courseId}:${chapter.id}`;
    if (completionHandledRef.current[completionKey]) return;
    completionHandledRef.current[completionKey] = true;

    const wasAlreadyCompletedBeforeAnswer = hasCompletedChapter(
      courseId,
      chapter.chapterIndex0
    );

    const result = completeStoryV02Chapter({
      courseId,
      chapterIndex0: chapter.chapterIndex0,
      chapterCount: episode?.chapters.length ?? 1,
      episodeMeta,
      updateProfile,
      wasAlreadyCompletedBeforeAnswer,
      isEpilogue: chapter.isEpilogue ?? false,
      enableDebug: import.meta.env.DEV,
    });

    if (!wasAlreadyCompletedBeforeAnswer && result.newlyUnlockedCardIds?.length > 0) {
      setUnlockedToast({
        title: 'Neuer Freundebucheintrag ✨',
        subtitle: 'Du hast etwas freigeschaltet. Dein Freundebuch findest du im Profil.',
        linkTo: `/cards/${result.newlyUnlockedCardIds[0]}`,
      });
    }

    // Fallback-Startpunkt für Episode-End-Animationen
    const flyFromRect = new DOMRect(
      window.innerWidth / 2 - 24,
      window.innerHeight * 0.68,
      48, 48
    );

    // ID des letzten sichtbaren Transcript-Eintrags — Observer wartet bis er im Viewport ist
    const lastVisibleEntryId = (() => {
      for (let i = state.transcript.length - 1; i >= 0; i--) {
        const e = state.transcript[i];
        if (e.kind === 'message') {
          const { kind: msgKind } = (e as any).message ?? {};
          if (msgKind === 'chat-switch' || msgKind === 'chapter-divider') continue;
        }
        return e.id;
      }
      return null;
    })();

    const gateState = getNextChapterGateState({
      courseId,
      course: episode
        ? {
            script: episode.chapters,
          }
        : null,
      currentChapterIndex0: chapter.chapterIndex0,
      bypassAll: false,
      maxPerWeek: 5,
    });

    if (!gateState.hasNext) {
      setShowNextChapterLockedHint(false);
      setNextChapterLockedReason(null);
      setDismissedNextChapterLockedHint(false);

      if (!wasAlreadyCompletedBeforeAnswer) {
        // Episodensticker fliegt zum Profilbild
        if (result.stickerAwarded && episodeMeta.stickerImage) {
          const stickerSrc = assetUrl(episodeMeta.stickerImage);
          setTimeout(() => {
            flyStickerFromRect(flyFromRect, stickerSrc, { durationMs: 3000 });
          }, 500);
        }

        // +5 Bonus-Coins fliegen gestaffelt zur Geldbörse
        if (result.episodeBonusAwarded) {
          for (let i = 0; i < 5; i++) {
            setTimeout(() => flyCoinFromRect(flyFromRect), 700 + i * 220);
          }
        }

        // Besondere Ereignis-Sticker fliegen nach den Coins
        let specialStickerDelay = result.episodeBonusAwarded ? 1800 : 900;
        if (result.starterStickerAwarded) {
          setTimeout(() => {
            flyStickerFromRect(flyFromRect, assetUrl('media/stickers/milestones/chapters-5-512.webp'), { durationMs: 2800 });
          }, specialStickerDelay);
          specialStickerDelay += 700;
        }
        if (result.weeklyBadgeAwarded) {
          setTimeout(() => {
            flyStickerFromRect(flyFromRect, assetUrl('media/stickers/streaks/streak-5-512.webp'), { durationMs: 2800 });
          }, specialStickerDelay);
          specialStickerDelay += 700;
        }
        result.newMilestoneStickerIds.forEach((stickerId) => {
          const def = getStickerById(stickerId);
          if (!def?.image) return;
          setTimeout(() => {
            flyStickerFromRect(flyFromRect, assetUrl(def.image!), { durationMs: 2800 });
          }, specialStickerDelay);
          specialStickerDelay += 700;
        });

        // Abschluss-Karte direkt im Messenger erscheint nach den Animationen
        const summaryId = `episode-summary-${courseId}`;
        setTimeout(() => {
          playEpisodeSound(profile.soundEnabled !== false);
          dispatch({
            type: 'ADD_EPISODE_SUMMARY',
            payload: {
              id: summaryId,
              courseId,
              bonusCoins: result.episodeBonusAwarded ? 5 : 0,
              stickerAwarded: result.stickerAwarded,
            },
          });
        }, 1400);
      }
      return;
    }

    if (!gateState.structuralAllowed) {
      setShowNextChapterLockedHint(false);
      setNextChapterLockedReason(null);
      setDismissedNextChapterLockedHint(false);
      if (!wasAlreadyCompletedBeforeAnswer && lastVisibleEntryId) {
        setPendingChapterRewards({ lastEntryId: lastVisibleEntryId, coinAwarded: result.coinAwarded, themeStickerIds: result.newThemeStickerIds, milestoneStickerIds: result.newMilestoneStickerIds, starterStickerAwarded: result.starterStickerAwarded, weeklyBadgeAwarded: result.weeklyBadgeAwarded });
      }
      return;
    }

    if (!gateState.timeAllowed) {
      if (gateState.shouldShowLockedHint) {
        setShowNextChapterLockedHint(true);
        setNextChapterLockedReason(
          gateState.blockedReason === 'daily_limit' ||
            gateState.blockedReason === 'weekly_limit'
            ? gateState.blockedReason
            : null
        );
        setDismissedNextChapterLockedHint(false);
      }
      if (!wasAlreadyCompletedBeforeAnswer && lastVisibleEntryId) {
        setPendingChapterRewards({ lastEntryId: lastVisibleEntryId, coinAwarded: result.coinAwarded, themeStickerIds: result.newThemeStickerIds, milestoneStickerIds: result.newMilestoneStickerIds, starterStickerAwarded: result.starterStickerAwarded, weeklyBadgeAwarded: result.weeklyBadgeAwarded });
      }
      return;
    }

    const nextChapter = episode?.chapters?.[gateState.nextChapterIndex0] ?? null;
    if (!nextChapter) return;

    setShowNextChapterLockedHint(false);
    setNextChapterLockedReason(null);
    setDismissedNextChapterLockedHint(false);

    dispatch({
      type: 'APPEND_STORY_MESSAGE',
      payload: {
        message: {
          id: `${courseId}-${nextChapter.id}-chapter-divider`,
          type: 'system',
          kind: 'chapter-divider',
          content:
            nextChapter.chapterTitle ?? `Kapitel ${nextChapter.chapterIndex0 + 1}`,
          chapterMeta: {
            title:
              nextChapter.chapterTitle ?? `Kapitel ${nextChapter.chapterIndex0 + 1}`,
            subtitle: nextChapter.chapterSubtitle,
          },
          timestamp: '',
        },
      },
    });

    dispatch({
      type: 'ADVANCE_TO_CHAPTER',
      payload: {
        courseId,
        chapter: nextChapter,
      },
    });

    // Rewards warten bis der letzte Eintrag im Viewport sichtbar ist
    if (!wasAlreadyCompletedBeforeAnswer && lastVisibleEntryId) {
      setPendingChapterRewards({ lastEntryId: lastVisibleEntryId, coinAwarded: result.coinAwarded, themeStickerIds: result.newThemeStickerIds, milestoneStickerIds: result.newMilestoneStickerIds, starterStickerAwarded: result.starterStickerAwarded, weeklyBadgeAwarded: result.weeklyBadgeAwarded });
    }
  }, [state.phase, courseId, chapter, episodeMeta, episode, updateProfile, flyStickerFromRect, flyCoinFromRect]);

  const sceneInfo = useMemo(() => {
    const latestSceneMessage = findLatestSceneMessage(state.transcript);

    if (!latestSceneMessage?.scene) {
      return {
        tone: 'private' as SceneTone,
        title: '',
        participants: [] as string[],
      };
    }

    return {
      tone: latestSceneMessage.scene.tone,
      title: latestSceneMessage.scene.title ?? '',
      participants: latestSceneMessage.scene.participants?.map((p) => p.name) ?? [],
    };
  }, [state.transcript]);

  const groupedTranscript = useMemo(() => {
    return buildTranscriptGroups(state.transcript);
  }, [state.transcript]);

    const stepById = useMemo(() => {
    if (!episode) return {};

    return Object.fromEntries(
      episode.chapters.flatMap((chapter) =>
        chapter.steps.map((step) => [step.id, step] as const)
      )
    );
  }, [episode]);

  function handleOpenBonusLink(payload: {
    linkTo: string;
    bonusId?: string;
    anchorId?: string;
  }) {
    if (!courseId || !episodeMeta) return;

    if (payload.bonusId) {
      unlockBonusById(payload.bonusId);
    }

    saveStorySessionSnapshot(
      {
        seasonId: episodeMeta.seasonId,
        episodeId: episodeMeta.episodeId,
        courseId,
      },
      {
        courseId: state.courseId,
        chapterId: state.chapterId,
        chapterIndex0: state.chapterIndex0,
        stepIndex0: state.stepIndex0,
        phase: state.phase,
        storyCursor: state.storyCursor,
        transcript: state.transcript,
        completedStepIds: state.completedStepIds,
        activeStepId: state.activeStepId,
      }
    );

    navigate(payload.linkTo, {
      state: {
        backgroundLocation: location,
        backTo: location.pathname + location.search + location.hash,
        autoOpen: true,
      },
    });
  }

  function goToNextStep() {
    if (!chapter) return;

    dispatch({
      type: 'GO_TO_NEXT_STEP',
      payload: { chapter },
    });
  }

  function renderTranscriptEntry(entry: TranscriptEntry) {
    switch (entry.kind) {
      case 'message': {
        const message = entry.message;

        if (message.kind === 'chat-switch' && message.scene) {
          return null;
        }

        if (message.kind === 'chapter-divider') {
          return null;
        }

        return (
          <div
            key={entry.id}
            data-story-message-id={message.id ?? entry.id}
            data-story-entry-id={entry.id}
          >
            <ChatMessage
              message={message}
              onOpenBonusLink={({ linkTo, bonusId }) =>
                handleOpenBonusLink({
                  linkTo,
                  bonusId,
                  anchorId: entry.id,
                })
              }
            />
          </div>
        );
      }

      case 'input_response': {
        const content = entry.text ?? entry.choiceText ?? '';
        if (!content) return null;

        return (
          <div key={entry.id} data-story-entry-id={entry.id}>
            {entry.promptText ? (
              <ChatMessage
                message={{
                  id: `${entry.id}-prompt`,
                  type: 'main',
                  speaker: characters.amy,
                  content: entry.promptText,
                  timestamp: '',
                }}
              />
            ) : null}
            <ChatMessage
              message={{
                id: entry.id,
                type: 'user',
                content,
                timestamp: '',
              }}
            />
          </div>
        );
      }

      case 'item_response': {
        const content = entry.optionText ?? '';
        if (!content) return null;

        return (
          <div key={entry.id} data-story-entry-id={entry.id}>
            <ChatMessage
              message={{
                id: entry.id,
                type: 'user',
                content,
                timestamp: '',
              }}
            />
          </div>
        );
      }

      case 'item_multi_response': {
        if (entry.selectedOptionIds.length === 0) return null;

        const sourceStep = stepById[entry.stepId];
        if (!sourceStep || sourceStep.type !== 'item') return null;

        return (
          <div key={entry.id} data-story-entry-id={entry.id}>
            <CompletedMultiSelectItemCard
              selectedOptionIds={entry.selectedOptionIds}
              allOptions={sourceStep.options}
            />
          </div>
        );
      }

      case 'amy_feedback':
        if (
          currentStep?.type === 'amy_feedback' &&
          currentStep.sourceStepId === entry.stepId
        ) {
          return null;
        }

        return (
          <div key={entry.id} data-story-entry-id={entry.id}>
            <AmyFeedbackStepCard lines={entry.lines} />
          </div>
        );

      case 'reflection_response': {
        const content = entry.text ?? entry.choiceText ?? '';
        if (!content) return null;

        return (
          <div key={entry.id} data-story-entry-id={entry.id}>
            {entry.promptText ? (
              <ChatMessage
                message={{
                  id: `${entry.id}-prompt`,
                  type: 'main',
                  speaker: characters.amy,
                  content: entry.promptText,
                  timestamp: '',
                }}
              />
            ) : null}
            <ChatMessage
              message={{
                id: entry.id,
                type: 'user',
                content,
                timestamp: '',
              }}
            />
          </div>
        );
      }

      case 'amy_reaction':
        if (
          currentStep?.type === 'amy_reaction' &&
          currentStep.sourceStepId === entry.stepId
        ) {
          return null;
        }

        return (
          <div key={entry.id} data-story-entry-id={entry.id}>
            <AmyReactionStepCard lines={entry.lines} />
          </div>
        );

      case 'challenge':
        return (
          <div key={entry.id} data-story-entry-id={entry.id}>
            <ChallengeStepCard challengeId={entry.stepId} text={entry.text} />
          </div>
        );

      case 'episode_summary':
        return (
          <div key={entry.id} data-story-entry-id={entry.id}>
            <EpisodeSummaryCard
              episodeTitle={episodeMeta ? t(episodeMeta.titleKey) : undefined}
              stickerImage={episodeMeta?.stickerImage}
              bonusCoins={entry.bonusCoins}
              onViewSticker={() => navigate('/album')}
              onContinue={() => navigate('/stories')}
              onProfile={() => navigate('/profile')}
            />
          </div>
        );

      default:
        return null;
    }
  }

  function renderActiveStep() {
    if (!courseId || !chapter || !currentStep) return null;

    if (currentStep.type === 'input') {
      return (
        <InputStepCard
          step={currentStep}
          onSubmit={(payload) => {
            saveInputResponse({
              inputId: currentStep.id,
              courseId,
              chapterId: chapter.id,
              chapterIndex0: chapter.chapterIndex0,
              text: payload.text,
              choiceId: payload.choiceId,
              timestamp: new Date().toISOString(),
            });

            if (currentStep.id === 's1e01c01_input_chat_name') {
              const nextChatName = (payload.text ?? '').trim();

              if (nextChatName) {
                updateProfile((prev) => ({
                  ...prev,
                  chatName: nextChatName,
                  myCard: {
                    name: nextChatName,
                    mostly: prev.myCard?.mostly ?? '',
                    hobbies: prev.myCard?.hobbies ?? [],
                    othersLike: prev.myCard?.othersLike ?? [],
                    annoys: prev.myCard?.annoys ?? [],
                    colors: prev.myCard?.colors ?? '',
                    happy: prev.myCard?.happy ?? '',
                    netRule: prev.myCard?.netRule ?? '',
                    funFact: prev.myCard?.funFact ?? '',
                  },
                  updatedAt: Date.now(),
                }));
              }
            }

            markTopicsSeen({
              topicIds: currentStep.topicIds ?? [],
              courseId,
              chapterId: chapter.id,
              chapterIndex0: chapter.chapterIndex0,
              stepId: currentStep.id,
            });

            dispatch({
              type: 'SUBMIT_INPUT',
              payload: {
                stepId: currentStep.id,
                text: payload.text,
                choiceId: payload.choiceId,
                choiceText: payload.choiceText,
                // Prompt nur speichern wenn er sichtbar war (showPromptBubble !== false)
                promptText: currentStep.showPromptBubble !== false
                  ? (currentStep.prompt ?? t(currentStep.promptKey ?? '', { defaultValue: '' })) || undefined
                  : undefined,
              },
            });

            goToNextStep();
          }}
        />
      );
    }

    if (currentStep.type === 'item' && currentStep.selectionMode === 'multiple') {
      return (
        <MultiSelectItemCard
          step={currentStep}
          onSubmit={(payload) => {
            markTopicsSeen({
              topicIds: currentStep.topicIds ?? [],
              courseId,
              chapterId: chapter.id,
              chapterIndex0: chapter.chapterIndex0,
              stepId: currentStep.id,
            });

            dispatch({
              type: 'SUBMIT_ITEM_MULTI',
              payload: {
                stepId: currentStep.id,
                selectedOptionIds: payload.selectedOptionIds,
                selectedOptionTexts: payload.selectedOptionTexts,
                optionScores: payload.optionScores,
                dimension: currentStep.dimension,
                indicatorId: currentStep.indicatorId,
              },
            });

            goToNextStep();
          }}
        />
      );
    }

    if (currentStep.type === 'item') {
      return (
        <ItemStepCard
          step={currentStep}
          onSelect={(payload) => {
            const selectedOption = currentStep.options.find(
              (option) => option.id === payload.optionId
            );
            const feedbackLines = resolveItemReactionLines(selectedOption?.reaction, t);

            saveItemResponse({
              itemId: currentStep.id,
              courseId,
              chapterId: chapter.id,
              chapterIndex0: chapter.chapterIndex0,
              dimension: currentStep.dimension,
              indicatorId: currentStep.indicatorId,
              selectedOptionId: payload.optionId,
              score: payload.score,
              timestamp: new Date().toISOString(),
            });

            markTopicsSeen({
              topicIds: currentStep.topicIds ?? [],
              courseId,
              chapterId: chapter.id,
              chapterIndex0: chapter.chapterIndex0,
              stepId: currentStep.id,
            });

            dispatch({
              type: 'SUBMIT_ITEM',
              payload: {
                stepId: currentStep.id,
                optionId: payload.optionId,
                optionText: payload.optionText,
                dimension: currentStep.dimension,
                indicatorId: currentStep.indicatorId,
                score: payload.score,
              },
            });

            if (feedbackLines.length > 0) {
              dispatch({
                type: 'SHOW_AMY_FEEDBACK',
                payload: {
                  stepId: currentStep.id,
                  lines: feedbackLines,
                },
              });
            }

            goToNextStep();
          }}
        />
      );
    }

    if (currentStep.type === 'amy_feedback') {
      const lines = findAmyFeedbackLines(state.transcript, currentStep.sourceStepId);

      return (
        <AmyFeedbackStepCard
          lines={lines}
          onContinue={() => {
            dispatch({
              type: 'COMPLETE_STORY_STEP',
              payload: { step: currentStep },
            });
            goToNextStep();
          }}
        />
      );
    }

    if (currentStep.type === 'reflection') {
      return (
        <ReflectionStepCard
          step={currentStep}
          onSubmit={(payload) => {
            let amyReactionLines: string[] = [];

            if (currentStep.reflectionKind === 'guided_choice') {
              const selectedChoice = (currentStep.choices ?? []).find(
                (choice) => choice.id === payload.choiceId
              );
              amyReactionLines = resolveReflectionReactionLines(
                selectedChoice?.reaction,
                t
              );
            }

            if (currentStep.reflectionKind === 'open_text' && payload.amyReply) {
              amyReactionLines = [payload.amyReply];
            }

            saveReflectionResponse({
              reflectionId: currentStep.id,
              courseId,
              chapterId: chapter.id,
              chapterIndex0: chapter.chapterIndex0,
              text: payload.text,
              choiceId: payload.choiceId,
              timestamp: new Date().toISOString(),
            });

            markTopicsSeen({
              topicIds: currentStep.topicIds ?? [],
              courseId,
              chapterId: chapter.id,
              chapterIndex0: chapter.chapterIndex0,
              stepId: currentStep.id,
            });

            dispatch({
              type: 'SUBMIT_REFLECTION',
              payload: {
                stepId: currentStep.id,
                text: payload.text,
                choiceId: payload.choiceId,
                choiceText: payload.choiceText,
                promptText:
                  currentStep.prompt ??
                  t(currentStep.promptKey ?? '', { defaultValue: '' }),
                amyReplyText: payload.amyReply,
              },
            });

            if (amyReactionLines.length > 0) {
              dispatch({
                type: 'SHOW_AMY_REACTION',
                payload: {
                  stepId: currentStep.id,
                  lines: amyReactionLines,
                },
              });
            }

            goToNextStep();
          }}
        />
      );
    }

    if (currentStep.type === 'amy_reaction') {
      const lines = findAmyReactionLines(state.transcript, currentStep.sourceStepId);

      return (
        <AmyReactionStepCard
          lines={lines}
          onContinue={() => {
            dispatch({
              type: 'COMPLETE_STORY_STEP',
              payload: { step: currentStep },
            });
            goToNextStep();
          }}
        />
      );
    }

    if (currentStep.type === 'challenge') {
      const challengeText =
        currentStep.prompt ?? t(currentStep.promptKey ?? '', { defaultValue: '' });

      return (
        <ChallengeStepCard challengeId={currentStep.id} text={challengeText} />
      );
    }

    return null;
  }

  if (!courseId || !episodeMeta || !episode || !chapter) {
    return (
      <Layout backPath="/stories">
        <div className="w-full max-w-4xl px-4 py-12">
          <h2 className="text-2xl font-bold mb-3">Story V02 nicht gefunden</h2>
          <p>Für diese Episode gibt es noch keinen neuen V02-Inhalt.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout backPath="/stories" fullHeight>
      <div
        className="ios-anti-zoom flex flex-col w-full flex-1 min-h-0 overflow-hidden
                   sm:items-center sm:justify-center sm:w-[420px] md:w-[480px] sm:p-4"
      >
        <Phone
          showHeader
          showComposer={false}
          autoScroll={false}
          scrollRef={scrollRef}
          headerTitle={t(episodeMeta.titleKey)}
          headerSubtitle={t('stories:ui.header.online', { defaultValue: 'online' })}
          headerAvatarSrc={episodeMeta.coverImage}
          headerAvatarTargetAttr="header-avatar"
          sceneTone={sceneInfo.tone}
          sceneTitle={sceneInfo.title}
          sceneParticipants={sceneInfo.participants}
        >
          {groupedTranscript.length > 0 ? (
            groupedTranscript.map((group, groupIndex) => {
              const isLastGroup = groupIndex === groupedTranscript.length - 1;

              return (
                <div
                  key={group.key}
                  className={['chat-group', `chat-group--${group.tone}`].join(' ')}
                >
                  {group.chapterDivider ? (
                    <div className="flex flex-col items-center text-center mb-3 mt-1 gap-0.5">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-teal-600)] opacity-70">
                        {group.chapterDivider.title}
                      </div>
                      {group.chapterDivider.subtitle ? (
                        <div className="text-[13px] font-semibold text-slate-700 leading-snug px-4">
                          {group.chapterDivider.subtitle}
                        </div>
                      ) : null}
                      <div className="mt-1.5 h-px w-12 rounded-full bg-slate-300/60" />
                    </div>
                  ) : null}

                  <div className="mb-2 flex items-center gap-2 text-[11px] text-slate-500">
                    <span aria-hidden>
                      {group.tone === 'private'
                        ? '🔒'
                        : group.tone === 'class'
                          ? '🏫'
                          : '📰'}
                    </span>

                    <span className="font-medium shrink-0">
                      {t(group.labelKey, { defaultValue: 'Chat' })}
                    </span>

                    <span className="truncate text-slate-400">
                      {group.title
                        ? group.title
                        : group.participants.length
                          ? group.participants.join(', ')
                          : ''}
                    </span>
                  </div>

                  <div className={['rounded-2xl p-3', toneToBg(group.tone)].join(' ')}>
                    {group.items.map((entry) => renderTranscriptEntry(entry))}
                    {isLastGroup ? renderActiveStep() : null}
                  </div>
                </div>
              );
            })
          ) : (
            renderActiveStep()
          )}

          {showNextChapterLockedHint && !dismissedNextChapterLockedHint ? (
            <div className="mx-auto my-3 max-w-[560px] rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold mb-1">
                    {t('stories:gate.nextTomorrowTitle', {
                      defaultValue: 'Für heute bist du fertig ✨',
                    })}
                  </div>
                  <div>
                    {nextChapterLockedReason === 'weekly_limit'
                      ? t('stories:gate.nextMondayBody', {
                          defaultValue:
                            'Diese Woche hast du alle Amics gelesen. Der nächste Amic wartet Montag wieder auf dich. Bis dahin kannst du in der Schülerzeitung stöbern.',
                        })
                      : t('stories:gate.nextTomorrowBody', {
                          defaultValue: 'Der nächste Amic wartet morgen auf dich.',
                        })}
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => {
                    navigate('/newspaper');
                  }}
                  className="inline-flex items-center justify-center rounded-xl border border-sky-200 bg-white px-3 py-2 text-xs font-semibold text-sky-900 hover:bg-sky-100"
                >
                  {t('stories:gate.toNewspaper', {
                    defaultValue: 'Zur Schülerzeitung →',
                  })}
                </button>
              </div>
            </div>
          ) : null}
        </Phone>
      </div>

      {unlockedToast ? (
        <UnlockedToast
          title={unlockedToast.title}
          subtitle={unlockedToast.subtitle}
          onDismiss={() => setUnlockedToast(null)}
          onOpen={() => {
            const linkTo = unlockedToast.linkTo;
            setUnlockedToast(null);
            if (linkTo) navigate(linkTo);
          }}
        />
      ) : null}

    </Layout>
  );
}