// ExpectationCard.tsx
import React from 'react';

type Props = {
  /** slug/categoría que usas para resolver el icono */
  category: string;
  /** título ya resuelto (antes venía de t(exp.key)) */
  title: string;
  /** texto de contenido */
  content: string;
  /** opcional: si quieres cambiar cómo se resuelve la ruta del icono */
  resolveIconPath?: (category: string) => string;
};

/** Placeholder: ajusta a tu estructura real de assets */
const defaultResolveIconPath = (category: string) =>
  `/editor/images/expectations/${category}.png`;

const styles = {
  wrap: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  } as React.CSSProperties,

  // 1) Caja: ancho responsive como en RN
  box: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: '10px 16px',
    width: '100%',
    maxWidth: 400,        // tu límite opcional para desktop
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'transparent',
    position: 'relative' as const,
    boxShadow:
      '0px 1px 2px rgba(20,20,29,0.04), 0px 8px 24px rgba(20,20,29,0.06)',
  },

  // 2) Fila: alineado como RN
  row: {
    display: 'flex',
    alignItems: 'center',
    columnGap: 10,
  },

  categoryIconLarge: {
    width: 26,
    height: 26,
    objectFit: 'contain' as const,
    flexShrink: 0,
  },

  // 3) Título: **multilínea** (wrap) si supera el ancho
  title: {
    fontSize: 12,
    color: '#8D6E53',
    fontFamily: 'Cardo-Regular, Cardo, serif',
    margin: 0,
    marginBottom: 4,
    lineHeight: '16px',
    // Cambios clave para multilínea:
    whiteSpace: 'normal' as const,     // permite salto de línea
    overflow: 'visible' as const,      // no recorta
    textOverflow: 'clip' as const,     // sin elipsis
    wordWrap: 'break-word' as const,
    overflowWrap: 'break-word' as const,
  },

  // 4) Contenido: asegurar “Medium”
  content: {
    fontSize: 17,
    fontFamily: 'Roboto, system-ui, -apple-system, Segoe UI, Arial, sans-serif',
    fontWeight: 500,          // asegura el peso Medium
    color: '#14141D',
    lineHeight: '22px',
    margin: 0,
    wordWrap: 'break-word' as const,
    overflowWrap: 'break-word' as const,
  },

  textColumn: {
    flex: 1,
    minWidth: 0,
  } as React.CSSProperties,
};

const ExpectationCard: React.FC<Props> = ({
  category,
  title,
  content,
  resolveIconPath = defaultResolveIconPath,
}) => {
  const iconSrc = resolveIconPath(category);

  return (
    <div style={styles.wrap}>
      <div style={styles.box}>
        <div style={styles.row}>
          {/* Icono de categoría */}
          <img
            src={iconSrc}
            alt={category}
            style={styles.categoryIconLarge}
          />

          {/* Textos */}
          <div style={styles.textColumn}>
            <h3 title={title} style={styles.title}>{title}</h3>
            <p style={styles.content}>{content}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpectationCard;
