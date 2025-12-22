import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jobsService } from "@/services/jobsService";
import { useSnackbar } from "@/context/SnackbarContext";
import { useTenant } from "@/context/TenantContext";
import {
  AuroraBox,
  AuroraCard,
  AuroraCardContent,
  AuroraInput,
  AuroraButton,
  AuroraTypography,
  AuroraCircularProgress,
  AuroraAlert,
  AuroraSaveIcon,
  AuroraArrowBackIcon,
} from "@acentra/aurora-design-system";

export function EditJob() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [branch, setBranch] = useState("");
  const [tags, setTags] = useState("");
  const [startDate, setStartDate] = useState("");
  const [expectedClosingDate, setExpectedClosingDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const tenant = useTenant();
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    loadJob();
  }, [id]);

  const loadJob = async () => {
    try {
      const data = await jobsService.getJob(id!);
      setTitle(data.title);
      setDescription(data.description);
      setDepartment(data.department || "");
      setBranch(data.branch || "");
      setTags(data.tags ? data.tags.join(", ") : "");
      setStartDate(
        data.start_date
          ? new Date(data.start_date).toISOString().split("T")[0]
          : "",
      );
      setExpectedClosingDate(
        data.expected_closing_date
          ? new Date(data.expected_closing_date).toISOString().split("T")[0]
          : "",
      ); // Modified based on diff, but kept original robustness
      setLoading(false);
    } catch (err: any) {
      // Modified error handling
      setError(err.message); // Modified error handling
      showSnackbar("Failed to load job", "error"); // Kept snackbar for consistency
      navigate(`/${tenant}/dashboard`); // Kept original navigation
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate dates
    if (new Date(expectedClosingDate) <= new Date(startDate)) {
      showSnackbar("Expected closing date must be after start date", "error");
      return;
    }

    try {
      await jobsService.updateJob(id!, {
        title,
        description,
        department,
        branch,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t),
        expected_closing_date: expectedClosingDate,
      });
      showSnackbar("Job updated successfully!", "success");
      navigate(`/${tenant}/ats/jobs/${id}`); // Updated to shortlist path
    } catch (err: any) {
      // Modified error handling
      setError(err.message); // Modified error handling
      showSnackbar("Failed to update job", "error"); // Kept snackbar for consistency
    }
  };

  if (loading) {
    return (
      <AuroraBox sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <AuroraCircularProgress />
      </AuroraBox>
    );
  }

  return (
    <AuroraBox sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <AuroraButton
        startIcon={<AuroraArrowBackIcon />}
        onClick={() => navigate(`/${tenant}/ats/jobs/${id}`)}
        sx={{ mb: 2 }}
      >
        Back to Job
      </AuroraButton>
      <AuroraTypography variant="h4" gutterBottom>
        Edit Job
      </AuroraTypography>
      {error && (
        <AuroraAlert severity="error" sx={{ mb: 2 }}>
          {error}
        </AuroraAlert>
      )}{" "}
      {/* Added */}
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
            />
            {/* Removed original Department and Branch TextFields */}
            <AuroraInput
              fullWidth
              label="Job Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              multiline
              rows={6}
              margin="normal"
            />
            <AuroraBox sx={{ display: "flex", gap: 2 }}>
              <AuroraInput
                fullWidth
                label="Start Date"
                type="date"
                value={startDate}
                disabled
                margin="normal"
                InputLabelProps={{ shrink: true }}
                helperText="Start date cannot be changed"
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
                onClick={() => navigate(`/${tenant}/ats/jobs/${id}`)}
              >
                Cancel
              </AuroraButton>
              <AuroraButton
                type="submit"
                variant="contained"
                startIcon={<AuroraSaveIcon />}
              >
                Save Changes
              </AuroraButton>
            </AuroraBox>
          </form>
        </AuroraCardContent>
      </AuroraCard>
    </AuroraBox>
  );
}
