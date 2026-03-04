import { motion } from 'motion/react';
import { Twitter, Send, Github } from 'lucide-react';

export function Footer() {
  const socialLinks = [
    { icon: Twitter, label: 'Twitter', href: 'https://x.com/somniclaw' },
    { icon: Send, label: 'Telegram', href: '#' },
    { icon: Github, label: 'GitHub', href: '#' },
  ];

  return (
    <footer className="relative py-16 px-6 border-t border-red-600/20">
      {/* Glow line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-600/50 to-transparent" />
      
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-8">
          {/* Logo/Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h3 className="text-3xl font-poppins font-bold mb-2">
              <span className="bg-gradient-to-r from-red-500 to-red-500 bg-clip-text text-transparent">
                SOMNICLAW
              </span>
            </h3>
            <p className="text-red-400/80 text-sm">$SOMNICLAW</p>
          </motion.div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center space-y-2"
          >
            <p className="text-xl text-blue-300">Sleep Smart. Trade Sharp.</p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
              <span>Built on Solana</span>
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center gap-4"
          >
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="group relative w-12 h-12 rounded-lg border border-red-600/30 bg-red-600/10 backdrop-blur-sm flex items-center justify-center hover:border-red-600/60 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-red-600/20 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-red-600/30 opacity-0 group-hover:opacity-100 blur-lg rounded-lg transition-opacity duration-300" />
                  <Icon className="relative z-10 w-5 h-5 text-red-400 group-hover:text-red-300 group-hover:scale-110 transition-all duration-300" />
                </a>
              );
            })}
          </motion.div>

          {/* Bottom text */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center text-sm text-gray-500 pt-8 border-t border-red-600/10 w-full"
          >
            <p>© 2026 SOMNICLAW. All rights reserved.</p>
            <p className="mt-2 text-xs">
              This is not financial or medical advice. Always DYOR.
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}