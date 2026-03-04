import { motion } from 'motion/react';
import { PieChart, Users, Code, X } from 'lucide-react';
import { useInView } from './hooks/useInView';

export function TokenDistribution() {
  const { ref, inView } = useInView();

  const distribution = [
    {
      label: 'Public Sale',
      percentage: '95%',
      amount: '950,000,000',
      color: 'from-red-600 to-red-600',
      bgColor: 'bg-red-600/20',
      borderColor: 'border-red-600/30',
    },
    {
      label: 'Development',
      percentage: '5%',
      amount: '50,000,000',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30',
    },
  ];

  const highlights = [
    { icon: X, text: 'No VC allocation' },
    { icon: X, text: 'No private round' },
    { icon: Users, text: 'Community-first structure' },
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
            <span className="bg-gradient-to-r from-red-500 to-blue-400 bg-clip-text text-transparent">
              Token Distribution
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {distribution.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`relative p-8 rounded-2xl border ${item.borderColor} ${item.bgColor} backdrop-blur-sm overflow-hidden group hover:scale-105 transition-transform duration-300`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                    {index === 0 ? (
                      <Users className="w-5 h-5 text-white" />
                    ) : (
                      <Code className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <h3 className="text-2xl text-gray-200">{item.label}</h3>
                </div>

                <div className="space-y-2">
                  <div className="text-3xl sm:text-5xl bg-gradient-to-r ${item.color} bg-clip-text text-transparent">
                    {item.percentage}
                  </div>
                  <div className="text-xl text-gray-400">
                    {item.amount.toLocaleString()} tokens
                  </div>
                </div>

                {/* Visual bar */}
                <div className="mt-6 h-3 bg-black/40 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={inView ? { width: item.percentage } : {}}
                    transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                    className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative p-8 rounded-2xl border border-red-600/20 bg-gradient-to-br from-red-600/5 to-blue-500/5 backdrop-blur-sm"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <PieChart className="w-6 h-6 text-red-500" />
            <h3 className="text-xl text-red-400">Fair Distribution</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {highlights.map((highlight, index) => {
              const Icon = highlight.icon;
              const isNo = Icon === X;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-center gap-2 p-4 rounded-lg bg-black/40 border border-red-600/20"
                >
                  <Icon className={`w-5 h-5 ${isNo ? 'text-red-400' : 'text-green-400'}`} />
                  <span className="text-gray-300">{highlight.text}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
