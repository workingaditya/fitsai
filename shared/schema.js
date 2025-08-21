import { pgTable, uuid, text, timestamp, boolean, pgEnum, integer, decimal, bigint, jsonb, serial, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const appRole = pgEnum('app_role', ['admin', 'sme', 'viewer', 'editor']);
export const serviceStatus = pgEnum('service_status', ['healthy', 'degraded', 'down', 'maintenance']);
export const providerType = pgEnum('provider_type', ['vector', 'llm', 'search', 'collab', 'database']);
export const deploymentEnvironment = pgEnum('deployment_environment', ['development', 'staging', 'production']);
export const collaborationStatus = pgEnum('collaboration_status', ['active', 'paused', 'completed', 'error']);
export const syncConflictType = pgEnum('sync_conflict_type', ['concurrent_edit', 'version_mismatch', 'permission_denied', 'network_error']);
export const participantRole = pgEnum('participant_role', ['owner', 'editor', 'viewer', 'reviewer']);
export const vectorIndexStatus = pgEnum('vector_index_status', ['healthy', 'indexing', 'degraded', 'error', 'maintenance']);
export const embeddingOperationType = pgEnum('embedding_operation_type', ['create', 'update', 'delete', 'query', 'bulk_upsert']);
export const llmProvider = pgEnum('llm_provider', ['openai', 'anthropic', 'gemini', 'local', 'azure_openai']);
export const llmModelStatus = pgEnum('llm_model_status', ['available', 'rate_limited', 'error', 'maintenance', 'deprecated']);

// Core tables
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').unique().notNull(),
  displayName: text('display_name'),
  role: appRole('role').default('viewer'),
  department: text('department'),
  languagePreference: text('language_preference').default('en'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const userRoles = pgTable('user_roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  role: appRole('role').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  parentId: uuid('parent_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  content: text('content'),
  categoryId: uuid('category_id'),
  createdBy: uuid('created_by'),
  isPublished: boolean('is_published').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const documentVersions = pgTable('document_versions', {
  id: uuid('id').primaryKey().defaultRandom(),
  documentId: uuid('document_id').notNull(),
  version: integer('version').notNull(),
  title: text('title').notNull(),
  content: text('content'),
  createdBy: uuid('created_by'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id'),
  action: text('action').notNull(),
  resourceType: text('resource_type'),
  resourceId: uuid('resource_id'),
  details: jsonb('details').default('{}'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Backend services
export const backendServices = pgTable('backend_services', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  serviceType: text('service_type').notNull(),
  status: serviceStatus('status').default('healthy'),
  endpointUrl: text('endpoint_url'),
  version: text('version'),
  lastHealthCheck: timestamp('last_health_check'),
  configuration: jsonb('configuration').default('{}'),
  environment: deploymentEnvironment('environment').default('development'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  createdBy: uuid('created_by'),
});

export const apiEndpoints = pgTable('api_endpoints', {
  id: uuid('id').primaryKey().defaultRandom(),
  serviceId: uuid('service_id').notNull(),
  path: text('path').notNull(),
  method: text('method').notNull(),
  description: text('description'),
  isEnabled: boolean('is_enabled').default(true),
  rateLimit: integer('rate_limit').default(100),
  requiresAuth: boolean('requires_auth').default(true),
  lastTested: timestamp('last_tested'),
  responseTimeMs: integer('response_time_ms'),
  successRate: decimal('success_rate', { precision: 5, scale: 2 }).default('100.00'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const tenants = pgTable('tenants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  region: text('region').default('us-east-1'),
  plan: text('plan').default('basic'),
  providerConfig: jsonb('provider_config').default('{}'),
  isActive: boolean('is_active').default(true),
  resourceUsage: jsonb('resource_usage').default('{}'),
  billingData: jsonb('billing_data').default('{}'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  createdBy: uuid('created_by'),
});

export const providerConfigs = pgTable('provider_configs', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull(),
  providerType: providerType('provider_type').notNull(),
  providerName: text('provider_name').notNull(),
  configData: jsonb('config_data').notNull().default('{}'),
  isDefault: boolean('is_default').default(false),
  isEnabled: boolean('is_enabled').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  createdBy: uuid('created_by'),
});

export const systemMetrics = pgTable('system_metrics', {
  id: uuid('id').primaryKey().defaultRandom(),
  serviceId: uuid('service_id').notNull(),
  metricName: text('metric_name').notNull(),
  metricValue: decimal('metric_value', { precision: 10, scale: 2 }).notNull(),
  metricUnit: text('metric_unit'),
  timestamp: timestamp('timestamp').defaultNow(),
  metadata: jsonb('metadata').default('{}'),
});

// Collaboration tables
export const collaborationSessions = pgTable('collaboration_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  documentId: uuid('document_id').notNull(),
  sessionName: text('session_name').notNull(),
  createdBy: uuid('created_by').notNull(),
  status: collaborationStatus('status').default('active'),
  startedAt: timestamp('started_at').defaultNow(),
  endedAt: timestamp('ended_at'),
  maxParticipants: integer('max_participants').default(10),
  websocketRoomId: text('websocket_room_id'),
  sessionConfig: jsonb('session_config').default('{}'),
  performanceMetrics: jsonb('performance_metrics').default('{}'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const sessionParticipants = pgTable('session_participants', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').notNull(),
  userId: uuid('user_id').notNull(),
  role: participantRole('role').default('viewer'),
  joinedAt: timestamp('joined_at').defaultNow(),
  leftAt: timestamp('left_at'),
  isActive: boolean('is_active').default(true),
  cursorPosition: jsonb('cursor_position').default('{}'),
  lastActivityAt: timestamp('last_activity_at').defaultNow(),
  connectionInfo: jsonb('connection_info').default('{}'),
});

export const syncConflicts = pgTable('sync_conflicts', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').notNull(),
  documentId: uuid('document_id').notNull(),
  conflictType: syncConflictType('conflict_type').notNull(),
  user1Id: uuid('user1_id'),
  user2Id: uuid('user2_id'),
  conflictData: jsonb('conflict_data').notNull().default('{}'),
  resolutionStrategy: text('resolution_strategy'),
  resolvedBy: uuid('resolved_by'),
  resolvedAt: timestamp('resolved_at'),
  isResolved: boolean('is_resolved').default(false),
  priority: integer('priority').default(1),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const sessionAnalytics = pgTable('session_analytics', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').notNull(),
  metricName: text('metric_name').notNull(),
  metricValue: decimal('metric_value', { precision: 10, scale: 4 }),
  metricData: jsonb('metric_data').default('{}'),
  recordedAt: timestamp('recorded_at').defaultNow(),
  timeWindow: text('time_window').default('1h'),
});

// Vector and LLM monitoring tables
export const vectorSearchMetrics = pgTable('vector_search_metrics', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id'),
  serviceId: uuid('service_id'),
  indexName: text('index_name').notNull(),
  namespace: text('namespace'),
  dimensions: integer('dimensions').notNull().default(1536),
  totalVectors: bigint('total_vectors', { mode: 'number' }).default(0),
  indexStatus: vectorIndexStatus('index_status').default('healthy'),
  fullnessPercentage: decimal('fullness_percentage', { precision: 5, scale: 2 }).default('0.00'),
  queryLatencyMs: decimal('query_latency_ms', { precision: 10, scale: 2 }),
  similarityThreshold: decimal('similarity_threshold', { precision: 5, scale: 4 }).default('0.8'),
  costPerQuery: decimal('cost_per_query', { precision: 10, scale: 6 }).default('0.000001'),
  lastUpdated: timestamp('last_updated').defaultNow(),
  metadata: jsonb('metadata').default('{}'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const embeddingOperations = pgTable('embedding_operations', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id'),
  vectorMetricId: uuid('vector_metric_id'),
  operationType: embeddingOperationType('operation_type').notNull(),
  documentId: uuid('document_id'),
  vectorId: text('vector_id'),
  contentHash: text('content_hash'),
  embeddingDimensions: integer('embedding_dimensions'),
  processingTimeMs: integer('processing_time_ms'),
  tokenCount: integer('token_count'),
  cost: decimal('cost', { precision: 10, scale: 6 }).default('0'),
  success: boolean('success').default(true),
  errorMessage: text('error_message'),
  batchId: uuid('batch_id'),
  createdAt: timestamp('created_at').defaultNow(),
  metadata: jsonb('metadata').default('{}'),
});

export const llmUsageMetrics = pgTable('llm_usage_metrics', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id'),
  serviceId: uuid('service_id'),
  provider: llmProvider('provider').notNull(),
  modelName: text('model_name').notNull(),
  modelStatus: llmModelStatus('model_status').default('available'),
  requestCount: bigint('request_count', { mode: 'number' }).default(0),
  totalTokens: bigint('total_tokens', { mode: 'number' }).default(0),
  promptTokens: bigint('prompt_tokens', { mode: 'number' }).default(0),
  completionTokens: bigint('completion_tokens', { mode: 'number' }).default(0),
  avgResponseTimeMs: decimal('avg_response_time_ms', { precision: 10, scale: 2 }),
  successRate: decimal('success_rate', { precision: 5, scale: 2 }).default('100.00'),
  errorCount: integer('error_count').default(0),
  rateLimitHits: integer('rate_limit_hits').default(0),
  totalCost: decimal('total_cost', { precision: 12, scale: 6 }).default('0'),
  costPer1kTokens: decimal('cost_per_1k_tokens', { precision: 10, scale: 6 }).default('0.002'),
  lastRequestAt: timestamp('last_request_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  metadata: jsonb('metadata').default('{}'),
});

export const llmConversations = pgTable('llm_conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id'),
  llmMetricId: uuid('llm_metric_id'),
  sessionId: text('session_id').notNull(),
  userId: uuid('user_id'),
  conversationTitle: text('conversation_title'),
  modelSwitched: boolean('model_switched').default(false),
  contextMaintained: boolean('context_maintained').default(true),
  messageCount: integer('message_count').default(0),
  totalTokens: integer('total_tokens').default(0),
  sessionDurationSeconds: integer('session_duration_seconds'),
  satisfactionRating: integer('satisfaction_rating'),
  startedAt: timestamp('started_at').defaultNow(),
  endedAt: timestamp('ended_at'),
  metadata: jsonb('metadata').default('{}'),
});

export const integrationHealth = pgTable('integration_health', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id'),
  integrationName: text('integration_name').notNull(),
  integrationType: text('integration_type').notNull(),
  status: serviceStatus('status').default('healthy'),
  endpointUrl: text('endpoint_url'),
  lastCheckAt: timestamp('last_check_at').defaultNow(),
  responseTimeMs: decimal('response_time_ms', { precision: 10, scale: 2 }),
  errorCount: integer('error_count').default(0),
  uptimePercentage: decimal('uptime_percentage', { precision: 5, scale: 2 }).default('100.00'),
  quotaUsed: bigint('quota_used', { mode: 'number' }).default(0),
  quotaLimit: bigint('quota_limit', { mode: 'number' }),
  costCurrentMonth: decimal('cost_current_month', { precision: 12, scale: 2 }).default('0'),
  alertsEnabled: boolean('alerts_enabled').default(true),
  nextCheckAt: timestamp('next_check_at'),
  metadata: jsonb('metadata').default('{}'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const profilesRelations = relations(profiles, ({ many }) => ({
  userRoles: many(userRoles),
  documents: many(documents),
  auditLogs: many(auditLogs),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  profile: one(profiles, {
    fields: [userRoles.userId],
    references: [profiles.userId],
  }),
}));

export const documentsRelations = relations(documents, ({ one, many }) => ({
  category: one(categories, {
    fields: [documents.categoryId],
    references: [categories.id],
  }),
  creator: one(profiles, {
    fields: [documents.createdBy],
    references: [profiles.id],
  }),
  versions: many(documentVersions),
  collaborationSessions: many(collaborationSessions),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
  }),
  children: many(categories),
  documents: many(documents),
}));

export const backendServicesRelations = relations(backendServices, ({ one, many }) => ({
  creator: one(profiles, {
    fields: [backendServices.createdBy],
    references: [profiles.id],
  }),
  apiEndpoints: many(apiEndpoints),
  systemMetrics: many(systemMetrics),
}));

export const tenantsRelations = relations(tenants, ({ one, many }) => ({
  creator: one(profiles, {
    fields: [tenants.createdBy],
    references: [profiles.id],
  }),
  providerConfigs: many(providerConfigs),
  vectorSearchMetrics: many(vectorSearchMetrics),
  llmUsageMetrics: many(llmUsageMetrics),
}));

export const collaborationSessionsRelations = relations(collaborationSessions, ({ one, many }) => ({
  document: one(documents, {
    fields: [collaborationSessions.documentId],
    references: [documents.id],
  }),
  creator: one(profiles, {
    fields: [collaborationSessions.createdBy],
    references: [profiles.id],
  }),
  participants: many(sessionParticipants),
  conflicts: many(syncConflicts),
  analytics: many(sessionAnalytics),
}));

// Note: Types are not available in JavaScript, would need TypeScript for type inference