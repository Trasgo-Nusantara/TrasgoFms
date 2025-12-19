import React from 'react';
import { Truck, MapPin, AlertCircle, Fuel } from 'lucide-react';

export default function Overview() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Ringkasan Operasional</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Armada" value="45 Unit" icon={<Truck size={24} className="text-blue-600"/>} color="bg-blue-50" />
        <StatCard title="Sedang Berjalan" value="32 Unit" icon={<MapPin size={24} className="text-green-600"/>} color="bg-green-50" />
        <StatCard title="Perlu Servis" value="3 Unit" icon={<AlertCircle size={24} className="text-red-600"/>} color="bg-red-50" />
        <StatCard title="Efisiensi BBM" value="82%" icon={<Fuel size={24} className="text-yellow-600"/>} color="bg-yellow-50" />
      </div>

      {/* Contoh Grafik / Activity Log Sederhana */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-4">Aktivitas Terkini</h3>
          <ul className="space-y-3">
            {[1, 2, 3].map((i) => (
              <li key={i} className="flex items-center text-sm text-gray-600 border-b border-gray-50 pb-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Truck A-00{i} menyelesaikan pengiriman di Cikarang.
                <span className="ml-auto text-gray-400 text-xs">10m lalu</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-4">Status Perawatan</h3>
          <div className="flex items-center justify-center h-32 text-gray-400 bg-gray-50 rounded-lg border border-dashed">
            Area Grafik Chart.js / Recharts
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
    </div>
  );
}