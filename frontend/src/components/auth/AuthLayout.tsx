import React from 'react';
import { Outlet } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';
import { KarpagamSwooshLogo } from '../common/Sidebar';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f4f7fc] text-slate-900 flex flex-col justify-between relative overflow-x-hidden select-none font-sans">
      {/* Top Header matching exact model screenshot */}
      <header className="bg-white/80 backdrop-blur-md text-slate-900 border-b border-slate-200/80 py-3.5 px-6 sm:px-10 relative z-30 shadow-xs">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          {/* Left: Official Karpagam Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 p-0.5 flex items-center justify-center shadow-xs shrink-0">
              <KarpagamSwooshLogo className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-slate-900 uppercase leading-none">
                KARPAGAM
              </h1>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
                INSTITUTE OF TECHNOLOGY
              </p>
            </div>
          </div>

          {/* Right: Status Pill & Need Help */}
          <div className="flex items-center gap-4">
            <div className="bg-slate-100 border border-slate-200/80 text-slate-700 px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Lab systems online</span>
            </div>

            <a
              href="#help"
              onClick={(e) => {
                e.preventDefault();
                alert('For IT & Lab access support, contact IT Helpdesk at gopinath.ece@karpagamtech.ac.in or +91 95669 94805');
              }}
              className="text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-slate-500" />
              <span>Need help?</span>
            </a>
          </div>
        </div>
      </header>

      {/* Center Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-20">
        <Outlet />
      </main>

      {/* Footer matching exact model screenshot */}
      <footer className="py-3 px-6 sm:px-10 bg-white/60 text-slate-500 text-xs font-medium border-t border-slate-200/60 relative z-30">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>Karpagam Institute of Technology • Coimbatore</span>
          </div>
          <div>
            © 2026 Karpagam Institute of Technology • Lab Access
          </div>
        </div>
      </footer>
    </div>
  );
};
