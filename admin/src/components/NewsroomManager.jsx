'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Link as LinkIcon, FileText, Image as ImageIcon, Video, Upload } from 'lucide-react';
import { uploadFileToServer, getAuthHeader } from '../utils/api';

const TABS = [
  { id: 'news', label: 'News Items' },
  { id: 'contacts', label: 'Media Contacts' }
];

const NEWS_TYPES = [
  { id: 'press-releases', label: 'Press Releases' },
  { id: 'electronic-media', label: 'Electronic Media' },
  { id: 'featured-stories', label: 'Featured Stories' }
];

export default function NewsroomManager({ showFeedback }) {
  const [activeTab, setActiveTab] = useState('news');
  const [activeNewsType, setActiveNewsType] = useState('press-releases');
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  
  // Data State
  const [news, setNews] = useState([]);
  const [contacts, setContacts] = useState([]);
  
  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [newsForm, setNewsForm] = useState({
    id: "", type: "press-releases", headline: "", date: "", body: "", description: "", videoLink: "", image: "", pdf: ""
  });
  const [contactForm, setContactForm] = useState({
    id: "", name: "", designation: "", email: ""
  });
  
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    if (activeTab === 'news') fetchNews();
    if (activeTab === 'contacts') fetchContacts();
  }, [activeTab, activeNewsType]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/news?type=${activeNewsType}`);
      setNews(res.data);
    } catch (err) {
      showFeedback("Failed to fetch news", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/media-contacts`);
      setContacts(res.data);
    } catch (err) {
      showFeedback("Failed to fetch contacts", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.size > 10 * 1024 * 1024) {
      showFeedback("File size must be under 10MB!", "error");
      return;
    }

    setFile(selectedFile);
    if (selectedFile.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setPreviewUrl("pdf");
    }
    showFeedback("File selected. It will upload when you save!");
  };

  const handleRemoveFile = () => {
    if (previewUrl && previewUrl !== "pdf" && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl("");
  };

  // --- News Submit ---
  const handleNewsSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    const config = getAuthHeader();
    if (!config) {
      setFormLoading(false);
      return;
    }

    let finalImageUrl = newsForm.image;
    let finalPdfUrl = newsForm.pdf;

    try {
      if (file) {
        setUploadingFile(true);
        try {
          const uploadedUrl = await uploadFileToServer(file);
          if (newsForm.type === 'press-releases') finalImageUrl = uploadedUrl;
          if (newsForm.type === 'featured-stories') finalPdfUrl = uploadedUrl;
        } catch (uploadErr) {
          showFeedback("Failed to upload file.", "error");
          setUploadingFile(false);
          setFormLoading(false);
          return;
        }
        setUploadingFile(false);
      }

      if (newsForm.type === 'press-releases' && !finalImageUrl && !newsForm.image) {
        showFeedback("Press Releases require an image.", "error");
        setFormLoading(false); return;
      }
      if (newsForm.type === 'featured-stories' && !finalPdfUrl && !newsForm.pdf) {
        showFeedback("Featured Stories require a PDF.", "error");
        setFormLoading(false); return;
      }

      const payload = {
        type: newsForm.type,
        headline: newsForm.headline,
        date: newsForm.date,
        body: newsForm.body,
        description: newsForm.description,
        videoLink: newsForm.videoLink,
        image: finalImageUrl,
        pdf: finalPdfUrl
      };

      if (isEditing) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/news/${newsForm.id}`, payload, config);
        showFeedback("News updated successfully!");
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/news`, payload, config);
        showFeedback("News added successfully!");
      }

      cancelNewsEdit();
      fetchNews();
    } catch (err) {
      showFeedback("Error saving news", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleNewsDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    const config = getAuthHeader();
    if (!config) return;

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/news/${id}`, config);
      showFeedback("News deleted!");
      fetchNews();
    } catch (err) {
      showFeedback("Error deleting news", "error");
    }
  };

  const editNews = (item) => {
    setNewsForm({
      id: item._id,
      type: item.type,
      headline: item.headline,
      date: new Date(item.date).toISOString().split('T')[0],
      body: item.body || "",
      description: item.description || "",
      videoLink: item.videoLink || "",
      image: item.image || "",
      pdf: item.pdf || ""
    });
    setPreviewUrl(item.image ? item.image : (item.pdf ? "pdf" : ""));
    setFile(null);
    setIsEditing(true);
    setActiveNewsType(item.type);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelNewsEdit = () => {
    setIsEditing(false);
    setNewsForm({ id: "", type: activeNewsType, headline: "", date: "", body: "", description: "", videoLink: "", image: "", pdf: "" });
    handleRemoveFile();
  };

  // --- Contact Submit ---
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    const config = getAuthHeader();
    if (!config) { setFormLoading(false); return; }

    const payload = {
      name: contactForm.name,
      designation: contactForm.designation,
      email: contactForm.email
    };

    try {
      if (isEditing) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/media-contacts/${contactForm.id}`, payload, config);
        showFeedback("Contact updated successfully!");
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/media-contacts`, payload, config);
        showFeedback("Contact added successfully!");
      }
      cancelContactEdit();
      fetchContacts();
    } catch (err) {
      showFeedback("Error saving contact", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleContactDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    const config = getAuthHeader();
    if (!config) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/media-contacts/${id}`, config);
      showFeedback("Contact deleted!");
      fetchContacts();
    } catch (err) {
      showFeedback("Error deleting contact", "error");
    }
  };

  const editContact = (c) => {
    setContactForm({ id: c._id, name: c.name, designation: c.designation, email: c.email });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelContactEdit = () => {
    setIsEditing(false);
    setContactForm({ id: "", name: "", designation: "", email: "" });
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-[var(--color-dark-border)]">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); cancelNewsEdit(); cancelContactEdit(); }}
            className={`pb-3 px-2 font-medium transition-colors border-b-2 ${
              activeTab === tab.id 
                ? 'border-[var(--color-yellow)] text-[var(--color-yellow)]' 
                : 'border-transparent text-[#6b7280] hover:text-[#183964]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'news' && (
        <div className="space-y-6">
          <div className="flex gap-2">
            {NEWS_TYPES.map(type => (
              <button
                key={type.id}
                onClick={() => { setActiveNewsType(type.id); setNewsForm({ ...newsForm, type: type.id }); cancelNewsEdit(); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeNewsType === type.id 
                    ? 'bg-[var(--color-yellow)] text-white' 
                    : 'bg-[var(--color-dark-card)] text-[#183964] hover:bg-[var(--color-dark-border)]'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          <div className="bg-[var(--color-dark-card)] rounded-xl border border-[var(--color-dark-border)] overflow-hidden">
            <div className="p-6 border-b border-[var(--color-dark-border)]">
              <h3 className="text-lg font-semibold">{isEditing ? "Edit News" : "Add News"}</h3>
            </div>
            
            <form onSubmit={handleNewsSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Headline *</label>
                  <input
                    type="text" required
                    value={newsForm.headline} onChange={(e) => setNewsForm({ ...newsForm, headline: e.target.value })}
                    className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded-lg px-4 py-2.5 focus:border-[var(--color-yellow)] outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Date *</label>
                  <input
                    type="date" required
                    value={newsForm.date} onChange={(e) => setNewsForm({ ...newsForm, date: e.target.value })}
                    className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded-lg px-4 py-2.5 focus:border-[var(--color-yellow)] outline-none"
                  />
                </div>

                {/* Dynamic Fields */}
                {activeNewsType === 'press-releases' && (
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Cover Image *</label>
                      <div className="flex gap-4 items-center">
                        {previewUrl && previewUrl !== "pdf" && (
                          <div className="w-24 h-24 rounded overflow-hidden border border-[var(--color-dark-border)] shrink-0">
                            <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                          </div>
                        )}
                        <label className="flex-1 flex flex-col items-center justify-center h-24 border-2 border-dashed border-[var(--color-dark-border)] rounded-lg cursor-pointer hover:border-[var(--color-yellow)] bg-[var(--color-dark)]/50 transition-colors">
                          <Upload className="h-6 w-6 text-[#6b7280] mb-2" />
                          <span className="text-sm text-[#6b7280]">Click to upload image</span>
                          <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Body Content</label>
                      <textarea
                        rows="6"
                        value={newsForm.body} onChange={(e) => setNewsForm({ ...newsForm, body: e.target.value })}
                        className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded-lg px-4 py-2.5 focus:border-[var(--color-yellow)] outline-none whitespace-pre-wrap"
                        placeholder="Enter the press release content here..."
                      />
                    </div>
                  </div>
                )}

                {activeNewsType === 'electronic-media' && (
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea
                        rows="3"
                        value={newsForm.description} onChange={(e) => setNewsForm({ ...newsForm, description: e.target.value })}
                        className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded-lg px-4 py-2.5 focus:border-[var(--color-yellow)] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Video Link (YouTube/Vimeo) *</label>
                      <input
                        type="url" required
                        value={newsForm.videoLink} onChange={(e) => setNewsForm({ ...newsForm, videoLink: e.target.value })}
                        className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded-lg px-4 py-2.5 focus:border-[var(--color-yellow)] outline-none"
                      />
                    </div>
                  </div>
                )}

                {activeNewsType === 'featured-stories' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Story PDF *</label>
                    <div className="flex gap-4 items-center">
                      {previewUrl === "pdf" && (
                        <div className="w-16 h-16 flex items-center justify-center bg-[var(--color-dark)] rounded border border-[var(--color-dark-border)] shrink-0">
                          <FileText className="h-8 w-8 text-[var(--color-yellow)]" />
                        </div>
                      )}
                      <label className="flex-1 flex flex-col items-center justify-center h-24 border-2 border-dashed border-[var(--color-dark-border)] rounded-lg cursor-pointer hover:border-[var(--color-yellow)] bg-[var(--color-dark)]/50 transition-colors">
                        <Upload className="h-6 w-6 text-[#6b7280] mb-2" />
                        <span className="text-sm text-[#6b7280]">Click to upload PDF document</span>
                        <input type="file" className="hidden" accept=".pdf" onChange={handleFileSelect} />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-dark-border)]">
                {isEditing && (
                  <button type="button" onClick={cancelNewsEdit} className="px-6 py-2 rounded-lg font-medium bg-[#f0f4f8] hover:bg-gray-200 transition-colors">
                    Cancel
                  </button>
                )}
                <button type="submit" disabled={formLoading || uploadingFile} className="px-6 py-2 rounded-lg font-bold bg-[var(--color-yellow)] text-white hover:bg-[#f36c21] transition-colors disabled:opacity-50">
                  {formLoading || uploadingFile ? "Saving..." : isEditing ? "Update News" : "Add News"}
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-4">
            {news.map(item => (
              <div key={item._id} className="bg-[var(--color-dark-card)] p-4 rounded-xl border border-[var(--color-dark-border)] flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-[#183964]">{item.headline}</h4>
                  <p className="text-sm text-[#6b7280]">{new Date(item.date).toDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => editNews(item)} className="p-2 text-[#6b7280] hover:text-[var(--color-yellow)] rounded transition-colors"><Edit2 className="w-4 h-4"/></button>
                  <button onClick={() => handleNewsDelete(item._id)} className="p-2 text-[#6b7280] hover:text-red-500 rounded transition-colors"><Trash2 className="w-4 h-4"/></button>
                </div>
              </div>
            ))}
            {news.length === 0 && <p className="text-center text-[#6b7280] py-8">No news found.</p>}
          </div>
        </div>
      )}

      {activeTab === 'contacts' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="bg-[var(--color-dark-card)] rounded-xl border border-[var(--color-dark-border)] p-6">
              <h3 className="text-lg font-semibold mb-4">{isEditing ? "Edit Contact" : "Add Contact"}</h3>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input type="text" required value={contactForm.name} onChange={(e) => setContactForm({...contactForm, name: e.target.value})} className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded-lg px-4 py-2 focus:border-[var(--color-yellow)] outline-none"/>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Designation</label>
                  <input type="text" required value={contactForm.designation} onChange={(e) => setContactForm({...contactForm, designation: e.target.value})} className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded-lg px-4 py-2 focus:border-[var(--color-yellow)] outline-none"/>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" required value={contactForm.email} onChange={(e) => setContactForm({...contactForm, email: e.target.value})} className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded-lg px-4 py-2 focus:border-[var(--color-yellow)] outline-none"/>
                </div>
                <div className="flex gap-2 pt-2">
                  {isEditing && <button type="button" onClick={cancelContactEdit} className="flex-1 py-2 rounded-lg font-medium bg-[#f0f4f8] hover:bg-gray-200 transition-colors">Cancel</button>}
                  <button type="submit" disabled={formLoading} className="flex-1 py-2 rounded-lg font-bold bg-[var(--color-yellow)] text-white hover:bg-[#f36c21] transition-colors">Save</button>
                </div>
              </form>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            {contacts.map(c => (
              <div key={c._id} className="bg-[var(--color-dark-card)] p-4 rounded-xl border border-[var(--color-dark-border)] flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-[var(--color-yellow)]">{c.name}</h4>
                  <p className="text-sm text-[#183964]">{c.designation}</p>
                  <p className="text-sm text-[#6b7280]">{c.email}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => editContact(c)} className="p-2 text-[#6b7280] hover:text-[var(--color-yellow)] rounded transition-colors"><Edit2 className="w-4 h-4"/></button>
                  <button onClick={() => handleContactDelete(c._id)} className="p-2 text-[#6b7280] hover:text-red-500 rounded transition-colors"><Trash2 className="w-4 h-4"/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
