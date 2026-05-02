'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bell, Settings, ChevronDown, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

interface Child {
  id: string;
  name: string;
  avatar?: string;
}

interface AppHeaderProps {
  children?: Child[];
  selectedChild?: Child | null;
  onChildSelect?: (child: Child) => void;
  showChildSelector?: boolean;
  title?: string;
}

export function AppHeader({
  children = [],
  selectedChild,
  onChildSelect,
  showChildSelector = true,
  title,
}: AppHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChildren = children.filter(child =>
    child.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-40 glass border-b border-border safe-top">
      <div className="flex items-center justify-between px-4 h-16">
        {/* Left: Logo or Title */}
        <div className="flex items-center gap-3">
          {title ? (
            <h1 className="text-lg font-bold text-foreground">{title}</h1>
          ) : (
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">H</span>
              </div>
              <span className="font-bold text-lg text-foreground">Hitos</span>
            </Link>
          )}
        </div>

        {/* Center: Child Selector (for caregivers with many children) */}
        {showChildSelector && children.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center gap-2 px-3 py-2 h-auto"
              >
                {selectedChild ? (
                  <>
                    <ChildAvatar child={selectedChild} size="sm" />
                    <span className="font-medium text-sm max-w-[100px] truncate">
                      {selectedChild.name.split(' ')[0]}
                    </span>
                  </>
                ) : (
                  <span className="text-muted-foreground text-sm">
                    Seleccionar niño
                  </span>
                )}
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-64">
              {/* Search for many children */}
              {children.length > 5 && (
                <div className="p-2 border-b border-border">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar niño..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 h-9"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                      >
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                </div>
              )}
              <div className="max-h-[300px] overflow-y-auto">
                {filteredChildren.map((child) => (
                  <DropdownMenuItem
                    key={child.id}
                    onClick={() => onChildSelect?.(child)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2',
                      selectedChild?.id === child.id && 'bg-primary/10'
                    )}
                  >
                    <ChildAvatar child={child} size="sm" />
                    <span className="font-medium">{child.name}</span>
                    {selectedChild?.id === child.id && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
                {filteredChildren.length === 0 && (
                  <div className="px-3 py-4 text-center text-muted-foreground text-sm">
                    No se encontraron niños
                  </div>
                )}
              </div>
              <div className="border-t border-border p-2">
                <Link href="/children/new">
                  <Button variant="ghost" className="w-full justify-start text-primary">
                    + Agregar niño
                  </Button>
                </Link>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            {/* Notification dot */}
            <span className="absolute top-2 right-2 w-2 h-2 bg-warning rounded-full" />
          </Button>
          <Link href="/settings">
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

// Helper component for child avatar
function ChildAvatar({ 
  child, 
  size = 'md' 
}: { 
  child: Child; 
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
  };

  const initials = child.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Generate consistent color from name
  const colors = [
    'bg-chart-1',
    'bg-chart-2',
    'bg-chart-3',
    'bg-chart-4',
    'bg-chart-5',
  ];
  const colorIndex = child.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  const bgColor = colors[colorIndex];

  if (child.avatar) {
    return (
      <img
        src={child.avatar}
        alt={child.name}
        className={cn(
          'rounded-full object-cover',
          sizeClasses[size]
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-bold text-white',
        sizeClasses[size],
        bgColor
      )}
    >
      {initials}
    </div>
  );
}

export { ChildAvatar };
