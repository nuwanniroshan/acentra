import { useEffect, useState } from "react";
import { jobsService } from "@/services/jobsService";
import { AuroraCard, AuroraCardContent, AuroraBox, AuroraTypography, AuroraWorkIcon, icons } from '@acentra/aurora-design-system';

export const widgetName = 'total-jobs';

export function TotalJobsWidget() {
  const [totalJobs, setTotalJobs] = useState(0);
  const [activeJobs, setActiveJobs] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const jobsData = await jobsService.getJobs();
      const activeCount = jobsData.filter(job => job.status === 'active' || !job.status).length;
      setTotalJobs(jobsData.length);
      setActiveJobs(activeCount);
    } catch (err: any) {
      console.error('Failed to load jobs data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AuroraCard sx={{ height: '100%' }}>
        <AuroraCardContent sx={{ p: 3, textAlign: 'center' }}>
          <AuroraTypography variant="body2">Loading...</AuroraTypography>
        </AuroraCardContent>
      </AuroraCard>
    );
  }

  return (
    <AuroraCard sx={{ height: '100%' }}>
      <AuroraCardContent sx={{ p: 3 }}>
        <AuroraBox sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <icons.Folders width={24} height={24} stroke="#1976d2" />
          <AuroraTypography variant="h6" sx={{ fontWeight: 600, ml: 1 }}>
            Total Jobs
          </AuroraTypography>
        </AuroraBox>
        <AuroraTypography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          {totalJobs}
        </AuroraTypography>
        <AuroraTypography variant="body2" color="text.secondary">
          {activeJobs} active openings
        </AuroraTypography>
      </AuroraCardContent>
    </AuroraCard>
  );
}