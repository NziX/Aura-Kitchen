const defaultProducts = [];

let products = JSON.parse(localStorage.getItem('aura_products'));
if (!products || products.length === 0) {
    // If it's completely empty, we can just use empty array
    products = defaultProducts;
    localStorage.setItem('aura_products', JSON.stringify(products));
}

window.saveProducts = function() {
    localStorage.setItem('aura_products', JSON.stringify(products));
};
