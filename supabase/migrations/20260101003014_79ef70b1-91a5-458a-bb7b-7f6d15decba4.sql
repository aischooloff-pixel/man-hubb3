-- Create table for scheduled welcome notifications
CREATE TABLE public.scheduled_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL DEFAULT 'welcome',
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index for efficient querying of pending notifications
CREATE INDEX idx_scheduled_notifications_pending ON public.scheduled_notifications (scheduled_at) WHERE sent_at IS NULL;

-- Enable RLS
ALTER TABLE public.scheduled_notifications ENABLE ROW LEVEL SECURITY;

-- Only service role can manage scheduled notifications
CREATE POLICY "Service role can manage scheduled notifications"
ON public.scheduled_notifications
FOR ALL
USING (false)
WITH CHECK (false);