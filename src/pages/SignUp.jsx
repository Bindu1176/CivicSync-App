import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../utils/api';
import { Loader2, Check, Smartphone, Key, ShieldCheck, UserPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-civic-light dark:bg-gradient-civic px-4 py-8">
      <div className="w-full max-w-md animate-slide-up z-10">
        <div className="text-center mb-6">
          <img src="/icon.png" alt="CivicSync" className="w-16 h-16 mx-auto mb-3 rounded-2xl shadow-lg border border-gray-100 dark:border-civic-border" />
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white tracking-tight">{t('auth.signup')}</h1>
          <p className="text-sm text-gray-500 dark:text-civic-text mt-1">{t('auth.signupSubtitle')}</p>
        </div>

        {renderStepIndicator()}

        <Card className="w-full glass border-gray-200 dark:border-civic-border shadow-2xl backdrop-blur-xl rounded-2xl overflow-hidden">
          <CardContent className="pt-6">
            {error && (
              <div className="p-3 mb-5 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 text-sm text-center flex items-center justify-center gap-2 font-medium animate-shake">
                <span className="shrink-0 leading-none">⚠️</span> {error}
              </div>
            )}

            {/* Step 1: Registration Form */}
            {step === 1 && (
              <form onSubmit={handleSignup} className="space-y-4 animate-fade-in">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-gray-700 dark:text-gray-300 font-semibold">{t('auth.fullName')}</Label>
                  <Input id="fullName" type="text" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="h-11 dark:bg-civic-dark/50" placeholder="Enter your full name" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="mobile" className="text-gray-700 dark:text-gray-300 font-semibold">{t('auth.mobile')}</Label>
                  <Input id="mobile" type="tel" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    className="h-11 font-mono tracking-wider dark:bg-civic-dark/50" placeholder="10-digit mobile number" pattern="[0-9]{10}" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-semibold">{t('auth.email')}</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="h-11 dark:bg-civic-dark/50" placeholder="your@email.com" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="dob" className="text-gray-700 dark:text-gray-300 font-semibold">{t('auth.dob')}</Label>
                  <Input id="dob" type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })}
                    className="h-11 dark:bg-civic-dark/50" required />
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-civic-border rounded-xl p-4 mt-2">
                  <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <ShieldCheck className="w-4 h-4 text-primary-500" /> {t('auth.captcha')}
                  </Label>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-gray-800 dark:text-white shrink-0 bg-white dark:bg-civic-card px-3 py-1.5 rounded-md border dark:border-civic-border">
                      {captchaQuestion.a} + {captchaQuestion.b}
                    </span>
                    <Input id="captcha" type="number" value={form.captcha} onChange={(e) => setForm({ ...form, captcha: e.target.value })}
                      className="h-11 font-mono text-center dark:bg-civic-dark/50" placeholder="=" required />
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full h-11 text-base bg-gradient-primary hover:opacity-90 transition-all font-bold rounded-xl mt-4">
                  {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <UserPlus className="mr-2 h-5 w-5" />}
                  {loading ? t('common.loading') : t('auth.sendOTP')}
                </Button>

                <div className="text-center pt-3 text-sm">
                  <span className="text-gray-500 dark:text-civic-text font-medium">{t('auth.haveAccount')} </span>
                  <Link to="/login" className="text-primary-600 dark:text-primary-400 font-bold hover:underline">{t('auth.login')}</Link>
                </div>
              </form>
            )}

            {/* Step 2: OTP Verification */}
            {step === 2 && (
              <form onSubmit={handleVerifyOTP} className="space-y-6 animate-fade-in text-center px-2">
                <div className="py-4">
                  <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/20 mx-auto flex items-center justify-center mb-4">
                    <Smartphone className="w-8 h-8 text-primary-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">{t('auth.otpSent')}</h3>
                  <p className="text-sm font-medium text-gray-500 dark:text-civic-text mt-1">{t('auth.enterOTP')}</p>
                </div>

                <div className="space-y-4">
                  <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800/30 rounded-lg p-3 text-xs text-orange-600 dark:text-orange-400 font-mono text-center">
                    Mock Hint: <span className="font-bold tracking-widest">{otpHint}</span>
                  </div>
                  <Input type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="h-14 text-center text-3xl tracking-[0.5em] font-mono dark:bg-civic-dark/50" placeholder="••••••" maxLength={6} required autoFocus />
                </div>

                <Button type="submit" disabled={loading} className="w-full h-11 text-base bg-gradient-primary hover:opacity-90 font-bold rounded-xl mt-4">
                  {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ShieldCheck className="mr-2 h-5 w-5" />}
                  {loading ? t('common.loading') : t('auth.verifyOTP')}
                </Button>
              </form>
            )}

            {/* Step 3: Username Generated */}
            {step === 3 && (
              <div className="space-y-6 animate-scale-in text-center py-4">
                <div className="w-20 h-20 rounded-full bg-gradient-accent mx-auto flex items-center justify-center mb-6 shadow-xl shadow-accent-500/20">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">{t('auth.yourUsername')}</h3>
                  <div className="bg-gray-50 dark:bg-civic-card border border-gray-200 dark:border-civic-border rounded-xl px-6 py-4 my-4 inline-block">
                    <p className="text-3xl font-mono font-bold bg-clip-text text-transparent bg-gradient-primary tracking-wider">{username}</p>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-civic-text font-medium">{t('auth.rememberUsername')}</p>
                </div>
                <Button onClick={() => setStep(4)} className="w-full h-11 text-base bg-gradient-primary hover:opacity-90 font-bold rounded-xl mt-4">
                  {t('auth.setPassword')}
                </Button>
              </div>
            )}

            {/* Step 4: Set Password */}
            {step === 4 && (
              <form onSubmit={handleSetPassword} className="space-y-5 animate-fade-in">
                <div className="bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-800/30 rounded-xl p-3 text-center mb-2 flex items-center justify-center gap-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-civic-text">Civic ID:</span>
                  <span className="font-mono font-bold text-primary-600 dark:text-primary-400">{username}</span>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="newPassword" className="text-gray-700 dark:text-gray-300 font-semibold">{t('auth.password')}</Label>
                  <Input id="newPassword" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    className="h-11 dark:bg-civic-dark/50" placeholder="Minimum 6 characters" required minLength={6} />
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300 font-semibold">{t('auth.confirmPassword')}</Label>
                  <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-11 dark:bg-civic-dark/50" placeholder="Confirm your password" required minLength={6} />
                </div>

                <Button type="submit" disabled={loading} className="w-full h-11 text-base bg-gradient-primary hover:opacity-90 font-bold rounded-xl mt-4">
                  {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Key className="mr-2 h-5 w-5" />}
                  {loading ? t('common.loading') : "Secure Account"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
