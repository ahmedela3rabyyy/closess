import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Eye, Star, ArrowRight } from 'lucide-react';
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
            <h2 className="text-white text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]">
              NEW <span className="italic text-primary">ARRIVALS</span>
            </h2>
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
      <div className="responsive-container">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {featuredProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              onClick={() => navigate(`/product/${product.id}`)}
              className="group cursor-pointer"
            >
              {/* Product Image Container */}
              <div className="relative aspect-[3/4] bg-neutral-900 overflow-hidden rounded-2xl border border-white/5 group-hover:border-primary/20 transition-colors duration-500">
                {/* Badges */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                  {product.isNew && (
                    <span className="bg-primary text-black text-[10px] font-black px-3 py-1.5 uppercase rounded-full flex items-center gap-2 shadow-xl">
                      <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
                      New
                    </span>
                  )}
                  {product.isSale && (
                    <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1.5 uppercase rounded-full shadow-xl">
                      Sale
                    </span>
                  )}
                  {product.soldOut && (
                    <span className="bg-neutral-800 text-gray-500 text-[10px] font-black px-3 py-1.5 uppercase rounded-full border border-white/10">
                      Archive
                    </span>
                  )}
                </div>

                {/* Dark Overlay on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                {/* Action Buttons (Floating) */}
                <div className="absolute top-4 right-4 z-20 flex flex-col gap-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => handleToggleWishlist(product, e)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all backdrop-blur-md shadow-2xl ${
                      isInWishlist(product.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white/10 text-white hover:bg-white hover:text-black'
                    }`}
                  >
                    <Heart size={20} className={isInWishlist(product.id) ? 'fill-current' : ''} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/${product.id}`);
                    }}
                    className="w-12 h-12 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-primary hover:text-black transition-all backdrop-blur-md shadow-2xl"
                  >
                    <Eye size={20} />
                  </motion.button>
                </div>

                {/* Product Image */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                />

                {/* Quick Add Button (Sliding up) */}
                {!product.soldOut && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => handleAddToCart(product, e)}
                    className="absolute bottom-6 left-6 right-6 z-20 bg-primary text-black py-4 font-black uppercase tracking-[0.2em] rounded-xl translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-3 shadow-2xl text-xs"
                  >
                    <ShoppingBag size={18} />
                    Add to Bag
                  </motion.button>
                )}
              </div>

              {/* Product Info */}
              <div className="mt-6 space-y-3 px-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={10}
                        className={
                          i < Math.floor(product.rating)
                            ? 'text-primary fill-primary'
                            : 'text-neutral-800'
                        }
                      />
                    ))}
                    <span className="text-gray-600 text-[10px] font-bold ml-1">({product.reviews})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-black text-lg tracking-tight">{settings.currency} {product.price}</span>
                    {product.originalPrice && (
                      <span className="text-gray-600 text-sm line-through font-bold">
                        {settings.currency} {product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-white text-sm font-black uppercase tracking-widest group-hover:text-primary transition-colors duration-300">
                    {product.name}
                  </h3>
                  <p className="text-gray-500 text-[10px] font-bold uppercase mt-1 tracking-[0.2em]">
                    {product.subtitle}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

