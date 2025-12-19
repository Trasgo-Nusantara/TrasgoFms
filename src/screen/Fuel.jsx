import React, { useState } from 'react';
import { 
  Droplet, TrendingUp, DollarSign, 
  Calendar, Download, Plus, Search, 
  FileText, AlertTriangle, ArrowUpRight, ArrowDownRight, Filter
} from 'lucide-react';

// --- MOCK DATA TRANSAKSI BBM ---
const initialTransactions = [
  { 
    id: 'FUEL-001', 
    date: '19 Des 2024', 
    vehicle: 'Truck A-001', 
    driver: 'Budi Santoso',
    location: 'Rest Area KM 57 (Pertamina)', 
    liters: 150, 
    cost: 2070000, 
    odometer: 45200, 
    efficiency: 8.2, // km/L
    status: 'Normal',
    receipt: true 
  },
  { 
    id: 'FUEL-002', 
    date: '18 Des 2024', 
    vehicle: 'Van B-023', 
    driver: 'Agus Dermawan',
    location: 'Shell MT Haryono', 
    liters: 45, 
    cost: 650000, 
    odometer: 28500, 
    efficiency: 9.5, 
    status: 'Normal',
    receipt: true 
  },
  { 
    id: 'FUEL-003', 
    date: '17 Des 2024', 
    vehicle: 'Truck A-005', 
    driver: 'Siti Aminah',
    location: 'SPBU Pantura', 
    liters: 120, 
    cost: 1656000, 
    odometer: 125000, 
    efficiency: 4.5, // Anomali (Sangat boros)
    status: 'High Consumption',
    receipt: false 
  },
  { 
    id: 'FUEL-004', 
    date: '16 Des 2024', 
    vehicle: 'Truck A-001', 
    driver: 'Budi Santoso',
    location: 'SPBU Cikarang', 
    liters: 100, 
    cost: 1380000, 
    odometer: 44800, 
    efficiency: 8.0, 
    status: 'Normal',
    receipt: true 
  },
];

// Data Dummy untuk Grafik Harian (7 Hari Terakhir)
const weeklyUsage = [
    { day: 'Sen', value: 450, cost: 6.2 },
    { day: 'Sel', value: 320, cost: 4.4 },
    { day: 'Rab', value: 550, cost: 7.5 },
    { day: 'Kam', value: 480, cost: 6.6 },
    { day: 'Jum', value: 600, cost: 8.2 },
    { day: 'Sab', value: 200, cost: 2.7 },
    { day: 'Min', value: 150, cost: 2.0 },
];

