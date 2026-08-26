const defaultProducts = [
    {
        id: 1,
        name: "Minimalist Ceramic Plate",
        description: "Elegant, handcrafted ceramic plate perfect for everyday dining. Microwave and dishwasher safe.",
        price: 8500,
        image: "https://images.unsplash.com/photo-1614806687038-16eeb0135d46?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 2,
        name: "Matte Black Coffee Cup",
        description: "Start your morning right with this sleek, double-walled insulated coffee mug.",
        price: 4500,
        image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 3,
        name: "Non-stick Sauce Pan",
        description: "Premium aluminum sauce pan with an ergonomic wooden handle and glass lid.",
        price: 25000,
        image: "https://images.unsplash.com/photo-1584990347449-a6efa1a20078?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 4,
        name: "Bamboo Cutting Board",
        description: "Eco-friendly, durable bamboo cutting board. Gentle on your knives and easy to clean.",
        price: 12000,
        image: "https://images.unsplash.com/photo-1593001874117-c99c800e3eb7?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 5,
        name: "Stainless Steel Chef's Knife",
        description: "Professional grade 8-inch chef's knife for precision cutting, slicing, and dicing.",
        price: 18000,
        image: "https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 6,
        name: "Glass Storage Jars (Set of 3)",
        description: "Airtight glass jars with bamboo lids for keeping your pantry organized and fresh.",
        price: 15000,
        image: "https://images.unsplash.com/photo-1582215903038-661ffef691dc?auto=format&fit=crop&w=500&q=80"
    }
];

let products = JSON.parse(localStorage.getItem('aura_products'));
if (!products) {
    products = defaultProducts;
    localStorage.setItem('aura_products', JSON.stringify(products));
}

window.saveProducts = function() {
    localStorage.setItem('aura_products', JSON.stringify(products));
};
