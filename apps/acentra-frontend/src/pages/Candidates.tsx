import { useState, useEffect } from "react";
import { useTenant } from "@/context/TenantContext";
import {
  AuroraButton,
  AuroraBox,
  AuroraTypography,
  AuroraTable,
  AuroraTableBody,
  AuroraTableCell,
  AuroraTableContainer,
  AuroraTableHead,
  AuroraTableRow,
  AuroraAvatar,
  AuroraChip,
  AuroraLiveIconUsers,
  AuroraAddIcon,
  AuroraUploadIcon,
  AuroraCheckbox,
  AuroraGrid,
  alpha,
} from "@acentra/aurora-design-system";
import { Pagination } from "@mui/material";
import { candidatesService } from "@/services/candidatesService";
import { CandidateDetailsDrawer } from "@/components/CandidateDetailsDrawer";
import { EmptyState } from "@/components/EmptyState";
import { CandidateTableSkeleton } from "@/components/CandidateTableSkeleton";
import { API_BASE_URL } from "@/services/clients";
import { AdvancedFilter } from "@/components/AdvancedFilter";
import type { FilterOption } from "@/components/AdvancedFilter";
import { jobsService } from "@/services/jobsService";
import { usersService } from "@/services/usersService";
import { pipelineService } from "@/services/pipelineService";
import { UserRole, ActionPermission } from "@acentra/shared-types";
import { BulkMoveStageModal } from "@/components/BulkMoveStageModal";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { CandidateUploadModal } from "@/components/CandidateUploadModal";
import { useAuth } from "@/context/AuthContext";


interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  created_at: string;
  job: {
    id: string;
    title: string;
  };
  profile_picture?: string;
}

