import React from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Smartphone, Search, Menu, ChevronRight } from 'lucide-react';
import { UserRole } from '../../types/auth';

interface LandingPageProps {
  userRole: UserRole;
}

export default function LandingPage({ userRole }: LandingPageProps) {
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
                 <a href="/admin" className="text-dark-green font-bold">Admin Portal</a>
              ) : null}
              {userRole === UserRole.SUPER_ADMIN ? (
                 <a href="/super-admin" className="text-aura-gold font-bold">System Root</a>
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
              {/* Using a high-quality silhouette/abstract representation for extreme minimalism */}
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
            <p className="text-gray-400 font-medium">Explore our curated collection</p>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            {[
              { name: 'Emerald Pro', color: 'Deep Green', price: '$1,099', accent: 'bg-dark-green' },
              { name: 'Gilded Pure', color: 'Satin Gold', price: '$1,299', accent: 'bg-aura-gold' },
              { name: 'Minimal Frost', color: 'Alpine White', price: '$999', accent: 'bg-white border border-gray-100' },
            ].map((product, i) => (
              <motion.div 
                key={i} 
                variants={itemVariants}
                className="bg-white rounded-[2.5rem] p-10 flex flex-col h-[550px] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-50 group"
              >
                <div className="mb-8">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.color}</span>
                  <h3 className="text-2xl font-semibold mt-1 group-hover:text-dark-green transition-colors">{product.name}</h3>
                </div>
                
                <div className="flex-grow flex items-center justify-center">
                  <div className={`w-[140px] h-[280px] ${product.accent} rounded-[2rem] shadow-xl relative overflow-hidden flex items-center justify-center`}>
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]"></div>
                    <Smartphone size={48} strokeWidth={0.5} className="text-white/20" />
                  </div>
                </div>

                <div className="mt-8 flex justify-between items-center">
                  <span className="text-2xl font-bold tracking-tight">{product.price}</span>
                  <button className="bg-apple-gray text-apple-text w-12 h-12 rounded-full flex items-center justify-center hover:bg-dark-green hover:text-white transition-all transform active:scale-90">
                    <ShoppingCart size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
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
              <span className="font-bold text-dark-green uppercase text-[10px] tracking-widest">Shop</span>
              <a href="#" className="text-gray-500 hover:text-dark-green">iPhone</a>
              <a href="#" className="text-gray-500 hover:text-dark-green">Samsung</a>
              <a href="#" className="text-gray-500 hover:text-dark-green">Accessories</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-bold text-dark-green uppercase text-[10px] tracking-widest">Aura OS</span>
              <a href="#" className="text-gray-500 hover:text-dark-green">Architecture</a>
              <a href="#" className="text-gray-500 hover:text-dark-green">Security</a>
              <a href="#" className="text-gray-500 hover:text-dark-green">Privacy</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-bold text-dark-green uppercase text-[10px] tracking-widest">Support</span>
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
