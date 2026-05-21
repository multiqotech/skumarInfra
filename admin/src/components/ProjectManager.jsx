import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Loader2, Upload } from 'lucide-react';
import { getAuthHeader, uploadFileToServer } from '../utils/api';

const CATEGORIES = [
  { id: 'airports', name: 'Airports' },
  { id: 'bridges', name: 'Bridges' },
  { id: 'defence-installations', name: 'Defence Installations' },
  { id: 'digital-energy-solutions', name: 'Digital Energy Solutions' },
  { id: 'factories', name: 'Factories' },
  { id: 'minerals-metals', name: 'Minerals Metals' },
  { id: 'hospitals', name: 'Hospitals' },
  { id: 'housing', name: 'Housing' },
  { id: 'hydel-projects', name: 'Hydel Projects' },
  { id: 'metros', name: 'Metros' },
  { id: 'nuclear-plants', name: 'Nuclear Plants' },
  { id: 'office-spaces', name: 'Office Spaces' },
  { id: 'ports', name: 'Ports' },
  { id: 'power-transmission-distribution-infrastructure', name: 'Power Transmission Distribution Infrastructure' },
  { id: 'public-spaces', name: 'Public Spaces' },
  { id: 'railways', name: 'Railways' },
  { id: 'renewables', name: 'Renewables' },
  { id: 'smart-world-solutions', name: 'Smart World Solutions' },
  { id: 'transportation-infrastructure', name: 'Transportation Infrastructure' },
  { id: 'underground-structures', name: 'Underground Structures' },
  { id: 'unique-structures', name: 'Unique Structures' },
  { id: 'water-infrastructure', name: 'Water Infrastructure' },
];

