import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Boxes,
  Wrench,
  Calendar,
  Filter,
  Search,
  Eye,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Shield,
  ArrowRight,
  BookOpen,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { api } from '../../services/api';
import { Lab, Equipment, Booking } from '../../types';
import { BookingModal } from '../../components/student/BookingModal';
import { useAuth } from '../../context/AuthContext';

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [labs, setLabs] = useState<Lab[]>([]);
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [selectedTab, setSelectedTab] = useState('ALL LABS');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Status');

  // Booking Modal State
  const [selectedEquipForBooking, setSelectedEquipForBooking] = useState<Equipment | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    fetchLabs();
    fetchEquipment();
    fetchBookings();
  }, []);

  // Sync searchQuery when URL query param changes
  useEffect(() => {
    const q = searchParams.get('search');
    if (q !== null) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  const fetchLabs = async () => {
    try {
      const res = await api.get('/labs');
      if (res.data.success) {
        setLabs(res.data.data);
      }
    } catch (e) {
      console.error('Failed to fetch labs', e);
    }
  };

  const fetchEquipment = async () => {
    try {
      const res = await api.get('/equipment');
      if (res.data.success) {
        setEquipmentList(res.data.data);
      }
    } catch (e) {
      console.error('Failed to fetch equipment', e);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/my');
      if (res.data.success) {
        setMyBookings(res.data.data);
      }
    } catch (e) {
      console.error('Failed to fetch user bookings', e);
    }
  };

  // Multi-Filter Logic for All Categories, All Status, Search Query, and Selected Tab
  const filteredLabs = labs.filter((lab) => {
    // 1. Tab Filter
    if (selectedTab !== 'ALL LABS') {
      const tabUpper = selectedTab.toUpperCase();
      const labUpper = lab.name.toUpperCase();
      const cleanTab = tabUpper.replace(' LAB', '');
      if (labUpper !== tabUpper && !labUpper.includes(cleanTab)) {
        return false;
      }
    }

    // 2. Category Filter
    if (selectedCategory !== 'All Categories') {
      const catLower = selectedCategory.toLowerCase();
      const labCatLower = lab.category.toLowerCase();
      const matchesLabCategory = labCatLower.includes(catLower);
      const matchesEquipmentCategory = lab.equipments?.some(
        (eq) => eq.category.toLowerCase().includes(catLower)
      );
      if (!matchesLabCategory && !matchesEquipmentCategory) {
        return false;
      }
    }

    // 3. Status Filter
    if (selectedStatus !== 'All Status') {
      const labStatus = (lab.status || 'OPERATIONAL').toUpperCase();
      if (selectedStatus === 'OPERATIONAL' && labStatus !== 'OPERATIONAL' && labStatus !== 'AVAILABLE') {
        return false;
      }
      if (selectedStatus === 'MAINTENANCE' && labStatus !== 'MAINTENANCE') {
        return false;
      }
    }

    // 4. Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const nameMatch = lab.name.toLowerCase().includes(q);
      const catMatch = lab.category.toLowerCase().includes(q);
      const descMatch = lab.description.toLowerCase().includes(q);
      const equipMatch = lab.equipments?.some((eq) => eq.name.toLowerCase().includes(q));
      return nameMatch || catMatch || descMatch || equipMatch;
    }

    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto text-slate-900 bg-slate-50 min-h-screen">
      {/* 1. Header & Quick Stats Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 uppercase">
            TOOLS / EQUIPMENT ACCESS
          </h1>
          <p className="text-xs text-slate-600 mt-0.5 font-bold">
            Access labs, tools and equipment across Karpagam Institute of Technology campus
          </p>
        </div>

        {/* Top Badges */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2.5 px-3.5 py-2 bg-blue-50 border border-blue-200 rounded-2xl shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
              <Boxes className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-900 leading-tight">{labs.length > 0 ? labs.length : 8}</p>
              <p className="text-[10px] font-bold text-blue-700">Total Labs Across Campus</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 px-3.5 py-2 bg-purple-50 border border-purple-200 rounded-2xl shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-900 leading-tight">{equipmentList.length > 0 ? `${equipmentList.length}+` : '240+'}</p>
              <p className="text-[10px] font-bold text-purple-700">Total Equipment Available</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 px-3.5 py-2 bg-emerald-50 border border-emerald-200 rounded-2xl shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-900 leading-tight">{myBookings.length > 0 ? myBookings.length : 48}</p>
              <p className="text-[10px] font-bold text-emerald-700">My Bookings This Month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* LEFT COLUMN: Main Lab & Equipment Catalog */}
        <div className="xl:col-span-3 space-y-6">
          {/* Filter Tabs Row */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
            {[
              'ALL LABS',
              'IDEA LAB',
              'CADENCE LAB',
              'SYNOPSYS LAB',
              'MATLAB LAB',
              'LABVIEW LAB',
              'TEXAS INNOVATION LAB',
              'LIBRARY',
              'ROBOTICS LAB'
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase whitespace-nowrap transition-all cursor-pointer ${
                  selectedTab === tab
                    ? 'bg-purple-100 text-purple-950 border border-purple-300 shadow-sm font-black'
                    : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 shadow-sm'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search and Filters Row with Fully Visible Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-5 relative">
              <Search className="w-4 h-4 text-purple-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search equipment or lab..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-black text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 shadow-sm"
              />
            </div>

            {/* Category Dropdown Filter */}
            <div className="sm:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-black text-slate-900 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 shadow-sm cursor-pointer"
              >
                <option value="All Categories" className="font-bold text-slate-900 bg-white py-1">All Categories</option>
                <option value="Innovation Hub" className="font-bold text-slate-900 bg-white py-1">Innovation Hub</option>
                <option value="VLSI Design" className="font-bold text-slate-900 bg-white py-1">VLSI Design</option>
                <option value="EDA Suite" className="font-bold text-slate-900 bg-white py-1">EDA Suite</option>
                <option value="Computing" className="font-bold text-slate-900 bg-white py-1">Computing</option>
                <option value="Virtual Instrumentation" className="font-bold text-slate-900 bg-white py-1">Virtual Instrumentation</option>
                <option value="Embedded Systems" className="font-bold text-slate-900 bg-white py-1">Embedded Systems</option>
                <option value="Knowledge Center" className="font-bold text-slate-900 bg-white py-1">Knowledge Center</option>
                <option value="Robotics & AI" className="font-bold text-slate-900 bg-white py-1">Robotics & AI</option>
              </select>
            </div>

            {/* Status Dropdown Filter */}
            <div className="sm:col-span-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-black text-slate-900 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 shadow-sm cursor-pointer"
              >
                <option value="All Status" className="font-bold text-slate-900 bg-white py-1">All Status</option>
                <option value="OPERATIONAL" className="font-bold text-slate-900 bg-white py-1">Available</option>
                <option value="MAINTENANCE" className="font-bold text-slate-900 bg-white py-1">Maintenance</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <button
                onClick={() => {
                  setSelectedCategory('All Categories');
                  setSelectedStatus('All Status');
                  setSearchQuery('');
                  setSelectedTab('ALL LABS');
                }}
                className="w-full py-2.5 bg-purple-100 hover:bg-purple-200 text-purple-950 border border-purple-300 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Filter className="w-3.5 h-3.5 text-purple-700" />
                Reset
              </button>
            </div>
          </div>

          {/* Campus Labs Cards Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-black text-slate-900 tracking-wide uppercase">Campus Labs</h3>
              <span className="text-xs text-purple-700 font-extrabold">{filteredLabs.length} Labs Available</span>
            </div>

            {filteredLabs.length === 0 ? (
              <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center shadow-sm">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-900">No Labs Match Your Selected Filters</h4>
                <p className="text-xs text-slate-500 mt-1">Try resetting the Category or Status dropdown filters.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('All Categories');
                    setSelectedStatus('All Status');
                    setSearchQuery('');
                    setSelectedTab('ALL LABS');
                  }}
                  className="mt-3 px-4 py-2 bg-[#800020] text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredLabs.map((lab) => {
                  let tagBg = 'bg-purple-100 text-purple-900 border-purple-300 font-extrabold';
                  let btnBg = 'bg-purple-100 hover:bg-purple-200 text-purple-950 border border-purple-300 shadow-xs';
                  if (lab.name.includes('CADENCE')) {
                    tagBg = 'bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold';
                  } else if (lab.name.includes('SYNOPSYS')) {
                    tagBg = 'bg-indigo-100 text-indigo-900 border-indigo-300 font-extrabold';
                  } else if (lab.name.includes('MATLAB')) {
                    tagBg = 'bg-orange-100 text-orange-900 border-orange-300 font-extrabold';
                  } else if (lab.name.includes('LABVIEW')) {
                    tagBg = 'bg-cyan-100 text-cyan-900 border-cyan-300 font-extrabold';
                  } else if (lab.name.includes('TEXAS')) {
                    tagBg = 'bg-pink-100 text-pink-900 border-pink-300 font-extrabold';
                  } else if (lab.name.includes('LIBRARY')) {
                    tagBg = 'bg-amber-100 text-amber-900 border-amber-300 font-extrabold';
                  } else if (lab.name.includes('ROBOTICS')) {
                    tagBg = 'bg-rose-100 text-rose-900 border-rose-300 font-extrabold';
                  }

                  const upperName = (lab.name || '').toUpperCase();
                  const labPhoto = (lab.image && typeof lab.image === 'string' && lab.image.startsWith('http') && !lab.image.includes('placeholder'))
                    ? lab.image
                    : upperName.includes('LABVIEW')
                    ? 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=400'
                    : upperName.includes('CADENCE')
                    ? 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400'
                    : upperName.includes('IDEA')
                    ? 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400'
                    : upperName.includes('SYNOPSYS')
                    ? 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=400'
                    : upperName.includes('MATLAB')
                    ? 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400'
                    : upperName.includes('TEXAS')
                    ? 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=400'
                    : upperName.includes('LIBRARY')
                    ? 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=400'
                    : upperName.includes('ROBOTICS')
                    ? 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=400'
                    : 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400';

                  const totalEq = lab.totalEquipments ?? lab.equipments?.length ?? 30;
                  const availEq = lab.availableEquipments ?? lab.equipments?.filter((e) => e.status === 'AVAILABLE').length ?? 12;

                  return (
                    <div
                      key={lab.id}
                      className="p-5 rounded-2xl flex flex-col justify-between hover:border-purple-400 transition-all group bg-white border border-slate-200 shadow-sm"
                    >
                      <div>
                        {/* Lab Header & Tag */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h4 className="text-base font-black text-purple-950 group-hover:text-purple-700 transition-colors uppercase">
                              {lab.name}
                            </h4>
                            <span className={`inline-block px-2.5 py-0.5 mt-1 rounded text-[10px] border ${tagBg}`}>
                              {lab.category}
                            </span>
                          </div>
                          <img
                            src={labPhoto}
                            alt={lab.name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400';
                            }}
                            className="w-16 h-16 rounded-xl object-cover border border-slate-200 group-hover:scale-105 transition-transform shrink-0 shadow-xs"
                          />
                        </div>

                        <p className="text-xs text-slate-700 line-clamp-2 mb-4 leading-relaxed font-semibold">
                          {lab.description}
                        </p>
                      </div>

                      {/* Stats & Action Footer */}
                      <div>
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 mb-3 text-xs">
                          <div className="flex items-center gap-1.5 text-slate-800 font-extrabold">
                            <Wrench className="w-3.5 h-3.5 text-purple-600" />
                            <span><strong>{totalEq}</strong> Equipment</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-800 font-extrabold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span><strong>{availEq}</strong> Available</span>
                          </div>
                        </div>

                        <button
                          onClick={() => navigate(`/student/labs/${lab.id}`)}
                          className={`w-full py-2.5 ${btnBg} text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer`}
                        >
                          <Eye className="w-3.5 h-3.5 text-purple-700" />
                          View Lab
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Actions Bar */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3">Quick Actions</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              <button
                onClick={() => {
                  if (equipmentList.length > 0) {
                    setSelectedEquipForBooking(equipmentList[0]);
                    setIsBookingModalOpen(true);
                  }
                }}
                className="p-3 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-center transition-all cursor-pointer group"
              >
                <Wrench className="w-5 h-5 text-purple-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-extrabold text-slate-900">Book Equipment</p>
                <p className="text-[10px] text-slate-600 font-bold">Reserve a tool</p>
              </button>

              <button
                onClick={() => navigate('/student/dashboard')}
                className="p-3 rounded-xl bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 text-center transition-all cursor-pointer group"
              >
                <Clock className="w-5 h-5 text-cyan-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-extrabold text-slate-900">Check Availability</p>
                <p className="text-[10px] text-slate-600 font-bold">View status</p>
              </button>

              <button
                onClick={() => navigate('/student/my-bookings')}
                className="p-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-center transition-all cursor-pointer group"
              >
                <Calendar className="w-5 h-5 text-indigo-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-extrabold text-slate-900">My Bookings</p>
                <p className="text-[10px] text-slate-600 font-bold">View bookings</p>
              </button>

              <button
                onClick={() => navigate('/student/help-support')}
                className="p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-center transition-all cursor-pointer group"
              >
                <BookOpen className="w-5 h-5 text-emerald-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-extrabold text-slate-900">Equipment Guide</p>
                <p className="text-[10px] text-slate-600 font-bold">Instructions</p>
              </button>

              <button
                onClick={() => navigate('/student/help-support')}
                className="p-3 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-center transition-all cursor-pointer group"
              >
                <FileCheck className="w-5 h-5 text-orange-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-extrabold text-slate-900">Lab Rules</p>
                <p className="text-[10px] text-slate-600 font-bold">Safety guidelines</p>
              </button>

              <button
                onClick={() => navigate('/student/request-history')}
                className="p-3 rounded-xl bg-pink-50 hover:bg-pink-100 border border-pink-200 text-center transition-all cursor-pointer group"
              >
                <Plus className="w-5 h-5 text-pink-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-extrabold text-slate-900">Request Access</p>
                <p className="text-[10px] text-slate-600 font-bold">Request new access</p>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Widgets */}
        <div className="space-y-6">
          {/* My Upcoming Bookings Widget */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                My Upcoming Bookings
              </h3>
              <button
                onClick={() => navigate('/student/my-bookings')}
                className="text-[11px] font-extrabold text-purple-700 hover:text-purple-900 flex items-center gap-0.5 cursor-pointer"
              >
                View All <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {[
                { name: '3D Printer - Ender 3', lab: 'IDEA LAB', date: '28 Aug 2026, 10:00 AM', status: 'Confirmed', statusBg: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold' },
                { name: 'Oscilloscope - DSOX1204G', lab: 'LABVIEW LAB', date: '29 Aug 2026, 02:00 PM', status: 'Pending', statusBg: 'bg-orange-100 text-orange-900 border-orange-300 font-extrabold' },
                { name: 'PCB Mill Machine', lab: 'IDEA LAB', date: '30 Aug 2026, 11:00 AM', status: 'Confirmed', statusBg: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold' }
              ].map((booking, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                      <Wrench className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-black text-slate-900 leading-tight">{booking.name}</h5>
                      <p className="text-[10px] text-slate-600 font-bold">{booking.lab} • {booking.date}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] border ${booking.statusBg}`}>
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        equipment={selectedEquipForBooking}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSuccess={fetchBookings}
      />
    </div>
  );
};
