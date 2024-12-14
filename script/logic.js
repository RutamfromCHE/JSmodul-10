const productsContainer = document.getElementById('products-container');
const categoryFilter = document.getElementById('category-filter');
const priceMinInput = document.getElementById('price-min');
const priceMaxInput = document.getElementById('price-max');
const applyFiltersButton = document.getElementById('apply-filters');
const loadMoreButton = document.getElementById('load-more-button');

let currentPage = 1;
const productsPerPage = 6;

// Функция для получения товаров
async function fetchProducts(page = 1, limit = 6, category = '') {
  try {
    let url = `https://fakestoreapi.com/products?limit=${limit}&page=${page}`;
    if (category) {
      url = `https://fakestoreapi.com/products/category/${category}?limit=${limit}`;
    }
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
  productsContainer.innerHTML = ''; // Очистка контейнера
  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');
    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <h3>${product.title}</h3>
      <p>${product.description.substring(0, 50)}...</p>
      <p class="price">Цена: $${product.price}</p>
    `;
    productsContainer.appendChild(productCard);
  });
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

// Функция для применения фильтров
async function applyFilters() {
  const category = categoryFilter.value;
  const priceMin = parseFloat(priceMinInput.value) || 0;
  const priceMax = parseFloat(priceMaxInput.value) || Infinity;

  const products = await fetchProducts(1, 100, category); // Получаем все товары в категории
  const filteredProducts = products.filter(product => {
    return product.price >= priceMin && product.price <= priceMax;
  });
  displayProducts(filteredProducts);
}

// Обработчик кнопки "Применить фильтры"
applyFiltersButton.addEventListener('click', applyFilters);

// Обработчик кнопки "Загрузить еще"
loadMoreButton.addEventListener('click', async () => {
  currentPage++;
  const products = await fetchProducts(currentPage, productsPerPage);
  displayProducts(products);
});

// Инициализация страницы
(async function initialize() {
  await loadCategories();
  const products = await fetchProducts();
  displayProducts(products);
})();
