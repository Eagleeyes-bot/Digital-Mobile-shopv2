import React, { useState } from 'react';
import { Users, ShieldCheck, Activity, DollarSign, Lock, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';

export default function SuperAdminDashboard() {
  const { theme } = useTheme();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Artificial delay for "encryption verification" feel
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (passcode === '193431') {
      setIsUnlocked(true);
      setPasscodeError(false);
    } else {
      setPasscodeError(true);
      setPasscode('');
      setTimeout(() => setPasscodeError(false), 2000);
    }
    setIsSubmitting(false);
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0c0c0c] flex items-center justify-center p-6 font-sans transition-colors duration-500">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5 rounded-[3.5rem] p-12 text-center shadow-2xl relative overflow-hidden"
        >
          {/* Professional Security Logo */}
          <div className="relative mb-10">
            <div className="w-24 h-24 bg-[#0c0f53] dark:bg-primary-gold rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-blue-900/20 dark:shadow-primary-gold/20 relative z-10">
              <Lock size={40} className="text-white" strokeWidth={1.5} />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary-gold/10 dark:bg-primary-gold/5 rounded-full animate-ping opacity-20"></div>
          </div>
          
          <h2 className="text-3xl font-black tracking-tight mb-2 text-apple-text dark:text-white uppercase italic flex items-center justify-center gap-2">
            Level 7 Access <span className="text-primary-gold">$</span>
          </h2>
          <p className="text-gray-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] mb-12">Universal Control Terminal</p>
          
          <form onSubmit={handleUnlock} className="space-y-6">
            <div className="relative">
              <input 
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="••••••"
                className={`w-full bg-apple-gray dark:bg-black/40 border ${passcodeError ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-transparent dark:border-white/5'} rounded-2xl px-6 py-6 text-center text-3xl tracking-[1em] font-mono focus:outline-none focus:border-primary-gold transition-all text-apple-text dark:text-white`}
                autoFocus
                required
              />
              <AnimatePresence>
                {passcodeError && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute -bottom-8 left-0 right-0 flex items-center justify-center gap-2 text-red-500 font-bold text-[10px] uppercase tracking-widest"
                  >
                    <AlertCircle size={12} /> Access Denied
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-6 bg-[#0c0f53] dark:bg-primary-gold text-white rounded-2xl text-xs font-black uppercase tracking-[0.3em] shadow-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Decrypt Interface'}
            </button>
          </form>
          
          <div className="mt-12 pt-8 border-t border-black/5 dark:border-white/5 flex items-center justify-center gap-3 text-[9px] text-gray-400 dark:text-gray-600 font-bold uppercase tracking-widest">
            <ShieldCheck size={14} className="text-green-500" /> AES-256 Protocol Active
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#0c0c0c] p-12 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex justify-between items-end">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-4 mb-1">
              <h1 className="text-4xl font-bold tracking-tight text-[#1D1D1F] dark:text-white">System Control</h1>
              <div className="w-10 h-10 bg-primary-gold rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary-gold/20">
                $
              </div>
            </div>
            <p className="text-[#86868B] dark:text-gray-500 text-lg font-medium">Super Admin Overview & Logistics</p>
          </motion.div>
          <div className="flex gap-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/10 px-4 py-2 rounded-full border border-green-100 dark:border-green-900/20">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="uppercase tracking-widest">Database Linked</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {[
            { label: 'Total Revenue', value: '$2.4M', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/10' },
            { label: 'Platform Users', value: '14,204', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/10' },
            { label: 'System Health', value: '99.9%', icon: Activity, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/10' },
            { label: 'Security Audits', value: 'Passed', icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/10' },
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20, delay: i * 0.1 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#1a1a1a] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>
                <stat.icon size={24} />
              </div>
              <div className="text-[10px] font-bold text-[#86868B] dark:text-gray-500 uppercase tracking-[0.15em] mb-2">{stat.label}</div>
              <div className="text-3xl font-bold tracking-tight dark:text-white">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#1a1a1a] p-10 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#86868B] dark:text-gray-500">User Management</h3>
              <span className="text-[10px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/10 px-2 py-1 rounded tracking-widest uppercase">RBAC Verified</span>
            </div>
            <div className="space-y-6">
              {[
                { name: 'John Doe', role: 'Admin', email: 'john@aura.com' },
                { name: 'Sarah Smith', role: 'Admin', email: 'sarah@aura.com' },
                { name: 'Mike Ross', role: 'Staff', email: 'mike@aura.com' },
              ].map((user, i) => (
                <div key={i} className="flex justify-between items-center pb-6 border-b border-gray-50 dark:border-white/5 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center font-bold text-gray-400 text-xs">{user.name[0]}</div>
                    <div>
                      <div className="font-semibold text-sm dark:text-white">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 text-[10px] font-bold uppercase tracking-widest rounded-full">{user.role}</span>
                </div>
              ))}
            </div>
            <button className="mt-10 w-full py-4 bg-black dark:bg-primary-gold text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:opacity-80 transition-opacity">
              Manage Access Control
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#1a1a1a] p-10 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm flex flex-col"
          >
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#86868B] dark:text-gray-500 mb-8">System Activity</h3>
            <div className="flex-grow space-y-4 font-mono text-[11px] bg-gray-50 dark:bg-black/20 p-6 rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
              {[
                { time: '12:45:01', event: 'Inventory Sync successful', type: 'info' },
                { time: '12:40:22', event: 'New Super Admin login: eagleeye', type: 'security' },
                { time: '11:59:12', event: 'Backup initiated', type: 'info' },
                { time: '10:30:55', event: 'API Warning: High latency', type: 'error' },
              ].map((log, i) => (
                <div key={i} className="flex gap-4 p-2 rounded-lg hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
                  <span className="text-gray-400 dark:text-gray-600 shrink-0 font-medium">{log.time}</span>
                  <span className={`${log.type === 'error' ? 'text-red-500 font-bold' : log.type === 'security' ? 'text-blue-500 font-semibold text-blue-400/80' : 'text-gray-600 dark:text-gray-400'}`}>
                    [{log.type.toUpperCase()}] {log.event}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

