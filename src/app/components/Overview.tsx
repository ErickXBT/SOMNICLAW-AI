import { motion } from 'motion/react';
import { Bot, TrendingUp, BarChart3, Heart } from 'lucide-react';
import { useInView } from './hooks/useInView';

export function Overview() {
  const { ref, inView } = useInView();

  const features = [
    {
      icon: Bot,
      title: '24/7 AI Health Assistant',
      description: 'Always available AI support for your sleep and wellness needs',
    },
    {
      icon: TrendingUp,
      title: 'Trader-Focused Sleep Education',
      description: 'Specialized guidance for high-performance crypto traders',
    },
    {
      icon: BarChart3,
      title: 'Data-Driven Sleep Insights',
      description: 'Track and analyze your sleep patterns with AI precision',
    },
    {
      icon: Heart,
      title: 'Digital Lifestyle Wellness Tools',
      description: 'Comprehensive tools for modern digital professionals',
    },
  ];

  return (
    <section ref={ref} className="relative py-16 sm:py-24 px-4 sm:px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-poppins font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-red-500 to-red-500 bg-clip-text text-transparent">
              The AI Night Guardian
            </span>
            <span className="block text-2xl sm:text-3xl md:text-4xl text-blue-300 mt-2">
              of Crypto
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            SOMNICLAW is an AI Health Agent designed for traders, Web3 builders, and digital workers operating in 24/7 markets. Built on Solana, it delivers a 24/7 AI assistant focused on insomnia and sleep optimization.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative p-6 rounded-xl border border-red-600/20 bg-black/40 backdrop-blur-sm hover:border-red-600/50 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-blue-500/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300" />
                <div className="absolute inset-0 bg-red-600/10 opacity-0 group-hover:opacity-100 blur-xl rounded-xl transition-opacity duration-300" />
                
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-600/20 to-blue-500/20 border border-red-600/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="text-xl mb-2 text-red-400">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
