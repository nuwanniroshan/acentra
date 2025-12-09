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
  AuroraPopover,
  AuroraCloseIcon,
  AuroraCard,
  AuroraCardContent,
} from "@acentra/aurora-design-system";
import { CandidateDetailsDrawer } from "@/components/CandidateDetailsDrawer";
import { CardActionArea } from "@mui/material";

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  cv_file_path: string;
  profile_picture?: string;
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

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [pipelineStatuses, setPipelineStatuses] = useState<
    { id: string; value: string; label: string }[]
  >([]);

  useEffect(() => {
    loadJob();
    loadStatuses();
    loadCandidates();
  }, [id]);

  const loadStatuses = async () => {
    try {
      const data = await pipelineService.getPipelineStatuses();
      // Map backend status to column format if needed, or just use as is
      // Backend returns { id, value, label, order }
      // We need to map 'value' to 'id' for COLUMNS usage if we want to keep structure similar
      // But COLUMNS was { id: "new", label: "Applied" } where id was the value.
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
    } catch (err) {
      showSnackbar("Failed to update status", "error");
    }
  };

  const handleDeleteJob = async () => {
    try {
      await jobsService.deleteJob(id!);
      showSnackbar("Job deleted successfully", "success");
      navigate(`/${tenant}/dashboard`);
    } catch (err) {
      showSnackbar("Failed to delete job", "error");
    }
    setShowDeleteDialog(false);
  };

  const handleCloseJob = async () => {
    try {
      await jobsService.closeJob(id!);
      showSnackbar("Job closed successfully", "success");
      loadJob();
    } catch (err) {
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

  const canManageJob = () => {
    if (!job) return false;
    // Admin/HR have full access to all jobs
    if (user.role === "admin" || user.role === "hr") {
      return true;
    }
    // Engineering Manager has full access to jobs they created
    if (user.role === "engineering_manager" && job.created_by?.id === user.id) {
      return true;
    }
    return false;
  };

  const canAddCandidate = () => {
    if (!job) return false;
    // Admin/HR can add candidates to all jobs
    if (user.role === "admin" || user.role === "hr") {
      return true;
    }
    // Engineering Manager can add candidates to jobs they created
    if (user.role === "engineering_manager" && job.created_by?.id === user.id) {
      return true;
    }
    // Assigned recruiters can add candidates (match by email due to user ID mismatch)
    if (job.assignees?.some((assignee: any) => assignee.email === user.email)) {
      return true;
    }
    return false;
  };

  const isJobClosed = job?.status === "closed";

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
                  <AuroraBox
                    key={index}
                    sx={{
                      bgcolor: "action.hover",
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: "0.75rem",
                      color: "text.secondary",
                    }}
                  >
                    {tag}
                  </AuroraBox>
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

              {job.assignees && job.assignees.length > 0 && (
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
              )}

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
            {!isJobClosed && canAddCandidate() && (
              <AuroraButton
                variant="contained"
                onClick={() =>
                  navigate(`/${tenant}/shortlist/jobs/${id}/add-candidate`)
                }
              >
                Add Candidate
              </AuroraButton>
            )}
            {canManageJob() && (
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
                pr: 3,
              }}
            >
              {/* Column Header */}
              <AuroraBox
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                  px: 1,
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
                      key={candidate.id}
                      onClick={() => setSelectedCandidate(candidate)}
                    >
                      <CardActionArea>
                        <AuroraCardContent>
                          <AuroraBox sx={{ display: "flex", gap: 1, mb: 1 }}>
                            <AuroraAvatar
                              src={
                                candidate.profile_picture
                                  ? `${API_BASE_URL}/${candidate.profile_picture}`
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
      {showAssignmentModal && (
        <UserAssignmentModal
          jobId={job.id}
          currentAssignees={job.assignees || []}
          onClose={() => setShowAssignmentModal(false)}
          onAssign={() => {
            loadJob();
            showSnackbar("Assignments updated!", "success");
          }}
        />
      )}

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
      {showPdfModal && job.jdFilePath && (
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
              <iframe
                src={`${API_BASE_URL}/${job.jdFilePath}`}
                width="100%"
                height="100%"
                style={{ border: "none" }}
                title="Job Description PDF"
              />
            </AuroraBox>
          </AuroraBox>
        </AuroraBox>
      )}

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
        <AuroraMenuItem onClick={handleEdit}>Edit Job</AuroraMenuItem>
        <AuroraMenuItem onClick={handleAssignUsers}>
          Assign Recruiter
        </AuroraMenuItem>
        {job.jdFilePath && (
          <AuroraMenuItem onClick={handleViewJD}>View JD</AuroraMenuItem>
        )}
        <AuroraMenuItem
          onClick={handleDeleteFromMenu}
          sx={{ color: "error.main" }}
        >
          Delete Job
        </AuroraMenuItem>
      </AuroraMenu>

      {/* Edit Job Modal */}
      {job && (
        <EditJobModal
          job={job}
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onUpdate={() => {
            loadJob();
          }}
        />
      )}

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
        </AuroraBox>
      </AuroraPopover>
    </AuroraBox>
  );
}
