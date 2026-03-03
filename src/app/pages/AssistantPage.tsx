import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Send,
  Bot,
  User,
  Stethoscope,
  Heart,
  BarChart3,
  Smile,
  Loader2,
  Trash2,
  Moon,
} from 'lucide-react';

type ConsultationMode = 'clinical' | 'calm' | 'data' | 'friendly';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

const modeConfig: Record<ConsultationMode, { label: string; icon: typeof Stethoscope; color: string; desc: string }> = {
  clinical: { label: 'Clinical', icon: Stethoscope, color: 'text-blue-400 border-blue-500/40 bg-blue-500/10', desc: 'Structured medical format' },
  calm: { label: 'Calm', icon: Heart, color: 'text-pink-400 border-pink-500/40 bg-pink-500/10', desc: 'Empathetic & supportive' },
  data: { label: 'Data', icon: BarChart3, color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10', desc: 'Scientific & analytical' },
  friendly: { label: 'Friendly', icon: Smile, color: 'text-yellow-400 border-yellow-500/40 bg-yellow-500/10', desc: 'Conversational & simple' },
};

function getSessionId(): string {
  const key = 'somniclaw_assistant_session';
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatMarkdown(text: string): string {
  const escaped = escapeHtml(text);
  let html = escaped
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-purple-300 font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^### (.*$)/gm, '<h3 class="text-lg font-poppins font-bold text-purple-300 mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-xl font-poppins font-bold text-purple-200 mt-4 mb-2">$1</h2>')
    .replace(/^- (.*$)/gm, '<li class="ml-4 text-gray-300">• $1</li>')
    .replace(/^(\d+)\. (.*$)/gm, '<li class="ml-4 text-gray-300">$1. $2</li>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
  return html;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<ConsultationMode>('friendly');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(getSessionId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const aiMsgId = crypto.randomUUID();

    setMessages((prev) => [
      ...prev,
      { id: aiMsgId, role: 'assistant', content: '', timestamp: Date.now() },
    ]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, mode, sessionId }),
      });

      if (!res.ok) {
        let errorMsg = 'Failed to get response';
        try {
          const errData = await res.json();
          errorMsg = errData.error || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }

      if (!res.body) {
        throw new Error('Streaming is not supported in this browser.');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        const currentText = fullText;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMsgId ? { ...msg, content: currentText } : msg
          )
        );
      }

      if (!fullText) {
        throw new Error('No reply received from the assistant.');
      }
    } catch (err: any) {
      const errorContent = `⚠️ Error: ${err.message || 'Something went wrong. Please try again.'}`;
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMsgId ? { ...msg, content: errorContent } : msg
        )
      );
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const clearChat = () => {
    setMessages([]);
    const newId = crypto.randomUUID();
    localStorage.setItem('somniclaw_assistant_session', newId);
    setSessionId(newId);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] flex flex-col">
      <header className="sticky top-0 z-50 border-b border-purple-500/20 bg-[#0B0B0F]/90 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-400 hover:text-purple-300 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <Moon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="font-poppins font-bold text-white text-sm leading-tight">SOMNICLAW</h1>
                <p className="text-[10px] text-purple-400 leading-tight">AI ASSISTANT</p>
              </div>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto w-full px-4 py-3">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {(Object.keys(modeConfig) as ConsultationMode[]).map((m) => {
            const cfg = modeConfig[m];
            const Icon = cfg.icon;
            const active = mode === m;
            return (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium whitespace-nowrap transition-all ${
                  active
                    ? cfg.color + ' shadow-lg'
                    : 'text-gray-500 border-gray-800 bg-gray-900/30 hover:border-gray-700 hover:text-gray-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cfg.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="max-w-5xl mx-auto space-y-4">
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600/30 to-pink-600/30 border border-purple-500/20 flex items-center justify-center mb-6">
                <Bot className="w-10 h-10 text-purple-400" />
              </div>
              <h2 className="font-poppins font-bold text-2xl text-white mb-3">
                SOMNICLAW ASSISTANT
              </h2>
              <p className="text-gray-500 text-sm max-w-md mb-8 leading-relaxed">
                AI-powered health and sleep assistant. Ask about sleep optimization, insomnia management, stress reduction, and general wellness guidance.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full">
                {[
                  'How can I improve my sleep quality?',
                  'What is the best sleep schedule for night traders?',
                  'Explain REM vs NREM sleep cycles',
                  'Tips for reducing screen time before bed',
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setInput(suggestion);
                      inputRef.current?.focus();
                    }}
                    className="text-left px-4 py-3 rounded-xl bg-purple-950/20 border border-purple-500/10 text-gray-400 text-xs hover:border-purple-500/30 hover:text-purple-300 hover:bg-purple-950/30 transition-all"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-purple-600/30 border border-purple-500/30 text-white rounded-br-md'
                      : 'bg-gray-900/60 border border-gray-800/60 text-gray-300 rounded-bl-md'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <div
                      className="assistant-content"
                      dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.content) }}
                    />
                  ) : (
                    <p>{msg.content}</p>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4 text-purple-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3 justify-start"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-900/60 border border-gray-800/60 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-2 text-purple-400 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="sticky bottom-0 border-t border-purple-500/20 bg-[#0B0B0F]/95 backdrop-blur-xl px-4 py-3">
        <div className="max-w-5xl mx-auto flex gap-3">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about sleep, health, wellness..."
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl bg-gray-900/50 border border-purple-500/20 text-white text-sm placeholder-gray-600 focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/20 transition-all disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium text-sm hover:from-purple-500 hover:to-pink-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
        <p className="text-center text-[10px] text-gray-600 mt-2">
          SOMNICLAW AI does not replace professional medical care. Always consult healthcare professionals for medical advice.
        </p>
      </div>
    </div>
  );
}
