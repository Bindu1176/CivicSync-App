import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const moduleSubmodules = {
  identity: [
    { id: 'aadhaar', icon: '🪪', color: 'from-blue-500 to-blue-700' },
    { id: 'pan', icon: '💳', color: 'from-amber-500 to-amber-700' },
    { id: 'passport', icon: '📕', color: 'from-red-500 to-red-700' },
    { id: 'voterID', icon: '🗳️', color: 'from-purple-500 to-purple-700' },
    { id: 'rationCard', icon: '🃏', color: 'from-teal-500 to-teal-700' },
    { id: 'abha', icon: '🏥', color: 'from-green-500 to-green-700' },
  ],
  health: [
    { id: 'records', icon: '📋', color: 'from-red-500 to-rose-700' },
    { id: 'appointments', icon: '📅', color: 'from-blue-500 to-indigo-700' },
    { id: 'vaccinations', icon: '💉', color: 'from-green-500 to-emerald-700' },
    { id: 'bloodDonations', icon: '🩸', color: 'from-red-600 to-red-800' },
    { id: 'prescriptions', icon: '💊', color: 'from-violet-500 to-violet-700' },
  ],
  transport: [
    { id: 'drivingLicense', icon: '🪪', color: 'from-amber-500 to-orange-700' },
    { id: 'vehicleRC', icon: '🚙', color: 'from-blue-500 to-blue-700' },
    { id: 'challans', icon: '⚠️', color: 'from-red-500 to-red-700' },
    { id: 'fastag', icon: '🏷️', color: 'from-purple-500 to-purple-700' },
    { id: 'bookings', icon: '🎫', color: 'from-green-500 to-green-700' },
  ],
  bills: [
    { id: 'electricity', icon: '⚡', color: 'from-yellow-500 to-amber-700' },
    { id: 'gas', icon: '🔥', color: 'from-orange-500 to-orange-700' },
    { id: 'water', icon: '💧', color: 'from-cyan-500 to-cyan-700' },
    { id: 'propertyTax', icon: '🏛️', color: 'from-gray-500 to-gray-700' },
    { id: 'broadband', icon: '🌐', color: 'from-indigo-500 to-indigo-700' },
  ],
  certificates: [
    { id: 'sslc', icon: '🎓', color: 'from-blue-500 to-blue-700' },
    { id: 'puc', icon: '📗', color: 'from-green-500 to-green-700' },
    { id: 'degree', icon: '🎓', color: 'from-purple-500 to-purple-700' },
    { id: 'birthCertificate', icon: '👶', color: 'from-pink-500 to-pink-700' },
    { id: 'casteCertificate', icon: '📄', color: 'from-amber-500 to-amber-700' },
    { id: 'incomeCertificate', icon: '💰', color: 'from-green-600 to-green-800' },
    { id: 'domicileCertificate', icon: '🏠', color: 'from-teal-500 to-teal-700' },
    { id: 'marriageCertificate', icon: '💍', color: 'from-rose-500 to-rose-700' },
  ],
  schemes: [
    { id: 'scholarships', icon: '📚', color: 'from-blue-500 to-indigo-700' },
    { id: 'govtSchemes', icon: '🏛️', color: 'from-pink-500 to-rose-700' },
    { id: 'pension', icon: '💰', color: 'from-amber-500 to-yellow-700' },
    { id: 'agriculturalSubsidies', icon: '🌾', color: 'from-green-500 to-lime-700' },
  ],
  property: [
    { id: 'ownedProperties', icon: '🏘️', color: 'from-cyan-500 to-cyan-700' },
    { id: 'saleDeeds', icon: '📝', color: 'from-blue-500 to-blue-700' },
    { id: 'encumbranceCertificates', icon: '📋', color: 'from-violet-500 to-violet-700' },
    { id: 'propertyTaxReceipts', icon: '🧾', color: 'from-green-500 to-green-700' },
  ],
};

const moduleIcons = { identity: '🆔', health: '🏥', transport: '🚗', bills: '💰', certificates: '📜', schemes: '🏛️', property: '🏠' };

export default function ModuleDetail() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const submodules = moduleSubmodules[moduleId] || [];

  return (
    <div className="min-h-screen bg-gradient-civic-light dark:bg-gradient-civic pb-8">
      {/* Header */}
      <div className="sticky top-0 glass z-20 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate('/')} className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-civic-card text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-civic-border transition-colors">
          ←
        </button>
        <div>
          <h1 className="font-display font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
            {moduleIcons[moduleId]} {t(`modules.${moduleId}.title`)}
          </h1>
          <p className="text-xs text-gray-500 dark:text-civic-text">{t(`modules.${moduleId}.desc`)}</p>
        </div>
      </div>

      {/* Submodule Cards */}
      <div className="px-4 pt-4 space-y-3">
        {submodules.map((sub, i) => (
          <button key={sub.id} onClick={() => navigate(`/module/${moduleId}/${sub.id}`)}
            className="w-full glass-card rounded-2xl p-4 flex items-center gap-4 animate-slide-up"
            style={{ animationDelay: `${i * 50}ms` }}>
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${sub.color} flex items-center justify-center text-2xl shadow-lg`}>
              {sub.icon}
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-gray-800 dark:text-white">{t(`modules.${moduleId}.${sub.id}`)}</h3>
              <p className="text-xs text-gray-500 dark:text-civic-text mt-0.5">{t('common.viewDetails')}</p>
            </div>
            <span className="text-gray-400 dark:text-civic-text text-lg">›</span>
          </button>
        ))}
      </div>
    </div>
  );
}
