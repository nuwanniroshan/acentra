import { useEffect, useState } from "react";
import { candidatesService } from "@/services/candidatesService";
import { AuroraCard, AuroraCardContent, AuroraBox, AuroraTypography, AuroraPeopleIcon, icons } from '@acentra/aurora-design-system';

export const widgetName = 'total-candidates';

export function TotalCandidatesWidget() {
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [newCandidatesThisWeek, setNewCandidatesThisWeek] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const candidatesData = await candidatesService.getCandidates();
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const newCount = candidatesData.data.filter((candidate: any) =>
        new Date(candidate.created_at) > oneWeekAgo
      ).length;
      setTotalCandidates(candidatesData.data.length);
      setNewCandidatesThisWeek(newCount);
    } catch (err: any) {
      console.error('Failed to load candidates data:', err);
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
          <icons.Users width={24} height={24} stroke="#1976d2" />
          <AuroraTypography variant="h6" sx={{ fontWeight: 600, ml: 1 }}>
            Total Candidates
          </AuroraTypography>
        </AuroraBox>
        <AuroraTypography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          {totalCandidates}
        </AuroraTypography>
        <AuroraTypography variant="body2" color="text.secondary">
          +{newCandidatesThisWeek} this week
        </AuroraTypography>
      </AuroraCardContent>
    </AuroraCard>
  );
}