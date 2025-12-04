import { useEffect } from "react";
import {
  AuroraBox,
  AuroraTypography,
  AuroraPaper,
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

interface CandidatePipelineHistoryProps {
  candidateId: string;
  statuses: { value: string; label: string }[];
  onRefresh?: () => void;
}

export function CandidatePipelineHistory({
  candidateId,
  statuses,
  onRefresh,
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

  return (
    <AuroraBox>
      <AuroraTypography
        variant="h6"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        Pipeline History
      </AuroraTypography>

      {loading ? (
        <AuroraTypography
          color="text.secondary"
          textAlign="center"
          sx={{ mt: 4 }}
        >
          Loading...
        </AuroraTypography>
      ) : history.length === 0 ? (
        <AuroraTypography
          color="text.secondary"
          textAlign="center"
          sx={{ mt: 4 }}
        >
          No activity history available
        </AuroraTypography>
      ) : (
        <Timeline position="right" sx={{ mt: 2 }}>
          {history.map((activity, index) => (
            <TimelineItem key={activity.id}>
              <TimelineOppositeContent
                color="text.secondary"
                sx={{ flex: 0.3 }}
              >
                <AuroraTypography variant="caption">
                  {new Date(activity.changed_at).toLocaleDateString()}
                </AuroraTypography>
                <AuroraTypography variant="caption" display="block">
                  {new Date(activity.changed_at).toLocaleTimeString()}
                </AuroraTypography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color="primary" />
                {index < history.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <AuroraPaper elevation={0} variant="outlined" sx={{ p: 2 }}>
                  <AuroraTypography variant="body2" fontWeight="medium">
                    Status changed:{" "}
                    {statuses.find((s) => s.value === activity.old_status)
                      ?.label || activity.old_status}{" "}
                    →{" "}
                    {statuses.find((s) => s.value === activity.new_status)
                      ?.label || activity.new_status}
                  </AuroraTypography>
                  <AuroraTypography variant="caption" color="text.secondary">
                    by {activity.changed_by.name || activity.changed_by.email}
                  </AuroraTypography>
                </AuroraPaper>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      )}
    </AuroraBox>
  );
}
