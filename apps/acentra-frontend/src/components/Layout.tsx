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
  AuroraBadge,
  AuroraMenu,
  AuroraMenuItem,
  AuroraDivider,
  AuroraBreadcrumbs,
  AuroraLink,
  AuroraPopover,
  AuroraMenuIcon,
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
import { usersService } from "@/services/usersService";
import ATSIcon from "./icons/ATSIcon";
import PayrollIcon from "./icons/PayrollIcon";
import PeopleIcon from "./icons/PeopleIcon";
import TimeTrackingIcon from "./icons/TimeTrackingIcon";


interface LayoutProps {
  children: ReactNode;
}

const DRAWER_WIDTH = 260;

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const tenant = useTenant();
  const params = useParams();
  const pathnames = location.pathname
    .split("/")
    .filter((x) => x && x !== tenant);
  const { theme, resetTheme } = useCustomTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down("md")); // Unused for now

  // Drawer is always temporary in this design
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] =
    useState<null | HTMLElement>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["ATS", "HRIS", "PAYROLL", "PEOPLE", "TIME TRACKING"]),
  );
  const [jobTitles, setJobTitles] = useState<Record<string, string>>({});
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "{}"),
  );
  const { unreadCount, markAllAsRead } = useNotifications();
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

  // Fetch job title for breadcrumbs if id is present and we are on a job-related page
  useEffect(() => {
    const jobId = params.id;
    const isJobPath = location.pathname.includes("/jobs/");

    if (jobId && isJobPath && !jobTitles[jobId]) {
      jobsService.getJob(jobId)
        .then(job => {
          setJobTitles(prev => ({ ...prev, [jobId]: job.title }));
        })
        .catch(err => {
          console.error("Failed to fetch job title for breadcrumb:", err);
        });
    }
  }, [params.id, jobTitles, location.pathname]);

  // Fetch user name for breadcrumbs if id is present and we are on a staff-related page
  useEffect(() => {
    const userId = params.id;
    const isStaffPath = location.pathname.includes("/people/staff/");

    if (userId && isStaffPath && !userNames[userId]) {
      usersService.getUser(userId)
        .then(user => {
          setUserNames(prev => ({ ...prev, [userId]: user.name || user.email }));
        })
        .catch(err => {
          console.error("Failed to fetch user name for breadcrumb:", err);
        });
    }
  }, [params.id, userNames, location.pathname]);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
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
        <AuroraLiveIconLayoutGrid stroke="currentColor" width={16} height={16} />
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
            <AuroraLiveIconFolders stroke="currentColor" width={16} height={16} />
          ),
          path: `/${tenant}/ats/jobs`,
        },
        {
          text: "Candidates",
          icon: <AuroraLiveIconUsers stroke="currentColor" width={16} height={16} />,
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
          icon: <AuroraLiveIconLayoutGrid stroke="currentColor" width={16} height={16} />,
          path: `/${tenant}/people/main`,
        },
        {
          text: "Staff",
          icon: <AuroraLiveIconUsers stroke="currentColor" width={16} height={16} />,
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
          stroke="currentColor"
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
          stroke="currentColor"
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
                  borderRadius: "0 4px 4px 0",
                  mr: 2,
                  "&.Mui-selected": {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    borderLeft: `3px solid ${theme.palette.primary.main}`,
                    color: theme.palette.primary.main,
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.12),
                    },
                  },
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                  },
                }}
              >
                <AuroraListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: 2,
                    justifyContent: "center",
                    color: isActive ? "primary.main" : "text.secondary",
                  }}
                >
                  {item.icon}
                </AuroraListItemIcon>
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
              </AuroraListItemButton>
            </AuroraListItem>
            {isExpanded && renderMenuItems(item.children, depth + 1)}
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
                borderRadius: "0 4px 4px 0",
                mr: 2,
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                "&.Mui-selected": {
                  background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
                  borderLeft: `3px solid ${theme.palette.primary.main}`,
                  color: theme.palette.primary.main,
                  "& .MuiListItemIcon-root": {
                    color: theme.palette.primary.main,
                  },
                  "& .MuiTypography-root": {
                    fontWeight: 600,
                  },
                  "&:hover": {
                    background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                  },
                },
                "&:hover": {
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                  "& .MuiListItemIcon-root": {
                    color: theme.palette.primary.main,
                  },
                },
              }}
            >
              <AuroraListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 2,
                  justifyContent: "center",
                  color: isSelected ? "primary.main" : "text.secondary",
                  display: "flex",
                }}
              >
                {item.icon}
              </AuroraListItemIcon>
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
        bgcolor: "transparent",
      }}
    >
      <AuroraBox
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <AuroraLogo width={100} />
        <AuroraIconButton onClick={handleDrawerToggle} size="small" sx={{ color: "text.secondary" }}>
          <AuroraMenuIcon />
        </AuroraIconButton>
      </AuroraBox>

      <AuroraBox sx={{ p: 2, flexGrow: 1, overflowY: "auto", overflowX: "hidden" }}>
        {/* MAIN Section */}
        <AuroraBox sx={{ mb: 3 }}>
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
          <AuroraList sx={{ p: 0 }}>
            {renderMenuItems(mainMenuItems)}
          </AuroraList>
        </AuroraBox>

        {/* APPS Section */}
        <AuroraBox sx={{ mb: 3 }}>
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
          <AuroraList sx={{ p: 0 }}>
            {renderMenuItems(appsMenuItems)}
          </AuroraList>
        </AuroraBox>

        {/* OTHERS Section */}
        <AuroraBox>
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
          <AuroraList sx={{ p: 0 }}>
            {renderMenuItems(settingsMenuItems)}
          </AuroraList>
        </AuroraBox>
      </AuroraBox>

      <AuroraBox sx={{ mt: "auto", p: 2 }}>
        <AuroraBox sx={{ mt: "auto", p: 2 }}>
          <AuroraBox
            sx={{
              p: 2.5,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
              borderRadius: "12px",
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
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
                background: alpha(theme.palette.primary.main, 0.05),
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
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                }
              }}
            >
              Documentation
            </AuroraButton>
          </AuroraBox>
        </AuroraBox>
      </AuroraBox>
    </AuroraBox >
  );

  return (
    <AuroraBox
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "transparent",
      }}
    >
      <AuroraAppBar
        position="fixed"
        sx={{
          width: { xs: "calc(100% - 32px)", md: "calc(100% - 48px)" },
          left: { xs: 16, md: 24 },
          right: { xs: 16, md: 24 },
          top: 16,
          bgcolor: "transparent",
          boxShadow: "none",
          backgroundImage: "none",
          border: "none",
          backdropFilter: "none",
        }}
      >
        <AuroraToolbar>
          <AuroraBox sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Left Control Pill */}
            <AuroraBox
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                bgcolor: alpha("#fff", 0.9),
                backdropFilter: "blur(12px)",
                borderRadius: "32px",
                border: "1px solid rgba(255, 255, 255, 0.8)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                pl: 0.5,
                pr: 2.5,
                py: 0.5,
              }}
            >
              <AuroraIconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  color: "text.secondary",
                  p: 0,
                  mx: 1,
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    color: "primary.main"
                  },
                }}
              >
                <AuroraMenuIcon />
              </AuroraIconButton>

              <AuroraDivider
                orientation="vertical"
                flexItem
                sx={{ height: 24, my: "auto", borderColor: "rgba(0,0,0,0.1)" }}
              />

              <AuroraBox>
                <AuroraTypography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', fontSize: '0.65rem', display: 'block' }}>
                  Welcome back {user.name || user.first_name || ""}
                </AuroraTypography>
              </AuroraBox>
            </AuroraBox>
          </AuroraBox>

          <AuroraBox sx={{ flexGrow: 1 }} />

          {/* Right Action Pill */}
          <AuroraBox
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              bgcolor: alpha("#fff", 0.9),
              backdropFilter: "blur(12px)",
              borderRadius: "32px",
              border: "1px solid rgba(255, 255, 255, 0.8)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              p: 0.75,
              pr: 0.75,
            }}
          >
            <AuroraIconButton
              size="small"
              onClick={handleNotificationClick}
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                transition: "color 0.2s, background-color 0.2s",
                "&:hover": {
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              <AuroraBadge
                badgeContent={unreadCount}
                color="error"
                variant="dot"
                sx={{ "& .MuiBadge-badge": { top: 4, right: 4 } }}
              >
                <AuroraLiveIconBellRing stroke="currentColor" width={20} height={20} />
              </AuroraBadge>
            </AuroraIconButton>

            <AuroraDivider
              orientation="vertical"
              flexItem
              sx={{ height: 24, my: "auto", mx: 0.5, borderColor: "rgba(0,0,0,0.1)" }}
            />

            <AuroraBox
              onClick={handleMenuOpen}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                cursor: "pointer",
                borderRadius: "24px",
                pl: 0.5,
                pr: 0.5,
                py: 0.5,
                transition: "background-color 0.2s",
                "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.04) },
              }}
            >
              <AuroraAvatar
                src={
                  user.profile_picture
                    ? `${API_BASE_URL}/api/${user.profile_picture}`
                    : undefined
                }
                sx={{
                  width: 36,
                  height: 36,
                  border: "2px solid #fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                {user.email ? user.email[0].toUpperCase() : "U"}
              </AuroraAvatar>
              <AuroraExpandMoreIcon sx={{ fontSize: 18, color: "text.secondary", ml: -0.5 }} />
            </AuroraBox>

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

          <AuroraPopover
            open={Boolean(notificationAnchorEl)}
            anchorEl={notificationAnchorEl}
            onClose={handleNotificationClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{ elevation: 3, sx: { mt: 2 } }}
          >
            <NotificationList onClose={handleNotificationClose} />
          </AuroraPopover>
        </AuroraToolbar>
      </AuroraAppBar>

      <AuroraBox
        component="nav"
        sx={{
          // Drawer container is hidden if we want floating, but we use temporary drawer.
          // width: { md: isCollapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH },
          // flexShrink: { md: 0 },
        }}
      >
        {/* Universal Drawer */}
        <AuroraDrawer
          variant="temporary"
          open={drawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
              borderTopRightRadius: 24,
              borderBottomRightRadius: 24,
              mt: 2,
              mb: 2,
              ml: 2,
              height: 'calc(100% - 32px)',
              background: alpha("#fff", 0.9), // Extra glass for drawer
              backdropFilter: "blur(24px)",
            },
            // Remove backdrop if we want it less obtrusive? No, standard backdrop is fine for focus.
          }}
        >
          {drawerContent}
        </AuroraDrawer>
      </AuroraBox>

      <AuroraBox
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: "100%",
          mt: 12, // More margin for the floating header
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

              // Map category paths to their primary feature page to avoid broken links
              const getValidPath = (val: string, currentPath: string) => {
                if (val === "ats") return `/${tenant}/ats/jobs`;
                if (val === "people") return `/${tenant}/people/main`;
                if (val === "payroll") return `/${tenant}/payroll/main`;
                if (val === "time-tracking") return `/${tenant}/time-tracking/main`;
                if (val === "notifications") return `/${tenant}/notifications`;
                if (val === "settings") return `/${tenant}/settings`;
                return currentPath;
              };

              const validTo = getValidPath(value, to);

              const name =
                value === params.id
                  ? (jobTitles[value] || userNames[value] || value.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "))
                  : value === "ats"
                    ? "ATS"
                    : value === "hris"
                      ? "HRIS"
                      : value.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

              return last ? (
                <AuroraTypography color="text.primary" key={to} sx={{ fontWeight: 500, fontSize: "0.85rem" }}>
                  {name}
                </AuroraTypography>
              ) : (
                <AuroraLink
                  underline="hover"
                  color="inherit"
                  href={validTo}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(validTo);
                  }}
                  key={to}
                  sx={{ fontSize: "0.85rem" }}
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
