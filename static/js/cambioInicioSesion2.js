document.addEventListener('DOMContentLoaded', function() {
    const registroBtn = document.getElementById('registroBtn');

    registroBtn.addEventListener('click', function(event) {
        event.preventDefault();  // Evita el envío del formulario

        // Redirige a la ruta de Flask
        window.location.href = '/inicioSesion';
    });
});
