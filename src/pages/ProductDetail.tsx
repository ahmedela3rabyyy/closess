import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Star, ChevronLeft, Plus, Minus, ShoppingBag, Check } from 'lucide-react';
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
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Product not found</p>
          <button
            onClick={() => navigate('/')}
            className="bg-[#00bfff] text-black px-6 py-3 font-bold uppercase"
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

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ChevronLeft size={20} />
            <span>Back</span>
          </button>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-[3/4] bg-white rounded-lg overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Badges */}
              <div className="flex gap-2">
                {product.isNew && (
                  <span className="bg-green-500 text-black text-xs font-bold px-3 py-1 uppercase">
                    New
                  </span>
                )}
                {product.isSale && (
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 uppercase">
                    Sale
                  </span>
                )}
                {product.soldOut && (
                  <span className="bg-[#00bfff] text-black text-xs font-bold px-3 py-1 uppercase">
                    Sold Out
                  </span>
                )}
              </div>

              {/* Title */}
              <div>
                <h1 className="text-white text-2xl md:text-3xl font-bold uppercase">
                  {product.name}
                </h1>
                <p className="text-gray-400 text-lg uppercase mt-1">
                  {product.subtitle}
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-600'
                      }
                    />
                  ))}
                </div>
                <span className="text-gray-400 text-sm">
                  ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-[#00bfff] text-3xl font-bold">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-gray-500 text-xl line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-400 leading-relaxed">
                {product.description}
              </p>

              {/* Colors */}
              {product.colors.length > 0 && (
                <div>
                  <label className="text-white text-sm uppercase font-medium mb-3 block">
                    Color
                  </label>
                  <div className="flex gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          selectedColor === color.name
                            ? 'border-[#00bfff] scale-110'
                            : 'border-gray-600 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              <div>
                <label className="text-white text-sm uppercase font-medium mb-3 block">
                  Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 border-2 font-medium transition-all ${
                        selectedSize === size
                          ? 'border-[#00bfff] text-[#00bfff]'
                          : 'border-gray-600 text-gray-400 hover:border-gray-400 hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="text-white text-sm uppercase font-medium mb-3 block">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 bg-gray-800 text-white rounded flex items-center justify-center hover:bg-gray-700 transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="text-white font-medium w-12 text-center text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 bg-gray-800 text-white rounded flex items-center justify-center hover:bg-gray-700 transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.soldOut}
                  className={`flex-1 py-4 font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    product.soldOut
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-[#00bfff] text-black hover:bg-[#00a0e0]'
                  }`}
                >
                  {product.soldOut ? (
                    'Sold Out'
                  ) : showAddedMessage ? (
                    <>
                      <Check size={20} />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={20} />
                      Add to Cart
                    </>
                  )}
                </button>

                <button
                  onClick={handleToggleWishlist}
                  className={`w-14 h-14 border-2 flex items-center justify-center transition-all ${
                    isInWishlist(product.id)
                      ? 'border-red-500 text-red-500 bg-red-500/10'
                      : 'border-gray-600 text-gray-400 hover:border-red-500 hover:text-red-500'
                  }`}
                >
                  <Heart
                    size={24}
                    className={isInWishlist(product.id) ? 'fill-current' : ''}
                  />
                </button>
              </div>

              {/* Additional Info */}
              <div className="border-t border-gray-800 pt-6 space-y-3">
                <div className="flex items-center gap-3 text-gray-400">
                  <Check size={18} className="text-green-500" />
                  <span>Free shipping on orders over $100</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Check size={18} className="text-green-500" />
                  <span>30-day easy returns</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Check size={18} className="text-green-500" />
                  <span>Premium quality guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
