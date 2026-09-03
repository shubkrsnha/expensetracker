# ==========================================
# Stage 1: Builder
# ==========================================
FROM node:24-alpine AS builder

WORKDIR /app

# Refresh Alpine packages and apply security updates
RUN apk update && \
    apk add --no-cache --upgrade libcrypto3 libssl3 && \
    apk upgrade --no-cache

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .


# ==========================================
# Stage 2: Runtime
# ==========================================
FROM node:24-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

# Refresh Alpine packages and apply security updates
RUN apk update && \
    apk add --no-cache --upgrade libcrypto3 libssl3 && \
    apk upgrade --no-cache

COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/package.json ./

COPY --from=builder /app/app.js ./

COPY --from=builder /app/server.js ./

COPY --from=builder /app/config ./config

COPY --from=builder /app/controllers ./controllers

COPY --from=builder /app/middleware ./middleware

COPY --from=builder /app/models ./models

COPY --from=builder /app/routes ./routes

# Remove bundled npm from runtime image
RUN rm -rf /usr/local/lib/node_modules/npm

# Run application as non-root
USER node

EXPOSE 5001

CMD ["node", "server.js"]