import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Loader2, Upload } from 'lucide-react';
import { getAuthHeader, uploadFileToServer } from '../utils/api';

export default function TestimonialManager({ showFeedback }) {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [form, setForm] = useState({ id: "", name: "", role: "", text: "", image: "", rating: 5 });
  const [testimonialFile, setTestimonialFile] = useState(null);
  const [testimonialPreview, setTestimonialPreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials`);
      setTestimonials(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showFeedback("File size must be under 5MB!", "error");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    if (testimonialPreview && testimonialPreview.startsWith("blob:")) {
      URL.revokeObjectURL(testimonialPreview);
    }
    setTestimonialFile(file);
    setTestimonialPreview(previewUrl);
    showFeedback("Avatar selected. It will upload when you save!");
  };

  const handleRemoveFile = () => {
    if (testimonialPreview && testimonialPreview.startsWith("blob:")) {
      URL.revokeObjectURL(testimonialPreview);
    }
    setTestimonialFile(null);
    setTestimonialPreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!testimonialFile && !form.image) {
      showFeedback("Please select an avatar image first!", "error");
      return;
    }

    setFormLoading(true);
    const config = getAuthHeader();
    if (!config) {
      setFormLoading(false);
      return;
    }

    let finalImageUrl = form.image;

    try {
      if (testimonialFile) {
        setUploadingImage(true);
        try {
          finalImageUrl = await uploadFileToServer(testimonialFile);
        } catch (uploadErr) {
          const errMsg = uploadErr.response?.data?.message || uploadErr.message || "Failed to upload to Cloudinary.";
          showFeedback(errMsg, "error");
          setUploadingImage(false);
          setFormLoading(false);
          return;
        }
        setUploadingImage(false);
      }

      if (isEditing) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials/${form.id}`, {
          name: form.name,
          role: form.role,
          text: form.text,
          rating: form.rating,
          image: finalImageUrl
        }, config);
        showFeedback("Testimonial updated successfully!");
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials`, {
          name: form.name,
          role: form.role,
          text: form.text,
          rating: form.rating,
          image: finalImageUrl
        }, config);
        showFeedback("Testimonial added successfully!");
      }
      
      handleRemoveFile();
      setForm({ id: "", name: "", role: "", text: "", image: "", rating: 5 });
      setIsEditing(false);
      fetchTestimonials();
    } catch (err) {
      showFeedback("Error saving testimonial", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (testi) => {
    setForm({ 
      id: testi._id, 
      name: testi.name, 
      role: testi.role, 
      text: testi.text, 
      image: testi.image,
      rating: testi.rating || 5
    });
    setTestimonialPreview(testi.image);
    setTestimonialFile(null);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    const config = getAuthHeader();
    if (!config) return;

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials/${id}`, config);
      showFeedback("Testimonial deleted successfully!");
      fetchTestimonials();
    } catch (err) {
      showFeedback("Error deleting testimonial", "error");
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setForm({ id: "", name: "", role: "", text: "", image: "", rating: 5 });
    handleRemoveFile();
  };

  return (
    <div className="space-y-6">
      <div className="bg-[var(--color-dark-card)] rounded-xl border border-[var(--color-dark-border)] overflow-hidden">
        <div className="p-6 border-b border-[var(--color-dark-border)] bg-[#f7f9fc]">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Plus className="h-5 w-5 text-[var(--color-yellow)]" />
            {isEditing ? "Edit Testimonial" : "Add Testimonial"}
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Client Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[var(--color-yellow)]"
                placeholder="e.g. Sarah Johnson"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Designation / Company</label>
              <input
                type="text"
                required
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[var(--color-yellow)]"
                placeholder="e.g. CEO, Global Real Estate"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Rating (1-5)</label>
            <input
              type="number"
              required
              min="1"
              max="5"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
              className="w-full md:w-32 bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[var(--color-yellow)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Testimonial Text</label>
            <textarea
              required
              rows="3"
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[var(--color-yellow)] resize-none"
              placeholder="What did the client say about your work?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Client Avatar (Upload)</label>
            <div className="flex gap-4 items-end">
              {testimonialPreview && (
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[var(--color-dark-border)] group">
                  <img src={testimonialPreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-[#183964]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={handleRemoveFile} className="text-red-400 hover:text-red-300">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
              <div className="flex-1">
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-[var(--color-dark-border)] rounded-lg cursor-pointer hover:border-[var(--color-yellow)] transition-colors bg-[var(--color-dark)]/50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-6 h-6 mb-2 text-[#6b7280]" />
                    <p className="text-xs text-[#6b7280]"><span className="font-semibold text-[#183964]">Upload Avatar</span></p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
                </label>
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t border-[var(--color-dark-border)]">
            <button
              type="submit"
              disabled={formLoading || uploadingImage}
              className="px-6 py-2.5 bg-[var(--color-yellow)] text-white font-semibold rounded-lg hover:bg-[#e5a600] disabled:opacity-50 flex items-center gap-2"
            >
              {(formLoading || uploadingImage) ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {uploadingImage ? "Uploading..." : isEditing ? "Update Testimonial" : "Add Testimonial"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-6 py-2.5 bg-[#f0f4f8] text-[#183964] font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-[var(--color-dark-card)] rounded-xl border border-[var(--color-dark-border)] overflow-hidden">
        <div className="p-6 border-b border-[var(--color-dark-border)] flex justify-between items-center">
          <h3 className="text-lg font-semibold">Current Testimonials ({testimonials.length})</h3>
        </div>
        {loading ? (
          <div className="p-12 flex justify-center text-[#6b7280]">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--color-yellow)]" />
          </div>
        ) : testimonials.length === 0 ? (
          <div className="p-12 text-center text-[#6b7280] border-t border-[var(--color-dark-border)]">
            No testimonials added yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {testimonials.map((testi) => (
              <div key={testi._id} className="p-6 rounded-xl border border-[var(--color-dark-border)] bg-[#f7f9fc] hover:border-[var(--color-yellow)]/30 transition-colors flex flex-col h-full group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <img src={testi.image} alt={testi.name} className="w-12 h-12 rounded-full object-cover border border-[var(--color-dark-border)]" />
                    <div>
                      <h4 className="font-bold text-[#183964]">{testi.name}</h4>
                      <p className="text-xs text-[var(--color-yellow)]">{testi.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(testi)} className="p-1.5 text-[#6b7280] hover:text-[var(--color-yellow)] hover:bg-[var(--color-yellow)]/10 rounded-lg transition-colors">
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => handleDelete(testi._id)} className="p-1.5 text-[#6b7280] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex text-[var(--color-yellow)] mb-3">
                  {[...Array(testi.rating || 5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                  {[...Array(5 - (testi.rating || 5))].map((_, i) => (
                    <span key={i} className="text-gray-600">★</span>
                  ))}
                </div>
                <p className="text-[#6b7280] text-sm leading-relaxed italic flex-1">"{testi.text}"</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
