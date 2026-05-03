import React from 'react';
import type { Message, Reaction, BubbleTheme } from '../common/types';
import { useProfile } from '../profile/useProfile';
import { useTranslation } from 'react-i18next';

import AvatarLookCircle from './AvatarLookCircle';
import SmartImage from './SmartImage';
import { assetUrl } from '../common/assetUrl';
import { useLocation, useNavigate } from 'react-router-dom';
import { unlockBonusById } from '../bonus/unlockBonusById.ts';
import AudioBubble from './AudioBubble';



// -----------------------------
// Themes
// -----------------------------
type BubbleThemeLite = { bg: string; border: string; text: string };

const MAIN_THEME_BY_SPEAKER: Record<string, BubbleThemeLite> = {
  Amy: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-900' }
};

const DEFAULT_MAIN_THEME: BubbleThemeLite = {
  bg: 'bg-blue-50',
  border: 'border-blue-200',
  text: 'text-blue-900',
};

// -----------------------------
// Helpers: image src resolving
// -----------------------------
function isAbsoluteish(v?: string) {
  if (!v) return false;
  return v.startsWith('http://') || v.startsWith('https://') || v.startsWith('/') || v.startsWith('data:');
}

const MSG_IMG_WIDTHS = [512, 1024, 1536] as const;

function stripKnownSizeSuffix(src: string) {
  return src.replace(/-\d+\.(webp|avif|png|jpg|jpeg)$/i, '');
}

function buildMsgCandidates(rawSrc: string) {
  // Use assetUrl for all local paths (incl. those starting with /) so that
  // production builds with base:'./' resolve correctly on subpath deployments.
  // Only skip assetUrl for truly external URLs and data URIs.
  const isExternal = /^(https?:\/\/|data:)/.test(rawSrc);
  const src = isExternal ? rawSrc : assetUrl(rawSrc);

  const looksSized = /-\d+\.(webp|avif)$/i.test(src);
  if (!looksSized) return null;

  const base = stripKnownSizeSuffix(src);

  const avif = MSG_IMG_WIDTHS.map((w) => ({ src: `${base}-${w}.avif`, w }));
  const webp = MSG_IMG_WIDTHS.map((w) => ({ src: `${base}-${w}.webp`, w }));

  const fallback = `${base}-1024.webp`;
  return { avif, webp, fallback };
}

function MessageImage({ src }: { src?: string }) {
  if (!src) return null;

  const cand = buildMsgCandidates(src);

  if (cand) {
    return (
      <SmartImage
        alt=""
        className="w-full rounded-lg mb-1 max-h-96 object-contain"
        sizes="(min-width: 768px) 420px, 80vw"
        avif={cand.avif}
        webp={cand.webp}
        fallback={cand.fallback}
        onErrorFallback={assetUrl('media/ui/locked-512.webp')}
        loading="lazy"
        decoding="async"
      />
    );
  }


  // Fallback: no candidates (e.g. png or not resized)
  const isExternal = /^(https?:\/\/|data:)/.test(src ?? '');
  const resolved = isExternal ? (src ?? '') : assetUrl(src ?? '');
  return (
    <img
      alt=""
      src={resolved}
      className="w-full rounded-lg mb-1 max-h-96 object-contain"
      loading="lazy"
      decoding="async"
    />
  );
}


