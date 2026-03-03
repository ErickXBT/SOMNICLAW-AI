import { motion } from 'motion/react';
import { Rocket, Users, Sparkles, Globe } from 'lucide-react';
import { useInView } from './hooks/useInView';

export function Roadmap() {
  const { ref, inView } = useInView();

  const phases = [
    {
      phase: 'Phase 1',
      icon: Rocket,
      color: 'from-purple-500 to-pink-500',
      items: [
        'Token Launch on Solana',
        'Website & Branding',
        'Community Building',
      ],
    },
    {
      phase: 'Phase 2',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      items: [
        'AI Beta Release',
        'Strategic Web3 Partnerships',
      ],
    },
    {
      phase: 'Phase 3',
      icon: Sparkles,
      color: 'from-purple-500 to-blue-500',
      items: [
        'Sleep Prediction AI Upgrade',
        'Smartwatch Integration',
      ],
    },
    {
      phase: 'Phase 4',
      icon: Globe,
      color: 'from-pink-500 to-purple-500',
      items: [
        'Global Health Expansion',
        'Institutional Partnerships',
      ],
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
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Roadmap
            </span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500/50 via-blue-500/50 to-pink-500/50 -translate-x-1/2" />

          <div className="space-y-12">
            {phases.map((phase, index) => {
              const Icon = phase.icon;
              const isEven = index % 2 === 0;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className={`relative flex items-center ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  } flex-col gap-8`}
                >
                  {/* Content */}
                  <div className={`w-full md:w-5/12 ${isEven ? 'md:text-right' : 'md:text-left'} text-center`}>
                    <div className={`inline-block p-6 rounded-xl border border-purple-500/30 bg-black/60 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300 ${isEven ? 'md:ml-auto' : 'md:mr-auto'}`}>
                      <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${phase.color} flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl text-purple-300">{phase.phase}</h3>
                      </div>
                      <ul className="space-y-2 text-left">
                        {phase.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-2 text-gray-300">
                            <span className="text-purple-400 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Center icon */}
                  <div className="relative z-10 flex items-center justify-center w-16 h-16 md:w-20 md:h-20 shrink-0">
                    <div className={`absolute inset-0 bg-gradient-to-br ${phase.color} rounded-full blur-xl opacity-50`} />
                    <div className={`relative w-full h-full rounded-full bg-gradient-to-br ${phase.color} border-4 border-black flex items-center justify-center`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Spacer for opposite side */}
                  <div className="hidden md:block w-5/12" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
