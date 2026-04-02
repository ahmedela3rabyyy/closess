import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-gray-800">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <svg
                viewBox="0 0 120 40"
                className="h-10 w-auto"
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
            </Link>
            <p className="text-gray-400 leading-relaxed mb-6 max-w-sm">
              Redefining modern fashion with comfort, style, and sustainability. 
              Premium quality clothing for everyone.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3">
              {[
                { icon: Instagram, href: '#' },
                { icon: Facebook, href: '#' },
                { icon: Twitter, href: '#' },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-11 h-11 bg-gray-900 border border-gray-800 rounded-xl flex items-center justify-center text-gray-400 hover:bg-[#00bfff] hover:text-black hover:border-[#00bfff] transition-all duration-300"
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-white font-bold uppercase mb-6 text-sm tracking-wider">
              Shop
            </h3>
            <ul className="space-y-3">
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
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-bold uppercase mb-6 text-sm tracking-wider">
              Support
            </h3>
            <ul className="space-y-3">
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
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold uppercase mb-6 text-sm tracking-wider">
              Contact
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#00bfff]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin size={16} className="text-[#00bfff]" />
                </div>
                <span className="text-gray-400 text-sm">
                  123 Fashion Avenue<br />
                  New York, NY 10001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#00bfff]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone size={16} className="text-[#00bfff]" />
                </div>
                <span className="text-gray-400 text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#00bfff]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail size={16} className="text-[#00bfff]" />
                </div>
                <span className="text-gray-400 text-sm">support@cove.com</span>
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
              © {currentYear} COVE. All rights reserved.
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
