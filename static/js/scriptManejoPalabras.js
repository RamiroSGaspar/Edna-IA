// Función para formatear el texto: convierte **texto** a <strong>texto</strong>
function formatMessage(message) {
    return message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Reemplazar **texto** por <strong>texto</strong>
}

// Función para agregar el mensaje al chat
function addMessageToChat(author, message) {
    // Formatear el mensaje para aplicar negrita si es necesario
    const formattedMessage = formatMessage(message);

    // Crear el contenedor del mensaje
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container');

    // Asignar clase en función del autor
    if (author === 'EdnaIA') {
        messageContainer.classList.add('bot-message'); // Clase para mensajes del bot
    } else {
        messageContainer.classList.add('user-message'); // Clase para mensajes del usuario
    }

    // Añadir el nombre del autor
    const authorElement = document.createElement('p');
    authorElement.classList.add('name');
    authorElement.textContent = author + ':';
    messageContainer.appendChild(authorElement);

    // Añadir el mensaje formateado con innerHTML
    const messageElement = document.createElement('p');
    messageElement.classList.add('message');
    messageElement.innerHTML = formattedMessage; // Usamos innerHTML para procesar las etiquetas <strong>
    messageContainer.appendChild(messageElement);

    // Añadir el mensaje al chat
    const chat = document.querySelector('.chat');
    chat.appendChild(messageContainer);
}
