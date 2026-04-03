import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone, ArrowUpRight, Youtube } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';

export default function Footer() {
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 md:gap-12 mb-16">
          {/* Logo & Description */}
          <div className="sm:col-span-2 space-y-6 md:space-y-8">
            <Link to="/" className="group inline-flex items-center">
              <div className="relative flex items-center">
                {/* The "NY" - Sleek and High-end */}
                <span className="text-3xl md:text-5xl font-extralight italic tracking-tighter text-white/90">
                  NY
                </span>
                
                {/* The "X" - Integrated & Luminous */}
                <div className="relative ml-1">
                  <span className="text-3xl md:text-5xl font-black italic tracking-tighter text-white">
                    X
                  </span>
                  {/* The Cyan Slash Overlay */}
                  <div className="absolute inset-0 bg-primary clip-x-slash mix-blend-screen shadow-[0_0_30px_#00bfff]" />
                </div>

                {/* The North Star Dot */}
                <div className="absolute -top-2 left-[40%] w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_12px_#00bfff]" />
              </div>
            </Link>
            <p className="text-gray-500 leading-relaxed max-w-xs font-medium italic text-sm md:text-base">
              "Architectural Minimalism • Midnight Luxury"
            </p>
            {/* Social Icons */}
            <div className="flex gap-4">
              {[
                { icon: Instagram, href: settings.instagram },
                { icon: Facebook, href: settings.facebook },
                { icon: Twitter, href: settings.twitter },
                { icon: Youtube, href: settings.youtube },
              ].filter(social => social.href).map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -5, backgroundColor: '#00bfff', color: '#000000' }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-500 transition-all"
                >
                  <social.icon size={16} className="md:w-5 md:h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div className="space-y-4">
            <h3 className="text-white font-bold uppercase mb-4 md:mb-6 text-xs md:text-sm tracking-wider">
              Shop
            </h3>
            <ul className="space-y-2 md:space-y-3 text-sm">
              {[
                { name: 'All Products', path: '/shop' },
                { name: 'Men', path: '/shop?category=men' },
                { name: 'Women', path: '/shop?category=women' },
                { name: 'Accessories', path: '/shop?category=accessories' },
                { name: 'Sale', path: '/shop?sale=true' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="group text-gray-400 hover:text-[#00bfff] transition-colors flex items-center gap-1"
                  >
                    {link.name}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h3 className="text-white font-bold uppercase mb-4 md:mb-6 text-xs md:text-sm tracking-wider">
              Support
            </h3>
            <ul className="space-y-2 md:space-y-3 text-sm">
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Contact', path: '/contact' },
                { name: 'FAQ', path: '/faq' },
                { name: 'Shipping Info', path: '/shipping' },
                { name: 'Returns', path: '/returns' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="group text-gray-400 hover:text-[#00bfff] transition-colors flex items-center gap-1"
                  >
                    {link.name}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-white font-bold uppercase mb-4 md:mb-6 text-xs md:text-sm tracking-wider">
              Contact
            </h3>
            <ul className="space-y-3 md:space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 md:w-9 md:h-9 bg-[#00bfff]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin size={14} className="text-[#00bfff] md:w-4 md:h-4" />
                </div>
                <span className="text-gray-400 text-xs md:text-sm whitespace-pre-line leading-relaxed">
                  {settings.address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 md:w-9 md:h-9 bg-[#00bfff]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone size={14} className="text-[#00bfff] md:w-4 md:h-4" />
                </div>
                <span className="text-gray-400 text-xs md:text-sm">{settings.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 md:w-9 md:h-9 bg-[#00bfff]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail size={14} className="text-[#00bfff] md:w-4 md:h-4" />
                </div>
                <span className="text-gray-400 text-xs md:text-sm">{settings.email}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © {currentYear} NYX. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                to="/privacy"
                className="text-gray-500 text-sm hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gray-500 text-sm hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