export default function Fuel() {
  const [transactions] = useState(initialTransactions);
  const [filter, setFilter] = useState('');

  // Filter Logic
  const filteredData = transactions.filter(t => 
    t.vehicle.toLowerCase().includes(filter.toLowerCase()) ||
    t.location.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6 h-full flex flex-col">
      
      {/* --- HEADER & ACTIONS --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold text-gray-800">Manajemen Bahan Bakar</h2>
            <p className="text-sm text-gray-500">Monitoring biaya, konsumsi, dan efisiensi armada.</p>
        </div>
        <div className="flex gap-2">
            <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                <Download size={16}/> Export Laporan
            </button>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm">
                <Plus size={16}/> Input Transaksi
            </button>
        </div>
      </div>

      {/* --- SUMMARY CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Total Konsumsi */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
            <div className="relative z-10">
                <p className="text-blue-100 text-sm font-medium mb-1">Total Konsumsi (Bulan Ini)</p>
                <h3 className="text-4xl font-bold">4,250 <span className="text-lg font-normal">Liter</span></h3>
                <div className="flex items-center gap-1 mt-4 text-sm bg-blue-500/30 w-fit px-2 py-1 rounded">
                    <ArrowUpRight size={16}/> 
                    <span>12% vs bulan lalu</span>
                </div>
            </div>
            <Droplet className="absolute right-4 top-4 text-blue-500/40" size={120} />
        </div>

        {/* Card 2: Total Biaya */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start">
                    <p className="text-gray-500 text-sm font-bold uppercase">Total Biaya BBM</p>
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                        <DollarSign size={20} />
                    </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">Rp 58.2jt</h3>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm">
                <span className="text-gray-500">Avg Harga/Liter</span>
                <span className="font-bold text-gray-700">Rp 13.694</span>
            </div>
        </div>

        {/* Card 3: Efisiensi */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
             <div>
                <div className="flex justify-between items-start">
                    <p className="text-gray-500 text-sm font-bold uppercase">Efisiensi Rata-rata</p>
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <TrendingUp size={20} />
                    </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">8.5 <span className="text-lg text-gray-400 font-normal">km/L</span></h3>
            </div>
             <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-red-500 text-xs font-medium">
                    <AlertTriangle size={14} />
                    <span>2 Kendaraan di bawah standar efisiensi</span>
                </div>
            </div>
        </div>
      </div>

      {/* --- GRAFIK & TABLE SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        
        {/* KIRI: GRAFIK PENGGUNAAN HARIAN (Simple CSS Chart) */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-700">Tren Penggunaan (7 Hari)</h3>
                <select className="text-xs border rounded p-1 bg-gray-50">
                    <option>Volume (L)</option>
                    <option>Biaya (Rp)</option>
                </select>
            </div>
            
            <div className="flex-1 flex items-end justify-between gap-2 min-h-[200px]">
                {weeklyUsage.map((day, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2 w-full group">
                        {/* Tooltip Hover */}
                        <div className="opacity-0 group-hover:opacity-100 absolute -mt-8 bg-gray-800 text-white text-[10px] px-2 py-1 rounded transition-opacity">
                            {day.value}L
                        </div>
                        {/* Bar */}
                        <div 
                            className={`w-full rounded-t-md transition-all duration-500 ${day.value > 500 ? 'bg-blue-600' : 'bg-blue-300'} hover:bg-indigo-500`} 
                            style={{ height: `${(day.value / 600) * 100}%` }}
                        ></div>
                        <span className="text-xs text-gray-500 font-medium">{day.day}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* KANAN: TABEL TRANSAKSI (Lebih Luas) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            
            {/* Table Toolbar */}
            <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h3 className="font-bold text-gray-700">Riwayat Transaksi</h3>
                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Cari Plat / Lokasi..." 
                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                    </div>
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto flex-1">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                        <tr>
                            <th className="p-4 font-semibold">Tanggal & ID</th>
                            <th className="p-4 font-semibold">Kendaraan</th>
                            <th className="p-4 font-semibold">Lokasi / SPBU</th>
                            <th className="p-4 font-semibold">Jumlah & Biaya</th>
                            <th className="p-4 font-semibold text-center">Efisiensi</th>
                            <th className="p-4 font-semibold text-right">Bukti</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredData.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition group">
                                <td className="p-4">
                                    <div className="font-bold text-gray-800">{item.date}</div>
                                    <div className="text-xs text-blue-600 font-mono">{item.id}</div>
                                </td>
                                <td className="p-4">
                                    <div className="font-medium text-gray-800">{item.vehicle}</div>
                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                        <span className="w-4 h-4 rounded-full bg-gray-200 text-[10px] flex items-center justify-center">
                                            {item.driver.charAt(0)}
                                        </span>
                                        {item.driver}
                                    </div>
                                </td>
                                <td className="p-4 text-gray-600">
                                    {item.location}
                                </td>
                                <td className="p-4">
                                    <div className="font-bold text-gray-800">Rp {item.cost.toLocaleString()}</div>
                                    <div className="text-xs text-gray-500">{item.liters} Liter</div>
                                </td>
                                <td className="p-4 text-center">
                                    {item.status === 'High Consumption' ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-bold border border-red-200">
                                            <AlertTriangle size={12}/> {item.efficiency} km/L
                                        </span>
                                    ) : (
                                        <span className="inline-flex px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-bold border border-green-200">
                                            {item.efficiency} km/L
                                        </span>
                                    )}
                                    <div className="text-[10px] text-gray-400 mt-1">Odo: {item.odometer.toLocaleString()}</div>
                                </td>
                                <td className="p-4 text-right">
                                    {item.receipt ? (
                                        <button className="text-blue-600 hover:underline text-xs font-medium flex items-center justify-end gap-1">
                                            <FileText size={14}/> Lihat Struk
                                        </button>
                                    ) : (
                                        <span className="text-xs text-gray-400 italic">Hilang</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 text-xs text-gray-500 flex justify-between items-center">
                <span>Menampilkan {filteredData.length} transaksi</span>
                <div className="flex gap-2">
                    <button className="px-3 py-1 bg-white border rounded shadow-sm hover:bg-gray-50" disabled>Prev</button>
                    <button className="px-3 py-1 bg-white border rounded shadow-sm hover:bg-gray-50">Next</button>
                </div>
            </div>

        </div>
      </div>

    </div>
  );
}