import { useEffect, useState } from "react";
import { candidatesService } from "@/services/candidatesService";
import {
  AuroraCard,
  AuroraCardContent,
  AuroraBox,
  AuroraTypography,
  AuroraLiveIconBadgeCheck,
} from "@acentra/aurora-design-system";

export const widgetName = "new-candidates";

export function NewCandidatesWidget() {
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
      const newCount = candidatesData.data.filter(
        (candidate: any) => new Date(candidate.created_at) > oneWeekAgo,
      ).length;
      setNewCandidatesThisWeek(newCount);
    } catch (err: any) {
      console.error("Failed to load candidates data:", err);
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
    <AuroraCard sx={{ height: "100%" }}>
      <AuroraCardContent sx={{ p: 3 }}>
        <AuroraBox sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <AuroraLiveIconBadgeCheck width={24} height={24} stroke="#ed6c02" />
          <AuroraTypography variant="h6" sx={{ fontWeight: 600, ml: 1 }}>
            New This Week
          </AuroraTypography>
        </AuroraBox>
        <AuroraTypography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          {newCandidatesThisWeek}
        </AuroraTypography>
        <AuroraTypography variant="body2" color="text.secondary">
          New candidates
        </AuroraTypography>
      </AuroraCardContent>
    </AuroraCard>
  );
}
