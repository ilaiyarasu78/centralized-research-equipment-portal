import React, { useState, useEffect } from 'react';
import { Newspaper, BellRing, Calendar } from 'lucide-react';
import { api } from '../../services/api';
import { Announcement } from '../../types';

export const NewsUpdates: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await api.get('/announcements');
      if (res.data.success) {
        setAnnouncements(res.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1200px] mx-auto text-slate-900 bg-slate-50 min-h-screen">
      <div>
        <h1 className="text-xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
          <Newspaper className="w-5 h-5 text-purple-600" />
          Campus News & Official Updates
        </h1>
        <p className="text-xs text-slate-600 font-bold">Official lab maintenance announcements, hackathons, and campus notices</p>
      </div>

      <div className="space-y-4">
        {announcements.map((a) => (
          <div key={a.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {a.isImportant && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-red-900 border border-red-300">
                    IMPORTANT NOTICE
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-900 border border-purple-300">
                  {a.category}
                </span>
              </div>
              <span className="text-xs text-slate-500 font-bold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-purple-600" />
                {new Date(a.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h3 className="text-base font-black text-slate-900">{a.title}</h3>
            <p className="text-xs text-slate-700 font-semibold leading-relaxed">{a.content}</p>

            <div className="pt-2 text-[11px] text-slate-500 font-bold border-t border-slate-100">
              Posted by: <strong className="text-purple-700 font-black">{a.author?.name || 'Campus Admin'}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
