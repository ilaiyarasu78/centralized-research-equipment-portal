import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  UserCheck,
  Mail,
  Lock,
  Phone,
  GraduationCap,
  ArrowRight,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Calendar,
  Layers,
  Award,
  LogIn,
  Shield,
  Briefcase
} from 'lucide-react';
import { api } from '../../services/api';
import { InteractiveCampus3D } from '../3d/InteractiveCampus3D';
import { DEPARTMENTS } from '../../constants/departments';

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState<'STUDENT' | 'STAFF'>('STUDENT');

  // Common & Student Form Inputs
  const [fullName, setFullName] = useState('');
  const [registerNumber, setRegisterNumber] = useState('');
  const [collegeEmail, setCollegeEmail] = useState('');
  const [personalEmail, setPersonalEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [program, setProgram] = useState('B.E.');
  const [year, setYear] = useState('3');
  const [semester, setSemester] = useState('5');
  const [section, setSection] = useState('A');
  const [batch, setBatch] = useState('2024-2028');
  const [admissionYear, setAdmissionYear] = useState('2024');

  // Faculty Specific Form Inputs
  const [position, setPosition] = useState('Assistant Professor');
  const [assignedDepartment, setAssignedDepartment] = useState('CSE');
  const [assignedYear, setAssignedYear] = useState('3');
  const [assignedSection, setAssignedSection] = useState('A');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Success Screen State
  const [registeredSuccess, setRegisteredSuccess] = useState<any | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validations
    if (!fullName.trim() || !registerNumber.trim() || !collegeEmail.trim() || !department || !password) {
      setError('Please fill in all required registration fields.');
      return;
    }

    if (role === 'STUDENT' && !year) {
      setError('Year of Study is required for student registration.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your entries.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        fullName,
        name: fullName,
        registerNumber,
        registerNo: registerNumber,
        collegeEmail,
        email: collegeEmail,
        personalEmail,
        phone,
        department,
        program,
        year: Number(year),
        semester: Number(semester),
        section,
        batch,
        admissionYear: Number(admissionYear),
        position,
        assignedDepartment: assignedDepartment || department,
        assignedYear: Number(assignedYear || year),
        assignedSection: assignedSection || section,
        password,
        confirmPassword,
        role
      };

      const res = await api.post('/auth/register', payload);

      if (res.data.success) {
        setRegisteredSuccess({
          role,
          name: fullName,
          registerNo: registerNumber,
          department,
          year,
          section: role === 'STAFF' ? assignedSection : section,
          email: collegeEmail,
          position: role === 'STAFF' ? position : undefined
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please verify your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto py-4 px-2 sm:px-4 text-slate-900 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Tagline & 3D Interactive Campus */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight uppercase">
              JOIN THE FUTURE OF{' '}
              <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                SMART CAMPUS INNOVATION.
              </span>
            </h1>
          </div>

          {/* Interactive 3D Realistic Campus Box */}
          <div className="rounded-3xl border border-slate-200 bg-white shadow-lg relative overflow-hidden h-[450px] sm:h-[520px]">
            <InteractiveCampus3D />
          </div>

          {/* Institution Card */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div className="w-16 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-white p-1">
              <img
                src="/assets/media_1787651763227.png"
                alt="Karpagam Campus Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight uppercase">
                Karpagam Institute of Technology
              </h3>
              <p className="text-xs text-purple-700 font-semibold mt-0.5">
                Autonomous • NAAC 'A++' • Coimbatore — 641 105
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Form or Success Screen */}
        <div className="lg:col-span-6">
          {registeredSuccess ? (
            /* REGISTRATION SUCCESS SCREEN */
            <div className="bg-white text-slate-900 rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-200 space-y-6 text-center animate-in fade-in zoom-in-95 duration-300">
              <div className="w-20 h-20 bg-emerald-100 border border-emerald-300 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-widest inline-block">
                  ✓ Registration Successful
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Welcome to Smart Campus!
                </h2>
                <p className="text-xs text-slate-600 font-semibold max-w-md mx-auto">
                  Your {registeredSuccess.role === 'STAFF' ? 'Faculty' : 'Student'} account has been created successfully and saved directly to the database.
                </p>
              </div>

              {/* Account Summary Card */}
              <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200 text-left space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-purple-200/80 pb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase">{registeredSuccess.role === 'STAFF' ? 'Faculty Profile' : 'Student Profile'}</span>
                  <span className="text-[10px] font-black text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded border border-purple-300">
                    STATUS: ACTIVE
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase">Full Name</p>
                    <p className="font-black text-slate-900">{registeredSuccess.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase">{registeredSuccess.role === 'STAFF' ? 'Employee ID' : 'Register Number'}</p>
                    <p className="font-black text-purple-800 font-mono text-sm">{registeredSuccess.registerNo}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase">Department</p>
                    <p className="font-bold text-slate-800">{registeredSuccess.department}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase">{registeredSuccess.role === 'STAFF' ? 'Designation' : 'Year / Section'}</p>
                    <p className="font-bold text-slate-800">{registeredSuccess.role === 'STAFF' ? registeredSuccess.position : `${registeredSuccess.year}th Year • Sec ${registeredSuccess.section}`}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-3">
                <p className="text-xs text-slate-600 font-semibold">
                  You can now log in directly to access your Smart Campus portal dashboard.
                </p>

                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="w-full py-4 bg-purple-100 hover:bg-purple-200 text-purple-950 border border-purple-300 font-black text-xs tracking-wider rounded-2xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  GO TO LOGIN
                </button>
              </div>
            </div>
          ) : (
            /* REGISTRATION FORM */
            <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 relative">
              <div className="text-center mb-5">
                <span className="text-[10px] font-bold text-purple-900 bg-purple-100 px-3 py-1 rounded-full border border-purple-300 uppercase tracking-widest inline-flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-3 h-3 text-purple-700" /> SMART CAMPUS REGISTRATION
                </span>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create Your Account</h2>
              </div>

              {/* Registration Type Selector Tabs */}
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setRole('STUDENT');
                    setError(null);
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    role === 'STUDENT'
                      ? 'bg-purple-100 text-purple-950 border border-purple-300 shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-purple-700" />
                  Student Registration
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole('STAFF');
                    setError(null);
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    role === 'STAFF'
                      ? 'bg-purple-100 text-purple-950 border border-purple-300 shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-purple-700" />
                  Faculty Registration
                </button>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs font-bold mb-4 flex items-center gap-2.5 shadow-sm">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* 1. Full Name & Register Number / Employee ID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      placeholder="Enter Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {role === 'STAFF' ? 'Employee ID *' : 'Register Number *'}
                    </label>
                    <input
                      type="text"
                      placeholder={role === 'STAFF' ? 'Enter Employee ID' : 'Enter Register Number'}
                      value={registerNumber}
                      onChange={(e) => setRegisterNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white font-mono uppercase"
                      required
                    />
                  </div>
                </div>

                {/* 2. Emails */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">College Email *</label>
                    <input
                      type="email"
                      placeholder="Enter College Email"
                      value={collegeEmail}
                      onChange={(e) => setCollegeEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      placeholder="Enter Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white"
                    />
                  </div>
                </div>

                {/* 3. Department & Role Specific Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Department *</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white cursor-pointer"
                      required
                    >
                      <option value="" disabled>Select Department</option>
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept.code} value={dept.name} className="font-bold py-1">
                          {dept.name} ({dept.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  {role === 'STAFF' ? (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Position / Designation *</label>
                      <select
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white cursor-pointer"
                      >
                        <option value="Professor">Professor</option>
                        <option value="Associate Professor">Associate Professor</option>
                        <option value="Assistant Professor">Assistant Professor</option>
                        <option value="Lab In-Charge & Faculty">Lab In-Charge & Faculty</option>
                        <option value="Head of Department (HOD)">Head of Department (HOD)</option>
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Program *</label>
                      <select
                        value={program}
                        onChange={(e) => setProgram(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white cursor-pointer"
                      >
                        <option value="B.E.">B.E. (Bachelor of Engineering)</option>
                        <option value="B.Tech.">B.Tech. (Bachelor of Technology)</option>
                        <option value="M.E.">M.E. (Master of Engineering)</option>
                        <option value="Ph.D.">Ph.D. Research Scholar</option>
                      </select>
                    </div>
                  )}
                </div>

                {role === 'STAFF' ? (
                  /* Faculty Assigned Class Roster Control */
                  <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2">
                    <span className="text-[10px] font-black text-purple-900 uppercase tracking-widest block">
                      FACULTY AUTHORIZED CLASS ROSTER
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Assigned Dept</label>
                        <select
                          value={assignedDepartment}
                          onChange={(e) => setAssignedDepartment(e.target.value)}
                          className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                        >
                          {DEPARTMENTS.map((d) => (
                            <option key={d.code} value={d.code}>{d.code}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Assigned Year</label>
                        <select
                          value={assignedYear}
                          onChange={(e) => setAssignedYear(e.target.value)}
                          className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                        >
                          <option value="1">1st Year</option>
                          <option value="2">2nd Year</option>
                          <option value="3">3rd Year</option>
                          <option value="4">4th Year</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Section</label>
                        <select
                          value={assignedSection}
                          onChange={(e) => setAssignedSection(e.target.value)}
                          className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                        >
                          <option value="A">Sec A</option>
                          <option value="B">Sec B</option>
                          <option value="C">Sec C</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Student Academic Year & Section */
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Year of Study *</label>
                      <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white cursor-pointer"
                        required
                      >
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Semester *</label>
                      <select
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white cursor-pointer"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                          <option key={s} value={s}>Sem {s}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Section *</label>
                      <select
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white cursor-pointer"
                      >
                        <option value="A">Sec A</option>
                        <option value="B">Sec B</option>
                        <option value="C">Sec C</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Password * (Min 8 chars)</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password *</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-purple-100 hover:bg-purple-200 text-purple-950 border border-purple-300 font-black text-xs tracking-wider rounded-2xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-4"
                >
                  {loading ? (
                    <span>CREATING {role === 'STAFF' ? 'FACULTY' : 'STUDENT'} ACCOUNT...</span>
                  ) : (
                    <>
                      <span>REGISTER {role === 'STAFF' ? 'FACULTY ACCOUNT' : 'STUDENT ACCOUNT'}</span>
                      <ArrowRight className="w-4 h-4 text-purple-700" />
                    </>
                  )}
                </button>
              </form>

              {/* Already Have an Account Link */}
              <div className="mt-5 text-center border-t border-slate-100 pt-4">
                <p className="text-xs font-semibold text-slate-600">
                  Already registered on Smart Campus?{' '}
                  <Link to="/login" className="font-extrabold text-purple-700 hover:text-purple-900 hover:underline">
                    Sign In to Portal
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
