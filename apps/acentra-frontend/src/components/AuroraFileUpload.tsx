import React from "react";
import { useDropzone, type Accept } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  AuroraBox,
  AuroraTypography,
  AuroraButton,
  AuroraUploadIcon,
  AuroraCircularProgress,
  alpha,
} from "@acentra/aurora-design-system";

interface AuroraFileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: Accept;
  maxSize?: number; // in bytes
  label?: string;
  description?: string;
  isProcessing?: boolean;
  processingLabel?: string;
  value?: File | null;
  error?: string | null;
}

export const AuroraFileUpload: React.FC<AuroraFileUploadProps> = ({
  onFileSelect,
  accept = {
    "application/pdf": [".pdf"],
  },
  maxSize = 10 * 1024 * 1024, // Default 10MB
  label = "Upload File",
  description = "PDF files supported",
  isProcessing = false,
  processingLabel = "Processing...",
  value = null,
  error = null,
}) => {
  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  });

  return (
    <AuroraBox sx={{ width: "100%" }}>
      <AnimatePresence mode="wait">
        {isProcessing ? (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            style={{
              padding: '40px 0',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <AuroraCircularProgress size={48} thickness={4} sx={{ mb: 2 }} />
            <AuroraTypography variant="h6" fontWeight={700}>{processingLabel}</AuroraTypography>
            <AuroraTypography color="text.secondary">AI is working its magic...</AuroraTypography>
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AuroraBox
              {...getRootProps()}
              sx={{
                p: { xs: 4, md: 8 },
                border: "2px dashed",
                borderColor: isDragActive ? "primary.main" : error ? "error.main" : "divider",
                borderRadius: 4,
                bgcolor: isDragActive ? alpha("#2563eb", 0.04) : "background.default",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: isDragActive ? "0 20px 40px rgba(37, 99, 235, 0.1)" : "none",
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: alpha("#2563eb", 0.02),
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                }
              }}
            >
              <input {...getInputProps()} />
              <AuroraBox sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                <AuroraBox sx={{
                  p: 2,
                  borderRadius: '30%',
                  bgcolor: alpha(isDragActive ? "#2563eb" : "#64748b", 0.1),
                  color: isDragActive ? "primary.main" : "text.secondary",
                  animation: isDragActive ? "pulse 1.5s infinite" : "none",
                  "@keyframes pulse": {
                    "0%": { transform: "scale(1)" },
                    "50%": { transform: "scale(1.1)" },
                    "100%": { transform: "scale(1)" }
                  }
                }}>
                  <AuroraUploadIcon sx={{ fontSize: 40 }} />
                </AuroraBox>
              </AuroraBox>

              <AuroraTypography variant="h6" fontWeight={800} gutterBottom>
                {value ? value.name : isDragActive ? "Drop it here!" : label}
              </AuroraTypography>

              <AuroraTypography color="text.secondary" variant="body2" sx={{ mb: 3 }}>
                {description}
              </AuroraTypography>

              <AuroraButton variant="outlined" size="small" sx={{ pointerEvents: 'none' }}>
                {value ? "Replace File" : "Browse Files"}
              </AuroraButton>
            </AuroraBox>

            {(error || (maxSize && maxSize < 10 * 1024 * 1024)) && (
              <AuroraTypography
                variant="caption"
                color={error ? "error.main" : "text.secondary"}
                sx={{ display: "block", mt: 1.5, textAlign: 'center' }}
              >
                {error || `Max file size: ${Math.round(maxSize / (1024 * 1024))}MB`}
              </AuroraTypography>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </AuroraBox>
  );
};
