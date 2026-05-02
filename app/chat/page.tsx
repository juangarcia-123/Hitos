'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { 
  ArrowLeft, 
  Send, 
  Sparkles, 
  User,
  Info,
  Lightbulb,
  HelpCircle,
  Baby,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { AI_DISCLAIMER } from '@/lib/constants';
import { createClient } from '@/lib/supabase/client';

interface DbChild {
  id: string;
  name: string;
  birth_date: string;
}

const SUGGESTED_QUESTIONS = [
  {
    icon: Baby,
    text: 'Que hitos deberia lograr a esta edad?',
    category: 'milestones',
  },
  {
    icon: Lightbulb,
    text: 'Actividades para estimular el lenguaje',
    category: 'activities',
  },
  {
    icon: HelpCircle,
    text: 'Cuando deberia consultar con un especialista?',
    category: 'concerns',
  },
];

function calculateAge(birthDate: string): string {
  const birth = new Date(birthDate);
  const now = new Date();
  const ageMonths = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 30.44));
  const years = Math.floor(ageMonths / 12);
  const months = ageMonths % 12;
  
  if (years > 0) {
    return `${years} año${years > 1 ? 's' : ''} y ${months} mes${months !== 1 ? 'es' : ''}`;
  }
  return `${months} mes${months !== 1 ? 'es' : ''}`;
}

export default function ChatPage() {
  const router = useRouter();
  const [selectedChild, setSelectedChild] = useState<DbChild | null>(null);
  const [isLoadingChild, setIsLoadingChild] = useState(true);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load child data
  useEffect(() => {
    async function loadChild() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth/login');
        return;
      }

      const { data: children } = await supabase
        .from('children')
        .select('id, name, birth_date')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (children && children.length > 0) {
        setSelectedChild(children[0]);
      }
      setIsLoadingChild(false);
    }

    loadChild();
  }, [router]);

  // AI Chat hook
  const { messages, sendMessage, status, error, reload } = useChat({
    transport: new DefaultChatTransport({ 
      api: '/api/chat',
      body: selectedChild ? { childId: selectedChild.id } : undefined,
    }),
  });

  const isLoading = status === 'streaming' || status === 'submitted';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    setInput('');
    sendMessage({ text: messageText });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Get text content from message parts
  const getMessageText = (parts: typeof messages[0]['parts']) => {
    return parts
      ?.filter((p): p is { type: 'text'; text: string } => p.type === 'text')
      .map((p) => p.text)
      .join('') || '';
  };

  if (isLoadingChild) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner className="w-8 h-8 text-primary" />
      </div>
    );
  }

  const childName = selectedChild?.name.split(' ')[0] || 'tu hijo';
  const childAge = selectedChild ? calculateAge(selectedChild.birth_date) : '';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border safe-top">
        <div className="flex items-center gap-4 px-4 h-16">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-foreground">Asistente Hitos</h1>
              <p className="text-xs text-muted-foreground">
                {selectedChild ? `Orientación para ${childName}` : 'Orientación sobre desarrollo infantil'}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-4 pb-32">
        {/* Disclaimer */}
        <Card className="mb-4 bg-info/10 border-info/30">
          <CardContent className="p-3 flex items-start gap-2">
            <Info className="w-4 h-4 text-info flex-shrink-0 mt-0.5" />
            <p className="text-xs text-info-foreground">
              {AI_DISCLAIMER.short}
            </p>
          </CardContent>
        </Card>

        {/* Welcome message */}
        {messages.length === 0 && (
          <div className="flex gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div className="max-w-[80%] rounded-2xl rounded-tl-sm px-4 py-3 bg-card border border-border">
              <p className="text-sm text-foreground whitespace-pre-wrap">
                {`¡Hola! Soy tu asistente de Hitos.${selectedChild ? ` Estoy aquí para ayudarte con dudas sobre el desarrollo de ${childName} (${childAge}).` : ''}\n\nPuedo orientarte sobre hitos del desarrollo, sugerir actividades de estimulación y responder preguntas generales. Recuerda que mi rol es educativo y no reemplazo la consulta con tu pediatra.`}
              </p>
            </div>
          </div>
        )}

        {/* Message List */}
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3',
                message.role === 'user' && 'flex-row-reverse'
              )}
            >
              {/* Avatar */}
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                  message.role === 'assistant'
                    ? 'bg-primary/20'
                    : 'bg-muted'
                )}
              >
                {message.role === 'assistant' ? (
                  <Sparkles className="w-4 h-4 text-primary" />
                ) : (
                  <User className="w-4 h-4 text-muted-foreground" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={cn(
                  'max-w-[80%] rounded-2xl px-4 py-3',
                  message.role === 'assistant'
                    ? 'bg-card border border-border rounded-tl-sm'
                    : 'bg-primary text-primary-foreground rounded-tr-sm'
                )}
              >
                <p className={cn(
                  'text-sm whitespace-pre-wrap',
                  message.role === 'assistant' && 'text-foreground'
                )}>
                  {getMessageText(message.parts)}
                </p>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.1s]" />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                </div>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center">
                <Info className="w-4 h-4 text-destructive" />
              </div>
              <div className="bg-destructive/10 border border-destructive/30 rounded-2xl rounded-tl-sm px-4 py-3">
                <p className="text-sm text-destructive">
                  Ocurrió un error al procesar tu mensaje. Por favor, intenta nuevamente.
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => reload()}
                  className="mt-2 text-destructive"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reintentar
                </Button>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions (show if no messages) */}
        {messages.length === 0 && (
          <div className="mt-6">
            <p className="text-sm text-muted-foreground mb-3">
              Preguntas sugeridas:
            </p>
            <div className="space-y-2">
              {SUGGESTED_QUESTIONS.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSend(question.text)}
                  disabled={isLoading}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl',
                    'bg-card border border-border text-left',
                    'hover:bg-muted/50 transition-colors',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  <question.icon className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">{question.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border p-4 safe-bottom">
        <div className="flex items-end gap-2 max-w-3xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu pregunta..."
              rows={1}
              disabled={isLoading}
              className={cn(
                'w-full resize-none rounded-2xl border border-input bg-background px-4 py-3 pr-12',
                'text-sm placeholder:text-muted-foreground',
                'focus:outline-none focus:ring-2 focus:ring-ring',
                'max-h-32 disabled:opacity-50'
              )}
              style={{
                height: 'auto',
                minHeight: '48px',
              }}
            />
          </div>
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="h-12 w-12 rounded-full flex-shrink-0"
          >
            {isLoading ? (
              <Spinner className="w-5 h-5" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
