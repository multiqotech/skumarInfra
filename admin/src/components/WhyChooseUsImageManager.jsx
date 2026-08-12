"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Upload, X, Save } from "lucide-react";
import { getAuthHeader, uploadFileToServer } from "../utils/api";

export default function WhyChooseUsImageManager() {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [currentImage, setCurrentImage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchImage();
  }, []);

  const showFeedback = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const fetchImage = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/why_choose_us_image`);
      if (res.data && res.data.value) {
        setCurrentImage(res.data.value);
        setPreview(res.data.value);
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        console.log("Setting not found, using default empty state");
      } else {
        console.error("Failed to fetch image", err);
      }
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

  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedFile && preview === currentImage) {
      showFeedback("No changes to save.", "error");
      return;
    }

    setIsSaving(true);
    try {
      let finalImageUrl = preview;
      if (selectedFile) {
        finalImageUrl = await uploadFileToServer(selectedFile);
      }

      const config = getAuthHeader();
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/settings/why_choose_us_image`,
        { value: finalImageUrl },
        config
      );
      
      showFeedback("Why Choose Us image updated successfully!");
      setCurrentImage(finalImageUrl);
      setSelectedFile(null);
    } catch (err) {
      console.error(err);
      showFeedback("Failed to save image", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-[var(--color-dark-text)]">Loading...</div>;
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
        <h3 className="text-xl font-bold text-white mb-4">Why Choose Us Image</h3>
        
        <form onSubmit={handleSave} className="space-y-4">
          <div className="border-2 border-dashed border-[var(--color-dark-border)] rounded-xl p-8 text-center">
            {preview ? (
              <div className="relative inline-block w-full max-w-2xl">
                <img src={preview} alt="Preview" className="rounded-lg max-h-96 mx-auto object-cover" />
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
                <p className="text-[#6b7280] text-sm mt-2">Recommended size: Portrait image (e.g. 800x1200px)</p>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={(!selectedFile && preview === currentImage) || isSaving || !preview}
              className="px-6 py-2 bg-[var(--color-yellow)] text-[var(--color-dark-bg)] font-bold rounded-lg hover:bg-[#e5a917] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving ? "Saving..." : <><Save className="w-5 h-5" /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
