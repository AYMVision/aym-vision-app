import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '../common/utils';
import { useProfile } from '../profile/useProfile';
import { getEpisodeMetaByCourseId } from '../content/contentIndex';

type BottomNavProps = {
  backTo?: string;
};

export default function BottomNav({ backTo }: BottomNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation('navigation');
  const { profile } = useProfile();

  const currentCourseId = profile.progress?.current?.courseId;
  const episodeMeta = currentCourseId ? getEpisodeMetaByCourseId(currentCourseId) : null;
  const storyPath = episodeMeta
    ? (episodeMeta.storyEngine === 'v2'
        ? `/stories-v02/${currentCourseId}`
        : `/stories/${currentCourseId}`)
    : '/stories';

  const hasCurrent = !!currentCourseId;

  const navItems = [
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
      to: '/profile',
      label: t('mobileNav.profile', { defaultValue: 'Profil' }),
      aria: t('mobileNav.openProfile', { defaultValue: 'Profil öffnen' }),
      emoji: '👤',
      match: (pathname: string) => pathname.startsWith('/profile'),
    },
  ];

  const isOnStory =
    location.pathname.startsWith('/stories') ||
    location.pathname === '/';

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85"
      aria-label="Mobile navigation"
    >
      <div className="grid grid-cols-4 px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        {/* Start / Weiter — prominenter erster Button */}
        <button
          type="button"
          onClick={() => navigate(storyPath)}
          aria-label={hasCurrent
            ? t('mobileNav.continueStory', { defaultValue: 'Story weitermachen' })
            : t('mobileNav.startStory', { defaultValue: 'Story starten' })}
          className={cn(
            'mx-1 rounded-2xl px-2 py-2 flex flex-col items-center justify-center text-center transition',
            isOnStory
              ? 'bg-[var(--color-teal-50)] text-[var(--color-teal-700)]'
              : 'bg-[var(--color-teal-700)] text-white hover:bg-[var(--color-teal-800)]'
          )}
        >
          <span className="text-lg leading-none" aria-hidden="true">
            {hasCurrent ? '▶️' : '🚀'}
          </span>
          <span className="mt-1 text-[11px] font-extrabold leading-none">
            {hasCurrent
              ? t('mobileNav.continue', { defaultValue: 'Weiter' })
              : t('mobileNav.start', { defaultValue: 'Start' })}
          </span>
        </button>

        {/* Restliche Nav-Items */}
        {navItems.map((item) => {
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
                  ? 'bg-[var(--color-teal-600)] text-white'
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
