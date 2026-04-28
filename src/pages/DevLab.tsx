// src/pages/DevLab.tsx
// DEV-only test laboratory — not included in production builds.
// Accessible at /#/dev

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Layout from '../components/Layout';
import { runAmy } from '../ai/orchestrator/runAmy';
import type { AmyRunOutput } from '../ai/orchestrator/types';
import { CONTENT_INDEX } from '../content/contentIndex';
import { loadProfile, clearProfile, saveProfile } from '../profile/storage';
import { STICKER_CATALOG } from '../progress/rewardCatalog';
import { createDefaultProfile } from '../profile/defaultProfile';

// ─── helpers ─────────────────────────────────────────────────────────────────

function sessionKey(seasonId: string, episodeId: string, courseId: string) {
  return `story-v02-session-${seasonId}-${episodeId}-${courseId}`;
}

function injectSnapshot(
  seasonId: string,
  episodeId: string,
  courseId: string,
  chapterIndex0: number
) {
  const snap = {
    courseId,
    chapterId: '',
    chapterIndex0,
    stepIndex0: 0,
    phase: 'playing_story',
    storyCursor: { messageIndex0: 0 },
    transcript: [],
    completedStepIds: [],
    updatedAt: Date.now(),
  };
  try {
    sessionStorage.setItem(sessionKey(seasonId, episodeId, courseId), JSON.stringify(snap));
  } catch {/**/}
}

// ─── sub-components ──────────────────────────────────────────────────────────

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">{title}</h2>
      {children}
    </section>
  );
}

