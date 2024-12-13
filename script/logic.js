const API_URL = 'https://fakestoreapi.com/products';

async function getProducts() {
  try{
    const responce = await fetch(API_URL);
    if(!responce.ok) throw new Error ('Network responce wos not ok');
    const products = await responce.json();
  displayProducts();
  }catch{
    console.log(error.message);
    
  }
}

function displayProducts(products){
  const productList = document.getElementById('product-list')
  productList.innerHTML = '';

  products.forEach(product => {
    const productElement = document.createElement('div');
    productElement.className = 'product';
    productElement.innerHTML = `
      <img src="${product.img_prod}" alt="${product.name_prod}"><./img>
    `
  });

}

getProducts()

// document.getElementById('product-form').addEventListener('submit', addProduct)