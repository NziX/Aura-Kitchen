// State
let cart = [];

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const cartBadge = document.getElementById('cartBadge');
const cartOverlay = document.getElementById('cartOverlay');
const cartSidebar = document.getElementById('cartSidebar');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const emptyCartMessage = document.getElementById('emptyCartMessage');
const cartTotal = document.getElementById('cartTotal');
const checkoutTotal = document.getElementById('checkoutTotal');

// Views
const mainView = document.getElementById('mainView');
const checkoutView = document.getElementById('checkoutView');
const confirmationView = document.getElementById('confirmationView');

// Buttons
const cartBtn = document.getElementById('cartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const checkoutBtn = document.getElementById('checkoutBtn');
const backToCartBtn = document.getElementById('backToCartBtn');
const continueShoppingBtn = document.getElementById('continueShoppingBtn');
const logoBtn = document.getElementById('logoBtn');
const checkoutForm = document.getElementById('checkoutForm');

// Initialize
function init() {
    renderProducts();
    setupEventListeners();
}

// Render Products
function renderProducts() {
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition duration-300 flex flex-col';
        
        productCard.innerHTML = `
            <div class="h-64 overflow-hidden relative bg-gray-200">
                <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover object-center cursor-pointer hover:scale-105 transition duration-300" onclick="openImageModal('${product.image}')">
                <div class="absolute top-3 right-3 bg-white px-2 py-1 text-sm font-bold rounded shadow text-gray-900">
                    ${formatPrice(product.price)}
                </div>
            </div>
            <div class="p-5 flex flex-col flex-grow">
                <h3 class="text-lg font-bold text-gray-900 mb-1">${product.name}</h3>
                <p class="text-gray-500 text-sm mb-4 flex-grow">${product.description}</p>
                
                <div class="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <div class="flex items-center border rounded-md">
                        <button class="px-3 py-1 text-gray-600 hover:bg-gray-100" onclick="updateTempQty(${product.id}, -1)">-</button>
                        <span id="qty-${product.id}" class="px-2 py-1 text-sm font-medium w-8 text-center">1</span>
                        <button class="px-3 py-1 text-gray-600 hover:bg-gray-100" onclick="updateTempQty(${product.id}, 1)">+</button>
                    </div>
                    <button onclick="addToCart(${product.id})" class="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Utility: Format Price
function formatPrice(price) {
    return price.toLocaleString('en-RW') + ' RWF';
}

// Temporary Quantity for Product Cards
window.updateTempQty = function(productId, change) {
    const qtySpan = document.getElementById(`qty-${productId}`);
    let currentQty = parseInt(qtySpan.textContent);
    let newQty = currentQty + change;
    
    if (newQty >= 1 && newQty <= 99) {
        qtySpan.textContent = newQty;
    }
}

// Add to Cart
window.addToCart = function(productId) {
    const qtySpan = document.getElementById(`qty-${productId}`);
    const quantity = parseInt(qtySpan.textContent);
    const product = products.find(p => p.id === productId);
    
    const existingItem = cart.find(item => item.product.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ product, quantity });
    }
    
    // Reset temp qty
    qtySpan.textContent = '1';
    
    updateCartUI();
    openCart();
}

// Update Cart Quantity
window.updateCartQty = function(productId, change) {
    const itemIndex = cart.findIndex(item => item.product.id === productId);
    
    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        
        updateCartUI();
    }
}

// Remove from Cart
window.removeFromCart = function(productId) {
    cart = cart.filter(item => item.product.id !== productId);
    updateCartUI();
}

// Update Cart UI
function updateCartUI() {
    // Update Badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (totalItems > 0) {
        cartBadge.textContent = totalItems;
        cartBadge.classList.remove('hidden');
    } else {
        cartBadge.classList.add('hidden');
    }
    
    // Update Cart Items List
    cartItemsContainer.innerHTML = '';
    let totalPrice = 0;
    
    if (cart.length === 0) {
        cartItemsContainer.appendChild(emptyCartMessage);
        emptyCartMessage.style.display = 'block';
        checkoutBtn.disabled = true;
    } else {
        emptyCartMessage.style.display = 'none';
        checkoutBtn.disabled = false;
        
        cart.forEach(item => {
            totalPrice += item.product.price * item.quantity;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'flex items-center py-4 border-b border-gray-100 last:border-0';
            cartItem.innerHTML = `
                <img src="${item.product.image}" alt="${item.product.name}" class="h-16 w-16 object-cover rounded bg-gray-100">
                <div class="ml-4 flex-1">
                    <h4 class="text-sm font-medium text-gray-900">${item.product.name}</h4>
                    <p class="mt-1 text-sm text-gray-500">${formatPrice(item.product.price)}</p>
                    <div class="flex items-center mt-2">
                        <button class="text-gray-500 hover:text-gray-700 w-6 h-6 flex items-center justify-center border rounded-l" onclick="updateCartQty(${item.product.id}, -1)">-</button>
                        <span class="text-sm border-t border-b px-2 h-6 flex items-center justify-center">${item.quantity}</span>
                        <button class="text-gray-500 hover:text-gray-700 w-6 h-6 flex items-center justify-center border rounded-r" onclick="updateCartQty(${item.product.id}, 1)">+</button>
                    </div>
                </div>
                <div class="ml-4">
                    <button class="text-sm font-medium text-red-500 hover:text-red-700" onclick="removeFromCart(${item.product.id})">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
    }
    
    // Update Totals
    const formattedTotal = formatPrice(totalPrice);
    cartTotal.textContent = formattedTotal;
    checkoutTotal.textContent = formattedTotal;
}

