import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { uploadFileToServer, getAuthHeader } from '../utils/api';

const ContactInfoManager = () => {
  const [formData, setFormData] = useState({
    companyAddress: '',
    tollFreeNumber: '',
    availability: '',
    internationalNumber: '',
    internationalAvailability: '',
    email: '',
    tagline: '',
    linkedin: '',
    twitter: '',
    facebook: '',
    instagram: '',
    qrCodeImage: ''
  });
  const [qrFile, setQrFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const fetchContactInfo = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/contact-info`);
      if (res.data) {
        setFormData({
          companyAddress: res.data.companyAddress || '',
          tollFreeNumber: res.data.tollFreeNumber || '',
          availability: res.data.availability || '',
          internationalNumber: res.data.internationalNumber || '',
          internationalAvailability: res.data.internationalAvailability || '',
          email: res.data.email || '',
          tagline: res.data.tagline || '',
          linkedin: res.data.linkedin || '',
          twitter: res.data.twitter || '',
          facebook: res.data.facebook || '',
          instagram: res.data.instagram || '',
          qrCodeImage: res.data.qrCodeImage || ''
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contact info:', error);
      setMessage('Failed to load contact info.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      let finalQrUrl = formData.qrCodeImage;
      if (qrFile) {
        finalQrUrl = await uploadFileToServer(qrFile);
      }

      const payload = { ...formData, qrCodeImage: finalQrUrl };
      const config = getAuthHeader();
      
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/contact-info`, payload, config);
      setMessage('Contact Information saved successfully!');
      
      // Update form data state with the uploaded url if any
      setFormData(prev => ({ ...prev, qrCodeImage: finalQrUrl }));
      setQrFile(null); // Clear file selection
    } catch (error) {
      console.error('Error saving contact info:', error);
      setMessage('Failed to save contact info.');
    }
    setSaving(false);
  };

  if (loading) return <div>Loading contact information...</div>;

  return (
    <div className="bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] p-6 rounded-xl shadow-md text-[#183964]">
      <h2 className="text-2xl font-bold mb-6">Manage Contact Information</h2>
      
      {message && (
        <div className={`p-4 mb-6 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#4b5563] mb-1">Company Address (supports multi-line)</label>
          <textarea
            name="companyAddress"
            value={formData.companyAddress}
            onChange={handleChange}
            className="w-full bg-[var(--color-dark)] text-[#183964] border border-[var(--color-dark-border)] p-2 rounded focus:outline-none focus:ring-1 focus:ring-[var(--color-yellow)]"
            rows="3"
            placeholder="e.g. Larsen & Toubro Limited\nMount Poonamallee Road..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#4b5563] mb-1">Toll Free Number</label>
            <input
              type="text"
              name="tollFreeNumber"
              value={formData.tollFreeNumber}
              onChange={handleChange}
              className="w-full bg-[var(--color-dark)] text-[#183964] border border-[var(--color-dark-border)] p-2 rounded focus:outline-none focus:ring-1 focus:ring-[var(--color-yellow)]"
              placeholder="e.g. 1800 209 4545"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#4b5563] mb-1">Toll Free Availability</label>
            <input
              type="text"
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              className="w-full bg-[var(--color-dark)] text-[#183964] border border-[var(--color-dark-border)] p-2 rounded focus:outline-none focus:ring-1 focus:ring-[var(--color-yellow)]"
              placeholder="e.g. Available from: 8 am to 8 pm IST"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4b5563] mb-1">International Number</label>
            <input
              type="text"
              name="internationalNumber"
              value={formData.internationalNumber}
              onChange={handleChange}
              className="w-full bg-[var(--color-dark)] text-[#183964] border border-[var(--color-dark-border)] p-2 rounded focus:outline-none focus:ring-1 focus:ring-[var(--color-yellow)]"
              placeholder="e.g. +91 22 6752 5899"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#4b5563] mb-1">International Availability</label>
            <input
              type="text"
              name="internationalAvailability"
              value={formData.internationalAvailability}
              onChange={handleChange}
              className="w-full bg-[var(--color-dark)] text-[#183964] border border-[var(--color-dark-border)] p-2 rounded focus:outline-none focus:ring-1 focus:ring-[var(--color-yellow)]"
              placeholder="e.g. Available from: 2:30 am to 2:30 pm GMT"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#4b5563] mb-1">Email Addresses (separated by / if multiple)</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-[var(--color-dark)] text-[#183964] border border-[var(--color-dark-border)] p-2 rounded focus:outline-none focus:ring-1 focus:ring-[var(--color-yellow)]"
            placeholder="e.g. infodesk@larsentoubro.com / info@lntecc.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#4b5563] mb-1">Bottom Tagline / Disclaimer (supports multi-line)</label>
          <textarea
            name="tagline"
            value={formData.tagline}
            onChange={handleChange}
            className="w-full bg-[var(--color-dark)] text-[#183964] border border-[var(--color-dark-border)] p-2 rounded focus:outline-none focus:ring-1 focus:ring-[var(--color-yellow)]"
            rows="3"
            placeholder="(Mails to this Email ID will be forwarded to the concerned department...)"
          />
        </div>

        <h3 className="text-xl font-bold mt-8 mb-4 border-b border-[var(--color-dark-border)] pb-2">Social Media Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#4b5563] mb-1">LinkedIn URL</label>
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              className="w-full bg-[var(--color-dark)] text-[#183964] border border-[var(--color-dark-border)] p-2 rounded focus:outline-none focus:ring-1 focus:ring-[var(--color-yellow)]"
              placeholder="https://linkedin.com/company/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#4b5563] mb-1">Twitter (X) URL</label>
            <input
              type="url"
              name="twitter"
              value={formData.twitter}
              onChange={handleChange}
              className="w-full bg-[var(--color-dark)] text-[#183964] border border-[var(--color-dark-border)] p-2 rounded focus:outline-none focus:ring-1 focus:ring-[var(--color-yellow)]"
              placeholder="https://twitter.com/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#4b5563] mb-1">Facebook URL</label>
            <input
              type="url"
              name="facebook"
              value={formData.facebook}
              onChange={handleChange}
              className="w-full bg-[var(--color-dark)] text-[#183964] border border-[var(--color-dark-border)] p-2 rounded focus:outline-none focus:ring-1 focus:ring-[var(--color-yellow)]"
              placeholder="https://facebook.com/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#4b5563] mb-1">Instagram URL</label>
            <input
              type="url"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              className="w-full bg-[var(--color-dark)] text-[#183964] border border-[var(--color-dark-border)] p-2 rounded focus:outline-none focus:ring-1 focus:ring-[var(--color-yellow)]"
              placeholder="https://instagram.com/..."
            />
          </div>
        </div>

        <h3 className="text-xl font-bold mt-8 mb-4 border-b border-[var(--color-dark-border)] pb-2">Get Directions QR Code</h3>
        <div className="bg-[var(--color-dark)] p-4 rounded border border-[var(--color-dark-border)]">
          <label className="block text-sm font-medium text-[#4b5563] mb-2">QR Code Image</label>
          {formData.qrCodeImage && !qrFile && (
            <div className="mb-4">
              <img src={formData.qrCodeImage} alt="QR Code" className="w-32 h-32 object-cover border rounded" />
              <p className="text-xs text-[#6b7280] mt-1">Current Image</p>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setQrFile(e.target.files[0])}
            className="w-full"
          />
          <p className="text-sm text-[#6b7280] mt-2">Upload a QR code image to show directions to your corporate office.</p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-[var(--color-yellow)] text-white font-bold px-6 py-2 rounded hover:bg-[#f36c21] transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Contact Information'}
        </button>
      </form>
    </div>
  );
};

export default ContactInfoManager;
