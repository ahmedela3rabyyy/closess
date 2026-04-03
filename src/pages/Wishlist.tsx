import { Heart, X, ArrowLeft, Eye, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useSettings } from '../context/SettingsContext';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../sections/Header';
import Footer from '../sections/Footer';

export default function Wishlist() {
  const navigate = useNavigate();
  const { items, removeFromWishlist } = useWishlist();
  const { settings } = useSettings();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
    }
  };

  return (
    <div className="min-h-screen bg-black selection:bg-primary selection:text-black">
      <Header />

      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <button
                onClick={() => navigate('/')}
                className="group flex items-center gap-3 text-gray-500 hover:text-white transition-all mb-4"
              >
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-primary group-hover:text-primary transition-all">
                  <ArrowLeft size={14} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Back to Gallery</span>
              </button>
              
              <h1 className="text-white text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none">
                My <span className="text-primary italic">Favorites</span>
              </h1>
              <div className="flex items-center gap-4">
                <div className="h-[1px] w-12 bg-primary/40" />
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">
                  {items.length} Curated {items.length === 1 ? 'Piece' : 'Pieces'}
                </p>
              </div>
            </motion.div>

            {items.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hidden md:block"
              >
                <p className="text-gray-600 text-[9px] font-black uppercase tracking-[0.5em] mb-2">Sync Protocol Active</p>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary/20 animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-primary/20 animate-pulse delay-75" />
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150" />
                </div>
              </motion.div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {items.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                className="text-center py-32 border border-white/5 bg-neutral-950/20 rounded-[60px] relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,191,255,0.05),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/5 relative">
                    <Heart size={32} className="text-gray-800" />
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ repeat: Infinity, duration: 4 }}
                      className="absolute inset-0 bg-primary/10 rounded-full blur-xl" 
                    />
                  </div>
                  <h2 className="text-white text-3xl font-black uppercase tracking-tight mb-4 italic">
                    The Archive is <span className="text-primary italic">Empty</span>
                  </h2>
                  <p className="text-gray-500 text-sm font-medium mb-10 max-w-xs mx-auto italic">
                    Discover our latest neural drops and save your favorites here.
                  </p>
                  <button
                    onClick={() => navigate('/shop')}
                    className="group relative px-10 py-5 bg-primary text-black font-black uppercase tracking-[0.3em] text-[10px] overflow-hidden transition-all hover:bg-white hover:scale-105 active:scale-95"
                  >
                    <span className="relative z-10">Start Discovery</span>
                    <div className="absolute inset-0 bg-white/40 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10"
              >
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    layout
                    className="group relative"
                  >
                    {/* Card Container */}
                    <div className="relative aspect-[3/4] rounded-[32px] overflow-hidden border border-white/5 bg-neutral-950 transition-all duration-700 group-hover:border-primary/30 group-hover:shadow-[0_0_40px_rgba(0,191,255,0.1)]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:opacity-60"
                      />
                      
                      {/* Interactive Layers */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                      
                      {/* Floating Actions */}
                      <div className="absolute top-6 right-6 flex flex-col gap-3">
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all duration-300 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0"
                        >
                          <X size={20} />
                        </button>
                      </div>

                      {/* Content Overlay */}
                      <div className="absolute inset-x-0 bottom-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                        <div className="space-y-1 mb-6">
                          <p className="text-primary text-[9px] font-black uppercase tracking-[0.3em] font-serif italic mb-2">NYX Collection</p>
                          <h3 className="text-white text-xl font-black uppercase tracking-tighter leading-none italic">
                            {item.name}
                          </h3>
                          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest truncate">
                            {item.subtitle}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-white text-lg font-black italic">
                            {settings.currency} {item.price}
                          </span>
                          <button
                            onClick={() => navigate(`/product/${item.id}`)}
                            className="bg-primary text-black w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-[0_0_20px_rgba(0,191,255,0.3)]"
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                      </div>

                      {/* Quick Add Label for UX */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
                          <Sparkles size={14} className="text-primary" />
                          <span className="text-white text-[9px] font-black uppercase tracking-[0.2em]">Explore Piece</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
