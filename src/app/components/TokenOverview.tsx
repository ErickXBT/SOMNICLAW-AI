import { motion } from 'motion/react';
import { Coins, CheckCircle2 } from 'lucide-react';
import { useInView } from './hooks/useInView';

export function TokenOverview() {
  const { ref, inView } = useInView();

  const tokenDetails = [
    { label: 'Name', value: 'SOMNICLAW' },
    { label: 'Ticker', value: '$SOMNICLAW' },
    { label: 'Network', value: 'Solana' },
    { label: 'Total Supply', value: '1,000,000,000' },
    { label: 'Mint Authority', value: 'Renounced (Post-Launch Plan)' },
    { label: 'Fixed Supply', value: 'Yes' },
  ];

  return (
    <section id="tokenomics" ref={ref} className="relative py-24 px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Token Overview
            </span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-3xl mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-3xl rounded-3xl" />
          
          <div className="relative p-8 md:p-12 rounded-2xl border border-purple-500/30 bg-black/60 backdrop-blur-xl overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <Coins className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl text-purple-300">Token Details</h3>
              </div>

              <div className="space-y-4">
                {tokenDetails.map((detail, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
                    className="flex justify-between items-center p-4 rounded-lg bg-purple-500/5 border border-purple-500/10 hover:border-purple-500/30 transition-colors duration-300"
                  >
                    <span className="text-gray-400">{detail.label}</span>
                    <span className="text-purple-300 flex items-center gap-2">
                      {detail.value}
                      {detail.label === 'Fixed Supply' && (
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      )}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
