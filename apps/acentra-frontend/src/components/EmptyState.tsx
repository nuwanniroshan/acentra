import type { ReactNode } from "react";
import {
  AuroraBox,
  AuroraTypography,
  AuroraButton,
  alpha,
} from "@acentra/aurora-design-system";
import { motion } from "framer-motion";

interface EmptyStateProps {
  title: string;
  description: string;
  icon: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ width: '100%' }}
    >
      <AuroraBox
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          py: 8,
          px: 2,
          backgroundColor: alpha("#f8fafc", 0.5),
          borderRadius: 4,
          border: "1px dashed",
          borderColor: alpha("#94a3b8", 0.3),
        }}
      >

        <AuroraBox
          sx={{
            mb: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 80,
            height: 80,
            borderRadius: "50%",
            backgroundColor: alpha("#3385F0", 0.08),
            color: "primary.main",
            "& svg": {
              fontSize: 40,
            },
          }}
        >
          {icon}
        </AuroraBox>

        <AuroraTypography variant="h6" fontWeight={700} gutterBottom>
          {title}
        </AuroraTypography>

        <AuroraTypography
          variant="body2"
          color="text.secondary"
          sx={{ maxWidth: 400, mb: 4 }}
        >
          {description}
        </AuroraTypography>

        {action && (
          <AuroraButton
            variant="contained"
            onClick={action.onClick}
            sx={{
              px: 4,
              py: 1,
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(51, 133, 240, 0.2)",
            }}
          >
            {action.label}
          </AuroraButton>
        )}
      </AuroraBox>
    </motion.div>
  );
}
