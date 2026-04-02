import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
          <CartDrawer />
        </Router>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;
