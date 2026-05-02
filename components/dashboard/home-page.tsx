'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  ChevronRight, 
  Plus, 
  Trophy,
  Sparkles,
  Camera,
  MessageCircle,
  Search,
  Bell,
  Settings,
  User,
  ChevronDown,
  Check,
  Baby,
  Heart,
  LogOut
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Spinner } from '@/components/ui/spinner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { calculateAge, getInitials, getAvatarColor, getGreeting } from '@/lib/child-utils';
import { getMilestonesByAge, BADGES, MILESTONE_CATEGORIES } from '@/lib/constants';
import { createClient } from '@/lib/supabase/client';
import type { MilestoneStatus } from '@/lib/types';

// Types for database records
interface DbChild {
  id: string;
  name: string;
  birth_date: string;
  gender: string | null;
  avatar_url: string | null;
}

interface DbProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  relationship: string | null;
}

function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border safe-bottom z-50">
      <div className="flex items-center justify-around h-20 max-w-lg mx-auto px-2">
        <Link href="/" className="flex flex-col items-center gap-1.5 text-primary py-2 px-3 active:scale-95 transition-transform">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className="text-xs font-semibold">Inicio</span>
        </Link>
        <Link href="/milestones" className="flex flex-col items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors py-2 px-3 active:scale-95">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <span className="text-xs font-medium">Hitos</span>
        </Link>
        <Link href="/upload" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors active:scale-95">
          <div className="w-14 h-14 -mt-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30">
            <Camera className="w-7 h-7" />
          </div>
          <span className="text-xs font-medium">Subir</span>
        </Link>
        <Link href="/chat" className="flex flex-col items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors py-2 px-3 active:scale-95">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center">
            <MessageCircle className="w-6 h-6" />
          </div>
          <span className="text-xs font-medium">Consultar</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors py-2 px-3 active:scale-95">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
          <span className="text-xs font-medium">Perfil</span>
        </Link>
      </div>
    </nav>
  );
}

