import {
  AuroraTable,
  AuroraTableBody,
  AuroraTableCell,
  AuroraTableContainer,
  AuroraTableHead,
  AuroraTableRow,
  AuroraSkeleton,
  AuroraBox,
} from "@acentra/aurora-design-system";
import { Paper } from "@mui/material";

export function CandidateTableSkeleton() {
  const rows = Array(5).fill(0);

  return (
    <AuroraTableContainer
      component={Paper}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <AuroraTable>
        <AuroraTableHead>
          <AuroraTableRow>
            <AuroraTableCell padding="checkbox">
              <AuroraSkeleton variant="rectangular" width={20} height={20} />
            </AuroraTableCell>
            <AuroraTableCell>Name</AuroraTableCell>
            <AuroraTableCell>Job</AuroraTableCell>
            <AuroraTableCell>Status</AuroraTableCell>
            <AuroraTableCell>Applied Date</AuroraTableCell>
          </AuroraTableRow>
        </AuroraTableHead>
        <AuroraTableBody>
          {rows.map((_, index) => (
            <AuroraTableRow key={index}>
              <AuroraTableCell padding="checkbox">
                <AuroraSkeleton variant="rectangular" width={20} height={20} />
              </AuroraTableCell>
              <AuroraTableCell>
                <AuroraBox sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <AuroraSkeleton variant="circular" width={40} height={40} />
                  <AuroraBox sx={{ flex: 1 }}>
                    <AuroraSkeleton variant="text" width={120} height={20} />
                    <AuroraSkeleton variant="text" width={180} height={16} />
                  </AuroraBox>
                </AuroraBox>
              </AuroraTableCell>
              <AuroraTableCell>
                <AuroraSkeleton variant="text" width={100} />
              </AuroraTableCell>
              <AuroraTableCell>
                <AuroraSkeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
              </AuroraTableCell>
              <AuroraTableCell>
                <AuroraSkeleton variant="text" width={80} />
              </AuroraTableCell>
            </AuroraTableRow>
          ))}
        </AuroraTableBody>
      </AuroraTable>
    </AuroraTableContainer>
  );
}
