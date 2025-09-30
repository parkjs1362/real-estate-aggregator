# ==================================================
# Next.js 웹 애플리케이션 Dockerfile
# Multi-stage build for production optimization
# ==================================================

# Base image with Node.js LTS
FROM node:18-alpine AS base

# Install dependencies for native modules
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
COPY packages/*/package*.json ./packages/

# ==================================================
# Dependencies stage
# ==================================================
FROM base AS deps

# Install dependencies
RUN npm ci

# ==================================================
# Development stage
# ==================================================
FROM base AS development

# Install all dependencies
RUN npm ci

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

USER nextjs

EXPOSE 3001

ENV PORT 3001
ENV HOSTNAME "0.0.0.0"

# Development command
CMD ["npm", "run", "dev"]

# ==================================================
# Builder stage
# ==================================================
FROM base AS builder

# Install dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED 1

# Build application
RUN npm run build

# ==================================================
# Production stage
# ==================================================
FROM base AS production

# Production environment
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

WORKDIR /app

# Copy built application
COPY --from=builder /app/apps/web/public ./public

# Copy Next.js build output
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./.next/static

USER nextjs

EXPOSE 3001

ENV PORT 3001
ENV HOSTNAME "0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1

# Production command
CMD ["node", "server.js"]