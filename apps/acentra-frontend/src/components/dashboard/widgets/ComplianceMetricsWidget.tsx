import { useEffect, useState } from "react";
import { candidatesService } from "@/services/candidatesService";
import {
  AuroraCard,
  AuroraCardContent,
  AuroraBox,
  AuroraTypography,
  AuroraGrid,
  AuroraChip,
  AuroraLiveIconShell,
  AuroraLiveIconCheck,
} from "@acentra/aurora-design-system";

export const widgetName = "compliance-metrics";

interface ComplianceMetric {
  title: string;
  value: number;
  target: number;
  unit: string;
  status: "good" | "warning" | "poor";
  description: string;
}

export function ComplianceMetricsWidget() {
  const [metrics, setMetrics] = useState<ComplianceMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComplianceData();
  }, []);

  const loadComplianceData = async () => {
    try {
      setLoading(true);

      // Fetch candidates data for calculations
      const candidatesData = await candidatesService.getCandidates();
      const candidates = candidatesData.data || [];

      // Mock compliance metrics - in a real implementation, this would analyze actual diversity data
      const mockMetrics: ComplianceMetric[] = [
        {
          title: "Diversity Hiring Rate",
          value: 68,
          target: 70,
          unit: "%",
          status: "warning",
          description: "Percentage of hires from underrepresented groups",
        },
        {
          title: "Application Completion Rate",
          value: 85,
          target: 90,
          unit: "%",
          status: "good",
          description: "Candidates who complete full application process",
        },
        {
          title: "Interview Diversity Score",
          value: 72,
          target: 75,
          unit: "/100",
          status: "good",
          description: "Diversity representation in interview pools",
        },
        {
          title: "Equal Opportunity Compliance",
          value: 94,
          target: 95,
          unit: "%",
          status: "good",
          description: "Adherence to equal employment practices",
        },
      ];

      // Calculate actual application completion rate
      const totalCandidates = candidates.length;
      if (totalCandidates > 0) {
        // Assuming candidates with complete profiles represent completion
        const completeProfiles = candidates.filter(
          (c: any) => c.first_name && c.last_name && c.email && c.phone,
        ).length;
        const completionRate = Math.round(
          (completeProfiles / totalCandidates) * 100,
        );

        mockMetrics[1].value = completionRate;
        mockMetrics[1].status =
          completionRate >= mockMetrics[1].target
            ? "good"
            : completionRate >= mockMetrics[1].target - 10
              ? "warning"
              : "poor";
      }

      setMetrics(mockMetrics);
    } catch (err: any) {
      console.error("Failed to load compliance data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "#2e7d32";
      case "warning":
        return "#f57c00";
      case "poor":
        return "#d32f2f";
      default:
        return "#1976d2";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return <AuroraLiveIconCheck width={16} height={16} stroke="#2e7d32" />;
      case "warning":
        return <AuroraLiveIconShell width={16} height={16} stroke="#f57c00" />;
      case "poor":
        return <AuroraLiveIconShell width={16} height={16} stroke="#d32f2f" />;
      default:
        return <AuroraLiveIconShell width={16} height={16} stroke="#1976d2" />;
    }
  };

  if (loading) {
    return (
      <AuroraCard sx={{ height: "100%" }}>
        <AuroraCardContent sx={{ p: 3, textAlign: "center" }}>
          <AuroraTypography variant="body2">Loading...</AuroraTypography>
        </AuroraCardContent>
      </AuroraCard>
    );
  }

  return (
    <AuroraBox>
      <AuroraBox sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <AuroraLiveIconShell width={24} height={24} stroke="#1976d2" />
        <AuroraTypography variant="h5" sx={{ fontWeight: 600, ml: 1 }}>
          Compliance Metrics
        </AuroraTypography>
      </AuroraBox>

      <AuroraGrid container spacing={2}>
        {metrics.map((metric, index) => (
          <AuroraGrid size={{ xs: 12, sm: 6 }} key={index}>
            <AuroraCard>
              <AuroraCardContent sx={{ p: 3 }}>
                <AuroraBox
                  sx={{ display: "flex", alignItems: "center", mb: 2 }}
                >
                  {getStatusIcon(metric.status)}
                  <AuroraTypography
                    variant="h6"
                    sx={{ fontWeight: 600, ml: 1 }}
                  >
                    {metric.title}
                  </AuroraTypography>
                </AuroraBox>

                <AuroraBox sx={{ mb: 2 }}>
                  <AuroraTypography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      color: getStatusColor(metric.status),
                    }}
                  >
                    {metric.value}
                    {metric.unit}
                  </AuroraTypography>
                  <AuroraTypography variant="body2" color="text.secondary">
                    Target: {metric.target}
                    {metric.unit}
                  </AuroraTypography>
                </AuroraBox>

                <AuroraBox sx={{ mb: 2 }}>
                  <AuroraBox
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "rgba(0,0,0,0.1)",
                      width: "100%",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <AuroraBox
                      sx={{
                        height: "100%",
                        width: `${Math.min((metric.value / metric.target) * 100, 100)}%`,
                        backgroundColor: getStatusColor(metric.status),
                        borderRadius: 4,
                        transition: "width 0.3s ease",
                      }}
                    />
                  </AuroraBox>
                </AuroraBox>

                <AuroraTypography variant="body2" color="text.secondary">
                  {metric.description}
                </AuroraTypography>

                <AuroraBox sx={{ mt: 2 }}>
                  <AuroraChip
                    label={
                      metric.status === "good"
                        ? "On Track"
                        : metric.status === "warning"
                          ? "Needs Attention"
                          : "Critical"
                    }
                    size="small"
                    sx={{
                      backgroundColor: getStatusColor(metric.status),
                      color: "white",
                      fontWeight: 500,
                    }}
                  />
                </AuroraBox>
              </AuroraCardContent>
            </AuroraCard>
          </AuroraGrid>
        ))}
      </AuroraGrid>
    </AuroraBox>
  );
}
