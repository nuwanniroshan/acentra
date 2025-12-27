import { useState, useEffect } from "react";
import {
  AuroraBox,
  AuroraTypography,
  AuroraIconButton,
  AuroraDrawer,
  AuroraAvatar,
  AuroraSelect,
  AuroraMenuItem,
  AuroraFormControl,
  AuroraInputLabel,
  AuroraButton,
  AuroraTabs,
  AuroraTab,
  AuroraInput,
  AuroraDivider,
  AuroraChip,
  AuroraDialog,
  AuroraDialogTitle,
  AuroraDialogContent,
  AuroraDialogContentText,
  AuroraDialogActions,
  AuroraCloseIcon,
  AuroraCircularProgress,
  AuroraCalendarMonthIcon,
  AuroraLinkIcon,
  AuroraEmailIcon,
} from "@acentra/aurora-design-system";
import { useTenant } from "@/context/TenantContext";
import { API_BASE_URL } from "@/services/clients";
import { candidatesService } from "@/services/candidatesService";
import { CandidateFeedback } from "./CandidateFeedback";
import { CandidateComments } from "./CandidateComments";
import { CandidatePipelineHistory } from "./CandidatePipelineHistory";
import { CandidateAttachments } from "./CandidateAttachments";
import { CandidateAiOverview } from "./CandidateAiOverview";
import { CandidateScorecards } from "./CandidateScorecards";
import { InterviewSchedulingModal } from "./InterviewSchedulingModal";
import { SendEmailModal } from "./SendEmailModal";
import { AuroraFileUpload } from "./AuroraFileUpload";
import { useAppSelector } from "@/store/hooks";


interface Candidate {
  id: string;
  name: string;
  first_name?: string;
  last_name?: string;
  email: string;
  phone: string;
  current_address?: string;
  permanent_address?: string;
  status: string;
  cv_file_path?: string;
  cover_letter_path?: string;
  profile_picture?: string;
  education?: any[];
  experience?: any[];
  desired_salary?: number;
  referred_by?: string;
  website?: string;
  created_at: string;
  notes?: string;
  interview_date?: string;
  interview_link?: string;
  ai_match_score?: number;
  created_by?: {
    id: string;
    email: string;
    name?: string;
  };
}

interface CandidateDetailsDrawerProps {
  candidate: Candidate | null;
  open: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
  onUpdate: () => void;
  statuses?: { value: string; label: string }[];
}

