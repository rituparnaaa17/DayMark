import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Activity,
  Moon,
  Droplets,
  Timer,
  Target,
  Flame,
  ArrowRight,
  Smile,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Calendar,
} from "lucide-react";

import { Button } from "../components/common/Button";
import StatCard from "../components/dashboard/StatCard";
import ActivityChart from "../components/dashboard/ActivityChart";
import GoalProgress from "../components/dashboard/GoalProgress";
import RecentActivities from "../components/dashboard/RecentActivities";
import StreakCard from "../components/dashboard/StreakCard";
import { ProgressBar } from "../components/common/Badge";

import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import dashboardService from "../services/dashboardService";
import wellnessService from "../services/wellnessService";
import hydrationService from "../services/hydrationService";
import focusService from "../services/focusService";
import sleepService from "../services/sleepService";
import { ROUTES } from "../utils/constants";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Good night";
}

const moodEmoji = { VERY_LOW: "😔", LOW: "😕", OKAY: "😐", GOOD: "🙂", GREAT: "😄" };

function Dashboard() {
  const { user } = useAuth();
  const { activities, goals } = useApp();

  const [streak, setStreak] = useState({ current: 0, longest: 0 });
  const [chartData, setChartData] = useState([]);
  const [todayMood, setTodayMood] = useState(null);
  const [hydration, setHydration] = useState(null);
  const [sleepRecord, setSleepRecord] = useState(null);
  const [focusMinutes, setFocusMinutes] = useState(0);

  const fetchDashboardExtras = useCallback(async () => {
    try {
      const [streakData, chart, moodRes, hydrationRes, focusRes, sleepRes] = await Promise.all([
        dashboardService.getStreak(),
        dashboardService.getActivityChart("7d"),
        wellnessService.getTodayCheckIn(),
        hydrationService.getTodayHydration(),
        focusService.getFocusStats({ range: "7d" }),
        sleepService.getSleepRecords({ limit: 1 }),
      ]);
      setStreak(streakData || { current: 0, longest: 0 });
      setChartData(Array.isArray(chart) ? chart : []);
      setTodayMood(moodRes?.data || null);
      setHydration(hydrationRes?.data || null);
      setSleepRecord(sleepRes?.data?.[0] || null);

      const todayStats = focusRes?.data;
      if (todayStats?.trend) {
        const today = new Date().toISOString().split("T")[0];
        const todayData = todayStats.trend.find((d) => d.date === today);
        setFocusMinutes(todayData?.minutes || 0);
      }
    } catch {
      // Silently handle new accounts
    }
  }, []);

  useEffect(() => {
    fetchDashboardExtras();
  }, [fetchDashboardExtras]);

  // Calculated Stats
  const dashboardStats = useMemo(() => {
    const academicTime = activities
      .filter((a) => (a.category || a.activity?.category) === "ACADEMIC")
      .reduce((acc, a) => acc + (Number(a.duration) || 0), 0);

    const exerciseTime = activities
      .filter((a) => (a.category || a.activity?.category) === "HEALTH")
      .reduce((acc, a) => acc + (Number(a.duration) || 0), 0);

    const totalProductiveMinutes = activities.reduce((acc, a) => acc + (Number(a.duration) || 0), 0);

    const goalCompletion =
      goals.length > 0
        ? Math.round(
            goals.reduce((total, goal) => {
              const target = Number(goal.targetValue || goal.target || 1);
              const current = Number(goal.currentProgress || goal.current || 0);
              return total + Math.min(100, (current / target) * 100);
            }, 0) / goals.length
          )
        : 0;

    return { academicTime, exerciseTime, totalProductiveMinutes, goalCompletion };
  }, [activities, goals]);

  const firstName = user?.name?.split(" ")[0] || "Student";

  const formatHoursMinutes = (mins) => {
    if (!mins || mins <= 0) return "0m";
    if (mins >= 60) return `${Math.floor(mins / 60)}h ${mins % 60}m`;
    return `${mins}m`;
  };

  const normalizedGoals = goals.slice(0, 4).map((g) => ({
    id: g.id,
    title: g.title,
    current: g.currentProgress ?? g.current ?? 0,
    target: g.targetValue ?? g.target ?? 1,
    unit: g.unit,
  }));

  return (
    <div className="dm-animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "var(--dm-space-8)" }}>
      {/* EDITORIAL HERO BANNER: Deep Forest Green #173F32 */}
      <div
        style={{
          borderRadius: "20px",
          background: "linear-gradient(135deg, #173F32 0%, #0F2D24 100%)",
          color: "#ffffff",
          padding: "var(--dm-space-8) var(--dm-space-10)",
          boxShadow: "0 12px 32px rgba(23, 63, 50, 0.15)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "rgba(220, 233, 225, 0.18)", color: "#DCE9E1", padding: "4px 12px", borderRadius: "9999px", fontSize: "12px", fontWeight: "600", marginBottom: "12px" }}>
          <Sparkles size={14} />
          <span>Student Wellness Ecosystem</span>
        </div>
        <h1 style={{ fontSize: "var(--dm-text-2xl)", fontWeight: "700", color: "#ffffff", letterSpacing: "-0.03em", lineHeight: "1.2", marginBottom: "8px" }}>
          {getGreeting()}, {firstName}
        </h1>
        <p style={{ fontSize: "var(--dm-text-sm)", color: "rgba(244, 243, 232, 0.82)", lineHeight: "1.6" }}>
          You've logged <strong>{formatHoursMinutes(dashboardStats.totalProductiveMinutes)}</strong> of focus and balance this week. Keep up the steady momentum.
        </p>
      </div>

      {/* ASYMMETRIC METRIC SECTION: Featured Highlight Card + Compact Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "var(--dm-space-5)" }}>
        {/* Featured Left Card: Total Productivity & Goals */}
        <div
          className="dm-card"
          style={{
            gridColumn: "span 4",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: "var(--dm-surface)",
            border: "1px solid var(--dm-border)",
            borderRadius: "16px",
            padding: "var(--dm-space-6)",
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--dm-space-3)" }}>
              <span style={{ fontSize: "var(--dm-text-xs)", fontWeight: "600", color: "var(--dm-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Overall Progress
              </span>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "var(--dm-primary-soft)", color: "var(--dm-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <TrendingUp size={16} />
              </div>
            </div>

            <div style={{ fontSize: "var(--dm-text-3xl)", fontWeight: "700", color: "var(--dm-text-primary)", letterSpacing: "-0.03em" }}>
              {dashboardStats.goalCompletion}%
            </div>
            <p style={{ fontSize: "var(--dm-text-xs)", color: "var(--dm-text-secondary)", marginTop: "4px" }}>
              Average completion rate across all active student goals.
            </p>
          </div>

          <div style={{ marginTop: "var(--dm-space-6)" }}>
            <div className="dm-progress-track" style={{ height: "6px", marginBottom: "8px" }}>
              <div
                style={{
                  height: "100%",
                  width: `${dashboardStats.goalCompletion}%`,
                  backgroundColor: "var(--dm-primary)",
                  borderRadius: "9999px",
                }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--dm-text-muted)" }}>
              <span>0% Target</span>
              <span>{goals.length} Active Goals</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Right Side: 4 Compact SaaS Metric Cards */}
        <div style={{ gridColumn: "span 8", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "var(--dm-space-4)" }}>
          <StatCard
            title="Study & Academic"
            value={formatHoursMinutes(dashboardStats.academicTime)}
            subtitle="Logged focus time"
            icon={BookOpen}
            variant="primary"
          />

          <StatCard
            title="Exercise & Health"
            value={formatHoursMinutes(dashboardStats.exerciseTime)}
            subtitle="Active workout time"
            icon={Activity}
            variant="success"
          />

          <StatCard
            title="Sleep Record"
            value={sleepRecord ? `${sleepRecord.duration}h` : "—"}
            subtitle={sleepRecord?.quality ? `Quality: ${sleepRecord.quality}` : "No sleep record today"}
            icon={Moon}
            variant="warning"
          />

          <StatCard
            title="Hydration Status"
            value={hydration ? `${hydration.total}L` : "0L"}
            subtitle={hydration ? `Goal: ${hydration.target}L` : "Goal: 2L"}
            icon={Droplets}
            variant="info"
            progress={hydration ? Math.min(100, (hydration.total / hydration.target) * 100) : 0}
          />
        </div>
      </div>

      {/* SECTION: Weekly Trend Chart + Goal Breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "var(--dm-space-5)" }}>
        <div style={{ gridColumn: "span 8" }} className="dm-card">
          <div className="dm-section-header">
            <div>
              <h2 className="dm-section-title">Weekly Activity Trends</h2>
              <p style={{ fontSize: "var(--dm-text-xs)", color: "var(--dm-text-muted)", marginTop: "2px" }}>
                Total activities completed day by day
              </p>
            </div>
            <Link to={ROUTES.ANALYTICS} style={{ fontSize: "var(--dm-text-xs)", fontWeight: "600", color: "var(--dm-primary)", display: "flex", alignItems: "center", gap: "4px" }}>
              Analytics <ArrowRight size={12} />
            </Link>
          </div>
          <ActivityChart data={chartData} />
        </div>

        <div style={{ gridColumn: "span 4" }} className="dm-card">
          <div className="dm-section-header">
            <div>
              <h2 className="dm-section-title">Active Goals</h2>
              <p style={{ fontSize: "var(--dm-text-xs)", color: "var(--dm-text-muted)", marginTop: "2px" }}>
                Track your target milestones
              </p>
            </div>
            <Link to={ROUTES.GOALS} style={{ fontSize: "var(--dm-text-xs)", fontWeight: "600", color: "var(--dm-primary)", display: "flex", alignItems: "center", gap: "4px" }}>
              Goals <ArrowRight size={12} />
            </Link>
          </div>
          <GoalProgress goals={normalizedGoals} />
        </div>
      </div>

      {/* SECTION: Refined Daily Progress Indicators */}
      <div className="dm-card">
        <div className="dm-section-header">
          <div>
            <h2 className="dm-section-title">Daily Habit &amp; Wellness Targets</h2>
            <p style={{ fontSize: "var(--dm-text-xs)", color: "var(--dm-text-muted)", marginTop: "2px" }}>
              Real-time completion status for key student habits
            </p>
          </div>
          {todayMood && (
            <span style={{ fontSize: "var(--dm-text-xs)", padding: "4px 10px", borderRadius: "9999px", backgroundColor: "var(--dm-surface-subtle)", border: "1px solid var(--dm-border)", color: "var(--dm-text-primary)" }}>
              Today's Mood: {moodEmoji[todayMood.mood]} <strong>{todayMood.mood}</strong>
            </span>
          )}
        </div>

        <div className="dm-grid-2" style={{ rowGap: "var(--dm-space-5)", columnGap: "var(--dm-space-8)" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--dm-text-xs)", fontWeight: "500", color: "var(--dm-text-primary)", marginBottom: "6px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <BookOpen size={14} style={{ color: "var(--dm-primary)" }} /> Study Goal (2h 00m)
              </span>
              <span>{Math.min(100, Math.round((dashboardStats.academicTime / 120) * 100))}%</span>
            </div>
            <ProgressBar value={dashboardStats.academicTime} max={120} variant="primary" />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--dm-text-xs)", fontWeight: "500", color: "var(--dm-text-primary)", marginBottom: "6px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Droplets size={14} style={{ color: "var(--dm-info)" }} /> Hydration (2.0L Target)
              </span>
              <span>{hydration ? Math.round((hydration.total / hydration.target) * 100) : 0}%</span>
            </div>
            <ProgressBar value={hydration ? hydration.total : 0} max={hydration ? hydration.target : 2} variant="info" />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--dm-text-xs)", fontWeight: "500", color: "var(--dm-text-primary)", marginBottom: "6px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Activity size={14} style={{ color: "var(--dm-success)" }} /> Exercise Goal (30m Target)
              </span>
              <span>{Math.min(100, Math.round((dashboardStats.exerciseTime / 30) * 100))}%</span>
            </div>
            <ProgressBar value={dashboardStats.exerciseTime} max={30} variant="success" />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--dm-text-xs)", fontWeight: "500", color: "var(--dm-text-primary)", marginBottom: "6px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Moon size={14} style={{ color: "var(--dm-warning)" }} /> Sleep Goal (8.0h Target)
              </span>
              <span>{sleepRecord ? Math.min(100, Math.round((sleepRecord.duration / 8) * 100)) : 0}%</span>
            </div>
            <ProgressBar value={sleepRecord ? sleepRecord.duration : 0} max={8} variant="warning" />
          </div>
        </div>
      </div>

      {/* SECTION: Recent Activity Timeline & Streak Widget */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "var(--dm-space-5)" }}>
        <div style={{ gridColumn: "span 8" }} className="dm-card">
          <div className="dm-section-header">
            <div>
              <h2 className="dm-section-title">Recent Activity Log</h2>
              <p style={{ fontSize: "var(--dm-text-xs)", color: "var(--dm-text-muted)", marginTop: "2px" }}>
                Your latest logged study sessions and habits
              </p>
            </div>
            <Link to={ROUTES.ACTIVITIES} style={{ fontSize: "var(--dm-text-xs)", fontWeight: "600", color: "var(--dm-primary)", display: "flex", alignItems: "center", gap: "4px" }}>
              View Log <ArrowRight size={12} />
            </Link>
          </div>
          <RecentActivities activities={activities.slice(0, 5)} />
        </div>

        <div style={{ gridColumn: "span 4", display: "flex", flexDirection: "column", gap: "var(--dm-space-4)" }}>
          <StreakCard currentStreak={streak.current} longestStreak={streak.longest} />

          <div className="dm-card" style={{ padding: "var(--dm-space-5)" }}>
            <h3 style={{ fontSize: "var(--dm-text-sm)", fontWeight: "600", marginBottom: "var(--dm-space-3)", color: "var(--dm-text-primary)" }}>
              Quick Navigation
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--dm-space-2)" }}>
              <Link to={ROUTES.WELLNESS} className="dm-button dm-button-secondary dm-button-sm" style={{ justifyContent: "flex-start", borderRadius: "8px" }}>
                <Smile size={14} style={{ color: "var(--dm-primary)" }} /> Log Mood &amp; Wellness
              </Link>
              <Link to={ROUTES.FOCUS} className="dm-button dm-button-secondary dm-button-sm" style={{ justifyContent: "flex-start", borderRadius: "8px" }}>
                <Timer size={14} style={{ color: "var(--dm-primary)" }} /> Start Focus Session
              </Link>
              <Link to={ROUTES.GOALS} className="dm-button dm-button-secondary dm-button-sm" style={{ justifyContent: "flex-start", borderRadius: "8px" }}>
                <Target size={14} style={{ color: "var(--dm-primary)" }} /> Set New Goal
              </Link>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}

export default Dashboard;
