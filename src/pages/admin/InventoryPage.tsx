import React, { useState, useEffect } from 'react';
import { 
  Package, Plus, BarChart3, Settings, Search, 
  Filter, MoreHorizontal, X, Upload, Smartphone, 
  Trash2, Edit3, CheckCircle2, AlertCircle, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../../services/googleService';
import { getDriveImageUrl } from '../../lib/driveUtils';

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'imageId'>>({
    imei: '',
    name: '',
    colour: '',
    storage: '',
    brand: '',
    condition: 'NEW',
    batteryHealth: '',
    infoLink: '',
    region: '',
    qty: '1',
    price: ''
  });

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      const data = await response.json();
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    if (!confirm('Are you sure you want to remove this device from inventory?')) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-role': 'ADMIN' }
      });
      if (response.ok) {
        fetchInventory();
      } else {
        alert('Failed to delete product.');
      }
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id || null);
    setFormData({
      imei: product.imei,
      name: product.name,
      colour: product.colour,
      storage: product.storage,
      brand: product.brand,
      condition: product.condition,
      batteryHealth: product.batteryHealth,
      infoLink: product.infoLink,
      region: product.region,
      qty: product.qty,
      price: product.price
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const isEdit = !!editingId;
      let response;

      if (isEdit) {
        response = await fetch(`/api/admin/products/${editingId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-user-role': 'ADMIN'
          },
          body: JSON.stringify(formData)
        });
      } else {
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          data.append(key, String(value));
        });
        if (imageFile) {
          data.append('image', imageFile);
        } else {
          throw new Error('A device image is required for initial provisioning.');
        }

        response = await fetch('/api/admin/products', {
          method: 'POST',
          headers: {
            'x-user-role': 'ADMIN'
          },
          body: data
        });
      }

      const result = await response.json();

      if (response.ok) {
        setSuccess(isEdit ? 'Cloud Record Updated Successfully' : 'Device Provisioned to Cloud Inventory');
        fetchInventory();
        
        setTimeout(() => {
          setIsModalOpen(false);
          setEditingId(null);
          setSuccess(null);
          // Reset form after closing
          setFormData({
            imei: '',
            name: '',
            colour: '',
            storage: '',
            brand: '',
            condition: 'NEW',
            batteryHealth: '',
            infoLink: '',
            region: '',
            qty: '1',
            price: ''
          });
          setImageFile(null);
        }, 2000);
      } else {
        setError(result.error || 'Cloud synchronization failed. Please check connection.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-sans flex">
      {/* Sidebar - Dark Glass */}
      <aside className="w-64 bg-black/40 backdrop-blur-3xl border-r border-white/5 p-8 flex flex-col justify-between sticky top-0 h-screen">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-dark-green rounded-xl flex items-center justify-center shadow-lg shadow-dark-green/20">
              <div className="w-3.5 h-3.5 bg-aura-gold rounded-full"></div>
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight block">Aura Admin</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest -mt-1">Inventory Master</span>
            </div>
          </div>
          
          <nav className="space-y-2">
            <a href="#" className="flex items-center gap-3 px-4 py-3 bg-dark-green text-white rounded-2xl text-sm font-semibold shadow-xl shadow-dark-green/10">
              <Package size={18} className="text-aura-gold" /> Inventory
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-2xl text-sm font-medium transition-all group">
              <BarChart3 size={18} className="group-hover:text-aura-gold transition-colors" /> Analytics
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-2xl text-sm font-medium transition-all group">
              <Settings size={18} className="group-hover:text-aura-gold transition-colors" /> Configuration
            </a>
          </nav>
        </div>

        <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Connected</span>
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed">Admin: <span className="text-white font-bold">Zyn</span></p>
        </div>
      </aside>

      <main className="flex-grow p-12">
        <header className="mb-14 flex justify-between items-end">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-4xl font-bold tracking-tight mb-2">Global Inventory</h2>
            <div className="flex items-center gap-4 text-gray-500 font-medium">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-500" /> Sheets Synced</span>
              <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
              <span>{products.length} Items Listed</span>
            </div>
          </motion.div>

          <div className="flex gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-aura-gold transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search IMEI or Model..." 
                className="bg-white/5 border border-white/5 w-64 pl-11 pr-4 py-3 rounded-full text-sm font-medium focus:outline-none focus:border-aura-gold/50 focus:bg-white/10 transition-all"
              />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-dark-green text-white rounded-full text-sm font-bold shadow-2xl shadow-dark-green/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 uppercase tracking-widest"
            >
              <Plus size={18} /> Add Device
            </button>
          </div>
        </header>

        {/* Table View */}
        <div className="bg-white/[0.02] rounded-[3rem] border border-white/5 shadow-inner overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.25em]">
              <tr>
                <th className="px-10 py-6">Smartphone</th>
                <th className="px-10 py-6">Specs & Stock</th>
                <th className="px-10 py-6">Identity</th>
                <th className="px-10 py-6">Commercial</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <Loader2 className="animate-spin inline-block text-aura-gold mb-4" size={32} />
                    <p className="text-sm font-bold uppercase tracking-widest text-gray-500">Retrieving Cloud Data...</p>
                  </td>
                </tr>
              ) : products.map((product) => (
                <tr key={product.id} className="hover:bg-white/[0.03] transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 shadow-xl transition-all group-hover:border-aura-gold/30 overflow-hidden relative">
                        {product.imageId ? (
                          <img 
                            src={getDriveImageUrl(product.imageId)} 
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                          />
                        ) : (
                          <Smartphone size={24} className="text-aura-gold/40 group-hover:text-aura-gold transition-colors" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-white text-xl tracking-tight leading-none mb-1">{product.name}</div>
                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{product.brand} • {product.region || 'Global'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] font-bold text-gray-300 border border-white/5 uppercase tracking-tighter">{product.storage}</span>
                        <span className="text-[10px] font-bold text-aura-gold italic uppercase">{product.colour}</span>
                      </div>
                      <div className="text-xs font-semibold text-gray-500">
                        <span className="text-white mr-2">Qty: {product.qty}</span>
                        BH: <span className="text-white">{product.batteryHealth}%</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8 font-mono text-[11px] text-gray-400">
                    <span className="bg-black px-3 py-1.5 rounded-lg border border-white/5 text-gray-300">
                      {product.imei}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex flex-col gap-2">
                      <div className="text-xl font-bold text-aura-gold leading-none">{product.price}</div>
                      {product.condition === 'NEW' ? (
                        <span className="w-fit px-2 py-0.5 bg-green-500/10 text-green-500 rounded-md border border-green-500/20 uppercase tracking-widest text-[8px] font-black">Brand New</span>
                      ) : (
                        <span className="w-fit px-2 py-0.5 bg-aura-gold/10 text-aura-gold rounded-md border border-aura-gold/20 uppercase tracking-widest text-[8px] font-black italic">Second Hand</span>
                      )}
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(product)}
                        className="p-3 bg-white/5 hover:bg-dark-green text-gray-400 hover:text-white rounded-xl transition-all shadow-xl"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-3 bg-white/5 hover:bg-red-500/80 text-gray-400 hover:text-white rounded-xl transition-all shadow-xl"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && products.length === 0 && (
            <div className="py-24 text-center">
              <Smartphone size={48} className="text-white/5 mx-auto mb-6" />
              <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">No inventory recorded.</p>
            </div>
          )}
        </div>
      </main>

      {/* Add Item Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-[#0F0F10] rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <div>
                  <h3 className="text-3xl font-bold tracking-tight">{editingId ? 'Modify Device' : 'Provision New Device'}</h3>
                  <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-bold">Cloud Sync Terminal</p>
                </div>
                <button 
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingId(null);
                  }}
                  className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-10 overflow-y-auto custom-scrollbar">
                {error && (
                  <div className="mb-8 p-5 bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-semibold rounded-[2rem] flex items-center gap-3">
                    <AlertCircle size={20} /> {error}
                  </div>
                )}
                
                {success && (
                  <div className="mb-8 p-5 bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-semibold rounded-[2rem] flex items-center gap-3">
                    <CheckCircle2 size={20} /> {success}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                  {/* Left Column */}
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] px-2 block">Identity & Core</label>
                      <input 
                        name="imei" value={formData.imei} onChange={handleInputChange} required
                        placeholder="IMEI Number" 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-aura-gold transition-all"
                      />
                      <input 
                        name="name" value={formData.name} onChange={handleInputChange} required
                        placeholder="Device Name (e.g., iPhone 15 Pro)" 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-aura-gold transition-all"
                      />
                      <input 
                        name="brand" value={formData.brand} onChange={handleInputChange} required
                        placeholder="Brand (e.g., Apple)" 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-aura-gold transition-all"
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] px-2 block">Specifications</label>
                      <div className="grid grid-cols-2 gap-4">
                        <input 
                          name="colour" value={formData.colour} onChange={handleInputChange} required
                          placeholder="Colour" 
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-aura-gold transition-all"
                        />
                        <input 
                          name="storage" value={formData.storage} onChange={handleInputChange} required
                          placeholder="Storage (e.g. 256GB)" 
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-aura-gold transition-all"
                        />
                      </div>
                      <input 
                        type="number" name="batteryHealth" value={formData.batteryHealth} onChange={handleInputChange} required
                        placeholder="Battery Health (%)" 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-aura-gold transition-all"
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] px-2 block">Origin & Commercial</label>
                      <div className="grid grid-cols-2 gap-4">
                        <input 
                          name="region" value={formData.region} onChange={handleInputChange} required
                          placeholder="Region (e.g. US, ZP)" 
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-aura-gold transition-all"
                        />
                        <input 
                          type="number" name="qty" value={formData.qty} onChange={handleInputChange} required
                          placeholder="Stock Quantity" 
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-aura-gold transition-all"
                        />
                      </div>
                      <input 
                        name="price" value={formData.price} onChange={handleInputChange} required
                        placeholder="Price (e.g. $1,299 or RM4,500)" 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-lg font-bold text-aura-gold focus:outline-none focus:border-aura-gold transition-all"
                      />
                      <input 
                        name="infoLink" value={formData.infoLink} onChange={handleInputChange}
                        placeholder="Technical Documentation Link (Optional)" 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-aura-gold transition-all font-mono"
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] px-2 block">Visual Asset {editingId && '(Optional for Update)'}</label>
                      <div className="relative h-44 rounded-[2rem] border border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center group cursor-pointer overflow-hidden transition-all hover:bg-white/[0.04]">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        {imageFile ? (
                          <div className="flex flex-col items-center gap-2 p-6">
                            <CheckCircle2 className="text-green-500 mb-2" size={32} />
                            <p className="text-xs font-bold text-gray-400 truncate max-w-xs">{imageFile.name}</p>
                            <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">Selected for upload</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Upload className="text-gray-400" size={24} />
                            </div>
                            <div className="text-center">
                              <p className="text-xs font-bold text-gray-400">Click to upload product image</p>
                              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Direct sync to Google Drive</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-14 flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingId(null);
                    }}
                    className="flex-1 py-5 rounded-[2rem] text-sm font-bold uppercase tracking-widest text-gray-500 hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-[2] py-5 bg-dark-green text-white rounded-[2rem] text-sm font-bold uppercase tracking-[0.2em] shadow-2xl shadow-dark-green/20 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:active:scale-100"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Syncing with Cloud...
                      </>
                    ) : (
                      editingId ? 'Update Record' : 'Save to Google Cloud'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
