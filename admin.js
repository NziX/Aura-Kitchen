// Mock Orders Data
const mockOrders = [
    { id: '#ORD-0024', customer: 'Jean Paul', date: 'Oct 26, 2026', amount: '25,500 RWF', status: 'Completed', statusColor: 'bg-green-100 text-green-800' },
    { id: '#ORD-0023', customer: 'Alice Mutoni', date: 'Oct 26, 2026', amount: '12,000 RWF', status: 'Processing', statusColor: 'bg-yellow-100 text-yellow-800' },
    { id: '#ORD-0022', customer: 'David N', date: 'Oct 25, 2026', amount: '45,000 RWF', status: 'Completed', statusColor: 'bg-green-100 text-green-800' },
    { id: '#ORD-0021', customer: 'Sarah K.', date: 'Oct 25, 2026', amount: '8,500 RWF', status: 'Pending', statusColor: 'bg-gray-100 text-gray-800' },
    { id: '#ORD-0020', customer: 'Mugisha E.', date: 'Oct 24, 2026', amount: '18,000 RWF', status: 'Completed', statusColor: 'bg-green-100 text-green-800' }
];

document.addEventListener('DOMContentLoaded', () => {
    renderDashboard();

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
            
            const newProduct = {
                id: Date.now(), // Generate a unique ID
                name: document.getElementById('newProductName').value,
                price: parseInt(document.getElementById('newProductPrice').value),
                image: document.getElementById('newProductImage').value,
                description: document.getElementById('newProductDesc').value
            };
            
            products.unshift(newProduct); // Add to beginning
            window.saveProducts(); // Save to localStorage
            
            closeModal();
            renderDashboard(); // Re-render the UI
            alert('Product added successfully!');
        });
    }

    // "View All" and Sidebar links validations
    const viewAllBtn = document.querySelector('button.text-emerald-600.hover\\:text-emerald-800');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', () => {
            alert('View All Orders page is not implemented yet.');
        });
    }

    const sidebarLinks = document.querySelectorAll('aside nav a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if(link.textContent.trim() !== 'Dashboard') {
                e.preventDefault();
                alert(link.textContent.trim() + ' section is not implemented yet.');
            }
        });
    });
});

function renderDashboard() {
    // Set Product Count
    const productCountEl = document.getElementById('productCount');
    if (productCountEl && typeof products !== 'undefined') {
        productCountEl.textContent = products.length;
    }

    // Populate Orders Table
    const ordersTableBody = document.getElementById('ordersTableBody');
    if (ordersTableBody) {
        ordersTableBody.innerHTML = ''; // Clear first
        mockOrders.forEach(order => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${order.id}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.customer}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.date}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">${order.amount}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.statusColor}">
                        ${order.status}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onclick="viewOrder('${order.id}')" class="text-emerald-600 hover:text-emerald-900">View</button>
                </td>
            `;
            ordersTableBody.appendChild(tr);
        });
    }

    // Populate Inventory Table
    const inventoryTableBody = document.getElementById('inventoryTableBody');
    if (inventoryTableBody && typeof products !== 'undefined') {
        inventoryTableBody.innerHTML = ''; // Clear first
        products.forEach(product => {
            const mockStock = Math.floor(Math.random() * 50) + 5; 
            const formattedPrice = product.price.toLocaleString('en-RW') + ' RWF';
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
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
                    ${formattedPrice}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span class="${mockStock < 10 ? 'text-red-600 font-medium' : 'text-gray-900'}">${mockStock} in stock</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onclick="editProduct(${product.id})" class="text-emerald-600 hover:text-emerald-900 mr-3" title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button onclick="deleteProduct(${product.id})" class="text-red-600 hover:text-red-900" title="Delete"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            inventoryTableBody.appendChild(tr);
        });
    }
}

// Global functions for inline onclick handlers
window.viewOrder = function(orderId) {
    alert('Viewing details for order ' + orderId);
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
