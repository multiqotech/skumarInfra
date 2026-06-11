'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Upload, X, CheckCircle2, Loader2, FileText, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const API = process.env.NEXT_PUBLIC_API_URL;

// Inline error component
function FieldError({ error }) {
  if (!error) return null;
  return (
    <div className="flex items-center gap-1.5 mt-1.5 text-red-500">
      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
      <span className="text-xs font-semibold">{error}</span>
    </div>
  );
}

export default function ApplicationForm({ job, onSuccess }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    experience: '',
    linkedin: '',
    portfolio: '',
    coverLetter: '',
  });
  const [file, setFile] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');
  
  const fileInputRef = useRef(null);

  const { user, profile, fetchProfile } = useAuth();

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: profile?.fullName || user.name || '',
        email: profile?.email || user.email || '',
        phone: profile?.phone || '',
        location: profile?.location || '',
        experience: profile?.experience !== undefined ? String(profile.experience) : '',
        linkedin: profile?.linkedin || '',
        portfolio: profile?.portfolio || '',
      }));
    }
  }, [user, profile]);

  // Validation logic
  const validateField = useCallback((name, value) => {
    switch (name) {
      case 'fullName':
        if (!value || value.trim().length === 0) return 'Full name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return null;

      case 'email':
        if (!value || value.trim().length === 0) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        return null;

      case 'phone':
        if (!value || value.trim().length === 0) return 'Phone number is required';
        // Allow formats: +91 98765 43210, 9876543210, +919876543210, etc.
        const cleaned = value.replace(/[\s\-()]/g, '');
        if (!/^\+?\d{10,15}$/.test(cleaned)) return 'Enter a valid phone number (10-15 digits)';
        return null;

      case 'experience': {
        if (!value && value !== '0' && value !== 0) return 'Experience is required';
        const exp = parseFloat(value);
        if (isNaN(exp)) return 'Experience must be a number';
        if (exp < 0) return 'Experience cannot be negative';
        
        // Validate against job minimum requirement only
        const minExp = job?.experience?.min;
        
        if (minExp !== undefined && minExp > 0 && exp < minExp) {
          return `This role requires minimum ${minExp} year${minExp !== 1 ? 's' : ''} of experience. You have entered ${exp} year${exp !== 1 ? 's' : ''}.`;
        }
        return null;
      }

      case 'linkedin':
        if (value && value.trim().length > 0) {
          if (!/^https?:\/\/(www\.)?linkedin\.com\//.test(value)) {
            return 'Enter a valid LinkedIn URL (e.g. https://linkedin.com/in/yourname)';
          }
        }
        return null;

      case 'portfolio':
        if (value && value.trim().length > 0) {
          if (!/^https?:\/\/.+\..+/.test(value)) {
            return 'Enter a valid URL (e.g. https://yoursite.com)';
          }
        }
        return null;

      case 'coverLetter':
        if (value && value.length > 5000) return 'Cover letter cannot exceed 5000 characters';
        return null;

      default:
        return null;
    }
  }, [job]);

  // Validate all fields
  const validateAll = useCallback(() => {
    const errors = {};
    Object.keys(formData).forEach(key => {
      const err = validateField(key, formData[key]);
      if (err) errors[key] = err;
    });
    return errors;
  }, [formData, validateField]);

  // Run validation on field change (only for touched fields)
  useEffect(() => {
    const newErrors = {};
    Object.keys(touched).forEach(key => {
      if (touched[key]) {
        const err = validateField(key, formData[key]);
        if (err) newErrors[key] = err;
      }
    });
    setFieldErrors(newErrors);
  }, [formData, touched, validateField]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Mark as touched on change for instant feedback
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
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
    
    // Touch all fields to show errors
    const allTouched = {};
    Object.keys(formData).forEach(key => { allTouched[key] = true; });
    setTouched(allTouched);

    // Validate all
    const errors = validateAll();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setStatus('error');
      setMessage('Please fix the highlighted errors before submitting.');
      return;
    }

    if (!file && !profile?.resumeUrl) {
      setStatus('error');
      setMessage('Please upload your resume');
      return;
    }

    setStatus('loading');

    try {
      const data = new FormData();
      data.append('jobSlug', job.slug);
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (file) {
        data.append('resume', file);
      }

      await axios.post(`${API}/api/career/apply`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Refresh the profile to get updated appliedJobIds list!
      if (fetchProfile) {
        try {
          await fetchProfile();
        } catch (profileErr) {
          console.error('Failed to refresh profile after application', profileErr);
        }
      }

      setStatus('success');
      setMessage('Application submitted successfully! We will review your profile and get back to you soon.');
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        location: '',
        experience: '',
        linkedin: '',
        portfolio: '',
        coverLetter: '',
      });
      setFile(null);
      setTouched({});
      setFieldErrors({});
      if (fileInputRef.current) fileInputRef.current.value = '';

      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }

    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  const getInputClass = (fieldName) => {
    const hasError = touched[fieldName] && fieldErrors[fieldName];
    return `w-full bg-[#f7f9fc] border ${hasError ? 'border-red-400 ring-1 ring-red-300/30' : 'border-[#183964]/10'} px-4 py-3.5 text-[#183964] rounded-xl focus:border-[#f36c21] focus:ring-1 focus:ring-[#f36c21]/30 focus:outline-none transition-all`;
  };
  const labelClass = "block text-sm font-semibold text-[#6b7280] mb-2";

  // Experience requirement hint
  const expHint = job?.experience?.min || job?.experience?.max
    ? `Required: ${job.experience.min || 0}–${job.experience.max || '∞'} years`
    : null;

  if (status === 'success') {
    return (
      <div className="bg-white rounded-3xl p-8 md:p-10 border border-[#183964]/10 shadow-[0_20px_50px_rgba(24,57,100,0.05)] text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#22C55E]" />
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-[#183964] mb-4">Application Sent!</h3>
        <p className="text-[#6b7280] leading-relaxed mb-8 font-medium">
          {message}
        </p>
        <button 
          onClick={() => setStatus('idle')}
          className="text-[#f36c21] font-bold hover:underline"
        >
          Submit another application
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 md:p-10 border border-[#183964]/10 shadow-[0_20px_50px_rgba(24,57,100,0.05)]">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-[#183964] mb-2">Apply Now</h3>
        <p className="text-[#6b7280] text-sm font-medium">Submit your details for the {job.title} position.</p>
      </div>

      {status === 'error' && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-500">
          <X className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm font-semibold">{message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div>
          <label className={labelClass}>Full Name *</label>
          <input required type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} onBlur={handleBlur} className={getInputClass('fullName')} placeholder="John Doe" />
          <FieldError error={touched.fullName && fieldErrors.fullName} />
        </div>

        <div>
          <label className={labelClass}>Email Address *</label>
          <input required type="email" name="email" value={formData.email} onChange={handleInputChange} onBlur={handleBlur} className={getInputClass('email')} placeholder="john@example.com" />
          <FieldError error={touched.email && fieldErrors.email} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Phone *</label>
            <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} onBlur={handleBlur} className={getInputClass('phone')} placeholder="+91 98765 43210" />
            <FieldError error={touched.phone && fieldErrors.phone} />
          </div>
          <div>
            <label className={labelClass}>
              Experience (Yrs) *
              {expHint && (
                <span className="ml-1 text-[10px] text-[#f36c21] font-bold tracking-wide">({expHint})</span>
              )}
            </label>
            <input required type="number" name="experience" min="0" step="0.5" value={formData.experience} onChange={handleInputChange} onBlur={handleBlur} className={getInputClass('experience')} placeholder="5" />
            <FieldError error={touched.experience && fieldErrors.experience} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Current Location</label>
          <input type="text" name="location" value={formData.location} onChange={handleInputChange} onBlur={handleBlur} className={getInputClass('location')} placeholder="City, Country" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>LinkedIn Profile</label>
            <input type="url" name="linkedin" value={formData.linkedin} onChange={handleInputChange} onBlur={handleBlur} className={getInputClass('linkedin')} placeholder="https://linkedin.com/in/johndoe" />
            <FieldError error={touched.linkedin && fieldErrors.linkedin} />
          </div>
          <div>
            <label className={labelClass}>Portfolio Website</label>
            <input type="url" name="portfolio" value={formData.portfolio} onChange={handleInputChange} onBlur={handleBlur} className={getInputClass('portfolio')} placeholder="https://johndoe.com" />
            <FieldError error={touched.portfolio && fieldErrors.portfolio} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Resume/CV * (PDF or Word, max 5MB)</label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`w-full border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              file || profile?.resumeUrl ? 'border-[#f36c21] bg-[#f36c21]/5' : 'border-[#183964]/20 hover:border-[#f36c21]/50 bg-[#f7f9fc]'
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
                <FileText className="w-8 h-8 text-[#f36c21] mb-3" />
                <p className="text-[#183964] font-bold text-sm truncate max-w-[250px]">{file.name}</p>
                <p className="text-[#6b7280] text-xs mt-1 font-medium">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="mt-3 text-red-500 font-medium text-xs hover:underline">
                  Remove file
                </button>
              </div>
            ) : profile?.resumeUrl ? (
              <div className="flex flex-col items-center justify-center">
                <FileText className="w-8 h-8 text-[#f36c21] mb-3" />
                <p className="text-[#f36c21] font-bold text-sm">Using saved resume from profile</p>
                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-[#6b7280] font-medium text-xs hover:underline mt-1">
                  View Saved Resume
                </a>
                <p className="text-[#6b7280] font-medium text-xs mt-3">Click or drag here to upload a new resume</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <Upload className="w-6 h-6 text-[#183964]" />
                </div>
                <p className="text-[#183964] font-bold text-sm mb-1">Click to upload resume</p>
                <p className="text-[#6b7280] font-medium text-xs">or drag and drop</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className={labelClass}>Cover Letter (Optional)</label>
          <textarea name="coverLetter" value={formData.coverLetter} onChange={handleInputChange} onBlur={handleBlur} rows={4} className={`${getInputClass('coverLetter')} resize-none`} placeholder="Why are you a good fit for this role?" />
          <FieldError error={touched.coverLetter && fieldErrors.coverLetter} />
        </div>

        <button 
          type="submit" 
          disabled={status === 'loading'}
          className="w-full bg-[#f36c21] text-white font-bold py-4 rounded-xl hover:bg-[#d45a14] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(243,108,33,0.2)]"
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
