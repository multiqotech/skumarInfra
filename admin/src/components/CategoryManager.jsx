import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Loader2, Upload, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { getAuthHeader, uploadFileToServer } from '../utils/api';

export default function CategoryManager({ showFeedback }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [form, setForm] = useState({
    id: "",
    name: "",
    tagline: "",
    description: "",
    heroImage: "",
    descriptionImage: ""
  });

  const [heroFile, setHeroFile] = useState(null);
  const [heroPreview, setHeroPreview] = useState("");
  const [descFile, setDescFile] = useState(null);
  const [descPreview, setDescPreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      showFeedback("Failed to fetch categories", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showFeedback("File size must be under 5MB!", "error");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    if (type === 'hero') {
      if (heroPreview && heroPreview.startsWith("blob:")) URL.revokeObjectURL(heroPreview);
      setHeroFile(file);
      setHeroPreview(previewUrl);
    } else {
      if (descPreview && descPreview.startsWith("blob:")) URL.revokeObjectURL(descPreview);
      setDescFile(file);
      setDescPreview(previewUrl);
    }
    showFeedback("Image selected. It will upload when you save!");
  };

  const handleRemoveFile = (type) => {
    if (type === 'hero') {
      if (heroPreview && heroPreview.startsWith("blob:")) URL.revokeObjectURL(heroPreview);
      setHeroFile(null);
      setHeroPreview("");
    } else {
      if (descPreview && descPreview.startsWith("blob:")) URL.revokeObjectURL(descPreview);
      setDescFile(null);
      setDescPreview("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) {
      showFeedback("Category name is required!", "error");
      return;
    }

    setFormLoading(true);
    const config = getAuthHeader();
    if (!config) {
      setFormLoading(false);
      return;
    }

    let finalHeroUrl = form.heroImage;
    let finalDescUrl = form.descriptionImage;

    try {
      setUploadingImage(true);
      if (heroFile) {
        finalHeroUrl = await uploadFileToServer(heroFile);
      }
      if (descFile) {
        finalDescUrl = await uploadFileToServer(descFile);
      }
      setUploadingImage(false);

      const payload = {
        name: form.name,
        tagline: form.tagline,
        description: form.description,
        heroImage: finalHeroUrl,
        descriptionImage: finalDescUrl
      };

      if (isEditing) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/${form.id}`, payload, config);
        showFeedback("Category updated successfully!");
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, payload, config);
        showFeedback("Category added successfully!");
      }

      handleRemoveFile('hero');
      handleRemoveFile('desc');
      setForm({ id: "", name: "", tagline: "", description: "", heroImage: "", descriptionImage: "" });
      setIsEditing(false);
      fetchCategories();
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Error saving category";
      showFeedback(errMsg, "error");
      setUploadingImage(false);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (category) => {
    setForm({
      id: category._id,
      name: category.name,
      tagline: category.tagline || "",
      description: category.description || "",
      heroImage: category.heroImage || "",
      descriptionImage: category.descriptionImage || ""
    });
    setHeroPreview(category.heroImage || "");
    setHeroFile(null);
    setDescPreview(category.descriptionImage || "");
    setDescFile(null);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category? This will not delete the projects inside it, but they might not be visible under any category.")) return;
    const config = getAuthHeader();
    if (!config) return;

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/${id}`, config);
      showFeedback("Category deleted successfully!");
      fetchCategories();
    } catch (err) {
      showFeedback("Error deleting category", "error");
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setForm({ id: "", name: "", tagline: "", description: "", heroImage: "", descriptionImage: "" });
    handleRemoveFile('hero');
    handleRemoveFile('desc');
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    const items = Array.from(categories);
    const [reorderedItem] = items.splice(sourceIndex, 1);
    items.splice(destinationIndex, 0, reorderedItem);

    setCategories(items);

    const config = getAuthHeader();
    if (!config) return;

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories/reorder`,
        { orderedIds: items.map(c => c._id) },
        config
      );
    } catch (err) {
      console.error(err);
      showFeedback("Error saving new order", "error");
      fetchCategories();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[var(--color-dark-card)] p-4 rounded-xl border border-[var(--color-dark-border)]">
        <h2 className="text-xl font-bold">Manage "We Build" Categories</h2>
      </div>

      <div className="bg-[var(--color-dark-card)] rounded-xl border border-[var(--color-dark-border)] overflow-hidden">
        <div className="p-6 border-b border-[var(--color-dark-border)] bg-[#f7f9fc]">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Plus className="h-5 w-5 text-[var(--color-yellow)]" />
            {isEditing ? "Edit Category" : "Add New Category"}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[var(--color-yellow)] transition-colors"
              placeholder="e.g. Airports"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Tagline</label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[var(--color-yellow)] transition-colors"
              placeholder="e.g. Building Pathways to a Better Future"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              rows="4"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[var(--color-yellow)] transition-colors resize-none"
              placeholder="Detailed description of the category..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Hero Image (Upload)</label>
              <div className="flex gap-4 items-end">
                {heroPreview && (
                  <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-[var(--color-dark-border)] group">
                    <img src={heroPreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-[#183964]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button type="button" onClick={() => handleRemoveFile('hero')} className="text-red-400 hover:text-red-300">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
                <div className="flex-1">
                  <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-[var(--color-dark-border)] rounded-lg cursor-pointer hover:border-[var(--color-yellow)] transition-colors bg-[var(--color-dark)]/50">
                    <div className="flex flex-col items-center justify-center">
                      <Upload className="w-6 h-6 mb-1 text-[#6b7280]" />
                      <p className="text-xs text-[#6b7280]"><span className="font-semibold text-[#183964]">Upload</span></p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileSelect(e, 'hero')} />
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description Image (Upload)</label>
              <div className="flex gap-4 items-end">
                {descPreview && (
                  <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-[var(--color-dark-border)] group">
                    <img src={descPreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-[#183964]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button type="button" onClick={() => handleRemoveFile('desc')} className="text-red-400 hover:text-red-300">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
                <div className="flex-1">
                  <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-[var(--color-dark-border)] rounded-lg cursor-pointer hover:border-[var(--color-yellow)] transition-colors bg-[var(--color-dark)]/50">
                    <div className="flex flex-col items-center justify-center">
                      <Upload className="w-6 h-6 mb-1 text-[#6b7280]" />
                      <p className="text-xs text-[#6b7280]"><span className="font-semibold text-[#183964]">Upload</span></p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileSelect(e, 'desc')} />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-[var(--color-dark-border)]">
            <button
              type="submit"
              disabled={formLoading || uploadingImage}
              className="px-6 py-2.5 bg-[var(--color-yellow)] text-white font-semibold rounded-lg hover:bg-[#e5a600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {(formLoading || uploadingImage) ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {uploadingImage ? "Uploading..." : isEditing ? "Update Category" : "Add Category"}
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
          <h3 className="text-lg font-semibold">Current Categories</h3>
        </div>
        
        {loading ? (
          <div className="p-12 flex justify-center text-[#6b7280]">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--color-yellow)]" />
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center text-[#6b7280] border-t border-[var(--color-dark-border)]">
            <p>No categories added yet.</p>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="categoriesList">
              {(provided) => (
                <div 
                  className="divide-y divide-[var(--color-dark-border)]"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {categories.map((category, index) => (
                    <Draggable key={category._id} draggableId={category._id} index={index}>
                      {(provided, snapshot) => (
                        <div 
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`p-6 flex flex-col md:flex-row gap-6 hover:bg-[var(--color-dark)]/50 transition-colors ${
                            snapshot.isDragging ? 'bg-[var(--color-dark)] shadow-2xl z-50' : ''
                          }`}
                        >
                          <div 
                            {...provided.dragHandleProps} 
                            className="flex items-center justify-center cursor-grab text-[#6b7280] hover:text-[var(--color-yellow)]"
                          >
                            <GripVertical size={24} />
                          </div>

                          <div className="w-full md:w-32 h-24 flex-shrink-0 relative rounded-lg overflow-hidden border border-[var(--color-dark-border)]">
                            {category.heroImage ? (
                              <img src={category.heroImage} alt={category.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-[#f0f4f8] flex items-center justify-center text-[#6b7280] text-xs">No Hero</div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="text-lg font-bold text-[#183964]">{category.name}</h4>
                                <p className="text-xs font-mono text-[#6b7280]">/{category.slug}</p>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => handleEdit(category)} className="p-2 text-[#6b7280] hover:text-[var(--color-yellow)] hover:bg-[var(--color-yellow)]/10 rounded-lg transition-colors">
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button onClick={() => handleDelete(category._id)} className="p-2 text-[#6b7280] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            
                            <div className="mt-2 text-sm">
                              <div className="text-[#6b7280] line-clamp-2">{category.tagline || 'No tagline'}</div>
                              <div className="mt-2 text-[var(--color-yellow)] text-xs font-semibold">
                                {category.projects ? category.projects.length : 0} Project(s) linked
                              </div>
                            </div>
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
