FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

FROM node:24-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/app.js ./
COPY --from=builder /app/server.js ./


RUN rm -rf /usr/local/lib/node_modules/npm

USER node

EXPOSE 5002

CMD ["node", "server.js"]