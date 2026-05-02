'use client';

import Link from 'next/link';
import { 
  ArrowLeft, 
  User, 
  Bell, 
  Shield, 
  HelpCircle, 
  FileText, 
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { BottomNav } from '@/components/navigation/bottom-nav';
import { cn } from '@/lib/utils';

interface SettingItemProps {
  icon: React.ElementType;
  label: string;
  description?: string;
  href?: string;
  onClick?: () => void;
  trailing?: React.ReactNode;
  destructive?: boolean;
}

function SettingItem({ 
  icon: Icon, 
  label, 
  description, 
  href, 
  onClick, 
  trailing,
  destructive 
}: SettingItemProps) {
  const content = (
    <div className="flex items-center gap-4 px-4 py-3 hover:bg-muted/50 transition-colors">
      <div className={cn(
        'w-10 h-10 rounded-xl flex items-center justify-center',
        destructive ? 'bg-destructive/10' : 'bg-muted'
      )}>
        <Icon className={cn(
          'w-5 h-5',
          destructive ? 'text-destructive' : 'text-foreground'
        )} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn(
          'font-medium',
          destructive ? 'text-destructive' : 'text-foreground'
        )}>
          {label}
        </p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {trailing || <ChevronRight className="w-5 h-5 text-muted-foreground" />}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return (
    <button onClick={onClick} className="w-full text-left">
      {content}
    </button>
  );
}

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border safe-top">
        <div className="flex items-center gap-4 px-4 h-16">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="font-bold text-lg">Configuracion</h1>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Profile Section */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground text-xl font-bold">JP</span>
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-lg">Juan Perez</h2>
                <p className="text-muted-foreground text-sm">juan@ejemplo.com</p>
              </div>
              <Link href="/settings/profile">
                <Button variant="outline" size="sm">Editar</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-base text-muted-foreground">Preferencias</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <SettingItem
              icon={Bell}
              label="Notificaciones"
              description="Recordatorios y alertas"
              trailing={<Switch />}
            />
            <SettingItem
              icon={Moon}
              label="Tema oscuro"
              trailing={<Switch />}
            />
            <SettingItem
              icon={Globe}
              label="Idioma"
              description="Espanol"
              href="/settings/language"
            />
          </CardContent>
        </Card>

        {/* Children Management */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-base text-muted-foreground">Ninos</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <SettingItem
              icon={User}
              label="Gestionar ninos"
              description="Agregar, editar o eliminar perfiles"
              href="/children"
            />
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-base text-muted-foreground">Privacidad y Seguridad</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <SettingItem
              icon={Shield}
              label="Privacidad de datos"
              description="Como protegemos tu informacion"
              href="/settings/privacy"
            />
            <SettingItem
              icon={FileText}
              label="Terminos de uso"
              href="/settings/terms"
            />
          </CardContent>
        </Card>

        {/* Support */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-base text-muted-foreground">Ayuda</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <SettingItem
              icon={HelpCircle}
              label="Centro de ayuda"
              href="/help"
            />
            <SettingItem
              icon={FileText}
              label="Sobre Hitos"
              description="Version 1.0.0"
              href="/about"
            />
          </CardContent>
        </Card>

        {/* Logout */}
        <Card>
          <CardContent className="p-0">
            <SettingItem
              icon={LogOut}
              label="Cerrar sesion"
              destructive
              onClick={() => console.log('Logout')}
              trailing={null}
            />
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Hitos v1.0.0 - Acompanamos cada paso de su desarrollo
        </p>
      </main>

      <BottomNav />
    </div>
  );
}
