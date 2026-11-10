import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Globe,
} from 'lucide-react';
import type {
  AnalysisHistoryItem,
  SafetyThreatKey,
} from '../../types/analysis';
import { Card } from '../common/Card';
import { ThreatBadge } from '../threats/ThreatBadge';
import { SafetyThreatCard } from '../threats/SafetyThreatCard';
import { URLReportCard } from '../threats/URLReport';

interface AnalysisResultsProps {
  analysis: AnalysisHistoryItem;
}

const SAFETY_KEYS: SafetyThreatKey[] = [
  'physical_violence',
  'death_threat',
  'blackmail_extortion',
  'stalking',
];

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  analysis,
}) => {
  const { response, severity } = analysis;

  const isSpam =
    response.spam_prediction === 1 ||
    response.spam_category === 'Spam/Phishing';

  const detectedCount = response.detected_personal_safety_threats.length;

  const verdictIcon =
    severity === 'safe' ? (
      <ShieldCheck className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
    ) : severity === 'suspicious' ? (
      <AlertTriangle className="w-7 h-7 text-amber-600 dark:text-amber-400" />
    ) : (
      <ShieldAlert className="w-7 h-7 text-red-600 dark:text-red-400" />
    );

  return (
    <div className="max-w-3xl mx-auto space-y-6" aria-live="polite">
      {/* 1. Main Verdict + AI Explanation Card */}
      <Card padding="lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bmac-soft">
              {verdictIcon}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <ThreatBadge severity={severity} size="md" />
              </div>
              <h2 className="mt-1.5 text-xl sm:text-2xl font-extrabold tracking-tight bmac-text">
                {response.final_assessment}
              </h2>
            </div>
          </div>
        </div>

        {/* Simple 3-Column Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
          <div className="rounded-2xl bmac-soft p-4">
            <span className="text-xs font-bold bmac-muted">
              Spam / Phishing
            </span>
            <p
              className={`mt-1 text-base font-extrabold ${
                isSpam
                  ? 'text-amber-700 dark:text-amber-400'
                  : 'text-emerald-700 dark:text-emerald-400'
              }`}
            >
              {response.spam_category}
            </p>
            <p className="mt-0.5 text-xs bmac-muted">
              {typeof response.spam_confidence === 'number'
                ? `${response.spam_confidence.toFixed(1)}% model confidence`
                : 'Rule fallback (unknown sender/receiver)'}
            </p>
          </div>

          <div className="rounded-2xl bmac-soft p-4">
            <span className="text-xs font-bold bmac-muted">
              Safety Threats
            </span>
            <p
              className={`mt-1 text-base font-extrabold ${
                detectedCount > 0
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-emerald-700 dark:text-emerald-400'
              }`}
            >
              {detectedCount > 0
                ? `${detectedCount} Detected`
                : 'None Detected'}
            </p>
            <p className="mt-0.5 text-xs bmac-muted">
              {detectedCount > 0
                ? response.detected_personal_safety_threats.join(', ')
                : 'All 4 safety checks clear'}
            </p>
          </div>

          <div className="rounded-2xl bmac-soft p-4">
            <span className="text-xs font-bold bmac-muted">
              Links Found
            </span>
            <p className="mt-1 text-base font-extrabold bmac-text">
              {response.urls_found.length}{' '}
              {response.urls_found.length === 1 ? 'URL' : 'URLs'}
            </p>
            <p className="mt-0.5 text-xs bmac-muted">
              {response.urls_found.length === 0
                ? 'No links in email'
                : 'Checked with VirusTotal'}
            </p>
          </div>
        </div>

        {/* Groq AI Explanation */}
        <div className="rounded-2xl bg-[#FFDD00]/15 border border-[#FFDD00]/50 p-5">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider bmac-text mb-2">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-[#FFDD00]" />
            <span>AI Summary (Groq)</span>
          </div>
          <p className="text-sm bmac-text leading-relaxed whitespace-pre-line">
            {response.explanation || 'Explanation unavailable.'}
          </p>
        </div>
      </Card>

      {/* 2. Personal Safety Checks (4 items) */}
      <Card>
        <h3 className="text-base font-extrabold bmac-text mb-1">
          Personal Safety Breakdown
        </h3>
        <p className="text-xs bmac-muted mb-4">
          Each harm category is checked independently by the safety model.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SAFETY_KEYS.map((key) => (
            <SafetyThreatCard
              key={key}
              threatKey={key}
              detected={response.personal_safety_threats[key] === 1}
            />
          ))}
        </div>
      </Card>

      {/* 3. Extracted URLs & VirusTotal Reputation */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-extrabold bmac-text">
              Link Safety & VirusTotal Report
            </h3>
            <p className="text-xs bmac-muted">
              {response.urls_found.length === 0
                ? 'No links were found in the subject or message.'
                : `Found ${response.urls_found.length} link(s) in this email.`}
            </p>
          </div>
          <Globe className="w-5 h-5 bmac-muted" />
        </div>

        {response.url_reports.length > 0 && (
          <div className="space-y-3">
            {response.url_reports.map((report, index) => (
              <URLReportCard key={`${report.url}-${index}`} report={report} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
