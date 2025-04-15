# Build stage
FROM node:18-alpine AS builder

# Step 1: Copy package files first
# This allows Docker to cache the installed dependencies if package files haven't changed
# Using package*.json matches both package.json and package-lock.json with one command
COPY package*.json /app/
WORKDIR /app

# Step 2: Install dependencies with caching
# --mount=type=cache prevents the need to re-download packages in subsequent builds
# This significantly speeds up build time while keeping the final image clean
RUN --mount=type=cache,target=/root/.npm npm install

# Step 3: Copy source code and build
# Only copy source code after installing dependencies
# This ensures that code changes don't invalidate the dependency cache
COPY . /app
RUN npm run build

# Production stage
FROM node:18-alpine AS release

# Step 4: Set up production environment
WORKDIR /app
ENV NODE_ENV=production

# Step 5: Copy only necessary files from builder
# - dist/: Contains the built application
# - package*.json: Required for module resolution
# - node_modules/: Contains production dependencies
# This minimizes the final image size by excluding dev dependencies and source code
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package*.json /app/
COPY --from=builder /app/node_modules /app/node_modules

# Step 6: Define the startup command
# Using ENTRYPOINT ensures the container runs as an executable
ENTRYPOINT ["node", "dist/index.js"] 