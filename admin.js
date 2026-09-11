// Data from LocalStorage
let mockOrders = JSON.parse(localStorage.getItem('aura_orders')) || [];
let mockCustomers = JSON.parse(localStorage.getItem('aura_customers')) || [];

function saveAdminData() {
    localStorage.setItem('aura_orders', JSON.stringify(mockOrders));
    localStorage.setItem('aura_customers', JSON.stringify(mockCustomers));
}

document.addEventListener('DOMContentLoaded', () => {
    renderDashboard();
    setupNavigation();

    // Setup Add Product Modal
    const addProductBtn = document.getElementById('addProductBtn');
    const addProductModal = document.getElementById('addProductModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelModalBtn = document.getElementById('cancelModalBtn');
    const addProductForm = document.getElementById('addProductForm');

    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => {
            addProductModal.classList.remove('hidden');
        });
    }

    const closeModal = () => {
        addProductModal.classList.add('hidden');
        addProductForm.reset();
    };

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);

    if (addProductForm) {
        addProductForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const imageInput = document.getElementById('newProductImage');
            const file = imageInput.files[0];
            
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const newProduct = {
                        id: Date.now(), // Generate a unique ID
                        name: document.getElementById('newProductName').value,
                        price: parseInt(document.getElementById('newProductPrice').value),
                        image: e.target.result, // Base64 data URL
                        description: document.getElementById('newProductDesc').value
                    };
                    
                    products.unshift(newProduct); // Add to beginning
                    window.saveProducts(); // Save to localStorage
                    
                    closeModal();
                    renderDashboard(); // Re-render the UI
                };
                reader.readAsDataURL(file);
            }
        });
    }
});

function setupNavigation() {
    const navLinks = document.querySelectorAll('.sidebar-link, .nav-btn');
    const views = document.querySelectorAll('.view-section');
    const headerTitle = document.getElementById('topHeaderTitle');
    const sidebarNavLinks = document.querySelectorAll('.sidebar-link');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            if(!targetId) return;

            // Hide all views
            views.forEach(v => v.classList.add('hidden'));
            
            // Show target view
            document.getElementById(targetId).classList.remove('hidden');

            // Update sidebar active states
            sidebarNavLinks.forEach(sl => {
                sl.classList.remove('text-emerald-700', 'bg-emerald-50');
                sl.classList.add('text-gray-600');
                if (sl.getAttribute('data-target') === targetId) {
                    sl.classList.add('text-emerald-700', 'bg-emerald-50');
                    sl.classList.remove('text-gray-600');
                    // Update header title based on sidebar link text
                    if(headerTitle) {
                        const titleText = sl.querySelector('span').textContent;
                        headerTitle.textContent = titleText === 'Dashboard' ? 'Dashboard Overview' : titleText;
                    }
                }
            });
        });
    });
}

