import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jobsService } from "@/services/jobsService";
import { departmentsService } from "@/services/departmentsService";
import { officesService } from "@/services/officesService";
import { usersService } from "@/services/usersService";
import { useSnackbar } from "@/context/SnackbarContext";
import { useTenant } from "@/context/TenantContext";
import {
  AuroraBox,
  AuroraCard,
  AuroraCardContent,
  AuroraInput,
  AuroraButton,
  AuroraTypography,
  AuroraAlert,
  AuroraSelect,
  AuroraMenuItem,
  AuroraFormControl,
  AuroraInputLabel,
  AuroraSaveIcon,
  AuroraArrowBackIcon,
  AuroraUploadIcon,
  AuroraArrowUpwardIcon,
} from "@acentra/aurora-design-system";

export function CreateJob() {
  const [step, setStep] = useState(1); // 1: Upload JD, 2: Fill form
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [branch, setBranch] = useState("");
  const [tags, setTags] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [expectedClosingDate, setExpectedClosingDate] = useState("");
  const navigate = useNavigate();
  const tenant = useTenant();
  const { showSnackbar } = useSnackbar();
  const [error, setError] = useState<string | null>(null);

  const [departmentsList, setDepartmentsList] = useState<any[]>([]);
  const [branchesList, setBranchesList] = useState<any[]>([]);
  const [recruitersList, setRecruitersList] = useState<any[]>([]);
  const [selectedRecruiters, setSelectedRecruiters] = useState<string[]>([]);

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      const [deps, offs, recruiters] = await Promise.all([
        departmentsService.getDepartments(),
        officesService.getOffices(),
        usersService.getUsersByRole("recruiter"),
      ]);
      setDepartmentsList(deps);
      setBranchesList(offs);
      setRecruitersList(recruiters);
    } catch (err) {
      console.error(err);
      setError("Failed to load options.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!validTypes.includes(file.type)) {
        showSnackbar("Please select a PDF, DOC, or DOCX file", "error");
        return;
      }
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        showSnackbar("File size must not exceed 10MB", "error");
        return;
      }
      setJdFile(file);
    }
  };

  const handleNext = async () => {
    if (!jdFile) {
      showSnackbar("Please select a JD file first", "error");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const parsedData = await jobsService.parseJd(jdFile);

      // Populate form with parsed data
      setTitle(parsedData.title);
      setDescription(parsedData.description);
      setTags(parsedData.tags.join(", "));

      setStep(2);
      showSnackbar("JD parsed successfully!", "success");
    } catch (err: any) {
      setError(err.message || "Failed to parse JD");
      showSnackbar("Failed to parse JD", "error");
    } finally {
      setIsUploading(false);
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
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t),
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
        onClick={() =>
          step === 1 ? navigate(`/${tenant}/dashboard`) : setStep(1)
        }
        sx={{ mb: 2 }}
      >
        {step === 1 ? "Back to Dashboard" : "Back to Upload"}
      </AuroraButton>

      <AuroraTypography variant="h4" gutterBottom>
        Create New Job - Step {step} of 2
      </AuroraTypography>
      {error && (
        <AuroraAlert severity="error" sx={{ mb: 2 }}>
          {error}
        </AuroraAlert>
      )}

      <AuroraCard>
        <AuroraCardContent>
          {step === 1 ? (
            // Step 1: Upload JD
            <AuroraBox sx={{ textAlign: "center", py: 4 }}>
              <AuroraUploadIcon
                sx={{ fontSize: 64, color: "primary.main", mb: 2 }}
              />
              <AuroraTypography variant="h6" gutterBottom>
                Upload Job Description
              </AuroraTypography>
              <AuroraTypography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3 }}
              >
                Upload a PDF, DOC, or DOCX file containing the job description
              </AuroraTypography>

              <input
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                style={{ display: "none" }}
                id="jd-file-input"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="jd-file-input">
                <AuroraButton
                  variant="outlined"
                  component="span"
                  startIcon={<AuroraUploadIcon />}
                  sx={{ mb: 2 }}
                >
                  Choose File
                </AuroraButton>
              </label>

              {jdFile && (
                <AuroraTypography variant="body2" sx={{ mb: 2 }}>
                  Selected: {jdFile.name}
                </AuroraTypography>
              )}

              <AuroraBox
                sx={{ display: "flex", gap: 2, justifyContent: "center" }}
              >
                <AuroraButton
                  variant="outlined"
                  onClick={() => navigate(`/${tenant}/dashboard`)}
                >
                  Cancel
                </AuroraButton>
                <AuroraButton
                  variant="contained"
                  onClick={handleNext}
                  disabled={!jdFile || isUploading}
                  startIcon={
                    isUploading ? undefined : <AuroraArrowUpwardIcon />
                  }
                >
                  {isUploading ? "Processing..." : "Next"}
                </AuroraButton>
              </AuroraBox>
            </AuroraBox>
          ) : (
            // Step 2: Fill form
            <form onSubmit={handleSubmit}>
              <AuroraTypography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Review and Complete Job Details
              </AuroraTypography>

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
                  onChange={(e) =>
                    setSelectedRecruiters(e.target.value as string[])
                  }
                  renderValue={(selected) =>
                    selected
                      .map(
                        (id) =>
                          recruitersList.find((r) => r.id === id)?.email || id
                      )
                      .join(", ")
                  }
                >
                  {recruitersList.map((recruiter) => (
                    <AuroraMenuItem key={recruiter.id} value={recruiter.id}>
                      {recruiter.email}{" "}
                      {recruiter.name ? `(${recruiter.name})` : ""}
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
              <AuroraBox
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "flex-end",
                  mt: 2,
                }}
              >
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
          )}
        </AuroraCardContent>
      </AuroraCard>
    </AuroraBox>
  );
}
