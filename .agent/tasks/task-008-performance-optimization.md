# Task: Performance Optimization

**Story ID:** STORY-3.1  
**Sprint:** Sprint 3  
**Story Points:** 13  
**Priority:** 🔴 High  
**Assignee:** Developer 1 (Full-stack)  
**Duration:** Days 1-6

---

## 📋 Overview

Optimize application performance for production scale. Current issues include slow page loads, inefficient database queries, and large bundle sizes that impact user experience.

**Goal:** Achieve production-ready performance metrics across frontend and backend.

---

## 🎯 Objectives

1. Reduce frontend bundle size by 30%
2. Optimize database queries for < 100ms response time
3. Achieve < 2 second page load times
4. Reach Lighthouse performance score > 90
5. Implement comprehensive performance monitoring

---

## 📊 Current State

### Frontend Performance
- **Bundle Size:** TBD (measure baseline)
- **Page Load Time:** TBD (measure baseline)
- **Lighthouse Score:** TBD (measure baseline)
- **Issues:**
  - No code splitting
  - Heavy components loaded upfront
  - Unoptimized images
  - Large vendor bundles

### Backend Performance
- **API Response Time:** TBD (measure baseline)
- **Database Query Time:** TBD (measure baseline)
- **Issues:**
  - N+1 query problems
  - Missing database indexes
  - No query result caching
  - Inefficient eager loading

---

## ✅ Acceptance Criteria

- [ ] Page load time < 2 seconds (p95)
- [ ] API response time < 500ms (p95)
- [ ] Bundle size reduced by 30% from baseline
- [ ] Lighthouse performance score > 90
- [ ] Database queries < 100ms (p95)
- [ ] All routes use code splitting
- [ ] Heavy components lazy loaded
- [ ] Images optimized (WebP format)
- [ ] Redis caching implemented
- [ ] Performance monitoring dashboards active

---

## 📝 Subtasks

### 1. Frontend Bundle Optimization (3 points)

#### 1.1 Implement Code Splitting
**Effort:** 1 point

```typescript
// Before: All routes loaded upfront
import Jobs from './pages/Jobs';
import Candidates from './pages/Candidates';

// After: Lazy load routes
const Jobs = lazy(() => import('./pages/Jobs'));
const Candidates = lazy(() => import('./pages/Candidates'));
```

**Tasks:**
- [ ] Audit current route loading
- [ ] Implement React.lazy() for all routes
- [ ] Add Suspense boundaries with loading states
- [ ] Test route transitions
- [ ] Measure bundle size improvement

**Files to modify:**
- `apps/acentra-frontend/src/App.tsx`
- `apps/acentra-frontend/src/routes/index.tsx`

---

#### 1.2 Lazy Load Heavy Components
**Effort:** 1 point

**Heavy components to lazy load:**
- React Quill (email editor)
- Chart libraries (analytics)
- PDF viewer
- Rich text editors

```typescript
// Lazy load React Quill
const ReactQuill = lazy(() => import('react-quill'));

// Use with Suspense
<Suspense fallback={<EditorSkeleton />}>
  <ReactQuill {...props} />
</Suspense>
```

**Tasks:**
- [ ] Identify components > 100KB
- [ ] Implement lazy loading
- [ ] Add appropriate loading skeletons
- [ ] Test component loading
- [ ] Measure impact

**Files to modify:**
- `apps/acentra-frontend/src/components/email/SendEmailModal.tsx`
- `apps/acentra-frontend/src/components/analytics/*`

---

#### 1.3 Optimize Images
**Effort:** 0.5 points

**Tasks:**
- [ ] Convert all images to WebP format
- [ ] Implement responsive images
- [ ] Add lazy loading for images
- [ ] Compress existing images
- [ ] Add image CDN (if applicable)

**Commands:**
```bash
# Convert images to WebP
npm install sharp
node scripts/convert-images-to-webp.js

# Optimize images
npm install imagemin imagemin-webp
```

**Files to create:**
- `scripts/convert-images-to-webp.js`
- `scripts/optimize-images.js`

---

#### 1.4 Bundle Analysis and Optimization
**Effort:** 0.5 points

**Tasks:**
- [ ] Run webpack bundle analyzer
- [ ] Identify large dependencies
- [ ] Remove unused dependencies
- [ ] Split vendor bundles
- [ ] Implement tree shaking

**Commands:**
```bash
# Analyze bundle
npm run build -- --stats
npx webpack-bundle-analyzer dist/stats.json

# Check for unused dependencies
npx depcheck
```

**Expected improvements:**
- Remove unused lodash imports
- Split vendor bundle
- Tree shake Material-UI imports

---

### 2. Backend Query Optimization (5 points)

#### 2.1 Add Database Indexes
**Effort:** 2 points

**Tables needing indexes:**

