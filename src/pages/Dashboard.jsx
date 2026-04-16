import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import Header from '../components/Header';
import EligibleBanners from '../components/EligibleBanners';
import SchemeEligibilityForm from '../components/SchemeEligibilityForm';
import ChatBot from '../components/ChatBot';
import api from '../utils/api';

const moduleConfig = [
  { id: 'identity', icon: '🆔', gradient: 'module-identity', submodules: ['aadhaar', 'pan', 'passport', 'voterID', 'rationCard', 'abha'] },
  { id: 'health', icon: '🏥', gradient: 'module-health', submodules: ['records', 'appointments', 'vaccinations', 'bloodDonations', 'prescriptions'] },
  { id: 'transport', icon: '🚗', gradient: 'module-transport', submodules: ['drivingLicense', 'vehicleRC', 'challans', 'fastag', 'bookings'] },
  { id: 'bills', icon: '💰', gradient: 'module-bills', submodules: ['electricity', 'gas', 'water', 'propertyTax', 'broadband'] },
  { id: 'certificates', icon: '📜', gradient: 'module-certificates', submodules: ['sslc', 'puc', 'degree', 'birthCertificate', 'casteCertificate', 'incomeCertificate', 'domicileCertificate', 'marriageCertificate'] },
  { id: 'schemes', icon: '🏛️', gradient: 'module-schemes', submodules: ['scholarships', 'govtSchemes', 'pension', 'agriculturalSubsidies'] },
  { id: 'property', icon: '🏠', gradient: 'module-property', submodules: ['ownedProperties', 'saleDeeds', 'encumbranceCertificates', 'propertyTaxReceipts'] },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showEligibility, setShowEligibility] = useState(false);
  const [eligibleSchemes, setEligibleSchemes] = useState([]);
  const [loadingSchemes, setLoadingSchemes] = useState(false);

  useEffect(() => {
    loadEligibility();
  }, []);

  const loadEligibility = async () => {
    try {
      const res = await api.get('/eligibility/results');
      if (res.data.eligible?.length) setEligibleSchemes(res.data.eligible);
    } catch {}
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return `${t('dashboard.greeting')} ${t('dashboard.morning')}`;
    if (h < 17) return `${t('dashboard.greeting')} ${t('dashboard.afternoon')}`;
    return `${t('dashboard.greeting')} ${t('dashboard.evening')}`;
  };

  const handleEligibilitySubmit = async (formData) => {
    setLoadingSchemes(true);
    try {
      const res = await api.post('/eligibility/check', formData);
      setEligibleSchemes(res.data.eligible || []);
      setShowEligibility(false);
    } catch {}
    setLoadingSchemes(false);
  };

  return (
    <div className="min-h-screen bg-gradient-civic-light dark:bg-gradient-civic pb-24">
      <Header />

      {/* Greeting */}
      <div className="px-4 pt-4 pb-2 animate-fade-in">
        <p className="text-sm text-gray-500 dark:text-civic-text">{getGreeting()} 👋</p>
        <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">{user?.fullName || 'Citizen'}</h2>
      </div>

      {/* Eligible Scheme Banners */}
      <EligibleBanners schemes={eligibleSchemes} />

      {/* Module Grid */}
      <div className="px-4 pt-4">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-civic-text uppercase tracking-wider mb-3">{t('dashboard.modules')}</h3>
        <div className="grid grid-cols-2 gap-3">
          {moduleConfig.map((mod, i) => (
            <button key={mod.id} onClick={() => navigate(`/module/${mod.id}`)}
              className={`${mod.gradient} rounded-2xl p-4 text-left text-white shadow-lg hover:shadow-xl active:scale-[0.97] transition-all duration-200 animate-slide-up`}
              style={{ animationDelay: `${i * 60}ms` }}>
              <span className="text-3xl block mb-2">{mod.icon}</span>
              <h4 className="font-display font-bold text-base leading-tight">{t(`modules.${mod.id}.title`)}</h4>
              <p className="text-xs opacity-80 mt-1">{t(`modules.${mod.id}.desc`)}</p>
              <div className="flex items-center mt-2 text-xs opacity-70">
                <span>{mod.submodules.length} {t('dashboard.modules').toLowerCase()}</span>
                <span className="ml-auto">→</span>
              </div>
            </button>
          ))}
          {/* Progress Tracker Card */}
          <button onClick={() => navigate('/progress')}
            className="bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 rounded-2xl p-4 text-left text-white shadow-lg hover:shadow-xl active:scale-[0.97] transition-all duration-200 animate-slide-up"
            style={{ animationDelay: '420ms' }}>
            <span className="text-3xl block mb-2">📊</span>
            <h4 className="font-display font-bold text-base leading-tight">{t('progress.title')}</h4>
            <p className="text-xs opacity-80 mt-1">{t('nav.progress')}</p>
            <div className="flex items-center mt-2 text-xs opacity-70">
              <span className="ml-auto">→</span>
            </div>
          </button>
        </div>
      </div>

      {/* Bottom Eligibility Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 glass z-30">
        <button onClick={() => setShowEligibility(true)}
          className="w-full py-3.5 bg-gradient-primary text-white font-bold rounded-2xl shadow-lg shadow-primary-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
          <span>🎯</span> {t('dashboard.checkEligibility')}
        </button>
      </div>

      {/* Eligibility Modal */}
      {showEligibility && (
        <SchemeEligibilityForm
          onClose={() => setShowEligibility(false)}
          onSubmit={handleEligibilitySubmit}
          loading={loadingSchemes}
        />
      )}

      {/* Chatbot FAB */}
      <ChatBot />
    </div>
  );
}
