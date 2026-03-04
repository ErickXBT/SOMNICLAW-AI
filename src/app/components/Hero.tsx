import { motion } from 'motion/react';
import { ArrowRight, ExternalLink } from 'lucide-react';

export function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 via-transparent to-transparent pointer-events-none" />
      
      <div className="container mx-auto max-w-6xl text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 sm:space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-block"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-600/30 bg-red-600/10 backdrop-blur-sm">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
              <span className="text-sm text-red-400">Built on Solana</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-8xl tracking-tight font-poppins font-bold leading-tight break-words"
          >
            <span className="block bg-gradient-to-r from-red-500 via-red-500 to-red-500 bg-clip-text text-transparent animate-gradient">
              SOMNICLAW
            </span>
            <span className="block text-xl sm:text-3xl md:text-5xl text-red-400/90 mt-2">
              ($SOMNICLAW)
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl sm:text-2xl md:text-3xl text-blue-300/90 max-w-3xl mx-auto"
          >
            AI Health Agent for Insomnia
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-base sm:text-lg md:text-xl text-gray-400 italic max-w-2xl mx-auto"
          >
            "When the market never sleeps, Claw appears."
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-6 sm:pt-8"
          >
            <button
              disabled
              className="group relative w-full sm:w-auto px-5 sm:px-8 py-4 rounded-xl sm:rounded-lg bg-gray-800/50 border border-gray-600/30 text-gray-500 cursor-not-allowed overflow-hidden text-base sm:text-sm"
            >
              <span className="relative z-10 flex items-center gap-2 justify-center">
                Launch App (Coming Soon)
                <ExternalLink className="w-4 h-4" />
              </span>
            </button>

            <button
              onClick={() => scrollToSection('tokenomics')}
              className="group relative w-full sm:w-auto px-5 sm:px-8 py-4 rounded-xl sm:rounded-lg bg-red-700/20 border border-red-600/50 text-red-400 hover:text-white transition-all duration-300 overflow-hidden text-base sm:text-sm cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-700/0 via-red-700/30 to-red-700/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 bg-red-600/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
              <span className="relative z-10 flex items-center gap-2 justify-center">
                View Tokenomics
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>

            <a
              href="https://x.com/i/communities/2027519059449823333"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-full sm:w-auto px-5 sm:px-8 py-4 rounded-xl sm:rounded-lg bg-blue-600/20 border border-blue-500/50 text-blue-300 hover:text-white transition-all duration-300 overflow-hidden inline-block text-center text-base sm:text-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/30 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
              <span className="relative z-10 flex items-center gap-2 justify-center">
                Join Community
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-red-600/30 rounded-full flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-red-600 rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