function renderDashboard() {
    // Set Product Count
    const productCountEl = document.getElementById('productCount');
    if (productCountEl && typeof products !== 'undefined') {
        productCountEl.textContent = products.length;
    }

    // 1. DASHBOARD SNIPPETS
    const dashOrdersBody = document.getElementById('dashOrdersBody');
    if (dashOrdersBody) {
        dashOrdersBody.innerHTML = '';
        mockOrders.slice(0, 3).forEach(order => { // Only show top 3 on dashboard
            dashOrdersBody.innerHTML += `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${order.id}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">${order.amount}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.statusColor}">${order.status}</span>
                    </td>
                </tr>
            `;
        });
    }

    const dashInventoryBody = document.getElementById('dashInventoryBody');
    if (dashInventoryBody && typeof products !== 'undefined') {
        dashInventoryBody.innerHTML = '';
        products.slice(0, 3).forEach(product => {
            dashInventoryBody.innerHTML += `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                            <img class="h-8 w-8 rounded-full object-cover mr-3" src="${product.image}" alt="">
                            <div class="text-sm font-medium text-gray-900">${product.name}</div>
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price.toLocaleString('en-RW')} RWF</td>
                </tr>
            `;
        });
    }

    // 2. FULL ORDERS TABLE
    const fullOrdersBody = document.getElementById('fullOrdersBody');
    if (fullOrdersBody) {
        fullOrdersBody.innerHTML = '';
        mockOrders.forEach(order => {
            fullOrdersBody.innerHTML += `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${order.id}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.customer}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.date}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">${order.amount}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.statusColor}">${order.status}</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onclick="viewOrder('${order.id}')" class="text-emerald-600 hover:text-emerald-900 mr-3">View</button>
                        <button onclick="deleteOrder('${order.id}')" class="text-red-600 hover:text-red-900" title="Delete"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });
    }

    // 3. FULL INVENTORY TABLE
    const fullInventoryBody = document.getElementById('fullInventoryBody');
    if (fullInventoryBody && typeof products !== 'undefined') {
        fullInventoryBody.innerHTML = '';
        products.forEach(product => {
            const mockStock = Math.floor(Math.random() * 50) + 5; 
            fullInventoryBody.innerHTML += `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                            <div class="flex-shrink-0 h-10 w-10">
                                <img class="h-10 w-10 rounded-full object-cover" src="${product.image}" alt="">
                            </div>
                            <div class="ml-4">
                                <div class="text-sm font-medium text-gray-900">${product.name}</div>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${product.price.toLocaleString('en-RW')} RWF
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span class="${mockStock < 10 ? 'text-red-600 font-medium' : 'text-gray-900'}">${mockStock} in stock</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onclick="editProduct(${product.id})" class="text-emerald-600 hover:text-emerald-900 mr-3" title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button onclick="deleteProduct(${product.id})" class="text-red-600 hover:text-red-900" title="Delete"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });
    }

    // 4. FULL CUSTOMERS TABLE
    const fullCustomersBody = document.getElementById('fullCustomersBody');
    if (fullCustomersBody) {
        fullCustomersBody.innerHTML = '';
        mockCustomers.forEach(customer => {
            fullCustomersBody.innerHTML += `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                            <div class="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mr-3">
                                ${customer.name.charAt(0)}
                            </div>
                            <div class="text-sm font-medium text-gray-900">${customer.name}</div>
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${customer.contact}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">${customer.orders}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">${customer.spent}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${customer.joined}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onclick="viewCustomer('${customer.name}')" class="text-emerald-600 hover:text-emerald-900 mr-3">View</button>
                        <button onclick="deleteCustomer('${customer.name}')" class="text-red-600 hover:text-red-900" title="Delete"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });
    }
}

// Global functions for inline onclick handlers
window.viewOrder = function(orderId) {
    const order = mockOrders.find(o => o.id === orderId);
    if(order) {
        let details = `Order ID: ${order.id}\nCustomer: ${order.customer}\nDate: ${order.date}\nAmount: ${order.amount}\nStatus: ${order.status}\n\nItems:\n`;
        if(order.items) {
            order.items.forEach(item => {
                details += `- ${item.quantity}x ${item.name} (${item.price} RWF each)\n`;
            });
        }
        alert(details);
    }
};

window.editProduct = function(productId) {
    alert('Edit functionality for product ID ' + productId + ' is coming soon.');
};

window.deleteProduct = function(productId) {
    if(confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== productId);
        window.saveProducts();
        renderDashboard();
    }
};

window.viewCustomer = function(customerName) {
    const customer = mockCustomers.find(c => c.name === customerName);
    if(customer) {
        alert(`Customer Profile:\n\nName: ${customer.name}\nContact: ${customer.contact}\nTotal Orders: ${customer.orders}\nTotal Spent: ${customer.spent}\nJoined: ${customer.joined}`);
    }
};

window.deleteOrder = function(orderId) {
    if(confirm('Are you sure you want to delete order ' + orderId + '?')) {
        mockOrders = mockOrders.filter(o => o.id !== orderId);
        saveAdminData();
        renderDashboard();
    }
};

window.deleteCustomer = function(customerName) {
    if(confirm('Are you sure you want to delete customer ' + customerName + '?')) {
        mockCustomers = mockCustomers.filter(c => c.name !== customerName);
        saveAdminData();
        renderDashboard();
    }
};
