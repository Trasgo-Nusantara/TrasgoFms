import React from 'react';
import { AlertCircle, ArrowRight, Clock } from 'lucide-react';

const delayedShipments = [
  { id: 'SHP-003', customer: 'Toko Elektronik 88', origin: 'Cikarang', dest: 'Semarang', status: 'Delayed', eta: '19 Des', reason: 'Macet Pantura' },
  { id: 'SHP-007', customer: 'CV Berkah', origin: 'Bandung', dest: 'Jogja', status: 'Delayed', eta: '18 Des', reason: 'Vehicle Breakdown' },
];

export default function ShipmentDelayed() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden">
        <div className="p-5 border-b border-red-100 bg-red-50/50 flex justify-between items-center">
            <h3 className="font-bold text-red-700 flex items-center gap-2">
                <AlertCircle className="text-red-600"/> Pengiriman Terlambat (Delayed)
            </h3>
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                {delayedShipments.length} Kasus
            </span>
        </div>
        <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
                <tr>
                    <th className="p-4">ID Resi</th>
                    <th className="p-4">Pelanggan</th>
                    <th className="p-4">Rute</th>
                    <th className="p-4">Alasan Delay</th>
                    <th className="p-4">Estimasi Baru</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {delayedShipments.map((item) => (
                    <tr key={item.id} className="hover:bg-red-50/30 transition">
                        <td className="p-4 font-bold text-gray-800">{item.id}</td>
                        <td className="p-4 text-gray-600">{item.customer}</td>
                        <td className="p-4 text-gray-500">
                            {item.origin} <ArrowRight size={12} className="inline mx-1"/> {item.dest}
                        </td>
                        <td className="p-4">
                            <span className="flex items-center gap-1 text-red-600 font-medium bg-red-50 px-2 py-1 rounded w-fit text-xs">
                                <AlertCircle size={12}/> {item.reason}
                            </span>
                        </td>
                        <td className="p-4 text-gray-500 flex items-center gap-1">
                            <Clock size={14}/> {item.eta}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );
}