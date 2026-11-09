import { vi } from './vi';
import { en } from './en';
import { fr } from './fr';
import type { TranslationSchema } from './vi';

export type LanguageCode = 'vi' | 'en' | 'fr';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  shortLabel: string;
  flagSymbol: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'vi', label: 'Tiếng Việt', shortLabel: 'VI', flagSymbol: '🇻🇳' },
  { code: 'en', label: 'English', shortLabel: 'EN', flagSymbol: '🇬🇧' },
  { code: 'fr', label: 'Français', shortLabel: 'FR', flagSymbol: '🇫🇷' },
];

export const translations: Record<LanguageCode, TranslationSchema> = {
  vi,
  en,
  fr,
};

export { vi, en, fr };
export type { TranslationSchema };

