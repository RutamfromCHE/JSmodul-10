// Основные элементы интерфейса
const productsContainer = document.getElementById('products-container');
const addProductForm = document.getElementById('add-product-form');
const categoryFilter = document.getElementById('category-filter');
const loadMoreButton = document.getElementById('load-more-button');

let currentPage = 1;
const productsPerPage = 6;

// Функция для получения товаров
async function fetchProducts(page = 1, limit = 6, category = '') {
    try {
        const url = category
            ? `https://fakestoreapi.com/products/category/${category}?limit=${limit}&page=${page}`
            : `https://fakestoreapi.com/products?limit=${limit}&page=${page}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Ошибка загрузки товаров');
        return await response.json();
    } catch (error) {
        alert(error.message);
        return [];
    }
}

// Функция для отображения товаров
function displayProducts(products) {
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <p>Цена: $${product.price}</p>
            <button class="delete-button" data-id="${product.id}">Удалить</button>
        `;
        productsContainer.appendChild(productCard);
    });
}

// Функция для добавления нового товара
async function addProduct(event) {
    event.preventDefault();
    const formData = new FormData(addProductForm);
    const newProduct = {
        title: formData.get('title'),
        price: parseFloat(formData.get('price')),
        description: formData.get('description'),
        category: formData.get('category'),
    };

    try {
        const response = await fetch('https://fakestoreapi.com/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProduct),
        });
        if (!response.ok) throw new Error('Ошибка добавления товара');
        alert('Товар успешно добавлен');
        addProductForm.reset();
    } catch (error) {
        alert(error.message);
    }
}

// Функция для удаления товара
async function deleteProduct(productId) {
    try {
        const response = await fetch(`https://fakestoreapi.com/products/${productId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Ошибка удаления товара');
        alert('Товар успешно удален');
        document.querySelector(`[data-id="${productId}"]`).parentElement.remove();
    } catch (error) {
        alert(error.message);
    }
}

// Функция для загрузки категорий
async function loadCategories() {
    try {
        const response = await fetch('https://fakestoreapi.com/products/categories');
        if (!response.ok) throw new Error('Ошибка загрузки категорий');
        const categories = await response.json();
        categoryFilter.innerHTML = '<option value="">Все категории</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    } catch (error) {
        alert(error.message);
    }
}

// Обработчик загрузки дополнительных товаров
loadMoreButton.addEventListener('click', async () => {
    currentPage++;
    const products = await fetchProducts(currentPage, productsPerPage);
    displayProducts(products);
});

// Обработчик добавления товара
addProductForm.addEventListener('submit', addProduct);

// Обработчик удаления товара
productsContainer.addEventListener('click', event => {
    if (event.target.classList.contains('delete-button')) {
        const productId = event.target.dataset.id;
        deleteProduct(productId);
    }
});

// Обработчик фильтрации товаров по категориям
categoryFilter.addEventListener('change', async () => {
    const selectedCategory = categoryFilter.value;
    productsContainer.innerHTML = '';
    const products = await fetchProducts(1, productsPerPage, selectedCategory);
    displayProducts(products);
});

// Инициализация страницы
(async function initialize() {
    await loadCategories();
    const products = await fetchProducts();
    displayProducts(products);
})();
