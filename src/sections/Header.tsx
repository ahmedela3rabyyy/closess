import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Search, User, ShoppingBag, X, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import SearchModal from './SearchModal';

export default function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const { totalItems: wishlistCount } = useWishlist();

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'NEW ARRIVALS', path: '/shop' },
    { name: 'MEN', path: '/shop?category=men' },
    { name: 'WOMEN', path: '/shop?category=women' },
    { name: 'ACCESSORIES', path: '/shop?category=accessories' },
    { name: 'SALE', path: '/shop?sale=true' },
  ];

  const isActive = (path: string) => {
    if (path === '/shop') return location.pathname === '/shop';
    return location.search.includes(path.split('?')[1] || '');
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled 
            ? 'bg-black/95 backdrop-blur-md shadow-lg shadow-black/20' 
            : 'bg-transparent'
        }`}
      >
        {/* Top Bar - Only visible when scrolled */}
        <div 
          className={`overflow-hidden transition-all duration-500 ${
            isScrolled ? 'max-h-0' : 'max-h-10'
          }`}
        >
          <div className="bg-[#00bfff]/10 border-b border-[#00bfff]/20 py-2 px-4">
            <p className="text-center text-[#00bfff] text-xs uppercase tracking-widest">
              Free Shipping on Orders Over $100
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 lg:px-8 py-4">
          {/* Left Icons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-[#00bfff] transition-colors p-2 hover:bg-white/5 rounded-lg"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-white hover:text-[#00bfff] transition-colors p-2 hover:bg-white/5 rounded-lg hidden sm:block"
            >
              <Search size={22} />
            </button>
          </div>

          {/* Logo */}
          <Link 
            to="/" 
            className="absolute left-1/2 transform -translate-x-1/2 group"
          >
            <div className="relative">
              <svg
                viewBox="0 0 120 40"
                className="h-8 w-auto transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(0,191,255,0.5)]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <text
                  x="10"
                  y="30"
                  fill="#00bfff"
                  fontFamily="Arial, sans-serif"
                  fontSize="28"
                  fontWeight="bold"
                  fontStyle="italic"
                >
                  COVE
                </text>
                <circle cx="95" cy="20" r="8" fill="#00bfff" opacity="0.8" />
                <circle cx="105" cy="20" r="6" fill="#00bfff" opacity="0.5" />
              </svg>
            </div>
          </Link>

          {/* Right Icons */}
          <div className="flex items-center gap-2">
            <Link
              to="/wishlist"
              className="text-white hover:text-[#00bfff] transition-colors p-2 hover:bg-white/5 rounded-lg relative"
            >
              <Heart size={22} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#00bfff] text-black text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              to="/auth"
              className="text-white hover:text-[#00bfff] transition-colors p-2 hover:bg-white/5 rounded-lg"
            >
              <User size={22} />
            </Link>
            <button
              onClick={() => setIsCartOpen(true)}
              className="text-white hover:text-[#00bfff] transition-colors p-2 hover:bg-white/5 rounded-lg relative"
            >
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#00bfff] text-black text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Navigation - Visible when scrolled */}
        <nav 
          className={`hidden lg:flex justify-center gap-8 pb-3 transition-all duration-500 ${
            isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`text-sm font-medium uppercase tracking-wider transition-colors relative group ${
                isActive(item.path) 
                  ? 'text-[#00bfff]' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {item.name}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#00bfff] transition-all duration-300 ${
                isActive(item.path) ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </Link>
          ))}
        </nav>

        {/* Mobile Menu */}
        <div 
          className={`lg:hidden overflow-hidden transition-all duration-500 ${
            isMenuOpen ? 'max-h-screen' : 'max-h-0'
          }`}
        >
          <nav className="bg-black/95 backdrop-blur-md border-t border-gray-800 px-4 py-6">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block text-lg font-medium py-3 px-4 rounded-lg transition-all ${
                      isActive(item.path)
                        ? 'text-[#00bfff] bg-[#00bfff]/10'
                        : 'text-white hover:text-[#00bfff] hover:bg-white/5'
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <li className="border-t border-gray-800 pt-4 mt-4">
                <Link
                  to="/about"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-gray-400 text-lg py-3 px-4 rounded-lg hover:text-white hover:bg-white/5 transition-all"
                >
                  ABOUT US
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-gray-400 text-lg py-3 px-4 rounded-lg hover:text-white hover:bg-white/5 transition-all"
                >
                  CONTACT
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-gray-400 text-lg py-3 px-4 rounded-lg hover:text-white hover:bg-white/5 transition-all"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
