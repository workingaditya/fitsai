# syntax=docker/dockerfile:1.6

# ---- Production stage ----
FROM node:20-alpine AS production
WORKDIR /app

# Install production dependencies only
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --only=production || npm i --only=production

# Copy the entire application
COPY . .

# Build-time environment variables for Vite (optional)
ARG VITE_N8N_WEBHOOK_URL
ARG VITE_N8N_AUTH_HEADER
ARG VITE_N8N_API_KEY
ARG VITE_N8N_TIMEOUT_MS
ARG VITE_N8N_KB_WEBHOOK_URL
ARG VITE_N8N_TICKET_WEBHOOK_URL
ARG VITE_KB_FEED_URL
ARG VITE_CBO_RSS_FEED_URL

# Expose VITE_* vars to the build so Vite embeds them
ENV VITE_N8N_WEBHOOK_URL=$VITE_N8N_WEBHOOK_URL \
    VITE_N8N_AUTH_HEADER=$VITE_N8N_AUTH_HEADER \
    VITE_N8N_API_KEY=$VITE_N8N_API_KEY \
    VITE_N8N_TIMEOUT_MS=$VITE_N8N_TIMEOUT_MS \
    VITE_N8N_KB_WEBHOOK_URL=$VITE_N8N_KB_WEBHOOK_URL \
    VITE_N8N_TICKET_WEBHOOK_URL=$VITE_N8N_TICKET_WEBHOOK_URL \
    VITE_KB_FEED_URL=$VITE_KB_FEED_URL \
    VITE_CBO_RSS_FEED_URL=$VITE_CBO_RSS_FEED_URL

# Install dev dependencies temporarily for build
RUN npm ci || npm i

# Build the frontend
RUN npm run build

# Remove dev dependencies after build
RUN npm prune --production

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Change ownership of the app directory
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port 8080 (Replit deployment port)
EXPOSE 8080

# Start the Express server
CMD ["node", "server/simple-server.js"]

