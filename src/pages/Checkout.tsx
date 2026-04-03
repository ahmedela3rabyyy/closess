import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Check, Lock, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { useOrders } from '../context/OrderContext';
import { useSettings } from '../context/SettingsContext';
import Header from '../sections/Header';
import Footer from '../sections/Footer';
import { toast } from 'sonner';

const egyptianGovernorates = [
  'Cairo - القاهرة', 'Giza - الجيزة', 'Alexandria - الإسكندرية', 
  'Dakahlia - الدقهلية', 'Red Sea - البحر الأحمر', 'Beheira - البحيرة', 
  'Fayoum - الفيوم', 'Gharbia - الغربية', 'Ismailia - الإسماعيلية', 
  'Monufia - المنوفية', 'Minya - المنيا', 'Qalyubia - القليوبية', 
  'New Valley - الوادي الجديد', 'Suez - السويس', 'Sharqia - الشرقية', 
  'South Sinai - جنوب سيناء', 'North Sinai - شمال سيناء', 'Beni Suef - بني سويف', 
  'Port Said - بورسعيد', 'Damietta - دمياط', 'Sohag - سوهاج', 
  'Qena - قنا', 'Luxor - الأقصر', 'Aswan - أسوان', 'Kafr El Sheikh - كفر الشيخ',
  'Matrouh - مطروح', 'Monufia - المنوفية'
];

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { decrementStock } = useProducts();
  const { addOrder } = useOrders();
  const { settings } = useSettings();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    governorate: 'Cairo - القاهرة',
  });

  const isLocal = shippingInfo.governorate.includes('Cairo') || shippingInfo.governorate.includes('Giza');
  const baseShippingCost = isLocal ? settings.shippingCairo : settings.shippingOutside;
  const shippingCost = totalPrice >= settings.shippingThreshold ? 0 : baseShippingCost; 
  const total = totalPrice + shippingCost;

  const redirectToWhatsApp = (orderRef: string) => {
    const adminPhone = settings.whatsappNumber; 
    const itemsList = items.map(item => `• ${item.name} | المقاس: ${item.size} | الكمية: ${item.quantity}`).join('\n');
    
    const message = `*NYX OFFICIAL ORDER [${orderRef}]* \n\n` +
      `السلام عليكم، أريد طلب هذه المنتجات:\n` +
      `${itemsList}\n\n` +
      `*قيمة المنتجات:* ${settings.currency} ${totalPrice}\n` +
      `*مصاريف الشحن:* ${shippingCost === 0 ? 'مجاني' : `${settings.currency} ${shippingCost}`}\n` +
      `-------------------------- \n` +
      `*الإجمالي النهائي:* ${settings.currency} ${total}\n\n` +
      `*بيانات الشحن:*\n` +
      `📦 الاسم: ${shippingInfo.customerName}\n` +
      `🏙️ المحافظة: ${shippingInfo.governorate}\n` +
      `📍 العنوان: ${shippingInfo.address}\n` +
      `📱 التليفون: ${shippingInfo.phone}\n\n` +
      `يرجى تأكيد التوافر وميعاد التوصيل. 🚀`;

    const url = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Egyptian Phone Validation
    if (!/^01[0125][0-9]{8}$/.test(shippingInfo.phone)) {
      toast.error('الرجاء إدخال رقم تليفون مصري صحيح (11 رقم)');
      return;
    }

    setIsProcessing(true);

    const orderRef = `NYX-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // 1. Save to Dashboard
    addOrder({
      customerName: shippingInfo.customerName,
      email: shippingInfo.email || 'N/A',
      phone: shippingInfo.phone,
      address: `${shippingInfo.address}, ${shippingInfo.governorate}`,
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        size: item.size || 'N/A'
      })),
      total: total
    });

    // 2. Decrement stock per size
    items.forEach(item => {
      decrementStock(item.id, item.size || 'One Size', item.quantity);
    });

    // 3. UI/Redirect
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsProcessing(false);
    setOrderComplete(true);
    
    setTimeout(() => {
      redirectToWhatsApp(orderRef);
      clearCart();
    }, 3000);
  };

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-white text-2xl font-bold mb-4 uppercase">Registry Empty</h1>
            <p className="text-gray-400 mb-6 italic">No products detected in your neural cart.</p>
            <button 
              onClick={() => navigate('/')} 
              className="bg-primary text-black px-10 py-4 font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
            >
              Back to Catalog
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
        <main className="pt-24 pb-16 flex items-center justify-center px-4">
          <div className="text-center max-w-lg mx-auto">
            <motion.div 
               initial={{ scale: 0, rotate: -180 }}
               animate={{ scale: 1, rotate: 0 }}
               className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(0,191,255,0.3)]"
            >
              <Check className="text-primary" size={48} />
            </motion.div>
            <h1 className="text-white text-4xl font-black italic uppercase tracking-tighter mb-4">Transmission Ready!</h1>
            <p className="text-gray-400 text-lg mb-8 italic">Redirecting you to our Secure WhatsApp Channel to finalize shipping details...</p>
            
            <div className="relative p-8 bg-neutral-900/50 rounded-[40px] border border-white/5 overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
               <p className="text-primary text-[10px] font-black uppercase tracking-[0.5em] mb-4">NYX SECURE PROTOCOL ACTIVE</p>
               <div className="flex justify-center gap-3">
                  <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_#00BFFF]" />
                  <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_#00BFFF]" />
                  <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_#00BFFF]" />
               </div>
               <div className="mt-8 flex items-center justify-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-widest">
                  <ExternalLink size={14} />
                  Official WhatsApp Gateway
               </div>
            </div>
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
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group">
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Back to Protocol</span>
          </button>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Egyptian Local Form */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              <form onSubmit={handleOrderSubmit} className="glass p-12 rounded-[50px] border border-white/5 space-y-10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
                  
                  <div className="space-y-3">
                     <h2 className="text-white text-4xl font-black italic uppercase tracking-tighter flex items-center gap-4">
                        Order Registry
                        <Lock size={24} className="text-primary" />
                     </h2>
                     <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.5em]">EGYPT LOCAL PROTOCOL | NO UPFRONT PAYMENT</p>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-3">
                       <label className="text-gray-500 text-[10px] font-black uppercase tracking-widest block">Full Name | الاسم بالكامل</label>
                       <input
                         type="text"
                         required
                         placeholder="e.g. Mahmoud Ahmed"
                         value={shippingInfo.customerName}
                         onChange={(e) => setShippingInfo({ ...shippingInfo, customerName: e.target.value })}
                         className="w-full bg-black border border-white/10 text-white px-8 py-5 rounded-[24px] focus:border-primary focus:outline-none transition-all italic font-bold placeholder:opacity-10 text-lg"
                       />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-8">
                       <div className="space-y-3">
                          <label className="text-gray-500 text-[10px] font-black uppercase tracking-widest block">Phone | رقم الموبايل</label>
                          <input
                            type="tel"
                            required
                            placeholder="01xxxxxxxxx"
                            value={shippingInfo.phone}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                            className="w-full bg-black border border-white/10 text-white px-8 py-5 rounded-[24px] focus:border-primary focus:outline-none transition-all font-black tracking-[0.2em] text-lg"
                          />
                          <p className="text-[9px] text-primary/50 uppercase italic font-bold">11 Egyptian digits required</p>
                       </div>
                       <div className="space-y-3">
                          <label className="text-gray-500 text-[10px] font-black uppercase tracking-widest block">Governorate | المحافظة</label>
                          <select
                            required
                            value={shippingInfo.governorate}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, governorate: e.target.value })}
                            className="w-full bg-black border border-white/10 text-white px-8 py-5 rounded-[24px] focus:border-primary focus:outline-none transition-all font-black text-sm cursor-pointer appearance-none uppercase"
                          >
                             {egyptianGovernorates.map(gov => <option key={gov} value={gov} className="bg-black">{gov}</option>)}
                          </select>
                          <motion.p 
                            initial={{ opacity: 0, y: -5 }} 
                            animate={{ opacity: 1, y: 0 }}
                            key={shippingCost}
                            className={`text-[9px] font-black uppercase tracking-widest mt-2 px-4 transition-all ${shippingCost === 0 ? 'text-primary' : 'text-gray-500'}`}
                          >
                             {shippingCost === 0 ? (
                               <span className="flex items-center gap-1">✨ Free Neural Shipping Activated</span>
                             ) : (
                               <span className="flex items-center gap-1 italic opacity-60">
                                  Delivery Fee: {settings.currency} {shippingCost}
                               </span>
                             )}
                          </motion.p>
                       </div>
                    </div>

                    <div className="space-y-3">
                       <label className="text-gray-500 text-[10px] font-black uppercase tracking-widest block">Detailed Address | العنوان بالتفصيل</label>
                       <textarea
                         required
                         rows={3}
                         placeholder="Street name, Building No, Floor, Apartment..."
                         value={shippingInfo.address}
                         onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                         className="w-full bg-black border border-white/10 text-white px-8 py-5 rounded-[24px] focus:border-primary focus:outline-none transition-all text-sm leading-relaxed italic"
                       />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-primary text-black py-7 rounded-[24px] font-black uppercase tracking-[0.4em] text-[14px] flex items-center justify-center gap-4 hover:bg-white hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_50px_rgba(0,191,255,0.2)] disabled:opacity-50"
                  >
                    {isProcessing ? (
                       <div className="w-8 h-8 border-4 border-black/30 border-t-black rounded-full animate-spin" />
                    ) : (
                      <>
                        Confirm & Order via WhatsApp
                      </>
                    )}
                  </button>
                  
                  <div className="flex items-center justify-center gap-6 pt-4">
                     <p className="text-gray-700 text-[8px] font-black uppercase tracking-[0.3em]">SECURE CHANNEL</p>
                     <div className="w-1.5 h-1.5 rounded-full bg-gray-800" />
                     <p className="text-gray-700 text-[8px] font-black uppercase tracking-[0.3em]">FAST DELIVERY</p>
                     <div className="w-1.5 h-1.5 rounded-full bg-gray-800" />
                     <p className="text-gray-700 text-[8px] font-black uppercase tracking-[0.3em]">LOCAL SUPPORT</p>
                  </div>
              </form>
            </motion.div>

            {/* Order Preview Sidebar */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-10 sticky top-32">
               <div className="glass p-10 rounded-[50px] border border-white/5 space-y-8">
                  <h3 className="text-white text-lg font-black uppercase tracking-widest flex items-center gap-4">
                     <div className="w-2 h-8 bg-primary rounded-full shadow-[0_0_15px_#00BFFF]" />
                     Order Preview
                  </h3>
                  
                  <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                     {items.map((item) => (
                       <div key={`${item.id}-${item.size}`} className="flex gap-6 group">
                         <div className="w-20 h-24 bg-neutral-900 rounded-2xl overflow-hidden border border-white/5 relative flex-shrink-0">
                            <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                         </div>
                         <div className="flex-1 py-1">
                            <p className="text-white text-[12px] font-black uppercase tracking-widest mb-1">{item.name}</p>
                            <div className="flex gap-3 mb-2">
                               <span className="text-primary text-[9px] font-black uppercase bg-primary/10 px-2 py-0.5 rounded border border-primary/20">Size: {item.size}</span>
                               <span className="text-gray-500 text-[9px] font-black uppercase bg-white/5 px-2 py-0.5 rounded border border-white/10">Qty: {item.quantity}</span>
                            </div>
                            <p className="text-white text-base font-black italic tracking-tighter">{settings.currency} {item.price * item.quantity}</p>
                         </div>
                       </div>
                     ))}
                  </div>

                  <div className="border-t border-white/10 pt-8 space-y-4">
                     <div className="flex justify-between text-gray-500 text-[10px] font-black uppercase tracking-widest">
                        <span>Original Valuation</span>
                        <span>{settings.currency} {totalPrice}</span>
                     </div>
                     <div className="flex justify-between text-gray-500 text-[10px] font-black uppercase tracking-widest">
                        <span>Delivery Logistics</span>
                        <span>{shippingCost === 0 ? 'FREE' : `${settings.currency} ${shippingCost}`}</span>
                     </div>
                     <div className="flex justify-between text-white text-3xl font-black italic tracking-tighter pt-6 border-t border-white/10">
                        <span className="flex items-center gap-2">
                           TOTAL 
                           <span className="text-[10px] not-italic text-gray-600 tracking-widest font-black uppercase">(EST)</span>
                        </span>
                        <span className="text-primary">{settings.currency} {total}</span>
                     </div>
                  </div>

                  {totalPrice >= settings.shippingThreshold && (
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="p-4 bg-primary/10 border border-primary/20 rounded-[24px]">
                       <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em] text-center flex items-center justify-center gap-2">
                          <Check size={14} />
                          Elite Delivery Activated (FREE)
                       </p>
                    </motion.div>
                  )}
               </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
