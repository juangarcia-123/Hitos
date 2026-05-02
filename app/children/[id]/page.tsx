'use client';

import { useState } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Edit2,
  Camera,
  Calendar,
  Ruler,
  Scale,
  AlertTriangle,
  Pill,
  Syringe,
  User,
  Phone,
  Building,
  Plus,
  ChevronRight,
  Droplet,
  Activity,
  TrendingUp,
  Sparkles,
  Check
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { SAMPLE_CHILDREN, calculateAge, getInitials, getAvatarColor, formatDate, getSeverityColor, getConditionStatusColor } from '@/lib/child-utils';
import { getMilestonesByAge, MILESTONE_CATEGORIES } from '@/lib/constants';

export default function ChildProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const child = SAMPLE_CHILDREN.find(c => c.id === id) || SAMPLE_CHILDREN[0];
  const age = calculateAge(child.birthDate);
  const milestonesByAge = getMilestonesByAge(age.totalMonths);

  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <span className="font-semibold">Perfil</span>
            </Link>
            <Button variant="ghost" size="icon">
              <Edit2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="px-4 py-5 space-y-5">
        {/* Profile Header */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-20 w-20 border-3 border-primary/20">
              <AvatarImage src={child.avatar} />
              <AvatarFallback className={cn("text-white text-xl font-bold", getAvatarColor(child.name))}>
                {getInitials(child.name)}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">{child.name}</h1>
            <p className="text-sm text-muted-foreground">{age.shortLabel}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                <Calendar className="w-3 h-3 mr-1" />
                {formatDate(child.birthDate)}
              </Badge>
              {child.gender && (
                <Badge variant="outline" className="text-xs capitalize">
                  {child.gender === 'female' ? 'Niña' : child.gender === 'male' ? 'Niño' : 'Otro'}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 text-center">
              <Scale className="w-5 h-5 mx-auto text-chart-1 mb-1" />
              <p className="text-lg font-bold text-foreground">{child.weight || '--'}</p>
              <p className="text-[10px] text-muted-foreground">kg</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 text-center">
              <Ruler className="w-5 h-5 mx-auto text-chart-2 mb-1" />
              <p className="text-lg font-bold text-foreground">{child.height || '--'}</p>
              <p className="text-[10px] text-muted-foreground">cm</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 text-center">
              <Droplet className="w-5 h-5 mx-auto text-chart-4 mb-1" />
              <p className="text-lg font-bold text-foreground">{child.medicalInfo.bloodType || '--'}</p>
              <p className="text-[10px] text-muted-foreground">Tipo</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-10">
            <TabsTrigger value="overview" className="text-xs">General</TabsTrigger>
            <TabsTrigger value="medical" className="text-xs">Médico</TabsTrigger>
            <TabsTrigger value="milestones" className="text-xs">Hitos</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-4 space-y-4">
            {/* Pediatrician */}
            {child.medicalInfo.pediatrician && (
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    Pediatra
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="font-medium text-sm">{child.medicalInfo.pediatrician.name}</p>
                    {child.medicalInfo.pediatrician.clinic && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Building className="w-3 h-3" />
                        {child.medicalInfo.pediatrician.clinic}
                      </p>
                    )}
                  </div>
                  {child.medicalInfo.pediatrician.phone && (
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      <Phone className="w-3.5 h-3.5 mr-2" />
                      {child.medicalInfo.pediatrician.phone}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Emergency Contact */}
            {child.medicalInfo.emergencyContact && (
              <Card className="border-0 shadow-sm border-l-4 border-l-destructive">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2 text-destructive">
                    <Phone className="w-4 h-4" />
                    Contacto de emergencia
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium text-sm">{child.medicalInfo.emergencyContact.name}</p>
                  <p className="text-xs text-muted-foreground">{child.medicalInfo.emergencyContact.relationship}</p>
                  <p className="text-sm mt-1">{child.medicalInfo.emergencyContact.phone}</p>
                </CardContent>
              </Card>
            )}

            {/* Notes */}
            {child.notes && (
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">Notas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{child.notes}</p>
                </CardContent>
              </Card>
            )}

            {/* Growth History */}
            {child.growthHistory.length > 0 && (
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-chart-5" />
                      Historial de crecimiento
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="text-xs h-7 text-primary">
                      Ver todo
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {child.growthHistory.slice(-3).reverse().map((measurement) => (
                      <div key={measurement.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(measurement.date)}
                        </span>
                        <div className="flex items-center gap-4 text-sm">
                          {measurement.weight && <span>{measurement.weight} kg</span>}
                          {measurement.height && <span>{measurement.height} cm</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3 text-xs">
                    <Plus className="w-3.5 h-3.5 mr-2" />
                    Agregar medición
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Medical Tab */}
          <TabsContent value="medical" className="mt-4 space-y-4">
            {/* Allergies */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                    Alergias
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-xs h-7 text-primary">
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Agregar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {child.medicalInfo.allergies.length > 0 ? (
                  <div className="space-y-2">
                    {child.medicalInfo.allergies.map((allergy) => (
                      <div key={allergy.id} className="flex items-start justify-between p-2 rounded-lg bg-warning/5 border border-warning/20">
                        <div>
                          <p className="font-medium text-sm">{allergy.name}</p>
                          {allergy.notes && (
                            <p className="text-xs text-muted-foreground mt-0.5">{allergy.notes}</p>
                          )}
                        </div>
                        <Badge variant="outline" className={cn("text-[10px]", getSeverityColor(allergy.severity))}>
                          {allergy.severity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay alergias registradas
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Conditions */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Activity className="w-4 h-4 text-info" />
                    Condiciones médicas
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-xs h-7 text-primary">
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Agregar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {child.medicalInfo.conditions.length > 0 ? (
                  <div className="space-y-2">
                    {child.medicalInfo.conditions.map((condition) => (
                      <div key={condition.id} className="flex items-start justify-between p-2 rounded-lg bg-muted/50">
                        <div>
                          <p className="font-medium text-sm">{condition.name}</p>
                          {condition.diagnosedAt && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Diagnosticado: {formatDate(condition.diagnosedAt)}
                            </p>
                          )}
                          {condition.notes && (
                            <p className="text-xs text-muted-foreground">{condition.notes}</p>
                          )}
                        </div>
                        <Badge variant="outline" className={cn("text-[10px]", getConditionStatusColor(condition.status))}>
                          {condition.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay condiciones registradas
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Medications */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Pill className="w-4 h-4 text-chart-3" />
                    Medicamentos
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-xs h-7 text-primary">
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Agregar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {child.medicalInfo.medications.length > 0 ? (
                  <div className="space-y-2">
                    {child.medicalInfo.medications.map((med) => (
                      <div key={med.id} className="p-2 rounded-lg bg-muted/50">
                        <div className="flex items-start justify-between">
                          <p className="font-medium text-sm">{med.name}</p>
                          <Badge variant="outline" className="text-[10px]">
                            {med.dose}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {med.frequency} - Desde {formatDate(med.startDate)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay medicamentos registrados
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Vaccinations */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Syringe className="w-4 h-4 text-chart-1" />
                    Vacunas
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-xs h-7 text-primary">
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Agregar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {child.medicalInfo.vaccinations.length > 0 ? (
                  <div className="space-y-2">
                    {child.medicalInfo.vaccinations.map((vax) => (
                      <div key={vax.id} className="flex items-center justify-between p-2 rounded-lg bg-success/5 border border-success/20">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                            <Check className="w-3 h-3 text-success" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{vax.name}</p>
                            {vax.dose && <p className="text-xs text-muted-foreground">{vax.dose}</p>}
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(vax.date)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay vacunas registradas
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Milestones Tab */}
          <TabsContent value="milestones" className="mt-4 space-y-4">
            <Card className="border-0 shadow-sm bg-gradient-to-br from-primary/5 to-chart-3/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Hitos para {age.shortLabel}</h3>
                    <p className="text-xs text-muted-foreground">
                      {milestonesByAge.current.length} hitos activos para esta edad
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* By Category */}
            {Object.entries(MILESTONE_CATEGORIES).map(([key, category]) => {
              const categoryMilestones = milestonesByAge.current.filter(m => m.category === key);
              if (categoryMilestones.length === 0) return null;
              
              return (
                <Card key={key} className="border-0 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: `var(--${category.color})` }}
                      />
                      {category.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {categoryMilestones.map((milestone) => (
                      <div key={milestone.id} className="flex items-start gap-2 p-2 rounded-lg bg-muted/30">
                        <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">{milestone.title}</p>
                          <p className="text-xs text-muted-foreground">{milestone.description}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}

            <Link href="/milestones">
              <Button variant="outline" className="w-full">
                Ver todos los hitos
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
