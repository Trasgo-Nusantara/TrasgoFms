import React, { useState } from 'react';
import { 
  Package, MapPin, Calendar, Clock, AlertTriangle, 
  Search, Plus, ArrowRight, CheckCircle, Truck 
} from 'lucide-react';

// Mock Data Pengiriman
const initialShipments = [
  { id: 'SHP-001', customer: 'PT Sumber Makmur', origin: 'Jakarta', dest: 'Surabaya', status: 'In Transit', eta: '20 Des', delay: false },
  { id: 'SHP-002', customer: 'CV Maju Jaya', origin: 'Bekasi', dest: 'Bandung', status: 'Delivered', eta: '18 Des', delay: false },
  { id: 'SHP-003', customer: 'Toko Elektronik 88', origin: 'Cikarang', dest: 'Semarang', status: 'Delayed', eta: '19 Des', delay: true },
  { id: 'SHP-004', customer: 'Gudang Garam', origin: 'Kediri', dest: 'Jakarta', status: 'In Transit', eta: '21 Des', delay: false },
];

export default function Shipments({ view }) {
  // view: 'live' | 'all' | 'track' | 'create' | 'delayed'

  const [shipments, setShipments] = useState(initialShipments);
  const [trackId, setTrackId] = useState('');

  // --- SUB-VIEWS ---

  // 1. ALL SHIPMENTS & DELAYED (Reusing Table)
  const TableView = ({ onlyDelayed }) => {
    const data = onlyDelayed ? shipments.filter(s => s.delay) : shipments;
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-700">
            {onlyDelayed ? 'Pengiriman Terlambat (Delayed)' : 'Semua Pengiriman'}
          </h3>
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
            Total: {data.length}
          </span>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="p-4">ID Resi</th>
              <th className="p-4">Pelanggan</th>
              <th className="p-4">Rute</th>
              <th className="p-4">Status</th>
              <th className="p-4">Estimasi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-4 font-mono font-bold text-blue-600">{item.id}</td>
                <td className="p-4 font-medium">{item.customer}</td>
                <td className="p-4 text-gray-500">
                  {item.origin} <ArrowRight size={12} className="inline mx-1"/> {item.dest}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    item.status === 'Delayed' ? 'bg-red-100 text-red-600' :
                    item.status === 'Delivered' ? 'bg-green-100 text-green-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-4 text-gray-500">{item.eta}</td>
              </tr>
            ))}
            {data.length === 0 && (
                <tr><td colSpan="5" className="p-8 text-center text-gray-400">Tidak ada data.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  // 2. CREATE SHIPMENT FORM
  const CreateView = () => (
    <div className="max-w-2xl bg-white p-8 rounded-xl shadow-sm border border-gray-200 mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Package className="text-blue-600"/> Buat Pengiriman Baru
      </h2>
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Pengirim</label>
                <input type="text" className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Nama Pengirim" />
            </div>
             <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Penerima</label>
                <input type="text" className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Nama Penerima" />
            </div>
        </div>
        <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Alamat Tujuan</label>
            <textarea className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows="3" placeholder="Alamat lengkap..."></textarea>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Jenis Barang</label>
                <select className="w-full mt-1 p-2 border rounded-lg bg-white">
                    <option>General Cargo</option>
                    <option>Fragile</option>
                    <option>Perishable (Makanan)</option>
                </select>
            </div>
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Berat (kg)</label>
                <input type="number" className="w-full mt-1 p-2 border rounded-lg" placeholder="0" />
            </div>
        </div>
        <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 mt-4">
            <Plus size={18}/> Buat Order Pengiriman
        </button>
      </form>
    </div>
  );

  // 3. TRACK SHIPMENT
  const TrackView = () => (
    <div className="max-w-3xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Lacak Paket</h2>
            <p className="text-gray-500 mb-6">Masukkan Nomor Resi / ID Pengiriman untuk melacak posisi terkini.</p>
            <div className="flex max-w-md mx-auto relative">
                <Search className="absolute left-3 top-3 text-gray-400" />
                <input 
                    type="text" 
                    value={trackId}
                    onChange={(e) => setTrackId(e.target.value)}
                    className="w-full pl-10 pr-32 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Contoh: SHP-001"
                />
                <button className="absolute right-1 top-1 bottom-1 bg-blue-600 text-white px-6 rounded-md font-bold hover:bg-blue-700">
                    Lacak
                </button>
            </div>
        </div>

        {/* Dummy Result */}
        {trackId && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-blue-600">{trackId}</h3>
                        <p className="text-sm text-gray-500">Jakarta <ArrowRight size={10} className="inline"/> Surabaya</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 font-bold text-xs rounded-full">In Transit</span>
                </div>
                <div className="space-y-6 relative border-l-2 border-gray-200 ml-3 my-4">
                    <div className="relative pl-6">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow"></div>
                        <p className="text-sm font-bold text-gray-800">Sedang di perjalanan menuju Hub Semarang</p>
                        <p className="text-xs text-gray-500">Hari ini, 10:00 WIB</p>
                    </div>
                    <div className="relative pl-6 opacity-50">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 bg-gray-300 rounded-full border-2 border-white"></div>
                        <p className="text-sm font-bold text-gray-800">Paket diterima di Gudang Jakarta</p>
                        <p className="text-xs text-gray-500">Kemarin, 14:30 WIB</p>
                    </div>
                </div>
            </div>
        )}
    </div>
  );

  // 4. LIVE VIEW (Placeholder)
  const LiveView = () => (
    <div className="h-full bg-slate-100 rounded-xl border border-gray-300 flex items-center justify-center relative overflow-hidden group">
         <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
         <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <MapPin size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-700">Live Shipment Tracking</h3>
            <p className="text-gray-500 max-w-md mx-auto mt-2">
                Peta interaktif yang menampilkan seluruh pergerakan paket secara real-time. 
                <br/>(Integrasikan dengan Google Maps / Leaflet di sini)
            </p>
         </div>
    </div>
  );

  // --- MAIN RENDER SWITCHER ---
  switch (view) {
    case 'live': return <LiveView />;
    case 'all': return <TableView onlyDelayed={false} />;
    case 'delayed': return <TableView onlyDelayed={true} />;
    case 'create': return <CreateView />;
    case 'track': return <TrackView />;
    default: return <TableView onlyDelayed={false} />;
  }
}