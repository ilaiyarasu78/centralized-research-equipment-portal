import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  AlertTriangle,
  FileText,
  Bell,
  User,
  FlaskConical,
  Wrench,
  Search,
  HelpCircle,
  Newspaper,
  Headphones,
  ChevronDown,
  ChevronRight,
  LogOut,
  Calendar,
  History,
  Boxes
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Official Karpagam College 'K' Swoosh Emblem Vector SVG (Large, Bold & Clearly Visible)
export const KarpagamSwooshLogo: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <svg className={className} viewBox="0 0 160 110" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Blue Lower Swoosh Ribbon */}
    <path
      d="M10 65C38 32 85 12 125 6C82 30 38 60 22 70C12 76 10 65 10 65Z"
      fill="#0284c7"
    />
    <path
      d="M16 67C42 36 92 16 130 6C98 22 45 50 16 67Z"
      fill="#0369a1"
    />
    {/* Terracotta Red Upper Main 'K' Ribbon */}
    <path
      d="M32 6C58 38 120 78 158 92C112 80 58 46 42 12C36 1 32 6 32 6Z"
      fill="#b84a2a"
    />
    <path
      d="M22 6C62 42 130 84 160 95C115 84 54 44 38 12C32 2 22 6 22 6Z"
      fill="#a93e1b"
    />
  </svg>
);

