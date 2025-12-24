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
  AuroraChip,
  AuroraDivider,
  AuroraGrid
} from "@acentra/aurora-design-system";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShareIcon from '@mui/icons-material/Share';
import { motion } from "framer-motion";
import { alpha } from "@mui/material";
import { jobsService, type Job } from "../../services/jobsService";
import { AuroraFileUpload } from "../../components/AuroraFileUpload";

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
      setSuccessMessage("Application submitted successfully! Our team will review it shortly.");
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
      <AuroraBox display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <AuroraCircularProgress size={60} thickness={4} />
      </AuroraBox>
    );
  }

  if (!job || error) {
    return (
      <AuroraContainer maxWidth="md" sx={{ py: 12, textAlign: "center" }}>
        <AuroraTypography variant="h4" fontWeight={900} gutterBottom sx={{ color: "error.main" }}>
          Position Unavailable
        </AuroraTypography>
        <AuroraTypography sx={{ color: "text.secondary", mb: 4 }}>
          {error || "We couldn't find the job you're looking for. It might have been filled or the link has expired."}
        </AuroraTypography>
        <Link to="/public/careers" style={{ textDecoration: 'none' }}>
          <AuroraButton startIcon={<ArrowBackIcon />} variant="contained" size="large" sx={{ borderRadius: 3 }}>
            Return to Career Board
          </AuroraButton>
        </Link>
      </AuroraContainer>
    );
  }

  return (
    <AuroraBox sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Premium Header */}
      <AuroraBox sx={{
        bgcolor: '#0f172a',
        color: 'white',
        pt: 10,
        pb: 12,
        background: 'radial-gradient(circle at top right, #1e293b, #0f172a)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <AuroraContainer maxWidth="lg">
          <Link to="/public/careers" style={{ textDecoration: 'none' }}>
            <AuroraButton
              startIcon={<ArrowBackIcon />}
              sx={{ mb: 6, color: "slate.400", fontWeight: 700, letterSpacing: 1, '&:hover': { color: 'white' } }}
            >
              BACK TO POSITIONS
            </AuroraButton>
          </Link>

          <AuroraStack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} gap={4}>
            <AuroraBox>
              <AuroraStack direction="row" spacing={1} mb={2}>
                <AuroraChip
                  label={job.department || "General"}
                  status="primary"
                  sx={{ borderRadius: 2 }}
                />
                <AuroraChip
                  label="Full Time"
                  status="success"
                  sx={{ borderRadius: 2 }}
                />
              </AuroraStack>
              <AuroraTypography variant="h2" fontWeight={900} letterSpacing={-2} gutterBottom sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                {job.title}
              </AuroraTypography>
              <AuroraStack direction="row" spacing={3} color="slate.400">
                <AuroraBox display="flex" alignItems="center" gap={1}>
                  <LocationOnIcon sx={{ fontSize: 20 }} />
                  <AuroraTypography fontWeight={500}>{job.branch || "Remote"}</AuroraTypography>
                </AuroraBox>
                <AuroraBox display="flex" alignItems="center" gap={1}>
                  <CalendarTodayIcon sx={{ fontSize: 20 }} />
                  <AuroraTypography fontWeight={500}>Posted Recently</AuroraTypography>
                </AuroraBox>
              </AuroraStack>
            </AuroraBox>

            <AuroraButton
              variant="contained"
              size="large"
              startIcon={<ShareIcon />}
              sx={{ borderRadius: 3, px: 4, py: 1.5, bgcolor: 'background.paper', color: 'text.primary', '&:hover': { bgcolor: 'slate.200' } }}
            >
              Share Position
            </AuroraButton>
          </AuroraStack>
        </AuroraContainer>
      </AuroraBox>

      <AuroraContainer maxWidth="lg" sx={{ mt: -6, position: 'relative', zIndex: 2, pb: 12 }}>
        <AuroraGrid container spacing={4}>
          {/* Main Content */}
          <AuroraGrid size={{ xs: 12, lg: 8 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <AuroraPaper sx={{ borderRadius: 4, p: 0, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
                {jdBlobUrl ? (
                  <iframe src={jdBlobUrl} title="Job Description" width="100%" height="800px" style={{ border: "none" }} />
                ) : (
                  <AuroraBox sx={{ p: 6 }}>
                    <AuroraTypography variant="h5" fontWeight={800} sx={{ mb: 3 }}>Job Description</AuroraTypography>
                    <AuroraTypography variant="body1" sx={{ whiteSpace: "pre-wrap", color: "text.secondary", lineHeight: 1.8 }}>
                      {job.description}
                    </AuroraTypography>
                  </AuroraBox>
                )}
              </AuroraPaper>
            </motion.div>
          </AuroraGrid>

          {/* Sidebar Area */}
          <AuroraGrid size={{ xs: 12, lg: 4 }}>
            <AuroraStack spacing={4} position="sticky" top={40}>
              {/* Application Card */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                <AuroraPaper sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                  <AuroraTypography variant="h5" fontWeight={800} gutterBottom>Apply Now</AuroraTypography>
                  <AuroraTypography variant="body2" color="text.secondary" mb={4}>
                    Take the first step towards joining our mission.
                  </AuroraTypography>

                  <form onSubmit={handleSubmit}>
                    <AuroraStack spacing={3}>
                      <AuroraBox>
                        <AuroraTypography variant="caption" fontWeight={800} sx={{ mb: 1, display: 'block', color: 'text.primary' }}>FULL NAME</AuroraTypography>
                        <AuroraInput
                          placeholder="What should we call you?"
                          fullWidth
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        />
                      </AuroraBox>

                      <AuroraBox>
                        <AuroraTypography variant="caption" fontWeight={800} sx={{ mb: 1, display: 'block', color: 'text.primary' }}>EMAIL ADDRESS</AuroraTypography>
                        <AuroraInput
                          placeholder="name@email.com"
                          type="email"
                          fullWidth
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        />
                      </AuroraBox>

                      <AuroraBox>
                        <AuroraTypography variant="caption" fontWeight={800} sx={{ mb: 1, display: 'block', color: 'text.primary' }}>PHONE (OPTIONAL)</AuroraTypography>
                        <AuroraInput
                          placeholder="+1 (555) 000-0000"
                          fullWidth
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        />
                      </AuroraBox>

                      <AuroraBox>
                        <AuroraTypography variant="caption" fontWeight={800} sx={{ mb: 1, display: 'block', color: 'text.primary' }}>RESUME / CV</AuroraTypography>
                        <AuroraFileUpload
                          label="Upload CV"
                          description="PDF or Word (Max 10MB)"
                          onFileSelect={(f) => setCvFile(f)}
                          value={cvFile}
                        />
                      </AuroraBox>

                      <AuroraButton
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        disabled={submitting || !cvFile}
                        sx={{ borderRadius: 3, py: 2, fontWeight: 800, fontSize: '1rem', mt: 2, boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.4)' }}
                      >
                        {submitting ? <AuroraCircularProgress size={24} color="inherit" /> : "Submit Application"}
                      </AuroraButton>

                      <AuroraTypography variant="caption" color="text.disabled" align="center" sx={{ px: 2 }}>
                        By applying, you agree to our Terms of Service and Privacy Policy.
                      </AuroraTypography>
                    </AuroraStack>
                  </form>
                </AuroraPaper>
              </motion.div>

              {/* Quick Info */}
              <AuroraPaper sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider', bgcolor: alpha('#f8fafc', 0.5) }}>
                <AuroraTypography variant="subtitle1" fontWeight={800} mb={3}>At a Glance</AuroraTypography>
                <AuroraStack spacing={2.5}>
                  <AuroraBox display="flex" justifyContent="space-between">
                    <AuroraTypography variant="body2" color="text.secondary">Location</AuroraTypography>
                    <AuroraTypography variant="body2" fontWeight={700}>{job.branch || 'Remote'}</AuroraTypography>
                  </AuroraBox>
                  <AuroraDivider />
                  <AuroraBox display="flex" justifyContent="space-between">
                    <AuroraTypography variant="body2" color="text.secondary">Department</AuroraTypography>
                    <AuroraTypography variant="body2" fontWeight={700}>{job.department || 'General'}</AuroraTypography>
                  </AuroraBox>
                  <AuroraDivider />
                  <AuroraBox display="flex" justifyContent="space-between">
                    <AuroraTypography variant="body2" color="text.secondary">Industry</AuroraTypography>
                    <AuroraTypography variant="body2" fontWeight={700}>Technology</AuroraTypography>
                  </AuroraBox>
                </AuroraStack>
              </AuroraPaper>
            </AuroraStack>
          </AuroraGrid>
        </AuroraGrid>
      </AuroraContainer>

      <AuroraSnackbar open={!!successMessage} autoHideDuration={6000} onClose={() => setSuccessMessage(null)}>
        <AuroraAlert severity="success" variant="filled" onClose={() => setSuccessMessage(null)} sx={{ borderRadius: 2 }}>
          {successMessage}
        </AuroraAlert>
      </AuroraSnackbar>

      <AuroraSnackbar open={!!error && !successMessage} autoHideDuration={6000} onClose={() => setError(null)}>
        <AuroraAlert severity="error" variant="filled" onClose={() => setError(null)} sx={{ borderRadius: 2 }}>
          {error}
        </AuroraAlert>
      </AuroraSnackbar>
    </AuroraBox>
  );
};
