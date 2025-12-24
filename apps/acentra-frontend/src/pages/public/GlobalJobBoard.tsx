import { useState, useEffect } from 'react';
import {
  InputAdornment,
  alpha
} from '@mui/material';
import {
  AuroraBox,
  AuroraContainer,
  AuroraTypography,
  AuroraGrid,
  AuroraCard,
  AuroraCardContent,
  AuroraInput,
  AuroraCircularProgress,
  AuroraPagination,
  AuroraStack,
  AuroraButton,
  AuroraChip,
  AuroraPaper
} from '@acentra/aurora-design-system';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Link } from 'react-router-dom';
import { jobsService, type Job } from '../../services/jobsService';
import { motion, AnimatePresence } from 'framer-motion';

const JobCard = ({ job, tenantId }: { job: Job, tenantId?: string }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        to={`/public/careers/${tenantId || (job as any).tenantId || 'default'}/jobs/${job.id}`}
        style={{ textDecoration: 'none' }}
      >
        <AuroraCard
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'divider',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            overflow: 'hidden',
            '&:hover': {
              borderColor: 'primary.main',
              transform: 'translateY(-8px)',
              boxShadow: (theme) => `0 20px 25px -5px ${alpha(theme.palette.primary.main, 0.1)}, 0 10px 10px -5px ${alpha(theme.palette.primary.main, 0.04)}`,
              '& .view-details': {
                color: 'primary.main',
                gap: 1.5
              }
            }
          }}
        >
          <AuroraCardContent sx={{ p: 4 }}>
            <AuroraStack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
              <AuroraChip
                label={job.department || "General"}
                status="primary"
                sx={{ borderRadius: 2 }}
              />
              <AuroraBox sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.disabled' }}>
                <AccessTimeIcon sx={{ fontSize: 16 }} />
                <AuroraTypography variant="caption" fontWeight={600}>
                  New
                </AuroraTypography>
              </AuroraBox>
            </AuroraStack>

            <AuroraTypography variant="h5" fontWeight={800} gutterBottom sx={{ color: 'text.primary', mb: 2 }}>
              {job.title}
            </AuroraTypography>

            <AuroraStack spacing={1.5} mb={3}>
              <AuroraBox display="flex" alignItems="center" gap={1.5}>
                <LocationOnIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                <AuroraTypography variant="body2" color="text.secondary" fontWeight={500}>
                  {job.branch || "Remote"}
                </AuroraTypography>
              </AuroraBox>
              <AuroraBox display="flex" alignItems="center" gap={1.5}>
                <BusinessIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                <AuroraTypography variant="body2" color="text.secondary" fontWeight={500}>
                  {tenantId === 'default' ? 'Global Opportunity' : 'Corporate HQ'}
                </AuroraTypography>
              </AuroraBox>
            </AuroraStack>

            <AuroraTypography variant="body2" color="text.secondary" sx={{
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 3,
              mb: 3,
              lineHeight: 1.6
            }}>
              {job.description.replace(/<[^>]*>/g, '')}
            </AuroraTypography>

            <AuroraBox sx={{ mt: 'auto', pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <AuroraTypography
                variant="button"
                className="view-details"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  textTransform: 'none',
                  fontWeight: 700,
                  color: 'text.primary',
                  transition: 'all 0.2s ease'
                }}
              >
                View Position <ArrowForwardIcon sx={{ fontSize: 18 }} />
              </AuroraTypography>
            </AuroraBox>
          </AuroraCardContent>
        </AuroraCard>
      </Link>
    </motion.div>
  );
};

