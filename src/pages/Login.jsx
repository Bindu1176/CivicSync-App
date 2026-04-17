import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../utils/api';
import { Loader2, LogIn } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-civic-light dark:bg-gradient-civic w-full px-4 relative">
      {/* Top controls */}
      <div className="w-full flex justify-between items-center p-4 absolute top-0 left-0 z-20">
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
      <div className="flex flex-col items-center w-full px-6 animate-fade-in z-10">
        <div className="text-center mb-6">
          <img src="/logo.png" alt="CivicSync" className="w-48 mx-auto mb-2 drop-shadow-sm" />
        </div>

        <Card className="w-full glass border-gray-200 dark:border-civic-border shadow-2xl backdrop-blur-xl animate-slide-up rounded-2xl overflow-hidden">
          <CardHeader className="text-center space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold font-display tracking-tight text-gray-900 dark:text-white">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 dark:text-civic-text font-medium">
              {t('auth.loginSubtitle')}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 text-sm text-center flex items-center justify-center gap-2 font-medium animate-shake">
                  <span className="shrink-0 leading-none">⚠️</span> {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700 dark:text-gray-300 font-semibold">{t('auth.username')}</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toUpperCase())}
                  placeholder="CS-XXXXXX"
                  className="h-11 font-mono tracking-wider dark:bg-civic-dark/50 dark:border-civic-border dark:text-white dark:focus-visible:ring-primary-500 focus-visible:ring-primary-500 rounded-xl transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-semibold">{t('auth.password')}</Label>
                  <Link to="/forgot-password" className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 hover:underline transition-colors">
                    {t('auth.forgotPassword')}
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 dark:bg-civic-dark/50 dark:border-civic-border dark:text-white dark:focus-visible:ring-primary-500 focus-visible:ring-primary-500 rounded-xl transition-all"
                  required
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-11 text-base bg-gradient-primary hover:opacity-90 active:scale-[0.98] transition-all text-white font-bold rounded-xl shadow-md border-0"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <LogIn className="mr-2 h-5 w-5" />
                )}
                {loading ? t('common.loading') : t('auth.login')}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col border-t border-gray-100 dark:border-civic-border/50 bg-gray-50/50 dark:bg-gray-900/20 px-6 py-5">
            <div className="text-center text-sm">
              <span className="text-gray-500 dark:text-civic-text font-medium">{t('auth.noAccount')} </span>
              <Link to="/signup" className="text-primary-600 dark:text-primary-400 hover:underline font-bold tracking-wide transition-colors">
                {t('auth.signup')}
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
