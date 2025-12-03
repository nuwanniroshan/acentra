import { useState, useEffect, useRef } from "react";
import { AuroraBox, AuroraTypography, AuroraIconButton, AuroraDrawer, AuroraAvatar, AuroraSelect, AuroraMenuItem, AuroraFormControl, AuroraInputLabel, AuroraButton, AuroraTabs, AuroraTab, AuroraInput, AuroraDivider, AuroraList, AuroraListItem, AuroraListItemText, AuroraListItemAvatar, AuroraPaper, AuroraChip, AuroraDialog, AuroraDialogTitle, AuroraDialogContent, AuroraDialogContentText, AuroraDialogActions, AuroraCloseIcon, AuroraDescriptionIcon, AuroraSendIcon, AuroraDownloadIcon, AuroraUploadIcon, AuroraExpandMoreIcon, AuroraExpandLessIcon } from '@acentra/aurora-design-system';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from "@mui/lab";
import { API_URL, API_BASE_URL } from "@/services/clients";
import { candidatesService } from "@/joblisting/services/candidatesService";
import { commentsService } from "@/joblisting/services/commentsService";

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
  cv_file_path: string;
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

interface Comment {
  id: string;
  text: string;
  created_at: string;
  created_by: {
    id: string;
    email: string;
    name?: string;
    profile_picture?: string;
  };
  attachment_path?: string;
  attachment_original_name?: string;
  attachment_type?: string;
  attachment_size?: number;
}

