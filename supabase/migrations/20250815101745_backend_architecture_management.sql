-- Location: supabase/migrations/20250815101745_backend_architecture_management.sql
-- Schema Analysis: Existing knowledge base system with profiles, user_roles, categories, documents, audit_logs
-- Integration Type: Extension - Adding backend infrastructure management
-- Dependencies: Extends existing profiles table for admin management

-- Backend Infrastructure Management Extension for FITS AI

-- 1. Types for Backend Management
CREATE TYPE public.service_status AS ENUM ('healthy', 'degraded', 'down', 'maintenance');
CREATE TYPE public.provider_type AS ENUM ('vector', 'llm', 'search', 'collab', 'database');
CREATE TYPE public.deployment_environment AS ENUM ('development', 'staging', 'production');

-- 2. Backend Services Table
CREATE TABLE public.backend_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    service_type TEXT NOT NULL,
    status public.service_status DEFAULT 'healthy'::public.service_status,
    endpoint_url TEXT,
    version TEXT,
    last_health_check TIMESTAMPTZ,
    configuration JSONB DEFAULT '{}',
    environment public.deployment_environment DEFAULT 'development'::public.deployment_environment,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- 3. API Endpoints Management
CREATE TABLE public.api_endpoints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID REFERENCES public.backend_services(id) ON DELETE CASCADE,
    path TEXT NOT NULL,
    method TEXT NOT NULL CHECK (method IN ('GET', 'POST', 'PUT', 'DELETE', 'PATCH')),
    description TEXT,
    is_enabled BOOLEAN DEFAULT true,
    rate_limit INTEGER DEFAULT 100,
    requires_auth BOOLEAN DEFAULT true,
    last_tested TIMESTAMPTZ,
    response_time_ms INTEGER,
    success_rate DECIMAL(5,2) DEFAULT 100.00,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tenants Table (Multi-tenant Configuration)
CREATE TABLE public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    region TEXT DEFAULT 'us-east-1',
    plan TEXT DEFAULT 'basic',
    provider_config JSONB DEFAULT '{
        "llm": {"provider": "openai", "model": "gpt-4o-mini", "embeddings": "text-embedding-3-small"},
        "vector": {"provider": "pgvector"},
        "search": {"provider": "none", "freshness_days": 90, "allowlist": []},
        "collab": {"provider": "yjs", "readonly_roles": ["viewer"]}
    }'::jsonb,
    is_active BOOLEAN DEFAULT true,
    resource_usage JSONB DEFAULT '{}',
    billing_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- 5. Provider Configurations
CREATE TABLE public.provider_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    provider_type public.provider_type NOT NULL,
    provider_name TEXT NOT NULL,
    config_data JSONB NOT NULL DEFAULT '{}',
    is_default BOOLEAN DEFAULT false,
    is_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- 6. System Metrics Table
CREATE TABLE public.system_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID REFERENCES public.backend_services(id) ON DELETE CASCADE,
    metric_name TEXT NOT NULL,
    metric_value DECIMAL(10,2) NOT NULL,
    metric_unit TEXT,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'
);

-- 7. Essential Indexes
CREATE INDEX idx_backend_services_status ON public.backend_services(status);
CREATE INDEX idx_backend_services_environment ON public.backend_services(environment);
CREATE INDEX idx_api_endpoints_service_id ON public.api_endpoints(service_id);
CREATE INDEX idx_api_endpoints_method_path ON public.api_endpoints(method, path);
CREATE INDEX idx_tenants_slug ON public.tenants(slug);
CREATE INDEX idx_tenants_active ON public.tenants(is_active);
CREATE INDEX idx_provider_configs_tenant_id ON public.provider_configs(tenant_id);
CREATE INDEX idx_provider_configs_type ON public.provider_configs(provider_type);
CREATE INDEX idx_system_metrics_service_timestamp ON public.system_metrics(service_id, timestamp);
CREATE INDEX idx_system_metrics_timestamp ON public.system_metrics(timestamp);

-- 8. Update Triggers
CREATE TRIGGER update_backend_services_updated_at
    BEFORE UPDATE ON public.backend_services
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_api_endpoints_updated_at
    BEFORE UPDATE ON public.api_endpoints
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tenants_updated_at
    BEFORE UPDATE ON public.tenants
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_provider_configs_updated_at
    BEFORE UPDATE ON public.provider_configs
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 9. Enable RLS
ALTER TABLE public.backend_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_metrics ENABLE ROW LEVEL SECURITY;

-- 10. RLS Policies

-- Helper function for admin role check using existing profiles
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid() AND p.role = 'admin'
)
$$;

-- Backend Services - Admin only
CREATE POLICY "admin_full_access_backend_services"
ON public.backend_services
FOR ALL
TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

-- API Endpoints - Admin only
CREATE POLICY "admin_full_access_api_endpoints"
ON public.api_endpoints
FOR ALL
TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

-- Tenants - Admin and tenant owner access
CREATE POLICY "admin_full_access_tenants"
ON public.tenants
FOR ALL
TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

CREATE POLICY "tenant_owners_manage_own"
ON public.tenants
FOR SELECT
TO authenticated
USING (created_by = auth.uid() OR public.is_admin_user());

-- Provider Configs - Admin and tenant access
CREATE POLICY "admin_full_access_provider_configs"
ON public.provider_configs
FOR ALL
TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

-- System Metrics - Admin read access
CREATE POLICY "admin_read_system_metrics"
ON public.system_metrics
FOR SELECT
TO authenticated
USING (public.is_admin_user());

