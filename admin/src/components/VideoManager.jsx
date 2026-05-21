import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { getAuthHeader } from '../utils/api';

export default function VideoManager({ showFeedback }) {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFormUrl, setVideoFormUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchVideoUrl();
  }, []);

  const fetchVideoUrl = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/videoUrl`);
      if (res.data) {
        setVideoUrl(res.data.value);
        setVideoFormUrl(res.data.value);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    const config = getAuthHeader();
    if (!config) return;

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/videoUrl`, { value: videoFormUrl }, config);
      setVideoUrl(videoFormUrl);
      showFeedback("Video Showcase URL updated successfully!");
    } catch (err) {
      showFeedback("Error updating video URL", "error");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[var(--color-dark-card)] rounded-xl border border-[var(--color-dark-border)] overflow-hidden">
        <div className="p-6 border-b border-[var(--color-dark-border)] bg-[#1a1a1a]">
          <h3 className="text-lg font-semibold">Video Showcase</h3>
          <p className="text-sm text-gray-400 mt-1">Update the YouTube video shown on the homepage.</p>
        </div>
        
        {loading ? (
          <div className="p-12 flex justify-center text-gray-400">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--color-yellow)]" />
          </div>
        ) : (
          <div className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="flex gap-4">
              <input
                type="url"
                required
                value={videoFormUrl}
                onChange={(e) => setVideoFormUrl(e.target.value)}
                className="flex-1 bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[var(--color-yellow)]"
                placeholder="https://www.youtube.com/embed/..."
              />
              <button
                type="submit"
                disabled={formLoading}
                className="px-6 py-2.5 bg-[var(--color-yellow)] text-black font-semibold rounded-lg hover:bg-[#e5a600] disabled:opacity-50 min-w-[140px] flex justify-center items-center gap-2"
              >
                {formLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Video"}
              </button>
            </form>

            <div className="rounded-xl overflow-hidden border border-[var(--color-dark-border)] bg-black aspect-video relative">
              {videoUrl ? (
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={videoUrl}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  No video URL set
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
