import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Eye,
  ShieldCheck,
  RefreshCw,
  Mail,
  GraduationCap,
  Boxes,
  Wrench,
  BookOpen,
  AlertTriangle,
  X,
  Trash2,
  Edit3
} from 'lucide-react';
import { api } from '../../services/api';
import { User } from '../../types';
import { DEPARTMENTS } from '../../constants/departments';

export const FacultyStudentManagement: React.FC = () => {
  const { studentId } = useParams<{ studentId?: string }>();
  const navigate = useNavigate();

  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Edit details state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRegisterNo, setEditRegisterNo] = useState('');
  const [editDepartment, setEditDepartment] = useState('');
  const [editProgram, setEditProgram] = useState('');
  const [editYear, setEditYear] = useState('1');
  const [editSemester, setEditSemester] = useState('1');
  const [editSection, setEditSection] = useState('A');
  const [editBatch, setEditBatch] = useState('');
  const [editAdmissionYear, setEditAdmissionYear] = useState('2024');
  const [editPhone, setEditPhone] = useState('');
  const [editPersonalEmail, setEditPersonalEmail] = useState('');
  const [editAcademicStatus, setEditAcademicStatus] = useState('REGULAR');
  const [savingDetails, setSavingDetails] = useState(false);

  useEffect(() => {
    if (selectedStudent) {
      setEditName(selectedStudent.name || '');
      setEditEmail(selectedStudent.email || '');
      setEditRegisterNo(selectedStudent.studentProfile?.registerNo || '');
      setEditDepartment(selectedStudent.studentProfile?.department || '');
      setEditProgram(selectedStudent.studentProfile?.program || 'B.E.');
      setEditYear(String(selectedStudent.studentProfile?.year || 1));
      setEditSemester(String(selectedStudent.studentProfile?.semester || 1));
      setEditSection(selectedStudent.studentProfile?.section || 'A');
      setEditBatch(selectedStudent.studentProfile?.batch || '2024-2028');
      setEditAdmissionYear(String(selectedStudent.studentProfile?.admissionYear || 2024));
      setEditPhone(selectedStudent.studentProfile?.phone || '');
      setEditPersonalEmail(selectedStudent.studentProfile?.personalEmail || '');
      setEditAcademicStatus(selectedStudent.studentProfile?.academicStatus || 'REGULAR');
    } else {
      setIsEditing(false);
    }
  }, [selectedStudent]);

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    setSavingDetails(true);
    try {
      const res = await api.put(`/faculty/students/${selectedStudent.id}`, {
        name: editName,
        email: editEmail,
        registerNo: editRegisterNo,
        department: editDepartment,
        program: editProgram,
        year: Number(editYear),
        semester: Number(editSemester),
        section: editSection,
        batch: editBatch,
        admissionYear: Number(editAdmissionYear),
        phone: editPhone,
        personalEmail: editPersonalEmail,
        academicStatus: editAcademicStatus
      });
      if (res.data.success) {
        alert('Student details updated successfully.');
        setSelectedStudent(res.data.data);
        setIsEditing(false);
        fetchStudents();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update student details');
    } finally {
      setSavingDetails(false);
    }
  };

  // Search & Filter States
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');

  useEffect(() => {
    fetchStudents();
  }, [search, departmentFilter, yearFilter, sectionFilter]);

  useEffect(() => {
    if (studentId) {
      fetchStudentDetails(studentId);
    } else {
      setSelectedStudent(null);
    }
  }, [studentId]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (search) params.search = search;
      if (departmentFilter) params.department = departmentFilter;
      if (yearFilter) params.year = yearFilter;
      if (sectionFilter) params.section = sectionFilter;

      const res = await api.get('/faculty/students', { params });
      if (res.data?.success && Array.isArray(res.data.data)) {
        setStudents(res.data.data);
      } else {
        setStudents([]);
      }
    } catch (e) {
      console.error('Failed to fetch faculty students', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentDetails = async (id: string) => {
    setLoadingDetails(true);
    try {
      const res = await api.get(`/faculty/students/${id}`);
      if (res.data.success) {
        setSelectedStudent(res.data.data);
      }
    } catch (e: any) {
      alert(e.response?.data?.message || 'Unauthorized or failed to load student details');
      navigate('/faculty/students');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleRemoveStudent = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from your authorized class roster?`)) {
      return;
    }

    try {
      const res = await api.delete(`/faculty/students/${id}`);
      if (res.data?.success) {
        setStudents((prev) => prev.filter((s) => s.id !== id));
        alert(res.data.message || `Student ${name} removed from roster.`);
        fetchStudents();
      }
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed to remove student from roster');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto text-slate-900 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-purple-100 text-purple-950 font-extrabold text-[10px] uppercase tracking-wider border border-purple-300">
              FACULTY ACCESS CONTROL
            </span>
            <span className="text-xs font-bold text-slate-500">Database Filtered</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase mt-1 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-purple-700" />
            MY STUDENTS
          </h1>
          <p className="text-xs text-slate-600 font-bold">
            Authorized student roster automatically synchronized from central registration database
          </p>
        </div>

        <button
          onClick={fetchStudents}
          className="px-4 py-2.5 bg-purple-100 hover:bg-purple-200 text-purple-950 border border-purple-300 text-xs font-black rounded-2xl flex items-center gap-2 shadow-xs transition-all cursor-pointer shrink-0"
        >
          <RefreshCw className="w-4 h-4 text-purple-700" />
          REFRESH AUTHORIZED ROSTER
        </button>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search students in your authorized class..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
            />
          </div>

          {/* Department Filter */}
          <div className="md:col-span-2">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600 cursor-pointer"
            >
              <option value="">Department</option>
              {DEPARTMENTS.map((d) => (
                <option key={d.code} value={d.code}>{d.code}</option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div className="md:col-span-2">
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600 cursor-pointer"
            >
              <option value="">Academic Year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>

          {/* Section Filter */}
          <div className="md:col-span-2">
            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600 cursor-pointer uppercase"
            >
              <option value="">Section</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
              <option value="D">Section D</option>
            </select>
          </div>
        </div>
      </div>

      {/* STUDENT TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-extrabold text-slate-600 uppercase tracking-wider">
            Authorized Students: <strong className="text-blue-800 font-black">{students.length}</strong>
          </span>
          <span className="text-[11px] text-slate-500 font-medium">Backend Authorization Scope Enforced</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs font-bold text-slate-500 space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-600" />
            <p>Fetching authorized student roster from server...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="p-12 text-center text-xs font-bold text-slate-500">
            No authorized students match the criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold text-slate-900">
              <thead className="bg-slate-100/80 text-slate-700 uppercase text-[10px] font-black border-b border-slate-200">
                <tr>
                  <th className="p-4">Register No</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Year</th>
                  <th className="p-4">Section</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((st) => {
                  const profile = st.studentProfile;
                  const status = st.accountStatus || 'ACTIVE';
                  return (
                    <tr key={st.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="p-4 font-mono font-black text-blue-900">
                        {profile?.registerNo || 'N/A'}
                      </td>
                      <td className="p-4 font-black text-slate-900">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs shrink-0 border border-blue-200">
                            {(st.name || 'S').charAt(0)}
                          </div>
                          <span>{st.name || 'Student'}</span>
                        </div>
                      </td>
                      <td className="p-4 font-bold text-slate-800">
                        <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 text-[11px]">
                          {profile?.department || 'N/A'}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-slate-700">
                        {profile?.year ? `${profile.year}th Year` : 'N/A'}
                      </td>
                      <td className="p-4 font-bold text-slate-700 uppercase">
                        {profile?.section || 'A'}
                      </td>
                      <td className="p-4 font-semibold text-slate-600">
                        {st.email}
                      </td>
                      <td className="p-4">
                        {status === 'ACTIVE' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                            ● Active
                          </span>
                        )}
                        {status !== 'ACTIVE' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-700 border border-slate-300">
                            ● {status}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => navigate(`/faculty/students/${st.id}`)}
                            className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-950 border border-purple-300 font-black text-xs rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-purple-700" /> View
                          </button>

                          <button
                            onClick={() => handleRemoveStudent(st.id, st.name)}
                            className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-950 border border-red-300 font-black text-xs rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-700" /> Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FACULTY STUDENT PROFILE VIEW MODAL (/faculty/students/:studentId) */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <form onSubmit={handleSaveDetails} className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl text-slate-900 relative">
            <button
              type="button"
              onClick={() => navigate('/faculty/students')}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Banner Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white text-2xl font-black flex items-center justify-center shadow-md shrink-0">
                  {(selectedStudent.name || 'S').charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                        required
                        placeholder="Student Name"
                      />
                    ) : (
                      <h2 className="text-xl font-black text-slate-900">{selectedStudent.name || 'Student Profile'}</h2>
                    )}
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-900 border border-blue-300 uppercase">
                      STUDENT PROFILE
                    </span>
                  </div>
                  <p className="text-xs text-blue-800 font-mono font-bold mt-0.5">
                    Register No: <strong>{isEditing ? editRegisterNo : selectedStudent.studentProfile?.registerNo}</strong>
                  </p>
                  <p className="text-xs text-slate-600 font-semibold mt-0.5">
                    {isEditing ? `${editDepartment} • ${editYear}th Year • Section ${editSection}` : `${selectedStudent.studentProfile?.department} • ${selectedStudent.studentProfile?.year}th Year • Section ${selectedStudent.studentProfile?.section || 'A'}`}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 items-end shrink-0">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Edit3 className="w-4 h-4" /> Edit Student Details
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      disabled={savingDetails}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                    >
                      {savingDetails ? 'Saving...' : 'Save Details'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-black text-xs rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* AUTHORIZED ACADEMIC & CONTACT SUMMARY */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-2">
                <h3 className="text-xs font-black text-blue-900 uppercase tracking-wide flex items-center gap-1.5 border-b border-blue-200 pb-2">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-600" /> Academic Profile
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">Department</span>
                    {isEditing ? (
                      <select
                        value={editDepartment}
                        onChange={(e) => setEditDepartment(e.target.value)}
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                        required
                      >
                        {DEPARTMENTS.map((d) => (
                          <option key={d.code} value={d.code}>{d.code}</option>
                        ))}
                      </select>
                    ) : (
                      <strong className="text-slate-900">{selectedStudent.studentProfile?.department}</strong>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">Program</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editProgram}
                        onChange={(e) => setEditProgram(e.target.value)}
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                        required
                      />
                    ) : (
                      <strong className="text-slate-900">{selectedStudent.studentProfile?.program || 'B.E.'}</strong>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">Year / Semester</span>
                    {isEditing ? (
                      <div className="flex gap-1">
                        <select
                          value={editYear}
                          onChange={(e) => setEditYear(e.target.value)}
                          className="w-1/2 px-1 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                        >
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                        </select>
                        <select
                          value={editSemester}
                          onChange={(e) => setEditSemester(e.target.value)}
                          className="w-1/2 px-1 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                        >
                          {Array.from({ length: 8 }, (_, i) => i + 1).map((s) => (
                            <option key={s} value={String(s)}>{s}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <strong className="text-slate-900">{selectedStudent.studentProfile?.year}th Year (Sem {selectedStudent.studentProfile?.semester || 1})</strong>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">Section</span>
                    {isEditing ? (
                      <select
                        value={editSection}
                        onChange={(e) => setEditSection(e.target.value)}
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                        required
                      >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </select>
                    ) : (
                      <strong className="text-slate-900">Section {selectedStudent.studentProfile?.section || 'A'}</strong>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">Batch</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editBatch}
                        onChange={(e) => setEditBatch(e.target.value)}
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                        required
                      />
                    ) : (
                      <strong className="text-slate-900">{selectedStudent.studentProfile?.batch || '2024-2028'}</strong>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">Admission Year</span>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editAdmissionYear}
                        onChange={(e) => setEditAdmissionYear(e.target.value)}
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                        required
                      />
                    ) : (
                      <strong className="text-slate-900">{selectedStudent.studentProfile?.admissionYear || 2024}</strong>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5 border-b border-slate-200 pb-2">
                  <Mail className="w-3.5 h-3.5 text-slate-600" /> Contact Details
                </h3>
                <div className="space-y-1.5 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">College Email</span>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                        required
                      />
                    ) : (
                      <strong className="text-slate-900">{selectedStudent.email}</strong>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">Personal Email</span>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editPersonalEmail}
                        onChange={(e) => setEditPersonalEmail(e.target.value)}
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                        placeholder="Personal Email Address"
                      />
                    ) : (
                      <strong className="text-slate-800">{selectedStudent.studentProfile?.personalEmail || 'Not Provided'}</strong>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">Phone Number</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                        placeholder="Phone Number"
                      />
                    ) : (
                      <strong className="text-slate-800">{selectedStudent.studentProfile?.phone || 'Not Provided'}</strong>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2">
                <h3 className="text-xs font-black text-amber-900 uppercase tracking-wide flex items-center gap-1.5 border-b border-amber-200 pb-2">
                  <Clock className="w-3.5 h-3.5 text-amber-600" /> Account Metadata
                </h3>
                <div className="space-y-1.5 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">Register No</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editRegisterNo}
                        onChange={(e) => setEditRegisterNo(e.target.value)}
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
                        required
                      />
                    ) : (
                      <strong className="text-slate-900">{selectedStudent.studentProfile?.registerNo}</strong>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">Academic Status</span>
                    {isEditing ? (
                      <select
                        value={editAcademicStatus}
                        onChange={(e) => setEditAcademicStatus(e.target.value)}
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                        required
                      >
                        <option value="REGULAR">REGULAR</option>
                        <option value="LATERAL_ENTRY">LATERAL ENTRY</option>
                        <option value="TRANSFER">TRANSFER</option>
                        <option value="SUSPENDED">SUSPENDED</option>
                      </select>
                    ) : (
                      <strong className="text-emerald-700">{selectedStudent.studentProfile?.academicStatus || 'REGULAR'}</strong>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* SMART CAMPUS ACTIVITY */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Boxes className="w-4 h-4 text-blue-600" />
                Smart Campus Activity & Lab Usage
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Equipment & Lab Bookings */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-blue-600" /> Equipment Bookings
                    </span>
                    <span className="text-xs font-black bg-blue-100 text-blue-900 px-2 py-0.5 rounded border border-blue-300">
                      {selectedStudent.bookings?.length || 0}
                    </span>
                  </div>
                  {selectedStudent.bookings?.length === 0 ? (
                    <p className="text-[11px] text-slate-500">No equipment bookings.</p>
                  ) : (
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {selectedStudent.bookings?.map((b: any) => (
                        <div key={b.id} className="p-2 rounded bg-white border border-slate-200 text-[11px] space-y-0.5">
                          <p className="font-bold text-slate-900">{b.equipment?.name || 'Equipment'}</p>
                          <p className="text-slate-600">{b.date} • {b.startTime} - {b.endTime}</p>
                          <span className="text-[9px] font-black text-blue-700">{b.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Equipment Requests */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-purple-600" /> Equipment Requests
                    </span>
                    <span className="text-xs font-black bg-purple-100 text-purple-900 px-2 py-0.5 rounded border border-purple-300">
                      {selectedStudent.requests?.length || 0}
                    </span>
                  </div>
                  {selectedStudent.requests?.length === 0 ? (
                    <p className="text-[11px] text-slate-500">No requests submitted.</p>
                  ) : (
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {selectedStudent.requests?.map((r: any) => (
                        <div key={r.id} className="p-2 rounded bg-white border border-slate-200 text-[11px] space-y-0.5">
                          <p className="font-bold text-slate-900">{r.equipmentName}</p>
                          <p className="text-slate-600">{r.purpose}</p>
                          <span className="text-[9px] font-black text-purple-700">{r.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Issue Reports */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Reported Issues
                    </span>
                    <span className="text-xs font-black bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                      {selectedStudent.issues?.length || 0}
                    </span>
                  </div>
                  {selectedStudent.issues?.length === 0 ? (
                    <p className="text-[11px] text-slate-500">No reported issues.</p>
                  ) : (
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {selectedStudent.issues?.map((i: any) => (
                        <div key={i.id} className="p-2 rounded bg-white border border-slate-200 text-[11px] space-y-0.5">
                          <p className="font-bold text-slate-900">{i.title}</p>
                          <p className="text-slate-600">{i.issueNo} • {i.priority}</p>
                          <span className="text-[9px] font-black text-amber-700">{i.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/faculty/students')}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer"
              >
                Close View
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
