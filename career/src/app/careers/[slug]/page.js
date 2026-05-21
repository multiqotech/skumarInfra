import axios from 'axios';
import { notFound } from 'next/navigation';
import JobDetailHero from '@/components/career/JobDetailHero';
import JobContent from '@/components/career/JobContent';
import ApplicationForm from '@/components/career/ApplicationForm';

// Fetch job securely on the server
async function getJob(slug) {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/career/jobs/${slug}`);
    return res.data;
  } catch (err) {
    if (err.response?.status === 404) return null;
    throw err;
  }
}

export default async function JobDetailPage({ params }) {
  const { slug } = await params;
  const job = await getJob(slug);

  if (!job) {
    notFound();
  }

  return (
    <>
      <JobDetailHero job={job} />
      <section className="py-20 bg-[var(--color-dark)] relative">
        <div className="container-custom relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
            {/* Left Content */}
            <div className="flex-1 space-y-12">
              <JobContent job={job} />
            </div>

            {/* Right Sticky Form */}
            <div className="w-full lg:w-[450px] shrink-0">
              <div className="sticky top-28">
                <ApplicationForm job={job} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
