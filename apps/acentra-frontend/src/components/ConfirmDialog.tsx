import {
  AuroraDialog,
  AuroraDialogTitle,
  AuroraDialogContent,
  AuroraDialogContentText,
  AuroraDialogActions,
  AuroraButton,
} from "@acentra/aurora-design-system";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmColor?: "primary" | "error" | "warning";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmColor = "primary",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AuroraDialog open={open} onClose={onCancel}>
      <AuroraDialogTitle>{title}</AuroraDialogTitle>
      <AuroraDialogContent>
        <AuroraDialogContentText>{message}</AuroraDialogContentText>
      </AuroraDialogContent>
      <AuroraDialogActions>
        <AuroraButton onClick={onCancel}>{cancelLabel}</AuroraButton>
        <AuroraButton
          onClick={onConfirm}
          color={confirmColor}
          variant="contained"
          autoFocus
        >
          {confirmLabel}
        </AuroraButton>
      </AuroraDialogActions>
    </AuroraDialog>
  );
}
