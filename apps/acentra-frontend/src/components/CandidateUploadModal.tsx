import { useState, useEffect } from "react";
import { candidatesService } from "@/services/candidatesService";
import { jobsService } from "@/services/jobsService";
import { useSnackbar } from "@/context/SnackbarContext";
import {
  AuroraDialog,
  AuroraDialogTitle,
  AuroraDialogContent,
  AuroraDialogActions,
  AuroraButton,
  AuroraTextField,
  AuroraTypography,
  AuroraStack,
  AuroraBox,
  AuroraSelect,
  AuroraMenuItem,
  AuroraFormControl,
  AuroraInputLabel,
  alpha,
} from "@acentra/aurora-design-system";
import { AuroraFileUpload } from "./AuroraFileUpload";
import { LinearProgress } from "@mui/material";

interface Props {
  jobId?: string;
  open: boolean;
  onClose: () => void;
  onUpload: () => void;
}

export function CandidateUploadModal({ jobId: initialJobId, open, onClose, onUpload }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedJobId, setSelectedJobId] = useState(initialJobId || "");
  const [files, setFiles] = useState<File[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (open) {
      loadJobs();
    }
  }, [open]);

  const loadJobs = async () => {
    try {
      const data = await jobsService.getJobs({ status: "open" });
      setJobs(data);
    } catch (err) {
      console.error("Failed to load jobs", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0 || (!selectedJobId && !initialJobId)) {
      showSnackbar("Please select a job and upload at least one CV", "warning");
      return;
    }

    setUploading(true);
    setProgress(0);

    let successCount = 0;
    const targetJobId = initialJobId || selectedJobId;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // For bulk upload, we might not have names/emails, so we'll use file names as placeholders
        // In a real system, you'd parse them on the backend
        await candidatesService.createCandidate({
          name: files.length === 1 ? name : file.name.split('.')[0],
          first_name: files.length === 1 ? name.split(" ")[0] : file.name.split('.')[0],
          last_name: files.length === 1 ? name.split(" ").slice(1).join(" ") : "",
          email: files.length === 1 ? email : `pending-${Math.random().toString(36).substr(2, 5)}@example.com`,
          phone: "",
          jobId: targetJobId,
          cv: file,
        });
        successCount++;
        setProgress(Math.round(((i + 1) / files.length) * 100));
      }

      showSnackbar(`Successfully uploaded ${successCount} candidates`, "success");
      onUpload();
      handleClose();
    } catch (err) {
      console.error("Upload failed", err);
      showSnackbar("Failed to upload some candidates", "error");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleClose = () => {
    setName("");
    setEmail("");
    setFiles([]);
    setSelectedJobId(initialJobId || "");
    onClose();
  };

  const isBulk = files.length > 1;

  return (
    <AuroraDialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 5, p: 1 }
      }}
    >
      <AuroraDialogTitle sx={{ pb: 0 }}>
        <AuroraTypography variant="h5" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
          {files.length > 1 ? "Bulk Upload Candidates" : "Add New Candidate"}
        </AuroraTypography>
        <AuroraTypography variant="body2" sx={{ color: "text.secondary" }}>
          {files.length > 1
            ? `Uploading ${files.length} candidate resumes simultaneously.`
            : "Fill in the details or simply upload a resume to get started."}
        </AuroraTypography>
      </AuroraDialogTitle>

      <form onSubmit={handleSubmit}>
        <AuroraDialogContent>
          <AuroraStack spacing={3} sx={{ mt: 3 }}>
            {!initialJobId && (
              <AuroraFormControl fullWidth variant="outlined">
                <AuroraInputLabel>Target Job Opening</AuroraInputLabel>
                <AuroraSelect
                  value={selectedJobId}
                  label="Target Job Opening"
                  onChange={(e) => setSelectedJobId(e.target.value as string)}
                  required
                  sx={{ borderRadius: 2.5 }}
                >
                  {jobs.map((job) => (
                    <AuroraMenuItem key={job.id} value={job.id}>
                      {job.title}
                    </AuroraMenuItem>
                  ))}
                </AuroraSelect>
              </AuroraFormControl>
            )}

            {!isBulk && (
              <>
                <AuroraBox sx={{ display: "flex", gap: 2 }}>
                  <AuroraTextField
                    fullWidth
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isBulk}
                    placeholder="e.g. John Doe"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
                  />
                  <AuroraTextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required={!isBulk}
                    placeholder="e.g. john@example.com"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
                  />
                </AuroraBox>
              </>
            )}

            <AuroraBox>
              <AuroraTypography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, color: "text.primary" }}>
                {isBulk ? "Candidates CVs" : "Upload Candidate CV"}
              </AuroraTypography>
              <AuroraFileUpload
                label={isBulk ? "Drop all resumes here" : "Drop resume here"}
                description="PDF files (Max 5MB each)"
                maxSize={5 * 1024 * 1024}
                onFileSelect={(f) => setFiles(prev => [...prev, f])}
                value={files[0]} // Just for display of first file if single
              />

              {files.length > 0 && (
                <AuroraBox sx={{ mt: 2, p: 2, bgcolor: alpha("#3b82f6", 0.05), borderRadius: 3, border: "1px dashed", borderColor: alpha("#3b82f6", 0.2) }}>
                  <AuroraTypography variant="caption" sx={{ fontWeight: 800, color: "primary.main", textTransform: "uppercase", display: "block", mb: 1 }}>
                    {files.length} Files selected for upload
                  </AuroraTypography>
                  <AuroraStack spacing={1}>
                    {files.map((f, i) => (
                      <AuroraBox key={i} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <AuroraTypography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>{f.name}</AuroraTypography>
                        <AuroraButton size="small" sx={{ minWidth: 0, p: 0.5, color: "error.main" }} onClick={() => setFiles(files.filter((_, idx) => idx !== i))}>Remove</AuroraButton>
                      </AuroraBox>
                    ))}
                  </AuroraStack>
                </AuroraBox>
              )}
            </AuroraBox>

            {uploading && (
              <AuroraBox sx={{ mt: 2 }}>
                <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
                <AuroraTypography variant="caption" sx={{ mt: 1, display: "block", textAlign: "center", fontWeight: 700 }}>
                  Uploading candidates... {progress}%
                </AuroraTypography>
              </AuroraBox>
            )}
          </AuroraStack>
        </AuroraDialogContent>
        <AuroraDialogActions sx={{ p: 4, pt: 2 }}>
          <AuroraButton onClick={handleClose} disabled={uploading} sx={{ borderRadius: 2.5, px: 3 }}>
            Cancel
          </AuroraButton>
          <AuroraButton
            type="submit"
            variant="contained"
            disabled={uploading || files.length === 0}
            sx={{ borderRadius: 2.5, px: 5, py: 1.25, boxShadow: "0 8px 16px rgba(59, 130, 246, 0.2)" }}
          >
            {uploading ? "Processing..." : files.length > 1 ? `Upload ${files.length} Candidates` : "Add Candidate"}
          </AuroraButton>
        </AuroraDialogActions>
      </form>
    </AuroraDialog>
  );
}
