import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jobsService } from "@/services/jobsService";
import { pipelineService } from "@/services/pipelineService";
import { candidatesService } from "@/services/candidatesService";
import { API_BASE_URL } from "@/services/clients";
import { useSnackbar } from "@/context/SnackbarContext";
import { useTenant } from "@/context/TenantContext";
import { UserAssignmentModal } from "@/components/UserAssignmentModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EditJobModal } from "@/components/EditJobModal";
import {
  AuroraBox,
  AuroraTypography,
  AuroraButton,
  AuroraMenuItem,
  AuroraIconButton,
  AuroraAlert,
  AuroraCircularProgress,
  AuroraAvatar,
  AuroraMenu,
  AuroraMoreHorizIcon,
  AuroraLiveIconBadgeAlert,
  AuroraLiveIconGlobe,
  AuroraPopover,
  AuroraCloseIcon,
  AuroraCard,
  AuroraCardContent,
  AuroraChip,
  AuroraAddIcon,
  AuroraDialog,
  AuroraDialogTitle,
  AuroraDialogContent,
  AuroraDialogActions,
  AuroraDivider,
  alpha,
} from "@acentra/aurora-design-system";
import { CandidateDetailsDrawer } from "@/components/CandidateDetailsDrawer";
import { CardActionArea } from "@mui/material";
import { ActionPermission, JobStatus } from "@acentra/shared-types";
import { useAuth } from "@/context/AuthContext";

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  cv_file_path?: string;
  profile_picture?: string;
  ai_match_score?: number;
  created_at: string;
}

interface Job {
  id: string;
  title: string;
  description: string;
  status: string;
  department?: string;
  branch?: string;
  tags?: string[];
  start_date: string;
  expected_closing_date: string;
  actual_closing_date?: string;
  jdFilePath?: string;
  created_by: { id: string; email: string; name?: string };
  assignees: { id: string; email: string; name?: string }[];
  budget?: number;
  rejectionReason?: string;
  approved_by?: { id: string; name?: string; email: string };
  approved_at?: string;
  approval_comment?: string;
  rejected_by?: { id: string; name?: string; email: string };
  rejected_at?: string;
}

