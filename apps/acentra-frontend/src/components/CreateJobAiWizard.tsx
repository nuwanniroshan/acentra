import { useState, type ChangeEvent, type KeyboardEvent } from "react";
import { useDropzone } from "react-dropzone";
import {
  AuroraBox,
  AuroraTypography,
  AuroraButton,
  AuroraStack,
  AuroraTextField,
  AuroraDivider,
  AuroraChip,
  AuroraCircularProgress,
  AuroraUploadIcon,
  alpha,
} from "@acentra/aurora-design-system";
import { jobsService } from "@/services/jobsService";
import { useNavigate } from "react-router-dom";
import { useTenant } from "@/context/TenantContext";
import { useSnackbar } from "@/context/SnackbarContext";
import { motion, AnimatePresence } from "framer-motion";

export function CreateJobAiWizard() {
  const [isParsing, setIsParsing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [parsedData, setParsedData] = useState<any>(null);

  // Job Post Fields
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [branch, setBranch] = useState("");
  const [closingDate, setClosingDate] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const navigate = useNavigate();
  const tenant = useTenant();
  const { showSnackbar } = useSnackbar();

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const selectedFile = acceptedFiles[0];
    setIsParsing(true);

    try {
      const data = await jobsService.parseJd(selectedFile);
      setParsedData(data);
      setJobTitle(data.title || "");
      setJobDescription(data.description || "");
      setSelectedTags(data.tags || []);
    } catch (err) {
      console.error("Failed to parse JD", err);
      showSnackbar("Failed to parse Job Description. Please try again.", "error");
    } finally {
      setIsParsing(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
    },
    multiple: false,
  });

  const handleAddTag = () => {
    if (tagInput && !selectedTags.includes(tagInput)) {
      setSelectedTags([...selectedTags, tagInput]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const handleCreateJob = async () => {
    if (!jobTitle || !jobDescription || !closingDate) {
      showSnackbar("Please fill in all required fields", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      await jobsService.createJob({
        title: jobTitle,
        description: jobDescription,
        department,
        branch,
        start_date: new Date().toISOString().split('T')[0], // Add default start date
        expected_closing_date: closingDate,
        tags: selectedTags,
        feedbackTemplateIds: ["99fcd350-0091-4e46-9d32-d17b5e612ed6"], // Default template for now or let user select
        jdContent: parsedData?.content,
        tempFileLocation: parsedData?.tempFileLocation,
      });
      showSnackbar("Job opening created and sent for approval", "success");
      navigate(`/${tenant}/ats/jobs`);
    } catch (err) {
      console.error("Failed to create job", err);
      showSnackbar("Failed to create job opening", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuroraBox sx={{ maxWidth: 1200, mx: "auto", p: 4 }}>
      <AuroraBox sx={{ mb: 4 }}>
        <AuroraTypography variant="h4" fontWeight={800} gutterBottom>
          Create New Opening
        </AuroraTypography>
        <AuroraTypography color="text.secondary">
          Upload a Job Description and let AI help you set up the opening in seconds.
        </AuroraTypography>
      </AuroraBox>

      <AuroraBox sx={{ display: "flex", gap: 4, alignItems: "flex-start" }}>
        {/* Left Side: Upload & Form */}
        <AuroraBox sx={{ flex: 1 }}>
          <AnimatePresence mode="wait">
            {!parsedData && !isParsing ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <AuroraBox
                  {...getRootProps()}
                  sx={{
                    p: 6,
                    border: "2px dashed",
                    borderColor: isDragActive ? "primary.main" : "divider",
                    borderRadius: 4,
                    textAlign: "center",
                    cursor: "pointer",
                    bgcolor: isDragActive ? alpha("#2563eb", 0.04) : "transparent",
                    transition: "all 0.2s",
                    "&:hover": {
                      borderColor: "primary.main",
                      bgcolor: alpha("#2563eb", 0.02),
                    },
                  }}
                >
                  <input {...getInputProps()} />
                  <AuroraUploadIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
                  <AuroraTypography variant="h6" fontWeight={700} gutterBottom>
                    Drop your Job Description here
                  </AuroraTypography>
                  <AuroraTypography color="text.secondary">
                    Supports PDF, Word, or TXT
                  </AuroraTypography>
                </AuroraBox>
              </motion.div>
            ) : isParsing ? (
              <AuroraBox sx={{ py: 10, textAlign: "center" }}>
                <AuroraCircularProgress size={48} sx={{ mb: 3 }} />
                <AuroraTypography variant="h6" fontWeight={600}>
                  AI is analyzing your Job Description...
                </AuroraTypography>
                <AuroraTypography color="text.secondary">
                  Extracting title, skills, and key requirements
                </AuroraTypography>
              </AuroraBox>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <AuroraStack spacing={3}>
                  <AuroraTextField
                    fullWidth
                    label="Job Title"
                    value={jobTitle}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setJobTitle(e.target.value)}
                    required
                  />
                  <AuroraStack direction="row" spacing={2}>
                    <AuroraTextField
                      fullWidth
                      label="Department"
                      value={department}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setDepartment(e.target.value)}
                    />
                    <AuroraTextField
                      fullWidth
                      label="Branch/Location"
                      value={branch}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setBranch(e.target.value)}
                    />
                  </AuroraStack>
                  <AuroraTextField
                    fullWidth
                    label="Expected Closing Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={closingDate}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setClosingDate(e.target.value)}
                    required
                  />

                  <AuroraBox>
                    <AuroraTypography variant="subtitle2" sx={{ mb: 1 }}>
                      Skills & Tags
                    </AuroraTypography>
                    <AuroraBox sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
                      {selectedTags.map(tag => (
                        <AuroraChip
                          key={tag}
                          label={tag}
                          onDelete={() => handleRemoveTag(tag)}
                          size="small"
                        />
                      ))}
                    </AuroraBox>
                    <AuroraStack direction="row" spacing={1}>
                      <AuroraTextField
                        size="small"
                        placeholder="Add skill..."
                        value={tagInput}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setTagInput(e.target.value)}
                        onKeyPress={(e: KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleAddTag()}
                      />
                      <AuroraButton size="small" onClick={handleAddTag}>Add</AuroraButton>
                    </AuroraStack>
                  </AuroraBox>

                  <AuroraTextField
                    fullWidth
                    label="Internal Description / Notes"
                    multiline
                    rows={4}
                    value={jobDescription}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setJobDescription(e.target.value)}
                  />

                  <AuroraBox sx={{ pt: 2, display: 'flex', gap: 2 }}>
                    <AuroraButton
                      variant="contained"
                      size="large"
                      fullWidth
                      onClick={handleCreateJob}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Creating..." : "Create Opening"}
                    </AuroraButton>
                    <AuroraButton
                      variant="outlined"
                      onClick={() => setParsedData(null)}
                    >
                      Start Over
                    </AuroraButton>
                  </AuroraBox>
                </AuroraStack>
              </motion.div>
            )}
          </AnimatePresence>
        </AuroraBox>

        {/* Right Side: Preview Panel */}
        <AuroraBox
          sx={{
            width: 400,
            height: "fit-content",
            position: "sticky",
            top: 100,
            bgcolor: "background.paper",
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            overflow: "hidden",
          }}
        >
          <AuroraBox sx={{ p: 2, bgcolor: alpha("#2563eb", 0.05), borderBottom: "1px solid", borderColor: "divider" }}>
            <AuroraTypography variant="subtitle1" fontWeight={800}>
              Live Preview
            </AuroraTypography>
          </AuroraBox>
          <AuroraBox sx={{ p: 3 }}>
            <AuroraTypography variant="caption" color="primary" fontWeight={700} sx={{ textTransform: 'uppercase' }}>
              {department || "Department"}
            </AuroraTypography>
            <AuroraTypography variant="h5" fontWeight={700} sx={{ mt: 0.5, mb: 1.5 }}>
              {jobTitle || "Job Title"}
            </AuroraTypography>
            <AuroraStack direction="row" spacing={1} sx={{ mb: 3 }}>
              <AuroraChip label={branch || "Location"} size="small" variant="outlined" />
              <AuroraChip label="Full-time" size="small" variant="outlined" />
            </AuroraStack>

            <AuroraDivider sx={{ mb: 3 }} />

            <AuroraTypography variant="subtitle2" fontWeight={700} gutterBottom>
              About the Role
            </AuroraTypography>
            <AuroraTypography
              variant="body2"
              color="text.secondary"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 10,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.6
              }}
            >
              {jobDescription || "Paste or upload a JD to see a preview of how candidates will see the role."}
            </AuroraTypography>
          </AuroraBox>
        </AuroraBox>
      </AuroraBox>
    </AuroraBox>
  );
}
