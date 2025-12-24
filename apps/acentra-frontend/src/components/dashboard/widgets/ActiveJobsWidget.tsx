import { useEffect, useState } from "react";
import { jobsService } from "@/services/jobsService";
import {
  AuroraCard,
  AuroraCardContent,
  AuroraBox,
  AuroraTypography,
} from "@acentra/aurora-design-system";

export const widgetName = "active-jobs";

export function ActiveJobsWidget() {
  const [activeJobs, setActiveJobs] = useState(0);
  const [loading, setLoading] = useState(true);

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
      }}
    >
      <AuroraCardContent sx={{ p: 3 }}>
        <AuroraBox sx={{ display: "column", alignItems: "center", mb: 2 }}>
          <AuroraTypography variant="h6" sx={{ fontWeight: 600 }}>
            Active Jobs
          </AuroraTypography>
          <AuroraTypography variant="body2" color="text.secondary">
            Currently hiring
          </AuroraTypography>
        </AuroraBox>
        <AuroraTypography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          {activeJobs}
        </AuroraTypography>
      </AuroraCardContent>
    </AuroraCard>
  );
}
