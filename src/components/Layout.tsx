import { Link, useLocation } from 'react-router-dom';
import { cn } from '../common/utils';
import logo from '../assets/logo.png';

const links = [
  { to: '/', label: 'Home' },
  { to: '/stories', label: 'Stories' },
  { to: '/about', label: 'AYM Vision' },
  { to: '/about#cooperations', label: 'Cooperations' },
];

export default function Layout({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-gold-500 flex flex-col">
      <header className="w-full sticky top-0 z-50 bg-white shadow-md">
        <div className="flex items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20">
          <nav className="hidden md:flex items-center space-x-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  'px-4 py-2 text-sm font-medium transition-all duration-200',
                  location.pathname === l.to
                    ? 'text-gold-600'
                    : 'text-anthracite-700 hover:text-gold-600'
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex-1"></div>
          <img src={logo} className="h-24" alt="Logo" />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-start">
        {children}
      </main>
    </div>
  );
}
