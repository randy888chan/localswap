import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';

export async function initI18n(lang: string = 'en') {
  const i18n = createInstance();
  
  return i18n
    .use(initReactI18next)
    .use(resourcesToBackend(async (locale: string) => {
      return (await import(`../public/locales/${locale}/common.json`)).default;
    }))
    .init({
      lng: lang,
      fallbackLng: 'en',
      interpolation: { escapeValue: false }
    });
}

export async function translateText(
  text: string, 
  targetLang: string,
  api: any // Cloudflare AI instance
) {
  const cached = await TRANSLATION_CACHE.get(`${text}-${targetLang}`);
  if (cached) return cached;

  const translated = await api.run('@cf/meta/m2m100-1.2b', {
    text,
    target_lang: targetLang,
    source_lang: navigator.language.split('-')[0] || 'en'
  });

  await TRANSLATION_CACHE.put(`${text}-${targetLang}`, translated);
  return translated;
}
