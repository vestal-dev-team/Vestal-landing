// /api/vest/[id].js
// Serverless de Vercel (JavaScript) para manejar deep links vest12345
// - Desktop: muestra página informativa con enlaces a App Store / Play Store
// - Móvil: intenta abrir la app; si no está instalada, fallback automático a la tienda
// - Deep link "router-first": vestal://router?target=house&code=vest12345

export default function handler(req, res) {
  const { id } = req.query || {};
  const ua = String(req.headers['user-agent'] || '').toLowerCase();

  // Sustituye por tus IDs reales:
  const IOS_APP_ID = '1234567890';         // id numérico de App Store: itms-apps://apps.apple.com/app/idXXXX
  const ANDROID_PACKAGE = 'com.vestal.app';// package name Android

  // 1) Validación del ID
  const vestPattern = /^vest\d{5}$/;
  if (!id || !vestPattern.test(id)) {
    return res.status(404).json({
      error: 'Invalid ID format. Expected format: vest12345 (vest + 5 digits)',
    });
  }

  const code = id;
  const deepLink = `vestal://router?target=house&code=${encodeURIComponent(code)}`;

  const isAndroid = /android/.test(ua);
  const isIOS = /iphone|ipad|ipod/.test(ua);
  const isMobile = isAndroid || isIOS;

  const appStoreURL = `https://apps.apple.com/es/app/marca-diario-deportivo/id312407627`;
  const playStoreURL = `https://play.google.com/store/apps/details?id=com.iphonedroid.marca`;

  // Intent URL específico de Android/Chrome con fallback nativo a Play Store
  const intentURL =
    `intent://router?target=house&code=${encodeURIComponent(code)}` +
    `#Intent;scheme=vestal;package=${ANDROID_PACKAGE};` +
    `S.browser_fallback_url=${encodeURIComponent(playStoreURL)};end`;

  // 2) Desktop → HTML informativo
  if (!isMobile) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(desktopPage({ code, appStoreURL, playStoreURL }));
  }

  // 3) Móvil → Intentar abrir app y fallback a tienda
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res
    .status(200)
    .send(
      mobileOpenPage({
        code,
        deepLink,
        isIOS,
        isAndroid,
        appStoreURL,
        playStoreURL,
        intentURL,
      })
    );
}

function desktopPage({ code, appStoreURL, playStoreURL }) {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Vestal — Enlace para móviles</title>
<style>
  body{background:#F8F5EE;color:#4C2818;font-family:Arial,sans-serif;padding:40px 16px}
  .box{max-width:560px;margin:0 auto;background:#fff;padding:24px;border-radius:12px;box-shadow:0 2px 12px rgba(0,0,0,.08);text-align:center}
  .btn{display:inline-block;margin:8px 6px;padding:12px 18px;border-radius:8px;text-decoration:none;color:#fff}
  .btn-ios{background:#0D96F6}
  .btn-android{background:#3DDC84;color:#113}
  .muted{opacity:.75}
  code{background:#f5f5f5;padding:2px 6px;border-radius:4px}
</style>
</head>
<body>
  <div class="box">
    <h1>Vestal es una app móvil</h1>
    <p class="muted">Para abrir este enlace necesitas la app instalada en tu teléfono.</p>
    <p>Enlace solicitado: <code>${code}</code></p>
    <p>
      <a class="btn btn-ios" href="${appStoreURL}">Descargar para iOS</a>
      <a class="btn btn-android" href="${playStoreURL}">Descargar para Android</a>
    </p>
  </div>
</body>
</html>
  `;
}

function mobileOpenPage({ code, deepLink, isIOS, isAndroid, appStoreURL, playStoreURL, intentURL }) {
  const storeURL = isIOS ? appStoreURL : playStoreURL;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Vestal — Abriendo…</title>
<style>
  body{background:#F8F5EE;color:#4C2818;font-family:Arial,sans-serif;padding:40px 16px}
  .box{max-width:560px;margin:0 auto;background:#fff;padding:24px;border-radius:12px;box-shadow:0 2px 12px rgba(0,0,0,.08);text-align:center}
  .btn{display:inline-block;margin:8px 6px;padding:12px 18px;border-radius:8px;text-decoration:none;color:#fff;background:#4C2818}
  .muted{opacity:.75}
  code{background:#f5f5f5;padding:2px 6px;border-radius:4px}
</style>
</head>
<body>
  <div class="box">
    <h1>Abriendo Vestal…</h1>
    <p>Enlace: <code>${code}</code></p>
    <p class="muted">Si no se abre la app automáticamente, pulsa el botón.</p>
    <p><a class="btn" id="openBtn" href="${deepLink}">Abrir en la app</a></p>
    <p><a class="btn" id="storeBtn" href="${storeURL}">Ir a la tienda</a></p>
  </div>

  <script>
    (function() {
      var hidden = false;
      var deepLink = ${JSON.stringify(deepLink)};
      var storeURL = ${JSON.stringify(storeURL)};
      var isAndroid = ${JSON.stringify(isAndroid)};
      var intentURL = ${JSON.stringify(intentURL)};

      function onHidden(){ hidden = true; }
      document.addEventListener('visibilitychange', function(){ if (document.hidden) onHidden(); });
      window.addEventListener('pagehide', onHidden);
      window.addEventListener('blur', onHidden);

      function tryOpen() {
        if (isAndroid && intentURL) {
          // Chrome en Android maneja mejor intent:// con fallback nativo
          window.location.href = intentURL;
        } else {
          window.location.href = deepLink;
        }
      }

      // Intento inmediato
      tryOpen();

      // Fallback a tienda si no “salimos” en ~1s
      setTimeout(function() {
        if (!hidden) window.location.href = storeURL;
      }, 1000);

      // Botón manual
      document.getElementById('openBtn').addEventListener('click', function(e) {
        e.preventDefault();
        tryOpen();
        setTimeout(function(){ if (!hidden) window.location.href = storeURL; }, 1000);
      });
      // Botón tienda: no bloqueamos, deja navegar
    })();
  </script>
</body>
</html>
  `;
}
