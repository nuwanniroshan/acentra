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
      "&.Mui-focused fieldset": {
        borderColor: "#ec7211",
      },
    },
  };

  if (status === "success") {
    return (
      <AuroraDialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <AuroraDialogTitle sx={{ fontWeight: 600 }}>Request Sent</AuroraDialogTitle>
        <AuroraDialogContent>
          <AuroraDialogContentText sx={{ mb: 2, fontSize: "0.9rem" }}>
            Thank you. Our representative will contact you shortly.
          </AuroraDialogContentText>
        </AuroraDialogContent>
        <AuroraDialogActions sx={{ p: 2 }}>
          <AuroraButton
            onClick={handleClose}
            variant="contained"
            sx={{
              bgcolor: "#ec7211",
              color: "white",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              "&:hover": { bgcolor: "#eb5f07" },
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
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <AuroraDialogTitle sx={{ fontWeight: 600 }}>Request a Demo</AuroraDialogTitle>
      <AuroraDialogContent>
        <AuroraDialogContentText sx={{ mb: 2, fontSize: "0.9rem" }}>
          Please fill in your details below and we will get back to you to schedule a demo.
        </AuroraDialogContentText>
        <Stack spacing={2}>
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
            <AuroraTypography color="error" variant="body2">
              {errorMessage}
            </AuroraTypography>
          )}
        </Stack>
      </AuroraDialogContent>
      <AuroraDialogActions sx={{ p: 2 }}>
        <AuroraButton
          onClick={onClose}
          disabled={status === "submitting"}
          color="inherit"
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Cancel
        </AuroraButton>
        <AuroraButton
          onClick={handleSubmit}
          variant="contained"
          disabled={status === "submitting"}
          sx={{
            bgcolor: "#ec7211",
            color: "white",
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            "&:hover": { bgcolor: "#eb5f07" },
          }}
        >
          {status === "submitting" ? "Sending..." : "Submit"}
        </AuroraButton>
      </AuroraDialogActions>
    </AuroraDialog>
  );
}
