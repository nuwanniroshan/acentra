import { useState, useEffect } from "react";
import {
  AuroraDialog,
  AuroraDialogTitle,
  AuroraDialogContent,
  AuroraDialogActions,
  AuroraButton,
  AuroraBox,
  AuroraTextField,
  AuroraSelect,
  AuroraMenuItem,
  AuroraFormControl,
  AuroraInputLabel,
  AuroraAlert,
  AuroraCircularProgress,
} from "@acentra/aurora-design-system";
import { apiClient } from "@/services/clients";

interface SendEmailModalProps {
  open: boolean;
  onClose: () => void;
  candidate: { id: string; name: string; email: string; job?: { title: string } };
}

export function SendEmailModal({ open, onClose, candidate }: SendEmailModalProps) {
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [emailData, setEmailData] = useState({ subject: "", body: "" });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      loadTemplates();
      setSuccess(false);
      setError("");
    }
  }, [open]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/email-templates");
      setTemplates(response.data);
    } catch (err) {
      console.error("Failed to load templates", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      // Replace placeholders
      const subject = template.subject
        .replace(/{{candidate_name}}/g, candidate.name)
        .replace(/{{job_title}}/g, candidate.job?.title || "");

      const body = template.body
        .replace(/{{candidate_name}}/g, candidate.name)
        .replace(/{{job_title}}/g, candidate.job?.title || "");

      setEmailData({ subject, body });
    }
  };

  const handleSend = async () => {
    try {
      setSending(true);
      setError("");

      // We don't have a direct "Send Email" endpoint yet. 
      // I'll reuse a common pattern or create one.
      // For now, I'll simulate or call a generic notify endpoint if it exists.
      // Wait, CandidateController doesn't have a direct sendEmail.
      // I should implement POST /api/candidates/:id/send-email in the backend.

      await apiClient.post(`/candidates/${candidate.id}/send-email`, emailData);

      setSuccess(true);
      setTimeout(onClose, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send email");
    } finally {
      setSending(false);
    }
  };

  return (
    <AuroraDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <AuroraDialogTitle>Send Email to {candidate.name}</AuroraDialogTitle>
      <AuroraDialogContent>
        <AuroraBox sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          {success && <AuroraAlert severity="success">Email sent successfully!</AuroraAlert>}
          {error && <AuroraAlert severity="error">{error}</AuroraAlert>}

          <AuroraFormControl fullWidth>
            <AuroraInputLabel>Select Template</AuroraInputLabel>
            <AuroraSelect
              value={selectedTemplateId}
              label="Select Template"
              onChange={(e) => handleTemplateChange(e.target.value)}
              disabled={loading || sending}
            >
              <AuroraMenuItem value="">Custom Email (No Template)</AuroraMenuItem>
              {templates.map((t) => (
                <AuroraMenuItem key={t.id} value={t.id}>{t.name}</AuroraMenuItem>
              ))}
            </AuroraSelect>
          </AuroraFormControl>

          <AuroraTextField
            label="Subject"
            value={emailData.subject}
            onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
            fullWidth
            disabled={sending}
          />

          <AuroraTextField
            label="Message"
            value={emailData.body}
            onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
            fullWidth
            multiline
            rows={12}
            disabled={sending}
            placeholder="Enter your email message here..."
          />
        </AuroraBox>
      </AuroraDialogContent>
      <AuroraDialogActions>
        <AuroraButton onClick={onClose} disabled={sending}>Cancel</AuroraButton>
        <AuroraButton
          onClick={handleSend}
          variant="contained"
          disabled={sending || !emailData.subject || !emailData.body}
          startIcon={sending && <AuroraCircularProgress size={20} />}
        >
          {sending ? "Sending..." : "Send Email"}
        </AuroraButton>
      </AuroraDialogActions>
    </AuroraDialog>
  );
}
