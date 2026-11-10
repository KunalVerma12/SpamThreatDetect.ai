import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[#FFDD00] hover:bg-[#f3d100] active:scale-[0.99] text-[#111111] font-bold shadow-xs',
  secondary:
    'bmac-soft hover:opacity-85 bmac-text font-semibold',
  outline:
    'bg-transparent border border-[var(--border-subtle)] hover:bg-[var(--bg-soft)] bmac-text font-semibold',
  ghost:
    'bg-transparent hover:bg-[var(--bg-soft)] bmac-subtext hover:bmac-text font-semibold',
  danger:
    'bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/25 font-semibold',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-xs gap-1.5 rounded-full',
  md: 'h-11 px-6 text-sm gap-2 rounded-full',
  lg: 'h-13 px-8 text-base gap-2.5 rounded-full',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
