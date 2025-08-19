/**
 * n8n Service - Sends chat messages to an n8n webhook and returns the reply
 * Configure the endpoint via VITE_N8N_WEBHOOK_URL and optional VITE_N8N_AUTH_HEADER / VITE_N8N_API_KEY
 */

/**
 * Extracts a human-readable reply and optional suggestions from diverse n8n responses
 * @param {any} data - Parsed response (JSON or text)
 * @returns {{ content: string, suggestions?: string[] }}
 */
function extractReply(data) {
  try {
    // If response is plain text
    if (typeof data === 'string') {
      return { content: data };
    }

    // If response is an array, join string values or stringify objects
    if (Array.isArray(data)) {
      // Try to extract from common fields in any array item (including n8n item shapes)
      const fields = ['output', 'reply', 'response', 'message', 'text', 'answer', 'content'];
      for (const item of data) {
        if (typeof item === 'string' && item?.trim()) {
          return { content: item };
        }
        if (item && typeof item === 'object') {
          for (const f of fields) {
            const direct = item?.[f];
            if (typeof direct === 'string' && direct?.trim()) {
              return { content: direct, suggestions: Array.isArray(item?.suggestions) ? item?.suggestions : undefined };
            }
            const jsonVal = item?.json?.[f];
            if (typeof jsonVal === 'string' && jsonVal?.trim()) {
              return { content: jsonVal, suggestions: Array.isArray(item?.json?.suggestions) ? item?.json?.suggestions : undefined };
            }
          }
        }
      }
      // Fallback: stringify
      const joined = data?.map((item) => (typeof item === 'string' ? item : JSON.stringify(item)))?.join('\n');
      return { content: joined };
    }

    // Common fields used by webhook workflows
    const possibleFields = [
      'reply',
      'response',
      'message',
      'text',
      'answer',
      'content',
      'output',
    ];

    for (const field of possibleFields) {
      const value = data?.[field];
      if (typeof value === 'string' && value?.trim()) {
        return { content: value };
      }
    }

    // Support OpenAI-like shapes
    const openAIContent = data?.choices?.[0]?.message?.content;
    if (typeof openAIContent === 'string' && openAIContent?.trim()) {
      return { content: openAIContent };
    }

    // Suggestions if provided
    const suggestions = Array.isArray(data?.suggestions) ? data?.suggestions : undefined;

    // Fallback: stringify the entire object
    return { content: JSON.stringify(data, null, 2), suggestions };
  } catch (error) {
    return { content: 'Unable to parse response from n8n.' };
  }
}

/**
 * Sends a chat message to the configured n8n webhook
 * @param {Object} params
 * @param {string} params.message - User's message to the chatbot
 * @param {string} [params.userId] - Authenticated user id (optional)
 * @param {string} [params.conversationId] - Current conversation id (optional)
 * @param {string} [params.sessionId] - Client/session identifier (optional but recommended)
 * @param {Object} [params.userProfile] - Optional user profile context
 * @param {AbortSignal} [params.signal] - Optional AbortController signal for cancelation
 * @returns {Promise<{ content: string, suggestions?: string[], raw?: any }>}
 */
import { appConfig } from '../config';

export async function sendChatToN8n({ message, userId, conversationId, sessionId, userProfile, signal }) {
  const url = appConfig?.n8nWebhookUrl || import.meta.env?.VITE_N8N_WEBHOOK_URL;
  if (!url) {
    throw new Error('N8n webhook URL is not configured. Please set VITE_N8N_WEBHOOK_URL in your .env file.');
  }

  const headers = {
    'Content-Type': 'application/json',
  };

  // Optional Authorization header (e.g., "Bearer <token>" or custom)
  const authHeader = appConfig?.n8nAuthHeader || import.meta.env?.VITE_N8N_AUTH_HEADER;
  if (authHeader) {
    headers['Authorization'] = authHeader;
  }

  // Optional API key header for n8n
  const apiKey = appConfig?.n8nApiKey || import.meta.env?.VITE_N8N_API_KEY;
  if (apiKey) {
    headers['x-api-key'] = apiKey;
  }

  const payload = {
    message,
    user: {
      id: userId || null,
      displayName: userProfile?.display_name || userProfile?.full_name || null,
      role: userProfile?.role || null,
    },
    conversationId: conversationId || null,
    sessionId: sessionId || null,
    source: 'employee_chat_support',
    ts: new Date()?.toISOString(),
  };

  const timeoutMs = Number(appConfig?.n8nTimeoutMs || import.meta.env?.VITE_N8N_TIMEOUT_MS || 20000);

  // Local timeout in addition to AbortSignal if provided
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('n8n request timed out')), timeoutMs);
  });

  try {
    const response = await Promise.race([
      fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        mode: 'cors',
        signal,
      }),
      timeoutPromise,
    ]);

    if (!response?.ok) {
      const text = await response?.text?.();
      throw new Error(`n8n webhook error ${response?.status}: ${text || response?.statusText}`);
    }

    const contentType = response?.headers?.get?.('content-type') || '';
    let parsed;
    if (contentType?.includes('application/json')) {
      parsed = await response?.json?.();
    } else {
      parsed = await response?.text?.();
    }

    const { content, suggestions } = extractReply(parsed);
    return { content: content || 'No reply received from n8n.', suggestions, raw: parsed };
  } finally {
    clearTimeout(timeoutId);
  }
}


