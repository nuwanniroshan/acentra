import { useState, type ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme as useCustomTheme } from "@/context/ThemeContext";
import { useTenant } from "@/context/TenantContext";
import {
  AuroraAppBar,
  AuroraToolbar,
  AuroraTypography,
  AuroraButton,
  AuroraBox,
  AuroraDrawer,
  AuroraList,
  AuroraListItem,
  AuroraListItemButton,
  AuroraListItemIcon,
  AuroraListItemText,
  AuroraIconButton,
  AuroraAvatar,
  AuroraInputBase,
  AuroraBadge,
  AuroraMenu,
  AuroraMenuItem,
  AuroraDivider,
  AuroraBreadcrumbs,
  AuroraLink,
  AuroraPopover,
  AuroraMenuIcon,
  AuroraDashboardIcon,
  AuroraWorkIcon,
  AuroraPeopleIcon,
  AuroraSettingsIcon,
  AuroraSearchIcon,
  AuroraNotificationsIcon,
  AuroraExpandMoreIcon,
  AuroraExpandLessIcon,
  AuroraLiveIconLayoutGrid,
  AuroraLiveIconFolders,
  AuroraLiveIconUsers,
  AuroraLiveIconBadgeDollarSign,
  AuroraLiveIconSlidersVertical,
  AuroraLiveIconBellRing,
  AuroraLiveIconCheck,
} from "@acentra/aurora-design-system";
import { useNotifications } from "@/context/NotificationContext";
import { NotificationList } from "./NotificationList";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/authSlice";

interface LayoutProps {
  children: ReactNode;
}

