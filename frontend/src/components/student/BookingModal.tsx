import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, AlertCircle, CheckCircle2, Wrench, FlaskConical } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Equipment, Lab } from '../../types';
import { api } from '../../services/api';

interface BookingModalProps {
  equipment: Equipment | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ equipment, isOpen, onClose, onSuccess }) => {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [availableEquipments, setAvailableEquipments] = useState<Equipment[]>([]);
  
  const [selectedLabId, setSelectedLabId] = useState<string>('');
  const [selectedEquipId, setSelectedEquipId] = useState<string>('');
  
  const [date, setDate] = useState('2026-08-28');
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('12:00 PM');
  const [purpose, setPurpose] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchLabsAndEquipment();
    }
  }, [isOpen]);

  useEffect(() => {
    if (equipment) {
      setSelectedLabId(equipment.labId || (equipment.lab?.id || ''));
      setSelectedEquipId(equipment.id);
    }
  }, [equipment]);

  const fetchLabsAndEquipment = async () => {
    try {
      const labsRes = await api.get('/labs');
      if (labsRes.data.success) {
        setLabs(labsRes.data.data);
      }
      const equipRes = await api.get('/equipment');
      if (equipRes.data.success) {
        setAvailableEquipments(equipRes.data.data);
        if (!equipment && equipRes.data.data.length > 0) {
          const firstEquip = equipRes.data.data[0];
          setSelectedEquipId(firstEquip.id);
          setSelectedLabId(firstEquip.labId || '');
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Filter equipment based on selected lab
  const filteredEquipmentsForLab = availableEquipments.filter(
    (eq) => !selectedLabId || eq.labId === selectedLabId || eq.lab?.id === selectedLabId
  );

  const activeEquipment = availableEquipments.find((eq) => eq.id === selectedEquipId) || equipment;

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEquipId) {
      setError('Please select an equipment to book.');
      return;
    }
    if (!purpose.trim()) {
      setError('Please state the purpose of your booking.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/bookings', {
        equipmentId: selectedEquipId,
        date,
        startTime,
        endTime,
        purpose,
        description
      });

      if (res.data.success) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        onSuccess();
        onClose();
      } else {
        setError(res.data.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit booking. Slot overlap conflict or server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl text-slate-900">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50 via-indigo-50 to-white">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Book Campus Equipment
            </h3>
            <p className="text-xs text-purple-700 font-bold">Select Lab, Equipment & Reserve your Time Slot</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Select Campus Lab */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
              1. Select Campus Lab
            </label>
            <div className="relative">
              <FlaskConical className="w-4 h-4 text-purple-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={selectedLabId}
                onChange={(e) => {
                  const newLabId = e.target.value;
                  setSelectedLabId(newLabId);
                  const matchingEquip = availableEquipments.find((eq) => eq.labId === newLabId || eq.lab?.id === newLabId);
                  if (matchingEquip) {
                    setSelectedEquipId(matchingEquip.id);
                  }
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-black text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white transition-all cursor-pointer"
              >
                <option value="">-- All Labs (Select a Lab) --</option>
                {labs.map((l) => (
                  <option key={l.id} value={l.id} className="font-bold text-slate-900">
                    {l.name} ({l.category})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. Select Equipment in Lab */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
              2. Select Equipment Item
            </label>
            <div className="relative">
              <Wrench className="w-4 h-4 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={selectedEquipId}
                onChange={(e) => setSelectedEquipId(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-black text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white transition-all cursor-pointer"
                required
              >
                {filteredEquipmentsForLab.length === 0 ? (
                  <option value="">No equipment available in selected lab</option>
                ) : (
                  filteredEquipmentsForLab.map((eq) => (
                    <option key={eq.id} value={eq.id} className="font-bold text-slate-900">
                      {eq.name} ({eq.equipmentId}) - {eq.status}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Selected Equipment Badge */}
          {activeEquipment && (
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-purple-900 bg-purple-100 px-2 py-0.5 rounded border border-purple-300">
                  {activeEquipment.category}
                </span>
                <h4 className="text-xs font-black text-slate-900 mt-1">{activeEquipment.name}</h4>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${
                activeEquipment.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-orange-100 text-orange-900 border-orange-300'
              }`}>
                {activeEquipment.status}
              </span>
            </div>
          )}

          {/* 3. Booking Date */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
              3. Booking Date
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-purple-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-black text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white transition-all font-mono"
                required
              />
            </div>
          </div>

          {/* 4. Time Slot Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Start Time</label>
              <div className="relative">
                <Clock className="w-4 h-4 text-cyan-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-black text-slate-900 focus:outline-none focus:border-purple-600 cursor-pointer"
                >
                  <option value="08:00 AM">08:00 AM</option>
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="01:00 PM">01:00 PM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="03:00 PM">03:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">End Time</label>
              <div className="relative">
                <Clock className="w-4 h-4 text-cyan-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-black text-slate-900 focus:outline-none focus:border-purple-600 cursor-pointer"
                >
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="01:00 PM">01:00 PM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="03:00 PM">03:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                  <option value="05:00 PM">05:00 PM</option>
                </select>
              </div>
            </div>
          </div>

          {/* 5. Purpose */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
              5. Purpose / Project Title
            </label>
            <input
              type="text"
              placeholder="e.g. 3D Printing Prototype Chassis / Embedded System Test"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white"
              required
            />
          </div>

          {/* 6. Description */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Additional Notes (Optional)</label>
            <textarea
              rows={2}
              placeholder="Describe material requirements or lab assistance..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black transition-all shadow-lg shadow-purple-600/30 flex items-center gap-2 cursor-pointer"
            >
              {loading ? 'Validating Reservation...' : 'Confirm Equipment Booking'}
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
