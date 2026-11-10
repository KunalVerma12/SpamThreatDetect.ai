import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Menu,
  Shield,
  Sun,
  Moon,
  RefreshCw,
} from 'lucide-react';
import { useAnalysisSession } from '../../hooks/useAnalysisSession';
import { useTheme } from '../../hooks/useTheme';
import { API_BASE_URL } from '../../services/api';

interface NavbarProps {
  onOpenSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSidebar }) => {
  const { backendStatus, refreshBackendHealth, stats } = useAnalysisSession();
  const { resolvedScheme, toggleTheme } = useTheme();
  const [isChecking, setIsChecking] = React.useState(false);

  const handleCheck = async () => {
    setIsChecking(true);
    await refreshBackendHealth();
    setIsChecking(false);
  };

  const navItems = [
    { to: '/analyzer', label: 'Check Email' },
    { to: '/', label: 'Overview', end: true },
    {
      to: '/history',
      label: stats.totalAnalyzed > 0 ? `History (${stats.totalAnalyzed})` : 'History',
    },
    { to: '/intelligence', label: 'URL Check' },
    { to: '/about', label: 'FAQ & Info' },
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-[var(--bg-canvas)]/90 backdrop-blur-md border-b border-[var(--border-subtle)]/60">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Left Navigation Links (Buy Me a Coffee style) */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={onOpenSidebar}
            aria-label="Open menu"
            className="md:hidden rounded-full p-2.5 bmac-text hover:bg-[var(--bg-soft)] cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <nav className="hidden md:flex items-center gap-1" aria-label="Main">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-[var(--bg-soft)] bmac-text'
                      : 'bmac-subtext hover:bmac-text hover:bg-[var(--bg-soft)]/60'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Center Brand Logo (Buy Me a Coffee style) */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group focus:outline-none"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFDD00] text-[#111111] border-2 border-[#111111] shadow-2xs transition-transform group-hover:-rotate-6">
            <Shield className="w-5 h-5 stroke-[2.4]" />
          </div>
          <span className="text-lg sm:text-xl font-extrabold tracking-tight bmac-text">
            Sentinel AI
          </span>
        </Link>

        {/* Right Actions: API Status + Theme Toggle + Yellow Pill CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleCheck}
            title={`Backend: ${API_BASE_URL} (Click to refresh)`}
            className="inline-flex items-center gap-2 rounded-full bmac-soft px-3.5 py-2 text-xs font-semibold bmac-subtext hover:bmac-text transition-colors cursor-pointer"
          >
            <span
              className={`h-2 w-2 rounded-full ${
                backendStatus.online === true
                  ? 'bg-emerald-500'
                  : backendStatus.online === false
                  ? 'bg-red-500'
                  : 'bg-amber-400'
              }`}
            />
            <span className="hidden sm:inline">
              {backendStatus.online === true
                ? 'API Ready'
                : backendStatus.online === false
                ? 'API Offline'
                : 'Checking...'}
            </span>
            <RefreshCw
              className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`}
            />
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              resolvedScheme === 'dark'
                ? 'Switch to light theme'
                : 'Switch to dark theme'
            }
            className="rounded-full bmac-soft p-2.5 bmac-text hover:opacity-80 transition-opacity cursor-pointer"
          >
            {resolvedScheme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#FFDD00]" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          <Link
            to="/analyzer"
            className="inline-flex items-center justify-center rounded-full bg-[#FFDD00] hover:bg-[#f3d100] px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold text-[#111111] transition-transform active:scale-95"
          >
            Scan Email
          </Link>
        </div>
      </div>
    </header>
  );
};
