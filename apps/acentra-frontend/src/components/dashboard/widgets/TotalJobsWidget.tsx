import { useEffect, useState } from "react";
import { jobsService } from "@/services/jobsService";
import { useNavigate } from "react-router-dom";
import { useTenant } from "@/context/TenantContext";
import {
  AuroraCard,
  AuroraCardContent,
  AuroraBox,
  AuroraTypography,
} from "@acentra/aurora-design-system";

export const widgetName = "total-jobs";

export function TotalJobsWidget() {
  const [totalJobs, setTotalJobs] = useState(0);
  const [activeJobs, setActiveJobs] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const tenant = useTenant();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const jobsData = await jobsService.getJobs();
      const activeCount = jobsData.filter(
        (job) => job.status === "active" || !job.status
      ).length;
      setTotalJobs(jobsData.length);
      setActiveJobs(activeCount);
    } catch (err: any) {
      console.error("Failed to load jobs data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AuroraCard sx={{ height: "100%" }}>
        <AuroraCardContent sx={{ p: 3, textAlign: "center" }}>
          <AuroraTypography variant="body2">Loading...</AuroraTypography>
        </AuroraCardContent>
      </AuroraCard>
    );
  }

  return (
    <AuroraCard
      sx={{
        height: "100%",
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: (theme) => theme.shadows[4],
        },
      }}
      onClick={() => navigate(`/${tenant}/ats/jobs`)}
    >
      <AuroraCardContent sx={{ p: 3 }}>
        <AuroraBox sx={{ display: "column", alignItems: "center", mb: 2 }}>
          {/* <AuroraLiveIconFolders width={24} height={24} stroke="#1976d2" /> */}
          <AuroraTypography variant="h6" sx={{ fontWeight: 600 }}>
            Total Jobs
          </AuroraTypography>
          <AuroraTypography variant="body2" color="text.secondary">
            {activeJobs} active openings
          </AuroraTypography>
        </AuroraBox>
        <AuroraTypography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          {totalJobs}
        </AuroraTypography>
      </AuroraCardContent>
    </AuroraCard>
  );
}
