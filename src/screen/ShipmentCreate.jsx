import React from 'react';
import { Plus, Package, Save } from 'lucide-react';

export default function ShipmentCreate() {
  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            <Package size={24}/>
        </div>
        <div>
            <h2 className="text-xl font-bold text-gray-800">Buat Pengiriman Baru</h2>
            <p className="text-sm text-gray-500">Isi detail pengiriman di bawah ini.</p>
        </div>
      </div>
      
      <form className="space-y-5">
        <div className="grid grid-cols-2 gap-6">
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Nama Pengirim</label>
                <input type="text" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="PT..." />
            </div>
             <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Nama Penerima</label>
                <input type="text" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="CV..." />
            </div>
        </div>

        <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Alamat Tujuan</label>
            <textarea className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows="3" placeholder="Jalan..."></textarea>
        </div>

        <div className="grid grid-cols-3 gap-6">
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Jenis Barang</label>
                <select className="w-full p-2.5 border border-gray-300 rounded-lg bg-white">
                    <option>General Cargo</option>
                    <option>Fragile</option>
                    <option>Perishable</option>
                </select>
            </div>
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Berat (kg)</label>
                <input type="number" className="w-full p-2.5 border border-gray-300 rounded-lg" placeholder="0" />
            </div>
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Prioritas</label>
                <select className="w-full p-2.5 border border-gray-300 rounded-lg bg-white">
                    <option>Standard</option>
                    <option>Express</option>
                    <option>Same Day</option>
                </select>
            </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <button type="button" className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-600 font-medium hover:bg-gray-50">Batal</button>
            <button type="button" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2">
                <Save size={18}/> Buat Order
            </button>
        </div>
      </form>
    </div>
  );
}