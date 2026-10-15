/**
 * VasPay — Nepal's First Agentic AI Digital Wallet
 * Copyright (c) 2025 VasPay. MIT License.
 *
 * AIChat page — full chat UI: message list (user right indigo bubble, model
 * left slate bubble), thinking indicator with animated dots, suggested-prompt
 * chips, input bar. Uses getFinancialAdvice with MOCK_TRANSACTIONS context.
 */
import React, { useEffect, useRef, useState } from 'react';
import { getFinancialAdvice } from '../services/geminiService';
import { ChatMessage, User } from '../types';
import { MOCK_TRANSACTIONS } from '../constants';
import {
  ArrowLeft,
  Bot,
  Send,
  User as UserIcon,
  Sparkles,
  Loader2,
  AlertTriangle,
  type LucideIcon,
} from 'lucide-react';

interface AIChatProps {
  user: User;
  /** Optional: render a sticky header with a back button. */
  onBack?: () => void;
}

const SUGGESTIONS: { label: string; prompt: string; icon: LucideIcon }[] = [
  { label: 'Analyse my spending', prompt: 'Analyse my spending over the last month and tell me where I can save.', icon: Sparkles },
  { label: 'How much on food?', prompt: 'How much did I spend on food this month?', icon: Bot },
  { label: 'Suggest a budget', prompt: 'Suggest a monthly budget based on my spending history.', icon: Send },
  { label: 'Is this tx safe?', prompt: 'Is my latest transaction safe? Check for fraud risk.', icon: AlertTriangle },
];

const AIChat: React.FC<AIChatProps> = ({ user, onBack }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Namaste ${user.name.split(' ')[0]}! I'm VasPay AI, your agentic finance co-pilot. I can analyse your spending, suggest budgets, and flag risky transactions. What would you like to know?`,
      timestamp: new Date(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setError(null);
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const reply = await getFinancialAdvice(trimmed, MOCK_TRANSACTIONS);
      const aiMsg: ChatMessage = {
        id: `m-${Date.now()}`,
        role: 'model',
        text: reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      setError("I couldn't reach the VasPay AI brain. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/85 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl hover:bg-slate-100 transition"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>
          )}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h1 className="font-bold text-slate-900 leading-tight">VasPay AI</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] text-slate-500">Online · Powered by Gemini</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isUser ? 'bg-indigo-100 text-indigo-600' : 'bg-violet-100 text-violet-600'
                  }`}
                >
                  {isUser ? <UserIcon className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                </div>
                <div
                  className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-sm'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <p
                    className={`text-[10px] mt-1 ${
                      isUser ? 'text-indigo-100' : 'text-slate-400'
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString('en-NP', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Thinking indicator */}
          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="ml-1 text-xs text-slate-500">Thinking…</span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mx-auto max-w-md rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div ref={endRef} />
        </div>
      </div>

      {/* Composer */}
      <div className="sticky bottom-0 bg-white border-t border-slate-200">
        <div className="max-w-2xl mx-auto px-4 py-3 space-y-3">
          {/* Suggestion chips */}
          {!loading && messages.length <= 1 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => send(s.prompt)}
                  className="flex-shrink-0 inline-flex items-center gap-1.5 whitespace-nowrap bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-xs font-semibold border border-indigo-100 hover:bg-indigo-100 active:scale-95 transition"
                >
                  <s.icon className="w-3.5 h-3.5" />
                  {s.label}
                </button>
              ))}
            </div>
          )}

          {/* Input bar */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Ask VasPay AI…"
              disabled={loading}
              className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-60"
              aria-label="Message VasPay AI"
            />
            <button
              onClick={() => send(input)}
              disabled={loading || !input.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl p-3 shadow-sm active:scale-95 transition"
              aria-label="Send message"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
