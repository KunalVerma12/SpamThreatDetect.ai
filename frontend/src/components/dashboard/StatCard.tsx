import React from 'react';

export type StatTone = 'neutral' | 'emerald' | 'amber' | 'red' | 'blue';

interface StatCardProps {
  label: string;
  value: number | string;
  subtitle: string;
  icon: React.ReactNode;
  tone?: StatTone;
  badgeText?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtitle,
  icon,
}) => {
  return (
    <div className="rounded-3xl bmac-card p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-bold uppercase tracking-wider bmac-muted">
          {label}
        </span>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#FFDD00]/25 text-[#111111] dark:text-[#FFDD00]">
          {icon}
        </div>
      </div>

      <div className="mt-3">
        <div className="text-3xl font-extrabold tracking-tight bmac-text">
          {value}
        </div>
        <p className="mt-1 text-xs bmac-muted truncate">{subtitle}</p>
      </div>
    </div>
  );
};
