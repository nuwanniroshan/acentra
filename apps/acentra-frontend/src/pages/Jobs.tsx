import { useEffect, useState } from "react";
import { jobsService } from "@/services/jobsService";
import { useNavigate } from "react-router-dom";
import { useTenant } from "@/context/TenantContext";
import { useAuth } from "@/context/AuthContext";
import {
  AuroraBox,
  AuroraTypography,
  AuroraButton,
  AuroraCard,
  AuroraCardContent,
  AuroraChip,
  AuroraIconButton,
  AuroraAvatar,
  AuroraStack,
  AuroraMenu,
  AuroraMenuItem,
  AuroraDialog,
  AuroraDialogTitle,
  AuroraDialogContent,
  AuroraDialogContentText,
  AuroraDialogActions,
  AuroraSearchIcon,
  AuroraMoreHorizIcon,
  AuroraViewModuleIcon,
  AuroraViewListIcon,
  AuroraLiveIconActivity,
  alpha,
} from "@acentra/aurora-design-system";
import { EditJobModal } from "@/components/EditJobModal";
import { UserAssignmentModal } from "@/components/UserAssignmentModal";
import { useSnackbar } from "@/context/SnackbarContext";
import { API_BASE_URL } from "@/services/clients";
import { ActionPermission, JobStatus, UserRole } from "@acentra/shared-types";
import { EmptyState } from "@/components/EmptyState";
import { JobSkeleton } from "@/components/JobSkeleton";
import { AdvancedFilter } from "@/components/AdvancedFilter";
import type { FilterOption } from "@/components/AdvancedFilter";
import { departmentsService } from "@/services/departmentsService";
import { officesService } from "@/services/officesService";
import { usersService } from "@/services/usersService";

interface Job {
  id: string;
  title: string;
  description: string;
  status: string;
  start_date: string;
  expected_closing_date: string;
  actual_closing_date?: string;
  candidates: any[];
  candidatesCount: number;
  created_by: {
    id: string;
    email: string;
    name?: string;
    profile_picture?: string;
  };
  assignees?: { id: string; email: string; name?: string }[];
  department?: string;
  branch?: string;
  tags?: string[];
}

