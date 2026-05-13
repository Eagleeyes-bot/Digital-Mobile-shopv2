import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Smartphone, Search, Menu, ChevronRight, Loader2 } from 'lucide-react';
import { UserRole } from '../../types/auth';
import { Product } from '../../services/googleService';
import { getDriveImageUrl } from '../../lib/driveUtils';

interface LandingPageProps {
  userRole: UserRole;
}

export default function LandingPage({ userRole }: LandingPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<{ type: 'API_DISABLED' | 'ERROR' | null, message: string }>({ type: null, message: '' });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        
        if (response.ok) {
          setProducts(data);
        } else {
          // Detect the specific "API not used" error from Google
          if (data.error?.includes('Google Sheets API has not been used') || data.error?.includes('sheets.googleapis.com')) {
            setErrorStatus({ 
              type: 'API_DISABLED', 
              message: 'Google Sheets API is not enabled. Please enable it in the Google Cloud Console.' 
            });
          } else if (data.error?.includes('Products') && data.error?.includes('not found')) {
            setErrorStatus({
              type: 'ERROR',
              message: "Missing 'Products' tab. Please rename your Google Sheet tab to 'Products'."
            });
          } else {
            setErrorStatus({ type: 'ERROR', message: data.error || 'Failed to sync catalog.' });
          }
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setErrorStatus({ type: 'ERROR', message: 'Connection to aura-cloud lost.' });
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div className="min-h-screen bg-apple-gray font-sans text-apple-text">
      {/* Frosted glass navbar */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-black/5">
        <nav className="max-w-screen-xl mx-auto px-6 md:px-12 h-14 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <a href="/" className="text-xl font-semibold tracking-tighter flex items-center gap-2">
              <span className="w-6 h-6 bg-dark-green rounded flex items-center justify-center">
                <div className="w-2 h-2 bg-aura-gold rounded-full"></div>
              </span>
              Aura
            </a>
            <div className="hidden md:flex gap-10 text-[12px] font-medium text-gray-500 uppercase tracking-widest">
              <a href="#" className="hover:text-dark-green transition-colors">Store</a>
              <a href="#" className="hover:text-dark-green transition-colors">Phones</a>
              {userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN ? (
                 <a 
                   href="/admin" 
                   id="admin-portal-link"
                   className="text-white bg-dark-green px-4 py-1.5 rounded-full font-bold hover:bg-aura-gold hover:text-dark-green transition-all shadow-lg shadow-dark-green/10"
                 >
                   Admin Portal
                 </a>
              ) : null}
              {userRole === UserRole.SUPER_ADMIN ? (
                 <a href="/super-admin" className="text-aura-gold font-bold hover:opacity-70 transition-opacity">System Root</a>
              ) : null}
            </div>
          </div>
          <div className="flex items-center gap-6 text-gray-600">
            <Search size={16} className="cursor-pointer hover:text-dark-green transition-colors" />
            <div className="relative">
              <ShoppingCart size={16} className="cursor-pointer hover:text-dark-green transition-colors" />
              <span className="absolute -top-2 -right-2 bg-dark-green text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
            </div>
            <Menu size={18} className="md:hidden cursor-pointer" />
          </div>
        </nav>
      </header>

      <main>
        {/* Apple-style Hero Section */}
        <section className="relative h-[90vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-white">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="z-10"
          >
            <motion.span 
              variants={itemVariants}
              className="text-aura-gold font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block"
            >
              The New Standard
            </motion.span>
            <motion.h1 
              variants={itemVariants}
              className="text-7xl md:text-8xl font-semibold tracking-tight mb-4 text-dark-green"
            >
              Aura Pure.
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="text-2xl md:text-3xl font-normal text-gray-400 mb-10 tracking-tight"
            >
              Crafted in Deep Emerald. Powered by Light.
            </motion.p>
            <motion.div 
              variants={itemVariants}
              className="flex justify-center gap-6"
            >
              <button className="bg-dark-green text-white px-8 py-3 rounded-full text-sm font-semibold hover:opacity-90 transition-all shadow-xl shadow-dark-green/20">
                Buy Now
              </button>
              <button className="text-dark-green font-semibold flex items-center gap-1 hover:underline underline-offset-4 decoration-1">
                Learn more <ChevronRight size={16} />
              </button>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
            className="absolute bottom-0 w-full max-w-4xl opacity-20 md:opacity-100"
          >
            <div className="relative aspect-[16/9] flex items-center justify-center">
              <div className="w-[300px] h-[600px] bg-gradient-to-b from-dark-green to-[#012a28] rounded-[3rem] border-[8px] border-aura-gold/30 shadow-2xl flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent"></div>
                <Smartphone size={120} strokeWidth={0.5} className="text-aura-gold/20 group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute top-4 w-20 h-6 bg-black rounded-full"></div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Product Grid with Fade-in Scroll Effect */}
        <section className="max-w-screen-xl mx-auto px-6 md:px-12 py-32">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-4xl font-semibold tracking-tight text-dark-green">Essential Models</h2>
            <p className="text-gray-400 font-medium">{loading ? 'Syncing Catalog...' : 'Curated Precision'}</p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="animate-spin text-dark-green" size={32} />
              <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Bridging Google Cloud...</p>
            </div>
          ) : errorStatus.type === 'API_DISABLED' ? (
            <div className="bg-white rounded-[2.5rem] p-12 border border-aura-gold/20 flex flex-col items-center text-center max-w-2xl mx-auto shadow-2xl">
              <div className="w-16 h-16 bg-aura-gold/10 rounded-full flex items-center justify-center mb-6">
                <ChevronRight size={32} className="text-aura-gold rotate-90" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-dark-green">Cloud Sync Required</h3>
              <p className="text-gray-500 mb-8 leading-relaxed">To view the live product catalog, the Google Sheets API must be enabled for this project.</p>
              <a 
                href="https://console.developers.google.com/apis/api/sheets.googleapis.com/overview?project=777316295850" 
                target="_blank" 
                rel="noreferrer"
                className="bg-dark-green text-white px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-all"
              >
                Enable API Now
              </a>
            </div>
          ) : errorStatus.type === 'ERROR' ? (
            <div className="bg-white rounded-[2.5rem] p-12 border border-red-100 flex flex-col items-center text-center max-w-2xl mx-auto shadow-sm">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <Smartphone size={32} className="text-red-400 opacity-50" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-dark-green">Catalog Sync Issue</h3>
              <p className="text-gray-500 mb-8 leading-relaxed font-medium">{errorStatus.message}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-dark-green text-white px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-all"
              >
                Retry Sync
              </button>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
            >
              {products.length > 0 ? products.map((product, i) => (
                <motion.div 
                  key={i} 
                  variants={itemVariants}
                  className="bg-white rounded-[2.5rem] p-10 flex flex-col h-[600px] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-50 group"
                >
                  <div className="mb-8">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.brand} • {product.storage} • {product.region || 'Global'}</span>
                    <h3 className="text-4xl font-bold mt-2 group-hover:text-dark-green transition-colors leading-[1.1] tracking-tight">{product.name}</h3>
                    {product.infoLink && (
                      <a 
                        href={product.infoLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-aura-gold uppercase tracking-widest mt-2 hover:underline decoration-1 underline-offset-4"
                      >
                        Specs <ChevronRight size={12} />
                      </a>
                    )}
                  </div>
                  
                  <div className="flex-grow flex items-center justify-center overflow-hidden">
                    <div className="w-[200px] h-[340px] relative group-hover:scale-110 transition-transform duration-1000 flex items-center justify-center">
                      {product.imageId ? (
                        <img 
                          src={getDriveImageUrl(product.imageId)} 
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="max-w-full max-h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
                          onError={(e) => {
                            // Fallback if image fails
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`fallback-icon ${product.imageId ? 'hidden' : ''} w-[140px] h-[280px] bg-dark-green rounded-[2rem] shadow-xl relative overflow-hidden flex items-center justify-center`}>
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]"></div>
                        <Smartphone size={48} strokeWidth={0.5} className="text-white/20" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-4xl font-black tracking-[-0.05em] text-dark-green leading-none">{product.price}</span>
                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-2">
                        {product.condition === 'NEW' ? 'Brand New' : `Second Hand • ${product.batteryHealth}% BH`}
                      </span>
                    </div>
                    <button className="bg-apple-gray text-apple-text w-14 h-14 rounded-full flex items-center justify-center hover:bg-dark-green hover:text-white transition-all transform active:scale-90">
                      <ShoppingCart size={20} />
                    </button>
                  </div>
                </motion.div>
              )) : (
                // Fallback / Example items if Sheet is empty initially
                [1, 2, 3].map((i) => (
                  <motion.div 
                    key={i} 
                    variants={itemVariants}
                    className="bg-white rounded-[2.5rem] p-10 flex flex-col h-[550px] shadow-sm opacity-50 border border-dashed border-gray-200"
                  >
                    <div className="animate-pulse flex flex-col gap-4">
                      <div className="h-2 w-12 bg-gray-200 rounded"></div>
                      <div className="h-6 w-32 bg-gray-200 rounded"></div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </section>

        {/* Feature Section */}
        <section className="bg-dark-green py-32 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-5xl md:text-6xl font-semibold tracking-tight mb-8">Elegance meets Intelligence.</h2>
            <p className="text-xl text-white/60 mb-12 leading-relaxed">Designed for those who appreciate the silence of fine craftsmanship. Aura OS integrates seamlessly with your world.</p>
            <div className="grid grid-cols-3 gap-12 font-medium uppercase tracking-widest text-[10px]">
              <div className="flex flex-col gap-3">
                <span className="text-aura-gold text-2xl font-bold tracking-normal">42h</span>
                Battery Life
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-aura-gold text-2xl font-bold tracking-normal">8K</span>
                Cinematic Recording
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-aura-gold text-2xl font-bold tracking-normal">A18</span>
                Neural Engine
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white py-20 px-6 border-t border-gray-100">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-xs">
            <a href="/" className="text-2xl font-bold tracking-tighter mb-4 block text-dark-green">Aura.</a>
            <p className="text-sm text-gray-400 leading-relaxed italic">Crafting the future of mobile technology with extreme focus on minimalism and purity.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-16 text-sm">
            <div className="flex flex-col gap-4">
              <span className="font-bold text-dark-green uppercase text-[10px] tracking-widest text-opacity-50">Shop</span>
              <a href="#" className="text-gray-500 hover:text-dark-green">iPhone</a>
              <a href="#" className="text-gray-500 hover:text-dark-green">Samsung</a>
              <a href="#" className="text-gray-500 hover:text-dark-green">Accessories</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-bold text-dark-green uppercase text-[10px] tracking-widest text-opacity-50">Aura OS</span>
              <a href="#" className="text-gray-500 hover:text-dark-green">Architecture</a>
              <a href="#" className="text-gray-500 hover:text-dark-green">Security</a>
              <a href="#" className="text-gray-500 hover:text-dark-green">Privacy</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-bold text-dark-green uppercase text-[10px] tracking-widest text-opacity-50">Support</span>
              <a href="#" className="text-gray-500 hover:text-dark-green">Contact</a>
              <a href="#" className="text-gray-500 hover:text-dark-green">Warranty</a>
              <a href="#" className="text-gray-500 hover:text-dark-green">Orders</a>
            </div>
          </div>
        </div>
        <div className="max-w-screen-xl mx-auto mt-20 pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-gray-400">
          <span>&copy; 2026 Aura Mobile Technologies. All rights reserved.</span>
          <div className="flex gap-8">
            <a href="#" className="hover:text-dark-green">Privacy Policy</a>
            <a href="#" className="hover:text-dark-green">Terms of Service</a>
            <a href="#" className="hover:text-dark-green">System Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

