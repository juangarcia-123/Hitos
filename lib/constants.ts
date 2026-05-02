import type { MilestoneCategory, AgeRange, Badge, Milestone } from './types';

// Milestone Categories with metadata
export const MILESTONE_CATEGORIES: Record<MilestoneCategory, {
  label: string;
  description: string;
  icon: string;
  color: string;
}> = {
  'motor-grueso': {
    label: 'Motor Grueso',
    description: 'Movimientos grandes del cuerpo: caminar, correr, saltar',
    icon: 'baby',
    color: 'chart-1',
  },
  'motor-fino': {
    label: 'Motor Fino',
    description: 'Movimientos precisos: agarrar, dibujar, manipular objetos',
    icon: 'hand',
    color: 'chart-2',
  },
  'lenguaje': {
    label: 'Lenguaje',
    description: 'Comunicación verbal y no verbal',
    icon: 'message-circle',
    color: 'chart-3',
  },
  'social-cognitivo': {
    label: 'Social y Cognitivo',
    description: 'Interacción social, juego, resolución de problemas',
    icon: 'brain',
    color: 'chart-4',
  },
  'biologico': {
    label: 'Biológico',
    description: 'Alimentación, sueño, dientes, control de esfínteres',
    icon: 'heart-pulse',
    color: 'chart-5',
  },
};

// Age ranges with labels
export const AGE_RANGES: Record<AgeRange, {
  label: string;
  shortLabel: string;
  minMonths: number;
  maxMonths: number;
}> = {
  '0-3m': { label: '0 a 3 meses', shortLabel: '0-3 meses', minMonths: 0, maxMonths: 3 },
  '3-6m': { label: '3 a 6 meses', shortLabel: '3-6 meses', minMonths: 3, maxMonths: 6 },
  '6-9m': { label: '6 a 9 meses', shortLabel: '6-9 meses', minMonths: 6, maxMonths: 9 },
  '9-12m': { label: '9 a 12 meses', shortLabel: '9-12 meses', minMonths: 9, maxMonths: 12 },
  '12-18m': { label: '12 a 18 meses', shortLabel: '12-18 meses', minMonths: 12, maxMonths: 18 },
  '18-24m': { label: '18 a 24 meses', shortLabel: '18-24 meses', minMonths: 18, maxMonths: 24 },
  '2-3y': { label: '2 a 3 años', shortLabel: '2-3 años', minMonths: 24, maxMonths: 36 },
  '3-4y': { label: '3 a 4 años', shortLabel: '3-4 años', minMonths: 36, maxMonths: 48 },
  '4-5y': { label: '4 a 5 años', shortLabel: '4-5 años', minMonths: 48, maxMonths: 60 },
};

