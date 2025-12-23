import { useState, useEffect } from 'react';
import {
  InputAdornment
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
  AuroraStack
} from '@acentra/aurora-design-system';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link } from 'react-router-dom';
import { jobsService, type Job } from '../../services/jobsService';

// TODO: Move to shared components
const JobCard = ({ job, tenantId }: { job: Job, tenantId?: string }) => {
  return (
    <AuroraCard
      elevation={0}
      component={Link}
      to={`/public/careers/${tenantId || (job as any).tenantId || 'default'}/jobs/${job.id}`}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        borderRadius: 3,
        bgcolor: 'background.paper',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        }
      }}
    >
      <AuroraCardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <AuroraTypography variant="h6" color="text.primary" fontWeight="bold" gutterBottom>
          {job.title}
        </AuroraTypography>

        <AuroraStack direction="row" spacing={3} mb={3} alignItems="center">
          {job.department && (
            <AuroraBox display="flex" alignItems="center" gap={1}>
              <BusinessIcon fontSize="small" sx={{ color: 'primary.main' }} />
              <AuroraTypography variant="body2" color="text.secondary" fontWeight={500}>
                {job.department}
              </AuroraTypography>
            </AuroraBox>
          )}
          {job.branch && (
            <AuroraBox display="flex" alignItems="center" gap={1}>
              <LocationOnIcon fontSize="small" sx={{ color: 'primary.main' }} />
              <AuroraTypography variant="body2" color="text.secondary" fontWeight={500}>
                {job.branch}
              </AuroraTypography>
            </AuroraBox>
          )}
        </AuroraStack>

        <AuroraTypography variant="body2" color="text.secondary" sx={{
          display: '-webkit-box',
          overflow: 'hidden',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 3,
          mb: 2,
          flexGrow: 1
        }}>
          {job.description.replace(/<[^>]*>/g, '')}
        </AuroraTypography>

        <AuroraBox display="flex" justifyContent="flex-end" alignItems="center" mt={2}>
          <AuroraTypography
            variant="button"
            color="primary"
            fontWeight="bold"
            sx={{ display: 'flex', alignItems: 'center', gap: 1, textTransform: 'none' }}
          >
            View Details <ArrowForwardIcon fontSize="small" />
          </AuroraTypography>
        </AuroraBox>
      </AuroraCardContent>
    </AuroraCard>
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
      // Ideally search term would be a query param too
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
    job.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AuroraBox sx={{ bgcolor: '#F3F4F6', minHeight: '100%', py: 8 }}>
      <AuroraContainer maxWidth="lg">
        <AuroraBox textAlign="center" mb={6}>
          <AuroraTypography variant="h2" component="h1" fontWeight="bold" gutterBottom>
            Find Your Dream Job
          </AuroraTypography>
          <AuroraTypography variant="h5" color="text.secondary" mb={4}>
            Browse open positions across all our companies
          </AuroraTypography>

          <AuroraInput
            fullWidth
            placeholder="Search by role, keyword, or company..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              sx: {
                bgcolor: 'background.paper',
                borderRadius: 4,
                pl: 1,
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                '& fieldset': { border: 'none' },
                '&:hover fieldset': { border: 'none' },
                '&.Mui-focused fieldset': { border: 'none' },
              }
            }}
            sx={{ maxWidth: 600, mx: 'auto' }}
          />
        </AuroraBox>

        {loading ? (
          <AuroraBox display="flex" justifyContent="center" py={4}>
            <AuroraCircularProgress />
          </AuroraBox>
        ) : (
          <>
            {filteredJobs.length === 0 ? (
              <AuroraBox textAlign="center" py={8}>
                <AuroraTypography variant="h6" color="text.secondary">
                  No jobs found matching your criteria.
                </AuroraTypography>
              </AuroraBox>
            ) : (
              <AuroraGrid container spacing={3}>
                {filteredJobs.map((job) => (
                  <AuroraGrid key={job.id} size={{ xs: 12, md: 4 }}>
                    {/* Pass tenantId if you have it, otherwise fallback to generic routing */}
                    <JobCard job={job} tenantId={(job as any).tenantId || 'default'} />
                  </AuroraGrid>
                ))}
              </AuroraGrid>
            )}

            <AuroraBox display="flex" justifyContent="center" mt={6}>
              <AuroraPagination
                count={totalPages}
                page={page}
                onChange={(_, p) => setPage(p)}
                color="primary"
              />
            </AuroraBox>
          </>
        )}
      </AuroraContainer>
    </AuroraBox>
  );
};

export default GlobalJobBoard;
