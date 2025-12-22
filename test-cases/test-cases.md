## Test Case: End-to-End Hiring Flow with Approvals and Candidate Progression

**Tenant:** `swivel`
**Environment:** Demo
**Pre-condition:** All users exist and are active

### Test Users

* **Admin:** [admin@acentra.com](mailto:admin@acentra.com) / Ok4Me2bhr!
* **HR:** [hr@acentra.com](mailto:hr@acentra.com) / Ok4Me2bhr!
* **Hiring Manager (HM):** [em@acentra.com](mailto:em@acentra.com) / Ok4Me2bhr!
* **Recruiter:** [rc@acentra.com](mailto:rc@acentra.com) / Ok4Me2bhr!

---

### TC-01: Login to Application

**Role:** Any
**Steps:**

1. Open application login page.
2. Enter tenant `swivel`.
3. Login with valid credentials.

**Expected Result:**
User is logged in successfully and redirected to dashboard.

---

### TC-02: Create Job as Hiring Manager

**Role:** Hiring Manager
**Steps:**

1. Login as HM.
2. Navigate to Jobs → Create Job.
3. Upload JD:
   `Software Engineer – AWS Serverless - Node.js.docx`
4. Submit job for approval.

**Expected Result:**
Job is created with status **Pending HR Approval**.

---

### TC-03: Verify Job Pending Approval

**Role:** Hiring Manager
**Steps:**

1. View job details.

**Expected Result:**
Job status shows **Waiting for HR Approval**.

---

### TC-04: View Pending Job as HR

**Role:** HR
**Steps:**

1. Login as HR.
2. Navigate to Job Approvals.

**Expected Result:**
New job appears in **Pending Approvals** list.

---

### TC-05: Approve Job and Assign Recruiter

**Role:** HR
**Steps:**

1. Open pending job.
2. Approve job.
3. Enter budget.
4. Assign recruiter: `rc@acentra.com`.

**Expected Result:**
Job status becomes **Approved** and assigned to recruiter.

---

### TC-06: Verify Job Approval as Hiring Manager

**Role:** Hiring Manager
**Steps:**

1. Login as HM.
2. Open created job.

**Expected Result:**
Job status shows **Approved** with assigned recruiter.

---

### TC-07: View Assigned Job as Recruiter

**Role:** Recruiter
**Steps:**

1. Login as recruiter.
2. Navigate to assigned jobs.

**Expected Result:**
Approved job is visible.

---

### TC-08: Create Candidate

**Role:** Recruiter
**Steps:**

1. Open the job.
2. Create a new candidate.
3. Upload CV:
   `Chathura Samarajeewa.pdf`

**Expected Result:**
Candidate is created successfully.

---

### TC-09: Generate AI Summary

**Role:** Recruiter
**Steps:**

1. Open candidate profile.
2. Click **Generate AI Summary**.

**Expected Result:**
AI summary is generated and saved.

---

### TC-10: Move Candidate to Phone Screening

**Role:** Recruiter
**Steps:**

1. Change candidate stage to **Phone Screening**.

**Expected Result:**
Candidate stage updated successfully.

---

### TC-11: Submit Phone Screening Feedback

**Role:** Recruiter
**Steps:**

1. Fill phone screening feedback form.
2. Submit feedback.

**Expected Result:**
Feedback is saved and visible in candidate timeline.

---

### TC-12: Comment to Hiring Manager

**Role:** Recruiter
**Steps:**

1. Add comment:
   *“Candidate is ready for your review.”*

**Expected Result:**
Comment is visible to Hiring Manager.

---

### TC-13: Review Candidate as Hiring Manager

**Role:** Hiring Manager
**Steps:**

1. Login as HM.
2. Open candidate profile.
3. Review CV, AI summary, and comments.
4. Move candidate to **Interview** stage.
5. Add comment to recruiter:
   *“Please schedule the technical interview.”*

**Expected Result:**
Candidate moved to **Interview** stage and comment is recorded.

---

**End of Test Case**
