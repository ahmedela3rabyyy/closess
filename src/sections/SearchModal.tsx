import { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { searchProducts } from '../data/products';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query.length >= 2 ? searchProducts(query) : [];

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
    onClose();
    setQuery('');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/90 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-x-0 top-0 z-50 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          {/* Search Input */}
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
              size={24}
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-gray-900 border border-gray-700 text-white pl-14 pr-14 py-4 rounded-lg text-lg focus:border-[#00bfff] focus:outline-none"
            />
            <button
              onClick={onClose}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Results */}
          {query.length >= 2 && (
            <div className="mt-4 bg-gray-900 border border-gray-800 rounded-lg overflow-hidden max-h-[60vh] overflow-y-auto">
              {results.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-400">
                    No products found for "{query}"
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-800">
                  {results.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleProductClick(product.id)}
                      className="w-full flex items-center gap-4 p-4 hover:bg-gray-800/50 transition-colors text-left"
                    >
                      <div className="w-16 h-20 bg-white rounded overflow-hidden flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium uppercase">
                          {product.name}
                        </h3>
                        <p className="text-gray-400 text-sm uppercase">
                          {product.subtitle}
                        </p>
                        <p className="text-[#00bfff] font-bold mt-1">
                          ${product.price}
                        </p>
                      </div>
                      <ArrowRight className="text-gray-500" size={20} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Quick Links */}
          {query.length < 2 && (
            <div className="mt-8">
              <p className="text-gray-500 text-sm uppercase tracking-wider mb-4">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {['Sweater', 'Knitted', 'Blue', 'Pink', 'Boxy', 'Crew Neck'].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-4 py-2 bg-gray-900 border border-gray-800 text-gray-400 rounded-lg hover:border-[#00bfff] hover:text-white transition-colors"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
