import { useState, useEffect } from "react";
import {
  AuroraBox,
  AuroraTypography,
  AuroraButton,
  AuroraCircularProgress,
  AuroraChip,
  AuroraDivider,
  AuroraAlert,
  AuroraDescriptionIcon,
} from "@acentra/aurora-design-system";
import { candidatesService } from "@/services/candidatesService";
import { keyframes } from "@mui/system";

// Glowing border animation
const glowAnimation = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(25, 118, 210, 0.5), 0 0 10px rgba(25, 118, 210, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(25, 118, 210, 0.8), 0 0 30px rgba(25, 118, 210, 0.5);
  }
  100% {
    box-shadow: 0 0 5px rgba(25, 118, 210, 0.5), 0 0 10px rgba(25, 118, 210, 0.3);
  }
`;

interface CandidateAiOverviewProps {
  candidateId: string;
}

export function CandidateAiOverview({ candidateId }: CandidateAiOverviewProps) {
  const [overview, setOverview] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOverview();
  }, [candidateId]);

  const loadOverview = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await candidatesService.getCandidateAiOverview(candidateId);
      setOverview(data);
    } catch (err: any) {
      console.log("DATA", err);
      console.error("Failed to load AI overview", err);
      setError("Failed to load overview");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateOverview = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const data =
        await candidatesService.generateCandidateAiOverview(candidateId);
      setOverview(data);
    } catch (err: any) {
      console.error("Failed to generate AI overview", err);
      setError("Failed to generate overview. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <AuroraBox
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <AuroraCircularProgress />
      </AuroraBox>
    );
  }

  // No overview yet - show placeholder
  if (!overview) {
    return (
      <AuroraBox
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          textAlign: "center",
          p: 4,
        }}
      >
        <AuroraTypography variant="h6" fontWeight="bold" gutterBottom>
          No overview yet
        </AuroraTypography>
        <AuroraTypography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Click below to generate an AI overview for this candidate.
        </AuroraTypography>

        {error && (
          <AuroraAlert severity="error" sx={{ mb: 2, maxWidth: "500px" }}>
            {error}
          </AuroraAlert>
        )}

        <AuroraButton
          variant="contained"
          size="large"
          onClick={handleGenerateOverview}
          disabled={isGenerating}
          startIcon={
            isGenerating ? (
              <AuroraCircularProgress size={20} />
            ) : (
              <AuroraDescriptionIcon />
            )
          }
          sx={{
            animation: !isGenerating
              ? `${glowAnimation} 2s ease-in-out infinite`
              : "none",
            border: "2px solid",
            borderColor: "primary.main",
          }}
        >
          {isGenerating ? "Generating..." : "Generate Overview"}
        </AuroraButton>
      </AuroraBox>
    );
  }

  // Overview exists - display it
  const structuredData = overview.structuredData || {};
  const { summary, strengths, gaps, matchScore } = structuredData;

  return (
    <AuroraBox sx={{ p: 3 }}>
      {/* Header with match score */}
      <AuroraBox
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <AuroraTypography variant="h6" fontWeight="bold">
          AI-Generated Overview
        </AuroraTypography>
        {matchScore !== undefined && (
          <AuroraChip
            label={`Match Score: ${matchScore}%`}
            color={
              matchScore >= 70
                ? "success"
                : matchScore >= 50
                  ? "warning"
                  : "error"
            }
            sx={{ fontWeight: "bold", fontSize: "1rem", px: 2, py: 2.5 }}
          />
        )}
      </AuroraBox>

      {/* AI-generated content disclaimer */}
      <AuroraAlert severity="info" sx={{ mb: 3 }}>
        AI-generated content – please review before sharing
      </AuroraAlert>

      {/* Summary */}
      {summary && (
        <AuroraBox sx={{ mb: 3 }}>
          <AuroraTypography variant="subtitle1" fontWeight="bold" gutterBottom>
            Summary
          </AuroraTypography>
          <AuroraTypography variant="body1" color="text.secondary">
            {summary}
          </AuroraTypography>
        </AuroraBox>
      )}

      <AuroraDivider sx={{ my: 3 }} />

      {/* Strengths */}
      {strengths && strengths.length > 0 && (
        <AuroraBox sx={{ mb: 3 }}>
          <AuroraTypography variant="subtitle1" fontWeight="bold" gutterBottom>
            Strengths
          </AuroraTypography>
          <AuroraBox component="ul" sx={{ pl: 3, m: 0 }}>
            {strengths.map((strength: string, index: number) => (
              <AuroraTypography
                key={index}
                component="li"
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                {strength}
              </AuroraTypography>
            ))}
          </AuroraBox>
        </AuroraBox>
      )}

      {/* Gaps */}
      {gaps && gaps.length > 0 && (
        <AuroraBox sx={{ mb: 3 }}>
          <AuroraTypography variant="subtitle1" fontWeight="bold" gutterBottom>
            Areas for Development
          </AuroraTypography>
          <AuroraBox component="ul" sx={{ pl: 3, m: 0 }}>
            {gaps.map((gap: string, index: number) => (
              <AuroraTypography
                key={index}
                component="li"
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                {gap}
              </AuroraTypography>
            ))}
          </AuroraBox>
        </AuroraBox>
      )}

      <AuroraDivider sx={{ my: 3 }} />

      {/* Detailed Analysis */}
      {overview.overviewText && (
        <AuroraBox sx={{ mb: 3 }}>
          <AuroraTypography variant="subtitle1" fontWeight="bold" gutterBottom>
            Detailed Analysis
          </AuroraTypography>
          <AuroraTypography
            variant="body2"
            color="text.secondary"
            sx={{ whiteSpace: "pre-wrap" }}
          >
            {overview.overviewText}
          </AuroraTypography>
        </AuroraBox>
      )}

      {/* Generated timestamp */}
      {overview.createdAt && (
        <AuroraBox sx={{ mt: 4 }}>
          <AuroraTypography variant="caption" color="text.secondary">
            Generated on{" "}
            {new Date(overview.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </AuroraTypography>
        </AuroraBox>
      )}

      {/* Regenerate button */}
      <AuroraBox sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <AuroraButton
          variant="outlined"
          onClick={handleGenerateOverview}
          disabled={isGenerating}
          startIcon={
            isGenerating ? (
              <AuroraCircularProgress size={20} />
            ) : (
              <AuroraDescriptionIcon />
            )
          }
        >
          {isGenerating ? "Regenerating..." : "Regenerate Overview"}
        </AuroraButton>
      </AuroraBox>
    </AuroraBox>
  );
}
