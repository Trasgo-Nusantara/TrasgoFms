import React, { useState } from 'react';
import { 
  Phone, Star, Plus, Search, MapPin, 
  CreditCard, Edit, Trash2, X, User, CheckCircle, Save
} from 'lucide-react';

// --- MOCK DATA AWAL ---
const initialDrivers = [
  { 
    id: 1, 
    name: 'Budi Santoso', 
    phone: '0812-3456-7890', 
    sim: 'B2 Umum', 
    exp: 5, 
    rating: 4.8, 
    status: 'On Duty', 
    location: 'Jakarta Utara' 
  },
  { 
    id: 2, 
    name: 'Siti Aminah', 
    phone: '0813-9876-5432', 
    sim: 'B1 Polos', 
    exp: 3, 
    rating: 4.9, 
    status: 'Off Duty', 
    location: '-' 
  },
  { 
    id: 3, 
    name: 'Agus Dermawan', 
    phone: '0815-1122-3344', 
    sim: 'B2 Umum', 
    exp: 8, 
    rating: 4.5, 
    status: 'On Duty', 
    location: 'Cikarang' 
  },
];

export default function Drivers() {
  const [drivers, setDrivers] = useState(initialDrivers);
  const [search, setSearch] = useState('');
  
  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);

  // --- LOGIC CRUD ---

  // 1. Filter Data
  const filteredDrivers = drivers.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.sim.toLowerCase().includes(search.toLowerCase())
  );

  // 2. Buka Modal Tambah
  const handleAddClick = () => {
    setEditingDriver(null);
    setIsModalOpen(true);
  };

  // 3. Buka Modal Edit
  const handleEditClick = (driver) => {
    setEditingDriver(driver);
    setIsModalOpen(true);
  };

  // 4. Hapus Driver
  const handleDeleteClick = (id) => {
    if (window.confirm('Yakin ingin menghapus data pengemudi ini?')) {
      setDrivers(drivers.filter(d => d.id !== id));
    }
  };

  // 5. Simpan Data (Add / Update)
  const handleSave = (formData) => {
    if (editingDriver) {
      // Logic Update
      setDrivers(prev => prev.map(d => d.id === editingDriver.id ? { ...d, ...formData } : d));
    } else {
      // Logic Add
      const newDriver = {
        id: Date.now(),
        ...formData,
        rating: 5.0, // Default rating untuk supir baru
        location: formData.status === 'On Duty' ? 'Pool Utama' : '-'
      };
      setDrivers([...drivers, newDriver]);
    }
    setIsModalOpen(false);
  };

  // Hitung Statistik
  const totalDrivers = drivers.length;
  const activeDrivers = drivers.filter(d => d.status === 'On Duty').length;

  return (
    <div className="space-y-6 h-full flex flex-col">
      
      {/* --- HEADER & STATS --- */}
      <div>
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Data Pengemudi</h2>
                <p className="text-sm text-gray-500">Kelola profil, lisensi, dan status pengemudi.</p>
            </div>
            
            <div className="flex gap-4">
                <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm text-center">
                    <p className="text-xs text-gray-500 uppercase font-bold">Total</p>
                    <p className="text-xl font-bold text-gray-800">{totalDrivers}</p>
                </div>
                <div className="bg-green-50 border border-green-100 px-4 py-2 rounded-lg shadow-sm text-center">
                    <p className="text-xs text-green-600 uppercase font-bold">Aktif</p>
                    <p className="text-xl font-bold text-green-700">{activeDrivers}</p>
                </div>
            </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
             <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Cari nama atau SIM..." 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <button 
                onClick={handleAddClick}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
            >
                <Plus size={18} /> Tambah Pengemudi
            </button>
        </div>
      </div>

      {/* --- GRID CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDrivers.map((driver) => (
          <div key={driver.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition group">
            
            {/* Card Header & Status */}
            <div className="p-6 flex flex-col items-center text-center relative">
                {/* Status Badge Absolute */}
                <span className={`absolute top-4 right-4 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                    driver.status === 'On Duty' 
                    ? 'bg-green-100 text-green-700 border-green-200' 
                    : 'bg-gray-100 text-gray-500 border-gray-200'
                }`}>
                    {driver.status}
                </span>

                {/* Avatar */}
                <div className="w-20 h-20 bg-gray-100 rounded-full mb-3 p-1 border-2 border-white shadow-sm">
                    <img 
                        src={`https://ui-avatars.com/api/?name=${driver.name}&background=random&size=128`} 
                        alt={driver.name} 
                        className="rounded-full w-full h-full object-cover"
                    />
                </div>
                
                <h3 className="font-bold text-lg text-gray-800">{driver.name}</h3>
                <p className="text-xs text-gray-400 font-mono mb-3">{driver.phone}</p>
                
                {/* Rating Badge */}
                <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">
                    <Star size={12} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-bold text-yellow-700">{driver.rating}</span>
                </div>
            </div>

            {/* Info Details */}
            <div className="px-6 py-4 bg-gray-50/50 border-t border-b border-gray-100 space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-500 flex items-center gap-2"><CreditCard size={14}/> SIM</span>
                    <span className="font-medium text-gray-700">{driver.sim}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500 flex items-center gap-2"><CheckCircle size={14}/> Pengalaman</span>
                    <span className="font-medium text-gray-700">{driver.exp} Tahun</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500 flex items-center gap-2"><MapPin size={14}/> Posisi</span>
                    <span className="font-medium text-gray-700 truncate max-w-[120px]">{driver.location}</span>
                </div>
            </div>

            {/* Actions */}
            <div className="p-4 flex gap-2">
                <button 
                    onClick={() => handleEditClick(driver)}
                    className="flex-1 flex items-center justify-center gap-2 border border-gray-200 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition"
                >
                    <Edit size={14} /> Edit
                </button>
                <button 
                    onClick={() => handleDeleteClick(driver.id)}
                    className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            {/* Contact Button Full Width */}
            <a href={`tel:${driver.phone}`} className="block w-full bg-blue-50 text-blue-600 text-center py-3 text-sm font-bold hover:bg-blue-100 transition">
               <span className="flex items-center justify-center gap-2"><Phone size={16}/> Hubungi</span>
            </a>

          </div>
        ))}
      </div>

      {/* --- MODAL FORM --- */}
      {isModalOpen && (
        <DriverFormModal 
            onClose={() => setIsModalOpen(false)} 
            onSave={handleSave}
            initialData={editingDriver}
        />
      )}

    </div>
  );
}

