import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  AuroraBox,
  AuroraContainer,
  AuroraTypography,
  AuroraButton,
  AuroraPaper,
  AuroraInput,
  AuroraCircularProgress,
  AuroraAlert,
  AuroraSnackbar,
  AuroraStack,
} from "@acentra/aurora-design-system";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { motion } from "framer-motion";
import { jobsService, type Job } from "../../services/jobsService";

export const PublicJobDetails = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [jdBlobUrl, setJdBlobUrl] = useState<string | null>(null);


  useEffect(() => {
    if (jobId) {
      fetchJob(jobId);
      fetchJd(jobId);
    }
  }, [jobId]);

  const fetchJob = async (id: string) => {
    setLoading(true);
    try {
      const data = await jobsService.getPublicJob(id);
      setJob(data);
    } catch (err) {
      console.error("Failed to fetch job", err);
      setError("Job not found or no longer available.");
    } finally {
      setLoading(false);
    }
  };

  const fetchJd = async (id: string) => {
    try {
      const blob = await jobsService.getPublicJobJd(id);
      if (blob && blob.size > 0) {
        const url = URL.createObjectURL(blob);
        setJdBlobUrl(url);
      }
    } catch (err) {
      console.error("Failed to fetch JD file", err);
    }
  };



  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobId || !cvFile) return;

    setSubmitting(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("cv", cvFile);

    try {
      await jobsService.applyJob(jobId, formData);
      setSuccessMessage("Application submitted successfully! Good luck.");
      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setCvFile(null);

    } catch (err) {
      console.error("Application failed", err);
      setError("Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AuroraBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <AuroraCircularProgress />
      </AuroraBox>
    );
  }

  if (!job || error) {
    return (
      <AuroraContainer maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
        <AuroraTypography variant="h5" color="error" gutterBottom>
          {error || "Job not found"}
        </AuroraTypography>
        <Link to="/public/careers" style={{ textDecoration: 'none' }}>
          <AuroraButton
            startIcon={<ArrowBackIcon />}
          >
            Back to Jobs
          </AuroraButton>
        </Link>
      </AuroraContainer>
    );
  }

  return (
    <AuroraContainer maxWidth="lg" sx={{ py: 6 }}>
      <Link to="/public/careers" style={{ textDecoration: 'none' }}>
        <AuroraButton
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 4, color: "text.secondary" }}
        >
          Back to all jobs
        </AuroraButton>
      </Link>

      <AuroraBox mb={4}>
        <AuroraTypography
          variant="h3"
          fontWeight="bold"
          gutterBottom
          sx={{ color: "#0F172A" }}
        >
          {job.title}
        </AuroraTypography>

        <AuroraStack direction="row" spacing={1} mb={0} flexWrap="wrap">
          {/* Tags if needed, but Design usually puts them content or sidebar. The user's image shows them? No, user image doesn't show tags under title. It shows 'Job Overview' metadata. I will remove the tags under title as per user image purity. */}
        </AuroraStack>
      </AuroraBox>

      <AuroraBox
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          alignItems: "flex-start",
        }}
      >
        {/* Left Column: Job Description and Details */}
        <AuroraBox sx={{ flex: 1, minWidth: 0 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AuroraBox>
              <AuroraPaper
                elevation={1}
                sx={{
                  p: 0,
                  mb: 4,
                  borderRadius: 2,
                  boxShadow:
                    "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
                  overflow: "hidden",
                  minHeight: "800px",
                }}
              >
                {jdBlobUrl ? (
                  <iframe
                    src={jdBlobUrl}
                    title="Job Description"
                    width="100%"
                    height="800px"
                    style={{ border: "none" }}
                  />
                ) : (
                  <AuroraBox p={4}>
                    <AuroraTypography
                      variant="h6"
                      gutterBottom
                      fontWeight="bold"
                      sx={{ color: "#0F172A" }}
                    >
                      Description
                    </AuroraTypography>
                    <AuroraTypography
                      variant="body1"
                      component="div"
                      sx={{
                        mb: 4,
                        whiteSpace: "pre-wrap",
                        color: "#334155",
                        lineHeight: 1.7,
                      }}
                    >
                      {job.description}
                    </AuroraTypography>
                  </AuroraBox>
                )}
              </AuroraPaper>
            </AuroraBox>
          </motion.div>
        </AuroraBox>

        {/* Right Column: Sticky Sidebar with Job Overview / Application Form */}
        <AuroraBox sx={{ width: { xs: "100%", md: "350px", lg: "400px" }, flexShrink: 0 }}>
          <AuroraBox position="sticky" top={100}>
            <AuroraPaper
              elevation={1}
              sx={{
                p: 3,
                borderRadius: 2,
                boxShadow:
                  "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
              }}
            >
              <AuroraTypography
                variant="h6"
                gutterBottom
                fontWeight="bold"
                sx={{ color: "#0F172A", mb: 3 }}
              >
                Job Overview
              </AuroraTypography>

              <AuroraStack spacing={3} mb={4}>
                {/* Employment Type */}
                <AuroraBox>
                  <AuroraStack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    mb={0.5}
                  >
                    <BusinessIcon
                      sx={{ color: "text.secondary", fontSize: 20 }}
                    />
                    <AuroraTypography
                      variant="subtitle2"
                      fontWeight="bold"
                      color="text.primary"
                    >
                      Department
                    </AuroraTypography>
                  </AuroraStack>
                  <AuroraTypography
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 3.5 }}
                  >
                    {job.department || "Not specified"}
                  </AuroraTypography>
                </AuroraBox>

                {/* Work Mode / Branch */}
                <AuroraBox>
                  <AuroraStack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    mb={0.5}
                  >
                    <LocationOnIcon
                      sx={{ color: "text.secondary", fontSize: 20 }}
                    />
                    <AuroraTypography
                      variant="subtitle2"
                      fontWeight="bold"
                      color="text.primary"
                    >
                      Location
                    </AuroraTypography>
                  </AuroraStack>
                  <AuroraTypography
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 3.5 }}
                  >
                    {job.branch || "Remote"}
                  </AuroraTypography>
                </AuroraBox>

                {/* Deadline */}
                <AuroraBox>
                  <AuroraStack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    mb={0.5}
                  >
                    <CalendarTodayIcon
                      sx={{ color: "text.secondary", fontSize: 20 }}
                    />
                    <AuroraTypography
                      variant="subtitle2"
                      fontWeight="bold"
                      color="text.primary"
                    >
                      Deadline
                    </AuroraTypography>
                  </AuroraStack>
                  <AuroraTypography
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 3.5 }}
                  >
                    {new Date(job.expected_closing_date).toLocaleDateString()}
                  </AuroraTypography>
                </AuroraBox>
              </AuroraStack>

              <AuroraBox
                sx={{
                  borderTop: "1px solid #E2E8F0",
                  my: 3,
                }}
              />

              <AuroraTypography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                sx={{ mb: 3, color: "#0F172A" }}
              >
                Apply for this position
              </AuroraTypography>

              <form onSubmit={handleSubmit}>
                <AuroraStack spacing={2.5}>
                  <AuroraBox>
                    <AuroraTypography
                      variant="caption"
                      fontWeight="bold"
                      sx={{ mb: 0.5, display: "block", color: "#334155" }}
                    >
                      Full Name
                    </AuroraTypography>
                    <AuroraInput
                      placeholder="John Doe"
                      fullWidth
                      required
                      size="small"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 1.5,
                          bgcolor: "#FFFFFF",
                        },
                      }}
                    />
                  </AuroraBox>

                  <AuroraBox>
                    <AuroraTypography
                      variant="caption"
                      fontWeight="bold"
                      sx={{ mb: 0.5, display: "block", color: "#334155" }}
                    >
                      Email Address
                    </AuroraTypography>
                    <AuroraInput
                      placeholder="john@example.com"
                      type="email"
                      fullWidth
                      required
                      size="small"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 1.5,
                          bgcolor: "#FFFFFF",
                        },
                      }}
                    />
                  </AuroraBox>

                  <AuroraBox>
                    <AuroraTypography
                      variant="caption"
                      fontWeight="bold"
                      sx={{ mb: 0.5, display: "block", color: "#334155" }}
                    >
                      Phone Number
                    </AuroraTypography>
                    <AuroraInput
                      placeholder="+1 (555) 000-0000"
                      fullWidth
                      size="small"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 1.5,
                          bgcolor: "#FFFFFF",
                        },
                      }}
                    />
                  </AuroraBox>

                  <AuroraBox>
                    <AuroraTypography
                      variant="caption"
                      fontWeight="bold"
                      sx={{ mb: 0.5, display: "block", color: "#334155" }}
                    >
                      Resume/CV *
                    </AuroraTypography>
                    <AuroraButton
                      variant="outlined"
                      component="label"
                      fullWidth
                      startIcon={<UploadFileIcon />}
                      color={cvFile ? "success" : "inherit"}
                      sx={{
                        height: 48,
                        borderRadius: 1.5,
                        borderColor: cvFile ? undefined : "#CBD5E1",
                        color: cvFile ? undefined : "#64748B",
                        textTransform: "none",
                        justifyContent: "flex-start",
                        px: 2,
                      }}
                    >
                      <AuroraTypography variant="body2" noWrap>
                        {cvFile ? cvFile.name : "Upload Resume (PDF)"}
                      </AuroraTypography>
                      <input
                        type="file"
                        hidden
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileChange(e)}
                      />
                    </AuroraButton>
                  </AuroraBox>

                  <AuroraStack direction="row" spacing={2} mt={1}>
                    <AuroraButton
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={submitting || !cvFile}
                      sx={{
                        borderRadius: 1.5,
                        textTransform: "none",
                        fontWeight: 600,
                        boxShadow: "none",
                      }}
                    >
                      {submitting ? (
                        <AuroraCircularProgress size={20} color="inherit" />
                      ) : (
                        "Submit Application"
                      )}
                    </AuroraButton>
                  </AuroraStack>
                </AuroraStack>
              </form>
            </AuroraPaper>
          </AuroraBox>
        </AuroraBox>
      </AuroraBox>

      <AuroraSnackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage(null)}
      >
        <AuroraAlert severity="success" onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </AuroraAlert>
      </AuroraSnackbar>
      <AuroraSnackbar
        open={!!error && !successMessage}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <AuroraAlert severity="error" onClose={() => setError(null)}>
          {error}
        </AuroraAlert>
      </AuroraSnackbar>
    </AuroraContainer>
  );
};
