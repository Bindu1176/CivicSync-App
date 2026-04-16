import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const states = ['Karnataka', 'Maharashtra', 'Delhi', 'Tamil Nadu', 'Telangana', 'Kerala', 'West Bengal', 'Uttar Pradesh', 'Gujarat', 'Rajasthan'];

export default function SchemeEligibilityForm({ onClose, onSubmit, loading }) {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    caste: 'General', income: 300000, disability: false,
    state: 'Karnataka', gender: 'Male', age: 30
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={onClose}>
      <div className="w-full max-w-lg bg-white dark:bg-civic-dark rounded-t-3xl p-6 animate-slide-up max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1.5 bg-gray-300 dark:bg-civic-border rounded-full mx-auto mb-4"></div>
        <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-1">🎯 {t('eligibility.title')}</h2>
        <p className="text-sm text-gray-500 dark:text-civic-text mb-5">{t('eligibility.subtitle')}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Caste */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('eligibility.caste')}</label>
            <div className="grid grid-cols-4 gap-2">
              {['General', 'OBC', 'SC', 'ST'].map(c => (
                <button key={c} type="button" onClick={() => setForm({ ...form, caste: c })}
                  className={`py-2 rounded-xl text-sm font-medium transition-all ${form.caste === c ? 'bg-gradient-primary text-white shadow-md' : 'bg-gray-100 dark:bg-civic-card text-gray-600 dark:text-gray-400'}`}>
                  {t(`eligibility.${c.toLowerCase()}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Income */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {t('eligibility.income')}: <span className="text-primary-500 font-bold">₹{form.income.toLocaleString()}</span>
            </label>
            <input type="range" min="50000" max="2000000" step="50000" value={form.income}
              onChange={(e) => setForm({ ...form, income: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 dark:bg-civic-border rounded-lg appearance-none cursor-pointer accent-primary-500" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>₹50K</span><span>₹20L</span></div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('eligibility.gender')}</label>
            <div className="grid grid-cols-3 gap-2">
              {['Male', 'Female', 'Other'].map(g => (
                <button key={g} type="button" onClick={() => setForm({ ...form, gender: g })}
                  className={`py-2 rounded-xl text-sm font-medium transition-all ${form.gender === g ? 'bg-gradient-primary text-white shadow-md' : 'bg-gray-100 dark:bg-civic-card text-gray-600 dark:text-gray-400'}`}>
                  {t(`eligibility.${g.toLowerCase()}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('eligibility.age')}</label>
            <input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: parseInt(e.target.value) || 0 })}
              className="input-field" min="1" max="120" />
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('eligibility.state')}</label>
            <select value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}
              className="input-field">
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Disability */}
          <div className="flex items-center justify-between glass-card rounded-xl p-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('eligibility.disability')}</span>
            <button type="button" onClick={() => setForm({ ...form, disability: !form.disability })}
              className={`w-12 h-7 rounded-full transition-all duration-200 ${form.disability ? 'bg-primary-500' : 'bg-gray-300 dark:bg-civic-border'}`}>
              <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${form.disability ? 'translate-x-6' : 'translate-x-1'}`}></div>
            </button>
          </div>

          <button type="submit" disabled={loading}
            className="w-full btn-primary disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span> : '🎯'}
            {loading ? t('common.loading') : t('eligibility.check')}
          </button>
        </form>
      </div>
    </div>
  );
}
