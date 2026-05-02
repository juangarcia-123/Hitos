'use client';

import Link from 'next/link';
import { ArrowLeft, Check, Camera, MessageCircle, Calendar } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SAMPLE_CHILDREN, calculateAge, formatDate } from '@/lib/child-utils';
import { MILESTONE_CATEGORIES } from '@/lib/constants';
import type { MilestoneCategory } from '@/lib/types';

interface TimelineEvent {
  id: string;
  type: 'milestone' | 'photo' | 'note';
  title: string;
  description?: string;
  category?: MilestoneCategory;
  date: Date;
  mediaUrl?: string;
}

// Sample timeline data
const SAMPLE_TIMELINE: TimelineEvent[] = [
  {
    id: '1',
    type: 'milestone',
    title: 'Sonrisa social',
    description: 'Primera sonrisa en respuesta a voces conocidas',
    category: 'social-cognitivo',
    date: new Date('2024-04-10'),
  },
  {
    id: '2',
    type: 'photo',
    title: 'Primer mes',
    description: 'Celebrando el primer mes de vida',
    date: new Date('2024-04-15'),
  },
  {
    id: '3',
    type: 'milestone',
    title: 'Sostiene la cabeza',
    description: 'Puede mantener la cabeza erguida cuando esta en brazos',
    category: 'motor-grueso',
    date: new Date('2024-05-20'),
  },
  {
    id: '4',
    type: 'note',
    title: 'Visita al pediatra',
    description: 'Control de los 2 meses. Todo bien!',
    date: new Date('2024-05-15'),
  },
  {
    id: '5',
    type: 'milestone',
    title: 'Balbucea',
    description: 'Produce sonidos como "ba-ba", "ma-ma"',
    category: 'lenguaje',
    date: new Date('2024-09-10'),
  },
];

export default function TimelinePage() {
  const selectedChild = SAMPLE_CHILDREN[0];
  const childAge = calculateAge(selectedChild.birthDate);

  // Group events by month
  const groupedEvents = SAMPLE_TIMELINE.reduce((groups, event) => {
    const monthYear = new Date(event.date).toLocaleDateString('es-ES', {
      month: 'long',
      year: 'numeric',
    });
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    groups[monthYear].push(event);
    return groups;
  }, {} as Record<string, TimelineEvent[]>);

  const getEventIcon = (event: TimelineEvent) => {
    switch (event.type) {
      case 'milestone':
        return Check;
      case 'photo':
        return Camera;
      case 'note':
        return MessageCircle;
      default:
        return Calendar;
    }
  };

  const getEventColor = (event: TimelineEvent) => {
    if (event.type === 'milestone' && event.category) {
      return MILESTONE_CATEGORIES[event.category].color;
    }
    if (event.type === 'photo') return 'chart-4';
    return 'muted-foreground';
  };

  return (
    <AppShell headerTitle="Linea de Tiempo" showChildSelector={false}>
      <div className="px-4 py-6">
        {/* Child Info */}
        <div className="mb-6 text-center">
          <div
            className={cn(
              'w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2',
              'text-xl font-bold text-white',
              selectedChild.gender === 'female' ? 'bg-chart-4' : 'bg-primary'
            )}
          >
            {selectedChild.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <h2 className="font-bold text-lg">{selectedChild.name}</h2>
          <p className="text-muted-foreground text-sm">{childAge.label}</p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

          {Object.entries(groupedEvents).map(([monthYear, events]) => (
            <div key={monthYear} className="mb-8">
              {/* Month header */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-8 rounded-full bg-background border-2 border-border flex items-center justify-center z-10">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground capitalize">
                  {monthYear}
                </h3>
              </div>

              {/* Events */}
              <div className="space-y-4 ml-4 pl-8 border-l-2 border-transparent">
                {events.map((event) => {
                  const Icon = getEventIcon(event);
                  const color = getEventColor(event);
                  
                  return (
                    <div key={event.id} className="relative">
                      {/* Event dot */}
                      <div
                        className="absolute -left-[41px] w-4 h-4 rounded-full border-2 border-background z-10"
                        style={{ backgroundColor: `var(--${color})` }}
                      />

                      {/* Event card */}
                      <div className="bg-card rounded-xl border border-border p-4">
                        <div className="flex items-start gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `color-mix(in oklch, var(--${color}) 20%, transparent)` }}
                          >
                            <Icon
                              className="w-5 h-5"
                              style={{ color: `var(--${color})` }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-semibold text-foreground">
                                {event.title}
                              </h4>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {formatDate(event.date, 'short')}
                              </span>
                            </div>
                            {event.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {event.description}
                              </p>
                            )}
                            {event.category && (
                              <span
                                className="inline-block text-xs px-2 py-0.5 rounded-full mt-2"
                                style={{
                                  backgroundColor: `color-mix(in oklch, var(--${color}) 15%, transparent)`,
                                  color: `var(--${color})`,
                                }}
                              >
                                {MILESTONE_CATEGORIES[event.category].label}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Birth event */}
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center z-10">
              <span className="text-primary-foreground text-lg">*</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Nacimiento</h3>
              <p className="text-sm text-muted-foreground">
                {formatDate(selectedChild.birthDate, 'long')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
