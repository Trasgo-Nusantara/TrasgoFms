import React, { useState } from 'react';
import { 
  Search, Calendar, Filter, MoreVertical, 
  MapPin, Clock, ArrowRight, Truck, User, 
  CheckCircle, PlayCircle, CalendarClock, ChevronRight 
} from 'lucide-react';

// --- MOCK DATA YANG LEBIH LENGKAP ---
const tripsData = [
  { 
    id: 'TR-2024-101', 
    date: '19 Des 2024',
    vehicle: 'Truck A-001', 
    type: 'Wingbox',
    driver: 'Budi Santoso', 
    
    // Data Rute
    origin: 'Gudang Cakung, JKT',
    destination: 'Pelabuhan Merak, BTN',
    startTime: '08:30',
    endTime: '10:45',
    
    // Statistik
    dist: '112 km', 
    duration: '2j 15m', 
    status: 'Completed' 
  },
  { 
    id: 'TR-2024-102', 
    date: '19 Des 2024',
    vehicle: 'Van B-023', 
    type: 'Grand Max',
    driver: 'Agus Dermawan', 
    
    origin: 'Bekasi Barat',
    destination: 'Bogor Kota',
    startTime: '13:00',
    endTime: '14:30 (Est)',
    
    dist: '45 km', 
    duration: '1j 30m', 
    status: 'In Progress' 
  },
  { 
    id: 'TR-2024-103', 
    date: '20 Des 2024',
    vehicle: 'Truck A-005', 
    type: 'Fuso',
    driver: 'Siti Aminah', 
    
    origin: 'Cikarang Dry Port',
    destination: 'Tanjung Priok',
    startTime: '09:00',
    endTime: '-',
    
    dist: '38 km', 
    duration: '-', 
    status: 'Scheduled' 
  },
];

export default function Trips() {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');

  // Filter Logic Sederhana
  const filteredTrips = tripsData.filter(trip => {
    const matchesStatus = activeTab === 'All' || 
      (activeTab === 'Active' && trip.status === 'In Progress') ||
      (activeTab === 'Completed' && trip.status === 'Completed') ||
      (activeTab === 'Scheduled' && trip.status === 'Scheduled');
    
    const matchesSearch = trip.id.toLowerCase().includes(search.toLowerCase()) || 
                          trip.vehicle.toLowerCase().includes(search.toLowerCase()) ||
                          trip.driver.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // Helper Warna Status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed': 
        return <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200"><CheckCircle size={12}/> Selesai</span>;
      case 'In Progress': 
        return <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200"><PlayCircle size={12}/> Jalan</span>;
      case 'Scheduled': 
        return <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200"><CalendarClock size={12}/> Terjadwal</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      
      {/* --- HEADER & STATS --- */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Manajemen Perjalanan</h2>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatCard label="Total Perjalanan (Bulan Ini)" value="1,240" icon={<ArrowRight className="text-blue-500"/>} />
            <StatCard label="Sedang Berjalan" value="12 Unit" icon={<PlayCircle className="text-green-500"/>} />
            <StatCard label="Total Jarak Tempuh" value="84,320 km" icon={<MapPin className="text-indigo-500"/>} />
        </div>

        {/* Toolbar: Tabs & Filter */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            
            {/* Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-lg">
                {['All', 'Active', 'Scheduled', 'Completed'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition ${
                            activeTab === tab 
                            ? 'bg-white text-gray-800 shadow-sm' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {tab === 'All' ? 'Semua' : tab === 'Active' ? 'Berjalan' : tab === 'Scheduled' ? 'Terjadwal' : 'Selesai'}
                    </button>
                ))}
            </div>

            {/* Search & Date */}
            <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Cari ID / Supir..." 
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                    <Calendar size={18} /> <span className="hidden sm:inline">Tanggal</span>
                </button>
                <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                    <Filter size={18} />
                </button>
            </div>
        </div>
      </div>

      {/* --- TABLE CONTENT --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-200">
                <tr>
                <th className="p-4 w-40">Detail Trip</th>
                <th className="p-4 w-64">Kendaraan & Supir</th>
                <th className="p-4">Rute & Waktu</th>
                <th className="p-4 w-40">Statistik</th>
                <th className="p-4 w-32 text-right">Status</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
                {filteredTrips.map((trip) => (
                <tr key={trip.id} className="hover:bg-gray-50 transition group cursor-pointer">
                    
                    {/* Kolom 1: ID & Tanggal */}
                    <td className="p-4 align-top">
                        <div className="flex flex-col gap-1">
                            <span className="font-mono text-blue-600 font-bold text-sm group-hover:underline decoration-blue-300 underline-offset-2">
                                {trip.id}
                            </span>
                            <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                                <Calendar size={12} />
                                <span>{trip.date}</span>
                            </div>
                        </div>
                    </td>

                    {/* Kolom 2: Info Kendaraan */}
                    <td className="p-4 align-top">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-gray-100 rounded text-gray-600"><Truck size={16}/></div>
                                <div>
                                    <p className="font-bold text-gray-800">{trip.vehicle}</p>
                                    <p className="text-xs text-gray-400">{trip.type}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-gray-100 rounded-full text-gray-500"><User size={14}/></div>
                                <span className="text-gray-600 text-xs font-medium">{trip.driver}</span>
                            </div>
                        </div>
                    </td>

                    {/* Kolom 3: Rute Visual (Timeline) */}
                    <td className="p-4 align-top">
                        <div className="relative border-l-2 border-gray-200 pl-4 space-y-4">
                            {/* Titik Awal */}
                            <div className="relative">
                                <div className="absolute -left-[21px] top-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-medium text-gray-800 text-sm">{trip.origin}</p>
                                        <p className="text-xs text-gray-400">Asal</p>
                                    </div>
                                    <span className="text-xs font-mono font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                        {trip.startTime}
                                    </span>
                                </div>
                            </div>

                            {/* Titik Akhir */}
                            <div className="relative">
                                <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm ${trip.status === 'Completed' ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-medium text-gray-800 text-sm">{trip.destination}</p>
                                        <p className="text-xs text-gray-400">Tujuan</p>
                                    </div>
                                    <span className="text-xs font-mono font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                        {trip.endTime}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </td>

                    {/* Kolom 4: Statistik */}
                    <td className="p-4 align-top">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-600">
                                <MapPin size={14} className="text-gray-400"/>
                                <span className="font-medium">{trip.dist}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Clock size={14} className="text-gray-400"/>
                                <span>{trip.duration}</span>
                            </div>
                        </div>
                    </td>

                    {/* Kolom 5: Status */}
                    <td className="p-4 text-right align-top">
                        <div className="flex flex-col items-end gap-2">
                            {getStatusBadge(trip.status)}
                            <button className="text-gray-400 hover:text-blue-600 transition">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </td>

                </tr>
                ))}
            </tbody>
            </table>
        </div>
        
        {/* Pagination Dummy */}
        <div className="p-4 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
            <span>Menampilkan 3 dari 128 perjalanan</span>
            <div className="flex gap-2">
                <button className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50" disabled>Sebelumnya</button>
                <button className="px-3 py-1 border rounded hover:bg-gray-50">Berikutnya</button>
            </div>
        </div>
      </div>
    </div>
  );
}

// Sub-Component untuk Card Statistik Kecil
function StatCard({ label, value, icon }) {
    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wide">{label}</p>
                <p className="text-xl font-bold text-gray-800 mt-1">{value}</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
        </div>
    )
}