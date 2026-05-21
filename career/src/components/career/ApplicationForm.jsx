'use client';

import { useState, useRef } from 'react';
import axios from 'axios';
import { Upload, X, CheckCircle2, Loader2, FileText } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ApplicationForm({ job }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    experience: '',
    coverLetter: '',
  });
  const [file, setFile] = useState(null);
  
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');
  
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (selected.size > 5 * 1024 * 1024) {
        setStatus('error');
        setMessage('File size must be less than 5MB');
        return;
      }
      if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(selected.type)) {
        setStatus('error');
        setMessage('Only PDF and Word documents are allowed');
        return;
      }
      setFile(selected);
      setStatus('idle');
      setMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setStatus('error');
      setMessage('Please upload your resume');
      return;
    }

    setStatus('loading');

    try {
      const data = new FormData();
      data.append('jobId', job._id);
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      data.append('resume', file);

      await axios.post(`${API}/api/career/apply`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setStatus('success');
      setMessage('Application submitted successfully! We will review your profile and get back to you soon.');
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        location: '',
        experience: '',
        coverLetter: '',
      });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  const inputClass = "w-full bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-3.5 text-white rounded-xl focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800] focus:outline-none transition-all";
  const labelClass = "block text-sm font-medium text-gray-400 mb-2";

  if (status === 'success') {
    return (
      <div className="bg-[#141414] rounded-3xl p-8 md:p-10 border border-[#2a2a2a] shadow-2xl text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#22C55E]" />
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">Application Sent!</h3>
        <p className="text-gray-400 leading-relaxed mb-8">
          {message}
        </p>
        <button 
          onClick={() => setStatus('idle')}
          className="text-[#FFB800] font-medium hover:underline"
        >
          Submit another application
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#141414] rounded-3xl p-8 md:p-10 border border-[#2a2a2a] shadow-2xl">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Apply Now</h3>
        <p className="text-gray-400 text-sm">Submit your details for the {job.title} position.</p>
      </div>

      {status === 'error' && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-start gap-3 text-red-400">
          <X className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className={labelClass}>Full Name *</label>
          <input required type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className={inputClass} placeholder="John Doe" />
        </div>

        <div>
          <label className={labelClass}>Email Address *</label>
          <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className={inputClass} placeholder="john@example.com" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Phone *</label>
            <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className={inputClass} placeholder="+91 98765 43210" />
          </div>
          <div>
            <label className={labelClass}>Experience (Yrs) *</label>
            <input required type="number" name="experience" min="0" step="0.5" value={formData.experience} onChange={handleInputChange} className={inputClass} placeholder="5" />
          </div>
        </div>

        <div>
          <label className={labelClass}>Current Location</label>
          <input type="text" name="location" value={formData.location} onChange={handleInputChange} className={inputClass} placeholder="City, Country" />
        </div>

        <div>
          <label className={labelClass}>Resume/CV * (PDF or Word, max 5MB)</label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`w-full border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              file ? 'border-[#FFB800] bg-[#FFB800]/5' : 'border-[#333] hover:border-[#FFB800]/50 bg-[#1a1a1a]'
            }`}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              className="hidden" 
            />
            
            {file ? (
              <div className="flex flex-col items-center justify-center">
                <FileText className="w-8 h-8 text-[#FFB800] mb-3" />
                <p className="text-white font-medium text-sm truncate max-w-[250px]">{file.name}</p>
                <p className="text-gray-500 text-xs mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="mt-3 text-red-400 text-xs hover:underline">
                  Remove file
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-[#222] rounded-full flex items-center justify-center mb-4">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-white font-medium text-sm mb-1">Click to upload resume</p>
                <p className="text-gray-500 text-xs">or drag and drop</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className={labelClass}>Cover Letter (Optional)</label>
          <textarea name="coverLetter" value={formData.coverLetter} onChange={handleInputChange} rows={4} className={`${inputClass} resize-none`} placeholder="Why are you a good fit for this role?" />
        </div>

        <button 
          type="submit" 
          disabled={status === 'loading'}
          className="w-full bg-[#FFB800] text-black font-bold py-4 rounded-xl hover:bg-[#e5a600] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Application'
          )}
        </button>
      </form>
    </div>
  );
}
