import { Heart, ShoppingBag, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import Header from '../sections/Header';
import Footer from '../sections/Footer';

export default function Wishlist() {
  const navigate = useNavigate();
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (item: (typeof items)[0]) => {
    addToCart({
      id: item.id,
      name: item.name,
      subtitle: item.subtitle,
      image: item.image,
      price: item.price,
    });
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>

          <h1 className="text-white text-3xl md:text-4xl font-bold uppercase mb-2">
            My Wishlist
          </h1>
          <p className="text-gray-400 mb-8">
            {items.length} {items.length === 1 ? 'item' : 'items'} saved
          </p>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <Heart size={64} className="text-gray-600 mx-auto mb-4" />
              <h2 className="text-white text-xl font-bold mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-gray-400 mb-6">
                Save items you love to your wishlist
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-[#00bfff] text-black px-8 py-4 font-bold uppercase tracking-wider hover:bg-[#00a0e0] transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group bg-gray-900/30 border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 transition-colors"
                >
                  {/* Image */}
                  <div className="relative aspect-[3/4] bg-white overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-3 right-3 w-8 h-8 bg-black/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="text-white text-sm font-medium uppercase truncate">
                      {item.name}
                    </h3>
                    <p className="text-gray-400 text-xs uppercase mt-1 truncate">
                      {item.subtitle}
                    </p>
                    <p className="text-[#00bfff] font-bold mt-2">
                      ${item.price}
                    </p>

                    <button
                      onClick={() => handleAddToCart(item)}
                      className="w-full mt-4 bg-[#00bfff] text-black py-2 font-bold uppercase text-sm tracking-wider hover:bg-[#00a0e0] transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingBag size={16} />
                      Add to Cart
                    </button>
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