export default function ProjectManager({ showFeedback }) {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].id);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [form, setForm] = useState({
    id: "",
    title: "",
    description: "",
    timeToBuild: "",
    engineers: "",
    location: "",
    image: "",
    projectType: "Normal"
  });

  const [projectFile, setProjectFile] = useState(null);
  const [projectPreview, setProjectPreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [selectedCategory]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/category/${selectedCategory}`);
      setProjects(res.data);
    } catch (err) {
      console.error(err);
      showFeedback("Failed to fetch projects", "error");
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
    if (projectPreview && projectPreview.startsWith("blob:")) {
      URL.revokeObjectURL(projectPreview);
    }
    setProjectFile(file);
    setProjectPreview(previewUrl);
    showFeedback("Image selected. It will upload when you save!");
  };

  const handleRemoveFile = () => {
    if (projectPreview && projectPreview.startsWith("blob:")) {
      URL.revokeObjectURL(projectPreview);
    }
    setProjectFile(null);
    setProjectPreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectFile && !form.image) {
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
      if (projectFile) {
        setUploadingImage(true);
        try {
          finalImageUrl = await uploadFileToServer(projectFile);
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
        title: form.title,
        category: selectedCategory,
        description: form.description,
        timeToBuild: form.timeToBuild,
        engineers: form.engineers,
        location: form.location,
        projectType: form.projectType,
        image: finalImageUrl
      };

      if (isEditing) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${form.id}`, payload, config);
        showFeedback("Project updated successfully!");
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`, payload, config);
        showFeedback("Project added successfully!");
      }

      handleRemoveFile();
      setForm({ id: "", title: "", description: "", timeToBuild: "", engineers: "", location: "", image: "", projectType: "Normal" });
      setIsEditing(false);
      fetchProjects();
    } catch (err) {
      showFeedback("Error saving project", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (project) => {
    setForm({
      id: project._id,
      title: project.title,
      description: project.description || "",
      timeToBuild: project.timeToBuild || "",
      engineers: project.engineers || "",
      location: project.location || "",
      image: project.image,
      projectType: project.projectType || "Normal"
    });
    setProjectPreview(project.image);
    setProjectFile(null);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    const config = getAuthHeader();
    if (!config) return;

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${id}`, config);
      showFeedback("Project deleted successfully!");
      fetchProjects();
    } catch (err) {
      showFeedback("Error deleting project", "error");
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setForm({ id: "", title: "", description: "", timeToBuild: "", engineers: "", location: "", image: "", projectType: "Normal" });
    handleRemoveFile();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[var(--color-dark-card)] p-4 rounded-xl border border-[var(--color-dark-border)]">
        <h2 className="text-xl font-bold">Manage "We Build" Projects</h2>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-400">Category:</label>
          <select 
            value={selectedCategory} 
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              cancelEdit();
            }}
            className="bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[var(--color-yellow)]"
          >
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-[var(--color-dark-card)] rounded-xl border border-[var(--color-dark-border)] overflow-hidden">
        <div className="p-6 border-b border-[var(--color-dark-border)] bg-[#1a1a1a]">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Plus className="h-5 w-5 text-[var(--color-yellow)]" />
            {isEditing ? "Edit Project" : "Add New Project"}
          </h3>
          <p className="text-sm text-gray-400 mt-1">Add projects for the {CATEGORIES.find(c => c.id === selectedCategory)?.name} category.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Project Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[var(--color-yellow)] transition-colors"
                placeholder="e.g. Iconic Bridge Project I"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[var(--color-yellow)] transition-colors"
                placeholder="e.g. New Delhi, India"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Project Type (Optional)</label>
              <select
                value={form.projectType}
                onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[var(--color-yellow)] transition-colors appearance-none"
              >
                <option value="Normal">Normal</option>
                <option value="Landmark">Landmark</option>
                <option value="Iconic">Iconic</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Time to Build</label>
              <input
                type="text"
                value={form.timeToBuild}
                onChange={(e) => setForm({ ...form, timeToBuild: e.target.value })}
                className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[var(--color-yellow)] transition-colors"
                placeholder="e.g. 24 Months"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Engineers Involved</label>
              <input
                type="text"
                value={form.engineers}
                onChange={(e) => setForm({ ...form, engineers: e.target.value })}
                className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[var(--color-yellow)] transition-colors"
                placeholder="e.g. John Doe, Jane Smith"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Project Description</label>
            <textarea
              rows="3"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[var(--color-yellow)] transition-colors resize-none"
              placeholder="Detailed description of the project..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Project Image (Upload) <span className="text-red-500">*</span></label>
            <div className="flex gap-4 items-end">
              {projectPreview && (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-[var(--color-dark-border)] group">
                  <img src={projectPreview} alt="Preview" className="w-full h-full object-cover" />
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
              className="px-6 py-2.5 bg-[var(--color-yellow)] text-black font-semibold rounded-lg hover:bg-[#e5a600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {(formLoading || uploadingImage) ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {uploadingImage ? "Uploading Image..." : isEditing ? "Update Project" : "Add Project"}
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
          <h3 className="text-lg font-semibold">Current Projects in {CATEGORIES.find(c => c.id === selectedCategory)?.name}</h3>
        </div>
        
        {loading ? (
          <div className="p-12 flex justify-center text-gray-400">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--color-yellow)]" />
          </div>
        ) : projects.length === 0 ? (
          <div className="p-12 text-center text-gray-400 border-t border-[var(--color-dark-border)]">
            <p>No projects added for this category yet.</p>
            <p className="text-sm mt-1 text-gray-500">The website will show default dummy data for this category.</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-dark-border)]">
            {projects.map((project) => (
              <div key={project._id} className="p-6 flex flex-col md:flex-row gap-6 hover:bg-[var(--color-dark)]/50 transition-colors">
                <div className="w-full md:w-48 h-32 flex-shrink-0 relative rounded-lg overflow-hidden border border-[var(--color-dark-border)]">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      {project.title}
                      {project.projectType && project.projectType !== 'Normal' && (
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[var(--color-yellow)]/20 text-[var(--color-yellow)] rounded">
                          {project.projectType}
                        </span>
                      )}
                    </h4>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(project)} className="p-2 text-gray-400 hover:text-[var(--color-yellow)] hover:bg-[var(--color-yellow)]/10 rounded-lg transition-colors">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(project._id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mt-4">
                    <div><span className="text-gray-500">Location:</span> {project.location || '-'}</div>
                    <div><span className="text-gray-500">Time:</span> {project.timeToBuild || '-'}</div>
                    <div className="col-span-2 truncate"><span className="text-gray-500">Engineers:</span> {project.engineers || '-'}</div>
                    <div className="col-span-2 text-gray-400 line-clamp-2 mt-2">{project.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
