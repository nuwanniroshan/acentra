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
  const [searchQuery, setSearchQuery] = useState("");
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

  // Filter jobs based on search query
  const filteredJobs = jobs.filter((job) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    const title = job.title?.toLowerCase() || "";
    const department = job.department?.toLowerCase() || "";
    const branch = job.branch?.toLowerCase() || "";
    const hiringManager =
      job.created_by?.name?.toLowerCase() ||
      job.created_by?.email?.toLowerCase() ||
      "";
    const tags = job.tags?.join(" ").toLowerCase() || "";

    return (
      title.includes(query) ||
      department.includes(query) ||
      branch.includes(query) ||
      hiringManager.includes(query) ||
      tags.includes(query)
    );
  });

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
            <AuroraStack direction="row" spacing={1}>
              <AuroraButton
                variant="outlined"
                onClick={() => navigate(`/${tenant}/create-job`)}
              >
                Manual
              </AuroraButton>
              <AuroraButton
                variant="contained"
                onClick={() => navigate(`/${tenant}/create-job-ai`)}
              >
                AI Create
              </AuroraButton>
            </AuroraStack>
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
      {jobs.length === 0 ? (
        <EmptyState
          title="No jobs found"
          description="Try adjusting your filters or search query to find what you're looking for."
          icon={<AuroraSearchIcon />}
          action={
            hasPermission(ActionPermission.CREATE_JOBS)
              ? {
                label: "Create Job",
                onClick: () => navigate(`/${tenant}/create-job`),
              }
              : undefined
          }
        />
      ) : viewMode === "card" ? (
        <AuroraBox
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {jobs.map((job) => {
            const candidateCount = job.candidates?.length || 0;

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
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <AuroraCardContent sx={{ p: 3 }}>
                  {/* Card Header */}
                  <AuroraBox
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 1,
                    }}
                  >
                    <AuroraBox>
                      {job.status === JobStatus.PENDING_APPROVAL && (
                        <AuroraChip
                          label="Pending Approval"
                          size="small"
                          sx={{
                            bgcolor: "warning.main",
                            borderColor: "warning.light",
                            color: "text.primary",
                            mb: 1,
                            maxWidth: "fit-content",
                          }}
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
                      <AuroraTypography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontWeight: 500, display: "block", mb: 2 }}
                      >
                        {formatDate(job.start_date)} -{" "}
                        {formatDate(job.expected_closing_date)}
                      </AuroraTypography>
                    </AuroraBox>
                    <AuroraBox
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      {canManageJob(job) && (
                        <AuroraIconButton
                          onClick={(e) => handleMenuOpen(e, job)}
                        >
                          <AuroraMoreHorizIcon />
                        </AuroraIconButton>
                      )}
                    </AuroraBox>
                  </AuroraBox>

                  {/* Candidates Count */}
                  <AuroraTypography
                    variant="body2"
                    sx={{ fontWeight: 500, mb: 3 }}
                  >
                    {candidateCount} Candidates
                  </AuroraTypography>

                  {/* Hiring Lead */}
                  <AuroraBox
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      mb: 3,
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

                  {/* Tags */}
                  <AuroraBox
                    sx={{ display: "flex", alignItems: "center", mt: "auto" }}
                  >
                    <AuroraStack direction="row" spacing={1}>
                      {job.tags?.map((tag, index) => (
                        <AuroraChip key={index} label={tag} size="small" />
                      ))}
                    </AuroraStack>
                  </AuroraBox>
                </AuroraCardContent>
              </AuroraCard>
            );
          })}
        </AuroraBox>
      ) : (
        <AuroraBox sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {jobs.map((job) => {
            const candidateCount = job.candidates?.length || 0;

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
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {/* Left Section - Job Info */}
                    <AuroraBox sx={{ flex: 1 }}>
                      {job.status === JobStatus.PENDING_APPROVAL && (
                        <AuroraChip
                          label="Pending Approval"
                          size="small"
                          color="warning"
                          sx={{
                            fontWeight: "bold",
                            mb: 1,
                            maxWidth: "fit-content",
                          }}
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
                      <AuroraStack direction="row" spacing={1} sx={{ mt: 1 }}>
                        {job.tags?.map((tag, index) => (
                          <AuroraChip key={index} label={tag} size="small" />
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
                      sx={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                      <AuroraTypography
                        variant="body2"
                        sx={{ fontWeight: 500, mb: 3 }}
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
      }

      {
        filteredJobs.length === 0 && jobs.length > 0 && (
          <EmptyState
            title="No jobs match your search"
            description="Try adjusting your keywords or filters to find the job you're looking for."
            icon={<AuroraSearchIcon />}
            action={{
              label: "Clear Search",
              onClick: () => setSearchQuery(""),
            }}
          />
        )
      }

      {
        jobs.length === 0 && !loading && (
          <EmptyState
            title="No job openings found"
            description="Get started by creating your first job opening to begin attracting top talent."
            icon={<AuroraViewModuleIcon />}
            action={{
              label: "Create Job Opening",
              onClick: () => navigate(`/${tenant}/create-job`),
            }}
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
