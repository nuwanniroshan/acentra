import {
  AuroraBox,
  AuroraCard,
  AuroraCardContent,
  AuroraSkeleton,
} from "@acentra/aurora-design-system";

export function JobSkeleton() {
  const items = Array(6).fill(0);

  return (
    <AuroraBox sx={{ maxWidth: 1600, mx: "auto" }}>
      {/* Header Skeleton */}
      <AuroraBox
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <AuroraSkeleton variant="text" width={200} height={40} />
        <AuroraBox sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <AuroraSkeleton variant="rectangular" width={300} height={40} sx={{ borderRadius: 2 }} />
          <AuroraSkeleton variant="rectangular" width={40} height={40} sx={{ borderRadius: 2 }} />
          <AuroraSkeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 2 }} />
        </AuroraBox>
      </AuroraBox>

      {/* Grid Skeleton */}
      <AuroraBox
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          },
          gap: 3,
        }}
      >
        {items.map((_, index) => (
          <AuroraCard key={index} sx={{ borderRadius: 4 }}>
            <AuroraCardContent sx={{ p: 3 }}>
              <AuroraBox sx={{ mb: 2 }}>
                <AuroraSkeleton variant="rectangular" width={100} height={20} sx={{ mb: 1, borderRadius: 1 }} />
                <AuroraSkeleton variant="text" width="80%" height={24} sx={{ mb: 1 }} />
                <AuroraSkeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
                <AuroraSkeleton variant="text" width="40%" height={16} />
              </AuroraBox>

              <AuroraSkeleton variant="text" width={120} height={24} sx={{ mb: 3 }} />

              <AuroraBox sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <AuroraSkeleton variant="circular" width={32} height={32} />
                <AuroraBox>
                  <AuroraSkeleton variant="text" width={100} height={20} />
                  <AuroraSkeleton variant="text" width={60} height={16} />
                </AuroraBox>
              </AuroraBox>
            </AuroraCardContent>
          </AuroraCard>
        ))}
      </AuroraBox>
    </AuroraBox>
  );
}
