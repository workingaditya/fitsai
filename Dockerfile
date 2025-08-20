# syntax=docker/dockerfile:1.6

# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Install deps first (cache-friendly)
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci || npm i

# Copy the rest of the app
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

RUN npm run build

# ---- Runtime stage (non-root, listens on 8080) ----
FROM nginxinc/nginx-unprivileged:stable-alpine
# Copy SPA nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080
# nginx-unprivileged uses UID 101 and listens on 8080 by default
USER 101

