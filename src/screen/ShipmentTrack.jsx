import React, { useState } from 'react';
import { Search, ArrowRight, Truck } from 'lucide-react';

export default function ShipmentTrack() {
  const [trackId, setTrackId] = useState('');
  const [result, setResult] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if(trackId) {
        // Simulasi hasil pencarian
        setResult({ id: trackId, status: 'On The Way', location: 'Hub Semarang' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Lacak Kiriman</h2>
            <p className="text-gray-500">Masukkan Nomor Resi atau ID Pengiriman untuk melihat posisi terkini.</p>
        </div>

        <form onSubmit={handleSearch} className="relative mb-8">
            <input 
                value={trackId} 
                onChange={(e) => setTrackId(e.target.value)}
                className="w-full p-4 pl-12 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-lg transition" 
                placeholder="Contoh: SHP-001" 
            />
            <Search className="absolute left-4 top-5 text-gray-400"/>
            <button className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white px-6 rounded-lg font-bold hover:bg-blue-700 transition">
                Cari
            </button>
        </form>

        {result && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">No. Resi</p>
                        <h3 className="text-xl font-bold text-blue-600">{result.id}</h3>
                    </div>
                    <div className="text-right">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 font-bold text-sm rounded-full">
                            {result.status}
                        </span>
                    </div>
                </div>
                
                <div className="relative border-l-2 border-gray-200 ml-3 space-y-6 py-2">
                    <div className="relative pl-8">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow"></div>
                        <p className="font-bold text-gray-800">Paket tiba di {result.location}</p>
                        <p className="text-sm text-gray-500">Hari ini, 10:30 WIB</p>
                    </div>
                    <div className="relative pl-8 opacity-50">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 bg-gray-300 rounded-full border-2 border-white"></div>
                        <p className="font-bold text-gray-800">Paket diambil kurir</p>
                        <p className="text-sm text-gray-500">Kemarin, 14:00 WIB</p>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}