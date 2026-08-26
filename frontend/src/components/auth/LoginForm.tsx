import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserCheck, Lock, Eye, EyeOff, AlertCircle, ArrowRight, GraduationCap, Shield, FlaskConical, CheckCircle2, Wrench, Calendar, Key } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { KarpagamSwooshLogo } from '../common/Sidebar';

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { loginStudent, loginStaff, loginAdmin } = useAuth();

  const [role, setRole] = useState<'STUDENT' | 'STAFF' | 'ADMIN'>('STUDENT');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleChange = (newRole: 'STUDENT' | 'STAFF' | 'ADMIN') => {
    setRole(newRole);
    setError(null);
    setIdentifier('');
    setPassword('');
  };

  const handleQuickDemoFill = (demoRole: 'STUDENT' | 'STAFF' | 'ADMIN') => {
    setRole(demoRole);
    setError(null);
    if (demoRole === 'STUDENT') {
      setIdentifier('24ita17');
      setPassword('Student@123');
    } else if (demoRole === 'STAFF') {
      setIdentifier('STF001');
      setPassword('Staff@123');
    } else {
      setIdentifier('admin@smartcampus.edu');
      setPassword('Admin@123');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (role === 'STUDENT') {
        await loginStudent(identifier, password);
        navigate('/student/dashboard');
      } else if (role === 'STAFF') {
        await loginStaff(identifier, password);
        navigate('/staff/dashboard');
      } else {
        await loginAdmin(identifier, password);
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please verify your ID and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1450px] mx-auto py-2 px-2 sm:px-4 text-slate-900 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* LEFT COLUMN (CARD 1): Light White Image Tint */}
        <div className="lg:col-span-7 relative rounded-[32px] overflow-hidden border border-slate-300 shadow-xl min-h-[620px] flex flex-col justify-between p-8 sm:p-10 group bg-slate-50">
          {/* Background Image: College Campus Building */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url('/assets/karpagam_building.jpg')` }}
          />
          {/* Soft Light White Overlay Tint */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/75 via-blue-50/50 to-white/40 backdrop-blur-[1px]" />

          {/* Concentric Circle Decorative Overlay Lines */}
          <div className="absolute top-0 right-0 w-80 h-80 border border-blue-400/20 rounded-full -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute top-0 right-0 w-60 h-60 border border-blue-400/20 rounded-full -mr-10 -mt-10 pointer-events-none" />

          {/* TOP ROW: Pill Badges */}
          <div className="relative z-10 flex items-center justify-between gap-4">
            <div className="bg-white/95 backdrop-blur-md border border-slate-300 text-slate-900 text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-2 shadow-md">
              <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-extrabold">✓</span>
              <span>Smart Campus • Lab Access</span>
            </div>

            <div className="bg-white/95 backdrop-blur-md border border-slate-300 text-slate-800 text-[11px] font-mono font-bold tracking-widest px-4 py-1.5 rounded-full shadow-md uppercase">
              COIMBATORE • 641105
            </div>
          </div>

          {/* CENTER SECTION: Headlines & Taglines */}
          <div className="relative z-10 my-auto py-8">
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-blue-700 uppercase mb-3">
              <span className="w-6 h-[2px] bg-blue-600 inline-block" />
              PRACTICAL LEARNING, CONNECTED
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] max-w-xl">
              Your lab session starts <span className="text-blue-600 font-black underline decoration-blue-400/60 underline-offset-4">here.</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-700 mt-5 max-w-lg leading-relaxed font-semibold">
              Enter one focused campus gateway for practical schedules, lab access, equipment updates, and your next hands-on session.
            </p>

            {/* Bottom Badges List */}
            <div className="flex items-center gap-3 mt-8 flex-wrap">
              <div className="bg-white/95 backdrop-blur-md border border-slate-300 text-slate-900 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-md">
                <FlaskConical className="w-3.5 h-3.5 text-blue-600" />
                <span>Lab booking</span>
              </div>

              <div className="bg-white/95 backdrop-blur-md border border-slate-300 text-slate-900 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-md">
                <Wrench className="w-3.5 h-3.5 text-purple-600" />
                <span>Equipment status</span>
              </div>

              <div className="bg-white/95 backdrop-blur-md border border-slate-300 text-slate-900 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-md">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <span>Practical schedules</span>
              </div>
            </div>
          </div>

          {/* BOTTOM RIGHT: Circular Laboratory Preview Cutout Graphic */}
          <div className="absolute bottom-6 right-6 z-10 hidden sm:block">
            <div className="w-28 h-28 rounded-full border-4 border-white overflow-hidden shadow-2xl relative group-hover:scale-105 transition-transform bg-white p-1">
              <img
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=300"
                alt="Lab Preview"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (CARD 2): Clean White Login Card */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-white rounded-[32px] shadow-xl p-8 sm:p-10 border border-slate-200/90 relative overflow-hidden flex-1 flex flex-col justify-between">
            {/* Top Blue Accent Edge */}
            <div className="bg-blue-600 h-1.5 w-full absolute top-0 left-0" />

            <div>
              {/* Header inside Card with Large Crisp Logo */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-blue-600 font-bold text-xs uppercase tracking-wider">
                  <FlaskConical className="w-4 h-4" />
                  <span>LAB ACCESS</span>
                </div>

                <div className="w-12 h-12 rounded-full border border-slate-200 overflow-hidden p-1 shadow-xs bg-white flex items-center justify-center">
                  <KarpagamSwooshLogo className="w-9 h-9" />
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Sign in to your portal
              </h2>
              <p className="text-xs text-slate-600 mt-1 font-medium">Choose your access type to continue.</p>

              {/* Segmented Control Role Tabs */}
              <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-100 border border-slate-200 rounded-2xl my-5">
                <button
                  type="button"
                  onClick={() => handleRoleChange('STUDENT')}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    role === 'STUDENT'
                      ? 'bg-white text-blue-700 shadow-sm border border-slate-200 font-extrabold'
                      : 'text-slate-700 hover:text-slate-900 font-semibold'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" /> Student
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange('STAFF')}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    role === 'STAFF'
                      ? 'bg-white text-blue-700 shadow-sm border border-slate-200 font-extrabold'
                      : 'text-slate-700 hover:text-slate-900 font-semibold'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" /> Faculty
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange('ADMIN')}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    role === 'ADMIN'
                      ? 'bg-white text-blue-700 shadow-sm border border-slate-200 font-extrabold'
                      : 'text-slate-700 hover:text-slate-900 font-semibold'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" /> Lab Admin
                </button>
              </div>

              {/* Selected Role Summary Box */}
              <div className="bg-slate-50 border border-slate-200/90 p-3.5 rounded-2xl mb-5">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>{role === 'STUDENT' ? 'Student portal' : role === 'STAFF' ? 'Faculty / Staff portal' : 'Lab Admin console'}</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5 font-medium">
                  {role === 'STUDENT'
                    ? 'Access your labs, bookings, and equipment updates.'
                    : role === 'STAFF'
                    ? 'Manage lab allocations and review student reservations.'
                    : 'Master control over campus labs, inventories and telemetry analytics.'}
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs font-semibold mb-4 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Form Inputs */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Field 1: Register Number / Employee ID */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    {role === 'STUDENT' ? 'REGISTER NUMBER' : role === 'STAFF' ? 'EMPLOYEE ID' : 'ADMIN EMAIL'}
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="w-full pl-10 pr-4 py-3.5 bg-white border border-slate-300 rounded-2xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all shadow-xs"
                      placeholder={role === 'STUDENT' ? 'Enter your register number' : role === 'STAFF' ? 'Enter employee ID' : 'Enter admin email'}
                      required
                    />
                  </div>
                </div>

                {/* Field 2: Password */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    PASSWORD
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3.5 bg-white border border-slate-300 rounded-2xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all shadow-xs"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-xs text-slate-700 pt-1 font-medium">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 bg-white text-blue-600 focus:ring-0 cursor-pointer w-4 h-4"
                    />
                    <span className="font-semibold">Remember me</span>
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Please contact Karpagam Institute IT Support / HOD to reset your password.');
                    }}
                    className="text-blue-600 hover:text-blue-700 font-bold hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>

                {/* CTA Button with Explicit Pure White Text Styling (Fixes Screenshot Issue 100%) */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#1d4ed8] hover:bg-[#1e40af] !text-white text-white font-extrabold text-sm tracking-wide rounded-2xl transition-all border border-blue-400/80 shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer mt-4"
                  style={{ color: '#ffffff' }}
                >
                  {loading ? (
                    <span className="!text-white text-white font-extrabold text-sm" style={{ color: '#ffffff' }}>Authenticating...</span>
                  ) : (
                    <>
                      <span className="!text-white text-white font-extrabold text-sm tracking-wide" style={{ color: '#ffffff' }}>Continue to portal</span>
                      <ArrowRight className="w-4 h-4 !text-white text-white" style={{ color: '#ffffff' }} />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Quick Demo Fill Options */}
            <div className="mt-5 pt-3 border-t border-slate-100">
              <p className="text-[10px] text-slate-500 font-semibold text-center mb-1.5">Auto-fill Demo Credentials:</p>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('STUDENT')}
                  className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold hover:bg-purple-100 transition-all cursor-pointer"
                >
                  Student Demo
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('STAFF')}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold hover:bg-blue-100 transition-all cursor-pointer"
                >
                  Staff Demo
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('ADMIN')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 text-[10px] font-bold hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Admin Demo
                </button>
              </div>
            </div>

            {/* Footer text inside Card */}
            <div className="mt-4 text-center text-xs text-slate-600 font-medium">
              New to the lab portal?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-bold hover:underline">
                Activate your access
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
