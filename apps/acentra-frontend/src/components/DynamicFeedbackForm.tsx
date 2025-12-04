import { useState, useEffect } from "react";
import {
  AuroraBox,
  AuroraTypography,
  AuroraButton,
  AuroraInput,
  AuroraFormControl,
  AuroraSelect,
  AuroraMenuItem,
} from "@acentra/aurora-design-system";
import { type FeedbackQuestion, type FeedbackResponse } from "@/services/feedbackService";

interface DynamicFeedbackFormProps {
  feedbackId: string;
  questions: FeedbackQuestion[];
  existingResponses?: FeedbackResponse[];
  feedbackStatus?: 'not_started' | 'in_progress' | 'completed';
  onSave: (response: {
    questionId: string;
    textAnswer?: string;
    numericAnswer?: number;
    booleanAnswer?: boolean;
    selectedOption?: string;
    comments?: string;
  }) => Promise<void>;
  onComplete?: (generalComments?: string) => Promise<void>;
  onBack?: () => void;
  templateName: string;
}

interface FormData {
  [questionId: string]: {
    textAnswer?: string;
    numericAnswer?: number;
    booleanAnswer?: boolean;
    selectedOption?: string;
    comments?: string;
  };
}

interface EditingState {
  [questionId: string]: boolean;
}

