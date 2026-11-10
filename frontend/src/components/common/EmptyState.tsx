import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  compact?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  compact = false,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center rounded-3xl bmac-soft ${
        compact ? 'px-6 py-10' : 'px-6 py-14'
      }`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFDD00]/25 text-[#111111] dark:text-[#FFDD00] mb-4">
        {icon}
      </div>
      <h4 className="text-base font-bold bmac-text">{title}</h4>
      <p className="mt-1.5 max-w-md text-sm bmac-muted leading-relaxed">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};
