import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Star, ArrowRight } from 'lucide-react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function Products() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Get only first 4 products for homepage
  const featuredProducts = products.slice(0, 4);

  const handleAddToCart = (product: (typeof products)[0], e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.soldOut) return;
    addToCart({
      id: product.id,
      name: product.name,
      subtitle: product.subtitle,
      image: product.image,
      price: product.price,
    });
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
    <section className="bg-black py-20 px-4">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <span className="text-[#00bfff] uppercase tracking-widest text-sm font-medium">
              Featured Collection
            </span>
            <h2 className="text-white text-4xl md:text-5xl font-bold uppercase mt-2">
              COVE 26
            </h2>
            <p className="text-gray-400 mt-2 max-w-md">
              Our latest collection featuring premium knitwear designed for the modern wardrobe.
            </p>
          </div>
          <button
            onClick={() => navigate('/shop')}
            className="group inline-flex items-center gap-2 text-[#00bfff] font-medium uppercase tracking-wider hover:gap-3 transition-all"
          >
            View All Products
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
              className="group cursor-pointer"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
              }}
            >
              {/* Product Image Container */}
              <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden rounded-xl">
                {/* Badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                  {product.isNew && (
                    <span className="bg-green-500 text-black text-xs font-bold px-3 py-1.5 uppercase rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
                      New
                    </span>
                  )}
                  {product.isSale && (
                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 uppercase rounded-full">
                      Sale
                    </span>
                  )}
                  {product.soldOut && (
                    <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1.5 uppercase rounded-full border border-gray-600">
                      Sold Out
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <button
                    onClick={(e) => handleToggleWishlist(product, e)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg ${
                      isInWishlist(product.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-red-500 hover:text-white'
                    }`}
                  >
                    <Heart size={18} className={isInWishlist(product.id) ? 'fill-current' : ''} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/${product.id}`);
                    }}
                    className="w-10 h-10 bg-white text-gray-700 rounded-full flex items-center justify-center hover:bg-[#00bfff] hover:text-black transition-all shadow-lg"
                  >
                    <Eye size={18} />
                  </button>
                </div>

                {/* Product Image */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                {/* Quick Add Button */}
                {!product.soldOut && (
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className="absolute bottom-4 left-4 right-4 bg-[#00bfff] text-black py-3 font-bold uppercase tracking-wider rounded-lg transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:bg-[#00a0e0]"
                  >
                    <ShoppingBag size={18} />
                    Quick Add
                  </button>
                )}
              </div>

              {/* Product Info */}
              <div className="mt-4 px-1">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-600'
                      }
                    />
                  ))}
                  <span className="text-gray-500 text-xs ml-1">({product.reviews})</span>
                </div>

                <h3 className="text-white text-sm font-medium uppercase tracking-wide group-hover:text-[#00bfff] transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-500 text-xs uppercase mt-1">
                  {product.subtitle}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[#00bfff] font-bold text-lg">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-gray-600 text-sm line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