function Tag({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${color}`}>
      {children}
    </span>
  );
}

// ─── Section 1: Story Jumper ─────────────────────────────────────────────────

const V2_EPISODES = CONTENT_INDEX.flatMap((s) =>
  s.episodes.filter((e) => e.storyEngine === 'v2')
);

function StoryJumper() {
  const navigate = useNavigate();
  const [courseId, setCourseId] = useState(V2_EPISODES[0]?.courseId ?? 's1e01');
  const [chapter, setChapter] = useState(1); // 1-based for UI

  const meta = V2_EPISODES.find((e) => e.courseId === courseId);

  function handleJump() {
    if (!meta) return;
    injectSnapshot(meta.seasonId, meta.episodeId, meta.courseId, chapter - 1);
    navigate(`/stories-v02/${meta.courseId}`);
  }

  return (
    <SectionCard title="Story Jumper">
      <p className="mb-4 text-sm text-slate-500">
        Springt direkt in ein Kapitel — überschreibt den Session-Snapshot.
      </p>
      <div className="flex flex-wrap gap-3">
        <select
          value={courseId}
          onChange={(e) => { setCourseId(e.target.value); setChapter(1); }}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
        >
          {V2_EPISODES.map((ep) => (
            <option key={ep.courseId} value={ep.courseId}>
              {ep.courseId.toUpperCase()} ({ep.chapterCount} Kapitel)
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600">Kapitel</label>
          <input
            type="number"
            min={1}
            max={meta?.chapterCount ?? 10}
            value={chapter}
            onChange={(e) => setChapter(Math.max(1, Math.min(meta?.chapterCount ?? 10, Number(e.target.value))))}
            className="w-20 rounded-xl border border-slate-300 px-3 py-2 text-sm"
          />
          <span className="text-xs text-slate-400">von {meta?.chapterCount ?? '?'}</span>
        </div>

        <button
          type="button"
          onClick={handleJump}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          Öffnen →
        </button>
      </div>
    </SectionCard>
  );
}

// ─── Section 2: Amy Tester ────────────────────────────────────────────────────

const LABEL_COLORS: Record<string, string> = {
  A: 'bg-emerald-100 text-emerald-800',
  B: 'bg-sky-100 text-sky-800',
  C: 'bg-rose-100 text-rose-800',
  UNSICHER: 'bg-amber-100 text-amber-800',
};

const ACTION_COLORS: Record<string, string> = {
  UNLOCK: 'bg-emerald-50 text-emerald-700',
  RETRY: 'bg-amber-50 text-amber-700',
  SILENT_LOCK: 'bg-red-50 text-red-700',
  NORM_STOP: 'bg-red-50 text-red-700',
};

function AmyTester() {
  const { i18n } = useTranslation();
  const [userAnswer, setUserAnswer] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [tipText, setTipText] = useState('');
  const [attemptCount, setAttemptCount] = useState(0);
  const [lang, setLang] = useState<'de' | 'en'>('de');
  const [reflectionMode, setReflectionMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AmyRunOutput | null>(null);
  const [showDebug, setShowDebug] = useState(false);

  async function handleRun() {
    if (!userAnswer.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const out = await runAmy({
        userAnswer,
        questionText,
        tipText,
        language: lang,
        attemptCount,
        reflectionMode,
      });
      setResult(out);
    } catch (e) {
      console.error('[DevLab] runAmy failed', e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SectionCard title="Amy-Tester">
      <p className="mb-4 text-sm text-slate-500">
        Ruft <code className="rounded bg-slate-100 px-1">runAmy()</code> direkt auf — ohne Story-Kontext.
      </p>

      <div className="grid gap-3">
        {/* Language + mode */}
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <span className="text-slate-600">Sprache</span>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as 'de' | 'en')}
              className="rounded-xl border border-slate-300 px-2 py-1 text-sm"
            >
              <option value="de">Deutsch</option>
              <option value="en">English</option>
            </select>
          </label>

          <label className="flex items-center gap-2 text-sm">
            <span className="text-slate-600">Versuch</span>
            <input
              type="number"
              min={0}
              max={5}
              value={attemptCount}
              onChange={(e) => setAttemptCount(Number(e.target.value))}
              className="w-16 rounded-xl border border-slate-300 px-2 py-1 text-sm"
            />
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={reflectionMode}
              onChange={(e) => setReflectionMode(e.target.checked)}
            />
            Reflexions-Modus
          </label>
        </div>

        {/* Question */}
        <div>
          <label className="block mb-1 text-xs font-semibold text-slate-500">Amys Frage (questionText)</label>
          <input
            type="text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="z. B. Wie hättest du reagiert?"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-400"
          />
        </div>

        {/* Tip */}
        <div>
          <label className="block mb-1 text-xs font-semibold text-slate-500">Tipp-Text (tipText, optional)</label>
          <input
            type="text"
            value={tipText}
            onChange={(e) => setTipText(e.target.value)}
            placeholder="Hintergrund-Tipp für Amy…"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-400"
          />
        </div>

        {/* User answer */}
        <div>
          <label className="block mb-1 text-xs font-semibold text-slate-500">Kinder-Antwort (userAnswer) *</label>
          <textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Was das Kind geantwortet hat…"
            rows={3}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-400"
          />
        </div>

        <button
          type="button"
          onClick={handleRun}
          disabled={loading || !userAnswer.trim()}
          className="self-start rounded-xl bg-violet-700 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-600 disabled:opacity-40"
        >
          {loading ? 'Amy denkt…' : 'Testen →'}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Tag color={LABEL_COLORS[result.label] ?? 'bg-slate-100 text-slate-700'}>
              Label: {result.label}
            </Tag>
            <Tag color={ACTION_COLORS[result.action] ?? 'bg-slate-100 text-slate-700'}>
              Action: {result.action}
            </Tag>
            {result.mustReAnswer && (
              <Tag color="bg-rose-100 text-rose-700">mustReAnswer</Tag>
            )}
            {result.offlineHint && (
              <Tag color="bg-slate-100 text-slate-600">offlineHint</Tag>
            )}
            <Tag color="bg-slate-100 text-slate-600">qt: {result.questionType}</Tag>
            {result.tipRelation && (
              <Tag color="bg-slate-100 text-slate-600">rel: {result.tipRelation}</Tag>
            )}
            {result.unsicherReason && (
              <Tag color="bg-amber-50 text-amber-700">reason: {result.unsicherReason}</Tag>
            )}
          </div>

          {/* Amy reply */}
          <div>
            <div className="mb-1 text-xs font-semibold text-slate-500">Amys Antwort</div>
            <div className="rounded-xl border border-violet-200 bg-white p-3 text-sm text-slate-900 leading-relaxed">
              {result.amyReplyText || <span className="italic text-slate-400">(leer)</span>}
            </div>
          </div>

          {/* Content flags */}
          {result.contentFlags && Object.values(result.contentFlags).some(Boolean) && (
            <div>
              <div className="mb-1 text-xs font-semibold text-slate-500">Content Flags</div>
              <div className="flex flex-wrap gap-1">
                {Object.entries(result.contentFlags)
                  .filter(([, v]) => v)
                  .map(([k]) => (
                    <Tag key={k} color="bg-red-50 text-red-700">{k}</Tag>
                  ))}
              </div>
            </div>
          )}

          {/* Debug notes (collapsible) */}
          {result.debug?.notes && (
            <div>
              <button
                type="button"
                onClick={() => setShowDebug((v) => !v)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                {showDebug ? '▼ Debug ausblenden' : '▶ Debug anzeigen'}
              </button>
              {showDebug && (
                <pre className="mt-2 rounded-xl bg-slate-900 p-3 text-xs text-green-300 overflow-x-auto whitespace-pre-wrap">
                  {result.debug.notes.join('\n')}
                </pre>
              )}
            </div>
          )}
        </div>
      )}
    </SectionCard>
  );
}

// ─── Section 3: Progress Inspector ───────────────────────────────────────────

function ProgressInspector() {
  const [tick, setTick] = useState(0);
  const profile = loadProfile();
  const prog = profile.progress;

  const CATALOG_IDS = new Set(STICKER_CATALOG.map((s) => s.id));

  const earnedIds = [
    ...Object.keys(prog.earnedStickers ?? {}),
    ...Object.keys(prog.earnedBadges ?? {}),
  ].filter((id) => CATALOG_IDS.has(id));

  const byCategory = {
    episode: earnedIds.filter((id) => id.startsWith('s1:')).length,
    theme: earnedIds.filter((id) => id.startsWith('theme-')).length,
    milestone: earnedIds.filter((id) => id.startsWith('milestone-') || id === 'starter-first-5').length,
    streak: earnedIds.filter((id) => id.startsWith('streak-') || id === 'weekly-streak-5').length,
  };

  const completedChapters = Object.keys(prog.completedChapters ?? {}).length;
  const completedEpisodes = Object.keys(prog.completedEpisodes ?? {}).length;

  function handleResetProgress() {
    const fresh = createDefaultProfile();
    const updated = { ...profile, progress: fresh.progress, updatedAt: Date.now() };
    saveProfile(updated);
    setTick((v) => v + 1);
  }

  function handleResetAll() {
    clearProfile();
    // clear all story-v02-session-* keys
    for (const key of Object.keys(sessionStorage)) {
      if (key.startsWith('story-v02-')) sessionStorage.removeItem(key);
    }
    setTick((v) => v + 1);
  }

  function handleClearSessions() {
    for (const key of Object.keys(sessionStorage)) {
      if (key.startsWith('story-v02-')) sessionStorage.removeItem(key);
    }
    setTick((v) => v + 1);
  }

  return (
    <SectionCard title="Fortschritt">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Sticker gesamt', value: earnedIds.length },
          { label: 'Kapitel abgeschlossen', value: completedChapters },
          { label: 'Episoden abgeschlossen', value: completedEpisodes },
          { label: 'Streak', value: prog.weeklyStreak?.currentStreak ?? 0 },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
            <div className="text-2xl font-bold text-slate-900">{value}</div>
            <div className="mt-0.5 text-xs text-slate-500">{label}</div>
          </div>
        ))}
      </div>

      {/* Sticker by category */}
      <div className="mb-4 flex flex-wrap gap-2">
        {Object.entries(byCategory).map(([cat, count]) => (
          <Tag key={cat} color="bg-slate-100 text-slate-700">
            {cat}: {count}
          </Tag>
        ))}
      </div>

      {/* Theme points */}
      <div className="mb-5">
        <div className="mb-2 text-xs font-semibold text-slate-500">Themen-Punkte</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.entries(prog.themePoints ?? {}).map(([theme, pts]) => (
            <div key={theme} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <span className="text-xs text-slate-600">{theme}</span>
              <span className="text-sm font-bold text-slate-900">{pts}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleClearSessions}
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          Story-Sessions löschen
        </button>
        <button
          type="button"
          onClick={handleResetProgress}
          className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800 hover:bg-amber-100"
        >
          Nur Progress resetten
        </button>
        <button
          type="button"
          onClick={handleResetAll}
          className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800 hover:bg-red-100"
        >
          Komplett resetten (Profil + Sessions)
        </button>
      </div>
    </SectionCard>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function DevLab() {
  return (
    <Layout hideFooter>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dev Lab</h1>
          <p className="mt-1 text-sm text-slate-500">
            Nur im Development-Build sichtbar — wird nicht in den Production-Bundle aufgenommen.
          </p>
        </div>
        <StoryJumper />
        <AmyTester />
        <ProgressInspector />
      </div>
    </Layout>
  );
}
