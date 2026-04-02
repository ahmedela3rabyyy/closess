import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Star, ChevronLeft, Plus, Minus, ShoppingBag, Check, Shield, Truck, RefreshCw } from 'lucide-react';
import { getProductById } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import Header from '../sections/Header';
import Footer from '../sections/Footer';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = getProductById(Number(id));
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

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
    if (product.sizes.length > 1 && !selectedSize) {
      alert('Please select a size');
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      subtitle: product.subtitle,
      image: product.image,
      price: product.price,
      size: selectedSize || product.sizes[0],
    });

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
            {/* Product Images (Grid Col 7) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="relative aspect-[3/4] bg-neutral-900 rounded-3xl overflow-hidden border border-white/10 group">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              {/* Image Thumbnails if any */}
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ scale: 0.95 }}
                    className="aspect-square bg-neutral-900 rounded-xl overflow-hidden border border-white/5 cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
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
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-gray-600 text-2xl line-through font-bold">
                    ${product.originalPrice}
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
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size) => (
                      <motion.button
                        key={size}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedSize(size)}
                        className={`w-14 h-14 rounded-xl border-2 font-black transition-all flex items-center justify-center ${
                          selectedSize === size
                            ? 'border-primary text-primary bg-primary/5'
                            : 'border-white/5 text-gray-500 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        {size}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Quantity & Actions */}
                <motion.div variants={itemVariants} className="space-y-6">
                  <div className="flex items-center justify-between p-2 bg-neutral-900 rounded-2xl border border-white/5 w-fit">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-white transition-colors"><Minus size={16} /></button>
                    <span className="w-12 text-center text-white font-black">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-white transition-colors"><Plus size={16} /></button>
                  </div>

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
