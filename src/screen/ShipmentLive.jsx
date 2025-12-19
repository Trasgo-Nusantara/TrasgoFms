import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
// Wajib import CSS Leaflet agar peta tampil benar
import 'leaflet/dist/leaflet.css'; 

import { Radio, Truck, MapPin, Navigation, Clock, Package } from 'lucide-react';

// --- 1. FIX LEAFLET ICON ISSUE IN REACT ---
// Trik ini diperlukan karena kadang icon default Leaflet tidak muncul di React/Webpack/Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- 2. MOCK DATA (Simulasi Posisi Live) ---
// Koordinat di sekitar Pulau Jawa sebagai contoh
const liveShipments = [
  { 
    id: 'SHP-LIVE-01', 
    driver: 'Budi S.', 
    vehicle: 'Truck Wingbox B 9123 XZ', 
    status: 'Moving', 
    speed: '75 km/h', 
    eta: '2 Jam lagi',
    origin: 'Jakarta', 
    dest: 'Bandung', 
    coords: [-6.402484, 107.012222] // Sekitar Cikarang/Karawang
  },
  { 
    id: 'SHP-LIVE-02', 
    driver: 'Agus D.', 
    vehicle: 'Grand Max Van D 1822 KK', 
    status: 'Stuck in Traffic', 
    speed: '12 km/h', 
    eta: '4 Jam lagi',
    origin: 'Bandung', 
    dest: 'Semarang', 
    coords: [-6.890496, 107.633587] // Sekitar Bandung
  },
  { 
    id: 'SHP-LIVE-03', 
    driver: 'Siti A.', 
    vehicle: 'CDD Box H 1234 QA', 
    status: 'Moving', 
    speed: '60 km/h', 
    eta: 'On Time',
    origin: 'Semarang', 
    dest: 'Surabaya', 
    coords: [-7.030897, 110.448010] // Sekitar Semarang
  },
];

export default function ShipmentLive() {
  const [activePopup, setActivePopup] = useState(null);

  // Koordinat tengah awal (Pusat pulau Jawa kira-kira)
  const centerPosition = [-6.9, 108.5];

  return (
    // PENTING: Container harus memiliki tinggi eksplisit (h-full)
    <div className="h-full w-full rounded-xl border border-gray-300 overflow-hidden relative z-0">
        
        {/* --- MAP CONTAINER --- */}
        <MapContainer 
            center={centerPosition} 
            zoom={8} 
            scrollWheelZoom={true} 
            zoomControl={false} // Kita pakai zoom control custom posisinya
            style={{ height: "100%", width: "100%" }}
        >
            {/* Layer Peta OpenStreetMap (Gratis) */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ZoomControl position="bottomright" />

            {/* Render Markers dari Data */}
            {liveShipments.map((shipment) => (
                <Marker 
                    key={shipment.id} 
                    position={shipment.coords}
                    eventHandlers={{
                        click: () => {
                          setActivePopup(shipment.id);
                        },
                      }}
                >
                    <Popup className="custom-popup">
                        <div className="p-1">
                            <div className="flex items-center gap-2 mb-2 border-b pb-2">
                                <Truck size={18} className="text-blue-600"/>
                                <h3 className="font-bold text-gray-800 text-sm">{shipment.id}</h3>
                            </div>
                            <div className="space-y-2 text-xs text-gray-600">
                                <div className="flex gap-2"><Package size={14}/> <span>{shipment.vehicle} ({shipment.driver})</span></div>
                                <div className="flex gap-2"><Navigation size={14}/> <span>Rute: {shipment.origin} <span className="text-gray-400">Isi</span> {shipment.dest}</span></div>
                                <div className="flex gap-2">
                                    <ActivityIcon status={shipment.status} />
                                    <span className={`font-bold ${shipment.status === 'Stuck in Traffic' ? 'text-red-600' : 'text-green-600'}`}>
                                        {shipment.status} ({shipment.speed})
                                    </span>
                                </div>
                                <div className="flex gap-2"><Clock size={14}/> <span>ETA: {shipment.eta}</span></div>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>

        {/* --- OVERLAY SIDEBAR (Informasi Tambahan) --- */}
        <div className="absolute top-4 left-4 z-[400] bg-white p-4 rounded-xl shadow-lg border border-gray-200 max-w-xs animate-in slide-in-from-left">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 text-green-600 rounded-full animate-pulse">
                    <Radio size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-gray-800">Live Control Tower</h3>
                    <p className="text-xs text-gray-500">{liveShipments.length} Unit Aktif di Peta</p>
                </div>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                {liveShipments.map(shipment => (
                     <div key={shipment.id} className={`p-3 rounded-lg border cursor-pointer transition-all ${activePopup === shipment.id ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-100 hover:bg-gray-50'}`}>
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-xs text-blue-600">{shipment.id}</span>
                            <StatusBadge status={shipment.status} />
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                            <MapPin size={12}/> {shipment.origin} → {shipment.dest}
                        </div>
                        <div className="flex justify-between items-center text-xs font-medium bg-white p-2 rounded border border-gray-100">
                             <span className="flex items-center gap-1"><Navigation size={12} className="text-gray-400"/> {shipment.speed}</span>
                             <span className="flex items-center gap-1"><Clock size={12} className="text-gray-400"/> ETA: {shipment.eta}</span>
                        </div>
                     </div>
                ))}
            </div>
            <p className="text-[10px] text-gray-400 mt-3 text-center">Data diperbarui setiap 30 detik (Simulasi)</p>
        </div>
    </div>
  );
}

// --- SUB-KOMPONEN KECIL UNTUK UI ---

function StatusBadge({ status }) {
    const color = status === 'Moving' ? 'bg-green-100 text-green-700' : status === 'Stuck in Traffic' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700';
    return (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${color}`}>
            {status}
        </span>
    );
}

function ActivityIcon({ status }) {
    if (status === 'Stuck in Traffic') return <AlertCircle size={14} className="text-red-500"/>;
    return <Radio size={14} className="text-green-500 animate-pulse"/>;
}

// Import ikon tambahan yang mungkin belum ada di atas
import { AlertCircle } from 'lucide-react';