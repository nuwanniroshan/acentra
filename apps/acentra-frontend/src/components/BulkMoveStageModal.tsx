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
    <AuroraDialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <AuroraDialogTitle>Move candidates to stage</AuroraDialogTitle>
      <AuroraDialogContent>
        <AuroraTypography variant="body1" sx={{ mb: 3 }}>
          You have selected <strong>{candidateCount}</strong> candidates. Select
          the stage you want to move them to:
        </AuroraTypography>

        <AuroraFormControl fullWidth sx={{ mt: 1 }}>
          <AuroraInputLabel>Target Stage</AuroraInputLabel>
          <AuroraSelect
            value={selectedStage}
            label="Target Stage"
            onChange={(e) => setSelectedStage(e.target.value as string)}
          >
            {stages.map((stage) => (
              <AuroraMenuItem key={stage.value} value={stage.value}>
                {stage.label}
              </AuroraMenuItem>
            ))}
          </AuroraSelect>
        </AuroraFormControl>
      </AuroraDialogContent>
      <AuroraDialogActions sx={{ p: 2, pt: 0 }}>
        <AuroraButton onClick={onClose} color="inherit">
          Cancel
        </AuroraButton>
        <AuroraButton
          onClick={handleConfirm}
          variant="contained"
          color="primary"
          disabled={!selectedStage}
        >
          Move Stage
        </AuroraButton>
      </AuroraDialogActions>
    </AuroraDialog>
  );
}
