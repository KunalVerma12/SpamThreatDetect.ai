import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-canvas)] bmac-text">
      <Navbar onOpenSidebar={() => setMobileMenuOpen(true)} />
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 py-8 sm:py-12">
        <Outlet />
      </main>

      <footer className="border-t border-[var(--border-subtle)]/70 py-8 text-center text-xs bmac-muted">
        <p className="font-semibold bmac-subtext">
          Sentinel AI — Beyond Spam Detection. Toward Intelligent Threat Awareness.
        </p>
        <p className="mt-1">
          Powered by Scikit-learn ML, Personal Safety Classifiers, VirusTotal & Groq AI.
        </p>
      </footer>
    </div>
  );
};
