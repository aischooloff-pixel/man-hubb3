-- Create podcasts table
CREATE TABLE public.podcasts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  youtube_url text NOT NULL,
  youtube_id text NOT NULL,
  title text NOT NULL,
  description text,
  thumbnail_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.podcasts ENABLE ROW LEVEL SECURITY;

-- Podcasts are viewable by everyone
CREATE POLICY "Podcasts are viewable by everyone"
ON public.podcasts
FOR SELECT
USING (true);

-- Service role can manage podcasts
CREATE POLICY "Service role can manage podcasts"
ON public.podcasts
FOR ALL
USING (true)
WITH CHECK (true);

-- Create playlists table
CREATE TABLE public.playlists (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service text NOT NULL CHECK (service IN ('spotify', 'soundcloud', 'yandex')),
  category text NOT NULL CHECK (category IN ('motivation', 'workout', 'self-development')),
  title text NOT NULL,
  url text NOT NULL,
  cover_urls text[] DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;

-- Playlists are viewable by everyone
CREATE POLICY "Playlists are viewable by everyone"
ON public.playlists
FOR SELECT
USING (true);

-- Service role can manage playlists
CREATE POLICY "Service role can manage playlists"
ON public.playlists
FOR ALL
USING (true)
WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_podcasts_updated_at
BEFORE UPDATE ON public.podcasts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_playlists_updated_at
BEFORE UPDATE ON public.playlists
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();