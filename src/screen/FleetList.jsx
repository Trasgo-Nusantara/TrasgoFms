import React, { useState, useMemo } from 'react';
import { 
  Search, Plus, MoreVertical, X, Edit,
  Truck, User, MapPin, Fuel, 
  FileText, Wrench, AlertTriangle, CheckCircle, 
  History, Save, ArrowRight
} from 'lucide-react';

// --- MOCK DATA AWAL ---
const initialFleetData = [
  { 
    id: 'V-001', 
    plate: 'B 9281 KJA', 
    brand: 'Hino 500', 
    type: 'Wingbox', 
    year: 2021,
    driver: 'Budi Santoso', 
    status: 'Moving', 
    location: 'Tol Cipali KM 102', 
    fuel: 65, 
    odometer: 45200, 
    nextService: 50000,
    stnkExp: '2025-06-20',
    kirExp: '2024-12-30', 
    lastUpdate: '2 mins ago'
  },
  { 
    id: 'V-002', 
    plate: 'B 1123 ZZX', 
    brand: 'Daihatsu', 
    type: 'Grand Max', 
    year: 2022,
    driver: 'Agus Dermawan', 
    status: 'Idle', 
    location: 'Gudang Cikarang', 
    fuel: 30, 
    odometer: 28500, 
    nextService: 30000,
    stnkExp: '2026-01-15',
    kirExp: '2025-02-10',
    lastUpdate: '1 hour ago'
  },
  { 
    id: 'V-003', 
    plate: 'D 8822 UY', 
    brand: 'Fuso', 
    type: 'Canter', 
    year: 2019,
    driver: '-', 
    status: 'Maintenance', 
    location: 'Bengkel Astra', 
    fuel: 10, 
    odometer: 125000, 
    nextService: 120000,
    stnkExp: '2024-11-20',
    kirExp: '2025-05-15',
    lastUpdate: '1 day ago'
  },
];

// --- MOCK HISTORY LOG ---
const mockHistoryLog = [
  { id: 1, date: '2024-12-19 08:30', type: 'trip', title: 'Perjalanan Dimulai', desc: 'Berangkat dari Gudang Cakung', user: 'System' },
  { id: 2, date: '2024-12-18 14:00', type: 'service', title: 'Maintenance Rutin', desc: 'Ganti Oli & Filter Udara', user: 'Admin' },
  { id: 3, date: '2024-12-15 09:15', type: 'alert', title: 'Peringatan BBM', desc: 'Sisa bahan bakar di bawah 15%', user: 'Device' },
];

