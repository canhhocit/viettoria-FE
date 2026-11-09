import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { LANGUAGES, translations, type LanguageCode, type LanguageOption } from '../locales';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, defaultText?: string) => string;
  languages: LanguageOption[];
  currentLanguageOption: LanguageOption;
}

const STORAGE_KEY = 'viettoria_language';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper function to resolve nested keys like "nav.home" or "home.heroTitleLine1"
function getNestedValue(obj: unknown, path: string): string | undefined {
  if (!obj || typeof obj !== 'object') return undefined;
  
  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }

  return typeof current === 'string' ? current : undefined;
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    if (typeof window === 'undefined') return 'vi';
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
      if (stored && (stored === 'vi' || stored === 'en' || stored === 'fr')) {
        return stored;
      }
      // Check browser language
      const browserLang = navigator.language.slice(0, 2).toLowerCase();
      if (browserLang === 'en') return 'en';
      if (browserLang === 'fr') return 'fr';
      return 'vi';
    } catch {
      return 'vi';
    }
  });

  const setLanguage = useCallback((lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore local storage write errors
    }
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = useCallback(
    (key: string, defaultText?: string): string => {
      // 1. Try currently selected language dictionary
      const currentDict = translations[language] as unknown;
      const val = getNestedValue(currentDict, key);
      if (val !== undefined) return val;

      // 2. Fallback to Vietnamese if missing in EN/FR
      if (language !== 'vi') {
        const viDict = translations.vi as unknown;
        const viVal = getNestedValue(viDict, key);
        if (viVal !== undefined) return viVal;
      }

      // 3. Return provided default text or raw key
      return defaultText !== undefined ? defaultText : key;
    },
    [language]
  );

  const currentLanguageOption = useMemo(
    () => LANGUAGES.find((l) => l.code === language) || LANGUAGES[0],
    [language]
  );

  const contextValue = useMemo<LanguageContextType>(
    () => ({
      language,
      setLanguage,
      t,
      languages: LANGUAGES,
      currentLanguageOption,
    }),
    [language, setLanguage, t, currentLanguageOption]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
