import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Wrench, Plus, CheckCircle2, FlaskConical, Eye, ChevronRight as ArrowIcon } from 'lucide-react';
import { api } from '../../services/api';
import { Booking, Equipment, Lab } from '../../types';
import { BookingModal } from '../../components/student/BookingModal';

export const BookingCalendar: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [labsList, setLabsList] = useState<Lab[]>([]);
  const [selectedLabFilter, setSelectedLabFilter] = useState<string>('ALL');

  // Booking Modal State
  const [selectedEquip, setSelectedEquip] = useState<Equipment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetDate, setTargetDate] = useState<string>('');

  useEffect(() => {
    fetchBookings();
    fetchEquipment();
    fetchLabs();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/my');
      if (res.data.success) {
        setBookings(res.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchEquipment = async () => {
    try {
      const res = await api.get('/equipment');
      if (res.data.success) {
        setEquipmentList(res.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchLabs = async () => {
    try {
      const res = await api.get('/labs');
      if (res.data.success) {
        setLabsList(res.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  // Filter bookings based on selected lab filter
  const filteredBookings = bookings.filter((b) => {
    if (selectedLabFilter === 'ALL') return true;
    const labName = b.lab?.name?.toUpperCase() || b.equipment?.lab?.name?.toUpperCase() || '';
    return labName.includes(selectedLabFilter.toUpperCase());
  });

  const handleOpenBookingForDate = (dateStr: string) => {
    setTargetDate(dateStr);
    if (equipmentList.length > 0) {
      setSelectedEquip(equipmentList[0]);
      setIsModalOpen(true);
    } else {
      alert('No equipment available for booking at the moment.');
    }
  };

  const handleSelectLabForBooking = (lab: Lab) => {
    const labEquip = equipmentList.find((eq) => eq.labId === lab.id || eq.lab?.id === lab.id);
    setSelectedEquip(labEquip || (equipmentList[0] || null));
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto text-slate-900 bg-slate-50 min-h-screen">
      {/* Top Header & New Booking Button */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
            <CalendarIcon className="w-5 h-5 text-purple-600" />
            Equipment Booking Calendar
          </h1>
          <p className="text-xs text-slate-600 font-semibold">Interactive schedule of your active reservations and lab equipment availability</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Month Selector */}
          <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 shadow-sm">
            <button className="text-slate-500 hover:text-purple-600 cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
            <span>August 2026</span>
            <button className="text-slate-500 hover:text-purple-600 cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
          </div>

          {/* New Booking CTA */}
          <button
            onClick={() => {
              if (equipmentList.length > 0) {
                setSelectedEquip(equipmentList[0]);
                setIsModalOpen(true);
              }
            }}
            className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            + New Equipment Booking
          </button>
        </div>
      </div>

      {/* Lab Selection Filter Pills Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 shrink-0 flex items-center gap-1">
          <FlaskConical className="w-3.5 h-3.5 text-purple-600" /> Filter Lab:
        </span>
        {[
          { label: 'All Campus Labs', value: 'ALL' },
          { label: 'AICTE IDEA LAB', value: 'IDEA' },
          { label: 'CADENCE VLSI LAB', value: 'CADENCE' },
          { label: 'NI LABVIEW LAB', value: 'LABVIEW' },
          { label: 'SYNOPSYS LAB', value: 'SYNOPSYS' },
          { label: 'MATLAB LAB', value: 'MATLAB' },
          { label: 'TEXAS INNOVATION LAB', value: 'TEXAS' },
          { label: 'LIBRARY', value: 'LIBRARY' }
        ].map((item) => (
          <button
            key={item.value}
            onClick={() => setSelectedLabFilter(item.value)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedLabFilter === item.value
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* 2-Column Grid: Calendar + Quick Lab Booking Sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* LEFT 3-COLUMNS: High Contrast Calendar Grid */}
        <div className="xl:col-span-3 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-purple-800 uppercase tracking-wider border-b border-slate-100 pb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="py-1">{day}</div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2.5">
            {daysInMonth.map((day) => {
              const formattedDay = day < 10 ? `0${day}` : `${day}`;
              const dateStr = `2026-08-${formattedDay}`;
              const dayBookings = filteredBookings.filter((b) => b.date === dateStr);

              return (
                <div
                  key={day}
                  onClick={() => handleOpenBookingForDate(dateStr)}
                  className="min-h-[105px] p-2.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-purple-700">{day}</span>
                    <span className="opacity-0 group-hover:opacity-100 text-[10px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded transition-opacity">
                      + Book
                    </span>
                  </div>

                  <div className="space-y-1 mt-1">
                    {dayBookings.map((b) => {
                      let badgeBg = 'bg-orange-100 text-orange-900 border-orange-300 font-bold';
                      if (b.status === 'APPROVED') badgeBg = 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold';
                      if (b.status === 'CANCELLED') badgeBg = 'bg-slate-200 text-slate-600 border-slate-300 font-medium';

                      return (
                        <div
                          key={b.id}
                          className={`p-1 rounded-lg text-[10px] border truncate ${badgeBg}`}
                          title={`${b.equipment?.name} (${b.startTime} - ${b.endTime})`}
                        >
                          {b.startTime} • {b.equipment?.name}
                        </div>
                      );
                    })}
                  </div>

                  {dayBookings.length === 0 && (
                    <span className="text-[10px] text-slate-400 font-medium italic text-right block group-hover:text-purple-600">
                      Available
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: List of Labs for Instant Booking */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
              <FlaskConical className="w-4 h-4 text-purple-600" />
              Campus Labs Booking List
            </h3>
            <p className="text-xs text-slate-600 font-semibold">Select any lab to quickly reserve equipment in that lab</p>

            <div className="space-y-2.5">
              {labsList.map((lab) => (
                <div
                  key={lab.id}
                  onClick={() => handleSelectLabForBooking(lab)}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-purple-400 hover:bg-purple-50 transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-700 uppercase">
                      {lab.name}
                    </h4>
                    <p className="text-[10px] text-purple-700 font-semibold">{lab.category}</p>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">{lab.totalEquipments || 20}+ Equipment Available</p>
                  </div>
                  <button className="px-2.5 py-1.5 rounded-xl bg-purple-600 text-white text-[11px] font-bold group-hover:bg-purple-500 shadow-xs flex items-center gap-1">
                    Book <ArrowIcon className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        equipment={selectedEquip}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchBookings}
      />
    </div>
  );
};
