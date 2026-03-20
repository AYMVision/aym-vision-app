// src/components/AudioBubble.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { assetUrl } from '../common/assetUrl';

type Props = {
  src: string;              // "media/..."
  label?: string;           // optional
  durationSec?: number;     // optional
};

function fmtTime(s: number) {
  if (!Number.isFinite(s) || s < 0) return '0:00';
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${String(r).padStart(2, '0')}`;
}

export default function AudioBubble({ src, label, durationSec }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const url = useMemo(() => assetUrl(src), [src]);

  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(durationSec ?? 0);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTime = () => setCur(a.currentTime || 0);
    const onMeta = () => setDur(a.duration || durationSec || 0);
    const onEnded = () => setPlaying(false);

    a.addEventListener('play', onPlay);
    a.addEventListener('pause', onPause);
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('loadedmetadata', onMeta);
    a.addEventListener('ended', onEnded);

    return () => {
      a.removeEventListener('play', onPlay);
      a.removeEventListener('pause', onPause);
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('loadedmetadata', onMeta);
      a.removeEventListener('ended', onEnded);
    };
  }, [durationSec]);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      if (a.paused) await a.play();
      else a.pause();
    } catch {
      // autoplay restrictions etc.
    }
  };

  const pct = dur > 0 ? Math.min(100, Math.max(0, (cur / dur) * 100)) : 0;

  return (
    <div className="w-full">
      <audio ref={audioRef} preload="metadata">
        <source src={url} type="audio/mpeg" />
      </audio>

      {label ? (
        <div className="mb-2 text-[11px] font-semibold text-slate-600">{label}</div>
      ) : null}

      <div className="flex items-center gap-3">
        {/* Play circle */}
        <button
          type="button"
          onClick={toggle}
          className="shrink-0 w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center"
          aria-label={playing ? 'Pause' : 'Play'}
        >
          <span className="text-sm">{playing ? '❚❚' : '▶︎'}</span>
        </button>

        {/* Progress + times */}
        <div className="min-w-0 flex-1">
          <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
            {/* neutral progress */}
            <div className="h-2 rounded-full bg-slate-500" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
            <span>{fmtTime(cur)}</span>
            <span>{fmtTime(dur)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
