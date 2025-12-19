import { useState, useEffect, useRef } from "react";
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
  AuroraDescriptionIcon,
  AuroraUploadIcon,
  AuroraCircularProgress,
} from "@acentra/aurora-design-system";
import { useTenant } from "@/context/TenantContext";
import { API_BASE_URL } from "@/services/clients";
import { candidatesService } from "@/services/candidatesService";
import { CandidateFeedback } from "./CandidateFeedback";
import { CandidateComments } from "./CandidateComments";
import { CandidatePipelineHistory } from "./CandidatePipelineHistory";
import { CandidateAttachments } from "./CandidateAttachments";
import { CandidateAiOverview } from "./CandidateAiOverview";
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
  const cvFileInputRef = useRef<HTMLInputElement>(null);

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
      link.download = `${candidate.name}_CV.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleCvUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !candidate) return;

    // Validate file size (6MB max)
    if (file.size > 6 * 1024 * 1024) {
      alert("File size must not exceed 6MB");
      return;
    }

    // Validate file type
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.type)) {
      alert("Only PDF, DOC, and DOCX files are allowed");
      return;
    }

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
      // Reset file input
      if (cvFileInputRef.current) {
        cvFileInputRef.current.value = "";
      }
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
        {/* Left Sidebar - UNCHANGED */}
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
                  ? `${API_BASE_URL}/api/public/${tenant}/candidates/${candidate.id}/profile-picture`
                  : `https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.id}`
              }
              sx={{ width: 80, height: 80, mb: 2, bgcolor: "primary.light" }}
            />
            <AuroraTypography variant="h6" fontWeight="bold" textAlign="center">
              {candidate.name}
            </AuroraTypography>
            <AuroraChip
              label={
                statuses.find((o) => o.value === candidate.status)?.label ||
                candidate.status
              }
              size="small"
              color={candidate.status === "rejected" ? "error" : "primary"}
              sx={{ mt: 1 }}
            />
          </AuroraBox>

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
              color="error"
              fullWidth
              onClick={() => onStatusChange(candidate.id, "rejected")}
              disabled={candidate.status === "rejected"}
            >
              Reject Candidate
            </AuroraButton>

            <AuroraButton
              variant="contained"
              color="error"
              fullWidth
              onClick={() => setShowDeleteDialog(true)}
              sx={{ mt: 1 }}
            >
              Delete Candidate
            </AuroraButton>
          </AuroraBox>
        </AuroraBox>

        {/* Right Content Area */}
        <AuroraBox
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
              <AuroraTab label="Notes" />
              <AuroraTab label="Pipeline History" />
              <AuroraTab label="Attachments" />
            </AuroraTabs>
          </AuroraBox>

          {/* Tab Content - Takes remaining space above comments */}
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
                      height: "300px",
                      border: "2px dashed",
                      borderColor: "divider",
                      borderRadius: 2,
                      bgcolor: "background.default",
                      flexGrow: 1,
                    }}
                  >
                    <AuroraDescriptionIcon
                      sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                    />
                    <AuroraTypography
                      variant="body1"
                      color="text.secondary"
                      gutterBottom
                    >
                      No CV available
                    </AuroraTypography>
                    {isRecruiter && (
                      <>
                        <input
                          type="file"
                          ref={cvFileInputRef}
                          style={{ display: "none" }}
                          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          onChange={handleCvUpload}
                        />
                        <AuroraButton
                          variant="contained"
                          startIcon={<AuroraUploadIcon />}
                          onClick={() => cvFileInputRef.current?.click()}
                          disabled={isUploadingCv}
                          sx={{ mt: 2 }}
                        >
                          {isUploadingCv ? "Uploading..." : "Upload CV"}
                        </AuroraButton>
                      </>
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

            {/* Notes Tab */}
            {activeTab === 3 && (
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
                {!isRecruiter && (
                  <AuroraTypography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1, display: "block" }}
                  >
                    Only recruiters can edit notes
                  </AuroraTypography>
                )}
              </AuroraBox>
            )}

            {/* Pipeline History Tab */}
            {activeTab === 4 && (
              <CandidatePipelineHistory
                candidateId={candidate.id}
                statuses={statuses}
                onRefresh={onUpdate}
              />
            )}

            {/* Attachments Tab */}
            {activeTab === 5 && (
              <CandidateAttachments candidateId={candidate.id} />
            )}
          </AuroraBox>

          {/* Comments Section - Using separate component */}
          <CandidateComments candidateId={candidate.id} />
        </AuroraBox>
      </AuroraDrawer>

      {/* Delete Confirmation Dialog */}
      <AuroraDialog
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
      </AuroraDialog>
    </>
  );
}
