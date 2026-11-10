import React from 'react';
import { Globe } from 'lucide-react';
import type { URLReputationReport } from '../../types/analysis';
import { URLStatusBadge } from './ThreatBadge';

interface URLReportProps {
  report: URLReputationReport;
}

export const URLReportCard: React.FC<URLReportProps> = ({ report }) => {
  const hasCounts =
    typeof report.malicious === 'number' ||
    typeof report.suspicious === 'number' ||
    typeof report.harmless === 'number' ||
    typeof report.undetected === 'number';

  const getStatusNote = () => {
    switch (report.status) {
      case 'malicious':
        return 'Flagged as malicious by VirusTotal security vendors.';
      case 'suspicious':
        return 'Flagged as suspicious by VirusTotal security vendors.';
      case 'no_malicious_detections':
        return 'No malicious detections in the available report (does not guarantee a link is safe).';
      case 'no_report':
        return 'No VirusTotal report found yet — treat this unverified link with caution.';
      case 'api_key_missing':
        return 'VirusTotal API key not configured in virustotal.env — link could not be verified.';
      case 'lookup_error':
      default:
        return 'Could not reach VirusTotal to verify this link — do not assume it is safe.';
    }
  };

  return (
    <div className="rounded-2xl bmac-soft p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-surface)] bmac-text">
            <Globe className="w-4 h-4" />
          </div>
          <p className="font-mono text-xs sm:text-sm font-semibold bmac-text break-all">
            {report.url}
          </p>
        </div>
        <URLStatusBadge status={report.status} />
      </div>

      <p className="text-xs bmac-subtext">{getStatusNote()}</p>

      {hasCounts && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          <div className="rounded-xl bg-[var(--bg-surface)] px-3 py-2 text-center">
            <span className="block text-[11px] bmac-muted">Malicious</span>
            <span className="font-mono text-sm font-bold text-red-600 dark:text-red-400">
              {report.malicious ?? 0}
            </span>
          </div>
          <div className="rounded-xl bg-[var(--bg-surface)] px-3 py-2 text-center">
            <span className="block text-[11px] bmac-muted">Suspicious</span>
            <span className="font-mono text-sm font-bold text-amber-600 dark:text-amber-400">
              {report.suspicious ?? 0}
            </span>
          </div>
          <div className="rounded-xl bg-[var(--bg-surface)] px-3 py-2 text-center">
            <span className="block text-[11px] bmac-muted">Harmless</span>
            <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {report.harmless ?? 0}
            </span>
          </div>
          <div className="rounded-xl bg-[var(--bg-surface)] px-3 py-2 text-center">
            <span className="block text-[11px] bmac-muted">Undetected</span>
            <span className="font-mono text-sm font-bold bmac-text">
              {report.undetected ?? 0}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
