/**
 * Facebook Pixel Integration
 * Implementación híbrida HTML + React para evitar doble inicialización
 */

let initialized = false;
let currentId = null;

/**
 * Inicializa el Facebook Pixel si no está ya inicializado
 * @param {string} pixelId - ID del pixel de Facebook
 * @param {string} locale - Locale para el script (default: 'en_US')
 */
export function initFacebookPixel(pixelId = '1248261610480852', locale = 'en_US') {
  // Prevención de doble inicialización
  if (window.__PIXEL_INIT_DONE && (currentId === pixelId || !currentId)) {
    initialized = true;
    currentId = pixelId;
    return; // ← Si ya está inicializado, no lo inicializa de nuevo
  }

  // Si ya está inicializado con otro ID, no hacer nada
  if (initialized && currentId !== pixelId) {
    console.warn(`Facebook Pixel ya inicializado con ID ${currentId}. No se puede cambiar a ${pixelId}`);
    return;
  }

  // Si fbq ya existe, solo inicializar si no se ha hecho antes
  if (typeof window.fbq === 'function') {
    if (!initialized) {
      window.fbq('init', pixelId);
      if (!window.__PIXEL_PAGEVIEW_SENT) {
        window.fbq('track', 'PageView');
        window.__PIXEL_PAGEVIEW_SENT = true;
      }
      initialized = true;
      currentId = pixelId;
      window.__PIXEL_INIT_DONE = true;
    }
    return;
  }

  // Si fbq no existe, cargar el script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://connect.facebook.net/${locale}/fbevents.js`;
  
  script.onload = () => {
    if (typeof window.fbq === 'function' && !initialized) {
      window.fbq('init', pixelId);
      if (!window.__PIXEL_PAGEVIEW_SENT) {
        window.fbq('track', 'PageView');
        window.__PIXEL_PAGEVIEW_SENT = true;
      }
      initialized = true;
      currentId = pixelId;
      window.__PIXEL_INIT_DONE = true;
    }
  };

  const firstScript = document.getElementsByTagName('script')[0];
  if (firstScript && firstScript.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript);
  } else {
    document.head.appendChild(script);
  }
}

/**
 * Trackea un evento personalizado en Facebook Pixel
 * @param {string} eventName - Nombre del evento
 * @param {object} eventData - Datos del evento (opcional)
 */
export function trackFacebookEvent(eventName, eventData = {}) {
  if (typeof window.fbq === 'function' && window.__PIXEL_INIT_DONE) {
    window.fbq('track', eventName, eventData);
  } else {
    console.warn('Facebook Pixel no está inicializado. No se puede trackear el evento:', eventName);
  }
}

