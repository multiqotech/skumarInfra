import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContactInfoManager = () => {
  const [formData, setFormData] = useState({
    companyAddress: '',
    tollFreeNumber: '',
    availability: '',
    internationalNumber: '',
    internationalAvailability: '',
    email: '',
    tagline: ''
  });
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
          tagline: res.data.tagline || ''
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
      const config = { withCredentials: true };
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/contact-info`, formData, config);
      setMessage('Contact Information saved successfully!');
    } catch (error) {
      console.error('Error saving contact info:', error);
      setMessage('Failed to save contact info.');
    }
    setSaving(false);
  };

  if (loading) return <div>Loading contact information...</div>;

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6">Manage Contact Information</h2>
      
      {message && (
        <div className={`p-4 mb-6 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company Address (supports multi-line)</label>
          <textarea
            name="companyAddress"
            value={formData.companyAddress}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="e.g. Larsen & Toubro Limited\nMount Poonamallee Road..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Toll Free Number</label>
            <input
              type="text"
              name="tollFreeNumber"
              value={formData.tollFreeNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 1800 209 4545"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Toll Free Availability</label>
            <input
              type="text"
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Available from: 8 am to 8 pm IST"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">International Number</label>
            <input
              type="text"
              name="internationalNumber"
              value={formData.internationalNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. +91 22 6752 5899"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">International Availability</label>
            <input
              type="text"
              name="internationalAvailability"
              value={formData.internationalAvailability}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Available from: 2:30 am to 2:30 pm GMT"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Addresses (separated by / if multiple)</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. infodesk@larsentoubro.com / info@lntecc.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bottom Tagline / Disclaimer (supports multi-line)</label>
          <textarea
            name="tagline"
            value={formData.tagline}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="(Mails to this Email ID will be forwarded to the concerned department...)"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Contact Information'}
        </button>
      </form>
    </div>
  );
};

export default ContactInfoManager;
