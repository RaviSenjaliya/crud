FROM node:20.18.0-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Copy Prisma schema first
COPY prisma ./prisma/

# Install ALL dependencies (including dev dependencies) for building
RUN npm ci

# Copy TypeScript configuration
COPY tsconfig.json ./

# Copy source files
COPY src ./src

# Generate Prisma client and build the application
RUN npx prisma generate && \
    npm run build && \
    # Remove dev dependencies and source files after build
    npm prune --production && \
    rm -rf src prisma tsconfig.json && \
    npm cache clean --force

# Set Port
EXPOSE 4000

# Use Teller to run the app
CMD ["node", "./dist/server.js"]

