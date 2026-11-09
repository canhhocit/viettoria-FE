import { vi } from './vi';
import { en } from './en';
import { fr } from './fr';
import { zh } from './zh';
import { ko } from './ko';
import { ja } from './ja';
import type { TranslationSchema } from './vi';

export type LanguageCode = 'vi' | 'en' | 'fr' | 'zh' | 'ko' | 'ja';

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
  { code: 'zh', label: '中文 (简体)', shortLabel: 'ZH', flagSymbol: '🇨🇳' },
  { code: 'ko', label: '한국어', shortLabel: 'KO', flagSymbol: '🇰🇷' },
  { code: 'ja', label: '日本語', shortLabel: 'JA', flagSymbol: '🇯🇵' },
];

export const translations: Record<LanguageCode, TranslationSchema> = {
  vi,
  en,
  fr,
  zh,
  ko,
  ja,
};

export { vi, en, fr, zh, ko, ja };
export type { TranslationSchema };
