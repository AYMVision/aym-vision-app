import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '../common/utils';

type BottomNavProps = {
  backTo?: string;
};

export default function BottomNav({ backTo }: BottomNavProps) {
  const location = useLocation();
  const { t } = useTranslation('navigation');

  const items = [
    {
      to: '/stories',
      label: t('storiesKids', { defaultValue: 'Meine Amics' }),
      aria: t('mobileNav.openStories', { defaultValue: 'Stories öffnen' }),
      emoji: '🏠',
      match: (pathname: string) => pathname.startsWith('/stories'),
    },
    {
      to: '/diaries',
      label: t('mobileNav.diaries', { defaultValue: 'Tagebuch' }),
      aria: t('mobileNav.openDiaries', { defaultValue: 'Tagebuch öffnen' }),
      emoji: '📔',
      match: (pathname: string) => pathname.startsWith('/diaries'),
    },
    {
      to: '/newspaper',
      label: t('mobileNav.newspaper', { defaultValue: 'Zeitung' }),
      aria: t('mobileNav.openNewspaper', { defaultValue: 'Schülerzeitung öffnen' }),
      emoji: '📰',
      match: (pathname: string) => pathname.startsWith('/newspaper'),
    },
    {
      to: '/album',
      label: t('mobileNav.album', { defaultValue: 'Sticker' }),
      aria: t('mobileNav.openAlbum', { defaultValue: 'Sticker-Album öffnen' }),
      emoji: '✨',
      match: (pathname: string) => pathname.startsWith('/album'),
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85"
      aria-label="Mobile navigation"
    >
      <div className="grid grid-cols-4 px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        {items.map((item) => {
          const active = item.match(location.pathname);

          return (
            <Link
              key={item.to}
              to={item.to}
              state={backTo ? { backTo } : undefined}
              aria-label={item.aria}
              className={cn(
                'mx-1 rounded-2xl px-2 py-2 flex flex-col items-center justify-center text-center transition',
                active
                  ? 'bg-[var(--color-teal-50)] text-[var(--color-teal-700)]'
                  : 'text-slate-500 hover:bg-slate-50'
              )}
            >
              <span className="text-lg leading-none" aria-hidden="true">
                {item.emoji}
              </span>
              <span className="mt-1 text-[11px] font-extrabold leading-none">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}