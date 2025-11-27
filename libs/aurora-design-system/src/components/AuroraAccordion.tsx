import React from 'react';
import { 
  Accordion, AccordionProps, 
  AccordionSummary, AccordionSummaryProps, 
  AccordionDetails, AccordionDetailsProps 
} from '@mui/material';

export const AuroraAccordion: React.FC<AccordionProps> = (props) => <Accordion {...props} />;
export const AuroraAccordionSummary: React.FC<AccordionSummaryProps> = (props) => <AccordionSummary {...props} />;
export const AuroraAccordionDetails: React.FC<AccordionDetailsProps> = (props) => <AccordionDetails {...props} />;
