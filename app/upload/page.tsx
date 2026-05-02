'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Camera, 
  Video, 
  Upload, 
  X, 
  Sparkles,
  Check,
  Baby,
  Hand,
  MessageCircle,
  Eye,
  Lightbulb,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BottomNav } from '@/components/navigation/bottom-nav';
import { cn } from '@/lib/utils';
import { AI_DISCLAIMER } from '@/lib/constants';
import { SAMPLE_CHILDREN } from '@/lib/child-utils';

type UploadState = 'idle' | 'uploading' | 'analyzing' | 'complete';

interface AnalysisResult {
  observations: string[];
  relatedMilestones: Array<{
    title: string;
    category: string;
    status: 'possible' | 'suggested';
  }>;
  activities: string[];
  recommendation: string;
}

const SAMPLE_ANALYSIS: AnalysisResult = {
  observations: [
    'El nino esta en posicion sentada sin apoyo',
    'Muestra buen control del tronco',
    'Manipula un objeto con ambas manos',
    'Parece estar enfocado en la actividad',
  ],
  relatedMilestones: [
    { title: 'Se sienta sin apoyo', category: 'motor-grueso', status: 'possible' },
    { title: 'Transfiere objetos entre manos', category: 'motor-fino', status: 'possible' },
    { title: 'Atencion sostenida', category: 'social-cognitivo', status: 'suggested' },
  ],
  activities: [
    'Ofrecer juguetes de diferentes texturas para explorar',
    'Jugar a pasar objetos de una mano a otra',
    'Cantar canciones mientras juegan juntos',
  ],
  recommendation: 'Las observaciones sugieren un desarrollo motor dentro de lo esperado para la edad. Continua con las actividades de estimulacion y disfruta estos momentos de juego.',
};

