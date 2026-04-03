import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star, ArrowRight } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useSettings } from '../context/SettingsContext';

export default function Products() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { settings } = useSettings();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { products } = useProducts();

  // Get only first 4 products for homepage
  const featuredProducts = products.slice(0, 4);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }
    }
  };

  const handleAddToCart = (product: (typeof products)[0], e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.soldOut) return;
    addToCart({
      id: product.id,
      name: product.name,
      subtitle: product.subtitle,
      image: product.image,
      price: product.price,
    }, 1);
  };

  const handleToggleWishlist = (product: (typeof products)[0], e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist({
      id: product.id,
      name: product.name,
      subtitle: product.subtitle,
      image: product.image,
      price: product.price,
    });
  };

  return (
    <section className="bg-black section-padding">
      {/* Section Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="responsive-container mb-16"
      >
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-primary uppercase tracking-[0.4em] text-[10px] md:text-xs font-bold mb-4 block">
              Featured Collection
            </span>
            <h2 className="text-white text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] flex flex-col italic">
              <span className="text-white">NEW</span>
              <span className="text-primary -mt-2 md:-mt-4">ARRIVALS</span>
            </h2>
            <div className="w-16 md:w-24 h-1 bg-primary mt-4" />
            <p className="text-gray-500 mt-6 text-sm md:text-base max-w-md font-medium uppercase tracking-widest leading-relaxed">
              On all orders over {settings.currency} {settings.shippingThreshold}. Experience the pinnacle of knitwear design.
            </p>
          </div>
          <motion.button
            whileHover={{ x: 10 }}
            onClick={() => navigate('/shop')}
            className="group inline-flex items-center gap-3 text-primary font-black uppercase tracking-[0.2em] text-xs"
          >
            Explore All
            <div className="w-12 h-[2px] bg-primary group-hover:w-16 transition-all" />
            <ArrowRight size={18} />
          </motion.button>
        </div>
      </motion.div>

      {/* Products Grid */}
      <div className="px-2 md:px-0">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-8 lg:gap-10"
        >
          {featuredProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              onClick={() => navigate(`/product/${product.id}`)}
              className="group cursor-pointer"
            >
              {/* Product Image Container */}
              <div className="relative aspect-[3/4.2] bg-neutral-900 overflow-hidden rounded-xl md:rounded-2xl border border-white/5 group-hover:border-primary/20 transition-colors duration-500 shadow-2xl">
                {/* Badges */}
                <div className="absolute top-2 left-2 md:top-4 md:left-4 z-10 flex flex-col gap-1.5 md:gap-2">
                  {product.isNew && (
                    <span className="bg-primary text-black text-[7px] md:text-[10px] font-black px-2 py-0.5 md:px-3 md:py-1.5 uppercase rounded-full flex items-center gap-1 md:gap-1.5 shadow-xl">
                      <span className="w-1 md:w-1.5 h-1 md:h-1.5 bg-black rounded-full animate-pulse" />
                      New
                    </span>
                  )}
                  {product.isSale && (
                    <span className="bg-gradient-to-r from-red-600 to-red-500 text-white text-[7px] md:text-[10px] font-black px-2 py-0.5 md:px-3 md:py-1.5 uppercase rounded-full shadow-lg border border-red-400/20">
                      Sale
                    </span>
                  )}
                  {product.soldOut && (
                    <span className="bg-white/10 text-white/60 text-[7px] md:text-[10px] font-black px-2 py-0.5 md:px-3 md:py-1.5 uppercase rounded-full border border-white/10 backdrop-blur-md">
                      Sold Out
                    </span>
                  )}
                </div>

                {/* Wishlist Button - Now always visible on Mobile */}
                <div className="absolute top-2 right-2 md:top-4 md:right-4 z-20">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => handleToggleWishlist(product, e)}
                    className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all backdrop-blur-md shadow-2xl ${
                      isInWishlist(product.id)
                        ? 'bg-red-500 text-white shadow-red-500/20'
                        : 'bg-black/40 text-white border border-white/10'
                    }`}
                  >
                    <Heart size={14} className={`${isInWishlist(product.id) ? 'fill-current' : ''} md:scale-125`} />
                  </motion.button>
                </div>

                {/* Subtle Bottom Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 md:opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Product Image */}
                <img
                  src={product.image}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110 ${product.soldOut ? 'grayscale opacity-40' : ''}`}
                />

                {/* Quick Add Button (Sliding up) - Desktop Only */}
                {!product.soldOut && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => handleAddToCart(product, e)}
                    className="absolute bottom-6 left-6 right-6 z-20 bg-primary text-black py-4 font-black uppercase tracking-[0.2em] rounded-xl translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hidden md:flex items-center justify-center gap-3 shadow-2xl text-xs"
                  >
                    <ShoppingBag size={18} />
                    Add to Bag
                  </motion.button>
                )}
              </div>

              {/* Product Info */}
              <div className="mt-2 md:mt-6 space-y-1 px-1">
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-white text-[11px] md:text-sm font-black uppercase tracking-tight group-hover:text-primary transition-colors duration-300 line-clamp-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-500 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] line-clamp-1">
                      {product.subtitle}
                    </p>
                    <div className="flex items-center gap-0.5">
                      <Star size={8} className="text-primary fill-primary" />
                      <span className="text-gray-600 text-[8px] font-bold">{product.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-baseline gap-1.5 pt-0.5">
                  <span className="text-primary font-black text-sm md:text-lg tracking-tight">
                    {settings.currency} {product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-gray-700 text-[10px] md:text-sm line-through font-bold opacity-60">
                      {settings.currency} {product.originalPrice}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

