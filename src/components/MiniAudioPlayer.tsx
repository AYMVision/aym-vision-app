// src/components/MiniAudioPlayer.tsx
import { useEffect, useRef, useState } from 'react';

function formatTime(s: number) {
  if (!isFinite(s)) return '--:--';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function MiniAudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const onTime = () => setCurrent(el.currentTime);
    const onMeta = () => setDuration(el.duration);
    const onEnded = () => setPlaying(false);

    el.addEventListener('timeupdate', onTime);
    el.addEventListener('loadedmetadata', onMeta);
    el.addEventListener('ended', onEnded);

    return () => {
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('loadedmetadata', onMeta);
      el.removeEventListener('ended', onEnded);
    };
  }, []);

  function toggle() {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.play();
      setPlaying(true);
    }
  }

  function seek(e: React.ChangeEvent<HTMLInputElement>) {
    const el = audioRef.current;
    if (!el) return;
    const val = Number(e.target.value);
    el.currentTime = val;
    setCurrent(val);
  }

  const progress = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-2 w-full">
      {/* Hidden audio element */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Play/Pause button */}
      <button
        type="button"
        onClick={toggle}
        className="shrink-0 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-700 active:scale-95 transition"
        aria-label={playing ? 'Pause' : 'Abspielen'}
      >
        {playing ? (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <rect x="1.5" y="1" width="3.5" height="10" rx="1" />
            <rect x="7" y="1" width="3.5" height="10" rx="1" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M2 1.5l9 4.5-9 4.5V1.5z" />
          </svg>
        )}
      </button>

      {/* Scrubber */}
      <div className="relative flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-slate-900 rounded-full pointer-events-none"
          style={{ width: `${progress}%` }}
        />
        <input
          type="range"
          min={0}
          max={duration || 100}
          step={0.1}
          value={current}
          onChange={seek}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
          aria-label="Position"
        />
      </div>

      {/* Time */}
      <div className="shrink-0 text-[11px] font-semibold text-slate-500 tabular-nums">
        {formatTime(current)}{duration > 0 ? ` / ${formatTime(duration)}` : ''}
      </div>
    </div>
  );
}
