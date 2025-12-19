import React, { useState } from 'react';
import { Database, RefreshCw, CheckCircle, XCircle, Cloud } from 'lucide-react';

export default function LakehouseSync() {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 3000); // Simulasi delay 3 detik
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Database className="text-indigo-600"/> Lakehouse Sync Status
            </h2>
            <p className="text-gray-500 text-sm mt-1">Sinkronisasi data armada ke Data Warehouse / Data Lake.</p>
        </div>
        <button 
            onClick={handleSync}
            disabled={isSyncing}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white transition ${
                isSyncing ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30'
            }`}
        >
            <RefreshCw size={20} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? 'Syncing...' : 'Sync Now'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Cloud size={24} />
            </div>
            <h3 className="font-bold text-gray-800">Connection Status</h3>
            <p className="text-green-600 text-sm font-medium mt-1">Connected (AWS S3)</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
             <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <RefreshCw size={24} />
            </div>
            <h3 className="font-bold text-gray-800">Last Successful Sync</h3>
            <p className="text-gray-600 text-sm mt-1">Hari ini, 09:30 AM</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
             <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Database size={24} />
            </div>
            <h3 className="font-bold text-gray-800">Total Records</h3>
            <p className="text-gray-600 text-sm mt-1">1,240,500 Rows</p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl overflow-hidden text-gray-300 font-mono text-sm shadow-xl">
        <div className="bg-slate-800 p-3 border-b border-slate-700 flex justify-between">
            <span>Sync Logs</span>
            <span className="text-xs bg-slate-700 px-2 py-1 rounded">v2.4.1</span>
        </div>
        <div className="p-4 space-y-2 h-64 overflow-y-auto">
            <div className="flex items-start gap-3">
                <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
                <span>[09:30:05] Uploaded batch_fleet_telemetry_20241219.csv (25MB) - Success</span>
            </div>
            <div className="flex items-start gap-3">
                <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
                <span>[09:30:01] Converting JSON to Parquet format... Done.</span>
            </div>
            <div className="flex items-start gap-3">
                <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
                <span>[09:29:55] Fetching data from Redis Cache...</span>
            </div>
             <div className="flex items-start gap-3 opacity-50">
                <XCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
                <span>[Yesterday] Connection timeout (Retried automatically)</span>
            </div>
        </div>
      </div>
    </div>
  );
}