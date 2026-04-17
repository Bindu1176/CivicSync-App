import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import api from '../utils/api';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { t } = useLanguage();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setMessages([{ role: 'assistant', content: t('chatbot.greeting') }]);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.filter(m => m.role !== 'system').slice(-10);
      const res = await api.post('/chatbot/message', { message: text.trim(), history });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
    }
    setLoading(false);
  };

  const handleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice input not supported in this browser');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      sendMessage(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* FAB Button */}
      <button onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-20 right-4 z-40 w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-red-500 rotate-45' : 'bg-gradient-primary animate-pulse-glow'}`}>
        <span className="text-white text-2xl">{isOpen ? '✕' : '🤖'}</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-36 right-4 left-4 z-40 max-w-sm ml-auto bg-white dark:bg-civic-dark rounded-2xl shadow-2xl border border-gray-200 dark:border-civic-border overflow-hidden animate-scale-in"
          style={{ maxHeight: '60vh' }}>
          {/* Chat Header */}
          <div className="bg-gradient-primary p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-lg">🤖</span>
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">{t('chatbot.title')}</h3>
              <p className="text-white/70 text-xs">Online</p>
            </div>
          </div>

          {/* Messages */}
          <div className="h-64 overflow-y-auto p-3 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${msg.role === 'user' ? 'bg-primary-500 text-white rounded-br-sm' : 'bg-gray-100 dark:bg-civic-card text-gray-800 dark:text-gray-200 rounded-bl-sm'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-civic-card rounded-2xl px-4 py-3 rounded-bl-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-2 border-t border-gray-200 dark:border-civic-border flex gap-2">
            <button type="button" onClick={handleVoice}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 dark:bg-civic-card text-gray-500'}`}>
              🎤
            </button>
            <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)}
              placeholder={t('chatbot.placeholder')}
              className="flex-1 px-3 py-2 bg-gray-50 dark:bg-civic-card border border-gray-200 dark:border-civic-border rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-500" />
            <button type="submit" disabled={!input.trim() || loading}
              className="w-10 h-10 rounded-xl bg-gradient-primary text-white flex items-center justify-center disabled:opacity-50 active:scale-95 transition-transform">
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}
