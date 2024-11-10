// cambia a la pantalla de Inicio de Sesion
document.addEventListener('DOMContentLoaded', function() {
    const iniciarSesionBtn = document.getElementById('iniciar-sesion');

    iniciarSesionBtn.addEventListener('click', function() {
        window.location.href = '/inicioSesion';  // Redirige a la ruta de inicio de sesión
    });
});