export function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const tenant = useTenant();
  const { showSnackbar } = useSnackbar();
  const [job, setJob] = useState<Job | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [descriptionAnchorEl, setDescriptionAnchorEl] =
    useState<null | HTMLElement>(null);
  const [jdUrl, setJdUrl] = useState<string | null>(null);
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);

  /* const user = JSON.parse(localStorage.getItem("user") || "{}"); // Removed in favor of useAuth */
  const { user, hasPermission } = useAuth(); // Use useAuth hook

  const [pipelineStatuses, setPipelineStatuses] = useState<
    { id: string; value: string; label: string }[]
  >([]);

  useEffect(() => {
    loadJob();
    loadStatuses();
    loadCandidates();
    setJdUrl(null);
  }, [id]);



  useEffect(() => {
    const loadJd = async () => {
      if (!job || !job.jdFilePath) return;
      try {
        const blob = await jobsService.getJobJd(job.id);
        const url = URL.createObjectURL(blob);
        setJdUrl(url);
      } catch (err) {
        console.error("Failed to load JD", err);
      }
    };

    if (showPdfModal && job?.jdFilePath && !jdUrl) {
      loadJd();
    }
  }, [showPdfModal, job, jdUrl]);

  const loadStatuses = async () => {
    try {
      const data = await pipelineService.getPipelineStatuses();
      setPipelineStatuses(
        data.map((s: any) => ({ id: s.value, value: s.value, label: s.label }))
      );
    } catch (err) {
      console.error("Failed to load statuses", err);
    }
  };

  const loadCandidates = async () => {
    try {
      if (!id) return;
      const data = await candidatesService.getCandidatesByJobId(id);
      setCandidates(data);
    } catch (err) {
      console.error("Failed to load candidates", err);
    }
  };

  const loadJob = async () => {
    try {
      setError(null);
      const data = await jobsService.getJob(id!);
      setJob(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load job");
    }
  };

  const handleStatusChange = async (candidateId: string, newStatus: string) => {
    try {
      await candidatesService.updateCandidateStatus(candidateId, newStatus);
      loadJob();
      loadCandidates();
      if (selectedCandidate?.id === candidateId) {
        setSelectedCandidate((prev) =>
          prev ? { ...prev, status: newStatus } : null
        );
      }
    } catch {
      showSnackbar("Failed to update status", "error");
    }
  };

  const handleDeleteJob = async () => {
    try {
      await jobsService.deleteJob(id!);
      showSnackbar("Job deleted successfully", "success");
      navigate(`/${tenant}/dashboard`);
    } catch {
      showSnackbar("Failed to delete job", "error");
    }
    setShowDeleteDialog(false);
  };

  const handleCloseJob = async () => {
    try {
      await jobsService.closeJob(id!);
      showSnackbar("Job closed successfully", "success");
      loadJob();
    } catch {
      showSnackbar("Failed to close job", "error");
    }
    setShowCloseDialog(false);
  };



  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDescriptionClick = (event: React.MouseEvent<HTMLElement>) => {
    setDescriptionAnchorEl(event.currentTarget);
  };

  const handleDescriptionClose = () => {
    setDescriptionAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    setEditModalOpen(true);
  };

  const handleDeleteFromMenu = () => {
    handleMenuClose();
    setShowDeleteDialog(true);
  };

  const handleAssignUsers = () => {
    handleMenuClose();
    setShowAssignmentModal(true);
  };

  const handleViewJD = () => {
    handleMenuClose();
    setShowPdfModal(true);
  };

  const handleViewDecisionDetails = () => {
    handleMenuClose();
    setDecisionModalOpen(true);
  };

  const canManageJob = () => {
    if (!job || !user) return false;

    // Admins/HR have global management permission
    if (hasPermission(ActionPermission.MANAGE_ALL_JOBS)) {
      return true;
    }

    // Hiring managers (or those with CREATE_JOBS) can manage their own jobs
    if (hasPermission(ActionPermission.CREATE_JOBS) && job.created_by?.id === user.id) {
      return true;
    }

    return false;
  };

  const canAddCandidate = () => {
    if (!job || !user) return false;

    // Only assigned recruiters can add candidates
    if (job.assignees?.some((assignee: any) => assignee.id === user.id)) {
      return true;
    }

    return false;
  };

  const isJobClosed = job?.status?.toLowerCase() === "closed";

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (error) {
    return (
      <AuroraBox sx={{ p: 3 }}>
        <AuroraAlert severity="error">{error}</AuroraAlert>
      </AuroraBox>
    );
  }

  if (!job) {
    return (
      <AuroraBox sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <AuroraCircularProgress />
      </AuroraBox>
    );
  }

  const candidatesByStatus = pipelineStatuses.reduce(
    (acc, col) => {
      acc[col.id] = candidates.filter((c) => c.status === col.id);
      return acc;
    },
    {} as Record<string, Candidate[]>
  );

  return (
    <AuroraBox
      sx={{
        p: 3,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      {/* Header */}
      <AuroraBox sx={{ mb: 4 }}>
        <AuroraBox
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <AuroraBox>
            <AuroraBox
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
            >
              <AuroraTypography variant="h6" sx={{ fontWeight: 700 }}>
                {job.title}
              </AuroraTypography>
              <AuroraIconButton
                size="small"
                onClick={handleDescriptionClick}
                sx={{ color: "text.secondary" }}
              >
                <AuroraLiveIconBadgeAlert
                  width={16}
                  height={16}
                  stroke={"#000000"}
                />
              </AuroraIconButton>
            </AuroraBox>
            <AuroraBox
              sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
            >
              <AuroraTypography variant="body2" color="text.secondary">
                {job.department || "Department"} &nbsp;•&nbsp;{" "}
                {job.branch || "Branch"}
              </AuroraTypography>
              {job.tags &&
                job.tags.map((tag, index) => (
                  <AuroraChip key={index} label={tag} size="small" />
                ))}
            </AuroraBox>

            <AuroraBox
              sx={{ display: "flex", gap: 4, flexWrap: "wrap", mt: 2 }}
            >
              <AuroraBox sx={{ display: "flex", gap: 0.5 }}>
                <AuroraTypography variant="subtitle2" fontWeight="bold">
                  {candidates.length}
                </AuroraTypography>
                <AuroraTypography variant="body2" color="text.secondary">
                  Candidates
                </AuroraTypography>
              </AuroraBox>

              <AuroraBox sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AuroraTypography variant="body2" color="text.secondary">
                  Hiring Lead:
                </AuroraTypography>
                <AuroraTypography variant="subtitle2" fontWeight="bold">
                  {job.created_by?.name ||
                    job.created_by?.email?.split("@")[0] ||
                    "Unknown"}
                </AuroraTypography>
              </AuroraBox>
              {/** TODO: Display assigned recruiters */}
              {/* {job.assignees && job.assignees.length > 0 && (
                <AuroraBox
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <AuroraTypography variant="body2" color="text.secondary">
                    Recruiters:
                  </AuroraTypography>
                  <AuroraBox sx={{ display: "flex", gap: 1 }}>
                    {job.assignees.map((assignee: any) => (
                      <AuroraTypography
                        key={assignee.id}
                        variant="subtitle2"
                        fontWeight="bold"
                      >
                        {assignee.name || assignee.email?.split("@")[0]}
                      </AuroraTypography>
                    ))}
                  </AuroraBox>
                </AuroraBox>
              )} */}

              <AuroraBox sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AuroraTypography variant="body2" color="text.secondary">
                  Timeline:
                </AuroraTypography>
                <AuroraTypography variant="subtitle2" fontWeight="bold">
                  {formatDate(job.start_date)} -{" "}
                  {formatDate(job.expected_closing_date)}
                </AuroraTypography>
              </AuroraBox>
            </AuroraBox>
          </AuroraBox>

          <AuroraBox sx={{ display: "flex", alignItems: "center", gap: 2 }}>



            {job.status?.toLowerCase() === "open" && (
              <AuroraButton
                variant="outlined"
                color="inherit"
                startIcon={<AuroraLiveIconGlobe width={18} height={18} />}
                onClick={() => window.open(`/public/careers/${tenant}/jobs/${id}`, '_blank')}
                sx={{
                  borderRadius: "2px", // Fixed: Matches the internal dashboard's sharp corners
                  borderColor: "divider",
                  color: "text.secondary",
                  px: 2,
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: "primary.main",
                    color: "primary.main",
                    backgroundColor: alpha("#3385F0", 0.04),
                  },
                  transition: "all 0.2s ease-in-out"
                }}
              >
                Public Page
              </AuroraButton>
            )}
            {!isJobClosed && canAddCandidate() && job.status?.toLowerCase() === "open" && (
              <AuroraButton
                variant="contained"
                startIcon={<AuroraAddIcon />}
                onClick={() =>
                  navigate(`/${tenant}/ats/jobs/${id}/add-candidate`)
                }
              >
                Add Candidate
              </AuroraButton>
            )}
            {/* Show menu if user can manage job OR if there is a JD to view */}
            {(canManageJob() || job.jdFilePath) && (
              <AuroraIconButton
                onClick={handleMenuOpen}
                sx={{
                  width: 40,
                  height: 40,
                }}
              >
                <AuroraMoreHorizIcon />
              </AuroraIconButton>
            )}
          </AuroraBox>
        </AuroraBox>


      </AuroraBox>

      {/* Kanban Board */}
      <AuroraBox
        sx={{
          display: "flex",
          gap: 3,
          overflowX: "auto",
          pb: 2,
          flexGrow: 1,
          minHeight: 0,
        }}
      >
        {pipelineStatuses.length === 0 ? (
          <AuroraBox
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <AuroraTypography variant="h6" color="text.secondary">
              Pipeline not configured
            </AuroraTypography>
            <AuroraTypography variant="body2" color="text.secondary">
              Please configure the pipeline stages in Settings.
            </AuroraTypography>
          </AuroraBox>
        ) : (
          pipelineStatuses.map((col, index) => (
            <AuroraBox
              key={col.id}
              sx={{
                minWidth: 320,
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                height: "100%",
                borderRight:
                  index !== pipelineStatuses.length - 1 ? "1px solid" : "none",
                borderColor: "divider",
                bgcolor: "background.paper",
                p: 0,
              }}
            >
              {/* Column Header */}
              <AuroraBox
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                  py: 1,
                  px: 2,
                  borderBottom: "1px solid",
                  borderBottomColor: "divider",
                }}
              >
                <AuroraBox
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <AuroraTypography variant="subtitle1" fontWeight="bold">
                    {col.label}
                  </AuroraTypography>
                  <AuroraTypography variant="body2" color="text.secondary">
                    ({candidatesByStatus[col.id]?.length || 0})
                  </AuroraTypography>
                </AuroraBox>
              </AuroraBox>

              {/* Column Content */}
              <AuroraBox
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  overflowY: "auto",
                  flexGrow: 1,
                  pr: 1,
                  pb: 2,
                }}
              >
                {candidatesByStatus[col.id]?.map((candidate) => {
                  return (
                    <AuroraCard
                      sx={{
                        mx: 2,
                        my: 1,
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                        },
                      }}
                      key={candidate.id}
                      onClick={() => setSelectedCandidate(candidate)}
                    >
                      <CardActionArea>
                        <AuroraCardContent>
                          <AuroraBox sx={{ display: "flex", gap: 1, mb: 1 }}>
                            <AuroraAvatar
                              src={
                                candidate.profile_picture
                                  ? `${API_BASE_URL}/api/public/${tenant}/candidates/${candidate.id}/profile-picture`
                                  : undefined
                              }
                              sx={{
                                width: 40,
                                height: 40,
                                bgcolor: "primary.light",
                              }}
                            >
                              {!candidate.profile_picture &&
                                `${candidate.name.charAt(0).toUpperCase()}${candidate.name.charAt(1).toUpperCase()}`}
                            </AuroraAvatar>
                            <AuroraBox>
                              <AuroraTypography
                                variant="subtitle1"
                                fontWeight="bold"
                                sx={{ lineHeight: 1.2, mb: 0.25 }}
                              >
                                {candidate.name}
                              </AuroraTypography>
                              <AuroraTypography
                                variant="caption"
                                color="text.secondary"
                              >
                                Date added:{" "}
                                {formatDate(
                                  candidate.created_at ||
                                  new Date().toISOString()
                                )}
                              </AuroraTypography>
                              {candidate.ai_match_score !== null && candidate.ai_match_score !== undefined && (
                                <AuroraBox
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    mt: 1,
                                    px: 1,
                                    py: 0.25,
                                    borderRadius: 1,
                                    bgcolor: alpha("#7c3aed", 0.1),
                                    width: 'fit-content',
                                    border: '1px solid',
                                    borderColor: alpha("#7c3aed", 0.2)
                                  }}
                                >
                                  <AuroraTypography
                                    variant="caption"
                                    sx={{
                                      fontWeight: 800,
                                      color: "#7c3aed",
                                      fontSize: '0.65rem',
                                      textTransform: 'uppercase',
                                      letterSpacing: 0.5
                                    }}
                                  >
                                    Aura Match: {candidate.ai_match_score}%
                                  </AuroraTypography>
                                </AuroraBox>
                              )}
                            </AuroraBox>
                          </AuroraBox>
                        </AuroraCardContent>
                      </CardActionArea>
                    </AuroraCard>
                  );
                })}
              </AuroraBox>
            </AuroraBox>
          ))
        )}
      </AuroraBox>

      {/* Modals & Drawers (Keep functionality) */}
      {
        showAssignmentModal && (
          <UserAssignmentModal
            jobId={job.id}
            currentAssignees={(job.assignees as any) || []}
            onClose={() => setShowAssignmentModal(false)}
            onAssign={() => {
              loadJob();
              showSnackbar("Assignments updated!", "success");
            }}
          />
        )
      }

      <CandidateDetailsDrawer
        candidate={selectedCandidate}
        open={!!selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        onStatusChange={handleStatusChange}
        onUpdate={loadJob}
        statuses={pipelineStatuses.map((s) => ({
          value: s.id,
          label: s.label,
        }))}
      />

      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete Job"
        message="Are you sure you want to delete this job? This action cannot be undone."
        confirmLabel="Delete"
        confirmColor="error"
        onConfirm={handleDeleteJob}
        onCancel={() => setShowDeleteDialog(false)}
      />

      <ConfirmDialog
        open={showCloseDialog}
        title="Close Job"
        message="Are you sure you want to close this job?"
        confirmLabel="Close Job"
        confirmColor="warning"
        onConfirm={handleCloseJob}
        onCancel={() => setShowCloseDialog(false)}
      />

      {/* JD PDF Modal */}
      {
        showPdfModal && job.jdFilePath && (
          <AuroraBox
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 2,
            }}
            onClick={() => setShowPdfModal(false)}
          >
            <AuroraBox
              sx={{
                width: "90%",
                height: "90%",
                bgcolor: "background.paper",
                borderRadius: 2,
                position: "relative",
                overflow: "hidden",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <AuroraBox
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 2,
                  borderBottom: 1,
                  borderColor: "divider",
                }}
              >
                <AuroraTypography variant="h6" fontWeight="bold">
                  Job Description - {job.title}
                </AuroraTypography>
                <AuroraIconButton onClick={() => setShowPdfModal(false)}>
                  <AuroraCloseIcon />
                </AuroraIconButton>
              </AuroraBox>
              <AuroraBox sx={{ height: "calc(100% - 80px)" }}>
                {jdUrl ? (
                  <iframe
                    src={jdUrl}
                    width="100%"
                    height="100%"
                    style={{ border: "none" }}
                    title="Job Description PDF"
                  />
                ) : (
                  <AuroraBox
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <AuroraCircularProgress />
                  </AuroraBox>
                )}
              </AuroraBox>
            </AuroraBox>
          </AuroraBox>
        )
      }

      {/* Dropdown Menu */}
      <AuroraMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {canManageJob() && (
          <AuroraMenuItem onClick={handleEdit}>Edit Job</AuroraMenuItem>
        )}
        {canManageJob() && (
          <AuroraMenuItem onClick={handleAssignUsers}>
            Assign Recruiter
          </AuroraMenuItem>
        )}
        {job.status?.toLowerCase() === "open" && (
          <AuroraMenuItem onClick={() => window.open(`/public/careers/${tenant}/jobs/${id}`, '_blank')}>
            View Public Page
          </AuroraMenuItem>
        )}
        {job.jdFilePath && (
          <AuroraMenuItem onClick={handleViewJD}>View JD</AuroraMenuItem>
        )}
        {canManageJob() && (job.status?.toLowerCase() === "open" || job.status?.toLowerCase() === "rejected") && (job.approved_at || job.rejected_at) && (
          <AuroraMenuItem onClick={handleViewDecisionDetails}>
            View Decision Details
          </AuroraMenuItem>
        )}
        {canManageJob() && (
          <AuroraMenuItem
            onClick={handleDeleteFromMenu}
            sx={{ color: "error.main" }}
          >
            Delete Job
          </AuroraMenuItem>
        )}
      </AuroraMenu>

      {/* Edit Job Modal */}
      {
        job && (
          <EditJobModal
            job={job}
            open={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            onUpdate={() => {
              loadJob();
            }}
          />
        )
      }

      {/* Description Popover */}
      <AuroraPopover
        open={Boolean(descriptionAnchorEl)}
        anchorEl={descriptionAnchorEl}
        onClose={handleDescriptionClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <AuroraBox sx={{ p: 2, maxWidth: 400 }}>
          <AuroraTypography
            variant="subtitle2"
            fontWeight="bold"
            sx={{ mb: 1 }}
          >
            Job Description
          </AuroraTypography>
          <AuroraTypography variant="body2" color="text.primary">
            {job.description}
          </AuroraTypography>

          {canManageJob() && (job.approved_at || job.rejected_at) && (
            <AuroraDivider sx={{ my: 2 }} />
          )}

          {canManageJob() && job.approved_at && (
            <AuroraBox sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <AuroraTypography variant="subtitle2" fontWeight="bold" color="success.main">
                Approval Details
              </AuroraTypography>

              <AuroraBox>
                <AuroraTypography variant="caption" color="text.secondary" display="block">
                  Approved By
                </AuroraTypography>
                <AuroraTypography variant="body2">
                  {job.approved_by?.name || job.approved_by?.email || 'Unknown'}
                </AuroraTypography>
              </AuroraBox>

              <AuroraBox>
                <AuroraTypography variant="caption" color="text.secondary" display="block">
                  Date
                </AuroraTypography>
                <AuroraTypography variant="body2">
                  {new Date(job.approved_at).toLocaleString()}
                </AuroraTypography>
              </AuroraBox>

              {job.budget && (
                <AuroraBox>
                  <AuroraTypography variant="caption" color="text.secondary" display="block">
                    Budget
                  </AuroraTypography>
                  <AuroraTypography variant="body2">
                    ${job.budget.toLocaleString()}
                  </AuroraTypography>
                </AuroraBox>
              )}

              {job.approval_comment && (
                <AuroraBox>
                  <AuroraTypography variant="caption" color="text.secondary" display="block">
                    Comment
                  </AuroraTypography>
                  <AuroraTypography variant="body2">
                    {job.approval_comment}
                  </AuroraTypography>
                </AuroraBox>
              )}
            </AuroraBox>
          )}

          {canManageJob() && job.rejected_at && (
            <AuroraBox sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <AuroraTypography variant="subtitle2" fontWeight="bold" color="error.main">
                Rejection Details
              </AuroraTypography>

              <AuroraBox>
                <AuroraTypography variant="caption" color="text.secondary" display="block">
                  Rejected By
                </AuroraTypography>
                <AuroraTypography variant="body2">
                  {job.rejected_by?.name || job.rejected_by?.email || 'Unknown'}
                </AuroraTypography>
              </AuroraBox>

              <AuroraBox>
                <AuroraTypography variant="caption" color="text.secondary" display="block">
                  Date
                </AuroraTypography>
                <AuroraTypography variant="body2">
                  {new Date(job.rejected_at).toLocaleString()}
                </AuroraTypography>
              </AuroraBox>

              {job.rejectionReason && (
                <AuroraBox>
                  <AuroraTypography variant="caption" color="text.secondary" display="block">
                    Reason
                  </AuroraTypography>
                  <AuroraTypography variant="body2" color="error.main">
                    {job.rejectionReason}
                  </AuroraTypography>
                </AuroraBox>
              )}
            </AuroraBox>
          )}
        </AuroraBox>
      </AuroraPopover>



      {/* Decision Details Modal */}
      <AuroraDialog
        open={decisionModalOpen}
        onClose={() => setDecisionModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <AuroraDialogTitle>Decision Details</AuroraDialogTitle>
        <AuroraDialogContent>
          {job.status === JobStatus.OPEN ? (
            <AuroraBox sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <AuroraBox>
                <AuroraTypography variant="caption" color="text.secondary">Approved By</AuroraTypography>
                <AuroraTypography variant="body1">{job.approved_by?.name || job.approved_by?.email || 'N/A'}</AuroraTypography>
              </AuroraBox>
              <AuroraBox>
                <AuroraTypography variant="caption" color="text.secondary">Approved At</AuroraTypography>
                <AuroraTypography variant="body1">{job.approved_at ? new Date(job.approved_at).toLocaleString() : 'N/A'}</AuroraTypography>
              </AuroraBox>
              <AuroraBox>
                <AuroraTypography variant="caption" color="text.secondary">Budget</AuroraTypography>
                <AuroraTypography variant="body1">{job.budget ? `$${job.budget.toLocaleString()}` : 'N/A'}</AuroraTypography>
              </AuroraBox>
              <AuroraBox>
                <AuroraTypography variant="caption" color="text.secondary">Comments</AuroraTypography>
                <AuroraTypography variant="body1">{job.approval_comment || 'No comments provided'}</AuroraTypography>
              </AuroraBox>
            </AuroraBox>
          ) : (
            <AuroraBox sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <AuroraBox>
                <AuroraTypography variant="caption" color="text.secondary">Rejected By</AuroraTypography>
                <AuroraTypography variant="body1">{job.rejected_by?.name || job.rejected_by?.email || 'N/A'}</AuroraTypography>
              </AuroraBox>
              <AuroraBox>
                <AuroraTypography variant="caption" color="text.secondary">Rejected At</AuroraTypography>
                <AuroraTypography variant="body1">{job.rejected_at ? new Date(job.rejected_at).toLocaleString() : 'N/A'}</AuroraTypography>
              </AuroraBox>
              <AuroraBox>
                <AuroraTypography variant="caption" color="text.secondary">Reason</AuroraTypography>
                <AuroraTypography variant="body1" color="error.main">{job.rejectionReason || 'N/A'}</AuroraTypography>
              </AuroraBox>
            </AuroraBox>
          )}
        </AuroraDialogContent>
        <AuroraDialogActions>
          <AuroraButton onClick={() => setDecisionModalOpen(false)}>
            Close
          </AuroraButton>
        </AuroraDialogActions>
      </AuroraDialog>
    </AuroraBox >
  );
}
