FROM node:20-slim AS builder

# Install build dependencies
RUN apt-get update && apt-get install -y openssl bash && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy all files
COPY . .

# Install all dependencies and build everything (API + Web)
RUN pnpm install
RUN pnpm build

# Final Stage
FROM node:20-slim AS runner

RUN apt-get update && apt-get install -y openssl bash && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy the built app and all node_modules from builder
COPY --from=builder /app ./

# Ensure the start script is executable
RUN chmod +x start-production.sh

ENV NODE_ENV=production

# Render will provide the PORT (usually 10000) for the Frontend.
# The API will use 4001 (configured in the start script).
CMD ["bash", "start-production.sh"]
