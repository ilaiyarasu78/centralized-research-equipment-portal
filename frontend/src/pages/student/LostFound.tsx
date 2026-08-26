import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Plus, MapPin, Calendar, Phone, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import { LostFoundItem } from '../../types';

export const LostFound: React.FC = () => {
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [status, setStatus] = useState<'LOST' | 'FOUND'>('LOST');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await api.get('/lost-found');
      if (res.data.success) {
        setItems(res.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/lost-found', {
        title,
        category,
        description,
        location,
        date: new Date().toISOString().split('T')[0],
        status,
        contactInfo
      });
      if (res.data.success) {
        setShowModal(false);
        fetchItems();
      }
    } catch (e) {
      alert('Failed to submit item');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto text-slate-900 bg-slate-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
            <SearchIcon className="w-5 h-5 text-purple-600" />
            Campus Lost & Found Directory
          </h1>
          <p className="text-xs text-slate-600 font-bold">Report missing property or search for claimed belongings across campus</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-black rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Report Item
        </button>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-purple-400 transition-all">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-black border ${
                  item.status === 'LOST' ? 'bg-red-100 text-red-900 border-red-300' : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                }`}>
                  {item.status}
                </span>
                <span className="text-[11px] text-slate-500 font-bold">{item.date}</span>
              </div>

              <h4 className="text-sm font-black text-slate-900">{item.title}</h4>
              <p className="text-xs text-slate-700 font-semibold line-clamp-2 mt-1">{item.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 mt-3 space-y-1.5 text-xs text-slate-800 font-bold">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-purple-600" />
                <span>Location: {item.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-cyan-600" />
                <span>Contact: {item.contactInfo}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Report Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl text-slate-900">
            <h3 className="text-base font-black text-slate-900">Report Lost or Found Item</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e: any) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                >
                  <option value="LOST">I Lost an Item</option>
                  <option value="FOUND">I Found an Item</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Item Title</label>
                <input
                  type="text"
                  placeholder="e.g. Black Sony Wireless Earbuds"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Near IDEA LAB Room 102"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Details, distinctive markings..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Contact Phone / Email</label>
                <input
                  type="text"
                  placeholder="Phone number or student email"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs font-bold text-slate-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white text-xs font-black rounded-xl">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
