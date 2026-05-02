'use client';

import { useState } from 'react';
import { Filter, Search, X } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MilestoneCard } from '@/components/milestones/milestone-card';
import { cn } from '@/lib/utils';
import { SAMPLE_MILESTONES, MILESTONE_CATEGORIES, AGE_RANGES } from '@/lib/constants';
import type { MilestoneCategory, MilestoneStatus, AgeRange } from '@/lib/types';

type FilterType = 'all' | 'achieved' | 'pending' | 'in-progress';

export default function MilestonesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MilestoneCategory | 'all'>('all');
  const [selectedAgeRange, setSelectedAgeRange] = useState<AgeRange | 'all'>('all');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Sample statuses
  const [milestoneStatuses, setMilestoneStatuses] = useState<Record<string, MilestoneStatus>>({
    'mg-1': 'achieved',
    'mg-2': 'in-progress',
    'sc-1': 'achieved',
    'lg-1': 'achieved',
    'mf-1': 'pending',
    'bl-1': 'pending',
  });

  // Filter milestones
  const filteredMilestones = SAMPLE_MILESTONES.filter(milestone => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!milestone.title.toLowerCase().includes(query) &&
          !milestone.description.toLowerCase().includes(query)) {
        return false;
      }
    }

    // Category filter
    if (selectedCategory !== 'all' && milestone.category !== selectedCategory) {
      return false;
    }

    // Age range filter
    if (selectedAgeRange !== 'all' && milestone.ageRange !== selectedAgeRange) {
      return false;
    }

    // Status filter
    const status = milestoneStatuses[milestone.id] || 'pending';
    if (filterType !== 'all' && status !== filterType) {
      return false;
    }

    return true;
  });

  const handleStatusChange = (id: string, status: MilestoneStatus) => {
    setMilestoneStatuses(prev => ({
      ...prev,
      [id]: status,
    }));
  };

  const statusFilters: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'pending', label: 'Pendientes' },
    { value: 'in-progress', label: 'En progreso' },
    { value: 'achieved', label: 'Logrados' },
  ];

  return (
    <AppShell headerTitle="Hitos del Desarrollo">
      <div className="flex flex-col h-full">
        {/* Search and Filter Bar */}
        <div className="sticky top-16 z-30 bg-background border-b border-border px-4 py-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar hitos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
            <Button
              variant={showFilters ? 'default' : 'outline'}
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className="flex-shrink-0"
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          {/* Status Filter Pills */}
          <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide -mx-4 px-4">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setFilterType(filter.value)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                  filterType === filter.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Extended Filters */}
          {showFilters && (
            <div className="mt-4 space-y-4 pt-4 border-t border-border">
              {/* Category Filter */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Categoria
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                      selectedCategory === 'all'
                        ? 'bg-foreground text-background'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    Todas
                  </button>
                  {Object.entries(MILESTONE_CATEGORIES).map(([key, cat]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key as MilestoneCategory)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                        selectedCategory === key
                          ? 'text-white'
                          : 'bg-muted text-muted-foreground'
                      )}
                      style={{
                        backgroundColor: selectedCategory === key
                          ? `var(--${cat.color})`
                          : undefined,
                      }}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age Range Filter */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Rango de edad
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedAgeRange('all')}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                      selectedAgeRange === 'all'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    Todos
                  </button>
                  {Object.entries(AGE_RANGES).map(([key, range]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedAgeRange(key as AgeRange)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                        selectedAgeRange === key
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Milestones List */}
        <div className="flex-1 p-4 space-y-3">
          {filteredMilestones.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">
                No se encontraron hitos
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Intenta ajustar los filtros o el termino de busqueda.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedAgeRange('all');
                  setFilterType('all');
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                {filteredMilestones.length} {filteredMilestones.length === 1 ? 'hito' : 'hitos'}
              </p>
              {filteredMilestones.map((milestone) => (
                <MilestoneCard
                  key={milestone.id}
                  id={milestone.id}
                  title={milestone.title}
                  description={milestone.description}
                  category={milestone.category}
                  status={milestoneStatuses[milestone.id] || 'pending'}
                  ageRange={AGE_RANGES[milestone.ageRange].label}
                  onStatusChange={handleStatusChange}
                  onPress={(id) => console.log('View details for', id)}
                  showCelebration
                />
              ))}
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}
