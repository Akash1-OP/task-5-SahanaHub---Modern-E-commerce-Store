// Product Data
const products = [
    {
        id: '1',
        name: 'Wireless Bluetooth Headphones',
        price: 89.99,
        originalPrice: 129.99,
        description: 'Premium wireless headphones with active noise cancellation, superior sound quality, and 30-hour battery life. Perfect for music lovers and professionals.',
        image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
        images: [
            'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=600',
            'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=600',
            'https://images.pexels.com/photos/1037999/pexels-photo-1037999.jpeg?auto=compress&cs=tinysrgb&w=600'
        ],
        category: 'electronics',
        rating: 4.8,
        reviews: 342,
        inStock: true,
        features: ['Active Noise Cancellation', '30-hour Battery', 'Bluetooth 5.0', 'Quick Charge', 'Premium Materials']
    },
    {
        id: '2',
        name: 'Smart Fitness Watch',
        price: 249.99,
        description: 'Advanced fitness tracker with heart rate monitoring, GPS tracking, sleep analysis, and water resistance. Track your health 24/7.',
        image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400',
        images: [
            'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=600',
            'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=600'
        ],
        category: 'electronics',
        rating: 4.6,
        reviews: 156,
        inStock: true,
        features: ['Heart Rate Monitor', 'GPS Tracking', 'Sleep Analysis', 'Water Resistant', '7-Day Battery']
    },
    {
        id: '3',
        name: 'Organic Cotton T-Shirt',
        price: 24.99,
        description: 'Soft, comfortable t-shirt made from 100% organic cotton. Sustainable fashion that feels great and looks even better.',
        image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'clothing',
        rating: 4.4,
        reviews: 89,
        inStock: true,
        features: ['100% Organic Cotton', 'Pre-shrunk', 'Machine Washable', 'Available in 5 Colors', 'Sustainable']
    },
    {
        id: '4',
        name: 'Professional Camera Lens',
        price: 599.99,
        description: 'High-quality 50mm prime lens for professional photography. Exceptional sharpness, beautiful bokeh, and superior build quality.',
        image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'electronics',
        rating: 4.9,
        reviews: 203,
        inStock: true,
        features: ['50mm Prime', 'f/1.8 Aperture', 'Ultra Sharp', 'Weather Sealed', 'Professional Grade']
    },
    {
        id: '5',
        name: 'Minimalist Desk Lamp',
        price: 79.99,
        originalPrice: 99.99,
        description: 'Sleek LED desk lamp with adjustable brightness, color temperature control, and modern minimalist design.',
        image: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'home',
        rating: 4.5,
        reviews: 124,
        inStock: true,
        features: ['LED Technology', 'Adjustable Brightness', 'Color Temperature Control', 'USB Charging Port', 'Touch Controls']
    },
    {
        id: '6',
        name: 'Premium Coffee Beans',
        price: 19.99,
        description: 'Artisan roasted coffee beans from single-origin farms. Rich, full-bodied flavor with notes of chocolate and caramel.',
        image: 'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'food',
        rating: 4.7,
        reviews: 67,
        inStock: true,
        features: ['Single Origin', 'Artisan Roasted', 'Fair Trade', 'Whole Bean or Ground', 'Fresh Roasted']
    },
    {
        id: '7',
        name: 'Luxury Skincare Set',
        price: 149.99,
        description: 'Complete skincare routine with cleanser, serum, and moisturizer. Made with natural ingredients for healthy, glowing skin.',
        image: 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'beauty',
        rating: 4.6,
        reviews: 234,
        inStock: true,
        features: ['Natural Ingredients', 'Complete Routine', 'Dermatologist Tested', 'Cruelty Free', 'Anti-Aging']
    },
    {
        id: '8',
        name: 'Ergonomic Office Chair',
        price: 299.99,
        description: 'Comfortable office chair with lumbar support, adjustable height, and breathable mesh design for long work sessions.',
        image: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'home',
        rating: 4.8,
        reviews: 445,
        inStock: false,
        features: ['Lumbar Support', 'Adjustable Height', 'Breathable Mesh', '5-Year Warranty', 'Ergonomic Design']
    },
    {
        id: '9',
        name: 'Wireless Phone Charger',
        price: 39.99,
        originalPrice: 59.99,
        description: 'Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicator.',
        image: 'https://images.pexels.com/photos/4195504/pexels-photo-4195504.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'electronics',
        rating: 4.3,
        reviews: 198,
        inStock: true,
        features: ['Qi Compatible', 'Fast Charging', 'LED Indicator', 'Non-Slip Base', 'Case Friendly']
    },
    {
        id: '10',
        name: 'Designer Sunglasses',
        price: 129.99,
        description: 'Stylish designer sunglasses with UV protection and polarized lenses. Perfect for any occasion.',
        image: 'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'clothing',
        rating: 4.5,
        reviews: 87,
        inStock: true,
        features: ['UV Protection', 'Polarized Lenses', 'Designer Frame', 'Lightweight', 'Case Included']
    },
    {
        id: '11',
        name: 'Ceramic Plant Pot Set',
        price: 34.99,
        description: 'Beautiful set of three ceramic plant pots with drainage holes. Perfect for indoor plants and herbs.',
        image: 'https://images.pexels.com/photos/1487511/pexels-photo-1487511.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'home',
        rating: 4.2,
        reviews: 76,
        inStock: true,
        features: ['Set of 3', 'Drainage Holes', 'Ceramic Material', 'Multiple Sizes', 'Modern Design']
    },
    {
        id: '12',
        name: 'Gourmet Chocolate Box',
        price: 45.99,
        description: 'Premium assorted chocolate collection with 24 handcrafted pieces. Perfect gift for chocolate lovers.',
        image: 'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'food',
        rating: 4.8,
        reviews: 145,
        inStock: true,
        features: ['24 Pieces', 'Handcrafted', 'Premium Cocoa', 'Gift Box', 'Assorted Flavors']
    }
];

// Make products available globally
window.products = products;