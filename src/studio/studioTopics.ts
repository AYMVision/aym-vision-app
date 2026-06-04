// src/studio/studioTopics.ts
// Shared constants for Studio topic handling (used by StudioPage + StudioEducatorsPage)

export const TOPIC_ICONS: Record<string, string> = {
  infoCheck: '🕵️',
  teamTalk: '🤝',
  create: '🎨',
  safe: '🔒',
  solve: '💡',
  reflect: '🪞',
  fair: '⚖️',
  free: '🌈',
};

export const STUDIO_TOPICS = [
  'infoCheck', 'teamTalk', 'create', 'safe', 'solve', 'reflect', 'fair', 'free',
] as const;

export function buildWorkshopUrl(topicId: string): string {
  return `${window.location.origin}${window.location.pathname}#/studio?tag=${topicId}`;
}

export function buildCustomWorkshopUrl(label: string): string {
  return `${window.location.origin}${window.location.pathname}#/studio?label=${encodeURIComponent(label.trim())}`;
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).catch(() => {
      window.prompt('Link kopieren (Strg+C / Cmd+C):', text);
    });
  }
  try {
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    return Promise.resolve();
  } catch {
    window.prompt('Link kopieren (Strg+C / Cmd+C):', text);
    return Promise.resolve();
  }
}
