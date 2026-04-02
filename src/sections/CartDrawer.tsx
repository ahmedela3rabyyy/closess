import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const navigate = useNavigate();
  const {
    items,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
    clearCart,
  } = useCart();

  if (!isCartOpen) return null;

  const shippingCost = totalPrice >= 100 ? 0 : 10;
  const total = totalPrice + shippingCost;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-950 border-l border-gray-800 z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-gradient-to-r from-gray-950 to-gray-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00bfff]/10 rounded-xl flex items-center justify-center">
              <ShoppingBag className="text-[#00bfff]" size={20} />
            </div>
            <div>
              <h2 className="text-white text-lg font-bold">
                Your Cart
              </h2>
              <p className="text-gray-500 text-sm">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-10 h-10 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-xl flex items-center justify-center transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag size={40} className="text-gray-600" />
              </div>
              <h3 className="text-white text-xl font-bold mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500 mb-8 max-w-xs">
                Looks like you haven't added anything to your cart yet.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/shop');
                }}
                className="bg-[#00bfff] text-black px-8 py-3 font-bold uppercase tracking-wider hover:bg-[#00a0e0] transition-all rounded-xl flex items-center gap-2"
              >
                Continue Shopping
                <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 bg-gray-900/50 border border-gray-800 p-4 rounded-xl hover:border-gray-700 transition-colors"
                >
                  {/* Product Image */}
                  <div className="w-20 h-28 bg-white rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <h3 className="text-white font-medium text-sm uppercase truncate">
                          {item.name}
                        </h3>
                        <p className="text-gray-500 text-xs uppercase mt-0.5">
                          {item.subtitle}
                        </p>
                        {item.size && (
                          <p className="text-[#00bfff] text-xs mt-1">
                            Size: {item.size}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-8 h-8 bg-gray-800 hover:bg-red-500/20 text-gray-500 hover:text-red-500 rounded-lg flex items-center justify-center transition-all flex-shrink-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="flex-1" />

                    {/* Quantity and Price */}
                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-7 h-7 bg-gray-700 hover:bg-gray-600 text-white rounded-md flex items-center justify-center transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-white font-medium w-8 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-7 h-7 bg-gray-700 hover:bg-gray-600 text-white rounded-md flex items-center justify-center transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Price */}
                      <p className="text-[#00bfff] font-bold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-800 p-6 bg-gradient-to-t from-gray-950 to-gray-900">
            {/* Free Shipping Banner */}
            {totalPrice < 100 && (
              <div className="mb-4 p-3 bg-[#00bfff]/10 border border-[#00bfff]/30 rounded-xl">
                <div className="flex items-center gap-2 text-[#00bfff]">
                  <Sparkles size={16} />
                  <span className="text-sm">
                    Add ${(100 - totalPrice).toFixed(2)} more for free shipping!
                  </span>
                </div>
                <div className="mt-2 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#00bfff] rounded-full transition-all"
                    style={{ width: `${Math.min((totalPrice / 100) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Subtotal */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Shipping</span>
                <span className={shippingCost === 0 ? 'text-green-400' : 'text-white'}>
                  {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-800">
                <span className="text-white font-bold text-lg">Total</span>
                <span className="text-[#00bfff] font-bold text-xl">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <Link
                to="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="block w-full bg-[#00bfff] text-black text-center py-4 font-bold uppercase tracking-wider hover:bg-[#00a0e0] transition-all rounded-xl"
              >
                Proceed to Checkout
              </Link>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/shop');
                  }}
                  className="flex-1 bg-gray-800 text-white py-3 font-medium uppercase tracking-wider hover:bg-gray-700 transition-all rounded-xl"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={clearCart}
                  className="px-4 bg-transparent border border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500 transition-all rounded-xl"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
