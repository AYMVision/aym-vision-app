import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

interface LanguageSelectorProps {
  className?: string;
}

export function LanguageSelector({ className }: LanguageSelectorProps) {
  const { i18n } = useTranslation();

  return (
    <div className={`relative flex items-center ${className}`}>
      <select
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        className="appearance-none px-4 py-1 rounded border border-gold-600 text-gold-600 bg-white hover:bg-gold-50 transition focus:outline-none"
        style={{ backgroundPosition: 'left 0.5rem center' }}
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
