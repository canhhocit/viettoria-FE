import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { LANGUAGES, translations, type LanguageCode, type LanguageOption } from '../locales';
import type { Collection, Product, StoryBlock, BlogPost } from '../types';
import type { ArchitecturalHotspot } from '../data/architecturalHotspots';
import {
  getLocalizedProduct,
  getLocalizedProducts,
  getLocalizedCollection,
  getLocalizedCollections,
  getLocalizedBlog,
  getLocalizedBlogs,
  getLocalizedStoryBlock,
  getLocalizedHotspot,
  getLocalizedHotspots,
} from '../utils/localizedEntities';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, defaultText?: string) => string;
  languages: LanguageOption[];
  currentLanguageOption: LanguageOption;
  localizeProduct: <T extends Product | Partial<Product>>(product: T) => T;
  localizeProducts: (products: Product[]) => Product[];
  localizeCollection: <T extends Collection | Partial<Collection>>(collection: T) => T;
  localizeCollections: (collections: Collection[]) => Collection[];
  localizeBlog: <T extends BlogPost | Partial<BlogPost>>(blog: T) => T;
  localizeBlogs: (blogs: BlogPost[]) => BlogPost[];
  localizeStoryBlock: <T extends StoryBlock | Partial<StoryBlock>>(block: T) => T;
  localizeHotspot: (hotspot: ArchitecturalHotspot) => ArchitecturalHotspot;
  localizeHotspots: (hotspots: ArchitecturalHotspot[]) => ArchitecturalHotspot[];
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

  const localizeProduct = useCallback(
    <T extends Product | Partial<Product>>(prod: T): T => getLocalizedProduct(prod, language),
    [language]
  );

  const localizeProducts = useCallback(
    (prods: Product[]): Product[] => getLocalizedProducts(prods, language),
    [language]
  );

  const localizeCollection = useCallback(
    <T extends Collection | Partial<Collection>>(col: T): T => getLocalizedCollection(col, language),
    [language]
  );

  const localizeCollections = useCallback(
    (cols: Collection[]): Collection[] => getLocalizedCollections(cols, language),
    [language]
  );

  const localizeBlog = useCallback(
    <T extends BlogPost | Partial<BlogPost>>(b: T): T => getLocalizedBlog(b, language),
    [language]
  );

  const localizeBlogs = useCallback(
    (blgs: BlogPost[]): BlogPost[] => getLocalizedBlogs(blgs, language),
    [language]
  );

  const localizeStoryBlock = useCallback(
    <T extends StoryBlock | Partial<StoryBlock>>(block: T): T => getLocalizedStoryBlock(block, language),
    [language]
  );

  const localizeHotspot = useCallback(
    (hotspot: ArchitecturalHotspot): ArchitecturalHotspot => getLocalizedHotspot(hotspot, language),
    [language]
  );

  const localizeHotspots = useCallback(
    (hotspots: ArchitecturalHotspot[]): ArchitecturalHotspot[] => getLocalizedHotspots(hotspots, language),
    [language]
  );

  const contextValue = useMemo<LanguageContextType>(
    () => ({
      language,
      setLanguage,
      t,
      languages: LANGUAGES,
      currentLanguageOption,
      localizeProduct,
      localizeProducts,
      localizeCollection,
      localizeCollections,
      localizeBlog,
      localizeBlogs,
      localizeStoryBlock,
      localizeHotspot,
      localizeHotspots,
    }),
    [
      language,
      setLanguage,
      t,
      currentLanguageOption,
      localizeProduct,
      localizeProducts,
      localizeCollection,
      localizeCollections,
      localizeBlog,
      localizeBlogs,
      localizeStoryBlock,
      localizeHotspot,
      localizeHotspots,
    ]
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
