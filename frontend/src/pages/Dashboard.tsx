import React from 'react';
import { Link } from 'react-router-dom';
import {
  MailSearch,
  ShieldAlert,
  Flame,
  GlobeLock,
  Star,
  Cpu,
  ShieldCheck,
  Sparkles,
  Globe,
} from 'lucide-react';
import { useAnalysisSession } from '../hooks/useAnalysisSession';
import { StatCard } from '../components/dashboard/StatCard';
import { ThreatChart } from '../components/dashboard/ThreatChart';
import { RecentActivity } from '../components/dashboard/RecentActivity';

export const Dashboard: React.FC = () => {
  const { stats, history } = useAnalysisSession();

  return (
    <div className="space-y-12">
      {/* Buy Me a Coffee Inspired Hero Section with Floating Side Cards */}
      <section className="relative py-8 sm:py-14 text-center">
        {/* Left Floating Cards (Desktop) */}
        <div className="hidden lg:flex flex-col gap-5 absolute left-0 top-6 w-52 pointer-events-none">
          <div className="rounded-3xl bmac-card p-4 -rotate-3 text-left">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFDD00]/30 text-[#111111] dark:text-[#FFDD00] mb-2">
              <Cpu className="w-4 h-4" />
            </div>
            <p className="text-xs font-extrabold bmac-text">
              Spam & Phishing ML
            </p>
            <p className="mt-0.5 text-[11px] bmac-muted leading-snug">
              Word2Vec + 26 URL & lexical features
            </p>
          </div>

          <div className="rounded-3xl bmac-card p-4 rotate-3 translate-x-3 text-left">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/15 text-red-600 dark:text-red-400 mb-2">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <p className="text-xs font-extrabold bmac-text">
              Personal Safety
            </p>
            <p className="mt-0.5 text-[11px] bmac-muted leading-snug">
              Detects violence, threats, blackmail & stalking
            </p>
          </div>
        </div>

        {/* Right Floating Cards (Desktop) */}
        <div className="hidden lg:flex flex-col gap-5 absolute right-0 top-6 w-52 pointer-events-none">
          <div className="rounded-3xl bmac-card p-4 rotate-3 text-left">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mb-2">
              <Globe className="w-4 h-4" />
            </div>
            <p className="text-xs font-extrabold bmac-text">
              VirusTotal Links
            </p>
            <p className="mt-0.5 text-[11px] bmac-muted leading-snug">
              Scans every link in subject & body
            </p>
          </div>

          <div className="rounded-3xl bmac-card p-4 -rotate-3 -translate-x-3 text-left">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 mb-2">
              <Sparkles className="w-4 h-4" />
            </div>
            <p className="text-xs font-extrabold bmac-text">
              Groq AI Summary
            </p>
            <p className="mt-0.5 text-[11px] bmac-muted leading-snug">
              Plain-English explanation of findings
            </p>
          </div>
        </div>

        {/* Center Hero Lockup */}
        <div className="max-w-xl mx-auto px-2">
          <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold bmac-text mb-5">
            <div className="flex items-center gap-0.5 text-emerald-600">
              <Star className="w-4 h-4 fill-emerald-600" />
              <Star className="w-4 h-4 fill-emerald-600" />
              <Star className="w-4 h-4 fill-emerald-600" />
              <Star className="w-4 h-4 fill-emerald-600" />
              <Star className="w-4 h-4 fill-emerald-600" />
            </div>
            <span className="ml-1">4-Layer Intelligent Email Protection</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bmac-text leading-[1.08]">
            Check any email for threats.
          </h1>

          <p className="mt-5 text-base sm:text-lg bmac-subtext leading-relaxed">
            Detect spam, phishing, personal safety threats, and risky links.
            Explained clearly by AI.
          </p>

          <div className="mt-8">
            <Link
              to="/analyzer"
              className="inline-flex items-center justify-center rounded-full bg-[#FFDD00] hover:bg-[#f3d100] px-9 py-4 text-base sm:text-lg font-extrabold text-[#111111] shadow-sm transition-transform active:scale-95"
            >
              Start checking an email
            </Link>
            <p className="mt-3 text-xs sm:text-sm bmac-muted">
              Instant local ML inference · Takes less than a few seconds!
            </p>
          </div>
        </div>
      </section>

      {/* Simple Session Stats */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-extrabold uppercase tracking-wider bmac-muted">
            Current Session Summary
          </h2>
          <span className="text-xs bmac-muted">
            Live session counters (resets on refresh)
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Emails Checked"
            value={stats.totalAnalyzed}
            subtitle="Analyzed in this session"
            icon={<MailSearch className="w-4 h-4" />}
          />
          <StatCard
            label="Spam / Phishing"
            value={stats.spamPhishingCount}
            subtitle="Flagged by spam model"
            icon={<ShieldAlert className="w-4 h-4" />}
          />
          <StatCard
            label="Safety Threats"
            value={stats.personalSafetyThreatsCount}
            subtitle="Violence, threats, stalking"
            icon={<Flame className="w-4 h-4" />}
          />
          <StatCard
            label="Risky Links"
            value={stats.maliciousOrSuspiciousUrlsCount}
            subtitle={
              stats.unverifiedUrlsCount > 0
                ? `${stats.unverifiedUrlsCount} unverified link(s)`
                : 'Malicious or suspicious URLs'
            }
            icon={<GlobeLock className="w-4 h-4" />}
          />
        </div>
      </section>

      {/* Chart (only shown when at least 1 email has been checked) */}
      <ThreatChart stats={stats} />

      {/* Recent Checks */}
      <RecentActivity history={history} />
    </div>
  );
};
