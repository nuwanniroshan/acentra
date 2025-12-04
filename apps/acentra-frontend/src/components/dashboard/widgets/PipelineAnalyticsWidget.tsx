import { useEffect, useState } from "react";
import { candidatesService } from "@/services/candidatesService";
import { pipelineService } from "@/services/pipelineService";
import {
  AuroraCard,
  AuroraCardContent,
  AuroraBox,
  AuroraTypography,
  AuroraTable,
  AuroraTableBody,
  AuroraTableCell,
  AuroraTableContainer,
  AuroraTableHead,
  AuroraTableRow,
  AuroraChip,
  AuroraLiveIconActivity,
  AuroraLiveIconBadgeAlert,
} from "@acentra/aurora-design-system";

export const widgetName = "pipeline-analytics";

interface PipelineStageData {
  id: string;
  label: string;
  count: number;
  percentage: number;
  avgDays: number;
}

export function PipelineAnalyticsWidget() {
  const [pipelineStages, setPipelineStages] = useState<PipelineStageData[]>([]);
  const [bottlenecks, setBottlenecks] = useState<PipelineStageData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Fetch pipeline statuses and candidates
      const [statuses, candidatesData] = await Promise.all([
        pipelineService.getPipelineStatuses(),
        candidatesService.getCandidates(),
      ]);

      const candidates = candidatesData.data || [];

      // Calculate pipeline analytics
      const stageMap = new Map<
        string,
        { count: number; totalDays: number; candidates: any[] }
      >();

      // Initialize stages
      statuses.forEach((status: any) => {
        stageMap.set(status.id, { count: 0, totalDays: 0, candidates: [] });
      });

      // Count candidates in each stage
      candidates.forEach((candidate: any) => {
        if (
          candidate.pipeline_status_id &&
          stageMap.has(candidate.pipeline_status_id)
        ) {
          const stage = stageMap.get(candidate.pipeline_status_id)!;
          stage.count++;
          stage.candidates.push(candidate);

          // Calculate days in current stage (simplified - using created_at as proxy)
          if (candidate.created_at) {
            const createdDate = new Date(candidate.created_at);
            const now = new Date();
            const daysDiff = Math.floor(
              (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24),
            );
            stage.totalDays += daysDiff;
          }
        }
      });

      // Convert to display data
      const totalCandidates = candidates.length;
      const stageData: PipelineStageData[] = statuses
        .map((status: any) => {
          const stage = stageMap.get(status.id)!;
          const avgDays =
            stage.count > 0 ? Math.round(stage.totalDays / stage.count) : 0;
          const percentage =
            totalCandidates > 0
              ? Math.round((stage.count / totalCandidates) * 100)
              : 0;

          return {
            id: status.id,
            label: status.label,
            count: stage.count,
            percentage,
            avgDays,
          };
        })
        .sort((a, b) => b.count - a.count); // Sort by count descending

      setPipelineStages(stageData);

      // Identify bottlenecks (stages with high count and long average days)
      const bottleneckStages = stageData
        .filter((stage) => stage.count > 0 && stage.avgDays > 7) // More than 7 days average
        .sort((a, b) => b.avgDays - a.avgDays)
        .slice(0, 3); // Top 3 bottlenecks

      setBottlenecks(bottleneckStages);
    } catch (err: any) {
      console.error("Failed to load pipeline analytics:", err);
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
    <AuroraBox>
      <AuroraBox sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <AuroraLiveIconActivity width={24} height={24} stroke="#1976d2" />
        <AuroraTypography variant="h5" sx={{ fontWeight: 600, ml: 1 }}>
          Pipeline Analytics
        </AuroraTypography>
      </AuroraBox>

      <AuroraBox sx={{ display: "flex", gap: 3 }}>
        {/* Pipeline Stages Overview */}
        <AuroraCard sx={{ flex: 2 }}>
          <AuroraCardContent sx={{ p: 0 }}>
            <AuroraBox
              sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}
            >
              <AuroraTypography variant="h6" sx={{ fontWeight: 600 }}>
                Candidates by Stage
              </AuroraTypography>
            </AuroraBox>
            <AuroraTableContainer>
              <AuroraTable size="small">
                <AuroraTableHead>
                  <AuroraTableRow>
                    <AuroraTableCell>Stage</AuroraTableCell>
                    <AuroraTableCell align="center">Count</AuroraTableCell>
                    <AuroraTableCell align="center">%</AuroraTableCell>
                    <AuroraTableCell align="center">Avg Days</AuroraTableCell>
                  </AuroraTableRow>
                </AuroraTableHead>
                <AuroraTableBody>
                  {pipelineStages.length === 0 ? (
                    <AuroraTableRow>
                      <AuroraTableCell
                        colSpan={4}
                        align="center"
                        sx={{ py: 4 }}
                      >
                        <AuroraTypography
                          variant="body2"
                          color="text.secondary"
                        >
                          No pipeline data available
                        </AuroraTypography>
                      </AuroraTableCell>
                    </AuroraTableRow>
                  ) : (
                    pipelineStages.map((stage) => (
                      <AuroraTableRow key={stage.id}>
                        <AuroraTableCell>
                          <AuroraTypography
                            variant="body2"
                            sx={{ fontWeight: 500 }}
                          >
                            {stage.label}
                          </AuroraTypography>
                        </AuroraTableCell>
                        <AuroraTableCell align="center">
                          <AuroraChip
                            label={stage.count}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </AuroraTableCell>
                        <AuroraTableCell align="center">
                          <AuroraTypography
                            variant="body2"
                            sx={{ fontWeight: 500 }}
                          >
                            {stage.percentage}%
                          </AuroraTypography>
                        </AuroraTableCell>
                        <AuroraTableCell align="center">
                          <AuroraTypography variant="body2">
                            {stage.avgDays}d
                          </AuroraTypography>
                        </AuroraTableCell>
                      </AuroraTableRow>
                    ))
                  )}
                </AuroraTableBody>
              </AuroraTable>
            </AuroraTableContainer>
          </AuroraCardContent>
        </AuroraCard>

        {/* Bottlenecks */}
        <AuroraCard sx={{ flex: 1 }}>
          <AuroraCardContent sx={{ p: 0 }}>
            <AuroraBox
              sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}
            >
              <AuroraBox sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AuroraLiveIconBadgeAlert
                  width={20}
                  height={20}
                  stroke="#f57c00"
                />
                <AuroraTypography variant="h6" sx={{ fontWeight: 600 }}>
                  Bottlenecks
                </AuroraTypography>
              </AuroraBox>
            </AuroraBox>
            <AuroraBox sx={{ p: 2 }}>
              {bottlenecks.length === 0 ? (
                <AuroraTypography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "center", py: 2 }}
                >
                  No bottlenecks detected
                </AuroraTypography>
              ) : (
                bottlenecks.map((stage, index) => (
                  <AuroraBox
                    key={stage.id}
                    sx={{ mb: index < bottlenecks.length - 1 ? 2 : 0 }}
                  >
                    <AuroraBox
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <AuroraTypography
                        variant="body2"
                        sx={{ fontWeight: 500 }}
                      >
                        {stage.label}
                      </AuroraTypography>
                      <AuroraChip
                        label={`${stage.avgDays}d`}
                        size="small"
                        color="warning"
                        variant="outlined"
                      />
                    </AuroraBox>
                    <AuroraTypography variant="caption" color="text.secondary">
                      {stage.count} candidates stuck
                    </AuroraTypography>
                  </AuroraBox>
                ))
              )}
            </AuroraBox>
          </AuroraCardContent>
        </AuroraCard>
      </AuroraBox>
    </AuroraBox>
  );
}
