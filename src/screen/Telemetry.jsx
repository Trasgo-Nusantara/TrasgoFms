import React, { useState, useEffect } from 'react';
import { 
  Activity, Thermometer, Zap, Gauge, 
  Database, RefreshCw, Truck, Car, AlertTriangle
} from 'lucide-react';

// 1. DATA KENDARAAN (Static)
const vehiclesList = [
  { id: 'V-001', name: 'Truck A-001', type: 'Hino 500', category: 'Heavy' },
  { id: 'V-002', name: 'Van B-023', type: 'Daihatsu GranMax', category: 'Light' },
  { id: 'V-003', name: 'Pickup C-112', type: 'Mitsubishi L300', category: 'Medium' },
];

export default function Telemetry() {
  // 2. STATE KENDARAAN YANG DIPILIH
  const [selectedId, setSelectedId] = useState(vehiclesList[0].id);
  const [isConnecting, setIsConnecting] = useState(false);

  // Cari object kendaraan aktif berdasarkan ID
  const activeVehicle = vehiclesList.find(v => v.id === selectedId);

  // State Data Sensor
  const [data, setData] = useState({
    rpm: 0, speed: 0, temp: 0, battery: 0, load: 0
  });

  // State Grafik History
  const [history, setHistory] = useState(new Array(20).fill(50));

  // State Log
  const [logs, setLogs] = useState([]);

  // --- LOGIC GANTI KENDARAAN ---
  const handleVehicleChange = (e) => {
    const newId = e.target.value;
    setIsConnecting(true); // Efek loading "Connecting..."
    setSelectedId(newId);
    setLogs([]); // Reset log saat ganti mobil
    
    // Simulasi delay koneksi 1 detik
    setTimeout(() => {
        setIsConnecting(false);
        addLog('INFO', `Connection established with ECU: ${newId}`);
    }, 800);
  };

  const addLog = (type, msg) => {
    const time = new Date().toLocaleTimeString('id-ID', { hour12: false });
    setLogs(prev => [{ time, type, msg }, ...prev.slice(0, 6)]); // Simpan 7 log terakhir
  };

  // --- SIMULASI DATA REAL-TIME ---
  useEffect(() => {
    if (isConnecting) return; // Jangan update jika sedang connecting

    const interval = setInterval(() => {
      // 3. LOGIKA ANGKA BERBEDA TIAP TIPE KENDARAAN
      let baseRpm, baseSpeed, baseTemp;

      if (activeVehicle.category === 'Heavy') { // Truk Besar
        baseRpm = 1500;  // RPM Rendah
        baseSpeed = 60;  // Kecepatan Rendah
        baseTemp = 90;   // Mesin Panas
      } else if (activeVehicle.category === 'Light') { // Van Kecil
        baseRpm = 2500;  // RPM Tinggi
        baseSpeed = 90;  // Lebih Cepat
        baseTemp = 85;   // Lebih Dingin
      } else { // Pickup
        baseRpm = 2000;
        baseSpeed = 75;
        baseTemp = 88;
      }

      // Randomizer agar terlihat hidup
      const currentRpm = baseRpm + Math.floor(Math.random() * 300) - 150;
      const currentSpeed = baseSpeed + Math.floor(Math.random() * 10) - 5;
      const currentTemp = baseTemp + Math.floor(Math.random() * 4) - 2;
      const load = Math.floor((currentRpm / (baseRpm + 500)) * 100);

      setData({
        rpm: currentRpm,
        speed: currentSpeed,
        temp: currentTemp,
        battery: activeVehicle.category === 'Heavy' ? 24.2 : 12.4, // Truk 24V, Mobil 12V
        load: load
      });

      // Update Grafik
      setHistory(prev => [...prev.slice(1), load]);

      // Simulasi Random Log Event (Jarang terjadi)
      if (Math.random() > 0.95) {
        addLog('WARN', `Minor fluctuation detected in cylinder ${Math.floor(Math.random()*4)+1}`);
      }

    }, 2000); // Update tiap 2 detik

    return () => clearInterval(interval);
  }, [selectedId, isConnecting, activeVehicle]);

  return (
    <div className="space-y-6 h-full flex flex-col">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Activity className="text-indigo-600"/> Live Telemetry
            </h2>
            <div className="flex items-center gap-2 mt-1">
                <span className={`w-2 h-2 rounded-full ${isConnecting ? 'bg-yellow-500 animate-bounce' : 'bg-green-500 animate-pulse'}`}></span>
                <p className="text-sm text-gray-500">
                    {isConnecting ? 'Establishing Link...' : `Connected: ${activeVehicle.name}`}
                </p>
            </div>
        </div>
        
        {/* DROPDOWN PEMILIH KENDARAAN */}
        <div className="flex gap-3 items-center w-full md:w-auto">
             <div className="relative w-full md:w-64">
                <div className="absolute left-3 top-2.5 text-gray-500 pointer-events-none">
                    {activeVehicle.category === 'Heavy' ? <Truck size={18}/> : <Car size={18}/>}
                </div>
                <select 
                    value={selectedId}
                    onChange={handleVehicleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer bg-gray-50 hover:bg-white transition"
                >
                    {vehiclesList.map(v => (
                        <option key={v.id} value={v.id}>{v.name} ({v.type})</option>
                    ))}
                </select>
                {/* Custom Arrow */}
                <div className="absolute right-3 top-3 pointer-events-none">
                    <RefreshCw size={14} className="text-gray-400"/>
                </div>
             </div>
        </div>
      </div>

      {/* --- SENSOR CARDS --- */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 transition-opacity duration-300 ${isConnecting ? 'opacity-50' : 'opacity-100'}`}>
        <SensorCard 
            title="Engine Speed" value={data.rpm} unit="RPM" icon={<Activity size={20}/>} color="blue" 
            percent={(data.rpm / 4000) * 100} 
        />
        <SensorCard 
            title="Vehicle Speed" value={data.speed} unit="km/h" icon={<Gauge size={20}/>} color="green" 
            percent={(data.speed / 140) * 100} 
        />
        <SensorCard 
            title="Coolant Temp" value={data.temp} unit="°C" icon={<Thermometer size={20}/>} 
            color={data.temp > 95 ? 'red' : 'orange'} 
            percent={(data.temp / 120) * 100}
        />
        <SensorCard 
            title="Battery Voltage" value={data.battery} unit="V" icon={<Zap size={20}/>} color="yellow" 
            percent={activeVehicle.category === 'Heavy' ? (data.battery/28)*100 : (data.battery/14)*100} 
        />
      </div>

      {/* --- TENGAH: GRAFIK & DIAGNOSTIK --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Grafik Engine Load */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-700">Engine Load History</h3>
                <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-mono">
                    {activeVehicle.type}
                </span>
            </div>
            
            <div className="flex-1 flex items-end justify-between gap-1 h-40 pt-4 border-b border-gray-100 pb-2">
                {history.map((h, i) => (
                    <div key={i} className="w-full bg-slate-100 rounded-t-sm relative group">
                        <div 
                            className={`absolute bottom-0 left-0 right-0 rounded-t-sm transition-all duration-500 ${isConnecting ? 'bg-gray-300' : 'bg-indigo-500'}`}
                            style={{ height: `${h}%` }}
                        ></div>
                    </div>
                ))}
            </div>
        </div>

        {/* Kesehatan Komponen (Data Dinamis Dummy) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-700 mb-4">Diagnostic Health</h3>
            <div className="space-y-5">
                {/* Nilai kesehatan berubah tergantung kendaraan yg dipilih untuk demo */}
                <HealthItem label="Kualitas Oli" percent={selectedId === 'V-001' ? 78 : selectedId === 'V-002' ? 95 : 60} color="bg-emerald-500" />
                <HealthItem label="Tekanan Ban" percent={selectedId === 'V-001' ? 92 : 88} color="bg-blue-500" />
                <HealthItem label="Kampas Rem" percent={selectedId === 'V-003' ? 45 : 80} color="bg-yellow-500" />
                <HealthItem label="Filter Udara" percent={selectedId === 'V-003' ? 15 : 90} color="bg-red-500" warning={selectedId === 'V-003' ? "Ganti Segera" : null} />
            </div>
        </div>
      </div>

      {/* --- LOG SYSTEM --- */}
      <div className="bg-slate-900 rounded-xl overflow-hidden shadow-lg flex-1 flex flex-col min-h-[200px]">
        <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex justify-between items-center">
            <div className="flex items-center gap-2 text-gray-300 text-sm font-mono">
                <Database size={14}/> Live ECU Logs: <span className="text-white font-bold">{selectedId}</span>
            </div>
        </div>
        <div className="p-4 font-mono text-xs md:text-sm space-y-1 overflow-y-auto custom-scrollbar flex-1">
            {logs.length === 0 && (
                <div className="text-gray-500 italic">Waiting for incoming packets...</div>
            )}
            {logs.map((log, index) => (
                <div key={index} className="flex gap-3 border-b border-slate-800/50 pb-1 mb-1 animate-in slide-in-from-left-2">
                    <span className="text-slate-500 shrink-0">[{log.time}]</span>
                    <span className={`font-bold w-12 shrink-0 ${
                        log.type === 'INFO' ? 'text-blue-400' : 'text-yellow-400'
                    }`}>{log.type}</span>
                    <span className="text-gray-300">{log.msg}</span>
                </div>
            ))}
        </div>
      </div>

    </div>
  );
}

// --- SUB-KOMPONEN ---

function SensorCard({ title, value, unit, icon, color, percent }) {
    const barColors = {
        blue: 'bg-blue-500', green: 'bg-green-500', orange: 'bg-orange-500', red: 'bg-red-500', yellow: 'bg-yellow-500'
    };
    const textColors = {
        blue: 'text-blue-600 bg-blue-50', green: 'text-green-600 bg-green-50', orange: 'text-orange-600 bg-orange-50', 
        red: 'text-red-600 bg-red-50', yellow: 'text-yellow-600 bg-yellow-50'
    };

    return (
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wide">{title}</p>
                    <div className="flex items-baseline gap-1 mt-1">
                        <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
                        <span className="text-sm font-medium text-gray-500">{unit}</span>
                    </div>
                </div>
                <div className={`p-2.5 rounded-lg ${textColors[color]}`}>{icon}</div>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-2">
                <div className={`h-full rounded-full transition-all duration-500 ${barColors[color]}`} style={{ width: `${Math.min(percent, 100)}%` }}></div>
            </div>
        </div>
    )
}

function HealthItem({ label, percent, color, warning }) {
    return (
        <div>
            <div className="flex justify-between mb-1.5 items-end">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                {warning ? (
                    <span className="text-xs font-bold text-red-500 flex items-center gap-1 animate-pulse">
                        <AlertTriangle size={10}/> {warning}
                    </span>
                ) : (
                    <span className="text-xs font-bold text-gray-400">{percent}%</span>
                )}
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
                <div className={`h-2 rounded-full transition-all duration-1000 ${color}`} style={{ width: `${percent}%` }}></div>
            </div>
        </div>
    )
}