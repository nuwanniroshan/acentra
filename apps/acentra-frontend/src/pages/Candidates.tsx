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
  alpha,
} from "@acentra/aurora-design-system";
import { Pagination, Paper } from "@mui/material";
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
import { UserRole } from "@acentra/shared-types";
import { BulkMoveStageModal } from "@/components/BulkMoveStageModal";


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
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null,
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentFilters, setCurrentFilters] = useState<any>({});
  const [moveModalOpen, setMoveModalOpen] = useState(false);


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

      setFilterOptions({
        jobs: jobs.map((j: any) => ({ value: j.id, label: j.title })),
        statuses: [
          ...statuses.map((s: any) => ({ value: s.value, label: s.label })),
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
    switch (status) {
      case "New":
        return "info";
      case "Reviewed":
        return "warning";
      case "Interviewing":
        return "primary";
      case "Offer":
        return "success";
      case "Hired":
        return "success";
      case "Rejected":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <AuroraBox>
      <AuroraBox
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <AuroraTypography variant="h5" fontWeight="bold">
          Candidates
        </AuroraTypography>
      </AuroraBox>

      <AdvancedFilter
        type="candidates"
        onFilterChange={handleFilterChange}
        searchPlaceholder="Search candidates by name or email..."
        options={filterOptions}
      />

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <AuroraBox
          sx={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            bgcolor: "background.paper",
            boxShadow: "0px 8px 30px rgba(0,0,0,0.15)",
            borderRadius: 4,
            px: 4,
            py: 2,
            display: "flex",
            alignItems: "center",
            gap: 3,
            zIndex: 1000,
            border: "1px solid",
            borderColor: alpha("#2563eb", 0.1),
          }}
        >
          <AuroraTypography variant="body2" fontWeight={700}>
            {selectedIds.size} Candidates selected
          </AuroraTypography>
          <AuroraBox sx={{ width: 1, height: 24, bgcolor: "divider", flexShrink: 0 }} />
          <AuroraButton
            variant="outlined"
            size="small"
            color="primary"
            onClick={() => setMoveModalOpen(true)}
          >
            Move Stage
          </AuroraButton>
          <AuroraButton
            variant="outlined"
            size="small"
            color="error"
            onClick={handleBulkReject}
          >
            Reject Selected
          </AuroraButton>

          <AuroraButton
            variant="text"
            size="small"
            onClick={() => setSelectedIds(new Set())}
          >
            Cancel
          </AuroraButton>
        </AuroraBox>
      )}

      {loading ? (
        <CandidateTableSkeleton />
      ) : (
        <>
          <AuroraTableContainer
            component={Paper}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <AuroraTable>
              <AuroraTableHead>
                <AuroraTableRow>
                  <AuroraTableCell padding="checkbox">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === candidates.length && candidates.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </AuroraTableCell>
                  <AuroraTableCell>Name</AuroraTableCell>
                  <AuroraTableCell>Job</AuroraTableCell>
                  <AuroraTableCell>Status</AuroraTableCell>
                  <AuroraTableCell>Applied Date</AuroraTableCell>
                </AuroraTableRow>
              </AuroraTableHead>
              <AuroraTableBody>
                {candidates.map((candidate) => (
                  <AuroraTableRow
                    key={candidate.id}
                    hover
                    onClick={() => handleCandidateClick(candidate)}
                    sx={{ cursor: "pointer" }}
                    selected={selectedIds.has(candidate.id)}
                  >
                    <AuroraTableCell padding="checkbox">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(candidate.id)}
                        onChange={() => { }}
                        onClick={(e) => toggleSelect(candidate.id, e)}
                      />
                    </AuroraTableCell>
                    <AuroraTableCell>
                      <AuroraBox
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <AuroraAvatar
                          src={
                            candidate.profile_picture
                              ? `${API_BASE_URL}/api/public/${tenant}/candidates/${candidate.id}/profile-picture`
                              : undefined
                          }
                        >
                          {candidate.name.charAt(0).toUpperCase()}
                        </AuroraAvatar>
                        <AuroraBox>
                          <AuroraTypography
                            variant="subtitle2"
                            fontWeight="bold"
                          >
                            {candidate.name}
                          </AuroraTypography>
                          <AuroraTypography
                            variant="caption"
                            color="text.secondary"
                          >
                            {candidate.email}
                          </AuroraTypography>
                        </AuroraBox>
                      </AuroraBox>
                    </AuroraTableCell>
                    <AuroraTableCell>
                      {candidate.job?.title || "N/A"}
                    </AuroraTableCell>
                    <AuroraTableCell>
                      <AuroraChip
                        label={candidate.status}
                        size="small"
                        color={getStatusColor(candidate.status) as any}
                        sx={{ fontWeight: 600 }}
                      />
                    </AuroraTableCell>
                    <AuroraTableCell>
                      {new Date(candidate.created_at).toLocaleDateString()}
                    </AuroraTableCell>
                  </AuroraTableRow>
                ))}
                {candidates.length === 0 && (
                  <AuroraTableRow>
                    <AuroraTableCell colSpan={5} align="center" sx={{ py: 8 }}>
                      <EmptyState
                        title="No candidates yet"
                        description="When candidates apply for your job openings, they will appear here for you to review and manage."
                        icon={<AuroraLiveIconUsers />}
                      />
                    </AuroraTableCell>
                  </AuroraTableRow>
                )}
              </AuroraTableBody>
            </AuroraTable>
          </AuroraTableContainer>

          <AuroraBox sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
            />
          </AuroraBox>
        </>
      )}

      {selectedCandidate && (
        <CandidateDetailsDrawer
          candidate={selectedCandidate as any}
          open={drawerOpen}
          onClose={handleDrawerClose}
          onStatusChange={async (id: string, status: string) => {
            try {
              await candidatesService.updateCandidateStatus(id, status);
              fetchCandidates(page);
            } catch (error) {
              console.error("Failed to update status:", error);
            }
          }}
          onUpdate={() => fetchCandidates(page)}
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

    </AuroraBox>
  );
}
