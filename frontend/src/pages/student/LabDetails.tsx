import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FlaskConical,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Search,
  ArrowLeft,
  Calendar,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { api } from '../../services/api';
import { Lab, Equipment } from '../../types';
import { BookingModal } from '../../components/student/BookingModal';

export const LabDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [lab, setLab] = useState<Lab | null>(null);
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  // Booking Modal
  const [selectedEquip, setSelectedEquip] = useState<Equipment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (id) fetchLabDetails();
  }, [id]);

  const fetchLabDetails = async () => {
    try {
      const res = await api.get(`/labs/${id}`);
      if (res.data.success) {
        setLab(res.data.data);
        setEquipmentList(res.data.data.equipments || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center font-bold text-purple-700">Loading lab details...</div>;
  }

  if (!lab) {
    return (
      <div className="p-8 text-center bg-white border border-slate-200 rounded-3xl m-6">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
        <h3 className="text-base font-bold text-slate-900">Lab Not Found</h3>
        <button
          onClick={() => navigate('/student/dashboard')}
          className="mt-3 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const filteredEquipment = equipmentList.filter((eq) => {
    if (selectedCategory !== 'All' && eq.category !== selectedCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      return eq.name.toLowerCase().includes(q) || eq.equipmentId.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto text-slate-900 bg-slate-50 min-h-screen">
      {/* Back Button */}
      <button
        onClick={() => navigate('/student/dashboard')}
        className="flex items-center gap-2 text-xs font-black text-purple-700 hover:text-purple-900 transition-colors cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm w-fit"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      {/* Lab Banner Card (High Contrast White Theme - Fixes Image 3) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg text-xs font-extrabold bg-purple-100 text-purple-900 border border-purple-300">
                {lab.category}
              </span>
              <span className="px-3 py-1 rounded-lg text-xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300">
                {lab.status}
              </span>
            </div>

            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{lab.name}</h1>
            <p className="text-xs text-slate-700 font-bold leading-relaxed">{lab.description}</p>

            {/* Quick Specs Metadata Row - Crisp Dark Text */}
            <div className="flex items-center gap-4 pt-3 flex-wrap text-xs text-slate-800 font-extrabold">
              <div className="flex items-center gap-1.5 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
                <MapPin className="w-4 h-4 text-purple-700" />
                <span>{lab.location}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
                <Clock className="w-4 h-4 text-blue-700" />
                <span>{lab.openingHours}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                <Users className="w-4 h-4 text-emerald-700" />
                <span>Capacity: <strong className="text-slate-900 font-black">{lab.capacity}</strong> Seats</span>
              </div>
              <div className="flex items-center gap-1.5 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200">
                <UserCheck className="w-4 h-4 text-indigo-700" />
                <span>In-Charge: <strong className="text-slate-900 font-black">Prof. Rajesh Kumar</strong></span>
              </div>
            </div>
          </div>

          {/* Image */}
          <img
            src={lab.image && !lab.image.includes('placeholder') ? lab.image : 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400'}
            alt={lab.name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400';
            }}
            className="w-full lg:w-72 h-44 rounded-2xl object-cover border border-slate-200 shadow-md shrink-0"
          />
        </div>
      </div>

      {/* Equipment Catalog in Lab */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
            <Wrench className="w-4 h-4 text-purple-600" />
            Equipment Available in {lab.name} ({filteredEquipment.length})
          </h2>

          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search equipment..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Equipment Grid */}
        {filteredEquipment.length === 0 ? (
          <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center shadow-sm">
            <Wrench className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-900">No Equipment Currently Listed for this Filter</p>
            <p className="text-xs text-slate-500 mt-1">Try clearing your search query or check back during lab operating hours.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEquipment.map((eq) => (
              <div key={eq.id} className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col justify-between hover:border-purple-400 shadow-sm transition-all">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="text-[10px] font-extrabold text-purple-900 bg-purple-100 px-2.5 py-0.5 rounded border border-purple-300">
                        {eq.category}
                      </span>
                      <h4 className="text-sm font-black text-slate-900 mt-1">{eq.name}</h4>
                      <p className="text-[11px] text-slate-500 font-bold">ID: {eq.equipmentId}</p>
                    </div>
                    {eq.image && (
                      <img src={eq.image} alt={eq.name} className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-xs" />
                    )}
                  </div>

                  <p className="text-xs text-slate-700 font-semibold line-clamp-2 my-2">{eq.description}</p>
                  <p className="text-[11px] text-slate-800 font-bold bg-slate-100 p-2.5 rounded-xl border border-slate-200 my-2">
                    <strong className="text-purple-700">Specs:</strong> {eq.specifications || 'Standard High-Precision Equipment'}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold border ${
                    eq.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-orange-100 text-orange-900 border-orange-300'
                  }`}>
                    {eq.status}
                  </span>

                  <button
                    onClick={() => {
                      setSelectedEquip(eq);
                      setIsModalOpen(true);
                    }}
                    disabled={eq.status !== 'AVAILABLE'}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all shadow-md flex items-center gap-1.5 ${
                      eq.status === 'AVAILABLE'
                        ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30 cursor-pointer'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    {eq.status === 'AVAILABLE' ? 'Book Now' : 'Unavailable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        equipment={selectedEquip}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchLabDetails}
      />
    </div>
  );
};