```sql
-- Jobs table
CREATE INDEX idx_jobs_tenant_id ON jobs(tenant_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_created_at ON jobs(created_at);
CREATE INDEX idx_jobs_department_id ON jobs(department_id);

-- Candidates table
CREATE INDEX idx_candidates_tenant_id ON candidates(tenant_id);
CREATE INDEX idx_candidates_job_id ON candidates(job_id);
CREATE INDEX idx_candidates_status ON candidates(status);
CREATE INDEX idx_candidates_created_at ON candidates(created_at);

-- Users table
CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Applications table
CREATE INDEX idx_applications_candidate_id ON applications(candidate_id);
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_status ON applications(status);
```

**Tasks:**
- [ ] Analyze slow queries
- [ ] Identify missing indexes
- [ ] Create migration for indexes
- [ ] Test query performance
- [ ] Measure improvement

**Files to create:**
- `apps/acentra-backend/src/migrations/XXXXXX-add-performance-indexes.ts`

---

#### 2.2 Fix N+1 Query Problems
**Effort:** 2 points

**Common N+1 issues:**

```typescript
// Before: N+1 query
const jobs = await jobRepository.find();
for (const job of jobs) {
  job.department = await departmentRepository.findOne(job.departmentId);
}

// After: Eager loading
const jobs = await jobRepository.find({
  relations: ['department', 'assignedTo', 'createdBy']
});
```

**Tasks:**
- [ ] Audit all list endpoints
- [ ] Add proper eager loading
- [ ] Use QueryBuilder for complex queries
- [ ] Test query count
- [ ] Measure improvement

**Files to modify:**
- `apps/acentra-backend/src/controllers/JobController.ts`
- `apps/acentra-backend/src/controllers/CandidateController.ts`
- `apps/acentra-backend/src/controllers/ApplicationController.ts`

---

#### 2.3 Implement Redis Caching
**Effort:** 1 point

**Cache strategy:**
```typescript
// Cache frequently accessed data
const cacheKey = `job:${jobId}`;
let job = await redis.get(cacheKey);

if (!job) {
  job = await jobRepository.findOne(jobId);
  await redis.set(cacheKey, JSON.stringify(job), 'EX', 300); // 5 min TTL
}
```

**Data to cache:**
- Job details (5 min TTL)
- Candidate details (5 min TTL)
- User profiles (10 min TTL)
- Department/branch lists (30 min TTL)
- Template lists (15 min TTL)

**Tasks:**
- [ ] Setup Redis connection
- [ ] Create caching service
- [ ] Implement cache invalidation
- [ ] Add cache to critical endpoints
- [ ] Monitor cache hit rate

**Files to create:**
- `apps/acentra-backend/src/services/CacheService.ts`
- `apps/acentra-backend/src/config/redis.ts`

**Files to modify:**
- `apps/acentra-backend/src/controllers/JobController.ts`
- `apps/acentra-backend/src/controllers/CandidateController.ts`

---

### 3. API Response Optimization (3 points)

#### 3.1 Implement Pagination
**Effort:** 1.5 points

**Standard pagination:**
```typescript
interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

**Endpoints to paginate:**
- GET /api/jobs
- GET /api/candidates
- GET /api/applications
- GET /api/feedback-templates
- GET /api/email-templates

**Tasks:**
- [ ] Create pagination utility
- [ ] Update all list endpoints
- [ ] Update frontend to use pagination
- [ ] Add infinite scroll (optional)
- [ ] Test with large datasets

**Files to create:**
- `apps/acentra-backend/src/utils/pagination.ts`

**Files to modify:**
- All controller list methods
- Frontend service files

---

#### 3.2 Add Response Compression
**Effort:** 0.5 points

**Implementation:**
```typescript
// Add compression middleware
import compression from 'compression';

