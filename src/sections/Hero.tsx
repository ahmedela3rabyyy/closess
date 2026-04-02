import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0">
        <img 
          src="/hero-group.jpg" 
          alt="COVE Fashion Collection"
          className="w-full h-full object-cover object-top scale-105"
          style={{
            animation: isLoaded ? 'slowZoom 20s ease-in-out infinite alternate' : 'none',
          }}
        />
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
      </div>

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#00bfff]/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-20">
        {/* Badge */}
        <div 
          className={`mb-6 transition-all duration-1000 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="inline-flex items-center gap-2 bg-[#00bfff]/20 border border-[#00bfff]/30 text-[#00bfff] px-4 py-2 rounded-full text-sm uppercase tracking-wider">
            <span className="w-2 h-2 bg-[#00bfff] rounded-full animate-pulse" />
            New Collection 2026
          </span>
        </div>

        {/* Main Title */}
        <h1 
          className={`text-white text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-wider text-center mb-6 transition-all duration-1000 delay-200 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{
            textShadow: '0 0 40px rgba(0, 191, 255, 0.3)',
          }}
        >
          SHOP NOW
        </h1>

        {/* Subtitle */}
        <p 
          className={`text-gray-300 text-lg md:text-xl text-center max-w-2xl mb-10 transition-all duration-1000 delay-400 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          Discover premium knitwear crafted with passion and precision. 
          Elevate your wardrobe with COVE.
        </p>

        {/* CTA Buttons */}
        <div 
          className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-600 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <Link
            to="/shop"
            className="group inline-flex items-center gap-3 bg-[#00bfff] text-black px-8 py-4 font-bold uppercase tracking-wider hover:bg-[#00a0e0] transition-all rounded-xl"
          >
            Shop Collection
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/about"
            className="group inline-flex items-center gap-3 bg-transparent border-2 border-white/30 text-white px-8 py-4 font-bold uppercase tracking-wider hover:border-[#00bfff] hover:text-[#00bfff] transition-all rounded-xl"
          >
            Learn More
          </Link>
        </div>

        {/* Scroll Indicator */}
        <div 
          className={`absolute bottom-10 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-800 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <ChevronDown size={24} className="animate-bounce" />
          </div>
        </div>
      </div>

      {/* Side Decorative Elements */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 hidden lg:flex flex-col gap-4">
        <div className="w-px h-20 bg-gradient-to-b from-transparent via-[#00bfff]/50 to-transparent" />
        <span className="text-[#00bfff] text-xs uppercase tracking-widest writing-mode-vertical rotate-180" style={{ writingMode: 'vertical-rl' }}>
          COVE 26
        </span>
        <div className="w-px h-20 bg-gradient-to-b from-transparent via-[#00bfff]/50 to-transparent" />
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes slowZoom {
          0% { transform: scale(1.05); }
          100% { transform: scale(1.15); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) opacity(0.3); }
          50% { transform: translateY(-20px) opacity(0.8); }
        }
      `}</style>
    </section>
  );
}
