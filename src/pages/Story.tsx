// src/pages/Story.tsx
import {
  getQuestionIndex,
  getTipIndex,
  getStopIndex,
  getQuestionText,
  getTipText,
} from '../story/engine/storySelectors';
import { useEffect, useMemo, useRef, useState, useLayoutEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Layout from '../components/Layout';
import Phone from '../components/Phone';
import ChatMessage from '../components/ChatMessage';
import ConfirmDialog from '../components/ConfirmDialog';
import UnlockedToast from '../components/UnlockedToast';

import type { Course, Message } from '../common/types';
import { assetUrl } from '../common/assetUrl';

import { getPlayableEpisode } from '../content/courses/courseLoader';
import { getEpisodeMetaByCourseId } from '../content/contentIndex';
import type { EpisodeMeta } from '../content/contentIndex';

import { runAmy } from '../ai';

import { useProfile } from '../profile/useProfile';
import type { StoryPhase } from '../profile/types';

import {
  saveLatestStorySnapshotToSession,
  loadLatestStorySnapshotFromSession,
  saveStoryScrollToSession,
  loadStoryScrollFromSession,
  pickLatestTranscriptSnapshotFromProfile,
  buildStoryTranscriptKey,
  applyTranscriptSnapshotToProfile,
} from '../progress/storySnapshots';

import { useRewardFx } from '../progress/rewardFx';

// ✅ Story-Progress zentralisiert
import {
  clearProgress,
  getProgress,
  getCompletedChapterCount,
  hasCompletedChapter,
  pushAnswer,
} from '../progress/storyProgress';

import { unlockBonusById } from '../bonus/unlockBonusById';


import { getNextChapterGateState } from '../gating/storyGateHelpers';

import { useStoryRuntime } from '../story/useStoryRuntime';

import { buildTranscriptUpTo, buildFullTranscript } from '../story/engine/storyTranscript';
import { decideNextStoryStep } from '../story/engine/storyAdvance';
import { completeStoryChapter } from '../story/engine/storyCompletion';


type PlayableEpisode = EpisodeMeta & {
  script: Course['script'];
  epilogue?: Course['epilogue'];
};

type ReadingMode = 'cinematic' | 'instant';
type Lang = 'de' | 'en';


const READING_MODE_KEY = 'aym_reading_mode';
const AMY_SPEAKER = { id: 'amy', name: 'Amy', avatar: 'amy' };
const STORY_RETURNING_FROM_MODAL_KEY = 'story-returning-from-modal';
const STORY_RETURN_ANCHOR_MESSAGE_ID_KEY = 'story-return-anchor-message-id';


function mergeUniqueById<T extends { id?: string }>(prev: T[], next: T[]) {
  const seen = new Set(prev.map((m) => m.id).filter(Boolean) as string[]);
  const merged = [...prev];

  for (const m of next) {
    const id = m.id;
    if (id && seen.has(id)) continue;
    if (id) seen.add(id);
    merged.push(m);
  }

  return merged;
}

function saveReturnAnchorMessageId(messageId?: string) {
  if (!messageId) return;
  sessionStorage.setItem(STORY_RETURN_ANCHOR_MESSAGE_ID_KEY, messageId);
}

function consumeReturnAnchorMessageId(): string | null {
  const value = sessionStorage.getItem(STORY_RETURN_ANCHOR_MESSAGE_ID_KEY);
  sessionStorage.removeItem(STORY_RETURN_ANCHOR_MESSAGE_ID_KEY);
  return value;
}


function shouldAdvanceFromFinishedSnapshot(args: {
  courseId?: string;
  course: PlayableEpisode | null;
  currentChapterIndex0: number;
}) {
  const gateState = getNextChapterGateState({
    courseId: args.courseId,
    course: args.course,
    currentChapterIndex0: args.currentChapterIndex0,
    bypassAll: false,
    maxPerWeek: 5,
  });

  return gateState.hasNext && gateState.structuralAllowed && gateState.timeAllowed
    ? gateState
    : null;
}

export default function Story() {
  const { courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { t: tStories, i18n } = useTranslation('stories');
  const lang: Lang = (i18n.resolvedLanguage ?? i18n.language).startsWith('en') ? 'en' : 'de';

  const SAFETY_SELF_HARM_SHORT = tStories('safety.selfHarmShort', {
    defaultValue:
      'Es klingt, als wäre das gerade sehr belastend für dich. Dafür gibt es Hilfe – bitte hol dir jetzt Unterstützung.',
  });

  const { profile, updateProfile } = useProfile();
  const { flyCoinFromRect, flyStickerFromRect } = useRewardFx();

  const runtime = useStoryRuntime();

  const restoreLockedRef = useRef(false);
  useEffect(() => {
    restoreLockedRef.current = false;
  }, [courseId, lang]);

  const skipInstantOnceRef = useRef(false);

  const episodeMeta = useMemo(() => {
    if (!courseId) return null;
    return getEpisodeMetaByCourseId(courseId);
  }, [courseId]);

  const headerTitle = episodeMeta ? tStories(episodeMeta.titleKey) : '';
  const headerSubtitle = tStories('ui.header.online', { defaultValue: 'online' });
  const headerAvatarSrc = episodeMeta ? assetUrl(episodeMeta.coverImage) : undefined;

  const [course, setCourse] = useState<PlayableEpisode | null>(null);
  const [courseLoading, setCourseLoading] = useState(true);

  const [phase, setPhase] = useState<StoryPhase>('playing');
  const isAwaiting = phase === 'awaiting_answer';

  const [gateDebug, setGateDebug] = useState<string>('');

  const [nextChapterLockedReason, setNextChapterLockedReason] = useState<'daily_limit' | 'weekly_limit' | null>(null);

  const [progressDebug, setProgressDebug] = useState('');

  useEffect(() => {
    let alive = true;

    runtime.bumpRun();
    runtime.cancelAll();

setCourseLoading(true);
setCourse(null);
setPhase('playing');
setShowNextChapterLockedHint(false);
setNextChapterLockedReason(null);
setDismissedNextChapterLockedHint(false);


    (async () => {
      const c = getPlayableEpisode(courseId ?? '', lang as any);
      if (!alive) return;
      setCourse(c);
      setCourseLoading(false);
    })();

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, courseId]);

  const urlSpeed = Number(new URLSearchParams(location.search).get('speed'));
  const initialSpeedMultiplier = Number.isFinite(urlSpeed) && urlSpeed > 0 ? urlSpeed : 1.0;
  const [speedMultiplier, setSpeedMultiplier] = useState(initialSpeedMultiplier);

const speedOptions = [
  { value: 0.8, label: tStories('ui.speed.fast', { defaultValue: 'Schnell' }) },
  { value: 1.0, label: tStories('ui.speed.normal', { defaultValue: 'Normal' }) },
  { value: 1.25, label: tStories('ui.speed.slow', { defaultValue: 'Langsam' }) },
];

  const [readingMode, setReadingMode] = useState<ReadingMode>(() => {
    const saved = localStorage.getItem(READING_MODE_KEY);
    return saved === 'instant' || saved === 'cinematic' ? saved : 'cinematic';
  });

  useEffect(() => {
    localStorage.setItem(READING_MODE_KEY, readingMode);
  }, [readingMode]);

  const isInstant = readingMode === 'instant';

  const MIN_DELAY_MS = 450;
  const MAX_DELAY_MS = 5200;
  const CHARS_PER_SECOND = 20;
  const BASE_OVERHEAD_MS = 180;
  const IMAGE_EXTRA_MS = 450;

  const calcDelayForText = (text: string, hasImage = false) => {
    if (isInstant) return 0;
    const readingMs =
      BASE_OVERHEAD_MS + (text.length / CHARS_PER_SECOND) * 1000 + (hasImage ? IMAGE_EXTRA_MS : 0);
    const clamped = Math.min(MAX_DELAY_MS, Math.max(MIN_DELAY_MS, readingMs));
    return clamped * speedMultiplier;
  };

  const [cardToast, setCardToast] = useState<null | { bonusId: string; title: string; subtitle?: string }>(null);

  function showCardToastIfNeeded(newCardIds: string[] | null | undefined) {
    if (!newCardIds || newCardIds.length === 0) return;
    const unlockedBonusId = newCardIds[0];
    setCardToast({
      bonusId: unlockedBonusId,
      title: 'Neue Sammelkarte!',
      subtitle: 'Tippe auf „Ansehen“, um sie zu öffnen.',
    });
  }

  function tStoriesKeyMaybeNamespaced(key: string) {
    const clean = key.includes(':') ? key.split(':').slice(1).join(':') : key;
    return tStories(clean, { defaultValue: clean });
  }

  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const displayedRef = useRef<Message[]>([]);
  useEffect(() => {
    displayedRef.current = displayedMessages;
  }, [displayedMessages]);

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [chapter, setChapter] = useState(0);
  const [attemptByQuestion, setAttemptByQuestion] = useState<Record<string, number>>({});
  const [amyIsSpeaking, setAmyIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

const [showResumeDialog, setShowResumeDialog] = useState(false);
const [resumeMode, setResumeMode] = useState<'partial' | 'complete' | null>(null);
const [showAdultHint, setShowAdultHint] = useState(false);
const [showNextChapterLockedHint, setShowNextChapterLockedHint] = useState(false);
const [dismissedNextChapterLockedHint, setDismissedNextChapterLockedHint] = useState(false);


  const currentMessageIndexRef = useRef(0);
  useEffect(() => {
    currentMessageIndexRef.current = currentMessageIndex;
  }, [currentMessageIndex]);

  const attemptByQuestionRef = useRef<Record<string, number>>({});
  useEffect(() => {
    attemptByQuestionRef.current = attemptByQuestion;
  }, [attemptByQuestion]);

  const chapterRef = useRef<number>(0);
  useEffect(() => {
    chapterRef.current = chapter;
  }, [chapter]);

  const phaseRef = useRef<StoryPhase>('playing');
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const shellRef = useRef<HTMLDivElement | null>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const chapterEndBubbleRef = useRef<HTMLDivElement | null>(null);
  const pendingScrollRestoreRef = useRef<number | null>(null);
const restoreScrollRafRef = useRef<number | null>(null);
const suspendAutoScrollRef = useRef(false);
const [, setSuspendAutoScrollTick] = useState(0);


useEffect(() => {
  const el = chatScrollRef.current;
  if (!el || !courseId || !episodeMeta) return;

  const onScroll = () => {
    saveStoryScrollToSession(
      {
        seasonId: episodeMeta.seasonId,
        episodeId: episodeMeta.episodeId,
        courseId,
      },
      el.scrollTop
    );
  };

  el.addEventListener('scroll', onScroll, { passive: true });
  return () => el.removeEventListener('scroll', onScroll);
}, [courseId, episodeMeta]);


function persistScrollNow() {
  const el = chatScrollRef.current;
  if (!el || !courseId || !episodeMeta) return;

  saveStoryScrollToSession(
    {
      seasonId: episodeMeta.seasonId,
      episodeId: episodeMeta.episodeId,
      courseId,
    },
    el.scrollTop
  );
}


function restoreScrollSoon(): boolean {
  const el = chatScrollRef.current;
  if (!el || !courseId || !episodeMeta) return false;

  const y = loadStoryScrollFromSession({
    seasonId: episodeMeta.seasonId,
    episodeId: episodeMeta.episodeId,
    courseId,
  });

  if (y == null) return false;

  pendingScrollRestoreRef.current = y;

  let tries = 0;
  const maxTries = 60;

  const apply = () => {
    tries += 1;

    const el2 = chatScrollRef.current;
    const targetY = pendingScrollRestoreRef.current;

    if (!el2 || targetY == null) return;

    const maxScrollable = Math.max(0, el2.scrollHeight - el2.clientHeight);
    const wanted = Math.min(targetY, maxScrollable);

    el2.scrollTop = wanted;

    const nowCloseEnough = Math.abs(el2.scrollTop - wanted) < 4;
    const hasStableScrollableHeight = el2.scrollHeight > el2.clientHeight;
    const readyForTarget =
      hasStableScrollableHeight && maxScrollable >= Math.max(0, wanted - 8);

    if ((nowCloseEnough && readyForTarget) || tries >= maxTries) {
      restoreScrollRafRef.current = null;
      return;
    }

    restoreScrollRafRef.current = requestAnimationFrame(apply);
  };

  if (restoreScrollRafRef.current != null) {
    cancelAnimationFrame(restoreScrollRafRef.current);
  }

  restoreScrollRafRef.current = requestAnimationFrame(apply);
  return true;
}



function persistLatestSnapNow(displayed?: Message[]) {
  if (!courseId || !episodeMeta) return;

  saveLatestStorySnapshotToSession(
    {
      seasonId: episodeMeta.seasonId,
      episodeId: episodeMeta.episodeId,
      courseId,
    },
    {
      displayedMessages: displayed ?? displayedRef.current,
      chapter: chapterRef.current,
      currentMessageIndex: currentMessageIndexRef.current,
      phase: phaseRef.current,
      attemptByQuestion: attemptByQuestionRef.current,
    }
  );

  // ✅ wichtig: nicht nur Snapshot, sondern auch aktuellen Scroll mitziehen
  persistScrollNow();
}


function saveTranscriptSnapshot(
  key: string,
  displayed: Message[],
  overrides?: Partial<{
    chapter: number;
    currentMessageIndex: number;
    phase: StoryPhase;
    attemptByQuestion: Record<string, number>;
  }>
) {
  const snap = {
    displayedMessages: displayed,
    chapter: overrides?.chapter ?? chapterRef.current,
    currentMessageIndex: overrides?.currentMessageIndex ?? currentMessageIndexRef.current,
    phase: overrides?.phase ?? phaseRef.current,
    attemptByQuestion: overrides?.attemptByQuestion ?? attemptByQuestionRef.current,
  };

  if (courseId && episodeMeta) {
    saveLatestStorySnapshotToSession(
      {
        seasonId: episodeMeta.seasonId,
        episodeId: episodeMeta.episodeId,
        courseId,
      },
      snap
    );
  }

  const runId = runtime.runIdRef.current;
  runtime.schedule(() => {
    if (!runtime.isActive(runId)) return;
    updateProfile((prev) => applyTranscriptSnapshotToProfile(prev, key, snap));
  }, 0);
}


  useEffect(() => {
    if (displayedMessages.length === 0) return;
    persistLatestSnapNow(displayedMessages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedMessages, chapter, currentMessageIndex, phase]);

  function openUnlockedCard(bonusId: string) {
sessionStorage.setItem('story-returning-from-modal', '1');

suspendAutoScrollRef.current = true;
setSuspendAutoScrollTick((v) => v + 1);

persistScrollNow();
persistLatestSnapNow(displayedRef.current);

    runtime.bumpRun();
    runtime.cancelAll();

    navigate(`/cards/${bonusId}`, {
      state: {
        backgroundLocation: location,
        backTo: location.pathname + location.search + location.hash,
        autoOpen: true,
      },
    });
  }

  const allMessages = useMemo(() => course?.script?.[chapter]?.messages || [], [course, chapter]);

const chapterLabel = `${courseId ?? 'unknown'}:chapter-${chapter + 1}`;

const questionIndex = useMemo(
  () => getQuestionIndex(allMessages, chapterLabel),
  [allMessages, chapterLabel]
);

const tipIndex = useMemo(
  () => getTipIndex(allMessages, chapterLabel),
  [allMessages, chapterLabel]
);

const stopIndex = useMemo(
  () => getStopIndex(allMessages, chapterLabel),
  [allMessages, chapterLabel]
);



  const allMessagesRef = useRef<Message[]>([]);
  useEffect(() => {
    allMessagesRef.current = allMessages;
  }, [allMessages]);

  const stopIndexRef = useRef<number>(0);
  useEffect(() => {
    stopIndexRef.current = stopIndex;
  }, [stopIndex]);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    if (!course) return;

    if (questionIndex === -1) {
      console.warn(`[Story] Missing amy-question in ${courseId ?? 'unknown-course'} chapter ${chapter + 1}`);
    }
    if (tipIndex === -1) {
      console.warn(`[Story] Missing amy-tip in ${courseId ?? 'unknown-course'} chapter ${chapter + 1}`);
    }
    if (questionIndex !== -1 && tipIndex !== -1 && tipIndex !== questionIndex + 1) {
      console.warn(
        `[Story] Expected amy-tip right after amy-question in ${courseId ?? 'unknown-course'} chapter ${
          chapter + 1
        } (q=${questionIndex}, tip=${tipIndex})`
      );
    }
  }, [course, chapter, questionIndex, tipIndex, courseId]);


useLayoutEffect(() => {
  const returning = sessionStorage.getItem(STORY_RETURNING_FROM_MODAL_KEY) === '1';
  if (!returning) return;

  sessionStorage.removeItem(STORY_RETURNING_FROM_MODAL_KEY);

  const anchorMessageId = consumeReturnAnchorMessageId();

  let tries = 0;
  const maxTries = 40;

  const tick = () => {
    tries += 1;

    if (anchorMessageId) {
      const anchorEl = document.querySelector(
        `[data-story-message-id="${anchorMessageId}"]`
      ) as HTMLElement | null;

      if (anchorEl) {
        anchorEl.scrollIntoView({ block: 'center' });
        restoreScrollSoon();
        return;
      }
    }

    const ok = restoreScrollSoon();
    if (ok && pendingScrollRestoreRef.current != null) {
      return;
    }

    if (tries < maxTries) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
}, [location.key, displayedMessages.length]);





  function makeQuestionKey(cId: string | undefined, ch: number, lm: number) {
    return `${cId ?? 'no-course'}::ch${ch}::q${lm}`;
  }

  function getAttempt(questionKey: string) {
    return attemptByQuestion[questionKey] ?? 0;
  }

  function incAttempt(questionKey: string) {
    setAttemptByQuestion((prev) => ({ ...prev, [questionKey]: (prev[questionKey] ?? 0) + 1 }));
  }

  function resetAttempt(questionKey: string) {
    setAttemptByQuestion((prev) => {
      if (!(questionKey in prev)) return prev;
      const copy = { ...prev };
      delete copy[questionKey];
      return copy;
    });
  }

function resetToStart() {
  runtime.bumpRun();
  runtime.cancelAll();

  setDisplayedMessages([]);
  setCurrentMessageIndex(0);
  setChapter(0);
  setAttemptByQuestion({});
  setIsPaused(false);
  setAmyIsSpeaking(false);
  setShowAdultHint(false);
setShowNextChapterLockedHint(false);
setNextChapterLockedReason(null);
setDismissedNextChapterLockedHint(false);
setPhase('playing');
  suspendAutoScrollRef.current = false;
setSuspendAutoScrollTick((v) => v + 1);
setNextChapterLockedReason(null);
}


  useEffect(() => {
    if (!course || !courseId || !episodeMeta || courseLoading) return;

    const returning = sessionStorage.getItem('story-returning-from-modal') === '1';

    if ((location.state as any)?.backgroundLocation) return;

    const epId = (episodeMeta as any).episodeId ?? (episodeMeta as any).id ?? 'ep';
    const currentChapterKey = `${courseId}:${epId}:c${String(chapter ?? 0).padStart(2, '0')}`;

    if (runtime.restoreOnceRef.current[currentChapterKey]) return;
    if (restoreLockedRef.current) return;
    restoreLockedRef.current = true;

    runtime.bumpRun();
    runtime.cancelAll();

  const sessionSnap =
  courseId && episodeMeta
    ? loadLatestStorySnapshotFromSession({
        seasonId: episodeMeta.seasonId,
        episodeId: episodeMeta.episodeId,
        courseId,
      })
    : null;


if (sessionSnap?.displayedMessages?.length) {
  const snapChapter = sessionSnap.chapter ?? 0;
  const snapPhase = (sessionSnap.phase ?? 'playing') as StoryPhase;

  const snapKey = `${courseId}:${epId}:c${String(snapChapter).padStart(2, '0')}`;
  if (runtime.restoreOnceRef.current[snapKey]) return;

  displayedRef.current = sessionSnap.displayedMessages;
  setDisplayedMessages(sessionSnap.displayedMessages);
  skipInstantOnceRef.current = true;

  setChapter(snapChapter);
  setCurrentMessageIndex(sessionSnap.currentMessageIndex ?? 0);
  setPhase(snapPhase);
  setAttemptByQuestion(sessionSnap.attemptByQuestion ?? {});
  setShowResumeDialog(false);
  setResumeMode(null);
  setIsPaused(false);
  setAmyIsSpeaking(false);

if (snapPhase === 'finished') {
  const gateState = shouldAdvanceFromFinishedSnapshot({
    courseId,
    course,
    currentChapterIndex0: snapChapter,
  });

  if (gateState) {
    setChapter(gateState.nextChapterIndex0);
    setCurrentMessageIndex(0);
    setPhase('playing');
    setShowNextChapterLockedHint(false);
    setDismissedNextChapterLockedHint(false);
  } else {
    const fallbackGateState = getNextChapterGateState({
      courseId,
      course,
      currentChapterIndex0: snapChapter,
      bypassAll: false,
      maxPerWeek: 5,
    });

    setShowNextChapterLockedHint(fallbackGateState.shouldShowLockedHint);
setNextChapterLockedReason(
  fallbackGateState.blockedReason === 'daily_limit' || fallbackGateState.blockedReason === 'weekly_limit'
    ? fallbackGateState.blockedReason
    : null
);
setDismissedNextChapterLockedHint(false);
  }
} else {
  setShowNextChapterLockedHint(false);
  setNextChapterLockedReason(null);
  setDismissedNextChapterLockedHint(false);
}

  runtime.restoreOnceRef.current[snapKey] = true;
  runtime.schedule(() => restoreScrollSoon(), 0);
  return;
}

const snap = pickLatestTranscriptSnapshotFromProfile(
  profile,
  episodeMeta.seasonId,
  episodeMeta.episodeId
);


if (snap?.displayedMessages?.length) {
  const snapChapter = snap.chapter ?? 0;
  const snapMessages = course.script[snapChapter]?.messages ?? [];
  const snapStopIndex = getStopIndex(snapMessages);

  displayedRef.current = snap.displayedMessages;
  setDisplayedMessages(snap.displayedMessages);
  skipInstantOnceRef.current = true;

  setChapter(snapChapter);
  setAttemptByQuestion(snap.attemptByQuestion ?? {});
  setShowResumeDialog(false);
  setResumeMode(null);
  setIsPaused(false);
  setAmyIsSpeaking(false);

  const snapPhase = (snap.phase ?? 'playing') as StoryPhase;
  setPhase(snapPhase);

  if (snapPhase === 'awaiting_answer') {
    setCurrentMessageIndex(snapStopIndex);
  } else {
    setCurrentMessageIndex(snap.currentMessageIndex ?? snapMessages.length);
  }

if (snapPhase === 'finished') {
  const gateState = shouldAdvanceFromFinishedSnapshot({
    courseId,
    course,
    currentChapterIndex0: snapChapter,
  });

  if (gateState) {
    setChapter(gateState.nextChapterIndex0);
    setCurrentMessageIndex(0);
    setPhase('playing');
    setShowNextChapterLockedHint(false);
    setNextChapterLockedReason(null);
    setDismissedNextChapterLockedHint(false);
  } else {
    const fallbackGateState = getNextChapterGateState({
      courseId,
      course,
      currentChapterIndex0: snapChapter,
      bypassAll: false,
      maxPerWeek: 5,
    });

    setShowNextChapterLockedHint(fallbackGateState.shouldShowLockedHint);
    setNextChapterLockedReason(
      fallbackGateState.blockedReason === 'daily_limit' || fallbackGateState.blockedReason === 'weekly_limit'
        ? fallbackGateState.blockedReason
        : null
    );
    setDismissedNextChapterLockedHint(false);
  }
} else {
  setShowNextChapterLockedHint(false);
  setNextChapterLockedReason(null);
  setDismissedNextChapterLockedHint(false);
}

  runtime.schedule(() => restoreScrollSoon(), 0);
  return;
}

    if (returning) return;

    const p = getProgress(courseId);

    if (p) {
      const totalChapters = course.script.length || 1;
      const completedCount = getCompletedChapterCount(courseId);
const pct = p.finished ? 100 : Math.floor((completedCount / totalChapters) * 100);

      if (pct >= 100) {
        setResumeMode('complete');
        setShowResumeDialog(true);
        setIsPaused(true);
      } else if (pct > 0) {
        setResumeMode('partial');
        setShowResumeDialog(true);
        setIsPaused(true);
      } else {
        if (displayedMessages.length === 0) resetToStart();
      }
    } else {
      if (displayedMessages.length === 0) resetToStart();
    }
  }, [course, courseId, episodeMeta, courseLoading, location.state, chapter]);

  type SceneTone = 'private' | 'class' | 'newsroom';

  type MsgGroup = {
    tone: SceneTone;
    labelKey: string;
    title: string;
    participants: string[];
    items: Message[];
  };

  const toneToBg = (tone: SceneTone) => {
    switch (tone) {
      case 'class':
        return 'chat-bg-class';
      case 'newsroom':
        return 'chat-bg-newsroom';
      default:
        return 'chat-bg-private';
    }
  };



  const grouped = useMemo<MsgGroup[]>(() => {
    const groups: MsgGroup[] = [];

    let currentTone: SceneTone = 'private';
    let currentLabelKey = 'chatSwitch.private';
    let currentTitle = '';
    let currentParticipants: string[] = [];

    for (const m of displayedMessages) {
      if (m.type === 'system' && m.kind === 'chat-switch' && (m as any).scene) {
        const scene = (m as any).scene;
        currentTone = scene.tone;
        currentLabelKey = scene.labelKey ?? 'chatSwitch.private';
        currentTitle = (scene.title ?? '').trim();
        currentParticipants = (scene.participants ?? []).map((p: any) => p.name);

        groups.push({
          tone: currentTone,
          labelKey: currentLabelKey,
          title: currentTitle,
          participants: currentParticipants,
          items: [m],
        });
        continue;
      }

      if (groups.length === 0) {
        groups.push({
          tone: currentTone,
          labelKey: currentLabelKey,
          title: currentTitle,
          participants: currentParticipants,
          items: [],
        });
      }

      groups[groups.length - 1].items.push(m);
    }

    return groups;
  }, [displayedMessages]);

  const activeGroup = grouped.length ? grouped[grouped.length - 1] : null;
  const sceneTone: SceneTone = activeGroup?.tone ?? 'private';
  const sceneTitle = activeGroup?.title ?? '';
  const sceneParticipants = activeGroup?.participants ?? [];

useEffect(() => {
  if (!courseId || !episodeMeta) return;
  if (displayedMessages.length === 0) return;
  if (pendingScrollRestoreRef.current == null) return;

  const id = requestAnimationFrame(() => {
    restoreScrollSoon();
  });

  return () => cancelAnimationFrame(id);
}, [displayedMessages.length, chapter, phase, courseId, episodeMeta]);





  useEffect(() => {
    if (!isInstant) return;
    if (isPaused || amyIsSpeaking) return;
    if (!course || allMessages.length === 0) return;
    if (phase !== 'playing') return;

    if (skipInstantOnceRef.current) {
      skipInstantOnceRef.current = false;
      return;
    }

    if (currentMessageIndex >= stopIndex) {
      setPhase('awaiting_answer');
      return;
    }

    const missing = allMessages.slice(currentMessageIndex, stopIndex);

    setDisplayedMessages((prev) => {
      const after = mergeUniqueById(prev, missing);
      displayedRef.current = after;
      return after;
    });

    setCurrentMessageIndex(stopIndex);
    setPhase('awaiting_answer');
  }, [isInstant, isPaused, amyIsSpeaking, course, allMessages, currentMessageIndex, stopIndex, phase]);


useEffect(() => {
  if (!showNextChapterLockedHint) return;
  if (dismissedNextChapterLockedHint) return;

  // Kein automatischer Scroll zum Hinweis:
  // Amy-Antwort soll erst in Ruhe lesbar bleiben.
  suspendAutoScrollRef.current = true;
  setSuspendAutoScrollTick((v) => v + 1);
}, [showNextChapterLockedHint, dismissedNextChapterLockedHint]);


  useEffect(() => {
    if (isInstant) return;
    if (isPaused || amyIsSpeaking) return;
    if (!course) return;
    if (phase !== 'playing') return;

    const msgs = course.script[chapter]?.messages ?? [];
    if (msgs.length === 0) return;

    if (currentMessageIndex >= msgs.length) return;

    if (currentMessageIndex >= stopIndex) {
      setPhase('awaiting_answer');
      return;
    }

    const nextMsg = msgs[currentMessageIndex];
    const runId = runtime.runIdRef.current;

    const timerId = runtime.schedule(() => {
      if (!runtime.isActive(runId)) return;

      setDisplayedMessages((prev) => {
        const after = mergeUniqueById(prev, [nextMsg]);
        displayedRef.current = after;
        return after;
      });

      setCurrentMessageIndex((prev) => prev + 1);
    }, calcDelayForText(nextMsg.content ?? '', !!(nextMsg as any).image));

    return () => {
      runtime.cancel(timerId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter, currentMessageIndex, stopIndex, isInstant, isPaused, amyIsSpeaking, course, phase]);

  const cliffPlayedRef = useRef(false);
  const cliffPlayingRef = useRef(false);

  async function playEpilogueIfAny(runId: number) {
    if (!course) return;
    if (!course.epilogue || course.epilogue.length === 0) return;
    if (cliffPlayedRef.current) return;
    if (cliffPlayingRef.current) return;

    cliffPlayingRef.current = true;

    if (readingMode === 'instant') {
      if (!runtime.isActive(runId)) return;
      setDisplayedMessages((prev) => {
        const after = mergeUniqueById(prev, course.epilogue!);
        displayedRef.current = after;
        return after;
      });
      cliffPlayedRef.current = true;
      cliffPlayingRef.current = false;
      return;
    }

    for (let i = 0; i < course.epilogue.length; i++) {
      if (!runtime.isActive(runId)) {
        cliffPlayingRef.current = false;
        return;
      }

      const msg = course.epilogue[i] as any;
      const text = typeof msg.content === 'string' ? msg.content : '';
      const delay = i === 0 ? 200 : calcDelayForText(text, !!msg.image);

      const still = await runtime.sleep(delay, runId);
      if (!still) {
        cliffPlayingRef.current = false;
        return;
      }

      setDisplayedMessages((prev) => {
        const after = mergeUniqueById(prev, [msg]);
        displayedRef.current = after;
        return after;
      });
    }

    cliffPlayedRef.current = true;
    cliffPlayingRef.current = false;
  }

  const startOver = () => {
    runtime.bumpRun();
    runtime.cancelAll();

    if (courseId) clearProgress(courseId);
    setShowResumeDialog(false);
    setResumeMode(null);
    resetToStart();
  };

  const continueFromProgress = () => {
    if (!courseId || !course) return;

    runtime.bumpRun();
    runtime.cancelAll();

    const p = getProgress(courseId);
    setShowResumeDialog(false);
    setResumeMode(null);

    if (!p) {
      resetToStart();
      return;
    }

    const total = course.script.length;
    const isFinished = p.finished;

    const targetChapter = Math.min(
  Math.max(0, isFinished ? total - 1 : (p.unlockedEpisode - 1)),
  Math.max(0, total - 1)
);

const { messages } = buildTranscriptUpTo({
  course,
  targetChapter,
  includeFinishedChapters: true,
  answers: p.answers || [],
  safetySelfHarmText: SAFETY_SELF_HARM_SHORT,
});

    displayedRef.current = messages;
    setDisplayedMessages(messages);

    if (!isFinished) {
      setChapter(targetChapter);

      const lastMainIdxCurrent = (() => {
        const m = course.script[targetChapter]?.messages ?? [];
        for (let i = m.length - 1; i >= 0; i--) if (m[i].type === 'main') return i;
        return -1;
      })();

      const startIdx = lastMainIdxCurrent > -1 ? lastMainIdxCurrent : course.script[targetChapter]?.messages?.length ?? 0;

      setCurrentMessageIndex(startIdx);
      setPhase('awaiting_answer');
    } else {
      setChapter(total - 1);
      setCurrentMessageIndex(course.script[total - 1].messages.length);
      setPhase('finished');
    }

    setIsPaused(false);
    setAmyIsSpeaking(false);
  };

  const rewatchFinishedChat = () => {
    if (!courseId || !course) return;

    runtime.bumpRun();
    runtime.cancelAll();

    const p = getProgress(courseId);
    setShowResumeDialog(false);
    setResumeMode(null);

    const answers = p?.answers || [];

    const full = buildFullTranscript({
      course,
      answers,
      safetySelfHarmText: SAFETY_SELF_HARM_SHORT,
    });

    displayedRef.current = full;
    setDisplayedMessages(full);
    setChapter(course.script.length - 1);
    setCurrentMessageIndex(course.script[course.script.length - 1].messages.length);
    setPhase('finished');
    setIsPaused(false);
    setAmyIsSpeaking(false);
  };

  const renderResumeDialog = () => {
    if (!resumeMode) return null;

    if (resumeMode === 'complete') {
      return (
        <ConfirmDialog
          open={showResumeDialog}
          title={tStories('resume.doneTitle', { defaultValue: 'Du hast diesen Kurs bereits fertiggestellt.' })}
          description={tStories('resume.doneDesc', {
            defaultValue: 'Möchtest du den Chatverlauf erneut ansehen oder neu starten?',
          })}
          primaryLabel={tStories('resume.rewatch', { defaultValue: 'Nochmal ansehen' })}
          secondaryLabel={tStories('resume.restart', { defaultValue: 'Neu starten' })}
          onPrimary={rewatchFinishedChat}
          onSecondary={startOver}
          onClose={() => {
            setShowResumeDialog(false);
            setIsPaused(false);
            setAmyIsSpeaking(false);
          }}
        />
      );
    }

    return (
      <ConfirmDialog
        open={showResumeDialog}
        title={tStories('resume.continueTitle', { defaultValue: 'Möchtest du fortfahren?' })}
        description={tStories('resume.continueDesc', {
          defaultValue: 'Es gibt einen gespeicherten Fortschritt. Fortfahren oder neu starten?',
        })}
        primaryLabel={tStories('resume.continue', { defaultValue: 'Fortfahren' })}
        secondaryLabel={tStories('resume.restart', { defaultValue: 'Neu starten' })}
        onPrimary={continueFromProgress}
        onSecondary={startOver}
        onClose={() => {
          setShowResumeDialog(false);
          setIsPaused(false);
          setAmyIsSpeaking(false);
        }}
      />
    );
  };

  if (courseLoading) {
    return (
      <Layout backPath="/stories" hideFooter>
        <div className="w-full max-w-4xl px-4 py-12">
          <p>{tStories('loading.story', { defaultValue: 'Lade Story…' })}</p>
        </div>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout backPath="/stories" hideFooter>
        <div className="w-full max-w-4xl px-4 py-12">
          <h2 className="text-3xl font-bold mb-4">
            {tStories('error.notFoundTitle', { defaultValue: 'Kurs nicht gefunden' })}
          </h2>
          <p>{tStories('error.notFoundBody', { defaultValue: 'Der angeforderte Kurs konnte nicht gefunden werden.' })}</p>
        </div>
      </Layout>
    );
  }


  return (
    <Layout backPath="/stories">
      <style>{`
        .ios-anti-zoom { -webkit-text-size-adjust: 100%; }
        .ios-anti-zoom input, .ios-anti-zoom textarea, .ios-anti-zoom select, .ios-anti-zoom button {
          font-size: 16px !important;
          line-height: 1.4;
        }
      `}</style>

      {cardToast ? (
        <UnlockedToast
          title={cardToast.title}
          subtitle={cardToast.subtitle}
          onDismiss={() => setCardToast(null)}
          onOpen={() => {
            const id = cardToast.bonusId;
            setCardToast(null);
            openUnlockedCard(id);
          }}
        />
      ) : null}

      {renderResumeDialog()}

      <div
        ref={shellRef}
        className="ios-anti-zoom flex flex-col w-full h-[100dvh] overflow-hidden min-h-0
                   sm:items-center sm:justify-center sm:w-[420px] md:w-[480px] sm:p-4"
      >
        <Phone
          showHeader={Boolean(episodeMeta)}
          scrollRef={chatScrollRef}
          autoScroll={!isInstant && !suspendAutoScrollRef.current}
          headerTitle={headerTitle}
          headerSubtitle={headerSubtitle}
          headerAvatarSrc={headerAvatarSrc}
          sceneTone={sceneTone}
          sceneTitle={sceneTitle}
          sceneParticipants={sceneParticipants}
          inputPlaceholder={tStories('input.placeholder', { defaultValue: 'Deine Antwort…' })}
          headerAvatarTargetAttr="header-avatar"
          onSubmitMessage={async (message) => {
            if (!isAwaiting || amyIsSpeaking) return;

            const runId = runtime.bumpRun();
            runtime.cancelAll();

            if (import.meta.env.DEV) {
              if (questionIndex < 0 || tipIndex < 0 || tipIndex !== questionIndex + 1) {
                console.error('Malformed chapter: amy-question/amy-tip missing or not adjacent');
                return;
              }
            }

            const trimmed = (message ?? '').trim();
            if (!trimmed) return;

            setPhase('resolving');
            setAmyIsSpeaking(true);

            const msgs = allMessagesRef.current;
const safeQuestionText = getQuestionText(msgs, chapterLabel).trim();
const safeTipText = getTipText(msgs, chapterLabel).trim();
const qIdx = getQuestionIndex(msgs, chapterLabel);
            const questionKey = makeQuestionKey(courseId, chapterRef.current, qIdx >= 0 ? qIdx : 0);
            const attemptCount = getAttempt(questionKey);

            const userMsg: Message = {
              id: `user-${Date.now()}`,
              type: 'user',
              content: trimmed,
            };

            const afterUser = mergeUniqueById(displayedRef.current, [userMsg]);
            displayedRef.current = afterUser;
            setDisplayedMessages(afterUser);

            const tKey =
  courseId && episodeMeta
    ? buildStoryTranscriptKey(episodeMeta.seasonId, episodeMeta.episodeId, chapterRef.current)
    : null;

            if (tKey) {
              saveTranscriptSnapshot(tKey, afterUser, { phase: 'resolving' });
            }

            const result = await runAmy({
              userAnswer: trimmed,
              questionText: safeQuestionText,
              tipText: safeTipText,
              episodeId: courseId,
              chapterIndex: chapterRef.current,
              language: lang,
              attemptCount,
              useMLKeyIdea: true,
            });

            if (!runtime.isActive(runId)) return;

            const wasAlreadyCompletedBeforeAnswer =
            courseId ? hasCompletedChapter(courseId, chapterRef.current) : false;


            if (courseId) pushAnswer(courseId, chapterRef.current, trimmed);

            const amyText = (result.amyReplyText ?? '').trim();

            let afterAmy = displayedRef.current;
            if (amyText) {
              const amyMsg: Message = {
                id: `amy-${Date.now()}`,
                type: 'main',
                speaker: AMY_SPEAKER,
                kind: result.contentFlags?.selfHarm ? 'safety-self-harm' : undefined,
                content: amyText,
              };

              afterAmy = mergeUniqueById(displayedRef.current, [amyMsg]);
              displayedRef.current = afterAmy;
              setDisplayedMessages(afterAmy);
            }

const tKeyAfterAmy =
  courseId && episodeMeta
    ? buildStoryTranscriptKey(episodeMeta.seasonId, episodeMeta.episodeId, chapterRef.current)
    : null;


            if (tKeyAfterAmy) {
              saveTranscriptSnapshot(tKeyAfterAmy, afterAmy, { phase: 'resolving' });
            }

            const amyDelay = amyText ? calcDelayForText(amyText) : 250;

            runtime.schedule(() => {
              if (!runtime.isActive(runId)) return;

              setAmyIsSpeaking(false);

              if (result.action === 'RETRY') {
                setShowAdultHint(false);
                incAttempt(questionKey);
                setPhase('awaiting_answer');
                return;
              }

              if (result.action === 'ADULT_GATE') {
                setShowAdultHint(result.offlineHint === true);
                incAttempt(questionKey);
                setPhase('awaiting_answer');
                return;
              }

              if (result.action === 'SILENT_LOCK') {
                setShowAdultHint(result.offlineHint === true);
                incAttempt(questionKey);
                setPhase('awaiting_answer');
                return;
              }
              

              setPhase('unlocked');
              setShowAdultHint(false);
              resetAttempt(questionKey);

              const rest = allMessagesRef.current.slice(stopIndexRef.current);

              if (isInstant) {
                const afterUnlock = mergeUniqueById(displayedRef.current, rest);
                displayedRef.current = afterUnlock;
                setDisplayedMessages(afterUnlock);

                const chapterLen = allMessagesRef.current.length;
                setCurrentMessageIndex(chapterLen);

                const tk =
  courseId && episodeMeta
    ? buildStoryTranscriptKey(episodeMeta.seasonId, episodeMeta.episodeId, chapterRef.current)
    : null;

                if (tk) {
                  saveTranscriptSnapshot(tk, afterUnlock, {
                    phase: 'unlocked',
                    currentMessageIndex: chapterLen,
                  });
                }
              } else {
                setCurrentMessageIndex(stopIndexRef.current);

                const tk =
  courseId && episodeMeta
    ? buildStoryTranscriptKey(episodeMeta.seasonId, episodeMeta.episodeId, chapterRef.current)
    : null;

                if (tk) {
                  saveTranscriptSnapshot(tk, displayedRef.current, {
                    phase: 'unlocked',
                    currentMessageIndex: stopIndexRef.current,
                  });
                }
              }

let completionResult:
  | ReturnType<typeof completeStoryChapter>
  | null = null;

if (courseId && course && episodeMeta) {
completionResult = completeStoryChapter({
  courseId,
  chapterIndex0: chapterRef.current,
  chapterCount: course.script.length,
  episodeMeta,
  updateProfile,
  wasAlreadyCompletedBeforeAnswer,
  enableDebug: import.meta.env.DEV,
});

  if (completionResult.progressDebug) {
    setProgressDebug(completionResult.progressDebug);
  }

  if (import.meta.env.DEV) {
    const pAfterComplete = getProgress(courseId);
    console.log('[Story][after completeStoryChapter]', {
      currentChapter: chapterRef.current,
      unlockedEpisode: pAfterComplete?.unlockedEpisode,
      finished: pAfterComplete?.finished,
      answers: pAfterComplete?.answers,
    });
  }

  if (completionResult.newlyUnlockedCardIds.length > 0) {
    showCardToastIfNeeded(completionResult.newlyUnlockedCardIds);
  }

  if (completionResult.coinAwarded) {
    runtime.schedule(() => {
      if (!runtime.isActive(runId)) return;
      const el = chapterEndBubbleRef.current;
      if (!el) return;
      flyCoinFromRect(el.getBoundingClientRect());
    }, 16);
  }

  if (completionResult.isEpisodeFinishedNow && completionResult.stickerAwarded) {
    runtime.schedule(() => {
      if (!runtime.isActive(runId)) return;
      const el = chapterEndBubbleRef.current;
      if (!el) return;

      const targetEl = document.querySelector('[data-reward-target="profile-avatar"]') as HTMLElement | null;
      const toRect = targetEl?.getBoundingClientRect();

      flyStickerFromRect(el.getBoundingClientRect(), assetUrl(episodeMeta.stickerImage), {
        toRect,
        durationMs: 2600,
      });
    }, 280);
  }
}

  if (completionResult?.starterStickerAwarded) {
    runtime.schedule(() => {
      if (!runtime.isActive(runId)) return;
      const el = chapterEndBubbleRef.current;
      if (!el) return;

      const targetEl = document.querySelector('[data-reward-target="profile-avatar"]') as HTMLElement | null;
      const toRect = targetEl?.getBoundingClientRect();

      flyStickerFromRect(
        el.getBoundingClientRect(),
        assetUrl('media/stickers/special/starter-first-5-512.webp'),
        {
          toRect,
          durationMs: 2600,
        }
      );
    }, 280);
  }

  if (completionResult?.weeklyBadgeAwarded) {
    runtime.schedule(() => {
      if (!runtime.isActive(runId)) return;
      const el = chapterEndBubbleRef.current;
      if (!el) return;

      const targetEl = document.querySelector('[data-reward-target="profile-avatar"]') as HTMLElement | null;
      const toRect = targetEl?.getBoundingClientRect();

      flyStickerFromRect(
        el.getBoundingClientRect(),
        assetUrl('media/stickers/badges/weekly-streak-5-512.webp'),
        {
          toRect,
          durationMs: 2600,
        }
      );
    }, 280);
  }

const isEpisodeFinishedNow = completionResult?.isEpisodeFinishedNow ?? false;


              if (isEpisodeFinishedNow) {
                setPhase('finished');

                runtime.schedule(() => {
                  if (!runtime.isActive(runId)) return;
                  void playEpilogueIfAny(runId);
                }, 350);

                setCurrentMessageIndex(allMessagesRef.current.length);
                return;
              }

runtime.schedule(() => {
  if (!runtime.isActive(runId)) return;
  if (!course) return;

  const currentChapter = chapterRef.current;

  const decision = decideNextStoryStep({
    courseId,
    course,
    currentChapterIndex0: currentChapter,
    bypassAll: false,
    maxPerWeek: 5,
  });

  setGateDebug(decision.gateDebug);

  if (decision.type === 'finish_episode') {
    setCurrentMessageIndex(allMessagesRef.current.length);
    setPhase('finished');
    setShowNextChapterLockedHint(false);
    setNextChapterLockedReason(null);
    setDismissedNextChapterLockedHint(false);
    return;
  }

  if (decision.type === 'structural_block') {
    setCurrentMessageIndex(allMessagesRef.current.length);
    setPhase('finished');
    setShowNextChapterLockedHint(false);
    setNextChapterLockedReason(null);
    setDismissedNextChapterLockedHint(false);

    const currentKey =
      courseId && episodeMeta
        ? buildStoryTranscriptKey(episodeMeta.seasonId, episodeMeta.episodeId, currentChapter)
        : null;

    if (currentKey) {
      saveTranscriptSnapshot(currentKey, displayedRef.current, {
        chapter: currentChapter,
        currentMessageIndex: allMessagesRef.current.length,
        phase: 'finished',
        attemptByQuestion: attemptByQuestionRef.current,
      });
    }

    return;
  }

  if (decision.type === 'time_block') {
    setCurrentMessageIndex(allMessagesRef.current.length);
    setPhase('finished');
    setDismissedNextChapterLockedHint(false);
    setNextChapterLockedReason(decision.blockedReason ?? null);
    setShowNextChapterLockedHint(decision.shouldShowLockedHint);

    const currentKey =
      courseId && episodeMeta
        ? buildStoryTranscriptKey(episodeMeta.seasonId, episodeMeta.episodeId, currentChapter)
        : null;

    if (currentKey) {
      saveTranscriptSnapshot(currentKey, displayedRef.current, {
        chapter: currentChapter,
        currentMessageIndex: allMessagesRef.current.length,
        phase: 'finished',
        attemptByQuestion: attemptByQuestionRef.current,
      });
    }

    return;
  }

  if (decision.type === 'advance') {
    const nextChapter = decision.nextChapterIndex0;

    setShowNextChapterLockedHint(false);
    setNextChapterLockedReason(null);
    setDismissedNextChapterLockedHint(false);
    setChapter(nextChapter);
    setCurrentMessageIndex(0);
    setPhase('playing');

    const nextKey =
      courseId && episodeMeta
        ? buildStoryTranscriptKey(episodeMeta.seasonId, episodeMeta.episodeId, nextChapter)
        : null;

    if (nextKey) {
      saveTranscriptSnapshot(nextKey, displayedRef.current, {
        chapter: nextChapter,
        currentMessageIndex: 0,
        phase: 'playing',
        attemptByQuestion: attemptByQuestionRef.current,
      });
    }
  }
}, 600);


            }, amyDelay);
          }}
        >
          <div className="w-full text-center my-2 flex flex-col items-center gap-2">
            <div className="text-xs text-gray-600">{tStories('ui.readingMode', { defaultValue: 'Anzeige-Modus:' })}</div>
            <div className="flex gap-4 items-center">
              <label className="text-xs text-gray-700 flex items-center gap-2">
                <input type="radio" name="readingMode" checked={readingMode === 'cinematic'} onChange={() => setReadingMode('cinematic')} />
                {tStories('ui.readingModeLive', { defaultValue: 'Live-Chat' })}
              </label>
              <label className="text-xs text-gray-700 flex items-center gap-2">
                <input type="radio" name="readingMode" checked={readingMode === 'instant'} onChange={() => setReadingMode('instant')} />
                {tStories('ui.readingModeInstant', { defaultValue: 'Sofort anzeigen' })}
              </label>
            </div>
          </div>

          {readingMode === 'cinematic' && (
            <div className="w-full text-center my-4 flex flex-col items-center">
              <span className="text-gray-600 text-xs mb-1">{tStories('ui.speedLabel', { defaultValue: 'Lesegeschwindigkeit wählen:' })}</span>
              <div className="flex gap-3">
                {speedOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSpeedMultiplier(opt.value)}
                    className={[
                      'text-xs underline-offset-2',
                      speedMultiplier === opt.value ? 'font-semibold underline' : 'text-gray-500 hover:text-gray-700',
                    ].join(' ')}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {showAdultHint && (
            <div className="mx-auto my-3 max-w-[520px] rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              <div className="font-semibold mb-1">{tStories('adultHint.title', { defaultValue: 'Hinweis' })}</div>
              <div>{tStories('adultHint.body', { defaultValue: 'Bitte hol dir Unterstützung von einem Erwachsenen.' })}</div>
            </div>
          )}



          {grouped.map((g, gi) => (
            <div key={`g-${gi}`} className={['chat-group', `chat-group--${g.tone}`].join(' ')}>
              <div className="mb-2 flex items-center gap-2 text-[11px] text-slate-500">
                <span aria-hidden>{g.tone === 'private' ? '🔒' : g.tone === 'class' ? '🏫' : '📰'}</span>
                <span className="font-medium shrink-0">{tStoriesKeyMaybeNamespaced(g.labelKey)}</span>
                <span className="truncate text-slate-400">{g.title ? g.title : g.participants.length ? g.participants.join(', ') : ''}</span>
              </div>

              <div className={['rounded-2xl p-3', toneToBg(g.tone)].join(' ')}>
                {g.items.map((m, idx) => {
                  const isLast = gi === grouped.length - 1 && idx === g.items.length - 1;
                  const attachRef = isLast && m.type === 'main';
                  const key = `${chapter}-${m.id ?? `g${gi}-i${idx}`}-${gi}-${idx}`;

return (
  <div
    key={key}
    data-story-message-id={m.id ?? key}
    ref={attachRef ? chapterEndBubbleRef : null}
  >
    <ChatMessage
  message={m}
  onOpenBonusLink={({ linkTo, bonusId }) => {
    sessionStorage.setItem(STORY_RETURNING_FROM_MODAL_KEY, '1');

    const anchorMessageId = m.id ?? key;
    saveReturnAnchorMessageId(anchorMessageId);

    suspendAutoScrollRef.current = true;
    setSuspendAutoScrollTick((v) => v + 1);

    persistScrollNow();
    persistLatestSnapNow(displayedRef.current);

    if (bonusId) unlockBonusById(bonusId);

    runtime.bumpRun();
    runtime.cancelAll();

    navigate(linkTo, {
      state: {
        backgroundLocation: location,
        backTo: location.pathname + location.search + location.hash,
      },
    });
  }}
/>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}


{import.meta.env.DEV && (
  <div className="mx-auto my-2 max-w-[560px] text-[11px] text-slate-500">
    hint: {String(showNextChapterLockedHint)} | dismissed: {String(dismissedNextChapterLockedHint)} | phase: {phase}
  </div>
)}

{import.meta.env.DEV && gateDebug && (
  <div className="mx-auto my-2 max-w-[560px] text-[11px] text-amber-700">
    gate: {gateDebug}
  </div>
)}

{import.meta.env.DEV && progressDebug && (
  <div className="mx-auto my-2 max-w-[560px] text-[11px] text-emerald-700">
    progress: {progressDebug}
  </div>
)}

{showNextChapterLockedHint && (
  <div className="mx-auto my-3 max-w-[560px] rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="font-semibold mb-1">
          {tStories('gate.nextTomorrowTitle', { defaultValue: 'Für heute bist du fertig ✨' })}
        </div>
        <div>
{nextChapterLockedReason === 'weekly_limit'
  ? tStories('gate.nextMondayBody', {
      defaultValue:
        'Diese Woche hast du alle Amics gelesen. Der nächste Amic wartet Montag wieder auf dich. Bis dahin kannst du in der Schülerzeitung stöbern.',
    })
  : tStories('gate.nextTomorrowBody', {
      defaultValue: 'Der nächste Amic wartet morgen auf dich.',
    })}
        </div>
      </div>



      <button
        type="button"
onClick={() => {
  setDismissedNextChapterLockedHint(true);
  setShowNextChapterLockedHint(false);
  setNextChapterLockedReason(null);
}}
        className="shrink-0 rounded-xl border border-sky-200 bg-white px-3 py-1 text-xs font-semibold text-sky-900 hover:bg-sky-100"
      >
        {tStories('common.close', { defaultValue: 'Schließen' })}
      </button>
    </div>
                 <div className="mt-3">
<button
  type="button"
  onClick={() => {
    persistScrollNow();
    persistLatestSnapNow(displayedRef.current);

    runtime.bumpRun();
    runtime.cancelAll();

    navigate('/newspaper');
  }}
  className="inline-flex items-center justify-center rounded-xl border border-sky-200 bg-white px-3 py-2 text-xs font-semibold text-sky-900 hover:bg-sky-100"
>
  {tStories('gate.toNewspaper', { defaultValue: 'Zur Schülerzeitung →' })}
</button>
        </div> 
  </div>
)}



          <div ref={endRef} />
        </Phone>
      </div>
    </Layout>
  );
}
