import { useEffect, useState } from "react";
import { jobsService } from "@/services/jobsService";
import {
  AuroraCard,
  AuroraBox,
  AuroraTypography,
  AuroraList,
  AuroraListItem,
  AuroraListItemText,
  AuroraBadge,
  AuroraDivider,
  AuroraButton,
  AuroraChip,
} from "@acentra/aurora-design-system";
import { useNavigate } from "react-router-dom";

export function MyActiveJobsWidget() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const jobsData = await jobsService.getJobs({
        assigneeId: user.userId,
        status: "OPEN"
      });
      setJobs(jobsData.slice(0, 5)); // Show top 5
    } catch (err: any) {
      console.error("Failed to load my jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AuroraCard sx={{ borderRadius: 2, border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}>
        <AuroraBox sx={{ p: 4, textAlign: "center" }}>
          <AuroraTypography variant="body2" color="text.secondary">Loading your jobs...</AuroraTypography>
        </AuroraBox>
      </AuroraCard>
    );
  }

  return (
    <AuroraCard noPadding sx={{ borderRadius: 2, border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", overflow: "hidden" }}>
      <AuroraBox sx={{ p: 2, px: 3, display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
        <AuroraButton
          variant="text"
          size="small"
          onClick={() => navigate("/jobs")}
          sx={{ fontWeight: 600 }}
        >
          View Full Pipeline
        </AuroraButton>
      </AuroraBox>
      <AuroraDivider />
      {jobs.length === 0 ? (
        <AuroraBox sx={{ p: 6, textAlign: "center" }}>
          <AuroraTypography color="text.secondary" sx={{ fontStyle: "italic" }}>
            No active jobs assigned to your portfolio.
          </AuroraTypography>
        </AuroraBox>
      ) : (
        <AuroraList disablePadding>
          {jobs.map((job, index) => (
            <AuroraBox key={job.id}>
              <AuroraListItem
                sx={{
                  cursor: "pointer",
                  "&:hover": { bgcolor: "action.hover" },
                  py: 2,
                  px: 3,
                  transition: "background-color 0.2s"
                }}
                onClick={() => navigate(`/jobs/${job.id}`)}
              >
                <AuroraListItemText
                  primary={job.title}
                  secondary={
                    <AuroraBox component="span" sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                      <AuroraTypography variant="caption" sx={{ fontWeight: 600, color: "text.secondary" }}>
                        {job.department || "General"}
                      </AuroraTypography>
                      <AuroraTypography variant="caption" sx={{ color: "text.disabled" }}>•</AuroraTypography>
                      <AuroraTypography variant="caption" sx={{ color: "text.secondary" }}>
                        {job.branch || "Remote"}
                      </AuroraTypography>
                    </AuroraBox>
                  }
                  primaryTypographyProps={{ fontWeight: 600, fontSize: "1rem" }}
                />
                <AuroraBox sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <AuroraBox sx={{ textAlign: "right" }}>
                    <AuroraTypography variant="body2" sx={{ fontWeight: 700, color: "primary.main" }}>
                      {job.candidates?.length || 0}
                    </AuroraTypography>
                    <AuroraTypography variant="caption" color="text.secondary">
                      Candidates
                    </AuroraTypography>
                  </AuroraBox>
                  <AuroraChip
                    label={job.status || "OPEN"}
                    size="small"
                    color="success"
                    variant="outlined"
                    sx={{ fontWeight: 700, borderRadius: 2, height: 24, fontSize: "0.65rem" }}
                  />
                </AuroraBox>
              </AuroraListItem>
              {index < jobs.length - 1 && <AuroraDivider sx={{ mx: 2 }} />}
            </AuroraBox>
          ))}
        </AuroraList>
      )}
    </AuroraCard>
  );
}