export default function FleetManagement() {
  // --- STATE ---
  const [vehicles, setVehicles] = useState(initialFleetData);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  
  // UI State
  const [selectedVehicle, setSelectedVehicle] = useState(null); 
  const [activeDetailTab, setActiveDetailTab] = useState('detail'); // 'detail' | 'history'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  // --- LOGIC FILTERING ---
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const matchesSearch = v.plate.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            v.driver.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'All' || v.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [vehicles, searchQuery, filterStatus]);

  // --- ACTIONS HANDLERS ---

  // 1. Buka Modal Tambah
  const handleAddClick = () => {
    setEditingVehicle(null);
    setIsModalOpen(true);
  };

  // 2. Buka Modal Edit
  const handleEditClick = (vehicle) => {
    setEditingVehicle(vehicle);
    setIsModalOpen(true);
  };

  // 3. Simpan Data (Add & Update Logic)
  const handleSaveVehicle = (formData) => {
    if (editingVehicle) {
      // UPDATE Existing
      setVehicles(prev => prev.map(item => 
        item.id === editingVehicle.id ? { ...item, ...formData } : item
      ));
      // Update tampilan detail jika sedang dibuka
      if (selectedVehicle && selectedVehicle.id === editingVehicle.id) {
        setSelectedVehicle({ ...selectedVehicle, ...formData });
      }
    } else {
      // ADD New
      const newVehicle = {
        id: `V-${Date.now()}`,
        ...formData,
        status: 'Idle',
        location: 'Pool Utama',
        fuel: 100,
        lastUpdate: 'Just now'
      };
      setVehicles(prev => [...prev, newVehicle]);
    }
    setIsModalOpen(false);
    setEditingVehicle(null);
  };

  // 4. Quick Update Status (Langsung dari Panel Detail)
  const handleStatusChange = (newStatus) => {
    setVehicles(prev => prev.map(v => 
        v.id === selectedVehicle.id ? { ...v, status: newStatus } : v
    ));
    setSelectedVehicle(prev => ({ ...prev, status: newStatus }));
  };

  // Helper Warna Badge Tabel
  const getStatusColor = (status) => {
    switch (status) {
      case 'Moving': return 'bg-green-100 text-green-700 border-green-200';
      case 'Idle': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Maintenance': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="flex h-full relative overflow-hidden bg-white">
      
      {/* --- KIRI: TABEL UTAMA --- */}
      <div className={`flex-1 flex flex-col h-full transition-all duration-300 ${selectedVehicle ? 'w-full lg:w-2/3 lg:pr-0 border-r border-gray-200' : 'w-full'}`}>
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Filter Status Tabs */}
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
                    <StatusFilterButton label="All" active={filterStatus === 'All'} onClick={() => setFilterStatus('All')} />
                    <StatusFilterButton label="Moving" active={filterStatus === 'Moving'} onClick={() => setFilterStatus('Moving')} color="text-green-600" />
                    <StatusFilterButton label="Maintenance" active={filterStatus === 'Maintenance'} onClick={() => setFilterStatus('Maintenance')} color="text-red-600" />
                </div>

                {/* Search & Add Button */}
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input 
                            type="text" placeholder="Cari Plat / Supir..." 
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition"
                            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={handleAddClick}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition whitespace-nowrap"
                    >
                        <Plus size={16} /> <span className="hidden sm:inline">Unit Baru</span>
                    </button>
                </div>
            </div>
        </div>

        {/* Tabel Data */}
        <div className="flex-1 overflow-auto bg-gray-50">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100 text-gray-500 text-xs uppercase font-bold sticky top-0 z-10 shadow-sm">
                    <tr>
                        <th className="p-4 border-b">Identitas Unit</th>
                        <th className="p-4 border-b">Status & Lokasi</th>
                        <th className="p-4 border-b hidden md:table-cell">Pengemudi</th>
                        <th className="p-4 border-b hidden lg:table-cell">Kesehatan</th>
                        <th className="p-4 border-b text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white text-sm">
                    {filteredVehicles.map((vehicle) => (
                        <tr 
                            key={vehicle.id} 
                            onClick={() => { setSelectedVehicle(vehicle); setActiveDetailTab('detail'); }}
                            className={`cursor-pointer transition hover:bg-indigo-50 ${selectedVehicle?.id === vehicle.id ? 'bg-indigo-50 ring-1 ring-inset ring-indigo-200' : ''}`}
                        >
                            <td className="p-4">
                                <div className="font-bold text-gray-900">{vehicle.plate}</div>
                                <div className="text-xs text-gray-500 mt-0.5">{vehicle.brand} • {vehicle.type}</div>
                            </td>
                            <td className="p-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border mb-1.5 ${getStatusColor(vehicle.status)}`}>
                                    {vehicle.status}
                                </span>
                                <div className="flex items-center gap-1 text-gray-500 text-xs truncate max-w-[150px]">
                                    <MapPin size={12} /> {vehicle.location}
                                </div>
                            </td>
                            <td className="p-4 hidden md:table-cell">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><User size={12}/></div>
                                    <span className={vehicle.driver === '-' ? 'text-gray-400 italic' : 'text-gray-700'}>{vehicle.driver}</span>
                                </div>
                            </td>
                            <td className="p-4 hidden lg:table-cell">
                                <div className="w-24">
                                    <div className="flex justify-between text-[10px] mb-1 text-gray-500">
                                        <span>BBM</span>
                                        <span>{vehicle.fuel}%</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div className={`h-full ${vehicle.fuel < 20 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${vehicle.fuel}%` }}></div>
                                    </div>
                                </div>
                            </td>
                            <td className="p-4 text-right">
                                <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                                    <MoreVertical size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      {/* --- KANAN: SLIDE-OVER DETAIL PANEL --- */}
      {selectedVehicle && (
        <div className="w-full lg:w-[400px] bg-white h-full overflow-y-auto flex flex-col absolute lg:relative z-20 shadow-2xl lg:shadow-none border-l border-gray-200 animate-in slide-in-from-right duration-300">
            
            {/* Header Detail */}
            <div className="p-6 border-b border-gray-100 bg-gray-50">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{selectedVehicle.plate}</h2>
                        <p className="text-sm text-gray-500">{selectedVehicle.brand} {selectedVehicle.type} ({selectedVehicle.year})</p>
                    </div>
                    <button onClick={() => setSelectedVehicle(null)} className="text-gray-400 hover:text-red-500 transition">
                        <X size={24} />
                    </button>
                </div>
                
                {/* Tabs Switcher */}
                <div className="flex p-1 bg-gray-200/60 rounded-lg">
                    <button 
                        onClick={() => setActiveDetailTab('detail')}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-wide rounded-md transition ${activeDetailTab === 'detail' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Informasi
                    </button>
                    <button 
                        onClick={() => setActiveDetailTab('history')}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-wide rounded-md transition flex items-center justify-center gap-2 ${activeDetailTab === 'history' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                         History
                    </button>
                </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 p-6 overflow-y-auto bg-white">
                {activeDetailTab === 'detail' ? (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        
                        {/* 1. Quick Action Status Update */}
                        <div className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
                            selectedVehicle.status === 'Moving' ? 'bg-green-50 border-green-200' :
                            selectedVehicle.status === 'Maintenance' ? 'bg-red-50 border-red-200' :
                            'bg-yellow-50 border-yellow-200'
                        }`}>
                            <div>
                                <label className="text-xs font-bold uppercase opacity-60 mb-1 block">Update Status</label>
                                <div className="relative">
                                    <select 
                                        value={selectedVehicle.status}
                                        onChange={(e) => handleStatusChange(e.target.value)}
                                        className={`appearance-none bg-transparent text-lg font-bold outline-none cursor-pointer pr-6 w-full ${
                                            selectedVehicle.status === 'Moving' ? 'text-green-800' :
                                            selectedVehicle.status === 'Maintenance' ? 'text-red-800' :
                                            'text-yellow-800'
                                        }`}
                                    >
                                        <option value="Idle">Idle</option>
                                        <option value="Moving">Moving</option>
                                        <option value="Maintenance">Maintenance</option>
                                        <option value="Stopped">Stopped</option>
                                    </select>
                                    {/* Icon Chevron */}
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                                        <ArrowRight size={14} className="rotate-90"/>
                                    </div>
                                </div>
                            </div>
                            <div className={`p-3 rounded-full shadow-sm bg-white/50`}>
                                {selectedVehicle.status === 'Moving' ? <Truck size={24} className="text-green-600"/> : 
                                 selectedVehicle.status === 'Maintenance' ? <Wrench size={24} className="text-red-600"/> : 
                                 <Truck size={24} className="text-yellow-600"/>}
                            </div>
                        </div>

                        {/* 2. Operational Info */}
                        <section className="space-y-3">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Operasional</h3>
                            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="bg-gray-100 p-2 rounded-lg text-gray-600"><User size={18} /></div>
                                    <div>
                                        <p className="text-xs text-gray-500">Pengemudi</p>
                                        <p className="font-medium text-gray-800">{selectedVehicle.driver}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="bg-gray-100 p-2 rounded-lg text-gray-600"><MapPin size={18} /></div>
                                    <div>
                                        <p className="text-xs text-gray-500">Lokasi</p>
                                        <p className="font-medium text-gray-800">{selectedVehicle.location}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 3. Maintenance Info */}
                        <section className="space-y-3">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Kesehatan Mesin</h3>
                            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                                    <div>
                                        <p className="text-xs text-gray-500">Odometer</p>
                                        <p className="text-xl font-mono font-bold text-gray-800">{selectedVehicle.odometer.toLocaleString()} <span className="text-sm font-normal text-gray-500">km</span></p>
                                    </div>
                                    <Wrench className="text-gray-300" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-500">Next Service</span>
                                        <span className="font-medium">{selectedVehicle.nextService.toLocaleString()} km</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full ${selectedVehicle.odometer > selectedVehicle.nextService ? 'bg-red-500' : 'bg-green-500'}`} 
                                            style={{width: `${Math.min((selectedVehicle.odometer / selectedVehicle.nextService * 100), 100)}%`}}
                                        ></div>
                                    </div>
                                    {selectedVehicle.odometer > selectedVehicle.nextService && (
                                        <p className="text-xs text-red-600 flex items-center gap-1 font-bold mt-1">
                                            <AlertTriangle size={12}/> Servis Diperlukan (Overdue)
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* 4. Legal Info */}
                        <section className="space-y-3">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Legalitas</h3>
                            <div className="space-y-3">
                                <DocItem label="Pajak STNK" expiry={selectedVehicle.stnkExp} />
                                <DocItem label="Uji KIR" expiry={selectedVehicle.kirExp} />
                            </div>
                        </section>
                    </div>
                ) : (
                    // History Tab View
                    <div className="animate-in slide-in-from-right-4 duration-300">
                        <div className="relative border-l-2 border-gray-200 ml-3 space-y-8 pb-8 mt-2">
                            {mockHistoryLog.map((log) => (
                                <div key={log.id} className="relative pl-6">
                                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                                        log.type === 'trip' ? 'bg-blue-500' :
                                        log.type === 'service' ? 'bg-orange-500' : 'bg-red-500'
                                    }`}></div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-400 font-mono mb-0.5">{log.date}</span>
                                        <h4 className="text-sm font-bold text-gray-800">{log.title}</h4>
                                        <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-2 rounded border border-gray-100">{log.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Action */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 mt-auto">
                <button 
                    onClick={() => handleEditClick(selectedVehicle)} 
                    className="w-full py-3 bg-white border border-indigo-200 text-indigo-700 font-bold rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition flex justify-center items-center gap-2 shadow-sm"
                >
                    <Edit size={18} /> Edit Data Kendaraan
                </button>
            </div>
        </div>
      )}

      {/* --- MODAL FORM (ADD / EDIT) --- */}
      {isModalOpen && (
        <VehicleFormModal 
            onClose={() => setIsModalOpen(false)} 
            onSave={handleSaveVehicle}
            initialData={editingVehicle}
        />
      )}

    </div>
  );
}

// --- SUB-KOMPONEN KECIL ---

function StatusFilterButton({ label, active, onClick, color = 'text-gray-600' }) {
    return (
        <button 
            onClick={onClick}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition border ${
                active 
                ? 'bg-gray-800 text-white border-gray-800' 
                : `bg-white border-gray-300 hover:bg-gray-50 ${color}`
            }`}
        >
            {label}
        </button>
    )
}

function DocItem({ label, expiry }) {
    const isExpired = new Date(expiry) < new Date();
    return (
        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white">
            <div className="flex items-center gap-3">
                <FileText className="text-gray-400" size={18} />
                <div>
                    <p className="text-sm font-medium text-gray-700">{label}</p>
                    <p className="text-xs text-gray-500">Exp: {expiry}</p>
                </div>
            </div>
            {isExpired ? (
                <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded">Expired</span>
            ) : (
                <CheckCircle size={18} className="text-green-500" />
            )}
        </div>
    )
}

function VehicleFormModal({ onClose, onSave, initialData }) {
    // Jika Edit, isi form dengan data lama. Jika Add, kosongkan.
    const [form, setForm] = useState(initialData || {
        plate: '', brand: '', type: '', year: '', odometer: '', stnkExp: '', kirExp: '', driver: ''
    });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        {initialData ? <Edit size={18}/> : <Truck size={18}/>} 
                        {initialData ? 'Edit Data Kendaraan' : 'Tambah Unit Baru'}
                    </h3>
                    <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-red-500"/></button>
                </div>
                
                <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Plat Nomor</label>
                            <input name="plate" value={form.plate} onChange={handleChange} required className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Merk</label>
                            <input name="brand" value={form.brand} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg outline-none" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Tipe</label>
                            <input name="type" value={form.type} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg outline-none" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Tahun</label>
                            <input name="year" type="number" value={form.year} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg outline-none" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Odometer (km)</label>
                            <input name="odometer" type="number" value={form.odometer} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg outline-none" />
                        </div>
                        <div className="col-span-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Nama Pengemudi</label>
                            <input name="driver" value={form.driver} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg outline-none" />
                        </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                        <h4 className="text-sm font-bold text-gray-800 mb-3">Masa Berlaku Dokumen</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Exp. STNK</label>
                                <input name="stnkExp" type="date" value={form.stnkExp} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg outline-none" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Exp. KIR</label>
                                <input name="kirExp" type="date" value={form.kirExp} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg outline-none" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-2 border rounded-lg text-gray-600 hover:bg-gray-50">Batal</button>
                        <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold flex justify-center gap-2">
                            <Save size={18}/> {initialData ? 'Simpan Perubahan' : 'Simpan Unit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}