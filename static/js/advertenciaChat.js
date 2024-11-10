// Mostrar el modal cuando se haga clic en "Volver al inicio"
const backButton = document.getElementById('back-button');
const modal = document.getElementById('exitModal');
const exitButton = document.getElementById('exit-btn');
const cancelButton = document.getElementById('cancel-btn');

// Mostrar el modal
backButton.addEventListener('click', function() {
    modal.style.display = 'block';
});

// Ocultar el modal si se hace clic en "Cancelar"
cancelButton.addEventListener('click', function() {
    modal.style.display = 'none';
});

// Redirigir a la página de inicio si se hace clic en "Salir"
exitButton.addEventListener('click', function() {
    window.location.href = inicioURL;  // Usamos la URL generada por Flask
});

// Cerrar el modal si se hace clic fuera de la ventana modal
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};
