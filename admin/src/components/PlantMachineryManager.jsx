import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Loader2, Upload } from 'lucide-react';
import { getAuthHeader, uploadFileToServer } from '../utils/api';

export default function PlantMachineryManager({ showFeedback }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [form, setForm] = useState({ id: "", type: "Plant", name: "", image: "", description: "", quantity: "" });
  const [itemFile, setItemFile] = useState(null);
  const [itemPreview, setItemPreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/plant-machinery`);
      setItems(res.data);
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
    if (itemPreview && itemPreview.startsWith("blob:")) {
      URL.revokeObjectURL(itemPreview);
    }
    setItemFile(file);
    setItemPreview(previewUrl);
    showFeedback("Image selected. It will upload when you save!");
  };

  const handleRemoveFile = () => {
    if (itemPreview && itemPreview.startsWith("blob:")) {
      URL.revokeObjectURL(itemPreview);
    }
    setItemFile(null);
    setItemPreview("");
  };

  const countWords = (str) => {
    if (!str) return 0;
    return str.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const handleDescriptionChange = (e) => {
    const text = e.target.value;
    const words = countWords(text);
    if (words > 50) {
      showFeedback("Maximum 50 words allowed for description.", "error");
      return;
    }
    setForm({ ...form, description: text });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!itemFile && !form.image) {
      showFeedback("Please select an image file first!", "error");
      return;
    }

    if (countWords(form.description) > 50) {
      showFeedback("Description exceeds 50 words limit.", "error");
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
      if (itemFile) {
        setUploadingImage(true);
        try {
          finalImageUrl = await uploadFileToServer(itemFile);
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
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/plant-machinery/${form.id}`, {
          type: form.type,
          name: form.name,
          quantity: Number(form.quantity),
          image: finalImageUrl,
          description: form.description
        }, config);
        showFeedback("Item updated successfully!");
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/plant-machinery`, {
          type: form.type,
          name: form.name,
          quantity: Number(form.quantity),
          image: finalImageUrl,
          description: form.description
        }, config);
        showFeedback("Item added successfully!");
      }
      
      handleRemoveFile();
      setForm({ id: "", type: "Plant", name: "", quantity: "", image: "", description: "" });
      setIsEditing(false);
      fetchItems();
    } catch (err) {
      const serverMsg = err.response?.data?.message || "Error saving item";
      showFeedback(serverMsg, "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (item) => {
    setForm({ 
      id: item._id, 
      type: item.type, 
      name: item.name, 
      quantity: item.quantity, 
      image: item.image, 
      description: item.description || "" 
    });
    setItemPreview(item.image);
    setItemFile(null);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    const config = getAuthHeader();
    if (!config) return;

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/plant-machinery/${id}`, config);
      showFeedback("Item deleted successfully!");
      fetchItems();
    } catch (err) {
      showFeedback("Error deleting item", "error");
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setForm({ id: "", type: "Plant", name: "", quantity: "", image: "", description: "" });
    handleRemoveFile();
  };

  return (
    <div className="space-y-6">
      <div className="bg-[var(--color-dark-card)] rounded-xl border border-[var(--color-dark-border)] overflow-hidden">
        <div className="p-6 border-b border-[var(--color-dark-border)] bg-[#1a1a1a]">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Plus className="h-5 w-5 text-[var(--color-yellow)]" />
            {isEditing ? "Edit Plant / Machinery" : "Add Plant / Machinery"}
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                required
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[var(--color-yellow)]"
              >
                <option value="Plant">Plant</option>
                <option value="Machinery">Machinery</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[var(--color-yellow)]"
                placeholder="e.g. Concrete Mixer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Quantity</label>
              <input
                type="number"
                min="0"
                required
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[var(--color-yellow)]"
                placeholder="e.g. 5"
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium">Short Description</label>
              <span className={`text-xs ${countWords(form.description) >= 50 ? 'text-red-400' : 'text-gray-400'}`}>
                {countWords(form.description)} / 50 words
              </span>
            </div>
            <textarea
              rows="3"
              required
              value={form.description}
              onChange={handleDescriptionChange}
              className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[var(--color-yellow)] resize-y"
              placeholder="Brief description of the equipment..."
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Photo (Upload)</label>
            <div className="flex gap-4 items-end">
              {itemPreview && (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-[var(--color-dark-border)] group">
                  <img src={itemPreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={handleRemoveFile} className="text-red-400 hover:text-red-300">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
              <div className="flex-1">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[var(--color-dark-border)] rounded-lg cursor-pointer hover:border-[var(--color-yellow)] transition-colors bg-[var(--color-dark)]/50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="text-sm text-gray-400"><span className="font-semibold text-white">Click to upload</span></p>
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
              className="px-6 py-2.5 bg-[var(--color-yellow)] text-black font-semibold rounded-lg hover:bg-[#e5a600] disabled:opacity-50 flex items-center gap-2"
            >
              {(formLoading || uploadingImage) ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {uploadingImage ? "Uploading Image..." : isEditing ? "Update Item" : "Add Item"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-6 py-2.5 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-[var(--color-dark-card)] rounded-xl border border-[var(--color-dark-border)] overflow-hidden">
        <div className="p-6 border-b border-[var(--color-dark-border)] flex justify-between items-center">
          <h3 className="text-lg font-semibold">Current Items ({items.length})</h3>
        </div>
        {loading ? (
          <div className="p-12 flex justify-center text-gray-400">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--color-yellow)]" />
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-gray-400 border-t border-[var(--color-dark-border)]">
            No plants or machinery added yet.
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-dark-border)]">
            {items.map((item) => (
              <div key={item._id} className="p-6 flex items-center gap-6 hover:bg-[var(--color-dark)]/50 transition-colors">
                <div className="w-24 h-24 rounded-lg overflow-hidden border border-[var(--color-dark-border)] flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="text-lg font-bold text-white">{item.name}</h4>
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#FFB800]/20 text-[#FFB800]">
                      {item.type}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-800 text-gray-300">
                      Qty: {item.quantity}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-gray-400 text-sm mt-2 line-clamp-2">{item.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(item)} className="p-2 text-gray-400 hover:text-[var(--color-yellow)] hover:bg-[var(--color-yellow)]/10 rounded-lg transition-colors">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(item._id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
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
