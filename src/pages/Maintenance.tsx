// Maintenance.tsx
import { motion } from 'framer-motion';
import { Hammer, Sparkles, Clock } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const Maintenance = () => {
  const { settings } = useSettings();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 overflow-hidden relative">
      {/* Background Cinematic Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(0,191,255,0.05),_transparent_70%)]" />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ repeat: Infinity, duration: 8 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]" 
      />

      <div className="max-w-2xl w-full text-center relative z-10 space-y-12">
        {/* Animated Brand Logo */}
        <div className="relative inline-block">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative flex items-center justify-center"
          >
            <span className="text-6xl md:text-8xl font-extralight italic tracking-tighter text-white/90">NY</span>
            <div className="relative ml-2">
              <span className="text-6xl md:text-8xl font-black italic tracking-tighter text-white">X</span>
              <div className="absolute inset-0 bg-primary clip-x-slash mix-blend-screen shadow-[0_0_50px_#00bfff]" />
            </div>
          </motion.div>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            className="absolute -inset-10 border border-white/5 rounded-full border-dashed" 
          />
        </div>

        {/* Content Section */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-3 text-primary"
          >
            <Hammer size={20} className="animate-bounce" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">System Upgrade Active</span>
            <Sparkles size={20} className="animate-pulse" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-white text-3xl md:text-5xl font-black italic uppercase tracking-tighter"
          >
            Evolving <span className="text-primary">Architecture</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-gray-500 text-lg md:text-xl italic font-medium max-w-lg mx-auto leading-relaxed"
          >
            {settings.maintenanceMessage}
          </motion.p>
        </div>

        {/* Info Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-10"
        >
          <div className="p-6 bg-neutral-950 border border-white/5 rounded-3xl space-y-2">
            <Clock className="text-primary mx-auto mb-4" size={24} />
            <p className="text-white font-black text-xs uppercase tracking-widest">Expected Reset</p>
            <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">Protocol T-Minus 2H</p>
          </div>
          <div className="p-6 bg-neutral-950 border border-white/5 rounded-3xl space-y-2">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white font-black text-xs uppercase tracking-widest">Ecosystem Status</p>
            <p className="text-primary text-[10px] font-bold uppercase tracking-widest animate-pulse">Syncing Integrity</p>
          </div>
          <div className="hidden md:block p-6 bg-neutral-950 border border-white/5 rounded-3xl space-y-2">
            <div className="flex justify-center -space-x-2 mb-4">
               {[...Array(3)].map((_, i) => <div key={i} className="w-8 h-8 rounded-full border border-black bg-neutral-900 flex items-center justify-center text-[10px] font-black text-white">A</div>)}
            </div>
            <p className="text-white font-black text-xs uppercase tracking-widest">Active Admins</p>
            <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">2 Units Deploying</p>
          </div>
        </motion.div>

        {/* Support Gateway */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="pt-10 flex flex-col items-center gap-4"
        >
           <p className="text-gray-700 text-[8px] font-black uppercase tracking-[0.5em]">Emergency Communication Protocol</p>
           <div className="flex gap-4">
              <a href={`https://wa.me/${settings.whatsappNumber}`} className="text-white/40 hover:text-primary transition-colors text-[10px] font-black uppercase tracking-widest">Direct Admin Hub</a>
              <div className="w-1 h-1 rounded-full bg-gray-800 self-center" />
              <a href={`mailto:${settings.email}`} className="text-white/40 hover:text-primary transition-colors text-[10px] font-black uppercase tracking-widest">Data Transmission</a>
           </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Maintenance;
