// src/pages/StoryV02.tsx

import { useContext, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { BackgroundLocationContext } from '../App';
import { useTranslation } from 'react-i18next';

import Layout from '../components/Layout';
import Phone from '../components/Phone';
import ChatMessage from '../components/ChatMessage';

import { useProfile } from '../profile/useProfile';
import { getEpisodeMetaByCourseId } from '../content/contentIndex';
import { unlockBonusById } from '../bonus/unlockBonusById';
import { hasCompletedChapter } from '../progress/storyProgress';
import { assetUrl } from '../common/assetUrl';

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
  saveAmicSession,
  loadAmicSession,
  clearAmicSession,
} from '../story-v02/runtime/amicSessionStore';
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
import { shouldBypassAll } from '../gating/entitlements';
import { canStartNextNewChapterToday } from '../gating/gateEngine';
import UnlockedToast from '../components/UnlockedToast';
import RewardToast from '../components/RewardToast';
import type { RewardToastData } from '../components/RewardToast';
import { getStickerById } from '../progress/rewardCatalog';
import { playEpisodeSound } from '../common/soundPlayer';
import { trackItemStep } from '../analytics/analyticsEvents';
import EpisodeSummaryCard from '../story-v02/components/EpisodeSummaryCard';
import { getLexikonEntry } from '../lexikon/lexikonIndex';
import { LexikonTermModal } from './Lexikon';
import { saveNextAmicInfo } from '../notifications/amicNotif';
import { setAmicBadge } from '../notifications/reminderService';
import { loadSettings } from '../settings/appSettings';
import { BETA_ACTIVE, isBetaTester, isBetaCompletionShown } from '../beta/betaConfig';
import BetaCompletionModal from '../beta/BetaCompletionModal';

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
  const { courseId, chapterId: routeChapterId } = useParams<{ courseId: string; chapterId?: string }>();
  console.log('[V02] route courseId =', courseId, 'chapterId =', routeChapterId);
  const navigate = useNavigate();
  const location = useLocation();
  const backgroundLocation = useContext(BackgroundLocationContext);
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
  // ID des letzten Transcript-Eintrags vor "Weiter"-Klick.
  // null = kein pending scroll. Nach der Kaskade zum ersten Element danach scrollen.
  const scrollAnchorIdRef = useRef<string | null>(null);

  // Scroll-Position die vor dem Öffnen eines Bonus-Modals gesichert wird.
  // Wird wiederhergestellt, sobald das Modal geschlossen wird (backgroundLocation → null).
  const modalReturnScrollRef = useRef<number | null>(null);

  const courseIdRef = useRef(courseId);
  courseIdRef.current = courseId;

  const [showNextChapterLockedHint, setShowNextChapterLockedHint] = useState(false);


  const [unlockedToast, setUnlockedToast] = useState<{
    title: string;
    subtitle?: string;
    linkTo?: string;
  } | null>(null);

  const [rewardToast, setRewardToast] = useState<RewardToastData | null>(null);

  const [lexikonTermId, setLexikonTermId] = useState<string | null>(null);
  const openLexikonEntry = getLexikonEntry(lexikonTermId ?? '', lang);

  // Belohnungen warten bis der letzte Chapter-Eintrag sichtbar ist (IntersectionObserver)
  const [pendingChapterRewards, setPendingChapterRewards] = useState<{
    lastEntryId: string;
    coinAwarded: boolean;
    themeStickerIds: string[];
    milestoneStickerIds: string[];
    starterStickerAwarded: boolean;
    weeklyBadgeAwarded: boolean;
  } | null>(null);

  // Nach Amic-Abschluss: ID des nächsten Amics (wenn verfügbar), oder null = letzter Amic
  const [amicDoneNextChapterId, setAmicDoneNextChapterId] = useState<string | null | undefined>(undefined);
  // undefined = Karte noch nicht zeigen; null = letzter Amic (keine Weiter-Option); string = nächster Amic

  const [storyMenuOpen, setStoryMenuOpen] = useState(false);
  const [showBetaCompletionModal, setShowBetaCompletionModal] = useState(false);
  const [showSurveyConsent, setShowSurveyConsent] = useState(false);

  const betaProfileSnapshot = {
    chaptersCompleted: Object.entries(profile.progress?.completedChapters ?? {})
      .filter(([, v]) => v)
      .map(([k]) => k),
    currentEpisodeId: courseId ?? '',
    themePoints: profile.progress?.themePoints ?? {},
  };

  function fireRewardToast(opts: {
    stickerIds?: string[];
    staticStickers?: Array<{ image: string; title: string }>;
    coins?: number;
  }) {
    const stickers: Array<{ image: string; title: string }> = [];
    (opts.stickerIds ?? []).forEach((id) => {
      const def = getStickerById(id);
      if (!def) return;
      stickers.push({ image: def.image, title: def.title ?? def.titleKey ?? id });
    });
    (opts.staticStickers ?? []).forEach((s) => stickers.push(s));
    const coins = opts.coins ?? 0;
    if (stickers.length === 0 && coins === 0) return;
    setRewardToast({ stickers, coins, chatName: profile.chatName ?? undefined });
  }

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

      if (wanted == null) {
        if (restoreScrollTimerRef.current != null) {
          clearInterval(restoreScrollTimerRef.current);
          restoreScrollTimerRef.current = null;
        }
        return;
      }

      if (!el) {
        // Phone not yet mounted (episode still loading) — keep polling until it appears.
        if (tries >= maxTries) {
          pendingReturnScrollRef.current = null;
          if (restoreScrollTimerRef.current != null) {
            clearInterval(restoreScrollTimerRef.current);
            restoreScrollTimerRef.current = null;
          }
        }
        return;
      }

      const maxScrollable = Math.max(0, el.scrollHeight - el.clientHeight);
      const clamped = Math.min(wanted, maxScrollable);

      if (import.meta.env.DEV && tries <= 3) {
        console.log(`[V02] restoreScroll apply #${tries}:`, { wanted, clamped, maxScrollable, scrollTopBefore: el.scrollTop });
      }

      el.scrollTop = clamped;

      const closeEnough = Math.abs(el.scrollTop - clamped) < 4;
      // Only stop early when content is actually tall enough to reach the wanted position.
      // If content hasn't rendered yet, maxScrollable is near 0 — keep retrying.
      const contentReady = maxScrollable >= wanted - 8;

      // tries >= 6 ensures at least ~300ms of polling even after first success,
      // catching async iOS scroll resets that happen after the initial apply().
      if ((closeEnough && contentReady && tries >= 6) || tries >= maxTries) {
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
    // Key per Amic (nicht nur per Episode) — verhindert dass Amic-1-Scroll auf Amic-2 übertragen wird
    const ssKey = courseId ? `aym_story_scroll_${courseId}_${routeChapterId ?? ''}` : null;

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
  // episode als Dependency: wenn es nach dem Mount async lädt, ist scrollRef.current erst
  // dann != null — Effect muss neu laufen, um den Listener anzuhängen.
  }, [location.key, courseId, episode]);

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

    // Einmalige Reset von s1e04c02: veraltete Snapshots mit alten Kapitel-Headern
    // und falschem privateChat('Carlos', 'Jonas', 'Du') bereinigen.
    const amicMigrationKey = 'reset-amic-s1e04c02-v1';
    if (!hasStoryMigrationDone(amicMigrationKey)) {
      clearAmicSession('s1e04', 's1e04c02');
      saveStoryMigrationDone(amicMigrationKey);
    }

    // --- Per-Amic resume (chapter-specific URL) ---
    // When a specific chapterId is in the route, load only that chapter's session.
    // Never auto-advance — the user navigated here intentionally.
    if (routeChapterId) {
      const targetChapter = episode.chapters.find((c) => c.id === routeChapterId) ?? null;
      if (!targetChapter) return;

      const amicSnap = loadAmicSession(courseId, routeChapterId);

      if (amicSnap) {
        restoredAsFinishedRef.current = amicSnap.phase === 'chapter_finished';

        // Re-unlock bonus-link markers that may have been cleared
        if (amicSnap.completedStepIds.length > 0) {
          for (const ch of episode.chapters) {
            for (const step of ch.steps) {
              if (!amicSnap.completedStepIds.includes(step.id)) continue;
              if (step.type !== 'story') continue;
              for (const message of step.messages) {
                if (message.type === 'system' && message.kind === 'bonus-link' && message.bonusId) {
                  unlockBonusById(message.bonusId);
                }
              }
            }
          }
        }

        // Reconcile stepIndex0 with activeStepId in case story content was modified
        // (e.g. a new step was inserted earlier in the chapter, shifting all indices).
        let reconciledAmicSnap = amicSnap;
        if (amicSnap.activeStepId && targetChapter) {
          const correctIndex = targetChapter.steps.findIndex((s) => s.id === amicSnap.activeStepId);
          if (correctIndex >= 0 && correctIndex !== amicSnap.stepIndex0) {
            reconciledAmicSnap = { ...amicSnap, stepIndex0: correctIndex };
          }
        }

        dispatch({ type: 'RESTORE_SNAPSHOT', payload: reconciledAmicSnap });

        // Show amic-done card if chapter is finished
        if (reconciledAmicSnap.phase === 'chapter_finished') {
          const gateState = getNextChapterGateState({
            courseId,
            course: { script: episode.chapters },
            currentChapterIndex0: amicSnap.chapterIndex0,
            bypassAll: false,
          });
          if (!gateState.hasNext) {
            // Last chapter — no card needed (episode summary handled elsewhere)
          } else if (gateState.structuralAllowed && gateState.timeAllowed) {
            // Next chapter fully available — show navigation card
            const nextChapter = episode.chapters[gateState.nextChapterIndex0] ?? null;
            if (nextChapter) {
              setAmicDoneNextChapterId(nextChapter.id);
            }
          } else if (!gateState.timeAllowed && gateState.shouldShowLockedHint) {
            // Time-gated — show locked hint
            setShowNextChapterLockedHint(true);
            setAmicDoneNextChapterId(null);
          } else {
            setAmicDoneNextChapterId(null);
          }
        }
        return;
      }

      // No amic session yet — check time gate before starting fresh
      const isAlreadyCompleted = hasCompletedChapter(courseId, targetChapter.chapterIndex0);
      if (!isAlreadyCompleted && !shouldBypassAll(courseId)) {
        const timeGate = canStartNextNewChapterToday();
        if (!timeGate.allowed) {
          setShowNextChapterLockedHint(true);
          setAmicDoneNextChapterId(null);
          return;
        }
      }
      setAmicDoneNextChapterId(undefined);
      dispatch({
        type: 'START_CHAPTER',
        payload: { courseId, chapter: targetChapter },
      });
      return;
    }

    // --- Fallback: episode-level session (no chapterId in route) ---
    const snap = loadStorySessionSnapshot(scope);

    if (snap) {
      restoredAsFinishedRef.current = snap.phase === 'chapter_finished';

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

      // Reconcile stepIndex0 with activeStepId in case story content was modified.
      let reconciledSnap = snap;
      if (snap.activeStepId && snap.chapterId) {
        const snapChapter = episode.chapters.find((c) => c.id === snap.chapterId) ?? null;
        if (snapChapter) {
          const correctIndex = snapChapter.steps.findIndex((s) => s.id === snap.activeStepId);
          if (correctIndex >= 0 && correctIndex !== snap.stepIndex0) {
            reconciledSnap = { ...snap, stepIndex0: correctIndex };
          }
        }
      }

      dispatch({ type: 'RESTORE_SNAPSHOT', payload: reconciledSnap });

      if (reconciledSnap.phase === 'chapter_finished') {
        const gateState = getNextChapterGateState({
          courseId,
          course: { script: episode.chapters },
          currentChapterIndex0: snap.chapterIndex0,
          bypassAll: false,
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
              payload: { courseId, chapter: nextChapter },
            });

            return;
          }
        }

        if (gateState.hasNext && !gateState.timeAllowed && gateState.shouldShowLockedHint) {
          setShowNextChapterLockedHint(true);
          setAmicDoneNextChapterId(null);
        }
      }

      return;
    }

    // No snapshot — start from highest playable chapter
    const highestPlayable = getHighestPlayableChapterIndex0(courseId ?? undefined);
    const startIndex = Math.min(highestPlayable, episode.chapters.length - 1);
    const startChapter = episode.chapters[startIndex] ?? null;
    if (!startChapter) return;

    dispatch({
      type: 'START_CHAPTER',
      payload: { courseId, chapter: startChapter },
    });
  }, [courseId, routeChapterId, episodeMeta, episode]);

  useEffect(() => {
    if (!courseId || !episodeMeta) return;
    if (!state.courseId || !state.chapterId) return;

    const snapshotPayload = {
      courseId: state.courseId,
      chapterId: state.chapterId,
      chapterIndex0: state.chapterIndex0,
      stepIndex0: state.stepIndex0,
      phase: state.phase,
      storyCursor: state.storyCursor,
      transcript: state.transcript,
      completedStepIds: state.completedStepIds,
      activeStepId: state.activeStepId,
    };

    // Episode-level save (backward compat)
    saveStorySessionSnapshot(
      {
        seasonId: episodeMeta.seasonId,
        episodeId: episodeMeta.episodeId,
        courseId,
      },
      snapshotPayload
    );

    // Per-Amic save — key includes chapterId so each chapter resumes independently
    saveAmicSession(courseId, state.chapterId, snapshotPayload);
  }, [state, courseId, episodeMeta]);

  const currentStep: StoryStep | null = useMemo(() => {
    if (!chapter) return null;
    return chapter.steps[state.stepIndex0] ?? null;
  }, [chapter, state.stepIndex0]);

  // Scrollposition beim ersten Laden wiederherstellen (location.key ändert sich durch React Router v7
  // LocationContext-Override nicht beim Öffnen/Schließen von Bonus-Modals → dafür popstate-Listener)
  useLayoutEffect(() => {
    // In-memory map (accurate for same-session forward/back navigation)
    const saved = storyScrollPositions.get(location.key);
    if (typeof saved === 'number' && saved > 0) {
      restoreScrollToValue(saved);
      return;
    }

    // Fallback: sessionStorage → localStorage per Amic (courseId + chapterId)
    // Wichtig: chapterId einschließen, sonst würde Amic-1-Scroll auf Amic-2 angewendet
    if (courseId) {
      try {
        const ssKey = `aym_story_scroll_${courseId}_${routeChapterId ?? ''}`;
        const rawSS = sessionStorage.getItem(ssKey);
        const rawLS = localStorage.getItem(ssKey);
        const fromStorage = rawSS ? Number(rawSS) : rawLS ? Number(rawLS) : 0;
        if (fromStorage > 0) restoreScrollToValue(fromStorage);
      } catch { /* ignore */ }
    }
  }, [location.key, courseId]);

  // Scroll-Restore nach Bonus-Modal-Schließen.
  // backgroundLocation ist gesetzt während ein Modal offen ist.
  // Wenn es null wird (Modal geschlossen), stellen wir die gesicherte Scroll-Position wieder her.
  // useLayoutEffect (nicht useEffect!) damit scrollTop VOR dem Paint gesetzt wird —
  // iOS Safari resettet scrollTop beim Entfernen von position:fixed Elementen genau beim Paint.
  useLayoutEffect(() => {
    if (backgroundLocation !== null) return; // Modal noch offen oder nie geöffnet
    // Primary: position saved synchronously in handleOpenBonusLink.
    // Fallback: module-level scroll map (updated on every scroll event, survives re-renders).
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const pos = modalReturnScrollRef.current ?? storyScrollPositions.get(location.key) ?? null;
    if (import.meta.env.DEV) {
      console.log('[V02] modal closed, restoring scroll:', {
        pos,
        ref: modalReturnScrollRef.current,
        map: storyScrollPositions.get(location.key),
        locationKey: location.key,
        scrollTopNow: scrollRef.current?.scrollTop,
      });
    }
    if (pos === null) return;
    modalReturnScrollRef.current = null;
    if (pos > 0) restoreScrollToValue(pos);
  }, [backgroundLocation]); // location.key is stable for same history entry — intentionally omitted

  // Nach "Weiter"-Klick: scroll zum ersten neuen Eintrag, aber erst wenn die
  // Story-Step-Kaskade fertig ist (currentStep ist kein 'story'-Typ mehr).
  useLayoutEffect(() => {
    if (!scrollAnchorIdRef.current) return;
    if (currentStep?.type === 'story' || currentStep?.type === 'challenge') return;

    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const anchorId = scrollAnchorIdRef.current;
    scrollAnchorIdRef.current = null;

    // Finde das Anker-Element und dann das nächste danach
    const anchorEl = scrollEl.querySelector(`[data-story-entry-id="${CSS.escape(anchorId)}"]`);
    const allEntries = Array.from(scrollEl.querySelectorAll('[data-story-entry-id]'));
    const anchorIndex = anchorEl ? allEntries.indexOf(anchorEl) : -1;

    // Guard: wenn Anker nicht im DOM → kein Scroll (verhindert Sprung zu allEntries[0])
    if (anchorIndex < 0) return;

    const target = allEntries[anchorIndex + 1] as HTMLElement | undefined;

    if (target) {
      const containerTop = scrollEl.getBoundingClientRect().top;
      const entryTop = target.getBoundingClientRect().top;
      scrollEl.scrollTop += entryTop - containerTop - 12;
    }
  }, [state.transcript.length, currentStep]);

  // IntersectionObserver: Reward-Toast zeigen wenn der letzte Chapter-Eintrag sichtbar wird
  useEffect(() => {
    if (!pendingChapterRewards) return;
    const { lastEntryId, coinAwarded, themeStickerIds, milestoneStickerIds, starterStickerAwarded, weeklyBadgeAwarded } = pendingChapterRewards;

    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const targetEl = scrollEl.querySelector(`[data-story-entry-id="${CSS.escape(lastEntryId)}"]`);
    if (!targetEl) {
      // Element nicht im DOM (sollte nicht vorkommen) — direkt auslösen
      const staticStickers: Array<{ image: string; title: string }> = [];
      if (starterStickerAwarded) staticStickers.push({ image: 'media/stickers/milestones/starter-first-5-512.webp', title: '5 Kapitel geschafft!' });
      if (weeklyBadgeAwarded) staticStickers.push({ image: 'media/stickers/streaks/streak-5-512.webp', title: '5 von 7 Tagen! 🔥' });
      setTimeout(() => fireRewardToast({ stickerIds: [...themeStickerIds, ...milestoneStickerIds], staticStickers, coins: coinAwarded ? 1 : 0 }), 1200);
      setPendingChapterRewards(null);
      return;
    }

    const fire = () => {
      const staticStickers: Array<{ image: string; title: string }> = [];
      if (starterStickerAwarded) staticStickers.push({ image: 'media/stickers/milestones/starter-first-5-512.webp', title: '5 Kapitel geschafft!' });
      if (weeklyBadgeAwarded) staticStickers.push({ image: 'media/stickers/streaks/streak-5-512.webp', title: '5 von 7 Tagen! 🔥' });
      setTimeout(() => fireRewardToast({ stickerIds: [...themeStickerIds, ...milestoneStickerIds], staticStickers, coins: coinAwarded ? 1 : 0 }), 1200);
      setPendingChapterRewards(null);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          fire();
        }
      },
      { root: scrollEl, threshold: 0 }
    );
    observer.observe(targetEl);
    return () => observer.disconnect();
  }, [pendingChapterRewards]);

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

  // Heilt gespeicherte Snapshots: Challenge war abgeschlossen aber GO_TO_NEXT_STEP
  // wurde nie gefeuert (alter Bug). Erkennt stuck state und rückt automatisch vor.
  useEffect(() => {
    if (state.phase !== 'showing_challenge') return;
    if (!chapter) return;
    const step = chapter.steps[state.stepIndex0];
    if (!step || !state.completedStepIds.includes(step.id)) return;
    dispatch({ type: 'GO_TO_NEXT_STEP', payload: { chapter } });
  }, [state.phase, state.stepIndex0, state.completedStepIds, chapter]);

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
      promptText: challengeText,
      linkBonusId: currentStep.linkBonusId,
      linkTo: currentStep.linkTo,
      linkLabel: currentStep.linkLabel,
      linkContent: currentStep.linkContent,
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
    });

    if (!gateState.hasNext) {
      setShowNextChapterLockedHint(false);

      if (!wasAlreadyCompletedBeforeAnswer) {
        // Reward-Toast: Episodensticker + Coins + Sondersticker
        {
          const stickerIds = [...result.newMilestoneStickerIds];
          const staticStickers: Array<{ image: string; title: string }> = [];
          if (result.stickerAwarded && episodeMeta.stickerImage) {
            staticStickers.push({ image: episodeMeta.stickerImage, title: 'Episode abgeschlossen' });
          }
          if (result.starterStickerAwarded) staticStickers.push({ image: 'media/stickers/milestones/starter-first-5-512.webp', title: '5 Kapitel geschafft!' });
          if (result.weeklyBadgeAwarded) staticStickers.push({ image: 'media/stickers/streaks/streak-5-512.webp', title: '5 von 7 Tagen! 🔥' });
          const coins = result.episodeBonusAwarded ? 5 : 0;
          if (stickerIds.length > 0 || staticStickers.length > 0 || coins > 0) {
            setTimeout(() => fireRewardToast({ stickerIds, staticStickers, coins }), 5000);
          }
        }

        // Abschluss-Karte direkt im Messenger erscheint nach dem Toast
        const summaryId = `episode-summary-${courseId}`;
        setTimeout(() => {
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
        setTimeout(() => {
          playEpisodeSound(profile.soundEnabled !== false);
        }, 3500);
      }
      return;
    }

    if (!gateState.structuralAllowed) {
      setShowNextChapterLockedHint(false);
      setAmicDoneNextChapterId(null);
      if (!wasAlreadyCompletedBeforeAnswer && lastVisibleEntryId) {
        setPendingChapterRewards({ lastEntryId: lastVisibleEntryId, coinAwarded: result.coinAwarded, themeStickerIds: result.newThemeStickerIds, milestoneStickerIds: result.newMilestoneStickerIds, starterStickerAwarded: result.starterStickerAwarded, weeklyBadgeAwarded: result.weeklyBadgeAwarded });
      }
      return;
    }

    if (!gateState.timeAllowed) {
      if (gateState.shouldShowLockedHint) {
        setShowNextChapterLockedHint(true);
        setAmicDoneNextChapterId(null);
      }
      if (!wasAlreadyCompletedBeforeAnswer && lastVisibleEntryId) {
        setPendingChapterRewards({ lastEntryId: lastVisibleEntryId, coinAwarded: result.coinAwarded, themeStickerIds: result.newThemeStickerIds, milestoneStickerIds: result.newMilestoneStickerIds, starterStickerAwarded: result.starterStickerAwarded, weeklyBadgeAwarded: result.weeklyBadgeAwarded });
      }
      return;
    }

    const nextChapter = episode?.chapters?.[gateState.nextChapterIndex0] ?? null;
    if (!nextChapter) return;

    setShowNextChapterLockedHint(false);

    // Statt inline-Weiterschalten: Navigations-Karte zeigen
    setAmicDoneNextChapterId(nextChapter.id);

    // Cache der erste Sender des nächsten Kapitels für den "Amic hat..." Banner
    if (!wasAlreadyCompletedBeforeAnswer && loadSettings().remindersEnabled) {
      const firstSender = nextChapter.steps
        .flatMap(s => (s.type === 'story' ? s.messages : []))
        .find(msg => msg.type !== 'system' && msg.speaker?.name)?.speaker?.name;
      if (firstSender) {
        saveNextAmicInfo({ senderName: firstSender, chapterId: nextChapter.id, courseId });
      }
      // Badge auf App-Icon setzen → signalisiert "nächstes Amic wartet"
      setAmicBadge();
    }

    // Rewards warten bis der letzte Eintrag im Viewport sichtbar ist
    if (!wasAlreadyCompletedBeforeAnswer && lastVisibleEntryId) {
      setPendingChapterRewards({ lastEntryId: lastVisibleEntryId, coinAwarded: result.coinAwarded, themeStickerIds: result.newThemeStickerIds, milestoneStickerIds: result.newMilestoneStickerIds, starterStickerAwarded: result.starterStickerAwarded, weeklyBadgeAwarded: result.weeklyBadgeAwarded });
    }
  }, [state.phase, courseId, chapter, episodeMeta, episode, updateProfile]);

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

    const _scrollPos = scrollRef.current?.scrollTop ?? 0;
    modalReturnScrollRef.current = _scrollPos;
    // Auch in sessionStorage/localStorage sichern — überlebt einen Remount (z.B. wenn
    // die Story nach Schließen des Modals neu mountet weil backgroundLocation nicht korrekt erhalten blieb).
    if (_scrollPos > 0) {
      const ssKey = `aym_story_scroll_${courseId}_${routeChapterId ?? ''}`;
      try { sessionStorage.setItem(ssKey, String(_scrollPos)); } catch { /* ignore */ }
      try { localStorage.setItem(ssKey, String(_scrollPos)); } catch { /* ignore */ }
    }
    if (import.meta.env.DEV) {
      console.log('[V02] openBonusLink: saving scroll', { scrollPos: _scrollPos, scrollRefEl: scrollRef.current });
    }

    if (payload.bonusId) {
      unlockBonusById(payload.bonusId);
    }

    const snapshotPayload = {
      courseId: state.courseId,
      chapterId: state.chapterId,
      chapterIndex0: state.chapterIndex0,
      stepIndex0: state.stepIndex0,
      phase: state.phase,
      storyCursor: state.storyCursor,
      transcript: state.transcript,
      completedStepIds: state.completedStepIds,
      activeStepId: state.activeStepId,
    };

    saveStorySessionSnapshot(
      {
        seasonId: episodeMeta.seasonId,
        episodeId: episodeMeta.episodeId,
        courseId,
      },
      snapshotPayload
    );

    if (state.chapterId) {
      saveAmicSession(courseId, state.chapterId, snapshotPayload);
    }

    navigate(payload.linkTo, {
      state: {
        backgroundLocation: location,
        backTo: location.pathname + location.search,
      },
    });
  }

  function goToNextStep() {
    if (!chapter) return;

    // Find the last transcript entry that actually renders a DOM element.
    // 'chat-switch' and 'chapter-divider' messages render null → no data-story-entry-id.
    // If we anchor on those, querySelector returns null → anchorIndex = -1 → target = allEntries[0] → scrolls to top!
    let anchorId: string | null = null;
    for (let i = state.transcript.length - 1; i >= 0; i--) {
      const e = state.transcript[i];
      if (e.kind === 'message') {
        const mk = e.message.kind;
        if (mk === 'chat-switch' || mk === 'chapter-divider') continue;
      }
      if (e.kind === 'input_response' && !e.text && !e.choiceText) continue;
      anchorId = e.id;
      break;
    }
    scrollAnchorIdRef.current = anchorId;

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
              onOpenLexikonTerm={termId => setLexikonTermId(termId)}
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

      case 'item_multi_response': {
        if (entry.selectedOptionIds.length === 0) return null;

        const sourceStep = stepById[entry.stepId];
        if (!sourceStep || sourceStep.type !== 'item') return null;

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
            <ChallengeStepCard challengeId={entry.stepId} text={entry.text} courseId={courseId ?? ''} />
          </div>
        );

      case 'episode_summary': {
        const shouldShowBetaOnContinue =
          BETA_ACTIVE &&
          isBetaTester() &&
          !isBetaCompletionShown() &&
          courseId === 's1e01';
        return (
          <div key={entry.id} data-story-entry-id={entry.id}>
            <EpisodeSummaryCard
              episodeTitle={episodeMeta ? t(episodeMeta.titleKey) : undefined}
              stickerImage={episodeMeta?.stickerImage}
              bonusCoins={entry.bonusCoins}
              chatName={profile.chatName ?? undefined}
              characterImg="media/story/characters/yasmin-256.webp"
              characterSays="Danke, dass du dabei warst."
              betaMode={shouldShowBetaOnContinue}
              onViewSticker={() => navigate('/album')}
              onContinue={() => {
                if (shouldShowBetaOnContinue) {
                  setShowBetaCompletionModal(true);
                } else {
                  navigate('/stories');
                }
              }}
              onProfile={() => navigate('/profile')}
            />
          </div>
        );
      }

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
                promptText: (currentStep.prompt ?? t(currentStep.promptKey ?? '', { defaultValue: '' })) || undefined,
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

            trackItemStep({
              stepId: currentStep.id,
              itemScore: payload.score,
              dimensionId: currentStep.dimension,
              indicatorId: currentStep.indicatorId,
              topicIds: currentStep.topicIds,
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
                promptText: (currentStep.prompt ?? t(currentStep.promptKey ?? '', { defaultValue: '' })) || undefined,
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
      // SHOW_CHALLENGE adds the step to completedStepIds and to the transcript.
      // When it's the last step GO_TO_NEXT_STEP keeps stepIndex0 unchanged (phase → chapter_finished),
      // so currentStep still points here — skip renderActiveStep to avoid a duplicate card.
      if (state.completedStepIds.includes(currentStep.id)) return null;

      const challengeText =
        currentStep.prompt ?? t(currentStep.promptKey ?? '', { defaultValue: '' });

      return (
        <ChallengeStepCard challengeId={currentStep.id} text={challengeText} courseId={courseId ?? ''} />
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

  const backPath = courseId ? `/stories-v02/${courseId}` : '/stories';

  return (
    <Layout fullHeight hideHeader>
      <div
        className="ios-anti-zoom flex flex-col w-full flex-1 min-h-0 overflow-hidden
                   lg:items-center lg:justify-center lg:w-[480px] lg:p-4"
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
          headerCoins={profile.wallet?.coins ?? 0}
          onBack={() => navigate(backPath)}
          onMenu={() => setStoryMenuOpen(true)}
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

                  <div className="flex items-center gap-2 my-3 px-1">
                    <div className="flex-1 h-px bg-[var(--color-teal-100)]" />
                    <div className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-teal-700)] bg-[var(--color-teal-50)] rounded-full px-2.5 py-0.5 shrink-0">
                      <span aria-hidden>
                        {group.tone === 'private'
                          ? '🔒'
                          : group.tone === 'class'
                            ? '🏫'
                            : '📰'}
                      </span>
                      <span>{t(group.labelKey, { defaultValue: 'Chat' })}</span>
                      {(group.title || group.participants.length > 0) && (
                        <>
                          <span className="opacity-50">·</span>
                          <span className="font-normal">
                            {group.title ? group.title : group.participants.join(', ')}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex-1 h-px bg-[var(--color-teal-100)]" />
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

          {/* Amic-Abschluss-Karte */}
          {amicDoneNextChapterId !== undefined && state.phase === 'chapter_finished' ? (
            <div className="mx-auto my-3 max-w-[560px] rounded-2xl border border-[var(--color-teal-200)] bg-[var(--color-teal-50)] p-4 shadow-sm">
              <div className="font-semibold text-sm text-[var(--color-teal-900)] mb-1">
                {t('stories:amicDone.title', { defaultValue: 'Amic abgeschlossen ✓' })}
              </div>

              {/* Zeit-Sperre: "Für heute bist du fertig" */}
              {showNextChapterLockedHint ? (
                <div className="mt-2 mb-3">
                  <div className="text-sm font-semibold text-[var(--color-teal-900)]">
                    {t('stories:gate.nextTomorrowTitle', { defaultValue: 'Für heute bist du fertig ✨' })}
                  </div>
                  <div className="mt-0.5 text-xs text-[var(--color-teal-800)]">
                    {t('stories:gate.nextTomorrowBody', {
                      defaultValue: 'Der nächste Amic wartet morgen auf dich.',
                    })}
                  </div>
                </div>
              ) : <div className="mb-3" />}

              <div className="flex flex-wrap gap-2">
                {amicDoneNextChapterId && !showNextChapterLockedHint && (
                  <button
                    type="button"
                    onClick={() => navigate(`/stories-v02/${courseId}/${amicDoneNextChapterId}`)}
                    className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold bg-[var(--color-teal-600)] text-white hover:bg-[var(--color-teal-700)] transition-colors"
                  >
                    {t('stories:amicDone.ctaNext', { defaultValue: 'Nächster Amic →' })}
                  </button>
                )}
                {showNextChapterLockedHint && (
                  <button
                    type="button"
                    onClick={() => navigate('/newspaper')}
                    className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold bg-[var(--color-teal-600)] text-white hover:bg-[var(--color-teal-700)] transition-colors"
                  >
                    {t('stories:gate.toNewspaper', { defaultValue: 'Zur Schülerzeitung →' })}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => navigate(`/stories-v02/${courseId}`)}
                  className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold bg-white border border-[var(--color-teal-200)] text-[var(--color-teal-800)] hover:bg-[var(--color-teal-50)] transition-colors"
                >
                  {t('stories:amicDone.ctaOverview', { defaultValue: 'Zur Übersicht' })}
                </button>
              </div>

              {/* Beta: Umfrage nach dem 3. Kapitel */}
              {BETA_ACTIVE && isBetaTester() && !localStorage.getItem('surveyDismissed') && (() => {
                const totalCompleted = Object.values(profile.progress?.completedChapters ?? {}).filter(Boolean).length;
                return totalCompleted === 3;
              })() && (
                <div className="mt-4 rounded-xl border border-violet-200 bg-violet-50 p-3">
                  <div className="flex items-start gap-2.5">
                    <img
                      src="/media/story/characters/amy-256.webp"
                      alt="Amy"
                      className="w-8 h-8 rounded-full object-cover object-top flex-shrink-0"
                    />
                    <div className="min-w-0 w-full">
                      {!showSurveyConsent ? (
                        <>
                          <div className="text-xs font-extrabold text-violet-600 uppercase tracking-widest mb-0.5">
                            {t('stories:survey.amyAsks', { defaultValue: 'Amy fragt' })}
                          </div>
                          <p className="text-xs text-violet-900 font-semibold leading-snug">
                            {t('stories:survey.question', { defaultValue: 'Ich habe eine Frage an dich — was denkst du bisher?' })}
                          </p>
                          <p className="mt-0.5 text-xs text-violet-700 leading-snug">
                            {t('stories:survey.body', { defaultValue: '3 Minuten, anonym.' })}
                          </p>
                          <div className="mt-2 flex gap-2">
                            <button
                              type="button"
                              onClick={() => setShowSurveyConsent(true)}
                              className="inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-bold bg-violet-600 text-white hover:bg-violet-700 transition-colors"
                            >
                              {t('stories:survey.cta', { defaultValue: 'Zur Umfrage →' })}
                            </button>
                            <button
                              type="button"
                              onClick={() => localStorage.setItem('surveyDismissed', '1')}
                              className="inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-semibold text-violet-600 hover:text-violet-800 transition-colors"
                            >
                              {t('stories:survey.snooze', { defaultValue: 'Nicht jetzt' })}
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="text-xs text-violet-900 font-semibold leading-snug">
                            {t('stories:survey.consentTitle', { defaultValue: 'Du wirst zu Microsoft Forms weitergeleitet.' })}
                          </p>
                          <p className="mt-1 text-xs text-violet-700 leading-snug">
                            {t('stories:survey.consentBody', { defaultValue: 'Dort gelten die Datenschutzbestimmungen von Microsoft. Die Umfrage ist anonym.' })}
                          </p>
                          <div className="mt-2 flex gap-2">
                            <a
                              href="https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAN__tVBf5hUQlM2V0k0OFdWMEQzNVhaUVhSNzU2STdBSC4u"
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => localStorage.setItem('surveyDismissed', '1')}
                              className="inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-bold bg-violet-600 text-white hover:bg-violet-700 transition-colors"
                            >
                              {t('stories:survey.consentCta', { defaultValue: 'OK, weiter →' })}
                            </a>
                            <button
                              type="button"
                              onClick={() => setShowSurveyConsent(false)}
                              className="inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-semibold text-violet-600 hover:text-violet-800 transition-colors"
                            >
                              {t('stories:survey.consentCancel', { defaultValue: 'Abbrechen' })}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </Phone>
      </div>

      {showBetaCompletionModal && (
        <BetaCompletionModal profileSnapshot={betaProfileSnapshot} />
      )}

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

      {rewardToast ? (
        <RewardToast
          reward={rewardToast}
          onDismiss={() => setRewardToast(null)}
        />
      ) : null}

      {openLexikonEntry && (
        <LexikonTermModal
          entry={openLexikonEntry}
          onClose={() => setLexikonTermId(null)}
        />
      )}

      {/* Story-Menü (Bottom Sheet) */}
      {storyMenuOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          onClick={() => setStoryMenuOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40" aria-hidden />
          <div
            className="relative w-full max-w-md bg-white rounded-t-3xl shadow-xl pb-safe"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-slate-300" />
            </div>

            {/* Header */}
            <div className="px-5 pt-2 pb-4 border-b border-slate-100">
              <div className="text-sm font-extrabold text-slate-800">
                {t('stories:ui.menu.title', { defaultValue: 'Story-Menü' })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col divide-y divide-slate-100">
              {/* Zurück zu Amics */}
              <button
                type="button"
                className="flex items-center gap-3 px-5 py-4 text-left hover:bg-slate-50 active:bg-slate-100 transition-colors"
                onClick={() => { setStoryMenuOpen(false); navigate(backPath); }}
              >
                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[var(--color-teal-50)] text-[var(--color-teal-700)] shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </span>
                <div>
                  <div className="text-sm font-semibold text-slate-800">
                    {t('stories:ui.menu.backToAmics', { defaultValue: 'Zu den Amics' })}
                  </div>
                  <div className="text-xs text-slate-500">
                    {t('stories:ui.menu.backToAmicsHint', { defaultValue: 'Übersicht dieser Episode' })}
                  </div>
                </div>
              </button>

              {/* Profil & Coins */}
              <button
                type="button"
                className="flex items-center gap-3 px-5 py-4 text-left hover:bg-slate-50 active:bg-slate-100 transition-colors"
                onClick={() => { setStoryMenuOpen(false); navigate('/profile', { state: { backTo: location.pathname } }); }}
              >
                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-amber-50 shrink-0">
                  <img src={assetUrl('media/story/ui/coin-128.webp')} alt="" className="w-5 h-5" />
                </span>
                <div>
                  <div className="text-sm font-semibold text-slate-800">
                    {t('stories:ui.menu.profile', { defaultValue: 'Profil & Coins' })}
                  </div>
                  <div className="text-xs text-slate-500">
                    {profile.wallet?.coins ?? 0} {t('stories:ui.menu.coins', { defaultValue: 'Münzen' })}
                  </div>
                </div>
              </button>

              {/* Sound-Toggle */}
              <button
                type="button"
                className="flex items-center gap-3 px-5 py-4 text-left hover:bg-slate-50 active:bg-slate-100 transition-colors"
                onClick={() => updateProfile((prev) => ({ ...prev, soundEnabled: prev.soundEnabled === false ? true : false, updatedAt: Date.now() }))}
              >
                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 text-slate-600 shrink-0 text-lg">
                  {profile.soundEnabled === false ? '🔕' : '🔔'}
                </span>
                <div>
                  <div className="text-sm font-semibold text-slate-800">
                    {profile.soundEnabled === false
                      ? t('profile:sound.off', { defaultValue: 'Sound aus' })
                      : t('profile:sound.on', { defaultValue: 'Sound an' })}
                  </div>
                  <div className="text-xs text-slate-500">
                    {profile.soundEnabled === false
                      ? t('stories:ui.menu.soundOffHint', { defaultValue: 'Tippen zum Einschalten' })
                      : t('stories:ui.menu.soundOnHint', { defaultValue: 'Tippen zum Ausschalten' })}
                  </div>
                </div>
              </button>
            </div>

            {/* Close */}
            <div className="px-5 py-4">
              <button
                type="button"
                onClick={() => setStoryMenuOpen(false)}
                className="w-full rounded-2xl py-3 text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300 transition-colors"
              >
                {t('common:close', { defaultValue: 'Schließen' })}
              </button>
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
}