import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FlaskConical } from 'lucide-react';

export const PublicAutoLogin: React.FC = () => {
  const { loginStudent, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const doAutoLogin = async () => {
      try {
        // Auto-login with student demo credentials
        await loginStudent('24ita17', 'Student@123');
        navigate('/student/dashboard', { replace: true });
      } catch (err) {
        console.error('Auto login failed, redirecting to login page', err);
        navigate('/login', { replace: true });
      }
    };

    if (!isLoading) {
      if (isAuthenticated) {
        navigate('/student/dashboard', { replace: true });
      } else {
        doAutoLogin();
      }
    }
  }, [isAuthenticated, isLoading, loginStudent, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white select-none">
      <div className="flex flex-col items-center gap-6 p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl shadow-2xl animate-pulse">
        {/* Glowing Logo */}
        <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
          <FlaskConical className="w-8 h-8 animate-bounce" />
        </div>
        
        <div className="text-center space-y-1.5">
          <h3 className="text-lg font-black tracking-tight text-white">Smart Campus Portal</h3>
          <p className="text-xs text-slate-400 font-medium">Bypassing login and preparing public access dashboard...</p>
        </div>

        {/* Linear Loading Bar */}
        <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full w-2/3 animate-infinite-scroll"></div>
        </div>
      </div>
    </div>
  );
};

export default PublicAutoLogin;
