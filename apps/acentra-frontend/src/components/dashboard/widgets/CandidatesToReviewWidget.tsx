import { useEffect, useState } from "react";
import { candidatesService } from "@/services/candidatesService";
import {
  AuroraCard,
  AuroraBox,
  AuroraTypography,
  AuroraList,
  AuroraListItem,
  AuroraListItemText,
  AuroraAvatar,
  AuroraDivider,
  AuroraButton,
  AuroraChip,
} from "@acentra/aurora-design-system";
import { useNavigate } from "react-router-dom";
import { useTenant } from "@/context/TenantContext";

interface CandidatesToReviewWidgetProps {
  filters?: {
    jobId?: string;
    createdBy?: string;
    status?: string;
  };
}

export function CandidatesToReviewWidget({ filters }: CandidatesToReviewWidgetProps) {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const tenant = useTenant();

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await candidatesService.getCandidates(1, 25, filters);
      // Filter for candidates in 'NEW' stage or similar initial stages
      const toReview = response.data.filter((c: any) =>
        ["NEW", "QUALIFIED", "APPLIED", "SCREENING"].includes(c.status?.toUpperCase())
      );
      setCandidates(toReview.slice(0, 5));
    } catch (err: any) {
      console.error("Failed to load candidates to review:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AuroraCard sx={{ borderRadius: 3, border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}>
        <AuroraBox sx={{ p: 4, textAlign: "center" }}>
          <AuroraTypography variant="body2" color="text.secondary">Looking for applicants...</AuroraTypography>
        </AuroraBox>
      </AuroraCard>
    );
  }

  return (
    <AuroraCard noPadding sx={{ borderRadius: 3, border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", overflow: "hidden" }}>
      <AuroraBox sx={{ p: 2, px: 3, display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
        <AuroraButton
          variant="text"
          size="small"
          onClick={() => navigate(`/${tenant}/ats/candidates`)}
          sx={{ fontWeight: 600 }}
        >
          View Talent Pool
        </AuroraButton>
      </AuroraBox>
      <AuroraDivider />
      {candidates.length === 0 ? (
        <AuroraBox sx={{ p: 6, textAlign: "center" }}>
          <AuroraTypography color="text.secondary" sx={{ fontStyle: "italic" }}>
            High-five! You've reviewed all incoming candidates.
          </AuroraTypography>
        </AuroraBox>
      ) : (
        <AuroraList disablePadding>
          {candidates.map((candidate, index) => (
            <AuroraBox key={candidate.id}>
              <AuroraListItem
                sx={{
                  cursor: "pointer",
                  "&:hover": { bgcolor: "action.hover" },
                  py: 2,
                  px: 3,
                  transition: "background-color 0.2s"
                }}
                onClick={() => navigate(`/${tenant}/ats/candidates`)}
              >
                <AuroraAvatar
                  sx={{
                    mr: 2,
                    width: 44,
                    height: 44,
                    bgcolor: "secondary.light",
                    color: "secondary.main",
                    fontWeight: 700,
                    fontSize: "0.9rem"
                  }}
                >
                  {candidate.name?.charAt(0)}
                </AuroraAvatar>
                <AuroraListItemText
                  primary={candidate.name}
                  secondary={
                    <AuroraTypography variant="caption" sx={{ color: "text.secondary" }}>
                      Applying for <AuroraBox component="span" sx={{ fontWeight: 600 }}>{candidate.job?.title || "Staff Position"}</AuroraBox>
                    </AuroraTypography>
                  }
                  primaryTypographyProps={{ fontWeight: 600, fontSize: "1rem" }}
                />
                <AuroraChip
                  label={candidate.status}
                  status="primary"
                />
              </AuroraListItem>
              {index < candidates.length - 1 && <AuroraDivider sx={{ mx: 2 }} />}
            </AuroraBox>
          ))}
        </AuroraList>
      )}
    </AuroraCard>
  );
}
