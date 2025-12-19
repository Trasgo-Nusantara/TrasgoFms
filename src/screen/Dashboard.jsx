import React, { useState } from 'react';
import Sidebar from './Sidebar';

// Import Halaman
import Overview from './Overview';
import FleetManagement from './FleetList';
import Trips from './Trips';
import Telemetry from './Telemetry';
import Fuel from './Fuel';
import Drivers from './Drivers';
import Geofencing from './Geofencing';
import LakehouseSync from './LakehouseSync';
import Settings from './Settings';
import Shipments from './Shipments';
import ShipmentLive from './ShipmentLive';
import ShipmentAll from './ShipmentAll';
import ShipmentTrack from './ShipmentTrack';
import ShipmentCreate from './ShipmentCreate';
import ShipmentDelayed from './ShipmentDelayed';

export default function Dashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');

  // Logic Render Halaman
  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <Overview />;
      case 'fleet': return <FleetManagement />;
      case 'drivers': return <Drivers />;
      case 'trips': return <Trips />;
      case 'telemetry': return <Telemetry />;
      case 'fuel': return <Fuel />;
      case 'geofencing': return <Geofencing />;
      
      // Shipment Group
      case 'shipment_live': return <ShipmentLive />;
      case 'shipment_all': return <ShipmentAll />;
      case 'shipment_track': return <ShipmentTrack />;
      case 'shipment_create': return <ShipmentCreate />;
      case 'shipment_delayed': return <ShipmentDelayed />;

      case 'lakehouse': return <LakehouseSync />;
      case 'settings': return <Settings />;
      default: return <Overview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* --- SIDEBAR DIPANGGIL DI SINI --- */}
      {/* Pastikan activeTab dan setActiveTab dikirim! */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={onLogout} 
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center shadow-sm z-10 shrink-0">
          <h1 className="text-xl font-bold text-gray-800 capitalize">
             {activeTab.replace(/_/g, ' ').toUpperCase()}
          </h1>
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">A</div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}