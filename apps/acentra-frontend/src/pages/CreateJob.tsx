import { useState, useEffect, type ChangeEvent, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { jobsService, type ParsedJdData } from "@/services/jobsService";
import { departmentsService } from "@/services/departmentsService";
import { officesService } from "@/services/officesService";
import { feedbackService, type FeedbackTemplate } from "@/services/feedbackService";
import { useSnackbar } from "@/context/SnackbarContext";
import { useTenant } from "@/context/TenantContext";
import {
  AuroraBox,
  AuroraButton,
  AuroraTypography,
  AuroraAlert,
  AuroraSelect,
  AuroraMenuItem,
  AuroraFormControl,
  AuroraInputLabel,
  AuroraSaveIcon,
  AuroraArrowBackIcon,
  AuroraCheckbox,
  AuroraDivider,
  AuroraChip,
  AuroraCircularProgress,
  AuroraTextField,
  AuroraStack,
  AuroraPaper,
  alpha,
} from "@acentra/aurora-design-system";
import { Stepper, Step, StepLabel } from "@mui/material";
import { AuroraFileUpload } from "@/components/AuroraFileUpload";
import { useAuth } from "@/context/AuthContext";
import { ActionPermission } from "@acentra/shared-types";

const steps = ['Upload JD', 'Job Details', 'Feedback Templates'];

export function CreateJob() {
  const [activeStep, setActiveStep] = useState(0);
  const [isParsing, setIsParsing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [branch, setBranch] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [expectedClosingDate, setExpectedClosingDate] = useState("");
  const [parsedJdData, setParsedJdData] = useState<ParsedJdData | null>(null);
  const [jdFile, setJdFile] = useState<File | null>(null);

  // Options State
  const [departmentsList, setDepartmentsList] = useState<any[]>([]);
  const [branchesList, setBranchesList] = useState<any[]>([]);
  const [availableTemplates, setAvailableTemplates] = useState<FeedbackTemplate[]>([]);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const tenant = useTenant();
  const { showSnackbar } = useSnackbar();
  const { hasPermission } = useAuth();

  useEffect(() => {
    if (!hasPermission(ActionPermission.CREATE_JOBS)) {
      showSnackbar("You do not have permission to create jobs", "error");
      navigate(`/${tenant}/dashboard`);
      return;
    }
    loadOptions();
    loadFeedbackTemplates();
  }, [hasPermission, navigate, tenant, showSnackbar]);

  const loadOptions = async () => {
    try {
      const [deps, offs] = await Promise.all([
        departmentsService.getDepartments(),
        officesService.getOffices(),
      ]);
      setDepartmentsList(deps);
      setBranchesList(offs);
    } catch (err) {
      console.error(err);
      setError("Failed to load options.");
    }
  };

  const loadFeedbackTemplates = async () => {
    try {
      setIsLoadingTemplates(true);
      const templates = await feedbackService.getAllTemplates();
      setAvailableTemplates(templates.filter((t) => t.isActive));
    } catch (err) {
      console.error(err);
      setError("Failed to load feedback templates.");
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  const handleFileSelect = async (file: File) => {
    setJdFile(file);
    setIsParsing(true);
    setError(null);

    try {
      const data = await jobsService.parseJd(file);
      setParsedJdData(data);
      setTitle(data.title || "");
      setDescription(data.description || "");
      setTags(data.tags || []);
      setActiveStep(1);
      showSnackbar("JD parsed successfully!", "success");
    } catch (err: any) {
      console.error("Failed to parse JD", err);
      setError(err.message || "Failed to parse Job Description. Please try again.");
      showSnackbar("Failed to parse JD", "error");
    } finally {
      setIsParsing(false);
    }
  };

  const handleNextToFeedback = () => {
    if (!title || !description || !expectedClosingDate) {
      showSnackbar("Please fill in all required fields", "warning");
      return;
    }
    setActiveStep(2);
  };

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async () => {
    if (selectedTemplates.length === 0) {
      showSnackbar("Please select at least one feedback template", "warning");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const jobData: any = {
        title,
        description,
        department,
        branch,
        tags,
        start_date: startDate,
        expected_closing_date: expectedClosingDate,
        feedbackTemplateIds: selectedTemplates,
      };

      if (parsedJdData) {
        jobData.tempFileLocation = parsedJdData.tempFileLocation;
        jobData.jdContent = parsedJdData.content;
      }

      await jobsService.createJob(jobData);
      showSnackbar("Job opening created and sent for approval", "success");
      navigate(`/${tenant}/ats/jobs`);
    } catch (err: any) {
      console.error("Failed to create job", err);
      setError(err.message || "Failed to create job opening");
      showSnackbar("Failed to create job", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep0 = () => (
    <AuroraPaper sx={{ p: 6, textAlign: "center", maxWidth: 900, mx: "auto", borderRadius: 4 }}>
      <AuroraTypography variant="h4" fontWeight={800} gutterBottom>
        Create New Opening
      </AuroraTypography>
      <AuroraTypography color="text.secondary" sx={{ mb: 6 }}>
        To begin, please upload the Job Description. AI will automatically extract the details to build the opening.
      </AuroraTypography>

      <AuroraFileUpload
        label="Upload Job Description"
        description="PDF files are supported. AI will analyze your document instantly."
        onFileSelect={handleFileSelect}
        isProcessing={isParsing}
        processingLabel="AI is working its magic..."
        value={jdFile}
        error={error}
      />
    </AuroraPaper>
  );

  const renderStep1 = () => (
    <AuroraPaper sx={{ p: 4, borderRadius: 3 }}>
      <AuroraBox sx={{ display: "flex", gap: 4, alignItems: "flex-start" }}>
        {/* Form Side */}
        <AuroraBox sx={{ flex: 1 }}>
          <AuroraStack spacing={3}>
            <AuroraTypography variant="h6" fontWeight={700}>Review Extracted Details</AuroraTypography>

            <AuroraTextField
              fullWidth
              label="Job Title"
              value={title}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              required
              placeholder="e.g. Senior Product Designer"
            />

            <AuroraStack direction="row" spacing={2}>
              <AuroraFormControl fullWidth>
                <AuroraInputLabel>Department</AuroraInputLabel>
                <AuroraSelect
                  value={department}
                  label="Department"
                  onChange={(e) => setDepartment(e.target.value as string)}
                >
                  {departmentsList.map((dep) => (
                    <AuroraMenuItem key={dep.id} value={dep.name}>
                      {dep.name}
                    </AuroraMenuItem>
                  ))}
                </AuroraSelect>
              </AuroraFormControl>
              <AuroraFormControl fullWidth>
                <AuroraInputLabel>Branch/Location</AuroraInputLabel>
                <AuroraSelect
                  value={branch}
                  label="Branch/Location"
                  onChange={(e) => setBranch(e.target.value as string)}
                >
                  {branchesList.map((off) => (
                    <AuroraMenuItem key={off.id} value={off.name}>
                      {off.name}
                    </AuroraMenuItem>
                  ))}
                </AuroraSelect>
              </AuroraFormControl>
            </AuroraStack>

            <AuroraStack direction="row" spacing={2}>
              <AuroraTextField
                fullWidth
                label="Start Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={startDate}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)}
                required
              />
              <AuroraTextField
                fullWidth
                label="Expected Closing Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={expectedClosingDate}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setExpectedClosingDate(e.target.value)}
                required
                inputProps={{ min: startDate }}
              />
            </AuroraStack>

            <AuroraBox>
              <AuroraTypography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
                Skills & Tags
              </AuroraTypography>
              <AuroraBox sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
                {tags.map(tag => (
                  <AuroraChip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    status="primary"
                    variant="outlined"
                  />
                ))}
              </AuroraBox>
              <AuroraStack direction="row" spacing={1}>
                <AuroraTextField
                  size="small"
                  placeholder="Add skill (e.g. React, UX)"
                  value={tagInput}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setTagInput(e.target.value)}
                  onKeyPress={(e: KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleAddTag()}
                />
                <AuroraButton size="small" onClick={handleAddTag}>Add</AuroraButton>
              </AuroraStack>
            </AuroraBox>

            <AuroraTextField
              fullWidth
              label="Job Description"
              multiline
              rows={8}
              value={description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setDescription(e.target.value)}
              required
              placeholder="Paste or write the job description here..."
            />

            <AuroraBox sx={{ pt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <AuroraButton onClick={() => setActiveStep(0)}>Re-upload JD</AuroraButton>
              <AuroraButton
                variant="contained"
                size="large"
                onClick={handleNextToFeedback}
              >
                Next: Select Feedback Templates
              </AuroraButton>
            </AuroraBox>
          </AuroraStack>
        </AuroraBox>

        {/* Preview Side */}
        <AuroraBox
          sx={{
            width: 420,
            height: "fit-content",
            position: "sticky",
            top: 24,
            bgcolor: "background.default",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: theme => theme.shadows[1],
            overflow: "hidden",
          }}
        >
          <AuroraBox sx={{ p: 2, bgcolor: alpha("#2563eb", 0.05), borderBottom: "1px solid", borderColor: "divider", display: 'flex', alignItems: 'center', gap: 1 }}>
            <AuroraBox sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main', animation: 'pulse-dot 2s infinite' }} />
            <style>{`
              @keyframes pulse-dot {
                0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
                70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
                100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
              }
            `}</style>
            <AuroraTypography variant="subtitle2" fontWeight={800}>
              Careers Page Preview
            </AuroraTypography>
          </AuroraBox>
          <AuroraBox sx={{ p: 4 }}>
            <AuroraTypography variant="caption" color="primary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 1.5 }}>
              {department || "Department"}
            </AuroraTypography>
            <AuroraTypography variant="h5" fontWeight={800} sx={{ mt: 1, mb: 2, lineHeight: 1.2 }}>
              {title || "Position Title"}
            </AuroraTypography>
            <AuroraStack direction="row" spacing={1.5} sx={{ mb: 4 }}>
              <AuroraChip label={branch || "Location"} status="neutral" sx={{ borderRadius: 1.5 }} />
              <AuroraChip label="Full-time" status="neutral" variant="outlined" sx={{ borderRadius: 1.5 }} />
            </AuroraStack>

            <AuroraDivider sx={{ mb: 4 }} />

            <AuroraTypography variant="subtitle1" fontWeight={800} gutterBottom>
              Projected Opening
            </AuroraTypography>
            <AuroraTypography
              variant="body2"
              color="text.secondary"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 15,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap'
              }}
            >
              {description || "Upload a Job Description to see how it will appear on your public job board."}
            </AuroraTypography>
          </AuroraBox>
        </AuroraBox>
      </AuroraBox>
    </AuroraPaper>
  );

  const renderStep2 = () => (
    <AuroraPaper sx={{ p: 6, maxWidth: 900, mx: "auto", borderRadius: 4 }}>
      <AuroraTypography variant="h6" fontWeight={700} gutterBottom>
        Select Feedback Templates
      </AuroraTypography>
      <AuroraTypography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Choose the feedback templates that will be available for this job. Interviewers will use these to evaluate candidates.
      </AuroraTypography>

      {isLoadingTemplates ? (
        <AuroraBox sx={{ textAlign: 'center', py: 4 }}>
          <AuroraCircularProgress />
        </AuroraBox>
      ) : availableTemplates.length === 0 ? (
        <AuroraAlert severity="info" sx={{ mb: 4 }}>
          No feedback templates found. Please create some in settings.
        </AuroraAlert>
      ) : (
        <AuroraBox sx={{ mb: 4, border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
          <AuroraBox sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: alpha("#f8fafc", 0.5) }}>
            <AuroraTypography variant="caption" sx={{ fontWeight: 700 }}>AVAILABLE TEMPLATES</AuroraTypography>
            <AuroraButton
              size="small"
              onClick={() => {
                const allSelected = availableTemplates.length === selectedTemplates.length;
                setSelectedTemplates(allSelected ? [] : availableTemplates.map(t => t.id));
              }}
            >
              {availableTemplates.length === selectedTemplates.length ? "Deselect All" : "Select All"}
            </AuroraButton>
          </AuroraBox>
          <AuroraBox>
            {availableTemplates.map((template) => (
              <AuroraBox
                key={template.id}
                onClick={() => {
                  if (selectedTemplates.includes(template.id)) {
                    setSelectedTemplates(selectedTemplates.filter(id => id !== template.id));
                  } else {
                    setSelectedTemplates([...selectedTemplates, template.id]);
                  }
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  cursor: 'pointer',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  '&:last-child': { borderBottom: 0 },
                  transition: 'background-color 0.2s',
                  '&:hover': { bgcolor: alpha("#2563eb", 0.02) }
                }}
              >
                <AuroraCheckbox
                  checked={selectedTemplates.includes(template.id)}
                  onChange={() => { }} // Handled by box click
                />
                <AuroraBox>
                  <AuroraTypography variant="body1" fontWeight={600}>{template.name}</AuroraTypography>
                  <AuroraTypography variant="caption" color="text.secondary">
                    {(template as any).sections?.length || 0} evaluation sections included
                  </AuroraTypography>
                </AuroraBox>
              </AuroraBox>
            ))}
          </AuroraBox>
        </AuroraBox>
      )}

      <AuroraBox sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
        <AuroraButton onClick={() => setActiveStep(1)}>
          Back to Details
        </AuroraButton>
        <AuroraButton
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={isSubmitting || selectedTemplates.length === 0}
          startIcon={isSubmitting ? <AuroraCircularProgress size={20} color="inherit" /> : <AuroraSaveIcon />}
        >
          {isSubmitting ? "Creating Job..." : "Create Opening"}
        </AuroraButton>
      </AuroraBox>
    </AuroraPaper>
  );

  return (
    <AuroraBox sx={{ maxWidth: 1400, mx: "auto", p: 4 }}>
      <AuroraButton
        startIcon={<AuroraArrowBackIcon />}
        onClick={() => {
          if (activeStep === 0) navigate(`/${tenant}/ats/jobs`);
          else setActiveStep(activeStep - 1);
        }}
        sx={{ mb: 4 }}
      >
        Back
      </AuroraButton>

      <Stepper activeStep={activeStep} sx={{ mb: 6 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <AuroraAlert severity="error" sx={{ mb: 4 }} onClose={() => setError(null)}>
          {error}
        </AuroraAlert>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeStep === 0 && renderStep0()}
          {activeStep === 1 && renderStep1()}
          {activeStep === 2 && renderStep2()}
        </motion.div>
      </AnimatePresence>
    </AuroraBox>
  );
}
