import React, { useState, useEffect } from 'react';
import { FileText, AlertTriangle, MessageSquare, Clock, UserCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import { Issue } from '../../types';

export const MyIssues: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const res = await api.get('/issues/my');
      if (res.data.success) {
        setIssues(res.data.data);
        if (res.data.data.length > 0) {
          fetchIssueDetails(res.data.data[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchIssueDetails = async (id: string) => {
    try {
      const res = await api.get(`/issues/${id}`);
      if (res.data.success) {
        setSelectedIssue(res.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssue || !commentText.trim()) return;

    try {
      const res = await api.post(`/issues/${selectedIssue.id}/comments`, { content: commentText });
      if (res.data.success) {
        setCommentText('');
        fetchIssueDetails(selectedIssue.id);
      }
    } catch (e) {
      alert('Failed to post comment');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1500px] mx-auto text-slate-900 bg-slate-50 min-h-screen">
      <div>
        <h1 className="text-xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
          <FileText className="w-5 h-5 text-purple-600" />
          My Reported Tickets & Issues
        </h1>
        <p className="text-xs text-slate-600 font-bold">Track resolution progress and communicate with assigned campus staff</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Ticket List */}
        <div className="lg:col-span-5 space-y-3">
          {issues.map((issue) => {
            let statusBg = 'bg-blue-100 text-blue-900 border-blue-300 font-extrabold';
            if (issue.status === 'RESOLVED') statusBg = 'bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold';
            if (issue.status === 'OPEN') statusBg = 'bg-orange-100 text-orange-900 border-orange-300 font-extrabold';

            const isSelected = selectedIssue?.id === issue.id;

            return (
              <div
                key={issue.id}
                onClick={() => fetchIssueDetails(issue.id)}
                className={`p-4 rounded-2xl cursor-pointer transition-all bg-white border shadow-sm ${
                  isSelected ? 'border-purple-600 ring-2 ring-purple-600/20 shadow-md' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-black text-purple-700">{issue.issueNo}</span>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] border ${statusBg}`}>
                    {issue.status}
                  </span>
                </div>

                <h4 className="text-sm font-black text-slate-900 line-clamp-1">{issue.title}</h4>
                <p className="text-xs text-slate-600 font-semibold line-clamp-2 mt-1">{issue.description}</p>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-bold">
                  <span>Priority: <strong className="text-slate-900 font-black">{issue.priority}</strong></span>
                  <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Detail Pane */}
        <div className="lg:col-span-7">
          {selectedIssue ? (
            <div className="bg-white p-6 rounded-3xl space-y-5 border border-slate-200 shadow-sm">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-black text-purple-700">{selectedIssue.issueNo} • {selectedIssue.category}</span>
                  <h2 className="text-lg font-black text-slate-900 mt-1">{selectedIssue.title}</h2>
                  <p className="text-xs text-slate-500 font-bold mt-1">Reported on {new Date(selectedIssue.createdAt).toLocaleString()}</p>
                </div>

                <span className="px-3 py-1 rounded-xl text-xs font-black bg-purple-100 text-purple-900 border border-purple-300">
                  {selectedIssue.status}
                </span>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Issue Details</h4>
                <p className="text-xs text-slate-800 font-bold leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {selectedIssue.description}
                </p>
              </div>

              {/* Resolution Notes */}
              {selectedIssue.resolutionNotes && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-extrabold">
                  <strong>Resolution Notes:</strong> {selectedIssue.resolutionNotes}
                </div>
              )}

              {/* Assigned Staff */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-bold">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>Assigned Staff: <strong className="text-slate-900 font-black">{selectedIssue.assignedStaff?.name || 'Unassigned (Pending Staff Allocation)'}</strong></span>
              </div>

              {/* Comment Timeline */}
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5 uppercase">
                  <MessageSquare className="w-4 h-4 text-purple-600" />
                  Communication Thread
                </h4>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedIssue.comments && selectedIssue.comments.length > 0 ? (
                    selectedIssue.comments.map((c) => (
                      <div key={c.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                        <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold">
                          <strong className="text-purple-700 font-black">{c.user?.name} ({c.user?.role})</strong>
                          <span>{new Date(c.createdAt).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-slate-900 font-semibold">{c.content}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 font-bold">No comments yet. Write a message below.</p>
                  )}
                </div>

                {/* Add Comment Form */}
                <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Type a response or question for staff..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-black rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 text-center text-slate-500 rounded-3xl border border-slate-200 font-bold">Select a ticket to view details.</div>
          )}
        </div>
      </div>
    </div>
  );
};
