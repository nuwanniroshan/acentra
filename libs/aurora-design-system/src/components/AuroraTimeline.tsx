import React from 'react';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab';
import type {
  TimelineProps,
  TimelineItemProps,
  TimelineSeparatorProps,
  TimelineConnectorProps,
  TimelineContentProps,
  TimelineDotProps,
  TimelineOppositeContentProps
} from '@mui/lab';

export const AuroraTimeline: React.FC<TimelineProps> = (props) => <Timeline {...props} />;
export const AuroraTimelineItem: React.FC<TimelineItemProps> = (props) => <TimelineItem {...props} />;
export const AuroraTimelineSeparator: React.FC<TimelineSeparatorProps> = (props) => <TimelineSeparator {...props} />;
export const AuroraTimelineConnector: React.FC<TimelineConnectorProps> = (props) => <TimelineConnector {...props} />;
export const AuroraTimelineContent: React.FC<TimelineContentProps> = (props) => <TimelineContent {...props} />;
export const AuroraTimelineDot: React.FC<TimelineDotProps> = (props) => <TimelineDot {...props} />;
export const AuroraTimelineOppositeContent: React.FC<TimelineOppositeContentProps> = (props) => <TimelineOppositeContent {...props} />;