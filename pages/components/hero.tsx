import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

interface HeroProps {
  backgroundImage: string;
  onCtaClick: () => void;
}

export function Hero({ backgroundImage, onCtaClick }: HeroProps) {
  return (
    <section className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-primary/20 text-primary font-sans font-semibold tracking-wider text-sm mb-4 border border-primary/30 backdrop-blur-sm">
            EST. 2024
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-2 tracking-tight drop-shadow-lg">
            Bev's Bakery
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-light font-sans tracking-wide max-w-2xl mx-auto drop-shadow-md">
            Authentic Jamaican flavors, baked with soul and tradition.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="pt-8"
        >
          <Button 
            size="lg" 
            onClick={onCtaClick}
            className="text-lg px-8 py-6 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] transition-all duration-300 transform hover:-translate-y-1"
            data-testid="hero-cta"
          >
            Order Now
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/70 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <ArrowDown className="w-8 h-8" />
      </motion.div>
    </section>
  );
}
