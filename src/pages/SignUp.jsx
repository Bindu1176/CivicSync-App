import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../utils/api';

export default function SignUp() {
  const [step, setStep] = useState(1); // 1=form, 2=otp, 3=username, 4=password
  const [form, setForm] = useState({ fullName: '', mobile: '', email: '', dob: '', captcha: '' });
  const [otp, setOtp] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpHint, setOtpHint] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [captchaQuestion, setCaptchaQuestion] = useState(() => {
    const a = Math.floor(Math.random() * 10 + 1);
    const b = Math.floor(Math.random() * 10 + 1);
    return { a, b, answer: a + b };
  });
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (parseInt(form.captcha) !== captchaQuestion.answer) {
      setError('Incorrect captcha answer');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/signup', { ...form, captcha: form.captcha });
      setOtpHint(res.data.otp_hint || '');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', { mobile: form.mobile, otp });
      setUsername(res.data.username);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/set-password', { username, password });
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to set password');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1, 2, 3, 4].map(s => (
        <div key={s} className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${step >= s ? 'bg-gradient-primary text-white shadow-lg shadow-primary-500/30' : 'bg-gray-200 dark:bg-civic-card text-gray-500 dark:text-civic-text'}`}>
            {step > s ? '✓' : s}
          </div>
          {s < 4 && <div className={`w-8 h-0.5 ${step > s ? 'bg-primary-500' : 'bg-gray-200 dark:bg-civic-border'}`}></div>}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-civic-light dark:bg-gradient-civic px-6 py-8">
      <div className="text-center mb-6 animate-fade-in">
        <img src="/icon.png" alt="CivicSync" className="w-16 h-16 mx-auto mb-3 rounded-2xl shadow-lg" />
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{t('auth.signup')}</h1>
        <p className="text-sm text-gray-500 dark:text-civic-text mt-1">{t('auth.signupSubtitle')}</p>
      </div>

      {renderStepIndicator()}

      <div className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-sm">
          {error && (
            <div className="p-3 mb-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm text-center animate-scale-in">
              {error}
            </div>
          )}

          {/* Step 1: Registration Form */}
          {step === 1 && (
            <form onSubmit={handleSignup} className="space-y-4 animate-slide-up">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('auth.fullName')}</label>
                <input type="text" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="input-field" placeholder="Enter your full name" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('auth.mobile')}</label>
                <input type="tel" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  className="input-field" placeholder="10-digit mobile number" pattern="[0-9]{10}" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('auth.email')}</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field" placeholder="your@email.com" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('auth.dob')}</label>
                <input type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })}
                  className="input-field" required />
              </div>
              <div className="glass-card rounded-xl p-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">🔒 {t('auth.captcha')}</label>
                <p className="text-lg font-bold text-gray-800 dark:text-white mb-2">What is {captchaQuestion.a} + {captchaQuestion.b}?</p>
                <input type="number" value={form.captcha} onChange={(e) => setForm({ ...form, captcha: e.target.value })}
                  className="input-field" placeholder="Your answer" required />
              </div>
              <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50">
                {loading ? t('common.loading') : t('auth.sendOTP')}
              </button>
              <div className="text-center pt-2">
                <span className="text-sm text-gray-500 dark:text-civic-text">{t('auth.haveAccount')} </span>
                <Link to="/login" className="text-primary-500 font-semibold text-sm">{t('auth.login')}</Link>
              </div>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-4 animate-slide-up">
              <div className="glass-card rounded-xl p-4 text-center">
                <p className="text-2xl mb-2">📱</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('auth.otpSent')}</p>
                <p className="text-xs text-primary-500 font-mono mt-2">{otpHint}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('auth.enterOTP')}</label>
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="input-field text-center text-2xl tracking-[0.5em] font-mono" placeholder="• • • • • •" maxLength={6} required />
              </div>
              <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50">
                {loading ? t('common.loading') : t('auth.verifyOTP')}
              </button>
            </form>
          )}

          {/* Step 3: Username Generated */}
          {step === 3 && (
            <div className="space-y-6 animate-scale-in text-center">
              <div className="glass-card rounded-2xl p-6">
                <div className="w-16 h-16 rounded-full bg-gradient-accent mx-auto flex items-center justify-center mb-4 shadow-lg shadow-accent-500/30">
                  <span className="text-3xl">✓</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{t('auth.yourUsername')}</h3>
                <p className="text-3xl font-mono font-bold text-gradient mb-3">{username}</p>
                <p className="text-sm text-gray-500 dark:text-civic-text">{t('auth.rememberUsername')}</p>
              </div>
              <button onClick={() => setStep(4)} className="w-full btn-primary">
                {t('auth.setPassword')} →
              </button>
            </div>
          )}

          {/* Step 4: Set Password */}
          {step === 4 && (
            <form onSubmit={handleSetPassword} className="space-y-4 animate-slide-up">
              <div className="glass-card rounded-xl p-3 text-center mb-4">
                <span className="text-sm text-gray-500 dark:text-civic-text">ID: </span>
                <span className="font-mono font-bold text-primary-500">{username}</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('auth.password')}</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="input-field" placeholder="Min 6 characters" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('auth.confirmPassword')}</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field" placeholder="Confirm your password" required />
              </div>
              <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50">
                {loading ? t('common.loading') : t('auth.setPassword')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
