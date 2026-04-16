import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../utils/api';

export default function Header() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { t, lang, langNames, changeLanguage } = useLanguage();
  const navigate = useNavigate();
  const [showLang, setShowLang] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications');
        setUnreadCount(res.data.unreadCount);
      } catch {}
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 glass">
      <div className="px-4 py-3">
        {/* Top row: Logo + controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/icon.png" alt="CivicSync" className="w-9 h-9 rounded-xl shadow-md" />
            <div>
              <h1 className="font-display font-bold text-base text-gray-900 dark:text-white leading-tight">CivicSync</h1>
              <p className="text-[10px] text-gray-500 dark:text-civic-text leading-tight">{t('app.tagline2')}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button onClick={toggleTheme} className="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-civic-card hover:bg-gray-200 dark:hover:bg-civic-border transition-colors" aria-label="Toggle theme">
              <span className="text-sm">{isDark ? '☀️' : '🌙'}</span>
            </button>

            {/* Language */}
            <div className="relative">
              <button onClick={() => { setShowLang(!showLang); setShowProfile(false); }}
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-civic-card hover:bg-gray-200 dark:hover:bg-civic-border transition-colors">
                <span className="text-sm">🌐</span>
              </button>
              {showLang && (
                <div className="absolute right-0 top-11 glass rounded-xl shadow-2xl z-50 overflow-hidden animate-scale-in min-w-[140px]">
                  {Object.entries(langNames).map(([code, name]) => (
                    <button key={code} onClick={() => { changeLanguage(code); setShowLang(false); }}
                      className={`block w-full px-4 py-2.5 text-left text-sm transition-colors ${lang === code ? 'text-primary-500 font-semibold bg-primary-50/50 dark:bg-primary-900/10' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-civic-border/50'}`}>
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications */}
            <button onClick={() => navigate('/notifications')} className="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-civic-card hover:bg-gray-200 dark:hover:bg-civic-border transition-colors relative">
              <span className="text-sm">🔔</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Profile */}
            <div className="relative">
              <button onClick={() => { setShowProfile(!showProfile); setShowLang(false); }}
                className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-bold shadow-md">
                {user?.fullName?.charAt(0) || 'U'}
              </button>
              {showProfile && (
                <div className="absolute right-0 top-11 glass rounded-xl shadow-2xl z-50 overflow-hidden animate-scale-in min-w-[180px]">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-civic-border">
                    <p className="font-semibold text-sm text-gray-800 dark:text-white">{user?.fullName}</p>
                    <p className="text-xs text-primary-500 font-mono">{user?.username}</p>
                  </div>
                  <button onClick={() => { navigate('/progress'); setShowProfile(false); }}
                    className="block w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-civic-border/50">
                    📊 {t('nav.progress')}
                  </button>
                  <button onClick={() => { logout(); navigate('/login'); }}
                    className="block w-full px-4 py-2.5 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10">
                    🚪 {t('nav.logout')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
