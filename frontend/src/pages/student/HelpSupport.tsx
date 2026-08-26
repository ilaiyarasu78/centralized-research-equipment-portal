import React from 'react';
import { HelpCircle, PhoneCall, ShieldAlert, FileText, Mail, Clock } from 'lucide-react';

export const HelpSupport: React.FC = () => {
  return (
    <div className="p-6 space-y-6 max-w-[1200px] mx-auto text-slate-900 bg-slate-50 min-h-screen">
      <div>
        <h1 className="text-xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
          <HelpCircle className="w-5 h-5 text-purple-600" />
          Campus Help & Support Center
        </h1>
        <p className="text-xs text-slate-600 font-bold">Frequently asked questions, lab safety rules and 24/7 emergency contacts</p>
      </div>

      {/* Emergency Contacts Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-2 uppercase">
          <ShieldAlert className="w-4 h-4 text-red-600" />
          Urgent Lab Support & Emergency Contacts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <h5 className="font-black text-slate-900">Central Lab Desk</h5>
            <p className="text-slate-600 font-bold">Phone: +91 98765 43210</p>
            <p className="text-purple-700 font-extrabold">support@smartcampus.edu</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <h5 className="font-black text-slate-900">Electrical Safety Officer</h5>
            <p className="text-slate-600 font-bold">Phone: +91 98765 11111</p>
            <p className="text-purple-700 font-extrabold">safety@smartcampus.edu</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <h5 className="font-black text-slate-900">IT Infrastructure Desk</h5>
            <p className="text-slate-600 font-bold">Phone: +91 98765 22222</p>
            <p className="text-purple-700 font-extrabold">ithelp@smartcampus.edu</p>
          </div>
        </div>
      </div>

      {/* FAQ Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Frequently Asked Questions</h3>
        {[
          { q: 'How do I book high-end 3D Printers or Oscilloscopes?', a: 'Navigate to Tools/Equipment Access, select your lab equipment item, pick an available date and time slot, and submit. Staff will approve your booking within 15 minutes.' },
          { q: 'What happens if my booking overlaps with another student?', a: 'Our automated backend system prevents booking overlaps automatically. You will receive an instant conflict notification and can choose the next open slot.' },
          { q: 'How do I report damaged or malfunctioning equipment?', a: 'Click "Report Issue" in the sidebar, fill in ticket details with priority level, and submit. Assigned staff will update ticket resolution status in real-time.' },
          { q: 'Are labs accessible during weekends?', a: 'Library and select innovation labs (MATLAB & TEXAS INNOVATION LAB) offer 24/7 access during project deadlines.' }
        ].map((faq, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl space-y-1 border border-slate-200 shadow-sm">
            <h4 className="text-xs font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-600 shrink-0" />
              {faq.q}
            </h4>
            <p className="text-xs text-slate-700 font-semibold pl-6 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
