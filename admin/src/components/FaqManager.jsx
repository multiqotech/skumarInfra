import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Loader2, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { getAuthHeader } from '../utils/api';

export default function FaqManager({ showFeedback }) {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [form, setForm] = useState({ id: "", question: "", answer: "" });

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/faqs`);
      setFaqs(res.data);
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
      if (isEditing) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/faqs/${form.id}`, {
          question: form.question,
          answer: form.answer
        }, config);
        showFeedback("FAQ updated successfully!");
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/faqs`, {
          question: form.question,
          answer: form.answer
        }, config);
        showFeedback("FAQ added successfully!");
      }
      setForm({ id: "", question: "", answer: "" });
      setIsEditing(false);
      fetchFaqs();
    } catch (err) {
      showFeedback("Error saving FAQ", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (faq) => {
    setForm({ id: faq._id, question: faq.question, answer: faq.answer });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    const config = getAuthHeader();
    if (!config) return;

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/faqs/${id}`, config);
      showFeedback("FAQ deleted successfully!");
      fetchFaqs();
    } catch (err) {
      showFeedback("Error deleting FAQ", "error");
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setForm({ id: "", question: "", answer: "" });
  };

  return (
    <div className="space-y-6">
      {/* FAQ Form */}
      <div className="bg-[var(--color-dark-card)] rounded-xl border border-[var(--color-dark-border)] overflow-hidden">
        <div className="p-6 border-b border-[var(--color-dark-border)] bg-[#f7f9fc]">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Plus className="h-5 w-5 text-[var(--color-yellow)]" />
            {isEditing ? "Edit FAQ" : "Add New FAQ"}
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Question</label>
            <input
              type="text"
              required
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[var(--color-yellow)] transition-colors"
              placeholder="e.g. How long does a project take?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Answer</label>
            <textarea
              required
              rows="3"
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
              className="w-full bg-[var(--color-dark)] border border-[var(--color-dark-border)] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[var(--color-yellow)] transition-colors resize-none"
              placeholder="Provide a detailed answer..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={formLoading}
              className="px-6 py-2.5 bg-[var(--color-yellow)] text-white font-semibold rounded-lg hover:bg-[#e5a600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {formLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {isEditing ? "Update FAQ" : "Add FAQ"}
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

      {/* FAQ List */}
      <div className="bg-[var(--color-dark-card)] rounded-xl border border-[var(--color-dark-border)] overflow-hidden">
        <div className="p-6 border-b border-[var(--color-dark-border)] flex justify-between items-center">
          <h3 className="text-lg font-semibold">Current FAQs ({faqs.length})</h3>
        </div>
        {loading ? (
          <div className="p-12 flex justify-center text-[#6b7280]">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--color-yellow)]" />
          </div>
        ) : faqs.length === 0 ? (
          <div className="p-12 text-center text-[#6b7280] border-t border-[var(--color-dark-border)]">
            No FAQs added yet.
          </div>
        ) : (
          <DragDropContext onDragEnd={async (result) => {
            if (!result.destination) return;
            const updatedFaqs = Array.from(faqs);
            const [reorderedFaq] = updatedFaqs.splice(result.source.index, 1);
            updatedFaqs.splice(result.destination.index, 0, reorderedFaq);
            
            const reorderedWithOrder = updatedFaqs.map((faq, index) => ({ ...faq, order: index }));
            setFaqs(reorderedWithOrder);
            
            try {
              const config = getAuthHeader();
              await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/faqs/reorder`, {
                items: reorderedWithOrder.map(f => ({ id: f._id, order: f.order }))
              }, config);
            } catch (err) {
              console.error(err);
              showFeedback("Failed to save new order", "error");
              fetchFaqs();
            }
          }}>
            <Droppable droppableId="faqs" direction="vertical">
              {(provided) => (
                <div 
                  className="divide-y divide-[var(--color-dark-border)]"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {faqs.map((faq, index) => (
                    <Draggable key={faq._id} draggableId={faq._id} index={index}>
                      {(provided) => (
                        <div 
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="p-6 hover:bg-[var(--color-dark)]/50 transition-colors flex justify-between group bg-[var(--color-dark-card)]"
                        >
                          <div className="flex gap-4">
                            <div 
                              {...provided.dragHandleProps} 
                              className="flex items-center justify-center text-[#6b7280] hover:text-[var(--color-yellow)] cursor-grab p-2 h-fit"
                            >
                              <GripVertical className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-bold text-[#183964] mb-2">{faq.question}</h4>
                              <p className="text-[#6b7280] text-sm leading-relaxed">{faq.answer}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                            <button onClick={() => handleEdit(faq)} className="p-2 h-fit text-[#6b7280] hover:text-[var(--color-yellow)] hover:bg-[var(--color-yellow)]/10 rounded-lg transition-colors">
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDelete(faq._id)} className="p-2 h-fit text-[#6b7280] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
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
