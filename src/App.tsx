import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import CartDrawer from './sections/CartDrawer';

// Pages
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Shop from './pages/Shop';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import Auth from './pages/Auth';
import Maintenance from './pages/Maintenance';
import { useSettings } from './context/SettingsContext';

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

import { ProductProvider } from './context/ProductContext';
import { OrderProvider } from './context/OrderContext';
import { SettingsProvider } from './context/SettingsContext';
import Admin from './pages/Admin';

function App() {
  return (
    <ProductProvider>
      <OrderProvider>
        <SettingsProvider>
          <CartProvider>
            <WishlistProvider>
              <Router>
                <AppRoutes />
                <CartDrawer />
              </Router>
            </WishlistProvider>
          </CartProvider>
        </SettingsProvider>
      </OrderProvider>
    </ProductProvider>
  );
}

function AppRoutes() {
  const location = useLocation();
  const { settings } = useSettings();

  // Maintenance Mode Logic
  const isAdminPath = location.pathname.startsWith('/admin');
  if (settings.maintenanceMode && !isAdminPath) {
    return <Maintenance />;
  }
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/product/:id" element={<PageWrapper><ProductDetail /></PageWrapper>} />
        <Route path="/shop" element={<PageWrapper><Shop /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
        <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
        <Route path="/faq" element={<PageWrapper><FAQ /></PageWrapper>} />
        <Route path="/checkout" element={<PageWrapper><Checkout /></PageWrapper>} />
        <Route path="/wishlist" element={<PageWrapper><Wishlist /></PageWrapper>} />
        <Route path="/auth" element={<PageWrapper><Auth /></PageWrapper>} />
        <Route path="/admin" element={<PageWrapper><Admin /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;

