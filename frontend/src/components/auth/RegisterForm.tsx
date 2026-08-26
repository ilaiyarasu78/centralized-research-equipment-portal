import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserCheck, Mail, Lock, Phone, GraduationCap, ArrowRight, AlertCircle, Sparkles, Building2, Key, User } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { InteractiveCampus3D } from '../3d/InteractiveCampus3D';

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  // Registration Role Method Tabs
  const [role, setRole] = useState<'STUDENT' | 'STAFF'>('STUDENT');

  // All Form Input Fields Default to 100% BLANK Empty Strings
  const [name, setName] = useState('');
  const [registerNo, setRegisterNo] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your password entries.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/auth/register', {
        name,
        registerNo,
        email,
        department: department || 'Information Technology',
        year: year ? Number(year) : 1,
        phone,
        password,
        role
      });

      if (res.data.success) {
        const { token, user: userObj } = res.data.data;
        localStorage.setItem('smart_campus_token', token);
        localStorage.setItem('smart_campus_user', JSON.stringify(userObj));
        setUser(userObj);
        
        if (role === 'STAFF') {
          navigate('/staff/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please verify your form entries.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto py-4 px-2 sm:px-4 text-slate-900 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Tagline & 3D Interactive Campus */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
              Join the future of{' '}
              <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Smart Campus Innovation.
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed font-medium">
              Create your account to unlock real-time lab slot reservations, equipment tracking, and 3D campus exploration.
            </p>
          </div>

          {/* Interactive 3D Realistic Campus Box */}
          <div className="rounded-3xl border border-slate-200 bg-white shadow-lg relative overflow-hidden h-[450px] sm:h-[500px]">
            <InteractiveCampus3D />
          </div>

          {/* Institution Card */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div className="w-16 h-14 rounded-xl overflow-hidden shadow-xs shrink-0 border border-slate-200 bg-white p-1">
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

        {/* RIGHT COLUMN: Registration Form Box (100% Blank Inputs & Multi-Role Method) */}
        <div className="lg:col-span-5">
          <div className="bg-white text-slate-900 rounded-3xl p-7 sm:p-8 shadow-xl border border-slate-200 relative">
            <div className="text-center mb-5">
              <span className="text-[10px] font-bold text-blue-900 bg-blue-100 px-3 py-1 rounded-full border border-blue-300 uppercase tracking-widest inline-flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3 h-3 text-blue-700" /> ACCOUNT REGISTRATION
              </span>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create Your Account</h2>
              <p className="text-xs text-slate-600 mt-1 font-medium">Access Karpagam Institute 3D Smart Campus</p>
            </div>

            {/* Registration Role Selector Tabs */}
            <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-slate-100 border border-slate-200 rounded-2xl mb-5">
              <button
                type="button"
                onClick={() => setRole('STUDENT')}
                className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  role === 'STUDENT'
                    ? 'bg-white text-blue-700 shadow-sm border border-slate-200 font-extrabold'
                    : 'text-slate-700 hover:text-slate-900 font-semibold'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" /> Student Registration
              </button>
              <button
                type="button"
                onClick={() => setRole('STAFF')}
                className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  role === 'STAFF'
                    ? 'bg-white text-blue-700 shadow-sm border border-slate-200 font-extrabold'
                    : 'text-slate-700 hover:text-slate-900 font-semibold'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" /> Faculty Registration
              </button>
            </div>

            {/* Error Notification Alert */}
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form Inputs (100% Blank Default Values) */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {role === 'STUDENT' ? 'Register Number' : 'Employee ID'}
                  </label>
                  <input
                    type="text"
                    placeholder={role === 'STUDENT' ? 'e.g. 24CS101' : 'e.g. STF001'}
                    value={registerNo}
                    onChange={(e) => setRegisterNo(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">College Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="yourname@karpagam.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white cursor-pointer"
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="Information Technology">IT (Information Technology)</option>
                    <option value="Computer Science">CSE (Computer Science)</option>
                    <option value="Electronics & Communication">ECE (Electronics & Comm)</option>
                    <option value="Electrical & Electronics">EEE (Electrical & Electronics)</option>
                    <option value="Mechanical Engineering">MECH (Mechanical)</option>
                    <option value="Artificial Intelligence">AI & DS (AI & Data Science)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {role === 'STUDENT' ? 'Academic Year' : 'Designation'}
                  </label>
                  {role === 'STUDENT' ? (
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white cursor-pointer"
                      required
                    >
                      <option value="">Select Year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="e.g. Assistant Professor"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 border border-blue-400/80 text-white font-black text-xs tracking-wide rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-3"
                style={{ color: '#ffffff' }}
              >
                {loading ? (
                  <span style={{ color: '#ffffff' }}>Creating Account...</span>
                ) : (
                  <>
                    <span style={{ color: '#ffffff' }}>REGISTER ACCOUNT</span>
                    <ArrowRight className="w-4 h-4 text-white" style={{ color: '#ffffff' }} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 pt-3 border-t border-slate-100 text-center text-xs text-slate-600 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 font-bold hover:underline">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
