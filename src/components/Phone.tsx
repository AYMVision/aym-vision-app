// src/components/Phone.tsx
// Phone UI shell used by Story view.
// - Optional header (only when showHeader=true)
// - Optional composer (showComposer=false for Story V02)
// - Auto-scroll behavior that respects user's scroll position

import { useLayoutEffect, useRef, type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { assetUrl } from '../common/assetUrl';

type SceneTone = 'private' | 'class' | 'newsroom';

const SCENE_EMOJI: Record<SceneTone, string> = {
  private: '🔒',
  class: '🏫',
  newsroom: '📰',
};

interface PhoneProps extends PropsWithChildren {
  inputPlaceholder?: string;
  onSubmitMessage?: (message: string) => void;
  autoScroll?: boolean;
  showComposer?: boolean;

  showHeader?: boolean;
  sceneLabel?: string;
  headerTitle?: string;
  headerSubtitle?: string;
  headerAvatarSrc?: string;
  headerAvatarTargetAttr?: string;
  headerCoins?: number;
  onBack?: () => void;
  onMenu?: () => void;
  scrollRef?: React.MutableRefObject<HTMLDivElement | null>;

  sceneTone?: SceneTone;
  sceneTitle?: string;
  sceneParticipants?: string[];
}

export default function Phone({
  children,
  inputPlaceholder = 'Deine Antwort…',
  onSubmitMessage,
  autoScroll = true,
  showComposer = true,

  showHeader = false,
  headerTitle,
  headerSubtitle,
  headerAvatarSrc,
  headerAvatarTargetAttr,
  headerCoins,
  onBack,
  onMenu,

  sceneTone = 'private',
  sceneTitle = '',
  sceneParticipants = [],
  scrollRef,
}: PhoneProps) {
  const { t } = useTranslation('navigation');
  const containerRef = useRef<HTMLDivElement>(null);
  const userTextRef = useRef<HTMLInputElement>(null);

  const setScrollEl = (el: HTMLDivElement | null) => {
    containerRef.current = el;
    if (scrollRef) scrollRef.current = el;
  };

  const distanceToBottomRef = useRef<number>(0);

  const updateDistanceToBottom = () => {
    const container = containerRef.current;
    if (!container) return;

    const distanceToBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    distanceToBottomRef.current = distanceToBottom;
  };

  const handleScroll = () => {
    updateDistanceToBottom();
  };

  const scrollToBottom = () => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
      updateDistanceToBottom();
    }
  };

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!autoScroll) {
      updateDistanceToBottom();
      return;
    }

    const threshold = 50;
    const prevDistanceToBottom = distanceToBottomRef.current;
    const wasPreviouslyAtBottom = prevDistanceToBottom < threshold;

    if (wasPreviouslyAtBottom) {
      scrollToBottom();
    } else {
      updateDistanceToBottom();
    }
  }, [children, autoScroll]);

  return (
    <div className="relative w-full h-full min-h-0 flex flex-col lg:max-w-[400px] xl:max-w-[440px]">

      <div className="flex flex-1 min-h-0 relative lg:p-[0.5rem] lg:shadow-2xl lg:bg-gray-950 lg:rounded-[2.5rem]">
        <div className="bg-gray-50 w-full h-full min-h-0 lg:h-auto lg:aspect-[9/19.5] flex flex-col overflow-hidden relative lg:rounded-[2.2rem]">
          <div className="hidden lg:block absolute top-0 left-1/2 transform -translate-x-1/2 w-[35%] h-[3.5%] bg-gray-950 rounded-b-2xl z-10" />

          <div className="h-[6%] hidden lg:flex items-end px-[6%] pb-[0.5%] text-[0.6rem] lg:text-xs font-medium text-gray-800">
            <span>9:41</span>
            <div className="ml-auto flex items-center gap-[2%]">
              <div className="w-5 h-2.5 lg:w-6 lg:h-3 border border-gray-800 rounded-sm">
                <div className="w-full h-full bg-gray-800 rounded-sm scale-x-[0.7] origin-left" />
              </div>
            </div>
          </div>

          {showHeader && (
            <div className="bg-white/90 backdrop-blur-lg border-b border-slate-200/60 px-[4%] py-[2.5%] flex items-center gap-[2%]">
              {/* Back button */}
              <button
                className="shrink-0 p-[2%] -ml-[2%] rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors"
                type="button"
                aria-label={t('back', { defaultValue: 'Zurück' })}
                onClick={onBack}
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-teal-700)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Avatar + title */}
              <div className="flex items-center gap-[3%] min-w-0 flex-1">
                {headerAvatarSrc ? (
                  <img
                    src={headerAvatarSrc}
                    data-reward-target={headerAvatarTargetAttr}
                    alt=""
                    className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-slate-200 bg-white"
                  />
                ) : (
                  <div className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-[var(--color-teal-400)] to-[var(--color-teal-600)] rounded-full flex items-center justify-center text-white font-semibold text-[0.7rem] sm:text-xs">
                    AY
                  </div>
                )}

                <div className="min-w-0">
                  <div className="font-semibold text-gray-900 text-xs sm:text-sm truncate leading-tight">
                    {headerTitle ?? ''}
                  </div>
                  <div className="text-[0.62rem] sm:text-xs text-gray-500 flex items-center gap-1 min-w-0 leading-tight">
                    <span aria-hidden>{SCENE_EMOJI[sceneTone]}</span>
                    <span className="truncate min-w-0">
                      {sceneTitle
                        ? sceneTitle
                        : sceneParticipants.length > 0
                        ? sceneParticipants.join(', ')
                        : (headerSubtitle ?? '')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Coins pill */}
              {headerCoins != null && (
                <div className="shrink-0 flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-xl px-2 py-1 text-xs font-semibold">
                  <img src={assetUrl('media/story/ui/coin-128.webp')} alt="" className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">{headerCoins}</span>
                </div>
              )}

              {/* Menu button */}
              <button
                className="shrink-0 p-[2%] -mr-[2%] rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors"
                type="button"
                aria-label={t('menu', { defaultValue: 'Menü' })}
                onClick={onMenu}
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </button>
            </div>
          )}

          <div
            ref={setScrollEl}
            onScroll={handleScroll}
            className="flex-1 min-h-0 overflow-y-auto px-[4%] py-[4%]"
          >
            <div className="flex flex-col gap-2 h-full">{children}</div>
          </div>

          {showComposer && (
            <div className="bg-white border-t border-gold-200/50 px-[4%] py-[3%]">
              <div className="flex items-center gap-[3%]">
                <button
                  className="p-[2%] text-gray-500 hover:text-gray-700 transition-colors"
                  type="button"
                  aria-label="Add"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>

                <div className="flex-1 relative">
                  <input
                    ref={userTextRef}
                    className="w-full py-[6%] px-[5%] pr-[12%] rounded-full bg-gold-50 text-gray-800 placeholder-gray-500 outline-none focus:ring-2 focus:ring-gold-500 focus:bg-white transition-all text-[16px] sm:text-sm"
                    placeholder={inputPlaceholder}
                    onKeyDown={(e) => {
                      if ((e as any).isComposing) return;

                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();

                        const message = userTextRef.current?.value ?? '';
                        const trimmed = message.trim();
                        if (!trimmed) return;

                        onSubmitMessage?.(trimmed);

                        if (userTextRef.current) userTextRef.current.value = '';
                      }
                    }}
                  />

                  <button
                    className="absolute right-[2%] top-1/2 transform -translate-y-1/2 p-[2%] text-gray-500 hover:text-gray-700 transition-colors"
                    type="button"
                    aria-label="Emoji"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const message = userTextRef.current?.value ?? '';
                    if (typeof onSubmitMessage === 'function') onSubmitMessage(message);
                    if (userTextRef.current) userTextRef.current.value = '';
                  }}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                  aria-label="Send"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <div className="h-[4%] hidden lg:flex items-center justify-center pb-[1%]">
            <div className="w-[35%] h-[0.5%] min-h-[3px] bg-gray-800 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}