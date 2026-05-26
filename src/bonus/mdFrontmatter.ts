// src/bonus/mdFrontmatter.ts
export type MdMeta = {
  title?: string;
  description?: string;
  author?: string;
  date?: string;
  tags?: string[];
  aiTranslated?: boolean;
};

export function parseFrontmatter(md: string): { meta: MdMeta; body: string } {
  const text = md.replace(/\r\n/g, '\n');

  if (!text.startsWith('---\n')) return { meta: {}, body: md };

  const end = text.indexOf('\n---\n', 4);
  if (end === -1) return { meta: {}, body: md };

  const raw = text.slice(4, end).trim();
  const body = text.slice(end + 5);

  const meta: MdMeta = {};
  for (const line of raw.split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim();

    if (key === 'title') meta.title = val;
    else if (key === 'description') meta.description = val;
    else if (key === 'author') meta.author = val;
    else if (key === 'date') meta.date = val;
    else if (key === 'tags') meta.tags = val.split(',').map(s => s.trim()).filter(Boolean);
    else if (key === 'aiTranslated') meta.aiTranslated = val === 'true';
  }

  return { meta, body };
}
