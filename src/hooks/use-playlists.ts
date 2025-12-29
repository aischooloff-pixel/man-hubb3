import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type PlaylistService = 'spotify' | 'soundcloud' | 'yandex';
export type PlaylistCategory = 'motivation' | 'workout' | 'self-development';

export interface Playlist {
  id: string;
  service: PlaylistService;
  category: PlaylistCategory;
  title: string;
  url: string;
  cover_urls: string[];
  created_at: string | null;
}

export function usePlaylists(service?: PlaylistService) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlaylists = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('playlists')
      .select('*')
      .order('created_at', { ascending: false });

    if (service) {
      query = query.eq('service', service);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching playlists:', error);
    } else {
      setPlaylists((data || []) as Playlist[]);
    }
    setLoading(false);
  }, [service]);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  return { playlists, loading, refetch: fetchPlaylists };
}

export const categoryLabels: Record<PlaylistCategory, string> = {
  motivation: 'Мотивация',
  workout: 'Тренировка',
  'self-development': 'Саморазвитие',
};

export const serviceLabels: Record<PlaylistService, string> = {
  spotify: 'Spotify',
  soundcloud: 'SoundCloud',
  yandex: 'Yandex Music',
};
