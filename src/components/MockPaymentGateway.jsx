import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import api from '../utils/api';

export default function MockPaymentGateway({ billId, billType, amount, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const { t } = useLanguage();

  const handlePay = async () => {
    if (pin.length < 4) { setError('Enter a valid UPI PIN (4-6 digits)'); return; }
    setStep(2); setError('');

    try {
      await new Promise(r => setTimeout(r, 2000)); // Simulate processing
      const res = await api.post('/bills/pay', { billType, billId, upiPin: pin });
      setResult(res.data);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
      setStep(1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="w-full max-w-sm bg-white dark:bg-civic-dark rounded-2xl shadow-2xl overflow-hidden animate-scale-in"
        onClick={e => e.stopPropagation()}>

        {/* Step 1: Enter PIN */}
        {step === 1 && (
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-accent mx-auto flex items-center justify-center mb-3">
                <span className="text-3xl">💳</span>
              </div>
              <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">{t('payment.title')}</h3>
              <p className="text-2xl font-bold text-gradient mt-2">₹{amount?.toLocaleString()}</p>
              <p className="text-xs text-gray-500 dark:text-civic-text mt-1">{t('payment.toAccount')}: {billType?.toUpperCase()}</p>
            </div>

            {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('payment.enterPin')}</label>
              <input type="password" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="input-field text-center text-2xl tracking-[0.5em] font-mono" placeholder="• • • •" maxLength={6} />
            </div>

            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 btn-secondary text-sm">{t('common.cancel')}</button>
              <button onClick={handlePay} className="flex-1 btn-primary text-sm">{t('common.payNow')}</button>
            </div>
          </div>
        )}

        {/* Step 2: Processing */}
        {step === 2 && (
          <div className="p-8 text-center">
            <div className="w-20 h-20 rounded-full border-4 border-primary-500 border-t-transparent animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">{t('payment.processing')}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">₹{amount?.toLocaleString()}</p>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && result && (
          <div className="p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-accent mx-auto flex items-center justify-center mb-4 shadow-lg shadow-accent-500/30 animate-scale-in">
              <span className="text-4xl">✓</span>
            </div>
            <h3 className="font-display font-bold text-xl text-green-600 dark:text-green-400 mb-2">{t('payment.success')}</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{result.amount?.toLocaleString()}</p>

            <div className="mt-4 bg-gray-50 dark:bg-civic-card rounded-xl p-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">{t('payment.transactionId')}</span>
                <span className="font-mono font-medium text-gray-800 dark:text-white text-xs">{result.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t('common.date')}</span>
                <span className="font-medium text-gray-800 dark:text-white">{result.paidDate}</span>
              </div>
            </div>

            <button onClick={() => { onSuccess(); onClose(); }} className="w-full btn-primary mt-4 text-sm">
              {t('common.close')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
