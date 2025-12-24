# Developer Implementation Story: Recruitment Workflow Efficiency (EPIC-05) - [STATUS: DONE]

## 🛠 Technical Overview
This story aims to reduce the "time-to-action" for recruiters by implementing bulk processing, improving the AI job creation loop, and adding structured feedback mechanisms.

## 💾 Proposed Changes

### 1. Bulk Actions & Filtering (Backend)
*   **API**: Implement `POST /api/candidates/bulk-action`
    ```json
    {
      "candidateIds": ["uuid1", "uuid2"],
      "action": "MOVE_STAGE" | "REJECT",
      "payload": { "stageId": "uuid3" }
    }
    ```
*   **Service**: Add `bulkUpdate` methods to `CandidateService` using TypeORM `In()` operator for efficiency.

### 2. Frontend: Bulk UI
*   **Selection**: Add `Checkbox` column to `GenericTable` (Candidates list).
*   **Action Bar**: Create a sticky footer/header "Selection Bar" that appears when `count > 0`.
*   **Advanced Filter**: Implement a multi-select filter chip system for Jobs, Recruiters, and Statuses.

### 3. Candidate Scorecards
*   **Entity**: Create `CandidateScorecard` entity.
    *   `criteria`: JSONB (e.g., {"Technical": 4, "Culture": 5})
    *   `overall_recommendation`: Enum (`HIRE`, `NO_HIRE`, `STRONG_HIRE`)
*   **UI**: Add a `Scorecard` tab to the `CandidateDetailsDrawer`.

### 4. AI Job Creation (User Flow)
*   **Drag-and-Drop**: Replace the standard file input with `react-dropzone`.
*   **Live Preview**: Use an EventSource or simple polling to show "Parsing Status" and stream the resulting JSON into the Step 2 form fields in real-time.

## ⚠️ Known Implementation Details
*   **Transaction Safety**: Bulk actions must be wrapped in a database transaction to prevent partial failures.
*   **Concurrency**: Handle cases where multiple recruiters might be moving the same candidate simultaneously.

## 🧪 Verification Steps
1. **Bulk Test**: Select 50 candidates and move them to "Interview". Verify all 50 updated in one DB call.
2. **Parsing Test**: Drop a PDF JD and verify fields (Title, Experience) populate within 3 seconds.
3. **Scorecard Test**: Submit 3 scorecards for one candidate and verify the average rating displays correctly on the Kanban card.
