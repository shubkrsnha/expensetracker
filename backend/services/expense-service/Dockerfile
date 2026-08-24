FROM node:24-alpine

WORKDIR /app

# Copy dependency files first for better Docker layer caching
COPY package.json package-lock.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy application source
COPY . .

# Run as non-root user
USER node

EXPOSE 5001

CMD ["node", "server.js"]