
import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { translations, TranslationKeys } from '../i18n/translations.ts';

export const languages = {
  en: { nativeName: 'English' },
  'ar-IQ': { nativeName: 'العربية (عراقي)' },
  'ckb-IQ': { nativeName: 'کوردی (سۆرانی)' },
  'kmr-IQ': { nativeName: 'کوردی (بادینی)' },
};

type LanguageCode = keyof typeof languages;

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const savedLang = localStorage.getItem('language') as LanguageCode;
    return savedLang && languages[savedLang] ? savedLang : 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    localStorage.setItem('language', lang);
    setLanguageState(lang);
  };

  const t = useMemo(() => (key: string): string => {
    const keys = key.split('.');
    
    const findTranslation = (langObj: TranslationKeys, path: string[]): string | TranslationKeys | undefined => {
        return path.reduce((acc: any, currentKey: string) => {
            return acc && acc[currentKey] !== undefined ? acc[currentKey] : undefined;
        }, langObj);
    };

    let translated = findTranslation(translations[language], keys);

    if (typeof translated !== 'string') {
        // Fallback to English if translation not found or is not a string
        translated = findTranslation(translations.en, keys);
    }

    return typeof translated === 'string' ? translated : key;
  }, [language]);

  const value = { language, setLanguage, t };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
