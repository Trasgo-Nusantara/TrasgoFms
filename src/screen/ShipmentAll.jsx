import React, { useState } from 'react';
import { 
  Package, Search, Plus, Filter, MoreVertical, 
  Edit, Trash2, X, Save, ArrowRight, Truck, User, Calendar 
} from 'lucide-react';

// --- MOCK DATA AWAL ---
const initialShipments = [
  { id: 'SHP-001', customer: 'PT Sumber Makmur', origin: 'Jakarta', dest: 'Surabaya', status: 'In Transit', eta: '2024-12-20', weight: '450 kg', type: 'General', driver: 'Budi S.' },
  { id: 'SHP-002', customer: 'CV Maju Jaya', origin: 'Bekasi', dest: 'Bandung', status: 'Delivered', eta: '2024-12-18', weight: '120 kg', type: 'Fragile', driver: 'Agus D.' },
  { id: 'SHP-003', customer: 'Toko Elektronik 88', origin: 'Cikarang', dest: 'Semarang', status: 'Delayed', eta: '2024-12-19', weight: '800 kg', type: 'Electronics', driver: 'Siti A.' },
  { id: 'SHP-004', customer: 'Gudang Garam', origin: 'Kediri', dest: 'Jakarta', status: 'Pending', eta: '2024-12-21', weight: '2.5 ton', type: 'Material', driver: '-' },
];

