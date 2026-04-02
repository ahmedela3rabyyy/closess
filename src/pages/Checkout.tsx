import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CreditCard, Truck, Check, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Header from '../sections/Header';
import Footer from '../sections/Footer';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'US',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const shippingCost = totalPrice >= 100 ? 0 : 10;
  const total = totalPrice + shippingCost;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setOrderComplete(true);
    clearCart();
  };

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-white text-2xl font-bold mb-4">
              Your cart is empty
            </h1>
            <p className="text-gray-400 mb-6">
              Add some items to proceed to checkout
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-[#00bfff] text-black px-6 py-3 font-bold uppercase"
            >
              Continue Shopping
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="pt-24 pb-16 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="text-green-500" size={40} />
            </div>
            <h1 className="text-white text-3xl font-bold mb-4">
              Order Confirmed!
            </h1>
            <p className="text-gray-400 mb-2">
              Thank you for your purchase. Your order has been received.
            </p>
            <p className="text-gray-500 text-sm mb-8">
              Order confirmation sent to your email
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-[#00bfff] text-black px-8 py-4 font-bold uppercase tracking-wider hover:bg-[#00a0e0] transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
            <ChevronLeft size={20} />
            <span>Back to Cart</span>
          </button>

          <h1 className="text-white text-3xl font-bold uppercase mb-8">
            Checkout
          </h1>

          {/* Progress Steps */}
          <div className="flex items-center gap-4 mb-8">
            <div
              className={`flex items-center gap-2 ${
                step >= 1 ? 'text-[#00bfff]' : 'text-gray-600'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  step >= 1 ? 'bg-[#00bfff] text-black' : 'bg-gray-800'
                }`}
              >
                1
              </div>
              <span className="hidden sm:inline">Shipping</span>
            </div>
            <div className="flex-1 h-px bg-gray-800" />
            <div
              className={`flex items-center gap-2 ${
                step >= 2 ? 'text-[#00bfff]' : 'text-gray-600'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  step >= 2 ? 'bg-[#00bfff] text-black' : 'bg-gray-800'
                }`}
              >
                2
              </div>
              <span className="hidden sm:inline">Payment</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <div>
              {step === 1 ? (
                <form
                  onSubmit={handleShippingSubmit}
                  className="bg-gray-900/30 border border-gray-800 rounded-lg p-6 space-y-4"
                >
                  <h2 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
                    <Truck size={24} className="text-[#00bfff]" />
                    Shipping Information
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm mb-1 block">
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.firstName}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-lg focus:border-[#00bfff] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-1 block">
                        Last Name
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.lastName}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            lastName: e.target.value,
                          })
                        }
                        className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-lg focus:border-[#00bfff] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={shippingInfo.email}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          email: e.target.value,
                        })
                      }
                      className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-lg focus:border-[#00bfff] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">
                      Phone
                    </label>
                    <input
                      type="tel"
                      required
                      value={shippingInfo.phone}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          phone: e.target.value,
                        })
                      }
                      className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-lg focus:border-[#00bfff] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">
                      Address
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.address}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          address: e.target.value,
                        })
                      }
                      className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-lg focus:border-[#00bfff] focus:outline-none"
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm mb-1 block">
                        City
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.city}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            city: e.target.value,
                          })
                        }
                        className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-lg focus:border-[#00bfff] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-1 block">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.zipCode}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            zipCode: e.target.value,
                          })
                        }
                        className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-lg focus:border-[#00bfff] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-1 block">
                        Country
                      </label>
                      <select
                        value={shippingInfo.country}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            country: e.target.value,
                          })
                        }
                        className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-lg focus:border-[#00bfff] focus:outline-none"
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#00bfff] text-black py-4 font-bold uppercase tracking-wider hover:bg-[#00a0e0] transition-colors mt-6"
                  >
                    Continue to Payment
                  </button>
                </form>
              ) : (
                <form
                  onSubmit={handlePaymentSubmit}
                  className="bg-gray-900/30 border border-gray-800 rounded-lg p-6 space-y-4"
                >
                  <h2 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
                    <CreditCard size={24} className="text-[#00bfff]" />
                    Payment Information
                  </h2>

                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                    <Lock size={16} />
                    <span>Your payment information is secure and encrypted</span>
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      required
                      value={paymentInfo.cardNumber}
                      onChange={(e) =>
                        setPaymentInfo({
                          ...paymentInfo,
                          cardNumber: e.target.value,
                        })
                      }
                      className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-lg focus:border-[#00bfff] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      required
                      value={paymentInfo.cardName}
                      onChange={(e) =>
                        setPaymentInfo({
                          ...paymentInfo,
                          cardName: e.target.value,
                        })
                      }
                      className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-lg focus:border-[#00bfff] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm mb-1 block">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        required
                        value={paymentInfo.expiryDate}
                        onChange={(e) =>
                          setPaymentInfo({
                            ...paymentInfo,
                            expiryDate: e.target.value,
                          })
                        }
                        className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-lg focus:border-[#00bfff] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-1 block">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        required
                        value={paymentInfo.cvv}
                        onChange={(e) =>
                          setPaymentInfo({ ...paymentInfo, cvv: e.target.value })
                        }
                        className="w-full bg-black border border-gray-700 text-white px-4 py-3 rounded-lg focus:border-[#00bfff] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 bg-transparent border border-gray-700 text-white py-4 font-bold uppercase tracking-wider hover:border-gray-500 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="flex-1 bg-[#00bfff] text-black py-4 font-bold uppercase tracking-wider hover:bg-[#00a0e0] transition-colors disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        `Pay $${total.toFixed(2)}`
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-6 h-fit">
              <h2 className="text-white text-xl font-bold mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-20 bg-white rounded overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white text-sm font-medium uppercase">
                        {item.name}
                      </h3>
                      <p className="text-gray-400 text-xs">
                        Qty: {item.quantity}
                      </p>
                      {item.size && (
                        <p className="text-gray-400 text-xs">
                          Size: {item.size}
                        </p>
                      )}
                    </div>
                    <div className="text-[#00bfff] font-medium">
                      ${item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-800 pt-4 space-y-2">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-gray-800">
                  <span>Total</span>
                  <span className="text-[#00bfff]">${total.toFixed(2)}</span>
                </div>
              </div>

              {totalPrice >= 100 && (
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <p className="text-green-400 text-sm text-center">
                    🎉 You got free shipping!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
