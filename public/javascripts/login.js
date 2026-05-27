// Elementos del DOM
const authForm = document.getElementById('authForm');
const authTitle = document.getElementById('authTitle');
const registerFields = document.getElementById('registerFields');
const authEmail = document.getElementById('authEmail');
const authPassword = document.getElementById('authPassword');
const rememberMe = document.getElementById('rememberMe');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const switchAuth = document.getElementById('switchAuth');
const togglePassword = document.querySelector('.toggle-password');

let isLoginMode = true;

// Cambiar entre login y registro
function setMode(mode) {
  isLoginMode = mode;
  if (mode) {
    authTitle.textContent = 'Iniciar Sesión';
    registerFields.classList.add('hidden');
    switchAuth.textContent = '¿No tienes cuenta? Regístrate';
    authSubmitBtn.textContent = 'Ingresar';
    // Si estamos en modo login, quitar required del campo de registro
    const regNameInput = document.getElementById('regName');
    if (regNameInput) regNameInput.required = false;
  } else {
    authTitle.textContent = 'Crear Cuenta';
    registerFields.classList.remove('hidden');
    switchAuth.textContent = '¿Ya tienes cuenta? Inicia Sesión';
    authSubmitBtn.textContent = 'Registrarse';
    // En modo registro, activar required
    const regNameInput = document.getElementById('regName');
    if (regNameInput) regNameInput.required = true;
  }
}

// Mostrar/ocultar contraseña
togglePassword.addEventListener('click', () => {
  const type = authPassword.type === 'password' ? 'text' : 'password';
  authPassword.type = type;
  togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
});

// Alternar entre modos al hacer clic en el texto
switchAuth.addEventListener('click', () => setMode(!isLoginMode));

function saveToken(token, remember) {
  if (remember) {
    localStorage.setItem('techstore_token', token);
  } else {
    sessionStorage.setItem('techstore_token', token);
  }
}

function getStoredToken() {
  return sessionStorage.getItem('techstore_token') || localStorage.getItem('techstore_token');
}

function clearStoredToken() {
  sessionStorage.removeItem('techstore_token');
  localStorage.removeItem('techstore_token');
}

async function checkSession() {
  const token = getStoredToken();
  if (!token) return false;

  try {
    const res = await fetch('/auth/profile', {
      credentials: 'include',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!data.success) {
      // Si el servidor respondió pero indica no autorizado, borrar token
      clearStoredToken();
    }
    return data.success;
  } catch (_) {
    // No borrar el token ante errores de red temporales (ej. ERR_NETWORK_CHANGED)
    // Intentar una vez más antes de rendirse
    try {
      await new Promise(r => setTimeout(r, 300));
      const retryRes = await fetch('/auth/profile', {
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!retryRes.ok) return false;
      const retryData = await retryRes.json();
      if (!retryData.success) clearStoredToken();
      return retryData.success;
    } catch (err) {
      console.warn('checkSession: network error (kept token):', err.message || err);
      return false;
    }
  }
}

// Envío del formulario
authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = authEmail.value.trim();
  const password = authPassword.value;
  const name = document.getElementById('regName')?.value.trim();

  const url = isLoginMode ? '/auth/login' : '/auth/register';
  const body = isLoginMode
    ? { email, password, rememberMe: rememberMe.checked }
    : { name, email, password };

  try {
    const res = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    // Manejo seguro de la respuesta: verificar content-type antes de parsear
    let data;
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      throw new Error(`Respuesta inesperada del servidor: ${res.status} ${res.statusText} - ${text}`);
    }

    if (res.ok && data.success) {
      saveToken(data.data.token, rememberMe.checked);
      window.location.href = '/products';   // Redirigir a la página de productos
    } else {
      alert(data.message || `Error del servidor: ${res.status}`);
    }
  } catch (error) {
    alert(error.message || 'Error de conexión');
  }
});

// Al cargar, si ya hay token válido, redirigir directamente a productos
(async () => {
  const params = new URLSearchParams(window.location.search);
  const socialToken = params.get('token');
  if (socialToken) {
    saveToken(socialToken, true);
    window.location.href = '/products';
    return;
  }
  const authenticated = await checkSession();
  if (authenticated) {
    window.location.href = '/products';
  }
})();

