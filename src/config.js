// Centralized app configuration with sensible defaults.
// Environment variables override these values when provided.

export const appConfig = {
  n8nWebhookUrl:
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_N8N_WEBHOOK_URL) ||
    'https://fitsoman.app.n8n.cloud/webhook-test/4add9b15-366c-4b8d-af9e-1168410ebde9',
  n8nAuthHeader:
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_N8N_AUTH_HEADER) ||
    null,
  n8nApiKey:
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_N8N_API_KEY) ||
    null,
  n8nTimeoutMs: Number(
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_N8N_TIMEOUT_MS) ||
      20000
  ),
  // Optional dedicated KB webhook (for fetching CBO knowledge base articles via n8n)
  n8nKbWebhookUrl:
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_N8N_KB_WEBHOOK_URL) ||
    null,
  // Optional dedicated Help Request webhook (create ticket in n8n/ServiceDesk)
  n8nTicketWebhookUrl:
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_N8N_TICKET_WEBHOOK_URL) ||
    null,
  // Optional direct KB feed URL (if you host a JSON feed somewhere; used only if KB webhook is not set)
  kbFeedUrl:
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_KB_FEED_URL) ||
    null,
  // Optional CBO RSS/Atom feed URL (parsed client-side if CORS allows)
  cboRssFeedUrl:
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CBO_RSS_FEED_URL) ||
    null,
};

export default appConfig;


