# ==========================================
# Stage 1: Builder
# ==========================================
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY controllers ./controllers
COPY middleware ./middleware
COPY routes ./routes
COPY services ./services
COPY app.js ./
COPY server.js ./


# ==========================================
# Stage 2: Runtime
# ==========================================
FROM node:24-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

# Update Alpine packages
RUN apk update && \
    apk upgrade --no-cache && \
    apk add --no-cache --upgrade libcrypto3 libssl3

# npm is not required at runtime
RUN rm -rf /usr/local/lib/node_modules/npm

# Create non-root user
RUN addgroup -S nodeapp && \
    adduser -S nodeapp -G nodeapp

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