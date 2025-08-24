-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enums
CREATE TYPE public.user_role AS ENUM ('admin', 'editor', 'viewer');
CREATE TYPE public.post_status AS ENUM ('draft', 'scheduled', 'publishing', 'published', 'failed', 'cancelled');
CREATE TYPE public.social_platform AS ENUM ('facebook', 'instagram', 'linkedin', 'twitter');
CREATE TYPE public.post_tone AS ENUM ('professional', 'casual', 'promotional');
CREATE TYPE public.approval_status AS ENUM ('pending', 'approved', 'rejected');

-- Organizations table (for multi-tenancy)
CREATE TABLE public.organizations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User profiles table
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'viewer',
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    timezone TEXT DEFAULT 'UTC',
    language TEXT DEFAULT 'en',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, organization_id)
);

-- Social accounts table (for OAuth connections)
CREATE TABLE public.social_accounts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    platform social_platform NOT NULL,
    account_name TEXT NOT NULL,
    account_id TEXT NOT NULL,
    avatar_url TEXT,
    access_token TEXT NOT NULL, -- Will be encrypted
    refresh_token TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    scope TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_error TEXT,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(organization_id, platform, account_id)
);

-- Topics table
CREATE TABLE public.topics (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    keywords TEXT[],
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Templates table
CREATE TABLE public.templates (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    tone post_tone DEFAULT 'professional',
    platforms social_platform[],
    tags TEXT[],
    is_public BOOLEAN DEFAULT false,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Posts table
CREATE TABLE public.posts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    title TEXT,
    content TEXT NOT NULL,
    tone post_tone DEFAULT 'professional',
    hashtags TEXT[],
    cta_text TEXT,
    cta_url TEXT,
    media_urls TEXT[],
    platforms social_platform[] NOT NULL,
    status post_status NOT NULL DEFAULT 'draft',
    approval_status approval_status DEFAULT 'pending',
    scheduled_for TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    template_id UUID REFERENCES public.templates(id),
    topic_id UUID REFERENCES public.topics(id),
    ai_generated BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Post schedules table (for recurring posts)
CREATE TABLE public.post_schedules (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    social_account_id UUID NOT NULL REFERENCES public.social_accounts(id) ON DELETE CASCADE,
    platform social_platform NOT NULL,
    scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
    status post_status NOT NULL DEFAULT 'scheduled',
    attempts INTEGER DEFAULT 0,
    last_attempt_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    published_post_id TEXT, -- External platform post ID
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Publish jobs queue table
CREATE TABLE public.publish_jobs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    post_schedule_id UUID NOT NULL REFERENCES public.post_schedules(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed
    priority INTEGER DEFAULT 0,
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Audit logs table
CREATE TABLE public.audit_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Comments table (for collaboration)
CREATE TABLE public.post_comments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Notifications table
CREATE TABLE public.notifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publish_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper function to get user's organization ID
CREATE OR REPLACE FUNCTION public.get_user_organization_id()
RETURNS UUID AS $$
  SELECT organization_id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Helper function to check user role
CREATE OR REPLACE FUNCTION public.check_user_role(required_role user_role)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role::text >= required_role::text
  );
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- RLS Policies for organizations
CREATE POLICY "Users can view their organization"
  ON public.organizations FOR SELECT
  USING (id = public.get_user_organization_id());

CREATE POLICY "Admins can update their organization"
  ON public.organizations FOR UPDATE
  USING (id = public.get_user_organization_id() AND public.check_user_role('admin'));

-- RLS Policies for profiles
CREATE POLICY "Users can view profiles in their organization"
  ON public.profiles FOR SELECT
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Admins can update profiles in their organization"
  ON public.profiles FOR UPDATE
  USING (organization_id = public.get_user_organization_id() AND public.check_user_role('admin'));

-- RLS Policies for social_accounts
CREATE POLICY "Users can view social accounts in their organization"
  ON public.social_accounts FOR SELECT
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Editors can manage social accounts"
  ON public.social_accounts FOR ALL
  USING (organization_id = public.get_user_organization_id() AND public.check_user_role('editor'));

-- RLS Policies for posts
CREATE POLICY "Users can view posts in their organization"
  ON public.posts FOR SELECT
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Editors can manage posts"
  ON public.posts FOR ALL
  USING (organization_id = public.get_user_organization_id() AND public.check_user_role('editor'));

-- RLS Policies for other tables follow same pattern
CREATE POLICY "Users access within organization" ON public.topics
  FOR ALL USING (organization_id = public.get_user_organization_id() AND public.check_user_role('editor'));

CREATE POLICY "Users access within organization" ON public.templates
  FOR ALL USING (organization_id = public.get_user_organization_id() AND public.check_user_role('editor'));

CREATE POLICY "Users access within organization" ON public.post_schedules
  FOR ALL USING (EXISTS (SELECT 1 FROM public.posts WHERE posts.id = post_schedules.post_id AND posts.organization_id = public.get_user_organization_id()));

CREATE POLICY "Users access within organization" ON public.publish_jobs
  FOR ALL USING (organization_id = public.get_user_organization_id() AND public.check_user_role('editor'));

CREATE POLICY "Users access within organization" ON public.audit_logs
  FOR SELECT USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users access within organization" ON public.post_comments
  FOR ALL USING (EXISTS (SELECT 1 FROM public.posts WHERE posts.id = post_comments.post_id AND posts.organization_id = public.get_user_organization_id()));

CREATE POLICY "Users access within organization" ON public.notifications
  FOR ALL USING (organization_id = public.get_user_organization_id());

-- Create indexes for performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_organization_id ON public.profiles(organization_id);
CREATE INDEX idx_social_accounts_organization_id ON public.social_accounts(organization_id);
CREATE INDEX idx_posts_organization_id ON public.posts(organization_id);
CREATE INDEX idx_posts_status ON public.posts(status);
CREATE INDEX idx_posts_scheduled_for ON public.posts(scheduled_for);
CREATE INDEX idx_post_schedules_scheduled_for ON public.post_schedules(scheduled_for);
CREATE INDEX idx_publish_jobs_status ON public.publish_jobs(status);
CREATE INDEX idx_publish_jobs_scheduled_for ON public.publish_jobs(scheduled_for);
CREATE INDEX idx_audit_logs_organization_id ON public.audit_logs(organization_id);

-- Create functions for updated_at triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON public.organizations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_social_accounts_updated_at BEFORE UPDATE ON public.social_accounts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_topics_updated_at BEFORE UPDATE ON public.topics
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON public.templates
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_post_schedules_updated_at BEFORE UPDATE ON public.post_schedules
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_publish_jobs_updated_at BEFORE UPDATE ON public.publish_jobs
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    org_id UUID;
BEGIN
    -- Create a new organization for the user if they don't have one
    -- In production, you might want different logic here
    INSERT INTO public.organizations (name, slug)
    VALUES (
        COALESCE(NEW.raw_user_meta_data->>'organization_name', 'My Organization'),
        COALESCE(NEW.raw_user_meta_data->>'organization_slug', 'org-' || SUBSTRING(NEW.id::text, 1, 8))
    )
    RETURNING id INTO org_id;

    -- Create user profile
    INSERT INTO public.profiles (
        user_id,
        organization_id,
        role,
        first_name,
        last_name,
        timezone,
        language
    )
    VALUES (
        NEW.id,
        org_id,
        'admin', -- First user in org becomes admin
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name',
        COALESCE(NEW.raw_user_meta_data->>'timezone', 'UTC'),
        COALESCE(NEW.raw_user_meta_data->>'language', 'en')
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();