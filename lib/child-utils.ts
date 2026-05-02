import type { Child, ChildAge, AgeRange, Parent } from './types';
import { AGE_RANGES } from './constants';

/**
 * Calculate child's age from birth date
 */
export function calculateAge(birthDate: Date): ChildAge {
  const now = new Date();
  const birth = new Date(birthDate);
  
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  let days = now.getDate() - birth.getDate();
  
  if (days < 0) {
    months--;
    const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += lastMonth.getDate();
  }
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  const totalMonths = years * 12 + months;
  
  // Format label (completo)
  let label: string;
  if (years === 0) {
    if (months === 0) {
      label = `${days} ${days === 1 ? 'día' : 'días'}`;
    } else {
      label = `${months} ${months === 1 ? 'mes' : 'meses'}`;
    }
  } else if (years < 2) {
    label = `${totalMonths} meses`;
  } else {
    label = months > 0 
      ? `${years} ${years === 1 ? 'año' : 'años'}, ${months} ${months === 1 ? 'mes' : 'meses'}`
      : `${years} años`;
  }
  
  // Short label para títulos de sección
  let shortLabel: string;
  if (years === 0) {
    shortLabel = `${months} ${months === 1 ? 'mes' : 'meses'}`;
  } else if (months === 0) {
    shortLabel = `${years} ${years === 1 ? 'año' : 'años'}`;
  } else {
    shortLabel = `${years} ${years === 1 ? 'año' : 'años'} y ${months} ${months === 1 ? 'mes' : 'meses'}`;
  }
  
  // Determine age range
  const ageRange = getAgeRange(totalMonths);
  
  return { years, months, days, totalMonths, label, shortLabel, ageRange };
}

/**
 * Get age range category from total months
 */
export function getAgeRange(totalMonths: number): AgeRange {
  for (const [range, { minMonths, maxMonths }] of Object.entries(AGE_RANGES)) {
    if (totalMonths >= minMonths && totalMonths < maxMonths) {
      return range as AgeRange;
    }
  }
  return '4-5y'; // Default to oldest range if over 5 years
}

/**
 * Generate initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Format date for display
 */
export function formatDate(date: Date, format: 'short' | 'long' = 'short'): string {
  const d = new Date(date);
  
  if (format === 'short') {
    return d.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
  
  return d.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Format relative time (e.g., "hace 2 días")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  
  if (seconds < 60) return 'ahora';
  if (minutes < 60) return `hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
  if (hours < 24) return `hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  if (days < 7) return `hace ${days} ${days === 1 ? 'día' : 'días'}`;
  if (weeks < 4) return `hace ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
  return `hace ${months} ${months === 1 ? 'mes' : 'meses'}`;
}

/**
 * Get greeting based on time of day
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

/**
 * Generate a random avatar color based on name
 */
export function getAvatarColor(name: string): string {
  const colors = [
    'bg-chart-1',
    'bg-chart-2',
    'bg-chart-3',
    'bg-chart-4',
    'bg-chart-5',
  ];
  
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

/**
 * Sample parent data for demo/development
 */
export const SAMPLE_PARENT: Parent = {
  id: 'parent-1',
  email: 'maria@ejemplo.com',
  name: 'María García',
  phone: '+54 11 1234-5678',
  role: 'parent',
  relationship: 'madre',
  childIds: ['1', '2', '3'],
  preferences: {
    notifications: true,
    reminderFrequency: 'weekly',
    language: 'es',
  },
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date(),
};

/**
 * Sample children data for demo/development
 */
export const SAMPLE_CHILDREN: Child[] = [
  {
    id: '1',
    name: 'Sofía Martínez',
    birthDate: new Date('2024-03-15'),
    gender: 'female',
    weight: 8.5,
    height: 68,
    notes: 'Le encanta la música',
    medicalInfo: {
      bloodType: 'A+',
      allergies: [],
      conditions: [],
      medications: [],
      vaccinations: [
        { id: 'v1', name: 'BCG', date: new Date('2024-03-16') },
        { id: 'v2', name: 'Hepatitis B', date: new Date('2024-03-16') },
      ],
      pediatrician: {
        name: 'Dra. Laura Fernández',
        phone: '+54 11 5555-1234',
        clinic: 'Centro Pediátrico San Martín',
      },
    },
    growthHistory: [
      { id: 'g1', childId: '1', date: new Date('2024-03-15'), weight: 3.2, height: 50 },
      { id: 'g2', childId: '1', date: new Date('2024-06-15'), weight: 5.8, height: 58 },
      { id: 'g3', childId: '1', date: new Date('2024-09-15'), weight: 7.2, height: 64 },
    ],
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Lucas García',
    birthDate: new Date('2024-04-10'), // 2 años y 1 mes
    gender: 'male',
    weight: 14,
    height: 92,
    medicalInfo: {
      allergies: [
        { id: 'a1', name: 'Leche de vaca', severity: 'moderada', notes: 'Usa fórmula especial' },
      ],
      conditions: [],
      medications: [],
      vaccinations: [],
    },
    growthHistory: [],
    createdAt: new Date('2022-08-15'),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Emma Rodríguez',
    birthDate: new Date('2023-11-22'),
    gender: 'female',
    medicalInfo: {
      allergies: [],
      conditions: [
        { id: 'c1', name: 'Reflujo gastroesofágico', status: 'controlada', diagnosedAt: new Date('2023-12-01') },
      ],
      medications: [
        { id: 'm1', name: 'Omeprazol', dose: '5mg', frequency: '1 vez al día', startDate: new Date('2023-12-01') },
      ],
      vaccinations: [],
    },
    growthHistory: [],
    createdAt: new Date('2023-11-25'),
    updatedAt: new Date(),
  },
];

/**
 * Get severity color
 */
export function getSeverityColor(severity: 'leve' | 'moderada' | 'severa'): string {
  switch (severity) {
    case 'leve': return 'text-success';
    case 'moderada': return 'text-warning';
    case 'severa': return 'text-destructive';
  }
}

/**
 * Get condition status color
 */
export function getConditionStatusColor(status: 'activa' | 'controlada' | 'resuelta'): string {
  switch (status) {
    case 'activa': return 'text-warning';
    case 'controlada': return 'text-info';
    case 'resuelta': return 'text-success';
  }
}
