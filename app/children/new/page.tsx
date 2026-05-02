'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { ArrowLeft, Camera, Calendar, User, Ruler, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

type Gender = 'masculino' | 'femenino' | null;

export default function AddChildPage() {
  const router = useRouter();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<Gender>(null);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [notes, setNotes] = useState('');

  const isValid = name.trim() && birthDate;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsSubmitting(true);
    setError(null);

    // Validate birth date
    const birth = new Date(birthDate);
    if (birth > new Date()) {
      setError('La fecha de nacimiento no puede ser en el futuro');
      setIsSubmitting(false);
      return;
    }

    // Validate child is 0-6 years old
    const ageInYears = (Date.now() - birth.getTime()) / (1000 * 60 * 60 * 24 * 365);
    if (ageInYears > 6) {
      setError('Hitos está diseñada para niños de 0 a 5 años');
      setIsSubmitting(false);
      return;
    }

    if (!user) {
      router.push('/auth/login');
      return;
    }

    const supabase = createClient();

    // Insert child with clerk_id
    const { data: child, error: childError } = await supabase
      .from('children')
      .insert({
        clerk_id: user.id,
        name: name.trim(),
        birth_date: birthDate,
        gender: gender,
        notes: notes.trim() || null,
      })
      .select()
      .single();

    if (childError) {
      setError(childError.message);
      setIsSubmitting(false);
      return;
    }

    // If weight or height provided, insert growth record
    if ((weight || height) && child) {
      await supabase.from('growth_records').insert({
        child_id: child.id,
        date: birthDate,
        weight_kg: weight ? parseFloat(weight) : null,
        height_cm: height ? parseFloat(height) : null,
        notes: 'Registro inicial al nacimiento',
      });
    }

    router.push('/');
    router.refresh();
  };

  const genderOptions: { value: Gender; label: string; color: string }[] = [
    { value: 'femenino', label: 'Niña', color: 'bg-chart-5' },
    { value: 'masculino', label: 'Niño', color: 'bg-chart-1' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border safe-top">
        <div className="flex items-center gap-4 px-4 h-16">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold">Agregar Nino</h1>
        </div>
      </header>

      <main className="p-4 pb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar placeholder */}
          <div className="flex justify-center mb-8">
            <button
              type="button"
              className={cn(
                'w-24 h-24 rounded-full flex items-center justify-center',
                'bg-muted border-2 border-dashed border-border',
                'hover:bg-muted/80 transition-colors'
              )}
            >
              <Camera className="w-8 h-8 text-muted-foreground" />
            </button>
          </div>

          {/* Required fields */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Informacion basica
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="text-sm font-medium text-foreground mb-1.5 block">
                  Nombre completo *
                </label>
                <Input
                  id="name"
                  placeholder="Ej: Sofia Martinez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              {/* Birth date */}
              <div>
                <label htmlFor="birthDate" className="text-sm font-medium text-foreground mb-1.5 block">
                  Fecha de nacimiento *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="birthDate"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    required
                    max={new Date().toISOString().split('T')[0]}
                    className="h-12 pl-10"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Genero
                </label>
                <div className="flex gap-2">
                  {genderOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setGender(option.value)}
                      className={cn(
                        'flex-1 py-3 px-4 rounded-xl border-2 font-medium text-sm transition-all',
                        gender === option.value
                          ? `${option.color} border-transparent text-white`
                          : 'border-border bg-background hover:border-primary/50'
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Optional fields */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Ruler className="w-4 h-4 text-chart-2" />
                Datos opcionales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Weight */}
                <div>
                  <label htmlFor="weight" className="text-sm font-medium text-foreground mb-1.5 block">
                    Peso (kg)
                  </label>
                  <div className="relative">
                    <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      placeholder="8.5"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="h-12 pl-10"
                    />
                  </div>
                </div>

                {/* Height */}
                <div>
                  <label htmlFor="height" className="text-sm font-medium text-foreground mb-1.5 block">
                    Talla (cm)
                  </label>
                  <div className="relative">
                    <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="height"
                      type="number"
                      placeholder="68"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="h-12 pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="text-sm font-medium text-foreground mb-1.5 block">
                  Notas adicionales
                </label>
                <textarea
                  id="notes"
                  placeholder="Ej: Le encanta la musica, nacio prematuro..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className={cn(
                    'w-full rounded-xl border border-input bg-background px-4 py-3',
                    'text-sm placeholder:text-muted-foreground',
                    'focus:outline-none focus:ring-2 focus:ring-ring'
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Error message */}
          {error && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="pt-4">
            <Button
              type="submit"
              size="lg"
              className="w-full h-14 text-lg font-semibold rounded-2xl"
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner className="mr-2 h-5 w-5" />
                  Guardando...
                </>
              ) : (
                'Agregar Niño'
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-4">
              * Campos obligatorios. Podras editar esta informacion luego.
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}
