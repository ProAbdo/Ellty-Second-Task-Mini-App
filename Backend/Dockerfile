FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (needed for build and migrations)
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Keep dev dependencies for migrations (ts-node, etc.)
# In production, you may want to run migrations separately

# Expose port
EXPOSE 8000

# Start server
CMD ["npm", "start"]

