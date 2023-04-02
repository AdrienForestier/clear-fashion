// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

/*
Description of the available api
GET https://clear-fashion-api.vercel.app/

Search for specific products

This endpoint accepts the following optional query string parameters:

- `page` - page of products to return
- `size` - number of products to return

GET https://clear-fashion-api.vercel.app/brands

Search for available brands list
*/

// current products on the page
let currentProducts = [];
let currentPagination = {};

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const spanNbBrands = document.querySelector('#nbBrands')
const selectBrand = document.querySelector('#brand-select');
const filterRecentlyReleased = document.querySelector('#recently-released');
const filterReasonablePrice = document.querySelector('#reasonable-price');
const selectSort = document.querySelector('#sort-select');
const spanNbNewProducts = document.querySelector('#nbNewProducts');
const spanP50value = document.querySelector('#p50Value');
const spanP90value = document.querySelector('#p90Value');
const spanP95value = document.querySelector('#p95Value');
const spanLastReleased = document.querySelector('#lastReleased');

/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12) => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }
    return body.data;

  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      //console.log(product)
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}" target="_blank">${product.name}</a>
        <span>${product.price}</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2></h2>';
  sectionProducts.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
      {'length': pageCount},
      (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

function pValue(products, value){
  const val = (100-value)/100
  const price = [];
  for(let i=0;i<products.length;i++){
    price.push(products[i].price);
  }
  price.sort(function (a,b){return (a-b);});
  return price[Math.trunc(val*price.length)];
}

function lastReleased(products){
  const dates = [];
  for(let i=0;i<products.length;i++){
    dates.push(products[i].released);
  }
  dates.sort(function (a,b){return(a-b);});
  return dates[0];
}

/**
 * Render page selector
 * @param  {Object} pagination
 */

const renderIndicators = async (pagination) => {
  const product = await fetchProducts(1, currentPagination.count);
  const {count} = pagination;
  let nb=0;
  for(let i=0;i<product.result.length;i++){
    // for the new released products, 2 weeks isn't enough.
    if(Date.now() - new Date(product.result[i].released)<1.21e+9){nb++;}}
  spanNbNewProducts.innerHTML = nb;
  spanNbProducts.innerHTML = count;
  spanP50value.innerHTML=pValue(product.result, 50);
  spanP90value.innerHTML=pValue(product.result,90);
  spanP95value.innerHTML=pValue(product.result,95);
  spanLastReleased.innerHTML=lastReleased(product.result);
};



const renderBrands = async () => {
  const response = await fetch(`https://clear-fashion-api.vercel.app/brands`)
  const body = await response.json();
  const brands = body.data.result;
  spanNbBrands.innerHTML=brands.length
  //  That was another method, but it doesn't work well.
  /*let brands=[];
  for(let i = 0; i<products.result.length;i++){
    if(!brands.includes(products.result[i].brand))
      brands.push(products.result[i].brand)
  }*/

  const choices=Array.from({'length':brands.length},
      (value,index)=>`<option value="${brands[index]}">${brands[index]}</option>`).join('')
  selectBrand.innerHTML=choices;
}


const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
};

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 */
selectShow.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, parseInt(event.target.value));
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();
  renderBrands(products);
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

selectPage.addEventListener('change',async(event)=>{
  const products = await fetchProducts(parseInt(event.target.value), currentPagination.pageSize);
  setCurrentProducts(products);
  render(currentProducts,currentPagination);
});

selectBrand.addEventListener('change', async(event)=>{
  const prod = await fetchProducts(1, currentPagination.count);
  prod.result = prod.result.filter(a=>a.brand==event.target.value);
  setCurrentProducts(prod);
  render(currentProducts,currentPagination);
})

filterRecentlyReleased.onclick=async function (){
  const all = await fetchProducts(1, currentPagination.count)
  all.result=all.result.filter(a=> Date.now() - new Date(a.released)<1.21e+9);
  setCurrentProducts(all)
  render(currentProducts,currentPagination);
};

filterReasonablePrice.onclick= async function (){
  const all = await fetchProducts(1, currentPagination.count)
  all.result=all.result.filter(a=>a.price<100);
  all.meta.pageSize=12
  setCurrentProducts(all)
  render(currentProducts,currentPagination);
};

selectSort.addEventListener('change', async event=>{
  const test = currentPagination
  const all = await fetchProducts(1, currentPagination.count)
  currentPagination.pageSize=12;
  switch(event.target.value){
    default:
      break;
    case 'price-asc':
      all.result.sort((a,b)=>a.price-b.price);
      setCurrentProducts(all);
      render(currentProducts,test);
      break;
    case'price-desc':
      all.result.sort((a,b)=>a.price-b.price).reverse();
      setCurrentProducts(all);
      render(currentProducts,currentPagination);
      break;
    case'date-asc':
      all.result.sort((a,b)=>new Date(a.released)-new Date(b.released)).reverse();
      setCurrentProducts(all);
      render(currentProducts,currentPagination);
      break;
    case'date-desc':
      all.result.sort((a,b)=>new Date(a.released)-new Date(b.released));
      setCurrentProducts(all);
      render(currentProducts,currentPagination);
      break;
  }
  render(currentProducts,currentPagination);
})
