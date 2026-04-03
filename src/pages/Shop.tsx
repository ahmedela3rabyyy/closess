import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Filter, ChevronDown, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import Header from '../sections/Header';
import Footer from '../sections/Footer';

const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'men', name: 'Men' },
  { id: 'women', name: 'Women' },
  { id: 'accessories', name: 'Accessories' },
];

const sortOptions = [
  { id: 'newest', name: 'Newest' },
  { id: 'price-low', name: 'Price: Low to High' },
  { id: 'price-high', name: 'Price: High to Low' },
  { id: 'name', name: 'Name A-Z' },
];

export default function Shop() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { settings } = useSettings();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { products } = useProducts();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Filter products by category
  const getFilteredProducts = () => {
    let filtered = selectedCategory === 'all' 
      ? products 
      : products.filter(p => p.category === selectedCategory);

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
        default:
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      }
    });
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Sort & Filter Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
            <div>
              <h1 className="text-white text-4xl md:text-5xl font-black uppercase tracking-tighter italic">
                SHOP <span className="text-primary italic">ALL</span>
              </h1>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">
                Discover {filteredProducts.length} Exclusive Pieces
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 text-white px-6 py-3 rounded-full hover:border-primary/30 transition-all font-bold uppercase text-[10px] tracking-widest w-full md:w-auto justify-between"
              >
                <div className="flex items-center gap-2">
                  <Filter size={14} className="text-primary" />
                  <span>Sort By: {sortOptions.find((o) => o.id === sortBy)?.name}</span>
                </div>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 ${showSortDropdown ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {showSortDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 left-0 md:left-auto top-full mt-2 w-full md:w-60 bg-neutral-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden z-20 shadow-2xl"
                  >
                    {sortOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => {
                          setSortBy(option.id);
                          setShowSortDropdown(false);
                        }}
                        className={`w-full text-left px-5 py-4 hover:bg-white/5 transition-colors text-[10px] font-bold uppercase tracking-widest ${
                          sortBy === option.id ? 'text-primary bg-primary/5' : 'text-gray-400'
                        }`}
                      >
                        {option.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-nowrap overflow-x-auto pb-4 gap-3 no-scrollbar mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-8 py-3 rounded-full font-black uppercase tracking-widest text-[10px] whitespace-nowrap transition-all duration-300 border ${
                  selectedCategory === category.id
                    ? 'bg-primary text-black border-primary shadow-[0_0_20px_rgba(0,191,255,0.3)]'
                    : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/20 hover:text-white'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-32 border border-dashed border-white/5 rounded-3xl">
              <p className="text-gray-500 text-sm font-bold uppercase tracking-[.2em]">
                No items found in this sanctuary.
              </p>
            </div>
          ) : (
            <div className="lg:col-span-12">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-8 lg:gap-10">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-[3/4.2] bg-neutral-900 rounded-xl overflow-hidden border border-white/5 group-hover:border-primary/20 transition-all duration-500 shadow-2xl">
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
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist({
                              id: product.id,
                              name: product.name,
                              subtitle: product.subtitle,
                              image: product.image,
                              price: product.price,
                            });
                          }}
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

                      <img
                        src={product.image}
                        alt={product.name}
                        className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ${product.soldOut ? 'grayscale opacity-40' : ''}`}
                      />

                      {!product.soldOut && (
                        <div className="absolute bottom-6 left-6 right-6 z-20 hidden md:flex">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart({
                                id: product.id,
                                name: product.name,
                                subtitle: product.subtitle,
                                image: product.image,
                                price: product.price,
                              }, 1);
                            }}
                            className="w-full bg-primary text-black py-4 font-black uppercase tracking-widest text-[10px] rounded-xl shadow-2xl hover:bg-white transition-colors"
                          >
                            Add to Bag
                          </button>
                        </div>
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
                            <span className="text-neutral-500 text-[8px] font-bold">{product.rating}</span>
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
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
