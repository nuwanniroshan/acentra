import { useEffect, useMemo } from "react";
import {
  AuroraBox,
  AuroraTypography,
  AuroraPaper,
  AuroraChip,
} from "@acentra/aurora-design-system";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchPipelineHistory } from "@/store/pipelineHistorySlice";
import { AccessTime as AccessTimeIcon } from "@mui/icons-material";

interface CandidatePipelineHistoryProps {
  candidateId: string;
  statuses: { value: string; label: string }[];
  onRefresh?: () => void;
  createdAt?: string;
  currentStatus?: string;
}

interface StageDuration {
  stage: string;
  duration: number; // in days
  isCurrent: boolean;
  startDate: string;
  endDate?: string;
}

export function CandidatePipelineHistory({
  candidateId,
  statuses,
  onRefresh,
  createdAt,
  currentStatus,
}: CandidatePipelineHistoryProps) {
  const dispatch = useAppDispatch();
  const { history, loading } = useAppSelector((state) => state.pipelineHistory);

  useEffect(() => {
    if (candidateId) {
      dispatch(fetchPipelineHistory(candidateId));
    }
  }, [candidateId, dispatch, onRefresh]);

  // Additional effect to refresh when onRefresh is called
  useEffect(() => {
    if (onRefresh && candidateId) {
      dispatch(fetchPipelineHistory(candidateId));
    }
  }, [onRefresh, candidateId, dispatch]);

  const cycleTimes = useMemo(() => {
    if (!createdAt) return [];

    // IF history is undefined/loading, return empty or wait. But history starts as [] in initialState.
    // If it's truly empty, we rely on currentStatus.

    // Sort history by date ASC to process chronologically
    const sortedHistory = [...history]
      .filter((h) => h.old_status) // Exclude creation record (old_status is null)
      .sort(
        (a, b) =>
          new Date(a.changed_at).getTime() - new Date(b.changed_at).getTime()
      );

    const stages: StageDuration[] = [];
    let currentStart = new Date(createdAt);

    // Initial stage (before first change)
    if (sortedHistory.length > 0) {
      const firstChange = sortedHistory[0];
      const endDate = new Date(firstChange.changed_at);
      const duration =
        (endDate.getTime() - currentStart.getTime()) / (1000 * 60 * 60 * 24);

      stages.push({
        stage: firstChange.old_status,
        duration,
        isCurrent: false,
        startDate: currentStart.toISOString(),
        endDate: firstChange.changed_at,
      });

      currentStart = endDate;
    }

    // Intermediate stages
    for (let i = 0; i < sortedHistory.length - 1; i++) {
      const currentChange = sortedHistory[i];
      const nextChange = sortedHistory[i + 1];
      const endDate = new Date(nextChange.changed_at);
      const duration =
        (endDate.getTime() - currentStart.getTime()) / (1000 * 60 * 60 * 24);

      stages.push({
        stage: currentChange.new_status,
        duration,
        isCurrent: false,
        startDate: currentStart.toISOString(),
        endDate: nextChange.changed_at,
      });

      currentStart = endDate;
    }

    // Current stage logic
    const now = new Date();

    if (sortedHistory.length > 0) {
      // If we have history, the last change defines the start of the current stage
      const lastChange = sortedHistory[sortedHistory.length - 1];
      const duration =
        (now.getTime() - currentStart.getTime()) / (1000 * 60 * 60 * 24);

      stages.push({
        stage: lastChange.new_status,
        duration,
        isCurrent: true,
        startDate: currentStart.toISOString(),
      });
    } else if (currentStatus) {
      // No history, entire time since creation is in currentStatus
      const duration =
        (now.getTime() - currentStart.getTime()) / (1000 * 60 * 60 * 24);

      stages.push({
        stage: currentStatus,
        duration,
        isCurrent: true,
        startDate: currentStart.toISOString(),
      });
    }

    return stages;
  }, [history, createdAt, currentStatus]);

  const formatDuration = (days: number) => {
    if (days < 1) return "< 1 day";
    return `${Math.floor(days)} day${Math.floor(days) !== 1 ? "s" : ""}`;
  };

  const getStatusLabel = (value: string) =>
    statuses.find((s) => s.value === value)?.label || value;

  // We want to display the timeline in reverse chronological order (Newest first)
  // Current stage first, then history items.
  // But the existing UI renders `history` items which are transitions.
  // We should interleave or augment the history items with duration info.

  // Let's create a display list.
  // We have `stages` calculated (chronological).
  // We have `sortedHistory` (chronological).

  // Actually, let's keep the Timeline approach but augment it.
  // The user wants to see "Cycle time for each candidate in every pipeline stage".

  // If we show timeline of *Stages* instead of *Status Changes*, it aligns better with "Cycle Time in Stage".
  // A Stage item:
  // - Title: Stage Name (e.g. Phone Screen)
  // - Content: Duration, Dates, Who moved them there (entry trigger).

  // Let's try to map `cycleTimes` (reversed) to TimelineItems.

  const displayStages = [...cycleTimes].reverse();

  return (
    <AuroraBox>
      {loading ? (
        <AuroraTypography
          color="text.secondary"
          textAlign="center"
          sx={{ mt: 4 }}
        >
          Loading...
        </AuroraTypography>
      ) : displayStages.length === 0 && history.length === 0 ? (
        <AuroraTypography
          color="text.secondary"
          textAlign="center"
          sx={{ mt: 4 }}
        >
          No activity history available.
          {createdAt && (
            <AuroraBox sx={{ mt: 1 }}>
              Created on {new Date(createdAt).toLocaleDateString()}
            </AuroraBox>
          )}
        </AuroraTypography>
      ) : (
        <Timeline position="right" sx={{ mt: 2 }}>
          {displayStages.map((stageItem, index) => {
            // Find the history item that *started* this stage (except for the very first stage if no history)
            // For a stage, the start date aligns with a history item's changed_at (where new_status == stage)
            // Or it's createdAt (for initial stage).

            // Actually, showing the *Transition* log is also valuable (who changed it).
            // Transition -> Stage Duration.

            return (
              <TimelineItem key={index}>
                <TimelineOppositeContent
                  color="text.secondary"
                  sx={{ flex: 0.3, pt: 1.5 }}
                >
                  <AuroraTypography variant="caption" display="block">
                    {new Date(stageItem.startDate).toLocaleDateString()}
                  </AuroraTypography>
                  <AuroraTypography variant="caption" display="block">
                    {new Date(stageItem.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </AuroraTypography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color={stageItem.isCurrent ? "success" : "primary"} />
                  {index < displayStages.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <AuroraPaper
                    elevation={0}
                    variant="outlined"
                    sx={{
                      p: 2,
                      border: stageItem.isCurrent ? "1px solid" : "1px solid",
                      borderColor: stageItem.isCurrent ? "success.main" : "divider",
                      bgcolor: stageItem.isCurrent ? "success.lighter" : "background.paper"
                    }}
                  >
                    <AuroraBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <AuroraTypography variant="subtitle2" fontWeight="bold">
                        {getStatusLabel(stageItem.stage)}
                      </AuroraTypography>
                      {stageItem.isCurrent ? (
                        <AuroraChip label="Current" size="small" color="success" sx={{ height: 20 }} />
                      ) : null}
                    </AuroraBox>

                    <AuroraBox sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                      <AccessTimeIcon fontSize="small" color="action" sx={{ width: 16, height: 16 }} />
                      <AuroraTypography variant="body2" fontWeight="medium" color={stageItem.isCurrent ? "success.dark" : "text.primary"}>
                        {formatDuration(stageItem.duration)}
                      </AuroraTypography>
                    </AuroraBox>

                    <AuroraTypography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                      {stageItem.isCurrent ? "Ongoing" : `Completed on ${new Date(stageItem.endDate!).toLocaleDateString()}`}
                    </AuroraTypography>
                  </AuroraPaper>
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      )}
    </AuroraBox>
  );
}
