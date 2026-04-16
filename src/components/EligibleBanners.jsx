import { useLanguage } from '../context/LanguageContext';

export default function EligibleBanners({ schemes }) {
  const { t } = useLanguage();

  if (!schemes || schemes.length === 0) {
    return (
      <div className="px-4 pt-3">
        <div className="glass-card rounded-2xl p-4 text-center">
          <p className="text-sm text-gray-500 dark:text-civic-text">🎯 {t('dashboard.noBanners')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-3">
      <h3 className="text-sm font-semibold text-gray-500 dark:text-civic-text uppercase tracking-wider mb-2">
        {t('dashboard.eligibleSchemes')} ({schemes.length})
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
        {schemes.map((scheme, i) => (
          <div key={scheme.id || i}
            className="min-w-[200px] bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-4 text-white shadow-lg shadow-primary-500/20 animate-slide-up flex-shrink-0"
            style={{ animationDelay: `${i * 80}ms` }}>
            <span className="text-2xl">{scheme.icon || '🏛️'}</span>
            <h4 className="font-semibold text-sm mt-2 leading-tight">{scheme.name}</h4>
            <p className="text-xs opacity-80 mt-1 line-clamp-2">{scheme.description}</p>
            <div className="mt-2 flex items-center gap-1">
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-medium">{scheme.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
