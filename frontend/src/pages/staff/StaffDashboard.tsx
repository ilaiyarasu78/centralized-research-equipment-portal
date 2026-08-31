import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, XCircle, Wrench, AlertTriangle, Clock, RefreshCw, Users, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import { Booking, Issue, Equipment } from '../../types';

export const StaffDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
  const [assignedIssues, setAssignedIssues] = useState<Issue[]>([]);
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [studentStats, setStudentStats] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    try {
      const bRes = await api.get('/bookings?status=PENDING');
      if (bRes.data?.success && Array.isArray(bRes.data.data)) {
        setPendingBookings(bRes.data.data);
      } else {
        setPendingBookings([]);
      }

      const iRes = await api.get('/issues?status=OPEN');
      if (iRes.data?.success && Array.isArray(iRes.data.data)) {
        setAssignedIssues(iRes.data.data);
      } else {
        setAssignedIssues([]);
      }

      const eRes = await api.get('/equipment');
      if (eRes.data?.success && Array.isArray(eRes.data.data)) {
        setEquipmentList(eRes.data.data);
      } else {
        setEquipmentList([]);
      }

      const stRes = await api.get('/faculty/students/stats');
      if (stRes.data?.success && typeof stRes.data.data === 'object' && !Array.isArray(stRes.data.data)) {
        setStudentStats(stRes.data.data);
      }
    } catch (e) {
      console.error('Staff dashboard fetch error', e);
      setPendingBookings([]);
      setAssignedIssues([]);
    }
  };

  const handleBookingAction = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await api.put(`/bookings/${id}/status`, {
        status,
        rejectionReason: status === 'REJECTED' ? rejectionReason : undefined
      });

      if (res.data.success) {
        setRejectionReason('');
        setSelectedBookingId(null);
        fetchStaffData();
      }
    } catch (e) {
      alert('Failed to update booking status');
    }
  };

  const handleResolveIssue = async (id: string) => {
    const notes = prompt('Enter resolution details/actions taken:');
    if (!notes) return;

    try {
      const res = await api.put(`/issues/${id}/status`, {
        status: 'RESOLVED',
        resolutionNotes: notes
      });
      if (res.data.success) fetchStaffData();
    } catch (e) {
      alert('Failed to resolve issue');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1500px] mx-auto text-slate-900 bg-slate-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            Staff Lab & Booking Control Desk
          </h1>
          <p className="text-xs text-slate-600 font-bold">Review student reservations, oversee equipment maintenance, and resolve reported tickets</p>
        </div>

        <button
          onClick={fetchStaffData}
          className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-950 text-xs font-black rounded-xl border border-purple-300 flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-purple-700" /> Refresh Queue
        </button>
      </div>

      {/* Faculty Student Roster Banner */}
      <div className="p-6 rounded-3xl bg-purple-50/70 border border-purple-200 text-purple-950 shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-950 bg-purple-100 px-2.5 py-0.5 rounded border border-purple-300">
              FACULTY ACCESS CONTROL
            </span>
            <span className="text-xs text-purple-900 font-extrabold">
              Authorized Students: <strong className="text-purple-950 text-sm font-black">{studentStats?.myStudents ?? 0}</strong>
            </span>
          </div>
          <h3 className="text-xl font-black text-purple-950 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-700" /> My Students Directory
          </h3>
          <p className="text-xs text-purple-900/90 font-bold max-w-xl leading-relaxed">
            Access authorized student profiles registered in your assigned class and department. View academic profiles and track lab usage.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Student Booking Approvals */}
        <div className="bg-white p-6 rounded-3xl space-y-4 border border-slate-200 shadow-sm">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
            <Clock className="w-4 h-4 text-orange-600" />
            Pending Student Booking Approval Queue ({pendingBookings.length})
          </h3>

          {pendingBookings.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center font-bold">No pending booking requests right now.</p>
          ) : (
            <div className="space-y-3">
              {pendingBookings.map((b) => (
                <div key={b.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{b.equipment?.name}</h4>
                      <p className="text-[11px] text-purple-700 font-bold">Requested by: <strong>{b.user?.name}</strong></p>
                    </div>
                    <span className="text-[10px] font-extrabold bg-orange-100 text-orange-900 border border-orange-300 px-2.5 py-0.5 rounded">
                      {b.date}
                    </span>
                  </div>

                  <p className="text-xs text-slate-800 font-bold">Slot: <strong>{b.startTime} - {b.endTime}</strong></p>
                  <p className="text-xs text-slate-600 font-semibold">Purpose: <em>{b.purpose}</em></p>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => handleBookingAction(b.id, 'APPROVED')}
                      className="px-3.5 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border border-emerald-300 text-xs font-black rounded-xl transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Approve
                    </button>
                    <button
                      onClick={() => handleBookingAction(b.id, 'REJECTED')}
                      className="px-3.5 py-1.5 bg-red-100 hover:bg-red-200 text-red-950 border border-red-300 text-xs font-black rounded-xl transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <XCircle className="w-3.5 h-3.5 text-red-700" /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Assigned Issue Tickets */}
        <div className="bg-white p-6 rounded-3xl space-y-4 border border-slate-200 shadow-sm">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            Open Issues & Maintenance Tickets ({assignedIssues.length})
          </h3>

          {assignedIssues.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center font-bold">All reported campus issues are resolved!</p>
          ) : (
            <div className="space-y-3">
              {assignedIssues.map((issue) => (
                <div key={issue.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-purple-700">{issue.issueNo} • {issue.category}</span>
                    <span className="text-[10px] font-extrabold bg-red-100 text-red-900 border border-red-300 px-2.5 py-0.5 rounded">
                      {issue.priority}
                    </span>
                  </div>

                  <h4 className="text-xs font-black text-slate-900">{issue.title}</h4>
                  <p className="text-xs text-slate-700 font-semibold">{issue.description}</p>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => handleResolveIssue(issue.id)}
                      className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-black rounded-xl transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mark Resolved
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
