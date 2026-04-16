import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import api from '../utils/api';

export default function UpdateInfoModal({ moduleId, submoduleId, onClose, onSuccess }) {
  const [field, setField] = useState('');
  const [newValue, setNewValue] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const fieldOptions = {
    aadhaar: ['name', 'address', 'dob', 'gender'],
    pan: ['name', 'dob', 'fatherName'],
    passport: ['name', 'address', 'placeOfIssue'],
    voterID: ['name', 'fatherName', 'constituency'],
    rationCard: ['headOfFamily', 'category'],
    abha: ['name', 'dob'],
  };

  const fields = fieldOptions[submoduleId] || ['name', 'address'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await api.post('/identity/update-request', {
        submodule: submoduleId, fieldToUpdate: field, oldValue: 'Current Value', newValue, password
      });
      setSuccess(`Request submitted! Status: ${res.data.status}`);
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit update request');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="w-full max-w-sm bg-white dark:bg-civic-dark rounded-2xl shadow-2xl p-6 animate-scale-in"
        onClick={e => e.stopPropagation()}>
        <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white mb-1">✏️ {t('common.update')}</h3>
        <p className="text-sm text-gray-500 dark:text-civic-text mb-4">{t(`modules.${moduleId}.${submoduleId}`)}</p>

        {success ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-gradient-accent mx-auto flex items-center justify-center mb-3">
              <span className="text-3xl">✓</span>
            </div>
            <p className="text-green-600 dark:text-green-400 font-semibold">{success}</p>
            <button onClick={onClose} className="w-full btn-primary mt-4 text-sm">{t('common.close')}</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Field to Update</label>
              <select value={field} onChange={(e) => setField(e.target.value)} className="input-field" required>
                <option value="">Select field...</option>
                {fields.map(f => <option key={f} value={f}>{f.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">New Value</label>
              <input type="text" value={newValue} onChange={(e) => setNewValue(e.target.value)} className="input-field" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">🔒 Password (Re-authenticate)</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="input-field" placeholder="Enter your password" required />
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="flex-1 btn-secondary text-sm">{t('common.cancel')}</button>
              <button type="submit" disabled={loading} className="flex-1 btn-primary text-sm disabled:opacity-50">
                {loading ? t('common.loading') : t('common.submit')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