// Event Listeners
function setupEventListeners() {
    // Cart Toggle
    cartBtn.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', (e) => {
        if (e.target === cartOverlay) closeCart();
    });
    
    // Navigation
    logoBtn.addEventListener('click', showMainView);
    
    // Checkout Flow
    checkoutBtn.addEventListener('click', () => {
        closeCart();
        showCheckoutView();
    });
    
    backToCartBtn.addEventListener('click', () => {
        showMainView();
        openCart();
    });
    
    continueShoppingBtn.addEventListener('click', () => {
        cart = [];
        updateCartUI();
        showMainView();
    });
    
    // Form Submission
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(checkoutForm);
        const name = formData.get('fullName');
        const phone = formData.get('phone');
        const address = formData.get('address');
        const paymentMethodValue = formData.get('paymentMethod');
        
        let paymentMethodText = '';
        switch(paymentMethodValue) {
            case 'momo': paymentMethodText = 'Mobile Money (MTN MoMo)'; break;
            case 'card': paymentMethodText = 'Credit/Debit Card'; break;
            case 'cod': paymentMethodText = 'Cash on Delivery'; break;
        }

        // Save Order and Customer to LocalStorage for Admin Panel
        const orderId = '#ORD-' + Math.floor(1000 + Math.random() * 9000);
        const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        
        let orders = JSON.parse(localStorage.getItem('aura_orders')) || [];
        orders.unshift({
            id: orderId,
            customer: name,
            date: dateStr,
            amount: cartTotal.textContent,
            status: 'Pending',
            statusColor: 'bg-yellow-100 text-yellow-800',
            items: cart.map(item => ({ name: item.product.name, quantity: item.quantity, price: item.product.price }))
        });
        localStorage.setItem('aura_orders', JSON.stringify(orders));

        let customers = JSON.parse(localStorage.getItem('aura_customers')) || [];
        let existingCustomer = customers.find(c => c.contact === phone);
        if (existingCustomer) {
            existingCustomer.orders += 1;
            // Simplified spent increment
        } else {
            customers.push({
                name: name,
                contact: phone,
                orders: 1,
                spent: cartTotal.textContent,
                joined: dateStr
            });
        }
        localStorage.setItem('aura_customers', JSON.stringify(customers));
        
        // Construct WhatsApp Message
        let message = `*New Order from Aura Kitchen* 🍳\n\n`;
        message += `*Customer Details:*\n`;
        message += `Name: ${name}\n`;
        message += `Phone: ${phone}\n`;
        message += `Delivery Address: ${address}\n\n`;
        
        message += `*Order Summary:*\n`;
        cart.forEach(item => {
            message += `- ${item.quantity}x ${item.product.name} (${formatPrice(item.product.price * item.quantity)})\n`;
        });
        
        message += `\n*Total Amount:* ${cartTotal.textContent}\n`;
        message += `*Payment Method:* ${paymentMethodText}\n`;
        
        // Encode message for URL
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/250792457573?text=${encodedMessage}`;
        
        // Open WhatsApp in a new tab
        window.open(whatsappUrl, '_blank');
        
        // Populate Confirmation Data
        document.getElementById('confirmName').textContent = name;
        document.getElementById('confirmTotal').textContent = cartTotal.textContent;
        document.getElementById('confirmPayment').textContent = paymentMethodText;
        document.getElementById('confirmAddress').textContent = address;
        
        // Reset Form
        checkoutForm.reset();
        
        // Show Confirmation
        showConfirmationView();
    });
}

// UI State Functions
function openCart() {
    cartOverlay.classList.remove('hidden');
    // small timeout to allow display:block to apply before transition
    setTimeout(() => {
        cartSidebar.classList.remove('translate-x-full');
    }, 10);
}

function closeCart() {
    cartSidebar.classList.add('translate-x-full');
    setTimeout(() => {
        cartOverlay.classList.add('hidden');
    }, 300); // match transition duration
}

function hideAllViews() {
    mainView.classList.add('hidden');
    checkoutView.classList.add('hidden');
    confirmationView.classList.add('hidden');
}

function showMainView() {
    hideAllViews();
    mainView.classList.remove('hidden');
    window.scrollTo(0, 0);
}

function showCheckoutView() {
    hideAllViews();
    checkoutView.classList.remove('hidden');
    window.scrollTo(0, 0);
}

function showConfirmationView() {
    hideAllViews();
    confirmationView.classList.remove('hidden');
    window.scrollTo(0, 0);
}

// Image Modal Functions
window.openImageModal = function(imageSrc) {
    const modal = document.getElementById('imageModal');
    const fullSizeImg = document.getElementById('fullSizeImage');
    if(modal && fullSizeImg) {
        fullSizeImg.src = imageSrc;
        modal.classList.remove('hidden');
    }
}

window.closeImageModal = function() {
    const modal = document.getElementById('imageModal');
    if(modal) {
        modal.classList.add('hidden');
    }
}

// Run app
init();
