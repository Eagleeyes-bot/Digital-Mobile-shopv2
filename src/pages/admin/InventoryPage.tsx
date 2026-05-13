import React, { useState, useEffect } from 'react';
import { 
  Package, Plus, BarChart3, Settings, Search, 
  Filter, MoreHorizontal, X, Upload, Smartphone, 
  Trash2, Edit3, CheckCircle2, AlertCircle, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../../services/googleService';
import { getDriveImageUrl } from '../../lib/driveUtils';
import { useTheme } from '../../context/ThemeContext';

export default function InventoryPage() {
  const { theme, toggleTheme } = useTheme();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'imageId'> & { imageId: string }>({
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
    price: '',
    imageId: ''
  });

  // Check session storage on mount
  useEffect(() => {
    const unlocked = sessionStorage.getItem('admin_unlocked');
    if (unlocked === 'true') {
      setIsUnlocked(true);
      fetchInventory();
    }
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '88888888') {
      setIsUnlocked(true);
      sessionStorage.setItem('admin_unlocked', 'true');
      fetchInventory();
    } else {
      setPasscodeError(true);
      setTimeout(() => setPasscodeError(false), 500);
      setPasscode('');
    }
  };

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
    if (isUnlocked) {
      fetchInventory();
    }
  }, [isUnlocked]);

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0c0c0c] flex items-center justify-center p-6 font-sans transition-colors duration-500">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-[3rem] p-12 text-center backdrop-blur-xl shadow-2xl shadow-primary-gold/5"
        >
          <div className="w-20 h-20 bg-primary-gold rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary-gold/20">
            <div className="w-6 h-6 bg-white rounded-full animate-pulse"></div>
          </div>
          
          <h2 className="text-3xl font-bold tracking-tight mb-2 text-apple-text dark:text-white">Terminal Access</h2>
          <p className="text-gray-400 dark:text-gray-500 text-sm mb-10 uppercase tracking-widest font-bold">Encrypted Authorization Required</p>
          
          <form onSubmit={handleUnlock} className="space-y-6">
            <motion.div
              animate={passcodeError ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              <input 
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter Passcode"
                className={`w-full bg-white dark:bg-black/20 border ${passcodeError ? 'border-red-500' : 'border-black/5 dark:border-white/10'} rounded-2xl px-6 py-5 text-center text-2xl tracking-[0.5em] font-mono focus:outline-none focus:border-primary-gold focus:ring-1 focus:ring-primary-gold/50 transition-all text-apple-text dark:text-white`}
                autoFocus
                required
              />
            </motion.div>
            
            <button 
              type="submit"
              className="w-full py-5 bg-primary-gold text-white rounded-2xl text-sm font-bold uppercase tracking-[0.2em] shadow-xl shadow-primary-gold/20 hover:opacity-90 active:scale-95 transition-all outline-none"
            >
              Unlock Terminal
            </button>
          </form>
          
          <p className="mt-8 text-[10px] text-gray-400 dark:text-gray-600 uppercase font-black tracking-widest">
            Biometric bypass disabled • Encrypted session
          </p>
        </motion.div>
      </div>
    );
  }

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
      const response = await fetch(`/api/products/${id}`, {
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
      price: product.price,
      imageId: product.imageId || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout for cloud sync

    try {
      const isEdit = !!editingId;
      let response;

      const fetchOptions: RequestInit = {
        signal: controller.signal,
        headers: {
          'x-user-role': 'ADMIN'
        }
      };

      if (isEdit) {
        response = await fetch(`/api/products/${editingId}`, {
          ...fetchOptions,
          method: 'PATCH',
          headers: {
            ...fetchOptions.headers,
            'Content-Type': 'application/json',
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
        } else if (!formData.imageId) {
          throw new Error('A device image or external URL is required for initial provisioning.');
        }

        response = await fetch('/api/products', {
          ...fetchOptions,
          method: 'POST',
          body: data
        });
      }

      clearTimeout(timeoutId);
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
            price: '',
            imageId: ''
          });
          setImageFile(null);
        }, 2000);
      } else {
        setError(result.error || 'Cloud synchronization failed. Please check connection.');
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Connection timed out. The cloud server is taking too long to respond.');
      } else {
        setError(err.message || 'An error occurred during submission.');
      }
      console.error('Submission error:', err);
    } finally {
      clearTimeout(timeoutId);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0c0c0c] text-apple-text dark:text-white/90 font-sans flex transition-colors duration-500">
      {/* Sidebar - Light Glass */}
      <aside className="w-64 bg-white dark:bg-[#1a1a1a] backdrop-blur-3xl border-r border-black/5 dark:border-white/5 p-8 flex flex-col justify-between sticky top-0 h-screen">
        <div className="space-y-1">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setEditingId(null);
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
                price: '',
                imageId: ''
              });
              setImageFile(null);
              setIsModalOpen(true);
            }}
            className="mb-8 w-full py-4 bg-primary-gold text-white rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-primary-gold/10 transition-all border border-white/5"
          >
            <Plus size={16} /> New Entry
          </motion.button>

          <a 
            href="https://docs.google.com/spreadsheets/d/1uQ4FNI3yUSEOevPodHs-V6z9GpnaaNOXpMSNfMtF6Ac/edit?usp=drive_link" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 mb-12 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-primary-gold rounded-xl flex items-center justify-center shadow-lg shadow-primary-gold/20">
              <div className="w-3.5 h-3.5 bg-white rounded-full"></div>
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight block">Eenyg Admin</span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest -mt-1">Inventory Master</span>
            </div>
          </a>
          
          <nav className="space-y-2">
            <a href="#" className="flex items-center gap-3 px-4 py-3 bg-primary-gold text-white rounded-2xl text-sm font-semibold shadow-xl shadow-primary-gold/10">
              <Package size={18} className="text-white" /> Inventory
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-primary-gold hover:bg-white dark:hover:bg-white/5 rounded-2xl text-sm font-medium transition-all group">
              <BarChart3 size={18} className="group-hover:text-primary-gold transition-colors" /> Analytics
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-primary-gold hover:bg-white dark:hover:bg-white/5 rounded-2xl text-sm font-medium transition-all group">
              <Settings size={18} className="group-hover:text-primary-gold transition-colors" /> Configuration
            </a>
          </nav>
        </div>

        <div className="bg-white dark:bg-white/5 rounded-3xl p-6 border border-black/5 dark:border-white/5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Connected</span>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">Admin: <span className="text-apple-text dark:text-white font-bold">Zyn</span></p>
        </div>
      </aside>

      <main className="flex-grow p-12 overflow-y-auto h-screen bg-white dark:bg-[#0c0c0c]">
        <header className="mb-14 flex justify-between items-end">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-4xl font-bold tracking-tight mb-2 text-apple-text dark:text-white">Global Inventory</h2>
            <div className="flex items-center gap-4 text-gray-400 font-medium">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-500" /> Sheets Synced</span>
              <span className="w-1 h-1 bg-gray-200 dark:bg-gray-800 rounded-full"></span>
              <span>{products.length} Items Listed</span>
            </div>
          </motion.div>

          <div className="flex gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-gold transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search IMEI or Model..." 
                className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 w-64 pl-11 pr-4 py-3 rounded-full text-sm font-medium focus:outline-none focus:border-primary-gold/50 focus:bg-white dark:focus:bg-white/10 transition-all text-apple-text dark:text-white"
              />
            </div>
          </div>
        </header>

        {/* Inline Add Device Form */}
        <section className="mb-16 bg-white dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-[3rem] p-10 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-apple-text dark:text-white">Provision New Device</h3>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-1">Direct Cloud Entry</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary-gold rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-primary-gold uppercase tracking-[0.2em]">Ready to Sync</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-2 block">Device Core</label>
                <input 
                  name="name" value={formData.name} onChange={handleInputChange} required
                  placeholder="Product name (e.g., iPhone 16 Pro Max)" 
                  className="w-full bg-white dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-primary-gold transition-all text-apple-text dark:text-white"
                />
                <input 
                  name="brand" value={formData.brand} onChange={handleInputChange} required
                  placeholder="Manufacturer (e.g., Apple)" 
                  className="w-full bg-white dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-primary-gold transition-all text-apple-text dark:text-white"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-2 block">Specifications</label>
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    name="storage" value={formData.storage} onChange={handleInputChange} required
                    placeholder="Storage" 
                    className="w-full bg-white dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-primary-gold transition-all text-apple-text dark:text-white"
                  />
                  <input 
                    name="colour" value={formData.colour} onChange={handleInputChange} required
                    placeholder="Finish" 
                    className="w-full bg-white dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-primary-gold transition-all text-apple-text dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <select 
                    name="condition" value={formData.condition} onChange={handleInputChange}
                    className="w-full bg-white dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-primary-gold transition-all text-gray-500 dark:text-gray-400"
                  >
                    <option value="NEW">New</option>
                    <option value="SECOND">Second Hand</option>
                  </select>
                  <input 
                    type="number" name="batteryHealth" value={formData.batteryHealth} onChange={handleInputChange}
                    placeholder="Battery %" 
                    className="w-full bg-white dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-primary-gold transition-all text-apple-text dark:text-white"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-2 block">Identity & Price</label>
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    name="imei" value={formData.imei} onChange={handleInputChange}
                    placeholder="IMEI / Serial" 
                    className="w-full bg-white dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-primary-gold transition-all font-mono text-apple-text dark:text-white"
                  />
                  <input 
                    name="region" value={formData.region} onChange={handleInputChange}
                    placeholder="Region (e.g. ZP/A, LL/A)" 
                    className="w-full bg-white dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-primary-gold transition-all text-apple-text dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    name="price" value={formData.price} onChange={handleInputChange} required
                    placeholder="Price (e.g. $999)" 
                    className="w-full bg-white dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-2xl px-5 py-3 text-sm font-bold text-primary-gold focus:outline-none focus:border-primary-gold transition-all"
                  />
                  <input 
                    type="number" name="qty" value={formData.qty} onChange={handleInputChange} required
                    placeholder="Qty" 
                    className="w-full bg-white dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-primary-gold transition-all text-apple-text dark:text-white"
                  />
                </div>
                <input 
                  name="infoLink" value={formData.infoLink} onChange={handleInputChange}
                  placeholder="External Info Link (Optional)" 
                  className="w-full bg-white dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-primary-gold transition-all font-mono text-apple-text dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
              <div className="space-y-4 flex-1">
                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-2 block">Visual Asset (File or URL)</label>
                <div className="relative h-24 rounded-2xl border border-dashed border-black/10 dark:border-white/10 bg-white dark:bg-black/20 flex items-center justify-center group cursor-pointer overflow-hidden transition-all hover:bg-gray-50 dark:hover:bg-white/5">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  {imageFile ? (
                    <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">{imageFile.name} Loaded</p>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Upload size={16} className="text-gray-400 dark:text-gray-500" />
                      <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Select Product Key-Art</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <input 
                  name="imageId" value={formData.imageId} onChange={handleInputChange}
                  placeholder="Or paste Image URL directly..." 
                  className="w-full bg-white dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-primary-gold transition-all text-apple-text dark:text-white"
                />
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-6 bg-primary-gold text-white rounded-2xl text-xs font-bold uppercase tracking-[0.3em] shadow-2xl shadow-primary-gold/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                  {isSubmitting ? 'Pushing to Cloud...' : 'Provision Device'}
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest text-center">{error}</p>}
            {success && <p className="text-green-500 text-[10px] font-bold uppercase tracking-widest text-center">{success}</p>}
          </form>
        </section>

        <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.25em] mb-6 px-4">Live Inventory Table</h3>
        
        {/* Table View */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-[3rem] border border-black/5 dark:border-white/5 shadow-xl shadow-black/5 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white dark:bg-black/20 border-b border-black/5 dark:border-white/5 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.25em]">
              <tr>
                <th className="px-10 py-6">Smartphone</th>
                <th className="px-10 py-6">Specs & Stock</th>
                <th className="px-10 py-6">Identity</th>
                <th className="px-10 py-6">Commercial</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <Loader2 className="animate-spin inline-block text-primary-gold mb-4" size={32} />
                    <p className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Retrieving Cloud Data...</p>
                  </td>
                </tr>
              ) : products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-white dark:bg-black/20 rounded-2xl flex items-center justify-center border border-black/5 dark:border-white/10 shadow-sm transition-all group-hover:border-primary-gold/30 overflow-hidden relative">
                        {product.imageId ? (
                          <img 
                            src={getDriveImageUrl(product.imageId)} 
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                          />
                        ) : (
                          <Smartphone size={24} className="text-primary-gold/40 group-hover:text-primary-gold transition-colors" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-apple-text dark:text-white text-xl tracking-tight leading-none mb-1">{product.name}</div>
                        <div className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">{product.brand} • {product.region || 'Global'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-white dark:bg-black/40 rounded text-[10px] font-bold text-gray-500 dark:text-gray-400 border border-black/5 dark:border-white/10 uppercase tracking-tighter">{product.storage}</span>
                        <span className="text-[10px] font-bold text-primary-gold italic uppercase">{product.colour}</span>
                      </div>
                      <div className="text-xs font-semibold text-gray-400 dark:text-gray-500">
                        <span className="text-apple-text dark:text-white/80 mr-2">Qty: {product.qty}</span>
                        BH: <span className="text-apple-text dark:text-white/80">{product.batteryHealth}%</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8 font-mono text-[11px] text-gray-400 dark:text-gray-500">
                    <span className="bg-white dark:bg-black/20 px-3 py-1.5 rounded-lg border border-black/5 dark:border-white/10 text-gray-500 dark:text-gray-400">
                      {product.imei}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex flex-col gap-2">
                      <div className="text-xl font-bold text-primary-gold leading-none">{product.price}</div>
                      {product.condition === 'NEW' ? (
                        <span className="w-fit px-2 py-0.5 bg-green-500/10 text-green-500 rounded-md border border-green-500/20 uppercase tracking-widest text-[8px] font-black">Brand New</span>
                      ) : (
                        <span className="w-fit px-2 py-0.5 bg-primary-gold/10 text-primary-gold rounded-md border border-primary-gold/20 uppercase tracking-widest text-[8px] font-black italic">Second Hand</span>
                      )}
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(product)}
                        className="p-3 bg-white dark:bg-[#1a1a1a] hover:bg-primary-gold dark:hover:bg-primary-gold text-gray-400 hover:text-white rounded-xl transition-all border border-black/5 dark:border-white/10 shadow-sm"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-3 bg-white dark:bg-[#1a1a1a] hover:bg-red-500 dark:hover:bg-red-600 text-gray-400 hover:text-white rounded-xl transition-all border border-black/5 dark:border-white/10 shadow-sm"
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
              <Smartphone size={48} className="text-apple-gray dark:text-gray-800 mx-auto mb-6" />
              <p className="text-gray-400 dark:text-gray-600 font-bold uppercase tracking-widest text-sm">No inventory recorded.</p>
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
              className="absolute inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-white dark:bg-[#1a1a1a] rounded-[3rem] border border-black/5 dark:border-white/5 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-10 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-white dark:bg-[#1a1a1a]">
                <div>
                  <h3 className="text-3xl font-bold tracking-tight text-apple-text dark:text-white">{editingId ? 'Modify Device' : 'Provision New Device'}</h3>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-1 uppercase tracking-widest font-bold">Cloud Sync Terminal</p>
                </div>
                <button 
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingId(null);
                  }}
                  className="p-3 bg-white dark:bg-white/5 rounded-full hover:bg-apple-gray dark:hover:bg-white/10 transition-colors border border-black/5 dark:border-white/10 shadow-sm text-apple-text dark:text-white"
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 text-apple-text dark:text-white/90">
                  {/* Left Column */}
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-2 block">Identity & Core</label>
                      <input 
                        name="imei" value={formData.imei} onChange={handleInputChange} required
                        placeholder="IMEI Number" 
                        className="w-full bg-white dark:bg-black/20 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-primary-gold transition-all text-apple-text dark:text-white"
                      />
                      <input 
                        name="name" value={formData.name} onChange={handleInputChange} required
                        placeholder="Device Name (e.g., iPhone 15 Pro)" 
                        className="w-full bg-white dark:bg-black/20 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-primary-gold transition-all text-apple-text dark:text-white"
                      />
                      <input 
                        name="brand" value={formData.brand} onChange={handleInputChange} required
                        placeholder="Brand (e.g., Apple)" 
                        className="w-full bg-white dark:bg-black/20 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-primary-gold transition-all text-apple-text dark:text-white"
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-2 block">Specifications</label>
                      <div className="grid grid-cols-2 gap-4">
                        <input 
                          name="colour" value={formData.colour} onChange={handleInputChange} required
                          placeholder="Colour" 
                          className="w-full bg-white dark:bg-black/20 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-primary-gold transition-all text-apple-text dark:text-white"
                        />
                        <input 
                          name="storage" value={formData.storage} onChange={handleInputChange} required
                          placeholder="Storage (e.g. 256GB)" 
                          className="w-full bg-white dark:bg-black/20 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-primary-gold transition-all text-apple-text dark:text-white"
                        />
                      </div>
                      <input 
                        type="number" name="batteryHealth" value={formData.batteryHealth} onChange={handleInputChange} required
                        placeholder="Battery Health (%)" 
                        className="w-full bg-white dark:bg-black/20 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-primary-gold transition-all text-apple-text dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-2 block">Origin & Commercial</label>
                      <div className="grid grid-cols-2 gap-4">
                        <input 
                          name="region" value={formData.region} onChange={handleInputChange} required
                          placeholder="Region (e.g. US, ZP)" 
                          className="w-full bg-white dark:bg-black/20 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-primary-gold transition-all text-apple-text dark:text-white"
                        />
                        <input 
                          type="number" name="qty" value={formData.qty} onChange={handleInputChange} required
                          placeholder="Stock Quantity" 
                          className="w-full bg-white dark:bg-black/20 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-primary-gold transition-all text-apple-text dark:text-white"
                        />
                      </div>
                      <input 
                        name="price" value={formData.price} onChange={handleInputChange} required
                        placeholder="Price (e.g. $1,299 or RM4,500)" 
                        className="w-full bg-white dark:bg-black/20 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-lg font-bold text-primary-gold focus:outline-none focus:border-primary-gold transition-all"
                      />
                      <input 
                        name="infoLink" value={formData.infoLink} onChange={handleInputChange}
                        placeholder="Technical Documentation Link (Optional)" 
                        className="w-full bg-white dark:bg-black/20 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-primary-gold transition-all font-mono text-apple-text dark:text-white"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-2 block">Visual Asset {editingId && '(Optional for Update)'}</label>
                      <input 
                        name="imageId" value={formData.imageId} onChange={handleInputChange}
                        placeholder="External Image URL (if not uploading)" 
                        className="w-full bg-white dark:bg-black/20 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-primary-gold transition-all mb-4 text-apple-text dark:text-white"
                      />
                      <div className="relative h-44 rounded-[2rem] border border-dashed border-black/10 dark:border-white/10 bg-white dark:bg-black/20 flex flex-col items-center justify-center group cursor-pointer overflow-hidden transition-all hover:bg-gray-50 dark:hover:bg-white/5">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        {imageFile ? (
                          <div className="flex flex-col items-center gap-2 p-6">
                            <CheckCircle2 className="text-green-500 mb-2" size={32} />
                            <p className="text-xs font-bold text-gray-500 truncate max-w-xs">{imageFile.name}</p>
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-widest">Selected for upload</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 bg-white dark:bg-black/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm border border-black/5 dark:border-white/10">
                              <Upload className="text-primary-gold" size={24} />
                            </div>
                            <div className="text-center">
                              <p className="text-xs font-bold text-gray-500 dark:text-gray-400">Click to upload product image</p>
                              <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">Direct sync to Google Drive</p>
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
                    className="flex-1 py-5 rounded-[2rem] text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-[2] py-5 bg-primary-gold text-white rounded-[2rem] text-sm font-bold uppercase tracking-[0.2em] shadow-2xl shadow-primary-gold/20 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:active:scale-100"
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
