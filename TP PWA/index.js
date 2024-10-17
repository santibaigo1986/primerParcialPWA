// index.js - Para el feed principal
const feedContainer = document.querySelector('#feed');
const URL_POSTS = 'https://67104654a85f4164ef2d82e6.mockapi.io/api/instagramClone/PWA/:endpoint';

// Cargar posts existentes
async function cargarPosts() {
    try {
        const response = await fetch(`${URL_POSTS}?sortBy=fecha&order=desc`);
        if (!response.ok) throw new Error('Error al cargar posts');
        
        const posts = await response.json();
        feedContainer.innerHTML = posts.map(post => `
            <div class="post-card">
                <img src="${post.imagen}" alt="Post image">
                <div class="post-content">
                    <p class="post-text">${post.titulo}</p>
                    <small class="post-date">${new Date(post.fecha).toLocaleString()}</small>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error:', error);
        feedContainer.innerHTML = '<p>Error al cargar los posts</p>';
    }
}

// Verificar conectividad
function actualizarEstadoConexion() {
    const btnNuevoPost = document.querySelector('#btnNuevoPost');
    btnNuevoPost.disabled = !navigator.onLine;
}

window.addEventListener('online', actualizarEstadoConexion);
window.addEventListener('offline', actualizarEstadoConexion);

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    cargarPosts();
    actualizarEstadoConexion();
});

// camara.js - Para la captura de fotos
const imagen = document.querySelector('#imgCamera');
const txtDescripcion = document.querySelector('#txtDescripcion');
const btnCapturar = document.querySelector('#btnCapturar');
const btnPublicar = document.querySelector('#btnPublicar');

// Configurar input de cámara
const inputCamara = document.createElement('input');
inputCamara.type = 'file';
inputCamara.accept = 'image/*';
inputCamara.capture = 'environment';

// Manejar captura de imagen
inputCamara.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    const imagenCaptura = URL.createObjectURL(file);
    imagen.src = imagenCaptura;
    btnPublicar.disabled = false;
});

// Convertir a base64
function convertirAbase64() {
    const canvas = document.createElement('canvas');
    canvas.width = imagen.width;
    canvas.height = imagen.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imagen, 0, 0, imagen.width, imagen.height);
    return canvas.toDataURL('image/webp', 0.8); // Usar WebP con compresión
}

// Publicar post
async function publicarPost() {
    try {
        btnPublicar.disabled = true;
        
        const nuevoPost = {
            imagen: await convertirAbase64(),
            titulo: txtDescripcion.value.trim(),
            fecha: new Date().toISOString()
        };

        const response = await fetch(URL_POSTS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoPost)
        });

        if (!response.ok) throw new Error('Error al publicar');
        
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error:', error);
        alert('Error al publicar el post');
        btnPublicar.disabled = false;
    }
}

// Event listeners
btnCapturar.addEventListener('click', () => inputCamara.click());
btnPublicar.addEventListener('click', publicarPost);
imagen.addEventListener('dblclick', () => inputCamara.click());