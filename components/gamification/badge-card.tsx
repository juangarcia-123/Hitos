'use client';

import { Star, Footprints, MessageCircle, Trophy, Flame, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BadgeType } from '@/lib/types';

interface BadgeCardProps {
  title: string;
  description: string;
  icon: string;
  type: BadgeType;
  earned?: boolean;
  earnedAt?: Date;
  progress?: number; // 0-100 for locked badges
  onClick?: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  star: Star,
  footprints: Footprints,
  'message-circle': MessageCircle,
  trophy: Trophy,
  flame: Flame,
};

export function BadgeCard({
  title,
  description,
  icon,
  type,
  earned = false,
  earnedAt,
  progress,
  onClick,
}: BadgeCardProps) {
  const IconComponent = iconMap[icon] || Star;

  const badgeStyles = {
    bronze: {
      bg: 'bg-badge-bronze/20',
      border: 'border-badge-bronze/40',
      icon: 'text-badge-bronze',
      glow: 'shadow-badge-bronze/20',
    },
    silver: {
      bg: 'bg-badge-silver/20',
      border: 'border-badge-silver/40',
      icon: 'text-badge-silver',
      glow: 'shadow-badge-silver/20',
    },
    gold: {
      bg: 'bg-badge-gold/20',
      border: 'border-badge-gold/40',
      icon: 'text-badge-gold',
      glow: 'shadow-badge-gold/20',
    },
  };

  const style = badgeStyles[type];

  return (
    <button
      onClick={onClick}
      disabled={!earned && !onClick}
      className={cn(
        'relative flex flex-col items-center p-4 rounded-2xl border-2 transition-all',
        'min-w-[120px]',
        earned
          ? [style.bg, style.border, 'hover:scale-105 active:scale-95']
          : 'bg-muted/50 border-border opacity-60 grayscale'
      )}
    >
      {/* Badge icon */}
      <div
        className={cn(
          'w-14 h-14 rounded-full flex items-center justify-center mb-2',
          earned ? [style.bg, 'shadow-lg', style.glow] : 'bg-muted'
        )}
      >
        {earned ? (
          <IconComponent className={cn('w-7 h-7', style.icon)} />
        ) : (
          <Lock className="w-6 h-6 text-muted-foreground" />
        )}
      </div>

      {/* Title */}
      <h4 className={cn(
        'font-semibold text-sm text-center',
        earned ? 'text-foreground' : 'text-muted-foreground'
      )}>
        {title}
      </h4>

      {/* Description or progress */}
      {earned && earnedAt ? (
        <p className="text-xs text-muted-foreground mt-1">
          {new Date(earnedAt).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
          })}
        </p>
      ) : progress !== undefined ? (
        <div className="w-full mt-2">
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center mt-1">
            {progress}%
          </p>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 text-center">
          {description}
        </p>
      )}

      {/* Earned shine effect */}
      {earned && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
        </div>
      )}
    </button>
  );
}

// Horizontal scrollable badge list
export function BadgeList({
  badges,
  onBadgeClick,
}: {
  badges: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    type: BadgeType;
    earned: boolean;
    earnedAt?: Date;
    progress?: number;
  }>;
  onBadgeClick?: (id: string) => void;
}) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
      {badges.map((badge) => (
        <BadgeCard
          key={badge.id}
          {...badge}
          onClick={() => onBadgeClick?.(badge.id)}
        />
      ))}
    </div>
  );
}