interface ActivityLog {
  id: string;
  old_status: string;
  new_status: string;
  changed_at: string;
  changed_by: {
    name?: string;
    email: string;
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
  statuses = []
}: CandidateDetailsDrawerProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [activityHistory, setActivityHistory] = useState<ActivityLog[]>([]);
  const [isUploadingCv, setIsUploadingCv] = useState(false);
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);
  const cvFileInputRef = useRef<HTMLInputElement>(null);
  
  // Hardcoded questionnaire data
  const [questionnaires] = useState({
    whyWorkHere: "I am passionate about this company's mission and believe my skills align perfectly with the role requirements.",
    salaryExpectations: "$80,000 - $100,000",
    startDate: "2025-01-15",
    willingToRelocate: "yes"
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isRecruiter = user.role === "recruiter" || user.role === "hr" || user.role === "admin";

  useEffect(() => {
    if (candidate) {
      loadComments();
      loadCv();
      loadActivityHistory();
      setNotes(candidate.notes || "");
    } else {
      setComments([]);
      setCvUrl(null);
      setNotes("");
      setActivityHistory([]);
    }
  }, [candidate]);

  const loadComments = async () => {
    if (!candidate) return;
    try {
      const data = await candidatesService.getCandidateComments(candidate.id);
      setComments(data);
    } catch (err) {
      console.error("Failed to load comments", err);
    }
  };

  const loadCv = async () => {
    if (!candidate) return;
    try {
      const blob = await candidatesService.getCandidateCv(candidate.id);
      const url = URL.createObjectURL(blob);
      setCvUrl(url);
    } catch (err) {
      console.error("Failed to load CV", err);
    }
  };

  const loadActivityHistory = async () => {
    if (!candidate) return;
    try {
      const data = await candidatesService.getCandidatePipelineHistory(candidate.id);
      setActivityHistory(data);
    } catch (err) {
      console.error("Failed to load pipeline history", err);
      setActivityHistory([]);
    }
  };

  const handleAddComment = async () => {
    if (!candidate || (!newComment.trim() && !attachment)) return;
    try {
      await candidatesService.addCandidateComment(candidate.id, newComment, attachment || undefined);

      setNewComment("");
      setAttachment(null);
      loadComments();
    } catch (err) {
      console.error("Failed to add comment", err);
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
      window.open(cvUrl, '_blank');
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
    const validTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
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
        cvFileInputRef.current.value = '';
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
        PaperProps={{ sx: { width: { xs: "100%", md: "1000px" }, display: "flex", flexDirection: "row" } }}
      >
        {/* Left Sidebar - UNCHANGED */}
        <AuroraBox sx={{ width: "280px", borderRight: "1px solid", borderColor: "divider", display: "flex", flexDirection: "column", bgcolor: "background.paper" }}>
          <AuroraBox sx={{ p: 3, display: "flex", flexDirection: "column", alignItems: "center", borderBottom: "1px solid", borderColor: "divider" }}>
            <AuroraAvatar
              src={candidate.profile_picture ? `${API_BASE_URL}/${candidate.profile_picture}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.id}`}
              sx={{ width: 80, height: 80, mb: 2, bgcolor: "primary.light" }}
            />
            <AuroraTypography variant="h6" fontWeight="bold" textAlign="center">{candidate.name}</AuroraTypography>
            <AuroraChip
              label={statuses.find(o => o.value === candidate.status)?.label || candidate.status}
              size="small"
              color={candidate.status === 'rejected' ? 'error' : 'primary'}
              sx={{ mt: 1 }}
            />
          </AuroraBox>

          <AuroraBox sx={{ p: 3, flexGrow: 1, overflowY: "auto" }}>
            {/* Basic Section */}
            <AuroraTypography variant="subtitle2" fontWeight="bold" sx={{ mb: 2, color: "text.primary" }}>
              Email
            </AuroraTypography>
            {candidate.email && (
              <AuroraTypography variant="body2" color="primary" sx={{ mb: 2 }}>{candidate.email}</AuroraTypography>
            )}

            <AuroraDivider sx={{ my: 2 }} />

            <AuroraTypography variant="subtitle2" fontWeight="bold" sx={{ mb: 2, color: "text.primary" }}>
              Phone No
            </AuroraTypography>
            {candidate.phone && (
              <AuroraTypography variant="body2" sx={{ mb: 2 }}>{candidate.phone}</AuroraTypography>
            )}

            <AuroraDivider sx={{ my: 2 }} />

            <AuroraTypography variant="subtitle2" fontWeight="bold" sx={{ mb: 2, color: "text.primary" }}>
              Address
            </AuroraTypography>
            {candidate.current_address && (
              <AuroraTypography variant="body2" sx={{ mb: 2 }}>{candidate.current_address}</AuroraTypography>
            )}

            <AuroraDivider sx={{ my: 2 }} />

            <AuroraTypography variant="subtitle2" fontWeight="bold" sx={{ mb: 2, color: "text.primary" }}>
              Desired Salary
            </AuroraTypography>
            {candidate.desired_salary && (
              <AuroraTypography variant="body2" sx={{ mb: 2 }}>${candidate.desired_salary.toLocaleString()}</AuroraTypography>
            )}

            <AuroraDivider sx={{ my: 2 }} />

            {candidate.referred_by && (
              <>
                <AuroraTypography variant="subtitle2" fontWeight="bold" sx={{ mb: 2, color: "text.primary" }}>
                  Referred By
                </AuroraTypography>
                <AuroraTypography variant="body2" sx={{ mb: 2 }}>{candidate.referred_by}</AuroraTypography>
                <AuroraDivider sx={{ my: 2 }} />
              </>
            )}

            {candidate.website && (
              <>
                <AuroraTypography variant="subtitle2" fontWeight="bold" sx={{ mb: 2, color: "text.primary" }}>
                  Website/Portfolio
                </AuroraTypography>
                <AuroraTypography variant="body2" color="primary" sx={{ mb: 2, wordBreak: "break-all" }}>{candidate.website}</AuroraTypography>
                <AuroraDivider sx={{ my: 2 }} />
              </>
            )}

            {/* Education Section */}
            {candidate.education && candidate.education.length > 0 && (
              <>
                <AuroraTypography variant="subtitle2" fontWeight="bold" sx={{ mb: 2, color: "text.primary" }}>
                  Education
                </AuroraTypography>
                {candidate.education.map((edu: any, index: number) => (
                  <AuroraBox key={index} sx={{ mb: 2 }}>
                    <AuroraTypography variant="body2" fontWeight="medium">{edu.degree}</AuroraTypography>
                    <AuroraTypography variant="caption" color="text.secondary" display="block">{edu.institution}</AuroraTypography>
                    {(edu.startDate || edu.endDate) && (
                      <AuroraTypography variant="caption" color="text.secondary">
                        {edu.startDate}
                        {edu.startDate && edu.endDate && ' - '}
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
                <AuroraTypography variant="subtitle2" fontWeight="bold" sx={{ mb: 2, color: "text.primary" }}>
                  Experiences
                </AuroraTypography>
                {candidate.experience.map((exp: any, index: number) => (
                  <AuroraBox key={index} sx={{ mb: 2 }}>
                    <AuroraTypography variant="body2" fontWeight="medium">{exp.position || exp.title}</AuroraTypography>
                    <AuroraTypography variant="caption" color="text.secondary" display="block">{exp.company}</AuroraTypography>
                    {(exp.startDate || exp.endDate) && (
                      <AuroraTypography variant="caption" color="text.secondary">
                        {exp.startDate}
                        {exp.startDate && exp.endDate && ' - '}
                        {exp.endDate}
                      </AuroraTypography>
                    )}
                  </AuroraBox>
                ))}
              </>
            )}

          </AuroraBox>

          {/* Actions */}
          <AuroraBox sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
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
        <AuroraBox sx={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh" }}>
          <AuroraBox sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
            <AuroraTypography variant="h6">Candidate Details</AuroraTypography>
            <AuroraIconButton onClick={onClose}>
              <AuroraCloseIcon />
            </AuroraIconButton>
          </AuroraBox>

          {/* Tabs */}
          <AuroraBox sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}>
            <AuroraTabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
              <AuroraTab label="Documents" />
              <AuroraTab label="Questionaries" />
              <AuroraTab label="Notes" />
              <AuroraTab label="Pipeline History" />
              <AuroraTab label="Attachments" />
            </AuroraTabs>
          </AuroraBox>

          {/* Tab Content - Takes remaining space above comments */}
          <AuroraBox sx={{ flexGrow: 1, overflowY: "auto", p: 3, minHeight: 0 }}>
            {/* Documents Tab */}
            {activeTab === 0 && (
              <AuroraBox sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                {/* Document Preview */}
                {cvUrl ? (
                  <AuroraBox sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    <AuroraBox sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center", justifyContent: "flex-end" }}>
                      <a
                        href={cvUrl}
                        download={`${candidate.name}_CV.pdf`}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#1976d2',
                          color: 'white',
                          textDecoration: 'none',
                          borderRadius: '4px',
                          fontSize: '14px',
                          fontWeight: '500',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        Download
                      </a>
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
                        minHeight: 0
                      }}
                    >
                      <iframe 
                        src={cvUrl} 
                        style={{ width: "100%", height: "100%", border: "none" }}
                        title="CV Preview"
                      />
                    </AuroraBox>
                  </AuroraBox>
                ) : (
                  <AuroraBox sx={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "center", 
                    justifyContent: "center",
                    height: "300px",
                    border: "2px dashed",
                    borderColor: "divider",
                    borderRadius: 2,
                    bgcolor: "background.default"
                  }}>
                    <AuroraDescriptionIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
                    <AuroraTypography variant="body1" color="text.secondary" gutterBottom>
                      No CV available
                    </AuroraTypography>
                    {isRecruiter && (
                      <>
                        <input
                          type="file"
                          ref={cvFileInputRef}
                          style={{ display: 'none' }}
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

            {/* Questionaries Tab */}
            {activeTab === 1 && (
              <AuroraBox>
                <AuroraTypography variant="h6" gutterBottom>Screening Questions</AuroraTypography>
                
                <AuroraBox sx={{ mt: 3 }}>
                  <AuroraTypography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Why do you want to work here?
                  </AuroraTypography>
                  <AuroraPaper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: "background.default" }}>
                    <AuroraTypography variant="body2">{questionnaires.whyWorkHere}</AuroraTypography>
                  </AuroraPaper>

                  <AuroraTypography variant="subtitle2" fontWeight="bold" gutterBottom>
                    What are your salary expectations?
                  </AuroraTypography>
                  <AuroraPaper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: "background.default" }}>
                    <AuroraTypography variant="body2">{questionnaires.salaryExpectations}</AuroraTypography>
                  </AuroraPaper>

                  <AuroraTypography variant="subtitle2" fontWeight="bold" gutterBottom>
                    When can you start?
                  </AuroraTypography>
                  <AuroraPaper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: "background.default" }}>
                    <AuroraTypography variant="body2">{new Date(questionnaires.startDate).toLocaleDateString()}</AuroraTypography>
                  </AuroraPaper>

                  <AuroraTypography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Are you willing to relocate?
                  </AuroraTypography>
                  <AuroraPaper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: "background.default" }}>
                    <AuroraTypography variant="body2">{questionnaires.willingToRelocate === 'yes' ? 'Yes' : 'No'}</AuroraTypography>
                  </AuroraPaper>
                </AuroraBox>
              </AuroraBox>
            )}

            {/* Notes Tab */}
            {activeTab === 2 && (
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
                  <AuroraButton variant="contained" onClick={handleSaveNotes} disabled={isSavingNotes} sx={{ mt: 2 }}>
                    {isSavingNotes ? "Saving..." : "Save Notes"}
                  </AuroraButton>
                )}
                {!isRecruiter && (
                  <AuroraTypography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                    Only recruiters can edit notes
                  </AuroraTypography>
                )}
              </AuroraBox>
            )}

            {/* Pipeline History Tab */}
            {activeTab === 3 && (
              <AuroraBox>
                <AuroraTypography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  Pipeline History
                </AuroraTypography>
                
                {activityHistory.length === 0 ? (
                  <AuroraTypography color="text.secondary" textAlign="center" sx={{ mt: 4 }}>
                    No activity history available
                  </AuroraTypography>
                ) : (
                  <Timeline position="right" sx={{ mt: 2 }}>
                    {activityHistory.map((activity, index) => (
                      <TimelineItem key={activity.id}>
                        <TimelineOppositeContent color="text.secondary" sx={{ flex: 0.3 }}>
                          <AuroraTypography variant="caption">
                            {new Date(activity.changed_at).toLocaleDateString()}
                          </AuroraTypography>
                          <AuroraTypography variant="caption" display="block">
                            {new Date(activity.changed_at).toLocaleTimeString()}
                          </AuroraTypography>
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                          <TimelineDot color="primary" />
                          {index < activityHistory.length - 1 && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent>
                          <AuroraPaper elevation={0} variant="outlined" sx={{ p: 2 }}>
                            <AuroraTypography variant="body2" fontWeight="medium">
                              Status changed: {statuses.find(s => s.value === activity.old_status)?.label || activity.old_status} → {statuses.find(s => s.value === activity.new_status)?.label || activity.new_status}
                            </AuroraTypography>
                            <AuroraTypography variant="caption" color="text.secondary">
                              by {activity.changed_by.name || activity.changed_by.email}
                            </AuroraTypography>
                          </AuroraPaper>
                        </TimelineContent>
                      </TimelineItem>
                    ))}
                  </Timeline>
                )}
              </AuroraBox>
            )}
            {/* Attachments Tab */}
            {activeTab === 4 && (
              <AuroraBox>
                <AuroraTypography variant="h6" gutterBottom>Attachments</AuroraTypography>
                {comments.filter(c => c.attachment_path).length === 0 ? (
                  <AuroraTypography color="text.secondary" textAlign="center" sx={{ mt: 4 }}>
                    No attachments found
                  </AuroraTypography>
                ) : (
                  <AuroraList>
                    {comments.filter(c => c.attachment_path).map((comment) => (
                      <AuroraListItem key={comment.id} sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
                        <AuroraListItemAvatar>
                          <AuroraAvatar sx={{ bgcolor: "primary.light" }}>
                            <AuroraDescriptionIcon />
                          </AuroraAvatar>
                        </AuroraListItemAvatar>
                        <AuroraListItemText
                          primary={comment.attachment_original_name}
                          secondary={
                            <>
                              <AuroraTypography variant="caption" display="block">
                                Uploaded by {comment.created_by.name || comment.created_by.email} on {new Date(comment.created_at).toLocaleDateString()}
                              </AuroraTypography>
                              <AuroraTypography variant="caption" display="block">
                                Size: {comment.attachment_size ? (comment.attachment_size / 1024).toFixed(2) : '0'} KB
                              </AuroraTypography>
                            </>
                          }
                        />
                        <AuroraBox>
                          <a
                            href={`${API_URL}/comments/${comment.id}/attachment?token=${localStorage.getItem("token")}`}
                            target="_blank"
                            download
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '40px',
                              height: '40px',
                              borderRadius: '4px',
                              color: 'rgba(0, 0, 0, 0.54)',
                              cursor: 'pointer',
                              textDecoration: 'none'
                            }}
                          >
                            <AuroraDownloadIcon />
                          </a>
                          {(user.id === comment.created_by.id || user.role === 'admin') && (
                             <AuroraIconButton 
                               color="error"
                               onClick={async () => {
                                 if (window.confirm("Are you sure you want to delete this attachment?")) {
                                   try {
                                     await commentsService.deleteCommentAttachment(comment.id);
                                     loadComments();
                                   } catch (err) {
                                     console.error("Failed to delete attachment", err);
                                   }
                                 }
                               }}
                             >
                               <AuroraCloseIcon />
                             </AuroraIconButton>
                           )}
                        </AuroraBox>
                      </AuroraListItem>
                    ))}
                  </AuroraList>
                )}
              </AuroraBox>
            )}
          </AuroraBox>

          {/* Comments Section - Collapsible at bottom */}
          <AuroraBox sx={{ 
            borderTop: "2px solid", 
            borderColor: "divider", 
            bgcolor: "background.paper",
            display: "flex",
            flexDirection: "column",
            height: isCommentsExpanded ? "300px" : "auto"
          }}>
            <AuroraBox 
              sx={{ 
                p: 2, 
                pb: 1, 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                cursor: "pointer",
                "&:hover": { bgcolor: "action.hover" }
              }}
              onClick={() => setIsCommentsExpanded(!isCommentsExpanded)}
            >
              <AuroraTypography variant="subtitle1" fontWeight="bold">
                Comments ({comments.length})
              </AuroraTypography>
              <AuroraIconButton size="small">
                {isCommentsExpanded ? <AuroraExpandLessIcon /> : <AuroraExpandMoreIcon />}
              </AuroraIconButton>
            </AuroraBox>
            
            {isCommentsExpanded && (
              <>
                {/* Comments List - Scrollable */}
                <AuroraBox sx={{ flexGrow: 1, overflowY: "auto", px: 2, minHeight: 0 }}>
                  {comments.length === 0 ? (
                    <AuroraTypography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                      No comments yet
                    </AuroraTypography>
                  ) : (
                    <AuroraList sx={{ py: 0 }}>
                      {[...comments].reverse().map((comment) => (
                        <AuroraListItem key={comment.id} alignItems="flex-start" sx={{ px: 0 }}>
                          <AuroraListItemAvatar>
                            <AuroraAvatar
                              src={comment.created_by.profile_picture ? `${API_BASE_URL}/${comment.created_by.profile_picture}` : undefined}
                              sx={{ width: 32, height: 32 }}
                            >
                              {comment.created_by.name?.charAt(0) || comment.created_by.email.charAt(0)}
                            </AuroraAvatar>
                          </AuroraListItemAvatar>
                          <AuroraListItemText
                            primary={
                              <AuroraBox sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <AuroraTypography variant="body2" fontWeight="medium">
                                  {comment.created_by.name || comment.created_by.email}
                                </AuroraTypography>
                                <AuroraTypography variant="caption" color="text.secondary">
                                  {new Date(comment.created_at).toLocaleString()}
                                </AuroraTypography>
                              </AuroraBox>
                            }
                            secondary={
                              <AuroraBox>
                                <AuroraTypography variant="body2" component="span" sx={{ mt: 0.5, display: 'block' }}>
                                  {comment.text}
                                </AuroraTypography>
                                {comment.attachment_path && (
                                  <AuroraBox sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
                                    <a
                                      href={`${API_URL}/comments/${comment.id}/attachment?token=${localStorage.getItem("token")}`}
                                      target="_blank"
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '4px 8px',
                                        border: '1px solid rgba(0, 0, 0, 0.23)',
                                        borderRadius: '16px',
                                        textDecoration: 'none',
                                        color: 'rgba(0, 0, 0, 0.87)',
                                        fontSize: '13px',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      <AuroraDescriptionIcon fontSize="small" />
                                      {comment.attachment_original_name}
                                    </a>
                                  </AuroraBox>
                                )}
                              </AuroraBox>
                            }
                          />
                        </AuroraListItem>
                      ))}
                    </AuroraList>
                  )}
                </AuroraBox>

                {/* Add Comment Input - Fixed at bottom */}
                <AuroraBox sx={{ p: 2, pt: 1, borderTop: "1px solid", borderColor: "divider" }}>
                  <AuroraBox sx={{ display: "flex", gap: 1, flexDirection: 'column' }}>
                    {attachment && (
                        <AuroraBox sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <AuroraChip 
                                label={attachment.name} 
                                onDelete={() => setAttachment(null)} 
                                size="small"
                            />
                        </AuroraBox>
                    )}
                    <AuroraBox sx={{ display: "flex", gap: 1 }}>
                        <AuroraInput
                        fullWidth
                        size="small"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleAddComment()}
                        />
                        <input
                            type="file"
                            id="comment-attachment"
                            style={{ display: "none" }}
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setAttachment(e.target.files[0]);
                                }
                            }}
                        />
                        <label htmlFor="comment-attachment">
                            <AuroraIconButton component="span" color={attachment ? "primary" : "default"}>
                                <AuroraUploadIcon />
                            </AuroraIconButton>
                        </label>
                        <AuroraIconButton 
                        color="primary" 
                        onClick={handleAddComment} 
                        disabled={!newComment.trim() && !attachment}
                        sx={{ 
                            bgcolor: (newComment.trim() || attachment) ? "primary.main" : "action.disabledBackground",
                            color: (newComment.trim() || attachment) ? "white" : "action.disabled",
                            "&:hover": {
                            bgcolor: (newComment.trim() || attachment) ? "primary.dark" : "action.disabledBackground"
                            },
                            borderRadius: 1,
                            width: 40,
                            height: 40
                        }}
                        >
                        <AuroraSendIcon fontSize="small" />
                        </AuroraIconButton>
                    </AuroraBox>
                  </AuroraBox>
                </AuroraBox>
              </>
            )}
          </AuroraBox>
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
            Are you sure you want to delete this candidate? This action cannot be undone.
          </AuroraDialogContentText>
        </AuroraDialogContent>
        <AuroraDialogActions>
          <AuroraButton onClick={() => setShowDeleteDialog(false)}>Cancel</AuroraButton>
          <AuroraButton onClick={handleDeleteCandidate} color="error" variant="contained">
            Delete
          </AuroraButton>
        </AuroraDialogActions>
      </AuroraDialog>
    </>
  );
}