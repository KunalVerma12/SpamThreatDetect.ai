import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  Flame,
  HelpCircle,
} from 'lucide-react';
import type { SeverityLevel, URLReputationStatus } from '../../types/analysis';

interface ThreatBadgeProps {
  severity: SeverityLevel;
  label?: string;
  size?: 'sm' | 'md';
}

const severityStyles: Record<
  SeverityLevel,
  {
    bg: string;
    text: string;
    border: string;
    defaultLabel: string;
    icon: React.ReactNode;
  }
> = {
  safe: {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-500/30',
    defaultLabel: 'Safe · No Threat',
    icon: <ShieldCheck className="w-3.5 h-3.5 shrink-0" />,
  },
  suspicious: {
    bg: 'bg-amber-500/15',
    text: 'text-amber-800 dark:text-amber-300',
    border: 'border-amber-500/30',
    defaultLabel: 'Suspicious / Unverified',
    icon: <AlertTriangle className="w-3.5 h-3.5 shrink-0" />,
  },
  high: {
    bg: 'bg-orange-500/15',
    text: 'text-orange-800 dark:text-orange-300',
    border: 'border-orange-500/30',
    defaultLabel: 'High Risk',
    icon: <ShieldAlert className="w-3.5 h-3.5 shrink-0" />,
  },
  critical: {
    bg: 'bg-red-500/15',
    text: 'text-red-700 dark:text-red-300',
    border: 'border-red-500/30',
    defaultLabel: 'Critical Threat',
    icon: <Flame className="w-3.5 h-3.5 shrink-0" />,
  },
};

export const ThreatBadge: React.FC<ThreatBadgeProps> = ({
  severity,
  label,
  size = 'sm',
}) => {
  const config = severityStyles[severity];
  const sizeClass =
    size === 'sm' ? 'px-3 py-1 text-xs' : 'px-3.5 py-1.5 text-xs font-bold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${config.bg} ${config.text} ${config.border} ${sizeClass}`}
    >
      {config.icon}
      <span>{label || config.defaultLabel}</span>
    </span>
  );
};

interface URLStatusBadgeProps {
  status: URLReputationStatus;
}

export const URLStatusBadge: React.FC<URLStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'malicious':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/15 px-3 py-1 text-xs font-bold text-red-700 dark:text-red-300">
          <Flame className="w-3.5 h-3.5 shrink-0" />
          Malicious Link
        </span>
      );
    case 'suspicious':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-800 dark:text-amber-300">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          Suspicious Link
        </span>
      );
    case 'no_malicious_detections':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          0 Detections in Report
        </span>
      );
    case 'no_report':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-800 dark:text-amber-300">
          <HelpCircle className="w-3.5 h-3.5 shrink-0" />
          Unverified (No Report)
        </span>
      );
    case 'api_key_missing':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-800 dark:text-amber-300">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          Unverified (API Key Missing)
        </span>
      );
    case 'lookup_error':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-800 dark:text-amber-300">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          Unverified (Lookup Error)
        </span>
      );
  }
};
