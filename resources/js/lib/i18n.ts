import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

type TranslationDictionary = Record<string, unknown>;

const NAMESPACE = 'translation';

const sanitize = (value?: TranslationDictionary): TranslationDictionary => {
  if (!value || typeof value !== 'object') {
    return {};
  }

  return value;
};

export const configureI18n = (
  locale: string,
  fallbackLocale: string,
  translations?: TranslationDictionary,
  fallbackTranslations?: TranslationDictionary,
) => {
  const primary = sanitize(translations);
  const fallback = sanitize(fallbackTranslations);

  if (!i18next.isInitialized) {
    i18next.use(initReactI18next).init({
      resources: {
        [fallbackLocale]: { [NAMESPACE]: fallback },
        [locale]: { [NAMESPACE]: primary },
      },
      lng: locale,
      fallbackLng: fallbackLocale,
      interpolation: {
        escapeValue: false,
      },
      defaultNS: NAMESPACE,
    });

    return;
  }

  if (fallbackLocale) {
    i18next.addResourceBundle(fallbackLocale, NAMESPACE, fallback, true, true);
  }

  if (locale) {
    i18next.addResourceBundle(locale, NAMESPACE, primary, true, true);
  }

  if (locale && i18next.language !== locale) {
    void i18next.changeLanguage(locale);
  }
};
