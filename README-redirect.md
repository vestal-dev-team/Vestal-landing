# Vestal Landing - Funcionalidad de Redirección

## Descripción
Esta implementación añade una funcionalidad de redirección usando las funciones serverless de Vercel. Permite crear URLs del tipo `yourdomain.com/vest12345` que redirigen automáticamente a la aplicación Vestal usando custom URL schemes.

## Cómo funciona

### 1. Patrón de URL
- **Formato esperado**: `vest12345` (donde "vest" es fijo y seguido de exactamente 5 dígitos)
- **Ejemplos válidos**: `vest00001`, `vest12345`, `vest99999`
- **Ejemplos inválidos**: `vest123`, `vest123456`, `house12345`

### 2. Redirección
Cuando se accede a una URL como `yourdomain.com/vest12345`, la función serverless:
1. Valida que el formato sea correcto (vest + 5 dígitos)
2. Genera un custom URL scheme: `vestal://houseURL?vestalID=vest12345`
3. Redirige automáticamente a la aplicación Vestal
4. Muestra una página de fallback si la app no se abre automáticamente

## Archivos creados

### `/api/[id].js`
Función serverless de Vercel que maneja las redirecciones dinámicas.

### `/vercel.json`
Configuración de Vercel que define:
- Las reglas de rewrite para capturar URLs con patrón `vest12345`
- Configuración de las funciones serverless

### `/test-redirect.html`
Página de prueba local para validar el formato de IDs antes del despliegue.

## Instalación y Despliegue

### 1. Despliegue en Vercel
```bash
# Si ya tienes el proyecto conectado a Vercel
vercel --prod

# Si es la primera vez
vercel
```

### 2. Pruebas locales
```bash
# Instalar Vercel CLI si no lo tienes
npm i -g vercel

# Ejecutar en modo de desarrollo
vercel dev
```

### 3. Probar la funcionalidad
1. Abre `yourdomain.com/test-redirect.html` para probar formatos
2. Prueba URLs reales como `yourdomain.com/vest12345`

## Estructura de archivos después de la implementación
```
Vestal-landing/
├── api/
│   └── [id].js          # Función serverless para redirecciones
├── assets/
│   ├── android.svg
│   ├── apple.svg
│   └── happy.png
├── en/
│   ├── index.html
│   └── privacy.html
├── es/
│   ├── index.html
│   └── privacy.html
├── index.html
├── style.css
├── vercel.json          # Configuración de Vercel
└── test-redirect.html   # Página de pruebas
```

## Personalización

### Cambiar el patrón de URL
Para modificar el patrón (ej: cambiar "vest" por otro prefijo), edita:
1. El regex en `/api/[id].js`: `const vestPattern = /^vest\d{5}$/;`
2. El rewrite en `/vercel.json`: `"source": "/(vest\\d{5})"`

### Modificar el custom URL scheme
En `/api/[id].js`, cambia la línea:
```javascript
const customUrl = `vestal://houseURL?vestalID=${vestalId}`;
```

### Personalizar la página de fallback
El HTML de fallback está en `/api/[id].js` y puede modificarse para incluir más información o cambiar el diseño.

## Ejemplos de uso

### URLs que funcionarán:
- `https://tu-dominio.vercel.app/vest12345`
- `https://tu-dominio.vercel.app/vest00001`
- `https://tu-dominio.vercel.app/vest99999`

### Custom URLs generadas:
- `vestal://houseURL?vestalID=vest12345`
- `vestal://houseURL?vestalID=vest00001`
- `vestal://houseURL?vestalID=vest99999`

## Notas técnicas
- La función serverless tiene un timeout de 10 segundos
- Los errores 404 se devuelven para formatos inválidos
- La página de fallback incluye JavaScript para intentar abrir el custom scheme automáticamente
- Compatible con todos los navegadores modernos
