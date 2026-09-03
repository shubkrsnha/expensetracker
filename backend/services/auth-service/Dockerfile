# ================================
# Stage 1: Builder
# ================================
FROM node:24-alpine AS builder

WORKDIR /app

# Copy dependency manifests first
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy application source
COPY app.js ./
COPY server.js ./
COPY config ./config
COPY controllers ./controllers
COPY middleware ./middleware
COPY models ./models
COPY routes ./routes
COPY services ./services
COPY swagger ./swagger


# ================================
# Stage 2: Runtime
# ================================
FROM node:24-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

# Update Alpine OS packages
RUN apk update && \
    apk upgrade --no-cache && \
    apk add --no-cache --upgrade libcrypto3 libssl3

# npm is required only during the build stage.
# The production application runs with Node.js directly.
# Removing npm also removes vulnerabilities from npm's bundled packages.
RUN rm -rf /usr/local/lib/node_modules/npm

# Create non-root user
RUN addgroup -S nodejs && \
    adduser -S nodejs -G nodejs

# Copy only required application files
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/app.js ./app.js
COPY --from=builder --chown=nodejs:nodejs /app/server.js ./server.js
COPY --from=builder --chown=nodejs:nodejs /app/config ./config
COPY --from=builder --chown=nodejs:nodejs /app/controllers ./controllers
COPY --from=builder --chown=nodejs:nodejs /app/middleware ./middleware
COPY --from=builder --chown=nodejs:nodejs /app/models ./models
COPY --from=builder --chown=nodejs:nodejs /app/routes ./routes
COPY --from=builder --chown=nodejs:nodejs /app/services ./services
COPY --from=builder --chown=nodejs:nodejs /app/swagger ./swagger

USER nodejs

EXPOSE 5004

CMD ["node", "server.js"]