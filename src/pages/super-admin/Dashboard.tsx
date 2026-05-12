import React from 'react';
import { Users, ShieldCheck, Activity, DollarSign } from 'lucide-react';

export default function SuperAdminDashboard() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] p-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-[#1D1D1F]">System Control</h1>
            <p className="text-[#86868B] text-lg mt-1 font-medium">Super Admin Overview & Logistics</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-green-600 bg-green-50 px-4 py-2 rounded-full border border-green-100">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="uppercase tracking-widest">Database Linked</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {[
            { label: 'Total Revenue', value: '$2.4M', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Platform Users', value: '14,204', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'System Health', value: '99.9%', icon: Activity, color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'Security Audits', value: 'Passed', icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>
                <stat.icon size={24} />
              </div>
              <div className="text-[10px] font-bold text-[#86868B] uppercase tracking-[0.15em] mb-2">{stat.label}</div>
              <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#86868B]">User Management</h3>
              <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded tracking-widest uppercase">RBAC Verified</span>
            </div>
            <div className="space-y-6">
              {[
                { name: 'John Doe', role: 'Admin', email: 'john@aura.com' },
                { name: 'Sarah Smith', role: 'Admin', email: 'sarah@aura.com' },
                { name: 'Mike Ross', role: 'Staff', email: 'mike@aura.com' },
              ].map((user, i) => (
                <div key={i} className="flex justify-between items-center pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center font-bold text-gray-400 text-xs">{user.name[0]}</div>
                    <div>
                      <div className="font-semibold text-sm">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-gray-50 text-gray-600 text-[10px] font-bold uppercase tracking-widest rounded-full">{user.role}</span>
                </div>
              ))}
            </div>
            <button className="mt-10 w-full py-4 bg-black text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:opacity-80 transition-opacity">
              Manage Access Control
            </button>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#86868B] mb-8">System Activity</h3>
            <div className="flex-grow space-y-4 font-mono text-[11px] bg-gray-50 p-6 rounded-2xl border border-gray-100 overflow-hidden">
              {[
                { time: '12:45:01', event: 'Inventory Sync successful', type: 'info' },
                { time: '12:40:22', event: 'New Super Admin login: eagleeye', type: 'security' },
                { time: '11:59:12', event: 'Backup initiated', type: 'info' },
                { time: '10:30:55', event: 'API Warning: High latency', type: 'error' },
              ].map((log, i) => (
                <div key={i} className="flex gap-4 p-2 rounded-lg hover:bg-white/50 transition-colors">
                  <span className="text-gray-400 shrink-0 font-medium">{log.time}</span>
                  <span className={`${log.type === 'error' ? 'text-red-500 font-bold' : log.type === 'security' ? 'text-blue-500 font-semibold' : 'text-gray-600'}`}>
                    [{log.type.toUpperCase()}] {log.event}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
