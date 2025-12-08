import { useState, useEffect } from "react";
import {
  AuroraDialog,
  AuroraDialogTitle,
  AuroraDialogContent,
  AuroraDialogActions,
  AuroraInput,
  AuroraButton,
  AuroraBox,
} from "@acentra/aurora-design-system";
import { jobsService } from "@/joblisting/services/jobsService";
import { useSnackbar } from "@/shared/context/SnackbarContext";

interface Job {
  id: string;
  title: string;
  description: string;
  department?: string;
  branch?: string;
  tags?: string[];
  expected_closing_date: string;
}

interface Props {
  job: Job;
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export function EditJobModal({ job, open, onClose, onUpdate }: Props) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department: "",
    branch: "",
    tags: "",
    expected_closing_date: "",
  });
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || "",
        description: job.description || "",
        department: job.department || "",
        branch: job.branch || "",
        tags: job.tags?.join(", ") || "",
        expected_closing_date: job.expected_closing_date
          ? new Date(job.expected_closing_date).toISOString().split("T")[0]
          : "",
      });
    }
  }, [job]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      await jobsService.updateJob(job.id, {
        title: formData.title,
        description: formData.description,
        department: formData.department,
        branch: formData.branch,
        tags: tagsArray,
        expected_closing_date: formData.expected_closing_date,
      });

      showSnackbar("Job updated successfully", "success");
      onUpdate();
      onClose();
    } catch (err: any) {
      showSnackbar(err.message || "Failed to update job", "error");
    }
  };

  return (
    <AuroraDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <AuroraDialogTitle>Edit Job</AuroraDialogTitle>
      <AuroraDialogContent>
        <AuroraBox
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <AuroraInput
            label="Job Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            required
          />
          <AuroraInput
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            required
          />
          <AuroraInput
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            fullWidth
          />
          <AuroraInput
            label="Branch"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            fullWidth
          />
          <AuroraInput
            label="Tags (comma-separated)"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            fullWidth
            placeholder="e.g. Full-time, Remote"
          />
          <AuroraInput
            label="Expected Closing Date"
            name="expected_closing_date"
            type="date"
            value={formData.expected_closing_date}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            required
          />
        </AuroraBox>
      </AuroraDialogContent>
      <AuroraDialogActions>
        <AuroraButton onClick={onClose}>Cancel</AuroraButton>
        <AuroraButton onClick={handleSubmit} variant="contained">
          Update Job
        </AuroraButton>
      </AuroraDialogActions>
    </AuroraDialog>
  );
}