app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6 // Balance between speed and compression
}));
```

**Tasks:**
- [ ] Install compression package
- [ ] Add compression middleware
- [ ] Configure compression settings
- [ ] Test response sizes
- [ ] Measure improvement

**Files to modify:**
- `apps/acentra-backend/src/index.ts`

---

#### 3.3 Optimize JSON Serialization
**Effort:** 0.5 points

**Optimizations:**
- Remove unnecessary fields
- Use class-transformer
- Implement DTOs
- Exclude sensitive data

```typescript
// Use DTOs for responses
export class JobResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  @Transform(({ value }) => value?.name)
  department: string;

  // Exclude sensitive fields
  @Exclude()
  internalNotes: string;
}
```

**Tasks:**
- [ ] Create response DTOs
- [ ] Apply transformations
- [ ] Remove circular references
- [ ] Test response sizes
- [ ] Measure improvement

**Files to create:**
- `apps/acentra-backend/src/dtos/responses/*`

---

#### 3.4 Add Response Time Monitoring
**Effort:** 0.5 points

**Implementation:**
```typescript
// Response time middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration
    });
    
    // Send to monitoring service
    metrics.recordResponseTime(req.route?.path, duration);
  });
  
  next();
});
```

**Tasks:**
- [ ] Add response time middleware
- [ ] Create metrics service
- [ ] Setup CloudWatch metrics
- [ ] Create monitoring dashboard
- [ ] Set up alerts

**Files to create:**
- `apps/acentra-backend/src/middleware/responseTime.ts`
- `apps/acentra-backend/src/services/MetricsService.ts`

---

### 4. Testing and Validation (2 points)

#### 4.1 Load Testing
**Effort:** 1 point

**Load test scenarios:**
```javascript
// k6 load test script
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 50 },  // Ramp up
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% < 500ms
    http_req_failed: ['rate<0.01'],   // < 1% errors
  },
};

export default function () {
  // Test critical endpoints
  const res = http.get('https://api.example.com/jobs');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);
}
```

**Tasks:**
- [ ] Install k6 or Artillery
- [ ] Create load test scripts
- [ ] Run tests against staging
- [ ] Analyze results
- [ ] Fix bottlenecks
- [ ] Re-test

**Files to create:**
- `tests/load/jobs-list.js`
- `tests/load/candidates-list.js`
- `tests/load/dashboard.js`

---

#### 4.2 Performance Benchmarking
**Effort:** 0.5 points

**Metrics to track:**
```typescript
interface PerformanceMetrics {
  // Frontend
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  timeToInteractive: number;
  totalBlockingTime: number;
  cumulativeLayoutShift: number;
  
  // Backend
  apiResponseTime: number;
  databaseQueryTime: number;
  cacheHitRate: number;
  
  // Bundle
  bundleSize: number;
  chunkCount: number;
}
```

**Tasks:**
- [ ] Measure baseline metrics
- [ ] Run Lighthouse audits
- [ ] Measure API response times
- [ ] Track database query times
- [ ] Document results

**Files to create:**
- `docs/performance/baseline-metrics.md`
- `docs/performance/optimization-results.md`

---

#### 4.3 Lighthouse Score Optimization
**Effort:** 0.5 points

**Target scores:**
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

**Tasks:**
- [ ] Run Lighthouse audit
- [ ] Fix performance issues
- [ ] Fix accessibility issues
- [ ] Fix best practices issues
- [ ] Fix SEO issues
- [ ] Re-run audit

**Common fixes:**
- Add meta descriptions
- Optimize images
- Add alt text
- Fix contrast issues
- Add ARIA labels

---

## 🔧 Technical Implementation

### Frontend Optimization

**Webpack Configuration:**
```javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
        },
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    },
  },
  performance: {
    maxAssetSize: 512000,
    maxEntrypointSize: 512000,
  },
};
```

**Vite Configuration:**
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@mui/material', '@emotion/react'],
          charts: ['recharts', 'chart.js'],
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
});
```

---

### Backend Optimization

**Redis Setup:**
```typescript
// src/config/redis.ts
import Redis from 'ioredis';

export const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on('error', (err) => {
  console.error('Redis error:', err);
});

redis.on('connect', () => {
  console.log('Redis connected');
});
```

**Cache Service:**
```typescript
// src/services/CacheService.ts
export class CacheService {
  private redis: Redis;
  
  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }
  
  async set(key: string, value: any, ttl: number = 300): Promise<void> {
    await this.redis.set(key, JSON.stringify(value), 'EX', ttl);
  }
  
  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }
  
  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}
```

---

## 📊 Success Metrics

### Before Optimization (Baseline)
```
Frontend:
- Bundle Size: TBD
- Page Load: TBD
- Lighthouse: TBD

Backend:
- API Response: TBD
- DB Queries: TBD
- Cache Hit Rate: 0%
```

### After Optimization (Target)
```
Frontend:
- Bundle Size: -30% from baseline
- Page Load: < 2s
- Lighthouse: > 90

Backend:
- API Response: < 500ms (p95)
- DB Queries: < 100ms (p95)
- Cache Hit Rate: > 70%
```

---

## 🚨 Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking changes from code splitting | High | Comprehensive testing |
| Redis connection issues | Medium | Fallback to direct DB queries |
| Cache invalidation bugs | Medium | Conservative TTLs, monitoring |
| Performance regression | High | Continuous monitoring, alerts |

---

## 📚 Resources

### Documentation
- [React Code Splitting](https://reactjs.org/docs/code-splitting.html)
- [Webpack Bundle Optimization](https://webpack.js.org/guides/code-splitting/)
- [Redis Caching Strategies](https://redis.io/docs/manual/patterns/)
- [Database Indexing Best Practices](https://use-the-index-luke.com/)

### Tools
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)
- [k6 Load Testing](https://k6.io/)
- [Redis Commander](https://github.com/joeferner/redis-commander)

---

## ✅ Definition of Done

- [ ] All subtasks completed
- [ ] Performance metrics meet targets
- [ ] Load testing passed
- [ ] Lighthouse score > 90
- [ ] Code reviewed and approved
- [ ] Monitoring dashboards created
- [ ] Documentation updated
- [ ] Deployed to staging
- [ ] QA approved
- [ ] Deployed to production

---

**Created:** December 25, 2025  
**Last Updated:** December 25, 2025  
**Status:** 📝 Ready for Development
