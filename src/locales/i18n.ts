import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import vi from './vi.json';
import en from './en.json';

// Cấu hình danh sách ngôn ngữ
const resources = {
  vi: { translation: vi },
  en: { translation: en },
};

// Lấy ngôn ngữ của hệ thống
const deviceLanguage = Localization.getLocales()[0].languageCode ?? 'vi';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: deviceLanguage === 'vi' ? 'vi' : 'vi', // Mặc định là vi cho dự án này
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
