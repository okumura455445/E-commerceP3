// Almacenamiento del token
const TOKEN_KEY = 'techstore_token';
let currentUser = null;

// Elementos del DOM
const authModal = document.getElementById('authModal');
const authForm = document.getElementById('authForm');
const authTitle = document.getElementById('authTitle');
const registerFields = document.getElementById('registerFields');
const authEmail = document.getElementById('authEmail');
const authPassword = document.getElementById('authPassword');
const rememberMe = document.getElementById('rememberMe');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const switchAuth = document.getElementById('switchAuth');
const togglePassword = document.querySelector('.toggle-password');

// Botones del header
const loginBtn = document.getElementById('loginBtn'); // añadiremos en el header
const logoutBtn = document.getElementById('logoutBtn');

let isLoginMode = true;

function setLoginMode(mode) {
  isLoginMode = mode;
  if (mode) {
    authTitle.textContent = 'Iniciar Sesión';
    registerFields.classList.add('hidden');
    switchAuth.textContent = '¿No tienes cuenta? Regístrate';
    authSubmitBtn.textContent = 'Ingresar';
  } else {
    authTitle.textContent = 'Crear Cuenta';
    registerFields.classList.remove('hidden');
    switchAuth.textContent = '¿Ya tienes cuenta? Inicia Sesión';
    authSubmitBtn.textContent = 'Registrarse';
  }
}

// Mostrar/ocultar contraseña
togglePassword.addEventListener('click', () => {
  const type = authPassword.type === 'password' ? 'text' : 'password';
  authPassword.type = type;
  togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
});

// Cambiar entre login y registro
switchAuth.addEventListener('click', () => {
  setLoginMode(!isLoginMode);
});

// Enviar formulario
authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = authEmail.value.trim();
  const password = authPassword.value;
  const name = document.getElementById('regName')?.value.trim();

  const url = isLoginMode ? '/auth/login' : '/auth/register';
  const body = isLoginMode ? { email, password, rememberMe: rememberMe.checked } : { name, email, password };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem(TOKEN_KEY, data.data.token);
      currentUser = data.data.user;
      updateUIForLoggedIn();
      closeAuthModal();
      loadProducts(); // recargar productos (ahora con token)
    } else {
      alert(data.message || 'Error en autenticación');
    }
  } catch (err) {
    alert('Error de conexión');
  }
});

function closeAuthModal() {
  authModal.classList.add('hidden');
  authForm.reset();
}

function openAuthModal() {
  setLoginMode(true);
  authModal.classList.remove('hidden');
}

// Cerrar modales con clic fuera
window.addEventListener('click', (e) => {
  if (authModal && e.target === authModal) closeAuthModal();
  if (window.productModal && e.target === window.productModal) closeProductModal();
  if (window.deleteModal && e.target === window.deleteModal) closeDeleteModal();
});

// Cerrar con botón X
document.querySelector('#authModal .close')?.addEventListener('click', closeAuthModal);

// Verificar sesión al cargar la página
function checkExistingToken() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    // Validamos el token obteniendo el perfil
    fetch('/auth/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        currentUser = data.data;
        updateUIForLoggedIn();
      } else {
        localStorage.removeItem(TOKEN_KEY);
        currentUser = null;
        updateUIForLoggedOut();
      }
    })
    .catch(() => {
      localStorage.removeItem(TOKEN_KEY);
      currentUser = null;
      updateUIForLoggedOut();
    });
  } else {
    updateUIForLoggedOut();
  }
}

function updateUIForLoggedIn() {
  // Cambiar header: ocultar botón de login, mostrar nombre y logout
  const loginContainer = document.getElementById('authButtons');
  if (loginContainer) {
    loginContainer.innerHTML = `
      <span>Hola, ${currentUser.name}</span>
      <button id="logoutBtn" class="btn-secondary">Cerrar sesión</button>
    `;
    document.getElementById('logoutBtn').addEventListener('click', logout);
  }
}

function updateUIForLoggedOut() {
  const loginContainer = document.getElementById('authButtons');
  if (loginContainer) {
    loginContainer.innerHTML = `
      <button id="loginBtn" class="btn-primary">Iniciar Sesión</button>
    `;
    document.getElementById('loginBtn').addEventListener('click', openAuthModal);
  }
}

function logout() {
  localStorage.removeItem(TOKEN_KEY);
  currentUser = null;
  updateUIForLoggedOut();
  loadProducts(); // recargar (sin privilegios)
}

// Añadir token a las peticiones fetch (modificamos script.js)
function authFetch(url, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = {
    ...options.headers,
    'Authorization': token ? `Bearer ${token}` : ''
  };
  return fetch(url, { ...options, headers });
}

// Inicializar
checkExistingToken();