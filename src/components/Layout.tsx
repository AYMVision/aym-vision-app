import { Link, useLocation } from 'react-router-dom';
import { cn } from '../common/utils';

const links = [
  { to: '/', label: 'Start' },
  { to: '/courses', label: 'Kurse' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-[#f2f2f2] flex flex-col">
      <header className="w-full bg-white shadow-md">
        <div className="flex items-center max-w-6xl mx-auto px-8 h-20">
          <span className="text-2xl font-extrabold text-[#0084ff] select-none tracking-tight">
            AYM Vision
          </span>
          <nav className="ml-8 space-x-6 flex items-center">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  'text-lg font-medium transition-colors hover:text-[#0084ff]',
                  location.pathname === l.to
                    ? 'text-[#0084ff]'
                    : 'text-gray-700'
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-start">
        {children}
      </main>
    </div>
  );
}
