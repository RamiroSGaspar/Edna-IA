// Cambia a la pantalla de chat de prueba
document.addEventListener('DOMContentLoaded', function() {
    const startChatBtn = document.getElementById('btn-start-chat'); // Selecciona el botón

    startChatBtn.addEventListener('click', function(event) {
        event.preventDefault(); // Previene el comportamiento por defecto del enlace
        window.location.href = '/chatPrueba';  // Redirige a la ruta de chat
    });
});


// En la parte de abajo de la pantalla index hay otro boton, pero de momento te manda al chat de prueba

document.addEventListener('DOMContentLoaded', function() {
    // Seleccionamos el botón por su id
    const chatButton = document.getElementById('btn-start-chat-2');

    // Agregamos un evento de clic al botón
    chatButton.addEventListener('click', function(event) {
        event.preventDefault(); // Evitamos que la acción por defecto ocurra (si la tiene)
        
        // Redirigimos a chatPrueba.html
        window.location.href = '/chatPrueba';
    });
});
