import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Rocket, BarChart3, Zap, TrendingUp, ExternalLink,
  ChevronRight, Wallet, Copy, Check, X, Upload, Send, Loader2, Globe, LogOut,
  CheckCircle, XCircle, Circle
} from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Connection, PublicKey, LAMPORTS_PER_SOL,
  Transaction, SystemProgram, Keypair
} from '@solana/web3.js';
import {
  createInitializeMintInstruction, createAssociatedTokenAccountInstruction,
  createMintToInstruction, getAssociatedTokenAddress, getMinimumBalanceForRentExemptMint,
  MINT_SIZE, TOKEN_PROGRAM_ID
} from '@solana/spl-token';

type ToastType = 'success' | 'error' | 'loading' | 'info';
interface Toast { id: string; type: ToastType; message: string; }

type DeployStatus = 'idle' | 'preparing' | 'signing' | 'confirming' | 'success' | 'failed';

interface LaunchedToken {
  name: string;
  ticker: string;
  mintAddress: string;
  logoPreview: string | null;
  timestamp: number;
  signature?: string;
}

interface SuccessData {
  mintAddress: string;
  name: string;
  ticker: string;
  logoPreview: string | null;
  signature?: string;
  metadataUrl?: string;
}

function formatCA(address: string): string {
  return `SOMNI-${address.slice(0, 6)}...${address.slice(-4)}`;
}

