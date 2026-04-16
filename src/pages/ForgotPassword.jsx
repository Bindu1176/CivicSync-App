import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import api from '../utils/api';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpHint, setOtpHint] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { mobile });
      setOtpHint(res.data.otp_hint || '');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }
    if (newPassword.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const res = await api.post('/auth/reset-password', { mobile, otp, newPassword });
      setSuccess(`Password reset successfully! Your username is: ${res.data.username}`);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-civic-light dark:bg-gradient-civic px-6 py-8">
      <div className="text-center mb-8 animate-fade-in">
        <img src="/icon.png" alt="CivicSync" className="w-16 h-16 mx-auto mb-3 rounded-2xl shadow-lg" />
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{t('auth.resetPassword')}</h1>
      </div>

      <div className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-sm">
          {error && <div className="p-3 mb-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm text-center">{error}</div>}

          {step === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-4 animate-slide-up">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('auth.mobile')}</label>
                <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="input-field" placeholder="Registered mobile number" pattern="[0-9]{10}" required />
              </div>
              <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50">
                {loading ? t('common.loading') : t('auth.sendOTP')}
              </button>
              <div className="text-center"><Link to="/login" className="text-primary-500 text-sm font-medium">{t('auth.login')}</Link></div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-4 animate-slide-up">
              <div className="glass-card rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('auth.otpSent')}</p>
                <p className="text-xs text-primary-500 font-mono mt-2">{otpHint}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('auth.enterOTP')}</label>
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="input-field text-center text-2xl tracking-[0.5em] font-mono" maxLength={6} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('auth.newPassword')}</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  className="input-field" placeholder="Min 6 characters" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('auth.confirmPassword')}</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field" required />
              </div>
              <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50">
                {loading ? t('common.loading') : t('auth.resetPassword')}
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="text-center space-y-4 animate-scale-in">
              <div className="glass-card rounded-2xl p-6">
                <div className="w-16 h-16 rounded-full bg-gradient-accent mx-auto flex items-center justify-center mb-4">
                  <span className="text-3xl">✓</span>
                </div>
                <p className="text-green-600 dark:text-green-400 font-semibold">{success}</p>
              </div>
              <button onClick={() => navigate('/login')} className="w-full btn-primary">{t('auth.login')}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
