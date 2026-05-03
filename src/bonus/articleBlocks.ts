export type ArticleBlock =
  | { type: 'h1'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'quote'; text: string }
  | { type: 'img'; src: string; alt?: string; caption?: string }
  | { type: 'callout'; kind: 'info' | 'tip' | 'warn'; body: string }
  | { type: 'details'; title: string; body: string }
  | { type: 'gallery'; images: Array<{ src: string; alt?: string; caption?: string }> };

type Dir = { name: string; attrs: Record<string, string>; raw: string; isClose: boolean };

function parseDirectiveLine(line: string): Dir | null {
  // [[name ...]] oder [[/name]]
  const m = /^\[\[\s*(\/)?([a-zA-Z]+)\s*([^\]]*)\]\]\s*$/.exec(line.trim());
  if (!m) return null;

  const isClose = Boolean(m[1]);
  const name = m[2];
  const rest = (m[3] ?? '').trim();

  const attrs: Record<string, string> = {};
  const re = /(\w+)="([^"]*)"/g;
  let mm: RegExpExecArray | null;
  while ((mm = re.exec(rest))) attrs[mm[1]] = mm[2];

  return { name, attrs, raw: line, isClose };
}


function stripDirectiveWrapper(text: string) {
  return text.replace(/^\s*\[\[[^\]]+\]\]\s*/m, '').trim();
}

/**
 * Parser:
 * - unterstützt dein bisheriges Minimal-Markdown (#, ##, -, >, Absätze)
 * - plus Direktiven:
 *   [[img ...]]
 *   [[callout kind="tip"]] ... [[/callout]]
 *   [[details title="..."]] ... [[/details]]
 *   [[gallery]] [[img...]]... [[/gallery]]
 */
export function parseArticleBlocks(md: string): ArticleBlock[] {
  const lines = md.replace(/\r\n/g, '\n').split('\n');

  const blocks: ArticleBlock[] = [];
  let para: string[] = [];
  let list: string[] = [];
  let quote: string[] = [];

  function flushParagraph() {
    if (para.length) {
      blocks.push({ type: 'p', text: para.join(' ').trim() });
      para = [];
    }
  }
  function flushList() {
    if (list.length) {
      blocks.push({ type: 'ul', items: list.slice() });
      list = [];
    }
  }
  function flushQuote() {
    if (quote.length) {
      blocks.push({ type: 'quote', text: quote.join(' ').trim() });
      quote = [];
    }
  }
  function flushAll() {
    flushParagraph();
    flushList();
    flushQuote();
  }

  // Helpers für Block-Container
function readUntilClose(startIndex: number, closeName: string): { body: string; endIndex: number } {
  const bodyLines: string[] = [];
  for (let i = startIndex; i < lines.length; i++) {
    const d = parseDirectiveLine(lines[i]);
    if (d && d.isClose && d.name === closeName) {
      return { body: bodyLines.join('\n').trim(), endIndex: i };
    }
    bodyLines.push(lines[i]);
  }
  return { body: bodyLines.join('\n').trim(), endIndex: lines.length - 1 };
}


  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trim();

    // Leerzeile -> flush
    if (!line) {
      flushAll();
      continue;
    }

    // Direktive?
    const dir = parseDirectiveLine(line);
    if (dir) {
      flushAll();

      // [[img ...]]
      if (dir.name === 'img') {
        blocks.push({
          type: 'img',
          src: dir.attrs.src ?? '',
          alt: dir.attrs.alt,
          caption: dir.attrs.caption,
        });
        continue;
      }

      // [[callout kind="tip"]] ... [[/callout]]
      if (dir.name === 'callout') {
        const kind = (dir.attrs.kind as any) ?? 'info';
        const { body, endIndex } = readUntilClose(i + 1, 'callout');
        blocks.push({ type: 'callout', kind, body });
        i = endIndex;
        continue;
      }

      // [[details title="..."]] ... [[/details]]
      if (dir.name === 'details') {
        const title = dir.attrs.title ?? 'Mehr…';
        const { body, endIndex } = readUntilClose(i + 1, 'details');
        blocks.push({ type: 'details', title, body });
        i = endIndex;
        continue;
      }

      // [[gallery]] ... [[/gallery]]  (innen: nur [[img ...]] Zeilen)
      if (dir.name === 'gallery') {
        const imgs: Array<{ src: string; alt?: string; caption?: string }> = [];
        for (let j = i + 1; j < lines.length; j++) {
          const d2 = parseDirectiveLine(lines[j].trim());
if (d2 && d2.isClose && d2.name === 'gallery') {
  blocks.push({ type: 'gallery', images: imgs });
  i = j;
  break;
}

          if (d2 && d2.name === 'img') {
            imgs.push({ src: d2.attrs.src ?? '', alt: d2.attrs.alt, caption: d2.attrs.caption });
          }
        }
        continue;
      }

      // unbekannt -> ignorieren (oder später warnen)
      continue;
    }

    // Überschriften
    if (line.startsWith('# ')) {
      flushAll();
      blocks.push({ type: 'h1', text: line.replace(/^#\s+/, '') });
      continue;
    }
    if (line.startsWith('## ')) {
      flushAll();
      blocks.push({ type: 'h2', text: line.replace(/^##\s+/, '') });
      continue;
    }

    // Listen
    if (line.startsWith('- ')) {
      flushParagraph();
      flushQuote();
      list.push(line.replace(/^-+\s+/, '').trim());
      continue;
    }

    // Quote
    if (line.startsWith('> ')) {
      flushParagraph();
      flushList();
      quote.push(line.replace(/^>\s+/, '').trim());
      continue;
    }

    // normaler Absatz
    flushList();
    flushQuote();
    para.push(line);
  }

  flushAll();
  return blocks;
}