export function DynamicFeedbackForm({
  feedbackId: _feedbackId,
  questions,
  existingResponses = [],
  feedbackStatus = 'not_started',
  onSave,
  onComplete,
  onBack,
  templateName,
}: DynamicFeedbackFormProps) {
  const [formData, setFormData] = useState<FormData>({});
  const [editingState, setEditingState] = useState<EditingState>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [generalComments, setGeneralComments] = useState("");
  const isCompleted = feedbackStatus === 'completed';

  // Initialize form data from existing responses
  useEffect(() => {
    const initialData: FormData = {};
    existingResponses.forEach((response) => {
      initialData[response.question.id] = {
        textAnswer: response.textAnswer,
        numericAnswer: response.numericAnswer,
        booleanAnswer: response.booleanAnswer,
        selectedOption: response.selectedOption,
        comments: response.comments,
      };
    });
    setFormData(initialData);
  }, [existingResponses]);

  const handleInputChange = (questionId: string, field: keyof FormData[string], value: any) => {
    setFormData((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [field]: value,
      },
    }));
  };

  const toggleEdit = (questionId: string) => {
    setEditingState((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleSaveQuestion = async (questionId: string) => {
    const data = formData[questionId];
    if (!data) return;

    try {
      setSaving(questionId);
      await onSave({
        questionId,
        ...data,
      });
      // Exit edit mode after successful save
      setEditingState((prev) => ({
        ...prev,
        [questionId]: false,
      }));
    } catch (error) {
      console.error("Failed to save response:", error);
    } finally {
      setSaving(null);
    }
  };

  const handleSaveAll = async () => {
    try {
      setSaving("all");
      // Save all responses
      const savePromises = Object.entries(formData).map(([questionId, data]) =>
        onSave({ questionId, ...data })
      );
      await Promise.all(savePromises);
    } catch (error) {
      console.error("Failed to save responses:", error);
    } finally {
      setSaving(null);
    }
  };

  const handleComplete = async () => {
    try {
      setSaving("completing");
      // Save all responses first
      const savePromises = Object.entries(formData).map(([questionId, data]) =>
        onSave({ questionId, ...data })
      );
      await Promise.all(savePromises);

      // Then complete the feedback
      if (onComplete) {
        await onComplete(generalComments);
      }
    } catch (error) {
      console.error("Failed to complete feedback:", error);
    } finally {
      setSaving(null);
    }
  };

  const renderQuestionInput = (question: FeedbackQuestion) => {
    const data = formData[question.id] || {};
    const isEditing = editingState[question.id];
    const isSavingThisQuestion = saving === question.id;

    return (
      <AuroraBox
        key={question.id}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          p: 3,
          mb: 2,
        }}
      >
        <AuroraBox
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <AuroraBox sx={{ flex: 1 }}>
            <AuroraTypography variant="subtitle2" fontWeight="bold" gutterBottom>
              {question.question}
              {question.required === "required" && <span style={{ color: "red" }}> *</span>}
            </AuroraTypography>
            {question.helpText && (
              <AuroraTypography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                {question.helpText}
              </AuroraTypography>
            )}
          </AuroraBox>
          {!isCompleted && (
            <AuroraButton
              variant={isEditing ? "outlined" : "text"}
              size="small"
              onClick={() => toggleEdit(question.id)}
              disabled={saving !== null}
            >
              {isEditing ? "Cancel" : "Edit"}
            </AuroraButton>
          )}
        </AuroraBox>

        {isEditing ? (
          // Edit Mode
          <AuroraBox>
            {question.type === "free_text" && (
              <AuroraInput
                fullWidth
                multiline
                rows={3}
                value={data.textAnswer || ""}
                onChange={(e: any) => handleInputChange(question.id, "textAnswer", e.target.value)}
                placeholder="Enter your response..."
                sx={{ mb: 2 }}
              />
            )}

            {question.type === "rating" && (
              <AuroraBox sx={{ mb: 2 }}>
                <AuroraBox sx={{ display: "flex", gap: 1, mb: 2 }}>
                  {Array.from({ length: (question.maxRating || 5) - (question.minRating || 1) + 1 }, (_, i) => {
                    const value = (question.minRating || 1) + i;
                    return (
                      <AuroraButton
                        key={value}
                        variant={data.numericAnswer === value ? "contained" : "outlined"}
                        size="small"
                        onClick={() => handleInputChange(question.id, "numericAnswer", value)}
                        sx={{
                          minWidth: "40px",
                          height: "40px",
                        }}
                      >
                        {value}
                      </AuroraButton>
                    );
                  })}
                </AuroraBox>
              </AuroraBox>
            )}

            {question.type === "yes_no" && (
              <AuroraBox sx={{ display: "flex", gap: 2, mb: 2 }}>
                <AuroraButton
                  variant={data.booleanAnswer === true ? "contained" : "outlined"}
                  onClick={() => handleInputChange(question.id, "booleanAnswer", true)}
                  sx={{ minWidth: "80px" }}
                >
                  Yes
                </AuroraButton>
                <AuroraButton
                  variant={data.booleanAnswer === false ? "contained" : "outlined"}
                  onClick={() => handleInputChange(question.id, "booleanAnswer", false)}
                  sx={{ minWidth: "80px" }}
                >
                  No
                </AuroraButton>
              </AuroraBox>
            )}

            {question.type === "multiple_choice" && (
              <AuroraFormControl fullWidth sx={{ mb: 2 }}>
                <AuroraSelect
                  value={data.selectedOption || ""}
                  onChange={(e: any) => handleInputChange(question.id, "selectedOption", e.target.value)}
                  displayEmpty
                >
                  <AuroraMenuItem value="">
                    <em>Select an option</em>
                  </AuroraMenuItem>
                  {question.options?.map((option, index) => (
                    <AuroraMenuItem key={`${question.id}-${option}-${index}`} value={option}>
                      {option}
                    </AuroraMenuItem>
                  ))}
                </AuroraSelect>
              </AuroraFormControl>
            )}

            <AuroraBox sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
              <AuroraButton
                variant="outlined"
                size="small"
                onClick={() => toggleEdit(question.id)}
                disabled={isSavingThisQuestion}
              >
                Cancel
              </AuroraButton>
              <AuroraButton
                variant="contained"
                size="small"
                onClick={() => handleSaveQuestion(question.id)}
                disabled={isSavingThisQuestion}
              >
                {isSavingThisQuestion ? "Saving..." : "Save"}
              </AuroraButton>
            </AuroraBox>
          </AuroraBox>
        ) : (
          // Read Mode
          <AuroraBox>
            {question.type === "free_text" && (
              <AuroraTypography variant="body2" sx={{ mb: 1 }}>
                {data.textAnswer || "No response"}
              </AuroraTypography>
            )}

            {question.type === "rating" && (
              <AuroraTypography variant="body2" sx={{ mb: 1 }}>
                {data.numericAnswer ? `${data.numericAnswer}` : "No response"}
                {question.minRating && question.maxRating &&
                  ` (Scale: ${question.minRating}-${question.maxRating})`}
              </AuroraTypography>
            )}

            {question.type === "yes_no" && (
              <AuroraTypography variant="body2" sx={{ mb: 1 }}>
                {data.booleanAnswer !== undefined
                  ? data.booleanAnswer
                    ? "Yes"
                    : "No"
                  : "No response"}
              </AuroraTypography>
            )}

            {question.type === "multiple_choice" && (
              <AuroraTypography variant="body2" sx={{ mb: 1 }}>
                {data.selectedOption || "No response"}
              </AuroraTypography>
            )}
          </AuroraBox>
        )}
      </AuroraBox>
    );
  };

  return (
    <AuroraBox>
      <AuroraBox
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 3,
          gap: 2,
        }}
      >
        {onBack && (
          <AuroraButton variant="outlined" onClick={onBack}>
            ← Back to Feedback List
          </AuroraButton>
        )}
        <AuroraTypography variant="h5">
          {templateName}
        </AuroraTypography>
      </AuroraBox>

      <AuroraBox sx={{ mb: 4 }}>
        {questions
          .sort((a, b) => a.order - b.order)
          .map((question) => (
            <AuroraBox key={question.id}>
              {renderQuestionInput(question)}
            </AuroraBox>
          ))}
      </AuroraBox>

      {/* General Comments Section */}
      <AuroraBox sx={{ mb: 3 }}>
        <AuroraTypography variant="h6" gutterBottom>
          General Comments
        </AuroraTypography>
        <AuroraInput
          fullWidth
          multiline
          rows={3}
          value={generalComments}
          onChange={(e: any) => setGeneralComments(e.target.value)}
          placeholder="Add any additional comments..."
        />
      </AuroraBox>

      <AuroraBox sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
        {!isCompleted && (
          <>
            <AuroraButton
              variant="outlined"
              onClick={handleSaveAll}
              disabled={saving !== null}
            >
              {saving === "all" ? "Saving..." : "Save All Progress"}
            </AuroraButton>
            {onComplete && (
              <AuroraButton
                variant="contained"
                onClick={handleComplete}
                disabled={saving !== null}
              >
                {saving === "completing" ? "Completing..." : "Complete Feedback"}
              </AuroraButton>
            )}
          </>
        )}
        {isCompleted && (
          <AuroraTypography variant="body2" color="success.main" fontWeight="medium">
            ✓ Feedback Completed
          </AuroraTypography>
        )}
      </AuroraBox>
    </AuroraBox>
  );
}