// Mock Orders Data
const mockOrders = [
    { id: '#ORD-0024', customer: 'Jean Paul', date: 'Oct 26, 2026', amount: '25,500 RWF', status: 'Completed', statusColor: 'bg-green-100 text-green-800' },
    { id: '#ORD-0023', customer: 'Alice Mutoni', date: 'Oct 26, 2026', amount: '12,000 RWF', status: 'Processing', statusColor: 'bg-yellow-100 text-yellow-800' },
    { id: '#ORD-0022', customer: 'David N', date: 'Oct 25, 2026', amount: '45,000 RWF', status: 'Completed', statusColor: 'bg-green-100 text-green-800' },
    { id: '#ORD-0021', customer: 'Sarah K.', date: 'Oct 25, 2026', amount: '8,500 RWF', status: 'Pending', statusColor: 'bg-gray-100 text-gray-800' },
    { id: '#ORD-0020', customer: 'Mugisha E.', date: 'Oct 24, 2026', amount: '18,000 RWF', status: 'Completed', statusColor: 'bg-green-100 text-green-800' }
];

document.addEventListener('DOMContentLoaded', () => {
    
    // Set Product Count
    const productCountEl = document.getElementById('productCount');
    if (productCountEl && typeof products !== 'undefined') {
        productCountEl.textContent = products.length;
    }

    // Populate Orders Table
    const ordersTableBody = document.getElementById('ordersTableBody');
    if (ordersTableBody) {
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
                    <a href="#" class="text-emerald-600 hover:text-emerald-900">View</a>
                </td>
            `;
            ordersTableBody.appendChild(tr);
        });
    }

    // Populate Inventory Table
    const inventoryTableBody = document.getElementById('inventoryTableBody');
    if (inventoryTableBody && typeof products !== 'undefined') {
        products.forEach(product => {
            // Mock stock for UI presentation
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
                    <a href="#" class="text-emerald-600 hover:text-emerald-900 mr-3"><i class="fa-solid fa-pen-to-square"></i></a>
                    <a href="#" class="text-red-600 hover:text-red-900"><i class="fa-solid fa-trash"></i></a>
                </td>
            `;
            inventoryTableBody.appendChild(tr);
        });
    }
});
