/**
 * This code snippet exports translations from two different locales (en and de) stored in separate JSON files.
 * It also exports the defaultLocale as 'en'.
 */
import en from '@/locales/en.json';
import de from '@/locales/de.json';

export const translations = {
    de,
    en,
};

export const defaultLocale = 'en';
