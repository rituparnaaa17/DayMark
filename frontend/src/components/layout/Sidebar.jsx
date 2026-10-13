import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ListTodo,
  Target,
  HeartPulse,
  BarChart3,
  Calendar as CalendarIcon,
  Timer,
  Bell,
  User,
  Settings as SettingsIcon,
  LogOut,
  Sun,
  Moon,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { ROUTES } from "../../utils/constants";

const navItems = [
  { name: "Dashboard",     path: ROUTES.DASHBOARD,     icon: LayoutDashboard },
  { name: "Activities",    path: ROUTES.ACTIVITIES,    icon: ListTodo        },
  { name: "Goals",         path: ROUTES.GOALS,         icon: Target          },
  { name: "Wellness",      path: ROUTES.WELLNESS,      icon: HeartPulse      },
  { name: "Analytics",     path: ROUTES.ANALYTICS,     icon: BarChart3       },
  { name: "Calendar",      path: ROUTES.CALENDAR,      icon: CalendarIcon    },
  { name: "Focus",         path: ROUTES.FOCUS,         icon: Timer           },
  { name: "Notifications", path: ROUTES.NOTIFICATIONS, icon: Bell, badge: true },
];

const bottomItems = [
  { name: "Profile",  path: ROUTES.PROFILE,  icon: User          },
  { name: "Settings", path: ROUTES.SETTINGS, icon: SettingsIcon  },
];

export function Sidebar({ mobileOpen, onMobileClose }) {
  const { user, logout } = useAuth();
  const { unreadNotificationCount, theme, setTheme } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const getInitials = (name) => {
    if (!name) return "DM";
    return name.split(" ").map((part) => part[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <aside
      className={`dm-sidebar ${mobileOpen ? "dm-sidebar-mobile-open" : ""}`}
      style={{
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        width: "var(--dm-sidebar-width)",
        backgroundColor: "var(--dm-surface)",
        borderRight: "1px solid var(--dm-border)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        zIndex: 100,
        padding: "var(--dm-space-4) var(--dm-space-3)",
        transition: "transform var(--dm-transition-base)",
      }}
    >
      {/* TOP: Brand + Nav */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0, flex: 1, minHeight: 0, overflow: "hidden" }}>
        {/* Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--dm-space-3)",
            padding: "var(--dm-space-2) var(--dm-space-3)",
            marginBottom: "var(--dm-space-5)",
          }}
        >
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "var(--dm-radius-sm)",
              background: "linear-gradient(135deg, var(--dm-primary), var(--dm-accent-sage))",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "var(--dm-shadow-sm)",
              flexShrink: 0,
            }}
          >
            <Sparkles size={16} />
          </div>
          <span
            style={{
              fontSize: "var(--dm-text-md)",
              fontWeight: "var(--dm-weight-bold)",
              color: "var(--dm-text-primary)",
              letterSpacing: "-0.03em",
            }}
          >
            DayMark
          </span>
        </div>

        {/* Main Nav */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1, overflowY: "auto" }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            const badgeCount = item.badge ? unreadNotificationCount : 0;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onMobileClose}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "9px 12px",
                  borderRadius: "var(--dm-radius-sm)",
                  fontSize: "var(--dm-text-sm)",
                  fontWeight: isActive ? "var(--dm-weight-semibold)" : "var(--dm-weight-medium)",
                  color: isActive ? "var(--dm-primary)" : "var(--dm-text-secondary)",
                  backgroundColor: isActive ? "var(--dm-primary-soft)" : "transparent",
                  textDecoration: "none",
                  transition: "all var(--dm-transition-fast)",
                  borderLeft: isActive ? "2px solid var(--dm-primary)" : "2px solid transparent",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Icon
                    size={17}
                    style={{
                      color: isActive ? "var(--dm-primary)" : "var(--dm-text-muted)",
                      transition: "color var(--dm-transition-fast)",
                    }}
                  />
                  <span>{item.name}</span>
                </div>

                {badgeCount > 0 && (
                  <span
                    style={{
                      padding: "1px 7px",
                      borderRadius: "var(--dm-radius-full)",
                      fontSize: "10px",
                      fontWeight: "var(--dm-weight-bold)",
                      backgroundColor: "var(--dm-danger)",
                      color: "#ffffff",
                    }}
                  >
                    {badgeCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* BOTTOM: Settings + User Card */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--dm-space-3)", flexShrink: 0 }}>
        <div style={{ height: "1px", backgroundColor: "var(--dm-border)" }} />

        {/* Bottom Nav Items */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {bottomItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onMobileClose}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px 12px",
                  borderRadius: "var(--dm-radius-sm)",
                  fontSize: "var(--dm-text-xs)",
                  fontWeight: isActive ? "var(--dm-weight-semibold)" : "var(--dm-weight-medium)",
                  color: isActive ? "var(--dm-primary)" : "var(--dm-text-secondary)",
                  backgroundColor: isActive ? "var(--dm-primary-soft)" : "transparent",
                  textDecoration: "none",
                  borderLeft: isActive ? "2px solid var(--dm-primary)" : "2px solid transparent",
                }}
              >
                <Icon size={15} style={{ color: isActive ? "var(--dm-primary)" : "var(--dm-text-muted)" }} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Card */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 10px",
            borderRadius: "var(--dm-radius-sm)",
            backgroundColor: "var(--dm-surface-subtle)",
            border: "1px solid var(--dm-border)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
            {/* Avatar */}
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "var(--dm-radius-full)",
                background: "linear-gradient(135deg, var(--dm-primary), var(--dm-accent-sage))",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
                fontWeight: "var(--dm-weight-bold)",
                flexShrink: 0,
              }}
            >
              {getInitials(user?.name)}
            </div>

            <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              <span
                style={{
                  fontSize: "var(--dm-text-xs)",
                  fontWeight: "var(--dm-weight-semibold)",
                  color: "var(--dm-text-primary)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.name || "Student"}
              </span>
              <span
                style={{
                  fontSize: "10px",
                  color: "var(--dm-text-muted)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.email}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "2px", flexShrink: 0 }}>
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              title="Toggle theme"
              style={{
                background: "none",
                border: "none",
                color: "var(--dm-text-muted)",
                cursor: "pointer",
                padding: "4px",
                borderRadius: "var(--dm-radius-xs)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "color var(--dm-transition-fast)",
              }}
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              title="Sign out"
              style={{
                background: "none",
                border: "none",
                color: "var(--dm-danger)",
                cursor: "pointer",
                padding: "4px",
                borderRadius: "var(--dm-radius-xs)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
