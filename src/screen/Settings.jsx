import React from 'react';
import { Save } from 'lucide-react';

export default function Settings() {
  return (
    <div className="max-w-2xl bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Pengaturan Sistem</h2>
      
      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nama Perusahaan</label>
          <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" defaultValue="Logistik Express" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Notifikasi</label>
          <input type="email" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" defaultValue="admin@logistik.com" />
        </div>

        <div className="flex items-center gap-3">
            <input type="checkbox" id="alerts" className="w-5 h-5 text-blue-600" defaultChecked />
            <label htmlFor="alerts" className="text-gray-700">Aktifkan Peringatan Servis Otomatis</label>
        </div>

        <div className="pt-4 border-t border-gray-100">
            <button type="button" className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                <Save size={18} /> Simpan Perubahan
            </button>
        </div>
      </form>
    </div>
  );
}