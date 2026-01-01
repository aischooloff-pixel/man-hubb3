import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTelegram } from '@/hooks/use-telegram';

interface TelegramCTAProps {
  className?: string;
}

const TELEGRAM_CHANNEL_URL = 'https://t.me/Man_HubRu';

export function TelegramCTA({ className }: TelegramCTAProps) {
  const { openTelegramLink } = useTelegram();

  const handleSubscribe = () => {
    openTelegramLink(TELEGRAM_CHANNEL_URL);
  };

  return (
    <section
      className={cn(
        'mx-4 rounded-lg border border-border bg-card p-6',
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-muted">
          <Send className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className="mb-1 font-heading text-lg font-semibold">
            Присоединяйтесь к каналу
          </h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Новости, анонсы и эксклюзивный контент в нашем Telegram-канале
          </p>
          <Button variant="outline" className="gap-2" onClick={handleSubscribe}>
            <Send className="h-4 w-4" />
            Подписаться
          </Button>
        </div>
      </div>
    </section>
  );
}
