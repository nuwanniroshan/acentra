import { useState, useEffect } from "react";
import {
  AuroraBox,
  AuroraTypography,
  AuroraButton,
  AuroraList,
  AuroraListItem,
  AuroraListItemText,
  AuroraChip,
  AuroraDialog,
  AuroraDialogTitle,
  AuroraDialogContent,
  AuroraDialogActions,
  AuroraPaper
} from '@acentra/aurora-design-system';
import { feedbackService, type CandidateFeedbackTemplate } from "@/services/feedbackService";

interface Candidate {
  id: string;
  name: string;
}

interface CandidateFeedbackProps {
  candidate: Candidate;
  isRecruiter: boolean;
  onRefresh?: () => void;
}

export function CandidateFeedback({ candidate, isRecruiter, onRefresh }: CandidateFeedbackProps) {
  const [feedbackTemplates, setFeedbackTemplates] = useState<CandidateFeedbackTemplate[]>([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<CandidateFeedbackTemplate | null>(null);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [showAttachTemplateDialog, setShowAttachTemplateDialog] = useState(false);

  useEffect(() => {
    if (candidate) {
      loadFeedbackTemplates();
    } else {
      setFeedbackTemplates([]);
    }
  }, [candidate]);

  const loadFeedbackTemplates = async () => {
    if (!candidate) return;
    try {
      setFeedbackLoading(true);
      const data = await feedbackService.getCandidateFeedback(candidate.id);
      setFeedbackTemplates(data);
    } catch (err) {
      console.error("Failed to load feedback templates:", err);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleAttachTemplate = async (templateId: string) => {
    if (!candidate) return;
    try {
      await feedbackService.attachTemplate(candidate.id, templateId);
      setShowAttachTemplateDialog(false);
      loadFeedbackTemplates();
      onRefresh?.();
    } catch (err) {
      console.error("Failed to attach template:", err);
      alert("Failed to attach template");
    }
  };

  const handleCompleteFeedback = async (feedbackId: string, generalComments?: string) => {
    try {
      await feedbackService.completeFeedback(feedbackId, generalComments);
      setShowFeedbackDialog(false);
      loadFeedbackTemplates();
      onRefresh?.();
    } catch (err) {
      console.error("Failed to complete feedback:", err);
      alert("Failed to complete feedback");
    }
  };

  const getStatusChip = (status: string) => {
    const statusConfig = {
      'not_started': { color: 'default', label: 'Not Started' },
      'in_progress': { color: 'warning', label: 'In Progress' },
      'completed': { color: 'success', label: 'Completed' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || { color: 'default', label: status };
    return <AuroraChip label={config.label} size="small" color={config.color as any} />;
  };

  const handleRefresh = () => {
    loadFeedbackTemplates();
    onRefresh?.();
  };

  return (
    <>
      <AuroraBox>
        <AuroraBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <AuroraTypography variant="h6">Feedback</AuroraTypography>
          {isRecruiter && (
            <AuroraButton
              variant="outlined"
              onClick={() => setShowAttachTemplateDialog(true)}
            >
              Attach Template
            </AuroraButton>
          )}
        </AuroraBox>

        {feedbackLoading ? (
          <AuroraTypography>Loading feedback...</AuroraTypography>
        ) : feedbackTemplates.length === 0 ? (
          <AuroraTypography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
            No feedback templates attached yet
          </AuroraTypography>
        ) : (
          <AuroraList>
            {feedbackTemplates.map((feedback) => (
              <AuroraListItem 
                key={feedback.id} 
                sx={{ 
                  borderBottom: "1px solid", 
                  borderColor: "divider",
                  cursor: "pointer",
                  "&:hover": { bgcolor: "action.hover" }
                }}
                onClick={() => {
                  setSelectedFeedback(feedback);
                  setShowFeedbackDialog(true);
                }}
              >
                <AuroraListItemText
                  primary={
                    <AuroraBox sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <AuroraTypography variant="body1" fontWeight="medium">
                        {feedback.template.name}
                      </AuroraTypography>
                      {getStatusChip(feedback.status)}
                      {feedback.overallScore && (
                        <AuroraChip 
                          label={`Score: ${feedback.overallScore.toFixed(1)}`}
                          size="small"
                          color="info"
                        />
                      )}
                    </AuroraBox>
                  }
                  secondary={
                    <AuroraBox>
                      <AuroraTypography variant="caption" display="block">
                        {feedback.template.category} • {feedback.template.questions.length} questions
                      </AuroraTypography>
                      {feedback.completedAt && (
                        <AuroraTypography variant="caption" color="text.secondary" display="block">
                          Completed on {new Date(feedback.completedAt).toLocaleDateString()}
                        </AuroraTypography>
                      )}
                      {feedback.generalComments && (
                        <AuroraTypography variant="caption" display="block" sx={{ mt: 1 }}>
                          {feedback.generalComments}
                        </AuroraTypography>
                      )}
                    </AuroraBox>
                  }
                />
              </AuroraListItem>
            ))}
          </AuroraList>
        )}
      </AuroraBox>

      {/* Feedback Template Details Dialog */}
      <AuroraDialog
        open={showFeedbackDialog}
        onClose={() => {
          setShowFeedbackDialog(false);
          setSelectedFeedback(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <AuroraDialogTitle>
          {selectedFeedback?.template.name}
        </AuroraDialogTitle>
        <AuroraDialogContent>
          {selectedFeedback && (
            <AuroraBox sx={{ mt: 2 }}>
              <AuroraBox sx={{ display: "flex", gap: 2, mb: 3 }}>
                <AuroraChip label={getStatusChip(selectedFeedback.status)} />
                {selectedFeedback.overallScore && (
                  <AuroraChip 
                    label={`Overall Score: ${selectedFeedback.overallScore.toFixed(1)}`}
                    color="info"
                  />
                )}
              </AuroraBox>

              {selectedFeedback.template.instructions && (
                <AuroraPaper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: "background.default" }}>
                  <AuroraTypography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Instructions
                  </AuroraTypography>
                  <AuroraTypography variant="body2">
                    {selectedFeedback.template.instructions}
                  </AuroraTypography>
                </AuroraPaper>
              )}

              <AuroraTypography variant="h6" gutterBottom>
                Questions & Responses
              </AuroraTypography>

              {selectedFeedback.template.questions.map((question, index) => {
                const response = selectedFeedback.responses.find(r => r.question.id === question.id);
                return (
                  <AuroraPaper key={question.id} variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <AuroraTypography variant="subtitle2" fontWeight="bold" gutterBottom>
                      {index + 1}. {question.question}
                      {question.required === 'required' && <span style={{ color: 'red' }}> *</span>}
                    </AuroraTypography>
                    
                    {question.helpText && (
                      <AuroraTypography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                        {question.helpText}
                      </AuroraTypography>
                    )}

                    <AuroraBox sx={{ mt: 2 }}>
                      {question.type === 'free_text' && (
                        <AuroraTypography variant="body2">
                          {response?.textAnswer || 'No response'}
                        </AuroraTypography>
                      )}
                      
                      {question.type === 'yes_no' && (
                        <AuroraTypography variant="body2">
                          {response?.booleanAnswer !== undefined ? (response.booleanAnswer ? 'Yes' : 'No') : 'No response'}
                        </AuroraTypography>
                      )}
                      
                      {question.type === 'rating' && (
                        <AuroraTypography variant="body2">
                          {response?.numericAnswer || 'No response'}
                          {question.minRating && question.maxRating && 
                            ` (Scale: ${question.minRating}-${question.maxRating})`
                          }
                        </AuroraTypography>
                      )}
                      
                      {question.type === 'multiple_choice' && (
                        <AuroraTypography variant="body2">
                          {response?.selectedOption || 'No response'}
                        </AuroraTypography>
                      )}
                      
                      {response?.comments && (
                        <AuroraTypography variant="caption" display="block" sx={{ mt: 1, fontStyle: 'italic' }}>
                          Comments: {response.comments}
                        </AuroraTypography>
                      )}
                    </AuroraBox>
                  </AuroraPaper>
                );
              })}

              {selectedFeedback.generalComments && (
                <AuroraPaper variant="outlined" sx={{ p: 2, mt: 3, bgcolor: "background.default" }}>
                  <AuroraTypography variant="subtitle2" fontWeight="bold" gutterBottom>
                    General Comments
                  </AuroraTypography>
                  <AuroraTypography variant="body2">
                    {selectedFeedback.generalComments}
                  </AuroraTypography>
                </AuroraPaper>
              )}
            </AuroraBox>
          )}
        </AuroraDialogContent>
        <AuroraDialogActions>
          <AuroraButton onClick={() => {
            setShowFeedbackDialog(false);
            setSelectedFeedback(null);
          }}>
            Close
          </AuroraButton>
          {selectedFeedback?.status !== 'completed' && (
            <AuroraButton 
              variant="contained" 
              onClick={() => {
                if (selectedFeedback) {
                  handleCompleteFeedback(selectedFeedback.id);
                }
              }}
            >
              Mark as Complete
            </AuroraButton>
          )}
        </AuroraDialogActions>
      </AuroraDialog>
    </>
  );
}