import React from 'react';
import { History, Plus, Wrench } from 'lucide-react';

export const RequestHistory: React.FC = () => {
  return (
    <div className="p-6 space-y-6 max-w-[1200px] mx-auto text-slate-900 bg-slate-50 min-h-screen">
      <div>
        <h1 className="text-xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
          <History className="w-5 h-5 text-purple-600" />
          Special Equipment & Access Request History
        </h1>
        <p className="text-xs text-slate-600 font-bold">Track custom hardware requests submitted to lab administration</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3">
        <Wrench className="w-10 h-10 text-purple-600 mx-auto" />
        <h3 className="text-base font-black text-slate-900">No Special Requests Logged</h3>
        <p className="text-xs text-slate-600 font-semibold">All standard equipment can be booked directly from the Tools/Equipment Access catalog.</p>
      </div>
    </div>
  );
};
