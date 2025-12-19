import React, { useState } from 'react';
import { MapContainer, TileLayer, Circle, Popup, Marker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Wajib import CSS Leaflet agar peta tidak berantakan
import { Plus, Trash2, AlertTriangle, Eye, Layers } from 'lucide-react';
import L from 'leaflet';

// --- Fix Icon Default Leaflet (Bug umum di React) ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;
// ---------------------------------------------------

// Data Mock dengan Koordinat GPS Asli (Jakarta/Bekasi)
const initialZones = [
  { id: 1, name: 'Gudang Pusat (Cakung)', type: 'safe', radius: 1500, lat: -6.1889, lng: 106.9475, activeVehicle: 2 },
  { id: 2, name: 'Zona Macet Kalimalang', type: 'danger', radius: 800, lat: -6.2496, lng: 106.9723, activeVehicle: 0 },
  { id: 3, name: 'Klien: PT Maju Mundur', type: 'destination', radius: 500, lat: -6.2297, lng: 106.8167, activeVehicle: 1 },
];

// Simulasi Lokasi Truk (Untuk ditampilkan sebagai Marker)
const trucks = [
  { id: 'T-01', lat: -6.1895, lng: 106.9480, name: 'Truck A-001' }, // Di dalam Gudang Cakung
  { id: 'T-02', lat: -6.2300, lng: 106.8200, name: 'Van B-023' },    // Dekat Klien
];

export default function Geofencing() {
  const [zones, setZones] = useState(initialZones);
  const [showForm, setShowForm] = useState(false);

  // Helper Warna untuk Circle Leaflet
  const getZoneColor = (type) => {
    switch (type) {
      case 'safe': return { color: 'green', fillColor: '#4ade80' };
      case 'danger': return { color: 'red', fillColor: '#f87171' };
      case 'destination': return { color: 'blue', fillColor: '#60a5fa' };
      default: return { color: 'gray', fillColor: '#9ca3af' };
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6">
      
      {/* MAP SECTION (React Leaflet) */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden relative z-0">
        
        {/* Peta */}
        <div className="flex-1 h-full w-full z-0">
            <MapContainer 
                center={[-6.2088, 106.8456]} // Pusat Peta (Jakarta)
                zoom={11} 
                scrollWheelZoom={true} 
                style={{ height: "100%", width: "100%", zIndex: 0 }}
            >
                {/* Layer Peta Gratis (OpenStreetMap) */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Render ZONA (Lingkaran) */}
                {zones.map((zone) => (
                    <Circle 
                        key={zone.id}
                        center={[zone.lat, zone.lng]}
                        radius={zone.radius}
                        pathOptions={getZoneColor(zone.type)}
                    >
                        <Popup>
                            <div className="text-center">
                                <strong>{zone.name}</strong><br/>
                                <span className="text-xs uppercase font-bold text-gray-500">{zone.type} Zone</span>
                            </div>
                        </Popup>
                    </Circle>
                ))}

                {/* Render TRUK (Marker) */}
                {trucks.map((truck) => (
                    <Marker key={truck.id} position={[truck.lat, truck.lng]}>
                         <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent>
                            {truck.name}
                        </Tooltip>
                    </Marker>
                ))}

            </MapContainer>
        </div>

        {/* Overlay Info Statis */}
        <div className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow-md z-[400] text-xs space-y-2 opacity-90">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div> Safe Zone</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div> Danger Zone</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Destination</div>
        </div>
      </div>

      {/* SIDEBAR CONTROL (List & Form) */}
      <div className="w-full lg:w-96 flex flex-col gap-6 h-full overflow-hidden">
        
        {/* Control Panel */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col h-full">
            <div className="flex justify-between items-center mb-4 shrink-0">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Layers size={20} className="text-indigo-600"/> Geofence Manager
                </h2>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition shadow-sm"
                >
                    <Plus size={20} />
                </button>
            </div>

            {/* Form Tambah Zona */}
            {showForm && (
                <div className="mb-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100 shrink-0">
                    <h4 className="font-bold text-sm text-indigo-800 mb-3">Tambah Geofence Baru</h4>
                    <div className="space-y-3">
                        <input type="text" placeholder="Nama Lokasi" className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none" />
                        <div className="flex gap-2">
                            <input type="number" placeholder="Lat" className="w-1/3 p-2 text-sm border rounded" />
                            <input type="number" placeholder="Lng" className="w-1/3 p-2 text-sm border rounded" />
                            <input type="number" placeholder="Radius (m)" className="w-1/3 p-2 text-sm border rounded" />
                        </div>
                        <button className="w-full bg-indigo-600 text-white text-sm py-2 rounded font-medium hover:bg-indigo-700">Simpan ke Peta</button>
                    </div>
                </div>
            )}

            {/* List Zona - Scrollable */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {zones.map((zone) => (
                    <div key={zone.id} className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition bg-white group shadow-sm">
                        <div className="flex justify-between items-start mb-1">
                            <div>
                                <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                                    {zone.name}
                                </h4>
                                <p className="text-[10px] text-gray-400 font-mono mt-1">
                                    {zone.lat}, {zone.lng}
                                </p>
                            </div>
                            <button className="text-gray-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100">
                                <Trash2 size={16} />
                            </button>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${
                                    zone.type === 'safe' ? 'bg-green-500' : 
                                    zone.type === 'danger' ? 'bg-red-500' : 'bg-blue-500'
                                }`}></span>
                                <span className="text-xs text-gray-500 capitalize">{zone.type} • {zone.radius}m</span>
                            </div>
                            
                            <button className="text-indigo-600 hover:text-indigo-800 text-xs font-medium flex items-center gap-1">
                                <Eye size={12}/> Lihat
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
}