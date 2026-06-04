// src/pages/StudioViewPage.tsx
// Read-only view of a shared Amic Creator story
// Styled to match real Amy chat bubble style (ChatMessage.tsx)

import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';

import { assetUrl } from '../common/assetUrl';
import {
  AMY_CHARACTER,
  CHARACTER_BG,
  characterAvatarUrl,
  getCharacterById,
} from '../studio/studioCharacters';
import { decodeStory, encodeStory } from '../studio/studioEncoding';
import type { StudioStory } from '../studio/studioTypes';

const TOPIC_ICONS: Record<string, string> = {
  infoCheck: '🕵️', teamTalk: '🤝', create: '🎨',
  safe: '🔒', solve: '💡', reflect: '🪞', fair: '⚖️', free: '🌈',
};

function buildShareUrl(encoded: string): string {
  return `${window.location.origin}${window.location.pathname}#/studio/view/${encoded}`;
}

// --------------- Story Header ---------------

function StoryHeader({ story }: { story: StudioStory }) {
  const { t: tBonus } = useTranslation('bonus');
  const { t } = useTranslation('studio');

  const topicLabel = story.tag === 'free'
    ? t('step1.tagFree')
    : tBonus(`newspaper.topics.${story.tag}`);

  // All characters in the story (Amy first)
  const allCharIds = story.characters.includes('amy')
    ? story.characters
    : ['amy', ...story.characters];

  return (
    <div className="px-4 pt-5 pb-4 bg-white border-b border-slate-100">
      {/* Topic badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-100 rounded-full text-xs font-semibold text-violet-700">
          <span>{TOPIC_ICONS[story.tag] ?? '📖'}</span>
          {topicLabel}
        </span>
        <span className="text-xs text-slate-400">{t('view.by')}</span>
      </div>

      {/* Title */}
      {story.title && (
        <h1 className="text-xl font-extrabold text-slate-900 mb-3 leading-snug">{story.title}</h1>
      )}

      {/* Character row */}
      <div className="flex items-center gap-1.5">
        {allCharIds.map((id) => {
          const char = getCharacterById(id);
          if (!char) return null;
          return (
            <div key={id} className="flex flex-col items-center gap-0.5">
              <div className="w-9 h-9 rounded-full bg-white border-2 border-white shadow-sm overflow-hidden">
                <img
                  src={characterAvatarUrl(char.avatarFile)}
                  alt={char.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = assetUrl('media/avatars/thumb/default-96.webp'); }}
                />
              </div>
              <span className="text-[9px] font-medium text-slate-400 leading-none">{char.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --------------- Chat Bubble (real Amy chat style) ---------------

function ChatBubble({ characterId, text }: { characterId: string; text: string }) {
  const char = getCharacterById(characterId);
  const isAmy = characterId === 'amy';

  const bg = isAmy
    ? 'bg-rose-50 border-rose-200'
    : (CHARACTER_BG[characterId] ?? 'bg-slate-100 border-slate-200');
  const textColor = isAmy ? 'text-rose-900' : 'text-slate-800';

  return (
    <div className="w-full flex items-end gap-2 justify-start my-2 px-3">
      <div className="w-12 h-12 flex-shrink-0 rounded-full bg-white border border-slate-200 overflow-hidden">
        <img
          src={characterAvatarUrl(char?.avatarFile ?? 'default-96.webp')}
          alt={char?.name ?? characterId}
          className="w-full h-full object-cover"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = assetUrl('media/avatars/thumb/default-96.webp'); }}
        />
      </div>
      <div className={`relative min-w-0 max-w-[80%] break-words rounded-2xl rounded-bl-md px-3 py-2 shadow-sm border ${bg}`}>
        <p className="text-xs font-semibold text-slate-500 mb-0.5">{char?.name ?? characterId}</p>
        <p className={`text-base min-w-0 break-words leading-relaxed ${textColor}`}>{text}</p>
      </div>
    </div>
  );
}

// --------------- Amy Closing (question + tip) ---------------

function AmyClosing({ story }: { story: StudioStory }) {
  const { t } = useTranslation('studio');

  return (
    <div className="mx-3 mt-5 mb-2 rounded-2xl overflow-hidden border border-violet-100 shadow-sm">
      {/* Section header */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-violet-50 border-b border-violet-100">
        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
          <img
            src={characterAvatarUrl(AMY_CHARACTER.avatarFile)}
            alt="Amy"
            className="w-full h-full object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = assetUrl('media/avatars/thumb/default-96.webp'); }}
          />
        </div>
        <span className="text-xs font-bold text-violet-700">{AMY_CHARACTER.name}</span>
      </div>

      {/* Amy question */}
      <div className="px-4 pt-3 pb-2 bg-white">
        <p className="text-[10px] font-bold text-violet-500 uppercase tracking-wide mb-1.5">{t('view.amyAsks')}</p>
        <p className="text-sm leading-relaxed text-rose-900 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2.5">
          {story.amyQuestion}
        </p>
      </div>

      {/* Amy tip */}
      <div className="px-4 pt-1 pb-3 bg-white">
        <p className="text-[10px] font-bold text-teal-500 uppercase tracking-wide mb-1.5">{t('view.amyTip')}</p>
        <p className="text-sm leading-relaxed text-teal-900 bg-teal-50 border border-teal-100 rounded-xl px-3 py-2.5">
          {story.amyTip}
        </p>
      </div>
    </div>
  );
}

// --------------- Action Bar ---------------

type ActionBarProps = {
  story: StudioStory;
  chatAreaRef: React.RefObject<HTMLDivElement>;
};

function ActionBar({ story, chatAreaRef }: ActionBarProps) {
  const { t } = useTranslation('studio');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const encoded = encodeStory(story);
  const shareUrl = buildShareUrl(encoded);

  useEffect(() => {
    QRCode.toDataURL(shareUrl, { width: 200, margin: 1 })
      .then(setQrDataUrl)
      .catch(console.error);
  }, [shareUrl]);

  function handleCopy() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: story.title ?? t('title'), url: shareUrl }).catch(() => {});
    } else {
      handleCopy();
    }
  }

  async function handleSaveImage() {
    if (!chatAreaRef.current) return;
    setImageLoading(true);
    try {
      const canvas = await html2canvas(chatAreaRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#f8fafc',
        logging: false,
        imageTimeout: 15000,
      });
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/png')
      );
      if (!blob) return;
      const file = new File([blob], 'amic-story.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file] }).catch(() => triggerDownload(blob));
      } else {
        triggerDownload(blob);
      }
    } catch (err) {
      console.error('Image export error:', err);
    } finally {
      setImageLoading(false);
    }
  }

  function triggerDownload(blob: Blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'amic-story.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div className="print:hidden mt-4 border-t border-slate-100 pt-4 pb-8 px-4">
      {/* Primary action */}
      {'share' in navigator ? (
        <button
          type="button"
          onClick={handleShare}
          className="w-full py-3 bg-[var(--color-teal-600,#0d9488)] hover:bg-[var(--color-teal-700,#0f766e)] active:scale-[0.98] text-white font-bold rounded-2xl shadow-md mb-3 transition-all"
        >
          📤 {t('view.share')}
        </button>
      ) : (
        <button
          type="button"
          onClick={handleCopy}
          className="w-full py-3 bg-[var(--color-teal-600,#0d9488)] hover:bg-[var(--color-teal-700,#0f766e)] active:scale-[0.98] text-white font-bold rounded-2xl shadow-md mb-3 transition-all"
        >
          {copied ? t('step4.copied') : `🔗 ${t('step4.copyLink')}`}
        </button>
      )}

      {/* Secondary: small text buttons in one row */}
      <div className="flex items-center justify-center gap-4 mb-4">
        {'share' in navigator && (
          <button
            type="button"
            onClick={handleCopy}
            className="text-xs text-slate-400 hover:text-slate-600"
          >
            🔗 {t('step4.copyLink')}
          </button>
        )}
        <button
          type="button"
          onClick={() => window.print()}
          className="text-xs text-slate-400 hover:text-slate-600"
        >
          🖨️ {t('view.print')}
        </button>
        <button
          type="button"
          onClick={handleSaveImage}
          disabled={imageLoading}
          className="text-xs text-slate-400 hover:text-slate-600 disabled:opacity-50"
        >
          🖼️ {imageLoading ? t('view.saveImageLoading') : t('view.saveImage')}
        </button>
        <button
          type="button"
          onClick={() => setShowQr((v) => !v)}
          className="text-xs text-slate-400 hover:text-slate-600"
        >
          📱 QR
        </button>
      </div>

      {/* QR code collapsible */}
      {showQr && qrDataUrl && (
        <div className="flex flex-col items-center gap-2 py-3 bg-slate-50 rounded-2xl mb-3">
          <img src={qrDataUrl} alt="QR Code" className="w-36 h-36 rounded-xl shadow-sm" />
          <p className="text-xs text-slate-400">{t('step4.qrScanHint')}</p>
        </div>
      )}

      {/* Create own story */}
      <Link
        to="/studio"
        className="block text-center py-2.5 border border-violet-200 text-violet-600 hover:bg-violet-50 text-sm font-semibold rounded-2xl transition-colors"
      >
        {t('view.create')}
      </Link>
    </div>
  );
}

