import { motion } from 'motion/react';
import { Sparkles, BarChart3, Zap, Wrench, Vote, Rocket, ImageIcon } from 'lucide-react';
import { Link } from 'react-router';
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
    <section id="utility" ref={ref} className="relative py-16 sm:py-24 px-4 sm:px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-poppins font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-red-500 to-red-500 bg-clip-text text-transparent">
              Real Utility.
            </span>
            <span className="block text-2xl sm:text-3xl md:text-4xl text-blue-300 mt-2">
              Not Just Speculation.
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {utilities.map((utility, index) => {
            const Icon = utility.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative p-6 rounded-xl border border-red-600/20 bg-black/40 backdrop-blur-sm hover:border-red-600/50 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-red-600/10 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300" />
                <div className="absolute inset-0 bg-red-600/10 opacity-0 group-hover:opacity-100 blur-xl rounded-xl transition-opacity duration-300" />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-600/30 to-red-600/30 border border-red-600/40 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Icon className="w-7 h-7 text-red-400" />
                  </div>
                  <h3 className="text-lg mb-2 text-red-400">{utility.title}</h3>
                  <p className="text-sm text-gray-400">{utility.description}</p>
                </div>

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-red-600/30 rounded-full blur-2xl" />
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link to="/launchpad" className="group relative block p-8 rounded-2xl border border-red-600/20 bg-black/40 backdrop-blur-sm hover:border-red-600/50 hover:shadow-[0_0_40px_rgba(255,26,26,0.15)] transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-red-700/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600/30 to-red-700/30 border border-red-600/40 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Rocket className="w-8 h-8 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-poppins font-bold text-red-400">SOMNICLAW Launchpad</h3>
                    <span className="text-xs text-red-600/60 tracking-wider font-medium">SOLANA MAINNET</span>
                  </div>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed mb-4">
                  AI-powered token launch infrastructure for Solana-native founders. Deploy SPL tokens, connect your Phantom wallet, and launch your project directly on mainnet with built-in AI scoring and analytics.
                </p>
                <span className="inline-flex items-center gap-2 text-sm text-red-500 group-hover:text-red-400 transition-colors">
                  Open Launchpad
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </span>
              </div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-red-600/20 rounded-full blur-3xl" />
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Link to="/generative-ai" className="group relative block p-8 rounded-2xl border border-red-600/20 bg-black/40 backdrop-blur-sm hover:border-red-600/50 hover:shadow-[0_0_40px_rgba(255,26,26,0.15)] transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-blue-500/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600/30 to-blue-500/30 border border-red-600/40 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                    <ImageIcon className="w-8 h-8 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-poppins font-bold text-red-400">SOMNICLAW Generative AI</h3>
                    <span className="text-xs text-red-600/60 tracking-wider font-medium">GPT-IMAGE-1</span>
                  </div>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed mb-4">
                  Generate stunning AI-powered images with our neural canvas. Upload reference images, choose aesthetic profiles, and synthesize cyberpunk-themed artwork using OpenAI's latest gpt-image-1 model.
                </p>
                <span className="inline-flex items-center gap-2 text-sm text-red-500 group-hover:text-red-400 transition-colors">
                  Open Generative AI
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </span>
              </div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-red-600/20 rounded-full blur-3xl" />
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
