## Test Case: Move and Enhance User Management (Staff Management)

**Tenant:** `swivel`
**Environment:** Dev/Local
**Pre-condition:** Admin user exists

### Test Users

* **Admin:** [admin@acentra.com](mailto:admin@acentra.com) / Ok4Me2bhr!
* **Staff Member (Candidate):** [test-staff@acentra.com](mailto:test-staff@acentra.com)

---

### TC-SM-01: Verify Redirection from Admin Users to People Staff

**Role:** Admin
**Steps:**

1. Login as Admin.
2. Manually navigate to `/:tenant/admin/users`.

**Expected Result:**
User is automatically redirected to `/:tenant/people/staff`.

---

### TC-SM-02: Verify Sidebar Navigation for Staff Management

**Role:** Admin
**Steps:**

1. Login as Admin.
2. Observe the sidebar.
3. Look for "People" section and "Staff" sub-item.
4. Click on "Staff".

**Expected Result:**
"Staff" is located under "People". Clicking it navigates the user to the Staff Management page.

---

### TC-SM-03: Create New Staff Member with Enhanced Fields

**Role:** Admin
**Steps:**

1. Navigate to People > Staff.
2. Click **Add Staff Member**.
3. Fill in the following details:
   - Full Name: John Doe
   - Email: john.doe@acentra.com
   - Password: Password123!
   - Role: Employee
   - Job Title: Software Engineer
   - Employee Number: EMP001
   - Reporting Manager: Admin (Select from list)
   - Address: 123 Tech Avenue, Colombo.
4. Click **Create Staff Member**.

**Expected Result:**
Staff member is created successfully. A success snackbar is shown. The user appears in the staff list.

---

### TC-SM-04: Verify Employee Number Uniqueness Validation

**Role:** Admin
**Steps:**

1. Navigate to People > Staff.
2. Click **Add Staff Member**.
3. Fill in the details, use an existing Employee Number: `EMP001`.
4. Click **Create Staff Member**.

**Expected Result:**
System prevents creation. An error message "Employee number already exists in this tenant" is displayed.

---

### TC-SM-05: Verify Manager Selection

**Role:** Admin
**Steps:**

1. Navigate to People > Staff.
2. Click **Add Staff Member**.
3. Open the **Reporting Manager** dropdown.

**Expected Result:**
The dropdown contains the list of existing users in the system.

---

### TC-SM-06: Verify New Fields in Staff List

**Role:** Admin
**Steps:**

1. Navigate to People > Staff.
2. Observe the columns in the staff table.

**Expected Result:**
The table includes columns: **Name**, **Email**, **Job Title**, **Employee #**, **Role**, and **Status**.

---

### TC-SM-07: Verify Role Access (Restricted Role)

**Role:** Recruiter
**Steps:**

1. Login as Recruiter.
2. Navigate to People > Staff.

**Expected Result:**
The "Add Staff Member" button should be visible (as per current implementation if we didn't restrict button visibility yet, but the API should fail if attempted, or button should be hidden if roles were checked). 
*Note: In the current implementation, we are checking `hasPermission` in frontend and role in backend.*

---

**End of Test Cases**