export default function ShipmentAll() {
  // State Data
  const [shipments, setShipments] = useState(initialShipments);
  
  // State UI
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // --- LOGIC CRUD ---

  // 1. Filter & Search
  const filteredData = shipments.filter(item => {
    const matchSearch = item.id.toLowerCase().includes(search.toLowerCase()) || 
                        item.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // 2. Delete
  const handleDelete = (id) => {
    if(window.confirm('Hapus data pengiriman ini?')) {
      setShipments(shipments.filter(s => s.id !== id));
    }
  };

  // 3. Open Modal (Add / Edit)
  const openModal = (item = null) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  // 4. Save Data (Add / Update)
  const handleSave = (formData) => {
    if (editingItem) {
      // Logic Update
      setShipments(prev => prev.map(item => item.id === editingItem.id ? { ...formData, id: item.id } : item));
    } else {
      // Logic Add New
      const newItem = {
        ...formData,
        id: `SHP-${Math.floor(Math.random() * 1000)}`, // Generate ID Random
      };
      setShipments([...shipments, newItem]);
    }
    setIsModalOpen(false);
  };

  // Helper Warna Status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'In Transit': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Delayed': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
        
      {/* --- HEADER & TOOLBAR --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold text-gray-800">Semua Pengiriman</h2>
            <p className="text-sm text-gray-500">Kelola order, update status perjalanan, dan manifest.</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => openModal()} // Mode Add
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition"
            >
                <Plus size={18}/> Order Baru
            </button>
        </div>
      </div>

      {/* --- FILTERS --- */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Tab Filters */}
        <div className="flex bg-gray-100 p-1 rounded-lg overflow-x-auto w-full md:w-auto">
            {['All', 'Pending', 'In Transit', 'Delayed', 'Delivered'].map(status => (
                <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-1.5 text-xs font-bold rounded-md transition whitespace-nowrap ${
                        filterStatus === status ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    {status}
                </button>
            ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16}/>
            <input 
                type="text" 
                placeholder="Cari Resi / Customer..." 
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                    <tr>
                        <th className="p-4">ID & Pelanggan</th>
                        <th className="p-4">Rute Perjalanan</th>
                        <th className="p-4">Detail Muatan</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">ETA & Supir</th>
                        <th className="p-4 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {filteredData.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition group">
                            
                            {/* Kolom 1: ID & Customer */}
                            <td className="p-4 align-top">
                                <span className="font-mono font-bold text-blue-600 block mb-1">{item.id}</span>
                                <span className="font-medium text-gray-800">{item.customer}</span>
                            </td>

                            {/* Kolom 2: Rute */}
                            <td className="p-4 align-top">
                                <div className="flex items-center gap-2 text-gray-600 mb-1">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span>{item.origin}</span>
                                </div>
                                <div className="border-l border-dashed border-gray-300 ml-1 h-3 my-0.5"></div>
                                <div className="flex items-center gap-2 text-gray-800 font-medium">
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                    <span>{item.dest}</span>
                                </div>
                            </td>

                            {/* Kolom 3: Detail */}
                            <td className="p-4 align-top text-gray-600">
                                <div className="flex items-center gap-2 mb-1">
                                    <Package size={14} className="text-gray-400"/> {item.type}
                                </div>
                                <div className="text-xs bg-gray-100 px-2 py-1 rounded w-fit font-mono">
                                    {item.weight}
                                </div>
                            </td>

                            {/* Kolom 4: Status */}
                            <td className="p-4 align-top">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(item.status)}`}>
                                    {item.status}
                                </span>
                            </td>

                            {/* Kolom 5: ETA & Driver */}
                            <td className="p-4 align-top">
                                <div className="flex items-center gap-2 text-gray-600 mb-1">
                                    <Calendar size={14}/> <span className="text-xs">{item.eta}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-800 font-medium text-xs">
                                    <User size={14} className="text-gray-400"/> 
                                    {item.driver !== '-' ? item.driver : <span className="text-red-400 italic">Belum assign</span>}
                                </div>
                            </td>

                            {/* Kolom 6: Aksi */}
                            <td className="p-4 align-top text-right">
                                <div className="flex justify-end gap-2">
                                    <button 
                                        onClick={() => openModal(item)}
                                        className="p-2 border rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition" 
                                        title="Edit / Update Status"
                                    >
                                        <Edit size={16}/>
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(item.id)}
                                        className="p-2 border rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition" 
                                        title="Hapus"
                                    >
                                        <Trash2 size={16}/>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {filteredData.length === 0 && (
                        <tr><td colSpan="6" className="p-8 text-center text-gray-400">Data tidak ditemukan.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* --- MODAL FORM (ADD / EDIT) --- */}
      {isModalOpen && (
        <ShipmentFormModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
            initialData={editingItem}
        />
      )}

    </div>
  );
}

// --- SUB-KOMPONEN: MODAL FORM ---
function ShipmentFormModal({ onClose, onSave, initialData }) {
    // State form
    const [form, setForm] = useState(initialData || {
        customer: '', origin: '', dest: '', status: 'Pending', 
        eta: '', weight: '', type: 'General', driver: ''
    });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        {initialData ? <Edit size={18}/> : <Plus size={18}/>} 
                        {initialData ? 'Update Pengiriman' : 'Buat Order Baru'}
                    </h3>
                    <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-red-500"/></button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    
                    {/* Status Update (Jika Edit) */}
                    {initialData && (
                        <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg mb-4">
                            <label className="text-xs font-bold text-blue-700 uppercase mb-1 block">Update Status</label>
                            <select 
                                name="status" 
                                value={form.status} 
                                onChange={handleChange} 
                                className="w-full p-2 border border-blue-200 rounded bg-white text-sm font-bold text-gray-700"
                            >
                                <option value="Pending">Pending</option>
                                <option value="In Transit">In Transit (Jalan)</option>
                                <option value="Delayed">Delayed (Terlambat)</option>
                                <option value="Delivered">Delivered (Selesai)</option>
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Pelanggan</label>
                        <input name="customer" value={form.customer} onChange={handleChange} required className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Nama PT / Customer" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Asal (Origin)</label>
                            <input name="origin" value={form.origin} onChange={handleChange} required className="w-full mt-1 p-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Tujuan (Dest)</label>
                            <input name="dest" value={form.dest} onChange={handleChange} required className="w-full mt-1 p-2 border rounded-lg" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Jenis Barang</label>
                            <select name="type" value={form.type} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg bg-white">
                                <option>General</option>
                                <option>Fragile</option>
                                <option>Electronics</option>
                                <option>Material</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Berat</label>
                            <input name="weight" value={form.weight} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg" placeholder="Contoh: 500 kg" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Estimasi Tiba (ETA)</label>
                            <input name="eta" type="date" value={form.eta} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Driver Assigned</label>
                            <input name="driver" value={form.driver} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg" placeholder="Nama Supir" />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3 border-t border-gray-100 mt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-2 border rounded-lg text-gray-600 hover:bg-gray-50">Batal</button>
                        <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold flex justify-center gap-2">
                            <Save size={18}/> Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}