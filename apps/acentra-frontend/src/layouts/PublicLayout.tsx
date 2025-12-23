import { Link, Outlet } from "react-router-dom";
import {
  AuroraBox,
  AuroraContainer,
  AuroraAppBar,
  AuroraToolbar,
  AuroraTypography,
  AuroraButton,
  AuroraLogo
} from "@acentra/aurora-design-system";

export const PublicLayout = () => {

  return (
    <AuroraBox sx={{ display: 'flex', flexDirection: 'column', minHeight: "100vh", bgcolor: "#F9FAFB", color: "text.primary" }}>
      {/* Navbar */}
      <AuroraAppBar position="sticky" color="transparent" elevation={0} sx={{ backdropFilter: "blur(10px)", borderBottom: '1px solid', borderColor: 'divider' }}>
        <AuroraContainer maxWidth="lg">
          <AuroraToolbar disableGutters sx={{ justifyContent: "space-between" }}>
            <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
              <AuroraLogo width={120} />
            </Link>

            <AuroraBox>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <AuroraButton variant="outlined" color="primary" sx={{ borderRadius: 2 }}>
                  Team Login
                </AuroraButton>
              </Link>
            </AuroraBox>
          </AuroraToolbar>
        </AuroraContainer>
      </AuroraAppBar>

      {/* Main Content */}
      <AuroraBox component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </AuroraBox>

      {/* Footer */}
      <AuroraBox component="footer" sx={{ py: 4, mt: 8, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
        <AuroraContainer maxWidth="lg">
          <AuroraTypography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Acentra. All rights reserved.
          </AuroraTypography>
          <AuroraTypography variant="caption" color="text.disabled" align="center" display="block" sx={{ mt: 1 }}>
            Powered by Swivel Tech
          </AuroraTypography>
        </AuroraContainer>
      </AuroraBox>
    </AuroraBox>
  );
};
