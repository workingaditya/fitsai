-- Location: supabase/migrations/20250815130955_vector_llm_monitoring_enhancement.sql
-- Schema Analysis: FITS AI system has existing backend_services, system_metrics, provider_configs, tenants
-- Integration Type: Addition - Adding vector search and LLM monitoring tables
-- Dependencies: backend_services, tenants, profiles

-- 1. New Enums for Vector and LLM Monitoring
CREATE TYPE public.vector_index_status AS ENUM ('healthy', 'indexing', 'degraded', 'error', 'maintenance');
CREATE TYPE public.embedding_operation_type AS ENUM ('create', 'update', 'delete', 'query', 'bulk_upsert');
CREATE TYPE public.llm_provider AS ENUM ('openai', 'anthropic', 'gemini', 'local', 'azure_openai');
CREATE TYPE public.llm_model_status AS ENUM ('available', 'rate_limited', 'error', 'maintenance', 'deprecated');

-- 2. Vector Search Health Monitoring
CREATE TABLE public.vector_search_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.backend_services(id) ON DELETE SET NULL,
    index_name TEXT NOT NULL,
    namespace TEXT,
    dimensions INTEGER NOT NULL DEFAULT 1536,
    total_vectors BIGINT DEFAULT 0,
    index_status public.vector_index_status DEFAULT 'healthy'::public.vector_index_status,
    fullness_percentage DECIMAL(5,2) DEFAULT 0.00,
    query_latency_ms DECIMAL(10,2),
    similarity_threshold DECIMAL(5,4) DEFAULT 0.8,
    cost_per_query DECIMAL(10,6) DEFAULT 0.000001,
    last_updated TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Embedding Operations Log
CREATE TABLE public.embedding_operations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    vector_metric_id UUID REFERENCES public.vector_search_metrics(id) ON DELETE CASCADE,
    operation_type public.embedding_operation_type NOT NULL,
    document_id UUID,
    vector_id TEXT,
    content_hash TEXT,
    embedding_dimensions INTEGER,
    processing_time_ms INTEGER,
    token_count INTEGER,
    cost DECIMAL(10,6) DEFAULT 0,
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    batch_id UUID,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'
);

-- 4. LLM Usage Analytics
CREATE TABLE public.llm_usage_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.backend_services(id) ON DELETE SET NULL,
    provider public.llm_provider NOT NULL,
    model_name TEXT NOT NULL,
    model_status public.llm_model_status DEFAULT 'available'::public.llm_model_status,
    request_count BIGINT DEFAULT 0,
    total_tokens BIGINT DEFAULT 0,
    prompt_tokens BIGINT DEFAULT 0,
    completion_tokens BIGINT DEFAULT 0,
    avg_response_time_ms DECIMAL(10,2),
    success_rate DECIMAL(5,2) DEFAULT 100.00,
    error_count INTEGER DEFAULT 0,
    rate_limit_hits INTEGER DEFAULT 0,
    total_cost DECIMAL(12,6) DEFAULT 0,
    cost_per_1k_tokens DECIMAL(10,6) DEFAULT 0.002,
    last_request_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'
);

-- 5. LLM Conversation Sessions
CREATE TABLE public.llm_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    llm_metric_id UUID REFERENCES public.llm_usage_metrics(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    user_id UUID,
    conversation_title TEXT,
    model_switched BOOLEAN DEFAULT false,
    context_maintained BOOLEAN DEFAULT true,
    message_count INTEGER DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,
    session_duration_seconds INTEGER,
    satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
    started_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'
);

