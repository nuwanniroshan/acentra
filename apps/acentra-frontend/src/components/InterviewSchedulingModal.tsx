import { useState, useEffect } from "react";

import {
  AuroraDialog,
  AuroraDialogTitle,
  AuroraDialogContent,
  AuroraDialogActions,
  AuroraButton,
  AuroraTextField,
  AuroraBox,
  AuroraTypography,
  AuroraStack,
} from "@acentra/aurora-design-system";
import { candidatesService } from "@/services/candidatesService";

interface InterviewSchedulingModalProps {
  open: boolean;
  onClose: () => void;
  candidateId: string;
  candidateName: string;
  initialDate?: string;
  initialLink?: string;
  onSuccess: () => void;
}

export function InterviewSchedulingModal({
  open,
  onClose,
  candidateId,
  candidateName,
  initialDate = "",
  initialLink = "",
  onSuccess,
}: InterviewSchedulingModalProps) {
  const [date, setDate] = useState(initialDate);
  const [link, setLink] = useState(initialLink);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setDate(initialDate ? new Date(initialDate).toISOString().slice(0, 16) : "");
      setLink(initialLink || "");
    }
  }, [open, initialDate, initialLink]);

  const handleSave = async () => {
    setLoading(true);
    try {
      // In a real app, this might call a specific interview scheduling endpoint
      // But for now, we'll use the candidate status update which supports these fields
      // Or we can assume there's a patch endpoint for candidate details.
      // CandidateController.updateStatus supports these fields.

      const candidate = await candidatesService.getCandidate(candidateId);
      await candidatesService.updateCandidateStatus(candidateId, candidate.status, {
        interview_date: date,
        interview_link: link
      } as any);

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to schedule interview:", error);
      alert("Failed to schedule interview");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuroraDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <AuroraDialogTitle>Schedule Interview - {candidateName}</AuroraDialogTitle>
      <AuroraDialogContent>
        <AuroraStack spacing={3} sx={{ mt: 1 }}>
          <AuroraTypography variant="body2" color="text.secondary">
            Set the date, time, and meeting link for the interview.
          </AuroraTypography>

          <AuroraTextField
            label="Interview Date & Time"
            type="datetime-local"
            fullWidth
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <AuroraTextField
            label="Meeting Link (Zoom, Meet, etc.)"
            placeholder="https://zoom.us/j/..."
            fullWidth
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />

          <AuroraBox sx={{ bgcolor: 'info.light', p: 2, borderRadius: 2, opacity: 0.8 }}>
            <AuroraTypography variant="caption" color="info.contrastText">
              Tip: Automated invites will be sent to the candidate and assigned recruiters once you save.
            </AuroraTypography>
          </AuroraBox>
        </AuroraStack>
      </AuroraDialogContent>
      <AuroraDialogActions sx={{ p: 2, pt: 0 }}>
        <AuroraButton onClick={onClose} disabled={loading}>
          Cancel
        </AuroraButton>
        <AuroraButton
          onClick={handleSave}
          variant="contained"
          disabled={loading || !date}
        >
          {loading ? "Scheduling..." : "Schedule Interview"}
        </AuroraButton>
      </AuroraDialogActions>
    </AuroraDialog>
  );
}
