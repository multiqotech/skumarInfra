"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Upload, Trash2, X, Plus } from "lucide-react";
import { getAuthHeader, uploadFileToServer } from "../utils/api";

export default function HeroImageManager() {
  const [heroImages, setHeroImages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchHeroImages();
  }, []);

  const showFeedback = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const fetchHeroImages = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/hero-images`);
      setHeroImages(res.data);
    } catch (err) {
      console.error(err);
      showFeedback("Failed to fetch hero images", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showFeedback("Image must be less than 5MB", "error");
        return;
      }
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const imageUrl = await uploadFileToServer(selectedFile);
      const config = getAuthHeader();
      
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/hero-images`,
        { image: imageUrl, order: heroImages.length },
        config
      );
      
      showFeedback("Hero image uploaded successfully!");
      setSelectedFile(null);
      setPreview("");
      fetchHeroImages();
    } catch (err) {
      console.error(err);
      showFeedback("Failed to upload image", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hero image?")) return;
    
    const config = getAuthHeader();
    if (!config) return;

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/hero-images/${id}`, config);
      showFeedback("Hero image deleted successfully!");
      fetchHeroImages();
    } catch (err) {
      console.error(err);
      showFeedback("Error deleting hero image", "error");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-[var(--color-dark-text)]">Loading hero images...</div>;
  }

  return (
    <div className="space-y-6">
      {message.text && (
        <div className={`p-4 rounded-xl text-sm font-bold ${
          message.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-[var(--color-yellow)]/10 text-[var(--color-yellow)]'
        }`}>
          {message.text}
        </div>
      )}

      <div className="bg-[var(--color-dark-card)] rounded-xl border border-[var(--color-dark-border)] p-6">
        <h3 className="text-xl font-bold text-white mb-4">Add New Hero Image</h3>
        
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="border-2 border-dashed border-[var(--color-dark-border)] rounded-xl p-8 text-center">
            {preview ? (
              <div className="relative inline-block w-full max-w-2xl">
                <img src={preview} alt="Preview" className="rounded-lg max-h-64 mx-auto object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreview("");
                  }}
                  className="absolute -top-3 -right-3 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div>
                <label className="cursor-pointer flex flex-col items-center">
                  <Upload className="w-12 h-12 text-[#6b7280] mx-auto mb-4 hover:text-[var(--color-yellow)] transition-colors" />
                  <span className="text-[var(--color-yellow)] font-bold hover:underline px-4 py-2">
                    Browse Files
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                </label>
                <p className="text-[#6b7280] text-sm mt-2">High resolution images (1920x1080 recommended)</p>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!selectedFile || isUploading}
              className="px-6 py-2 bg-[var(--color-yellow)] text-[var(--color-dark-bg)] font-bold rounded-lg hover:bg-[#e5a917] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isUploading ? "Uploading..." : <><Plus className="w-5 h-5" /> Add Image</>}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-[var(--color-dark-card)] rounded-xl border border-[var(--color-dark-border)] overflow-hidden p-6">
        <h3 className="text-xl font-bold text-white mb-6">Current Hero Images ({heroImages.length})</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {heroImages.length === 0 ? (
            <p className="text-[#6b7280] col-span-full text-center py-8">No hero images uploaded yet.</p>
          ) : (
            heroImages.map((img) => (
              <div key={img._id} className="relative group rounded-xl overflow-hidden border border-[var(--color-dark-border)] aspect-video bg-[#1a2332]">
                <img 
                  src={img.image} 
                  alt="Hero Preview" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => handleDelete(img._id)}
                    className="p-3 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-full transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
