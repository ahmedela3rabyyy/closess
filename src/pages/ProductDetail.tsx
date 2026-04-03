import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, ChevronLeft, Plus, Minus, ShoppingBag, Check, Shield, Truck, RefreshCw } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useSettings } from '../context/SettingsContext';
import Header from '../sections/Header';
import Footer from '../sections/Footer';
import { toast } from 'sonner';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById } = useProducts();
  const { settings } = useSettings();
  const product = getProductById(Number(id));
  
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  
  // Gallery Engine States
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const autoPlayTimerRef = useRef<any>(null);

  const allImages = product ? [product.image, ...(product.images || [])] : [];

  // Auto-play logic
  useEffect(() => {
    if (!isHovering && allImages.length > 1) {
      autoPlayTimerRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % allImages.length);
      }, 5000);
    }
    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [allImages.length, isHovering]);

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4 uppercase tracking-widest">Product not found</p>
          <button
            onClick={() => navigate('/')}
            className="bg-primary text-black px-8 py-4 font-black uppercase tracking-[0.2em] hover:bg-white transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product.soldOut) return;
    
    // Get current stock for the selected size
    const availableStock = selectedSize ? (product.sizeStock[selectedSize] || 0) : 0;
    
    // Check if requested quantity exceeds stock
    if (quantity > availableStock) {
      toast.error(`Only ${availableStock} pieces available in this size!`);
      setQuantity(Math.max(1, availableStock));
      return;
    }

    if (product.sizes.length > 1 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      subtitle: product.subtitle,
      image: product.image,
      price: product.price,
      size: selectedSize || (product.sizes[0] !== 'One Size' ? product.sizes[0] : 'One Size'),
    }, quantity);

    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 2000);
  };

  const handleToggleWishlist = () => {
    toggleWishlist({
      id: product.id,
      name: product.name,
      subtitle: product.subtitle,
      image: product.image,
      price: product.price,
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="pt-32 pb-20 overflow-hidden">
        <div className="responsive-container">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/')}
            className="flex items-center gap-3 text-gray-500 hover:text-primary transition-colors mb-12 group"
          >
            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-primary">
              <ChevronLeft size={16} />
            </div>
            <span className="text-xs font-black uppercase tracking-widest">Back to Collection</span>
          </motion.button>

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Product Gallery (Grid Col 7) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7 space-y-6"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="relative aspect-[3/4] bg-neutral-950 rounded-3xl overflow-hidden border border-white/5 shadow-2xl group cursor-zoom-in">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeIndex}
                    src={allImages[activeIndex]}
                    alt={product.name}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                
                {/* Visual Depth Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Glowing Progress Bar */}
                {allImages.length > 1 && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
                    <motion.div
                      key={activeIndex + (isHovering ? '-paused' : '-playing')}
                      initial={{ width: "0%" }}
                      animate={isHovering ? { width: "100%" } : { width: "100%" }}
                      transition={isHovering ? { duration: 0 } : { duration: 5, ease: "linear" }}
                      className="h-full bg-primary shadow-[0_0_15px_#00BFFF]"
                    />
                  </div>
                )}
                
                {/* Image Counter Badge */}
                <div className="absolute top-6 right-6 glass px-4 py-2 rounded-full border border-white/10 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {activeIndex + 1} / {allImages.length}
                </div>
              </div>
              
              {/* Magnetic Interactive Thumbnails */}
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
                {allImages.map((img, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setActiveIndex(idx);
                      // Reset interval timer manually on click
                      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
                    }}
                    className={`relative aspect-square bg-neutral-900 rounded-xl overflow-hidden border transition-all cursor-pointer ${
                      activeIndex === idx 
                        ? 'border-primary shadow-[0_0_20px_rgba(0,191,255,0.2)]' 
                        : 'border-white/5 grayscale hover:grayscale-0'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    {activeIndex === idx && (
                      <motion.div 
                        layoutId="active-thumb"
                        className="absolute inset-0 border-2 border-primary rounded-xl"
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Product Info (Grid Col 5) */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-5 space-y-10"
            >
              <div className="space-y-4">
                {/* Badges */}
                <motion.div variants={itemVariants} className="flex gap-3">
                  {product.isNew && <span className="glass px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-primary border-primary/20">New Season</span>}
                  {product.isSale && <span className="bg-red-500/10 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-red-500 border border-red-500/20">Sale</span>}
                  {product.soldOut && <span className="bg-white/10 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400">Sold Out</span>}
                </motion.div>

                <motion.div variants={itemVariants}>
                  <h1 className="text-white text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9]">
                    {product.name}
                  </h1>
                  <p className="text-gray-500 text-lg md:text-xl font-bold uppercase tracking-[0.2em] mt-2">
                    {product.subtitle}
                  </p>
                </motion.div>

                {/* Rating */}
                <motion.div variants={itemVariants} className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < Math.floor(product.rating) ? 'text-primary fill-primary' : 'text-neutral-800'} />
                  ))}
                  <span className="text-gray-500 text-xs font-bold ml-2 uppercase tracking-widest">({product.reviews} Verification Reviews)</span>
                </motion.div>
              </div>

              {/* Price */}
              <motion.div variants={itemVariants} className="flex items-baseline gap-6">
                <span className="text-primary text-5xl font-black tracking-tight">
                  {settings.currency} {product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-gray-600 text-2xl line-through font-bold">
                    {settings.currency} {product.originalPrice}
                  </span>
                )}
              </motion.div>

              <motion.p variants={itemVariants} className="text-gray-400 leading-relaxed text-base font-medium max-w-md">
                {product.description}
              </motion.p>

              <div className="space-y-8">
                {/* Size Selector */}
                <motion.div variants={itemVariants}>
                  <div className="flex justify-between mb-4">
                    <label className="text-white text-[10px] font-black uppercase tracking-[0.3em]">Select Size</label>
                    <button className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] hover:text-white transition-colors">Size Guide</button>
                  </div>
                  <div className="flex flex-wrap gap-4">
                  {product.sizes.map((size: string) => {
                    const isAvailable = (product.sizeStock[size] || 0) > 0;
                    const isLowStock = isAvailable && product.sizeStock[size] < 3;
                    
                    return (
                      <button
                        key={size}
                        disabled={!isAvailable}
                        onClick={() => setSelectedSize(size)}
                        className={`
                          relative min-w-[70px] h-[55px] rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all duration-500
                          ${!isAvailable 
                            ? 'bg-neutral-900/50 text-gray-700 border border-white/5 cursor-not-allowed overflow-hidden' 
                            : selectedSize === size
                              ? 'bg-primary text-black shadow-[0_0_25px_rgba(0,191,255,0.4)] scale-105'
                              : 'bg-neutral-900 text-white border border-white/10 hover:border-primary/50 hover:bg-neutral-800'
                          }
                        `}
                      >
                        {size}
                        {!isAvailable && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-[1px] bg-red-500/50 rotate-[-15deg] scale-x-110" />
                            <span className="absolute bottom-1 right-2 text-[6px] text-red-500/80 font-black italic">SOLD OUT</span>
                          </div>
                        )}
                        {isLowStock && (
                          <motion.div 
                            animate={{ opacity: [1, 0.4, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="absolute top-1 right-2 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_#00BFFF]"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
                </motion.div>

                {/* Quantity & Actions */}
                <motion.div variants={itemVariants} className="space-y-6">
                  <div className="flex items-center justify-between p-2 bg-neutral-900 rounded-2xl border border-white/5 w-fit">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-white transition-colors"><Minus size={16} /></button>
                    <span className="w-12 text-center text-white font-black">{quantity}</span>
                    <button 
                      onClick={() => {
                        const availableStock = selectedSize ? (product.sizeStock[selectedSize] || 0) : 0;
                        if (quantity < availableStock) {
                          setQuantity(quantity + 1);
                        } else {
                          toast.error(selectedSize ? `Limit reached: ${availableStock} pieces max for size ${selectedSize}` : "Please select a size first");
                        }
                      }} 
                      className={`w-10 h-10 flex items-center justify-center transition-colors ${(!selectedSize || quantity >= (product.sizeStock[selectedSize] || 0)) ? 'text-gray-800 cursor-not-allowed' : 'text-gray-500 hover:text-white'}`}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  {selectedSize && (product.sizeStock[selectedSize] || 0) <= 5 && (product.sizeStock[selectedSize] || 0) > 0 && (
                    <motion.p 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }}
                      className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2"
                    >
                      ⚠️ HURRY! ONLY {product.sizeStock[selectedSize]} PIECES LEFT IN SIZE {selectedSize}
                    </motion.p>
                  )}

                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddToCart}
                      disabled={product.soldOut}
                      className={`flex-1 py-5 rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all text-sm ${
                        product.soldOut
                          ? 'bg-neutral-800 text-gray-600 cursor-not-allowed'
                          : 'bg-primary text-black hover:bg-white btn-shine-premium'
                      }`}
                    >
                      {product.soldOut ? 'Sold Out' : showAddedMessage ? (
                        <>
                          <Check size={20} />
                          Added to Bag
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={20} />
                          Add to Bag
                        </>
                      )}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02, borderColor: '#ef4444' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleToggleWishlist}
                      className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center transition-all ${
                        isInWishlist(product.id)
                          ? 'border-red-500 text-red-500 bg-red-500/5'
                          : 'border-white/5 text-gray-500 hover:text-red-500'
                      }`}
                    >
                      <Heart size={24} className={isInWishlist(product.id) ? 'fill-current' : ''} />
                    </motion.button>
                  </div>
                </motion.div>
              </div>

              {/* Trust Badges */}
              <motion.div variants={itemVariants} className="pt-10 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { icon: Truck, text: 'Free Express Shipping' },
                  { icon: Shield, text: '2-Year Warranty' },
                  { icon: RefreshCw, text: '30-Day Returns' }
                ].map((badge, i) => (
                  <div key={i} className="flex flex-col items-center sm:items-start gap-2">
                    <badge.icon size={20} className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 text-center sm:text-left">{badge.text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
