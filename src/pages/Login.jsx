import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../utils/api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { t, lang, langNames, changeLanguage } = useLanguage();
  const navigate = useNavigate();
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { username: username.toUpperCase(), password });
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-civic-light dark:bg-gradient-civic">
      {/* Top controls */}
      <div className="flex justify-between items-center p-4">
        <button onClick={toggleTheme} className="p-2 rounded-xl glass" aria-label="Toggle theme">
          {isDark ? '☀️' : '🌙'}
        </button>
        <div className="relative">
          <button onClick={() => setShowLangDropdown(!showLangDropdown)} className="px-3 py-2 rounded-xl glass text-sm font-medium text-gray-700 dark:text-gray-300">
            🌐 {langNames[lang]}
          </button>
          {showLangDropdown && (
            <div className="absolute right-0 top-12 glass rounded-xl shadow-xl z-50 overflow-hidden animate-scale-in">
              {Object.entries(langNames).map(([code, name]) => (
                <button key={code} onClick={() => { changeLanguage(code); setShowLangDropdown(false); }}
                  className={`block w-full px-4 py-2.5 text-left text-sm hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors ${lang === code ? 'text-primary-600 font-semibold bg-primary-50/50 dark:bg-primary-900/10' : 'text-gray-700 dark:text-gray-300'}`}>
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Logo & Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        <div className="text-center mb-8 animate-fade-in">
          <img src="/logo.png" alt="CivicSync" className="w-48 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-civic-text text-sm">{t('auth.loginSubtitle')}</p>
        </div>

        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 animate-slide-up">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('auth.username')}</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value.toUpperCase())}
              placeholder="CS-XXXXXX" className="input-field font-mono tracking-wider" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('auth.password')}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" className="input-field" required />
          </div>

          <button type="submit" disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span> : null}
            {loading ? t('common.loading') : t('auth.login')}
          </button>

          <div className="text-center">
            <Link to="/forgot-password" className="text-primary-500 hover:text-primary-600 text-sm font-medium">
              {t('auth.forgotPassword')}
            </Link>
          </div>

          <div className="text-center pt-4 border-t border-gray-200 dark:border-civic-border">
            <span className="text-sm text-gray-500 dark:text-civic-text">{t('auth.noAccount')} </span>
            <Link to="/signup" className="text-primary-500 hover:text-primary-600 text-sm font-semibold">
              {t('auth.signup')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
