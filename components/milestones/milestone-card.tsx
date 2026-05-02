'use client';

import { useState } from 'react';
import { Check, Clock, AlertCircle, ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { MilestoneCategory, MilestoneStatus } from '@/lib/types';
import { MILESTONE_CATEGORIES } from '@/lib/constants';

interface MilestoneCardProps {
  id: string;
  title: string;
  description: string;
  category: MilestoneCategory;
  status: MilestoneStatus;
  ageRange?: string;
  onStatusChange?: (id: string, status: MilestoneStatus) => void;
  onPress?: (id: string) => void;
  showCelebration?: boolean;
}

export function MilestoneCard({
  id,
  title,
  description,
  category,
  status,
  ageRange,
  onStatusChange,
  onPress,
  showCelebration = false,
}: MilestoneCardProps) {
  const [celebrating, setCelebrating] = useState(false);
  const categoryInfo = MILESTONE_CATEGORIES[category];

  const statusConfig = {
    achieved: {
      icon: Check,
      label: 'Logrado',
      className: 'status-achieved',
      iconClass: 'text-success',
    },
    'in-progress': {
      icon: Clock,
      label: 'En progreso',
      className: 'status-in-progress',
      iconClass: 'text-accent-foreground',
    },
    pending: {
      icon: null,
      label: 'Pendiente',
      className: 'status-pending',
      iconClass: 'text-muted-foreground',
    },
    attention: {
      icon: AlertCircle,
      label: 'Seguimiento',
      className: 'status-attention',
      iconClass: 'text-warning',
    },
  };

  const currentStatus = statusConfig[status];
  const StatusIcon = currentStatus.icon;

  const handleAchieve = () => {
    if (status !== 'achieved' && showCelebration) {
      setCelebrating(true);
      setTimeout(() => setCelebrating(false), 1000);
    }
    onStatusChange?.(id, status === 'achieved' ? 'pending' : 'achieved');
  };

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-300',
        'hover:shadow-md active:scale-[0.99]',
        celebrating && 'animate-celebrate ring-2 ring-celebration'
      )}
    >
      {/* Category color accent */}
      <div
        className={cn(
          'absolute left-0 top-0 bottom-0 w-1',
          `bg-${categoryInfo.color}`
        )}
        style={{
          backgroundColor: `var(--${categoryInfo.color})`,
        }}
      />

      <CardContent className="p-4 pl-5">
        <div className="flex items-start gap-3">
          {/* Status indicator / Check button */}
          <button
            onClick={handleAchieve}
            className={cn(
              'flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center',
              'transition-all duration-200',
              status === 'achieved'
                ? 'bg-success border-success text-white'
                : 'border-border hover:border-primary hover:bg-primary/5'
            )}
          >
            {status === 'achieved' && <Check className="w-4 h-4" />}
            {celebrating && (
              <Sparkles className="w-4 h-4 absolute animate-ping text-celebration" />
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className={cn(
                  'font-semibold text-foreground',
                  status === 'achieved' && 'line-through text-muted-foreground'
                )}>
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                  {description}
                </p>
              </div>

              {onPress && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onPress(id)}
                  className="flex-shrink-0"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              )}
            </div>

            {/* Meta info */}
            <div className="flex items-center gap-2 mt-3">
              <span
                className={cn(
                  'text-xs px-2 py-1 rounded-full border',
                  `milestone-${category}`
                )}
                style={{
                  borderColor: `color-mix(in oklch, var(--${categoryInfo.color}) 30%, transparent)`,
                  backgroundColor: `color-mix(in oklch, var(--${categoryInfo.color}) 10%, transparent)`,
                  color: `var(--${categoryInfo.color})`,
                }}
              >
                {categoryInfo.label}
              </span>

              {ageRange && (
                <span className="text-xs text-muted-foreground">
                  {ageRange}
                </span>
              )}

              {StatusIcon && status !== 'achieved' && (
                <span className={cn(
                  'flex items-center gap-1 text-xs ml-auto',
                  currentStatus.iconClass
                )}>
                  <StatusIcon className="w-3 h-3" />
                  {currentStatus.label}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
