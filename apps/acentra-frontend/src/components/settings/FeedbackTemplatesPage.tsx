import { useState, useEffect } from "react";
import {
  AuroraBox,
  AuroraTypography,
  AuroraPaper,
  AuroraTable,
  AuroraTableHead,
  AuroraTableBody,
  AuroraTableRow,
  AuroraTableCell,
  AuroraChip,
  AuroraDialog,
  AuroraDialogTitle,
  AuroraDialogContent,
  AuroraDialogActions,
  AuroraButton,
  AuroraIconButton,
  AuroraDeleteIcon,
  AuroraAddIcon,
  AuroraInput,
  AuroraSelect,
  AuroraMenuItem,
  AuroraFormControl,
  AuroraInputLabel,
  AuroraSwitch,
  AuroraFormControlLabel,
} from "@acentra/aurora-design-system";
import {
  feedbackService,
  type FeedbackTemplate,
  type FeedbackQuestion,
} from "@/services/feedbackService";

export const FeedbackTemplatesPage = () => {
  const [templates, setTemplates] = useState<FeedbackTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<FeedbackTemplate | null>(null);
  const [currentTemplate, setCurrentTemplate] = useState<
    Partial<FeedbackTemplate>
  >({});
  const [currentQuestions, setCurrentQuestions] = useState<
    Partial<FeedbackQuestion>[]
  >([]);

  const templateTypes = [
    { value: "phone_screening", label: "Phone Screening" },
    { value: "technical_interview", label: "Technical Interview" },
    { value: "manager_feedback", label: "Manager Feedback" },
    { value: "hr_feedback", label: "HR Feedback" },
    { value: "behavioral_interview", label: "Behavioral Interview" },
  ];

  const questionTypes = [
    { value: "free_text", label: "Free Text" },
    { value: "rating", label: "Rating Scale" },
    { value: "yes_no", label: "Yes/No" },
    { value: "multiple_choice", label: "Multiple Choice" },
  ];

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const data = await feedbackService.getAllTemplates();
      setTemplates(data);
    } catch (error) {
      console.error("Failed to load templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = () => {
    setCurrentTemplate({
      name: "",
      type: "phone_screening",
      description: "",
      category: "",
      instructions: "",
      isActive: true,
      stageMappings: [],
      jobTypeMappings: [],
    });
    setCurrentQuestions([]);
    setShowCreateDialog(true);
  };

  const handleDeleteTemplate = (template: FeedbackTemplate) => {
    setSelectedTemplate(template);
    setShowDeleteDialog(true);
  };

  const addQuestion = () => {
    const newQuestion: Partial<FeedbackQuestion> = {
      question: "",
      type: "free_text",
      required: "optional",
      helpText: "",
      options: [],
      order: currentQuestions.length,
    };
    setCurrentQuestions([...currentQuestions, newQuestion]);
  };

  const updateQuestion = (
    index: number,
    updates: Partial<FeedbackQuestion>,
  ) => {
    const updated = [...currentQuestions];
    updated[index] = { ...updated[index], ...updates };
    setCurrentQuestions(updated);
  };

  const removeQuestion = (index: number) => {
    const updated = currentQuestions.filter((_, i) => i !== index);
    updated.forEach((q, i) => {
      if (q.order !== undefined) q.order = i;
    });
    setCurrentQuestions(updated);
  };

  const handleSaveTemplate = async () => {
    try {
      if (!currentTemplate.name || !currentTemplate.type) {
        alert("Name and type are required");
        return;
      }

      const validQuestions = currentQuestions.filter(
        (q) => q.question && q.type,
      );
      if (validQuestions.length === 0) {
        alert("At least one question is required");
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, created_at, updated_at, createdBy, questions, ...updateData } = currentTemplate as any;
      const templateData = {
        ...updateData,
        questions: validQuestions,
      };

      await feedbackService.createTemplate(templateData as any);

      setShowCreateDialog(false);
      setSelectedTemplate(null);
      await loadTemplates();
    } catch (error) {
      console.error("Failed to save template:", error);
      alert("Failed to save template");
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedTemplate) {
      try {
        await feedbackService.deleteTemplate(selectedTemplate.id);
        setShowDeleteDialog(false);
        setSelectedTemplate(null);
        await loadTemplates();
      } catch (error) {
        console.error("Failed to delete template:", error);
        alert("Failed to delete template");
      }
    }
  };

  const getStatusChip = (template: FeedbackTemplate) => {
    if (!template.isActive) {
      return <AuroraChip label="Inactive" size="small" color="default" />;
    }
    return <AuroraChip label="Active" size="small" color="success" />;
  };

  if (loading) {
    return (
      <AuroraBox>
        <AuroraTypography>Loading templates...</AuroraTypography>
      </AuroraBox>
    );
  }

  return (
    <AuroraBox>
      <AuroraBox
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          mb: 3,
        }}
      >
        <AuroraButton
          startIcon={<AuroraAddIcon />}
          onClick={handleCreateTemplate}
          variant="contained"
        >
          Create Template
        </AuroraButton>
      </AuroraBox>

      <AuroraPaper>
        <AuroraTable>
          <AuroraTableHead>
            <AuroraTableRow>
              <AuroraTableCell>Name</AuroraTableCell>
              <AuroraTableCell>Type</AuroraTableCell>
              <AuroraTableCell>Category</AuroraTableCell>
              <AuroraTableCell>Questions</AuroraTableCell>
              <AuroraTableCell>Status</AuroraTableCell>
              <AuroraTableCell align="right">Actions</AuroraTableCell>
            </AuroraTableRow>
          </AuroraTableHead>
          <AuroraTableBody>
            {templates.map((template) => (
              <AuroraTableRow key={template.id}>
                <AuroraTableCell>
                  <AuroraTypography variant="body2" fontWeight="medium">
                    {template.name}
                  </AuroraTypography>
                  {template.description && (
                    <AuroraTypography variant="caption" color="text.secondary">
                      {template.description}
                    </AuroraTypography>
                  )}
                </AuroraTableCell>
                <AuroraTableCell>
                  <AuroraChip
                    label={
                      templateTypes.find((t) => t.value === template.type)
                        ?.label || template.type
                    }
                    size="small"
                    variant="outlined"
                  />
                </AuroraTableCell>
                <AuroraTableCell>{template.category || "-"}</AuroraTableCell>
                <AuroraTableCell>{template.questions?.length || 0}</AuroraTableCell>
                <AuroraTableCell>{getStatusChip(template)}</AuroraTableCell>
                <AuroraTableCell align="right">
                  <AuroraIconButton
                    size="small"
                    onClick={() => handleDeleteTemplate(template)}
                    color="error"
                    title="Delete template"
                  >
                    <AuroraDeleteIcon />
                  </AuroraIconButton>
                </AuroraTableCell>
              </AuroraTableRow>
            ))}
          </AuroraTableBody>
        </AuroraTable>
      </AuroraPaper>

      {/* Create Template Dialog */}
      <AuroraDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <AuroraDialogTitle>Create Template</AuroraDialogTitle>
        <AuroraDialogContent>
          <AuroraBox sx={{ mt: 2 }}>
            <AuroraInput
              fullWidth
              label="Template Name"
              value={currentTemplate.name || ""}
              onChange={(e: any) =>
                setCurrentTemplate({ ...currentTemplate, name: e.target.value })
              }
              sx={{ mb: 2 }}
            />

            <AuroraBox sx={{ display: "flex", gap: 2, mb: 2 }}>
              <AuroraFormControl fullWidth>
                <AuroraInputLabel>Template Type</AuroraInputLabel>
                <AuroraSelect
                  value={currentTemplate.type || "phone_screening"}
                  label="Template Type"
                  onChange={(e: any) =>
                    setCurrentTemplate({
                      ...currentTemplate,
                      type: e.target.value,
                    })
                  }
                >
                  {templateTypes.map((type) => (
                    <AuroraMenuItem key={type.value} value={type.value}>
                      {type.label}
                    </AuroraMenuItem>
                  ))}
                </AuroraSelect>
              </AuroraFormControl>

              <AuroraInput
                fullWidth
                label="Category (Optional)"
                value={currentTemplate.category || ""}
                onChange={(e: any) =>
                  setCurrentTemplate({
                    ...currentTemplate,
                    category: e.target.value,
                  })
                }
              />
            </AuroraBox>

            <AuroraInput
              fullWidth
              multiline
              rows={3}
              label="Description (Optional)"
              value={currentTemplate.description || ""}
              onChange={(e: any) =>
                setCurrentTemplate({
                  ...currentTemplate,
                  description: e.target.value,
                })
              }
              sx={{ mb: 2 }}
            />

            <AuroraInput
              fullWidth
              multiline
              rows={2}
              label="Instructions (Optional)"
              value={currentTemplate.instructions || ""}
              onChange={(e: any) =>
                setCurrentTemplate({
                  ...currentTemplate,
                  instructions: e.target.value,
                })
              }
              sx={{ mb: 2 }}
            />

            <AuroraFormControlLabel
              control={
                <AuroraSwitch
                  checked={currentTemplate.isActive !== false}
                  onChange={(e: any) =>
                    setCurrentTemplate({
                      ...currentTemplate,
                      isActive: e.target.checked,
                    })
                  }
                />
              }
              label="Active"
            />

            {/* Questions Section */}
            <AuroraBox sx={{ mt: 3 }}>
              <AuroraBox sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <AuroraTypography variant="h6">
                  Questions ({currentQuestions.length})
                </AuroraTypography>
                <AuroraButton
                  startIcon={<AuroraAddIcon />}
                  onClick={addQuestion}
                  size="small"
                >
                  Add Question
                </AuroraButton>
              </AuroraBox>

              {currentQuestions.map((question, index) => (
                <AuroraPaper key={index} sx={{ p: 2, mb: 2 }}>
                  <AuroraBox sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <AuroraTypography variant="subtitle1">
                      Question {index + 1}
                    </AuroraTypography>
                    <AuroraIconButton
                      onClick={() => removeQuestion(index)}
                      color="error"
                      size="small"
                    >
                      <AuroraDeleteIcon />
                    </AuroraIconButton>
                  </AuroraBox>

                  <AuroraInput
                    fullWidth
                    label="Question"
                    value={question.question || ""}
                    onChange={(e: any) =>
                      updateQuestion(index, { question: e.target.value })
                    }
                    sx={{ mb: 2 }}
                  />

                  <AuroraBox sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <AuroraFormControl fullWidth>
                      <AuroraInputLabel>Question Type</AuroraInputLabel>
                      <AuroraSelect
                        value={question.type || "free_text"}
                        label="Question Type"
                        onChange={(e: any) =>
                          updateQuestion(index, { type: e.target.value })
                        }
                      >
                        {questionTypes.map((type) => (
                          <AuroraMenuItem key={type.value} value={type.value}>
                            {type.label}
                          </AuroraMenuItem>
                        ))}
                      </AuroraSelect>
                    </AuroraFormControl>

                    <AuroraFormControl fullWidth>
                      <AuroraInputLabel>Required</AuroraInputLabel>
                      <AuroraSelect
                        value={question.required || "optional"}
                        label="Required"
                        onChange={(e: any) =>
                          updateQuestion(index, { required: e.target.value })
                        }
                      >
                        <AuroraMenuItem value="optional">Optional</AuroraMenuItem>
                        <AuroraMenuItem value="required">Required</AuroraMenuItem>
                      </AuroraSelect>
                    </AuroraFormControl>
                  </AuroraBox>

                  <AuroraInput
                    fullWidth
                    label="Help Text (Optional)"
                    value={question.helpText || ""}
                    onChange={(e: any) =>
                      updateQuestion(index, { helpText: e.target.value })
                    }
                    sx={{ mb: 2 }}
                  />

                  {question.type === "rating" && (
                    <AuroraBox sx={{ display: "flex", gap: 2, mb: 2 }}>
                      <AuroraInput
                        type="number"
                        label="Min Rating"
                        value={question.minRating || 1}
                        onChange={(e: any) =>
                          updateQuestion(index, { minRating: parseInt(e.target.value) })
                        }
                        sx={{ width: 120 }}
                      />
                      <AuroraInput
                        type="number"
                        label="Max Rating"
                        value={question.maxRating || 5}
                        onChange={(e: any) =>
                          updateQuestion(index, { maxRating: parseInt(e.target.value) })
                        }
                        sx={{ width: 120 }}
                      />
                    </AuroraBox>
                  )}

                  {question.type === "multiple_choice" && (
                    <AuroraInput
                      fullWidth
                      label="Options (comma-separated)"
                      placeholder="Option 1, Option 2, Option 3"
                      value={question.options?.join(", ") || ""}
                      onChange={(e: any) =>
                        updateQuestion(index, {
                          options: e.target.value
                            .split(",")
                            .map((opt: string) => opt.trim())
                            .filter((opt: string) => opt),
                        })
                      }
                    />
                  )}
                </AuroraPaper>
              ))}
            </AuroraBox>
          </AuroraBox>
        </AuroraDialogContent>
        <AuroraDialogActions>
          <AuroraButton onClick={() => setShowCreateDialog(false)}>
            Cancel
          </AuroraButton>
          <AuroraButton onClick={handleSaveTemplate} variant="contained">
            Create
          </AuroraButton>
        </AuroraDialogActions>
      </AuroraDialog>

      {/* Delete Confirmation Dialog */}
      <AuroraDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      >
        <AuroraDialogTitle>Delete Template</AuroraDialogTitle>
        <AuroraDialogContent>
          <AuroraTypography>
            Are you sure you want to delete &quot;{selectedTemplate?.name}&quot;? This
            action cannot be undone.
          </AuroraTypography>
        </AuroraDialogContent>
        <AuroraDialogActions>
          <AuroraButton onClick={() => setShowDeleteDialog(false)}>
            Cancel
          </AuroraButton>
          <AuroraButton
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </AuroraButton>
        </AuroraDialogActions>
      </AuroraDialog>
    </AuroraBox>
  );
};
