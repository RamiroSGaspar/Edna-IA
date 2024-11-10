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
const themeLinkDark = document.getElementById("theme-link-dark"); 
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

// Función para cambiar el tema sin almacenamiento (solo para el chat de prueba)
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

// Función para cargar los mensajes de una sesión
async function cargarMensajesSesion(sesionId) {
    try {
        // Primero activamos la sesión
        const activacionResponse = await fetch(`/cargar_sesion/${sesionId}`);
        const activacionData = await activacionResponse.json();
        
        if (!activacionData.success) {
            console.error('Error al activar la sesión:', activacionData.error);
            return;
        }

        // Luego obtenemos los mensajes
        const mensajesResponse = await fetch(`/obtener_mensajes_sesion/${sesionId}`);
        const mensajes = await mensajesResponse.json();
        
        // Limpiar el contenedor de chat
        chatContainer.innerHTML = '';
        
        // Mostrar los mensajes
        mensajes.forEach(mensaje => {
            addMessageToChat(mensaje.sender, mensaje.message, false); // false para no aplicar el efecto de typing en mensajes históricos
        });
        
        // Hacer scroll hasta el final
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        // Cerrar el modal de selección de sesión
        document.getElementById('selectSessionModal').style.display = 'none';
        
    } catch (error) {
        console.error('Error al cargar los mensajes:', error);
    }
}

// Función para agregar mensajes al contenedor de chat
const addMessageToChat = (sender, message, withTypingEffect = true) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add('chat-message', sender === 'Tú' ? 'user-message' : 'bot-message');
    chatDiv.innerHTML = `<p><strong>${sender}:</strong> <span class="message-text"></span></p>`;
    chatContainer.appendChild(chatDiv);
    
    const messageTextElement = chatDiv.querySelector('.message-text');
    
    if (sender === 'EdnaIA' && withTypingEffect) {
        addTypingEffect(messageTextElement, message, 10);
    } else {
        messageTextElement.textContent = message;
    }
    
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
        const response = await fetch('/send_message_final', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `message=${encodeURIComponent(message)}`
        });

        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }

        const data = await response.json();
        
        if (data.error) {
            console.error('Error del servidor:', data.error);
            addMessageToChat('Sistema', 'Error al procesar el mensaje. Por favor, intente nuevamente.');
            return;
        }
        
        addMessageToChat('EdnaIA', data.response);

    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        addMessageToChat('Sistema', 'Error de conexión. Por favor, verifique su conexión a internet.');
    }
}


// Función para el efecto de escritura
function addTypingEffect(element, text, speed = 10) {  // Aumenta la velocidad aquí si es necesario
    let index = 0;

    function typeWriter() {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
            setTimeout(typeWriter, speed);
        }
    }

    typeWriter();
}

// Modificar el event listener para los botones de sesión
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('session-btn')) {
        const sesionId = e.target.getAttribute('data-id');
        
        // Guarda el ID de sesión en sessionStorage para usarlo en chatFinal
        sessionStorage.setItem('sesion_id', sesionId);
        
        // Redirige a la ruta de cargar sesión para activar la sesión en el backend
        window.location.href = `/cargar_sesion/${sesionId}`;
    }
});


// Cargar automáticamente los mensajes de la sesión al llegar a chatFinal
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Verifica si hay una sesión activa almacenada en el backend
        const response = await fetch('/obtener_mensajes_sesion/' + sessionStorage.getItem('sesion_id'));
        const mensajes = await response.json();

        if (mensajes.error) {
            console.error('Error:', mensajes.error);
            return;
        }

        // Limpia el contenedor de chat y carga los mensajes
        const chatContainer = document.querySelector(".chat-container");
        chatContainer.innerHTML = '';

        // Muestra los mensajes en la interfaz
        mensajes.forEach(mensaje => {
            addMessageToChat(mensaje.sender, mensaje.message, false);
        });
    } catch (error) {
        console.error('Error al cargar los mensajes de la sesión:', error);
    }
});


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