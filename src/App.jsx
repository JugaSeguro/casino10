/**
 * Componente principal de la aplicación
 * Gestiona la estructura principal y los estilos globales
 */

import React from 'react';
import './styles/main.css';
import { useGlobalLinks } from './hooks/useGlobalLinks';

function App() {
  const { links, loading, error } = useGlobalLinks();

  // Mostrar loading mientras se cargan los enlaces
  if (loading) {
    return (
      <main className="main-content">
        <div className="loading-container">
          <p>Cargando...</p>
        </div>
      </main>
    );
  }

  return (
    <>
      {/* Fondo animado */}
      <div className="background-container">
        <div className="scrolling-background"></div>
        <div className="dark-overlay"></div>
      </div>
      
      <main className="main-content">
        <div className="logo-container">
          <img src="/img/logo-new.webp" alt="Picante Sports Logo" className="site-logo" width="850" height="810" />
        </div>
        
        <div className="bonus-title">
          <h1>{links.register_title}</h1>
        </div>
        
        <div className="promo-text">
          <p>Crea tu cuenta rápido y seguro ✨</p>
          <p>Regístrate totalmente gratis en la plataforma más segura de Argentina. Contamos con más de 12000 Slots, la mejor deportiva y el mejor casino en vivo.</p>
          <p>✅ ¡Nosotros no tenemos límites de apuestas!</p>
          <p>✅ ¡Retira sin límite!</p>
          <button id="bonus-button" className="bonus-highlight bonus-button" onClick={() => window.open(links.whatsapp_link, '_blank')}>
            🔥 ¡OBTENÉ   TU   <span className="bonus-amount">MEGABONUS</span>   CON TU PRIMER RECARGA! 🔥
          </button>
          <p className="telegram-promo" onClick={() => window.open(links.whatsapp_link, '_blank')}>
            💬 CONTACTANOS POR WHATSAPP Y GANÁ PREMIOS DIARIOS 💬
          </p>
        </div>
        
        <div className="register-cta">
          <button id="register-button" className="register-button" onClick={() => window.open(links.whatsapp_link, '_blank')}>¡REGISTRATE AHORA!</button>
          <button id="access-button" className="chat-button access-button" onClick={() => window.open('https://24envivo.com', '_blank')}>
            🎯 ACCEDER A 24ENVIVO.COM 🎯
          </button>
          <button id="chat-button" className="chat-button" onClick={() => window.open(links.whatsapp_link, '_blank')}>
            <i className="chat-icon"></i>
            <span>Chatear con nosotros</span>
          </button>
        </div>
      </main>
    </>
  );
}

export default App;

