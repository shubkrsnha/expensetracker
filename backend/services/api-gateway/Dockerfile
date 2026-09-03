# ==========================================
# Stage 1: Builder
# ==========================================
FROM node:24-alpine AS builder

WORKDIR /app

# Update Alpine security packages
RUN apk update && \
    apk upgrade --no-cache

# Copy dependency files
COPY package.json package-lock.json ./

# Install production dependencies
RUN npm ci --omit=dev && \
    npm cache clean --force

# Copy application source
COPY app.js ./
COPY server.js ./
COPY config/ ./config/
COPY controllers/ ./controllers/
COPY middleware/ ./middleware/
COPY routes/ ./routes/
COPY services/ ./services/
COPY swagger/ ./swagger/


# ==========================================
# Stage 2: Production
# ==========================================
FROM node:24-alpine

WORKDIR /app

# Update Alpine security packages
RUN apk update && \
    apk upgrade --no-cache

# Upgrade npm to patched version
RUN npm install -g npm@11.19.1

# Copy application dependencies
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules

# Copy application
COPY --from=builder /app/app.js ./
COPY --from=builder /app/server.js ./
COPY --from=builder /app/config ./config
COPY --from=builder /app/controllers ./controllers
COPY --from=builder /app/middleware ./middleware
COPY --from=builder /app/routes ./routes
COPY --from=builder /app/services ./services
COPY --from=builder /app/swagger ./swagger

# Run as non-root user
USER node

EXPOSE 5003

CMD ["node", "server.js"]