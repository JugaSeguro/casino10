/**
 * Componente principal de la aplicación
 * Gestiona la estructura principal y los estilos globales
 */

import React, { useEffect, useState } from 'react';
import './styles/main.css';
import './styles/popup.css';
import { useLandingPhone } from '@shared/useLandingPhone';
import { initFacebookPixel } from './lib/facebookPixel';



function App() {
  const { phoneData, loading, error } = useLandingPhone();

  // Inicialización del Facebook Pixel (verificación y tracking)
  useEffect(() => {
    initFacebookPixel('1248261610480852', 'en_US');
  }, []);

  // Efectos al cargar el componente
  useEffect(() => {
    // Comprobar si el webcomponent está correctamente cargado
    const webComponent = document.getElementById('lux-register');
    if (webComponent) {
      console.log('✅ Webcomponent detectado desde React');
    } else {
      console.error('❌ Webcomponent no encontrado en el DOM');
    }
    
    // Función para manejo alternativo del botón de registro
    const handleRegisterButtonClick = () => {
      const webComponent = document.getElementById('lux-register');
      if (webComponent) {
        console.log('🚀 Activando webcomponent desde evento delegado en React');
        webComponent.click();
      }
    };
    
    // Delegación de eventos para mayor compatibilidad
    document.addEventListener('click', (event) => {
      if (event.target.id === 'register-button' || 
          event.target.closest('#register-button')) {
        handleRegisterButtonClick();
      }
    });
    
    // Limpieza al desmontar
    return () => {
      document.removeEventListener('click', handleRegisterButtonClick);
    };
  }, []);

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
          <h1>{phoneData.title}</h1>
        </div>
        
        <div className="registration-options">
          <h2 className="options-title">¡Elige tu forma de registro!</h2>
            
            <div className="registration-buttons">
              <div className="registration-option telegram-option" onClick={() => {
                window.open(phoneData.telegram_link, '_blank');
              }}>
                <div className="option-icon">📱</div>
                <h3>Telegram VIP</h3>
                <p>✨ MÁXIMOS BENEFICIOS ✨</p>
                <ul>
                  <li>🎁 Bonos exclusivos</li>
                  <li>🚀 Promociones VIP</li>
                  <li>⚡ Soporte prioritario</li>
                  <li>💎 Torneos especiales</li>
                </ul>
                <button className="option-button telegram-btn">Registrarme VIP</button>
              </div>
              
              <div className="registration-option whatsapp-option" onClick={() => {
                window.open(phoneData.whatsapp_link, '_blank');
              }}>
                <div className="option-icon">💬</div>
                <h3>WhatsApp</h3>
                <p>Registro súper rápido</p>
                <ul>
                  <li>📞 Atención personal</li>
                  <li>💰 Bono bienvenida</li>
                  <li>🎯 Soporte directo</li>
                  <li>🔥 Registro express</li>
                </ul>
                <button className="option-button whatsapp-btn">Registrarme Ahora</button>
              </div>
            </div>
          </div>
          
          <div className="promo-text">
            <p>Crea tu cuenta rápido y seguro ✨</p>
            <p>Registráte gratis ahora en 24envivo.com. Te doblamos tu primera carga automáticamente hasta $100.000. ¡Por tiempo limitado! ¡No te lo pierdas!</p>
            <p>✅ ¡Nosotros no tenemos límites de apuestas!</p>
           
          </div>

      </main>
    </>
  );
}

export default App;

