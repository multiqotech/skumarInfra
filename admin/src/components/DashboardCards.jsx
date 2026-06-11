"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Construction, LayoutDashboard, Newspaper, HelpCircle,
  Users, MessageSquare, Video, Phone, BarChart3, Trophy, Truck,
  Loader2, Briefcase, FileText, UserPlus
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL;

// Safely fetch an array endpoint and return its length
const fetchCount = async (url) => {
  try {
    const res = await axios.get(url);
    if (Array.isArray(res.data)) return res.data.length;
    // Some endpoints return { data: [...] } or paginated { applications: [...], pagination: {...} }
    if (res.data?.applications) return res.data.pagination?.total || res.data.applications.length;
    if (res.data?.candidates) return res.data.pagination?.total || res.data.candidates.length;
    if (res.data?.jobs) return res.data.pagination?.total || res.data.jobs.length;
    if (Array.isArray(res.data?.data)) return res.data.data.length;
    // If it's an object (like settings), it exists
    if (res.data && typeof res.data === "object") return "✓";
    return 0;
  } catch {
    return "—";
  }
};

export default function DashboardCards({ setActiveTab }) {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllCounts = async () => {
      setLoading(true);
      const results = await Promise.allSettled([
        fetchCount(`${API}/api/projects`),
        fetchCount(`${API}/api/categories`),
        fetchCount(`${API}/api/we-are`),
        fetchCount(`${API}/api/news`),
        fetchCount(`${API}/api/faqs`),
        fetchCount(`${API}/api/financial-highlights`),
        fetchCount(`${API}/api/investors`),
        fetchCount(`${API}/api/board-directors`),
        fetchCount(`${API}/api/team`),
        fetchCount(`${API}/api/testimonials`),
        fetchCount(`${API}/api/settings/video`),
        fetchCount(`${API}/api/contact-info`),
        fetchCount(`${API}/api/settings/stats`),
        fetchCount(`${API}/api/plant-machinery`),
        // Career endpoints
        fetchCount(`${API}/api/career/admin/jobs`),
        fetchCount(`${API}/api/career/admin/applications`),
        fetchCount(`${API}/api/career/admin/candidates`),
      ]);

      const keys = [
        "projects", "categories", "weAre", "news", "faqs",
        "financial", "investors", "boardDirectors", "team",
        "testimonials", "video", "contactInfo", "stats", "plantMachinery",
        "jobs", "applications", "candidates"
      ];

      const newCounts = {};
      keys.forEach((key, i) => {
        newCounts[key] = results[i].status === "fulfilled" ? results[i].value : "—";
      });

      setCounts(newCounts);
      setLoading(false);
    };

    fetchAllCounts();
  }, []);

  const cards = [
    // Content
    { key: "projects", label: "Projects", desc: "We Build portfolio", icon: Construction, tab: "projects", color: "bg-blue-500/10", iconColor: "text-blue-500" },
    { key: "categories", label: "Categories", desc: "We Build categories", icon: LayoutDashboard, tab: "categories", color: "bg-indigo-500/10", iconColor: "text-indigo-500" },
    { key: "weAre", label: "We Are Pages", desc: "Corporate info pages", icon: LayoutDashboard, tab: "we-are", color: "bg-purple-500/10", iconColor: "text-purple-500" },
    { key: "news", label: "Newsroom", desc: "Press releases & media", icon: Newspaper, tab: "newsroom", color: "bg-pink-500/10", iconColor: "text-pink-500" },
    // Careers
    { key: "jobs", label: "Jobs", desc: "Active job postings", icon: Briefcase, tab: "career-jobs", color: "bg-emerald-500/10", iconColor: "text-emerald-500" },
    { key: "applications", label: "Applications", desc: "Total applications", icon: FileText, tab: "career-applications", color: "bg-teal-500/10", iconColor: "text-teal-500" },
    { key: "candidates", label: "Candidates", desc: "Registered candidates", icon: UserPlus, tab: "career-candidates", color: "bg-cyan-500/10", iconColor: "text-cyan-500" },
    // Company Info
    { key: "faqs", label: "FAQs", desc: "Frequently asked questions", icon: HelpCircle, tab: "faqs", color: "bg-amber-500/10", iconColor: "text-amber-500" },
    { key: "financial", label: "Financial Highlights", desc: "Financial stats & charts", icon: BarChart3, tab: "financial-highlights", color: "bg-orange-500/10", iconColor: "text-orange-500" },
    { key: "investors", label: "Investors", desc: "Investors section", icon: Users, tab: "investors", color: "bg-sky-500/10", iconColor: "text-sky-500" },
    { key: "boardDirectors", label: "Board of Directors", desc: "Board members", icon: Users, tab: "board-directors", color: "bg-violet-500/10", iconColor: "text-violet-500" },
    { key: "team", label: "Team", desc: "Team members", icon: Users, tab: "team", color: "bg-fuchsia-500/10", iconColor: "text-fuchsia-500" },
    { key: "plantMachinery", label: "Plant & Machinery", desc: "Equipment & machinery", icon: Truck, tab: "plant-machinery", color: "bg-lime-500/10", iconColor: "text-lime-600" },
    { key: "testimonials", label: "Testimonials", desc: "Client reviews", icon: MessageSquare, tab: "testimonials", color: "bg-rose-500/10", iconColor: "text-rose-500" },
    { key: "video", label: "Video Showcase", desc: "Homepage showcase video", icon: Video, tab: "video", color: "bg-red-500/10", iconColor: "text-red-500" },
    { key: "contactInfo", label: "Contact Info", desc: "Footer contact details", icon: Phone, tab: "contact-info", color: "bg-green-500/10", iconColor: "text-green-500" },
    { key: "stats", label: "Company Stats", desc: "Statistics banner values", icon: Trophy, tab: "stats", color: "bg-yellow-500/10", iconColor: "text-yellow-600" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {cards.map((card) => {
        const Icon = card.icon;
        const count = counts[card.key];
        const isNumeric = typeof count === "number";

        return (
          <button
            key={card.key}
            onClick={() => setActiveTab(card.tab)}
            className="group bg-white p-5 rounded-2xl border border-[#183964]/5 shadow-sm hover:shadow-lg hover:border-[#f36c21]/30 transition-all duration-300 text-left hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`h-11 w-11 ${card.color} rounded-xl flex items-center justify-center`}>
                <Icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
              {loading ? (
                <Loader2 className="h-4 w-4 text-[#6b7280] animate-spin" />
              ) : (
                <span className={`text-2xl font-bold ${isNumeric && count > 0 ? "text-[#183964]" : "text-[#6b7280]"}`}>
                  {count}
                </span>
              )}
            </div>
            <h3 className="text-sm font-bold text-[#183964] mb-0.5 group-hover:text-[#f36c21] transition-colors">
              {card.label}
            </h3>
            <p className="text-xs text-[#6b7280]">{card.desc}</p>
          </button>
        );
      })}
    </div>
  );
}
