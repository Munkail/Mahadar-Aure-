/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { translations } from '../i18n';
import { Language, UserRole, ChatMessage, AppSettings } from '../types';
import { dataService } from '../services/dataService';
import {
  Bot,
  Send,
  Trash2,
  PhoneCall,
  ExternalLink,
  Sparkles,
  User,
  ShieldAlert,
  HelpCircle,
  MessageCircle
} from 'lucide-react';

interface AiSecretaryViewProps {
  language: Language;
  currentRole: UserRole;
  settings?: AppSettings;
}

export const AiSecretaryView: React.FC<AiSecretaryViewProps> = ({
  language,
  currentRole,
  settings
}) => {
  const t = translations[language];

  const defaultGreeting: ChatMessage = {
    id: 'msg-initial',
    sender: 'assistant',
    text: t.aiGreeting,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  const [messages, setMessages] = useState<ChatMessage[]>([defaultGreeting]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/secretary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-6),
          language,
          settings: {
            standardPriceNaira: settings?.standardPriceNaira || 3000,
            vipPriceNaira: settings?.vipPriceNaira || 5000,
            contactWhatsApp: settings?.contactWhatsApp || '09165006713',
            contactTelegram: settings?.contactTelegram || 'https://t.me/Mahadaraure',
            contactFacebook: settings?.contactFacebook || 'https://www.facebook.com/mahadaraure',
            contactWhatsAppChannel: settings?.contactWhatsAppChannel || 'https://whatsapp.com/channel/0029VbCDhJrHrDZb9cyYdu08'
          }
        })
      });

      const data = await response.json();
      const replyText = data.text || (language === 'ha'
        ? "Barka! An samu ɗan matsala wajen sadarwa. Don Allah a tuntuɓi jami'in Mahadar Aure a WhatsApp: 09165006713."
        : "Welcome! There was a connection delay. Please contact our official desk on WhatsApp: 09165006713.");

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'assistant',
        text: language === 'ha'
          ? "Gafara dai, ban sami damar hada sakon ba a halin yanzu. Don Allah a tuntubi jami'in aiki ta WhatsApp a lambar 09165006713."
          : "Apologies, communication timed out. Please reach our human support team directly via WhatsApp at 09165006713.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: t.aiGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const quickQuestions = [
    t.quickQuestion1,
    t.quickQuestion2,
    t.quickQuestion3,
    t.quickQuestion4
  ];

  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto space-y-4 flex flex-col h-[calc(100vh-140px)]">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl shrink-0 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-pink-600/30 ring-1 ring-pink-400/40">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>{t.secretaryTitle}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                Online • Gemini 3.8
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              {t.secretarySubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearChat}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition"
            title={t.clearChat}
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <a
            href="https://wa.me/2349165006713"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition shadow"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp Staff</span>
          </a>
        </div>
      </div>

      {/* Quick Prompts Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0 scrollbar-none">
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={loading}
            className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/80 text-slate-200 text-xs border border-slate-700/60 whitespace-nowrap transition flex items-center gap-1.5 hover:border-pink-500/40"
          >
            <HelpCircle className="w-3.5 h-3.5 text-pink-400" />
            <span>{q}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 overflow-y-auto space-y-4 shadow-xl">
        {messages.map(m => (
          <div
            key={m.id}
            className={`flex items-start space-x-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-pink-600/30 border border-pink-500/40 text-pink-400 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-gradient-to-r from-pink-600 to-pink-500 text-white rounded-tr-xs shadow-md shadow-pink-600/20'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-xs shadow'
              }`}
            >
              <div className="whitespace-pre-wrap">{m.text}</div>
              <div
                className={`text-[9px] mt-1.5 flex items-center gap-1 ${
                  m.sender === 'user' ? 'text-pink-200 justify-end' : 'text-slate-500'
                }`}
              >
                <span>{m.timestamp}</span>
                {m.sender === 'assistant' && (
                  <span className="font-mono text-[9px] text-pink-400 font-semibold">• AI Secretary</span>
                )}
              </div>
            </div>

            {m.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-start space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-pink-600/30 border border-pink-500/40 text-pink-400 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping"></span>
              <span>{language === 'ha' ? 'AI tana rubuta amsa...' : 'AI Secretary is formulating response...'}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Human Escalation Notice */}
      <div className="bg-slate-950/90 border border-slate-800/80 rounded-xl px-3 py-2 text-[11px] text-slate-400 flex items-center justify-between shrink-0">
        <span className="truncate pr-2">
          {t.escalateNotice}
        </span>
        <a
          href="https://wa.me/2349165006713"
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-400 hover:text-pink-300 font-semibold flex items-center gap-1 shrink-0"
        >
          <span>WhatsApp 09165006713</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Input Form */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder={t.typePlaceholder}
          disabled={loading}
          className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-pink-500 placeholder-slate-500 shadow-inner"
        />
        <button
          type="submit"
          disabled={loading || !inputText.trim()}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-bold text-sm shadow-lg shadow-pink-600/30 flex items-center gap-1.5 transition disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">{t.send}</span>
        </button>
      </form>
    </div>
  );
};
