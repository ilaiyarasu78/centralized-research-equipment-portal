import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/common/Sidebar';
import { TopNavbar } from '../components/common/TopNavbar';
import { Headphones, X } from 'lucide-react';

export const StudentLayout: React.FC = () => {
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 w-full overflow-x-hidden">
      {/* Left Sidebar */}
      <Sidebar unreadCount={8} openContactModal={() => setShowContactModal(true)} />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
        <TopNavbar unreadCount={8} />
        <main className="flex-1 overflow-y-auto bg-slate-50">
          <Outlet />
        </main>
      </div>

      {/* Urgent Contact Support Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Headphones className="w-5 h-5 text-purple-600" />
                Urgent Campus Support
              </h3>
              <button onClick={() => setShowContactModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200">
                <h4 className="font-bold text-slate-900">Direct Lab Helpline</h4>
                <p className="text-purple-700 font-mono text-sm font-bold mt-0.5">+91 98765 43210</p>
                <p className="text-[10px] text-slate-500 mt-1">Available 24/7 during semester lab hours</p>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
                <h4 className="font-bold text-slate-900">Email Desk Support</h4>
                <p className="text-blue-700 font-mono text-sm font-bold mt-0.5">support@smartcampus.edu</p>
              </div>
            </div>

            <button
              onClick={() => setShowContactModal(false)}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold rounded-xl shadow-md transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