// Sample milestones for demo - organized by age in months
export const SAMPLE_MILESTONES: Milestone[] = [
  // 0-3 meses
  {
    id: 'mg-0-1',
    title: 'Sostiene la cabeza',
    description: 'El bebé puede mantener la cabeza erguida cuando está en brazos',
    category: 'motor-grueso',
    ageRange: '0-3m',
    ageMonthsMin: 0,
    ageMonthsMax: 3,
    tips: ['Practica el tiempo boca abajo', 'Usa juguetes coloridos para motivar que levante la cabeza'],
  },
  {
    id: 'sc-0-1',
    title: 'Sonrisa social',
    description: 'Sonríe en respuesta a voces o caras conocidas',
    category: 'social-cognitivo',
    ageRange: '0-3m',
    ageMonthsMin: 1,
    ageMonthsMax: 3,
  },
  {
    id: 'lg-0-1',
    title: 'Hace sonidos vocales',
    description: 'Emite sonidos como "ahhh", "ohhh" cuando está contento',
    category: 'lenguaje',
    ageRange: '0-3m',
    ageMonthsMin: 2,
    ageMonthsMax: 4,
  },
  // 6-9 meses
  {
    id: 'mg-6-1',
    title: 'Se sienta sin apoyo',
    description: 'El bebé puede sentarse solo sin necesidad de soporte',
    category: 'motor-grueso',
    ageRange: '6-9m',
    ageMonthsMin: 6,
    ageMonthsMax: 9,
    activities: ['Juegos sentado con pelotas', 'Apilar bloques'],
  },
  {
    id: 'lg-6-1',
    title: 'Balbucea',
    description: 'Produce sonidos como "ba-ba", "ma-ma" sin significado específico',
    category: 'lenguaje',
    ageRange: '6-9m',
    ageMonthsMin: 6,
    ageMonthsMax: 9,
  },
  {
    id: 'bl-6-1',
    title: 'Primer diente',
    description: 'Aparece el primer diente de leche',
    category: 'biologico',
    ageRange: '6-9m',
    ageMonthsMin: 6,
    ageMonthsMax: 12,
  },
  // 9-12 meses
  {
    id: 'mg-9-1',
    title: 'Primeros pasos',
    description: 'El niño da sus primeros pasos de forma independiente',
    category: 'motor-grueso',
    ageRange: '9-12m',
    ageMonthsMin: 9,
    ageMonthsMax: 15,
    tips: ['Crea un espacio seguro para explorar', 'Ofrece apoyo sin forzar'],
  },
  {
    id: 'mf-9-1',
    title: 'Agarre de pinza',
    description: 'Usa el pulgar y el índice para agarrar objetos pequeños',
    category: 'motor-fino',
    ageRange: '9-12m',
    ageMonthsMin: 9,
    ageMonthsMax: 12,
    activities: ['Recoger cereales', 'Jugar con plastilina'],
  },
  {
    id: 'lg-9-1',
    title: 'Primeras palabras',
    description: 'Dice palabras con significado como "mamá", "papá", "agua"',
    category: 'lenguaje',
    ageRange: '9-12m',
    ageMonthsMin: 10,
    ageMonthsMax: 14,
  },
  {
    id: 'sc-9-1',
    title: 'Señala para pedir',
    description: 'Usa el dedo para señalar objetos que desea',
    category: 'social-cognitivo',
    ageRange: '9-12m',
    ageMonthsMin: 9,
    ageMonthsMax: 14,
  },
  // 12-18 meses
  {
    id: 'mf-12-1',
    title: 'Garabatea',
    description: 'Hace trazos simples con crayones o lápices',
    category: 'motor-fino',
    ageRange: '12-18m',
    ageMonthsMin: 12,
    ageMonthsMax: 18,
  },
  {
    id: 'mg-12-1',
    title: 'Camina solo con seguridad',
    description: 'Camina de forma estable sin ayuda',
    category: 'motor-grueso',
    ageRange: '12-18m',
    ageMonthsMin: 12,
    ageMonthsMax: 18,
  },
  // 18-24 meses
  {
    id: 'lg-18-1',
    title: 'Frases de dos palabras',
    description: 'Combina dos palabras para expresar ideas: "quiero agua"',
    category: 'lenguaje',
    ageRange: '18-24m',
    ageMonthsMin: 18,
    ageMonthsMax: 24,
  },
  {
    id: 'mg-18-1',
    title: 'Corre',
    description: 'Puede correr aunque con pasos inestables',
    category: 'motor-grueso',
    ageRange: '18-24m',
    ageMonthsMin: 18,
    ageMonthsMax: 24,
  },
  // 2-3 años
  {
    id: 'lg-24-1',
    title: 'Oraciones simples',
    description: 'Forma oraciones de 3-4 palabras',
    category: 'lenguaje',
    ageRange: '2-3y',
    ageMonthsMin: 24,
    ageMonthsMax: 36,
  },
  {
    id: 'bl-24-1',
    title: 'Control de esfínteres diurno',
    description: 'Avisa cuando necesita ir al baño durante el día',
    category: 'biologico',
    ageRange: '2-3y',
    ageMonthsMin: 24,
    ageMonthsMax: 36,
  },
  {
    id: 'sc-24-1',
    title: 'Juego simbólico',
    description: 'Juega a "hacer como si" (cocinar, cuidar muñecos)',
    category: 'social-cognitivo',
    ageRange: '2-3y',
    ageMonthsMin: 24,
    ageMonthsMax: 36,
  },
  {
    id: 'mg-24-1',
    title: 'Salta con ambos pies',
    description: 'Puede saltar con los dos pies juntos',
    category: 'motor-grueso',
    ageRange: '2-3y',
    ageMonthsMin: 24,
    ageMonthsMax: 36,
  },
];

