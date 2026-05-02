'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Baby, 
  Brain, 
  Camera, 
  MessageCircle, 
  Shield, 
  ChevronRight, 
  ArrowLeft 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    icon: Baby,
    iconBg: 'bg-primary',
    title: 'Bienvenido a Hitos',
    description: 'Acompanamos cada paso del desarrollo de tu hijo, desde los 0 hasta los 5 anos.',
    highlight: 'Registra, comprende y celebra cada logro.',
  },
  {
    id: 'milestones',
    icon: Brain,
    iconBg: 'bg-chart-3',
    title: 'Seguimiento de Hitos',
    description: 'Registra los hitos del desarrollo en 5 areas: motor grueso, motor fino, lenguaje, social-cognitivo y biologico.',
    highlight: 'Todo basado en guias de desarrollo infantil.',
  },
  {
    id: 'ai',
    icon: MessageCircle,
    iconBg: 'bg-chart-2',
    title: 'Orientacion con IA',
    description: 'Haz preguntas sobre el desarrollo de tu hijo y recibe orientacion educativa. Analiza fotos y videos para identificar posibles hitos.',
    highlight: 'Nunca reemplazamos al pediatra.',
  },
  {
    id: 'media',
    icon: Camera,
    iconBg: 'bg-chart-4',
    title: 'Captura Momentos',
    description: 'Sube fotos y videos de tu hijo. Nuestra IA te ayudara a identificar que hitos podrian estar relacionados.',
    highlight: 'Crea un hermoso registro visual.',
  },
  {
    id: 'safety',
    icon: Shield,
    iconBg: 'bg-success',
    title: 'Seguro y Responsable',
    description: 'Hitos es una herramienta de acompanamiento. No diagnosticamos ni etiquetamos. Tu informacion esta protegida.',
    highlight: 'Ante cualquier duda, consulta con tu pediatra.',
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const step = ONBOARDING_STEPS[currentStep];
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  const goNext = () => {
    if (isLastStep) {
      // Complete onboarding
      router.push('/children/new');
    } else {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goBack = () => {
    if (!isFirstStep) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const skipOnboarding = () => {
    router.push('/children/new');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header with skip */}
      <header className="flex items-center justify-between p-4 safe-top">
        {!isFirstStep ? (
          <Button variant="ghost" size="icon" onClick={goBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
        ) : (
          <div className="w-10" />
        )}
        
        <Button variant="ghost" onClick={skipOnboarding} className="text-muted-foreground">
          Omitir
        </Button>
      </header>

      {/* Progress indicator */}
      <div className="flex gap-2 px-8 mb-8">
        {ONBOARDING_STEPS.map((_, index) => (
          <div
            key={index}
            className={cn(
              'h-1 flex-1 rounded-full transition-all duration-300',
              index <= currentStep ? 'bg-primary' : 'bg-muted'
            )}
          />
        ))}
      </div>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 pb-8">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -100 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex flex-col items-center text-center max-w-md"
          >
            {/* Icon */}
            <div
              className={cn(
                'w-24 h-24 rounded-3xl flex items-center justify-center mb-8',
                'shadow-lg',
                step.iconBg
              )}
            >
              <step.icon className="w-12 h-12 text-white" />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-foreground mb-4">
              {step.title}
            </h1>

            {/* Description */}
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              {step.description}
            </p>

            {/* Highlight */}
            <p className="text-primary font-semibold">
              {step.highlight}
            </p>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer with CTA */}
      <footer className="p-8 safe-bottom">
        <Button
          onClick={goNext}
          size="lg"
          className="w-full h-14 text-lg font-semibold rounded-2xl"
        >
          {isLastStep ? 'Comenzar' : 'Continuar'}
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </footer>
    </div>
  );
}
