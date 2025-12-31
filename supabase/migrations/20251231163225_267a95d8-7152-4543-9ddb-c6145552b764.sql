-- Add moderation fields to user_products table
ALTER TABLE public.user_products 
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS rejection_reason text,
ADD COLUMN IF NOT EXISTS moderated_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS moderated_by_telegram_id bigint;

-- Update existing products to approved status (grandfathering)
UPDATE public.user_products SET status = 'approved' WHERE status = 'pending';

-- Create index for status queries
CREATE INDEX IF NOT EXISTS idx_user_products_status ON public.user_products(status);

-- Update RLS policy to show only approved products publicly
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.user_products;
CREATE POLICY "Approved products are viewable by everyone" 
ON public.user_products 
FOR SELECT 
USING (is_active = true AND status = 'approved');

-- Allow service role to manage all products
DROP POLICY IF EXISTS "Service role can manage products" ON public.user_products;
CREATE POLICY "Service role can manage products" 
ON public.user_products 
FOR ALL 
USING (true)
WITH CHECK (true);