FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 3300

# Start the application (uses ts-node for TypeScript)
CMD ["npm", "start"]

