### User Story: Job Listing Approval Workflow

**As a** Hiring Manager
**I want** the job I create to go through an approval workflow
**So that** only approved job listings are published for recruitment.

---

### Actors / Roles Involved

* **HIRING_MANAGER** – Creates and submits the job
* **HR** – Reviews job details and compliance
* **FINANCE_APPROVER** – Approves budget and headcount
* **ADMIN** – Manages workflow configuration
* **SUPER_ADMIN** – Overrides or final authority (optional)
* **DEPARTMENT_HEAD** *(new role – optional but common)* – Final business approval

---

### Acceptance Criteria

1. **Job Creation**

   * Given I am a **HIRING_MANAGER**
   * When I create a job listing
   * Then the job status should be **Draft**

2. **Submit for Approval**

   * Given the job is in **Draft**
   * When I submit the job for approval
   * Then the status should change to **Pending Approval**

3. **HR Approval**

   * Given I am an **HR**
   * When I review the job
   * Then I can **Approve** or **Request Changes**
   * And I can add comments

4. **Finance Approval**

   * Given the job is HR approved
   * When I am a **FINANCE_APPROVER**
   * Then I can approve or reject based on budget and headcount

5. **Department / Final Approval**

   * Given finance approval is completed
   * When I am a **DEPARTMENT_HEAD** or **SUPER_ADMIN**
   * Then I can give final approval

6. **Approval Outcome**

   * If all required approvals are completed

     * Job status becomes **Approved**
     * Job can be published
   * If changes are requested

     * Job status becomes **Changes Required**
     * Job is sent back to **HIRING_MANAGER**

7. **Publishing**

   * Given the job is **Approved**
   * When the job is published
   * Then recruiters can start candidate sourcing

---

### Opinion

Adding **DEPARTMENT_HEAD** as a role is practical for medium–large orgs.

