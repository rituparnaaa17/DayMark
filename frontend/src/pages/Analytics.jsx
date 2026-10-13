import React, { useState, useEffect, useMemo } from "react";
import {
  Activity,
  Target,
  Clock3,
  Flame,
  PieChart as PieIcon,
  TrendingUp,
} from "lucide-react";

import { PageHeader } from "../components/common/PageHeader";
import StatCard from "../components/dashboard/StatCard";
import ActivityTrend from "../components/analytics/ActivityTrend";
import CategoryChart from "../components/analytics/CategoryChart";
import GoalAnalytics from "../components/analytics/GoalAnalytics";
import { Tabs } from "../components/common/Tabs";
import EmptyState from "../components/common/EmptyState";

import { useApp } from "../context/AppContext";
import analyticsService from "../services/analyticsService";

function Analytics() {
  const { goals } = useApp();

  const [dateRange, setDateRange] = useState("7d");
  const [loading, setLoading] = useState(true);
  const [trendData, setTrendData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [streak, setStreak] = useState({ current: 0, longest: 0 });

  useEffect(() => {
    let isMounted = true;

    async function fetchAnalytics() {
      setLoading(true);
      try {
        const [trendRes, categoryRes, streakRes] = await Promise.all([
          analyticsService.getActivityTrend({ range: dateRange }),
          analyticsService.getCategoryBreakdown({ range: dateRange }),
          analyticsService.getStreak(),
        ]);

        if (isMounted) {
          const formattedTrend = (trendRes || []).map((t) => ({
            date: new Date(t.date).toLocaleDateString(undefined, {
              weekday: "short",
              month: "numeric",
              day: "numeric",
            }),
            value: t.count,
          }));
          setTrendData(formattedTrend);

          const formattedCategories = (categoryRes || []).map((c) => ({
            name: c.category.charAt(0) + c.category.slice(1).toLowerCase(),
            value: c.count,
            totalDuration: c.totalDuration || 0,
          }));
          setCategoryData(formattedCategories);

          setStreak(streakRes || { current: 0, longest: 0 });
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchAnalytics();
    return () => { isMounted = false; };
  }, [dateRange]);

  // Stats computed from real API range-specific data
  const stats = useMemo(() => {
    const totalActivities = trendData.reduce((sum, d) => sum + (d.value || 0), 0);
    const activeTimeMinutes = categoryData.reduce((sum, c) => sum + (c.totalDuration || 0), 0);

    const goalProgress =
      goals.length > 0
        ? Math.round(
            goals.reduce((total, goal) => {
              const target = Number(goal.targetValue || goal.target || 1);
              const current = Number(goal.currentProgress || goal.current || 0);
              return total + Math.min(100, (current / target) * 100);
            }, 0) / goals.length
          )
        : 0;

    return { totalActivities, activeTimeMinutes, goalProgress };
  }, [trendData, categoryData, goals]);

  const formattedActiveTime =
    stats.activeTimeMinutes >= 60
      ? `${Math.floor(stats.activeTimeMinutes / 60)}h ${stats.activeTimeMinutes % 60}m`
      : `${stats.activeTimeMinutes}m`;

  return (
    <div
      className="dm-animate-fade-in"
      style={{ display: "flex", flexDirection: "column", gap: "var(--dm-space-6)" }}
    >
      {/* Page Header & Range Switcher */}
      <PageHeader
        title="Analytics"
        subtitle="Understand your habits and track long-term academic & wellness consistency."
        actions={
          <Tabs
            tabs={[
              { id: "7d", label: "7 Days" },
              { id: "30d", label: "30 Days" },
              { id: "90d", label: "90 Days" },
            ]}
            activeTab={dateRange}
            onChange={setDateRange}
          />
        }
      />

      {/* Metric Cards — always shows real data from API */}
      <div className="dm-grid-4">
        <StatCard
          title="Total Activities"
          value={loading ? "—" : stats.totalActivities}
          subtitle={`Last ${dateRange}`}
          icon={Activity}
          variant="primary"
        />
        <StatCard
          title="Logged Time"
          value={loading ? "—" : formattedActiveTime}
          subtitle="Active effort tracked"
          icon={Clock3}
          variant="info"
        />
        <StatCard
          title="Goal Completion"
          value={`${stats.goalProgress}%`}
          subtitle="Average across goals"
          icon={Target}
          variant="success"
          progress={stats.goalProgress}
        />
        <StatCard
          title="Streak Record"
          value={`${streak.current}d`}
          subtitle={`Longest: ${streak.longest}d`}
          icon={Flame}
          variant="warning"
        />
      </div>

      {/* Charts — always shown; individual components render "no data" messages when empty */}
      {loading ? (
        <div
          className="dm-card"
          style={{
            padding: "var(--dm-space-10)",
            textAlign: "center",
            color: "var(--dm-text-muted)",
          }}
        >
          Loading analytics...
        </div>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(12, 1fr)",
              gap: "var(--dm-space-5)",
            }}
          >
            <div style={{ gridColumn: "span 8" }} className="dm-card">
              <div className="dm-section-header">
                <h2 className="dm-section-title">
                  <TrendingUp size={18} style={{ color: "var(--dm-primary)" }} />
                  Activity Trend
                </h2>
                <span
                  style={{
                    fontSize: "var(--dm-text-xs)",
                    color: "var(--dm-text-muted)",
                  }}
                >
                  Activities logged per day
                </span>
              </div>
              <ActivityTrend data={trendData} />
            </div>

            <div style={{ gridColumn: "span 4" }} className="dm-card">
              <div className="dm-section-header">
                <h2 className="dm-section-title">
                  <PieIcon size={18} style={{ color: "var(--dm-primary)" }} />
                  Category Breakdown
                </h2>
              </div>
              <CategoryChart data={categoryData} />
            </div>
          </div>

          <div className="dm-card">
            <div className="dm-section-header">
              <h2 className="dm-section-title">Goal Analytics</h2>
            </div>
            {goals.length > 0 ? (
              <GoalAnalytics
                data={goals.map((g) => {
                  const target = Number(g.targetValue || g.target || 1);
                  const current = Number(g.currentProgress || g.current || 0);
                  return {
                    name: g.title,
                    completed: Math.min(100, Math.round((current / target) * 100)),
                    target: 100,
                  };
                })}
              />
            ) : (
              <EmptyState
                icon={Target}
                title="No active goals"
                message="Create goals to analyze target attainment."
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Analytics;
