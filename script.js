let baseConocimiento = null;

// 1. Cargar la base de datos JSON
async function cargarIA() {
    try {
        const respuesta = await fetch('conocimiento.json');
        baseConocimiento = await respuesta.json();
        console.log("IA Lista y cargada.");
    } catch (error) {
        console.error("Error cargando el archivo JSON de la IA:", error);
    }
}

// 2. Procesar el texto y buscar la mejor respuesta
function obtenerRespuestaIA(mensajeUsuario) {
    if (!baseConocimiento) return "Estoy iniciando, dame un segundo.";

    // Convertimos a minúsculas y limpiamos espacios para facilitar la búsqueda
    const textoLimpio = mensajeUsuario.toLowerCase().trim();

    // Recorremos las intenciones guardadas en el JSON
    for (let intencion of baseConocimiento.intenciones) {
        // Comprobamos si alguna palabra clave coincide con lo que escribió el usuario
        const coincide = intencion.keywords.some(palabra => textoLimpio.includes(palabra));
        
        if (coincide) {
            // Elige una respuesta aleatoria dentro de la lista de esa intención
            const respuestas = intencion.responses;
            return respuestas[Math.floor(Math.random() * respuestas.length)];
        }
    }

    // Si nada coincide, elige una respuesta por defecto aleatoria
    const respuestasDefault = baseConocimiento.default;
    return respuestasDefault[Math.floor(Math.random() * respuestasDefault.length)];
}

// 3. Manejo de la Interfaz Gráfica (DOM)
const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

function agregarMensaje(texto, emisor) {
    const nuevoMensaje = document.createElement('div');
    nuevoMensaje.classList.add('message', `${emisor}-message`);
    nuevoMensaje.textContent = texto;
    chatBox.appendChild(nuevoMensaje);
    
    // Auto-scroll hacia abajo
    chatBox.scrollTop = chatBox.scrollHeight;
}

function procesarMensaje() {
    const mensaje = userInput.value;
    if (!mensaje.trim()) return;

    // Mostrar mensaje del usuario
    agregarMensaje(mensaje, 'user');
    userInput.value = '';

    // Simular tiempo de "pensamiento" de la IA
    setTimeout(() => {
        const respuestaIA = obtenerRespuestaIA(mensaje);
        agregarMensaje(respuestaIA, 'ai');
    }, 500);
}

// Eventos de usuario
sendBtn.addEventListener('click', procesarMensaje);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') procesarMensaje();
});

// Arrancar la aplicación
cargarIA();
