import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Headphones, Flame, Dumbbell, Brain, Music, ArrowLeft, ExternalLink } from 'lucide-react';
import spotifyLogo from '@/assets/spotify-logo.jpeg';
import soundcloudLogo from '@/assets/soundcloud-logo.jpeg';
import yandexMusicLogo from '@/assets/yandex-music-logo.jpeg';
import { usePlaylists, PlaylistService, PlaylistCategory, categoryLabels } from '@/hooks/use-playlists';
import { cn } from '@/lib/utils';

interface PlaylistsSectionProps {
  className?: string;
}

const services = [
  { id: 'spotify' as PlaylistService, logo: spotifyLogo, name: 'Spotify' },
  { id: 'soundcloud' as PlaylistService, logo: soundcloudLogo, name: 'SoundCloud' },
  { id: 'yandex' as PlaylistService, logo: yandexMusicLogo, name: 'Yandex Music' },
];

const categoryIcons: Record<PlaylistCategory, React.ReactNode> = {
  motivation: <Flame className="w-5 h-5 text-orange-500" />,
  workout: <Dumbbell className="w-5 h-5 text-primary" />,
  'self-development': <Brain className="w-5 h-5 text-purple-500" />,
};

export const PlaylistsSection = ({ className }: PlaylistsSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedService, setSelectedService] = useState<PlaylistService | null>(null);
  const { playlists, loading } = usePlaylists(selectedService || undefined);

  const handleServiceSelect = (service: PlaylistService) => {
    setSelectedService(service);
  };

  const handleBack = () => {
    setSelectedService(null);
  };

  const handleChangeService = () => {
    setSelectedService(null);
  };

  const handleListen = (url: string) => {
    window.open(url, '_blank');
  };

  const filteredPlaylists = selectedService
    ? playlists.filter(p => p.service === selectedService)
    : [];

  // Group by category
  const groupedPlaylists = filteredPlaylists.reduce((acc, playlist) => {
    if (!acc[playlist.category]) {
      acc[playlist.category] = [];
    }
    acc[playlist.category].push(playlist);
    return acc;
  }, {} as Record<PlaylistCategory, typeof filteredPlaylists>);

  return (
    <section className={className}>
      <div className="px-4">
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            'w-full bg-card border border-border/50',
            'transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden',
            isExpanded ? 'rounded-t-2xl rounded-b-none border-b-0' : 'rounded-2xl'
          )}
        >
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Headphones className="w-5 h-5 text-primary" />
              <span className="font-heading font-semibold text-lg">Плейлисты</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <img src={spotifyLogo} alt="Spotify" className="w-6 h-6 rounded-full object-cover" />
                <img src={soundcloudLogo} alt="SoundCloud" className="w-6 h-6 rounded-full object-cover" />
                <img src={yandexMusicLogo} alt="Yandex Music" className="w-6 h-6 rounded-lg object-cover" />
              </div>
              <ChevronDown
                className={cn(
                  'w-5 h-5 text-muted-foreground transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]',
                  isExpanded ? 'rotate-180' : ''
                )}
              />
            </div>
          </div>
        </button>

        {/* Expanded Content */}
        <div
          className="bg-card border border-border/50 border-t-0 rounded-b-2xl overflow-hidden"
          style={{
            maxHeight: isExpanded ? '800px' : '0px',
            opacity: isExpanded ? 1 : 0,
            transition: 'max-height 500ms cubic-bezier(0.4, 0, 0.2, 1), opacity 400ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div
            className="p-4 pt-2"
            style={{
              transform: isExpanded ? 'translateY(0)' : 'translateY(-10px)',
              transition: 'transform 500ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {!selectedService ? (
              /* Service Selection */
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Выберите сервис для прослушивания
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {services.map((service, index) => (
                    <button
                      key={service.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleServiceSelect(service.id);
                      }}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all hover:scale-105"
                      style={{
                        opacity: isExpanded ? 1 : 0,
                        transform: isExpanded ? 'translateY(0)' : 'translateY(-8px)',
                        transition: `opacity 400ms cubic-bezier(0.4, 0, 0.2, 1) ${index * 50}ms, transform 400ms cubic-bezier(0.4, 0, 0.2, 1) ${index * 50}ms`,
                      }}
                    >
                      <img
                        src={service.logo}
                        alt={service.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <span className="text-xs font-medium text-center">{service.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Playlists View */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBack();
                    }}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Назад
                  </button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChangeService();
                    }}
                    className="text-xs"
                  >
                    Изменить сервис
                  </Button>
                </div>

                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Загрузка...
                  </div>
                ) : Object.keys(groupedPlaylists).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Music className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Плейлисты пока не добавлены</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(['motivation', 'workout', 'self-development'] as PlaylistCategory[]).map((category) => {
                      const categoryPlaylists = groupedPlaylists[category];
                      if (!categoryPlaylists || categoryPlaylists.length === 0) return null;

                      return (
                        <div key={category} className="space-y-2">
                          <div className="flex items-center gap-2">
                            {categoryIcons[category]}
                            <h4 className="font-medium">{categoryLabels[category]}</h4>
                          </div>
                          {categoryPlaylists.map((playlist) => (
                            <div
                              key={playlist.id}
                              className="flex items-center justify-between p-3 bg-muted/50 rounded-xl"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{playlist.title}</p>
                                {playlist.cover_urls.length > 0 && (
                                  <div className="flex gap-1 mt-2 overflow-x-auto">
                                    {playlist.cover_urls.slice(0, 5).map((url, idx) => (
                                      <img
                                        key={idx}
                                        src={url}
                                        alt=""
                                        className="w-8 h-8 rounded object-cover flex-shrink-0"
                                      />
                                    ))}
                                    {playlist.cover_urls.length > 5 && (
                                      <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground flex-shrink-0">
                                        +{playlist.cover_urls.length - 5}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleListen(playlist.url);
                                }}
                                className="ml-3 flex items-center gap-1"
                              >
                                <ExternalLink className="w-3 h-3" />
                                Слушать
                              </Button>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
