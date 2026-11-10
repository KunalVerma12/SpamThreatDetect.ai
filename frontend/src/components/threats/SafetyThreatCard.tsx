import React from 'react';
import {
  Swords,
  Skull,
  FileWarning,
  Eye,
  CheckCircle2,
  AlertOctagon,
} from 'lucide-react';
import type { SafetyThreatKey } from '../../types/analysis';

interface SafetyThreatCardProps {
  threatKey: SafetyThreatKey;
  detected: boolean;
}

const THREAT_META: Record<
  SafetyThreatKey,
  {
    title: string;
    description: string;
    icon: React.ReactNode;
  }
> = {
  physical_violence: {
    title: 'Physical Violence',
    description: 'Threats of bodily harm or physical assault.',
    icon: <Swords className="w-4 h-4" />,
  },
  death_threat: {
    title: 'Death Threat',
    description: 'Statements threatening someone’s life.',
    icon: <Skull className="w-4 h-4" />,
  },
  blackmail_extortion: {
    title: 'Blackmail / Extortion',
    description: 'Coercive demands or threats to expose private info.',
    icon: <FileWarning className="w-4 h-4" />,
  },
  stalking: {
    title: 'Stalking',
    description: 'Unwanted surveillance, tracking, or harassment.',
    icon: <Eye className="w-4 h-4" />,
  },
};

export const SafetyThreatCard: React.FC<SafetyThreatCardProps> = ({
  threatKey,
  detected,
}) => {
  const meta = THREAT_META[threatKey];

  return (
    <div
      className={`rounded-2xl border p-4 transition-colors ${
        detected
          ? 'border-red-500/40 bg-red-500/10'
          : 'bmac-soft'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl ${
              detected
                ? 'bg-red-500/20 text-red-600 dark:text-red-300'
                : 'bg-[var(--bg-surface)] bmac-subtext'
            }`}
          >
            {meta.icon}
          </div>
          <div>
            <h4 className="text-sm font-bold bmac-text">{meta.title}</h4>
            <p className="text-xs bmac-muted">{meta.description}</p>
          </div>
        </div>

        {detected ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/20 px-3 py-1 text-xs font-bold text-red-700 dark:text-red-300 shrink-0">
            <AlertOctagon className="w-3.5 h-3.5" />
            Detected
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Clear
          </span>
        )}
      </div>
    </div>
  );
};
