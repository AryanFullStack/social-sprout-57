-- Fix security warnings by setting search_path on functions
CREATE OR REPLACE FUNCTION public.get_user_organization_id()
RETURNS UUID AS $$
  SELECT organization_id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.check_user_role(required_role user_role)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role::text >= required_role::text
  );
$$ LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    org_id UUID;
BEGIN
    -- Create a new organization for the user if they don't have one
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
        'admin',
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name',
        COALESCE(NEW.raw_user_meta_data->>'timezone', 'UTC'),
        COALESCE(NEW.raw_user_meta_data->>'language', 'en')
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;