const getRpcUrl = () => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api/rpc`;
  }
  return 'https://api.mainnet-beta.solana.com';
};

const connection = new Connection(getRpcUrl(), 'confirmed');

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  const colors: Record<ToastType, string> = {
    success: 'border-green-500/40 bg-green-950/80 text-green-300',
    error: 'border-red-500/40 bg-red-950/80 text-red-300',
    loading: 'border-red-600/40 bg-red-950/80 text-red-400',
    info: 'border-blue-500/40 bg-blue-950/80 text-blue-300',
  };
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className={`px-4 py-3 rounded-xl border backdrop-blur-sm text-sm flex items-center gap-3 ${colors[t.type]}`}
          >
            {t.type === 'loading' && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
            <span className="flex-1">{t.message}</span>
            <button onClick={() => onRemove(t.id)} className="shrink-0 cursor-pointer opacity-60 hover:opacity-100"><X className="w-3 h-3" /></button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

const TREASURY_WALLET = '6WiXumkgZMMYDVMqspZ7NDumiMTcz4AtnPLunafv1cCa';
const DEPLOY_FEE_SOL = 0.02;

const DEPLOY_STEPS = [
  { key: 'preparing', label: 'Preparing transaction' },
  { key: 'signing', label: 'Request wallet signature' },
  { key: 'confirming', label: 'Submitting & confirming on Solana' },
  { key: 'success', label: 'Deploy complete' },
] as const;

function DeployProgress({ status }: { status: DeployStatus }) {
  if (status === 'idle') return null;

  const stepOrder = ['preparing', 'signing', 'confirming', 'success'];
  const currentIndex = stepOrder.indexOf(status);
  const isFailed = status === 'failed';

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-4 p-4 rounded-xl bg-red-950/30 border border-red-600/10"
    >
      <div className="space-y-2.5">
        {DEPLOY_STEPS.map((step, i) => {
          const stepIndex = stepOrder.indexOf(step.key);
          let icon;
          let textColor = 'text-gray-600';

          if (isFailed && stepIndex >= currentIndex) {
            if (stepIndex === currentIndex || (currentIndex === -1 && stepIndex === 0)) {
              icon = <XCircle className="w-4 h-4 text-red-500" />;
              textColor = 'text-red-400';
            } else {
              icon = <Circle className="w-4 h-4 text-gray-700" />;
            }
          } else if (stepIndex < currentIndex) {
            icon = <CheckCircle className="w-4 h-4 text-green-500" />;
            textColor = 'text-green-400';
          } else if (stepIndex === currentIndex) {
            icon = <Loader2 className="w-4 h-4 text-red-500 animate-spin" />;
            textColor = 'text-red-400';
          } else {
            icon = <Circle className="w-4 h-4 text-gray-700" />;
          }

          return (
            <div key={step.key} className={`flex items-center gap-3 ${textColor}`}>
              {icon}
              <span className="text-xs font-medium">{step.label}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function SuccessModal({ data, onClose }: { data: SuccessData; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const copyAddress = () => {
    navigator.clipboard.writeText(data.mintAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl border border-red-600/30 bg-gradient-to-b from-red-950/90 to-[#070707] backdrop-blur-xl p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-poppins font-bold text-green-400">Token Deployed</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        {data.logoPreview && (
          <div className="flex justify-center mb-6">
            <img src={data.logoPreview} alt="Token Logo" className="w-20 h-20 rounded-2xl border border-red-600/30 object-cover" />
          </div>
        )}

        <div className="text-center mb-6">
          <p className="text-2xl font-poppins font-bold text-white">{data.name}</p>
          <p className="text-red-500 font-mono text-sm">${data.ticker}</p>
          <p className="text-red-400 font-mono text-xs mt-1">{formatCA(data.mintAddress)}</p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/40 border border-red-600/20">
            <span className="text-xs text-gray-500 shrink-0">Mint:</span>
            <span className="text-xs text-red-400 font-mono truncate flex-1">{data.mintAddress}</span>
            <button onClick={copyAddress} className="shrink-0 cursor-pointer text-red-500 hover:text-white">
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {data.signature && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/40 border border-red-600/20">
              <span className="text-xs text-gray-500 shrink-0">TX:</span>
              <a
                href={`https://solscan.io/tx/${data.signature}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-red-400 font-mono truncate flex-1 hover:text-red-300"
              >
                {data.signature.slice(0, 20)}...{data.signature.slice(-8)}
              </a>
              <ExternalLink className="w-3 h-3 text-gray-600 shrink-0" />
            </div>
          )}

          {data.metadataUrl && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/40 border border-red-600/20">
              <span className="text-xs text-gray-500 shrink-0">Metadata:</span>
              <span className="text-xs text-red-400 font-mono truncate flex-1">{data.metadataUrl}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-600/20">
              <p className="text-xs text-gray-500 mb-1">Market Cap</p>
              <p className="text-sm font-bold text-white">$0.00</p>
            </div>
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-600/20">
              <p className="text-xs text-gray-500 mb-1">Liquidity</p>
              <p className="text-sm font-bold text-yellow-400">Pending</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <a
            href={`https://solscan.io/token/${data.mintAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 rounded-xl border border-red-600/30 bg-red-700/10 text-red-400 text-sm font-medium hover:bg-red-700/20 transition-all duration-300 flex items-center justify-center gap-2"
          >
            View on Solscan <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href={`https://dexscreener.com/solana/${data.mintAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 rounded-xl border border-red-600/30 bg-red-700/10 text-red-400 text-sm font-medium hover:bg-red-700/20 transition-all duration-300 flex items-center justify-center gap-2"
          >
            View on Dexscreener <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SendSolModal({
  onClose,
  onSend,
  sending,
}: {
  onClose: () => void;
  onSend: (recipient: string, amount: number) => Promise<void>;
  sending: boolean;
}) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('0.001');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-red-600/30 bg-gradient-to-b from-red-950/90 to-[#070707] backdrop-blur-xl p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-poppins font-bold text-white">Send SOL</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Recipient Address</label>
            <input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Enter Solana address"
              className="w-full px-4 py-3 rounded-xl bg-red-950/40 border border-red-600/20 text-white text-sm placeholder-gray-600 focus:border-red-600/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Amount (SOL)</label>
            <input
              type="number"
              step="0.001"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-red-950/40 border border-red-600/20 text-white text-sm focus:border-red-600/50 focus:outline-none"
            />
          </div>
          <button
            onClick={() => onSend(recipient, parseFloat(amount))}
            disabled={sending || !recipient || !amount}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-red-700 to-red-700 text-white font-medium hover:from-red-600 hover:to-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {sending ? 'Sending...' : 'Send Transaction'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

const mockStats = [
  { label: 'Total Projects', value: '24', icon: Rocket, color: 'from-red-500 to-red-500' },
  { label: 'Total Raised', value: '$4.2M', icon: TrendingUp, color: 'from-red-500 to-red-400' },
  { label: 'Active Launches', value: '6', icon: Zap, color: 'from-red-400 to-orange-400' },
  { label: 'AI Score Index', value: '92.4', icon: BarChart3, color: 'from-orange-400 to-yellow-400' },
];

export default function LaunchpadPage() {
  const [walletKey, setWalletKey] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [connecting, setConnecting] = useState(false);

  const [projectName, setProjectName] = useState('');
  const [ticker, setTicker] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [twitter, setTwitter] = useState('');
  const [telegram, setTelegram] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [deploying, setDeploying] = useState(false);
  const [deployStatus, setDeployStatus] = useState<DeployStatus>('idle');
  const [successData, setSuccessData] = useState<SuccessData | null>(null);
  const [recentLaunches, setRecentLaunches] = useState<LaunchedToken[]>([]);

  const [showSendModal, setShowSendModal] = useState(false);
  const [sending, setSending] = useState(false);

  const [aiScore, setAiScore] = useState<{
    score: number; risk: string; whale_interest: boolean;
    metrics: Record<string, number>;
    analysis: string;
    mint_authority?: string;
    freeze_authority?: string;
  } | null>(null);
  const [scoringLoading, setScoringLoading] = useState(false);

  const [toasts, setToasts] = useState<Toast[]>([]);
  const addToast = useCallback((type: ToastType, message: string, duration = 4000) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, type, message }]);
    if (type !== 'loading') {
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
    }
    return id;
  }, []);
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const fetchBalance = useCallback(async (key: string) => {
    try {
      const bal = await connection.getBalance(new PublicKey(key));
      setBalance(bal / LAMPORTS_PER_SOL);
    } catch {
      setBalance(null);
    }
  }, []);

  useEffect(() => {
    const sol = window.solana;
    if (sol?.isPhantom) {
      sol.connect({ onlyIfTrusted: true }).then((resp: any) => {
        const key = resp.publicKey.toBase58();
        setWalletKey(key);
        fetchBalance(key);
      }).catch(() => {});

      const handleChange = (pk: any) => {
        if (pk) {
          const key = pk.toBase58();
          setWalletKey(key);
          fetchBalance(key);
        } else {
          setWalletKey(null);
          setBalance(null);
        }
      };
      sol.on('accountChanged', handleChange);
      return () => { sol.off('accountChanged', handleChange); };
    }
  }, [fetchBalance]);

  const isMobile = useCallback(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }, []);

  const connectWallet = async () => {
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
      const key = resp.publicKey.toBase58();
      setWalletKey(key);
      await fetchBalance(key);
      addToast('success', 'Wallet connected');
    } catch (e: any) {
      addToast('error', e?.message || 'Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      await (window as any).solana?.disconnect();
      setWalletKey(null);
      setBalance(null);
      addToast('info', 'Wallet disconnected');
    } catch {}
  };

  const truncatedAddress = walletKey ? `${walletKey.slice(0, 4)}...${walletKey.slice(-4)}` : null;

  const fetchAiScore = async () => {
    setScoringLoading(true);
    setAiScore(null);
    try {
      const res = await fetch('/api/ai-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: projectName || 'Unknown', symbol: ticker || 'TOKEN' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to get AI score');
      setAiScore(data);
    } catch (e: any) {
      addToast('error', e?.message || 'AI scoring failed');
    } finally {
      setScoringLoading(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const formValid = projectName.trim() && ticker.trim() && ticker.length <= 9 && description.trim();

  const handleDeploy = async () => {
    if (!walletKey || !formValid) return;
    const phantom = (window as any).solana;
    if (!phantom?.isPhantom) {
      addToast('error', 'Please connect Phantom wallet before deploying.');
      return;
    }
    setDeploying(true);
    setDeployStatus('preparing');
    const loadingId = addToast('loading', 'Preparing token transaction...');

    try {
      const payer = new PublicKey(walletKey);
      const mintKeypair = Keypair.generate();
      const mintPubkey = mintKeypair.publicKey;
      const mintAddress = mintPubkey.toBase58();

      const lamports = await getMinimumBalanceForRentExemptMint(connection);
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

      const ata = await getAssociatedTokenAddress(mintPubkey, payer);
      const mintAmount = BigInt(1_000_000_000) * BigInt(10 ** 9);

      const transaction = new Transaction();

      transaction.add(
        SystemProgram.transfer({
          fromPubkey: payer,
          toPubkey: new PublicKey(TREASURY_WALLET),
          lamports: Math.floor(DEPLOY_FEE_SOL * LAMPORTS_PER_SOL),
        })
      );

      transaction.add(
        SystemProgram.createAccount({
          fromPubkey: payer,
          newAccountPubkey: mintPubkey,
          space: MINT_SIZE,
          lamports,
          programId: TOKEN_PROGRAM_ID,
        })
      );

      transaction.add(
        createInitializeMintInstruction(mintPubkey, 9, payer, payer, TOKEN_PROGRAM_ID)
      );

      transaction.add(
        createAssociatedTokenAccountInstruction(payer, ata, payer, mintPubkey)
      );

      transaction.add(
        createMintToInstruction(mintPubkey, ata, payer, mintAmount)
      );

      transaction.recentBlockhash = blockhash;
      transaction.feePayer = payer;
      transaction.partialSign(mintKeypair);

      const simulation = await connection.simulateTransaction(transaction);
      if (simulation.value.err) {
        throw new Error('Transaction simulation failed. Please check your SOL balance.');
      }

      setDeployStatus('signing');
      removeToast(loadingId);
      const signingId = addToast('loading', 'Please sign the transaction in your wallet...');

      const walletTimeout = setTimeout(() => {
        removeToast(signingId);
        addToast('info', 'Waiting for wallet confirmation...', 15000);
      }, 10000);

      let signed;
      try {
        signed = await phantom.signTransaction(transaction);
      } finally {
        clearTimeout(walletTimeout);
      }
      const rawTx = signed.serialize();

      setDeployStatus('confirming');
      removeToast(signingId);
      const confirmingId = addToast('loading', 'Submitting to Solana...');

      const sig = await connection.sendRawTransaction(rawTx, { skipPreflight: false });
      await connection.confirmTransaction({ signature: sig, blockhash, lastValidBlockHeight }, 'confirmed');

      removeToast(confirmingId);

      const confirmRes = await fetch('/api/confirm-deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signature: sig,
          mintAddress,
          name: projectName.trim(),
          symbol: ticker.trim(),
          description: description.trim(),
          website: website.trim() || undefined,
          twitter: twitter.trim() || undefined,
          telegram: telegram.trim() || undefined,
          logo: logoPreview || undefined,
        }),
      });

      const confirmData = await confirmRes.json();

      setDeployStatus('success');
      addToast('success', 'Token deployed successfully!');

      setSuccessData({
        mintAddress,
        name: projectName,
        ticker,
        logoPreview,
        signature: sig,
        metadataUrl: confirmData?.metadataUrl,
      });
      setRecentLaunches((prev) => [
        { name: projectName, ticker, mintAddress, logoPreview, timestamp: Date.now(), signature: sig },
        ...prev,
      ]);

      setProjectName('');
      setTicker('');
      setDescription('');
      setWebsite('');
      setTwitter('');
      setTelegram('');
      setLogoFile(null);
      setLogoPreview(null);

      await fetchBalance(walletKey);
    } catch (e: any) {
      removeToast(loadingId);
      setDeployStatus('failed');
      addToast('error', e?.message || 'Token deployment failed');
    } finally {
      setDeploying(false);
      setTimeout(() => setDeployStatus('idle'), 8000);
    }
  };

  const handleSendSol = async (recipient: string, amount: number) => {
    if (!walletKey) return;
    setSending(true);
    const loadingId = addToast('loading', 'Sending SOL...');
    try {
      let recipientKey: PublicKey;
      try {
        recipientKey = new PublicKey(recipient);
      } catch {
        throw new Error('Invalid recipient address');
      }

      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(walletKey),
          toPubkey: recipientKey,
          lamports: Math.floor(amount * LAMPORTS_PER_SOL),
        })
      );
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = new PublicKey(walletKey);

      const { signature } = await (window as any).solana.signAndSendTransaction(transaction);
      await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, 'confirmed');

      removeToast(loadingId);
      addToast('success', `Sent ${amount} SOL! Sig: ${signature.slice(0, 8)}...`);
      setShowSendModal(false);
      await fetchBalance(walletKey);
    } catch (e: any) {
      removeToast(loadingId);
      addToast('error', e?.message || 'Transaction failed');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white">
      <div className="fixed inset-0 bg-gradient-to-br from-red-950/10 via-transparent to-red-950/10 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-950/15 via-transparent to-transparent pointer-events-none" />

      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <AnimatePresence>
        {successData && <SuccessModal data={successData} onClose={() => setSuccessData(null)} />}
        {showSendModal && walletKey && (
          <SendSolModal onClose={() => setShowSendModal(false)} onSend={handleSendSol} sending={sending} />
        )}
      </AnimatePresence>

      <header className="relative z-20 flex items-center justify-between px-4 md:px-6 py-4 border-b border-red-600/10 backdrop-blur-sm bg-[#070707]/60">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-700/10 border border-red-600/30 text-red-400 hover:text-white hover:bg-red-700/20 transition-all duration-300 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Home</span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          <Rocket className="w-5 h-5 text-red-500" />
          <span className="text-sm font-poppins font-bold tracking-wider bg-gradient-to-r from-red-500 to-red-500 bg-clip-text text-transparent">
            SOMNICLAW LAUNCHPAD
          </span>
        </div>

        <div className="flex items-center gap-2">
          {walletKey ? (
            <>
              <button
                onClick={() => setShowSendModal(true)}
                className="px-3 py-2 rounded-lg bg-red-700/10 border border-red-600/30 text-red-400 hover:text-white hover:bg-red-700/20 transition-all text-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-950/40 border border-red-600/20">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-mono text-red-400">{truncatedAddress}</span>
                {balance !== null && (
                  <span className="text-xs text-gray-500">{balance.toFixed(3)} SOL</span>
                )}
              </div>
              <button
                onClick={disconnectWallet}
                className="px-3 py-2 rounded-lg bg-red-600/10 border border-red-500/30 text-red-400 hover:text-white hover:bg-red-600/20 transition-all text-xs cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <button
              onClick={connectWallet}
              disabled={connecting}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-700 to-red-700 text-white text-sm font-medium hover:from-red-600 hover:to-red-600 disabled:opacity-50 transition-all cursor-pointer"
            >
              {connecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wallet className="w-4 h-4" />}
              {connecting ? 'Connecting...' : 'Connect Phantom'}
            </button>
          )}
        </div>
      </header>

      <main className="relative z-10">
        <section className="px-4 md:px-6 pt-16 pb-12 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium tracking-widest text-red-400 border border-red-600/30 bg-red-700/10 mb-6">
              SOMNICLAW ECOSYSTEM
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-7xl font-poppins font-bold bg-gradient-to-r from-red-500 via-red-500 to-red-500 bg-clip-text text-transparent animate-gradient mb-4 leading-tight break-words">
              SOMNICLAW LAUNCHPAD
            </h1>
            <p className="text-base md:text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
              AI-powered launch infrastructure for Solana-native founders and digital builders.
            </p>
          </motion.div>
        </section>

        <section className="px-4 md:px-6 pb-12">
          <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3">
            {mockStats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className="group rounded-2xl border border-red-600/20 bg-red-950/20 backdrop-blur-sm p-4 md:p-6 hover:border-red-600/40 hover:shadow-[0_0_30px_rgba(255,26,26,0.15)] transition-all duration-500"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <Icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <span className="text-xs text-gray-400">{stat.label}</span>
                  </div>
                  <p className={`text-2xl md:text-3xl font-poppins font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="px-4 md:px-6 pb-20">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="rounded-2xl border border-red-600/20 bg-gradient-to-b from-red-950/30 to-[#070707] backdrop-blur-sm p-6 md:p-8"
              >
                <h2 className="text-2xl font-poppins font-bold text-white mb-6">Deploy Your Token</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block">Project Name <span className="text-red-400">*</span></label>
                    <input
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="e.g. SomniToken"
                      className="w-full px-4 py-3 rounded-xl bg-red-950/40 border border-red-600/20 text-white text-sm placeholder-gray-600 focus:border-red-600/50 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block">Ticker Symbol <span className="text-red-400">*</span> <span className="text-gray-600">(max 9)</span></label>
                    <input
                      value={ticker}
                      onChange={(e) => setTicker(e.target.value.toUpperCase().slice(0, 9))}
                      placeholder="e.g. SOMNI"
                      className="w-full px-4 py-3 rounded-xl bg-red-950/40 border border-red-600/20 text-white text-sm placeholder-gray-600 focus:border-red-600/50 focus:outline-none font-mono transition-colors"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-xs text-gray-400 mb-1.5 block">Description <span className="text-red-400">*</span></label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your project..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-red-950/40 border border-red-600/20 text-white text-sm placeholder-gray-600 focus:border-red-600/50 focus:outline-none resize-none transition-colors"
                  />
                </div>

                <div className="mb-4">
                  <label className="text-xs text-gray-400 mb-1.5 block">Project Logo</label>
                  <div
                    onClick={() => logoInputRef.current?.click()}
                    className="flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-red-600/20 bg-red-950/20 cursor-pointer hover:border-red-600/40 transition-colors"
                  >
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo" className="w-14 h-14 rounded-xl object-cover border border-red-600/30" />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-red-950/40 border border-red-600/20 flex items-center justify-center">
                        <Upload className="w-5 h-5 text-gray-600" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-300">{logoFile ? logoFile.name : 'Upload logo image'}</p>
                      <p className="text-xs text-gray-600">PNG, JPG up to 2MB</p>
                    </div>
                  </div>
                  <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block">Website</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                      <input
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-red-950/40 border border-red-600/20 text-white text-sm placeholder-gray-600 focus:border-red-600/50 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block">Twitter</label>
                    <input
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      placeholder="@handle"
                      className="w-full px-4 py-3 rounded-xl bg-red-950/40 border border-red-600/20 text-white text-sm placeholder-gray-600 focus:border-red-600/50 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block">Telegram</label>
                    <input
                      value={telegram}
                      onChange={(e) => setTelegram(e.target.value)}
                      placeholder="t.me/group"
                      className="w-full px-4 py-3 rounded-xl bg-red-950/40 border border-red-600/20 text-white text-sm placeholder-gray-600 focus:border-red-600/50 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-red-950/30 border border-red-600/10 mb-6">
                  <div className="text-xs text-gray-500">
                    <p>Supply: <span className="text-red-400 font-mono">1,000,000,000</span></p>
                    <p>Decimals: <span className="text-red-400 font-mono">9</span></p>
                    <p>Network: <span className="text-red-400">Solana Mainnet</span></p>
                    <p>Deploy Fee: <span className="text-yellow-400 font-mono">0.02 SOL</span></p>
                  </div>
                  <div className="flex items-center gap-2">
                    {walletKey ? (
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                        <span className="text-xs text-green-400">Connected</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-400" />
                        <span className="text-xs text-red-400">Not Connected</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleDeploy}
                  disabled={deploying || !walletKey || !formValid}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-red-700 to-red-700 text-white font-poppins font-bold text-lg hover:from-red-600 hover:to-red-600 hover:shadow-[0_0_40px_rgba(255,26,26,0.4)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer"
                >
                  {deploying ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Deploying to Solana...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-5 h-5" />
                      Deploy to Solana
                    </>
                  )}
                </button>

                <AnimatePresence>
                  <DeployProgress status={deployStatus} />
                </AnimatePresence>

                {!walletKey && (
                  <p className="text-xs text-center text-gray-600 mt-3">Connect your Phantom wallet to deploy</p>
                )}
              </motion.div>
            </div>

            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="rounded-2xl border border-red-600/20 bg-gradient-to-b from-red-950/30 to-[#070707] backdrop-blur-sm p-6 sticky top-6"
              >
                <h3 className="text-lg font-poppins font-bold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-red-500" />
                  Recent Launches
                </h3>

                {recentLaunches.length === 0 ? (
                  <div className="text-center py-12">
                    <Rocket className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                    <p className="text-sm text-gray-600">No launches yet</p>
                    <p className="text-xs text-gray-700 mt-1">Deploy your first token above</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentLaunches.map((token) => (
                      <div
                        key={token.mintAddress}
                        className="flex items-center gap-3 p-3 rounded-xl bg-red-950/30 border border-red-600/10 hover:border-red-600/30 transition-colors"
                      >
                        {token.logoPreview ? (
                          <img src={token.logoPreview} alt="" className="w-9 h-9 rounded-lg object-cover border border-red-600/20" />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-red-950/60 border border-red-600/20 flex items-center justify-center text-xs font-bold text-red-500">
                            {token.ticker.slice(0, 2)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{token.name}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-red-500 font-mono">${token.ticker}</span>
                            <span className="text-xs text-gray-600 font-mono truncate">
                              {formatCA(token.mintAddress)}
                            </span>
                          </div>
                        </div>
                        <a
                          href={`https://solscan.io/token/${token.mintAddress}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-600 hover:text-red-400 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                )}

                {walletKey && (
                  <div className="mt-6 pt-4 border-t border-red-600/10">
                    <h4 className="text-xs text-gray-500 mb-3 font-medium">WALLET</h4>
                    <div className="p-3 rounded-xl bg-red-950/30 border border-red-600/10">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">Address</span>
                        <span className="text-xs font-mono text-red-400">{truncatedAddress}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Balance</span>
                        <span className="text-xs font-mono text-white">{balance !== null ? `${balance.toFixed(4)} SOL` : '...'}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-red-600/10">
                  <h4 className="text-xs text-gray-500 mb-3 font-medium flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5" />
                    AI RISK ANALYSIS
                  </h4>

                  <button
                    onClick={fetchAiScore}
                    disabled={scoringLoading}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-700 to-red-600 text-white text-xs font-medium hover:from-red-600 hover:to-red-500 disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer mb-3"
                  >
                    {scoringLoading ? (
                      <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Analyzing...</>
                    ) : (
                      <><TrendingUp className="w-3.5 h-3.5" /> Run AI Analysis</>
                    )}
                  </button>

                  {aiScore && (
                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-red-950/30 border border-red-600/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-400">Score</span>
                          <span className={`text-lg font-bold font-mono ${
                            aiScore.score >= 80 ? 'text-green-400' : aiScore.score >= 65 ? 'text-yellow-400' : 'text-red-400'
                          }`}>{aiScore.score}/100</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-gray-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              aiScore.score >= 80 ? 'bg-green-500' : aiScore.score >= 65 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${aiScore.score}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-600/10">
                          <p className="text-[10px] text-gray-500 mb-0.5">Risk Level</p>
                          <p className={`text-xs font-bold uppercase ${
                            aiScore.risk === 'low' ? 'text-green-400' : aiScore.risk === 'medium' ? 'text-yellow-400' : 'text-red-400'
                          }`}>{aiScore.risk}</p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-600/10">
                          <p className="text-[10px] text-gray-500 mb-0.5">Whale Interest</p>
                          <p className={`text-xs font-bold ${aiScore.whale_interest ? 'text-green-400' : 'text-gray-500'}`}>
                            {aiScore.whale_interest ? 'Detected' : 'None'}
                          </p>
                        </div>
                      </div>

                      {(aiScore.mint_authority || aiScore.freeze_authority) && (
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-600/10">
                            <p className="text-[10px] text-gray-500 mb-0.5">Mint Authority</p>
                            <p className={`text-xs font-bold uppercase ${
                              aiScore.mint_authority === 'revoked' ? 'text-green-400' : 'text-yellow-400'
                            }`}>{aiScore.mint_authority || 'N/A'}</p>
                          </div>
                          <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-600/10">
                            <p className="text-[10px] text-gray-500 mb-0.5">Freeze Authority</p>
                            <p className={`text-xs font-bold uppercase ${
                              aiScore.freeze_authority === 'revoked' ? 'text-green-400' : 'text-yellow-400'
                            }`}>{aiScore.freeze_authority || 'N/A'}</p>
                          </div>
                        </div>
                      )}

                      <div className="space-y-1.5">
                        {Object.entries(aiScore.metrics).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-500 w-24 capitalize">{key.replace(/_/g, ' ')}</span>
                            <div className="flex-1 h-1 rounded-full bg-gray-800 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${value >= 70 ? 'bg-green-500/70' : value >= 50 ? 'bg-yellow-500/70' : 'bg-red-500/70'}`}
                                style={{ width: `${value}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-mono text-gray-400 w-6 text-right">{value}</span>
                          </div>
                        ))}
                      </div>

                      <p className="text-[10px] text-gray-600 leading-relaxed">{aiScore.analysis}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
