import { Box, Typography } from "@mui/material";

export function AdminDashboard() {
  return (
    <Box sx={{ maxWidth: 1600, mx: "auto" }}>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        Admin Dashboard
      </Typography>
      {/* Admin dashboard content will be added here */}
    </Box>
  );
}