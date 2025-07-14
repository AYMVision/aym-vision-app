import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../common/utils';
import logo from '../assets/logo.png';
import { useEffect, useState } from 'react';

const links = [
  { to: '/', label: 'Home' },
  { to: '/stories', label: 'Stories' },
  { to: '/about', label: 'AYM Vision' },
  { to: '/about#cooperations', label: 'Cooperations' },
];

export default function Layout({
  children,
  backPath,
}: {
  children: React.ReactNode | React.ReactNode[];
  backPath?: string; // Optional prop for the back button
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false); // Close the drawer if screen size grows
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gold-500 flex flex-col">
      <header className="w-full sticky top-0 z-50 bg-white shadow-md">
        <div className="flex items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20">
          <div className="flex md:hidden w-full items-center justify-between">
            {backPath && (
              <button
                onClick={() => navigate(backPath)}
                className="p-2 text-anthracite-700 hover:text-gold-600"
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
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <img src={logo} alt="Logo" className="w-8 h-8" />
              </div>
              <div>
                <div className="font-semibold text-anthracite-900 text-xs sm:text-sm">
                  AYM Vision Chat
                </div>
                <div className="text-[0.65rem] sm:text-xs text-anthracite-500">
                  Online
                </div>
              </div>
            </div>

            <div className="flex-1" />

            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 text-anthracite-700 hover:text-gold-600"
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

          <nav className="hidden md:flex items-center space-x-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'px-4 py-2 text-sm font-medium transition-all duration-200',
                  location.pathname === link.to
                    ? 'text-gold-600'
                    : 'text-anthracite-700 hover:text-gold-600'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex flex-1 justify-end">
            <img src={logo} className="h-24" alt="Logo" />
          </div>
        </div>
      </header>
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-full bg-white shadow-lg z-50 transform transition-transform duration-300',
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-end p-4 bg-gold-500 h-16 sm:h-20">
          <div className="flex-1" />

          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <img src={logo} alt="Logo" className="w-8 h-8" />
            </div>
            <div>
              <div className="font-semibold text-white text-lg">AYM Vision</div>
            </div>
          </div>

          <div className="flex-1" />
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 text-white hover:text-anthracite-700"
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
                'block px-4 py-2 text-sm font-medium transition-all duration-200',
                location.pathname === link.to
                  ? 'text-gold-600'
                  : 'text-anthracite-700 hover:text-gold-600'
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <main className="flex-1 flex flex-col items-center justify-start z-0">
        {children}
      </main>
    </div>
  );
}