// Get milestones by exact age in months
export function getMilestonesByAge(ageInMonths: number): {
  current: Milestone[];
  upcoming: Milestone[];
  recent: Milestone[];
} {
  const current = SAMPLE_MILESTONES.filter(
    m => ageInMonths >= m.ageMonthsMin && ageInMonths <= m.ageMonthsMax
  );
  
  const upcoming = SAMPLE_MILESTONES.filter(
    m => m.ageMonthsMin > ageInMonths && m.ageMonthsMin <= ageInMonths + 3
  );
  
  const recent = SAMPLE_MILESTONES.filter(
    m => m.ageMonthsMax < ageInMonths && m.ageMonthsMax >= ageInMonths - 3
  );
  
  return { current, upcoming, recent };
}

// Sample badges for gamification
export const BADGES: Badge[] = [
  {
    id: 'badge-first-milestone',
    title: 'Primer Hito',
    description: 'Registraste tu primer hito',
    icon: 'star',
    type: 'bronze',
    requirement: 'Register first milestone',
  },
  {
    id: 'badge-motor-master',
    title: 'Explorador',
    description: 'Completaste 5 hitos de motor grueso',
    icon: 'footprints',
    type: 'silver',
    category: 'motor-grueso',
    requirement: 'Complete 5 motor-grueso milestones',
  },
  {
    id: 'badge-chatterbox',
    title: 'Comunicador',
    description: 'Completaste 5 hitos de lenguaje',
    icon: 'message-circle',
    type: 'silver',
    category: 'lenguaje',
    requirement: 'Complete 5 language milestones',
  },
  {
    id: 'badge-superstar',
    title: 'Superestrella',
    description: 'Completaste 20 hitos en total',
    icon: 'trophy',
    type: 'gold',
    requirement: 'Complete 20 milestones total',
  },
  {
    id: 'badge-consistent',
    title: 'Constante',
    description: 'Registraste hitos durante 7 días seguidos',
    icon: 'flame',
    type: 'gold',
    requirement: '7 day streak',
  },
];

// Development status messages (non-alarmist, educational)
export const STATUS_MESSAGES = {
  'on-track': {
    title: 'Dentro del rango esperado',
    description: 'El desarrollo de tu hijo está dentro de los parámetros típicos para su edad.',
    color: 'success',
  },
  'early': {
    title: 'Desarrollo temprano',
    description: 'Tu hijo está mostrando avances tempranos, lo cual es completamente normal.',
    color: 'info',
  },
  'follow-up': {
    title: 'Podría requerir seguimiento',
    description: 'Te sugerimos conversar con tu pediatra en la próxima consulta. Cada niño tiene su propio ritmo.',
    color: 'warning',
  },
};

// AI disclaimer messages
export const AI_DISCLAIMER = {
  short: 'Esta información es orientativa y no reemplaza la consulta médica.',
  full: 'Hitos es una herramienta de acompañamiento y orientación. La información proporcionada no constituye un diagnóstico médico ni reemplaza la consulta con profesionales de la salud. Ante cualquier duda sobre el desarrollo de tu hijo, consulta con tu pediatra.',
};

// Navigation items for bottom nav
export const NAV_ITEMS = [
  { href: '/', label: 'Inicio', icon: 'home' },
  { href: '/milestones', label: 'Hitos', icon: 'list-checks' },
  { href: '/upload', label: 'Subir', icon: 'camera' },
  { href: '/chat', label: 'Consultar', icon: 'message-circle' },
  { href: '/profile', label: 'Perfil', icon: 'user' },
] as const;

// Common allergies
export const COMMON_ALLERGIES = [
  'Leche de vaca',
  'Huevo',
  'Maní/cacahuate',
  'Frutos secos',
  'Trigo/gluten',
  'Soja',
  'Pescado',
  'Mariscos',
  'Sésamo',
  'Látex',
  'Polvo',
  'Polen',
  'Ácaros',
  'Medicamentos',
];

// Common medical conditions
export const COMMON_CONDITIONS = [
  'Asma',
  'Dermatitis atópica',
  'Reflujo gastroesofágico',
  'Otitis recurrente',
  'Bronquitis',
  'Anemia',
  'Cardiopatía congénita',
  'Hipotiroidismo congénito',
  'Prematuridad',
  'Bajo peso al nacer',
];

// Blood types
export const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
