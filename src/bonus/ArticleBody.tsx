import React, { useMemo } from 'react';
import { assetUrl } from '../common/assetUrl';
import { parseArticleBlocks } from './articleBlocks';

function buildImgCandidates(base: string) {
  const hasExt = /\.\w+$/.test(base);
  const hasSize = /-(256|512|1024)\./.test(base);

  if (hasExt && hasSize) {
    return {
      avif512: null,
      avif1024: null,
      webp512: base.replace(/-(256|512|1024)\.\w+$/, '-512.webp'),
      webp1024: base.replace(/-(256|512|1024)\.\w+$/, '-1024.webp'),
    };
  }

  const noExt = hasExt ? base.replace(/\.\w+$/, '') : base;

  return {
    avif512: `${noExt}-512.avif`,
    avif1024: `${noExt}-1024.avif`,
    webp512: `${noExt}-512.webp`,
    webp1024: `${noExt}-1024.webp`,
  };
}

function ArticleImage({
  src,
  alt,
  caption,
}: {
  src: string;
  alt?: string;
  caption?: string;
}) {
  const c = buildImgCandidates(src);

  return (
    <figure className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <picture>
        {c.avif1024 ? (
          <source
            type="image/avif"
            srcSet={`${assetUrl(c.avif512)} 512w, ${assetUrl(c.avif1024)} 1024w`}
            sizes="(max-width: 768px) 92vw, 700px"
          />
        ) : null}
        <source
          type="image/webp"
          srcSet={`${assetUrl(c.webp512)} 512w, ${assetUrl(c.webp1024)} 1024w`}
          sizes="(max-width: 768px) 92vw, 700px"
        />
        <img
          src={assetUrl(c.webp1024)}
          alt={alt ?? ''}
          className="w-full max-h-[360px] object-contain bg-[var(--color-teal-50)]"
          loading="lazy"
          decoding="async"
        />
      </picture>

      {caption ? (
        <figcaption className="px-4 py-3 text-xs sm:text-sm text-slate-600 bg-white">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function Callout({
  kind,
  children,
}: {
  kind: 'info' | 'tip' | 'warn';
  children: React.ReactNode;
}) {
  const cfg =
    kind === 'tip'
      ? {
          icon: '💡',
          title: 'Tipp',
          box: 'border-emerald-200 bg-emerald-50',
          badge: 'bg-emerald-200/60 text-emerald-900',
        }
      : kind === 'warn'
      ? {
          icon: '⚠️',
          title: 'Achtung',
          box: 'border-amber-200 bg-amber-50',
          badge: 'bg-amber-200/60 text-amber-900',
        }
      : {
          icon: 'ℹ️',
          title: 'Info',
          box: 'border-sky-200 bg-sky-50',
          badge: 'bg-sky-200/60 text-sky-900',
        };

  return (
    <div className={['rounded-3xl border p-4 sm:p-5 shadow-sm', cfg.box].join(' ')}>
      <div className="flex items-center gap-2">
        <span className="text-lg">{cfg.icon}</span>
        <span className={['text-xs font-extrabold px-2 py-1 rounded-full', cfg.badge].join(' ')}>
          {cfg.title}
        </span>
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Gallery({ images }: { images: Array<{ src: string; alt?: string; caption?: string }> }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {images.map((im, idx) => (
        <div key={idx} className="rounded-3xl overflow-hidden">
          <ArticleImage src={im.src} alt={im.alt} caption={im.caption} />
        </div>
      ))}
    </div>
  );
}

function MiniMarkdown({ text }: { text: string }) {
  const lines = text.replace(/\r\n/g, '\n').split('\n').map((l) => l.trim());
  const out: React.ReactNode[] = [];
  let list: string[] = [];
  let para: string[] = [];

  function flushPara() {
    if (!para.length) return;
    out.push(
      <div key={`p-${out.length}`} className="text-base leading-relaxed text-slate-800">
        {para.join(' ')}
      </div>
    );
    para = [];
  }

  function flushList() {
    if (!list.length) return;
    out.push(
      <ul key={`ul-${out.length}`} className="list-disc pl-5 space-y-1 text-base text-slate-800">
        {list.map((x, i) => (
          <li key={i}>{x}</li>
        ))}
      </ul>
    );
    list = [];
  }

  for (const line of lines) {
    if (!line) {
      flushPara();
      flushList();
      continue;
    }
    if (line.startsWith('- ')) {
      flushPara();
      list.push(line.replace(/^-+\s+/, ''));
      continue;
    }
    para.push(line);
  }

  flushPara();
  flushList();

  return <div className="space-y-3">{out}</div>;
}

export function ArticleBody({ text }: { text: string }) {
  const blocks = useMemo(() => parseArticleBlocks(text), [text]);

  // kleines „Cover“-Gefühl: wir ziehen den ersten H1 raus
  const firstH1 = blocks.find((b) => b.type === 'h1') as any | undefined;

  return (
    <div className="relative">
      {/* weicher Hintergrund */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-teal-50)] via-white to-white" />
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-[var(--color-teal-200)]/25 blur-3xl" />
        <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-amber-200/20 blur-3xl" />
      </div>

      {/* Titelkarte */}
      {firstH1 ? (
        <div className="rounded-[32px] border border-white/60 bg-white/70 backdrop-blur shadow-sm p-5 sm:p-7">
          <div className="text-xs font-bold text-[var(--color-teal-700)]">
            📚 Mini-Artikel
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
            {firstH1.text}
          </div>
          <div className="mt-3 text-sm sm:text-base text-slate-700">
            ✨ Kurz, klar und ohne Stress – lies in deinem Tempo.
          </div>
        </div>
      ) : null}

      {/* Inhalte */}
      <div className="mt-5 space-y-5">
        {blocks.map((b, i) => {
          if (b.type === 'h1') {
            // H1 wurde oben schon als Titelkarte gezeigt -> hier überspringen
            if (firstH1 && b.text === firstH1.text) return null;
            return (
              <div
                key={i}
                className="text-2xl font-extrabold text-slate-900"
              >
                {b.text}
              </div>
            );
          }

          if (b.type === 'h2') {
            return (
              <div
                key={i}
                className="rounded-2xl bg-white/70 border border-slate-200 shadow-sm px-4 py-3"
              >
                <div className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <span>⭐</span>
                  <span>{b.text}</span>
                </div>
              </div>
            );
          }

          if (b.type === 'p') {
            return (
              <div
                key={i}
                className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 sm:p-5 text-base leading-relaxed text-slate-800"
              >
                {b.text}
              </div>
            );
          }

          if (b.type === 'ul') {
            return (
              <div key={i} className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 sm:p-5">
                <div className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  ✅ Merkliste
                </div>
                <ul className="mt-3 list-disc pl-5 space-y-2 text-base text-slate-800">
                  {b.items.map((it, j) => (
                    <li key={j}>{it}</li>
                  ))}
                </ul>
              </div>
            );
          }

          if (b.type === 'quote') {
            // wie Chat-Bubble
            return (
              <div
                key={i}
                className="rounded-3xl border border-slate-200 bg-[var(--color-teal-50)] shadow-sm p-4 sm:p-5"
              >
                <div className="text-sm font-extrabold text-[var(--color-teal-900)]">
                  💬 Zitat
                </div>
                <div className="mt-2 text-base text-slate-800 leading-relaxed">
                  “{b.text}”
                </div>
              </div>
            );
          }

          if (b.type === 'img') {
            return <ArticleImage key={i} src={b.src} alt={b.alt} caption={b.caption} />;
          }

          if (b.type === 'gallery') {
            return (
              <div key={i} className="rounded-3xl border border-slate-200 bg-white shadow-sm p-4 sm:p-5">
                <div className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  🖼️ Bilder-Galerie
                </div>
                <div className="mt-4">
                  <Gallery images={b.images} />
                </div>
              </div>
            );
          }

          if (b.type === 'callout') {
            return (
              <Callout key={i} kind={b.kind}>
                <MiniMarkdown text={b.body} />
              </Callout>
            );
          }

          if (b.type === 'details') {
            return (
              <details
                key={i}
                className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden"
              >
                <summary className="cursor-pointer px-4 py-4 sm:px-5 sm:py-5 flex items-center justify-between gap-3">
                  <div className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    ✨ <span>{b.title}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-500">Aufklappen</div>
                </summary>
                <div className="px-4 pb-5 sm:px-5 sm:pb-6">
                  <MiniMarkdown text={b.body} />
                </div>
              </details>
            );
          }

          return null;
        })}
      </div>

      {/* kleiner Abschluss */}
      <div className="mt-6 rounded-3xl border border-white/60 bg-white/70 backdrop-blur shadow-sm p-4 sm:p-5 text-sm text-slate-700">
        🎉 Fertig! Wenn du willst: Lies später nochmal – manchmal merkt man beim zweiten Mal mehr.
      </div>
    </div>
  );
}