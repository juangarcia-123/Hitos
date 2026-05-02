'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  Bell,
  Globe,
  Shield,
  ChevronRight,
  Baby,
  Settings,
  LogOut,
  Edit2,
  Camera,
  Heart,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { SAMPLE_PARENT, SAMPLE_CHILDREN, getInitials, getAvatarColor, calculateAge } from '@/lib/child-utils';

function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-bottom z-50">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        <Link href="/" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className="text-[10px] font-medium">Inicio</span>
        </Link>
        <Link href="/milestones" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <span className="text-[10px] font-medium">Hitos</span>
        </Link>
        <Link href="/upload" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
          <div className="w-12 h-12 -mt-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
            <Camera className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-medium">Subir</span>
        </Link>
        <Link href="/chat" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <span className="text-[10px] font-medium">Consultar</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center gap-1 text-primary">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium">Perfil</span>
        </Link>
      </div>
    </nav>
  );
}

export default function ProfilePage() {
  const parent = SAMPLE_PARENT;
  const children = SAMPLE_CHILDREN;
  
  const [notifications, setNotifications] = useState(parent.preferences.notifications);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <span className="font-semibold">Mi Perfil</span>
            </Link>
            <Button variant="ghost" size="icon">
              <Edit2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="px-4 py-5 space-y-6">
        {/* Profile Card */}
        <Card className="border-0 shadow-sm overflow-hidden">
          <div className="h-20 bg-gradient-to-r from-primary/20 via-chart-3/20 to-accent/20" />
          <CardContent className="pt-0 -mt-10 flex flex-col items-center">
            <div className="relative">
              <Avatar className="h-20 w-20 border-4 border-card">
                <AvatarImage src={parent.avatar} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                  {getInitials(parent.name)}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <h1 className="mt-3 text-lg font-bold text-foreground">{parent.name}</h1>
            <p className="text-sm text-muted-foreground capitalize">{parent.relationship || parent.role}</p>
            
            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Baby className="w-4 h-4" />
                <span>{children.length} niños</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>Desde {new Date(parent.createdAt).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Información de contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                <Mail className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{parent.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                <Phone className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Teléfono</p>
                <p className="text-sm font-medium">{parent.phone || 'No configurado'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Children */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Mis hijos</CardTitle>
              <Link href="/children/new">
                <Button variant="ghost" size="sm" className="text-primary text-xs h-7">
                  Agregar
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {children.map((child) => {
              const age = calculateAge(child.birthDate);
              return (
                <Link 
                  key={child.id} 
                  href={`/children/${child.id}`}
                  className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={child.avatar} />
                    <AvatarFallback className={cn("text-white text-sm", getAvatarColor(child.name))}>
                      {getInitials(child.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{child.name}</p>
                    <p className="text-xs text-muted-foreground">{age.shortLabel}</p>
                  </div>
                  {child.medicalInfo.allergies.length > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-warning/10 text-warning">
                      {child.medicalInfo.allergies.length} alergia(s)
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </Link>
              );
            })}
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Preferencias</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                  <Bell className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <Label htmlFor="notifications" className="text-sm font-medium">Notificaciones</Label>
                  <p className="text-xs text-muted-foreground">Recordatorios de hitos</p>
                </div>
              </div>
              <Switch 
                id="notifications" 
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
            
            <Separator />
            
            <button className="flex items-center gap-3 w-full py-1">
              <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                <Globe className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">Idioma</p>
                <p className="text-xs text-muted-foreground">Español</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            
            <button className="flex items-center gap-3 w-full py-1">
              <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">Frecuencia de recordatorios</p>
                <p className="text-xs text-muted-foreground capitalize">{parent.preferences.reminderFrequency === 'weekly' ? 'Semanal' : parent.preferences.reminderFrequency === 'daily' ? 'Diario' : 'Mensual'}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </CardContent>
        </Card>

        {/* Account */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Cuenta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <Link href="/settings" className="flex items-center gap-3 py-2">
              <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                <Settings className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="flex-1 text-sm font-medium">Configuración</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
            
            <button className="flex items-center gap-3 py-2 w-full">
              <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                <Shield className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="flex-1 text-sm font-medium text-left">Privacidad y seguridad</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            
            <button className="flex items-center gap-3 py-2 w-full text-destructive">
              <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="flex-1 text-sm font-medium text-left">Cerrar sesión</span>
            </button>
          </CardContent>
        </Card>

        {/* Version */}
        <p className="text-center text-xs text-muted-foreground">
          Hitos v1.0.0
        </p>
      </main>

      <BottomNav />
    </div>
  );
}
