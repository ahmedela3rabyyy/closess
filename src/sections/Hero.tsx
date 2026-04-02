import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useRef } from 'react';

export default function Hero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.2]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }
    }
  };

  return (
    <section ref={containerRef} className="relative w-full min-h-[110vh] overflow-hidden bg-black">
      {/* Background Image with Parallax */}
      <motion.div 
        style={{ y, scale, opacity }}
        className="absolute inset-0 z-0"
      >
        <img 
          src="/hero-group.jpg" 
          alt="NYX Fashion Collection"
          className="w-full h-full object-cover object-top"
        />
        
        {/* Advanced Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-black/20" />
      </motion.div>

      {/* Dynamic Grid Overlay */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,191,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }} 
      />

      {/* Floating Particles (More refined) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: Math.random() * 100 + '%',
              opacity: 0 
            }}
            animate={{ 
              y: [null, '-20%', '20%'],
              opacity: [0, 0.4, 0],
              scale: [1, 1.5, 1]
            }}
            transition={{ 
              duration: 5 + Math.random() * 5, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: Math.random() * 5
            }}
            className="absolute w-1 h-1 bg-primary rounded-full blur-[1px]"
          />
        ))}
      </div>

      {/* Content */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center justify-center min-h-screen responsive-container pt-20"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-8">
          <span className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 text-white px-6 py-2.5 rounded-full text-[10px] md:text-sm uppercase tracking-[0.4em] font-bold">
            <span className="w-2 h-2 bg-primary rounded-full animate-ping" />
            Collection 2026
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1 
          variants={itemVariants}
          className="text-white text-6xl md:text-8xl lg:text-[10rem] font-black uppercase tracking-tighter text-center leading-[0.8] mb-8"
        >
          <span className="block italic text-primary drop-shadow-[0_0_30px_rgba(0,191,255,0.3)]">NYX</span>
          <span className="block">STUDIO</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          variants={itemVariants}
          className="text-gray-400 text-base md:text-xl text-center max-w-xl mb-12 leading-relaxed font-medium uppercase tracking-widest"
        >
          Redefining premium knitwear through 
          <span className="text-white"> precision craftsmanship </span> 
          and modern aesthetics.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-6"
        >
          <Link
            to="/shop"
            className="group relative inline-flex items-center gap-4 bg-primary text-black px-10 py-5 font-black uppercase tracking-[0.2em] transition-all hover:bg-white hover:scale-105 active:scale-95 btn-shine-premium"
          >
            Shop Now
            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-500" />
          </Link>
          <Link
            to="/about"
            className="group inline-flex items-center gap-4 bg-transparent border-2 border-white/20 text-white px-10 py-5 font-black uppercase tracking-[0.2em] transition-all hover:border-primary hover:text-primary backdrop-blur-sm"
          >
            Explore
          </Link>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3 text-gray-500"
        >
          <span className="text-[10px] uppercase tracking-[0.5em] font-bold">Scroll</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ChevronDown size={24} />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Artistic Sidelines */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-8 opacity-30">
        <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-primary to-transparent" />
        <span className="text-primary text-[10px] font-bold uppercase tracking-[1em] vertical-text">Established 2026</span>
        <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-primary to-transparent" />
      </div>

      <style>{`
        .vertical-text {
          writing-mode: vertical-rl;
          transform: rotate(180deg);
        }
      `}</style>
    </section>
  );
}

