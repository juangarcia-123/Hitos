'use client';

import { cn } from '@/lib/utils';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'accent';
  showLabel?: boolean;
}

export function ProgressRing({
  progress,
  size = 80,
  strokeWidth = 6,
  className,
  children,
  color = 'primary',
  showLabel = false,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  const colorClasses = {
    primary: 'stroke-primary',
    success: 'stroke-success',
    warning: 'stroke-warning',
    accent: 'stroke-accent',
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-muted"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={cn(colorClasses[color], 'transition-all duration-500 ease-out')}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (showLabel && (
          <span className="text-lg font-bold text-foreground">
            {Math.round(progress)}%
          </span>
        ))}
      </div>
    </div>
  );
}

// Multi-category progress visualization
interface CategoryProgressProps {
  categories: Array<{
    name: string;
    progress: number;
    color: string;
  }>;
  size?: number;
}

export function CategoryProgress({ categories, size = 120 }: CategoryProgressProps) {
  const strokeWidth = 8;
  const gap = 4;
  const totalWidth = categories.length * (strokeWidth + gap);
  
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {categories.map((cat, index) => {
          const radius = (size - totalWidth) / 2 - index * (strokeWidth + gap);
          const circumference = radius * 2 * Math.PI;
          const offset = circumference - (cat.progress / 100) * circumference;
          
          return (
            <g key={cat.name}>
              {/* Background */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                strokeWidth={strokeWidth}
                className="stroke-muted"
              />
              {/* Progress */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                className="transition-all duration-500 ease-out"
                style={{
                  stroke: `var(--${cat.color})`,
                  strokeDasharray: circumference,
                  strokeDashoffset: offset,
                }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