export const GlobalJobBoard = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchJobs();
  }, [page]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const result = await jobsService.getPublicJobs(undefined, page);
      setJobs(result.data);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error("Failed to fetch jobs", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AuroraBox sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Premium Hero Section */}
      <AuroraBox sx={{
        bgcolor: '#0f172a',
        color: 'white',
        pt: { xs: 12, md: 16 },
        pb: { xs: 20, md: 24 },
        px: 3,
        textAlign: 'center',
        background: 'radial-gradient(circle at top right, #1e293b, #0f172a)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <AuroraBox sx={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)",
          zIndex: 0
        }} />

        <AuroraContainer maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <AuroraTypography variant="overline" sx={{ letterSpacing: 4, fontWeight: 800, color: 'primary.light', mb: 2, display: 'block' }}>
              JOIN OUR WORLD-CLASS TEAMS
            </AuroraTypography>
            <AuroraTypography variant="h1" sx={{ fontWeight: 900, mb: 3, letterSpacing: -2, fontSize: { xs: '3rem', md: '4.5rem' } }}>
              Build the Future With Us
            </AuroraTypography>
            <AuroraTypography variant="h5" sx={{ color: 'slate.400', mb: 6, maxWidth: 700, mx: 'auto', fontWeight: 400, opacity: 0.8 }}>
              Discover opportunities across our ecosystem of innovative companies and take the next step in your career.
            </AuroraTypography>
          </motion.div>

          {/* Floating Search Bar */}
          <AuroraBox sx={{
            maxWidth: 700,
            mx: 'auto',
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: { xs: -100, md: -112 }, // Adjust based on height of search bar
            px: 2
          }}>
            <AuroraPaper sx={{
              p: 1.5,
              borderRadius: 6,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              gap: 2,
              alignItems: 'center',
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider'
            }}>
              <AuroraInput
                fullWidth
                placeholder="Search by role, department, or keywords..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'primary.main', ml: 1 }} />
                    </InputAdornment>
                  ),
                  sx: {
                    '& fieldset': { border: 'none' },
                    fontSize: '1.1rem',
                  }
                }}
              />
              <AuroraButton
                variant="contained"
                size="large"
                sx={{
                  borderRadius: 4,
                  px: 4,
                  py: 1.5,
                  display: { xs: 'none', sm: 'flex' }
                }}
              >
                Search
              </AuroraButton>
            </AuroraPaper>
          </AuroraBox>
        </AuroraContainer>
      </AuroraBox>

      {/* Featured Roles Section */}
      <AuroraContainer maxWidth="lg" sx={{ mt: 16, pb: 12 }}>
        <AuroraStack direction="row" justifyContent="space-between" alignItems="flex-end" mb={6}>
          <AuroraBox>
            <AuroraTypography variant="h4" fontWeight={900} letterSpacing={-1}>
              Open Positions
            </AuroraTypography>
            <AuroraTypography variant="body1" color="text.secondary">
              Showing {filteredJobs.length} available roles
            </AuroraTypography>
          </AuroraBox>

          <AuroraStack direction="row" spacing={2}>
            {/* Future filters could go here */}
          </AuroraStack>
        </AuroraStack>

        {loading ? (
          <AuroraBox display="flex" justifyContent="center" py={12}>
            <AuroraCircularProgress size={60} thickness={4} />
          </AuroraBox>
        ) : (
          <>
            <AnimatePresence mode="popLayout">
              {filteredJobs.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <AuroraBox textAlign="center" py={12} sx={{ bgcolor: 'action.hover', borderRadius: 8, border: '2px dashed', borderColor: 'divider' }}>
                    <AuroraTypography variant="h6" color="text.secondary" fontWeight={600}>
                      No matching roles found.
                    </AuroraTypography>
                    <AuroraButton
                      variant="text"
                      onClick={() => setSearchTerm("")}
                      sx={{ mt: 1 }}
                    >
                      Clear all filters
                    </AuroraButton>
                  </AuroraBox>
                </motion.div>
              ) : (
                <AuroraGrid container spacing={4}>
                  {filteredJobs.map((job) => (
                    <AuroraGrid key={job.id} size={{ xs: 12, md: 6, lg: 4 }}>
                      <JobCard job={job} tenantId={(job as any).tenantId || 'default'} />
                    </AuroraGrid>
                  ))}
                </AuroraGrid>
              )}
            </AnimatePresence>

            <AuroraBox display="flex" justifyContent="center" mt={10}>
              <AuroraPagination
                count={totalPages}
                page={page}
                onChange={(_, p) => setPage(p)}
                color="primary"
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontWeight: 700,
                    borderRadius: 2
                  }
                }}
              />
            </AuroraBox>
          </>
        )}
      </AuroraContainer>
    </AuroraBox>
  );
};

export default GlobalJobBoard;
