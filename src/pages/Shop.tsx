import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Filter, ChevronDown } from 'lucide-react';
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

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
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

  const handleToggleWishlist = (product: any, e: React.MouseEvent) => {
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
    <div className="min-h-screen bg-black">
      <Header />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-white text-3xl md:text-4xl font-bold uppercase">
                Shop All
              </h1>
              <p className="text-gray-400 mt-1">
                {filteredProducts.length} products
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 bg-gray-900 border border-gray-800 text-white px-4 py-2 rounded-lg hover:border-gray-700 transition-colors"
              >
                <Filter size={18} />
                <span>
                  Sort by: {sortOptions.find((o) => o.id === sortBy)?.name}
                </span>
                <ChevronDown
                  size={18}
                  className={`transition-transform ${
                    showSortDropdown ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {showSortDropdown && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-gray-800 rounded-lg overflow-hidden z-10">
                  {sortOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setSortBy(option.id);
                        setShowSortDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-800 transition-colors ${
                        sortBy === option.id
                          ? 'text-[#00bfff]'
                          : 'text-gray-400'
                      }`}
                    >
                      {option.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 font-medium uppercase tracking-wider transition-all ${
                  selectedCategory === category.id
                    ? 'bg-[#00bfff] text-black'
                    : 'bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-600 hover:text-white'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">
                No products found in this category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="group cursor-pointer"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] bg-white overflow-hidden">
                    {/* Badges */}
                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                      {product.isNew && (
                        <span className="bg-green-500 text-black text-xs font-bold px-2 py-1 uppercase">
                          New
                        </span>
                      )}
                      {product.isSale && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 uppercase">
                          Sale
                        </span>
                      )}
                      {product.soldOut && (
                        <span className="bg-[#00bfff] text-black text-xs font-bold px-2 py-1 uppercase">
                          Sold Out
                        </span>
                      )}
                    </div>

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => handleToggleWishlist(product, e)}
                      className={`absolute top-3 right-3 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 ${
                        isInWishlist(product.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-black/50 text-white hover:bg-red-500'
                      }`}
                    >
                      <Heart
                        size={18}
                        className={isInWishlist(product.id) ? 'fill-current' : ''}
                      />
                    </button>

                    {/* Product Image */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Quick Add Button */}
                    {!product.soldOut && (
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className="absolute bottom-0 left-0 right-0 bg-[#00bfff] text-black py-3 font-bold uppercase tracking-wider transform translate-y-full group-hover:translate-y-0 transition-transform flex items-center justify-center gap-2"
                      >
                        <ShoppingBag size={18} />
                        Quick Add
                      </button>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="mt-4">
                    <h3 className="text-white text-sm font-medium uppercase">
                      {product.name}
                    </h3>
                    <p className="text-gray-400 text-xs uppercase mt-1">
                      {product.subtitle}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[#00bfff] font-bold">
                        {settings.currency} {product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-gray-600 text-[10px] line-through font-bold">
                          {settings.currency} {product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
