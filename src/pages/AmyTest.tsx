import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { useTranslation } from 'react-i18next';

import { runAmy } from '../ai/orchestrator/runAmy';
import { detectQuestionType, type AmyQuestionType } from '../ai/core/amyQuestionType';
import type { AmyRunOutput } from '../ai/orchestrator/types';

import type { Course } from '../common/types';
import type { EpisodeMeta } from '../content/contentIndex';
import { getPlayableEpisode } from '../content/getPlayableEpisode';
import { getEpisodeMetaByCourseId } from '../content/contentIndex';

import {
  getQuestionIndex,
  getTipIndex,
  getQuestionText,
  getTipText,
} from '../story/engine/storySelectors';

type PlayableEpisode = EpisodeMeta & {
  script: Course['script'];
};

type QAItem = {
  index: number;
  chapterIndex: number; // 0-basiert für runAmy
  chapterNo: number; // Anzeige im UI
  questionText: string;
  tipText: string;
  questionType: AmyQuestionType;
};

type RunKey = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';
type TipRelation = 'aligned' | 'generic' | 'off-topic';

type EvalResult = {
  timestamp: string;
  qIndex: number;
  chapter: number;
  run: RunKey;
  answer: string;

  questionType: AmyQuestionType;
  tipText: string;

  attemptCount: number;

  confidence: number;
  tipRelation: TipRelation;
  offlineHint: boolean;
  miniTipType: string;

  contentFlags: Record<string, unknown> | undefined;
  action: string;
  label: string;

  amyText: string;
  debug?: { source?: string; notes?: string[] };
};

const IS_DEV = import.meta.env.DEV;

