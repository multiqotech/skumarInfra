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
      <div className="min-h-screen flex items-center justify-center bg-[#0C0C0C] text-white">
        <h1 className="text-2xl">Job not found or no longer available.</h1>
      </div>
    );
  }

  return (
    <div className="font-body selection:bg-[#FFB800] selection:text-black">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-[#111] border-b border-[#222]">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-[#FFB800]/10 text-[#FFB800] text-sm font-semibold rounded-full uppercase tracking-wider">
                  {job.department}
                </span>
                <span className="text-gray-500 text-sm flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                {job.title}
              </h1>

              <div className="flex flex-wrap gap-6 text-gray-400">
                <span className="flex items-center gap-2"><MapPin className="w-5 h-5 text-gray-500" /> {job.location}</span>
                <span className="flex items-center gap-2"><Briefcase className="w-5 h-5 text-gray-500" /> {job.employmentType}</span>
                <span className="flex items-center gap-2"><Users className="w-5 h-5 text-gray-500" /> {job.experience?.min}-{job.experience?.max} Years Exp.</span>
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

            <div className="bg-[var(--color-dark-card)] rounded-2xl border border-[var(--color-dark-border)] p-8 md:p-12">
              <h2 className="text-2xl font-bold text-white mb-8">About the Role</h2>

              {/* Render HTML content safely */}
              <div
                className="prose prose-invert prose-yellow max-w-none 
                  prose-headings:font-heading prose-headings:font-bold 
                  prose-a:text-[#FFB800] prose-a:no-underline hover:prose-a:underline
                  prose-ul:list-disc prose-ul:ml-4 prose-li:text-gray-300
                  prose-p:text-gray-300 prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </div>

            <div className="mt-12 text-center">
              <h3 className="text-xl text-white font-semibold mb-6">Ready to join us?</h3>
              <ApplyButton job={job} />
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
