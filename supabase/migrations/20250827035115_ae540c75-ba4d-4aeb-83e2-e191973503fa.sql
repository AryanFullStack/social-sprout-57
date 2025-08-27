-- Update platform enum to remove twitter
ALTER TYPE platform RENAME TO platform_old;

-- Create new enum without twitter
CREATE TYPE platform AS ENUM ('facebook', 'instagram', 'linkedin');

-- Update existing tables to use new enum
ALTER TABLE public.social_accounts ALTER COLUMN platform TYPE platform USING platform::text::platform;
ALTER TABLE public.oauth_states ALTER COLUMN provider TYPE platform USING provider::text::platform;

-- Drop old enum
DROP TYPE platform_old;