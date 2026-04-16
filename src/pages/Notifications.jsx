import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import api from '../utils/api';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => { fetchNotifications(); }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    } catch {}
    setLoading(false);
  };

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {}
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {}
  };

  const typeIcons = { scheme: '🏛️', payment: '💰', document: '📄', update: '🔄', general: '📢' };

  return (
    <div className="min-h-screen bg-gradient-civic-light dark:bg-gradient-civic pb-8">
      <div className="sticky top-0 glass z-20 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate('/')} className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-civic-card text-gray-600 dark:text-gray-300">←</button>
        <div className="flex-1">
          <h1 className="font-display font-bold text-lg text-gray-900 dark:text-white">🔔 {t('notifications.title')}</h1>
          {unreadCount > 0 && <p className="text-xs text-primary-500">{unreadCount} {t('notifications.unread')}</p>}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="px-3 py-1.5 rounded-lg text-xs font-medium text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20">
            {t('notifications.markAllRead')}
          </button>
        )}
      </div>

      <div className="px-4 pt-4 space-y-3">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center">
            <p className="text-4xl mb-3">🔕</p>
            <p className="text-gray-500 dark:text-civic-text">{t('notifications.noNotifications')}</p>
          </div>
        ) : (
          notifications.map((n, i) => (
            <div key={n._id} onClick={() => !n.isRead && markRead(n._id)}
              className={`glass-card rounded-2xl p-4 animate-slide-up cursor-pointer ${!n.isRead ? 'border-l-4 border-l-primary-500' : 'opacity-75'}`}
              style={{ animationDelay: `${i * 40}ms` }}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">{typeIcons[n.type] || '📢'}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-gray-800 dark:text-white">{n.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-civic-text mt-1">{n.message}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    {new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {!n.isRead && <div className="w-2.5 h-2.5 rounded-full bg-primary-500 mt-1 animate-pulse"></div>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