export function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const navigate = useNavigate();
  const tenant = useTenant();
  const { user, hasPermission } = useAuth();
  const { showSnackbar } = useSnackbar();

  const [filterOptions, setFilterOptions] = useState<{
    statuses: FilterOption[];
    departments: FilterOption[];
    branches: FilterOption[];
    recruiters: FilterOption[];
  }>({
    statuses: [
      { value: "OPEN", label: "Open" },
      { value: "CLOSED", label: "Closed" },
      { value: "PENDING", label: "Pending Approval" },
      { value: "REJECTED", label: "Rejected" },
    ],
    departments: [],
    branches: [],
    recruiters: [],
  });

  useEffect(() => {
    loadJobs();
    loadFilterOptions();
  }, []);

  const loadFilterOptions = async () => {
    try {
      const [depts, offices, users] = await Promise.all([
        departmentsService.getDepartments(),
        officesService.getOffices(),
        usersService.getUsers(),
      ]);

      setFilterOptions((prev) => ({
        ...prev,
        departments: depts.map((d: any) => ({ value: d.name, label: d.name })),
        branches: offices.map((o: any) => ({ value: o.name, label: o.name })),
        recruiters: users
          .filter(u => u.role === UserRole.RECRUITER || u.role === UserRole.HR)
          .map((u: any) => ({ value: u.id, label: u.name || u.email })),
      }));
    } catch (err) {
      console.error("Failed to load filter options", err);
    }
  };

  const loadJobs = async (filters?: any) => {
    try {
      setLoading(true);
      setError(null);
      const data = await jobsService.getJobs(filters);
      setJobs(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load jobs");
      showSnackbar("Failed to load jobs", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters: any) => {
    loadJobs(filters);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, job: Job) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedJob(job);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    setEditModalOpen(true);
  };

  const handleDelete = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleAssignRecruiter = () => {
    handleMenuClose();
    setAssignModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedJob) return;

    try {
      await jobsService.deleteJob(selectedJob.id);
      showSnackbar("Job deleted successfully", "success");
      setDeleteDialogOpen(false);
      setSelectedJob(null);
      loadJobs();
    } catch (err: any) {
      showSnackbar(err.message || "Failed to delete job", "error");
    }
  };

  const canManageJob = (job: Job) => {
    if (hasPermission(ActionPermission.MANAGE_ALL_JOBS)) {
      return true;
    }
    if (job.created_by?.id === user?.id) {
      return true;
    }
    return false;
  };



  const getHiringLeadAvatar = (job: Job) => (
    <AuroraAvatar
      src={
        job.created_by?.profile_picture
          ? `${API_BASE_URL}/api/${job.created_by?.profile_picture}`
          : undefined
      }
      sx={{
        width: 32,
        height: 32,
        bgcolor: "primary.light",
        fontSize: "0.875rem",
      }}
    >
      {(job.created_by?.profile_picture &&
        job.created_by?.name?.[0]?.toUpperCase()) ||
        job.created_by?.email?.[0]?.toUpperCase()}
    </AuroraAvatar>
  );

  if (loading) {
    return <JobSkeleton />;
  }

  if (error) {
    return (
      <AuroraBox
        sx={{ maxWidth: 1600, mx: "auto", textAlign: "center", py: 8 }}
      >
        <AuroraTypography variant="h6" color="error">
          {error}
        </AuroraTypography>
        <AuroraButton onClick={loadJobs} sx={{ mt: 2 }}>
          Retry
        </AuroraButton>
      </AuroraBox>
    );
  }

  return (
    <AuroraBox sx={{ maxWidth: 1600, mx: "auto" }}>
      {/* Header Section */}
      <AuroraBox
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <AuroraTypography variant="h5" sx={{ fontWeight: 700 }}>
          Job Openings
        </AuroraTypography>

        <AuroraStack direction="row" spacing={2} alignItems="center">
          {hasPermission(ActionPermission.CREATE_JOBS) && (
            <AuroraButton
              variant="contained"
              onClick={() => navigate(`/${tenant}/create-job`)}
            >
              New opening
            </AuroraButton>
          )}
        </AuroraStack>
      </AuroraBox>

      <AdvancedFilter
        type="jobs"
        onFilterChange={handleFilterChange}
        searchPlaceholder="Search jobs by title, department, or tags..."
        options={filterOptions}
      />

      <AuroraBox sx={{ mb: 4, display: "flex", justifyContent: "flex-end" }}>
        <AuroraBox
          sx={{
            display: "flex",
            bgcolor: "background.paper",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            p: 0.5,
          }}
        >
          <AuroraIconButton
            size="small"
            onClick={() => setViewMode("card")}
            sx={{
              bgcolor: viewMode === "card" ? "primary.main" : "transparent",
              color: viewMode === "card" ? "white" : "text.secondary",
              "&:hover": {
                bgcolor:
                  viewMode === "card" ? "primary.dark" : "action.hover",
              },
            }}
          >
            <AuroraViewModuleIcon fontSize="small" />
          </AuroraIconButton>
          <AuroraIconButton
            size="small"
            onClick={() => setViewMode("list")}
            sx={{
              bgcolor: viewMode === "list" ? "primary.main" : "transparent",
              color: viewMode === "list" ? "white" : "text.secondary",
              "&:hover": {
                bgcolor:
                  viewMode === "list" ? "primary.dark" : "action.hover",
              },
            }}
          >
            <AuroraViewListIcon fontSize="small" />
          </AuroraIconButton>
        </AuroraBox>
      </AuroraBox>

      {/* Job Cards/List View */}
      {jobs.length > 0 ? (
        viewMode === "card" ? (
          <AuroraBox
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(auto-fill, minmax(340px, 1fr))",
              },
              gap: 3,
            }}
          >
            {jobs.map((job) => {
              const candidateCount = job.candidatesCount || 0;

              return (
                <AuroraCard
                  key={job.id}
                  onClick={() => {
                    if (job.status === JobStatus.PENDING_APPROVAL) {
                      navigate(`/${tenant}/ats/jobs/${job.id}/approval`);
                    } else {
                      navigate(`/${tenant}/ats/jobs/${job.id}`);
                    }
                  }}
                  sx={{
                    cursor: "pointer",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    position: "relative",
                    overflow: "hidden",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: (theme) => `0 20px 40px ${alpha(theme.palette.primary.main, 0.12)}`,
                      "& .job-card-overlay": {
                        opacity: 1,
                      },
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "4px",
                      height: "100%",
                      bgcolor: job.status === "OPEN" ? "success.main" : job.status === "PENDING" ? "warning.main" : "text.disabled",
                      borderRadius: "4px 0 0 4px",
                    }
                  }}
                >
                  <AuroraCardContent sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
                    {/* Card Header */}
                    <AuroraBox
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <AuroraBox sx={{ flex: 1 }}>
                        <AuroraStack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                          {job.status === JobStatus.PENDING_APPROVAL ? (
                            <AuroraChip
                              label="Pending Approval"
                              status="warning"
                              size="small"
                            />
                          ) : (
                            <AuroraChip
                              label={job.status.charAt(0).toUpperCase() + job.status.slice(1).toLowerCase()}
                              status={job.status === "OPEN" ? "success" : "neutral"}
                              size="small"
                              variant="outlined"
                            />
                          )}
                          {candidateCount > 10 && (
                            <AuroraChip
                              label="Hot"
                              status="error"
                              size="small"
                              icon={<AuroraLiveIconActivity width={12} height={12} />}
                            />
                          )}
                        </AuroraStack>

                        <AuroraTypography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            mb: 0.5,
                            lineHeight: 1.3,
                            color: "text.primary",
                            fontSize: "1.1rem"
                          }}
                        >
                          {job.title}
                        </AuroraTypography>

                        <AuroraStack direction="row" spacing={1.5} sx={{ color: "text.secondary", mt: 1 }}>
                          <AuroraTypography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 500 }}>
                            <AuroraBox component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main' }} />
                            {job.department || "No Dept"}
                          </AuroraTypography>
                          <AuroraTypography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 500 }}>
                            <AuroraBox component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'secondary.main' }} />
                            {job.branch || "No Branch"}
                          </AuroraTypography>
                        </AuroraStack>
                      </AuroraBox>

                      {canManageJob(job) && (
                        <AuroraIconButton
                          onClick={(e) => handleMenuOpen(e, job)}
                          size="small"
                          sx={{ mt: -0.5, mr: -0.5 }}
                        >
                          <AuroraMoreHorizIcon fontSize="small" />
                        </AuroraIconButton>
                      )}
                    </AuroraBox>

                    {/* Candidate Stats Visualization */}
                    <AuroraBox sx={{ mb: 2 }}>
                      <AuroraTypography variant="body2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                        {candidateCount} Candidates
                      </AuroraTypography>
                    </AuroraBox>

                    {/* Footer Info */}
                    <AuroraStack direction="row" alignItems="center" sx={{ mt: 'auto', pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                      <AuroraBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getHiringLeadAvatar(job)}
                        <AuroraBox>
                          <AuroraTypography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1 }}>
                            Hiring Lead
                          </AuroraTypography>
                          <AuroraTypography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                            {job.created_by?.name || job.created_by?.email?.split("@")[0]}
                          </AuroraTypography>
                          <AuroraTypography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                            Ends {formatDate(job.expected_closing_date)}
                          </AuroraTypography>
                        </AuroraBox>
                      </AuroraBox>
                    </AuroraStack>

                    {/* Quick Tags Section (Optional Glass Effect) */}
                    {job.tags && job.tags.length > 0 && (
                      <AuroraBox sx={{ mt: 2, pt: 1 }}>
                        <AuroraStack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 0.5 }}>
                          {job.tags.slice(0, 3).map((tag, index) => (
                            <AuroraChip
                              key={index}
                              label={tag}
                              status="neutral"
                              size="small"
                              sx={{
                                fontSize: '10px',
                                height: 20,
                                bgcolor: (theme) => alpha(theme.palette.text.primary, 0.04),
                                border: 'none'
                              }}
                            />
                          ))}
                          {job.tags.length > 3 && (
                            <AuroraTypography variant="caption" color="text.disabled" sx={{ alignSelf: 'center', ml: 0.5 }}>
                              +{job.tags.length - 3} more
                            </AuroraTypography>
                          )}
                        </AuroraStack>
                      </AuroraBox>
                    )}
                  </AuroraCardContent>
                </AuroraCard>
              );
            })}
          </AuroraBox>
        ) : (
          <AuroraBox sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {jobs.map((job) => {
              const candidateCount = job.candidatesCount || 0;

              return (
                <AuroraCard
                  key={job.id}
                  onClick={() => {
                    if (job.status === JobStatus.PENDING_APPROVAL) {
                      navigate(`/${tenant}/ats/jobs/${job.id}/approval`);
                    } else {
                      navigate(`/${tenant}/ats/jobs/${job.id}`);
                    }
                  }}
                  sx={{
                    cursor: "pointer",
                    transition: "box-shadow 0.2s",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    },
                  }}
                >
                  <AuroraCardContent sx={{ p: 3 }}>
                    <AuroraBox
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        justifyContent: "space-between",
                        alignItems: { xs: "flex-start", md: "center" },
                        gap: 2,
                      }}
                    >
                      {/* Left Section - Job Info */}
                      <AuroraBox sx={{ flex: 1 }}>
                        {job.status === JobStatus.PENDING_APPROVAL && (
                          <AuroraChip
                            label="Pending Approval"
                            status="warning"
                            sx={{ mb: 1 }}
                          />
                        )}
                        <AuroraTypography
                          variant="body2"
                          sx={{ fontWeight: 700, mb: 0.5 }}
                        >
                          {job.title}
                        </AuroraTypography>
                        <AuroraTypography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          {job.department || "No Dept"} &bull;{" "}
                          {job.branch || "No Branch"}
                        </AuroraTypography>
                        <AuroraStack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap", gap: 1 }}>
                          {job.tags?.map((tag, index) => (
                            <AuroraChip key={index} label={tag} status="neutral" />
                          ))}
                        </AuroraStack>
                      </AuroraBox>

                      {/* Middle Section - Hiring Lead */}
                      <AuroraBox
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          px: 4,
                        }}
                      >
                        {getHiringLeadAvatar(job)}
                        <AuroraBox>
                          <AuroraTypography
                            variant="subtitle2"
                            sx={{ fontWeight: 600 }}
                          >
                            {job.created_by?.name ||
                              job.created_by?.email?.split("@")[0] ||
                              "Unknown User"}
                          </AuroraTypography>
                          <AuroraTypography
                            variant="caption"
                            color="text.secondary"
                          >
                            Hiring Lead
                          </AuroraTypography>
                        </AuroraBox>
                      </AuroraBox>

                      {/* Right Section - Stats and Actions */}
                      <AuroraBox
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: { xs: 2, sm: 4 },
                          width: { xs: "100%", md: "auto" },
                          justifyContent: { xs: "space-between", md: "flex-end" }
                        }}
                      >
                        <AuroraTypography
                          variant="body2"
                          sx={{ fontWeight: 500 }}
                        >
                          {candidateCount} Candidates
                        </AuroraTypography>

                        <AuroraBox sx={{ textAlign: "right", minWidth: 120 }}>
                          <AuroraTypography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block" }}
                          >
                            {formatDate(job.start_date)}
                          </AuroraTypography>
                          <AuroraTypography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block" }}
                          >
                            {formatDate(job.expected_closing_date)}
                          </AuroraTypography>
                        </AuroraBox>

                        {canManageJob(job) && (
                          <AuroraIconButton
                            onClick={(e) => handleMenuOpen(e, job)}
                          >
                            <AuroraMoreHorizIcon />
                          </AuroraIconButton>
                        )}
                      </AuroraBox>
                    </AuroraBox>
                  </AuroraCardContent>
                </AuroraCard>
              );
            })}
          </AuroraBox>
        )
      ) : (
        <EmptyState
          title="No jobs found"
          description="Try adjusting your filters or search query to find what you're looking for."
          icon={<AuroraSearchIcon />}
          action={
            hasPermission(ActionPermission.CREATE_JOBS)
              ? {
                label: "Create Job Opening",
                onClick: () => navigate(`/${tenant}/create-job`),
              }
              : undefined
          }
        />
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
        <AuroraMenuItem onClick={handleEdit}>Edit Job</AuroraMenuItem>
        <AuroraMenuItem onClick={handleAssignRecruiter}>
          Assign Recruiter
        </AuroraMenuItem>
        <AuroraMenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          Delete Job
        </AuroraMenuItem>
      </AuroraMenu>

      {/* Edit Job Modal */}
      {
        selectedJob && (
          <EditJobModal
            job={selectedJob!}
            open={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            onUpdate={() => {
              loadJobs();
              setSelectedJob(null);
            }}
          />
        )
      }

      {/* Assign Recruiter Modal */}
      {
        selectedJob && assignModalOpen && (
          <UserAssignmentModal
            jobId={selectedJob!.id}
            currentAssignees={(selectedJob!.assignees || []) as any}
            onClose={() => setAssignModalOpen(false)}
            onAssign={() => {
              loadJobs();
              setSelectedJob(null);
            }}
          />
        )
      }

      {/* Delete Confirmation Dialog */}
      <AuroraDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <AuroraDialogTitle>Delete Job</AuroraDialogTitle>
        <AuroraDialogContent>
          <AuroraDialogContentText>
            Are you sure you want to delete &quot;{selectedJob?.title}&quot;?
            This action cannot be undone.
          </AuroraDialogContentText>
        </AuroraDialogContent>
        <AuroraDialogActions>
          <AuroraButton onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </AuroraButton>
          <AuroraButton
            onClick={confirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </AuroraButton>
        </AuroraDialogActions>
      </AuroraDialog>
    </AuroraBox >
  );
}
