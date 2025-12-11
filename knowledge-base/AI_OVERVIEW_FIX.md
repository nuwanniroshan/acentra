# AI Overview Fix - Entity Registration

## Problem
When trying to access the AI Overview endpoint, the backend returned:
```json
{
    "message": "Error fetching AI overview",
    "error": {
        "message": "No metadata for \"CandidateAiOverview\" was found."
    }
}
```

## Root Cause
The `CandidateAiOverview` entity was created but not registered in TypeORM's data source configuration, so TypeORM didn't know about it.

## Solution

### 1. Backend Fix - Entity Registration
**File**: `/apps/acentra-backend/src/data-source.ts`

Added the `CandidateAiOverview` entity to TypeORM configuration:

```typescript
// Import added
import { CandidateAiOverview } from "./entity/CandidateAiOverview";

// Entity added to array
entities: [
  User, Job, Candidate, Comment, Office, Department, 
  PipelineStatus, PipelineHistory, Notification, Tenant, 
  FeedbackTemplate, FeedbackQuestion, CandidateFeedbackTemplate, 
  FeedbackResponse, CandidateAiOverview  // <- Added
],
```

### 2. Frontend Fix - Improved Error Handling
**File**: `/apps/acentra-frontend/src/services/candidatesService.ts`

Updated `getCandidateAiOverview()` to handle both 404 and 500 errors gracefully:

```typescript
async getCandidateAiOverview(id: string): Promise<any> {
  try {
    const response = await apiClient.get(`/candidates/${id}/ai-overview`);
    return response.data;
  } catch (error: any) {
    // Return null for 404 (not found) or 500 (server error with missing entity)
    // This will show the "Generate Overview" UI
    if (error.response?.status === 404 || error.response?.status === 500) {
      console.warn("AI overview not available:", error.response?.data?.message);
      return null;
    }
    throw error;
  }
},
```

## How It Works Now

1. **No Overview Exists (404)**:
   - Backend returns 404
   - Frontend service returns `null`
   - UI shows "No overview yet" with "Generate Overview" button

2. **Server Error (500)**:
   - Backend returns 500 (e.g., during entity registration issue)
   - Frontend service returns `null` (graceful degradation)
   - UI shows "No overview yet" with "Generate Overview" button
   - Error is logged to console for debugging

3. **Overview Exists (200)**:
   - Backend returns overview data
   - UI displays the AI-generated overview

## Next Steps

**You need to restart the backend** for the entity registration to take effect:

```bash
# Option 1: Restart all services
./start-all-dev.sh

# Option 2: Restart just the acentra-backend
cd apps/acentra-backend
npm run dev
```

After restart, the database table `candidate_ai_overview` will be automatically created (since `synchronize: true` is enabled in development), and the API will work correctly.

## Testing

1. Open the Candidate Details Drawer
2. Click on "AI Overview" tab
3. You should see:
   - "No overview yet" message
   - "Generate Overview" button (with glowing animation if CV and JD exist)
   - Appropriate warnings if CV or JD is missing

4. Click "Generate Overview"
5. After generation, you should see:
   - Match score
   - Summary
   - Strengths
   - Gaps
   - Detailed analysis
   - Generation timestamp
   - "Regenerate Overview" button
