import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import type { AccordionProps, AccordionSummaryProps, AccordionDetailsProps } from '@mui/material';

export const AuroraAccordion: React.FC<AccordionProps> = (props) => <Accordion {...props} />;
export const AuroraAccordionSummary: React.FC<AccordionSummaryProps> = (props) => <AccordionSummary {...props} />;
export const AuroraAccordionDetails: React.FC<AccordionDetailsProps> = (props) => <AccordionDetails {...props} />;
