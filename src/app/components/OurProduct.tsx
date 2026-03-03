import { motion } from 'motion/react';
import { Link } from 'react-router';
import { useInView } from './hooks/useInView';

const cards = [
  {
    title: 'SOMNICLAW ASSISTANT',
    description:
      'AI-powered insomnia market assistant that monitors volatility, detects whale movement, and generates alpha insights in real time.',
    cta: 'Enter Assistant →',
    link: '/assistant',
  },
  {
    title: 'SOMNICLAW LAUNCHPAD',
    description:
      'Token & AI project accelerator built for Solana-native founders. Launch, scale, and dominate the night cycle.',
    cta: 'Explore Launchpad →',
    link: '/launchpad',
  },
  {
    title: 'SOMNICLAW GENERATIVE AI',
    description:
      'Neural generative engine that transforms prompts into cyberpunk reality. Visual AI built for digital dominance.',
    cta: 'Launch Generative AI →',
    link: '/generative-ai',
  },
];

export function OurProduct() {
  const { ref, inView } = useInView();

  return (
    <section ref={ref} className="relative py-24 px-6 overflow-hidden">
      <div className="container mx-auto max-w-6xl text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="inline-block text-sm tracking-[0.25em] uppercase text-pink-400 mb-4"
        >
          OUR PRODUCT
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient mb-6"
        >
          SOMNICLAW AI AGENT
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-16"
        >
          A multi-layer AI ecosystem built for traders, builders and digital
          creators who never sleep.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.15 }}
              className="group relative rounded-2xl border border-purple-500/20 bg-black/40 backdrop-blur-xl p-8 text-left transition-all duration-500 hover:border-pink-500/40 hover:shadow-[0_0_40px_rgba(236,72,153,0.15)]"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <h3 className="relative text-xl font-bold text-white mb-4">
                {card.title}
              </h3>

              <p className="relative text-gray-400 leading-relaxed mb-8">
                {card.description}
              </p>

              <Link
                to={card.link}
                className="relative inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-600/20 border border-purple-500/40 text-purple-300 hover:text-white hover:bg-purple-600/30 hover:border-pink-500/50 transition-all duration-300 text-sm font-medium"
              >
                {card.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
