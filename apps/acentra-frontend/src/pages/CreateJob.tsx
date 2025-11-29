import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jobsService } from "@/services/jobsService";
import { departmentsService } from "@/services/departmentsService";
import { officesService } from "@/services/officesService";
import { usersService } from "@/services/usersService";
import { useSnackbar } from "@/context/SnackbarContext";
import { useTenant } from "@/context/TenantContext";
import { AuroraBox, AuroraCard, AuroraCardContent, AuroraInput, AuroraButton, AuroraTypography, AuroraAlert, AuroraSelect, AuroraMenuItem, AuroraFormControl, AuroraInputLabel, AuroraSaveIcon, AuroraArrowBackIcon } from '@acentra/aurora-design-system';

export function CreateJob() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [branch, setBranch] = useState("");
  const [tags, setTags] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedClosingDate, setExpectedClosingDate] = useState("");
  const navigate = useNavigate();
  const tenant = useTenant();
  const { showSnackbar } = useSnackbar();
  const [error, setError] = useState<string | null>(null); // Added

  const [departmentsList, setDepartmentsList] = useState<any[]>([]);
  const [branchesList, setBranchesList] = useState<any[]>([]);
  const [recruitersList, setRecruitersList] = useState<any[]>([]);
  const [selectedRecruiters, setSelectedRecruiters] = useState<string[]>([]);

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      const [deps, offs, users] = await Promise.all([
        departmentsService.getDepartments(),
        officesService.getOffices(),
        usersService.getUsers(),
      ]);
      setDepartmentsList(deps);
      setBranchesList(offs);
      // Filter only recruiters
      const recruiters = users.filter((u: any) => u.role === "recruiter");
      setRecruitersList(recruiters);
    } catch (err) {
      console.error(err);
      setError("Failed to load options.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    // Validate dates
    if (new Date(expectedClosingDate) <= new Date(startDate)) {
      showSnackbar("Expected closing date must be after start date", "error");
      setError("Expected closing date must be after start date");
      return;
    }
    
    try {
      await jobsService.createJob({
        title,
        description,
        department,
        branch,
        tags: tags.split(",").map(t => t.trim()).filter(t => t),
        start_date: startDate,
        expected_closing_date: expectedClosingDate,
        assigneeIds: selectedRecruiters,
      });
      showSnackbar("Job created successfully!", "success");
      navigate(`/${tenant}/dashboard`);
    } catch (err: any) {
      setError(err.message || "Failed to create job");
      showSnackbar("Failed to create job", "error");
    }
  };

  return (
    <AuroraBox sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <AuroraButton
        startIcon={<AuroraArrowBackIcon />}
        onClick={() => navigate(`/${tenant}/dashboard`)}
        sx={{ mb: 2 }}
      >
        Back to Dashboard
      </AuroraButton>

      <AuroraTypography variant="h4" gutterBottom>
        Create New Job
      </AuroraTypography>
      {error && <AuroraAlert severity="error" sx={{ mb: 2 }}>{error}</AuroraAlert>} {/* Added */}

      <AuroraCard>
        <AuroraCardContent>
          <form onSubmit={handleSubmit}>
            <AuroraInput
              fullWidth
              label="Job Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              margin="normal"
              placeholder="e.g., Senior Frontend Developer"
            />
            <AuroraInput
              fullWidth
              label="Job Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              multiline
              rows={6}
              margin="normal"
              placeholder="Describe the role, responsibilities, and requirements..."
            />
            
            <AuroraBox sx={{ display: "flex", gap: 2 }}>
              <AuroraFormControl fullWidth margin="normal">
                <AuroraInputLabel>Department</AuroraInputLabel>
                <AuroraSelect
                  value={department}
                  label="Department"
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  {departmentsList.map((dep) => (
                    <AuroraMenuItem key={dep.id} value={dep.name}>
                      {dep.name}
                    </AuroraMenuItem>
                  ))}
                </AuroraSelect>
              </AuroraFormControl>
              <AuroraFormControl fullWidth margin="normal">
                <AuroraInputLabel>Branch</AuroraInputLabel>
                <AuroraSelect
                  value={branch}
                  label="Branch"
                  onChange={(e) => setBranch(e.target.value)}
                >
                  {branchesList.map((off) => (
                    <AuroraMenuItem key={off.id} value={off.name}>
                      {off.name}
                    </AuroraMenuItem>
                  ))}
                </AuroraSelect>
              </AuroraFormControl>
            </AuroraBox>

            <AuroraInput
              fullWidth
              label="Tags (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              margin="normal"
              helperText="e.g. Remote, Urgent, Senior"
            />

            <AuroraFormControl fullWidth margin="normal">
              <AuroraInputLabel>Assign Recruiters</AuroraInputLabel>
              <AuroraSelect
                multiple
                value={selectedRecruiters}
                label="Assign Recruiters"
                onChange={(e) => setSelectedRecruiters(e.target.value as string[])}
                renderValue={(selected) => 
                  selected.map(id => 
                    recruitersList.find(r => r.id === id)?.email || id
                  ).join(", ")
                }
              >
                {recruitersList.map((recruiter) => (
                  <AuroraMenuItem key={recruiter.id} value={recruiter.id}>
                    {recruiter.email} {recruiter.name ? `(${recruiter.name})` : ""}
                  </AuroraMenuItem>
                ))}
              </AuroraSelect>
            </AuroraFormControl>

            <AuroraBox sx={{ display: "flex", gap: 2 }}>
              <AuroraInput
                fullWidth
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <AuroraInput
                fullWidth
                label="Expected Closing Date"
                type="date"
                value={expectedClosingDate}
                onChange={(e) => setExpectedClosingDate(e.target.value)}
                required
                margin="normal"
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: startDate }}
              />
            </AuroraBox>
            <AuroraBox sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 2 }}>
              <AuroraButton
                variant="outlined"
                onClick={() => navigate(`/${tenant}/dashboard`)}
              >
                Cancel
              </AuroraButton>
              <AuroraButton
                type="submit"
                variant="contained"
                startIcon={<AuroraSaveIcon />}
              >
                Create Job
              </AuroraButton>
            </AuroraBox>
          </form>
        </AuroraCardContent>
      </AuroraCard>
    </AuroraBox>
  );
}
