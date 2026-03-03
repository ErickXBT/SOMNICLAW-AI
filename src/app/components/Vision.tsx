import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { useInView } from './hooks/useInView';

export function Vision() {
  const { ref, inView } = useInView();

  return (
    <section ref={ref} className="relative py-24 px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-poppins font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Health is Alpha.
            </span>
            <span className="block text-3xl md:text-4xl text-blue-300 mt-2">
              Sleep is Strategy.
            </span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl mx-auto mb-16"
        >
          <p className="text-lg text-gray-300 text-center leading-relaxed">
            SOMNICLAW aims to become the AI Night Guardian of the global crypto ecosystem, helping traders and builders maintain peak performance while protecting their most valuable asset: their health.
          </p>
        </motion.div>

        {/* Glowing Quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative max-w-4xl mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20 blur-3xl rounded-3xl" />
          
          <div className="relative p-12 md:p-16 rounded-2xl border-2 border-purple-500/30 bg-black/60 backdrop-blur-xl overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
            
            <div className="relative z-10 text-center">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500/50 blur-2xl rounded-full" />
                  <Sparkles className="relative w-12 h-12 text-purple-400" />
                </div>
              </div>
              
              <blockquote className="text-2xl md:text-4xl text-center">
                <span className="text-gray-400">"</span>
                <span className="bg-gradient-to-r from-purple-300 via-blue-300 to-pink-300 bg-clip-text text-transparent">
                  In a market that never sleeps, balance is power.
                </span>
                <span className="text-gray-400">"</span>
              </blockquote>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
