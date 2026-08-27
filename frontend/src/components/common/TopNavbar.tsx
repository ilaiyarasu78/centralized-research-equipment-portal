import React, { useState, useEffect } from 'react';
import { Search, Bell, MessageSquare, ChevronDown, User as UserIcon, LogOut, Settings, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { KarpagamSwooshLogo } from './Sidebar';

interface TopNavbarProps {
  unreadCount?: number;
  onSearch?: (term: string) => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ unreadCount = 0, onSearch }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const initialSearch = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    const q = searchParams.get('search');
    if (q !== null) {
      setSearchTerm(q);
    }
  }, [searchParams]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (onSearch) {
      onSearch(val);
    }
    navigate(`/student/dashboard?search=${encodeURIComponent(val)}`, { replace: true });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
    navigate(`/student/dashboard?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 transition-colors shadow-sm">
      {/* Top Official Karpagam Institute Accreditation Banner (White Theme & Crisp Logo) */}
      <div className="bg-white border-b border-slate-200 text-slate-900 px-6 py-2 flex items-center justify-between text-xs font-bold">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 p-0.5 flex items-center justify-center shrink-0 shadow-xs">
            <KarpagamSwooshLogo className="w-7 h-7" />
          </div>
          <span className="font-bold text-slate-900 tracking-tight uppercase text-xs sm:text-sm">
            KARPAGAM INSTITUTE OF TECHNOLOGY
          </span>
          <span className="hidden md:inline text-purple-700 font-semibold">• Coimbatore – 641 105</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-lg text-[10px] font-bold border border-amber-300 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-600" /> NAAC A++ ACCREDITED
          </span>
          <span className="hidden lg:inline bg-purple-100 text-purple-900 px-2 py-0.5 rounded text-[10px] font-bold border border-purple-300">
            AUTONOMOUS
          </span>
        </div>
      </div>

      {/* Main Navbar Controls Row */}
      <div className="h-16 px-6 flex items-center justify-between bg-white">
        {/* Working Real-Time Search Form */}
        <form onSubmit={handleSearchSubmit} className="relative w-72 sm:w-96">
          <Search className="w-4 h-4 text-purple-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search equipment, labs, issues..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-full text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white focus:ring-1 focus:ring-purple-600 transition-all font-bold"
          />
        </form>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Notification Icon */}
          <button
            onClick={() => navigate('/student/notifications')}
            className="relative p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-purple-700 hover:bg-purple-50 transition-all cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-bold flex items-center justify-center rounded-full shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1 rounded-full bg-slate-100 border border-slate-200 hover:bg-slate-200 transition-all cursor-pointer shadow-sm"
            >
              {user?.avatar && typeof user.avatar === 'string' && !user.avatar.includes('images.unsplash.com') ? (
                <img
                  src={user.avatar}
                  alt={user?.name || 'User'}
                  className="w-8 h-8 rounded-full object-cover border-2 border-purple-600"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-purple-100 border-2 border-purple-600 flex items-center justify-center text-purple-700 font-bold shrink-0">
                  <UserIcon className="w-4 h-4 text-purple-600" />
                </div>
              )}
              <div className="text-left hidden sm:block">
                <h4 className="text-xs font-bold text-slate-900 leading-tight">{user?.name || 'Karthik R'}</h4>
                <p className="text-[10px] text-purple-700 font-semibold leading-none">
                  {user?.role === 'STUDENT' ? 'Student' : user?.role === 'STAFF' ? 'Staff Member' : 'System Admin'}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 ml-1" />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    navigate('/student/profile');
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2 cursor-pointer"
                >
                  <UserIcon className="w-3.5 h-3.5 text-purple-600" />
                  View Profile
                </button>
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    if (user?.role === 'ADMIN') navigate('/admin/dashboard');
                    else if (user?.role === 'STAFF') navigate('/staff/dashboard');
                    else navigate('/student/dashboard');
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2 cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-blue-600" />
                  Switch Portal
                </button>
                <div className="border-t border-slate-100 mt-1 pt-1">
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
