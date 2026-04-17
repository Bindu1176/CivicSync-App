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
import { Fingerprint, Activity, Car, ReceiptText, FileBadge, Landmark, Home, TrendingUp, Target } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

const moduleConfig = [
  { id: 'identity', icon: Fingerprint, color: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400', submodules: ['aadhaar', 'pan', 'passport', 'voterID', 'rationCard', 'abha'] },
  { id: 'health', icon: Activity, color: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400', submodules: ['records', 'appointments', 'vaccinations', 'bloodDonations', 'prescriptions'] },
  { id: 'transport', icon: Car, color: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400', submodules: ['drivingLicense', 'vehicleRC', 'challans', 'fastag', 'bookings'] },
  { id: 'bills', icon: ReceiptText, color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400', submodules: ['electricity', 'gas', 'water', 'propertyTax', 'broadband'] },
  { id: 'certificates', icon: FileBadge, color: 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400', submodules: ['sslc', 'puc', 'degree', 'birthCertificate', 'casteCertificate', 'incomeCertificate', 'domicileCertificate', 'marriageCertificate'] },
  { id: 'schemes', icon: Landmark, color: 'bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400', submodules: ['scholarships', 'govtSchemes', 'pension', 'agriculturalSubsidies'] },
  { id: 'property', icon: Home, color: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400', submodules: ['ownedProperties', 'saleDeeds', 'encumbranceCertificates', 'propertyTaxReceipts'] },
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
      <div className="px-4 pt-6 pb-2 animate-fade-in flex flex-col items-start">
        <Badge variant="secondary" className="mb-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-primary-100 dark:border-primary-800">
          Citizen ID: {user?.username}
        </Badge>
        <p className="text-sm font-medium text-gray-500 dark:text-civic-text">{getGreeting()} 👋</p>
        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white tracking-tight">{user?.fullName || 'Citizen'}</h2>
      </div>

      <Separator className="my-2 bg-gray-200/50 dark:bg-civic-border/50 w-[92%] mx-auto" />

      {/* Eligible Scheme Banners */}
      <EligibleBanners schemes={eligibleSchemes} />

      {/* Module Grid in Icons Format */}
      <div className="px-4 pt-2 pb-8">
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          {t('dashboard.modules')}
        </h3>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-x-4 gap-y-6 pb-6">
          {moduleConfig.map((mod, i) => {
            const Icon = mod.icon;
            return (
              <div key={mod.id} onClick={() => navigate(`/module/${mod.id}`)}
                className="flex flex-col items-center cursor-pointer group animate-scale-in"
                style={{ animationDelay: `${i * 50}ms` }}>
                
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-[1.25rem] shadow-sm flex items-center justify-center mb-2 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md ${mod.color}`}>
                  <Icon className="w-8 h-8 sm:w-10 sm:h-10 transition-transform group-hover:scale-110" strokeWidth={1.5} />
                </div>
                
                <h4 className="text-[11px] sm:text-xs font-medium text-gray-700 dark:text-gray-200 text-center leading-tight tracking-wide font-sans w-full truncate px-1">
                  {t(`modules.${mod.id}.title`)}
                </h4>
              </div>
            );
          })}

          {/* Progress Tracker App Icon */}
          <div onClick={() => navigate('/progress')}
            className="flex flex-col items-center cursor-pointer group animate-scale-in"
            style={{ animationDelay: '400ms' }}>
            
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[1.25rem] shadow-sm flex items-center justify-center mb-2 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md bg-slate-100 text-slate-600 dark:bg-slate-800/50 dark:text-slate-300">
              <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 transition-transform group-hover:scale-110" strokeWidth={1.5} />
            </div>
            
            <h4 className="text-[11px] sm:text-xs font-medium text-gray-700 dark:text-gray-200 text-center leading-tight tracking-wide font-sans">
              {t('progress.title')}
            </h4>
          </div>
        </div>
      </div>

      {/* Bottom Eligibility Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-gray-100 dark:border-civic-border bg-white/80 dark:bg-civic-dark/80 backdrop-blur-lg z-30 pb-safe">
        <Button onClick={() => setShowEligibility(true)}
          className="w-full h-12 bg-gradient-primary text-white font-bold rounded-xl shadow-lg shadow-primary-500/20 active:scale-[0.98] transition-all text-base"
        >
          <Target className="mr-2 h-5 w-5" /> {t('dashboard.checkEligibility')}
        </Button>
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
