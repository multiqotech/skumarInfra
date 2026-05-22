'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Pencil, Trash2, Eye, EyeOff, Archive, X, Briefcase } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL;

const DEPARTMENTS = [
  'Engineering', 'Construction', 'Architecture', 'Project Management',
  'Safety & Compliance', 'Finance', 'HR', 'IT', 'Marketing',
  'Operations', 'Procurement', 'Quality Assurance', 'Legal',
];

const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];
const JOB_TYPES = ['On-site', 'Remote', 'Hybrid'];
const STATUSES = ['Draft', 'Published', 'Archived'];

const initialFormState = {
  title: '',
  department: 'Engineering',
  location: '',
  description: '',
  employmentType: 'Full-time',
  jobType: 'On-site',
  status: 'Draft',
  openings: 1,
  salaryMin: '',
  salaryMax: '',
  salaryCurrency: 'INR',
  salaryNegotiable: false,
  experienceMin: '',
  experienceMax: '',
  responsibilities: '',
  requirements: '',
  benefits: '',
  skills: '',
};

export default function JobManager({ showFeedback }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const config = { withCredentials: true };

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API}/api/career/admin/jobs`, config);
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      title: form.title,
      department: form.department,
      location: form.location,
      description: form.description,
      employmentType: form.employmentType,
      jobType: form.jobType,
      status: form.status,
      openings: Number(form.openings),
      salary: {
        min: Number(form.salaryMin) || 0,
        max: Number(form.salaryMax) || 0,
        currency: form.salaryCurrency,
        isNegotiable: form.salaryNegotiable,
      },
      experience: {
        min: Number(form.experienceMin) || 0,
        max: Number(form.experienceMax) || 0,
      },
      responsibilities: form.responsibilities.split('\n').filter(Boolean),
      requirements: form.requirements.split('\n').filter(Boolean),
      benefits: form.benefits.split('\n').filter(Boolean),
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
    };

    try {
      if (editingId) {
        await axios.put(`${API}/api/career/admin/jobs/${editingId}`, payload, config);
        showFeedback('Job updated successfully!');
      } else {
        await axios.post(`${API}/api/career/admin/jobs`, payload, config);
        showFeedback('Job created successfully!');
      }
      resetForm();
      fetchJobs();
    } catch (err) {
      showFeedback(err.response?.data?.message || 'Failed to save job');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (job) => {
    setEditingId(job._id);
    setForm({
      title: job.title,
      department: job.department,
      location: job.location,
      description: job.description,
      employmentType: job.employmentType,
      jobType: job.jobType,
      status: job.status,
      openings: job.openings,
      salaryMin: job.salary?.min || '',
      salaryMax: job.salary?.max || '',
      salaryCurrency: job.salary?.currency || 'INR',
      salaryNegotiable: job.salary?.isNegotiable || false,
      experienceMin: job.experience?.min || '',
      experienceMax: job.experience?.max || '',
      responsibilities: (job.responsibilities || []).join('\n'),
      requirements: (job.requirements || []).join('\n'),
      benefits: (job.benefits || []).join('\n'),
      skills: (job.skills || []).join(', '),
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await axios.delete(`${API}/api/career/admin/jobs/${id}`, config);
      showFeedback('Job deleted');
      fetchJobs();
    } catch (err) {
      showFeedback('Failed to delete job');
    }
  };

  const handleToggleStatus = async (job, newStatus) => {
    try {
      await axios.put(`${API}/api/career/admin/jobs/${job._id}`, { status: newStatus }, config);
      showFeedback(`Job ${newStatus.toLowerCase()}`);
      fetchJobs();
    } catch (err) {
      showFeedback('Failed to update status');
    }
  };

  const resetForm = () => {
    setForm(initialFormState);
    setEditingId(null);
    setShowForm(false);
  };

  const statusBadge = (status) => {
    const colors = {
      Draft: 'bg-gray-600/20 text-gray-400 border-gray-600/30',
      Published: 'bg-green-600/20 text-green-400 border-green-600/30',
      Archived: 'bg-orange-600/20 text-orange-400 border-orange-600/30',
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[status] || ''}`}>
        {status}
      </span>
    );
  };

  const inputClass = 'w-full bg-[#1a1a1a] border border-[var(--color-dark-border)] px-4 py-2.5 text-white text-sm rounded-lg focus:border-[#FFB800] focus:outline-none transition-colors';
  const labelClass = 'block text-sm font-medium text-gray-400 mb-1.5';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Job Management</h2>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#FFB800] text-black font-semibold rounded-lg hover:bg-[#e5a600] transition-colors text-sm"
        >
          <Plus className="w-4 h-4" /> New Job
        </button>
      </div>

      {/* Job Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center overflow-y-auto py-8">
          <div className="bg-[#141414] rounded-2xl border border-[var(--color-dark-border)] w-full max-w-3xl mx-4 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-dark-border)]">
              <h3 className="text-xl font-bold text-white">
                {editingId ? 'Edit Job' : 'Create New Job'}
              </h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Job Title *</label>
                  <input type="text" className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div>
                  <label className={labelClass}>Department *</label>
                  <select className={inputClass} value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
                    {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Location *</label>
                  <input type="text" className={inputClass} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required placeholder="e.g. Delhi, India" />
                </div>
                <div>
                  <label className={labelClass}>Employment Type</label>
                  <select className={inputClass} value={form.employmentType} onChange={(e) => setForm({ ...form, employmentType: e.target.value })}>
                    {EMPLOYMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Job Type</label>
                  <select className={inputClass} value={form.jobType} onChange={(e) => setForm({ ...form, jobType: e.target.value })}>
                    {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className={labelClass}>Salary Min</label>
                  <input type="number" className={inputClass} value={form.salaryMin} onChange={(e) => setForm({ ...form, salaryMin: e.target.value })} placeholder="e.g. 500000" />
                </div>
                <div>
                  <label className={labelClass}>Salary Max</label>
                  <input type="number" className={inputClass} value={form.salaryMax} onChange={(e) => setForm({ ...form, salaryMax: e.target.value })} placeholder="e.g. 1200000" />
                </div>
                <div>
                  <label className={labelClass}>Exp Min (yrs)</label>
                  <input type="number" className={inputClass} value={form.experienceMin} onChange={(e) => setForm({ ...form, experienceMin: e.target.value })} placeholder="0" />
                </div>
                <div>
                  <label className={labelClass}>Exp Max (yrs)</label>
                  <input type="number" className={inputClass} value={form.experienceMax} onChange={(e) => setForm({ ...form, experienceMax: e.target.value })} placeholder="5" />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Openings</label>
                  <input type="number" className={inputClass} value={form.openings} onChange={(e) => setForm({ ...form, openings: e.target.value })} min="0" />
                </div>
                <div>
                  <label className={labelClass}>Status</label>
                  <select className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                    <input type="checkbox" checked={form.salaryNegotiable} onChange={(e) => setForm({ ...form, salaryNegotiable: e.target.checked })} className="accent-[#FFB800]" />
                    Salary Negotiable
                  </label>
                </div>
              </div>

              <div>
                <label className={labelClass}>Description *</label>
                <textarea className={`${inputClass} resize-none`} rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Responsibilities (one per line)</label>
                  <textarea className={`${inputClass} resize-none`} rows={4} value={form.responsibilities} onChange={(e) => setForm({ ...form, responsibilities: e.target.value })} placeholder="Lead project teams&#10;Review technical drawings&#10;Ensure safety compliance" />
                </div>
                <div>
                  <label className={labelClass}>Requirements (one per line)</label>
                  <textarea className={`${inputClass} resize-none`} rows={4} value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} placeholder="B.Tech in Civil Engineering&#10;5+ years experience&#10;PMP Certification" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Benefits (one per line)</label>
                  <textarea className={`${inputClass} resize-none`} rows={3} value={form.benefits} onChange={(e) => setForm({ ...form, benefits: e.target.value })} placeholder="Health Insurance&#10;Annual Bonus&#10;Flexible Hours" />
                </div>
                <div>
                  <label className={labelClass}>Skills (comma-separated)</label>
                  <textarea className={`${inputClass} resize-none`} rows={3} value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="AutoCAD, Revit, Project Planning, Safety Management" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-dark-border)]">
                <button type="button" onClick={resetForm} className="px-6 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-[#FFB800] text-black font-semibold rounded-lg hover:bg-[#e5a600] transition-colors text-sm disabled:opacity-50">
                  {submitting ? 'Saving...' : editingId ? 'Update Job' : 'Create Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Jobs Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[var(--color-dark-card)] p-4 rounded-xl border border-[var(--color-dark-border)] animate-pulse">
              <div className="h-5 w-48 bg-gray-700 rounded mb-2" />
              <div className="h-4 w-32 bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 bg-[var(--color-dark-card)] rounded-2xl border border-[var(--color-dark-border)]">
          <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">No jobs created yet</p>
          <p className="text-gray-600 text-sm">Click "New Job" to create your first posting</p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-[var(--color-dark-card)] p-5 rounded-xl border border-[var(--color-dark-border)] hover:border-[#FFB800]/20 transition-all group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-white font-semibold text-lg truncate">{job.title}</h3>
                    {statusBadge(job.status)}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span>{job.department}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                    <span>•</span>
                    <span>{job.employmentType}</span>
                    <span>•</span>
                    <span>{job.openings} opening{job.openings !== 1 ? 's' : ''}</span>
                    <span>•</span>
                    <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {job.status === 'Draft' && (
                    <button onClick={() => handleToggleStatus(job, 'Published')} title="Publish" className="p-2 text-green-400 hover:bg-green-400/10 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  {job.status === 'Published' && (
                    <button onClick={() => handleToggleStatus(job, 'Draft')} title="Unpublish" className="p-2 text-gray-400 hover:bg-gray-400/10 rounded-lg transition-colors">
                      <EyeOff className="w-4 h-4" />
                    </button>
                  )}
                  {job.status !== 'Archived' && (
                    <button onClick={() => handleToggleStatus(job, 'Archived')} title="Archive" className="p-2 text-orange-400 hover:bg-orange-400/10 rounded-lg transition-colors">
                      <Archive className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => handleEdit(job)} title="Edit" className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(job._id)} title="Delete" className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