function BubbleMeta({ msg, isMain }: { msg: Message; isMain: boolean }) {
  const fwd = msg.forwarded;
  const rep = msg.replyTo;

  if (!fwd && !rep) return null;

  return (
    <div className="mb-2 space-y-2">
      {fwd ? (
        <div
  className={[
    'text-[11px] font-bold leading-tight',
    isMain ? 'text-white/90' : 'text-slate-700',
  ].join(' ')}
>

          Weitergeleitet
          {fwd.fromName ? (
            <span className="font-bold text-slate-600"> · von {fwd.fromName}</span>
          ) : null}
          {fwd.fromChatLabel ? (
            <span className="font-normal text-slate-500"> ({fwd.fromChatLabel})</span>
          ) : null}
        </div>
      ) : null}

      {rep ? (
        <div
  className={[
    'rounded-xl border px-3 py-2',
    isMain ? 'border-white/30 bg-white/15' : 'border-slate-200 bg-white/70',
  ].join(' ')}
>

          <div
  className={[
    'text-[11px] font-bold leading-tight',
    isMain ? 'text-white/90' : 'text-slate-700',
  ].join(' ')}
>

            {rep.speakerName ?? 'Antwort'}
          </div>
          <div
  className={[
    'text-[12px] leading-snug line-clamp-2',
    isMain ? 'text-white/80' : 'text-slate-600',
  ].join(' ')}
>

            {rep.text}
          </div>
        </div>
      ) : null}
    </div>
  );
}



// -----------------------------
// Avatar resolving (characters)
// -----------------------------
const DEFAULT_CHARACTER_ID = 'default';
const AVATAR_SIZES = [256, 512] as const;
const CHARACTER_AVATAR_ROOT = 'media/story/characters';

function isLikelyUrlOrPath(v?: string) {
  if (!v) return false;
  return v.startsWith('http://') || v.startsWith('https://') || v.startsWith('/') || v.startsWith('data:');
}

function normalizeCharacterId(v?: string) {
  const id = (v ?? '').trim().toLowerCase();
  return id || DEFAULT_CHARACTER_ID;
}

function characterAvatarCandidates(avatar?: string) {
  if (isLikelyUrlOrPath(avatar)) {
    return {
      avif: undefined as { src: string; w: number }[] | undefined,
      webp: undefined as { src: string; w: number }[] | undefined,
      fallback: avatar!,
      onErrorFallback: assetUrl(`${CHARACTER_AVATAR_ROOT}/${DEFAULT_CHARACTER_ID}-256.webp`),
    };
  }

  const id = normalizeCharacterId(avatar);

  return {
    avif: AVATAR_SIZES.map((w) => ({ src: assetUrl(`${CHARACTER_AVATAR_ROOT}/${id}-${w}.avif`), w })),
    webp: AVATAR_SIZES.map((w) => ({ src: assetUrl(`${CHARACTER_AVATAR_ROOT}/${id}-${w}.webp`), w })),
    fallback: assetUrl(`${CHARACTER_AVATAR_ROOT}/${id}-256.webp`),
    onErrorFallback: assetUrl(`${CHARACTER_AVATAR_ROOT}/${DEFAULT_CHARACTER_ID}-256.webp`),
  };
}

