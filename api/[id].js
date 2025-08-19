// Función serverless de Vercel para manejar redirecciones con patrón vest12345
export default function handler(req, res) {
  const { id } = req.query;
  
  // Verificar que el ID sigue el patrón vest + 5 dígitos
  const vestPattern = /^vest\d{5}$/;
  
  if (!vestPattern.test(id)) {
    // Si no coincide con el patrón, devolver error 404
    return res.status(404).json({ 
      error: 'Invalid ID format. Expected format: vest12345 (vest + 5 digits)' 
    });
  }
  
  // Extraer el número de 5 cifras
  const vestalId = id; // Mantenemos el ID completo (vest12345)
  
  // Crear el custom URL scheme
  const customUrl = `vestal://houseURL?vestalID=${vestalId}`;
  
  // Configurar headers para la redirección
  res.setHeader('Location', customUrl);
  res.status(302);
  
  // También enviar una respuesta HTML para navegadores que no soporten el custom scheme
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Vestal - Redirección</title>
      <style>
        body {
          background-color: #F8F5EE;
          color: #4C2818;
          font-family: Arial, sans-serif;
          text-align: center;
          padding: 50px 20px;
        }
        .container {
          max-width: 500px;
          margin: 0 auto;
        }
        .logo {
          width: 80px;
          height: 80px;
          margin-bottom: 20px;
        }
        .redirect-info {
          background: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          margin-bottom: 20px;
        }
        .custom-url {
          background: #f5f5f5;
          padding: 10px;
          border-radius: 5px;
          font-family: monospace;
          word-break: break-all;
          margin: 10px 0;
        }
        .open-app-btn {
          background: #4C2818;
          color: white;
          padding: 15px 30px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          text-decoration: none;
          display: inline-block;
          margin: 10px;
        }
        .open-app-btn:hover {
          background: #3a1e12;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <img src="/assets/happy.png" alt="Vestal Logo" class="logo" />
        <h1>Vestal</h1>
        
        <div class="redirect-info">
          <h2>Abriendo la aplicación Vestal...</h2>
          <p>ID detectado: <strong>${vestalId}</strong></p>
          <p>Redirigiendo a:</p>
          <div class="custom-url">${customUrl}</div>
        </div>
        
        <a href="${customUrl}" class="open-app-btn">Abrir en la App Vestal</a>
        
        <p><small>
          Si la aplicación no se abre automáticamente, asegúrate de tener la app Vestal instalada
          y haz clic en el botón "Abrir en la App Vestal".
        </small></p>
      </div>
      
      <script>
        // Intentar abrir el custom URL scheme automáticamente
        setTimeout(function() {
          window.location.href = '${customUrl}';
        }, 1000);
        
        // Fallback: si después de 3 segundos no se ha redirigido, mostrar mensaje
        setTimeout(function() {
          const fallbackMsg = document.createElement('p');
          fallbackMsg.innerHTML = '<strong>¿No se abrió la aplicación?</strong><br>Haz clic en el botón de arriba para intentar de nuevo.';
          fallbackMsg.style.color = '#666';
          fallbackMsg.style.marginTop = '20px';
          document.querySelector('.container').appendChild(fallbackMsg);
        }, 3000);
      </script>
    </body>
    </html>
  `;
  
  res.send(html);
}
