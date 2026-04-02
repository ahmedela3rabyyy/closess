import { Truck, RefreshCw, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../sections/Header';
import Hero from '../sections/Hero';
import Products from '../sections/Products';
import Footer from '../sections/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main>
        <Hero />
        <Products />
        
        {/* Brand Banner */}
        <section className="relative overflow-hidden py-20 px-4">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00bfff]/10 via-transparent to-[#00bfff]/10" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="text-[#00bfff]" size={24} />
              <span className="text-[#00bfff] uppercase tracking-widest text-sm font-medium">
                Premium Quality
              </span>
              <Sparkles className="text-[#00bfff]" size={24} />
            </div>
            <h2 className="text-white text-3xl md:text-5xl font-bold uppercase tracking-wide mb-6">
              Elevate Your Style
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
              Discover our curated collection of premium knitwear designed for comfort, 
              style, and sustainability. Each piece is crafted with care and attention to detail.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-[#00bfff] text-black px-8 py-4 font-bold uppercase tracking-wider hover:bg-[#00a0e0] transition-all group"
            >
              Explore Collection
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-transparent via-gray-900/20 to-transparent">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-[#00bfff] uppercase tracking-widest text-sm font-medium">
                Why Choose Us
              </span>
              <h2 className="text-white text-3xl font-bold uppercase mt-2">
                The COVE Experience
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Free Shipping',
                  description: 'On all orders over $100. Fast and reliable delivery worldwide.',
                  icon: Truck,
                },
                {
                  title: 'Easy Returns',
                  description: '30-day hassle-free returns. Shop with confidence.',
                  icon: RefreshCw,
                },
                {
                  title: 'Secure Payment',
                  description: '100% secure checkout with encrypted transactions.',
                  icon: ShieldCheck,
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group text-center p-8 bg-gray-900/30 border border-gray-800 rounded-xl hover:border-[#00bfff]/50 hover:bg-gray-900/50 transition-all duration-300"
                >
                  <div className="w-16 h-16 mx-auto mb-6 bg-[#00bfff]/10 rounded-full flex items-center justify-center group-hover:bg-[#00bfff]/20 transition-colors">
                    <feature.icon className="text-[#00bfff]" size={28} />
                  </div>
                  <h3 className="text-white font-bold uppercase mb-3 text-lg">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00bfff]/5 to-purple-500/5" />
          <div className="max-w-2xl mx-auto text-center relative z-10">
            <span className="text-[#00bfff] uppercase tracking-widest text-sm font-medium">
              Stay Updated
            </span>
            <h2 className="text-white text-3xl md:text-4xl font-bold uppercase mt-2 mb-4">
              Join the COVE Community
            </h2>
            <p className="text-gray-400 mb-8">
              Subscribe to get exclusive offers, early access to new arrivals, and style tips.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-black/50 backdrop-blur-sm border border-gray-700 text-white px-6 py-4 rounded-xl focus:border-[#00bfff] focus:outline-none transition-all"
              />
              <button
                type="submit"
                className="bg-[#00bfff] text-black px-8 py-4 font-bold uppercase tracking-wider hover:bg-[#00a0e0] transition-all rounded-xl"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
