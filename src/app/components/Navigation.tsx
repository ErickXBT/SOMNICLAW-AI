import { useState, useEffect, useCallback } from 'react';
import { Menu, X, Wallet, LogOut, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [walletKey, setWalletKey] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sol = (window as any).solana;
    if (sol?.isPhantom) {
      sol.connect({ onlyIfTrusted: true }).then((resp: any) => {
        setWalletKey(resp.publicKey.toBase58());
      }).catch(() => {});

      const handleChange = (pk: any) => {
        setWalletKey(pk ? pk.toBase58() : null);
      };
      sol.on('accountChanged', handleChange);
      return () => { sol.off('accountChanged', handleChange); };
    }
  }, []);

  const isMobile = useCallback(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }, []);

  const connectWallet = useCallback(async () => {
    if (!(window as any).solana?.isPhantom) {
      if (isMobile()) {
        window.location.href = 'https://phantom.app/ul/browse/https://somniclaw.xyz';
      } else {
        window.open('https://phantom.app', '_blank');
      }
      return;
    }
    setConnecting(true);
    try {
      const resp = await (window as any).solana.connect();
      setWalletKey(resp.publicKey.toBase58());
    } catch {} finally {
      setConnecting(false);
    }
  }, [isMobile]);

  const disconnectWallet = useCallback(async () => {
    try {
      await (window as any).solana?.disconnect();
      setWalletKey(null);
    } catch {}
  }, []);

  const truncatedAddress = walletKey ? `${walletKey.slice(0, 4)}...${walletKey.slice(-4)}` : null;

  const navItems = [
    { label: 'Home', href: '#home', action: 'scroll-top' },
    { label: 'AI Agent', href: '#ai-agent', action: 'scroll' },
    { label: 'Utility', href: '#utility', action: 'scroll' },
    { label: 'Tokenomics', href: '#tokenomics', action: 'scroll' },
    { label: 'Roadmap', href: '#roadmap', action: 'scroll' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsOpen(false);
  };

  const scrollToSection = (item: typeof navItems[0]) => {
    if (item.action === 'scroll-top') {
      scrollToTop();
    } else {
      const element = document.querySelector(item.href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-lg border-b border-red-600/20' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto max-w-6xl px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={scrollToTop}
            className="text-xl md:text-2xl bg-gradient-to-r from-red-500 to-red-500 bg-clip-text text-transparent hover:from-red-400 hover:to-red-400 transition-all duration-300"
          >
            <div className="flex items-center gap-2 md:gap-3">
              <ImageWithFallback
                src="https://i.imgur.com/WXPxOA1.png"
                alt="SOMNICLAW Logo"
                className="w-8 h-8 md:w-10 md:h-10 object-contain"
              />
              <span className="font-poppins font-bold">SOMNICLAW</span>
            </div>
          </button>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => scrollToSection(item)}
                className="text-gray-300 hover:text-red-400 transition-colors duration-300 text-sm"
              >
                {item.label}
              </button>
            ))}

            {walletKey ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-600/20">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-mono text-red-400">{truncatedAddress}</span>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="p-1.5 rounded-lg bg-red-600/10 border border-red-500/30 text-red-400 hover:text-white hover:bg-red-600/20 transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={connecting}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-700 to-red-700 text-white text-sm font-medium hover:from-red-600 hover:to-red-600 hover:shadow-[0_0_20px_rgba(255,26,26,0.3)] disabled:opacity-50 transition-all duration-300 cursor-pointer"
              >
                {connecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wallet className="w-4 h-4" />}
                {connecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-10 h-10 rounded-lg border border-red-600/30 bg-red-600/10 flex items-center justify-center hover:border-red-600/60 transition-colors duration-300"
          >
            {isOpen ? (
              <X className="w-5 h-5 text-red-400" />
            ) : (
              <Menu className="w-5 h-5 text-red-400" />
            )}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="pt-4 pb-2 space-y-2">
                {navItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToSection(item)}
                    className="block w-full text-left px-4 py-3 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-600/10 transition-all duration-300"
                  >
                    {item.label}
                  </button>
                ))}

                {walletKey ? (
                  <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-red-950/30 border border-red-600/10">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-xs font-mono text-red-400">{truncatedAddress}</span>
                    </div>
                    <button
                      onClick={disconnectWallet}
                      className="text-red-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { connectWallet(); setIsOpen(false); }}
                    disabled={connecting}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-red-700 to-red-700 text-white text-sm font-medium disabled:opacity-50 transition-all duration-300 cursor-pointer"
                  >
                    {connecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wallet className="w-4 h-4" />}
                    {connecting ? 'Connecting...' : 'Connect Wallet'}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}