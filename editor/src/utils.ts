import type { TFunction } from 'i18next'

// Slugs de categorías (orden de despliegue)
export const CATEGORY_SLUGS = [
  'lifestyle',
  'sharedSpace',
  'socialLife',
  'cleanliness',
  'values',
  'expenses',
] as const
export type CategorySlug = typeof CATEGORY_SLUGS[number]

// Convierte "expectations.category.lifestyle" → "lifestyle"
export const slugFromCategoryKey = (key: string) => key.split('.').pop() as CategorySlug

// Key i18n de nombre de categoría desde slug
export const categoryKeyFromSlug = (slug: CategorySlug) => `expectations.category.${slug}`

// Ruta del icono (placeholder). Pon tus assets en public/images/expectations/*.png
export const resolveIconPath = (slug: CategorySlug) => `/editor/images/expectations/${slug}.png`

// Dado un i18n t() y el diccionario plano, devuelve prompts por categoría
export const getPromptsForCategory = (slug: CategorySlug, allKeys: string[], t: TFunction) => {
  const prefix = `expectations.${slug}_`
  return allKeys
    .filter((k) => k.startsWith(prefix))
    .map((k) => ({ key: k, label: t(k) as string }))
    .sort((a, b) => a.key.localeCompare(b.key))
}
