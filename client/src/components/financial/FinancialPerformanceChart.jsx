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
import AnimateOnScroll from '@/components/AnimateOnScroll';

export default function FinancialPerformanceChart({ data }) {
  if (!data || data.length === 0) return null;

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-[#183964]/10 p-4 rounded-lg shadow-xl">
          <p className="text-[#183964] font-bold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} className="text-sm flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
              <span className="text-[#4b5563] capitalize">{entry.name}:</span>
              <span className="text-[#183964] font-semibold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <AnimateOnScroll delay={0.1}>
      <div className="bg-white border border-[#183964]/5 rounded-2xl p-6 md:p-8 mb-8 hover:border-[#f36c21]/30 transition-colors shadow-sm">
        <h3 className="text-[#183964] text-xl font-bold mb-6">Financial Performance</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis 
                dataKey="year" 
                stroke="#4b5563" 
                tick={{ fill: '#6b7280', fontSize: 12 }} 
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={false}
              />
              <YAxis 
                stroke="#4b5563" 
                tick={{ fill: '#6b7280', fontSize: 12 }} 
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6', opacity: 0.4 }} />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
              />
              {/* Revenue: Brand Blue */}
              <Bar dataKey="revenue" name="Revenue" fill="#183964" radius={[4, 4, 0, 0]} animationDuration={1500} />
              {/* Net Profit: Brand Orange */}
              <Bar dataKey="netProfit" name="Net Profit" fill="#f36c21" radius={[4, 4, 0, 0]} animationDuration={1500} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AnimateOnScroll>
  );
}