// --------------- Main StudioViewPage ---------------

export default function StudioViewPage() {
  const { encoded } = useParams<{ encoded: string }>();
  const { t } = useTranslation('studio');
  const chatAreaRef = useRef<HTMLDivElement>(null);

  const story = encoded ? decodeStory(encoded) : null;

  if (!story) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 gap-4">
        <style>{`@media print { .no-print { display: none !important; } }`}</style>
        <p className="text-3xl">😕</p>
        <p className="text-lg font-bold text-slate-700">{t('errors.invalidLink')}</p>
        <Link
          to="/studio"
          className="px-5 py-2.5 bg-teal-600 text-white rounded-2xl font-bold text-sm no-print shadow-md"
        >
          {t('view.create')}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Print styles */}
      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
          body { font-size: 12px; }
          img { max-width: 100%; }
        }
        @page { margin: 1.5cm; }
      `}</style>

      <div className="max-w-lg mx-auto pb-4">
        {/* Back link */}
        <div className="print:hidden pt-4 pb-1 px-3">
          <Link to="/studio" className="text-sm text-slate-400 hover:text-teal-600 transition-colors">
            ← Studio
          </Link>
        </div>

        {/* Chat area ref — captured for image export */}
        <div ref={chatAreaRef}>
          <StoryHeader story={story} />

          {/* Chat messages on white background */}
          <div className="bg-white pt-3 pb-2">
            {story.messages.map((msg) => (
              <ChatBubble key={msg.id} characterId={msg.characterId} text={msg.text} />
            ))}
          </div>

          <AmyClosing story={story} />

          {/* Branding footer inside screenshot area */}
          <div className="flex items-center justify-center gap-1.5 py-3 mt-4 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400">Amy Surfwing</span>
            <span className="text-xs text-slate-300">·</span>
            <span className="text-xs text-slate-400">amysurfwing.de</span>
          </div>
        </div>

        <ActionBar story={story} chatAreaRef={chatAreaRef} />
      </div>
    </div>
  );
}
