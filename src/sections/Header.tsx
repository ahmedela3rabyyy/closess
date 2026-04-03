import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Search, User, ShoppingBag, X, Heart, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useSettings } from '../context/SettingsContext';
import SearchModal from './SearchModal';

export default function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { settings } = useSettings();

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'NEW ARRIVALS', path: '/shop' },
    { name: 'MEN', path: '/shop?category=men' },
    { name: 'WOMEN', path: '/shop?category=women' },
    { name: 'ACCESSORIES', path: '/shop?category=accessories' },
    { name: 'SALE', path: '/shop?sale=true' },
  ];


  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          (isScrolled || (location.pathname !== '/' && location.pathname !== '/shop')) 
            ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 py-3 md:py-2' 
            : 'bg-transparent py-5 md:py-4'
        }`}
      >
        <AnimatePresence>
          {(!isScrolled && settings.showAnnouncement) && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-primary/10 border-b border-primary/20 mb-2"
            >
              <p className="text-center text-primary text-[10px] md:text-xs uppercase tracking-[0.3em] py-2 font-medium px-4">
                {settings.announcementText}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-full flex items-center justify-between">
          {/* Left: Menu & Search */}
          <div className="flex items-center gap-2 md:gap-6 w-1/3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(true)}
              className="text-white p-2.5 hover:bg-white/5 rounded-full transition-colors flex items-center gap-2 group"
            >
              <Menu size={22} className="md:w-6 md:h-6" />
              <span className="hidden md:block text-[10px] font-bold uppercase tracking-[0.2em] group-hover:text-primary transition-colors">Menu</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSearchOpen(true)}
              className="text-white p-2.5 hover:bg-white/5 rounded-full transition-colors"
            >
              <Search size={22} className="md:w-6 md:h-6" />
            </motion.button>
          </div>

          <div className="flex justify-center w-1/3">
            <Link to="/" className="group relative">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center"
              >
                <div className="relative flex items-center">
                  {/* The "NY" - Sleek and High-end */}
                  <span className="text-3xl md:text-4xl font-extralight italic tracking-tighter text-white/90">
                    NY
                  </span>
                  
                  {/* The "X" - Integrated & Luminous */}
                  <div className="relative ml-0.5">
                    <span className="text-3xl md:text-4xl font-black italic tracking-tighter text-white">
                      X
                    </span>
                    {/* The Cyan Slash Overlay */}
                    <motion.div 
                      initial={{ opacity: 0.4 }}
                      animate={{ opacity: [0.4, 0.8, 0.4] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 bg-primary clip-x-slash mix-blend-screen shadow-[0_0_20px_#00bfff]"
                    />
                  </div>

                  {/* The North Star Dot */}
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -top-1 left-[40%] w-1 h-1 rounded-full bg-primary shadow-[0_0_8px_#00bfff]"
                  />
                </div>
              </motion.div>
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center justify-end gap-1 md:gap-4 w-1/3">
            <Link to="/wishlist">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-white p-2.5 hover:bg-white/5 rounded-full transition-colors relative"
              >
                <Heart size={22} className={`${wishlistCount > 0 ? 'fill-primary text-primary' : ''} md:w-6 md:h-6`} />
                {wishlistCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-primary text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </motion.div>
            </Link>
            
            <Link to="/auth" className="hidden sm:block">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-white p-2.5 hover:bg-white/5 rounded-full transition-colors"
              >
                <User size={22} className="md:w-6 md:h-6" />
              </motion.div>
            </Link>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsCartOpen(true)}
              className="text-white p-2.5 hover:bg-white/5 rounded-full transition-colors relative"
            >
              <ShoppingBag size={22} className="md:w-6 md:h-6" />
              {totalItems > 0 && (
                <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-primary text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </motion.button>
          </div>
        </div>


      </header>

      {/* Mobile Menu Overlay - Moved outside header for absolute z-index control */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-[999]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 bottom-0 w-[85%] max-w-xs bg-black border-r border-white/10 shadow-[20px_0_50px_rgba(0,0,0,0.8)] p-8 pt-24"
            >
              {/* Close Button Inside Sidebar */}
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex flex-col gap-8">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-3xl font-black italic tracking-tighter text-white hover:text-primary transition-colors flex items-center justify-between group"
                    >
                      {item.name}
                      <ArrowRight className="opacity-0 group-hover:opacity-100 -rotate-45 transition-all text-primary" size={20} />
                    </Link>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-20 pt-10 border-t border-white/5 flex flex-col gap-6 font-bold uppercase tracking-widest text-xs">
                <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-gray-500 hover:text-white transition-colors">About Us</Link>
                <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="text-gray-500 hover:text-white transition-colors">Contact</Link>
                <Link to="/faq" onClick={() => setIsMenuOpen(false)} className="text-gray-500 hover:text-white transition-colors">Support</Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