export function CandidateDetailsDrawer({
  candidate,
  open,
  onClose,
  onStatusChange,
  onUpdate,
  statuses = [],
}: CandidateDetailsDrawerProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [notes, setNotes] = useState("");
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isUploadingCv, setIsUploadingCv] = useState(false);
  const [isLoadingCv, setIsLoadingCv] = useState(false);
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);



  const { user } = useAppSelector((state) => state.auth);
  const tenant = useTenant();
  const isRecruiter =
    user?.role === "recruiter" || user?.role === "hr" || user?.role === "admin";

  useEffect(() => {
    if (candidate) {
      loadCv();
      setNotes(candidate.notes || "");
    } else {
      setCvUrl(null);
      setNotes("");
    }
  }, [candidate]);

  const loadCv = async () => {
    if (!candidate) return;
    if (!candidate.cv_file_path) {
      setCvUrl(null);
      return;
    }

    setIsLoadingCv(true);
    try {
      const blob = await candidatesService.getCandidateCv(candidate.id);
      const url = URL.createObjectURL(blob);
      setCvUrl(url);
    } catch (err) {
      console.error("Failed to load CV", err);
      setCvUrl(null);
    } finally {
      setIsLoadingCv(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!candidate) return;
    setIsSavingNotes(true);
    try {
      await candidatesService.updateCandidateNotes(candidate.id, notes);
      onUpdate();
    } catch (err) {
      console.error("Failed to save notes", err);
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleDeleteCandidate = async () => {
    if (!candidate) return;
    try {
      await candidatesService.deleteCandidate(candidate.id);
      setShowDeleteDialog(false);
      onClose();
      onUpdate();
    } catch (err) {
      console.error("Failed to delete candidate", err);
    }
  };

  const handleOpenInNewTab = () => {
    if (cvUrl) {
      window.open(cvUrl, "_blank");
    }
  };

  const handleDownloadCv = () => {
    if (cvUrl && candidate) {
      const link = document.createElement('a');
      link.href = cvUrl;
      link.download = `${candidate.name} _CV.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleCvUpload = async (file: File) => {
    if (!candidate) return;

    setIsUploadingCv(true);
    try {
      await candidatesService.updateCandidateCv(candidate.id, file);

      // Reload CV after successful upload
      loadCv();
      onUpdate();
      alert("CV uploaded successfully");
    } catch (err) {
      console.error("Failed to upload CV", err);
      alert("Failed to upload CV");
    } finally {
      setIsUploadingCv(false);
    }
  };

  if (!candidate) return null;

  return (
    <>
      <AuroraDrawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: { xs: "100%", md: "1000px" },
            display: "flex",
            flexDirection: "row",
          },
        }}
      >
        {/* Left Sidebar */}
        <AuroraBox
          sx={{
            width: "280px",
            borderRight: "1px solid",
            borderColor: "divider",
            display: "flex",
            flexDirection: "column",
            bgcolor: "background.paper",
          }}
        >
          <AuroraBox
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <AuroraAvatar
              src={
                candidate.profile_picture
                  ? `${API_BASE_URL} /api/public / ${tenant} /candidates/${candidate.id}/profile-picture`
                  : `https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.id}`
              }
              sx={{ width: 80, height: 80, mb: 2, bgcolor: "primary.light" }}
            />
            < AuroraTypography variant="h6" fontWeight="bold" textAlign="center" >
              {candidate.name}
            </AuroraTypography >
            <AuroraChip
              label={
                statuses.find((o) => o.value === candidate.status)?.label ||
                candidate.status
              }
              status={candidate.status === "rejected" ? "error" : "primary"}
              sx={{ mt: 1 }}
            />
            {
              candidate.ai_match_score !== null && candidate.ai_match_score !== undefined && (
                <AuroraBox
                  sx={{
                    mt: 2,
                    px: 2,
                    py: 0.75,
                    borderRadius: 2,
                    bgcolor: "#7c3aed",
                    background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                    boxShadow: "0 4px 12px rgba(124, 58, 237, 0.2)",
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <AuroraTypography
                    variant="caption"
                    sx={{
                      color: "rgba(255,255,255,0.8)",
                      fontWeight: 700,
                      fontSize: '0.6rem',
                      textTransform: 'uppercase',
                      letterSpacing: 1
                    }}
                  >
                    Aura AI Match
                  </AuroraTypography>
                  <AuroraTypography
                    variant="h5"
                    sx={{
                      color: "#fff",
                      fontWeight: 800,
                      lineHeight: 1
                    }}
                  >
                    {candidate.ai_match_score}%
                  </AuroraTypography>
                </AuroraBox>
              )
            }
          </AuroraBox >

          <AuroraBox sx={{ p: 3, flexGrow: 1, overflowY: "auto" }}>
            {/* Basic Section */}
            <AuroraTypography
              variant="subtitle2"
              fontWeight="bold"
              sx={{ mb: 2, color: "text.primary" }}
            >
              Email
            </AuroraTypography>
            {candidate.email && (
              <AuroraTypography variant="body2" color="primary" sx={{ mb: 2 }}>
                {candidate.email}
              </AuroraTypography>
            )}

            <AuroraDivider sx={{ my: 2 }} />

            <AuroraTypography
              variant="subtitle2"
              fontWeight="bold"
              sx={{ mb: 2, color: "text.primary" }}
            >
              Phone No
            </AuroraTypography>
            {candidate.phone && (
              <AuroraTypography variant="body2" sx={{ mb: 2 }}>
                {candidate.phone}
              </AuroraTypography>
            )}

            <AuroraDivider sx={{ my: 2 }} />

            <AuroraTypography
              variant="subtitle2"
              fontWeight="bold"
              sx={{ mb: 2, color: "text.primary" }}
            >
              Address
            </AuroraTypography>
            {candidate.current_address && (
              <AuroraTypography variant="body2" sx={{ mb: 2 }}>
                {candidate.current_address}
              </AuroraTypography>
            )}

            <AuroraDivider sx={{ my: 2 }} />

            <AuroraTypography
              variant="subtitle2"
              fontWeight="bold"
              sx={{ mb: 2, color: "text.primary" }}
            >
              Desired Salary
            </AuroraTypography>
            {candidate.desired_salary && (
              <AuroraTypography variant="body2" sx={{ mb: 2 }}>
                ${candidate.desired_salary.toLocaleString()}
              </AuroraTypography>
            )}

            <AuroraDivider sx={{ my: 2 }} />

            {candidate.referred_by && (
              <>
                <AuroraTypography
                  variant="subtitle2"
                  fontWeight="bold"
                  sx={{ mb: 2, color: "text.primary" }}
                >
                  Referred By
                </AuroraTypography>
                <AuroraTypography variant="body2" sx={{ mb: 2 }}>
                  {candidate.referred_by}
                </AuroraTypography>
                <AuroraDivider sx={{ my: 2 }} />
              </>
            )}

            {/* Interview Info */}
            {(candidate.interview_date || candidate.interview_link) && (
              <>
                <AuroraTypography
                  variant="subtitle2"
                  fontWeight="bold"
                  sx={{ mb: 1, color: "text.primary", display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <AuroraCalendarMonthIcon sx={{ fontSize: 18 }} />
                  Interview Info
                </AuroraTypography>
                {candidate.interview_date && (
                  <AuroraTypography variant="body2" sx={{ mb: 1 }}>
                    {new Date(candidate.interview_date).toLocaleString()}
                  </AuroraTypography>
                )}
                {candidate.interview_link && (
                  <AuroraTypography
                    variant="body2"
                    color="primary"
                    sx={{
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      cursor: 'pointer',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                    onClick={() => window.open(candidate.interview_link, '_blank')}
                  >
                    <AuroraLinkIcon sx={{ fontSize: 14 }} />
                    Join Interview
                  </AuroraTypography>
                )}
                <AuroraDivider sx={{ my: 2 }} />
              </>
            )}

            {candidate.website && (

              <>
                <AuroraTypography
                  variant="subtitle2"
                  fontWeight="bold"
                  sx={{ mb: 2, color: "text.primary" }}
                >
                  Website/Portfolio
                </AuroraTypography>
                <AuroraTypography
                  variant="body2"
                  color="primary"
                  sx={{ mb: 2, wordBreak: "break-all" }}
                >
                  {candidate.website}
                </AuroraTypography>
                <AuroraDivider sx={{ my: 2 }} />
              </>
            )}

            {/* Education Section */}
            {candidate.education && candidate.education.length > 0 && (
              <>
                <AuroraTypography
                  variant="subtitle2"
                  fontWeight="bold"
                  sx={{ mb: 2, color: "text.primary" }}
                >
                  Education
                </AuroraTypography>
                {candidate.education.map((edu: any, index: number) => (
                  <AuroraBox key={index} sx={{ mb: 2 }}>
                    <AuroraTypography variant="body2" fontWeight="medium">
                      {edu.degree}
                    </AuroraTypography>
                    <AuroraTypography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      {edu.institution}
                    </AuroraTypography>
                    {(edu.startDate || edu.endDate) && (
                      <AuroraTypography
                        variant="caption"
                        color="text.secondary"
                      >
                        {edu.startDate}
                        {edu.startDate && edu.endDate && " - "}
                        {edu.endDate}
                      </AuroraTypography>
                    )}
                  </AuroraBox>
                ))}
                <AuroraDivider sx={{ my: 2 }} />
              </>
            )}

            {/* Experience Section */}
            {candidate.experience && candidate.experience.length > 0 && (
              <>
                <AuroraTypography
                  variant="subtitle2"
                  fontWeight="bold"
                  sx={{ mb: 2, color: "text.primary" }}
                >
                  Experiences
                </AuroraTypography>
                {candidate.experience.map((exp: any, index: number) => (
                  <AuroraBox key={index} sx={{ mb: 2 }}>
                    <AuroraTypography variant="body2" fontWeight="medium">
                      {exp.position || exp.title}
                    </AuroraTypography>
                    <AuroraTypography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      {exp.company}
                    </AuroraTypography>
                    {(exp.startDate || exp.endDate) && (
                      <AuroraTypography
                        variant="caption"
                        color="text.secondary"
                      >
                        {exp.startDate}
                        {exp.startDate && exp.endDate && " - "}
                        {exp.endDate}
                      </AuroraTypography>
                    )}
                  </AuroraBox>
                ))}
              </>
            )}
          </AuroraBox>

          {/* Actions */}
          <AuroraBox
            sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}
          >
            <AuroraFormControl fullWidth size="small" sx={{ mb: 2 }}>
              <AuroraInputLabel>Pipeline Status</AuroraInputLabel>
              <AuroraSelect
                value={candidate.status}
                label="Pipeline Status"
                onChange={(e) => onStatusChange(candidate.id, e.target.value)}
              >
                {statuses.map((option) => (
                  <AuroraMenuItem key={option.value} value={option.value}>
                    {option.label}
                  </AuroraMenuItem>
                ))}
              </AuroraSelect>
            </AuroraFormControl>

            <AuroraButton
              variant="outlined"
              fullWidth
              onClick={() => setEmailModalOpen(true)}
              sx={{ mb: 1 }}
              startIcon={<AuroraEmailIcon />}
            >
              Send Email
            </AuroraButton>

            <AuroraButton
              variant="contained"
              fullWidth
              onClick={() => setInterviewModalOpen(true)}
              sx={{ mb: 1 }}
              startIcon={<AuroraCalendarMonthIcon />}
            >
              Schedule Interview
            </AuroraButton>

            <AuroraButton
              color="error"
              fullWidth
              onClick={() => onStatusChange(candidate.id, "rejected")}
              disabled={candidate.status === "rejected"}
            >
              Reject Candidate
            </AuroraButton>

            <AuroraButton
              variant="text"
              color="error"
              fullWidth
              onClick={() => setShowDeleteDialog(true)}
              sx={{ mt: 1 }}
            >
              Delete Candidate
            </AuroraButton>
          </AuroraBox>

        </AuroraBox >

        {/* Right Content Area */}
        < AuroraBox
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            height: "100vh",
          }}
        >
          <AuroraBox
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <AuroraTypography variant="h6">Candidate Details</AuroraTypography>
            <AuroraIconButton onClick={onClose}>
              <AuroraCloseIcon />
            </AuroraIconButton>
          </AuroraBox>

          {/* Tabs */}
          <AuroraBox sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}>
            <AuroraTabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
              <AuroraTab label="Documents" />
              <AuroraTab label="AI Overview" />
              <AuroraTab label="Feedback" />
              <AuroraTab label="Scorecards" />
              <AuroraTab label="Notes" />
              <AuroraTab label="Pipeline History" />
              <AuroraTab label="Attachments" />
            </AuroraTabs>
          </AuroraBox>

          {/* Tab Content */}
          <AuroraBox
            sx={{ flexGrow: 1, overflowY: "auto", p: 3, minHeight: 0 }}
          >
            {/* Documents Tab */}
            {activeTab === 0 && (
              <AuroraBox
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Document Preview */}
                {isLoadingCv ? (
                  <AuroraBox
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <AuroraCircularProgress />
                  </AuroraBox>
                ) : cvUrl ? (
                  <AuroraBox
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <AuroraBox
                      sx={{
                        display: "flex",
                        gap: 2,
                        mb: 2,
                        alignItems: "center",
                        justifyContent: "flex-end",
                      }}
                    >
                      <AuroraButton onClick={handleDownloadCv}>
                        Download
                      </AuroraButton>
                      <AuroraButton onClick={handleOpenInNewTab}>
                        Open in New Tab
                      </AuroraButton>
                    </AuroraBox>
                    <AuroraBox
                      sx={{
                        flexGrow: 1,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                        overflow: "hidden",
                        minHeight: 0,
                      }}
                    >
                      <iframe
                        src={cvUrl}
                        style={{
                          width: "100%",
                          height: "100%",
                          border: "none",
                        }}
                        title="CV Preview"
                      />
                    </AuroraBox>
                  </AuroraBox>
                ) : (
                  <AuroraBox
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      p: 4,
                    }}
                  >
                    <AuroraTypography
                      variant="h6"
                      fontWeight={800}
                      gutterBottom
                    >
                      No CV Available
                    </AuroraTypography>
                    <AuroraTypography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 4, textAlign: 'center', maxWidth: 400 }}
                    >
                      This candidate doesn&apos;t have a CV uploaded yet. Upload one to enable AI screening and detailed evaluation.
                    </AuroraTypography>

                    {isRecruiter && (
                      <AuroraBox sx={{ width: '100%', maxWidth: 500 }}>
                        <AuroraFileUpload
                          label="Upload Candidate CV"
                          description="PDF, Word, or Txt files (Max 6MB)"
                          maxSize={6 * 1024 * 1024}
                          onFileSelect={handleCvUpload}
                          isProcessing={isUploadingCv}
                        />
                      </AuroraBox>
                    )}
                  </AuroraBox>
                )}
              </AuroraBox>
            )}

            {/* AI Overview Tab */}
            {activeTab === 1 && (
              <CandidateAiOverview candidateId={candidate.id} />
            )}

            {/* Feedback Tab */}
            {activeTab === 2 && (
              <CandidateFeedback
                candidate={candidate}
                isRecruiter={isRecruiter}
              />
            )}

            {/* Scorecards Tab */}
            {activeTab === 3 && (
              <CandidateScorecards candidateId={candidate.id} />
            )}

            {/* Notes Tab */}
            {activeTab === 4 && (
              <AuroraBox>
                <AuroraInput
                  fullWidth
                  multiline
                  rows={12}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this candidate..."
                  disabled={!isRecruiter}
                />
                {isRecruiter && (
                  <AuroraButton
                    variant="contained"
                    onClick={handleSaveNotes}
                    disabled={isSavingNotes}
                    sx={{ mt: 2 }}
                  >
                    {isSavingNotes ? "Saving..." : "Save Notes"}
                  </AuroraButton>
                )}
              </AuroraBox>
            )}

            {/* Pipeline History Tab */}
            {activeTab === 5 && (
              <CandidatePipelineHistory
                candidateId={candidate.id}
                statuses={statuses}
                onRefresh={onUpdate}
                createdAt={candidate.created_at}
                currentStatus={candidate.status}
              />
            )}

            {/* Attachments Tab */}
            {activeTab === 6 && (
              <CandidateAttachments candidateId={candidate.id} />
            )}
          </AuroraBox>

          {/* Comments Section */}
          <CandidateComments candidateId={candidate.id} />
        </AuroraBox >
      </AuroraDrawer >

      {/* Delete Confirmation Dialog */}
      < AuroraDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      >
        <AuroraDialogTitle>Delete Candidate</AuroraDialogTitle>
        <AuroraDialogContent>
          <AuroraDialogContentText>
            Are you sure you want to delete this candidate? This action cannot
            be undone.
          </AuroraDialogContentText>
        </AuroraDialogContent>
        <AuroraDialogActions>
          <AuroraButton onClick={() => setShowDeleteDialog(false)}>
            Cancel
          </AuroraButton>
          <AuroraButton
            onClick={handleDeleteCandidate}
            color="error"
            variant="contained"
          >
            Delete
          </AuroraButton>
        </AuroraDialogActions>
      </AuroraDialog >

      <InterviewSchedulingModal
        open={interviewModalOpen}
        onClose={() => setInterviewModalOpen(false)}
        candidateId={candidate.id}
        candidateName={candidate.name}
        onSuccess={onUpdate}
        initialDate={candidate.interview_date}
        initialLink={candidate.interview_link}
      />

      <SendEmailModal
        open={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        candidate={candidate as any}
      />
    </>
  );
}
