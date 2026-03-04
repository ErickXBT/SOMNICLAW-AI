import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ParticleBackground } from '../components/ParticleBackground';

type VerifyStatus = 'idle' | 'checking' | 'failed' | 'verified';

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 20 20" className="w-5 h-5 fill-current text-green-400" aria-hidden="true">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const WalletIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 110-6h5.25A2.25 2.25 0 0121 6v6zm0 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18V6a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6" />
  </svg>
);

export default function WhitelistPage() {
  const navigate = useNavigate();

  const [xConnected, setXConnected] = useState(false);
  const [xUsername, setXUsername] = useState('');
  const [followStatus, setFollowStatus] = useState<VerifyStatus>('idle');
  const [repostStatus, setRepostStatus] = useState<VerifyStatus>('idle');
  const [email, setEmail] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [believerCount, setBelieverCount] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [flashVisible, setFlashVisible] = useState(false);

  const targetCount = 2431;

  useEffect(() => {
    let current = 0;
    const duration = 2000;
    const step = targetCount / (duration / 16);
    const interval = setInterval(() => {
      current += step;
      if (current >= targetCount) {
        current = targetCount;
        clearInterval(interval);
      }
      setBelieverCount(Math.floor(current));
    }, 16);
    return () => clearInterval(interval);
  }, []);

  const handleConnectX = useCallback(() => {
    setXConnected(true);
    setXUsername('early_believer');

    setTimeout(() => {
      setFollowStatus('checking');
      setTimeout(() => {
        setFollowStatus('verified');
      }, 2200);
    }, 800);

    setTimeout(() => {
      setRepostStatus('checking');
      setTimeout(() => {
        setRepostStatus('verified');
      }, 3000);
    }, 1600);
  }, []);

  const handleConnectWallet = useCallback(() => {
    setWalletConnected(true);
    setWalletAddress('7xK9...mP3q');
  }, []);

  const isEmailValid = email.includes('@') && email.includes('.');
  const allVerified =
    xConnected &&
    followStatus === 'verified' &&
    repostStatus === 'verified' &&
    isEmailValid &&
    walletConnected;

  const handleUnlock = useCallback(() => {
    if (!allVerified) return;
    setTransitioning(true);
    setTimeout(() => setFlashVisible(true), 1200);
    setTimeout(() => navigate('/'), 2400);
  }, [allVerified, navigate]);

  const renderStatusDot = (status: VerifyStatus) => {
    if (status === 'idle') return <span className="w-2.5 h-2.5 rounded-full bg-gray-600" />;
    if (status === 'checking')
      return <span className="w-2.5 h-2.5 rounded-full bg-gray-400 animate-pulse" />;
    if (status === 'failed')
      return <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />;
    return <CheckIcon />;
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ParticleBackground />

      {transitioning && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black transition-opacity duration-1000"
            style={{ opacity: transitioning ? 1 : 0 }}
          />
          <div
            className="relative z-10 w-32 h-32 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,27,27,0.4) 0%, transparent 70%)',
              animation: 'coreScale 1.5s ease-in-out infinite',
            }}
          />
          {flashVisible && (
            <div
              className="absolute inset-0 z-20 bg-red-600"
              style={{ animation: 'flashFade 0.6s ease-out forwards' }}
            />
          )}
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <div className="text-center mb-8 max-w-2xl">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #ff1b1b 0%, #ff4444 50%, #ff1b1b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 30px rgba(255,27,27,0.4))',
            }}
          >
            Enter The AI Launch Protocol
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl">
            Only verified early believers gain access.
          </p>
        </div>

        <div className="relative mb-10">
          <div
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto"
            style={{
              background: 'radial-gradient(circle, rgba(255,27,27,0.35) 0%, rgba(139,0,0,0.15) 50%, transparent 70%)',
              animation: 'coreRotate 8s linear infinite, corePulse 3s ease-in-out infinite',
              boxShadow: '0 0 60px rgba(255,27,27,0.2), 0 0 120px rgba(255,27,27,0.1)',
            }}
          />
        </div>

        <div className="w-full max-w-md bg-black/40 backdrop-blur-md border border-red-500/30 rounded-2xl p-6 sm:p-8 shadow-[0_0_40px_rgba(255,27,27,0.08)]">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold text-red-500/80 uppercase tracking-wider">Step 1</span>
              <span className="text-xs text-gray-600">Social Verification</span>
            </div>

            {!xConnected ? (
              <div>
                <button
                  onClick={handleConnectX}
                  className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl font-semibold text-white transition-all duration-300 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 hover:shadow-[0_0_25px_rgba(255,27,27,0.3)]"
                >
                  <XIcon />
                  Connect X Account
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">OAuth secure login required</p>
              </div>
            ) : (
              <div className="flex items-center gap-2 py-2.5 px-4 rounded-xl bg-green-500/10 border border-green-500/20">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-sm text-green-400">Connected as @{xUsername}</span>
              </div>
            )}
          </div>

          {xConnected && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-red-500/80 uppercase tracking-wider">Step 2</span>
                <span className="text-xs text-gray-600">Account Verification</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2.5 px-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-sm text-gray-300">Following @SomniclawAI</span>
                  {renderStatusDot(followStatus)}
                </div>
                <div className="flex items-center justify-between py-2.5 px-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-sm text-gray-300">Reposted Official Launch Post</span>
                  {renderStatusDot(repostStatus)}
                </div>
              </div>
            </div>
          )}

          {xConnected && followStatus === 'verified' && repostStatus === 'verified' && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-red-500/80 uppercase tracking-wider">Step 3</span>
                <span className="text-xs text-gray-600">Wallet & Email</span>
              </div>

              <div className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full py-2.5 px-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white placeholder:text-gray-600 outline-none focus:border-red-500/40 transition-colors"
                />

                {!walletConnected ? (
                  <button
                    onClick={handleConnectWallet}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm text-white transition-all duration-300 bg-white/[0.05] border border-white/[0.08] hover:border-red-500/30 hover:bg-white/[0.08]"
                  >
                    <WalletIcon />
                    Connect Solana Wallet
                  </button>
                ) : (
                  <div className="flex items-center gap-2 py-2.5 px-4 rounded-xl bg-green-500/10 border border-green-500/20">
                    <span className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-sm text-green-400">Wallet: {walletAddress}</span>
                  </div>
                )}

                <p className="text-xs text-gray-600 text-center">
                  Wallet required for early token allocation.
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handleUnlock}
            disabled={!allVerified}
            className={`w-full py-3.5 rounded-xl font-bold text-white text-base transition-all duration-300 ${
              allVerified
                ? 'bg-gradient-to-r from-red-700 to-red-500 hover:shadow-[0_0_40px_rgba(255,27,27,0.4)] hover:scale-[1.02] cursor-pointer'
                : 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
            }`}
          >
            Unlock Early Believer Access
          </button>
        </div>

        <div className="mt-10 text-center">
          <p className="text-gray-400 text-sm">
            Early Believers Verified:{' '}
            <span className="text-red-500 font-bold text-lg tabular-nums">
              {believerCount.toLocaleString()}
            </span>
          </p>
          <p className="text-gray-600 text-xs mt-1">
            Protocol closes when allocation is filled.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes coreRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes corePulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        @keyframes coreScale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(2.5); }
        }
        @keyframes flashFade {
          0% { opacity: 0.8; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