-- 11. Mock Data for Backend Architecture Management
DO $$
DECLARE
    admin_profile_id UUID;
    main_service_id UUID := gen_random_uuid();
    api_service_id UUID := gen_random_uuid();
    vector_service_id UUID := gen_random_uuid();
    main_tenant_id UUID := gen_random_uuid();
    demo_tenant_id UUID := gen_random_uuid();
BEGIN
    -- Get existing admin profile
    SELECT id INTO admin_profile_id FROM public.profiles WHERE role = 'admin' LIMIT 1;
    
    -- If no admin profile exists, use any existing profile
    IF admin_profile_id IS NULL THEN
        SELECT id INTO admin_profile_id FROM public.profiles LIMIT 1;
    END IF;

    -- Insert Backend Services
    INSERT INTO public.backend_services (id, name, service_type, status, endpoint_url, version, configuration, environment, created_by) VALUES
        (main_service_id, 'FITS API Server', 'api', 'healthy'::public.service_status, 'https://api.fits-ai.com', '1.2.3', '{"cors": ["https://fits-ai.com"], "rate_limit": 1000}'::jsonb, 'production'::public.deployment_environment, admin_profile_id),
        (api_service_id, 'Y-WebSocket Server', 'websocket', 'healthy'::public.service_status, 'wss://yserver.fits-ai.com:1234', '1.0.0', '{"jwt_secret": "configured", "max_connections": 500}'::jsonb, 'production'::public.deployment_environment, admin_profile_id),
        (vector_service_id, 'pgVector Database', 'database', 'healthy'::public.service_status, 'postgres://fits-ai-db', '16.1', '{"extensions": ["vector", "pgcrypto"], "connections": 100}'::jsonb, 'production'::public.deployment_environment, admin_profile_id);

    -- Insert API Endpoints
    INSERT INTO public.api_endpoints (service_id, path, method, description, rate_limit, response_time_ms, success_rate) VALUES
        (main_service_id, '/api/ingest', 'POST', 'Document ingestion endpoint', 50, 1200, 98.5),
        (main_service_id, '/api/chat', 'POST', 'AI chat conversation endpoint', 100, 800, 99.2),
        (main_service_id, '/api/export/pptx', 'POST', 'PowerPoint export endpoint', 20, 2500, 97.8),
        (main_service_id, '/api/collab/token', 'POST', 'Collaboration token generation', 200, 150, 99.8),
        (api_service_id, '/ws/collab', 'GET', 'WebSocket collaboration endpoint', 1000, 50, 99.9);

    -- Insert Tenants
    INSERT INTO public.tenants (id, name, slug, region, plan, provider_config, resource_usage, billing_data, created_by) VALUES
        (main_tenant_id, 'FITS AI Production', 'fits-prod', 'us-east-1', 'enterprise', 
         '{"llm": {"provider": "openai", "model": "gpt-4o-mini"}, "vector": {"provider": "pgvector"}, "search": {"provider": "tavily", "allowlist": ["nist.gov", "ieee.org"]}, "collab": {"provider": "yjs"}}'::jsonb,
         '{"api_calls": 45000, "storage_gb": 120.5, "users": 1250}'::jsonb,
         '{"plan": "enterprise", "monthly_cost": 2500, "usage_cost": 340.50}'::jsonb, admin_profile_id),
        (demo_tenant_id, 'Demo Environment', 'demo', 'us-west-2', 'basic',
         '{"llm": {"provider": "openai", "model": "gpt-4o-mini"}, "vector": {"provider": "pinecone", "index": "demo-embeddings"}, "search": {"provider": "none"}}'::jsonb,
         '{"api_calls": 5000, "storage_gb": 10.2, "users": 45}'::jsonb,
         '{"plan": "basic", "monthly_cost": 99, "usage_cost": 15.20}'::jsonb, admin_profile_id);

    -- Insert Provider Configurations
    INSERT INTO public.provider_configs (tenant_id, provider_type, provider_name, config_data, is_default, created_by) VALUES
        (main_tenant_id, 'vector'::public.provider_type, 'pgvector', '{"dimensions": 1536, "index_type": "ivfflat"}'::jsonb, true, admin_profile_id),
        (main_tenant_id, 'llm'::public.provider_type, 'openai', '{"model": "gpt-4o-mini", "temperature": 0.7, "max_tokens": 4096}'::jsonb, true, admin_profile_id),
        (main_tenant_id, 'search'::public.provider_type, 'tavily', '{"max_snippets": 5, "freshness_days": 30}'::jsonb, true, admin_profile_id),
        (demo_tenant_id, 'vector'::public.provider_type, 'pinecone', '{"index": "demo-embeddings", "namespace": "demo"}'::jsonb, true, admin_profile_id),
        (demo_tenant_id, 'llm'::public.provider_type, 'openai', '{"model": "gpt-4o-mini", "temperature": 0.5}'::jsonb, true, admin_profile_id);

    -- Insert System Metrics
    INSERT INTO public.system_metrics (service_id, metric_name, metric_value, metric_unit, timestamp) VALUES
        (main_service_id, 'cpu_usage', 45.2, 'percent', CURRENT_TIMESTAMP - INTERVAL '5 minutes'),
        (main_service_id, 'memory_usage', 78.5, 'percent', CURRENT_TIMESTAMP - INTERVAL '5 minutes'),
        (main_service_id, 'requests_per_minute', 1250.0, 'count', CURRENT_TIMESTAMP - INTERVAL '5 minutes'),
        (api_service_id, 'active_connections', 234.0, 'count', CURRENT_TIMESTAMP - INTERVAL '5 minutes'),
        (vector_service_id, 'query_response_time', 125.8, 'milliseconds', CURRENT_TIMESTAMP - INTERVAL '5 minutes');

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error in backend architecture setup: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error in backend architecture setup: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error in backend architecture setup: %', SQLERRM;
END $$;