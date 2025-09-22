import React, { useEffect, useMemo, useRef, useState } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useTranslation } from 'react-i18next'
import './page.css'
import ExpectationCard from '../components/ExpectationCard'
// Make sure the file exists at the specified path, or update the path if needed
import CategorySelect from '../components/CategorySelect'
import { categoryKeyFromSlug, getPromptsForCategory } from '../utils'
import type { CategorySlug } from '../utils'
import raw from '../expectations.json'
import { toPng } from 'html-to-image'

type Dict = Record<string, { en?: string; es?: string }>
const allKeys = Object.keys(raw as Dict)

type TitleMode = 'preset' | 'custom'

const EditorPage: React.FC = () => {
  const { t, i18n } = useTranslation()
  const [lang, setLang] = useState<'es' | 'en'>((i18n.language as 'es' | 'en') || 'es')
  const [category, setCategory] = useState<CategorySlug>('lifestyle')
  const [titleMode, setTitleMode] = useState<TitleMode>('preset')

  // título (según modo)
  const presetOptions = useMemo(() => getPromptsForCategory(category, allKeys, t), [category, t])
  const [presetKey, setPresetKey] = useState<string | null>(null)
  const [customTitle, setCustomTitle] = useState<string>('')

  // contenido libre
  const [content, setContent] = useState<string>('')

  // elemento a exportar
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    AOS.init({ once: true, duration: 600, easing: 'ease-out-cubic' })
  }, [])

  // Cuando cambie el idioma
  const onSwitchLang = (l: 'es' | 'en') => {
    setLang(l)
    i18n.changeLanguage(l)
    localStorage.setItem('lang', l)
  }

  // Reset de opciones cuando cambia la categoría
  useEffect(() => {
    setPresetKey(presetOptions[0]?.key ?? null)
  }, [category]) // eslint-disable-line

  const resolvedTitle =
    titleMode === 'preset'
      ? (presetKey ? (t(presetKey) as string) : '')
      : customTitle

  const canDownload = titleMode === 'preset' 
    ? (presetKey && presetKey.trim().length > 0) // Para preset, solo necesita tener una opción seleccionada
    : (customTitle && customTitle.trim().length > 0) // Para custom, necesita que el título no esté vacío

  const downloadPng = async () => {
    if (!cardRef.current) return
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: 'transparent',
        width: cardRef.current.scrollWidth,
        height: cardRef.current.scrollHeight,
        skipFonts: false, // Usar fuentes locales
        filter: (node) => {
          // Filtrar solo enlaces externos que puedan causar problemas CORS
          if (node instanceof HTMLLinkElement && node.href.includes('fonts.googleapis.com')) {
            return false
          }
          return true
        }
      })
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = 'expectation.png'
      a.click()
    } catch (e) {
      console.error('PNG export error:', e)
      alert(lang === 'es' 
        ? 'No he podido generar la imagen. Inténtalo de nuevo.' 
        : 'Could not generate the image. Please try again.')
    }
  }

  return (
    <div className="container">
      <header className="site-header" data-aos="fade-down">
        <img src="/editor/images/vestal-happy.png" alt="Vestal" className="logo" />
        <h1>Vestal Editor</h1>

        <nav className="lang-switch" aria-label="Language switch" data-aos="fade-down" data-aos-delay="100">
          <button
            className={lang === 'es' ? 'active' : ''}
            onClick={() => onSwitchLang('es')}
          >
            Español
          </button>
          <span> | </span>
          <button
            className={lang === 'en' ? 'active' : ''}
            onClick={() => onSwitchLang('en')}
          >
            English
          </button>
        </nav>
      </header>

      <main>
        <p className="subtitle" data-aos="fade-up">
          {lang === 'es'
            ? 'Elige tu expectation favorita, personalízala y compártela en TikTok o Instagram ✨'
            : 'Pick your favorite expectation, customize it, and share on TikTok or Instagram ✨'}
        </p>

        {/* Selector de categoría */}
        <section className="panel" data-aos="fade-up" data-aos-delay="100">
          <label className="label">{lang === 'es' ? 'Categoría' : 'Category'}</label>
          <CategorySelect value={category} onChange={setCategory} />
        </section>

        {/* Selector de título */}
        <section className="panel" data-aos="fade-up" data-aos-delay="150">
          <label className="label">{lang === 'es' ? 'Título' : 'Title'}</label>

          <div className="title-modes">
            <label className="radio">
              <input
                type="radio"
                name="titleMode"
                value="preset"
                checked={titleMode === 'preset'}
                onChange={() => setTitleMode('preset')}
              />
              <span className="radio-custom"></span>
              <span>{lang === 'es' ? 'Predeterminadas' : 'Preset'}</span>
            </label>

            <label className="radio">
              <input
                type="radio"
                name="titleMode"
                value="custom"
                checked={titleMode === 'custom'}
                onChange={() => setTitleMode('custom')}
              />
              <span className="radio-custom"></span>
              <span>{lang === 'es' ? 'Personalizada' : 'Custom'}</span>
            </label>
          </div>

          {titleMode === 'preset' ? (
            <select
              className="input"
              value={presetKey ?? ''}
              onChange={(e) => setPresetKey(e.target.value)}
            >
              {presetOptions.map(({ key, label }) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          ) : (
            <input
              className="input"
              type="text"
              placeholder={lang === 'es' ? 'Escribe tu título…' : 'Write your title…'}
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
            />
          )}
        </section>

        {/* Contenido libre */}
        <section className="panel" data-aos="fade-up" data-aos-delay="200">
          <label className="label">{lang === 'es' ? 'Contenido' : 'Content'}</label>
          <textarea
            className="textarea"
            placeholder={
              lang === 'es'
                ? 'Escribe el contenido que quieras…'
                : 'Write whatever you want…'
            }
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
          />
        </section>

        {/* Preview + Descargar */}
        <section className="preview" data-aos="fade-up" data-aos-delay="250">
          <div ref={cardRef}>
            <ExpectationCard
              category={category}
              title={resolvedTitle || (t(categoryKeyFromSlug(category)) as string)}
              content={content || (lang === 'es' ? '' : '')}
            />
          </div>

          <button
            className="primary"
            onClick={downloadPng}
            disabled={!canDownload}
            title={!canDownload ? (lang === 'es' ? 'Completa el título' : 'Fill in the title') : undefined}
          >
            {lang === 'es' ? 'Descargar como PNG' : 'Download as PNG'}
          </button>
        </section>
      </main>

      <footer>
        <p>&copy; 2025 Vestal</p>
      </footer>
    </div>
  )
}

export default EditorPage
