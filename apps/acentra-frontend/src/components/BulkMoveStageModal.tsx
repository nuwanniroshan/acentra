import { useState } from "react";

import {
  AuroraDialog,
  AuroraDialogTitle,
  AuroraDialogContent,
  AuroraDialogActions,
  AuroraButton,
  AuroraFormControl,
  AuroraInputLabel,
  AuroraSelect,
  AuroraMenuItem,
  AuroraTypography,
} from "@acentra/aurora-design-system";

interface BulkMoveStageModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (stage: string) => void;
  candidateCount: number;
  stages: { value: string; label: string }[];
}

export function BulkMoveStageModal({
  open,
  onClose,
  onConfirm,
  candidateCount,
  stages,
}: BulkMoveStageModalProps) {
  const [selectedStage, setSelectedStage] = useState("");

  const handleConfirm = () => {
    if (selectedStage) {
      onConfirm(selectedStage);
    }
  };

  return (
    <AuroraDialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 4, p: 1 }
      }}
    >
      <AuroraDialogTitle sx={{ pb: 1 }}>
        <AuroraTypography variant="h5" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
          Update Pipeline Stage
        </AuroraTypography>
      </AuroraDialogTitle>
      <AuroraDialogContent>
        <AuroraTypography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
          Move <strong>{candidateCount}</strong> selected candidates to a new stage in the recruitment process.
        </AuroraTypography>

        <AuroraFormControl fullWidth sx={{ mt: 1 }}>
          <AuroraInputLabel>Target Stage</AuroraInputLabel>
          <AuroraSelect
            value={selectedStage}
            label="Target Stage"
            onChange={(e) => setSelectedStage(e.target.value as string)}
            sx={{ borderRadius: 2.5 }}
          >
            {stages.map((stage) => (
              <AuroraMenuItem key={stage.value} value={stage.value}>
                {stage.label}
              </AuroraMenuItem>
            ))}
          </AuroraSelect>
        </AuroraFormControl>
      </AuroraDialogContent>
      <AuroraDialogActions sx={{ p: 3, pt: 1 }}>
        <AuroraButton onClick={onClose} sx={{ borderRadius: 2.5, px: 3 }}>
          Cancel
        </AuroraButton>
        <AuroraButton
          onClick={handleConfirm}
          variant="contained"
          color="primary"
          disabled={!selectedStage}
          sx={{ borderRadius: 2.5, px: 4, py: 1, fontWeight: 700 }}
        >
          Move Stage
        </AuroraButton>
      </AuroraDialogActions>
    </AuroraDialog>
  );
}
