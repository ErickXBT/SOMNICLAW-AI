import { motion } from 'motion/react';
import { Shield, FileCheck, Lock, Eye, CheckCircle2 } from 'lucide-react';
import { useInView } from './hooks/useInView';

export function Security() {
  const { ref, inView } = useInView();

  const features = [
    {
      icon: FileCheck,
      title: 'Planned smart contract audit',
      description: 'Third-party security audit scheduled',
    },
    {
      icon: Eye,
      title: 'Transparent development wallet',
      description: 'All development funds publicly trackable',
    },
    {
      icon: Lock,
      title: 'No minting after launch',
      description: 'Mint authority will be renounced',
    },
    {
      icon: CheckCircle2,
      title: 'Fixed supply',
      description: 'Total supply locked at 1 billion',
    },
    {
      icon: Shield,
      title: 'Clear allocation structure',
      description: 'Transparent tokenomics with no hidden allocations',
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
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Security & Transparency
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative p-6 rounded-xl border border-green-500/20 bg-black/40 backdrop-blur-sm hover:border-green-500/50 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300" />
                <div className="absolute inset-0 bg-green-500/10 opacity-0 group-hover:opacity-100 blur-xl rounded-xl transition-opacity duration-300" />
                
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-lg mb-2 text-green-300">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
