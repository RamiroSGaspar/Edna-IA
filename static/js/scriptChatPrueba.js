// Obtener los elementos del DOM
const chatInput = document.querySelector('#chat-input');
const sendButton = document.querySelector('#send-btn');
const newChatButton = document.querySelector('#new-chat-btn');
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");
const chatHistoryContainer = document.querySelector("#chat-history");
const menuToggle = document.querySelector('.menu-toggle');  
const sideNav = document.querySelector('.side-nav');
const themeLink = document.getElementById("theme-link");
const themeLinkDark = document.getElementById("theme-link-dark"); // Enlace para el CSS de mensajes oscuros
const themeLinkLight = document.getElementById("theme-link-light");

const initialHeight = chatInput.scrollHeight;

// Se configura para mostrar el tema por defecto
const initializeChatUI = () => {
    const defaultText = `<div class="default-text">
                            <h1>EdnaIA</h1>
                            <p>Inicie una conversación y explore el poder de la IA.<br> Su historial de chat se mostrará aquí.</p>
                        </div>`;
    chatContainer.innerHTML = defaultText;
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
}

// Función para cambiar el tema sin almacenamiento
const toggleTheme = () => {
    // Cambiar el estado de body entre modo claro y oscuro
    const isLightMode = document.body.classList.toggle("light-mode");

    // Cambiar los enlaces de los CSS de mensajes
    if (isLightMode) {
        // Modo claro
        themeLinkDark.setAttribute('disabled', ''); // Deshabilitar CSS oscuro
        themeLinkLight.removeAttribute('disabled'); // Habilitar CSS claro
        themeButton.innerText = "dark_mode"; // Cambiar el texto del botón
    } else {
        // Modo oscuro
        themeLinkLight.setAttribute('disabled', ''); // Deshabilitar CSS claro
        themeLinkDark.removeAttribute('disabled'); // Habilitar CSS oscuro
        themeButton.innerText = "light_mode"; // Cambiar el texto del botón
    }
}

// Evento listener para el botón de cambiar tema
themeButton.addEventListener('click', toggleTheme);
// Función para agregar mensajes al contenedor de chat
const addMessageToChat = (sender, message) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add('chat-message', sender === 'Tú' ? 'user-message' : 'bot-message'); // Diferenciar estilos según el remitente
    chatDiv.innerHTML = `<p><strong>${sender}:</strong> ${message}</p>`;
    chatContainer.appendChild(chatDiv);
    
    // Hacer scroll automáticamente para mostrar siempre el último mensaje
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Función para enviar el mensaje al servidor Flask y recibir la respuesta de EdnaIA
const sendMessage = async () => {
    const message = chatInput.value.trim();
    if (message === "") return; // No enviar si el campo está vacío

    // Mostrar el mensaje del usuario en el chat
    addMessageToChat('Tú', message);

    // Limpiar el campo de entrada
    chatInput.value = '';

    // Enviar el mensaje al servidor usando fetch
    try {
        const response = await fetch('/send_message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `message=${encodeURIComponent(message)}`
        });

        const data = await response.json();

        // Crear un contenedor para la respuesta de la IA
        const chatDiv = document.createElement("div");
        chatDiv.classList.add('chat-message', 'bot-message'); // Clase para el mensaje del bot
        chatContainer.appendChild(chatDiv);

        // Usar el efecto de escritura para la respuesta de EdnaIA
        addTypingEffect(chatDiv, data.response, 10);

        // Hacer scroll automáticamente
        chatContainer.scrollTop = chatContainer.scrollHeight;

    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
    }
}


// Listeners para eventos de botones y entrada de teclado
sendButton.addEventListener('click', sendMessage);

// Permitir enviar el mensaje con Enter
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { // Shift+Enter permite saltos de línea
        e.preventDefault();
        sendMessage();
    }
});

// Listener para el botón "delete" para limpiar el campo de texto
deleteButton.addEventListener('click', () => {
    chatInput.value = ''; // Limpiar el campo de texto
});

// Listener para el botón de tema
themeButton.addEventListener('click', toggleTheme);

// Inicializar la interfaz del chat con el texto por defecto
initializeChatUI();

