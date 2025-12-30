import { useState, useEffect } from "react";
import {
  AuroraDialog,
  AuroraDialogTitle,
  AuroraDialogContent,
  AuroraDialogContentText,
  AuroraDialogActions,
  AuroraButton,
  AuroraInput,
  AuroraTypography,
} from "@acentra/aurora-design-system";
import { Stack } from "@mui/material";

interface RequestDemoModalProps {
  open: boolean;
  onClose: () => void;
}

export function RequestDemoModal({ open, onClose }: RequestDemoModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    meetingTime: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (open) {
      setFormData({
        name: "",
        email: "",
        phone: "",
        meetingTime: "",
      });
      setStatus("idle");
      setErrorMessage("");
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.name || !formData.email || !formData.phone) {
      setErrorMessage("Please fill in all required fields.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${API_BASE_URL}/api/public/request-demo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit request");
      }

      setStatus("success");
    } catch (error) {
      console.error(error);
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  const handleClose = () => {
    if (status === "success") {
      // Reset form on close after success
      setFormData({ name: "", email: "", phone: "", meetingTime: "" });
      setStatus("idle");
    }
    onClose();
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "rgba(15, 23, 42, 0.2)",
      },
      "&:hover fieldset": {
        borderColor: "rgba(15, 23, 42, 0.4)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#0f172a", // Dark Slate focus
      },
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#0f172a",
    }
  };

  const dialogPaperProps = {
    sx: {
      borderRadius: 3,
      background: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      border: "1px solid rgba(255, 255, 255, 0.5)",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
    },
  };

  if (status === "success") {
    return (
      <AuroraDialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        PaperProps={dialogPaperProps}
      >
        <AuroraDialogTitle sx={{ fontWeight: 700, color: "#0f172a" }}>Request Sent</AuroraDialogTitle>
        <AuroraDialogContent>
          <AuroraDialogContentText sx={{ mb: 2, fontSize: "0.95rem", color: "#475569" }}>
            Thank you. Our representative will contact you shortly.
          </AuroraDialogContentText>
        </AuroraDialogContent>
        <AuroraDialogActions sx={{ p: 3, pt: 1 }}>
          <AuroraButton
            onClick={handleClose}
            variant="contained"
            fullWidth
            sx={{
              bgcolor: "#0f172a",
              color: "white",
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 2,
              py: 1,
              "&:hover": { bgcolor: "#1e293b" },
            }}
          >
            Close
          </AuroraButton>
        </AuroraDialogActions>
      </AuroraDialog>
    );
  }

  return (
    <AuroraDialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={dialogPaperProps}
    >
      <AuroraDialogTitle sx={{ fontWeight: 700, color: "#0f172a", pb: 1 }}>Request a Demo</AuroraDialogTitle>
      <AuroraDialogContent>
        <AuroraDialogContentText sx={{ mb: 3, fontSize: "0.95rem", color: "#475569" }}>
          Please fill in your details below and we will get back to you to schedule a demo.
        </AuroraDialogContentText>
        <Stack spacing={2.5}>
          <AuroraInput
            margin="dense"
            label="Name *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
            error={status === "error" && !formData.name}
            sx={inputSx}
          />
          <AuroraInput
            margin="dense"
            label="Email *"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
            error={status === "error" && !formData.email}
            sx={inputSx}
          />
          <AuroraInput
            margin="dense"
            label="Phone Number *"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            required
            error={status === "error" && !formData.phone}
            sx={inputSx}
          />
          <AuroraInput
            margin="dense"
            label="Preferred Meeting Time (Optional)"
            name="meetingTime"
            value={formData.meetingTime}
            onChange={handleChange}
            fullWidth
            sx={inputSx}
          />
          {status === "error" && errorMessage && (
            <AuroraTypography color="error" variant="body2" sx={{ fontSize: "0.875rem", mt: 1 }}>
              {errorMessage}
            </AuroraTypography>
          )}
        </Stack>
      </AuroraDialogContent>
      <AuroraDialogActions sx={{ p: 3, pt: 2, gap: 1 }}>
        <AuroraButton
          onClick={onClose}
          disabled={status === "submitting"}
          color="inherit"
          variant="text"
          sx={{
            textTransform: "none",
            borderRadius: 2,
            fontWeight: 600,
            color: "#64748b",
            "&:hover": { bgcolor: "rgba(100, 116, 139, 0.1)", color: "#0f172a" }
          }}
        >
          Cancel
        </AuroraButton>
        <AuroraButton
          onClick={handleSubmit}
          variant="contained"
          disabled={status === "submitting"}
          sx={{
            bgcolor: "#0f172a",
            color: "white",
            textTransform: "none",
            fontWeight: 700,
            borderRadius: 2,
            px: 4,
            "&:hover": { bgcolor: "#1e293b" },
            flex: 1
          }}
        >
          {status === "submitting" ? "Sending..." : "Submit Request"}
        </AuroraButton>
      </AuroraDialogActions>
    </AuroraDialog>
  );
}
