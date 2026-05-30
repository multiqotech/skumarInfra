import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useTheme } from 'next-themes';
import AnimateOnScroll from '@/components/AnimateOnScroll';

export default function FinancialPerformanceChart({ data }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (!data || data.length === 0) return null;

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-[#1a1a1a] border border-black/5 dark:border-white/10 p-4 rounded-lg shadow-xl">
          <p className="text-zinc-900 dark:text-white font-bold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} className="text-sm flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
              <span className="text-zinc-600 dark:text-zinc-300 capitalize">{entry.name}:</span>
              <span className="text-zinc-900 dark:text-white font-semibold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <AnimateOnScroll delay={0.1}>
      <div className="bg-[#FAFAFA] dark:bg-[#18181B] border border-black/5 dark:border-white/10 rounded-2xl p-6 md:p-8 mb-8 hover:border-[#FFB800]/30 dark:hover:border-[#FFB800]/20 transition-colors">
        <h3 className="text-zinc-900 dark:text-white text-xl font-bold mb-6">Financial Performance</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#2A2A2A" : "#e5e7eb"} vertical={false} />
              <XAxis 
                dataKey="year" 
                stroke={isDark ? "#666" : "#4b5563"} 
                tick={{ fill: isDark ? '#888' : '#6b7280', fontSize: 12 }} 
                axisLine={{ stroke: isDark ? '#2A2A2A' : '#e5e7eb' }}
                tickLine={false}
              />
              <YAxis 
                stroke={isDark ? "#666" : "#4b5563"} 
                tick={{ fill: isDark ? '#888' : '#6b7280', fontSize: 12 }} 
                axisLine={{ stroke: isDark ? '#2A2A2A' : '#e5e7eb' }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? '#2A2A2A' : '#f3f4f6', opacity: 0.4 }} />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
              />
              {/* Revenue: Dark Blue */}
              <Bar dataKey="revenue" name="Revenue" fill="#1e3a8a" radius={[4, 4, 0, 0]} animationDuration={1500} />
              {/* Net Profit: Light Blue */}
              <Bar dataKey="netProfit" name="Net Profit" fill="#3b82f6" radius={[4, 4, 0, 0]} animationDuration={1500} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AnimateOnScroll>
  );
}
