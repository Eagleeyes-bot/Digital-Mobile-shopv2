import React from 'react';
import { Package, Plus, BarChart3, Settings } from 'lucide-react';

export default function InventoryPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] flex">
      <aside className="w-64 bg-white border-r border-gray-200 p-8 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <span className="font-semibold text-lg tracking-tight">Aura OS</span>
          </div>
          
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-3">Management</p>
          <nav className="space-y-1">
            <a href="#" className="flex items-center gap-3 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-2xl text-sm font-medium">
              <Package size={18} /> Inventory
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-gray-500 hover:bg-gray-50 rounded-2xl text-sm font-medium transition-colors">
              <BarChart3 size={18} /> Sales
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-gray-500 hover:bg-gray-50 rounded-2xl text-sm font-medium transition-colors">
              <Settings size={18} /> Settings
            </a>
          </nav>
        </div>

        <div className="bg-gray-50 rounded-3xl p-5 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Database</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-tight mb-3">Syncing with Google Sheets: 124ms</p>
          <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full w-4/5 rounded-full"></div>
          </div>
        </div>
      </aside>

      <main className="flex-grow p-12 overflow-y-auto">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
            <p className="text-gray-500 mt-1">Manage your product catalog and stock levels.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-all flex items-center gap-2">
              <Plus size={18} /> Add Product
            </button>
            <button className="px-5 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50 transition-all">
              Export CSV
            </button>
          </div>
        </header>

        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <tr>
                <th className="px-8 py-4">Product</th>
                <th className="px-8 py-4">Stock</th>
                <th className="px-8 py-4">Price</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                        <Package size={20} className="text-gray-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Aura Pro Max {i}</div>
                        <div className="text-xs text-gray-500">Titanium Silver</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-gray-600">42 units</td>
                  <td className="px-8 py-6 font-medium">$1,199</td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-semibold rounded-full uppercase tracking-tighter">In Stock</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="text-gray-400 hover:text-black">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
