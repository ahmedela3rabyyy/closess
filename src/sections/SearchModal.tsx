import { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { searchProducts } from '../data/products';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query.length >= 2 ? searchProducts(query) : [];

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
    onClose();
    setQuery('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-[60] backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as any }}
            className="fixed inset-x-0 top-0 z-[70] p-4 md:p-12 lg:p-20"
          >
            <div className="max-w-4xl mx-auto">
              {/* Search Input Container */}
              <motion.div 
                initial={{ width: '80%' }}
                animate={{ width: '100%' }}
                className="relative group mx-auto"
              >
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                  <Search className="text-gray-500 group-focus-within:text-primary transition-colors" size={28} />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="SEARCH PRODUCTS..."
                  className="w-full bg-neutral-900 border border-white/10 text-white pl-20 pr-16 py-6 rounded-3xl text-2xl font-black italic tracking-tighter focus:border-primary focus:outline-none shadow-2xl transition-all"
                />
                <button
                  onClick={onClose}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X size={24} />
                </button>
              </motion.div>

              {/* Results Container */}
              <AnimatePresence mode="wait">
                {query.length >= 2 ? (
                  <motion.div 
                    key="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-8 bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.5)] max-h-[65vh] overflow-y-auto"
                  >
                    {results.length === 0 ? (
                      <div className="p-20 text-center">
                        <p className="text-gray-500 font-black uppercase tracking-widest">
                          No matches found for <span className="text-white italic">"{query}"</span>
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-white/5">
                        {results.map((product, i) => (
                          <motion.button
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            key={product.id}
                            onClick={() => handleProductClick(product.id)}
                            className="w-full flex items-center gap-6 p-6 hover:bg-white/5 transition-all text-left group"
                          >
                            <div className="w-20 h-24 bg-neutral-800 rounded-xl overflow-hidden flex-shrink-0 border border-white/5 group-hover:border-primary/50 transition-colors">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              />
                            </div>
                            <div className="flex-1 space-y-1">
                              <h3 className="text-white text-xl font-black italic tracking-tighter uppercase group-hover:text-primary transition-colors">
                                {product.name}
                              </h3>
                              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                                {product.subtitle}
                              </p>
                              <p className="text-primary font-black text-lg mt-2">
                                ${product.price}
                              </p>
                            </div>
                            <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-4 transition-all">
                              <ArrowRight className="text-primary" size={24} />
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="suggestions"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-12 text-center"
                  >
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.5em] mb-8">
                      Trending Searches
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                      {['Sweater', 'Knitted', 'Premium', 'Men', 'Women', 'Accessories'].map(
                        (term) => (
                          <motion.button
                            key={term}
                            whileHover={{ scale: 1.05, borderColor: '#00bfff', color: '#00bfff' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setQuery(term)}
                            className="px-8 py-4 bg-neutral-900 border border-white/10 text-gray-400 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl"
                          >
                            {term}
                          </motion.button>
                        )
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

