"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ApplicationForm from "./ApplicationForm";
import { HiX } from "react-icons/hi";
import { CheckCircle2 } from "lucide-react";

export default function ApplyButton({ job }) {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hasApplied = user && profile?.appliedJobIds?.includes(job._id);

  const handleApplyClick = () => {
    if (!user) {
      // Redirect to login if not authenticated, returning to this job's details page
      router.push(`/login?redirect=/${job.slug}`);
    } else {
      // Open modal if authenticated
      setIsModalOpen(true);
    }
  };

  return (
    <>
      {hasApplied ? (
        <button 
          disabled
          className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-600 font-bold px-8 py-4 rounded-xl cursor-not-allowed shadow-sm uppercase tracking-wide transition-all"
        >
          <CheckCircle2 className="w-5 h-5" />
          Already Applied
        </button>
      ) : (
        <button 
          onClick={handleApplyClick}
          className="inline-block bg-[#f36c21] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#d45a14] hover:-translate-y-1 transition-all shadow-[0_10px_20px_rgba(243,108,33,0.3)] uppercase tracking-wide"
        >
          Apply for this Role
        </button>
      )}

      {/* Application Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-[#183964]/40 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>
          
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white border border-[#183964]/10 rounded-3xl shadow-[0_25px_50px_rgba(24,57,100,0.15)] z-10 flex flex-col">
            <div className="sticky top-0 right-0 p-6 bg-white/95 backdrop-blur-md border-b border-[#183964]/10 flex justify-between items-center z-20">
              <h2 className="text-2xl font-bold text-[#183964]">Apply for {job.title}</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-[#6b7280] hover:text-[#183964] bg-[#f7f9fc] hover:bg-[#183964]/10 rounded-full transition-colors"
              >
                <HiX size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <ApplicationForm job={job} onSuccess={() => setIsModalOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
