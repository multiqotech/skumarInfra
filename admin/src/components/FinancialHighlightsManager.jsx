import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Plus, Trash2, Save } from 'lucide-react';
import { getAuthHeader } from '../utils/api';

export default function FinancialHighlightsManager({ showFeedback }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [overview, setOverview] = useState({ title: "", description: "" });
  const [performance, setPerformance] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [strengths, setStrengths] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/financial-highlights`);
      if (res.data) {
        setOverview(res.data.overview || { title: "", description: "" });
        setPerformance(res.data.financialPerformance || []);
        setMetrics(res.data.metrics || []);
        setStrengths(res.data.strengths || []);
      }
    } catch (err) {
      console.error(err);
      showFeedback("Failed to load financial highlights.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const config = getAuthHeader();
    if (!config) {
      setSaving(false);
      return;
    }

    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/financial-highlights`, {
        overview,
        financialPerformance: performance,
        metrics,
        strengths
      }, config);
      showFeedback("Financial Highlights updated successfully!");
    } catch (err) {
      console.error(err);
      showFeedback("Failed to update financial highlights.", "error");
    } finally {
      setSaving(false);
    }
  };

  // --- Helpers for dynamic arrays ---
  const handleAddPerformance = () => {
    setPerformance([...performance, { year: "", revenue: 0, netProfit: 0 }]);
  };
  const handleRemovePerformance = (index) => {
    const newArr = [...performance];
    newArr.splice(index, 1);
    setPerformance(newArr);
  };
  const handleChangePerformance = (index, field, value) => {
    const newArr = [...performance];
    newArr[index][field] = field === "year" ? value : Number(value);
    setPerformance(newArr);
  };

  const handleAddMetric = () => {
    setMetrics([...metrics, { title: "", value: 0, suffix: "%", description: "" }]);
  };
  const handleRemoveMetric = (index) => {
    const newArr = [...metrics];
    newArr.splice(index, 1);
    setMetrics(newArr);
  };
  const handleChangeMetric = (index, field, value) => {
    const newArr = [...metrics];
    newArr[index][field] = field === "value" ? Number(value) : value;
    setMetrics(newArr);
  };

  const handleAddStrength = () => {
    setStrengths([...strengths, { title: "", description: "" }]);
  };
  const handleRemoveStrength = (index) => {
    const newArr = [...strengths];
    newArr.splice(index, 1);
    setStrengths(newArr);
  };
  const handleChangeStrength = (index, field, value) => {
    const newArr = [...strengths];
    newArr[index][field] = value;
    setStrengths(newArr);
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-yellow)]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-[var(--color-dark-card)] p-4 rounded-xl border border-[var(--color-dark-border)]">
        <h2 className="text-xl font-bold">Manage Financial Highlights</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-[var(--color-yellow)] text-black font-semibold rounded-lg hover:bg-[#e5a600] transition flex items-center gap-2"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save All Changes
        </button>
      </div>

      {/* Overview Section */}
      <div className="bg-[var(--color-dark-card)] rounded-xl border border-[var(--color-dark-border)] overflow-hidden">
        <div className="p-4 border-b border-[var(--color-dark-border)] bg-[#1a1a1a]">
          <h3 className="text-lg font-semibold">1. Overview</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Section Title</label>
            <input
              type="text"
              value={overview.title}
              onChange={(e) => setOverview({ ...overview, title: e.target.value })}
              className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[var(--color-yellow)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              rows="3"
              value={overview.description}
              onChange={(e) => setOverview({ ...overview, description: e.target.value })}
              className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[var(--color-yellow)] resize-none"
            ></textarea>
          </div>
        </div>
      </div>

      {/* Financial Performance Section */}
      <div className="bg-[var(--color-dark-card)] rounded-xl border border-[var(--color-dark-border)] overflow-hidden">
        <div className="p-4 border-b border-[var(--color-dark-border)] bg-[#1a1a1a] flex justify-between items-center">
          <h3 className="text-lg font-semibold">2. Financial Performance (Chart Data)</h3>
          <button onClick={handleAddPerformance} className="flex items-center gap-1 text-sm text-[var(--color-yellow)] hover:underline">
            <Plus className="h-4 w-4" /> Add Year
          </button>
        </div>
        <div className="p-6 space-y-4">
          {performance.map((item, index) => (
            <div key={index} className="flex gap-4 items-end bg-[var(--color-dark)] p-4 rounded-lg border border-[var(--color-dark-border)]">
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">Year (e.g., FY 2021-22)</label>
                <input
                  type="text"
                  value={item.year}
                  onChange={(e) => handleChangePerformance(index, 'year', e.target.value)}
                  className="w-full bg-transparent border-b border-gray-600 px-2 py-1 focus:outline-none focus:border-[var(--color-yellow)]"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">Revenue</label>
                <input
                  type="number"
                  value={item.revenue}
                  onChange={(e) => handleChangePerformance(index, 'revenue', e.target.value)}
                  className="w-full bg-transparent border-b border-gray-600 px-2 py-1 focus:outline-none focus:border-[var(--color-yellow)]"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">Net Profit</label>
                <input
                  type="number"
                  value={item.netProfit}
                  onChange={(e) => handleChangePerformance(index, 'netProfit', e.target.value)}
                  className="w-full bg-transparent border-b border-gray-600 px-2 py-1 focus:outline-none focus:border-[var(--color-yellow)]"
                />
              </div>
              <button onClick={() => handleRemovePerformance(index)} className="text-red-400 hover:text-red-300 p-2">
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
          {performance.length === 0 && <p className="text-gray-500 text-sm">No performance data added.</p>}
        </div>
      </div>

      {/* KPI Metrics Section */}
      <div className="bg-[var(--color-dark-card)] rounded-xl border border-[var(--color-dark-border)] overflow-hidden">
        <div className="p-4 border-b border-[var(--color-dark-border)] bg-[#1a1a1a] flex justify-between items-center">
          <h3 className="text-lg font-semibold">3. KPI Metrics</h3>
          <button onClick={handleAddMetric} className="flex items-center gap-1 text-sm text-[var(--color-yellow)] hover:underline">
            <Plus className="h-4 w-4" /> Add Metric
          </button>
        </div>
        <div className="p-6 space-y-4">
          {metrics.map((item, index) => (
            <div key={index} className="flex flex-col gap-3 bg-[var(--color-dark)] p-4 rounded-lg border border-[var(--color-dark-border)] relative">
              <button onClick={() => handleRemoveMetric(index)} className="absolute top-2 right-2 text-red-400 hover:text-red-300 p-1">
                <Trash2 className="h-4 w-4" />
              </button>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 mb-1">Title</label>
                  <input type="text" value={item.title} onChange={(e) => handleChangeMetric(index, 'title', e.target.value)} className="w-full bg-transparent border-b border-gray-600 px-2 py-1 focus:outline-none focus:border-[var(--color-yellow)]" />
                </div>
                <div className="w-24">
                  <label className="block text-xs text-gray-400 mb-1">Value</label>
                  <input type="number" value={item.value} onChange={(e) => handleChangeMetric(index, 'value', e.target.value)} className="w-full bg-transparent border-b border-gray-600 px-2 py-1 focus:outline-none focus:border-[var(--color-yellow)]" />
                </div>
                <div className="w-24">
                  <label className="block text-xs text-gray-400 mb-1">Suffix</label>
                  <input type="text" value={item.suffix} onChange={(e) => handleChangeMetric(index, 'suffix', e.target.value)} className="w-full bg-transparent border-b border-gray-600 px-2 py-1 focus:outline-none focus:border-[var(--color-yellow)]" placeholder="e.g. %" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Description</label>
                <input type="text" value={item.description} onChange={(e) => handleChangeMetric(index, 'description', e.target.value)} className="w-full bg-transparent border-b border-gray-600 px-2 py-1 focus:outline-none focus:border-[var(--color-yellow)]" />
              </div>
            </div>
          ))}
          {metrics.length === 0 && <p className="text-gray-500 text-sm">No metrics added.</p>}
        </div>
      </div>

      {/* Strengths Section */}
      <div className="bg-[var(--color-dark-card)] rounded-xl border border-[var(--color-dark-border)] overflow-hidden">
        <div className="p-4 border-b border-[var(--color-dark-border)] bg-[#1a1a1a] flex justify-between items-center">
          <h3 className="text-lg font-semibold">4. Key Strengths</h3>
          <button onClick={handleAddStrength} className="flex items-center gap-1 text-sm text-[var(--color-yellow)] hover:underline">
            <Plus className="h-4 w-4" /> Add Strength
          </button>
        </div>
        <div className="p-6 space-y-4">
          {strengths.map((item, index) => (
            <div key={index} className="flex flex-col gap-3 bg-[var(--color-dark)] p-4 rounded-lg border border-[var(--color-dark-border)] relative">
              <button onClick={() => handleRemoveStrength(index)} className="absolute top-2 right-2 text-red-400 hover:text-red-300 p-1">
                <Trash2 className="h-4 w-4" />
              </button>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Title</label>
                <input type="text" value={item.title} onChange={(e) => handleChangeStrength(index, 'title', e.target.value)} className="w-full bg-transparent border-b border-gray-600 px-2 py-1 focus:outline-none focus:border-[var(--color-yellow)]" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Description</label>
                <input type="text" value={item.description} onChange={(e) => handleChangeStrength(index, 'description', e.target.value)} className="w-full bg-transparent border-b border-gray-600 px-2 py-1 focus:outline-none focus:border-[var(--color-yellow)]" />
              </div>
            </div>
          ))}
          {strengths.length === 0 && <p className="text-gray-500 text-sm">No strengths added.</p>}
        </div>
      </div>

    </div>
  );
}
