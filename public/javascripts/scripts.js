const API_URL = '/api/products';

// Elementos del DOM
const productsContainer = document.getElementById('productsContainer');
const loading = document.getElementById('loading');
const emptyState = document.getElementById('emptyState');
const addBtn = document.getElementById('addProductBtn');

const productModal = document.getElementById('productModal');
const modalTitle = document.getElementById('modalTitle');
const productForm = document.getElementById('productForm');
const cancelModalBtn = document.getElementById('cancelModal');
const productIdInput = document.getElementById('productId');
const nameInput = document.getElementById('name');
const priceInput = document.getElementById('price');
const stockInput = document.getElementById('stock');
const descriptionInput = document.getElementById('description');
const categoryInput = document.getElementById('category');

const deleteModal = document.getElementById('deleteModal');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
let productToDeleteId = null;

// Validaciones en el cliente (coinciden con el backend)
const validators = {
  name: (v) => v.trim() ? '' : 'El nombre es obligatorio.',
  price: (v) => {
    const num = parseFloat(v);
    if (isNaN(num) || num <= 0) return 'Ingrese un precio válido (mayor a 0).';
    return '';
  },
  stock: (v) => {
    const num = parseInt(v, 10);
    if (isNaN(num) || num < 0) return 'El stock debe ser un entero >= 0.';
    return '';
  }
};

function showError(fieldId, message) {
  const errorSpan = document.getElementById(`${fieldId}Error`);
  const input = document.getElementById(fieldId);
  if (errorSpan) errorSpan.textContent = message;
  if (input) {
    if (message) input.classList.add('error');
    else input.classList.remove('error');
  }
}

function clearErrors() {
  ['name', 'price', 'stock'].forEach(field => showError(field, ''));
}

async function loadProducts() {
  try {
    loading.classList.remove('hidden');
    emptyState.classList.add('hidden');
    const res = await fetch(API_URL);
    const json = await res.json();
    if (json.success) {
      renderProducts(json.data);
    } else {
      console.error('Error al obtener productos:', json.message);
    }
  } catch (error) {
    console.error('Error de red:', error);
  } finally {
    loading.classList.add('hidden');
  }
}

function renderProducts(products) {
  productsContainer.innerHTML = '';
  if (products.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }
  emptyState.classList.add('hidden');
  products.forEach(product => {
    const card = createProductCard(product);
    productsContainer.appendChild(card);
  });
}

function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.innerHTML = `
    <h3>${escapeHtml(product.name)}</h3>
    <div class="price">$${product.price.toFixed(2)}</div>
    <div class="stock">Stock: ${product.stock}</div>
    ${product.description ? `<div class="details">${escapeHtml(product.description)}</div>` : ''}
    ${product.category ? `<span class="category">${escapeHtml(product.category)}</span>` : ''}
    <div class="card-actions">
      <button class="btn-primary edit-btn" data-id="${product.id}">Editar</button>
      <button class="btn-danger delete-btn" data-id="${product.id}">Eliminar</button>
    </div>
  `;

  card.querySelector('.edit-btn').addEventListener('click', () => openEditModal(product));
  card.querySelector('.delete-btn').addEventListener('click', () => openDeleteModal(product.id));
  return card;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Modales
function openAddModal() {
  clearErrors();
  productForm.reset();
  productIdInput.value = '';
  modalTitle.textContent = 'Nuevo Producto';
  productModal.classList.remove('hidden');
}

function openEditModal(product) {
  clearErrors();
  productIdInput.value = product.id;
  nameInput.value = product.name;
  priceInput.value = product.price;
  stockInput.value = product.stock;
  descriptionInput.value = product.description || '';
  categoryInput.value = product.category || '';
  modalTitle.textContent = 'Editar Producto';
  productModal.classList.remove('hidden');
}

function closeProductModal() {
  productModal.classList.add('hidden');
}

function openDeleteModal(id) {
  productToDeleteId = id;
  deleteModal.classList.remove('hidden');
}

function closeDeleteModal() {
  deleteModal.classList.add('hidden');
  productToDeleteId = null;
}

// Eventos de los modales
addBtn.addEventListener('click', openAddModal);
cancelModalBtn.addEventListener('click', closeProductModal);
productModal.querySelector('.close').addEventListener('click', closeProductModal);
cancelDeleteBtn.addEventListener('click', closeDeleteModal);
deleteModal.querySelector('.close')?.addEventListener('click', closeDeleteModal);

// Cerrar los modales al hacer clic fuera del contenido
window.addEventListener('click', (e) => {
  if (e.target === productModal) closeProductModal();
  if (e.target === deleteModal) closeDeleteModal();
});

// Envío del formulario (crear/editar)
productForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors();

  // Validar
  let isValid = true;
  const nameError = validators.name(nameInput.value);
  if (nameError) { showError('name', nameError); isValid = false; }
  const priceError = validators.price(priceInput.value);
  if (priceError) { showError('price', priceError); isValid = false; }
  const stockError = validators.stock(stockInput.value);
  if (stockError) { showError('stock', stockError); isValid = false; }

  if (!isValid) return;

  const productData = {
    name: nameInput.value.trim(),
    price: parseFloat(priceInput.value),
    stock: parseInt(stockInput.value, 10),
    description: descriptionInput.value.trim(),
    category: categoryInput.value.trim()
  };

  const id = productIdInput.value;
  const url = id ? `${API_URL}/${id}` : API_URL;
  const method = id ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    const json = await res.json();
    if (json.success) {
      closeProductModal();
      loadProducts(); // recargar lista
    } else {
      alert('Error: ' + (json.message || json.errors?.join(', ') || 'Error desconocido'));
    }
  } catch (error) {
    console.error('Error al guardar producto:', error);
    alert('Error de conexión. Intenta de nuevo.');
  }
});

// Eliminar producto
confirmDeleteBtn.addEventListener('click', async () => {
  if (!productToDeleteId) return;
  try {
    const res = await fetch(`${API_URL}/${productToDeleteId}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
      closeDeleteModal();
      loadProducts();
    } else {
      alert('Error al eliminar: ' + json.message);
    }
  } catch (error) {
    console.error('Error al eliminar:', error);
    alert('Error de conexión.');
  }
});

// Inicializar
loadProducts();