import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

interface LanguageSelectorProps {
  className?: string;
}

function normalizeLang(lng: string): 'de' | 'en' {
  const base = (lng || 'de').split('-')[0].toLowerCase();
  return base === 'en' ? 'en' : 'de';
}

export function LanguageSelector({ className }: LanguageSelectorProps) {
  const { i18n } = useTranslation();

  const current = normalizeLang(i18n.resolvedLanguage ?? i18n.language);

  return (
    <div className={`relative flex items-center ${className ?? ''}`}>
      <select
        value={current}
        onChange={(e) => i18n.changeLanguage(normalizeLang(e.target.value))}
        className="appearance-none px-4 py-1 rounded border border-gold-600 text-gold-600 bg-white hover:bg-gold-50 transition focus:outline-none"
        aria-label="Sprache wählen / Select language"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
