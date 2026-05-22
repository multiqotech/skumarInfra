'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart3, Briefcase, Users, FileText, TrendingUp } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function CareerDashboard({ showFeedback }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { getAuthHeader } = require('@/utils/api');
      const config = getAuthHeader();
      if (!config) return;

      const res = await axios.get(`${API}/api/career/admin/analytics`, config);
      setAnalytics(res.data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Career Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[var(--color-dark-card)] p-6 rounded-2xl border border-[var(--color-dark-border)] animate-pulse">
              <div className="h-4 w-20 bg-gray-700 rounded mb-4" />
              <div className="h-8 w-16 bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Failed to load analytics. Make sure the server is running.</p>
      </div>
    );
  }

  const { cards, statusBreakdown, departmentBreakdown, monthlyApplications } = analytics;

  const statCards = [
    { label: 'Total Jobs', value: cards.totalJobs, icon: Briefcase, color: '#FFB800' },
    { label: 'Open Positions', value: cards.publishedJobs, icon: FileText, color: '#22C55E' },
    { label: 'Applications', value: cards.totalApplications, icon: Users, color: '#3B82F6' },
    { label: 'Conversion', value: `${cards.conversionRate}%`, icon: TrendingUp, color: '#A855F7' },
  ];

  const statusColors = {
    Applied: '#3B82F6',
    Reviewing: '#F59E0B',
    Shortlisted: '#8B5CF6',
    Interview: '#06B6D4',
    Selected: '#22C55E',
    Rejected: '#EF4444',
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <BarChart3 className="w-7 h-7 text-[#FFB800]" />
          Career Analytics
        </h2>
        <button
          onClick={fetchAnalytics}
          className="px-4 py-2 bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] text-gray-300 rounded-lg hover:border-[#FFB800]/50 transition-colors text-sm"
        >
          Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-[var(--color-dark-card)] p-6 rounded-2xl border border-[var(--color-dark-border)] hover:border-opacity-60 transition-all"
            style={{ borderColor: `${card.color}30` }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400">{card.label}</span>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${card.color}15` }}
              >
                <card.icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hiring Funnel */}
        <div className="bg-[var(--color-dark-card)] p-6 rounded-2xl border border-[var(--color-dark-border)]">
          <h3 className="text-lg font-semibold text-white mb-6">Hiring Funnel</h3>
          <div className="space-y-3">
            {statusBreakdown.map((item) => {
              const maxCount = Math.max(...statusBreakdown.map((s) => s.count), 1);
              const pct = (item.count / maxCount) * 100;
              return (
                <div key={item._id} className="flex items-center gap-3">
                  <span className="text-sm text-gray-400 w-24 shrink-0">{item._id}</span>
                  <div className="flex-1 h-8 bg-[#1a1a1a] rounded-lg overflow-hidden">
                    <div
                      className="h-full rounded-lg flex items-center px-3 transition-all duration-500"
                      style={{
                        width: `${Math.max(pct, 8)}%`,
                        backgroundColor: statusColors[item._id] || '#666',
                      }}
                    >
                      <span className="text-xs font-semibold text-white">{item.count}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            {statusBreakdown.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">No applications yet</p>
            )}
          </div>
        </div>

        {/* Department Breakdown */}
        <div className="bg-[var(--color-dark-card)] p-6 rounded-2xl border border-[var(--color-dark-border)]">
          <h3 className="text-lg font-semibold text-white mb-6">Top Departments</h3>
          <div className="space-y-3">
            {departmentBreakdown.map((item, idx) => {
              const maxCount = Math.max(...departmentBreakdown.map((d) => d.count), 1);
              const pct = (item.count / maxCount) * 100;
              const colors = ['#FFB800', '#3B82F6', '#22C55E', '#A855F7', '#EF4444', '#06B6D4', '#F59E0B', '#EC4899', '#14B8A6', '#6366F1'];
              return (
                <div key={item._id} className="flex items-center gap-3">
                  <span className="text-sm text-gray-400 w-32 shrink-0 truncate">{item._id}</span>
                  <div className="flex-1 h-7 bg-[#1a1a1a] rounded-lg overflow-hidden">
                    <div
                      className="h-full rounded-lg flex items-center px-3 transition-all duration-500"
                      style={{
                        width: `${Math.max(pct, 10)}%`,
                        backgroundColor: colors[idx % colors.length],
                      }}
                    >
                      <span className="text-xs font-semibold text-white">{item.count}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            {departmentBreakdown.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">No data yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Monthly Applications */}
      <div className="bg-[var(--color-dark-card)] p-6 rounded-2xl border border-[var(--color-dark-border)]">
        <h3 className="text-lg font-semibold text-white mb-6">Applications Over Time</h3>
        {monthlyApplications.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">No application data yet</p>
        ) : (
          <div className="flex items-end gap-2 h-48">
            {monthlyApplications.map((item, idx) => {
              const maxCount = Math.max(...monthlyApplications.map((m) => m.count), 1);
              const heightPct = (item.count / maxCount) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-semibold text-white">{item.count}</span>
                  <div
                    className="w-full rounded-t-lg transition-all duration-500"
                    style={{
                      height: `${Math.max(heightPct, 5)}%`,
                      backgroundColor: '#FFB800',
                      opacity: 0.7 + (idx / monthlyApplications.length) * 0.3,
                    }}
                  />
                  <span className="text-xs text-gray-500">
                    {months[item._id.month - 1]}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
