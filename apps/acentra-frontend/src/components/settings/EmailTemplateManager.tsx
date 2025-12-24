import { useState, useEffect } from "react";
import {
  AuroraBox,
  AuroraTypography,
  AuroraButton,
  AuroraTextField,
  AuroraList,
  AuroraListItem,
  AuroraListItemText,
  AuroraDivider,
  AuroraDialog,
  AuroraDialogTitle,
  AuroraDialogContent,
  AuroraDialogActions,
  AuroraAlert,
} from "@acentra/aurora-design-system";
import { apiClient } from "@/services/clients";

export function EmailTemplateManager() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", subject: "", body: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    loadTemplates();
  }, []);

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

  const handleOpen = (template: any = null) => {
    if (template) {
      setCurrentTemplate(template);
      setFormData({ name: template.name, subject: template.subject, body: template.body });
    } else {
      setCurrentTemplate(null);
      setFormData({ name: "", subject: "", body: "" });
    }
    setOpen(true);
    setError("");
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name || !formData.subject || !formData.body) {
        setError("All fields are required");
        return;
      }

      if (currentTemplate) {
        await apiClient.patch(`/email-templates/${currentTemplate.id}`, formData);
      } else {
        await apiClient.post("/email-templates", formData);
      }
      loadTemplates();
      handleClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save template");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      try {
        await apiClient.delete(`/email-templates/${id}`);
        loadTemplates();
      } catch (err) {
        console.error("Failed to delete template", err);
      }
    }
  };

  return (
    <AuroraBox>
      <AuroraBox sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <AuroraTypography variant="h6">Email Templates</AuroraTypography>
        <AuroraButton variant="contained" onClick={() => handleOpen()} size="small">
          Add Template
        </AuroraButton>
      </AuroraBox>

      <AuroraTypography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Create reusable email templates for consistent candidate communication. Placeholders supported: {"{{candidate_name}}"}, {"{{job_title}}"}.
      </AuroraTypography>

      {loading ? (
        <AuroraTypography>Loading...</AuroraTypography>
      ) : (
        <AuroraList>
          {templates.map((template, index) => (
            <AuroraBox key={template.id}>
              <AuroraListItem
                secondaryAction={
                  <AuroraBox sx={{ display: "flex", gap: 1 }}>
                    <AuroraButton size="small" onClick={() => handleOpen(template)}>Edit</AuroraButton>
                    <AuroraButton size="small" color="error" onClick={() => handleDelete(template.id)}>Delete</AuroraButton>
                  </AuroraBox>
                }
              >
                <AuroraListItemText
                  primary={template.name}
                  secondary={template.subject}
                />
              </AuroraListItem>
              {index < templates.length - 1 && <AuroraDivider />}
            </AuroraBox>
          ))}
          {templates.length === 0 && (
            <AuroraTypography color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
              No templates created yet.
            </AuroraTypography>
          )}
        </AuroraList>
      )}

      <AuroraDialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <AuroraDialogTitle>
          {currentTemplate ? "Edit Template" : "New Email Template"}
        </AuroraDialogTitle>
        <AuroraDialogContent>
          <AuroraBox sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
            {error && <AuroraAlert severity="error">{error}</AuroraAlert>}
            <AuroraTextField
              label="Template Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Interview Invitation"
              fullWidth
            />
            <AuroraTextField
              label="Email Subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="e.g. Interview Invitation - {{job_title}}"
              fullWidth
            />
            <AuroraTextField
              label="Message Body"
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              multiline
              rows={10}
              placeholder="Hi {{candidate_name}}, ..."
              fullWidth
            />
          </AuroraBox>
        </AuroraDialogContent>
        <AuroraDialogActions>
          <AuroraButton onClick={handleClose}>Cancel</AuroraButton>
          <AuroraButton onClick={handleSubmit} variant="contained">
            Save Template
          </AuroraButton>
        </AuroraDialogActions>
      </AuroraDialog>
    </AuroraBox>
  );
}
