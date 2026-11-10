import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, X } from 'lucide-react';
import { useAnalysisSession } from '../../hooks/useAnalysisSession';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { stats } = useAnalysisSession();

  if (!isOpen) return null;

  const navItems = [
    { to: '/analyzer', label: 'Check Email' },
    { to: '/', label: 'Overview', end: true },
    {
      to: '/history',
      label:
        stats.totalAnalyzed > 0
          ? `History (${stats.totalAnalyzed})`
          : 'History',
    },
    { to: '/intelligence', label: 'URL Check' },
    { to: '/about', label: 'FAQ & Info' },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className="relative z-10 flex h-full w-72 flex-col bg-[var(--bg-surface)] p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-6 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FFDD00] text-[#111111] border-2 border-[#111111]">
              <Shield className="w-4 h-4 stroke-[2.4]" />
            </div>
            <span className="text-lg font-extrabold bmac-text">
              Sentinel AI
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-full p-2 bmac-muted hover:bmac-text cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-6 flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `rounded-2xl px-4 py-3 text-sm font-bold transition-colors ${
                  isActive
                    ? 'bg-[#FFDD00] text-[#111111]'
                    : 'bmac-subtext hover:bg-[var(--bg-soft)]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </div>
  );
};
