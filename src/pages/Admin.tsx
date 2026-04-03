import { useOrders } from '../context/OrderContext';
import { useProducts } from '../context/ProductContext';
import { useSettings } from '../context/SettingsContext';
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  TrendingUp, 
  AlertCircle, 
  Eye, 
  History, 
  Settings as SettingsIcon,
  Lock,
  Download,
  Check
} from 'lucide-react';
import Header from '../sections/Header';
import Footer from '../sections/Footer';
import ProductFormModal from '../components/admin/ProductFormModal';
import { type Product } from '../data/products';
import { toast } from 'sonner';
import { auth } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  type User 
} from 'firebase/auth';

export default function Admin() {
  const { products, addProduct, updateProduct, deleteProduct, loading: productsLoading } = useProducts();
  const { orders, updateOrderStatus, deleteOrder, loading: ordersLoading } = useOrders();
  const { settings, updateSettings, loading: settingsLoading } = useSettings();
  
  // Security State
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // UI State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'settings'>('dashboard');
  const [settingsActiveTab, setSettingsActiveTab] = useState<'main' | 'social' | 'contact' | 'security'>('main');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Settings State
  const [tempSettings, setTempSettings] = useState(settings);

  // Sync tempSettings with global settings when loaded
  useEffect(() => {
    setTempSettings(settings);
  }, [settings]);

  const handleSaveSettings = () => {
    updateSettings(tempSettings);
    toast.success('Global Protocol Updated | Architecture Persistent');
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Authentication Logic
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Access Granted | Protocol Synchronized');
    } catch (error) {
      toast.error('Invalid Credentials | Access Denied');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    toast.success('Protocol Terminated | Secure Logout');
  };

  // Real-time Analytics Calculation
  const analytics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const lowStockCount = products.filter(p => {
      const total = Object.values(p.sizeStock || {}).reduce((a, b) => a + (b || 0), 0);
      return total < 5;
    }).length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    
    return [
      { label: 'صافي الأرباح', value: `${settings.currency} ${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-primary', grow: '+12.5%' },
      { label: 'إجمالي الطلبات', value: orders.length, icon: ShoppingBag, color: 'text-green-500', grow: '+8.2%' },
      { label: 'طلبات قيد المعالجة', value: pendingOrders, icon: History, color: 'text-yellow-500', grow: 'Priority' },
      { label: 'تنبيهات المخزون', value: lowStockCount, icon: AlertCircle, color: 'text-red-500', grow: 'Action Required' },
    ];
  }, [orders, products, settings.currency]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (data: any) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, data);
    } else {
      addProduct(data);
    }
  };

  const exportOrdersCSV = () => {
    if (orders.length === 0) return toast.error('No data to export');

    const statusMap: Record<string, string> = {
      pending: 'قيد المراجعة',
      shipped: 'تم الشحن',
      delivered: 'تم التوصيل',
      cancelled: 'ملغي'
    };

    const headers = 'ID الطلب,العميل,رقم الهاتف,العنوان,المنتجات,الإجمالي,الحالة,التاريخ\n';
    const rows = orders.map(o => {
      const safeAddress = `"${o.address.replace(/"/g, '""')}"`;
      const productsList = `"${o.items.map(i => `${i.name} (Size: ${i.size}) x${i.quantity}`).join(' | ')}"`;
      const arabicStatus = statusMap[o.status] || o.status;
      return `${o.id},${o.customerName},${o.phone},${safeAddress},${productsList},${o.total},${arabicStatus},${new Date(o.date).toLocaleDateString()}`;
    }).join('\n');
    
    // Add BOM for Excel UTF-8 support
    const blob = new Blob(['\ufeff' + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NYX_Orders_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Orders exported successfully');
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOrders = orders.filter(o => 
    o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- Loading Screen ---
  if (authLoading || settingsLoading || productsLoading || ordersLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-t-2 border-primary rounded-full animate-spin shadow-[0_0_20px_rgba(0,191,255,0.2)]" />
          <p className="text-primary text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Synchronizing Neural Assets...</p>
        </div>
      </div>
    );
  }

  // --- Login Screen ---
  if (!user) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md glass p-10 rounded-[40px] border border-white/5 space-y-8 relative z-10"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto text-primary border border-primary/20 shadow-[0_0_40px_rgba(0,191,255,0.15)] mb-4">
            <Lock size={32} />
          </div>
          
          <div className="text-center space-y-2">
            <h1 className="text-white text-3xl font-black italic uppercase tracking-tighter">Command <span className="text-primary italic">Access</span></h1>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">NYX CORE FRAMEWORK v3.0</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest px-4">Identify Unit (Email)</label>
                <input 
                  type="email"
                  placeholder="admin@nyx.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black border border-white/5 text-white px-8 py-5 rounded-2xl focus:border-primary focus:outline-none transition-all placeholder:text-gray-800 font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest px-4">Authorization Key (Password)</label>
                <input 
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black border border-white/5 text-white px-8 py-5 rounded-2xl focus:border-primary focus:outline-none transition-all placeholder:text-gray-800 font-bold"
                />
              </div>
            </div>

            <button className="w-full py-5 bg-primary text-black rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white transition-all shadow-[0_0_30px_rgba(0,191,255,0.3)] hover:scale-[1.02] active:scale-95 group">
              Confirm Protocol 
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </form>

          <p className="text-center text-gray-600 text-[8px] font-bold uppercase tracking-widest">
            Protected by Cloud Neural Encryption
          </p>
        </motion.div>
      </div>
    );
  }

  // --- Main Admin Dashboard ---
  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="responsive-container lg:grid lg:grid-cols-12 gap-10">
          
          {/* Sidebar (Desktop Only) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="glass p-6 rounded-3xl border border-white/5 space-y-2 sticky top-32">
              <div className="px-4 py-2 border-b border-white/5 mb-4">
                <p className="text-[8px] font-black uppercase tracking-[0.5em] text-gray-500">Navigation Hub</p>
              </div>
              {[
                { id: 'dashboard', label: 'مركز القيادة', icon: LayoutDashboard },
                { id: 'products', label: 'إدارة المنتجات', icon: ShoppingBag },
                { id: 'orders', label: 'الطلبات المباشرة', icon: History },
                { id: 'settings', label: 'إعدادات المنصة', icon: SettingsIcon },
              ].map((item: any) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 font-bold uppercase tracking-widest text-[10px] ${
                    activeTab === item.id 
                      ? 'bg-primary text-black shadow-[0_0_20px_rgba(0,191,255,0.2)]' 
                      : 'text-gray-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
            </div>

            <div className="bg-neutral-900/50 p-6 rounded-3xl border border-white/5">
              <div className="flex items-center gap-3 text-primary mb-3">
                <AlertCircle size={20} />
                <span className="font-black text-[10px] uppercase tracking-widest">Admin Advisory</span>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed italic">
                Real-time synchronization active. All changes propagate across the NYX ecosystem instantly.
              </p>
            </div>
          </aside>

          {/* Center Stage */}
          <div className="lg:col-span-9 space-y-10">
            
            {/* Header Content */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_#00BFFF]" />
                   <p className="text-primary text-[10px] font-black uppercase tracking-[0.4em]">ADMINISTRATOR v2.4</p>
                </div>
                <h1 className="text-white text-4xl font-black italic uppercase tracking-tighter">
                  {activeTab === 'dashboard' ? 'مركز القيادة' : 
                   activeTab === 'products' ? 'إدارة المنتجات' : 
                   activeTab === 'orders' ? 'الطلبات المباشرة' : 'إعدادات المنصة'}
                </h1>
              </div>
              
              <div className="flex flex-wrap gap-2 md:gap-3 w-full md:w-auto">
                 <button 
                   onClick={handleLogout}
                   className="flex-1 md:flex-none justify-center bg-red-500/10 text-red-500 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-[10px] flex items-center gap-2 md:gap-3 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                 >
                   <Lock size={14} className="md:w-[18px] md:h-[18px]" />
                   <span className="hidden xs:inline">Logout</span>
                 </button>
                 {activeTab === 'orders' && (
                   <button 
                     onClick={exportOrdersCSV}
                     className="flex-1 md:flex-none justify-center bg-white/5 text-white px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-[10px] flex items-center gap-2 md:gap-3 border border-white/10 hover:bg-white/10 transition-all"
                   >
                     <Download size={14} className="md:w-[18px] md:h-[18px]" />
                     <span className="hidden xs:inline">Export</span>
                   </button>
                 )}
                 {activeTab !== 'settings' && (
                   <button 
                     onClick={handleAddProduct}
                     className="flex-1 md:flex-none justify-center bg-primary text-black px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-[9px] md:text-[10px] flex items-center gap-2 md:gap-3 hover:bg-white transition-all shadow-[0_0_20px_rgba(0,191,255,0.3)]"
                   >
                     <Plus size={14} className="md:w-[18px] md:h-[18px]" />
                     <span className="hidden xs:inline">Add New</span>
                   </button>
                 )}
              </div>
            </div>

            {/* TAB CONTENT: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {analytics.map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/5 group hover:border-primary/20 transition-all"
                    >
                      <div className="flex justify-between items-start mb-3 md:mb-4">
                        <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl bg-neutral-950 border border-white/5 ${stat.color}`}>
                          <stat.icon size={18} className="md:w-[22px] md:h-[22px]" />
                        </div>
                        <span className="text-[8px] md:text-[10px] font-black text-primary/60">{stat.grow}</span>
                      </div>
                      <h3 className="text-gray-500 text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">{stat.label}</h3>
                      <p className="text-white text-lg md:text-2xl font-black italic tracking-tighter mt-1">{stat.value}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-10">
                   <div className="glass p-8 rounded-[40px] border border-white/5 space-y-6">
                      <h3 className="text-white text-sm font-black uppercase tracking-widest flex items-center gap-3">
                         <TrendingUp size={18} className="text-primary" />
                         Recent Activity
                      </h3>
                      <div className="space-y-4">
                         {orders.slice(0, 5).map((order) => (
                           <div key={order.id} className="flex items-center justify-between p-4 bg-neutral-900/30 rounded-2xl border border-white/5 hover:border-primary/20 transition-all">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-[10px] italic">#{order.id.slice(-4)}</div>
                                 <div>
                                    <p className="text-white text-[10px] font-black uppercase">{order.customerName}</p>
                                    <p className="text-gray-600 text-[8px] uppercase tracking-widest">{new Date(order.date).toLocaleDateString()}</p>
                                 </div>
                              </div>
                              <p className="text-primary font-black italic text-xs">{settings.currency} {order.total}</p>
                           </div>
                         ))}
                         {orders.length === 0 && <p className="text-gray-600 text-xs italic text-center py-10">No recent activity detected.</p>}
                      </div>
                   </div>

                   <div className="glass p-8 rounded-[40px] border border-white/5 space-y-6">
                      <h3 className="text-white text-sm font-black uppercase tracking-widest flex items-center gap-3">
                         <AlertCircle size={18} className="text-red-500" />
                         Stock Critical
                      </h3>
                      <div className="space-y-4">
                         {products.filter(p => {
                           const total = Object.values(p.sizeStock || {}).reduce((a, b) => a + (b || 0), 0);
                           return total < 10;
                         }).slice(0,5).map((product) => {
                           const totalStock = Object.values(product.sizeStock || {}).reduce((a, b) => a + (b || 0), 0);
                           return (
                             <div key={product.id} className="flex items-center justify-between p-4 bg-neutral-900/30 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-4">
                                   <img src={product.image} className="w-10 h-12 rounded object-cover" />
                                   <div>
                                      <p className="text-white text-[10px] font-black uppercase">{product.name}</p>
                                      <div className="h-1 w-20 bg-neutral-950 rounded-full mt-2 overflow-hidden">
                                         <div className="h-full bg-red-500" style={{ width: `${(totalStock / 20) * 100}%` }} />
                                      </div>
                                   </div>
                                </div>
                                <span className="text-red-500 font-black text-[10px]">{totalStock} LEFT</span>
                             </div>
                           );
                         })}
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            {/* TAB CONTENT: PRODUCTS */}
            {activeTab === 'products' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-[40px] border border-white/5 overflow-hidden">
                <div className="p-8 border-b border-white/5 flex flex-col md:flex-row gap-6 justify-between items-center bg-neutral-950/20">
                  <div className="relative w-full md:w-96">
                    <Search className="absolute left-5 top-14 -translate-y-1/2 text-gray-600" size={18} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Protocol Search Products..."
                      className="w-full bg-black border border-white/5 text-xs text-white pl-14 pr-6 py-5 rounded-[20px] focus:border-primary focus:outline-none transition-all italic font-medium"
                    />
                  </div>
                  <div className="flex gap-3">
                     <span className="px-6 py-4 rounded-xl bg-neutral-900 text-gray-500 text-[10px] font-black uppercase tracking-widest border border-white/5">
                        Total {filteredProducts.length} Entries
                     </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  {/* Desktop Table */}
                  <table className="w-full text-left hidden lg:table">
                    <thead>
                      <tr className="bg-neutral-950/40 text-gray-500">
                        <th className="px-8 py-6 text-[9px] font-black tracking-[0.4em] uppercase">المنتج</th>
                        <th className="px-8 py-6 text-[9px] font-black tracking-[0.4em] uppercase">الفئة</th>
                        <th className="px-8 py-6 text-[9px] font-black tracking-[0.4em] uppercase">السعر</th>
                        <th className="px-8 py-6 text-[9px] font-black tracking-[0.4em] uppercase">حالة المخزون</th>
                        <th className="px-8 py-6 text-[9px] font-black tracking-[0.4em] uppercase text-right">العمليات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-white/[0.01] transition-all group">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-6">
                              <div className="w-14 h-20 rounded-2xl overflow-hidden bg-neutral-950 border border-white/5 shadow-xl group-hover:scale-105 transition-transform duration-500">
                                <img src={product.image} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <p className="text-white text-sm font-black italic tracking-tighter uppercase">{product.name}</p>
                                <p className="text-gray-600 text-[9px] uppercase tracking-widest mt-1">ID: #{product.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className="px-4 py-1.5 bg-neutral-950 border border-white/5 rounded-full text-[9px] font-black uppercase tracking-widest text-primary/60">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                             <div className="space-y-1">
                                <p className="text-primary font-black text-sm">{settings.currency} {product.price}</p>
                                {product.originalPrice && <p className="text-gray-600 text-[10px] line-through font-bold">{settings.currency} {product.originalPrice}</p>}
                             </div>
                          </td>
                          <td className="px-8 py-6">
                            {(() => {
                              const totalStock = Object.values(product.sizeStock || {}).reduce((a, b) => a + b, 0);
                              return (
                                <div className="space-y-2">
                                   <div className="flex items-center gap-3">
                                      <div className={`w-2 h-2 rounded-full ${product.soldOut ? 'bg-red-500' : 'bg-primary shadow-[0_0_8px_#00BFFF]'}`} />
                                      <span className={`text-[10px] font-black uppercase tracking-widest ${product.soldOut ? 'text-red-500' : 'text-gray-400'}`}>
                                        {product.soldOut ? 'Depleted' : `${totalStock} Units`}
                                      </span>
                                   </div>
                                   <div className="w-24 h-1 bg-neutral-950 rounded-full overflow-hidden">
                                      <div className={`h-full ${totalStock < 5 ? 'bg-red-500' : 'bg-primary/40'}`} style={{ width: `${Math.min((totalStock / 50) * 100, 100)}%` }} />
                                   </div>
                                </div>
                              );
                            })()}
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                               <button onClick={() => window.open(`/product/${product.id}`, '_blank')} className="w-12 h-12 flex items-center justify-center bg-white/5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-2xl transition-all"><Eye size={20} /></button>
                               <button onClick={() => handleEditProduct(product)} className="w-12 h-12 flex items-center justify-center bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 rounded-2xl transition-all"><Edit2 size={20} /></button>
                               <button onClick={() => { if (window.confirm('Erase this record?')) deleteProduct(product.id); }} className="w-12 h-12 flex items-center justify-center bg-white/5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"><Trash2 size={20} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Mobile Product Cards */}
                  <div className="lg:hidden p-4 space-y-4">
                    {filteredProducts.map((product) => {
                      const totalStock = Object.values(product.sizeStock || {}).reduce((a, b) => a + b, 0);
                      return (
                        <div key={product.id} className="glass p-5 rounded-3xl border border-white/5 space-y-5">
                          <div className="flex gap-5">
                            <div className="w-20 h-28 rounded-2xl overflow-hidden bg-neutral-950 border border-white/5">
                              <img src={product.image} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 space-y-2">
                              <div className="flex justify-between items-start">
                                <span className="px-3 py-1 bg-neutral-950 border border-white/5 rounded-full text-[8px] font-black uppercase tracking-widest text-primary/60">
                                  {product.category}
                                </span>
                                <span className="text-gray-700 text-[8px] font-black uppercase tracking-widest">#{product.id}</span>
                              </div>
                              <h3 className="text-white text-md font-black italic uppercase tracking-tighter leading-tight">{product.name}</h3>
                              <div className="flex items-center gap-3">
                                <p className="text-primary font-black text-sm">{settings.currency} {product.price}</p>
                                {product.originalPrice && <p className="text-gray-600 text-[9px] line-through font-bold">{settings.currency} {product.originalPrice}</p>}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 bg-neutral-950/40 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-3">
                               <div className={`w-2 h-2 rounded-full ${product.soldOut ? 'bg-red-500' : 'bg-primary shadow-[0_0_8px_#00BFFF]'}`} />
                               <span className={`text-[10px] font-black uppercase tracking-widest ${product.soldOut ? 'text-red-500' : 'text-gray-400'}`}>
                                 {product.soldOut ? 'Out of Stock' : `${totalStock} Units`}
                               </span>
                            </div>
                            <div className="flex gap-2">
                               <button onClick={() => window.open(`/product/${product.id}`, '_blank')} className="w-10 h-10 flex items-center justify-center bg-white/5 text-gray-500 rounded-xl"><Eye size={18} /></button>
                               <button onClick={() => handleEditProduct(product)} className="w-10 h-10 flex items-center justify-center bg-white/5 text-primary rounded-xl"><Edit2 size={18} /></button>
                               <button onClick={() => { if (window.confirm('Delete this?')) deleteProduct(product.id); }} className="w-10 h-10 flex items-center justify-center bg-white/5 text-red-500 rounded-xl"><Trash2 size={18} /></button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB CONTENT: ORDERS */}
            {activeTab === 'orders' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-[40px] border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                   {/* Desktop Orders Table */}
                   <table className="w-full text-left hidden lg:table">
                      <thead>
                        <tr className="bg-neutral-950/40 text-gray-500">
                          <th className="px-10 py-8 text-[11px] font-black tracking-[0.4em] uppercase min-w-[160px]">الرقم المرجعي</th>
                          <th className="px-10 py-8 text-[11px] font-black tracking-[0.4em] uppercase min-w-[220px]">بيانات العميل</th>
                          <th className="px-10 py-8 text-[11px] font-black tracking-[0.4em] uppercase min-w-[250px]">تفاصيل المنتجات</th>
                          <th className="px-10 py-8 text-[11px] font-black tracking-[0.4em] uppercase">القيمة</th>
                          <th className="px-10 py-8 text-[11px] font-black tracking-[0.4em] uppercase">حالة الطلب</th>
                          <th className="px-10 py-8 text-[11px] font-black tracking-[0.4em] uppercase text-right">العمليات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                         {filteredOrders.map((order) => (
                           <tr key={order.id} className="hover:bg-white/[0.01] transition-all group">
                              <td className="px-10 py-10">
                                 <p className="text-white font-mono text-xs font-black italic tracking-widest">{order.id}</p>
                                 <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest mt-2">{new Date(order.date).toLocaleString()}</p>
                              </td>
                              <td className="px-10 py-10">
                                 <div className="space-y-2.5">
                                    <p className="text-white text-base font-black uppercase tracking-widest leading-none">{order.customerName}</p>
                                    <div className="flex items-center gap-3">
                                       <div className="w-1.5 h-4 bg-primary/40 rounded-full" />
                                       <p className="text-primary text-xs font-black tracking-widest">{order.phone}</p>
                                    </div>
                                    <p className="text-gray-500 text-[10px] font-medium italic">{order.address}</p>
                                 </div>
                              </td>
                              <td className="px-10 py-10">
                                 <div className="flex flex-col gap-3 min-w-[220px]">
                                    {order.items.map((item, idx) => (
                                       <div key={idx} className="flex items-center gap-4 bg-neutral-900/30 p-2.5 rounded-2xl border border-white/5">
                                          <div className="w-10 h-14 rounded-lg bg-black shrink-0 overflow-hidden border border-white/10 shadow-2xl">
                                             <img src={item.image} className="w-full h-full object-cover" />
                                          </div>
                                          <div className="flex flex-col gap-1 overflow-hidden">
                                             <p className="text-white text-[10px] font-black uppercase truncate leading-none">{item.name}</p>
                                             <div className="flex items-center gap-2">
                                                <span className="text-primary text-[9px] font-black bg-primary/10 px-2 py-0.5 rounded border border-primary/20">Size: {item.size}</span>
                                                <span className="text-gray-500 text-[9px] font-black uppercase tracking-tighter">Qty: {item.quantity}</span>
                                             </div>
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                              </td>
                              <td className="px-10 py-10">
                                 <p className="text-primary font-black text-2xl italic tracking-tighter">{settings.currency} {order.total}</p>
                                 <p className="text-gray-600 text-[10px] font-black uppercase mt-1 tracking-widest">{order.items.length} Units Total</p>
                              </td>
                              <td className="px-10 py-10">
                                 <select 
                                   value={order.status}
                                   onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                                   className={`bg-neutral-950 border border-white/10 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] focus:outline-none focus:border-primary transition-all cursor-pointer ${
                                     order.status === 'pending' ? 'text-yellow-500' :
                                     order.status === 'shipped' ? 'text-blue-500' :
                                     order.status === 'delivered' ? 'text-green-500' : 'text-red-500'
                                   }`}
                                 >
                                    <option value="pending">Pending</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                 </select>
                              </td>
                              <td className="px-10 py-10 text-right">
                                 <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                                    <button 
                                      onClick={() => {
                                        const statusMap: Record<string, string> = {
                                          pending: 'قيد المراجعة',
                                          shipped: 'تم الشحن',
                                          delivered: 'تم التوصيل',
                                          cancelled: 'ملغي'
                                        };
                                        const arabicStatus = statusMap[order.status as keyof typeof statusMap] || order.status;
                                        const msg = `*تحديث من NYX Studio 🌌*\n\n` +
                                          `عزيزنا *${order.customerName}*، نود إبلاغك بأن طلبك رقم [${order.id}] حالته الآن: *${arabicStatus}*.\n\n` +
                                          `نحن نعمل على تجهيز قطعتك الفريدة بكل إتقان. شكراً لاختيارك NYX.`;
                                        window.open(`https://wa.me/${order.phone.startsWith('+') ? order.phone : '+20'+order.phone.replace(/^0/, '')}?text=${encodeURIComponent(msg)}`, '_blank');
                                      }}
                                      className="px-6 py-4 bg-primary text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all shadow-[0_0_20px_rgba(0,191,255,0.2)] flex items-center gap-3"
                                    >
                                       Notify
                                    </button>
                                    <button 
                                      onClick={() => { if(window.confirm('Delete this record?')) deleteOrder(order.id); }}
                                      className="w-14 h-14 flex items-center justify-center bg-white/5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
                                    >
                                       <Trash2 size={20} />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>

                   {/* Mobile Orders List - Horizontal Carousel */}
                   <div className="lg:hidden flex overflow-x-auto snap-x snap-mandatory gap-6 px-6 pb-40 no-scrollbar">
                      {filteredOrders.map((order) => (
                        <div key={order.id} className="snap-center shrink-0 w-[88vw] glass p-8 rounded-[45px] border border-white/5 space-y-10 shadow-2xl overflow-hidden">
                           <div className="flex justify-between items-center bg-neutral-900/60 p-5 rounded-3xl border border-white/5 shadow-lg">
                              <div>
                                 <p className="text-white font-mono text-base font-black italic tracking-widest">{order.id}</p>
                                 <p className="text-gray-500 text-xs font-black uppercase tracking-widest mt-1.5">{new Date(order.date).toLocaleDateString()}</p>
                              </div>
                              <select 
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                                className={`bg-black border border-white/10 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest focus:outline-none focus:border-primary transition-all cursor-pointer ${
                                  order.status === 'pending' ? 'text-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)]' :
                                  order.status === 'shipped' ? 'text-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]' :
                                  order.status === 'delivered' ? 'text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                                }`}
                              >
                                 <option value="pending">Pending</option>
                                 <option value="shipped">Shipped</option>
                                 <option value="delivered">Delivered</option>
                                 <option value="cancelled">Cancelled</option>
                              </select>
                           </div>

                           <div className="space-y-8">
                              {/* Customer Info Box */}
                              <div className="p-7 bg-neutral-900/80 rounded-[35px] border border-white/5 space-y-5 shadow-inner min-h-[160px] flex flex-col justify-center">
                                 <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-sm italic border border-primary/20 shadow-inner">NYX</div>
                                    <div className="flex-1 overflow-hidden">
                                       <p className="text-white text-lg font-black uppercase tracking-widest leading-tight">{order.customerName}</p>
                                       <div className="flex items-center gap-2 mt-2">
                                          <div className="w-1 h-3 bg-primary/40 rounded-full" />
                                          <p className="text-primary text-sm font-black tracking-widest">{order.phone}</p>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="pt-5 border-t border-white/5">
                                    <p className="text-gray-400 text-xs font-medium italic leading-relaxed">{order.address}</p>
                                 </div>
                              </div>

                              {/* Products List Box - Internal Vertical scroll if too many items */}
                              <div className="space-y-4">
                                 <div className="flex items-center justify-between px-3">
                                    <p className="text-gray-600 text-xs font-black uppercase tracking-[0.4em]">Order Items</p>
                                    <span className="text-primary text-[10px] font-black uppercase bg-primary/5 px-3 py-1 rounded-full border border-primary/10">{order.items.length} units</span>
                                 </div>
                                 <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                                    {order.items.map((item, idx) => (
                                       <div key={idx} className="flex items-center gap-5 bg-black/40 p-4 rounded-3xl border border-white/5 shadow-xl group">
                                          <div className="w-16 h-20 rounded-2xl bg-neutral-950 shrink-0 overflow-hidden border border-white/10 shadow-lg">
                                             <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                          </div>
                                          <div className="flex-1 space-y-2 overflow-hidden">
                                             <p className="text-white text-sm font-black uppercase truncate tracking-tight">{item.name}</p>
                                             <div className="flex flex-wrap items-center gap-3">
                                                <span className="text-primary text-[11px] font-black bg-primary/10 px-3 py-1 rounded-xl border border-primary/20">Size: {item.size}</span>
                                                <span className="text-white/40 text-xs font-black italic">Qty: {item.quantity}</span>
                                                <span className="text-gray-500 text-xs font-bold ml-auto">{settings.currency} {item.price}</span>
                                             </div>
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           </div>

                           <div className="flex items-center justify-between pt-8 border-t border-white/10">
                              <div className="space-y-1">
                                 <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest leading-none">Total Value</p>
                                 <p className="text-primary font-black text-3xl italic tracking-tighter">{settings.currency} {order.total}</p>
                              </div>
                              <div className="flex flex-col gap-3">
                                 <button 
                                   onClick={() => {
                                      const statusMap: Record<string, string> = {
                                        pending: 'قيد المراجعة',
                                        shipped: 'تم الشحن',
                                        delivered: 'تم التوصيل',
                                        cancelled: 'ملغي'
                                      };
                                      const arabicStatus = statusMap[order.status as keyof typeof statusMap] || order.status;
                                      const msg = `*تحديث من NYX Studio 🌌*\n\n` +
                                        `عزيزنا *${order.customerName}*، نود إبلاغك بأن طلبك رقم [${order.id}] حالته الآن: *${arabicStatus}*.\n\n` +
                                        `نحن نعمل على تجهيز قطعتك الفريدة بكل إتقان. شكراً لاختيارك NYX.`;
                                      window.open(`https://wa.me/${order.phone.startsWith('+') ? order.phone : '+20'+order.phone.replace(/^0/, '')}?text=${encodeURIComponent(msg)}`, '_blank');
                                   }}
                                   className="px-8 py-5 bg-primary text-black border border-primary/20 rounded-3xl text-sm font-black uppercase tracking-widest shadow-[0_15px_30px_rgba(0,191,255,0.3)] active:scale-95 transition-all text-center whitespace-nowrap"
                                 >
                                    Notify
                                 </button>
                                 <button 
                                   onClick={() => { if(window.confirm('Delete this record from history?')) deleteOrder(order.id); }}
                                   className="flex items-center justify-center gap-3 bg-white/5 text-gray-500 py-4 rounded-3xl border border-white/5 active:scale-95 transition-all"
                                 >
                                    <Trash2 size={24} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Delete</span>
                                 </button>
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </motion.div>
            )}

            {/* TAB CONTENT: SETTINGS */}
            {activeTab === 'settings' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 pb-20">
                <div className="glass rounded-[40px] border border-white/5 overflow-hidden lg:grid lg:grid-cols-12 min-h-[600px]">
                  
                  {/* Settings Sub-Sidebar */}
                  <div className="lg:col-span-3 bg-black/40 border-b lg:border-b-0 lg:border-r border-white/5 p-4 lg:p-8 flex lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 no-scrollbar">
                     <p className="hidden lg:block text-[8px] font-black uppercase tracking-[0.4em] text-gray-600 mb-6 px-4">Framework Layers</p>
                     {[
                       { id: 'main', label: 'الأساسية', icon: LayoutDashboard },
                       { id: 'social', label: 'السوشيال', icon: ShoppingBag },
                       { id: 'contact', label: 'التواصل', icon: History },
                       { id: 'security', label: 'الأمان', icon: Lock },
                     ].map((sub) => (
                       <button
                         key={sub.id}
                         onClick={() => setSettingsActiveTab(sub.id as any)}
                         className={`flex-none lg:w-full flex items-center gap-3 lg:gap-4 px-4 lg:px-4 py-3 lg:py-4 rounded-xl lg:rounded-2xl transition-all duration-300 font-bold uppercase tracking-widest text-[8px] lg:text-[9px] whitespace-nowrap ${
                           settingsActiveTab === sub.id 
                             ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_rgba(0,191,255,0.05)]' 
                             : 'text-gray-500 hover:text-white hover:bg-white/5'
                         }`}
                       >
                         <sub.icon size={14} className="lg:w-4 lg:h-4" />
                         {sub.label}
                       </button>
                     ))}
                  </div>

                  {/* Settings Content Area */}
                  <div className="lg:col-span-9 p-10 lg:p-16 relative">
                     <AnimatePresence mode="wait">
                       {settingsActiveTab === 'main' && (
                         <motion.div 
                           key="main"
                           initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                           className="space-y-12"
                         >
                            <div className="space-y-6">
                               <h3 className="text-white text-xl font-black italic uppercase tracking-tighter">Main Infrastructure</h3>
                               <div className="grid sm:grid-cols-2 gap-8">
                                  <div className="space-y-3">
                                     <label className="text-gray-500 text-[10px] font-black uppercase tracking-widest block">Store Identification</label>
                                     <input 
                                       type="text"
                                       value={tempSettings.storeName}
                                       onChange={(e) => setTempSettings({ ...tempSettings, storeName: e.target.value })}
                                       className="w-full bg-black border border-white/10 text-white px-8 py-5 rounded-2xl focus:border-primary focus:outline-none transition-all text-sm font-bold"
                                     />
                                  </div>
                                  <div className="space-y-3">
                                     <label className="text-gray-500 text-[10px] font-black uppercase tracking-widest block">System Currency</label>
                                     <select 
                                       value={tempSettings.currency}
                                       onChange={(e) => setTempSettings({ ...tempSettings, currency: e.target.value })}
                                       className="w-full bg-black border border-white/10 text-white px-8 py-5 rounded-2xl focus:border-primary focus:outline-none transition-all text-sm font-bold appearance-none uppercase"
                                     >
                                        <option value="EGP">Egyptian Pound (EGP)</option>
                                        <option value="USD">US Dollar (USD)</option>
                                     </select>
                                  </div>
                               </div>

                               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                                  <div className="space-y-3">
                                     <label className="text-gray-500 text-[8px] font-black uppercase tracking-widest block">Free Shipping Threshold | حد الشحن المجاني</label>
                                     <input 
                                       type="number"
                                       value={tempSettings.shippingThreshold}
                                       onChange={(e) => setTempSettings({ ...tempSettings, shippingThreshold: Number(e.target.value) })}
                                       className="w-full bg-black border border-white/5 text-primary px-6 py-4 rounded-2xl focus:border-primary focus:outline-none transition-all text-xs font-black shadow-[0_0_20px_rgba(0,191,255,0.05)]"
                                       placeholder="2000"
                                     />
                                  </div>
                                  <div className="space-y-3">
                                     <label className="text-gray-500 text-[8px] font-black uppercase tracking-widest block">Cairo/Giza Delivery | شحن القاهرة والجيزة</label>
                                     <input 
                                       type="number"
                                       value={tempSettings.shippingCairo}
                                       onChange={(e) => setTempSettings({ ...tempSettings, shippingCairo: Number(e.target.value) })}
                                       className="w-full bg-black border border-white/5 text-white px-6 py-4 rounded-2xl focus:border-primary focus:outline-none transition-all text-xs font-bold"
                                       placeholder="0"
                                     />
                                  </div>
                                  <div className="space-y-3">
                                     <label className="text-gray-500 text-[8px] font-black uppercase tracking-widest block">Outside Delivery | شحن المحافظات</label>
                                     <input 
                                       type="number"
                                       value={tempSettings.shippingOutside}
                                       onChange={(e) => setTempSettings({ ...tempSettings, shippingOutside: Number(e.target.value) })}
                                       className="w-full bg-black border border-white/5 text-white px-6 py-4 rounded-2xl focus:border-primary focus:outline-none transition-all text-xs font-bold"
                                       placeholder="60"
                                     />
                                  </div>
                               </div>

                               <div className="space-y-8 pt-10 border-t border-white/5">
                                  <div className="flex items-center justify-between">
                                     <div className="space-y-1">
                                        <h3 className="text-white text-lg font-black italic uppercase tracking-tighter">Announcement Bar | شريط الإعلانات</h3>
                                        <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">Global Top Banner Control</p>
                                     </div>
                                     <button 
                                       type="button"
                                       onClick={() => setTempSettings({ ...tempSettings, showAnnouncement: !tempSettings.showAnnouncement })}
                                       className={`w-14 h-8 rounded-full relative transition-all duration-500 ${tempSettings.showAnnouncement ? 'bg-primary shadow-[0_0_15px_#00BFFF]' : 'bg-neutral-800'}`}
                                     >
                                        <motion.div 
                                          animate={{ x: tempSettings.showAnnouncement ? 28 : 4 }}
                                          className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                                        />
                                     </button>
                                  </div>

                                  <div className="space-y-3">
                                     <label className="text-gray-500 text-[10px] font-black uppercase tracking-widest block">Announcement Content | نص الإعلان</label>
                                     <input 
                                       type="text"
                                       value={tempSettings.announcementText}
                                       onChange={(e) => setTempSettings({ ...tempSettings, announcementText: e.target.value })}
                                       className="w-full bg-black border border-white/10 text-white px-8 py-5 rounded-2xl focus:border-primary focus:outline-none transition-all text-sm font-bold italic"
                                       placeholder="Enter announcement text..."
                                       disabled={!tempSettings.showAnnouncement}
                                     />
                                  </div>
                               </div>
                            </div>

                            <div className="space-y-6 pt-10 border-t border-white/5">
                               <div className="flex items-center justify-between">
                                  <h3 className="text-white text-xl font-black italic uppercase tracking-tighter">Maintenance Protocol</h3>
                                  <button 
                                    onClick={() => setTempSettings({ ...tempSettings, maintenanceMode: !tempSettings.maintenanceMode })}
                                    className={`w-14 h-8 rounded-full relative transition-all duration-500 ${tempSettings.maintenanceMode ? 'bg-primary' : 'bg-neutral-800'}`}
                                  >
                                     <motion.div 
                                       animate={{ x: tempSettings.maintenanceMode ? 28 : 4 }}
                                       className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                                     />
                                  </button>
                               </div>
                               <div className="space-y-3">
                                  <label className="text-gray-500 text-[10px] font-black uppercase tracking-widest block">Maintenance Transmission</label>
                                  <textarea 
                                    value={tempSettings.maintenanceMessage}
                                    onChange={(e) => setTempSettings({ ...tempSettings, maintenanceMessage: e.target.value })}
                                    className="w-full bg-black border border-white/10 text-white px-8 py-5 rounded-2xl focus:border-primary focus:outline-none transition-all text-sm h-32 italic"
                                  />
                               </div>
                            </div>

                            <div className="space-y-6 pt-10 border-t border-white/5">
                               <h3 className="text-white text-xl font-black italic uppercase tracking-tighter">SEO Optimization</h3>
                               <div className="space-y-6">
                                  <div className="space-y-3">
                                     <label className="text-gray-500 text-[10px] font-black uppercase tracking-widest block">Global Meta Title</label>
                                     <input 
                                       type="text"
                                       value={tempSettings.seoTitle}
                                       onChange={(e) => setTempSettings({ ...tempSettings, seoTitle: e.target.value })}
                                       className="w-full bg-black border border-white/10 text-white px-8 py-5 rounded-2xl focus:border-primary focus:outline-none transition-all text-sm font-black italic"
                                     />
                                  </div>
                                  <div className="space-y-3">
                                     <label className="text-gray-500 text-[10px] font-black uppercase tracking-widest block">Meta Description</label>
                                     <textarea 
                                       value={tempSettings.seoDescription}
                                       onChange={(e) => setTempSettings({ ...tempSettings, seoDescription: e.target.value })}
                                       className="w-full bg-black border border-white/10 text-white px-8 py-5 rounded-2xl focus:border-primary focus:outline-none transition-all text-sm h-24 italic"
                                     />
                                  </div>
                               </div>
                            </div>
                         </motion.div>
                       )}

                       {settingsActiveTab === 'social' && (
                         <motion.div 
                           key="social"
                           initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                           className="space-y-8"
                         >
                            <h3 className="text-white text-xl font-black italic uppercase tracking-tighter">Digital Presence</h3>
                            <div className="grid sm:grid-cols-2 gap-8">
                               {[
                                 { key: 'instagram', label: 'Instagram Protocol' },
                                 { key: 'facebook', label: 'Facebook Grid' },
                                 { key: 'twitter', label: 'X Infrastructure' },
                                 { key: 'youtube', label: 'YouTube Vision' },
                               ].map((social) => (
                                 <div key={social.key} className="space-y-3">
                                    <label className="text-gray-500 text-[10px] font-black uppercase tracking-widest block">{social.label}</label>
                                    <input 
                                      type="text"
                                      value={(tempSettings as any)[social.key]}
                                      onChange={(e) => setTempSettings({ ...tempSettings, [social.key]: e.target.value })}
                                      className="w-full bg-black border border-white/10 text-white px-8 py-5 rounded-2xl focus:border-primary focus:outline-none transition-all text-[11px] italic"
                                      placeholder="https://..."
                                    />
                                 </div>
                               ))}
                            </div>
                         </motion.div>
                       )}

                       {settingsActiveTab === 'contact' && (
                         <motion.div 
                           key="contact"
                           initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                           className="space-y-12"
                         >
                            <h3 className="text-white text-xl font-black italic uppercase tracking-tighter">Contact Architecture</h3>
                            <div className="grid sm:grid-cols-2 gap-8">
                               <div className="space-y-3">
                                  <label className="text-gray-500 text-[10px] font-black uppercase tracking-widest block">Primary WhatsApp</label>
                                  <input 
                                    type="text"
                                    value={tempSettings.whatsappNumber}
                                    onChange={(e) => setTempSettings({ ...tempSettings, whatsappNumber: e.target.value })}
                                    className="w-full bg-black border border-white/10 text-white px-8 py-5 rounded-2xl focus:border-primary focus:outline-none transition-all text-sm font-bold"
                                  />
                               </div>
                               <div className="space-y-3">
                                  <label className="text-gray-500 text-[10px] font-black uppercase tracking-widest block">Support Email</label>
                                  <input 
                                    type="text"
                                    value={tempSettings.email}
                                    onChange={(e) => setTempSettings({ ...tempSettings, email: e.target.value })}
                                    className="w-full bg-black border border-white/10 text-white px-8 py-5 rounded-2xl focus:border-primary focus:outline-none transition-all text-sm font-bold"
                                  />
                               </div>
                            </div>
                            <div className="space-y-3">
                               <label className="text-gray-500 text-[10px] font-black uppercase tracking-widest block">Official HQ Address</label>
                               <textarea 
                                 value={tempSettings.address}
                                 onChange={(e) => setTempSettings({ ...tempSettings, address: e.target.value })}
                                 className="w-full bg-black border border-white/10 text-white px-8 py-5 rounded-2xl focus:border-primary focus:outline-none transition-all text-sm h-24"
                               />
                            </div>
                         </motion.div>
                       )}

                       {settingsActiveTab === 'security' && (
                         <motion.div 
                           key="security"
                           initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                           className="space-y-12"
                         >
                            <h3 className="text-white text-xl font-black italic uppercase tracking-tighter">Security Operations</h3>
                            <div className="max-w-md space-y-8">
                               <div className="space-y-3">
                                  <label className="text-gray-500 text-[10px] font-black uppercase tracking-widest block">Admin Passcode</label>
                                  <input 
                                    type="password"
                                    value={tempSettings.adminPasscode}
                                    onChange={(e) => setTempSettings({ ...tempSettings, adminPasscode: e.target.value })}
                                    className="w-full bg-black border border-white/10 text-white px-8 py-5 rounded-2xl focus:border-primary focus:outline-none transition-all text-center tracking-[1em] font-black"
                                    placeholder="••••"
                                  />
                                  <p className="text-[9px] text-gray-600 uppercase italic">Updating this will take effect on next login protocol.</p>
                               </div>
                            </div>
                         </motion.div>
                       )}
                     </AnimatePresence>

                     {/* Save Button Overlay */}
                     <div className="mt-20 pt-10 border-t border-white/5">
                        <button
                          onClick={handleSaveSettings}
                          className="px-12 py-6 bg-primary text-black rounded-2xl font-black uppercase tracking-[0.4em] text-[12px] flex items-center gap-4 hover:bg-white transition-all shadow-[0_20px_50px_rgba(0,191,255,0.2)]"
                        >
                          <Check size={20} />
                          Deploy Ecosystem Updates
                        </button>
                     </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="glass p-8 rounded-[30px] border border-white/5 space-y-4">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">System Architecture</p>
                    <p className="text-white text-sm italic">NYX v2.4.0-Stable</p>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                       <div className="w-2/3 h-full bg-primary/50" />
                    </div>
                  </div>
                  <div className="glass p-8 rounded-[30px] border border-white/5 space-y-4">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Data Encryption</p>
                    <p className="text-white text-sm italic text-green-500">Active (AES-256)</p>
                    <div className="flex gap-2">
                       {[...Array(5)].map((_, i) => (
                         <div key={i} className="w-full h-1 bg-green-500/30 rounded-full" />
                       ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <ProductFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingProduct || undefined}
      />

      <Footer />

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-6 left-6 right-6 z-[100]">
        <div className="glass-morphism rounded-[30px] border border-white/10 p-2 flex items-center justify-around shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
           {[
             { id: 'dashboard', icon: LayoutDashboard },
             { id: 'products', icon: ShoppingBag },
             { id: 'orders', icon: History },
             { id: 'settings', icon: SettingsIcon },
           ].map((item) => (
             <button
               key={item.id}
               onClick={() => setActiveTab(item.id as any)}
               className={`p-4 rounded-2xl transition-all duration-300 ${
                 activeTab === item.id 
                   ? 'bg-primary text-black scale-110 shadow-[0_0_20px_rgba(0,191,255,0.4)]' 
                   : 'text-gray-500 hover:text-white'
               }`}
             >
               <item.icon size={20} />
             </button>
           ))}
        </div>
      </nav>
    </div>
  );
}
