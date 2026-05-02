'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  ListChecks, 
  Camera, 
  MessageCircle, 
  GitBranch 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/', label: 'Inicio', icon: Home },
  { href: '/milestones', label: 'Hitos', icon: ListChecks },
  { href: '/upload', label: 'Subir', icon: Camera, isMain: true },
  { href: '/chat', label: 'Consultar', icon: MessageCircle },
  { href: '/timeline', label: 'Línea', icon: GitBranch },
];

export function BottomNav() {
  const pathname = usePathname();

  // Hide nav on onboarding and auth pages
  if (pathname?.startsWith('/onboarding') || pathname?.startsWith('/auth')) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border safe-bottom">
      <div className="flex items-center justify-around px-2 h-20">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.isMain) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center',
                  '-mt-6 active:scale-95 transition-transform'
                )}
              >
                <div className={cn(
                  'flex items-center justify-center w-14 h-14 rounded-full',
                  'bg-primary text-primary-foreground shadow-lg shadow-primary/30',
                  'transition-transform hover:scale-105 active:scale-95'
                )}>
                  <Icon className="w-7 h-7" />
                </div>
                <span className="text-xs mt-1.5 text-muted-foreground font-medium">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1.5 px-3 py-2 rounded-xl',
                'transition-all active:scale-95',
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div className={cn(
                'w-12 h-12 rounded-2xl flex items-center justify-center',
                isActive && 'bg-primary/10'
              )}>
                <Icon className={cn(
                  'w-6 h-6',
                  isActive && 'stroke-[2.5]'
                )} />
              </div>
              <span className={cn(
                'text-xs',
                isActive ? 'font-semibold' : 'font-medium'
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
