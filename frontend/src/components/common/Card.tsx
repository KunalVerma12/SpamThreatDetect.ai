import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingMap = {
  none: '',
  sm: 'p-5',
  md: 'p-6 sm:p-7',
  lg: 'p-7 sm:p-9',
};

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
}) => {
  return (
    <div
      className={`rounded-3xl bmac-card ${paddingMap[padding]} ${className}`}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  icon,
  action,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-wrap items-start justify-between gap-3 mb-5 ${className}`}
    >
      <div className="flex items-start gap-3">
        {icon && (
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#FFDD00]/20 text-[#111111] dark:text-[#FFDD00]">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-base sm:text-lg font-bold tracking-tight bmac-text">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-0.5 text-xs sm:text-sm bmac-muted leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
