# ================================
# Stage 1: Builder
# ================================
FROM node:24-alpine AS builder

WORKDIR /app

# Copy dependency manifests first for better layer caching
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy application source
COPY controllers ./controllers
COPY middleware ./middleware
COPY routes ./routes
COPY services ./services
COPY app.js ./
COPY server.js ./


# ================================
# Stage 2: Runtime
# ================================
FROM node:24-alpine AS runtime

WORKDIR /app

# Security: run as non-root user
RUN addgroup -S nodeapp && \
    adduser -S nodeapp -G nodeapp

# Copy only production dependencies and application
COPY --from=builder --chown=nodeapp:nodeapp /app/node_modules ./node_modules
COPY --from=builder --chown=nodeapp:nodeapp /app/controllers ./controllers
COPY --from=builder --chown=nodeapp:nodeapp /app/middleware ./middleware
COPY --from=builder --chown=nodeapp:nodeapp /app/routes ./routes
COPY --from=builder --chown=nodeapp:nodeapp /app/services ./services
COPY --from=builder --chown=nodeapp:nodeapp /app/app.js ./app.js
COPY --from=builder --chown=nodeapp:nodeapp /app/server.js ./server.js
COPY --from=builder --chown=nodeapp:nodeapp /app/package.json ./package.json

USER nodeapp

EXPOSE 5002

CMD ["node", "server.js"]