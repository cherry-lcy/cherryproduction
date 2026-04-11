import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enJSON from './en.json';
import zhCNJSON from './zh-CN.json';
import zhHKJSON from './zh-HK.json';

const resources = {
  en: { translation: enJSON },
  'zh-CN': { translation: zhCNJSON },
  'zh-HK': { translation: zhHKJSON }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
      supportedLngs: ['en', 'zh-CN', 'zh-HK'],
    },
  });

export default i18n;