-- 6. Integration Health Status
CREATE TABLE public.integration_health (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    integration_name TEXT NOT NULL,
    integration_type TEXT NOT NULL,
    status public.service_status DEFAULT 'healthy'::public.service_status,
    endpoint_url TEXT,
    last_check_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    response_time_ms DECIMAL(10,2),
    error_count INTEGER DEFAULT 0,
    uptime_percentage DECIMAL(5,2) DEFAULT 100.00,
    quota_used BIGINT DEFAULT 0,
    quota_limit BIGINT,
    cost_current_month DECIMAL(12,2) DEFAULT 0,
    alerts_enabled BOOLEAN DEFAULT true,
    next_check_at TIMESTAMPTZ DEFAULT (CURRENT_TIMESTAMP + INTERVAL '5 minutes'),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Essential Indexes for Performance
CREATE INDEX idx_vector_search_metrics_tenant_id ON public.vector_search_metrics(tenant_id);
CREATE INDEX idx_vector_search_metrics_status ON public.vector_search_metrics(index_status);
CREATE INDEX idx_vector_search_metrics_updated ON public.vector_search_metrics(last_updated);

CREATE INDEX idx_embedding_operations_tenant_id ON public.embedding_operations(tenant_id);
CREATE INDEX idx_embedding_operations_type ON public.embedding_operations(operation_type);
CREATE INDEX idx_embedding_operations_created ON public.embedding_operations(created_at);
CREATE INDEX idx_embedding_operations_batch ON public.embedding_operations(batch_id);

CREATE INDEX idx_llm_usage_metrics_tenant_id ON public.llm_usage_metrics(tenant_id);
CREATE INDEX idx_llm_usage_metrics_provider ON public.llm_usage_metrics(provider);
CREATE INDEX idx_llm_usage_metrics_model ON public.llm_usage_metrics(model_name);
CREATE INDEX idx_llm_usage_metrics_updated ON public.llm_usage_metrics(updated_at);

CREATE INDEX idx_llm_conversations_tenant_id ON public.llm_conversations(tenant_id);
CREATE INDEX idx_llm_conversations_session ON public.llm_conversations(session_id);
CREATE INDEX idx_llm_conversations_started ON public.llm_conversations(started_at);

CREATE INDEX idx_integration_health_tenant_id ON public.integration_health(tenant_id);
CREATE INDEX idx_integration_health_type ON public.integration_health(integration_type);
CREATE INDEX idx_integration_health_status ON public.integration_health(status);
CREATE INDEX idx_integration_health_check ON public.integration_health(last_check_at);

-- 8. Enable RLS for all new tables
ALTER TABLE public.vector_search_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.embedding_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.llm_usage_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.llm_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_health ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies using existing functions
CREATE POLICY "admin_full_access_vector_search_metrics"
ON public.vector_search_metrics
FOR ALL
TO authenticated
USING (is_admin_user())
WITH CHECK (is_admin_user());

CREATE POLICY "admin_full_access_embedding_operations"
ON public.embedding_operations
FOR ALL
TO authenticated
USING (is_admin_user())
WITH CHECK (is_admin_user());

CREATE POLICY "admin_full_access_llm_usage_metrics"
ON public.llm_usage_metrics
FOR ALL
TO authenticated
USING (is_admin_user())
WITH CHECK (is_admin_user());

CREATE POLICY "admin_full_access_llm_conversations"
ON public.llm_conversations
FOR ALL
TO authenticated
USING (is_admin_user())
WITH CHECK (is_admin_user());

CREATE POLICY "admin_full_access_integration_health"
ON public.integration_health
FOR ALL
TO authenticated
USING (is_admin_user())
WITH CHECK (is_admin_user());

-- 10. Update triggers for timestamp columns
CREATE TRIGGER update_llm_usage_metrics_updated_at
    BEFORE UPDATE ON public.llm_usage_metrics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integration_health_updated_at
    BEFORE UPDATE ON public.integration_health
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 11. Mock Data for Testing and Demo
DO $$
DECLARE
    fits_tenant_id UUID;
    demo_tenant_id UUID;
    api_service_id UUID;
    yjs_service_id UUID;
BEGIN
    -- Get existing tenant and service IDs
    SELECT id INTO fits_tenant_id FROM public.tenants WHERE slug = 'fits-prod' LIMIT 1;
    SELECT id INTO demo_tenant_id FROM public.tenants WHERE slug = 'demo' LIMIT 1;
    SELECT id INTO api_service_id FROM public.backend_services WHERE name = 'FITS API Server' LIMIT 1;
    SELECT id INTO yjs_service_id FROM public.backend_services WHERE name = 'Y-WebSocket Server' LIMIT 1;

    -- Vector Search Metrics
    INSERT INTO public.vector_search_metrics (
        tenant_id, service_id, index_name, namespace, dimensions, total_vectors,
        index_status, fullness_percentage, query_latency_ms, cost_per_query, metadata
    ) VALUES
        (fits_tenant_id, api_service_id, 'fits-knowledge-index', 'production', 1536, 125000,
         'healthy'::public.vector_index_status, 78.50, 45.2, 0.000002,
         '{"provider": "pinecone", "replicas": 3, "shards": 2}'::jsonb),
        (demo_tenant_id, api_service_id, 'demo-vectors', 'demo', 1536, 5000,
         'healthy'::public.vector_index_status, 12.30, 38.7, 0.000001,
         '{"provider": "pgvector", "index_type": "ivfflat"}'::jsonb);

    -- Embedding Operations Log
    INSERT INTO public.embedding_operations (
        tenant_id, vector_metric_id, operation_type, processing_time_ms, token_count, cost, success
    ) VALUES
        (fits_tenant_id, (SELECT id FROM public.vector_search_metrics WHERE index_name = 'fits-knowledge-index'),
         'create'::public.embedding_operation_type, 250, 512, 0.00102, true),
        (fits_tenant_id, (SELECT id FROM public.vector_search_metrics WHERE index_name = 'fits-knowledge-index'),
         'query'::public.embedding_operation_type, 45, 128, 0.000256, true);

    -- LLM Usage Metrics
    INSERT INTO public.llm_usage_metrics (
        tenant_id, service_id, provider, model_name, request_count, total_tokens,
        prompt_tokens, completion_tokens, avg_response_time_ms, success_rate, total_cost
    ) VALUES
        (fits_tenant_id, api_service_id, 'openai'::public.llm_provider, 'gpt-4o-mini',
         15420, 2850000, 1650000, 1200000, 850.5, 99.2, 285.50),
        (demo_tenant_id, api_service_id, 'gemini'::public.llm_provider, 'gemini-1.5-pro',
         3200, 580000, 320000, 260000, 920.3, 98.8, 58.40);

    -- LLM Conversations
    INSERT INTO public.llm_conversations (
        tenant_id, llm_metric_id, session_id, message_count, total_tokens, 
        session_duration_seconds, satisfaction_rating
    ) VALUES
        (fits_tenant_id, (SELECT id FROM public.llm_usage_metrics WHERE model_name = 'gpt-4o-mini'),
         'session_' || gen_random_uuid(), 25, 4200, 1850, 5),
        (demo_tenant_id, (SELECT id FROM public.llm_usage_metrics WHERE model_name = 'gemini-1.5-pro'),
         'session_' || gen_random_uuid(), 12, 2100, 920, 4);

    -- Integration Health Status
    INSERT INTO public.integration_health (
        tenant_id, integration_name, integration_type, status, endpoint_url,
        response_time_ms, uptime_percentage, quota_used, quota_limit, cost_current_month
    ) VALUES
        (fits_tenant_id, 'Pinecone Vector DB', 'vector', 'healthy'::public.service_status,
         'https://api.pinecone.io', 125.3, 99.95, 1250000, 5000000, 245.80),
        (fits_tenant_id, 'OpenAI API', 'llm', 'healthy'::public.service_status,
         'https://api.openai.com', 680.2, 99.8, 2850000, 10000000, 285.50),
        (demo_tenant_id, 'pgVector', 'vector', 'healthy'::public.service_status,
         'postgresql://localhost:5432', 25.1, 100.0, 0, null, 0);
END $$;