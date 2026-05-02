'use client';

import { Check, Clock, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DevelopmentStatus } from '@/lib/types';
import { STATUS_MESSAGES } from '@/lib/constants';

interface StatusBadgeProps {
  status: DevelopmentStatus;
  showDescription?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StatusBadge({
  status,
  showDescription = false,
  size = 'md',
  className,
}: StatusBadgeProps) {
  const config = STATUS_MESSAGES[status];

  const iconMap = {
    'on-track': Check,
    'early': Info,
    'follow-up': AlertTriangle,
  };

  const colorMap = {
    'on-track': 'bg-success/10 text-success border-success/30',
    'early': 'bg-info/10 text-info border-info/30',
    'follow-up': 'bg-warning/10 text-warning-foreground border-warning/30',
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
  };

  const Icon = iconMap[status];

  if (showDescription) {
    return (
      <div className={cn(
        'rounded-xl border p-4',
        colorMap[status],
        className
      )}>
        <div className="flex items-center gap-2 mb-1">
          <Icon className="w-4 h-4" />
          <span className="font-semibold">{config.title}</span>
        </div>
        <p className="text-sm opacity-90">{config.description}</p>
      </div>
    );
  }

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full border font-medium',
      colorMap[status],
      sizeClasses[size],
      className
    )}>
      <Icon className={cn(
        size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'
      )} />
      {config.title}
    </span>
  );
}
