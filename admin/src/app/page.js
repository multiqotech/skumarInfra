"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  LogOut, LayoutDashboard, Settings, Loader2, Check, X,
  HelpCircle, Users, MessageSquare, Video, Construction
} from "lucide-react";
import axios from "axios";
import FaqManager from "../components/FaqManager";
import TeamManager from "../components/TeamManager";
import TestimonialManager from "../components/TestimonialManager";
import VideoManager from "../components/VideoManager";
import ProjectManager from "../components/ProjectManager";
import WeAreManager from "../components/WeAreManager";
import NewsroomManager from "../components/NewsroomManager";
import ContactInfoManager from "../components/ContactInfoManager";
import CareerDashboard from "../components/career/CareerDashboard";
import JobManager from "../components/career/JobManager";
import ApplicationManager from "../components/career/ApplicationManager";
import CandidateManager from "../components/career/CandidateManager";
import { Newspaper, Phone, Briefcase, FileText, UserPlus, BarChart3 } from "lucide-react";

export default function Dashboard() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, faqs, team, testimonials, video, projects, we-are
  const router = useRouter();

  const [message, setMessage] = useState({ text: "", type: "" }); // success / error
  const [cloudinaryConfigured, setCloudinaryConfigured] = useState(true);

  useEffect(() => {
    const adminInfo = localStorage.getItem("adminInfo");
    if (!adminInfo) {
      router.push("/login");
    } else {
      setAdmin(JSON.parse(adminInfo));
      setLoading(false);
      checkCloudinaryStatus();
    }
  }, [router]);

  const checkCloudinaryStatus = async () => {
    try {
      const cloudinaryRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/cloudinary-status`).catch(() => null);
      if (cloudinaryRes && cloudinaryRes.data) {
        setCloudinaryConfigured(cloudinaryRes.data.configured);
      }
    } catch (error) {
      console.error("Error fetching cloudinary status:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminInfo");
    router.push("/login");
  };

  const showFeedback = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-dark)] flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-[var(--color-yellow)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-dark)] flex flex-col md:flex-row">
      
      {/* Feedback Banner */}
      {message.text && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border transition-all animate-bounce ${
          message.type === "error" 
            ? "bg-red-500/10 border-red-500 text-red-400" 
            : "bg-green-500/10 border-green-500 text-green-400"
        }`}>
          {message.type === "error" ? <X className="h-5 w-5" /> : <Check className="h-5 w-5" />}
          <span className="font-medium text-sm">{message.text}</span>
        </div>
      )}

      {/* Cloudinary Not Configured Warning */}
      {!cloudinaryConfigured && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-orange-500 bg-orange-500/10 text-orange-400 max-w-lg">
          <Settings className="h-5 w-5 flex-shrink-0" />
          <div>
            <p className="font-bold text-sm">Cloudinary Not Configured</p>
            <p className="text-xs text-orange-300/80">Image uploads will fail. Add your real CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to server/.env and restart the server.</p>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[var(--color-dark-card)] border-r border-[var(--color-dark-border)] flex flex-col hidden md:flex min-h-screen relative z-10">
        <div className="p-6 border-b border-[var(--color-dark-border)]">
          <h1 className="text-2xl font-bold text-white tracking-wider" style={{ fontFamily: 'var(--font-heading)' }}>
            SK <span className="text-[var(--color-yellow)]">ADMIN</span>
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "projects", label: "We Build (Projects)", icon: Construction },
            { id: "we-are", label: "We Are (Pages)", icon: LayoutDashboard },
            { id: "newsroom", label: "Newsroom", icon: Newspaper },
            { id: "career-dashboard", label: "Career Dashboard", icon: BarChart3 },
            { id: "career-jobs", label: "Career Jobs", icon: Briefcase },
            { id: "career-applications", label: "Career Applications", icon: FileText },
            { id: "career-candidates", label: "Career Candidates", icon: UserPlus },
            { id: "contact-info", label: "Contact Info", icon: Phone },
            { id: "faqs", label: "FAQs", icon: HelpCircle },
            { id: "team", label: "Team", icon: Users },
            { id: "testimonials", label: "Testimonials", icon: MessageSquare },
            { id: "video", label: "Video Showcase", icon: Video },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id 
                    ? "bg-[var(--color-yellow)] text-black font-semibold shadow-[0_0_15px_rgba(255,184,0,0.2)]" 
                    : "text-gray-400 hover:bg-[var(--color-dark)] hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[var(--color-dark-border)]">
          <div className="mb-4 px-4 py-3 bg-[var(--color-dark)] rounded-xl border border-[var(--color-dark-border)]">
            <p className="text-sm text-gray-400">Logged in as</p>
            <p className="font-semibold text-white truncate">{admin?.email}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl transition-colors font-medium"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 max-h-screen overflow-y-auto">
        <div className="p-6 md:p-10 max-w-6xl mx-auto pb-24">
          
          <header className="mb-10 flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2 capitalize" style={{ fontFamily: 'var(--font-heading)' }}>
                {activeTab === "dashboard" ? "Welcome Back" : activeTab.replace("-", " ")}
              </h2>
              <p className="text-gray-400">
                {activeTab === "dashboard" 
                  ? "Manage your website content efficiently." 
                  : `Update and manage your website's ${activeTab.replace("-", " ")}.`}
              </p>
            </div>
          </header>

          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-[var(--color-dark-card)] p-6 rounded-2xl border border-[var(--color-dark-border)] shadow-lg hover:border-[var(--color-yellow)]/50 transition-colors">
                <div className="h-12 w-12 bg-[#FFB800]/10 rounded-xl flex items-center justify-center mb-4">
                  <Construction className="h-6 w-6 text-[var(--color-yellow)]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Projects</h3>
                <p className="text-sm text-gray-400">Manage 'We Build' portfolio.</p>
              </div>
              <div className="bg-[var(--color-dark-card)] p-6 rounded-2xl border border-[var(--color-dark-border)] shadow-lg hover:border-[var(--color-yellow)]/50 transition-colors">
                <div className="h-12 w-12 bg-[#FFB800]/10 rounded-xl flex items-center justify-center mb-4">
                  <LayoutDashboard className="h-6 w-6 text-[var(--color-yellow)]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">We Are Pages</h3>
                <p className="text-sm text-gray-400">Manage corporate info pages.</p>
              </div>
              <div className="bg-[var(--color-dark-card)] p-6 rounded-2xl border border-[var(--color-dark-border)] shadow-lg hover:border-[var(--color-yellow)]/50 transition-colors">
                <div className="h-12 w-12 bg-[#FFB800]/10 rounded-xl flex items-center justify-center mb-4">
                  <Newspaper className="h-6 w-6 text-[var(--color-yellow)]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Newsroom</h3>
                <p className="text-sm text-gray-400">Manage press releases and media.</p>
              </div>
              <div className="bg-[var(--color-dark-card)] p-6 rounded-2xl border border-[var(--color-dark-border)] shadow-lg hover:border-[var(--color-yellow)]/50 transition-colors">
                <div className="h-12 w-12 bg-[#FFB800]/10 rounded-xl flex items-center justify-center mb-4">
                  <HelpCircle className="h-6 w-6 text-[var(--color-yellow)]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">FAQs</h3>
                <p className="text-sm text-gray-400">Manage frequently asked questions.</p>
              </div>
              <div className="bg-[var(--color-dark-card)] p-6 rounded-2xl border border-[var(--color-dark-border)] shadow-lg hover:border-[var(--color-yellow)]/50 transition-colors">
                <div className="h-12 w-12 bg-[#FFB800]/10 rounded-xl flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-[var(--color-yellow)]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Team</h3>
                <p className="text-sm text-gray-400">Manage your building team.</p>
              </div>
              <div className="bg-[var(--color-dark-card)] p-6 rounded-2xl border border-[var(--color-dark-border)] shadow-lg hover:border-[var(--color-yellow)]/50 transition-colors">
                <div className="h-12 w-12 bg-[#FFB800]/10 rounded-xl flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-[var(--color-yellow)]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Testimonials</h3>
                <p className="text-sm text-gray-400">Manage client reviews.</p>
              </div>
              <div className="bg-[var(--color-dark-card)] p-6 rounded-2xl border border-[var(--color-dark-border)] shadow-lg hover:border-[var(--color-yellow)]/50 transition-colors">
                <div className="h-12 w-12 bg-[#FFB800]/10 rounded-xl flex items-center justify-center mb-4">
                  <Video className="h-6 w-6 text-[var(--color-yellow)]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Video</h3>
                <p className="text-sm text-gray-400">Update homepage showcase video.</p>
              </div>
              <div className="bg-[var(--color-dark-card)] p-6 rounded-2xl border border-[var(--color-dark-border)] shadow-lg hover:border-[var(--color-yellow)]/50 transition-colors">
                <div className="h-12 w-12 bg-[#FFB800]/10 rounded-xl flex items-center justify-center mb-4">
                  <Phone className="h-6 w-6 text-[var(--color-yellow)]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Contact Info</h3>
                <p className="text-sm text-gray-400">Manage footer contact details.</p>
              </div>
            </div>
          )}

          {activeTab === "faqs" && <FaqManager showFeedback={showFeedback} />}
          {activeTab === "team" && <TeamManager showFeedback={showFeedback} />}
          {activeTab === "testimonials" && <TestimonialManager showFeedback={showFeedback} />}
          { activeTab === "video" && <VideoManager showFeedback={showFeedback} /> }
          { activeTab === "projects" && <ProjectManager showFeedback={showFeedback} /> }
          { activeTab === "we-are" && <WeAreManager showFeedback={showFeedback} /> }
          { activeTab === "newsroom" && <NewsroomManager showFeedback={showFeedback} /> }
          { activeTab === "contact-info" && <ContactInfoManager showFeedback={showFeedback} /> }
          
          { activeTab === "career-dashboard" && <CareerDashboard showFeedback={showFeedback} /> }
          { activeTab === "career-jobs" && <JobManager showFeedback={showFeedback} /> }
          { activeTab === "career-applications" && <ApplicationManager showFeedback={showFeedback} /> }
          { activeTab === "career-candidates" && <CandidateManager showFeedback={showFeedback} /> }

        </div>
      </main>

    </div>
  );
}