const DRAWER_WIDTH = 260;
const COLLAPSED_DRAWER_WIDTH = 72;

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const tenant = useTenant();
  const pathnames = location.pathname
    .split("/")
    .filter((x) => x && x !== tenant);
  // const theme = useTheme(); // Unused for now
  // const isMobile = useMediaQuery(theme.breakpoints.down("md")); // Unused for now

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed] = useState(false); // Fixed to false for now as button is removed
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] =
    useState<null | HTMLElement>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["Shortlist"])
  );
  const { unreadCount, markAllAsRead } = useNotifications();
  const { resetTheme } = useCustomTheme();
  const dispatch = useAppDispatch();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  // Check authentication on mount
  useEffect(() => {
    if (!token || !user.email) {
      navigate("/", { replace: true });
    }
  }, [token, user.email, navigate]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // const handleCollapseToggle = () => {
  //   setIsCollapsed(!isCollapsed);
  // };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout());
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      handleMenuClose();
      resetTheme(); // Reset theme to default
      navigate(`/${tenant}`);
    }
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
    // Mark all unread notifications as read when panel opens
    if (unreadCount > 0) {
      markAllAsRead();
    }
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const mainMenuItems = [
    {
      text: "Dashboard",
      icon: (
        <AuroraLiveIconLayoutGrid stroke="#000000" width={16} height={16} />
      ),
      path: `/${tenant}/dashboard`,
    },
  ];

  const appsMenuItems = [
    {
      text: "Shortlist",
      icon: <AuroraLiveIconCheck stroke="#000000" width={16} height={16} />,
      children: [
        {
          text: "Jobs",
          icon: (
            <AuroraLiveIconFolders stroke="#000000" width={16} height={16} />
          ),
          path: `/${tenant}/shortlist/jobs`,
        },
        {
          text: "Candidate",
          icon: <AuroraLiveIconUsers stroke="#000000" width={16} height={16} />,
          path: `/${tenant}/shortlist/candidates`,
        },
      ],
    },
    {
      text: "Payroll",
      icon: (
        <AuroraLiveIconBadgeDollarSign
          stroke="#000000"
          width={16}
          height={16}
        />
      ),
      path: `/${tenant}/payroll/main`,
    },
  ];

  const settingsMenuItems = [
    {
      text: "Settings",
      icon: (
        <AuroraLiveIconSlidersVertical
          stroke="#000000"
          width={24}
          height={24}
        />
      ),
      path: `/${tenant}/settings`,
    },
  ];

  const drawerContent = (
    <AuroraBox
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: "background.default",
      }}
    >
      <AuroraBox
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "space-between",
        }}
      >
        {!isCollapsed && (
          <AuroraTypography
            variant="h6"
            color="text.primary"
            sx={{
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              fontSize: "1.25rem",
            }}
          >
            acentra.
          </AuroraTypography>
        )}
        {isCollapsed && (
          <AuroraBox
            component="span"
            sx={{
              bgcolor: "primary.main",
              width: 24,
              height: 24,
              borderRadius: 1,
              display: "inline-block",
            }}
          />
        )}
      </AuroraBox>

      {/* MAIN Section */}
      <AuroraBox sx={{ px: 3, py: 2 }}>
        {!isCollapsed && (
          <AuroraTypography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontWeight: 600,
              letterSpacing: 1,
              mb: 2,
              display: "block",
            }}
          >
            MAIN
          </AuroraTypography>
        )}
        <AuroraList sx={{ p: 0 }}>
          {mainMenuItems.map((item) => {
            const isSelected = location.pathname === item.path;
            return (
              <AuroraListItem
                key={item.text}
                disablePadding
                sx={{ display: "block", mb: 1 }}
              >
                <AuroraListItemButton
                  onClick={() => navigate(item.path)}
                  selected={isSelected}
                >
                  <AuroraListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: isCollapsed ? 0 : 2,
                      justifyContent: "center",
                      color: isSelected ? "primary.main" : "text.secondary",
                    }}
                  >
                    {item.icon}
                  </AuroraListItemIcon>
                  <AuroraListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: "0.95rem",
                      fontWeight: isSelected ? 600 : 500,
                      color: isSelected ? "primary.main" : "text.secondary",
                    }}
                    sx={{ opacity: isCollapsed ? 0 : 1 }}
                  />
                </AuroraListItemButton>
              </AuroraListItem>
            );
          })}
        </AuroraList>
      </AuroraBox>

      {/* APPS Section */}
      <AuroraBox sx={{ px: 3, py: 1 }}>
        {!isCollapsed && (
          <AuroraTypography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontWeight: 600,
              letterSpacing: 1,
              mb: 1,
              display: "block",
            }}
          >
            APPS
          </AuroraTypography>
        )}
        <AuroraList sx={{ p: 0 }}>
          {appsMenuItems.map((item) => {
            if (item.children) {
              const isExpanded = expandedSections.has(item.text);
              return (
                <AuroraBox key={item.text}>
                  <AuroraListItem
                    disablePadding
                    sx={{ display: "block", mb: 0.5 }}
                  >
                    <AuroraListItemButton
                      onClick={() => toggleSection(item.text)}
                    >
                      <AuroraListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          fontSize: "0.95rem",
                          fontWeight: 500,
                          color: "text.secondary",
                        }}
                        sx={{ opacity: isCollapsed ? 0 : 1 }}
                      />
                      {!isCollapsed && (
                        <AuroraListItemIcon
                          sx={{
                            minWidth: 0,
                            ml: "auto",
                            justifyContent: "center",
                          }}
                        >
                          {isExpanded ? (
                            <AuroraExpandLessIcon />
                          ) : (
                            <AuroraExpandMoreIcon />
                          )}
                        </AuroraListItemIcon>
                      )}
                    </AuroraListItemButton>
                  </AuroraListItem>
                  {isExpanded &&
                    item.children.map((child) => {
                      const isSelected = location.pathname === child.path;
                      return (
                        <AuroraListItem
                          key={child.text}
                          disablePadding
                          sx={{ display: "block", mb: 0.5, pl: 2 }}
                        >
                          <AuroraListItemButton
                            onClick={() => navigate(child.path)}
                            selected={isSelected}
                          >
                            <AuroraListItemIcon
                              sx={{
                                minWidth: 0,
                                mr: isCollapsed ? 0 : 2,
                                justifyContent: "center",
                                color: isSelected
                                  ? "primary.main"
                                  : "text.secondary",
                              }}
                            >
                              {child.icon}
                            </AuroraListItemIcon>
                            <AuroraListItemText
                              primary={child.text}
                              primaryTypographyProps={{
                                fontSize: "0.9rem",
                                fontWeight: isSelected ? 600 : 500,
                                color: isSelected
                                  ? "primary.main"
                                  : "text.secondary",
                              }}
                              sx={{ opacity: isCollapsed ? 0 : 1 }}
                            />
                          </AuroraListItemButton>
                        </AuroraListItem>
                      );
                    })}
                </AuroraBox>
              );
            } else {
              const isSelected = location.pathname === item.path;
              return (
                <AuroraListItem
                  key={item.text}
                  disablePadding
                  sx={{ display: "block", mb: 0.5 }}
                >
                  <AuroraListItemButton
                    onClick={() => navigate(item.path)}
                    selected={isSelected}
                  >
                    <AuroraListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: isCollapsed ? 0 : 2,
                        justifyContent: "center",
                        color: isSelected ? "primary.main" : "text.secondary",
                      }}
                    >
                      {item.icon}
                    </AuroraListItemIcon>
                    <AuroraListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: "0.95rem",
                        fontWeight: isSelected ? 600 : 500,
                        color: isSelected ? "primary.main" : "text.secondary",
                      }}
                      sx={{ opacity: isCollapsed ? 0 : 1 }}
                    />
                  </AuroraListItemButton>
                </AuroraListItem>
              );
            }
          })}
        </AuroraList>
      </AuroraBox>

      {/* Settings Section */}
      <AuroraBox sx={{ px: 3, py: 2 }}>
        <AuroraList sx={{ p: 0 }}>
          {settingsMenuItems.map((item) => {
            const isSelected = location.pathname === item.path;
            return (
              <AuroraListItem
                key={item.text}
                disablePadding
                sx={{ display: "block", mb: 1 }}
              >
                <AuroraListItemButton
                  onClick={() => navigate(item.path)}
                  selected={isSelected}
                >
                  <AuroraListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: isCollapsed ? 0 : 2,
                      justifyContent: "center",
                      color: isSelected ? "primary.main" : "text.secondary",
                    }}
                  >
                    {item.icon}
                  </AuroraListItemIcon>
                  <AuroraListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: "0.95rem",
                      fontWeight: isSelected ? 600 : 500,
                      color: isSelected ? "primary.main" : "text.secondary",
                    }}
                    sx={{ opacity: isCollapsed ? 0 : 1 }}
                  />
                </AuroraListItemButton>
              </AuroraListItem>
            );
          })}
        </AuroraList>
      </AuroraBox>

      <AuroraBox sx={{ mt: "auto", p: 2 }}>
        {!isCollapsed && (
          <AuroraBox
            sx={{ p: 2, bgcolor: "background.default", borderRadius: 2 }}
          >
            <AuroraTypography variant="subtitle2" fontWeight="bold">
              Need Help?
            </AuroraTypography>
            <AuroraTypography
              variant="caption"
              color="text.secondary"
              display="block"
              sx={{ mb: 1 }}
            >
              Check our docs
            </AuroraTypography>
            <AuroraButton variant="contained" fullWidth size="small">
              Documentation
            </AuroraButton>
          </AuroraBox>
        )}
      </AuroraBox>
    </AuroraBox>
  );

  return (
    <AuroraBox
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <AuroraAppBar
        position="fixed"
        sx={{
          width: {
            md: `calc(100% - ${isCollapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH}px)`,
          },
          ml: {
            md: `${isCollapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH}px`,
          },
        }}
      >
        <AuroraToolbar>
          <AuroraIconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { md: "none" },
              borderRadius: 1,
              width: 40,
              height: 40,
            }}
          >
            <AuroraMenuIcon />
          </AuroraIconButton>

          {/* Search Bar */}
          <AuroraBox
            sx={{
              position: "relative",
              borderRadius: 4,
              bgcolor: "background.default",
              mr: 2,
              ml: 0,
              width: "100%",
              maxWidth: 400,
              display: "flex",
              alignItems: "center",
              px: 2,
              py: 0.5,
            }}
          >
            <AuroraSearchIcon sx={{ color: "text.secondary", mr: 1 }} />
            <AuroraInputBase
              placeholder="Search"
              inputProps={{ "aria-label": "search" }}
              sx={{ width: "100%" }}
            />
          </AuroraBox>

          <AuroraBox sx={{ flexGrow: 1 }} />

          <AuroraBox sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AuroraIconButton
              size="small"
              onClick={handleNotificationClick}
              sx={{
                borderRadius: 1,
                width: 32,
                height: 32,
              }}
            >
              <AuroraBadge badgeContent={unreadCount} color="error">
                <AuroraLiveIconBellRing />
              </AuroraBadge>
            </AuroraIconButton>
            <AuroraPopover
              open={Boolean(notificationAnchorEl)}
              anchorEl={notificationAnchorEl}
              onClose={handleNotificationClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              PaperProps={{
                elevation: 3,
                sx: { mt: 1.5 },
              }}
            >
              <NotificationList />
            </AuroraPopover>
            <AuroraBox
              sx={{ display: "flex", alignItems: "center", gap: 1, ml: 2 }}
            >
              <AuroraIconButton
                onClick={handleMenuOpen}
                size="small"
                sx={{
                  p: 0,
                  borderRadius: 1,
                }}
              >
                <AuroraAvatar
                  sx={{
                    width: 32,
                    height: 32,
                  }}
                >
                  {user.email ? user.email[0].toUpperCase() : "U"}
                </AuroraAvatar>
              </AuroraIconButton>
              <AuroraMenu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                    minWidth: 220,
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <AuroraMenuItem onClick={() => navigate(`/${tenant}/settings`)}>
                  Profile
                </AuroraMenuItem>
                <AuroraMenuItem onClick={() => navigate(`/${tenant}/settings`)}>
                  Settings
                </AuroraMenuItem>
                <AuroraDivider />
                <AuroraMenuItem onClick={handleLogout}>Logout</AuroraMenuItem>
              </AuroraMenu>
            </AuroraBox>
          </AuroraBox>
        </AuroraToolbar>
      </AuroraAppBar>

      <AuroraBox
        component="nav"
        sx={{
          width: { md: isCollapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH },
          flexShrink: { md: 0 },
        }}
      >
        {/* Mobile Drawer */}
        <AuroraDrawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
            },
          }}
        >
          {drawerContent}
        </AuroraDrawer>

        {/* Desktop Drawer */}
        <AuroraDrawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: isCollapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH,
              overflowX: "hidden",
            },
          }}
          open
        >
          {drawerContent}
        </AuroraDrawer>
      </AuroraBox>

      <AuroraBox
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: {
            md: `calc(100% - ${isCollapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH}px)`,
          },
          mt: 8,
        }}
      >
        <AuroraBox sx={{ mb: 2 }}>
          <AuroraBreadcrumbs aria-label="breadcrumb">
            <AuroraLink
              underline="hover"
              color="inherit"
              href={`/${tenant}/dashboard`}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/${tenant}/dashboard`);
              }}
            >
              Home
            </AuroraLink>
            {pathnames.map((value, index) => {
              const last = index === pathnames.length - 1;
              const to = `/${tenant}/${pathnames.slice(0, index + 1).join("/")}`;
              const name =
                value.charAt(0).toUpperCase() +
                value.slice(1).replace(/-/g, " ");

              return last ? (
                <AuroraTypography color="text.primary" key={to}>
                  {name}
                </AuroraTypography>
              ) : (
                <AuroraLink
                  underline="hover"
                  color="inherit"
                  href={to}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(to);
                  }}
                  key={to}
                >
                  {name}
                </AuroraLink>
              );
            })}
          </AuroraBreadcrumbs>
        </AuroraBox>
        {children}
      </AuroraBox>
    </AuroraBox>
  );
}
