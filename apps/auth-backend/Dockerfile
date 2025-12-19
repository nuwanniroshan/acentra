FROM node:20-alpine
 
 WORKDIR /app
 
 # Install curl for health checks
 RUN apk update && apk add --no-cache curl
 
 # Create non-root user
 RUN addgroup -g 1001 -S nodejs && \
     adduser -S nodejs -u 1001
 
 # Copy generated package files from build output
 COPY dist/apps/auth-backend/package*.json ./
 
 # Install production dependencies only
 RUN npm install --omit=dev && \
     npm cache clean --force

# Copy built application
COPY dist/apps/auth-backend/index.cjs ./index.js

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3002

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3002/health || exit 1

# Start application
CMD ["node", "index.js"]
