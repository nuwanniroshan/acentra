import { useState, useEffect } from "react";
import {
  AuroraBox,
  AuroraTypography,
  AuroraList,
  AuroraListItem,
  AuroraListItemText,
  AuroraChip,
} from "@acentra/aurora-design-system";
import {
  feedbackService,
  type CandidateFeedbackTemplate,
} from "@/services/feedbackService";
import { DynamicFeedbackForm } from "./DynamicFeedbackForm";

interface Candidate {
  id: string;
  name: string;
}

interface CandidateFeedbackProps {
  candidate: Candidate;
  isRecruiter: boolean;
  onRefresh?: () => void;
}

export function CandidateFeedback({
  candidate,
  isRecruiter,
  onRefresh,
}: CandidateFeedbackProps) {
  const [feedbackTemplates, setFeedbackTemplates] = useState<
    CandidateFeedbackTemplate[]
  >([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [selectedFeedback, setSelectedFeedback] =
    useState<CandidateFeedbackTemplate | null>(null);

  const [showFormInline, setShowFormInline] = useState(false);

  useEffect(() => {
    if (candidate?.id) {
      loadFeedbackTemplates();
    } else {
      setFeedbackTemplates([]);
    }
  }, [candidate?.id]);

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

  const handleSaveResponse = async (responseData: {
    questionId: string;
    textAnswer?: string;
    numericAnswer?: number;
    booleanAnswer?: boolean;
    selectedOption?: string;
    comments?: string;
  }) => {
    if (!selectedFeedback) return;

    try {
      await feedbackService.saveResponse(selectedFeedback.id, responseData);
      // Reload the feedback to get updated responses
      const updatedFeedback = await feedbackService.getFeedbackDetails(
        selectedFeedback.id
      );
      setSelectedFeedback(updatedFeedback);
      loadFeedbackTemplates();
    } catch (err) {
      console.error("Failed to save response:", err);
      throw err;
    }
  };

  const handleCompleteFeedback = async (generalComments?: string) => {
    if (!selectedFeedback) return;

    try {
      await feedbackService.completeFeedback(
        selectedFeedback.id,
        generalComments
      );
      setShowFormInline(false);
      setSelectedFeedback(null);
      loadFeedbackTemplates();
      onRefresh?.();
    } catch (err) {
      console.error("Failed to complete feedback:", err);
      alert("Failed to complete feedback");
    }
  };

  const handleBackToList = () => {
    setShowFormInline(false);
    setSelectedFeedback(null);
  };

  const getStatusChip = (status: string) => {
    const statusConfig = {
      not_started: { color: "default", label: "Not Started" },
      in_progress: { color: "warning", label: "In Progress" },
      completed: { color: "success", label: "Completed" },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || {
      color: "default",
      label: status,
    };
    return (
      <AuroraChip
        label={config.label}
        size="small"
        color={config.color as any}
      />
    );
  };

  const handleRefresh = () => {
    loadFeedbackTemplates();
    onRefresh?.();
  };

  return (
    <>
      {showFormInline && selectedFeedback ? (
        // Inline Form View
        <DynamicFeedbackForm
          feedbackId={selectedFeedback.id}
          questions={selectedFeedback.template.questions}
          existingResponses={selectedFeedback.responses}
          feedbackStatus={selectedFeedback.status}
          onSave={handleSaveResponse}
          onComplete={handleCompleteFeedback}
          onBack={handleBackToList}
          templateName={selectedFeedback.template.name}
        />
      ) : (
        // Feedback List View
        <AuroraBox>
          {feedbackLoading ? (
            <AuroraTypography>Loading feedback...</AuroraTypography>
          ) : feedbackTemplates.length === 0 ? (
            <AuroraTypography
              color="text.secondary"
              textAlign="center"
              sx={{ py: 4 }}
            >
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
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                  onClick={() => {
                    setSelectedFeedback(feedback);
                    setShowFormInline(true);
                  }}
                >
                  <AuroraListItemText
                    primary={
                      <AuroraBox
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <AuroraTypography variant="body1" fontWeight="medium">
                          {feedback.template.name}
                        </AuroraTypography>
                        {getStatusChip(feedback.status)}
                      </AuroraBox>
                    }
                    secondary={
                      <>
                        <AuroraTypography variant="caption" display="block">
                          {feedback.template.category} •{" "}
                          {feedback.template.questions.length} questions
                        </AuroraTypography>
                        {feedback.completedAt && (
                          <AuroraTypography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                          >
                            Completed on{" "}
                            {new Date(
                              feedback.completedAt
                            ).toLocaleDateString()}
                          </AuroraTypography>
                        )}
                        {feedback.generalComments && (
                          <AuroraTypography
                            variant="caption"
                            display="block"
                            sx={{ mt: 1 }}
                          >
                            {feedback.generalComments}
                          </AuroraTypography>
                        )}
                      </>
                    }
                  />
                </AuroraListItem>
              ))}
            </AuroraList>
          )}
        </AuroraBox>
      )}
    </>
  );
}
