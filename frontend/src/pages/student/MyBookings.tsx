import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Wrench, MapPin, CheckCircle2, AlertCircle, XCircle, Search, Filter } from 'lucide-react';
import { api } from '../../services/api';
import { Booking } from '../../types';

export const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/my');
      if (res.data.success) {
        setBookings(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const res = await api.put(`/bookings/${id}/status`, { status: 'CANCELLED' });
      if (res.data.success) {
        fetchBookings();
      }
    } catch (e) {
      alert('Failed to cancel booking');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filterStatus === 'ALL') return true;
    return b.status === filterStatus;
  });

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto text-slate-900 bg-slate-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
            <Calendar className="w-5 h-5 text-purple-600" />
            My Equipment Bookings
          </h1>
          <p className="text-xs text-slate-600 font-bold">Track and manage all your reserved tools across campus labs</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                filterStatus === st ? 'bg-purple-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center font-bold text-purple-600">Loading bookings...</div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white p-8 text-center rounded-3xl border border-slate-200 shadow-sm text-slate-600">
          <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-black text-slate-900">No Bookings Found</p>
          <p className="text-xs text-slate-500 font-medium">You haven't made any bookings matching this filter status yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBookings.map((b) => {
            let statusBg = 'bg-orange-100 text-orange-900 border-orange-300 font-extrabold';
            if (b.status === 'APPROVED') statusBg = 'bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold';
            if (b.status === 'REJECTED') statusBg = 'bg-red-100 text-red-900 border-red-300 font-extrabold';
            if (b.status === 'CANCELLED') statusBg = 'bg-slate-100 text-slate-600 border-slate-300 font-bold';

            return (
              <div key={b.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-purple-400 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0 mt-0.5 shadow-xs">
                    <Wrench className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-slate-900">{b.equipment?.name || 'Lab Equipment'}</h4>
                      <span className={`px-2.5 py-0.5 rounded text-[10px] border ${statusBg}`}>
                        {b.status}
                      </span>
                    </div>

                    <p className="text-xs text-purple-700 font-extrabold mt-0.5">{b.lab?.name || 'Campus Lab'}</p>

                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-700 font-bold flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-purple-600" /> Date: <strong className="text-slate-900 font-black">{b.date}</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-blue-600" /> Slot: <strong className="text-slate-900 font-black">{b.startTime} - {b.endTime}</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        Purpose: <em className="text-slate-600 font-semibold">{b.purpose}</em>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {(b.status === 'PENDING' || b.status === 'APPROVED') && (
                  <button
                    onClick={() => handleCancel(b.id)}
                    className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-black transition-all shrink-0 cursor-pointer shadow-xs"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
