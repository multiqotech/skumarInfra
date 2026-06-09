import axios from 'axios';
import { notFound } from 'next/navigation';
import { MapPin, Briefcase, Calendar, Users } from 'lucide-react';
import ApplyButton from '@/components/career/ApplyButton';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function generateMetadata({ params }) {
  try {
    const resolvedParams = await params;
    const res = await axios.get(`${API}/api/career/jobs/${resolvedParams.slug}`);
    const job = res.data;
    return {
      title: `${job.title} | Careers at S Kumar Infracons (India) Private Limited`,
      description: job.description.substring(0, 160).replace(/<[^>]+>/g, ''),
    };
  } catch (err) {
    return { title: 'Job Not Found | S Kumar Infracons (India) Private Limited' };
  }
}

export default async function JobDetailsPage({ params }) {
  let job = null;

  try {
    const resolvedParams = await params;
    const res = await axios.get(`${API}/api/career/jobs/${resolvedParams.slug}`);
    job = res.data;
  } catch (err) {
    if (err.response?.status === 404) {
      notFound();
    }
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f9fc] text-[#183964]">
        <h1 className="text-2xl font-bold">Job not found or no longer available.</h1>
      </div>
    );
  }

  return (
    <div className="font-body selection:bg-[#f36c21] selection:text-white bg-[#f7f9fc]">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-white border-b border-[#183964]/10 shadow-[0_10px_40px_rgba(24,57,100,0.03)]">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-[#f36c21]/10 text-[#f36c21] text-sm font-bold rounded-full uppercase tracking-wider">
                  {job.department}
                </span>
                <span className="text-[#6b7280] text-sm flex items-center gap-1.5 font-medium">
                  <Calendar className="w-4 h-4" />
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#183964] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                {job.title}
              </h1>

              <div className="flex flex-wrap gap-6 text-[#4b5563] font-medium">
                <span className="flex items-center gap-2"><MapPin className="w-5 h-5 text-[#f36c21]" /> {job.location}</span>
                <span className="flex items-center gap-2"><Briefcase className="w-5 h-5 text-[#f36c21]" /> {job.employmentType}</span>
                <span className="flex items-center gap-2"><Users className="w-5 h-5 text-[#f36c21]" /> {job.experience?.min}-{job.experience?.max} Years Exp.</span>
              </div>
            </div>

            <div className="shrink-0">
              <ApplyButton job={job} />
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">

            <div className="bg-white rounded-2xl border border-[#183964]/10 shadow-sm p-8 md:p-12">
              <h2 className="text-2xl font-bold text-[#183964] mb-8">About the Role</h2>

              {/* Render HTML content safely */}
              <div
                className="prose max-w-none 
                  prose-headings:font-heading prose-headings:font-bold prose-headings:text-[#183964]
                  prose-a:text-[#f36c21] prose-a:no-underline hover:prose-a:underline
                  prose-ul:list-disc prose-ul:ml-4 prose-li:text-[#4b5563] prose-li:font-medium
                  prose-p:text-[#4b5563] prose-p:leading-relaxed prose-p:font-medium"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </div>

            <div className="mt-12 text-center bg-white p-8 rounded-2xl border border-[#183964]/10 shadow-[0_20px_50px_rgba(24,57,100,0.05)]">
              <h3 className="text-2xl text-[#183964] font-bold mb-6">Ready to join us?</h3>
              <ApplyButton job={job} />
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
