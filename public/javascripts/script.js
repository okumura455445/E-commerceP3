// script.js
document.addEventListener('DOMContentLoaded', () => {
  const addProductBtn = document.getElementById('addProductBtn');
  const productModal = document.getElementById('productModal');
  const deleteModal = document.getElementById('deleteModal');
  const closeBtns = document.querySelectorAll('.close');
  const cancelModalBtn = document.getElementById('cancelModal');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
  const productForm = document.getElementById('productForm');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

  let currentProductId = null;

  // Abrir modal para nuevo producto
  addProductBtn.addEventListener('click', () => {
    openModal();
  });

  // Cerrar modales
  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      closeModals();
    });
  });

  cancelModalBtn.addEventListener('click', () => {
    closeModals();
  });

  cancelDeleteBtn.addEventListener('click', () => {
    closeModals();
  });

  // Cerrar modal al hacer clic fuera
  window.addEventListener('click', (e) => {
    if (e.target === productModal) {
      closeModals();
    }
    if (e.target === deleteModal) {
      closeModals();
    }
  });

  // Enviar formulario
  productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(productForm);

    try {
      let response;
      if (currentProductId) {
        // Editar producto
        response = await fetch(`/api/products/${currentProductId}`, {
          method: 'PUT',
          body: formData
        });
      } else {
        // Crear producto
        response = await fetch('/api/products', {
          method: 'POST',
          body: formData
        });
      }

      if (response.ok) {
        closeModals();
        location.reload(); // Recargar página para mostrar cambios
      } else {
        const error = await response.json();
        alert('Error: ' + error.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar el producto');
    }
  });

  // Función para abrir modal
  function openModal(product = null) {
    if (product) {
      // Editar producto
      document.getElementById('modalTitle').textContent = 'Editar Producto';
      document.getElementById('productId').value = product.id;
      document.getElementById('name').value = product.name;
      document.getElementById('price').value = product.price;
      document.getElementById('stock').value = product.stock;
      document.getElementById('description').value = product.description;
      document.getElementById('category').value = product.category;
      // Nota: Para imagen, necesitarías manejar la previsualización
      currentProductId = product.id;
    } else {
      // Nuevo producto
      document.getElementById('modalTitle').textContent = 'Nuevo Producto';
      productForm.reset();
      document.getElementById('productId').value = '';
      currentProductId = null;
    }
    productModal.classList.remove('hidden');
  }

  // Función para cerrar modales
  function closeModals() {
    productModal.classList.add('hidden');
    deleteModal.classList.add('hidden');
    currentProductId = null;
  }

  // Función para confirmar eliminación
  window.confirmDelete = function(id) {
    currentProductId = id;
    deleteModal.classList.remove('hidden');
  };

  // Confirmar eliminación
  confirmDeleteBtn.addEventListener('click', async () => {
    if (currentProductId) {
      try {
        const response = await fetch(`/api/products/${currentProductId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          closeModals();
          location.reload();
        } else {
          alert('Error al eliminar el producto');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el producto');
      }
    }
  });

  // Función para editar producto
  window.editProduct = function(id) {
    // Obtener datos del producto
    fetch(`/api/products/${id}`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          openModal(data.data);
        }
      })
      .catch(error => console.error('Error:', error));
  };
});