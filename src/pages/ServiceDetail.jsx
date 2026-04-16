import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import api from '../utils/api';
import DocumentViewer from '../components/DocumentViewer';
import MockPaymentGateway from '../components/MockPaymentGateway';
import UpdateInfoModal from '../components/UpdateInfoModal';

const apiRouteMap = {
  identity: '/identity', health: '/health', transport: '/transport',
  bills: '/bills', certificates: '/certificates', schemes: '/schemes', property: '/property',
};

export default function ServiceDetail() {
  const { moduleId, submoduleId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(null);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showDoc, setShowDoc] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`${apiRouteMap[moduleId]}/${submoduleId}`);
      setData(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
    setLoading(false);
  }, [moduleId, submoduleId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handlePayment = async (billId, billType, amount) => {
    setShowPayment({ billId, billType, amount });
  };

  const handlePaymentSuccess = () => {
    setShowPayment(null);
    fetchData();
  };

  const renderValue = (key, value) => {
    if (value === null || value === undefined || value === '') return null;
    if (typeof value === 'boolean') return value ? '✅ Yes' : '❌ No';
    if (Array.isArray(value)) {
      if (value.length === 0) return null;
      if (typeof value[0] === 'string') return value.join(', ');
      return null; // Complex arrays handled separately
    }
    return String(value);
  };

  const formatKey = (key) => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()).replace(/Id$/, 'ID');
  };

  const renderSingleObject = (obj, title) => (
    <div className="glass-card rounded-2xl p-4 mb-4 animate-slide-up">
      {title && <h3 className="font-display font-bold text-gray-800 dark:text-white mb-3 text-lg">{title}</h3>}
      <div className="space-y-2">
        {Object.entries(obj).filter(([k]) => !['_id', '__v', 'userId', 'id', 'photo', 'image', 'certificate'].includes(k)).map(([key, val]) => {
          const display = renderValue(key, val);
          if (display === null) return null;
          return (
            <div key={key} className="flex justify-between items-start py-1.5 border-b border-gray-100 dark:border-civic-border/30 last:border-0">
              <span className="text-sm text-gray-500 dark:text-civic-text">{formatKey(key)}</span>
              <span className={`text-sm font-medium text-right ml-4 max-w-[55%] ${val === 'Paid' ? 'text-green-600' : val === 'Unpaid' ? 'text-red-500' : 'text-gray-800 dark:text-white'}`}>
                {display}
              </span>
            </div>
          );
        })}
        {/* Nested arrays */}
        {Object.entries(obj).filter(([, v]) => Array.isArray(v) && v.length > 0 && typeof v[0] === 'object').map(([key, arr]) => (
          <div key={key} className="mt-3">
            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">{formatKey(key)}</h4>
            <div className="space-y-2">
              {arr.map((item, i) => (
                <div key={i} className="bg-gray-50 dark:bg-civic-dark/50 rounded-xl p-3 text-xs space-y-1">
                  {Object.entries(item).filter(([k]) => k !== '_id' && k !== 'id').map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-gray-500 dark:text-civic-text">{formatKey(k)}</span>
                      <span className="text-gray-800 dark:text-white font-medium">{String(v)}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Download button */}
      <button onClick={() => setShowDoc(obj)} className="w-full mt-4 py-2.5 bg-gray-100 dark:bg-civic-card border border-gray-200 dark:border-civic-border rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-civic-border transition-colors flex items-center justify-center gap-2">
        📄 {t('common.download')} Document
      </button>
    </div>
  );

  const renderArrayData = (arr) => (
    <div className="space-y-3">
      {arr.map((item, i) => (
        <div key={item.id || i} className="glass-card rounded-2xl p-4 animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
          <div className="space-y-2">
            {Object.entries(item).filter(([k]) => !['_id', '__v', 'userId', 'id'].includes(k)).map(([key, val]) => {
              if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'object') {
                return (
                  <div key={key} className="mt-2">
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{formatKey(key)}</h4>
                    {val.map((sub, si) => (
                      <div key={si} className="bg-gray-50 dark:bg-civic-dark/50 rounded-lg p-2 text-xs mb-1">
                        {Object.entries(sub).filter(([k]) => k !== '_id').map(([sk, sv]) => (
                          <span key={sk} className="mr-3"><span className="text-gray-500">{formatKey(sk)}:</span> <span className="font-medium text-gray-800 dark:text-white">{String(sv)}</span></span>
                        ))}
                      </div>
                    ))}
                  </div>
                );
              }
              const display = renderValue(key, val);
              if (display === null) return null;
              return (
                <div key={key} className="flex justify-between items-start py-1 border-b border-gray-100 dark:border-civic-border/30 last:border-0">
                  <span className="text-xs text-gray-500 dark:text-civic-text">{formatKey(key)}</span>
                  <span className={`text-xs font-medium text-right ml-4 max-w-[55%] ${val === 'Paid' ? 'text-green-600' : val === 'Unpaid' ? 'text-red-500' : val === 'Active' ? 'text-blue-500' : val === 'Confirmed' ? 'text-green-600' : 'text-gray-800 dark:text-white'}`}>
                    {display}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Pay button for unpaid bills */}
          {moduleId === 'bills' && item.status === 'Unpaid' && (
            <button onClick={() => handlePayment(item.id, submoduleId, item.amount)}
              className="w-full mt-3 py-2.5 bg-gradient-accent text-white font-semibold rounded-xl shadow-lg shadow-accent-500/25 active:scale-[0.98] transition-all text-sm">
              {t('common.payNow')} — ₹{item.amount?.toLocaleString()}
            </button>
          )}
          {/* Download */}
          <button onClick={() => setShowDoc(item)} className="w-full mt-2 py-2 bg-gray-100 dark:bg-civic-card border border-gray-200 dark:border-civic-border rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 flex items-center justify-center gap-1">
            📄 {t('common.download')}
          </button>
        </div>
      ))}
    </div>
  );

  if (loading) return (
    <div className="min-h-screen bg-gradient-civic-light dark:bg-gradient-civic flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-500 border-t-transparent"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-civic-light dark:bg-gradient-civic pb-8">
      {/* Header */}
      <div className="sticky top-0 glass z-20 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(`/module/${moduleId}`)} className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-civic-card text-gray-600 dark:text-gray-300">
          ←
        </button>
        <div className="flex-1">
          <h1 className="font-display font-bold text-lg text-gray-900 dark:text-white">
            {t(`modules.${moduleId}.${submoduleId}`)}
          </h1>
          <p className="text-xs text-gray-500 dark:text-civic-text">{t(`modules.${moduleId}.title`)}</p>
        </div>
        {moduleId === 'identity' && (
          <button onClick={() => setShowUpdate(true)} className="px-3 py-2 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-semibold">
            ✏️ {t('common.update')}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="px-4 pt-4">
        {!data || (Array.isArray(data) && data.length === 0) ? (
          <div className="glass-card rounded-2xl p-8 text-center">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-500 dark:text-civic-text">{t('common.noData')}</p>
          </div>
        ) : Array.isArray(data) ? (
          renderArrayData(data)
        ) : typeof data === 'object' ? (
          renderSingleObject(data, t(`modules.${moduleId}.${submoduleId}`))
        ) : (
          <div className="glass-card rounded-2xl p-4">
            <p className="text-gray-800 dark:text-white">{JSON.stringify(data, null, 2)}</p>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <MockPaymentGateway
          billId={showPayment.billId}
          billType={showPayment.billType}
          amount={showPayment.amount}
          onClose={() => setShowPayment(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Document Viewer */}
      {showDoc && (
        <DocumentViewer data={showDoc} title={t(`modules.${moduleId}.${submoduleId}`)} onClose={() => setShowDoc(null)} />
      )}

      {/* Update Info Modal */}
      {showUpdate && (
        <UpdateInfoModal moduleId={moduleId} submoduleId={submoduleId} onClose={() => setShowUpdate(false)} onSuccess={fetchData} />
      )}
    </div>
  );
}
