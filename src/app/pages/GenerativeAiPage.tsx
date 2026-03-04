import { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Image,
  Video,
  Upload,
  Sparkles,
  ChevronDown,
  Zap,
  Cpu,
  Scan,
  Download,
  X,
} from 'lucide-react';

type OutputMode = 'image' | 'video';

const aestheticProfiles = [
  { value: 'cyberpunk-noir', label: 'Cyberpunk Noir' },
  { value: 'neon-brutalism', label: 'Neon Brutalism' },
  { value: 'dark-synthwave', label: 'Dark Synthwave' },
  { value: 'glitch-core', label: 'Glitch Core' },
  { value: 'bio-mechanical', label: 'Bio-Mechanical' },
  { value: 'phantom-circuit', label: 'Phantom Circuit' },
];

const dimensionOptions = [
  { value: '1024x1024', label: '1024 × 1024 (Square)' },
  { value: '512x512', label: '512 × 512 (Compact)' },
  { value: '256x256', label: '256 × 256 (Thumbnail)' },
];

function NeonSelect({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative">
      <label className="block text-xs text-red-500 tracking-wider uppercase mb-2">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-black/60 border border-red-600/20 text-sm text-gray-200 hover:border-red-600/40 transition-colors"
      >
        <span>{selected?.label}</span>
        <ChevronDown
          className={`w-4 h-4 text-red-500 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-lg bg-[#070707] border border-red-600/30 shadow-[0_0_20px_rgba(255,26,26,0.15)] overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                opt.value === value
                  ? 'bg-red-700/20 text-red-400'
                  : 'text-gray-300 hover:bg-red-700/10 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function GenerativeAiPage() {
  const [outputMode, setOutputMode] = useState<OutputMode>('image');
  const [prompt, setPrompt] = useState('');
  const [aesthetic, setAesthetic] = useState('cyberpunk-noir');
  const [dimensions, setDimensions] = useState('1024x1024');
  const [creativity, setCreativity] = useState(75);
  const [entropy, setEntropy] = useState(
    Math.floor(Math.random() * 999999).toString()
  );
  const [referenceFile, setReferenceFile] = useState<string | null>(null);
  const [referenceDataUrl, setReferenceDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReferenceFile(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setReferenceDataUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearReference = () => {
    setReferenceFile(null);
    setReferenceDataUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const buildFullPrompt = useCallback(() => {
    const aestheticLabel =
      aestheticProfiles.find((a) => a.value === aesthetic)?.label ?? aesthetic;
    const parts = [prompt.trim()];
    parts.push(`Style: ${aestheticLabel}`);
    parts.push(`Creativity level: ${creativity}%`);
    if (entropy) parts.push(`Seed: ${entropy}`);
    return parts.join('. ');
  }, [prompt, aesthetic, creativity, entropy]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const fullPrompt = buildFullPrompt();
      const body: Record<string, string> = {
        prompt: fullPrompt,
        size: dimensions,
      };
      if (referenceDataUrl) {
        body.referenceImage = referenceDataUrl;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000);

      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `Server error (${response.status})`);
      }

      const data = await response.json();
      if (data.b64_json) {
        setGeneratedImage(`data:image/png;base64,${data.b64_json}`);
      } else {
        throw new Error('No image data returned');
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Generation timed out. Please try again with a simpler prompt.');
      } else {
        setError(err.message || 'Failed to generate image');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `somniclaw-${Date.now()}.png`;
    link.click();
  };

  const randomizeSeed = () => {
    setEntropy(Math.floor(Math.random() * 999999).toString());
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white">
      <div className="fixed inset-0 bg-gradient-to-br from-red-950/10 via-transparent to-red-950/10 pointer-events-none" />

      <div className="relative z-10">
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#070707]/80 border-b border-red-600/10">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-700/10 border border-red-600/30 text-red-400 hover:text-white hover:bg-red-700/20 transition-all duration-300 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-red-500" />
              <span className="text-sm font-poppins font-bold tracking-wider bg-gradient-to-r from-red-500 to-red-500 bg-clip-text text-transparent">
                SOMNICLAW GENERATIVE AI
              </span>
            </div>
          </div>
        </header>

        <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr_280px] gap-6">
            {/* LEFT PANEL */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-5"
            >
              <div className="rounded-2xl border border-red-600/15 bg-black/40 backdrop-blur-xl p-5">
                <div className="flex items-center gap-2 mb-5">
                  <Zap className="w-4 h-4 text-red-500" />
                  <h2 className="text-sm font-bold tracking-wider text-red-400 uppercase">
                    Neural Input
                  </h2>
                </div>

                <div className="flex rounded-lg bg-black/50 border border-red-600/15 p-1 mb-5">
                  <button
                    type="button"
                    onClick={() => setOutputMode('image')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                      outputMode === 'image'
                        ? 'bg-red-700/30 text-white border border-red-600/40 shadow-[0_0_12px_rgba(255,26,26,0.2)]'
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    <Image className="w-4 h-4" />
                    Image
                  </button>
                  <button
                    type="button"
                    onClick={() => setOutputMode('video')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                      outputMode === 'video'
                        ? 'bg-red-700/30 text-white border border-red-600/40 shadow-[0_0_12px_rgba(255,26,26,0.2)]'
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    Video
                  </button>
                </div>

                {outputMode === 'video' && (
                  <div className="mb-5 px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <p className="text-xs text-yellow-400">
                      Video generation is coming soon. Image mode is active.
                    </p>
                  </div>
                )}

                <div className="mb-5">
                  <label className="block text-xs text-red-500 tracking-wider uppercase mb-2">
                    Master Prompt
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the reality you want to generate..."
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg bg-black/60 border border-red-600/20 text-sm text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:border-red-600/50 focus:shadow-[0_0_15px_rgba(255,26,26,0.1)] transition-all"
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-xs text-red-500 tracking-wider uppercase mb-2">
                    Neural Reference
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  {referenceDataUrl ? (
                    <div className="relative rounded-lg border border-red-600/20 overflow-hidden">
                      <img
                        src={referenceDataUrl}
                        alt="Reference"
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-black/70 px-3 py-1.5 flex items-center justify-between">
                        <span className="text-xs text-red-400 truncate max-w-[180px]">
                          {referenceFile}
                        </span>
                        <button
                          type="button"
                          onClick={clearReference}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex flex-col items-center justify-center gap-2 py-6 rounded-lg border-2 border-dashed border-red-600/20 bg-black/30 hover:border-red-600/40 hover:bg-red-700/5 transition-all duration-300 group"
                    >
                      <Upload className="w-6 h-6 text-gray-600 group-hover:text-red-500 transition-colors" />
                      <span className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                        Upload reference image
                      </span>
                      <span className="text-[10px] text-gray-700">
                        PNG, JPG up to 10MB
                      </span>
                    </button>
                  )}
                </div>

                <div className="mb-5">
                  <NeonSelect
                    label="Aesthetic Profile"
                    options={aestheticProfiles}
                    value={aesthetic}
                    onChange={setAesthetic}
                  />
                </div>

                <div className="mb-6">
                  <NeonSelect
                    label="Output Dimensions"
                    options={dimensionOptions}
                    value={dimensions}
                    onChange={setDimensions}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="w-full relative py-3.5 rounded-lg font-bold text-sm tracking-wider uppercase overflow-hidden transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-700 via-red-700 to-red-700 animate-gradient" />
                  <div className="absolute inset-0 bg-gradient-to-r from-red-700 via-red-700 to-red-700 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate from Reality
                      </>
                    )}
                  </span>
                </button>
              </div>
            </motion.aside>

            {/* CENTER — Preview Canvas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col"
            >
              <div className="flex-1 rounded-2xl border border-red-600/15 bg-black/40 backdrop-blur-xl overflow-hidden flex flex-col min-h-[500px]">
                <div className="flex items-center justify-between px-5 py-3 border-b border-red-600/10">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${isGenerating ? 'bg-yellow-500' : generatedImage ? 'bg-green-500' : 'bg-red-600'} animate-pulse`}
                    />
                    <span className="text-xs text-gray-500 tracking-wider uppercase">
                      Neural Canvas
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-600">
                      {dimensions.replace('x', ' × ')} px
                    </span>
                    {generatedImage && (
                      <button
                        type="button"
                        onClick={handleDownload}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-red-700/20 border border-red-600/30 text-xs text-red-400 hover:text-white hover:bg-red-700/30 transition-all"
                      >
                        <Download className="w-3 h-3" />
                        Download
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
                  {isGenerating ? (
                    <div className="text-center space-y-6">
                      <div className="relative w-24 h-24 mx-auto">
                        <div className="absolute inset-0 rounded-full border-2 border-red-600/20 animate-ping" />
                        <div className="absolute inset-2 rounded-full border-2 border-red-600/30 animate-spin" />
                        <div className="absolute inset-4 rounded-full border-2 border-red-500/40 animate-spin [animation-direction:reverse]" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Cpu className="w-8 h-8 text-red-500" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-red-400 font-medium mb-1">
                          Neural synthesis in progress
                        </p>
                        <p className="text-xs text-gray-600">
                          Processing through diffusion layers... This may take
                          15-30 seconds.
                        </p>
                      </div>
                    </div>
                  ) : error ? (
                    <div className="text-center space-y-4 max-w-sm">
                      <div className="w-16 h-16 mx-auto rounded-2xl border border-red-500/30 bg-red-600/10 flex items-center justify-center">
                        <X className="w-8 h-8 text-red-400" />
                      </div>
                      <p className="text-sm text-red-400">{error}</p>
                      <button
                        type="button"
                        onClick={() => setError(null)}
                        className="px-4 py-2 rounded-lg text-xs border border-red-600/20 text-gray-400 hover:text-red-400 hover:border-red-600/30 transition-all"
                      >
                        Dismiss
                      </button>
                    </div>
                  ) : generatedImage ? (
                    <img
                      src={generatedImage}
                      alt="Generated output"
                      className="max-w-full max-h-full rounded-lg object-contain shadow-[0_0_40px_rgba(255,26,26,0.15)]"
                    />
                  ) : (
                    <div className="text-center space-y-4 max-w-sm">
                      <div className="w-20 h-20 mx-auto rounded-2xl border border-red-600/15 bg-red-700/5 flex items-center justify-center">
                        <Scan className="w-10 h-10 text-red-600/30" />
                      </div>
                      <p className="text-sm text-gray-500">
                        Enter a prompt and click{' '}
                        <span className="text-red-500">
                          Generate from Reality
                        </span>{' '}
                        to synthesize your vision
                      </p>
                      <div className="flex flex-wrap justify-center gap-2 pt-2">
                        {[
                          'Cyber cityscape at midnight',
                          'Neural nexus core',
                          'Dark android warrior',
                        ].map((suggestion) => (
                          <button
                            key={suggestion}
                            type="button"
                            onClick={() => setPrompt(suggestion)}
                            className="px-3 py-1.5 rounded-full text-xs border border-red-600/15 text-gray-500 hover:text-red-400 hover:border-red-600/30 transition-all"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* RIGHT PANEL */}
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-5"
            >
              <div className="rounded-2xl border border-red-600/15 bg-black/40 backdrop-blur-xl p-5">
                <div className="flex items-center gap-2 mb-6">
                  <Cpu className="w-4 h-4 text-red-500" />
                  <h2 className="text-sm font-bold tracking-wider text-red-400 uppercase">
                    System Overrides
                  </h2>
                </div>

                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs text-red-500 tracking-wider uppercase">
                      Creativity
                    </label>
                    <span className="text-xs text-red-500 font-mono font-bold">
                      {creativity}%
                    </span>
                  </div>
                  <div className="relative">
                    <div className="h-2 rounded-full bg-black/60 border border-red-600/15 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-red-700 to-red-600 transition-all duration-200"
                        style={{ width: `${creativity}%` }}
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={creativity}
                      onChange={(e) => setCreativity(Number(e.target.value))}
                      className="absolute inset-0 w-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="text-[10px] text-gray-700">Precise</span>
                    <span className="text-[10px] text-gray-700">Chaotic</span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-xs text-red-500 tracking-wider uppercase mb-2">
                    Entropy Seed
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={entropy}
                      onChange={(e) => setEntropy(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-lg bg-black/60 border border-red-600/20 text-sm text-gray-200 font-mono focus:outline-none focus:border-red-600/50 transition-all"
                    />
                    <button
                      type="button"
                      onClick={randomizeSeed}
                      className="px-3 py-2.5 rounded-lg bg-red-700/15 border border-red-600/20 text-red-500 hover:text-white hover:bg-red-700/25 transition-all"
                      title="Randomize seed"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-red-600/10">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-500">Mode</span>
                    <span className="text-[11px] text-red-400 font-mono uppercase">
                      {outputMode}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-500">Aesthetic</span>
                    <span className="text-[11px] text-red-400 font-mono">
                      {aestheticProfiles.find((a) => a.value === aesthetic)
                        ?.label ?? aesthetic}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-500">Output</span>
                    <span className="text-[11px] text-red-400 font-mono">
                      {dimensions.replace('x', '×')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-500">Engine</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[11px] text-green-400 font-mono">
                        ONLINE
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-red-600/15 bg-black/40 backdrop-blur-xl p-5">
                <h3 className="text-xs font-bold tracking-wider text-red-400 uppercase mb-3">
                  Quick Prompts
                </h3>
                <div className="space-y-2">
                  {[
                    'A lone samurai standing in neon rain, cyberpunk Tokyo 2099',
                    'Abandoned space station overgrown with bioluminescent plants',
                    'Digital goddess emerging from a sea of data streams',
                  ].map((quickPrompt) => (
                    <button
                      key={quickPrompt}
                      type="button"
                      onClick={() => setPrompt(quickPrompt)}
                      className="w-full text-left px-3 py-2.5 rounded-lg text-xs text-gray-500 hover:text-red-400 bg-black/20 hover:bg-red-700/10 border border-transparent hover:border-red-600/15 transition-all duration-200 leading-relaxed"
                    >
                      {quickPrompt}
                    </button>
                  ))}
                </div>
              </div>
            </motion.aside>
          </div>
        </main>
      </div>
    </div>
  );
}
