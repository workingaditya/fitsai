-- Location: supabase/migrations/20250815101745_collaboration_sync_management.sql
-- Schema Analysis: Documents, document_versions, profiles, user_roles exist
-- Integration Type: Addition - extending existing document management
-- Dependencies: documents, document_versions, profiles tables

-- 1. CREATE TYPES FOR COLLABORATION STATUS
CREATE TYPE public.collaboration_status AS ENUM ('active', 'paused', 'completed', 'error');
CREATE TYPE public.sync_conflict_type AS ENUM ('concurrent_edit', 'version_mismatch', 'permission_denied', 'network_error');
CREATE TYPE public.participant_role AS ENUM ('owner', 'editor', 'viewer', 'reviewer');

-- 2. COLLABORATION SESSIONS TABLE
CREATE TABLE public.collaboration_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    session_name TEXT NOT NULL,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status public.collaboration_status DEFAULT 'active'::public.collaboration_status,
    started_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMPTZ,
    max_participants INTEGER DEFAULT 10,
    websocket_room_id TEXT,
    session_config JSONB DEFAULT '{}'::jsonb,
    performance_metrics JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. SESSION PARTICIPANTS TABLE
CREATE TABLE public.session_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.collaboration_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role public.participant_role DEFAULT 'viewer'::public.participant_role,
    joined_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    cursor_position JSONB DEFAULT '{}'::jsonb,
    last_activity_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    connection_info JSONB DEFAULT '{}'::jsonb,
    UNIQUE(session_id, user_id)
);

-- 4. SYNC CONFLICTS TABLE
CREATE TABLE public.sync_conflicts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.collaboration_sessions(id) ON DELETE CASCADE,
    document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    conflict_type public.sync_conflict_type NOT NULL,
    user1_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user2_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    conflict_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    resolution_strategy TEXT,
    resolved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    resolved_at TIMESTAMPTZ,
    is_resolved BOOLEAN DEFAULT false,
    priority INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. SESSION ANALYTICS TABLE
CREATE TABLE public.session_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.collaboration_sessions(id) ON DELETE CASCADE,
    metric_name TEXT NOT NULL,
    metric_value DECIMAL(10,4),
    metric_data JSONB DEFAULT '{}'::jsonb,
    recorded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    time_window TEXT DEFAULT '1h'
);

-- 6. ESSENTIAL INDEXES
CREATE INDEX idx_collaboration_sessions_document_id ON public.collaboration_sessions(document_id);
CREATE INDEX idx_collaboration_sessions_created_by ON public.collaboration_sessions(created_by);
CREATE INDEX idx_collaboration_sessions_status ON public.collaboration_sessions(status);
CREATE INDEX idx_session_participants_session_id ON public.session_participants(session_id);
CREATE INDEX idx_session_participants_user_id ON public.session_participants(user_id);
CREATE INDEX idx_session_participants_active ON public.session_participants(is_active);
CREATE INDEX idx_sync_conflicts_session_id ON public.sync_conflicts(session_id);
CREATE INDEX idx_sync_conflicts_resolved ON public.sync_conflicts(is_resolved);
CREATE INDEX idx_session_analytics_session_id ON public.session_analytics(session_id);

-- 7. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.collaboration_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_conflicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_analytics ENABLE ROW LEVEL SECURITY;

-- 8. CREATE HELPER FUNCTIONS BEFORE RLS POLICIES
CREATE OR REPLACE FUNCTION public.is_session_participant(session_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.session_participants sp
    WHERE sp.session_id = session_uuid 
    AND sp.user_id = auth.uid()
    AND sp.is_active = true
)
$$;

CREATE OR REPLACE FUNCTION public.can_view_session_analytics(session_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.collaboration_sessions cs
    WHERE cs.id = session_uuid 
    AND (cs.created_by = auth.uid() OR public.is_session_participant(session_uuid))
)
$$;

-- 9. RLS POLICIES USING APPROVED PATTERNS

-- Pattern 2: Simple User Ownership for collaboration_sessions
CREATE POLICY "users_manage_own_collaboration_sessions"
ON public.collaboration_sessions
FOR ALL
TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

-- Pattern 7: Complex Relationships for session_participants (allows session owners + participants)
CREATE POLICY "participants_and_owners_access_session_participants"
ON public.session_participants
FOR SELECT
TO authenticated
USING (
    user_id = auth.uid() OR 
    public.is_session_participant(session_id) OR
    EXISTS (
        SELECT 1 FROM public.collaboration_sessions cs 
        WHERE cs.id = session_id AND cs.created_by = auth.uid()
    )
);