function CharacterAvatar({
  avatar,
  name,
  fallbackLetter,
}: {
  avatar?: string;
  name?: string;
  fallbackLetter: string;
}) {
  const img = characterAvatarCandidates(avatar);

  return (
    <div className="w-16 h-16 rounded-full flex-shrink-0 bg-white border border-slate-200 overflow-hidden">
      <SmartImage
        alt={name || fallbackLetter}
        className="w-full h-full object-cover"
        width={48}
        height={48}
        sizes="48px"
        avif={img.avif}
        webp={img.webp}
        fallback={img.fallback}
        onErrorFallback={img.onErrorFallback}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

// -----------------------------
// UI helpers
// -----------------------------
function ReactionPills({ reactions }: { reactions?: Reaction[] }) {
  if (!reactions?.length) return null;

  return (
    <div className="absolute -bottom-0.3 right-2 flex gap-1">
      {reactions.map((r, i) => (
        <span
          key={`${r.type ?? 'r'}-${r.emoji}-${i}`}
          className="px-1.5 py-0.5 text-base bg-white border border-gray-200 rounded-full shadow-sm leading-none"
          title={r.type ?? undefined}
        >
          {r.emoji}
        </span>
      ))}
    </div>
  );
}

function ReplyPreview({
  text,
  speakerName,
  inverted,
}: {
  text: string;
  speakerName?: string;
  inverted?: boolean;
}) {
  return (
    <div
      className={[
        'mb-1 rounded-lg px-2 py-1 text-sm min-w-0 border',
        inverted ? 'bg-white/15 border-white/25' : 'bg-gray-50 border-gray-200',
      ].join(' ')}
    >
      {speakerName && (
        <div className={['font-semibold leading-tight truncate', inverted ? 'text-white' : 'text-gray-700'].join(' ')}>
          {speakerName}
        </div>
      )}
      <div className={['line-clamp-2', inverted ? 'text-blue-50' : 'text-gray-600'].join(' ')}>
        {text}
      </div>
    </div>
  );
}

function TimeStamp({ value, align = 'end' }: { value?: string; align?: 'end' | 'start' | 'center' }) {
  if (!value) return null;
  const cls =
    align === 'start' ? 'justify-start' : align === 'center' ? 'justify-center' : 'justify-end';
  return (
    <div className={`mt-1 flex items-center ${cls}`}>
      <span className="text-[11px] text-anthracite-400">{value}</span>
    </div>
  );
}
interface ChatMessageProps {
  message: Message;
  onOpenBonusLink?: (payload: { linkTo: string; bonusId?: string }) => void;
}


function MessageBody({
  message,
  isMain,
  mainTextClass,
  chatName,
}: {
  message: Message;
  isMain: boolean;
  mainTextClass: string;
  chatName?: string;
}) {
  if (message.type === 'audio') {
    if (!message.audioSrc) return null;
    return (
      <AudioBubble
        src={message.audioSrc}
        label={message.audioLabel ?? 'Sprachnachricht'}
        durationSec={message.audioDurationSec}
      />
    );
  }

  if (!message.content) return null;

  const resolvedContent = message.content.replace(
    /\{\{chatName\}\}/g,
    (chatName ?? '').trim() || 'du'
  );

  return (
    <p className={`text-lg min-w-0 break-words leading-relaxed ${isMain ? mainTextClass : 'text-anthracite-800'}`}>
      {resolvedContent}
    </p>
  );
}



export default function ChatMessage({ message, onOpenBonusLink }: ChatMessageProps) {
  const { profile } = useProfile();
  const { t } = useTranslation('stories');

  const navigate = useNavigate();
  const location = useLocation();

  const isUser = message.type === 'user';
  const isMain = message.type === 'main';
  const isSystem = message.type === 'system';

  const hasReactions = !!message.reactions?.length;

  const bubbleBottomPad = hasReactions ? 'pb-3' : '';

  const speakerTheme: BubbleTheme | undefined = message.speaker?.mainTheme;
  const mainTheme =
    (isMain && speakerTheme) ||
    (isMain && message.speaker?.name && MAIN_THEME_BY_SPEAKER[message.speaker.name]) ||
    DEFAULT_MAIN_THEME;

  // -----------------------------
  // Image src normalisieren
  // -----------------------------
  const imgSrc = message.image || undefined;

  // -----------------------------
  // System (center)
  // -----------------------------
  if (isSystem) {
    // ✅ chat-switch wird als Mini-Header in Story.tsx gerendert → hier ausblenden
    if (message.kind === 'chat-switch' && message.scene) return null;

    if (message.type === 'system' && message.image) {
  return (
    <div className="my-3 w-full">
      <img
        src={assetUrl(message.image)}
        alt=""
        className="block w-full h-auto object-contain"
        loading="lazy"
      />
    </div>
  );
}

if (message.kind === 'chapter-divider') {
  return (
    <div className="flex justify-center my-4">
      <div className="px-4 py-2 rounded-2xl bg-white/85 border border-slate-200 text-center shadow-sm">
        <div className="text-xs font-semibold tracking-wide text-slate-500">
          {message.chapterMeta?.title ?? message.content}
        </div>

        {message.chapterMeta?.subtitle ? (
          <div className="mt-1 text-[11px] text-slate-400">
            {message.chapterMeta.subtitle}
          </div>
        ) : null}
      </div>
    </div>
  );
}

    // ✅ NEU: bonus-link (klickbar)
    if (message.kind === 'bonus-link') {
      const title = String(message.content ?? '📰 Extra');
      const linkTo = (message as any).linkTo as string | undefined;
      const linkLabel = (message as any).linkLabel as string | undefined;

      return (
        <div className="flex justify-center my-2">
          <div className="max-w-[92%] rounded-2xl px-3 py-3 bg-white/85 border border-slate-200 backdrop-blur text-center">
            <div className="text-xs text-slate-600 font-semibold">{title}</div>

            {linkTo ? (
              <button
                type="button"
                className="mt-2 inline-flex items-center justify-center rounded-2xl px-4 py-2 text-xs font-extrabold bg-slate-900 text-white hover:bg-slate-800"
onClick={() => {
  const bid = (message as any).bonusId as string | undefined;

  // ✅ Delegiere an Story (damit Scroll + Snap korrekt gespeichert werden)
  if (onOpenBonusLink && linkTo) {
    onOpenBonusLink({ linkTo, bonusId: bid });
    return;
  }

  // Fallback: altes Verhalten (nur falls woanders verwendet)
  if (bid) unlockBonusById(bid);

  navigate(linkTo, {
    state: {
      backgroundLocation: location,
      backTo: location.pathname + location.search,
    },
  });
}}



              >
                {linkLabel ?? 'Jetzt öffnen →'}
              </button>
            ) : null}

            {message.timestamp ? (
              <div className="mt-1 text-[0.65rem] text-slate-400">{message.timestamp}</div>
            ) : null}
          </div>
        </div>
      );
    }

    const isSwitch = message.kind === 'chat-switch' && !!message.scene;
    const tone = message.scene?.tone;

    const emoji = tone === 'class' ? '🏫' : tone === 'newsroom' ? '📰' : '🔒';

    // labelKey ist i18n key → übersetzen, wenn möglich
    const label = isSwitch && message.scene?.labelKey ? t(message.scene.labelKey) : '';

    // optionaler Titel (z.B. "Klasse 7b")
    const switchTitle = isSwitch && message.scene?.title ? message.scene.title : '';

    // Teilnehmer nur anzeigen, wenn es keinen title gibt
    const participants =
      isSwitch && !switchTitle && message.scene?.participants?.length
        ? message.scene.participants.map((p) => p.name).join(', ')
        : '';

    return (
      <div className="flex justify-center my-2">
        <div className="max-w-[90%] rounded-2xl px-3 py-2 bg-white/80 border border-slate-200 backdrop-blur text-center">
          {/* ✅ System-Bild anzeigen, falls vorhanden */}
          <MessageImage src={imgSrc} />

          {isSwitch ? (
            <>
              <div className="text-xs text-slate-500 font-medium">
                {emoji} {label || 'Chat'}
              </div>

              {(switchTitle || participants) && (
                <div className="text-[0.72rem] text-slate-400 mt-0.5">
                  {switchTitle || participants}
                </div>
              )}
            </>
          ) : (
            <>
              {message.content ? (
                <div className="text-xs text-slate-500">{message.content}</div>
              ) : null}
            </>
          )}

          {message.timestamp ? (
            <div className="mt-1 text-[0.65rem] text-slate-400">{message.timestamp}</div>
          ) : null}
        </div>
      </div>
    );
  }


  // -----------------------------
  // Safety card (right)
  // -----------------------------
  if (message.kind === 'safety-self-harm') {
    return (
      <div className="w-full flex justify-end items-end gap-2 my-1">
          <div className="relative min-w-0 max-w-[82%] break-words rounded-2xl rounded-br-md p-3 shadow-sm bg-red-50 border border-red-200">
            {message.speaker?.name && (
              <p className="text-sm font-semibold text-anthracite-600 mb-1 text-left">
                {message.speaker.name}
              </p>
            )}

            {message.content && <p className="text-base text-red-900 break-words">{message.content}</p>}

            <div className="mt-3 flex flex-col gap-2 min-w-0">
              <a className="min-w-0 break-words px-3 py-2 rounded-xl bg-white border border-red-200 text-sm font-semibold text-red-900 hover:bg-red-100" href="tel:112">
                112 (Notfall)
              </a>
              <a className="min-w-0 break-words px-3 py-2 rounded-xl bg-white border border-red-200 text-sm font-semibold text-red-900 hover:bg-red-100" href="tel:116123">
                TelefonSeelsorge 116 123 (kostenlos &amp; anonym)
              </a>
              <a className="min-w-0 break-words px-3 py-2 rounded-xl bg-white border border-red-200 text-sm font-semibold text-red-900 hover:bg-red-100" href="tel:116111">
                Nummer gegen Kummer 116 111 (für Kinder/Jugendliche)
              </a>
            </div>

            <p className="mt-3 text-xs text-red-800 break-words">
              Sprich jetzt mit einem Erwachsenen in deiner Nähe. Diese Angebote sind unabhängig von dieser App.
            </p>

            <TimeStamp value={message.timestamp} />

          </div>

          <CharacterAvatar
            avatar={message.speaker?.avatar}
            name={message.speaker?.name}
            fallbackLetter={message.speaker?.name?.charAt(0) || 'A'}
          />
        </div>
    );
  }


  // -----------------------------
  // User (right)
  // -----------------------------
  if (isUser) {
    return (
      <div className="w-full flex justify-end items-end gap-2 my-1">
          <div
            className={[
              'relative min-w-0 max-w-[82%] break-words rounded-2xl rounded-br-md p-2 shadow-md',
              'bg-blue-600/60 text-white',
              bubbleBottomPad,
            ].join(' ')}
          >
<BubbleMeta msg={message} isMain={true} />


<MessageImage src={imgSrc} />

<MessageBody
  message={message}
  isMain={true}
  mainTextClass="text-white"
  chatName={profile.chatName}
/>



            <TimeStamp value={message.timestamp} />

            <div className="flex items-center justify-end gap-1 -mt-1" aria-hidden="true">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-100" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" transform="translate(4, 0)" />
              </svg>
            </div>

            <ReactionPills reactions={message.reactions} />
          </div>

          <AvatarLookCircle
            avatarBaseId={profile.avatarBaseId}
            equipment={profile.equipment}
            size={64}
            className="rounded-full border-slate-200 bg-white flex-shrink-0 w-16 h-16"
            alt="Du"
          />
        </div>
    );
  }

  // -----------------------------
  // Main (left) + Other (left)
  // -----------------------------
  return (
    <div className="w-full flex items-end gap-2 justify-start my-2.5">
      <CharacterAvatar
        avatar={message.speaker?.avatar}
        name={message.speaker?.name}
        fallbackLetter={message.speaker?.name?.charAt(0) || 'A'}
      />

      <div
        className={[
          'relative min-w-0 max-w-[82%] break-words rounded-2xl rounded-bl-md p-2 shadow-sm border',
          bubbleBottomPad,
          isMain ? `${mainTheme.bg} ${mainTheme.border}` : 'bg-white border-gray-200',
        ].join(' ')}
      >
        {message.speaker?.name && (
          <p className="text-sm font-semibold text-anthracite-600 mb-0.5 text-left">
            {message.speaker.name}
          </p>
        )}

        <BubbleMeta msg={message} isMain={isMain} />
        <MessageImage src={imgSrc} />
        <MessageBody
          message={message}
          isMain={isMain}
          mainTextClass={mainTheme.text}
          chatName={profile.chatName}
        />

        <TimeStamp value={message.timestamp} align="start" />
        <ReactionPills reactions={message.reactions} />
      </div>
    </div>
  );
}