export default function AmyTest() {
  const { i18n, t } = useTranslation(['stories']);
  const lang = (i18n.resolvedLanguage ?? i18n.language).startsWith('en') ? 'en' : 'de';

  const { courseId } = useParams<{ courseId?: string }>();
  const resolvedCourseId = courseId || 's1e01';

  const [course, setCourse] = useState<PlayableEpisode | null>(null);
  const [loading, setLoading] = useState(true);

  const episodeMeta = useMemo(
    () => getEpisodeMetaByCourseId(resolvedCourseId),
    [resolvedCourseId]
  );

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setCourse(null);

    const c = getPlayableEpisode(resolvedCourseId, lang as 'de' | 'en');
    if (!alive) return;

    setCourse(c);
    setLoading(false);

    return () => {
      alive = false;
    };
  }, [lang, resolvedCourseId]);

  // 8 feste Testprofile
  const fixedRuns: Record<RunKey, string[]> = useMemo(
    () => ({
      A: [
        'Für Chioma und für alle, die ruhig bleiben wollen. Chioma wird ausgeschlossen und andere werden in den Streit gezogen – das macht Druck und Stress.',
        'Nicht weiterleiten, kurz prüfen, ob es stimmt, und wenn es eskaliert, Admin oder Lehrkraft informieren.',
        'Weil sie ausgeschlossen wird und wichtige Informationen verpasst. Das fühlt sich unfair und verletzend an.',
        'Ich würde einen Artikel über Fake News im Klassenchat machen und Tipps sammeln, wie man damit umgeht.',
        'Weil es fairer ist und man sich nur dann eine gute Meinung bilden kann, wenn man beide Seiten kennt.',
        'In Gruppen kann man Aufgaben teilen, sich gegenseitig helfen und Fehler schneller finden.',
        'Ich bin eher für Regeln, weil sie helfen, Streit und Beleidigungen zu verhindern.',
        '😔💔😢',
        'Damit keine falschen Informationen oder verletzenden Inhalte veröffentlicht werden.',
        'Meine Regel wäre: Erst nachdenken, dann schreiben, und keine Beleidigungen schicken.'
      ],
      B: [
        'Für Chioma, weil sie ausgeschlossen wird.',
        'Nicht weiterleiten und erst prüfen.',
        'Weil sie sich ausgeschlossen fühlt.',
        'Artikel über Fake News.',
        'Weil es fair ist.',
        'Man hilft sich und ist schneller.',
        'Eher für Regeln.',
        '😔💔',
        'Damit es fair bleibt.',
        'Keine Beleidigungen.'
      ],
      C: [
        'weiß nicht',
        'keine Ahnung',
        'kp',
        'weiß nicht',
        'kp',
        'keine Ahnung',
        'weiß nicht',
        'kp',
        'keine Ahnung',
        'weiß nicht'
      ],
      D: [
        'pizza',
        'lol',
        'asdf',
        '😂😂',
        'egal',
        'banana',
        'haha',
        '😎',
        'xyz',
        'moin'
      ],
      E: [
        'Roblox ist cool.',
        'Ich schick einfach Memes.',
        'Ist doch egal.',
        'Hauptsache viral.',
        'Meine Meinung zählt nur.',
        'Alleine ist besser.',
        'Regeln sind langweilig.',
        '😂😂😂',
        'Man kann alles posten.',
        'Ich mache gar keine Regeln.'
      ],
      F: [
        'Für Chioma und auch für die anderen, weil Streit im Klassenchat schnell unangenehm wird.',
        'Ich würde sagen: Bitte erst prüfen und nicht sofort glauben.',
        'Weil man sich dann ausgeschlossen fühlt und nichts mehr mitbekommt.',
        'Ich würde einen Artikel über Streit im Klassenchat schreiben.',
        'Weil sonst nur eine Sicht zählt und das unfair ist.',
        'Zusammen geht vieles leichter und schneller.',
        'Eher für Regeln, damit es nicht eskaliert.',
        '😔😢🚫',
        'Damit niemand verletzt wird.',
        'Keine Screenshots weiterleiten.'
      ],
      G: [
        'Ich verstehe die Frage nicht.',
        'Was meinst du genau?',
        'Hä?',
        'Welche Idee genau?',
        'Welche Seiten?',
        'Kannst du ein Beispiel geben?',
        'Warum Regeln?',
        'Welche Emojis?',
        'Welche Regeln meinst du?',
        'Was genau soll ich sagen?'
      ],
      H: [
        'Mir egal, sollen die das selbst klären.',
        'Ich würde es weiterleiten, ist lustig.',
        'Gut so.',
        'Ich würde irgendwas ausdenken.',
        'Die anderen sind falsch.',
        'Ich mache alles allein.',
        'Regeln braucht keiner.',
        '😈😂',
        'Ich würde Namen und Screenshots posten.',
        'Wenn jemand nervt, beleidige ich zurück.'
      ]
    }),
    []
  );

  const qaList: QAItem[] = useMemo(() => {
    if (!course) return [];

    const items: QAItem[] = [];
    let counter = 0;

    (course.script ?? []).forEach((ch: any, chIndex: number) => {
      const msgs = ch?.messages ?? [];

      const qIdx = getQuestionIndex(msgs);
      const tipIdx = getTipIndex(msgs);

      if (qIdx < 0 || tipIdx < 0) return;

      const questionText = getQuestionText(msgs).trim();
      const tipText = getTipText(msgs).trim();

      if (!questionText || !tipText) return;

      counter += 1;

      items.push({
        index: counter,
        chapterIndex: chIndex,
        chapterNo: Number(ch?.chapter ?? chIndex + 1),
        questionText,
        tipText,
        questionType: detectQuestionType({
          questionText,
          tipText,
        }),
      });
    });

    // feste Testantworten sind aktuell für 10 Fragen ausgelegt
    return items.slice(0, 10);
  }, [course]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const current = qaList[currentIndex];

  const [attemptByQ, setAttemptByQ] = useState<Record<number, number>>({});
  const attemptCount = current ? attemptByQ[current.index] ?? 0 : 0;

  const [results, setResults] = useState<EvalResult[]>([]);
  const [busy, setBusy] = useState(false);

  const runAnswer = async (run: RunKey) => {
    if (!current || !IS_DEV || busy) return;

    setBusy(true);

    try {
      const answer = fixedRuns[run]?.[current.index - 1] ?? '';

      const result = (await runAmy({
        userAnswer: answer,
        questionText: current.questionText,
        tipText: current.tipText,
        language: lang,
        attemptCount,
        chapterIndex: current.chapterIndex,
        episodeId: resolvedCourseId,
        useMLKeyIdea: true,
      })) as AmyRunOutput;

      const isUnlockLike =
        result.action !== 'RETRY' &&
        result.action !== 'ADULT_GATE' &&
        result.action !== 'SILENT_LOCK';

      if (isUnlockLike) {
        setAttemptByQ((prev) => {
          const copy = { ...prev };
          delete copy[current.index];
          return copy;
        });
      } else {
        setAttemptByQ((prev) => ({
          ...prev,
          [current.index]: (prev[current.index] ?? 0) + 1,
        }));
      }

      const stamp = new Date().toLocaleTimeString();

      setResults((prev) => [
        {
          timestamp: stamp,
          qIndex: current.index,
          chapter: current.chapterNo,
          run,
          answer,
          questionType: current.questionType,
          tipText: current.tipText,

          action: String(result.action ?? ''),
          attemptCount,

          label: String(result.label ?? ''),
          confidence: Number(result.confidence ?? 0),

          tipRelation: (result.tipRelation ?? 'generic') as TipRelation,
          offlineHint: Boolean(result.offlineHint),
          miniTipType: String(result.miniTipType ?? 'none'),
          contentFlags: result.contentFlags as Record<string, unknown> | undefined,
          debug: result.debug as { source?: string; notes?: string[] } | undefined,

          amyText: (result.amyReplyText ?? '').trim(),
        },
        ...prev,
      ]);
    } finally {
      setBusy(false);
    }
  };

  const resetAttemptsForCurrent = () => {
    if (!current) return;

    setAttemptByQ((prev) => {
      const copy = { ...prev };
      delete copy[current.index];
      return copy;
    });
  };

  const goNext = () => setCurrentIndex((i) => Math.min(i + 1, qaList.length - 1));
  const goPrev = () => setCurrentIndex((i) => Math.max(i - 1, 0));

  if (!IS_DEV) {
    return (
      <Layout backPath="/stories" hideFooter>
        <div className="max-w-3xl mx-auto px-4 py-10">
          <h1 className="text-2xl font-bold mb-3">Amy Test</h1>
          <p className="text-gray-700">
            Diese Seite ist nur im DEV-Modus aktiv. Starte die App lokal mit{' '}
            <code>npm run dev</code>.
          </p>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout backPath="/stories" hideFooter>
        <div className="max-w-3xl mx-auto px-4 py-10">
          <h1 className="text-2xl font-bold mb-3">Amy Test</h1>
          <p className="text-gray-700">Lade Kurs…</p>
        </div>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout backPath="/stories" hideFooter>
        <div className="max-w-3xl mx-auto px-4 py-10">
          <h1 className="text-2xl font-bold mb-3">Amy Test</h1>
          <p className="text-gray-700">Kurs nicht gefunden: {resolvedCourseId}</p>
        </div>
      </Layout>
    );
  }

  if (!current) {
    return (
      <Layout backPath="/stories" hideFooter>
        <div className="max-w-3xl mx-auto px-4 py-10">
          <h1 className="text-2xl font-bold mb-3">Amy Test</h1>
          <p className="text-gray-700">
            Keine Amy-Frage/Tipp-Paare gefunden. Prüfe bitte, ob jedes Kapitel
            eine <code>amy-question</code> und einen <code>amy-tip</code> enthält.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout backPath="/stories" hideFooter>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-bold">Amy Test Mode</h1>

          <span className="text-sm text-gray-600">
            Kurs:{' '}
            <span className="font-semibold">
              {t(course.titleKey, { ns: 'stories', defaultValue: resolvedCourseId })}
            </span>{' '}
            ({resolvedCourseId})
          </span>

          {episodeMeta ? (
            <span className="text-sm text-gray-500">
              • meta: <span className="font-semibold">{episodeMeta.episodeId}</span>
            </span>
          ) : null}
        </div>

        <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="text-sm text-gray-600">
              Frage <span className="font-semibold">{current.index}</span> / {qaList.length} •
              Chapter <span className="font-semibold">{current.chapterNo}</span> • Fragetyp:{' '}
              <span className="font-semibold">{current.questionType}</span> • attemptCount:{' '}
              <span className="font-semibold">{attemptCount}</span>
            </div>

            <div className="flex gap-2">
              <button
                className="px-3 py-1.5 rounded-xl border text-sm hover:bg-gray-50"
                onClick={goPrev}
                disabled={currentIndex === 0}
              >
                ← Zurück
              </button>

              <button
                className="px-3 py-1.5 rounded-xl border text-sm hover:bg-gray-50"
                onClick={goNext}
                disabled={currentIndex === qaList.length - 1}
              >
                Weiter →
              </button>

              <button
                className="px-3 py-1.5 rounded-xl border text-sm hover:bg-gray-50"
                onClick={resetAttemptsForCurrent}
              >
                Attempts reset
              </button>
            </div>
          </div>

          <div className="mt-4 grid md:grid-cols-2 gap-3">
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-3">
              <div className="text-xs font-semibold text-gray-500 mb-1">FRAGE</div>
              <div className="text-gray-900 whitespace-pre-wrap">{current.questionText}</div>
            </div>

            <div className="rounded-xl bg-gray-50 border border-gray-200 p-3">
              <div className="text-xs font-semibold text-gray-500 mb-1">TIPP</div>
              <div className="text-gray-900 whitespace-pre-wrap">{current.tipText}</div>
            </div>
          </div>

          <div className="mt-4 flex gap-2 flex-wrap">
            {(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] as RunKey[]).map((rk) => (
              <button
                key={rk}
                className="px-3 py-2 rounded-xl bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-60"
                onClick={() => runAnswer(rk)}
                disabled={busy}
                title="Klick = feste Antwort nehmen und runAmy ausführen"
              >
                Run {rk}
              </button>
            ))}
          </div>

          <div className="mt-3 text-xs text-gray-600">
            Tipp: Öffne direkt <span className="font-mono">#/test/amy/{resolvedCourseId}</span>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Letzte Ergebnisse</h2>

            <button
              className="px-3 py-1.5 rounded-xl border text-sm hover:bg-gray-50"
              onClick={() => setResults([])}
            >
              Log leeren
            </button>
          </div>

          <div className="mt-3 space-y-3">
            {results.length === 0 && (
              <div className="text-sm text-gray-600">Noch keine Tests ausgeführt.</div>
            )}

            {results.slice(0, 30).map((r, idx) => (
              <div
                key={`${r.timestamp}-${r.qIndex}-${idx}`}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-3 flex-wrap text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">
                    Q{r.qIndex} (Kap {r.chapter})
                  </span>
                  <span>Run {r.run}</span>
                  <span>• {r.timestamp}</span>
                  <span>• qt: {r.questionType}</span>
                  <span>• attempt: {r.attemptCount}</span>
                  <span>• action: {r.action}</span>
                  <span>• label: {r.label}</span>
                  <span>• conf: {r.confidence.toFixed(2)}</span>
                  <span>• src: {r.debug?.source ?? 'n/a'}</span>
                  <span>• notes: {(r.debug?.notes ?? []).join(' | ') || '-'}</span>
                </div>

                <div className="mt-2 grid md:grid-cols-2 gap-3">
                  <div className="rounded-xl bg-gray-50 border border-gray-200 p-3">
                    <div className="text-xs font-semibold text-gray-500 mb-1">Antwort</div>
                    <div className="text-gray-900 whitespace-pre-wrap">{r.answer}</div>
                  </div>

                  <div className="rounded-xl bg-gray-50 border border-gray-200 p-3">
                    <div className="text-xs font-semibold text-gray-500 mb-1">Amy</div>
                    <div className="text-gray-900 whitespace-pre-wrap">
                      {r.amyText ? r.amyText : '(SILENT / leer)'}
                    </div>

                    {Boolean((r.contentFlags as any)?.selfHarm) && (
                      <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-900">
                        selfHarm=true (hier würdest du in deiner App Safety-Buttons anzeigen)
                      </div>
                    )}

                    {r.offlineHint && (
                      <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                        offlineHint=true (UI sollte hier den Erwachsenen-Hinweisblock anzeigen)
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 text-sm text-gray-700">
                  <span className="font-semibold">tipRelation:</span> {r.tipRelation} •{' '}
                  <span className="font-semibold">miniTipType:</span> {r.miniTipType}
                </div>

                <div className="mt-2 text-sm text-gray-700">
                  <span className="font-semibold">contentFlags:</span>{' '}
                  <span className="font-mono text-xs">
                    {JSON.stringify(r.contentFlags ?? {})}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}