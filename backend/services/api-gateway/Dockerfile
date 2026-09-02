FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY app.js ./
COPY server.js ./
COPY config ./config
COPY controllers ./controllers
COPY middleware ./middleware
COPY routes ./routes
COPY services ./services
COPY swagger ./swagger

EXPOSE 5003

CMD ["node", "server.js"]