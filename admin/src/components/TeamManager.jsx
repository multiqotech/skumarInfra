import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Loader2, Upload } from 'lucide-react';
import { getAuthHeader, uploadFileToServer } from '../utils/api';

export default function TeamManager({ showFeedback }) {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [form, setForm] = useState({ id: "", name: "", role: "", image: "", description: "" });
  const [teamFile, setTeamFile] = useState(null);
  const [teamPreview, setTeamPreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/team`);
      setTeam(res.data);
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
    if (teamPreview && teamPreview.startsWith("blob:")) {
      URL.revokeObjectURL(teamPreview);
    }
    setTeamFile(file);
    setTeamPreview(previewUrl);
    showFeedback("Image selected. It will upload when you save!");
  };

  const handleRemoveFile = () => {
    if (teamPreview && teamPreview.startsWith("blob:")) {
      URL.revokeObjectURL(teamPreview);
    }
    setTeamFile(null);
    setTeamPreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!teamFile && !form.image) {
      showFeedback("Please select an image file first!", "error");
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
      if (teamFile) {
        setUploadingImage(true);
        try {
          finalImageUrl = await uploadFileToServer(teamFile);
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
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/team/${form.id}`, {
          name: form.name,
          role: form.role,
          image: finalImageUrl,
          description: form.description
        }, config);
        showFeedback("Team member updated successfully!");
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/team`, {
          name: form.name,
          role: form.role,
          image: finalImageUrl,
          description: form.description
        }, config);
        showFeedback("Team member added successfully!");
      }
      
      handleRemoveFile();
      setForm({ id: "", name: "", role: "", image: "", description: "" });
      setIsEditing(false);
      fetchTeam();
    } catch (err) {
      showFeedback("Error saving team member", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (member) => {
    setForm({ id: member._id, name: member.name, role: member.role, image: member.image, description: member.description || "" });
    setTeamPreview(member.image);
    setTeamFile(null);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this member?")) return;
    const config = getAuthHeader();
    if (!config) return;

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/team/${id}`, config);
      showFeedback("Team member deleted successfully!");
      fetchTeam();
    } catch (err) {
      showFeedback("Error deleting team member", "error");
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setForm({ id: "", name: "", role: "", image: "", description: "" });
    handleRemoveFile();
  };

  return (
    <div className="space-y-6">
      <div className="bg-[var(--color-dark-card)] rounded-xl border border-[var(--color-dark-border)] overflow-hidden">
        <div className="p-6 border-b border-[var(--color-dark-border)] bg-[#f7f9fc]">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Plus className="h-5 w-5 text-[var(--color-yellow)]" />
            {isEditing ? "Edit Team Member" : "Add Team Member"}
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[var(--color-yellow)]"
                placeholder="e.g. John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Designation</label>
              <input
                type="text"
                required
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[var(--color-yellow)]"
                placeholder="e.g. Chief Architect"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Description <span className="text-[#6b7280] font-normal text-xs">(Recommended: max 100 words)</span>
            </label>
            <textarea
              rows="3"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[var(--color-yellow)] resize-none"
              placeholder="Enter a brief description..."
            ></textarea>
            <div className="text-xs mt-1 text-right text-[#6b7280]">
              {form.description ? form.description.split(/\s+/).filter(word => word.length > 0).length : 0} words
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Photo (Upload)</label>
            <div className="flex gap-4 items-end">
              {teamPreview && (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-[var(--color-dark-border)] group">
                  <img src={teamPreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-[#183964]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={handleRemoveFile} className="text-red-400 hover:text-red-300">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
              <div className="flex-1">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[var(--color-dark-border)] rounded-lg cursor-pointer hover:border-[var(--color-yellow)] transition-colors bg-[var(--color-dark)]/50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-[#6b7280]" />
                    <p className="text-sm text-[#6b7280]"><span className="font-semibold text-[#183964]">Click to upload</span></p>
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
              {uploadingImage ? "Uploading Image..." : isEditing ? "Update Member" : "Add Member"}
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
          <h3 className="text-lg font-semibold">Current Team ({team.length})</h3>
        </div>
        {loading ? (
          <div className="p-12 flex justify-center text-[#6b7280]">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--color-yellow)]" />
          </div>
        ) : team.length === 0 ? (
          <div className="p-12 text-center text-[#6b7280] border-t border-[var(--color-dark-border)]">
            No team members added yet.
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-dark-border)]">
            {team.map((member) => (
              <div key={member._id} className="p-6 flex items-center gap-6 hover:bg-[var(--color-dark)]/50 transition-colors">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[var(--color-yellow)] flex-shrink-0">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-[#183964]">{member.name}</h4>
                  <p className="text-[var(--color-yellow)] text-sm">{member.role}</p>
                  {member.description && (
                    <p className="text-[#6b7280] text-sm mt-1 line-clamp-2">{member.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(member)} className="p-2 text-[#6b7280] hover:text-[var(--color-yellow)] hover:bg-[var(--color-yellow)]/10 rounded-lg transition-colors">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(member._id)} className="p-2 text-[#6b7280] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
