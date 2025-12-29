import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jobsService } from "@/services/jobsService";
import { usersService } from "@/services/usersService";
import { API_BASE_URL } from "@/services/clients";
import { useSnackbar } from "@/context/SnackbarContext";
import { useTenant } from "@/context/TenantContext";
import { useAuth } from "@/context/AuthContext";
import {
  AuroraBox,
  AuroraTypography,
  AuroraButton,
  AuroraCard,
  AuroraCardContent,
  AuroraChip,
  AuroraCircularProgress,
  AuroraAlert,
  AuroraDialog,
  AuroraDialogTitle,
  AuroraDialogContent,
  AuroraDialogContentText,
  AuroraDialogActions,
  AuroraInput,
  AuroraAvatar,
  AuroraStack,
  AuroraDivider,
  AuroraArrowBackIcon,
} from "@acentra/aurora-design-system";
import { UserRole, ActionPermission } from "@acentra/shared-types";
import type { Job } from "@/services/jobsService";



export function PendingJobApproval() {
  const { id } = useParams();
  const navigate = useNavigate();
  const tenant = useTenant();
  const { showSnackbar } = useSnackbar();
  const { hasPermission } = useAuth();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jdUrl, setJdUrl] = useState<string | null>(null);
  const [jdError, setJdError] = useState<string | null>(null);

  // Approval Workflow State
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");
  const [approvalCommentInput, setApprovalCommentInput] = useState("");
  const [rejectionReasonInput, setRejectionReasonInput] = useState("");

  const [recruitersList, setRecruitersList] = useState<any[]>([]);
  const [selectedRecruiters, setSelectedRecruiters] = useState<string[]>([]);

  const isApprover = hasPermission(ActionPermission.MANAGE_ALL_JOBS);

  useEffect(() => {
    let url: string | null = null;
    const loadJd = async () => {
      if (!job || !job.jdFilePath) return;
      try {
        const rawBlob = await jobsService.getJobJd(job.id);

        // Check for error responses masquerading as blobs
        if (rawBlob.type === 'application/json') {
          throw new Error('Received JSON instead of file');
        }

        // If the backend returns a generic stream type, default to PDF to encourage browser preview
        let blob = rawBlob;
        if (rawBlob.type === 'application/octet-stream') {
          blob = new Blob([rawBlob], { type: 'application/pdf' });
        }

        url = URL.createObjectURL(blob);
        setJdUrl(url);
      } catch (err) {
        console.error("Failed to load JD", err);
        setJdError("Failed to load document");
      }
    };

    if (job?.jdFilePath && !jdUrl) {
      loadJd();
    }

    // Cleanup function to revoke URL when component unmounts
    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [job?.id, job?.jdFilePath]); // Only depend on ID and path, not the whole job object

  const loadJob = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await jobsService.getJob(id!);
      setJob(data);
      if (data.budget) {
        setBudgetInput(data.budget.toString());
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load job");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadRecruiters = useCallback(async () => {
    try {
      const data = await usersService.getUsersByRole(UserRole.RECRUITER);
      setRecruitersList(data);
    } catch (err) {
      console.error("Failed to load recruiters", err);
    }
  }, []);

  useEffect(() => {
    loadJob();
    loadRecruiters();
  }, [loadJob, loadRecruiters]);

  const handleApproveWithBudget = async () => {
    if (!budgetInput) {
      showSnackbar("Budget is required", "error");
      return;
    }

    if (selectedRecruiters.length === 0) {
      showSnackbar("At least one recruiter must be assigned", "error");
      return;
    }

    try {
      const budget = parseFloat(budgetInput);
      await jobsService.approveJob(
        id!,
        budget,
        approvalCommentInput,
        selectedRecruiters
      );
      showSnackbar("Job approved successfully", "success");
      setApproveModalOpen(false);
      navigate(`/${tenant}/ats/jobs/${id}`); // Redirect to details
    } catch (err: any) {
      showSnackbar(err.message || "Failed to approve job", "error");
    }
  };

  const handleRejectJob = async () => {
    if (!rejectionReasonInput.trim()) {
      showSnackbar("Rejection reason is required", "error");
      return;
    }
    try {
      await jobsService.rejectJob(id!, rejectionReasonInput);
      showSnackbar("Job rejected successfully", "success");
      setRejectModalOpen(false);
      navigate(`/${tenant}/ats/jobs`); // Redirect back to list
    } catch (err: any) {
      showSnackbar(err.message || "Failed to reject job", "error");
    }
  };

  const toggleRecruiterSelection = (recruiterId: string) => {
    setSelectedRecruiters((prev) =>
      prev.includes(recruiterId)
        ? prev.filter((id) => id !== recruiterId)
        : [...prev, recruiterId]
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <AuroraBox sx={{ display: "flex", justifyContent: "center", p: 8 }}>
        <AuroraCircularProgress />
      </AuroraBox>
    );
  }

  if (error || !job) {
    return (
      <AuroraBox sx={{ p: 3 }}>
        <AuroraAlert severity="error">{error || "Job not found"}</AuroraAlert>
        <AuroraButton
          onClick={() => navigate(`/${tenant}/ats/jobs`)}
          sx={{ mt: 2 }}
        >
          Back to Jobs
        </AuroraButton>
      </AuroraBox>
    );
  }

  return (
    <AuroraBox sx={{ p: 4, maxWidth: 1200, mx: "auto" }}>
      <AuroraBox
        sx={{
          mb: 4,
        }}
      >
        <AuroraBox>
          <AuroraTypography variant="h4" fontWeight="bold">
            {isApprover ? "Approve Job Request" : "Job Details (Pending Approval)"}
          </AuroraTypography>
          <AuroraButton
            startIcon={<AuroraArrowBackIcon />}
            onClick={() => navigate(`/${tenant}/ats/jobs`)}
            sx={{ mb: 2, mt: 1 }}
          >
            Back to Jobs
          </AuroraButton>
          <AuroraTypography variant="body1" color="text.secondary">
            {isApprover
              ? "Review the details below and approve or reject the job opening."
              : "This job is currently pending approval from an administrator."}
          </AuroraTypography>
        </AuroraBox>
      </AuroraBox>

      <AuroraBox
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
          gap: 4,
        }}
      >
        {/* Left Column: JD and Details */}
        <AuroraBox sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {/* Basic Info Card */}
          <AuroraCard>
            <AuroraCardContent>
              <AuroraTypography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                {job.title}
              </AuroraTypography>

              <AuroraStack
                direction="row"
                flexWrap="wrap"
                gap={2}
                sx={{ mb: 3 }}
              >
                <AuroraChip label={job.department || "No Department"} status="neutral" />
                <AuroraChip label={job.branch || "No Branch"} status="neutral" />
                {job.tags?.map((tag) => (
                  <AuroraChip key={tag} label={tag} status="neutral" variant="outlined" />
                ))}
              </AuroraStack>

              <AuroraDivider sx={{ my: 2 }} />

              <AuroraBox
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
              >
                <AuroraBox>
                  <AuroraTypography variant="caption" color="text.secondary">
                    Start Date
                  </AuroraTypography>
                  <AuroraTypography variant="body1" fontWeight="medium">
                    {formatDate(job.start_date)}
                  </AuroraTypography>
                </AuroraBox>
                <AuroraBox>
                  <AuroraTypography variant="caption" color="text.secondary">
                    Expected Closing
                  </AuroraTypography>
                  <AuroraTypography variant="body1" fontWeight="medium">
                    {formatDate(job.expected_closing_date)}
                  </AuroraTypography>
                </AuroraBox>
                <AuroraBox>
                  <AuroraTypography variant="caption" color="text.secondary">
                    Budget
                  </AuroraTypography>
                  <AuroraTypography variant="body1" fontWeight="medium">
                    {job.budget ? `$${job.budget.toLocaleString()}` : "Not set"}
                  </AuroraTypography>
                </AuroraBox>
              </AuroraBox>
            </AuroraCardContent>
          </AuroraCard>

          {/* JD Viewer */}
          <AuroraCard
            sx={{
              flexGrow: 1,
              minHeight: 600,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <AuroraCardContent
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                p: 0,
              }}
            >
              <AuroraBox
                sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}
              >
                <AuroraTypography variant="h6" fontWeight="bold">
                  Job Description
                </AuroraTypography>
              </AuroraBox>
              <AuroraBox
                sx={{ flexGrow: 1, bgcolor: "grey.100", minHeight: 500 }}
              >
                {jdUrl ? (
                  <iframe
                    src={jdUrl}
                    width="100%"
                    height="100%"
                    style={{ border: "none", minHeight: "600px" }}
                    title="Job Description"
                  />
                ) : (
                  <AuroraBox
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    {jdError ? (
                      <AuroraTypography color="error">
                        {jdError}
                      </AuroraTypography>
                    ) : (
                      <AuroraTypography color="text.secondary">
                        {job.jdFilePath
                          ? "Loading Document..."
                          : "No Job Description Document Attached"}
                      </AuroraTypography>
                    )}
                  </AuroraBox>
                )}
              </AuroraBox>
            </AuroraCardContent>
          </AuroraCard>
        </AuroraBox>

        {/* Right Column: Actions and Requestor */}
        <AuroraBox sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {/* Actions Card */}
          {isApprover ? (
            <AuroraCard>
              <AuroraCardContent>
                <AuroraTypography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  Actions
                </AuroraTypography>
                <AuroraTypography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Please review the job details carefully before approving.
                </AuroraTypography>

                <AuroraStack direction="column" spacing={2}>
                  <AuroraButton
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    onClick={() => setApproveModalOpen(true)}
                  >
                    Approve Job
                  </AuroraButton>
                  <AuroraButton
                    variant="outlined"
                    color="error"
                    fullWidth
                    size="large"
                    onClick={() => setRejectModalOpen(true)}
                  >
                    Reject Job
                  </AuroraButton>
                </AuroraStack>
              </AuroraCardContent>
            </AuroraCard>
          ) : (
            <AuroraCard>
              <AuroraCardContent>
                <AuroraAlert severity="warning" title="Pending Approval">
                  This job is currently pending approval.
                </AuroraAlert>
                <AuroraTypography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  You will be notified once the job is approved or rejected by an administrator.
                </AuroraTypography>
              </AuroraCardContent>
            </AuroraCard>
          )}

          {/* Requestor Info */}
          <AuroraCard>
            <AuroraCardContent>
              <AuroraTypography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Requestor
              </AuroraTypography>
              <AuroraBox sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <AuroraAvatar
                  src={
                    job.created_by?.profile_picture
                      ? `${API_BASE_URL}/api/${job.created_by?.profile_picture}`
                      : undefined
                  }
                  sx={{ width: 48, height: 48 }}
                >
                  {job.created_by?.name?.charAt(0) ||
                    job.created_by?.email?.charAt(0)}
                </AuroraAvatar>
                <AuroraBox>
                  <AuroraTypography variant="subtitle1" fontWeight="bold">
                    {job.created_by?.name || "Unknown"}
                  </AuroraTypography>
                  <AuroraTypography variant="body2" color="text.secondary">
                    {job.created_by?.email}
                  </AuroraTypography>
                  <AuroraChip
                    label="Hiring Lead"
                    status="primary"
                    variant="outlined"
                    sx={{ mt: 0.5 }}
                  />
                </AuroraBox>
              </AuroraBox>
            </AuroraCardContent>
          </AuroraCard>
        </AuroraBox>
      </AuroraBox>

      {/* Approve Modal */}
      <AuroraDialog
        open={approveModalOpen}
        onClose={() => setApproveModalOpen(false)}
      >
        <AuroraDialogTitle>Approve Job Opening</AuroraDialogTitle>
        <AuroraDialogContent>
          <AuroraDialogContentText sx={{ mb: 2 }}>
            Set the approved budget and assign recruiters to proceed.
          </AuroraDialogContentText>

          <AuroraBox sx={{ mb: 3 }}>
            <AuroraTypography variant="subtitle2" sx={{ mb: 1 }}>
              Approved Budget ($)
            </AuroraTypography>
            <AuroraInput
              type="number"
              fullWidth
              placeholder="Enter budget amount"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
            />
          </AuroraBox>

          <AuroraBox sx={{ mb: 3 }}>
            <AuroraTypography variant="subtitle2" sx={{ mb: 1 }}>
              Reason / Comment
            </AuroraTypography>
            <AuroraInput
              fullWidth
              placeholder="Optional approval note"
              value={approvalCommentInput}
              onChange={(e) => setApprovalCommentInput(e.target.value)}
            />
          </AuroraBox>

          <AuroraBox>
            <AuroraTypography variant="subtitle2" sx={{ mb: 1 }}>
              Assign Recruiters (Mandatory)
            </AuroraTypography>
            <AuroraBox
              sx={{
                maxHeight: 200,
                overflowY: "auto",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                p: 1,
              }}
            >
              {recruitersList.map((recruiter) => (
                <AuroraBox
                  key={recruiter.id}
                  onClick={() => toggleRecruiterSelection(recruiter.id)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    p: 1,
                    cursor: "pointer",
                    bgcolor: selectedRecruiters.includes(recruiter.id)
                      ? "primary.lighter"
                      : "transparent",
                    borderRadius: 1,
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  <AuroraAvatar
                    src={
                      recruiter.profile_picture
                        ? `${API_BASE_URL}/api/${recruiter.profile_picture}`
                        : undefined
                    }
                    sx={{ width: 24, height: 24 }}
                  >
                    {recruiter.name?.[0] || recruiter.email[0]}
                  </AuroraAvatar>
                  <AuroraTypography variant="body2">
                    {recruiter.name || recruiter.email}
                  </AuroraTypography>
                  {selectedRecruiters.includes(recruiter.id) && (
                    <AuroraBox
                      sx={{
                        ml: "auto",
                        color: "primary.main",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                      }}
                    >
                      SELECTED
                    </AuroraBox>
                  )}
                </AuroraBox>
              ))}
              {recruitersList.length === 0 && (
                <AuroraTypography
                  variant="body2"
                  color="text.secondary"
                  sx={{ p: 1 }}
                >
                  No recruiters found.
                </AuroraTypography>
              )}
            </AuroraBox>
          </AuroraBox>
        </AuroraDialogContent>
        <AuroraDialogActions>
          <AuroraButton onClick={() => setApproveModalOpen(false)}>
            Cancel
          </AuroraButton>
          <AuroraButton onClick={handleApproveWithBudget} variant="contained">
            Approve
          </AuroraButton>
        </AuroraDialogActions>
      </AuroraDialog>

      {/* Reject Modal */}
      <AuroraDialog
        open={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
      >
        <AuroraDialogTitle>Reject Job Opening</AuroraDialogTitle>
        <AuroraDialogContent>
          <AuroraDialogContentText sx={{ mb: 2 }}>
            Please provide a reason for rejecting this job request. This will be
            sent to the requestor.
          </AuroraDialogContentText>
          <AuroraInput
            fullWidth
            multiline
            rows={4}
            placeholder="Reason for rejection..."
            value={rejectionReasonInput}
            onChange={(e) => setRejectionReasonInput(e.target.value)}
          />
        </AuroraDialogContent>
        <AuroraDialogActions>
          <AuroraButton onClick={() => setRejectModalOpen(false)}>
            Cancel
          </AuroraButton>
          <AuroraButton
            onClick={handleRejectJob}
            color="error"
            variant="contained"
          >
            Reject Job
          </AuroraButton>
        </AuroraDialogActions>
      </AuroraDialog>
    </AuroraBox>
  );
}
