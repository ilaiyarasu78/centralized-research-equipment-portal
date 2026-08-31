import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Shield, Lock, ArrowRight, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginStudent, loginStaff, loginAdmin, user } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [loginType, setLoginType] = useState<'STUDENT' | 'STAFF' | 'ADMIN'>('STUDENT');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') navigate('/admin/dashboard');
      else if (user.role === 'STAFF') navigate('/staff/dashboard');
      else navigate('/student/dashboard');
    }
  }, [user, navigate]);

  // 3D Canvas Particle Mesh Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Create 3D Nodes
    const numNodes = 60;
    const nodes: Array<{ x: number; y: number; z: number; rx: number; ry: number; rz: number }> = [];

    for (let i = 0; i < numNodes; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 180 + Math.random() * 40;

      nodes.push({
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(phi),
        rx: 0,
        ry: 0,
        rz: 0
      });
    }

    let angleX = 0.003;
    let angleY = 0.005;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Project and rotate 3D nodes
      const projected: Array<{ x: number; y: number; scale: number }> = [];

      nodes.forEach((node) => {
        // Rotate around Y axis
        let x1 = node.x * Math.cos(angleY) - node.z * Math.sin(angleY);
        let z1 = node.z * Math.cos(angleY) + node.x * Math.sin(angleY);

        // Rotate around X axis
        let y2 = node.y * Math.cos(angleX) - z1 * Math.sin(angleX);
        let z2 = z1 * Math.cos(angleX) + node.y * Math.sin(angleX);

        node.x = x1;
        node.y = y2;
        node.z = z2;

        const fov = 350;
        const scale = fov / (fov + z2);
        const x2d = centerX + x1 * scale;
        const y2d = centerY + y2 * scale;

        projected.push({ x: x2d, y: y2d, scale });
      });

      // Draw connecting lines between close 3D nodes
      ctx.lineWidth = 0.6;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].x - projected[j].x;
          const dy = projected[i].y - projected[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 90) {
            const alpha = (1 - dist / 90) * 0.4;
            ctx.strokeStyle = `rgba(124, 58, 237, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(projected[i].x, projected[i].y);
            ctx.lineTo(projected[j].x, projected[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw node spheres
      projected.forEach((p) => {
        ctx.fillStyle = '#6366f1';
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1, 3 * p.scale), 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleTabChange = (type: 'STUDENT' | 'STAFF' | 'ADMIN') => {
    setLoginType(type);
    setError(null);
    setIdentifier('');
    setPassword('');
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (loginType === 'STUDENT') {
        await loginStudent(identifier, password);
        navigate('/student/dashboard');
      } else if (loginType === 'STAFF') {
        await loginStaff(identifier, password);
        navigate('/staff/dashboard');
      } else {
        await loginAdmin(identifier, password);
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Top Institutional Header Banner (Karpagam Institute of Technology) */}
      <header className="bg-white text-slate-800 border-b border-slate-200 py-3 px-6 shadow-md relative z-20">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          {/* Logo & Institution Name */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shrink-0">
              KIT
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">
                KARPAGAM INSTITUTE OF TECHNOLOGY
              </h1>
              <p className="text-xs font-bold text-blue-700 tracking-wide">Inspiring Innovation • Coimbatore – 641 105</p>
            </div>
          </div>

          {/* Accreditation Badges */}
          <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-600 flex-wrap justify-center">
            <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg border border-amber-300 font-bold flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" /> NAAC 'A++' Accredited
            </span>
            <span className="bg-blue-50 text-blue-800 px-2.5 py-1 rounded-lg border border-blue-200 font-semibold">
              Autonomous • Approved by AICTE & UGC
            </span>
            <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-300">
              NBA Accredited (CSE, IT, ECE, MECH)
            </span>
          </div>
        </div>
      </header>

      {/* Main Center Content Grid */}
      <div className="flex-1 max-w-[1400px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 items-center p-6 gap-8 relative z-10">
        {/* Left Column: 3D Animation Visual Box */}
        <div className="lg:col-span-7 h-[480px] rounded-3xl bg-slate-800/60 border border-slate-700/50 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between p-8 shadow-2xl group">
          {/* Canvas for 3D Mesh */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

          {/* Top Tagline */}
          <div className="relative z-10 space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/40 inline-flex items-center gap-1.5 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" /> Next-Gen Smart Campus Infrastructure
            </span>
            <h2 className="text-3xl font-black text-white leading-tight tracking-tight">
              Lab & Equipment Access Management System
            </h2>
            <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
              Reserve high-precision 3D Printers, VLSI EDA suites, Oscilloscopes, PCB Milling equipment, and MATLAB compute clusters in real-time.
            </p>
          </div>

          {/* Interactive 3D Feature Cards */}
          <div className="relative z-10 grid grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-700/60 backdrop-blur-md">
              <h4 className="text-xs font-bold text-white">7 Campus Labs</h4>
              <p className="text-[10px] text-slate-400">IDEA, Cadence & NI Labs</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-700/60 backdrop-blur-md">
              <h4 className="text-xs font-bold text-emerald-400">Conflict-Free</h4>
              <p className="text-[10px] text-slate-400">Auto Time Slot Guard</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-700/60 backdrop-blur-md">
              <h4 className="text-xs font-bold text-cyan-400">3D Campus Map</h4>
              <p className="text-[10px] text-slate-400">Real-time Location Pins</p>
            </div>
          </div>
        </div>

        {/* Right Column: Portal Login Form */}
        <div className="lg:col-span-5">
          <div className="bg-white text-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-200 relative">
            <div className="mb-6 text-center">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Sign In to Smart Campus</h3>
              <p className="text-xs text-slate-500 mt-1">Select your role to access your personalized portal</p>
            </div>

            {/* Role Selection Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-2xl mb-6">
              <button
                type="button"
                onClick={() => handleTabChange('STUDENT')}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  loginType === 'STUDENT'
                    ? 'bg-purple-100 text-purple-950 border border-purple-300 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('STAFF')}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  loginType === 'STAFF'
                    ? 'bg-purple-100 text-purple-950 border border-purple-300 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Staff
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('ADMIN')}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  loginType === 'ADMIN'
                    ? 'bg-purple-100 text-purple-950 border border-purple-300 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Admin
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {loginType === 'STUDENT' ? 'Register Number' : loginType === 'STAFF' ? 'Employee ID' : 'Admin Email'}
                </label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white"
                    placeholder={loginType === 'STUDENT' ? '23CSE001' : loginType === 'STAFF' ? 'STF001' : 'admin@smartcampus.edu'}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-purple-100 hover:bg-purple-200 text-purple-950 border border-purple-300 font-black text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? 'Authenticating...' : `Sign In to ${loginType === 'STUDENT' ? 'Student' : loginType === 'STAFF' ? 'Staff' : 'Admin'} Portal`}
                <ArrowRight className="w-4 h-4 text-purple-700" />
              </button>
            </form>


          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-3 text-center text-xs text-slate-400 border-t border-slate-800 relative z-20">
        © 2026 Karpagam Institute of Technology — Smart Campus Lab & Equipment Management Portal. All rights reserved.
      </footer>
    </div>
  );
};
