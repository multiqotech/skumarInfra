"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  LogOut, LayoutDashboard, Settings, Loader2, Check, X,
  HelpCircle, Users, MessageSquare, Video, Construction,
  Newspaper, Phone, Briefcase, FileText, UserPlus, BarChart3, Trophy, Truck
} from "lucide-react";
import axios from "axios";
import FaqManager from "../components/FaqManager";
import TeamManager from "../components/TeamManager";
import TestimonialManager from "../components/TestimonialManager";
import BoardDirectorManager from "../components/BoardDirectorManager";
import InvestorManager from "../components/InvestorManager";
import PlantMachineryManager from "../components/PlantMachineryManager";
import FinancialHighlightsManager from "../components/FinancialHighlightsManager";
import VideoManager from "../components/VideoManager";
import ProjectManager from "../components/ProjectManager";
import CategoryManager from "../components/CategoryManager";
import WeAreManager from "../components/WeAreManager";
import NewsroomManager from "../components/NewsroomManager";
import ContactInfoManager from "../components/ContactInfoManager";
import SubsidiaryManager from "../components/SubsidiaryManager";
import CareerDashboard from "../components/career/CareerDashboard";
import JobManager from "../components/career/JobManager";
import ApplicationManager from "../components/career/ApplicationManager";
import CandidateManager from "../components/career/CandidateManager";
import StatsManager from "../components/StatsManager";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const { admin, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, faqs, team, testimonials, video, projects, we-are
  const router = useRouter();

  const [message, setMessage] = useState({ text: "", type: "" }); // success / error
  const [cloudinaryConfigured, setCloudinaryConfigured] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!admin) {
        router.push("/login");
      } else {
        checkCloudinaryStatus();
      }
    }
  }, [admin, loading, router]);

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
    logout();
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
    <div className="h-screen w-full overflow-hidden bg-[#f7f9fc] flex flex-col md:flex-row">
      
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
      <aside className="w-full md:w-72 bg-[#f7f9fc] border-r border-white/5 flex flex-col hidden md:flex h-screen relative z-10 shadow-2xl">
        <div className="p-6 border-b border-[#183964]/5 flex items-center justify-center">
          <img src="/logo.png" alt="S Kumar Infracons" className="h-[50px] w-auto object-contain" />
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-hide">
          <div className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-3 px-3">Main</div>
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                  activeTab === item.id 
                    ? "bg-[#183964]/10 text-[#183964] shadow-sm ring-1 ring-white/10" 
                    : "text-[#4b5563] hover:bg-[#183964]/5 hover:text-zinc-200"
                }`}
              >
                <Icon className={`h-4 w-4 ${activeTab === item.id ? "text-[#f36c21]" : "text-[#6b7280]"}`} />
                {item.label}
              </button>
            );
          })}

          <div className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mt-8 mb-3 px-3">Content</div>
          {[
            { id: "categories", label: "Categories", icon: LayoutDashboard },
            { id: "projects", label: "Projects", icon: Construction },
            { id: "we-are", label: "Pages", icon: LayoutDashboard },
            { id: "newsroom", label: "Newsroom", icon: Newspaper },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                  activeTab === item.id 
                    ? "bg-[#183964]/10 text-[#183964] shadow-sm ring-1 ring-white/10" 
                    : "text-[#4b5563] hover:bg-[#183964]/5 hover:text-[#f36c21]"
                }`}
              >
                <Icon className={`h-4 w-4 ${activeTab === item.id ? "text-[#f36c21]" : "text-[#6b7280]"}`} />
                {item.label}
              </button>
            );
          })}

          <div className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mt-8 mb-3 px-3">Careers</div>
          {[
            { id: "career-dashboard", label: "Overview", icon: BarChart3 },
            { id: "career-jobs", label: "Jobs", icon: Briefcase },
            { id: "career-applications", label: "Applications", icon: FileText },
            { id: "career-candidates", label: "Candidates", icon: UserPlus },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                  activeTab === item.id 
                    ? "bg-[#183964]/10 text-[#183964] shadow-sm ring-1 ring-white/10" 
                    : "text-[#4b5563] hover:bg-[#183964]/5 hover:text-[#f36c21]"
                }`}
              >
                <Icon className={`h-4 w-4 ${activeTab === item.id ? "text-[#f36c21]" : "text-[#6b7280]"}`} />
                {item.label}
              </button>
            );
          })}

          <div className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mt-8 mb-3 px-3">Company Info</div>
          {[
            { id: "contact-info", label: "Contact Info", icon: Phone },
            { id: "plant-machinery", label: "Plants & Machinery", icon: Truck },
            { id: "faqs", label: "FAQs", icon: HelpCircle },
            { id: "financial-highlights", label: "Financial Highlights", icon: BarChart3 },
            { id: "investors", label: "Investors", icon: Users },
            { id: "board-directors", label: "Board of Directors", icon: Users },
            { id: "team", label: "Team", icon: Users },
            { id: "subsidiary", label: "Our Subsidiary", icon: Users },
            { id: "testimonials", label: "Testimonials", icon: MessageSquare },
            { id: "video", label: "Video Showcase", icon: Video },
            { id: "stats", label: "Company Stats", icon: Trophy },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                  activeTab === item.id 
                    ? "bg-[#183964]/10 text-[#183964] shadow-sm ring-1 ring-white/10" 
                    : "text-[#4b5563] hover:bg-[#183964]/5 hover:text-[#f36c21]"
                }`}
              >
                <Icon className={`h-4 w-4 ${activeTab === item.id ? "text-[#f36c21]" : "text-[#6b7280]"}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative h-screen overflow-hidden bg-[#f7f9fc]">
        
        {/* Topbar */}
        <header className="h-[72px] bg-[#f7f9fc]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 shrink-0 z-20 sticky top-0">
          <div className="flex items-center gap-4">
            <div className="text-[#4b5563] text-sm font-medium uppercase tracking-wider">
              {activeTab.replace(/-/g, ' ')}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-[#183964]/5 ring-1 ring-white/10">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-500" />
              <span className="text-sm font-medium text-[#4b5563]">Admin</span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-[#4b5563] hover:text-[#183964] hover:bg-[#183964]/5 rounded-lg transition-colors flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium hidden sm:block">Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="max-w-7xl mx-auto p-6 md:p-10 pb-24">
          
          <header className="mb-10 flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold text-[#183964] mb-2 capitalize" style={{ fontFamily: 'var(--font-heading)' }}>
                {activeTab === "dashboard" ? "Welcome Back" : activeTab.replace("-", " ")}
              </h2>
              <p className="text-[#6b7280]">
                {activeTab === "dashboard" 
                  ? "Manage your website content efficiently." 
                  : `Update and manage your website's ${activeTab.replace("-", " ")}.`}
              </p>
            </div>
          </header>

          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-[var(--color-dark-card)] p-6 rounded-2xl border border-[var(--color-dark-border)] shadow-lg hover:border-[var(--color-yellow)]/50 transition-colors">
                <div className="h-12 w-12 bg-[#f36c21]/10 rounded-xl flex items-center justify-center mb-4">
                  <Construction className="h-6 w-6 text-[var(--color-yellow)]" />
                </div>
                <h3 className="text-xl font-bold text-[#183964] mb-1">Projects</h3>
                <p className="text-sm text-[#6b7280]">Manage 'We Build' portfolio.</p>
              </div>
              <div className="bg-[var(--color-dark-card)] p-6 rounded-2xl border border-[var(--color-dark-border)] shadow-lg hover:border-[var(--color-yellow)]/50 transition-colors">
                <div className="h-12 w-12 bg-[#f36c21]/10 rounded-xl flex items-center justify-center mb-4">
                  <LayoutDashboard className="h-6 w-6 text-[var(--color-yellow)]" />
                </div>
                <h3 className="text-xl font-bold text-[#183964] mb-1">Categories</h3>
                <p className="text-sm text-[#6b7280]">Manage 'We Build' categories.</p>
              </div>
              <div className="bg-[var(--color-dark-card)] p-6 rounded-2xl border border-[var(--color-dark-border)] shadow-lg hover:border-[var(--color-yellow)]/50 transition-colors">
                <div className="h-12 w-12 bg-[#f36c21]/10 rounded-xl flex items-center justify-center mb-4">
                  <LayoutDashboard className="h-6 w-6 text-[var(--color-yellow)]" />
                </div>
                <h3 className="text-xl font-bold text-[#183964] mb-1">We Are Pages</h3>
                <p className="text-sm text-[#6b7280]">Manage corporate info pages.</p>
              </div>
              <div className="bg-[var(--color-dark-card)] p-6 rounded-2xl border border-[var(--color-dark-border)] shadow-lg hover:border-[var(--color-yellow)]/50 transition-colors">
                <div className="h-12 w-12 bg-[#f36c21]/10 rounded-xl flex items-center justify-center mb-4">
                  <Newspaper className="h-6 w-6 text-[var(--color-yellow)]" />
                </div>
                <h3 className="text-xl font-bold text-[#183964] mb-1">Newsroom</h3>
                <p className="text-sm text-[#6b7280]">Manage press releases and media.</p>
              </div>
              <div className="bg-[var(--color-dark-card)] p-6 rounded-2xl border border-[var(--color-dark-border)] shadow-lg hover:border-[var(--color-yellow)]/50 transition-colors">
                <div className="h-12 w-12 bg-[#f36c21]/10 rounded-xl flex items-center justify-center mb-4">
                  <HelpCircle className="h-6 w-6 text-[var(--color-yellow)]" />
                </div>
                <h3 className="text-xl font-bold text-[#183964] mb-1">FAQs</h3>
                <p className="text-sm text-[#6b7280]">Manage frequently asked questions.</p>
              </div>
              <div className="bg-[var(--color-dark-card)] p-6 rounded-2xl border border-[var(--color-dark-border)] shadow-lg hover:border-[var(--color-yellow)]/50 transition-colors">
                <div className="h-12 w-12 bg-[#f36c21]/10 rounded-xl flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-[var(--color-yellow)]" />
                </div>
                <h3 className="text-xl font-bold text-[#183964] mb-1">Financial Highlights</h3>
                <p className="text-sm text-[#6b7280]">Manage financial stats & charts.</p>
              </div>
              <div className="bg-[var(--color-dark-card)] p-6 rounded-2xl border border-[var(--color-dark-border)] shadow-lg hover:border-[var(--color-yellow)]/50 transition-colors">
                <div className="h-12 w-12 bg-[#f36c21]/10 rounded-xl flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-[var(--color-yellow)]" />
                </div>
                <h3 className="text-xl font-bold text-[#183964] mb-1">Investors</h3>
                <p className="text-sm text-[#6b7280]">Manage investors section.</p>
              </div>
              <div className="bg-[var(--color-dark-card)] p-6 rounded-2xl border border-[var(--color-dark-border)] shadow-lg hover:border-[var(--color-yellow)]/50 transition-colors">
                <div className="h-12 w-12 bg-[#f36c21]/10 rounded-xl flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-[var(--color-yellow)]" />
                </div>
                <h3 className="text-xl font-bold text-[#183964] mb-1">Board of Directors</h3>
                <p className="text-sm text-[#6b7280]">Manage board members.</p>
              </div>
              <div className="bg-[var(--color-dark-card)] p-6 rounded-2xl border border-[var(--color-dark-border)] shadow-lg hover:border-[var(--color-yellow)]/50 transition-colors">
                <div className="h-12 w-12 bg-[#f36c21]/10 rounded-xl flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-[var(--color-yellow)]" />
                </div>
                <h3 className="text-xl font-bold text-[#183964] mb-1">Team</h3>
                <p className="text-sm text-[#6b7280]">Manage your building team.</p>
              </div>
              <div className="bg-[var(--color-dark-card)] p-6 rounded-2xl border border-[var(--color-dark-border)] shadow-lg hover:border-[var(--color-yellow)]/50 transition-colors">
                <div className="h-12 w-12 bg-[#f36c21]/10 rounded-xl flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-[var(--color-yellow)]" />
                </div>
                <h3 className="text-xl font-bold text-[#183964] mb-1">Testimonials</h3>
                <p className="text-sm text-[#6b7280]">Manage client reviews.</p>
              </div>
              <div className="bg-[var(--color-dark-card)] p-6 rounded-2xl border border-[var(--color-dark-border)] shadow-lg hover:border-[var(--color-yellow)]/50 transition-colors">
                <div className="h-12 w-12 bg-[#f36c21]/10 rounded-xl flex items-center justify-center mb-4">
                  <Video className="h-6 w-6 text-[var(--color-yellow)]" />
                </div>
                <h3 className="text-xl font-bold text-[#183964] mb-1">Video</h3>
                <p className="text-sm text-[#6b7280]">Update homepage showcase video.</p>
              </div>
              <div className="bg-[var(--color-dark-card)] p-6 rounded-2xl border border-[var(--color-dark-border)] shadow-lg hover:border-[var(--color-yellow)]/50 transition-colors">
                <div className="h-12 w-12 bg-[#f36c21]/10 rounded-xl flex items-center justify-center mb-4">
                  <Phone className="h-6 w-6 text-[var(--color-yellow)]" />
                </div>
                <h3 className="text-xl font-bold text-[#183964] mb-1">Contact Info</h3>
                <p className="text-sm text-[#6b7280]">Manage footer contact details.</p>
              </div>
              <div className="bg-[var(--color-dark-card)] p-6 rounded-2xl border border-[var(--color-dark-border)] shadow-lg hover:border-[var(--color-yellow)]/50 transition-colors">
                <div className="h-12 w-12 bg-[#f36c21]/10 rounded-xl flex items-center justify-center mb-4">
                  <Trophy className="h-6 w-6 text-[var(--color-yellow)]" />
                </div>
                <h3 className="text-xl font-bold text-[#183964] mb-1">Company Stats</h3>
                <p className="text-sm text-[#6b7280]">Manage statistics banner values.</p>
              </div>
            </div>
          )}

          {activeTab === "faqs" && <FaqManager showFeedback={showFeedback} />}
          {activeTab === "financial-highlights" && <FinancialHighlightsManager showFeedback={showFeedback} />}
          {activeTab === "investors" && <InvestorManager showFeedback={showFeedback} />}
          {activeTab === "board-directors" && <BoardDirectorManager showFeedback={showFeedback} />}
          {activeTab === "team" && <TeamManager showFeedback={showFeedback} />}
          {activeTab === "subsidiary" && <SubsidiaryManager showFeedback={showFeedback} />}
          {activeTab === "testimonials" && <TestimonialManager showFeedback={showFeedback} />}
          { activeTab === "video" && <VideoManager showFeedback={showFeedback} /> }
          { activeTab === "stats" && <StatsManager showFeedback={showFeedback} /> }
          { activeTab === "categories" && <CategoryManager showFeedback={showFeedback} /> }
          { activeTab === "projects" && <ProjectManager showFeedback={showFeedback} /> }
          { activeTab === "we-are" && <WeAreManager showFeedback={showFeedback} /> }
          { activeTab === "newsroom" && <NewsroomManager showFeedback={showFeedback} /> }
          { activeTab === "contact-info" && <ContactInfoManager showFeedback={showFeedback} /> }
          { activeTab === "plant-machinery" && <PlantMachineryManager showFeedback={showFeedback} /> }
          
          { activeTab === "career-dashboard" && <CareerDashboard showFeedback={showFeedback} /> }
          { activeTab === "career-jobs" && <JobManager showFeedback={showFeedback} /> }
          { activeTab === "career-applications" && <ApplicationManager showFeedback={showFeedback} /> }
          { activeTab === "career-candidates" && <CandidateManager showFeedback={showFeedback} /> }

        </div>
      </main>
      </div>
    </div>
  );
}
