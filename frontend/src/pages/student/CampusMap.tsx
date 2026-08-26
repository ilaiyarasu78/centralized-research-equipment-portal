import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Compass, RotateCw, ZoomIn, ZoomOut, Layers, Eye, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { CampusLocation } from '../../types';

// Custom Leaflet Pin Icon
const customIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

export const CampusMap: React.FC = () => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<CampusLocation[]>([]);
  const [selectedFloor, setSelectedFloor] = useState('All');

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await api.get('/map-locations');
      if (res.data.success) {
        setLocations(res.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const centerPosition: [number, number] = [12.9716, 77.5946];

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-purple-400" />
            3D Campus Interactive Location Map
          </h1>
          <p className="text-xs text-gray-400">Locate campus labs, equipment rooms, research hubs & library facilities</p>
        </div>

        {/* Floor controls */}
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
          {['All', 'Ground Floor', '1st Floor', '2nd Floor', '3rd Floor', '4th Floor'].map((floor) => (
            <button
              key={floor}
              onClick={() => setSelectedFloor(floor)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedFloor === floor ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              {floor}
            </button>
          ))}
        </div>
      </div>

      {/* Main Leaflet Map Display */}
      <div className="glass-panel rounded-3xl overflow-hidden border-purple-500/30 h-[650px] relative shadow-2xl">
        <MapContainer center={centerPosition} zoom={16} scrollWheelZoom={true} className="h-full w-full z-10">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {locations.map((loc) => (
            <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={customIcon}>
              <Popup className="custom-leaflet-popup">
                <div className="p-2 space-y-2 min-w-[200px]">
                  <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                    {loc.category}
                  </span>
                  <h4 className="text-sm font-bold text-gray-900">{loc.name}</h4>
                  <p className="text-xs text-gray-600">{loc.description}</p>
                  <p className="text-[11px] text-purple-700 font-semibold">{loc.floor}</p>
                  {loc.labId && (
                    <button
                      onClick={() => navigate(`/student/labs/${loc.labId}`)}
                      className="w-full mt-2 py-1 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Explore Lab
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Map Legend Overlay */}
        <div className="absolute top-4 right-4 z-20 bg-[#121828]/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 max-w-xs space-y-2">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Campus Pins ({locations.length})</h4>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {locations.map((l) => (
              <div
                key={l.id}
                onClick={() => {
                  if (l.labId) navigate(`/student/labs/${l.labId}`);
                }}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer text-xs flex items-center justify-between"
              >
                <div>
                  <h5 className="font-bold text-white leading-tight">{l.name}</h5>
                  <p className="text-[10px] text-purple-300">{l.category}</p>
                </div>
                <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
