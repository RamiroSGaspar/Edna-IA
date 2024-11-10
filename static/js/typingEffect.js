function addTypingEffect(element, text, speed = 10) {
    let index = 0;

    function typeWriter() {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
            setTimeout(typeWriter, speed);  // Controla la velocidad del efecto
        }
    }

    typeWriter();
}
