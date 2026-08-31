import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Boxes, Wrench, Calendar, AlertTriangle, Plus, Trash2, Edit3, BarChart2, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [labs, setLabs] = useState<any[]>([]);
  const [equipmentList, setEquipmentList] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'USERS' | 'LABS' | 'EQUIPMENT'>('OVERVIEW');
  const [userRoleFilter, setUserRoleFilter] = useState<'ALL' | 'STUDENT' | 'STAFF' | 'ADMIN'>('ALL');

  // Modal States
  const [showAddLab, setShowAddLab] = useState(false);
  const [showAddEquip, setShowAddEquip] = useState(false);

  // New Lab Form
  const [labName, setLabName] = useState('');
  const [labCode, setLabCode] = useState('');
  const [labCategory, setLabCategory] = useState('Innovation Hub');
  const [labDesc, setLabDesc] = useState('');

  // New Equipment Form
  const [eqName, setEqName] = useState('');
  const [eqId, setEqId] = useState('');
  const [eqCategory, setEqCategory] = useState('3D Printing');
  const [eqLabId, setEqLabId] = useState('');

  const [studentStats, setStudentStats] = useState<any>(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const sRes = await api.get('/admin/stats');
      if (sRes.data.success) setStats(sRes.data.data);

      const stRes = await api.get('/admin/students/stats');
      if (stRes.data.success) setStudentStats(stRes.data.data);

      const uRes = await api.get('/admin/users');
      if (uRes.data.success) setUsers(uRes.data.data);

      const lRes = await api.get('/labs');
      if (lRes.data.success) setLabs(lRes.data.data);

      const eRes = await api.get('/equipment');
      if (eRes.data.success) setEquipmentList(eRes.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!window.confirm(`Are you absolutely sure you want to permanently delete user "${name}" and all their associated bookings, reports, and profile details? This action is irreversible.`)) {
      return;
    }
    try {
      const res = await api.delete(`/admin/users/${id}`);
      if (res.data.success) {
        alert(res.data.message || 'User deleted successfully.');
        fetchAdminData();
      }
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed to delete user.');
    }
  };

  const handleCreateLab = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/labs', {
        name: labName,
        code: labCode,
        category: labCategory,
        description: labDesc,
        location: 'Main Block 2nd Floor'
      });
      if (res.data.success) {
        setShowAddLab(false);
        fetchAdminData();
      }
    } catch (e) {
      alert('Failed to add lab');
    }
  };

  const handleCreateEquip = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/equipment', {
        name: eqName,
        equipmentId: eqId,
        category: eqCategory,
        labId: eqLabId || (labs[0]?.id || '')
      });
      if (res.data.success) {
        setShowAddEquip(false);
        fetchAdminData();
      }
    } catch (e) {
      alert('Failed to add equipment');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto text-slate-900 bg-slate-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
            <Shield className="w-5 h-5 text-purple-600" />
            Smart Campus Global Administration Console
          </h1>
          <p className="text-xs text-slate-600 font-bold">Master management for users, campus labs, equipment inventories and telemetry analytics</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
          {(['OVERVIEW', 'USERS', 'LABS', 'EQUIPMENT'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                if (tab === 'USERS') {
                  setUserRoleFilter('ALL');
                }
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === tab ? 'bg-purple-100 text-purple-950 border border-purple-300 shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Telemetry Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-purple-300 hover:scale-[1.01] active:scale-[0.99] transition-all" onClick={() => navigate('/admin/students')}>
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Total Students</span>
              <h3 className="text-2xl font-black text-purple-700 mt-1">{studentStats?.totalStudents ?? stats?.totalStudents ?? 0}</h3>
              <p className="text-[10px] text-purple-600 font-bold mt-1">Click to view student directory →</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Active Students</span>
              <h3 className="text-2xl font-black text-emerald-700 mt-1">{studentStats?.activeStudents ?? 0}</h3>
              <p className="text-[10px] text-emerald-600 font-bold mt-1">{studentStats?.newStudents ?? 0} new this month</p>
            </div>

            <div 
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-blue-300 hover:scale-[1.01] active:scale-[0.99] transition-all"
              onClick={() => {
                setActiveTab('USERS');
                setUserRoleFilter('STAFF');
              }}
            >
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Total Staff</span>
              <h3 className="text-2xl font-black text-blue-700 mt-1">{stats?.totalStaff || 0}</h3>
              <p className="text-[10px] text-blue-600 font-bold mt-1">Click to view staff directory →</p>
            </div>

            <div 
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-purple-300 hover:scale-[1.01] active:scale-[0.99] transition-all"
              onClick={() => {
                setActiveTab('LABS');
              }}
            >
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Total Campus Labs</span>
              <h3 className="text-2xl font-black text-purple-700 mt-1">{stats?.totalLabs || 0}</h3>
              <p className="text-[10px] text-purple-600 font-bold mt-1">Click to view lab details →</p>
            </div>
          </div>

          {/* Quick Access Card for Student Management */}
          <div 
            className="p-6 rounded-3xl bg-purple-50/70 border border-purple-200 text-purple-950 shadow-xs cursor-pointer hover:border-purple-300 hover:bg-purple-50 hover:scale-[1.002] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            onClick={() => navigate('/admin/students')}
          >
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-950 bg-purple-100 px-2.5 py-0.5 rounded border border-purple-300">
                AUTOMATIC STUDENT SYNCHRONIZATION
              </span>
              <h3 className="text-xl font-black text-purple-950">Student Management Directory</h3>
              <p className="text-xs text-purple-900/90 font-bold max-w-xl leading-relaxed">
                View all registered students in real-time, filter by department, year, section & status, inspect individual profiles, and update account permissions.
              </p>
            </div>
            <button className="self-start sm:self-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-black rounded-xl flex items-center gap-1.5 shadow-md shrink-0 transition-all cursor-pointer">
              Open Directory <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* USERS TAB (Fixes Screenshot 2) */}
      {activeTab === 'USERS' && (() => {
        const filteredUsers = users.filter((u) => {
          if (userRoleFilter === 'ALL') return true;
          return u.role === userRoleFilter;
        });

        return (
          <div className="bg-white p-6 rounded-3xl space-y-4 border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
                <Users className="w-4 h-4 text-purple-600" />
                Registered Campus Users ({filteredUsers.length})
              </h3>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                {(['ALL', 'STUDENT', 'STAFF', 'ADMIN'] as const).map((role) => (
                  <button
                    key={role}
                    onClick={() => setUserRoleFilter(role)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                      userRoleFilter === role
                        ? 'bg-white text-purple-950 shadow-xs border border-slate-200/50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-900 font-semibold">
                <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] font-black border-b border-slate-200">
                  <tr>
                    <th className="p-3">User</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">ID / Reg No</th>
                    <th className="p-3">Email</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-purple-50/50 transition-colors">
                      <td className="p-3 font-black text-slate-900">{u.name}</td>
                      <td className="p-3">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-purple-100 text-purple-900 border border-purple-300">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-slate-700">{u.studentProfile?.registerNo || u.staffProfile?.employeeId || 'N/A'}</td>
                      <td className="p-3 font-semibold text-slate-600">{u.email}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-xl border border-red-200 transition-all cursor-pointer shadow-xs inline-flex items-center gap-1 font-bold text-[10px]"
                          title="Delete user account"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })()}

      {/* LABS TAB */}
      {activeTab === 'LABS' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black text-slate-900 uppercase">Campus Labs Manager</h3>
            <button
              onClick={() => setShowAddLab(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-black rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add New Lab
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {labs.map((lab) => (
              <div key={lab.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <h4 className="text-sm font-black text-slate-900">{lab.name} ({lab.code})</h4>
                <p className="text-xs text-purple-700 font-extrabold">{lab.category}</p>
                <p className="text-xs text-slate-600 font-bold">{lab.location}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EQUIPMENT TAB */}
      {activeTab === 'EQUIPMENT' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black text-slate-900 uppercase">Equipment Inventory</h3>
            <button
              onClick={() => setShowAddEquip(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-black rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Equipment
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {equipmentList.map((eq) => (
              <div key={eq.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-[10px] font-extrabold bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded border border-purple-300">
                  {eq.category}
                </span>
                <h4 className="text-sm font-black text-slate-900">{eq.name}</h4>
                <p className="text-xs text-slate-600 font-bold">ID: {eq.equipmentId}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Lab Modal */}
      {showAddLab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl text-slate-900">
            <h3 className="text-base font-black text-slate-900">Add New Campus Lab</h3>
            <form onSubmit={handleCreateLab} className="space-y-3">
              <input
                type="text"
                placeholder="Lab Name (e.g. AI ROBOTICS LAB)"
                value={labName}
                onChange={(e) => setLabName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                required
              />
              <input
                type="text"
                placeholder="Lab Code (e.g. LAB-AIR-08)"
                value={labCode}
                onChange={(e) => setLabCode(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                required
              />
              <textarea
                placeholder="Description"
                value={labDesc}
                onChange={(e) => setLabDesc(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                required
              />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddLab(false)} className="px-4 py-2 text-xs font-bold text-slate-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white text-xs font-black rounded-xl">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Equipment Modal */}
      {showAddEquip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl text-slate-900">
            <h3 className="text-base font-black text-slate-900">Add New Equipment</h3>
            <form onSubmit={handleCreateEquip} className="space-y-3">
              <input
                type="text"
                placeholder="Equipment Name"
                value={eqName}
                onChange={(e) => setEqName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                required
              />
              <input
                type="text"
                placeholder="Equipment ID (e.g. EQ-IDEA-3D-99)"
                value={eqId}
                onChange={(e) => setEqId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                required
              />
              <select
                value={eqLabId}
                onChange={(e) => setEqLabId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
              >
                {labs.map((l) => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddEquip(false)} className="px-4 py-2 text-xs font-bold text-slate-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white text-xs font-black rounded-xl">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