function ChildSelector({ 
  children, 
  selectedChild, 
  onSelect 
}: { 
  children: DbChild[]; 
  selectedChild: DbChild | null; 
  onSelect: (child: DbChild) => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredChildren = children.filter(child =>
    child.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!selectedChild) {
    return (
      <Link href="/children/new">
        <Button variant="outline" className="w-full h-auto p-4 justify-start gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <Plus className="w-6 h-6 text-primary" />
          </div>
          <div className="text-left">
            <p className="font-bold text-foreground">Agregar tu primer hijo</p>
            <p className="text-sm text-muted-foreground">Comienza a registrar su desarrollo</p>
          </div>
        </Button>
      </Link>
    );
  }

  const age = calculateAge(selectedChild.birth_date);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-3 -ml-3 hover:bg-muted/50 rounded-2xl">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 border-2 border-primary/20 shadow-sm">
              <AvatarImage src={selectedChild.avatar_url || undefined} />
              <AvatarFallback className={cn("text-white font-semibold text-lg", getAvatarColor(selectedChild.name))}>
                {getInitials(selectedChild.name)}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="font-bold text-foreground text-lg">{selectedChild.name}</p>
              <p className="text-sm text-muted-foreground">{age.shortLabel}</p>
            </div>
            <ChevronDown className="w-5 h-5 text-muted-foreground ml-1" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        <DropdownMenuLabel className="font-normal">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar niño..." 
              className="pl-9 h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-60 overflow-y-auto">
          {filteredChildren.map((child) => {
            const childAge = calculateAge(child.birth_date);
            const isSelected = child.id === selectedChild.id;
            return (
              <DropdownMenuItem 
                key={child.id} 
                onClick={() => onSelect(child)}
                className={cn("py-3", isSelected && "bg-primary/10")}
              >
                <div className="flex items-center gap-3 w-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={child.avatar_url || undefined} />
                    <AvatarFallback className={cn("text-white text-sm", getAvatarColor(child.name))}>
                      {getInitials(child.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{child.name}</p>
                    <p className="text-xs text-muted-foreground">{childAge.shortLabel}</p>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-primary" />}
                </div>
              </DropdownMenuItem>
            );
          })}
          {filteredChildren.length === 0 && (
            <div className="px-3 py-4 text-center text-muted-foreground text-sm">
              No se encontraron niños
            </div>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/children/new" className="flex items-center gap-2 text-primary">
            <Plus className="w-4 h-4" />
            Agregar niño
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MilestoneItem({ 
  milestone, 
  status, 
  onToggle 
}: { 
  milestone: { id: string; title: string; description: string; category: string }; 
  status: MilestoneStatus;
  onToggle: () => void;
}) {
  const categoryInfo = MILESTONE_CATEGORIES[milestone.category as keyof typeof MILESTONE_CATEGORIES];
  
  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors active:bg-muted/70">
      <button
        onClick={onToggle}
        className={cn(
          "w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all active:scale-90",
          status === 'achieved' 
            ? "bg-success border-success text-success-foreground" 
            : "border-muted-foreground/30 hover:border-primary"
        )}
      >
        {status === 'achieved' && <Check className="w-4 h-4" />}
      </button>
      <div className="flex-1 min-w-0">
        <p className={cn(
          "font-semibold text-base leading-tight",
          status === 'achieved' && "line-through text-muted-foreground"
        )}>
          {milestone.title}
        </p>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {milestone.description}
        </p>
      </div>
      <div 
        className="w-3 h-3 rounded-full flex-shrink-0 mt-1.5"
        style={{ backgroundColor: `var(--${categoryInfo?.color || 'chart-1'})` }}
      />
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<DbProfile | null>(null);
  const [children, setChildren] = useState<DbChild[]>([]);
  const [selectedChild, setSelectedChild] = useState<DbChild | null>(null);
  const [milestoneStatuses, setMilestoneStatuses] = useState<Record<string, MilestoneStatus>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }

      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setProfile(profileData);

      // Load children
      const { data: childrenData } = await supabase
        .from('children')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setChildren(childrenData || []);
      
      if (childrenData && childrenData.length > 0) {
        setSelectedChild(childrenData[0]);
        
        // Load milestone records for first child
        const { data: milestones } = await supabase
          .from('milestone_records')
          .select('milestone_id, status')
          .eq('child_id', childrenData[0].id);
        
        if (milestones) {
          const statusMap: Record<string, MilestoneStatus> = {};
          milestones.forEach(m => {
            statusMap[m.milestone_id] = m.status as MilestoneStatus;
          });
          setMilestoneStatuses(statusMap);
        }
      }

      setIsLoading(false);
    }

    loadData();
  }, [router]);

  const handleSelectChild = async (child: DbChild) => {
    setSelectedChild(child);
    
    // Load milestones for selected child
    const supabase = createClient();
    const { data: milestones } = await supabase
      .from('milestone_records')
      .select('milestone_id, status')
      .eq('child_id', child.id);
    
    if (milestones) {
      const statusMap: Record<string, MilestoneStatus> = {};
      milestones.forEach(m => {
        statusMap[m.milestone_id] = m.status as MilestoneStatus;
      });
      setMilestoneStatuses(statusMap);
    } else {
      setMilestoneStatuses({});
    }
  };

  const handleToggleMilestone = async (milestoneId: string, category: string) => {
    if (!selectedChild) return;
    
    const currentStatus = milestoneStatuses[milestoneId] || 'pending';
    const newStatus = currentStatus === 'achieved' ? 'pending' : 'achieved';
    
    // Optimistic update
    setMilestoneStatuses(prev => ({
      ...prev,
      [milestoneId]: newStatus,
    }));

    // Persist to database
    const supabase = createClient();
    const { error } = await supabase
      .from('milestone_records')
      .upsert({
        child_id: selectedChild.id,
        milestone_id: milestoneId,
        category: category,
        status: newStatus,
        achieved_date: newStatus === 'achieved' ? new Date().toISOString().split('T')[0] : null,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'child_id,milestone_id'
      });

    if (error) {
      // Revert on error
      setMilestoneStatuses(prev => ({
        ...prev,
        [milestoneId]: currentStatus,
      }));
    }
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="w-8 h-8 text-primary" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  const childAge = selectedChild ? calculateAge(selectedChild.birth_date) : null;
  const milestonesByAge = childAge ? getMilestonesByAge(childAge.totalMonths) : { current: [], upcoming: [], previous: [] };
  
  const achievedCount = Object.values(milestoneStatuses).filter(s => s === 'achieved').length;
  const totalMilestones = milestonesByAge.current.length || 4;
  const progressPercent = totalMilestones > 0 ? Math.round((achievedCount / totalMilestones) * 100) : 0;

  const parentName = profile?.full_name?.split(' ')[0] || 'Usuario';
  const childCount = children.length;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50 safe-top">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <Image 
              src="/images/logo.png" 
              alt="Hitos" 
              width={140} 
              height={56} 
              className="h-12 w-auto"
              priority
            />
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="relative h-11 w-11">
                <Bell className="w-6 h-6" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-11 w-11">
                    <Settings className="w-6 h-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Configuración</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-4 space-y-5 pb-28">
        {/* Greeting & Parent Profile */}
        <section className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {getGreeting()}, {parentName}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {profile?.relationship === 'madre' ? 'Mamá' : profile?.relationship === 'padre' ? 'Papá' : 'Cuidador'} de {childCount} {childCount === 1 ? 'niño' : 'niños'}
            </p>
          </div>
          <Link href="/profile">
            <Avatar className="h-14 w-14 border-2 border-primary/20 shadow-sm">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-lg">
                {getInitials(profile?.full_name || 'U')}
              </AvatarFallback>
            </Avatar>
          </Link>
        </section>

        {/* Child Selector */}
        <section>
          <ChildSelector 
            children={children} 
            selectedChild={selectedChild} 
            onSelect={handleSelectChild} 
          />
        </section>

        {selectedChild && childAge && (
          <>
            {/* Progress Overview */}
            <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-br from-primary/5 via-card to-accent/5">
              <CardContent className="p-5">
                <div className="flex items-center gap-5">
                  {/* Circular Progress */}
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="currentColor"
                        className="text-muted"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="currentColor"
                        className="text-primary"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${progressPercent * 2.64} 264`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-foreground">{achievedCount}</span>
                      <span className="text-xs text-muted-foreground">hitos</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                        <Check className="w-3.5 h-3.5" />
                        En buen camino
                      </span>
                    </div>
                    <h3 className="font-bold text-foreground text-lg truncate">{selectedChild.name}</h3>
                    <p className="text-sm text-muted-foreground">{childAge.shortLabel}</p>
                  </div>

                  <Link href={`/children/${selectedChild.id}`}>
                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </Link>
                </div>

                {/* Category Progress */}
                <div className="mt-4 pt-4 border-t border-border/50">
                  <div className="flex gap-1 h-1.5 rounded-full overflow-hidden bg-muted">
                    {Object.entries(MILESTONE_CATEGORIES).map(([key, cat], index) => (
                      <div
                        key={key}
                        className="h-full first:rounded-l-full last:rounded-r-full"
                        style={{
                          width: `${20}%`,
                          backgroundColor: `var(--${cat.color})`,
                          opacity: index < achievedCount ? 1 : 0.3,
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
                    <span>Motor</span>
                    <span>Fino</span>
                    <span>Lenguaje</span>
                    <span>Social</span>
                    <span>Biológico</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <section className="grid grid-cols-3 gap-3">
              <Link href="/upload" className="active:scale-95 transition-transform">
                <Card className="hover:shadow-lg transition-all border-0 shadow-sm h-full">
                  <CardContent className="p-4 flex flex-col items-center text-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-chart-4/15 flex items-center justify-center">
                      <Camera className="w-7 h-7 text-chart-4" />
                    </div>
                    <span className="text-sm font-medium leading-tight">Subir foto</span>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/chat" className="active:scale-95 transition-transform">
                <Card className="hover:shadow-lg transition-all border-0 shadow-sm h-full">
                  <CardContent className="p-4 flex flex-col items-center text-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-chart-3/15 flex items-center justify-center">
                      <MessageCircle className="w-7 h-7 text-chart-3" />
                    </div>
                    <span className="text-sm font-medium leading-tight">Consultar IA</span>
                  </CardContent>
                </Card>
              </Link>
              <Link href={`/children/${selectedChild.id}`} className="active:scale-95 transition-transform">
                <Card className="hover:shadow-lg transition-all border-0 shadow-sm h-full">
                  <CardContent className="p-4 flex flex-col items-center text-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-chart-5/15 flex items-center justify-center">
                      <Heart className="w-7 h-7 text-chart-5" />
                    </div>
                    <span className="text-sm font-medium leading-tight">Perfil médico</span>
                  </CardContent>
                </Card>
              </Link>
            </section>

            {/* AI Recommended Milestones */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-bold text-foreground">Hitos para {childAge.shortLabel}</h2>
                    <p className="text-xs text-muted-foreground">Recomendados por IA</p>
                  </div>
                </div>
                <Link href="/milestones">
                  <Button variant="ghost" size="sm" className="text-primary text-sm h-10 px-4">
                    Ver todos
                  </Button>
                </Link>
              </div>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 space-y-3">
                  {milestonesByAge.current.slice(0, 4).map((milestone) => (
                    <MilestoneItem
                      key={milestone.id}
                      milestone={milestone}
                      status={milestoneStatuses[milestone.id] || 'pending'}
                      onToggle={() => handleToggleMilestone(milestone.id, milestone.category)}
                    />
                  ))}
                  {milestonesByAge.current.length === 0 && (
                    <div className="py-6 text-center text-muted-foreground">
                      <Baby className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No hay hitos pendientes para esta edad</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* Badges Preview */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <h2 className="font-bold text-foreground">Logros</h2>
                    <p className="text-xs text-muted-foreground">{achievedCount > 0 ? `${achievedCount} conseguido${achievedCount > 1 ? 's' : ''}` : 'Comienza a registrar hitos'}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {BADGES.slice(0, 4).map((badge, index) => (
                  <div 
                    key={badge.id}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-xl transition-all",
                      index < achievedCount ? "bg-accent/20" : "bg-muted/30 opacity-50"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center",
                      index < achievedCount ? "bg-accent" : "bg-muted"
                    )}>
                      <Trophy className={cn("w-6 h-6", index < achievedCount ? "text-accent-foreground" : "text-muted-foreground")} />
                    </div>
                    <span className="text-[10px] font-medium text-center leading-tight">{badge.title}</span>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Empty state - no children */}
        {children.length === 0 && (
          <Card className="border-2 border-dashed border-primary/20">
            <CardContent className="p-8 text-center">
              <Baby className="w-16 h-16 mx-auto mb-4 text-primary/50" />
              <h3 className="text-lg font-bold mb-2">Comienza agregando a tu hijo</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Registra a tu primer niño para comenzar a hacer seguimiento de su desarrollo
              </p>
              <Link href="/children/new">
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Agregar niño
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
