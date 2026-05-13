import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Smartphone, Search, Menu, ChevronRight, Loader2, Sun, Moon } from 'lucide-react';
import { Product } from '../../services/googleService';
import { getDriveImageUrl } from '../../lib/driveUtils';
import { useTheme } from '../../context/ThemeContext';

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorStatus, setErrorStatus] = useState<{ type: 'API_DISABLED' | 'ERROR' | null, message: string }>({ type: null, message: '' });

  const scrollToStore = () => {
    const element = document.getElementById('store');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
    <div className="min-h-screen bg-white dark:bg-[#0c0c0c] font-sans text-apple-text dark:text-white/90 transition-colors duration-500">
      {/* Frosted glass navbar */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-[#0c0c0c]/70 backdrop-blur-2xl border-b border-black/5 dark:border-white/5">
        <nav className="max-w-screen-xl mx-auto px-6 md:px-12 h-14 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-2">
              <a href="/admin" className="w-6 h-6 bg-primary-gold rounded flex items-center justify-center hover:opacity-80 transition-opacity">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </a>
              <a href="/" className="text-xl font-semibold tracking-tighter">Eenyg</a>
            </div>
            <div className="hidden md:flex gap-10 text-[12px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              <button onClick={scrollToStore} className="hover:text-primary-gold transition-colors cursor-pointer">Store</button>
              <button onClick={scrollToStore} className="hover:text-primary-gold transition-colors cursor-pointer">Phones</button>
            </div>
          </div>
          <div className="flex items-center gap-6 text-gray-600 dark:text-gray-400">
            <button 
              onClick={toggleTheme}
              className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <div className="relative flex items-center">
              <motion.input 
                initial={false}
                animate={{ width: isSearchOpen ? 200 : 0, opacity: isSearchOpen ? 1 : 0 }}
                placeholder="Search catalog..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-apple-gray dark:bg-white/5 text-[11px] rounded-full px-4 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-gold/20 overflow-hidden"
              />
              <Search 
                size={16} 
                className="cursor-pointer hover:text-primary-gold transition-colors ml-2" 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              />
            </div>
            <div className="relative">
              <ShoppingCart size={16} className="cursor-pointer hover:text-primary-gold transition-colors" />
              <span className="absolute -top-2 -right-2 bg-primary-gold text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
            </div>
            <Menu size={18} className="md:hidden cursor-pointer" />
          </div>
        </nav>
      </header>

      <main>
        {/* Apple-style Hero Section */}
        <section className="relative h-[90vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-white dark:bg-[#0c0c0c] text-apple-text dark:text-white/90">
          {/* Background Image Layer */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://thumbs.dreamstime.com/b/vector-golden-line-wave-white-background-abstract-premium-luxury-elegant-illustration-wavy-japanese-ornament-flow-water-ocean-381080658.jpg?w=992" 
              alt="Hero Background" 
              className="w-full h-full object-cover opacity-60 dark:opacity-20 scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white dark:from-[#0c0c0c] via-transparent to-white dark:to-[#0c0c0c]"></div>
          </div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="z-10"
          >
            <motion.span 
              variants={itemVariants}
              className="text-primary-gold font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block"
            >
              The New Standard
            </motion.span>
            <motion.h1 
              variants={itemVariants}
              className="text-7xl md:text-8xl font-semibold tracking-tight mb-4 text-[#0c0f53] dark:text-white"
            >
              Eenyg Pure.
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="text-2xl md:text-3xl font-normal text-apple-text/60 dark:text-white/60 mb-10 tracking-tight"
            >
              Crafted in White Ivory. Powered by Light.
            </motion.p>
            <motion.div 
              variants={itemVariants}
              className="flex justify-center gap-6"
            >
              <button 
                onClick={scrollToStore}
                className="bg-primary-gold text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-dark-gold transition-all shadow-xl shadow-primary-gold/20"
              >
                Buy Now
              </button>
              <button 
                onClick={scrollToStore}
                className="text-apple-text dark:text-white font-semibold flex items-center gap-1 hover:underline underline-offset-4 decoration-1"
              >
                Learn more <ChevronRight size={16} />
              </button>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
            className="absolute bottom-0 w-full max-w-5xl px-6 pointer-events-none"
          >
            <div className="relative aspect-[16/9] flex items-center justify-center">
              <div className="w-full h-full border-t border-x border-gray-100 dark:border-white/5 rounded-t-[4rem] bg-white dark:bg-[#1a1a1a] shadow-2xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-primary-gold/5 to-transparent"></div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Product Grid with Fade-in Scroll Effect */}
        <section id="store" className="max-w-screen-xl mx-auto px-6 md:px-12 py-32 relative overflow-hidden bg-gray-50/50 dark:bg-white/5 rounded-[4rem] my-20">
          {/* Falling Snow Background */}
          <div className="absolute inset-0 pointer-events-none z-0">
            {[...Array(30)].map((_, i) => (
              <div 
                key={i}
                className="snowflake"
                style={{
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 6 + 2}px`,
                  height: `${Math.random() * 6 + 2}px`,
                  opacity: Math.random() * 0.4 + 0.2,
                  animationDuration: `${Math.random() * 15 + 10}s`,
                  animationDelay: `${Math.random() * 10}s`,
                  background: theme === 'light' ? 'white' : 'rgba(255, 255, 255, 0.8)',
                  boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)'
                }}
              />
            ))}
          </div>

          <div className="flex justify-between items-end mb-16 relative z-10">
            <h2 className="text-4xl font-semibold tracking-tight text-primary-gold">Essential Models</h2>
            <p className="text-gray-400 dark:text-gray-500 font-medium">{loading ? 'Syncing Catalog...' : 'Curated Precision'}</p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="animate-spin text-primary-gold" size={32} />
              <p className="text-sm font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest">Bridging Google Cloud...</p>
            </div>
          ) : errorStatus.type === 'API_DISABLED' ? (
            <div className="bg-white dark:bg-[#1a1a1a] rounded-[2.5rem] p-12 border border-primary-gold/20 flex flex-col items-center text-center max-w-2xl mx-auto shadow-2xl">
              <div className="w-16 h-16 bg-primary-gold/10 rounded-full flex items-center justify-center mb-6">
                <ChevronRight size={32} className="text-primary-gold rotate-90" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-apple-text dark:text-white">Cloud Sync Required</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">To view the live product catalog, the Google Sheets API must be enabled for this project.</p>
              <a 
                href="https://console.developers.google.com/apis/api/sheets.googleapis.com/overview?project=777316295850" 
                target="_blank" 
                rel="noreferrer"
                className="bg-primary-gold text-white px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-primary-gold/20"
              >
                Enable API Now
              </a>
            </div>
          ) : errorStatus.type === 'ERROR' ? (
            <div className="bg-white dark:bg-[#1a1a1a] rounded-[2.5rem] p-12 border border-red-100 dark:border-red-900/30 flex flex-col items-center text-center max-w-2xl mx-auto shadow-sm">
              <div className="w-16 h-16 bg-red-50 dark:bg-red-900/10 rounded-full flex items-center justify-center mb-6">
                <Smartphone size={32} className="text-red-400 opacity-50" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-apple-text dark:text-white">Catalog Sync Issue</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed font-medium">{errorStatus.message}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-primary-gold text-white px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-all font-mono"
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
              {products.length > 0 ? (
                products.filter(p => !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.brand.toLowerCase().includes(searchTerm.toLowerCase())).length > 0 ? (
                  products
                    .filter(p => !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.brand.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((product, i) => (
                    <motion.div 
                      key={i} 
                      variants={itemVariants}
                      className="bg-white dark:bg-[#1a1a1a] rounded-[2.5rem] p-10 flex flex-col h-[600px] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-50 dark:border-white/5 group"
                    >
                      <div className="mb-8">
                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{product.brand} • {product.storage} • {product.region || 'Global'}</span>
                        <h3 className="text-4xl font-bold mt-2 group-hover:text-primary-gold transition-colors leading-[1.1] tracking-tight dark:text-white">{product.name}</h3>
                        {product.infoLink && (
                          <a 
                            href={product.infoLink.startsWith('http') ? product.infoLink : `https://${product.infoLink}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-black text-primary-gold uppercase tracking-[0.2em] mt-3 hover:text-dark-gold transition-colors"
                          >
                            Contact us <ChevronRight size={10} className="mt-0.5" />
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
                              className="max-w-full max-h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_20px_50px_rgba(255,255,255,0.05)]"
                            />
                          ) : (
                            <div className="w-[140px] h-[280px] bg-primary-gold rounded-[2rem] shadow-xl relative overflow-hidden flex items-center justify-center">
                              <Smartphone size={48} strokeWidth={0.5} className="text-white/40" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-8 flex justify-between items-end">
                        <div className="flex flex-col">
                          <span className="text-4xl font-black tracking-[-0.05em] text-primary-gold leading-none">{product.price}</span>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-widest mt-2">
                            {product.condition === 'NEW' ? 'Brand New' : `Second Hand • ${product.batteryHealth}% BH`}
                          </span>
                        </div>
                        <button className="bg-apple-gray dark:bg-white/5 text-apple-text dark:text-white w-14 h-14 rounded-full flex items-center justify-center hover:bg-primary-gold hover:text-white transition-all transform active:scale-90 shadow-sm">
                          <ShoppingCart size={20} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-24 text-center">
                    <Search size={48} className="mx-auto text-gray-200 dark:text-gray-800 mb-6" />
                    <h3 className="text-2xl font-bold text-apple-text dark:text-white mb-2">No matches found</h3>
                    <p className="text-gray-400 dark:text-gray-500 uppercase tracking-widest text-[10px] font-black">Refine your search parameters</p>
                  </div>
                )
              ) : (
                // Fallback / Example items if Sheet is empty initially
                [1, 2, 3].map((i) => (
                  <motion.div 
                    key={i} 
                    variants={itemVariants}
                    className="bg-white dark:bg-[#1a1a1a] rounded-[2.5rem] p-10 flex flex-col h-[550px] shadow-sm opacity-50 border border-dashed border-gray-200 dark:border-gray-800"
                  >
                    <div className="animate-pulse flex flex-col gap-4">
                      <div className="h-2 w-12 bg-gray-200 dark:bg-gray-800 rounded"></div>
                      <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </section>

        {/* Feature Section */}
        <section className="bg-white dark:bg-[#0c0c0c] py-32 text-apple-text dark:text-white border-t border-gray-50 dark:border-white/5">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-5xl md:text-6xl font-semibold tracking-tight mb-8">Elegance meets Intelligence.</h2>
            <p className="text-xl text-apple-text/60 dark:text-white/60 mb-12 leading-relaxed">Designed for those who appreciate the silence of fine craftsmanship. Eenyg OS integrates seamlessly with your world.</p>
            <div className="grid grid-cols-3 gap-12 font-medium uppercase tracking-widest text-[10px]">
              <div className="flex flex-col gap-3">
                <span className="text-primary-gold text-2xl font-bold tracking-normal">42h</span>
                Battery Life
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-primary-gold text-2xl font-bold tracking-normal">8K</span>
                Cinematic Recording
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-primary-gold text-2xl font-bold tracking-normal">A18</span>
                Neural Engine
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white dark:bg-[#0c0c0c] py-20 px-6 border-t border-gray-100 dark:border-white/5">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-xs">
            <a href="/" className="text-2xl font-bold tracking-tighter mb-4 block text-primary-gold">Eenyg.</a>
            <p className="text-sm text-gray-400 dark:text-gray-500 leading-relaxed italic">Crafting the future of mobile technology with extreme focus on minimalism and purity.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-16 text-sm">
            <div className="flex flex-col gap-4">
              <span className="font-bold text-primary-gold uppercase text-[10px] tracking-widest text-opacity-50">Shop</span>
              <button onClick={scrollToStore} className="text-gray-500 dark:text-gray-400 hover:text-primary-gold text-left">iPhone</button>
              <button onClick={scrollToStore} className="text-gray-500 dark:text-gray-400 hover:text-primary-gold text-left">Samsung</button>
              <button onClick={scrollToStore} className="text-gray-500 dark:text-gray-400 hover:text-primary-gold text-left">Accessories</button>
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-bold text-primary-gold uppercase text-[10px] tracking-widest text-opacity-50">Eenyg OS</span>
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-primary-gold">Architecture</a>
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-primary-gold">Security</a>
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-primary-gold">Privacy</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-bold text-primary-gold uppercase text-[10px] tracking-widest text-opacity-50">Support</span>
              <button onClick={scrollToStore} className="text-gray-500 dark:text-gray-400 hover:text-primary-gold text-left">Contact</button>
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-primary-gold">Warranty</a>
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-primary-gold">Orders</a>
            </div>
          </div>
        </div>
        <div className="max-w-screen-xl mx-auto mt-20 pt-8 border-t border-gray-50 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-gray-400 dark:text-gray-500">
          <span>&copy; 2026 Eenyg Mobile Technologies. All rights reserved.</span>
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary-gold">Privacy Policy</a>
            <a href="#" className="hover:text-primary-gold">Terms of Service</a>
            <a href="#" className="hover:text-primary-gold">System Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

