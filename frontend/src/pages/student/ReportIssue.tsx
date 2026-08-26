import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Send, Image as ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';
import { Lab, Equipment } from '../../types';

export const ReportIssue: React.FC = () => {
  const navigate = useNavigate();

  const [labs, setLabs] = useState<Lab[]>([]);
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Equipment Failure');
  const [priority, setPriority] = useState('MEDIUM');
  const [labId, setLabId] = useState('');
  const [equipmentId, setEquipmentId] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    api.get('/labs').then((res) => setLabs(res.data.data || []));
    api.get('/equipment').then((res) => setEquipmentList(res.data.data || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      setMessage({ type: 'error', text: 'Please fill in required fields.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await api.post('/issues', {
        title,
        category,
        priority,
        labId: labId || null,
        equipmentId: equipmentId || null,
        description,
        imageUrl: imageUrl || null
      });

      if (res.data.success) {
        setMessage({ type: 'success', text: `Issue ticket ${res.data.data.issueNo} submitted successfully!` });
        setTimeout(() => navigate('/student/my-issues'), 1500);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to submit issue' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[900px] mx-auto text-slate-900 bg-slate-50 min-h-screen">
      <div>
        <h1 className="text-xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          Report a Campus / Lab Issue
        </h1>
        <p className="text-xs text-slate-600 font-bold">Submit a ticket for technical equipment failure, network problems or safety hazards</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        {message && (
          <div className={`p-3 rounded-xl mb-4 text-xs font-bold flex items-center gap-2 ${
            message.type === 'success' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-red-100 text-red-900 border border-red-300'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Issue Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-black text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white cursor-pointer"
              >
                <option value="Equipment Failure" className="font-bold">Equipment Failure</option>
                <option value="Electrical Problem" className="font-bold">Electrical Problem</option>
                <option value="Software Problem" className="font-bold">Software Problem</option>
                <option value="Lab Maintenance" className="font-bold">Lab Maintenance</option>
                <option value="Safety Issue" className="font-bold">Safety Issue</option>
                <option value="Network Issue" className="font-bold">Network Issue</option>
                <option value="Other" className="font-bold">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-black text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white cursor-pointer"
              >
                <option value="LOW" className="font-bold">Low</option>
                <option value="MEDIUM" className="font-bold">Medium</option>
                <option value="HIGH" className="font-bold">High</option>
                <option value="URGENT" className="font-bold">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Issue Title</label>
            <input
              type="text"
              placeholder="Brief summary of the issue (e.g. 3D Printer Extruder Motor Jammed)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Select Lab (Optional)</label>
              <select
                value={labId}
                onChange={(e) => setLabId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-black text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white cursor-pointer"
              >
                <option value="" className="font-bold">Select Lab...</option>
                {labs.map((l) => (
                  <option key={l.id} value={l.id} className="font-bold">{l.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Select Equipment (Optional)</label>
              <select
                value={equipmentId}
                onChange={(e) => setEquipmentId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-black text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white cursor-pointer"
              >
                <option value="" className="font-bold">Select Equipment...</option>
                {equipmentList.map((eq) => (
                  <option key={eq.id} value={eq.id} className="font-bold">{eq.name} ({eq.equipmentId})</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Detailed Description</label>
            <textarea
              rows={4}
              placeholder="Describe symptoms, steps to reproduce, error codes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Image URL (Optional Attachment)</label>
            <div className="relative">
              <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                placeholder="https://..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-black rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Submitting Ticket...' : 'Submit Issue Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
