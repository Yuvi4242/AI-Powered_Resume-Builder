import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api, { profileAPI } from '../utils/api';

// ─── Icons (inline SVG to avoid extra deps) ───────────────────────────────
const SparkleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
  </svg>
);
const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);
const MicIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/>
    <line x1="8" y1="23" x2="16" y2="23"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const MinimizeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const BotIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="5" r="1" fill="currentColor"/>
  </svg>
);

// ─── Quick action chips ────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  { label: '📝 Summary', message: 'Generate a professional summary for me' },
  { label: '🛠 Skills',   message: 'Suggest top skills for my job role' },
  { label: '📊 ATS',     message: 'How can I improve my ATS score?' },
  { label: '🎯 Optimize', message: 'Optimize my resume for a job description' },
  { label: '📂 Profile', message: 'Help me complete my profile' },
];

// ─── Typing indicator ─────────────────────────────────────────────────────
const TypingIndicator = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 14px',
    background: '#141f38', borderRadius: '18px 18px 18px 4px',
    borderLeft: '3px solid #8B5CF6', maxWidth: '70px' }}>
    {[0, 1, 2].map(i => (
      <motion.div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#ba9eff' }}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />
    ))}
  </div>
);

// ─── Message bubble ───────────────────────────────────────────────────────
const MessageBubble = ({ msg }) => {
  const isAI = msg.sender === 'ai';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25 }}
      style={{ display: 'flex', justifyContent: isAI ? 'flex-start' : 'flex-end',
        marginBottom: '10px' }}>
      {isAI && (
        <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg,#8B5CF6,#38BDF8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginRight: 8, color: 'white' }}>
          <BotIcon />
        </div>
      )}
      <div style={{
        maxWidth: '78%',
        padding: '10px 14px',
        borderRadius: isAI ? '18px 18px 18px 4px' : '18px 4px 18px 18px',
        background: isAI
          ? '#141f38'
          : 'linear-gradient(135deg,#8B5CF6,#38BDF8)',
        borderLeft: isAI ? '3px solid #8B5CF6' : 'none',
        color: '#dee5ff',
        fontSize: '0.84rem',
        lineHeight: '1.55',
        fontFamily: 'Inter, sans-serif',
        boxShadow: isAI
          ? '0 4px 12px rgba(0,0,0,0.3)'
          : '0 4px 15px rgba(139,92,246,0.35)',
      }}>
        {msg.text}
        {msg.action && msg.action !== 'NONE' && (
          <div style={{ marginTop: 6, fontSize: '0.73rem', opacity: 0.65,
            color: '#9bffce', fontFamily: 'Inter, sans-serif' }}>
            ⚡ Action: {msg.action}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ─── Main ChatWidget ───────────────────────────────────────────────────────
const ChatWidget = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen]           = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages]       = useState([
    { id: 1, sender: 'ai', text: '✨ Hi! I\'m your Resume Copilot. I can help you build your resume, auto-fill your profile, generate summaries, suggest skills, and much more. What would you like to do today?' }
  ]);
  const [input, setInput]       = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [unread, setUnread]     = useState(1);

  const bottomRef    = useRef(null);
  const inputRef     = useRef(null);
  const recognitionRef = useRef(null);

  // ── Auto-scroll ──────────────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // ── Focus Input on open ──────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
      setUnread(0);
    }
  }, [isOpen, isMinimized]);

  // ── Handle action from AI response ──────────────────────────────────────
  const handleAction = useCallback(async (action, data) => {
    if (!action || action === 'NONE') return;

    try {
      if (action === 'UPDATE_PROFILE' && data) {
        await profileAPI.updateProfile(data);
      }
      if (action === 'NAVIGATE' && data?.route) {
        setTimeout(() => navigate(data.route), 800);
      }
      // GENERATE_SUMMARY and other actions are reflected via the AI reply text
    } catch (err) {
      console.warn('[Copilot] Action error:', err.message);
    }
  }, [navigate]);

  // ── Send message ─────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || isLoading) return;

    const userMsg = { id: Date.now(), sender: 'user', text: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await api.post('ai/chat', { message: trimmed });
      const { reply, action, data } = res.data;

      const aiMsg = { id: Date.now() + 1, sender: 'ai', text: reply, action };
      setMessages(prev => [...prev, aiMsg]);

      // Perform action asynchronously
      await handleAction(action, data);

      // Voice output (premium)
      if (window.speechSynthesis && reply) {
        const utter = new SpeechSynthesisUtterance(reply);
        utter.rate  = 1.05;
        utter.pitch = 1;
        // Only speak short replies
        if (reply.length < 150) window.speechSynthesis.speak(utter);
      }
    } catch (err) {
      const errMsg = err.response?.status === 429
        ? '⏳ I\'m a bit busy right now. Please wait a moment and try again!'
        : '❌ Something went wrong. Please try again.';
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: errMsg }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, handleAction]);

  // ── Voice input ──────────────────────────────────────────────────────────
  const toggleVoice = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice input is not supported in this browser. Try Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang       = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      // Auto-send after voice input
      setTimeout(() => sendMessage(transcript), 200);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend   = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening, sendMessage]);

  // ── Keyboard shortcut (Ctrl+Shift+C) ────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'C') setIsOpen(o => !o);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // ── Derived ──────────────────────────────────────────────────────────────
  const panelVisible = isOpen && !isMinimized;

  return (
    <>
      {/* ── Floating trigger button ─────────────────────────── */}
      <motion.button
        onClick={() => { setIsOpen(o => !o); setIsMinimized(false); }}
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
          width: 58, height: 58, borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: 'linear-gradient(135deg,#8B5CF6,#38BDF8)',
          color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 30px rgba(139,92,246,0.55)',
        }}
        whileHover={{ scale: 1.1, boxShadow: '0 12px 35px rgba(139,92,246,0.7)' }}
        whileTap={{ scale: 0.93 }}
      >
        <SparkleIcon />
        {unread > 0 && (
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            style={{ position: 'absolute', top: -3, right: -3,
              width: 20, height: 20, borderRadius: '50%',
              background: '#ef4444', color: 'white', fontSize: '0.68rem',
              fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid #060e20' }}>
            {unread}
          </motion.div>
        )}
      </motion.button>

      {/* ── Chat panel ──────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            style={{
              position: 'fixed', bottom: 100, right: 28, zIndex: 9998,
              width: 380, borderRadius: 20,
              background: 'rgba(9,19,40,0.92)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(139,92,246,0.25)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 30px rgba(139,92,246,0.12)',
              overflow: 'hidden',
              fontFamily: 'Inter, sans-serif',
            }}>

            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg,#7c3aed,#2563eb)',
              padding: '14px 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <SparkleIcon />
                </div>
                <div>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem',
                    fontFamily: 'Manrope, sans-serif' }}>
                    ✨ Resume Copilot
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%',
                      background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                    <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.72rem' }}>
                      AI Online
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setIsMinimized(m => !m)}
                  style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%',
                    width: 28, height: 28, cursor: 'pointer', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MinimizeIcon />
                </button>
                <button onClick={() => setIsOpen(false)}
                  style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%',
                    width: 28, height: 28, cursor: 'pointer', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CloseIcon />
                </button>
              </div>
            </div>

            {/* Body */}
            <AnimatePresence>
              {panelVisible && (
                <motion.div
                  initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                  transition={{ duration: 0.22 }} style={{ overflow: 'hidden' }}>

                  {/* Messages */}
                  <div style={{ height: 340, overflowY: 'auto', padding: '16px 14px',
                    scrollbarWidth: 'thin', scrollbarColor: '#40485d transparent' }}>
                    {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
                    {isLoading && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                          background: 'linear-gradient(135deg,#8B5CF6,#38BDF8)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                          <BotIcon />
                        </div>
                        <TypingIndicator />
                      </motion.div>
                    )}
                    <div ref={bottomRef} />
                  </div>

                  {/* Quick action chips */}
                  <div style={{ display: 'flex', gap: 6, padding: '0 14px 10px',
                    overflowX: 'auto', scrollbarWidth: 'none' }}>
                    {QUICK_ACTIONS.map(({ label, message }) => (
                      <button key={label} onClick={() => sendMessage(message)}
                        style={{ flexShrink: 0, padding: '5px 12px', borderRadius: 999,
                          background: '#192540', border: '1px solid rgba(139,92,246,0.2)',
                          color: '#a3aac4', fontSize: '0.75rem', cursor: 'pointer',
                          fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap',
                          transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.target.style.background = '#8B5CF6'; e.target.style.color = '#fff'; }}
                        onMouseLeave={e => { e.target.style.background = '#192540'; e.target.style.color = '#a3aac4'; }}>
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Input area */}
                  <div style={{ padding: '0 12px 14px',
                    display: 'flex', alignItems: 'center', gap: 8 }}>
                    {/* Mic button */}
                    <motion.button
                      onClick={toggleVoice}
                      style={{
                        flexShrink: 0, width: 40, height: 40, borderRadius: '50%',
                        border: 'none', cursor: 'pointer',
                        background: isListening
                          ? 'linear-gradient(135deg,#8B5CF6,#38BDF8)'
                          : '#192540',
                        color: isListening ? 'white' : '#a3aac4',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        position: 'relative',
                      }}
                      animate={isListening ? { boxShadow: ['0 0 0px rgba(139,92,246,0.5)', '0 0 18px rgba(139,92,246,0.9)', '0 0 0px rgba(139,92,246,0.5)'] } : {}}
                      transition={isListening ? { duration: 1.2, repeat: Infinity } : {}}>
                      <MicIcon />
                    </motion.button>

                    {/* Text input */}
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                      placeholder="Ask me anything about your resume..."
                      disabled={isLoading}
                      style={{
                        flex: 1, padding: '10px 14px', borderRadius: 12,
                        background: '#0f1930',
                        border: '1px solid rgba(139,92,246,0.15)',
                        color: '#dee5ff', fontSize: '0.84rem', outline: 'none',
                        fontFamily: 'Inter, sans-serif',
                        transition: 'border 0.2s',
                      }}
                      onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.5)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(139,92,246,0.15)'}
                    />

                    {/* Send button */}
                    <motion.button
                      onClick={() => sendMessage()}
                      disabled={!input.trim() || isLoading}
                      style={{
                        flexShrink: 0, width: 40, height: 40, borderRadius: '50%',
                        border: 'none', cursor: input.trim() ? 'pointer' : 'default',
                        background: input.trim()
                          ? 'linear-gradient(135deg,#8B5CF6,#38BDF8)'
                          : '#192540',
                        color: input.trim() ? 'white' : '#40485d',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s',
                      }}
                      whileHover={input.trim() ? { scale: 1.08 } : {}}
                      whileTap={input.trim() ? { scale: 0.92 } : {}}>
                      <SendIcon />
                    </motion.button>
                  </div>

                  {/* Shortcut hint */}
                  <div style={{ textAlign: 'center', paddingBottom: 10,
                    color: '#40485d', fontSize: '0.68rem', fontFamily: 'Inter, sans-serif' }}>
                    Press Ctrl+Shift+C to toggle · Enter to send
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