export function Candidates() {
  const tenant = useTenant();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentFilters, setCurrentFilters] = useState<any>({});
  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const { hasPermission } = useAuth();
  const [stats, setStats] = useState({
    interviewing: 0,
    hired: 0,
    rejected: 0
  });


  const [filterOptions, setFilterOptions] = useState<{
    statuses: FilterOption[];
    jobs: FilterOption[];
    recruiters: FilterOption[];
  }>({
    statuses: [],
    jobs: [],
    recruiters: [],
  });

  const fetchCandidates = async (pageNumber: number, filters?: any) => {
    setLoading(true);
    try {
      const response = await candidatesService.getCandidates(pageNumber, 25, filters);
      setCandidates(response.data);
      setTotalPages(response.totalPages);
      setPage(response.page);
      setTotalCount(response.total || response.data.length);

      // Basic stats from current page for visible effect, or we could fetch real stats
      setStats({
        interviewing: response.data.filter(c => c.status?.toLowerCase().includes('interview')).length,
        hired: response.data.filter(c => c.status?.toLowerCase().includes('hire')).length,
        rejected: response.data.filter(c => c.status?.toLowerCase().includes('reject')).length
      });
    } catch (error) {
      console.error("Failed to fetch candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadFilterOptions = async () => {
    try {
      const [jobs, statuses, users] = await Promise.all([
        jobsService.getJobs(),
        pipelineService.getPipelineStatuses(),
        usersService.getUsers(),
      ]);

      const processedStatuses = statuses
        .filter((s: any) => s.value !== "rejected" && s.value !== "REJECTED")
        .map((s: any) => ({ value: s.value, label: s.label }));

      setFilterOptions({
        jobs: jobs.map((j: any) => ({ value: j.id, label: j.title })),
        statuses: [
          ...processedStatuses,
          { value: "rejected", label: "Rejected" }
        ],
        recruiters: users
          .filter(u => u.role === UserRole.RECRUITER || u.role === UserRole.HR)
          .map((u: any) => ({ value: u.id, label: u.name || u.email })),
      });
    } catch (err) {
      console.error("Failed to load filter options", err);
    }
  };

  useEffect(() => {
    fetchCandidates(page, currentFilters);
  }, [page, currentFilters]);

  useEffect(() => {
    loadFilterOptions();
  }, []);

  const handleFilterChange = (filters: any) => {
    setCurrentFilters(filters);
    setPage(1); // Reset to first page
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
  };

  const handleCandidateClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedCandidate(null);
    // Refresh list to show any status updates
    fetchCandidates(page);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === candidates.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(candidates.map((c) => c.id)));
    }
  };

  const toggleSelect = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkReject = async () => {
    if (selectedIds.size === 0) return;
    try {
      await candidatesService.bulkCandidateAction(Array.from(selectedIds), "REJECT");
      setSelectedIds(new Set());
      fetchCandidates(page);
    } catch (error) {
      console.error("Bulk reject failed:", error);
    }
  };

  const handleBulkMoveStage = async (stage: string) => {
    if (selectedIds.size === 0) return;
    try {
      await candidatesService.bulkCandidateAction(Array.from(selectedIds), "MOVE_STAGE", { stage });
      setMoveModalOpen(false);
      setSelectedIds(new Set());
      fetchCandidates(page);
    } catch (error) {
      console.error("Bulk move stage failed:", error);
    }
  };


  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "new":
      case "applied":
        return "info";
      case "reviewed":
      case "screening":
        return "warning";
      case "interview":
      case "interviewing":
        return "primary";
      case "offer":
        return "success";
      case "hired":
        return "success";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <AuroraBox sx={{ minHeight: "100vh", bgcolor: "background.default", pb: 8 }}>
      <DashboardHeader
        title="Talent Pool"
        subtitle={`Managing ${totalCount} candidates across your active pipelines.`}
        action={
          <AuroraBox sx={{ display: "flex", gap: 2 }}>
            {hasPermission(ActionPermission.UPLOAD_CV) && (
              <AuroraButton
                variant="outlined"
                color="inherit"
                startIcon={<AuroraUploadIcon width={18} height={18} />}
                onClick={() => setUploadModalOpen(true)}
                sx={{
                  borderColor: "rgba(255,255,255,0.3)",
                  color: "white",
                  "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.1)" },
                  borderRadius: 1,
                  px: 3
                }}
              >
                Bulk Upload
              </AuroraButton>
            )}
            {hasPermission(ActionPermission.CREATE_CANDIDATES) && (
              <AuroraButton
                variant="contained"
                startIcon={<AuroraAddIcon width={18} height={18} />}
                onClick={() => setUploadModalOpen(true)}
                sx={{
                  bgcolor: "primary.main",
                  "&:hover": { bgcolor: "primary.dark" },
                  borderRadius: 1,
                  px: 3
                }}
              >
                Add Candidate
              </AuroraButton>
            )}
          </AuroraBox>
        }
      />

      <AuroraBox sx={{ maxWidth: 1600, mx: "auto", px: { xs: 3, md: 6 }, position: "relative", zIndex: 2 }}>
        {/* Stats Row */}
        <AuroraGrid container spacing={3} sx={{ mb: 6 }}>
          <AuroraGrid size={{ xs: 12, md: 4 }}>
            <StatCard
              label="Total Candidates"
              value={totalCount}
              trend="+12% this month"
              loading={loading && page === 1}
            />
          </AuroraGrid>
          <AuroraGrid size={{ xs: 12, md: 4 }}>
            <StatCard
              label="In Active Progress"
              value={stats.interviewing}
              trend="Priority"
              loading={loading && page === 1}
            />
          </AuroraGrid>
          <AuroraGrid size={{ xs: 12, md: 4 }}>
            <StatCard
              label="Hired"
              value={stats.hired}
              trend="Succesful"
              loading={loading && page === 1}
            />
          </AuroraGrid>
        </AuroraGrid>

        <AuroraBox sx={{ mb: 4 }}>
          <AdvancedFilter
            type="candidates"
            onFilterChange={handleFilterChange}
            searchPlaceholder="Search candidates by name or email..."
            options={filterOptions}
          />
        </AuroraBox>

        {/* Bulk Action Bar */}
        {selectedIds.size > 0 && (
          <AuroraBox
            sx={{
              position: "fixed",
              bottom: 40,
              left: "50%",
              transform: "translateX(-50%)",
              bgcolor: "#0f172a", // Solid slate-900 for maximum contrast
              border: "1px solid",
              borderColor: "rgba(255,255,255,0.15)",
              color: "white",
              boxShadow: "0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
              borderRadius: "100px", // Pill shape
              px: { xs: 2, md: 4 },
              py: 1.5,
              display: "flex",
              alignItems: "center",
              gap: { xs: 2, md: 4 },
              zIndex: 1100,
              whiteSpace: "nowrap",
              animation: "slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
              "@keyframes slideUp": {
                from: { transform: "translateX(-50%) translateY(150px)", opacity: 0 },
                to: { transform: "translateX(-50%) translateY(0)", opacity: 1 }
              }
            }}
          >
            <AuroraBox sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <AuroraBox sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                bgcolor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)"
              }}>
                <AuroraLiveIconUsers width={20} height={20} stroke="white" />
              </AuroraBox>
              <AuroraBox sx={{ display: { xs: "none", sm: "block" } }}>
                <AuroraTypography variant="body1" sx={{ fontWeight: 900, fontSize: "1.1rem", lineHeight: 1 }}>
                  {selectedIds.size}
                </AuroraTypography>
                <AuroraTypography variant="caption" sx={{ color: "white", opacity: 0.8, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
                  Candidates
                </AuroraTypography>
              </AuroraBox>
            </AuroraBox>

            <AuroraBox sx={{ width: 1, height: 32, bgcolor: "rgba(255,255,255,0.2)" }} />

            <AuroraBox sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
              <AuroraButton
                variant="contained"
                sx={{
                  bgcolor: "white",
                  color: "#0f172a",
                  "&:hover": { bgcolor: "slate.100", transform: "scale(1.05)" },
                  borderRadius: "50px",
                  fontWeight: 800,
                  px: 3,
                  py: 1,
                  fontSize: "0.875rem",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                }}
                onClick={() => setMoveModalOpen(true)}
              >
                Move Stage
              </AuroraButton>
              <AuroraButton
                variant="outlined"
                sx={{
                  borderColor: "rgba(255,255,255,0.2)",
                  color: "white",
                  "&:hover": { bgcolor: "error.main", borderColor: "error.main", transform: "scale(1.05)" },
                  borderRadius: "50px",
                  fontWeight: 800,
                  px: 3,
                  py: 1,
                  fontSize: "0.875rem",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                }}
                onClick={handleBulkReject}
              >
                Reject Items
              </AuroraButton>
            </AuroraBox>

            <AuroraBox sx={{ width: 1, height: 24, bgcolor: "rgba(255,255,255,0.1)", mx: 1 }} />

            <AuroraButton
              variant="text"
              sx={{
                color: "rgba(255,255,255,0.6)",
                "&:hover": { color: "white" },
                fontWeight: 700,
                fontSize: "0.875rem"
              }}
              onClick={() => setSelectedIds(new Set())}
            >
              Cancel
            </AuroraButton>
          </AuroraBox>
        )}

        {loading && candidates.length === 0 ? (
          <CandidateTableSkeleton />
        ) : (
          <AuroraBox>
            <AuroraTableContainer
              sx={{
                bgcolor: "background.paper",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                overflow: "hidden",
              }}
            >
              <AuroraTable>
                <AuroraTableHead sx={{ bgcolor: alpha("#f8fafc", 0.5) }}>
                  <AuroraTableRow>
                    <AuroraTableCell padding="checkbox" sx={{ pl: 3 }}>
                      <AuroraCheckbox
                        checked={selectedIds.size === candidates.length && candidates.length > 0}
                        onChange={toggleSelectAll}
                      />
                    </AuroraTableCell>
                    <AuroraTableCell sx={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, fontSize: "0.75rem", py: 2.5 }}>Candidate</AuroraTableCell>
                    <AuroraTableCell sx={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, fontSize: "0.75rem" }}>Applied Role</AuroraTableCell>
                    <AuroraTableCell sx={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, fontSize: "0.75rem" }}>Current Status</AuroraTableCell>
                    <AuroraTableCell sx={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, fontSize: "0.75rem" }}>Application Date</AuroraTableCell>
                  </AuroraTableRow>
                </AuroraTableHead>
                <AuroraTableBody>
                  {candidates.map((candidate) => (
                    <AuroraTableRow
                      key={candidate.id}
                      hover
                      onClick={() => handleCandidateClick(candidate)}
                      sx={{
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                        "&:hover": { bgcolor: alpha("#3b82f6", 0.02) }
                      }}
                      selected={selectedIds.has(candidate.id)}
                    >
                      <AuroraTableCell padding="checkbox" sx={{ pl: 3 }}>
                        <AuroraCheckbox
                          checked={selectedIds.has(candidate.id)}
                          onChange={() => { }}
                          onClick={(e) => toggleSelect(candidate.id, e)}
                        />
                      </AuroraTableCell>
                      <AuroraTableCell>
                        <AuroraBox
                          sx={{ display: "flex", alignItems: "center", gap: 2.5 }}
                        >
                          <AuroraAvatar
                            src={
                              candidate.profile_picture
                                ? `${API_BASE_URL}/api/public/${tenant}/candidates/${candidate.id}/profile-picture`
                                : undefined
                            }
                            sx={{
                              width: 44,
                              height: 44,
                              borderRadius: 1,
                              bgcolor: "slate.100",
                              fontWeight: 800,
                              fontSize: "1rem"
                            }}
                          >
                            {candidate.name.charAt(0).toUpperCase()}
                          </AuroraAvatar>
                          <AuroraBox>
                            <AuroraTypography
                              variant="subtitle2"
                              sx={{ fontWeight: 700, mb: 0.25 }}
                            >
                              {candidate.name}
                            </AuroraTypography>
                            <AuroraTypography
                              variant="caption"
                              sx={{ color: "text.secondary", display: "block", fontWeight: 500 }}
                            >
                              {candidate.email}
                            </AuroraTypography>
                          </AuroraBox>
                        </AuroraBox>
                      </AuroraTableCell>
                      <AuroraTableCell>
                        <AuroraTypography variant="body2" sx={{ fontWeight: 600 }}>
                          {candidate.job?.title || "N/A"}
                        </AuroraTypography>
                      </AuroraTableCell>
                      <AuroraTableCell>
                        <AuroraChip
                          label={candidate.status}
                          status={getStatusColor(candidate.status) as any}
                          variant="outlined"
                          sx={{
                            fontWeight: 700,
                            borderRadius: 1,
                            px: 1,
                            borderWidth: 1.5
                          }}
                        />
                      </AuroraTableCell>
                      <AuroraTableCell sx={{ color: "text.secondary", fontWeight: 500 }}>
                        {new Date(candidate.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </AuroraTableCell>
                    </AuroraTableRow>
                  ))}
                </AuroraTableBody>
              </AuroraTable>
            </AuroraTableContainer>

            {candidates.length === 0 && !loading && (
              <AuroraBox sx={{
                mt: 8,
                display: "flex",
                justifyContent: "center",
                animation: "fadeIn 0.5s ease-out",
                "@keyframes fadeIn": { from: { opacity: 0 }, to: { opacity: 1 } }
              }}>
                <EmptyState
                  icon={<AuroraLiveIconUsers width={64} height={64} stroke="#3b82f6" />}
                  title="Your Talent Pool is Empty"
                  description="Start by adding candidates manually or performing a bulk upload of resumes."
                  action={
                    <AuroraBox sx={{ display: "flex", gap: 2, mt: 1 }}>
                      <AuroraButton
                        variant="contained"
                        onClick={() => setUploadModalOpen(true)}
                        sx={{ borderRadius: 3, px: 4, py: 1.2 }}
                      >
                        Add Candidate
                      </AuroraButton>
                      <AuroraButton
                        variant="outlined"
                        onClick={() => setUploadModalOpen(true)}
                        sx={{ borderRadius: 3, px: 4, py: 1.2 }}
                      >
                        Bulk Upload
                      </AuroraButton>
                    </AuroraBox>
                  }
                />
              </AuroraBox>
            )}

            <AuroraBox sx={{ mt: 5, display: "flex", justifyContent: "center" }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: 2,
                    fontWeight: 700
                  }
                }}
              />
            </AuroraBox>
          </AuroraBox>
        )}
      </AuroraBox>

      {selectedCandidate && (
        <CandidateDetailsDrawer
          candidate={selectedCandidate as any}
          open={drawerOpen}
          onClose={handleDrawerClose}
          onStatusChange={async (id: string, status: string) => {
            try {
              await candidatesService.updateCandidateStatus(id, status);
              fetchCandidates(page, currentFilters);
            } catch (error) {
              console.error("Failed to update status:", error);
            }
          }}
          onUpdate={() => fetchCandidates(page, currentFilters)}
          statuses={filterOptions.statuses}
        />
      )}

      <BulkMoveStageModal
        open={moveModalOpen}
        onClose={() => setMoveModalOpen(false)}
        onConfirm={handleBulkMoveStage}
        candidateCount={selectedIds.size}
        stages={filterOptions.statuses}
      />

      <CandidateUploadModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={() => {
          setUploadModalOpen(false);
          fetchCandidates(page, currentFilters);
        }}
        jobId="" // In global candidates page, we might need a job selector or it's a general upload
      />
    </AuroraBox>
  );
}
