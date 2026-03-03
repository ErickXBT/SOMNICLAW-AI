import { motion } from 'motion/react';
import { Sparkles, BarChart3, Zap, Wrench, Vote } from 'lucide-react';
import { useInView } from './hooks/useInView';

export function Utility() {
  const { ref, inView } = useInView();

  const utilities = [
    {
      icon: Sparkles,
      title: 'Unlock premium AI features',
      description: 'Access advanced AI capabilities and personalized insights',
    },
    {
      icon: BarChart3,
      title: 'Advanced sleep analytics',
      description: 'Deep dive into your sleep data with comprehensive reports',
    },
    {
      icon: Zap,
      title: 'Priority consultations',
      description: 'Skip the queue and get instant AI assistance',
    },
    {
      icon: Wrench,
      title: 'Advanced in-app tools',
      description: 'Exclusive tools for power users and professionals',
    },
    {
      icon: Vote,
      title: 'Future governance access',
      description: 'Have a say in the development roadmap',
    },
  ];

  return (
    <section ref={ref} className="relative py-24 px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Real Utility.
            </span>
            <span className="block text-3xl md:text-4xl text-blue-300 mt-2">
              Not Just Speculation.
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {utilities.map((utility, index) => {
            const Icon = utility.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative p-6 rounded-xl border border-purple-500/20 bg-black/40 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300" />
                <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 blur-xl rounded-xl transition-opacity duration-300" />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-purple-500/40 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Icon className="w-7 h-7 text-purple-300" />
                  </div>
                  <h3 className="text-lg mb-2 text-purple-300">{utility.title}</h3>
                  <p className="text-sm text-gray-400">{utility.description}</p>
                </div>

                {/* Glow effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-purple-500/30 rounded-full blur-2xl" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
