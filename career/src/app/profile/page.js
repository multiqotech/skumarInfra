'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Clock, 
  Globe, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Lock,
  Edit2,
  X
} from 'lucide-react';
import { FaLinkedin } from 'react-icons/fa';

export default function ProfilePage() {
  const { user, profile, loading, updateProfile } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    location: '',
    experience: '',
    expectedSalary: '',
    noticePeriod: '',
    linkedin: '',
    portfolio: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Protect route
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/profile');
    }
  }, [user, loading, router]);

  // Load profile data into form state
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: profile?.fullName || user.name || '',
        phone: profile?.phone || '',
        location: profile?.location || '',
        experience: profile?.experience !== undefined ? String(profile.experience) : '',
        expectedSalary: profile?.expectedSalary || '',
        noticePeriod: profile?.noticePeriod || '',
        linkedin: profile?.linkedin || '',
        portfolio: profile?.portfolio || '',
      });
    }
  }, [user, profile]);

  if (loading || !user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#f36c21]" />
        <p className="text-[#6b7280] text-sm tracking-wide">Loading your profile details...</p>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (selected.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      if (!allowedTypes.includes(selected.type)) {
        setError('Only PDF, DOC, and DOCX formats are allowed');
        return;
      }
      setFile(selected);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return;
    }
    if (formData.linkedin && !/^https?:\/\/(www\.)?linkedin\.com\//.test(formData.linkedin)) {
      setError('Please provide a valid LinkedIn URL');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      if (file) {
        data.append('resume', file);
      }

      const res = await updateProfile(data);
      if (res.success) {
        setSuccess('Profile updated successfully!');
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setIsEditing(false);
        
        // Clear success message after 4 seconds
        setTimeout(() => setSuccess(''), 4000);
      } else {
        setError(res.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getInputClass = (name) => {
    const isFieldEditable = isEditing && name !== 'email';
    return `w-full px-4 py-3.5 rounded-xl transition-all pl-11 text-sm focus:outline-none ${
      isFieldEditable
        ? 'bg-white border border-[#2A2A2A] text-[#183964] focus:border-[#f36c21] focus:ring-1 focus:ring-[#FFB800]'
        : 'bg-[#151515] border border-transparent text-[#6b7280] cursor-not-allowed'
    }`;
  };
  const labelClass = "block text-sm font-semibold text-[#6b7280] mb-2 tracking-wide uppercase text-xs";
  
  // Calculate profile completion percentage
  const fields = [
    profile?.fullName || user.name,
    profile?.phone,
    profile?.location,
    profile?.experience,
    profile?.expectedSalary,
    profile?.noticePeriod,
    profile?.linkedin,
    profile?.portfolio,
    profile?.resumeUrl
  ];
  const completedFieldsCount = fields.filter(Boolean).length;
  const completionPercentage = Math.round((completedFieldsCount / fields.length) * 100);

  return (
    <div className="py-12 bg-[#f7f9fc]">
      <div className="container-custom max-w-5xl">
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#2A2A2A] shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#f36c21]/5 rounded-full blur-3xl pointer-events-none" />
          
          {/* Edit Button on Top Right */}
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className={`absolute top-4 right-4 md:top-6 md:right-6 z-20 flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2.5 rounded-xl border text-[11px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md ${
              isEditing
                ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
                : 'bg-[#f36c21] border-transparent text-[#0C0C0C] hover:bg-[#e5a600] shadow-lg shadow-[#FFB800]/10'
            }`}
          >
            {isEditing ? (
              <>
                <X className="w-3.5 h-3.5" />
                Cancel
              </>
            ) : (
              <>
                <Edit2 className="w-3.5 h-3.5" />
                Edit Profile
              </>
            )}
          </button>

          <div className="flex flex-col md:flex-row items-center gap-6 justify-between relative z-10 pr-0 md:pr-24">
            <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
              <div className="w-20 h-20 bg-gradient-to-tr from-[#FFB800] to-[#E5A600] rounded-2xl flex items-center justify-center shadow-lg shadow-[#FFB800]/10">
                <span className="text-[#0C0C0C] text-3xl font-extrabold tracking-wide uppercase">
                  {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#183964] tracking-tight">{user.name}</h1>
                <p className="text-[#6b7280] text-sm mt-1">{user.email}</p>
                <div className="flex items-center gap-2 mt-3 justify-center md:justify-start">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                    user.profileCompleted 
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                      : 'bg-[#f36c21]/10 text-yellow-400 border border-[#f36c21]/20'
                  }`}>
                    {user.profileCompleted ? 'Verified Profile' : 'Incomplete Profile'}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Progress */}
            <div className="w-full md:w-64 bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl p-4 mt-4 md:mt-0">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-[#6b7280] tracking-wide uppercase">Profile Setup</span>
                <span className="text-sm font-bold text-[#f36c21]">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-[#2A2A2A] h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#FFB800] to-[#E5A600] h-full rounded-full transition-all duration-500" 
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <p className="text-[11px] text-[#6b7280] mt-2 leading-relaxed text-center md:text-left">
                {completionPercentage === 100 
                  ? 'Fantastic! Your profile is 100% complete.' 
                  : 'Complete your profile to unlock instant single-click job applications.'}
              </p>
            </div>
          </div>
        </div>

        {/* Success & Error Banners */}
        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-2xl flex items-center gap-3 text-green-400 shadow-lg animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-400 shadow-lg animate-fadeIn">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Profile Editing Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left/Middle Column - Form Fields */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Personal Details Section */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#2A2A2A] shadow-xl space-y-6">
                <h2 className="text-lg font-bold text-[#183964] border-b border-[#2A2A2A] pb-4 tracking-tight flex items-center gap-2">
                  <User className="text-[#f36c21] w-5 h-5" /> Personal Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Full Name *</label>
                    <div className="relative">
                      <User className={`absolute left-4 top-[17px] w-4 h-4 transition-colors ${isEditing ? 'text-[#f36c21]' : 'text-gray-600'}`} />
                      <input 
                        required 
                        type="text" 
                        name="fullName" 
                        value={formData.fullName} 
                        onChange={handleInputChange} 
                        disabled={!isEditing}
                        className={getInputClass('fullName')} 
                        placeholder="John Doe" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Email Address (Protected)</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-[17px] text-gray-600 w-4 h-4" />
                      <input 
                        disabled 
                        type="email" 
                        value={user.email} 
                        className="w-full bg-[#151515] border border-transparent px-4 py-3.5 text-[#6b7280] rounded-xl cursor-not-allowed pl-11 text-sm font-medium" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Phone Number *</label>
                    <div className="relative">
                      <Phone className={`absolute left-4 top-[17px] w-4 h-4 transition-colors ${isEditing ? 'text-[#f36c21]' : 'text-gray-600'}`} />
                      <input 
                        required 
                        type="tel" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleInputChange} 
                        disabled={!isEditing}
                        className={getInputClass('phone')} 
                        placeholder="+91 99251 90298" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Current Location</label>
                    <div className="relative">
                      <MapPin className={`absolute left-4 top-[17px] w-4 h-4 transition-colors ${isEditing ? 'text-[#f36c21]' : 'text-gray-600'}`} />
                      <input 
                        type="text" 
                        name="location" 
                        value={formData.location} 
                        onChange={handleInputChange} 
                        disabled={!isEditing}
                        className={getInputClass('location')} 
                        placeholder="Mumbai, India" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional & Social Details Section */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#2A2A2A] shadow-xl space-y-6">
                <h2 className="text-lg font-bold text-[#183964] border-b border-[#2A2A2A] pb-4 tracking-tight flex items-center gap-2">
                  <Briefcase className="text-[#f36c21] w-5 h-5" /> Professional Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className={labelClass}>Total Experience (Yrs)</label>
                    <div className="relative">
                      <Briefcase className={`absolute left-4 top-[17px] w-4 h-4 transition-colors ${isEditing ? 'text-[#f36c21]' : 'text-gray-600'}`} />
                      <input 
                        type="number" 
                        name="experience" 
                        min="0" 
                        step="0.5" 
                        value={formData.experience} 
                        onChange={handleInputChange} 
                        disabled={!isEditing}
                        className={getInputClass('experience')} 
                        placeholder="5" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Expected Salary</label>
                    <div className="relative">
                      <DollarSign className={`absolute left-4 top-[17px] w-4 h-4 transition-colors ${isEditing ? 'text-[#f36c21]' : 'text-gray-600'}`} />
                      <input 
                        type="text" 
                        name="expectedSalary" 
                        value={formData.expectedSalary} 
                        onChange={handleInputChange} 
                        disabled={!isEditing}
                        className={getInputClass('expectedSalary')} 
                        placeholder="e.g. 12 LPA" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Notice Period</label>
                    <div className="relative">
                      <Clock className={`absolute left-4 top-[17px] w-4 h-4 transition-colors ${isEditing ? 'text-[#f36c21]' : 'text-gray-600'}`} />
                      <input 
                        type="text" 
                        name="noticePeriod" 
                        value={formData.noticePeriod} 
                        onChange={handleInputChange} 
                        disabled={!isEditing}
                        className={getInputClass('noticePeriod')} 
                        placeholder="e.g. Immediate / 30 Days" 
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div>
                    <label className={labelClass}>LinkedIn Profile URL</label>
                    <div className="relative">
                      <FaLinkedin className={`absolute left-4 top-[17px] w-4 h-4 transition-colors ${isEditing ? 'text-[#f36c21]' : 'text-gray-600'}`} />
                      <input 
                        type="url" 
                        name="linkedin" 
                        value={formData.linkedin} 
                        onChange={handleInputChange} 
                        disabled={!isEditing}
                        className={getInputClass('linkedin')} 
                        placeholder="https://linkedin.com/in/username" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Portfolio Website URL</label>
                    <div className="relative">
                      <Globe className={`absolute left-4 top-[17px] w-4 h-4 transition-colors ${isEditing ? 'text-[#f36c21]' : 'text-gray-600'}`} />
                      <input 
                        type="url" 
                        name="portfolio" 
                        value={formData.portfolio} 
                        onChange={handleInputChange} 
                        disabled={!isEditing}
                        className={getInputClass('portfolio')} 
                        placeholder="https://yourportfolio.com" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Resume Upload & Save actions */}
            <div className="space-y-8">
              
              {/* Resume Card */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#2A2A2A] shadow-xl space-y-6">
                <h2 className="text-lg font-bold text-[#183964] border-b border-[#2A2A2A] pb-4 tracking-tight flex items-center gap-2">
                  <FileText className="text-[#f36c21] w-5 h-5" /> Resume / CV
                </h2>

                <div 
                  onClick={() => {
                    if (isEditing) {
                      fileInputRef.current?.click();
                    }
                  }}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                    !isEditing
                      ? 'border-[#183964]/10 bg-white cursor-not-allowed opacity-80'
                      : file || profile?.resumeUrl 
                        ? 'border-[#f36c21] bg-[#f36c21]/5 cursor-pointer' 
                        : 'border-[#183964]/20 hover:border-[#f36c21]/50 bg-white cursor-pointer'
                  }`}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    disabled={!isEditing}
                    className="hidden" 
                  />

                  {file ? (
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="w-8 h-8 text-[#f36c21] mb-3" />
                      <p className="text-[#183964] font-medium text-xs truncate max-w-[180px]">{file.name}</p>
                      <p className="text-[#6b7280] text-[10px] mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      {isEditing && (
                        <button 
                          type="button" 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setFile(null); 
                            if (fileInputRef.current) fileInputRef.current.value = ''; 
                          }} 
                          className="mt-3 text-red-400 text-xs hover:underline"
                        >
                          Remove selection
                        </button>
                      )}
                    </div>
                  ) : profile?.resumeUrl ? (
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="w-8 h-8 text-[#f36c21] mb-3" />
                      <p className="text-[#183964] font-semibold text-xs text-[#f36c21]">Resume is Uploaded</p>
                      <a 
                        href={profile.resumeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        onClick={(e) => e.stopPropagation()} 
                        className="text-[#6b7280] hover:text-[#183964] hover:underline text-xs mt-1.5 inline-block"
                      >
                        View Saved Resume
                      </a>
                      {isEditing ? (
                        <p className="text-[#6b7280] text-[10px] mt-4 leading-relaxed">
                          Drag or click here to upload a new resume file
                        </p>
                      ) : (
                        <p className="text-[#6b7280] text-[10px] mt-4 leading-relaxed">
                          Enable edit mode to update resume
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4">
                      <div className="w-10 h-10 bg-[#f0f4f8] rounded-full flex items-center justify-center mb-3">
                        <Upload className="w-5 h-5 text-[#6b7280]" />
                      </div>
                      <p className="text-[#183964] font-medium text-xs mb-1">
                        {isEditing ? 'Upload Resume' : 'No Resume Uploaded'}
                      </p>
                      <p className="text-[#6b7280] text-[10px]">
                        {isEditing ? 'PDF, DOC or DOCX (max 5MB)' : 'Enable edit mode to upload'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons Card */}
              <div className="bg-white rounded-3xl p-6 border border-[#2A2A2A] shadow-xl space-y-4">
                {isEditing ? (
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full bg-[#f36c21] text-[#183964] font-bold py-4 rounded-xl hover:bg-[#e5a600] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#FFB800]/5 text-sm"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving changes...
                      </>
                    ) : (
                      'Save Profile'
                    )}
                  </button>
                ) : (
                  <button 
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-transparent border border-[#f36c21] text-[#f36c21] hover:bg-[#f36c21]/10 font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-md"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile Details
                  </button>
                )}
                <button 
                  type="button"
                  onClick={() => router.push('/')}
                  className="w-full border border-[#2A2A2A] text-[#183964] hover:bg-[#183964]/5 font-semibold py-3.5 rounded-xl transition-all duration-300 text-sm"
                >
                  Back to Careers
                </button>
              </div>

            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