interface SidebarProps {
  unreadCount?: number;
  openContactModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ unreadCount = 8, openContactModal }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isToolsExpanded, setIsToolsExpanded] = useState(true);
  const [isLabsExpanded, setIsLabsExpanded] = useState(false);

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col justify-between p-4 select-none shrink-0 z-20 transition-colors shadow-sm">
      <div>
        {/* Official Karpagam Institute Logo Header (Large & Clearly Visible) */}
        <div
          className="flex items-center gap-3 p-2.5 mb-4 cursor-pointer bg-slate-50 border border-slate-200/80 rounded-2xl hover:bg-slate-100 transition-all shadow-sm group"
          onClick={() => navigate('/student/dashboard')}
        >
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 p-1 flex items-center justify-center shadow-sm shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
            <KarpagamSwooshLogo className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-xs font-bold text-slate-900 tracking-tight leading-tight uppercase">
              KARPAGAM KIT
            </h1>
            <p className="text-[10px] text-purple-700 font-semibold tracking-wide">
              Smart Campus System
            </p>
            <p className="text-[9px] text-slate-500 font-medium">Autonomous • NAAC A++</p>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="space-y-1">
          <NavLink
            to="/student/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20 font-bold'
                  : 'text-slate-700 hover:text-purple-700 hover:bg-purple-50'
              }`
            }
          >
            <LayoutDashboard className="w-4 h-4 text-purple-600" />
            Dashboard
          </NavLink>

          <NavLink
            to="/student/report-issue"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20 font-bold'
                  : 'text-slate-700 hover:text-amber-700 hover:bg-amber-50'
              }`
            }
          >
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Report Issue
          </NavLink>

          <NavLink
            to="/student/my-issues"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20 font-bold'
                  : 'text-slate-700 hover:text-blue-700 hover:bg-blue-50'
              }`
            }
          >
            <FileText className="w-4 h-4 text-blue-600" />
            My Issues
          </NavLink>

          <NavLink
            to="/student/notifications"
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20 font-bold'
                  : 'text-slate-700 hover:text-fuchsia-700 hover:bg-fuchsia-50'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-fuchsia-600" />
              Notifications
            </div>
            {unreadCount > 0 && (
              <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                {unreadCount}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/student/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20 font-bold'
                  : 'text-slate-700 hover:text-indigo-700 hover:bg-indigo-50'
              }`
            }
          >
            <User className="w-4 h-4 text-indigo-600" />
            My Profile
          </NavLink>
        </div>

        {/* Section Divider */}
        <div className="mt-5 mb-2 px-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            CAMPUS MODULES
          </p>
        </div>

        {/* Campus Modules */}
        <div className="space-y-1">
          {/* Labs Dropdown */}
          <div>
            <button
              onClick={() => setIsLabsExpanded(!isLabsExpanded)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <FlaskConical className="w-4 h-4 text-blue-600" />
                Labs
              </div>
              {isLabsExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
            {isLabsExpanded && (
              <div className="ml-7 mt-1 space-y-1 border-l-2 border-purple-200 pl-3">
                <NavLink to="/student/dashboard" className="block py-1 text-xs font-medium text-slate-700 hover:text-purple-700">
                  All Campus Labs
                </NavLink>
              </div>
            )}
          </div>

          {/* Tools / Equipment Access Dropdown */}
          <div className="rounded-xl overflow-hidden bg-purple-50/60 border border-purple-200">
            <button
              onClick={() => setIsToolsExpanded(!isToolsExpanded)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold text-purple-950 bg-purple-100/80 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Wrench className="w-4 h-4 text-purple-700" />
                Tools/Equipment Access
              </div>
              {isToolsExpanded ? <ChevronDown className="w-3.5 h-3.5 text-purple-700" /> : <ChevronRight className="w-3.5 h-3.5 text-purple-700" />}
            </button>

            {isToolsExpanded && (
              <div className="p-1 space-y-1 bg-white">
                <NavLink
                  to="/student/dashboard"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isActive ? 'bg-purple-600 text-white shadow-sm font-bold' : 'text-slate-700 hover:text-purple-700 hover:bg-purple-50'
                    }`
                  }
                >
                  <Boxes className="w-3.5 h-3.5" />
                  All Equipment
                </NavLink>
                <NavLink
                  to="/student/my-bookings"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isActive ? 'bg-purple-600 text-white shadow-sm font-bold' : 'text-slate-700 hover:text-purple-700 hover:bg-purple-50'
                    }`
                  }
                >
                  <FileText className="w-3.5 h-3.5" />
                  My Bookings
                </NavLink>
                <NavLink
                  to="/student/booking-calendar"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isActive ? 'bg-purple-600 text-white shadow-sm font-bold' : 'text-slate-700 hover:text-purple-700 hover:bg-purple-50'
                    }`
                  }
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Booking Calendar
                </NavLink>
                <NavLink
                  to="/student/request-history"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isActive ? 'bg-purple-600 text-white shadow-sm font-bold' : 'text-slate-700 hover:text-purple-700 hover:bg-purple-50'
                    }`
                  }
                >
                  <History className="w-3.5 h-3.5" />
                  Request History
                </NavLink>
              </div>
            )}
          </div>

          <NavLink
            to="/student/lost-found"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md font-bold'
                  : 'text-slate-700 hover:text-blue-700 hover:bg-blue-50'
              }`
            }
          >
            <Search className="w-4 h-4 text-blue-600" />
            Lost & Found
          </NavLink>

          <NavLink
            to="/student/help-support"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md font-bold'
                  : 'text-slate-700 hover:text-cyan-700 hover:bg-cyan-50'
              }`
            }
          >
            <HelpCircle className="w-4 h-4 text-cyan-600" />
            Help & Support
          </NavLink>

          <NavLink
            to="/student/news-updates"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md font-bold'
                  : 'text-slate-700 hover:text-amber-700 hover:bg-amber-50'
              }`
            }
          >
            <Newspaper className="w-4 h-4 text-amber-600" />
            News & Updates
          </NavLink>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        {/* Need Urgent Help Card */}
        <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 relative overflow-hidden shadow-sm">
          <div className="relative z-10 flex items-start gap-2.5">
            <Headphones className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">Need Urgent Help?</h4>
              <p className="text-[10px] text-slate-600 font-medium mb-1.5">Contact KIT IT Support</p>
              <button
                onClick={openContactModal}
                className="w-full py-1 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold transition-all shadow-sm cursor-pointer"
              >
                Contact Now
              </button>
            </div>
          </div>
        </div>

        {/* Role Summary / Sign Out */}
        {user && (
          <div className="flex items-center justify-between px-2 pt-1 text-xs">
            <span className="text-slate-600 text-[11px] font-medium">Role: <strong className="text-purple-800 font-bold">{user.role}</strong></span>
            <button
              onClick={logout}
              className="text-red-600 hover:text-red-700 flex items-center gap-1 text-[11px] font-bold cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
