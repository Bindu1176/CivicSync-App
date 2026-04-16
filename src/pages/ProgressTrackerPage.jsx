import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import api from '../utils/api';

export default function ProgressTrackerPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => { fetchProgress(); }, []);

  const fetchProgress = async () => {
    try {
      const res = await api.get('/progress');
      setRequests(res.data);
    } catch {}
    setLoading(false);
  };

  const simulateProgress = async (id) => {
    try {
      await api.post(`/progress/simulate/${id}`);
      fetchProgress();
    } catch {}
  };

  const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    'In Review': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    Approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    Rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  const statusIcons = { Pending: '⏳', 'In Review': '🔍', Approved: '✅', Rejected: '❌' };

  return (
    <div className="min-h-screen bg-gradient-civic-light dark:bg-gradient-civic pb-8">
      <div className="sticky top-0 glass z-20 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate('/')} className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-civic-card text-gray-600 dark:text-gray-300">←</button>
        <h1 className="font-display font-bold text-lg text-gray-900 dark:text-white">📊 {t('progress.title')}</h1>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-500 dark:text-civic-text">{t('progress.noRequests')}</p>
          </div>
        ) : (
          requests.map((req, i) => (
            <div key={req._id} className="glass-card rounded-2xl p-4 animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex items-center justify-between mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[req.status]}`}>
                  {statusIcons[req.status]} {req.status}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {new Date(req.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
              </div>

              {/* Progress bar */}
              <div className="flex items-center gap-1 mb-3">
                {['Pending', 'In Review', 'Approved'].map((step, si) => (
                  <div key={step} className="flex-1 flex items-center gap-1">
                    <div className={`h-1.5 flex-1 rounded-full ${['Pending', 'In Review', 'Approved'].indexOf(req.status) >= si ? 'bg-primary-500' : 'bg-gray-200 dark:bg-civic-border'}`}></div>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-civic-text">Module</span>
                  <span className="font-medium text-gray-800 dark:text-white capitalize">{req.module} → {req.submodule}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-civic-text">Field</span>
                  <span className="font-medium text-gray-800 dark:text-white">{req.fieldToUpdate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-civic-text">New Value</span>
                  <span className="font-medium text-primary-500">{req.newValue}</span>
                </div>
              </div>

              {req.status !== 'Approved' && req.status !== 'Rejected' && (
                <button onClick={() => simulateProgress(req._id)}
                  className="w-full mt-3 py-2 bg-gray-100 dark:bg-civic-card border border-gray-200 dark:border-civic-border rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-civic-border transition-colors">
                  ⏩ Simulate Next Status
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
