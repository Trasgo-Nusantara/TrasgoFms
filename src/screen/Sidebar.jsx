import React from 'react';
import { 
  LayoutDashboard, Truck, Users, Settings, LogOut,
  Map, Activity, Droplet, Database, Scan, 
  Package, Radio, PlusCircle, Search, AlertCircle, List, 
  Car
} from 'lucide-react';

const MENU_GROUPS = [
  {
    label: 'Main Menu',
    items: [
      { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    ]
  },
  {
    label: 'Fleet Management',
    items: [
      { id: 'fleet', label: 'Armada (Fleet)', icon: Truck },
      { id: 'drivers', label: 'Pengemudi', icon: Users },
      { id: 'trips', label: 'Trips History', icon: Map },
      { id: 'telemetry', label: 'Telemetry', icon: Activity },
      { id: 'fuel', label: 'Fuel & Cost', icon: Droplet },
      { id: 'geofencing', label: 'Geofencing', icon: Scan },
    ]
  },
  {
    label: 'Shipment Ops',
    items: [
      { id: 'shipment_live', label: 'Live Shipment', icon: Radio },
      { id: 'shipment_all', label: 'All Shipments', icon: List },
      { id: 'shipment_track', label: 'Track Shipment', icon: Search },
      { id: 'shipment_create', label: 'Create Shipment', icon: PlusCircle },
      { id: 'shipment_delayed', label: 'Delayed Shipment', icon: AlertCircle },
    ]
  },
  {
    label: 'System',
    items: [
      { id: 'lakehouse', label: 'Lakehouse Sync', icon: Database },
      { id: 'settings', label: 'Pengaturan', icon: Settings },
    ]
  }
];

export default function Sidebar({ activeTab, setActiveTab, onLogout }) {
  return (
    <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col h-full shadow-xl flex-shrink-0 font-sans border-r border-slate-800 z-50">
      
      {/* HEADER LOGO */}
      <div className="p-6 flex items-center space-x-3 font-bold text-xl border-b border-slate-800 bg-slate-900 sticky top-0">
        <div className="p-2 bg-blue-600 rounded-lg shadow-lg">
          <Car className="text-white" size={24} />
        </div>
        <span className="tracking-wide text-gray-100">Trasgo FMS</span>
      </div>
      
      {/* MENU LIST */}
      {/* Perubahan ada di className nav di bawah ini: scrollbar disembunyikan */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {MENU_GROUPS.map((group, groupIndex) => (
          <div key={groupIndex}>
            
            {/* LABEL GROUP */}
            <h3 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-3 px-3 select-none">
              {group.label}
            </h3>
            
            {/* ITEMS */}
            <div className="space-y-1">
              {group.items.map((item) => (
                <button 
                  key={item.id}
                  type="button"
                  onClick={() => {
                    console.log("Klik Menu:", item.id);
                    if (setActiveTab) setActiveTab(item.id);
                  }}
                  className={`flex items-center space-x-3 w-full p-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden text-left ${
                    activeTab === item.id 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-gray-100'
                  }`}
                >
                  {/* Indikator Aktif */}
                  {activeTab === item.id && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-white/30 rounded-r"></div>
                  )}

                  <item.icon 
                    size={18} 
                    className={`flex-shrink-0 ${activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} 
                  />
                  <span className="font-medium text-sm truncate pointer-events-none">{item.label}</span>
                  
                  {item.id === 'shipment_delayed' && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* FOOTER LOGOUT */}
      <div className="p-4 border-t border-slate-800 bg-slate-900">
        <button 
          onClick={onLogout}
          className="flex items-center space-x-3 text-slate-400 hover:text-red-400 w-full p-3 rounded-lg transition group"
        >
          <LogOut size={20} className="group-hover:stroke-red-400" />
          <span className="font-medium text-sm">Keluar System</span>
        </button>
      </div>
    </aside>
  );
}