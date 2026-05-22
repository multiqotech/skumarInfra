'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { GripVertical, FileText, Download, MessageSquare, X, ChevronDown, ChevronUp } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL;

const COLUMNS = [
  { id: 'Applied', label: 'Applied', color: '#3B82F6' },
  { id: 'Reviewing', label: 'Reviewing', color: '#F59E0B' },
  { id: 'Interview', label: 'Interview', color: '#06B6D4' },
  { id: 'Selected', label: 'Selected', color: '#22C55E' },
  { id: 'Rejected', label: 'Rejected', color: '#EF4444' },
];

export default function ApplicationManager({ showFeedback }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [notes, setNotes] = useState('');
  const [draggedId, setDraggedId] = useState(null);

  const config = { withCredentials: true };

  useEffect(() => { fetchApplications(); }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get(`${API}/api/career/admin/applications?limit=200`, config);
      setApplications(res.data.applications || []);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appId, newStatus) => {
    try {
      await axios.put(`${API}/api/career/admin/applications/${appId}`, { status: newStatus }, config);
      setApplications((prev) =>
        prev.map((app) => (app._id === appId ? { ...app, status: newStatus } : app))
      );
      showFeedback(`Application moved to ${newStatus}`);
    } catch (err) {
      showFeedback('Failed to update status');
    }
  };

  const saveNotes = async () => {
    if (!selectedApp) return;
    try {
      await axios.put(
        `${API}/api/career/admin/applications/${selectedApp._id}`,
        { adminNotes: notes },
        config
      );
      setApplications((prev) =>
        prev.map((app) => (app._id === selectedApp._id ? { ...app, adminNotes: notes } : app))
      );
      showFeedback('Notes saved');
    } catch (err) {
      showFeedback('Failed to save notes');
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e, appId) => {
    setDraggedId(appId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    if (draggedId) {
      const app = applications.find((a) => a._id === draggedId);
      if (app && app.status !== targetStatus) {
        updateStatus(draggedId, targetStatus);
      }
    }
    setDraggedId(null);
  };

  const getColumnApps = (status) => applications.filter((app) => app.status === status);

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Applications</h2>
        <div className="grid grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-[var(--color-dark-card)] rounded-xl p-4 h-64 animate-pulse border border-[var(--color-dark-border)]">
              <div className="h-4 w-20 bg-gray-700 rounded mb-4" />
              <div className="h-16 bg-gray-700/50 rounded mb-2" />
              <div className="h-16 bg-gray-700/50 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Application Kanban</h2>
        <span className="text-sm text-gray-500">{applications.length} total applications</span>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 min-h-[500px]">
        {COLUMNS.map((col) => {
          const colApps = getColumnApps(col.id);
          return (
            <div
              key={col.id}
              className="bg-[#111] rounded-xl border border-[var(--color-dark-border)] overflow-hidden flex flex-col"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              {/* Column header */}
              <div className="p-3 border-b border-[var(--color-dark-border)] flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
                <span className="text-sm font-semibold text-white">{col.label}</span>
                <span className="ml-auto text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">
                  {colApps.length}
                </span>
              </div>

              {/* Cards */}
              <div className="p-2 space-y-2 flex-1 overflow-y-auto max-h-[600px]">
                {colApps.length === 0 ? (
                  <div className="text-center py-8 text-gray-600 text-xs">
                    Drop here
                  </div>
                ) : (
                  colApps.map((app) => (
                    <div
                      key={app._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, app._id)}
                      onClick={() => { setSelectedApp(app); setNotes(app.adminNotes || ''); }}
                      className={`bg-[var(--color-dark-card)] p-3 rounded-lg border border-[var(--color-dark-border)] cursor-pointer hover:border-[#FFB800]/30 transition-all ${
                        draggedId === app._id ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <GripVertical className="w-3.5 h-3.5 text-gray-600 mt-0.5 shrink-0 cursor-grab" />
                        <div className="min-w-0">
                          <p className="text-white text-sm font-medium truncate">
                            {app.candidateId?.fullName || 'Unknown'}
                          </p>
                          <p className="text-gray-500 text-xs truncate mt-0.5">
                            {app.jobId?.title || 'Unknown Job'}
                          </p>
                          <p className="text-gray-600 text-xs mt-1">
                            {new Date(app.appliedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Panel */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#141414] rounded-2xl border border-[var(--color-dark-border)] w-full max-w-lg shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[var(--color-dark-border)]">
              <h3 className="text-lg font-bold text-white">Application Details</h3>
              <button onClick={() => setSelectedApp(null)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Candidate</span>
                  <p className="text-white font-medium">{selectedApp.candidateId?.fullName}</p>
                </div>
                <div>
                  <span className="text-gray-500">Email</span>
                  <p className="text-white font-medium">{selectedApp.candidateId?.email}</p>
                </div>
                <div>
                  <span className="text-gray-500">Phone</span>
                  <p className="text-white font-medium">{selectedApp.candidateId?.phone}</p>
                </div>
                <div>
                  <span className="text-gray-500">Experience</span>
                  <p className="text-white font-medium">{selectedApp.candidateId?.experience || 0} yrs</p>
                </div>
                <div>
                  <span className="text-gray-500">Position</span>
                  <p className="text-white font-medium">{selectedApp.jobId?.title}</p>
                </div>
                <div>
                  <span className="text-gray-500">Applied</span>
                  <p className="text-white font-medium">{new Date(selectedApp.appliedAt).toLocaleDateString()}</p>
                </div>
              </div>

              {selectedApp.coverLetter && (
                <div>
                  <span className="text-gray-500 text-sm">Cover Letter</span>
                  <p className="text-gray-300 text-sm mt-1 bg-[#1a1a1a] p-3 rounded-lg max-h-32 overflow-y-auto">
                    {selectedApp.coverLetter}
                  </p>
                </div>
              )}

              {selectedApp.candidateId?.resumeUrl && (
                <a
                  href={selectedApp.candidateId.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#FFB800]/10 border border-[#FFB800]/30 text-[#FFB800] rounded-lg hover:bg-[#FFB800]/20 transition-colors text-sm font-medium"
                >
                  <Download className="w-4 h-4" /> Download Resume
                </a>
              )}

              {/* Status Selector */}
              <div>
                <span className="text-gray-500 text-sm">Update Status</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {COLUMNS.map((col) => (
                    <button
                      key={col.id}
                      onClick={() => {
                        updateStatus(selectedApp._id, col.id);
                        setSelectedApp({ ...selectedApp, status: col.id });
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        selectedApp.status === col.id
                          ? 'text-white border-transparent'
                          : 'text-gray-400 border-gray-700 hover:border-gray-500'
                      }`}
                      style={selectedApp.status === col.id ? { backgroundColor: col.color } : {}}
                    >
                      {col.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <span className="text-gray-500 text-sm flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" /> Admin Notes
                </span>
                <textarea
                  className="w-full bg-[#1a1a1a] border border-[var(--color-dark-border)] px-4 py-2.5 text-white text-sm rounded-lg focus:border-[#FFB800] focus:outline-none transition-colors resize-none mt-2"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add private notes about this candidate..."
                />
                <button
                  onClick={saveNotes}
                  className="mt-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
