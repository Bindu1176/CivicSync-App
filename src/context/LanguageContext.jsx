import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

const translations = {
  en: () => import('../i18n/en.json'),
  hi: () => import('../i18n/hi.json'),
  kn: () => import('../i18n/kn.json'),
  ta: () => import('../i18n/ta.json'),
  te: () => import('../i18n/te.json'),
  ml: () => import('../i18n/ml.json'),
};

const langNames = {
  en: 'English', hi: 'हिंदी', kn: 'ಕನ್ನಡ',
  ta: 'தமிழ்', te: 'తెలుగు', ml: 'മലയാളം'
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('civicsync_lang') || 'en');
  const [strings, setStrings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLanguage(lang);
  }, [lang]);

  const loadLanguage = async (langCode) => {
    setLoading(true);
    try {
      const mod = await translations[langCode]();
      setStrings(mod.default || mod);
    } catch {
      const fallback = await translations.en();
      setStrings(fallback.default || fallback);
    }
    setLoading(false);
  };

  const changeLanguage = (langCode) => {
    setLang(langCode);
    localStorage.setItem('civicsync_lang', langCode);
  };

  const t = (key) => {
    const keys = key.split('.');
    let val = strings;
    for (const k of keys) {
      val = val?.[k];
      if (val === undefined) return key;
    }
    return val || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, langNames, changeLanguage, t, loading }}>
      {children}
    </LanguageContext.Provider>
  );
}