CREATE POLICY "session_owners_manage_participants"
ON public.session_participants
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.collaboration_sessions cs 
        WHERE cs.id = session_id AND cs.created_by = auth.uid()
    )
);

-- Pattern 7: Complex access for sync_conflicts (session participants can view)
CREATE POLICY "session_participants_view_sync_conflicts"
ON public.sync_conflicts
FOR SELECT
TO authenticated
USING (public.is_session_participant(session_id));

CREATE POLICY "session_owners_manage_sync_conflicts"
ON public.sync_conflicts
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.collaboration_sessions cs 
        WHERE cs.id = session_id AND cs.created_by = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.collaboration_sessions cs 
        WHERE cs.id = session_id AND cs.created_by = auth.uid()
    )
);

-- Pattern 7: Complex access for session_analytics
CREATE POLICY "authorized_users_view_session_analytics"
ON public.session_analytics
FOR SELECT
TO authenticated
USING (public.can_view_session_analytics(session_id));

-- 10. UPDATE TRIGGERS
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_collaboration_sessions_updated_at
    BEFORE UPDATE ON public.collaboration_sessions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sync_conflicts_updated_at
    BEFORE UPDATE ON public.sync_conflicts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 11. REALTIME PUBLICATION
ALTER PUBLICATION supabase_realtime ADD TABLE public.collaboration_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.session_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sync_conflicts;

-- 12. MOCK DATA
DO $$
DECLARE
    existing_user_id UUID;
    existing_document_id UUID;
    session_id UUID := gen_random_uuid();
    conflict_id UUID := gen_random_uuid();
BEGIN
    -- Get existing user and document IDs
    SELECT id INTO existing_user_id FROM public.profiles LIMIT 1;
    SELECT id INTO existing_document_id FROM public.documents LIMIT 1;
    
    IF existing_user_id IS NOT NULL AND existing_document_id IS NOT NULL THEN
        -- Create collaboration session
        INSERT INTO public.collaboration_sessions (id, document_id, session_name, created_by, status, websocket_room_id, session_config, performance_metrics)
        VALUES (
            session_id,
            existing_document_id,
            'Website Redesign Review Session',
            existing_user_id,
            'active'::public.collaboration_status,
            'room_' || session_id::text,
            '{"auto_save": true, "conflict_resolution": "manual", "max_idle_time": 3600}'::jsonb,
            '{"avg_response_time": 120, "total_edits": 45, "concurrent_users": 3}'::jsonb
        );

        -- Add session participant
        INSERT INTO public.session_participants (session_id, user_id, role, cursor_position, connection_info)
        VALUES (
            session_id,
            existing_user_id,
            'owner'::public.participant_role,
            '{"line": 15, "column": 23, "selection": {"start": 15, "end": 27}}'::jsonb,
            '{"ip": "192.168.1.10", "browser": "Chrome", "os": "Windows"}'::jsonb
        );

        -- Create sync conflict
        INSERT INTO public.sync_conflicts (id, session_id, document_id, conflict_type, user1_id, conflict_data, priority)
        VALUES (
            conflict_id,
            session_id,
            existing_document_id,
            'concurrent_edit'::public.sync_conflict_type,
            existing_user_id,
            '{"conflicting_changes": [{"line": 25, "old_text": "Original text", "new_text": "Modified text", "timestamp": "2025-01-15T10:15:30Z"}], "resolution_options": ["accept_local", "accept_remote", "merge_manual"]}'::jsonb,
            2
        );

        -- Add analytics data
        INSERT INTO public.session_analytics (session_id, metric_name, metric_value, metric_data)
        VALUES 
            (session_id, 'response_time_ms', 125.50, '{"percentiles": {"p50": 120, "p95": 180, "p99": 250}}'::jsonb),
            (session_id, 'concurrent_users', 3.0, '{"peak": 5, "average": 2.8}'::jsonb),
            (session_id, 'edit_conflicts_per_hour', 1.2, '{"resolved": 4, "pending": 1}'::jsonb);
    ELSE
        RAISE NOTICE 'No existing users or documents found. Please ensure profiles and documents tables have data.';
    END IF;
EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key constraint violated: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Error creating mock data: %', SQLERRM;
END $$;