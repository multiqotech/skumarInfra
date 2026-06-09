import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Landmark, Trophy, Users, Calendar, MapPin, IndianRupee, Briefcase, Clock } from 'lucide-react';
import { getAuthHeader } from '../utils/api';

export default function StatsManager({ showFeedback }) {
  const [stats, setStats] = useState({
    projectValue: "₹650Cr+",
    completedProjects: "14",
    ongoingProjects: "5",
    indianStates: "7"
  });
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/stats`);
      if (res.data && res.data.value) {
        try {
          const parsed = JSON.parse(res.data.value);
          setStats({
            projectValue: parsed.projectValue || "₹650Cr+",
            completedProjects: parsed.completedProjects || "14",
            ongoingProjects: parsed.ongoingProjects || "5",
            indianStates: parsed.indianStates || "7"
          });
        } catch (e) {
          console.error("Error parsing stats JSON", e);
        }
      }
    } catch (err) {
      console.log("Stats setting not found, using defaults", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    const config = getAuthHeader();
    if (!config) return;

    try {
      const stringifiedValue = JSON.stringify(stats);
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/settings/stats`,
        { value: stringifiedValue },
        config
      );
      showFeedback("Company Statistics updated successfully!");
    } catch (err) {
      showFeedback("Error updating company statistics", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setStats(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-[var(--color-dark-card)] rounded-xl border border-[var(--color-dark-border)] overflow-hidden">
        <div className="p-6 border-b border-[var(--color-dark-border)] bg-[#f7f9fc]">
          <h3 className="text-lg font-semibold text-[#183964]">Company Statistics Manager</h3>
          <p className="text-sm text-[#6b7280] mt-1">Update the values shown in the stats banner on the homepage.</p>
        </div>
        
        {loading ? (
          <div className="p-12 flex justify-center text-[#6b7280]">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--color-yellow)]" />
          </div>
        ) : (
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Total Project Value */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-[#4b5563]">
                    <IndianRupee className="h-4 w-4 text-[var(--color-yellow)]" />
                    Total Project Value
                  </label>
                  <input
                    type="text"
                    required
                    value={stats.projectValue}
                    onChange={(e) => handleChange("projectValue", e.target.value)}
                    className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded-lg px-4 py-2.5 text-[#183964] focus:outline-none focus:border-[var(--color-yellow)]"
                    placeholder="e.g. ₹650Cr+"
                  />
                  <p className="text-xs text-[#6b7280]">Value to display (include '₹' and suffix like 'Cr+' if needed).</p>
                </div>

                {/* Completed Projects */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-[#4b5563]">
                    <Briefcase className="h-4 w-4 text-[var(--color-yellow)]" />
                    Completed Projects
                  </label>
                  <input
                    type="text"
                    required
                    value={stats.completedProjects}
                    onChange={(e) => handleChange("completedProjects", e.target.value)}
                    className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded-lg px-4 py-2.5 text-[#183964] focus:outline-none focus:border-[var(--color-yellow)]"
                    placeholder="e.g. 14"
                  />
                  <p className="text-xs text-[#6b7280]">Value to display (include '+' or suffix if needed).</p>
                </div>

                {/* Ongoing Projects */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-[#4b5563]">
                    <Clock className="h-4 w-4 text-[var(--color-yellow)]" />
                    Ongoing Projects
                  </label>
                  <input
                    type="text"
                    required
                    value={stats.ongoingProjects}
                    onChange={(e) => handleChange("ongoingProjects", e.target.value)}
                    className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded-lg px-4 py-2.5 text-[#183964] focus:outline-none focus:border-[var(--color-yellow)]"
                    placeholder="e.g. 5"
                  />
                  <p className="text-xs text-[#6b7280]">Value to display (include '+' or suffix if needed).</p>
                </div>

                {/* Indian States */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-[#4b5563]">
                    <MapPin className="h-4 w-4 text-[var(--color-yellow)]" />
                    Indian States
                  </label>
                  <input
                    type="text"
                    required
                    value={stats.indianStates}
                    onChange={(e) => handleChange("indianStates", e.target.value)}
                    className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded-lg px-4 py-2.5 text-[#183964] focus:outline-none focus:border-[var(--color-yellow)]"
                    placeholder="e.g. 7"
                  />
                  <p className="text-xs text-[#6b7280]">Value to display (include '+' or suffix if needed).</p>
                </div>

              </div>

              <div className="flex justify-end pt-4 border-t border-[var(--color-dark-border)]">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-6 py-2.5 bg-[var(--color-yellow)] text-white font-semibold rounded-lg hover:bg-[#e5a600] disabled:opacity-50 min-w-[150px] flex justify-center items-center gap-2 transition-all shadow-[0_0_15px_rgba(255,184,0,0.1)] hover:shadow-[0_0_20px_rgba(255,184,0,0.2)]"
                >
                  {formLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Statistics"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
