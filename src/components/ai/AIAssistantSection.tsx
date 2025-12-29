import { useState } from 'react';
import { Bot, MessageCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AIAssistantChat } from './AIAssistantChat';
import { cn } from '@/lib/utils';

interface AIAssistantSectionProps {
  className?: string;
}

export function AIAssistantSection({ className }: AIAssistantSectionProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <section className={cn('px-4', className)}>
        <div className="rounded-2xl bg-gradient-to-br from-primary/20 via-card to-primary/10 border border-primary/20 p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/20">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-heading text-lg font-semibold">ИИ Ассистент</h3>
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Персональный помощник для ваших вопросов о саморазвитии, бизнесе и продуктивности
              </p>
              <Button
                onClick={() => setIsChatOpen(true)}
                className="flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Начать чат
              </Button>
            </div>
          </div>
        </div>
      </section>

      <AIAssistantChat 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </>
  );
}
