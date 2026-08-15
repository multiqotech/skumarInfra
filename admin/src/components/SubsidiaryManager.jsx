import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Loader2, Upload, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { getAuthHeader, uploadFileToServer } from '../utils/api';

export default function SubsidiaryManager({ showFeedback }) {
  const [subsidiaries, setSubsidiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [form, setForm] = useState({ id: "", name: "", image: "", description: "", link: "" });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchSubsidiaries();
  }, []);

  const fetchSubsidiaries = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/subsidiaries`);
      setSubsidiaries(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.size > 5 * 1024 * 1024) {
      showFeedback("File size must be under 5MB!", "error");
      return;
    }

    const previewUrl = URL.createObjectURL(selectedFile);
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    setFile(selectedFile);
    setPreview(previewUrl);
    showFeedback("Image selected. It will upload when you save!");
  };

  const handleRemoveFile = () => {
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file && !form.image) {
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
      if (file) {
        setUploadingImage(true);
        try {
          finalImageUrl = await uploadFileToServer(file);
        } catch (uploadErr) {
          const errMsg = uploadErr.response?.data?.message || uploadErr.message || "Failed to upload image.";
          showFeedback(errMsg, "error");
          setUploadingImage(false);
          setFormLoading(false);
          return;
        }
        setUploadingImage(false);
      }

      const payload = {
        name: form.name,
        image: finalImageUrl,
        description: form.description,
        link: form.link
      };

      if (isEditing) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/subsidiaries/${form.id}`, payload, config);
        showFeedback("Subsidiary updated successfully!");
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/subsidiaries`, payload, config);
        showFeedback("Subsidiary added successfully!");
      }
      
      handleRemoveFile();
      setForm({ id: "", name: "", image: "", description: "", link: "" });
      setIsEditing(false);
      fetchSubsidiaries();
    } catch (err) {
      showFeedback("Error saving subsidiary", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (item) => {
    setForm({ id: item._id, name: item.name, image: item.image, description: item.description || "", link: item.link || "" });
    setPreview(item.image);
    setFile(null);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this subsidiary?")) return;
    const config = getAuthHeader();
    if (!config) return;

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/subsidiaries/${id}`, config);
      showFeedback("Subsidiary deleted successfully!");
      fetchSubsidiaries();
    } catch (err) {
      showFeedback("Error deleting subsidiary", "error");
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setForm({ id: "", name: "", image: "", description: "", link: "" });
    handleRemoveFile();
  };

  return (
    <div className="space-y-6">
      <div className="bg-[var(--color-dark-card)] rounded-xl border border-[var(--color-dark-border)] overflow-hidden">
        <div className="p-6 border-b border-[var(--color-dark-border)] bg-[#f7f9fc]">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Plus className="h-5 w-5 text-[var(--color-yellow)]" />
            {isEditing ? "Edit Subsidiary" : "Add Subsidiary"}
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
                placeholder="e.g. S Kumar Green Energy India Private Limited"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Website Link</label>
              <input
                type="url"
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[var(--color-yellow)]"
                placeholder="e.g. https://www.example.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              rows="4"
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[var(--color-yellow)] resize-y"
              placeholder="Enter detailed description..."
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image (Upload)</label>
            <div className="flex gap-4 items-end">
              {preview && (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-[var(--color-dark-border)] group">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
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
                    <p className="text-sm text-[#6b7280]"><span className="font-semibold text-[#183964]">Click to upload image</span></p>
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
              {uploadingImage ? "Uploading Image..." : isEditing ? "Update Subsidiary" : "Add Subsidiary"}
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
          <h3 className="text-lg font-semibold">Current Subsidiaries ({subsidiaries.length})</h3>
        </div>
        {loading ? (
          <div className="p-12 flex justify-center text-[#6b7280]">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--color-yellow)]" />
          </div>
        ) : subsidiaries.length === 0 ? (
          <div className="p-12 text-center text-[#6b7280] border-t border-[var(--color-dark-border)]">
            No subsidiaries added yet.
          </div>
        ) : (
          <DragDropContext onDragEnd={async (result) => {
            if (!result.destination) return;
            const updatedSubsidiaries = Array.from(subsidiaries);
            const [reorderedSubsidiary] = updatedSubsidiaries.splice(result.source.index, 1);
            updatedSubsidiaries.splice(result.destination.index, 0, reorderedSubsidiary);
            
            const reorderedWithOrder = updatedSubsidiaries.map((item, index) => ({ ...item, order: index }));
            setSubsidiaries(reorderedWithOrder);
            
            try {
              const config = getAuthHeader();
              await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/subsidiaries/reorder`, {
                items: reorderedWithOrder.map(i => ({ id: i._id, order: i.order }))
              }, config);
            } catch (err) {
              console.error(err);
              showFeedback("Failed to save new order", "error");
              fetchSubsidiaries();
            }
          }}>
            <Droppable droppableId="subsidiaries" direction="vertical">
              {(provided) => (
                <div 
                  className="divide-y divide-[var(--color-dark-border)]"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {subsidiaries.map((item, index) => (
                    <Draggable key={item._id} draggableId={item._id} index={index}>
                      {(provided) => (
                        <div 
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="p-6 flex items-center gap-6 hover:bg-[var(--color-dark)]/50 transition-colors bg-[var(--color-dark-card)]"
                        >
                          <div 
                            {...provided.dragHandleProps} 
                            className="flex items-center justify-center text-[#6b7280] hover:text-[var(--color-yellow)] cursor-grab p-2"
                          >
                            <GripVertical className="h-5 w-5" />
                          </div>
                          <div className="w-24 h-24 rounded-lg overflow-hidden border border-[var(--color-dark-border)] flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-[#183964]">{item.name}</h4>
                            {item.link && (
                              <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-[var(--color-yellow)] text-sm hover:underline block mt-1">
                                {item.link}
                              </a>
                            )}
                            {item.description && (
                              <p className="text-[#6b7280] text-sm mt-1 line-clamp-3">{item.description}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleEdit(item)} className="p-2 text-[#6b7280] hover:text-[var(--color-yellow)] hover:bg-[var(--color-yellow)]/10 rounded-lg transition-colors">
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDelete(item._id)} className="p-2 text-[#6b7280] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </div>
  );
}
