import { useState, type ReactNode, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useTheme as useCustomTheme } from "@/context/ThemeContext";
import { useTenant } from "@/context/TenantContext";
import { API_BASE_URL } from "@/services/clients";
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
  AuroraSearchIcon,
  AuroraExpandMoreIcon,
  AuroraExpandLessIcon,
  AuroraLiveIconLayoutGrid,
  AuroraLiveIconFolders,
  AuroraLiveIconUsers,
  AuroraLiveIconSlidersVertical,
  AuroraLiveIconBellRing,
  AuroraLogo,
  alpha,
} from "@acentra/aurora-design-system";
import { useNotifications } from "@/context/NotificationContext";
import { NotificationList } from "./NotificationList";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/authSlice";
import { jobsService } from "@/services/jobsService";
import ATSIcon from "./icons/ATSIcon";
import PayrollIcon from "./icons/PayrollIcon";
import PeopleIcon from "./icons/PeopleIcon";
import TimeTrackingIcon from "./icons/TimeTrackingIcon";


interface LayoutProps {
  children: ReactNode;
}

const DRAWER_WIDTH = 260;
const COLLAPSED_DRAWER_WIDTH = 72;

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const tenant = useTenant();
  const params = useParams();
  const pathnames = location.pathname
    .split("/")
    .filter((x) => x && x !== tenant);
  // const theme = useTheme(); // Unused for now
  // const isMobile = useMediaQuery(theme.breakpoints.down("md")); // Unused for now

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] =
    useState<null | HTMLElement>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["ATS", "HRIS", "PAYROLL", "PEOPLE", "TIME TRACKING"]),
  );
  const [jobTitles, setJobTitles] = useState<Record<string, string>>({});
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "{}"),
  );
  const { unreadCount, markAllAsRead } = useNotifications();
  const { resetTheme } = useCustomTheme();
  const dispatch = useAppDispatch();

  const token = localStorage.getItem("token");


  // Check authentication on mount
  useEffect(() => {
    if (!token || !user.email) {
      navigate("/", { replace: true });
    }
  }, [token, user.email, navigate]);

  // Listen for user updates
  useEffect(() => {
    const handleUserUpdate = (event: CustomEvent) => {
      setUser(event.detail);
    };

    window.addEventListener("userUpdated", handleUserUpdate as EventListener);

    return () => {
      window.removeEventListener(
        "userUpdated",
        handleUserUpdate as EventListener,
      );
    };
  }, []);

  // Fetch job title for breadcrumbs if id is present
  useEffect(() => {
    const jobId = params.id;
    if (jobId && !jobTitles[jobId]) {
      jobsService.getJob(jobId)
        .then(job => {
          setJobTitles(prev => ({ ...prev, [jobId]: job.title }));
        })
        .catch(err => {
          console.error("Failed to fetch job title for breadcrumb:", err);
        });
    }
  }, [params.id, jobTitles]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

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
      text: "ATS",
      icon: <ATSIcon size={18} strokeWidth={2} />,
      children: [
        {
          text: "Jobs",
          icon: (
            <AuroraLiveIconFolders stroke="#000000" width={16} height={16} />
          ),
          path: `/${tenant}/ats/jobs`,
        },
        {
          text: "Candidates",
          icon: <AuroraLiveIconUsers stroke="#000000" width={16} height={16} />,
          path: `/${tenant}/ats/candidates`,
        },
      ],
    },
    {
      text: "Payroll",
      icon: <PayrollIcon size={18} strokeWidth={2} />,
      path: `/${tenant}/payroll/main`,
    },
    {
      text: "People",
      icon: <PeopleIcon size={18} strokeWidth={2} />,
      children: [
        {
          text: "Overview",
          icon: <AuroraLiveIconLayoutGrid stroke="#000000" width={16} height={16} />,
          path: `/${tenant}/people/main`,
        },
        {
          text: "Staff",
          icon: <AuroraLiveIconUsers stroke="#000000" width={16} height={16} />,
          path: `/${tenant}/people/staff`,
        },
      ],
    },
    {
      text: "Time Tracking",
      icon: <TimeTrackingIcon size={18} strokeWidth={2} />,
      path: `/${tenant}/time-tracking/main`,
    },
  ];

  const settingsMenuItems = [
    {
      text: "Settings",
      icon: (
        <AuroraLiveIconSlidersVertical
          stroke="#000000"
          width={16}
          height={16}
        />
      ),
      path: `/${tenant}/settings`,
    },
    {
      text: "Feedback",
      icon: (
        <AuroraLiveIconBellRing
          stroke="#000000"
          width={16}
          height={16}
        />
      ),
      path: `/${tenant}/feedback`,
    },
  ];

  const renderMenuItems = (items: any[], depth = 0) => {
    const isActiveRecursive = (item: any): boolean => {
      if (item.path === location.pathname) return true;
      if (item.children) {
        return item.children.some((child: any) => isActiveRecursive(child));
      }
      return false;
    };

    return items.map((item) => {
      const isExpanded = expandedSections.has(item.text);
      const isActive = isActiveRecursive(item);
      const hasChildren = !!item.children;

      if (hasChildren) {
        return (
          <AuroraBox key={item.text}>
            <AuroraListItem
              disablePadding
              sx={{ display: "block", mb: depth === 0 ? 0.5 : 0.2, pl: 0 }}
            >
              <AuroraListItemButton
                onClick={() => toggleSection(item.text)}
                selected={isActive && !isExpanded}
                sx={{
                  borderRadius: isCollapsed ? "2px" : "0 4px 4px 0",
                  mr: isCollapsed ? 0 : 2,
                  "&.Mui-selected": {
                    bgcolor: alpha("#2563eb", 0.08),
                    borderLeft: "3px solid #2563eb",
                    color: "primary.main",
                    "&:hover": {
                      bgcolor: alpha("#2563eb", 0.12),
                    },
                  },
                  "&:hover": {
                    bgcolor: alpha("#2563eb", 0.04),
                  },
                }}
              >
                <AuroraListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: isCollapsed ? 0 : 2,
                    justifyContent: "center",
                    color: isActive ? "primary.main" : "text.secondary",
                  }}
                >
                  {item.icon}
                </AuroraListItemIcon>
                {!isCollapsed && (
                  <>
                    <AuroraListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: "13px",
                        fontWeight: depth === 0 ? 600 : 500,
                        color: isActive ? "primary.main" : "text.primary",
                        letterSpacing: 0.2,
                      }}
                    />
                    <AuroraListItemIcon
                      sx={{
                        minWidth: 0,
                        ml: "auto",
                        justifyContent: "center",
                        color: "text.disabled",
                      }}
                    >
                      {isExpanded ? (
                        <AuroraExpandLessIcon sx={{ fontSize: 16 }} />
                      ) : (
                        <AuroraExpandMoreIcon sx={{ fontSize: 16 }} />
                      )}
                    </AuroraListItemIcon>
                  </>
                )}
              </AuroraListItemButton>
            </AuroraListItem>
            {isExpanded && !isCollapsed && renderMenuItems(item.children, depth + 1)}
          </AuroraBox>
        );
      } else {
        const isSelected = location.pathname === item.path;
        return (
          <AuroraListItem
            key={item.text}
            disablePadding
            sx={{ display: "block", mb: 0.2, pl: 0 }}
          >
            <AuroraListItemButton
              onClick={() => navigate(item.path)}
              selected={isSelected}
              sx={{
                borderRadius: isCollapsed ? "2px" : "0 4px 4px 0",
                mr: isCollapsed ? 0 : 2,
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                "&.Mui-selected": {
                  background: `linear-gradient(90deg, ${alpha("#2563eb", 0.1)} 0%, ${alpha("#2563eb", 0.02)} 100%)`,
                  borderLeft: "3px solid #2563eb",
                  color: "primary.main",
                  "& .MuiListItemIcon-root": {
                    color: "primary.main",
                  },
                  "& .MuiTypography-root": {
                    fontWeight: 600,
                  },
                  "&:hover": {
                    background: `linear-gradient(90deg, ${alpha("#2563eb", 0.15)} 0%, ${alpha("#2563eb", 0.05)} 100%)`,
                  },
                },
                "&:hover": {
                  bgcolor: alpha("#2563eb", 0.04),
                  "& .MuiListItemIcon-root": {
                    color: "primary.main",
                  },
                },
              }}
            >
              <AuroraListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isCollapsed && depth === 0 ? 0 : 2,
                  justifyContent: "center",
                  color: isSelected ? "primary.main" : "text.secondary",
                  display: isCollapsed && depth > 0 ? "none" : "flex",
                }}
              >
                {item.icon}
              </AuroraListItemIcon>
              {!isCollapsed && (
                <AuroraListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: "13px",
                    fontWeight: isSelected ? 600 : 500,
                    color: isSelected
                      ? "primary.main"
                      : "text.secondary",
                    letterSpacing: 0.1,
                  }}
                />
              )}
            </AuroraListItemButton>
          </AuroraListItem>
        );
      }
    });
  };

  const drawerContent = (
    <AuroraBox
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: "primary.contrastText",
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
        {!isCollapsed && <AuroraLogo width={100} />}
        <AuroraIconButton onClick={handleCollapseToggle} size="small" sx={{ color: "text.secondary" }}>
          <AuroraMenuIcon />
        </AuroraIconButton>
      </AuroraBox>

      <AuroraBox sx={{ p: 2, flexGrow: 1, overflowY: "auto", overflowX: "hidden" }}>
        {/* MAIN Section */}
        <AuroraBox sx={{ mb: 3 }}>
          {!isCollapsed && (
            <AuroraTypography
              variant="caption"
              sx={{
                color: "text.disabled",
                fontWeight: 600,
                letterSpacing: 1.2,
                fontSize: "10px",
                mb: 1,
                px: 2,
                display: "block",
                textTransform: "uppercase",
              }}
            >
              MAIN
            </AuroraTypography>
          )}
          <AuroraList sx={{ p: 0 }}>
            {renderMenuItems(mainMenuItems)}
          </AuroraList>
        </AuroraBox>

        {/* APPS Section */}
        <AuroraBox sx={{ mb: 3 }}>
          {!isCollapsed && (
            <AuroraTypography
              variant="caption"
              sx={{
                color: "text.disabled",
                fontWeight: 600,
                letterSpacing: 1.2,
                fontSize: "10px",
                mb: 1,
                px: 2,
                display: "block",
                textTransform: "uppercase",
              }}
            >
              APPS
            </AuroraTypography>
          )}
          <AuroraList sx={{ p: 0 }}>
            {renderMenuItems(appsMenuItems)}
          </AuroraList>
        </AuroraBox>

        {/* OTHERS Section */}
        <AuroraBox>
          {!isCollapsed && (
            <AuroraTypography
              variant="caption"
              sx={{
                color: "text.disabled",
                fontWeight: 600,
                letterSpacing: 1.2,
                fontSize: "10px",
                mb: 1,
                px: 2,
                display: "block",
                textTransform: "uppercase",
              }}
            >
              OTHERS
            </AuroraTypography>
          )}
          <AuroraList sx={{ p: 0 }}>
            {renderMenuItems(settingsMenuItems)}
          </AuroraList>
        </AuroraBox>
      </AuroraBox>

      <AuroraBox sx={{ mt: "auto", p: 2 }}>
        {!isCollapsed && (
          <AuroraBox
            sx={{
              p: 2.5,
              background: `linear-gradient(135deg, ${alpha("#2563eb", 0.05)} 0%, ${alpha("#2563eb", 0.02)} 100%)`,
              borderRadius: "12px",
              border: `1px solid ${alpha("#2563eb", 0.1)}`,
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: -20,
                right: -20,
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: alpha("#2563eb", 0.05),
              }
            }}
          >
            <AuroraTypography variant="subtitle2" fontWeight="700" color="primary.main" sx={{ mb: 0.5 }}>
              Need Assistance?
            </AuroraTypography>
            <AuroraTypography
              variant="caption"
              color="text.secondary"
              display="block"
              sx={{ mb: 2, lineHeight: 1.4 }}
            >
              Get help with setup or explore our detailed guides.
            </AuroraTypography>
            <AuroraButton
              variant="contained"
              fullWidth
              size="small"
              sx={{
                py: 1,
                boxShadow: "none",
                fontWeight: 600,
                "&:hover": {
                  boxShadow: `0 4px 12px ${alpha("#2563eb", 0.2)}`,
                }
              }}
            >
              Documentation
            </AuroraButton>
          </AuroraBox>
        )}
      </AuroraBox>
    </AuroraBox >
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
              borderRadius: 2,
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
                borderRadius: 2,
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
              <NotificationList onClose={handleNotificationClose} />
            </AuroraPopover>
            <AuroraBox
              sx={{ display: "flex", alignItems: "center", gap: 1, ml: 2 }}
            >
              <AuroraIconButton
                onClick={handleMenuOpen}
                size="small"
                sx={{
                  p: 0,
                  borderRadius: 2,
                }}
              >
                <AuroraAvatar
                  src={
                    user.profile_picture
                      ? `${API_BASE_URL}/api/${user.profile_picture}`
                      : undefined
                  }
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
                value === params.id && jobTitles[value]
                  ? jobTitles[value]
                  : value === "shortlist" || value === "ats"
                    ? "ATS"
                    : value.charAt(0).toUpperCase() +
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
