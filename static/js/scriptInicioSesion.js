// scriptInicioSesion.js
const container = document.querySelector(".container");
const btnSignIn = document.getElementById("btn-sign-in");
const btnSignUp = document.getElementById("btn-sign-up");

// Muestra el formulario de inicio de sesión
btnSignIn.addEventListener("click", () => {
    container.classList.remove("toggle");
});

// Muestra el formulario de registro
btnSignUp.addEventListener("click", () => {
    container.classList.add("toggle");
});
