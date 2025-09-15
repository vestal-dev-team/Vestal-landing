import React from 'react'
import type { CategorySlug } from '../utils'
import { CATEGORY_SLUGS, categoryKeyFromSlug, resolveIconPath } from '../utils'
import { useTranslation } from 'react-i18next'
import './select.css'

type Props = {
  value: CategorySlug
  onChange: (slug: CategorySlug) => void
}

const CategorySelect: React.FC<Props> = ({ value, onChange }) => {
  const { t } = useTranslation()

  return (
    <div className="category-radio-group" data-aos="fade-up">
      {CATEGORY_SLUGS.map((slug) => (
        <label key={slug} className="category-radio">
          <input
            type="radio"
            name="category"
            value={slug}
            checked={slug === value}
            onChange={() => onChange(slug)}
          />
          <span className="radio-custom"></span>
          <img src={resolveIconPath(slug)} alt="" aria-hidden className="category-icon" />
          <span className="category-label">{t(categoryKeyFromSlug(slug))}</span>
        </label>
      ))}
    </div>
  )
}

export default CategorySelect
