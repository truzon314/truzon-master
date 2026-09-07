'use client';

import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'navy' | 'emerald' | 'rose' | 'slate' | 'purple';
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export function Badge({
  children,
  variant = 'navy',
  size = 'sm',
  className,
  dot = false,
}: BadgeProps) {
  const variants = {
    gold: 'bg-amber-50 text-amber-900 border-amber-200/80',
    navy: 'bg-blue-50 text-[#0f1c3a] border-blue-200/80',
    emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    rose: 'bg-rose-50 text-rose-800 border-rose-200/80',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    purple: 'bg-purple-50 text-purple-900 border-purple-200/80',
  };

  const dotColors = {
    gold: 'bg-amber-500',
    navy: 'bg-[#0f1c3a]',
    emerald: 'bg-emerald-500',
    rose: 'bg-rose-500',
    slate: 'bg-slate-400',
    purple: 'bg-purple-500',
  };

  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs font-medium',
    md: 'px-3 py-1 text-sm font-medium',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border tracking-wide transition-colors',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full', dotColors[variant])} />}
      {children}
    </span>
  );
}

export default Badge;
