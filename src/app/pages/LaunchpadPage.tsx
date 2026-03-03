import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Rocket, BarChart3, Zap, TrendingUp, ExternalLink, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const mockStats = [
  { label: 'Total Projects', value: '24', icon: Rocket, color: 'from-purple-400 to-pink-400' },
  { label: 'Total Raised', value: '$4.2M', icon: TrendingUp, color: 'from-pink-400 to-red-400' },
  { label: 'Active Launches', value: '6', icon: Zap, color: 'from-red-400 to-orange-400' },
  { label: 'AI Score Index', value: '92.4', icon: BarChart3, color: 'from-orange-400 to-yellow-400' },
];

const mockProjects = [
  {
    name: 'NeuraSleep Protocol',
    description: 'AI-driven sleep optimization engine with on-chain biometric analysis for traders.',
    symbol: '$NSLP',
    raised: 320000,
    goal: 500000,
    status: 'Live' as const,
  },
  {
    name: 'DreamVault AI',
    description: 'Decentralized dream journaling platform powered by generative AI and Solana.',
    symbol: '$DVAI',
    raised: 180000,
    goal: 300000,
    status: 'Live' as const,
  },
  {
    name: 'CircadianDAO',
    description: 'Community-governed circadian rhythm research fund with tokenized sleep data.',
    symbol: '$CRDN',
    raised: 750000,
    goal: 750000,
    status: 'Completed' as const,
  },
  {
    name: 'MelatoninFi',
    description: 'DeFi protocol that rewards healthy sleep habits with yield-bearing positions.',
    symbol: '$MELA',
    raised: 0,
    goal: 400000,
    status: 'Upcoming' as const,
  },
  {
    name: 'NightOwl Analytics',
    description: 'Real-time market sentiment analysis tool optimized for late-night trading sessions.',
    symbol: '$NOWL',
    raised: 95000,
    goal: 250000,
    status: 'Live' as const,
  },
  {
    name: 'SleepStake',
    description: 'Stake-to-earn protocol where sleep quality data determines validator rewards.',
    symbol: '$SLPS',
    raised: 0,
    goal: 600000,
    status: 'Upcoming' as const,
  },
];

async function getLaunchpadData() {
  return {
    stats: mockStats,
    projects: mockProjects,
  };
}

function StatCard({ stat, index }: { stat: typeof mockStats[0]; index: number }) {
  const Icon = stat.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
      className="group relative rounded-2xl border border-purple-500/20 bg-purple-950/20 backdrop-blur-sm p-6 hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-500"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className="text-sm text-gray-400 tracking-wide">{stat.label}</span>
      </div>
      <p className={`text-3xl font-poppins font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
        {stat.value}
      </p>
    </motion.div>
  );
}

function ProjectCard({ project, index }: { project: typeof mockProjects[0]; index: number }) {
  const progress = project.goal > 0 ? (project.raised / project.goal) * 100 : 0;
  const statusColor =
    project.status === 'Live'
      ? 'bg-green-500/20 text-green-400 border-green-500/30'
      : project.status === 'Completed'
        ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
        : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 + index * 0.08 }}
      className="group relative rounded-2xl border border-purple-500/15 bg-gradient-to-b from-purple-950/30 to-[#0b0000] backdrop-blur-sm p-6 hover:border-purple-500/40 hover:shadow-[0_0_40px_rgba(168,85,247,0.12)] transition-all duration-500"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-poppins font-bold text-white group-hover:text-purple-300 transition-colors">
            {project.name}
          </h3>
          <span className="text-xs text-pink-400 font-mono tracking-wider">{project.symbol}</span>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColor}`}>
          {project.status}
        </span>
      </div>

      <p className="text-sm text-gray-400 leading-relaxed mb-5 min-h-[3rem]">
        {project.description}
      </p>

      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Raised: ${(project.raised / 1000).toFixed(0)}K</span>
          <span>Goal: ${(project.goal / 1000).toFixed(0)}K</span>
        </div>
        <div className="w-full h-2 rounded-full bg-purple-950/60 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, delay: 0.5 + index * 0.1, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"
          />
        </div>
        <p className="text-right text-xs text-gray-500 mt-1">{progress.toFixed(0)}%</p>
      </div>

      <button className="w-full py-2.5 rounded-xl border border-purple-500/30 bg-purple-600/10 text-purple-300 text-sm font-medium hover:bg-purple-600/25 hover:border-purple-500/50 hover:text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer">
        View Project
        <ChevronRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

export default function LaunchpadPage() {
  const [stats, setStats] = useState(mockStats);
  const [projects, setProjects] = useState(mockProjects);

  useEffect(() => {
    getLaunchpadData().then((data) => {
      setStats(data.stats);
      setProjects(data.projects);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0000] text-white">
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-pink-900/10 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/15 via-transparent to-transparent pointer-events-none" />

      <header className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-purple-500/10 backdrop-blur-sm bg-[#0b0000]/60">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600/10 border border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-600/20 transition-all duration-300 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <div className="flex items-center gap-2">
          <Rocket className="w-5 h-5 text-pink-400" />
          <span className="text-sm font-poppins font-bold tracking-wider bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            SOMNICLAW LAUNCHPAD
          </span>
        </div>
      </header>

      <main className="relative z-10">
        <section className="px-6 pt-20 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium tracking-widest text-purple-300 border border-purple-500/30 bg-purple-600/10 mb-6">
              SOMNICLAW ECOSYSTEM
            </span>

            <h1 className="text-5xl md:text-7xl font-poppins font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient mb-6">
              SOMNICLAW LAUNCHPAD
            </h1>

            <p className="text-lg md:text-xl text-gray-400 leading-relaxed mb-10 max-w-2xl mx-auto">
              AI-powered launch infrastructure for Solana-native founders and digital builders.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:from-purple-500 hover:to-pink-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-300 flex items-center gap-2 cursor-pointer">
                <Rocket className="w-4 h-4" />
                Launch Your Project
              </button>
              <button className="px-8 py-3.5 rounded-xl border border-purple-500/30 bg-purple-600/10 text-purple-300 font-medium hover:bg-purple-600/20 hover:border-purple-500/50 hover:text-white transition-all duration-300 flex items-center gap-2 cursor-pointer">
                Explore Projects
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </section>

        <section className="px-6 pb-16">
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} index={i} />
            ))}
          </div>
        </section>

        <section className="px-6 pb-24">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4"
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-poppins font-bold text-white mb-1">
                  Featured Projects
                </h2>
                <p className="text-gray-500 text-sm">Curated launches vetted by SOMNICLAW AI</p>
              </div>
              <div className="flex gap-2">
                {['All', 'Live', 'Upcoming', 'Completed'].map((filter) => (
                  <button
                    key={filter}
                    className="px-4 py-1.5 rounded-lg text-xs font-medium border border-purple-500/20 text-gray-400 hover:text-purple-300 hover:border-purple-500/40 hover:bg-purple-600/10 transition-all duration-300 cursor-pointer"
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, i) => (
                <ProjectCard key={project.symbol} project={project} index={i} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
