# Stage 1: Build the Astro static site
FROM node:22-alpine AS builder

WORKDIR /app

# Enable corepack and install pnpm
RUN corepack enable && corepack prepare pnpm@12.15.0 --activate

# Copy package manifests and config
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* .npmrc* ./

# Install dependencies (respecting pnpm lockfile)
RUN pnpm install --frozen-lockfile

# Copy project source code
COPY . .

# Build production static bundle
ENV ASTRO_TELEMETRY_DISABLED=1
RUN pnpm build

# Stage 2: Serve with lightweight Nginx
FROM nginx:1.27-alpine AS runner

# Install curl or wget for healthcheck
RUN apk add --no-cache curl

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Healthcheck configuration
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
