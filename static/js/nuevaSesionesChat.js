// nuevaSesionChat.js

// Función que se ejecuta al hacer clic en el botón "Nuevo Chat"
function startNewChat() {
    // Simplemente recarga la página para iniciar una nueva sesión
    location.reload(); // Esto recargará la página actual
}

// Puedes añadir un event listener para el botón "Nuevo Chat"
document.getElementById('new-chat-btn').addEventListener('click', startNewChat);