// --- SUB-COMPONENT: MODAL FORM ---
function DriverFormModal({ onClose, onSave, initialData }) {
    const [form, setForm] = useState(initialData || {
        name: '', phone: '', sim: 'B1 Polos', exp: '', status: 'Off Duty'
    });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        {initialData ? <Edit size={18}/> : <Plus size={18}/>} 
                        {initialData ? 'Edit Data Pengemudi' : 'Tambah Pengemudi Baru'}
                    </h3>
                    <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-red-500"/></button>
                </div>
                
                <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="p-6 space-y-4">
                    
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Nama Lengkap</label>
                        <div className="relative mt-1">
                            <User size={16} className="absolute left-3 top-3 text-gray-400"/>
                            <input 
                                name="name" 
                                value={form.name} 
                                onChange={handleChange} 
                                required 
                                className="w-full pl-9 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                                placeholder="Nama Supir"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Nomor Telepon</label>
                        <div className="relative mt-1">
                            <Phone size={16} className="absolute left-3 top-3 text-gray-400"/>
                            <input 
                                name="phone" 
                                value={form.phone} 
                                onChange={handleChange} 
                                required 
                                className="w-full pl-9 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                                placeholder="0812-xxxx-xxxx"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Jenis SIM</label>
                            <select 
                                name="sim" 
                                value={form.sim} 
                                onChange={handleChange} 
                                className="w-full mt-1 p-2 border rounded-lg outline-none bg-white"
                            >
                                <option>A</option>
                                <option>B1 Polos</option>
                                <option>B1 Umum</option>
                                <option>B2 Polos</option>
                                <option>B2 Umum</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Pengalaman (Thn)</label>
                            <input 
                                name="exp" 
                                type="number"
                                value={form.exp} 
                                onChange={handleChange} 
                                required 
                                className="w-full mt-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Status Kerja</label>
                        <select 
                            name="status" 
                            value={form.status} 
                            onChange={handleChange} 
                            className="w-full mt-1 p-2 border rounded-lg outline-none bg-white"
                        >
                            <option value="Off Duty">Off Duty (Libur)</option>
                            <option value="On Duty">On Duty (Bekerja)</option>
                            <option value="Sick">Sick (Sakit)</option>
                        </select>
                    </div>

                    <div className="pt-4 flex gap-3">
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