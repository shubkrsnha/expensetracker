FROM node:24-alpine

WORKDIR /app

# Copy only dependency files
COPY package.json package-lock.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy only application source
COPY src ./src

# Copy only required application files
COPY server.js ./

# Run as non-root user
USER node

EXPOSE 5002

CMD ["node", "server.js"]