export default function UploadPage() {
  const selectedChild = SAMPLE_CHILDREN[0];
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploadState('uploading');
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setUploadProgress(i);
    }

    setUploadState('analyzing');
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    setAnalysis(SAMPLE_ANALYSIS);
    setUploadState('complete');
  };

  const handleReset = () => {
    setUploadState('idle');
    setSelectedFile(null);
    setPreview(null);
    setAnalysis(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const categoryIcons: Record<string, React.ElementType> = {
    'motor-grueso': Baby,
    'motor-fino': Hand,
    'lenguaje': MessageCircle,
    'social-cognitivo': Eye,
  };

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
          <h1 className="font-bold text-lg">Subir Foto o Video</h1>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Upload Area - Idle State */}
        {uploadState === 'idle' && !preview && (
          <>
            <p className="text-muted-foreground text-center">
              Sube una foto o video de {selectedChild.name.split(' ')[0]} y nuestra IA 
              te ayudara a identificar posibles hitos del desarrollo.
            </p>

            {/* Upload Options */}
            <div className="grid grid-cols-2 gap-4">
              <label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileSelect}
                  className="sr-only"
                />
                <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-chart-4/20 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-chart-4" />
                    </div>
                    <span className="font-medium">Tomar foto</span>
                  </CardContent>
                </Card>
              </label>

              <label>
                <input
                  type="file"
                  accept="video/*"
                  capture="environment"
                  onChange={handleFileSelect}
                  className="sr-only"
                />
                <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-chart-3/20 flex items-center justify-center">
                      <Video className="w-8 h-8 text-chart-3" />
                    </div>
                    <span className="font-medium">Grabar video</span>
                  </CardContent>
                </Card>
              </label>
            </div>

            {/* Or upload from gallery */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-background text-sm text-muted-foreground">
                  o selecciona de tu galeria
                </span>
              </div>
            </div>

            <label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="sr-only"
              />
              <Card className="cursor-pointer hover:shadow-md transition-shadow border-dashed border-2">
                <CardContent className="p-8 flex flex-col items-center justify-center text-center gap-3">
                  <Upload className="w-10 h-10 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Subir archivo</p>
                    <p className="text-sm text-muted-foreground">
                      JPG, PNG, MP4 hasta 50MB
                    </p>
                  </div>
                </CardContent>
              </Card>
            </label>

            {/* Disclaimer */}
            <Card className="bg-muted/50">
              <CardContent className="p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  {AI_DISCLAIMER.short} El analisis identifica elementos observables 
                  y sugiere posibles hitos relacionados.
                </p>
              </CardContent>
            </Card>
          </>
        )}

        {/* Preview with file selected */}
        {preview && uploadState === 'idle' && (
          <>
            <div className="relative rounded-2xl overflow-hidden bg-muted aspect-square">
              {selectedFile?.type.startsWith('video') ? (
                <video 
                  src={preview} 
                  className="w-full h-full object-cover"
                  controls
                />
              ) : (
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              )}
              <button
                onClick={handleReset}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <Button
              onClick={handleUpload}
              size="lg"
              className="w-full h-14 text-lg font-semibold rounded-2xl"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Analizar con IA
            </Button>
          </>
        )}

        {/* Uploading State */}
        {uploadState === 'uploading' && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6">
              <Upload className="w-10 h-10 text-primary animate-pulse" />
            </div>
            <h2 className="font-bold text-xl mb-2">Subiendo archivo...</h2>
            <div className="w-full max-w-xs">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground text-center mt-2">
                {uploadProgress}%
              </p>
            </div>
          </div>
        )}

        {/* Analyzing State */}
        {uploadState === 'analyzing' && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-20 h-20 rounded-full bg-chart-3/20 flex items-center justify-center mb-6">
              <Sparkles className="w-10 h-10 text-chart-3 animate-pulse" />
            </div>
            <h2 className="font-bold text-xl mb-2">Analizando...</h2>
            <p className="text-muted-foreground text-center max-w-xs">
              Nuestra IA esta observando el contenido para identificar 
              posibles hitos del desarrollo.
            </p>
          </div>
        )}

        {/* Complete State - Analysis Results */}
        {uploadState === 'complete' && analysis && (
          <>
            {/* Preview thumbnail */}
            {preview && (
              <div className="relative rounded-2xl overflow-hidden bg-muted aspect-video">
                {selectedFile?.type.startsWith('video') ? (
                  <video 
                    src={preview} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img 
                    src={preview} 
                    alt="Analyzed" 
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-success/90 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">Analizado</span>
                </div>
              </div>
            )}

            {/* Observations */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  Que observamos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.observations.map((obs, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{obs}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Related Milestones */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-chart-2" />
                  Posibles hitos relacionados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysis.relatedMilestones.map((milestone, index) => {
                  const Icon = categoryIcons[milestone.category] || Baby;
                  return (
                    <div
                      key={index}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-xl border',
                        milestone.status === 'possible'
                          ? 'bg-success/10 border-success/30'
                          : 'bg-muted border-border'
                      )}
                    >
                      <Icon className={cn(
                        'w-5 h-5',
                        milestone.status === 'possible' ? 'text-success' : 'text-muted-foreground'
                      )} />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{milestone.title}</p>
                      </div>
                      {milestone.status === 'possible' && (
                        <span className="text-xs text-success font-medium">
                          Posible
                        </span>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Suggested Activities */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-chart-4" />
                  Actividades sugeridas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.activities.map((activity, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-chart-4 font-bold">{index + 1}.</span>
                      <span className="text-muted-foreground">{activity}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Recommendation */}
            <Card className="bg-gradient-to-br from-primary/10 to-chart-3/10 border-primary/20">
              <CardContent className="p-4">
                <p className="text-sm text-foreground">{analysis.recommendation}</p>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={handleReset} className="h-12">
                Subir otro
              </Button>
              <Link href="/" className="block">
                <Button className="w-full h-12">
                  Guardar
                </Button>
              </Link>
            </div>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
