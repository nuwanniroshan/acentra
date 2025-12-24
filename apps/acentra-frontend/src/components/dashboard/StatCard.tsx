import { AuroraBox, AuroraTypography, AuroraPaper } from "@acentra/aurora-design-system";
import React from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color: string;
  loading?: boolean;
}

export function StatCard({ label, value, icon, trend, color, loading }: StatCardProps) {
  if (loading) {
    return (
      <AuroraPaper sx={{
        p: 3,
        height: "100%",
        borderRadius: 4,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        animate: "pulse"
      }}>
        <AuroraBox sx={{ width: 48, height: 48, borderRadius: 2.5, bgcolor: "slate.100" }} />
        <AuroraBox sx={{ height: 32, width: "60%", bgcolor: "slate.100", borderRadius: 1 }} />
        <AuroraBox sx={{ height: 20, width: "40%", bgcolor: "slate.50", borderRadius: 1 }} />
      </AuroraPaper>
    );
  }

  return (
    <AuroraPaper sx={{
      p: 3,
      borderRadius: 4,
      bgcolor: "background.paper",
      boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
      border: "1px solid",
      borderColor: "divider",
      display: "flex",
      flexDirection: "column",
      gap: 2,
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      }
    }}>
      <AuroraBox sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <AuroraBox sx={{
          width: 48,
          height: 48,
          borderRadius: 2.5,
          bgcolor: `${color}10`,
          color: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          {icon}
        </AuroraBox>
        {trend && (
          <AuroraBox sx={{
            px: 1.5,
            py: 0.5,
            borderRadius: 10,
            bgcolor: "slate.50",
            border: "1px solid",
            borderColor: "slate.100"
          }}>
            <AuroraTypography variant="caption" sx={{ fontWeight: 700, color: "slate.600" }}>
              {trend}
            </AuroraTypography>
          </AuroraBox>
        )}
      </AuroraBox>
      <AuroraBox>
        <AuroraTypography variant="h3" sx={{ fontWeight: 800, mb: 0.5 }}>
          {value}
        </AuroraTypography>
        <AuroraTypography variant="body2" sx={{ fontWeight: 600, color: "text.secondary" }}>
          {label}
        </AuroraTypography>
      </AuroraBox>
    </AuroraPaper>
  );
}
