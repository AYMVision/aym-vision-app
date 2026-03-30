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
    <figure className="rounded-[28px] overflow-hidden border border-slate-200 bg-white shadow-sm">
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
          box: 'border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 via-white to-emerald-100/60',
          badge: 'bg-emerald-200/80 text-emerald-950',
        }
      : kind === 'warn'
      ? {
          icon: '⚠️',
          title: 'Achtung',
          box: 'border-2 border-amber-300 bg-gradient-to-br from-amber-50 via-white to-amber-100/60',
          badge: 'bg-amber-200/80 text-amber-950',
        }
      : {
          icon: 'ℹ️',
          title: 'Info',
          box: 'border-2 border-sky-300 bg-gradient-to-br from-sky-50 via-white to-sky-100/60',
          badge: 'bg-sky-200/80 text-sky-950',
        };

  return (
    <div className={['rounded-[28px] p-4 sm:p-5 shadow-sm', cfg.box].join(' ')}>
      <div className="flex items-center gap-2">
        <span className="text-lg" aria-hidden="true">
          {cfg.icon}
        </span>
        <span className={['text-xs font-extrabold px-2.5 py-1 rounded-full', cfg.badge].join(' ')}>
          {cfg.title}
        </span>
      </div>

      <div className="mt-3">{children}</div>
    </div>
  );
}

function Gallery({
  images,
}: {
  images: Array<{ src: string; alt?: string; caption?: string }>;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {images.map((im, idx) => (
        <ArticleImage key={idx} src={im.src} alt={im.alt} caption={im.caption} />
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
      <p key={`p-${out.length}`} className="text-[15px] sm:text-base leading-relaxed text-slate-800">
        {para.join(' ')}
      </p>
    );
    para = [];
  }

  function flushList() {
    if (!list.length) return;
    out.push(
      <ul key={`ul-${out.length}`} className="list-disc pl-5 space-y-1.5 text-[15px] sm:text-base text-slate-800">
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

function ReadingParagraph({ text }: { text: string }) {
  return (
    <p className="text-[16px] sm:text-[17px] leading-8 text-slate-800">
      {text}
    </p>
  );
}

function SectionHeading({ text }: { text: string }) {
  return (
    <div className="pt-2">
      <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--color-teal-900)]">
        {text}
      </h2>
      <div className="mt-2 h-1 w-12 rounded-full bg-[var(--color-teal-200)]" />
    </div>
  );
}

function StandaloneList({ items }: { items: string[] }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white shadow-sm p-4 sm:p-5">
      <div className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
        ✅ Merkliste
      </div>

      <ul className="mt-3 list-disc pl-5 space-y-2 text-[15px] sm:text-base text-slate-800">
        {items.map((it, j) => (
          <li key={j}>{it}</li>
        ))}
      </ul>
    </div>
  );
}

function QuoteBlock({ text }: { text: string }) {
  return (
    <div className="rounded-[28px] border border-[var(--color-teal-200)] bg-[var(--color-teal-50)] shadow-sm p-4 sm:p-5">
      <div className="text-sm font-extrabold text-[var(--color-teal-900)] flex items-center gap-2">
        💬 Merksatz
      </div>
      <div className="mt-2 text-[15px] sm:text-base text-slate-800 leading-relaxed">
        “{text}”
      </div>
    </div>
  );
}

function DetailsBlock({ title, body }: { title: string; body: string }) {
  return (
    <details className="rounded-[28px] border border-slate-200 bg-white shadow-sm overflow-hidden group">
      <summary className="cursor-pointer list-none px-4 py-4 sm:px-5 sm:py-5 flex items-center justify-between gap-3">
        <div className="text-[15px] sm:text-base font-extrabold text-[var(--color-teal-900)] flex items-center gap-2">
          ✨ <span>{title}</span>
        </div>
        <div className="text-xs font-bold text-slate-500 group-open:hidden">Aufklappen</div>
        <div className="text-xs font-bold text-slate-500 hidden group-open:block">Zuklappen</div>
      </summary>

      <div className="px-4 pb-5 sm:px-5 sm:pb-6">
        <MiniMarkdown text={body} />
      </div>
    </details>
  );
}

export function ArticleBody({ text }: { text: string }) {
  const blocks = useMemo(() => parseArticleBlocks(text), [text]);
  const firstH1 = blocks.find((b) => b.type === 'h1') as { type: 'h1'; text: string } | undefined;

  return (
    <div className="relative">
      {/* Hintergrund */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-teal-50)] via-white to-white" />
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-[var(--color-teal-200)]/25 blur-3xl" />
        <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-amber-200/20 blur-3xl" />
        <div className="absolute top-40 right-0 w-40 h-40 rounded-full bg-sky-200/15 blur-3xl" />
      </div>

      {/* Titelkarte */}
      {firstH1 ? (
        <div className="rounded-[32px] bg-gradient-to-br from-white via-white to-[var(--color-teal-50)] shadow-md p-6 sm:p-8">
          <div className="text-sm font-extrabold text-[var(--color-teal-600)]">
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

      {/* Inhalt */}
      <div className="mt-6 space-y-6">
        {blocks.map((b, i) => {
          if (b.type === 'h1') {
            if (firstH1 && b.text === firstH1.text) return null;

            return (
              <div key={i} className="pt-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                  {b.text}
                </h1>
              </div>
            );
          }

          if (b.type === 'h2') {
            return <SectionHeading key={i} text={b.text} />;
          }

          if (b.type === 'p') {
            return <ReadingParagraph key={i} text={b.text} />;
          }

          if (b.type === 'ul') {
            return <StandaloneList key={i} items={b.items} />;
          }

          if (b.type === 'quote') {
            return <QuoteBlock key={i} text={b.text} />;
          }

          if (b.type === 'img') {
            return <ArticleImage key={i} src={b.src} alt={b.alt} caption={b.caption} />;
          }

          if (b.type === 'gallery') {
            return (
              <div key={i} className="rounded-[28px] border border-slate-200 bg-white shadow-sm p-4 sm:p-5">
                <div className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  🖼️ Bilder
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
            return <DetailsBlock key={i} title={b.title} body={b.body} />;
          }

          return null;
        })}
      </div>

      {/* Abschluss */}
      <div className="mt-8 rounded-[28px] border border-white/60 bg-white/70 backdrop-blur shadow-sm p-4 sm:p-5 text-sm text-slate-700">
        🎉 Fertig! Wenn du willst: Lies später nochmal – manchmal merkt man beim zweiten Mal noch mehr.
      </div>
    </div>
  );
}