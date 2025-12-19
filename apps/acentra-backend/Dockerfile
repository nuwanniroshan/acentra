FROM node:22-alpine
 
 WORKDIR /app
 
 # Install curl for health checks
 RUN apk add --no-cache curl
 
 # Create non-root user
 RUN addgroup -g 1001 -S nodejs && \
     adduser -S nodejs -u 1001
 
 # Copy generated package files from build output
 COPY dist/apps/acentra-backend/package*.json ./
 
 # Install production dependencies only
 RUN npm install --omit=dev && \
     npm cache clean --force

# Copy built application
COPY dist/apps/acentra-backend/index.cjs ./index.js

# Create uploads directory with proper permissions
RUN mkdir -p uploads && \
    chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Start application
CMD ["node", "index.js"]
