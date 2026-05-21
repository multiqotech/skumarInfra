import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Plus, Edit2, Trash2, Loader2, Upload, Image as ImageIcon } from 'lucide-react';
import { getAuthHeader, uploadFileToServer } from '../utils/api';

const WE_ARE_PAGES = [
  { id: 'our-company', name: 'Our Company', itemType: 'section' },
  { id: 'our-global-presence', name: 'Our Global Presence', itemType: 'location' },
  { id: 'our-unique-capabilities', name: 'Our Unique Capabilities', itemType: 'section' },
  { id: 'our-technology-innovation-centres', name: 'Our Innovation Centres', itemType: 'card' },
];

export default function WeAreManager({ showFeedback }) {
  const [selectedPage, setSelectedPage] = useState(WE_ARE_PAGES[0].id);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Page level state
  const [title, setTitle] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [tagline, setTagline] = useState("");
  const [items, setItems] = useState([]);

  const [heroFile, setHeroFile] = useState(null);
  const [heroPreview, setHeroPreview] = useState("");

  const currentPageDef = WE_ARE_PAGES.find(p => p.id === selectedPage);

  useEffect(() => {
    fetchPageData();
  }, [selectedPage]);

  const fetchPageData = async () => {
    setLoading(true);
    setHeroFile(null);
    setHeroPreview("");
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/we-are/${selectedPage}`);
      const data = res.data;
      setTitle(data.title || currentPageDef.name);
      setTagline(data.pageData?.tagline || "");
      setHeroImage(data.pageData?.heroImage || "");
      setHeroPreview(data.pageData?.heroImage || "");
      setItems(data.pageData?.items || []);
    } catch (err) {
      if (err.response?.status === 404) {
        // New page
        setTitle(currentPageDef.name);
        setTagline("");
        setHeroImage("");
        setHeroPreview("");
        setItems([]);
      } else {
        showFeedback("Failed to fetch page data", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleHeroFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setHeroFile(file);
    setHeroPreview(URL.createObjectURL(file));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleItemFileSelect = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const newItems = [...items];
    newItems[index].file = file;
    newItems[index].previewUrl = URL.createObjectURL(file);
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { id: Date.now().toString() }]);
  };

  const removeItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleSave = async () => {
    setSaving(true);
    const config = getAuthHeader();
    if (!config) {
      setSaving(false);
      return;
    }

    let finalHeroUrl = heroImage;

    try {
      if (heroFile) {
        finalHeroUrl = await uploadFileToServer(heroFile);
        setHeroImage(finalHeroUrl);
      }

      // Upload item images
      const processedItems = [...items];
      for (let i = 0; i < processedItems.length; i++) {
        if (processedItems[i].file) {
          const uploadedUrl = await uploadFileToServer(processedItems[i].file);
          processedItems[i].image = uploadedUrl;
          delete processedItems[i].file;
          delete processedItems[i].previewUrl;
        }
      }

      const payload = {
        title,
        pageData: {
          tagline,
          heroImage: finalHeroUrl,
          items: processedItems
        }
      };

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/we-are/${selectedPage}`, payload, config);
      showFeedback("Page saved successfully!");
      fetchPageData();
    } catch (err) {
      showFeedback("Error saving page", "error");
    } finally {
      setSaving(false);
    }
  };

  const ItemImageUpload = ({ item, index }) => (
    <div className="flex gap-4 items-center mt-2">
      {(item.previewUrl || item.image) && (
        <div className="w-16 h-16 rounded overflow-hidden border border-[var(--color-dark-border)] shrink-0">
          <img src={item.previewUrl || item.image} className="w-full h-full object-cover" alt="Item preview" />
        </div>
      )}
      <label className="flex-1 flex items-center justify-center h-10 border border-dashed border-[var(--color-dark-border)] rounded cursor-pointer hover:border-[var(--color-yellow)] bg-[var(--color-dark)]/50 transition-colors text-sm text-gray-400">
        <Upload className="h-4 w-4 mr-2" /> Upload Image
        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleItemFileSelect(index, e)} />
      </label>
    </div>
  );

  const renderItemEditor = (item, index) => {
    const type = currentPageDef.itemType;
    
    return (
      <div key={item.id || index} className="p-4 border border-[var(--color-dark-border)] rounded-lg bg-[var(--color-dark)]/50 relative mb-4">
        <button 
          onClick={() => removeItem(index)}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-400"
        >
          <Trash2 className="h-5 w-5" />
        </button>

        {type === 'section' && (
          <div className="space-y-3 pr-10">
            <input type="text" placeholder="Section Title" value={item.title || ''} onChange={(e) => handleItemChange(index, 'title', e.target.value)} className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded px-3 py-2 text-sm focus:border-[var(--color-yellow)] outline-none" />
            <textarea placeholder="Section Content" rows="3" value={item.content || ''} onChange={(e) => handleItemChange(index, 'content', e.target.value)} className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded px-3 py-2 text-sm focus:border-[var(--color-yellow)] outline-none" />
            <ItemImageUpload item={item} index={index} />
          </div>
        )}

        {type === 'card' && (
          <div className="space-y-3 pr-10">
            <input type="text" placeholder="Card Title" value={item.title || ''} onChange={(e) => handleItemChange(index, 'title', e.target.value)} className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded px-3 py-2 text-sm focus:border-[var(--color-yellow)] outline-none" />
            <input type="text" placeholder="Short Description" value={item.description || ''} onChange={(e) => handleItemChange(index, 'description', e.target.value)} className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded px-3 py-2 text-sm focus:border-[var(--color-yellow)] outline-none" />
            <ItemImageUpload item={item} index={index} />
            <input type="text" placeholder="Link (optional)" value={item.link || ''} onChange={(e) => handleItemChange(index, 'link', e.target.value)} className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded px-3 py-2 text-sm focus:border-[var(--color-yellow)] outline-none" />
          </div>
        )}

        {type === 'location' && (
          <div className="space-y-3 pr-10">
            <input type="text" placeholder="Country / Region" value={item.country || ''} onChange={(e) => handleItemChange(index, 'country', e.target.value)} className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded px-3 py-2 text-sm focus:border-[var(--color-yellow)] outline-none" />
            <textarea placeholder="Details (e.g. key projects)" rows="2" value={item.details || ''} onChange={(e) => handleItemChange(index, 'details', e.target.value)} className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded px-3 py-2 text-sm focus:border-[var(--color-yellow)] outline-none" />
          </div>
        )}

        {type === 'gallery' && (
          <div className="space-y-3 pr-10">
            <ItemImageUpload item={item} index={index} />
            <input type="text" placeholder="Caption (optional)" value={item.caption || ''} onChange={(e) => handleItemChange(index, 'caption', e.target.value)} className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded px-3 py-2 text-sm focus:border-[var(--color-yellow)] outline-none" />
          </div>
        )}

        {type === 'office' && (
          <div className="space-y-3 pr-10">
            <input type="text" placeholder="City / Office Name" value={item.city || ''} onChange={(e) => handleItemChange(index, 'city', e.target.value)} className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded px-3 py-2 text-sm focus:border-[var(--color-yellow)] outline-none" />
            <textarea placeholder="Full Address" rows="2" value={item.address || ''} onChange={(e) => handleItemChange(index, 'address', e.target.value)} className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded px-3 py-2 text-sm focus:border-[var(--color-yellow)] outline-none" />
            <input type="text" placeholder="Phone / Email" value={item.contact || ''} onChange={(e) => handleItemChange(index, 'contact', e.target.value)} className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded px-3 py-2 text-sm focus:border-[var(--color-yellow)] outline-none" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center bg-[var(--color-dark-card)] p-4 rounded-xl border border-[var(--color-dark-border)] shadow-lg">
        <div>
          <h2 className="text-xl font-bold">Manage "We Are" Pages</h2>
          <p className="text-sm text-gray-400 mt-1">Select a page to edit its content and layout.</p>
        </div>
        <select 
          value={selectedPage} 
          onChange={(e) => setSelectedPage(e.target.value)}
          className="bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--color-yellow)] font-medium"
        >
          {WE_ARE_PAGES.map(page => (
            <option key={page.id} value={page.id}>{page.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="p-12 flex justify-center text-gray-400 bg-[var(--color-dark-card)] rounded-xl border border-[var(--color-dark-border)]">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--color-yellow)]" />
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Hero Section */}
          <div className="bg-[var(--color-dark-card)] rounded-xl border border-[var(--color-dark-border)] overflow-hidden">
            <div className="p-4 border-b border-[var(--color-dark-border)] bg-[#1a1a1a]">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-[var(--color-yellow)]" />
                Hero Section
              </h3>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">Page Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded-lg px-4 py-2.5 focus:border-[var(--color-yellow)] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tagline / Subtitle</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded-lg px-4 py-2.5 focus:border-[var(--color-yellow)] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Hero Image</label>
                <div className="flex gap-4">
                  {heroPreview && (
                    <div className="w-48 h-32 rounded-lg overflow-hidden border border-[var(--color-dark-border)] relative">
                      <img src={heroPreview} className="w-full h-full object-cover" alt="Hero" />
                    </div>
                  )}
                  <label className="flex-1 flex flex-col items-center justify-center h-32 border-2 border-dashed border-[var(--color-dark-border)] rounded-lg cursor-pointer hover:border-[var(--color-yellow)] bg-[var(--color-dark)]/50 transition-colors">
                    <Upload className="h-6 w-6 text-gray-400 mb-2" />
                    <span className="text-sm font-medium">Click to upload new hero image</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleHeroFileSelect} />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Content Section */}
          <div className="bg-[var(--color-dark-card)] rounded-xl border border-[var(--color-dark-border)] overflow-hidden">
            <div className="p-4 border-b border-[var(--color-dark-border)] bg-[#1a1a1a] flex justify-between items-center">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Edit2 className="h-5 w-5 text-[var(--color-yellow)]" />
                Page Content Items ({currentPageDef.itemType})
              </h3>
              <button 
                onClick={addItem}
                className="px-3 py-1.5 bg-[var(--color-dark)] border border-[var(--color-dark-border)] hover:border-[var(--color-yellow)] rounded flex items-center gap-1 text-sm font-medium transition-colors"
              >
                <Plus className="h-4 w-4" /> Add Item
              </button>
            </div>
            <div className="p-6">
              {items.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No content items added yet. Click 'Add Item' to start.
                </div>
              ) : (
                items.map((item, index) => renderItemEditor(item, index))
              )}
            </div>
          </div>

        </div>
      )}

      {/* Floating Save Button */}
      <div className="fixed bottom-6 right-6 lg:right-10 z-40">
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="flex items-center gap-2 px-6 py-3 bg-[var(--color-yellow)] hover:bg-[#e5a600] text-black rounded-full font-bold shadow-[0_10px_25px_rgba(255,184,0,0.3)] disabled:opacity-50 transition-all hover:-translate-y-1"
        >
          {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          {saving ? 'Saving Changes...' : 'Save Page Content'}
        </button>
      </div>

    </div>
  );
}
