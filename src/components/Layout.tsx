import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../common/utils';
import logo from '../assets/logo.png';
import { useEffect, useState } from 'react';
import { LanguageSelector } from './LanguageSelector';
import { useTranslation } from 'react-i18next';
import Footer from './Footer';

export default function Layout({
  children,
  backPath,
}: {
  children: React.ReactNode | React.ReactNode[];
  backPath?: string;
}) {
  const location = useLocation();
  const { t } = useTranslation('navigation');
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { to: '/', label: t('home') },
    { to: '/stories', label: t('stories') },
    { to: '/about', label: t('about') },
    { to: '/about#call-for-action', label: t('cooperations') },
  ];

  // Helper to detect active link (supports hash)
  const isActive = (to: string) => {
    const current = location.pathname + (location.hash || '');
    return current === to;
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-teal-300)] flex flex-col">
      <header className="w-full sticky top-0 z-50 bg-white shadow-md">
        <div className="flex items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20">
          {/* Mobile header */}
          <div className="flex md:hidden w-full items-center justify-between">
            {backPath && (
              <button
                onClick={() => navigate(backPath)}
                className="p-2 text-[var(--color-teal-900)] hover:text-[var(--color-teal-400)]"
                aria-label="Back"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </button>
            )}

            <div className="flex-1" />

            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <img
                  src={logo}
                  alt="Logo"
                  className="w-10 h-10 object-cover object-center"
                />
              </div>
              <div>
                <div className="font-semibold text-[var(--color-teal-900)] text-sm">
                  Amy Surfwing
                </div>
                <div className="text-xs text-[var(--color-teal-500)]">
                  Surf smart
                </div>
              </div>
            </div>

            <div className="flex-1" />

            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 text-[var(--color-teal-900)] hover:text-[var(--color-teal-400)]"
              aria-label="Open menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5m-16.5 5.25h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center space-x-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'px-4 py-2 text font-medium transition-colors duration-200',
                  isActive(link.to)
                    ? 'text-[var(--color-teal-400)]'
                    : 'text-[var(--color-teal-900)] hover:text-[var(--color-teal-300)]'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex flex-1 justify-end items-center gap-4">
            <img src={logo} className="h-18 w-auto" alt="Logo" />
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-full bg-white shadow-lg z-50 transform transition-transform duration-300',
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-end p-4 bg-[var(--color-teal-500)] shadow-sm h-16 sm:h-20">
          <div className="flex-1" />

          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
              <img
                src={logo}
                alt="Logo"
                className="w-10 h-10 object-cover object-center"
              />
            </div>
            <div>
              <div className="font-semibold text-white text-lg">AYM VISION</div>
            </div>
          </div>

          <div className="flex-1" />
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 text-white hover:text-gray-100"
            aria-label="Close menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col space-y-1 p-4">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                'block px-4 py-2 text-md font-medium transition-colors duration-200',
                isActive(link.to)
                  ? 'text-[var(--color-teal-300)]'
                  : 'text-[var(--color-teal-900)] hover:text-[var(--color-teal-400)]'
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <LanguageSelector className="px-4 py-2" />
        </nav>
      </div>

      <main className="flex-1 flex flex-col items-center justify-start z-0">
        {children}
      </main>

      {/* Footer immer sichtbar */}
      <Footer />
    </div>
  );
}
