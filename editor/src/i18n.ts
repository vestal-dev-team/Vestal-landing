import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import raw from './expectations.json'

// Construimos resources { en: {translation:{}}, es: {translation:{}} }
type Dict = Record<string, { en?: string; es?: string }>
const data = raw as Dict

const resources = {
  en: { translation: {} as Record<string, string> },
  es: { translation: {} as Record<string, string> },
}

Object.entries(data).forEach(([k, v]) => {
  if (v.en) resources.en.translation[k] = v.en
  if (v.es) resources.es.translation[k] = v.es
})

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: (localStorage.getItem('lang') as 'es' | 'en') || 'es',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    returnNull: false,
  })

export default i18n
