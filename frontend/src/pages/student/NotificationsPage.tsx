import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import { api } from '../../services/api';
import { Notification } from '../../types';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.data.notifications || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1000px] mx-auto text-slate-900 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
            <Bell className="w-5 h-5 text-purple-600" />
            Notification Center
          </h1>
          <p className="text-xs text-slate-600 font-bold">Updates on equipment bookings, issue status changes, and campus alerts</p>
        </div>

        <button
          onClick={markAllRead}
          className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-black rounded-xl border border-purple-300 flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <CheckCheck className="w-4 h-4 text-purple-700" /> Mark All as Read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`bg-white p-4 rounded-2xl flex items-start justify-between gap-4 border shadow-sm ${
              !n.isRead ? 'border-l-4 border-l-purple-600 border-slate-200 bg-purple-50/40' : 'border-slate-200'
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-slate-900">{n.title}</h4>
                <span className="text-[10px] text-slate-500 font-bold">{new Date(n.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-xs text-slate-700 font-semibold mt-1">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
