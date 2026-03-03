import { motion } from 'motion/react';
import { AlertTriangle, Moon, Brain, Zap, TrendingDown } from 'lucide-react';
import { useInView } from './hooks/useInView';

export function Problem() {
  const { ref, inView } = useInView();

  const problems = [
    { icon: Moon, text: 'Disrupted sleep patterns' },
    { icon: Brain, text: 'Overthinking charts' },
    { icon: Zap, text: 'Stress & anxiety' },
    { icon: TrendingDown, text: 'Chronic insomnia' },
    { icon: AlertTriangle, text: 'Reduced trading performance' },
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
            <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              The Market Never Sleeps
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative p-6 rounded-xl border border-red-500/20 bg-black/40 backdrop-blur-sm hover:border-red-500/40 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300" />
                <div className="relative z-10 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-red-400" />
                  </div>
                  <p className="text-gray-300">{problem.text}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Warning Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative p-8 rounded-2xl border-2 border-red-500/40 bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-sm overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 animate-pulse" />
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex items-center gap-4 justify-center">
            <AlertTriangle className="w-8 h-8 text-red-400 animate-pulse" />
            <p className="text-xl md:text-2xl text-center">
              <span className="text-red-300">Lack of sleep</span>
              <span className="text-gray-300"> = </span>
              <span className="text-orange-300">poor trading decisions</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
