import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

export default function LaunchpadPage() {
  return (
    <div className="min-h-screen bg-[#0b0000] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center max-w-2xl"
      >
        <h1 className="text-5xl md:text-7xl font-poppins font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient mb-6">
          SOMNICLAW LAUNCHPAD
        </h1>
        <p className="text-lg text-gray-400 mb-10 leading-relaxed">
          Token & AI project accelerator built for Solana-native founders.
          Launch, scale, and dominate the night cycle. Coming soon.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-600/20 border border-purple-500/40 text-purple-300 hover:text-white hover:bg-purple-600/30 transition-all duration-300 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
