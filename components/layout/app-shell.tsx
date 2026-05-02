'use client';

import { useState, useEffect } from 'react';
import { AppHeader } from '@/components/navigation/app-header';
import { BottomNav } from '@/components/navigation/bottom-nav';
import { cn } from '@/lib/utils';
import { SAMPLE_CHILDREN } from '@/lib/child-utils';

interface Child {
  id: string;
  name: string;
  avatar?: string;
}

interface AppShellProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showNav?: boolean;
  showChildSelector?: boolean;
  headerTitle?: string;
  className?: string;
}

export function AppShell({
  children,
  showHeader = true,
  showNav = true,
  showChildSelector = true,
  headerTitle,
  className,
}: AppShellProps) {
  // In production, this would come from a context/store
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  
  // Convert sample children to simpler format for header
  const headerChildren: Child[] = SAMPLE_CHILDREN.map(c => ({
    id: c.id,
    name: c.name,
    avatar: undefined,
  }));

  // Auto-select first child if none selected
  useEffect(() => {
    if (!selectedChild && headerChildren.length > 0) {
      setSelectedChild(headerChildren[0]);
    }
  }, [selectedChild, headerChildren]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {showHeader && (
        <AppHeader
          children={headerChildren}
          selectedChild={selectedChild}
          onChildSelect={setSelectedChild}
          showChildSelector={showChildSelector}
          title={headerTitle}
        />
      )}
      
      <main className={cn(
        'flex-1',
        showNav && 'pb-24', // Space for bottom nav
        className
      )}>
        {children}
      </main>
      
      {showNav && <BottomNav />}
    </div>
  );
}
