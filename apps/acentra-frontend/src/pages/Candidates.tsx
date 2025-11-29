import { useState, useEffect } from "react";
import { AuroraBox, AuroraTypography, AuroraTable, AuroraTableBody, AuroraTableCell, AuroraTableContainer, AuroraTableHead, AuroraTableRow, AuroraAvatar, AuroraChip, AuroraCircularProgress } from '@acentra/aurora-design-system';
import { Pagination, Paper } from '@mui/material';
import { candidatesService } from "@/services/candidatesService";
import { CandidateDetailsDrawer } from "@/components/CandidateDetailsDrawer";

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
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchCandidates = async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await candidatesService.getCandidates(pageNumber);
      setCandidates(response.data);
      setTotalPages(response.totalPages);
      setPage(response.page);
    } catch (error) {
      console.error("Failed to fetch candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates(page);
  }, [page]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
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
      <AuroraBox sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <AuroraTypography variant="h4" fontWeight="bold">
          Candidates
        </AuroraTypography>
      </AuroraBox>

      {loading ? (
        <AuroraBox sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <AuroraCircularProgress />
        </AuroraBox>
      ) : (
        <>
          <AuroraTableContainer component={Paper} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
            <AuroraTable>
              <AuroraTableHead>
                <AuroraTableRow>
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
                  >
                    <AuroraTableCell>
                      <AuroraBox sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <AuroraAvatar src={candidate.profile_picture ? `/api/candidates/${candidate.id}/profile-picture` : undefined}>
                          {candidate.name.charAt(0).toUpperCase()}
                        </AuroraAvatar>
                        <AuroraBox>
                          <AuroraTypography variant="subtitle2" fontWeight="bold">
                            {candidate.name}
                          </AuroraTypography>
                          <AuroraTypography variant="caption" color="text.secondary">
                            {candidate.email}
                          </AuroraTypography>
                        </AuroraBox>
                      </AuroraBox>
                    </AuroraTableCell>
                    <AuroraTableCell>{candidate.job?.title || "N/A"}</AuroraTableCell>
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
                    <AuroraTableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      <AuroraTypography color="text.secondary">No candidates found</AuroraTypography>
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
          statuses={[
            { value: "new", label: "New" },
            { value: "reviewed", label: "Reviewed" },
            { value: "interviewing", label: "Interviewing" },
            { value: "offer", label: "Offer" },
            { value: "hired", label: "Hired" },
            { value: "rejected", label: "Rejected" },
          ]}
        />
      )}
    </AuroraBox>
  );
}
