# ChatWidget - Documentación de Integración

## Descripción

El ChatWidget ha sido integrado con funcionalidades avanzadas para proporcionar una experiencia de chat completa y personalizable para los usuarios de Picante Sports.

## Funcionalidades Integradas

### 1. Configuración Avanzada

El ChatWidget ahora incluye una configuración completa con las siguientes opciones:

#### Configuración Básica
- `supabaseUrl`: URL de la base de datos Supabase
- `supabaseKey`: Clave de autenticación de Supabase
- `position`: Posición del widget ("bottom-right", "bottom-left", "top-right", "top-left")
- `theme`: Tema del widget ("light", "dark")

#### Personalización de Mensajes
- `welcomeMessage`: Mensaje de bienvenida personalizado
- `placeholderText`: Texto del placeholder del campo de entrada
- `sendButtonText`: Texto del botón de envío

#### Personalización de Colores
- `primaryColor`: Color principal del widget (#ffc107)
- `secondaryColor`: Color secundario (#000000)
- `textColor`: Color del texto (#ffffff)

#### Configuración de Notificaciones
- `enableNotifications`: Habilitar notificaciones del navegador
- `notificationSound`: Reproducir sonido en notificaciones
- `notificationTitle`: Título de las notificaciones

#### Horarios de Atención
- `businessHours.enabled`: Habilitar horarios de atención
- `businessHours.timezone`: Zona horaria
- `businessHours.schedule`: Horarios por día de la semana
- `businessHours.offlineMessage`: Mensaje fuera de horario

#### Configuración de Idioma
- `language`: Idioma del widget ("es" para español)

#### Persistencia y Sesión
- `persistChat`: Mantener historial del chat
- `sessionTimeout`: Tiempo de sesión en minutos

#### Analytics y Seguridad
- `enableAnalytics`: Habilitar análisis de uso
- `trackEvents`: Rastrear eventos del chat
- `enableEncryption`: Habilitar encriptación de mensajes
- `dataRetention`: Retención de datos en días

### 2. Event Listeners

El ChatWidget emite eventos personalizados que puedes escuchar:

```javascript
// Chat abierto
window.addEventListener('chatwidget:open', () => {
  console.log('Chat abierto');
});

// Chat cerrado
window.addEventListener('chatwidget:close', () => {
  console.log('Chat cerrado');
});

// Nuevo mensaje recibido
window.addEventListener('chatwidget:message', (event) => {
  console.log('Nuevo mensaje:', event.detail);
});

// Mensaje enviado
window.addEventListener('chatwidget:send', (event) => {
  console.log('Mensaje enviado:', event.detail);
});

// Cambio en estado de conexión
window.addEventListener('chatwidget:connection', (event) => {
  console.log('Estado de conexión:', event.detail);
});

// Error en el chat
window.addEventListener('chatwidget:error', (event) => {
  console.error('Error:', event.detail);
});
```

### 3. API Global

El ChatWidget expone una API global para control programático:

```javascript
// Abrir el chat
window.chatWidgetAPI.open();

// Cerrar el chat
window.chatWidgetAPI.close();

// Enviar mensaje programáticamente
window.chatWidgetAPI.sendMessage('Hola, necesito ayuda');

// Obtener estado del chat
const state = window.chatWidgetAPI.getState();

// Limpiar historial del chat
window.chatWidgetAPI.clearChat();

// Actualizar configuración
window.chatWidgetAPI.updateConfig({
  welcomeMessage: 'Nuevo mensaje de bienvenida'
});

// Verificar si el chat está abierto
const isOpen = window.chatWidgetAPI.isOpen();

// Obtener número de mensajes no leídos
const unreadCount = window.chatWidgetAPI.unreadCount();
```

### 4. Estados del Componente

El componente mantiene estados internos:

- `isInitialized`: Indica si el ChatWidget se ha inicializado
- `isOpen`: Indica si el chat está abierto
- `unreadCount`: Número de mensajes no leídos

### 5. Configuración de Horarios

El ChatWidget incluye configuración automática de horarios de atención:

```javascript
businessHours: {
  enabled: true,
  timezone: "America/Argentina/Buenos_Aires",
  schedule: {
    monday: { start: "09:00", end: "18:00" },
    tuesday: { start: "09:00", end: "18:00" },
    wednesday: { start: "09:00", end: "18:00" },
    thursday: { start: "09:00", end: "18:00" },
    friday: { start: "09:00", end: "18:00" },
    saturday: { start: "10:00", end: "16:00" },
    sunday: { start: "10:00", end: "16:00" }
  },
  offlineMessage: "Estamos fuera de horario. Te responderemos pronto."
}
```

### 6. Notificaciones del Navegador

El ChatWidget solicita automáticamente permisos para notificaciones del navegador y las muestra cuando llegan nuevos mensajes.

### 7. Accesibilidad

Incluye soporte para lectores de pantalla y navegación por teclado.

## Uso Básico

```jsx
import ChatWidget from './components/ChatWidget';

function App() {
  return (
    <div>
      <h1>Picante Sports</h1>
      <ChatWidget />
    </div>
  );
}
```

## Personalización

Para personalizar el ChatWidget, modifica la configuración en el archivo `ChatWidget.jsx`:

```javascript
const chatConfig = {
  // Tu configuración personalizada aquí
  welcomeMessage: "¡Bienvenido a Picante Sports!",
  primaryColor: "#tu-color",
  // ... más opciones
};
```

## Integración con el Botón de Registro

El ChatWidget puede integrarse con el botón de registro para proporcionar asistencia:

```javascript
// En el botón de registro
document.getElementById('register-button').addEventListener('click', () => {
  // Abrir el formulario de registro
  // ...
  
  // Opcionalmente, abrir el chat para asistencia
  if (window.chatWidgetAPI) {
    window.chatWidgetAPI.sendMessage('Usuario inició proceso de registro');
  }
});
```

## Manejo de Errores

El ChatWidget incluye manejo robusto de errores:

- Errores de carga del script
- Errores de inicialización
- Errores de conexión
- Errores de configuración

Todos los errores se registran en la consola para facilitar el debugging.

## Compatibilidad

- Navegadores modernos (Chrome, Firefox, Safari, Edge)
- Soporte para dispositivos móviles
- Soporte para lectores de pantalla
- Navegación por teclado

## Rendimiento

- Carga asíncrona del script
- Limpieza automática de recursos
- Optimización de re-renders
- Gestión eficiente de memoria

## Seguridad

- Encriptación de mensajes
- Validación de entrada
- Sanitización de datos
- Retención configurable de datos

## Soporte

Para soporte técnico o preguntas sobre la integración, consulta la documentación de Supabase o contacta al equipo de desarrollo. 