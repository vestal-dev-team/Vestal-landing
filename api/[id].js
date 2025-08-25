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
  const vestPattern = /^\d{5}$/;
  if (!id || !vestPattern.test(id)) {
    return res.status(404).json({
      error: 'Invalid ID format. Expected format: vest12345 (vest + 5 digits)',
    });
  }

  const code = `vest${id}`;
  const deepLink = `vestal://vest/${encodeURIComponent(code)}`;

  const isAndroid = /android/.test(ua);
  const isIOS = /iphone|ipad|ipod/.test(ua);
  const isMobile = isAndroid || isIOS;

  const appStoreURL = `https://apps.apple.com/es/app/marca-diario-deportivo/id312407627`;
  const playStoreURL = `https://play.google.com/store/apps/details?id=com.iphonedroid.marca`;

  // Intent URL específico de Android/Chrome con fallback nativo a Play Store
  const intentURL =
    `vestal://vest/${encodeURIComponent(code)}` +
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
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Vestal — Access Code ${code}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { 
    background: linear-gradient(135deg, #F8F5EE 0%, #F0EBD8 100%);
    color: #4C2818;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  .container {
    max-width: 480px;
    width: 100%;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    padding: 40px 32px;
    text-align: center;
    box-shadow: 0 20px 40px rgba(76, 40, 24, 0.08);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  .logo {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #4C2818 0%, #8B4513 100%);
    border-radius: 20px;
    margin: 0 auto 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 24px;
    letter-spacing: -0.5px;
  }
  h1 {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 12px;
    background: linear-gradient(135deg, #4C2818 0%, #8B4513 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .subtitle {
    font-size: 16px;
    color: #8B5A3C;
    margin-bottom: 32px;
    line-height: 1.5;
  }
  .code-display {
    background: linear-gradient(135deg, #4C2818 0%, #6B3A1A 100%);
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 2px;
    margin: 24px 0 32px;
    box-shadow: 0 8px 16px rgba(76, 40, 24, 0.2);
  }
  .description {
    font-size: 15px;
    color: #8B5A3C;
    margin-bottom: 32px;
    line-height: 1.6;
  }
  .download-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 32px;
  }
  .download-text {
    font-size: 14px;
    color: #A0785A;
    margin-bottom: 8px;
    font-weight: 500;
  }
  .store-buttons {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
  }
  .store-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 20px;
    border-radius: 12px;
    text-decoration: none;
    font-weight: 600;
    font-size: 14px;
    transition: all 0.3s ease;
    min-width: 140px;
    justify-content: center;
  }
  .store-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }
  .btn-ios {
    background: linear-gradient(135deg, #007AFF 0%, #0056CC 100%);
    color: white;
  }
  .btn-android {
    background: linear-gradient(135deg, #34A853 0%, #0F9D58 100%);
    color: white;
  }
  .icon {
    width: 18px;
    height: 18px;
  }
  .footer-note {
    margin-top: 24px;
    font-size: 13px;
    color: #A0785A;
    line-height: 1.4;
  }
  @media (max-width: 480px) {
    .container { padding: 32px 24px; }
    h1 { font-size: 24px; }
    .store-buttons { flex-direction: column; }
    .store-btn { width: 100%; }
  }
</style>
</head>
<body>
  <div class="container">
    <div class="logo">V</div>
    <h1>You've got a Vestal code!</h1>
    <p class="subtitle">This link is designed to open in the Vestal mobile app</p>
    
    <div class="code-display">${code}</div>
    
    <p class="description">
      To access the content associated with this code, you need to have the Vestal app installed on your mobile device.
    </p>
    
    <div class="download-section">
      <p class="download-text">Download the app and access your content:</p>
      <div class="store-buttons">
        <a class="store-btn btn-ios" href="${appStoreURL}">
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
          App Store
        </a>
        <a class="store-btn btn-android" href="${playStoreURL}">
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
          </svg>
          Play Store
        </a>
      </div>
    </div>
    
    <p class="footer-note">
      Once the app is installed, you'll be able to open this link directly from your mobile to access the content.
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
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Vestal — Opening…</title>
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
    <h1>Opening Vestal…</h1>
    <p>Link: <code>${code}</code></p>
    <p class="muted">If the app doesn't open automatically, tap the button.</p>
    <p><a class="btn" id="openBtn" href="${deepLink}">Open in app</a></p>
    <p><a class="btn" id="storeBtn" href="${storeURL}">Go to store</a></p>
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

      // Fallback a tienda si no "salimos" en ~1s
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

