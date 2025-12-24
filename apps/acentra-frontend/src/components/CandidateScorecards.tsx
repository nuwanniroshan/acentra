import { useState, useEffect, type ChangeEvent } from "react";
import {
  AuroraBox,
  AuroraTypography,
  AuroraButton,
  AuroraAvatar,
  AuroraRating,
  AuroraTextField,
  AuroraFormControl,
  AuroraInputLabel,
  AuroraSelect,
  AuroraMenuItem,
  AuroraStack,
  alpha,
  AuroraCircularProgress,
} from "@acentra/aurora-design-system";
import { candidatesService } from "@/services/candidatesService";
import { format } from "date-fns";

interface ScorecardProps {
  candidateId: string;
}

export function CandidateScorecards({ candidateId }: ScorecardProps) {
  const [scorecards, setScorecards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [criteria, setCriteria] = useState({
    Technical: 3,
    Cultural: 3,
    "Soft Skills": 3,
  });
  const [comments, setComments] = useState("");
  const [overallRecommendation, setOverallRecommendation] = useState("hire");

  useEffect(() => {
    loadScorecards();
  }, [candidateId]);

  const loadScorecards = async () => {
    setLoading(true);
    try {
      const data = await candidatesService.getCandidateScorecards(candidateId);
      setScorecards(data);
    } catch (err) {
      console.error("Failed to load scorecards", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await candidatesService.submitCandidateScorecard(candidateId, {
        criteria,
        comments,
        overall_recommendation: overallRecommendation,
      });
      setShowForm(false);
      loadScorecards();
      // Reset form
      setCriteria({ Technical: 3, Cultural: 3, "Soft Skills": 3 });
      setComments("");
      setOverallRecommendation("hire");
    } catch (err) {
      console.error("Failed to submit scorecard", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AuroraBox sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <AuroraCircularProgress />
      </AuroraBox>
    );
  }

  return (
    <AuroraBox>
      <AuroraBox
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <AuroraTypography variant="h6" fontWeight={700}>
          Evaluation Scorecards
        </AuroraTypography>
        {!showForm && (
          <AuroraButton
            variant="contained"
            size="small"
            onClick={() => setShowForm(true)}
          >
            Submit Scorecard
          </AuroraButton>
        )}
      </AuroraBox>

      {showForm && (
        <AuroraBox
          sx={{
            p: 3,
            mb: 4,
            bgcolor: alpha("#2563eb", 0.02),
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <AuroraTypography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
            New Assessment
          </AuroraTypography>

          <AuroraStack spacing={2} sx={{ mb: 3 }}>
            {Object.keys(criteria).map((key) => (
              <AuroraBox
                key={key}
                sx={{ display: "flex", alignItems: "center", gap: 2 }}
              >
                <AuroraTypography variant="body2" sx={{ minWidth: 100 }}>
                  {key}
                </AuroraTypography>
                <AuroraRating
                  value={criteria[key as keyof typeof criteria]}
                  onChange={(_e: React.SyntheticEvent, val: number | null) =>
                    setCriteria({ ...criteria, [key]: val || 0 })
                  }
                />
              </AuroraBox>
            ))}
          </AuroraStack>

          <AuroraTextField
            fullWidth
            multiline
            rows={3}
            label="Comments"
            value={comments}
            onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setComments(e.target.value)}
            sx={{ mb: 3 }}
          />

          <AuroraFormControl fullWidth sx={{ mb: 3 }}>
            <AuroraInputLabel>Overall Recommendation</AuroraInputLabel>
            <AuroraSelect
              label="Overall Recommendation"
              value={overallRecommendation}
              onChange={(e) => setOverallRecommendation(e.target.value as string)}
            >
              <AuroraMenuItem value="strong_hire">Strong Hire</AuroraMenuItem>
              <AuroraMenuItem value="hire">Hire</AuroraMenuItem>
              <AuroraMenuItem value="neutral">Neutral</AuroraMenuItem>
              <AuroraMenuItem value="no_hire">No Hire</AuroraMenuItem>
              <AuroraMenuItem value="strong_no_hire">Strong No Hire</AuroraMenuItem>
            </AuroraSelect>
          </AuroraFormControl>

          <AuroraBox sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <AuroraButton onClick={() => setShowForm(false)}>Cancel</AuroraButton>
            <AuroraButton
              variant="contained"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </AuroraButton>
          </AuroraBox>
        </AuroraBox>
      )}

      <AuroraStack spacing={3}>
        {scorecards.length === 0 ? (
          <AuroraBox sx={{ py: 6, textAlign: "center", bgcolor: 'background.default', borderRadius: 4, border: '1px dashed', borderColor: 'divider' }}>
            <AuroraTypography color="text.secondary">
              No scorecards submitted yet.
            </AuroraTypography>
          </AuroraBox>
        ) : (
          scorecards.map((scorecard) => (
            <AuroraBox
              key={scorecard.id}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
                boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
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
                <AuroraBox sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <AuroraAvatar sx={{ width: 32, height: 32, fontSize: '0.8rem' }}>
                    {scorecard.submitted_by?.name?.[0] || scorecard.submitted_by?.email?.[0]}
                  </AuroraAvatar>
                  <AuroraBox>
                    <AuroraTypography variant="subtitle2" fontWeight={700}>
                      {scorecard.submitted_by?.name || scorecard.submitted_by?.email}
                    </AuroraTypography>
                    <AuroraTypography variant="caption" color="text.secondary">
                      {format(new Date(scorecard.created_at), "MMM d, yyyy")}
                    </AuroraTypography>
                  </AuroraBox>
                </AuroraBox>
                <AuroraBox
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    bgcolor: alpha(
                      scorecard.overall_recommendation.includes("no") ? "#ef4444" : "#22c55e",
                      0.1
                    ),
                    color: scorecard.overall_recommendation.includes("no")
                      ? "#ef4444"
                      : "#22c55e",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  {scorecard.overall_recommendation.replace("_", " ")}
                </AuroraBox>
              </AuroraBox>

              <AuroraStack direction="row" spacing={4} sx={{ mb: 2 }}>
                {Object.entries(scorecard.criteria).map(([key, val]: [string, any]) => (
                  <AuroraBox key={key}>
                    <AuroraTypography variant="caption" color="text.secondary" display="block">
                      {key}
                    </AuroraTypography>
                    <AuroraRating value={val} readOnly size="small" />
                  </AuroraBox>
                ))}
              </AuroraStack>

              <AuroraTypography variant="body2" color="text.secondary">
                {scorecard.comments}
              </AuroraTypography>
            </AuroraBox>
          ))
        )}
      </AuroraStack>
    </AuroraBox>
  );
}
