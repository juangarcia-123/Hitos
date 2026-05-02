// Child Development Tracking Types for Hitos App

export type MilestoneCategory = 
  | 'motor-grueso' 
  | 'motor-fino' 
  | 'lenguaje' 
  | 'social-cognitivo' 
  | 'biologico';

export type MilestoneStatus = 
  | 'achieved' 
  | 'in-progress' 
  | 'pending' 
  | 'attention';

export type DevelopmentStatus = 
  | 'on-track' // "Dentro del rango esperado"
  | 'early' // "Desarrollo temprano dentro de lo normal"
  | 'follow-up'; // "Podría requerir seguimiento"

export type BadgeType = 'bronze' | 'silver' | 'gold';

export type AgeRange = 
  | '0-3m' 
  | '3-6m' 
  | '6-9m' 
  | '9-12m' 
  | '12-18m' 
  | '18-24m' 
  | '2-3y' 
  | '3-4y' 
  | '4-5y';

// Perfil del padre/cuidador
export interface Parent {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  role: 'parent' | 'caregiver' | 'professional';
  relationship?: 'madre' | 'padre' | 'abuelo/a' | 'tío/a' | 'cuidador' | 'otro';
  childIds: string[];
  preferences: {
    notifications: boolean;
    reminderFrequency: 'daily' | 'weekly' | 'monthly';
    language: 'es' | 'en';
  };
  createdAt: Date;
  updatedAt: Date;
}

// Información médica del niño
export interface MedicalInfo {
  bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  allergies: Allergy[];
  conditions: MedicalCondition[];
  medications: Medication[];
  vaccinations: Vaccination[];
  pediatrician?: {
    name: string;
    phone?: string;
    clinic?: string;
  };
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface Allergy {
  id: string;
  name: string;
  severity: 'leve' | 'moderada' | 'severa';
  notes?: string;
}

export interface MedicalCondition {
  id: string;
  name: string;
  diagnosedAt?: Date;
  status: 'activa' | 'controlada' | 'resuelta';
  notes?: string;
}

export interface Medication {
  id: string;
  name: string;
  dose: string;
  frequency: string;
  startDate: Date;
  endDate?: Date;
  notes?: string;
}

export interface Vaccination {
  id: string;
  name: string;
  date: Date;
  dose?: string;
  nextDoseDate?: Date;
}

// Medidas de crecimiento
export interface GrowthMeasurement {
  id: string;
  childId: string;
  date: Date;
  weight?: number; // kg
  height?: number; // cm
  headCircumference?: number; // cm
  notes?: string;
}

export interface Child {
  id: string;
  name: string;
  birthDate: Date;
  avatar?: string;
  gender?: 'male' | 'female' | 'other';
  weight?: number; // kg actual
  height?: number; // cm actual
  notes?: string;
  medicalInfo: MedicalInfo;
  growthHistory: GrowthMeasurement[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  category: MilestoneCategory;
  ageRange: AgeRange;
  ageMonthsMin: number;
  ageMonthsMax: number;
  tips?: string[];
  activities?: string[];
  warningSignsDescription?: string;
}

export interface MilestoneRecord {
  id: string;
  childId: string;
  milestoneId: string;
  status: MilestoneStatus;
  achievedAt?: Date;
  notes?: string;
  mediaIds?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaFile {
  id: string;
  childId: string;
  url: string;
  type: 'photo' | 'video';
  thumbnailUrl?: string;
  caption?: string;
  analysisId?: string;
  uploadedAt: Date;
}

export interface AIAnalysis {
  id: string;
  mediaId: string;
  observations: string[];
  relatedMilestones: string[];
  suggestedActivities: string[];
  recommendation?: string;
  createdAt: Date;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: BadgeType;
  category?: MilestoneCategory;
  requirement: string;
}

export interface Achievement {
  id: string;
  childId: string;
  badgeId: string;
  earnedAt: Date;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  childId?: string;
  timestamp: Date;
}

// Utility type for age calculation
export interface ChildAge {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  label: string; // "2 años, 3 meses" or "8 meses"
  shortLabel: string; // "2 años y 1 mes"
  ageRange: AgeRange;
}

// Navigation types
export type AppRoute = 
  | '/' 
  | '/onboarding' 
  | '/children' 
  | '/children/[id]' 
  | '/milestones' 
  | '/chat' 
  | '/upload' 
  | '/timeline' 
  | '/learn' 
  | '/settings'
  | '/profile';

// Hitos recomendados por IA
export interface AIRecommendedMilestones {
  childId: string;
  ageLabel: string;
  currentMilestones: Milestone[];
  upcomingMilestones: Milestone[];
  suggestedActivities: string[];
  generatedAt: Date;
}
