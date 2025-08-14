// E-commerce Application JavaScript
class ECommerceApp {
    constructor() {
        this.products = window.products || [];
        this.cart = this.loadFromStorage('cart') || [];
        this.wishlist = this.loadFromStorage('wishlist') || [];
        this.currentFilter = 'all';
        this.currentSort = 'featured';
        this.searchTerm = '';
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.renderProducts();
        this.updateCartUI();
        this.updateWishlistUI();
        this.lazyLoadImages();
    }
    
    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        
        searchInput.addEventListener('input', this.debounce((e) => {
            this.searchTerm = e.target.value;
            this.renderProducts();
        }, 300));
        
        searchBtn.addEventListener('click', () => {
            this.searchTerm = searchInput.value;
            this.renderProducts();
        });
        
        // Category filter
        const categoryBtns = document.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                categoryBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.category;
                this.renderProducts();
            });
        });
        
        // Sort functionality
        const sortSelect = document.getElementById('sortSelect');
        sortSelect.addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.renderProducts();
        });
        
        // Cart sidebar
        const cartBtn = document.getElementById('cartBtn');
        const cartSidebar = document.getElementById('cartSidebar');
        const closeCart = document.getElementById('closeCart');
        
        cartBtn.addEventListener('click', () => {
            cartSidebar.classList.add('open');
        });
        
        closeCart.addEventListener('click', () => {
            cartSidebar.classList.remove('open');
        });
        
        // Wishlist button
        const wishlistBtn = document.getElementById('wishlistBtn');
        wishlistBtn.addEventListener('click', () => {
            this.showToast('Wishlist', `You have ${this.wishlist.length} items in your wishlist`, 'success');
        });
        
        // Product modal
        const modalOverlay = document.getElementById('modalOverlay');
        const closeModal = document.getElementById('closeModal');
        
        closeModal.addEventListener('click', () => {
            modalOverlay.classList.remove('show');
        });
        
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('show');
            }
        });
        
        // Modal quantity controls
        const decreaseQty = document.getElementById('decreaseQty');
        const increaseQty = document.getElementById('increaseQty');
        const modalQuantity = document.getElementById('modalQuantity');
        
        decreaseQty.addEventListener('click', () => {
            const currentValue = parseInt(modalQuantity.value);
            if (currentValue > 1) {
                modalQuantity.value = currentValue - 1;
            }
        });
        
        increaseQty.addEventListener('click', () => {
            const currentValue = parseInt(modalQuantity.value);
            if (currentValue < 10) {
                modalQuantity.value = currentValue + 1;
            }
        });
        
        // Checkout functionality
        const checkoutBtn = document.getElementById('checkoutBtn');
        const checkoutOverlay = document.getElementById('checkoutOverlay');
        const closeCheckout = document.getElementById('closeCheckout');
        const checkoutForm = document.getElementById('checkoutForm');
        
        checkoutBtn.addEventListener('click', () => {
            this.renderCheckout();
            checkoutOverlay.classList.add('show');
        });
        
        closeCheckout.addEventListener('click', () => {
            checkoutOverlay.classList.remove('show');
        });
        
        checkoutOverlay.addEventListener('click', (e) => {
            if (e.target === checkoutOverlay) {
                checkoutOverlay.classList.remove('show');
            }
        });
        
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.processOrder();
        });
        
        // Form validation
        const formInputs = checkoutForm.querySelectorAll('input[required]');
        formInputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    getFilteredProducts() {
        let filtered = [...this.products];
        
        // Apply category filter
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(product => product.category === this.currentFilter);
        }
        
        // Apply search filter
        if (this.searchTerm) {
            const search = this.searchTerm.toLowerCase();
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(search) ||
                product.description.toLowerCase().includes(search) ||
                product.category.toLowerCase().includes(search)
            );
        }
        
        // Apply sorting
        switch (this.currentSort) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                filtered.reverse();
                break;
            default:
                // Featured - no sorting needed
                break;
        }
        
        return filtered;
    }
    
    renderProducts() {
        const productsGrid = document.getElementById('productsGrid');
        const noResults = document.getElementById('noResults');
        const resultsCount = document.getElementById('resultsCount');
        
        const filtered = this.getFilteredProducts();
        
        if (filtered.length === 0) {
            productsGrid.innerHTML = '';
            noResults.style.display = 'block';
            resultsCount.textContent = 'No products found';
            return;
        }
        
        noResults.style.display = 'none';
        resultsCount.textContent = `${filtered.length} Products`;
        
        productsGrid.innerHTML = filtered.map(product => this.createProductCard(product)).join('');
        
        // Setup product card event listeners
        this.setupProductCardListeners();
        
        // Re-initialize lazy loading for new images
        this.lazyLoadImages();
    }
    
    createProductCard(product) {
        const discount = product.originalPrice ? 
            Math.round((1 - product.price / product.originalPrice) * 100) : 0;
        
        const isWishlisted = this.wishlist.includes(product.id);
        
        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image-container">
                    <img 
                        src="${product.image}" 
                        alt="${product.name}"
                        class="product-image lazy-loading"
                        loading="lazy"
                    >
                    <button class="wishlist-toggle ${isWishlisted ? 'active' : ''}" 
                            data-product-id="${product.id}">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                            <path d="20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                    ${discount > 0 ? `<div class="discount-badge">${discount}% OFF</div>` : ''}
                    ${!product.inStock ? '<div class="out-of-stock-overlay">Out of Stock</div>' : ''}
                </div>
                <div class="product-details">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-rating">
                        <div class="stars">
                            ${this.renderStars(product.rating)}
                        </div>
                        <span class="rating-count">${product.rating} (${product.reviews})</span>
                    </div>
                    <div class="product-price">
                        <span class="current-price">$${product.price.toFixed(2)}</span>
                        ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                    </div>
                    <button class="add-to-cart-btn" 
                            data-product-id="${product.id}"
                            ${!product.inStock ? 'disabled' : ''}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                        ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                </div>
            </div>
        `;
    }
    
    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '';
        
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars += '<svg class="star filled" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon></svg>';
            } else if (i === fullStars && hasHalfStar) {
                stars += '<svg class="star filled" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon></svg>';
            } else {
                stars += '<svg class="star" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon></svg>';
            }
        }
        
        return stars;
    }
    
    setupProductCardListeners() {
        // Product card click (open modal)
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.wishlist-toggle') && !e.target.closest('.add-to-cart-btn')) {
                    const productId = card.dataset.productId;
                    this.openProductModal(productId);
                }
            });
        });
        
        // Add to cart buttons
        const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!btn.disabled) {
                    const productId = btn.dataset.productId;
                    this.addToCart(productId, 1);
                    
                    // Visual feedback
                    btn.classList.add('adding');
                    btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"></path><circle cx="12" cy="12" r="10"></circle></svg> Added!';
                    
                    setTimeout(() => {
                        btn.classList.remove('adding');
                        btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg> Add to Cart';
                    }, 1000);
                }
            });
        });
        
        // Wishlist toggle buttons
        const wishlistBtns = document.querySelectorAll('.wishlist-toggle');
        wishlistBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = btn.dataset.productId;
                this.toggleWishlist(productId);
            });
        });
    }
    
    openProductModal(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        const modal = document.getElementById('productModal');
        const modalOverlay = document.getElementById('modalOverlay');
        
        // Update modal content
        document.getElementById('modalTitle').textContent = product.name;
        document.getElementById('modalImage').src = product.image;
        document.getElementById('modalImage').alt = product.name;
        document.getElementById('modalDescription').textContent = product.description;
        document.getElementById('modalPrice').textContent = `$${product.price.toFixed(2)}`;
        document.getElementById('modalStars').innerHTML = this.renderStars(product.rating);
        document.getElementById('modalReviews').textContent = `${product.rating} (${product.reviews} reviews)`;
        
        // Handle original price and discount
        const originalPriceEl = document.getElementById('modalOriginalPrice');
        const discountEl = document.getElementById('modalDiscount');
        
        if (product.originalPrice) {
            originalPriceEl.textContent = `$${product.originalPrice.toFixed(2)}`;
            originalPriceEl.style.display = 'inline';
            const discount = Math.round((1 - product.price / product.originalPrice) * 100);
            discountEl.textContent = `${discount}% OFF`;
            discountEl.style.display = 'inline';
        } else {
            originalPriceEl.style.display = 'none';
            discountEl.style.display = 'none';
        }
        
        // Handle features
        const featuresEl = document.getElementById('modalFeatures');
        if (product.features && product.features.length > 0) {
            featuresEl.innerHTML = `
                <h4>Features</h4>
                <ul>
                    ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            `;
            featuresEl.style.display = 'block';
        } else {
            featuresEl.style.display = 'none';
        }
        
        // Handle image gallery
        const galleryEl = document.getElementById('imageGallery');
        if (product.images && product.images.length > 1) {
            galleryEl.innerHTML = product.images.map((img, index) => 
                `<img src="${img}" alt="${product.name}" class="gallery-thumb ${index === 0 ? 'active' : ''}" data-main-image="${img}">`
            ).join('');
            
            // Gallery thumb listeners
            const thumbs = galleryEl.querySelectorAll('.gallery-thumb');
            thumbs.forEach(thumb => {
                thumb.addEventListener('click', (e) => {
                    thumbs.forEach(t => t.classList.remove('active'));
                    e.target.classList.add('active');
                    document.getElementById('modalImage').src = e.target.dataset.mainImage;
                });
            });
        } else {
            galleryEl.innerHTML = '';
        }
        
        // Update wishlist button
        const modalWishlistBtn = document.getElementById('modalWishlist');
        const isWishlisted = this.wishlist.includes(productId);
        modalWishlistBtn.classList.toggle('active', isWishlisted);
        
        // Update add to cart button
        const modalAddToCartBtn = document.getElementById('modalAddToCart');
        modalAddToCartBtn.disabled = !product.inStock;
        if (!product.inStock) {
            modalAddToCartBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg> Out of Stock';
        }
        
        // Reset quantity
        document.getElementById('modalQuantity').value = 1;
        
        // Setup modal-specific listeners
        this.setupModalListeners(productId);
        
        // Show modal
        modalOverlay.classList.add('show');
    }
    
    setupModalListeners(productId) {
        const modalAddToCartBtn = document.getElementById('modalAddToCart');
        const modalWishlistBtn = document.getElementById('modalWishlist');
        
        // Remove existing listeners
        modalAddToCartBtn.replaceWith(modalAddToCartBtn.cloneNode(true));
        modalWishlistBtn.replaceWith(modalWishlistBtn.cloneNode(true));
        
        // Get new references
        const newModalAddToCartBtn = document.getElementById('modalAddToCart');
        const newModalWishlistBtn = document.getElementById('modalWishlist');
        
        newModalAddToCartBtn.addEventListener('click', () => {
            const quantity = parseInt(document.getElementById('modalQuantity').value);
            this.addToCart(productId, quantity);
            
            // Visual feedback
            newModalAddToCartBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"></path><circle cx="12" cy="12" r="10"></circle></svg> Added to Cart!';
            
            setTimeout(() => {
                newModalAddToCartBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg> Add to Cart';
            }, 2000);
        });
        
        newModalWishlistBtn.addEventListener('click', () => {
            this.toggleWishlist(productId);
            newModalWishlistBtn.classList.toggle('active', this.wishlist.includes(productId));
        });
    }
    
    addToCart(productId, quantity = 1) {
        const product = this.products.find(p => p.id === productId);
        if (!product || !product.inStock) return;
        
        const existingItem = this.cart.find(item => item.productId === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                productId,
                quantity,
                addedAt: Date.now()
            });
        }
        
        this.saveToStorage('cart', this.cart);
        this.updateCartUI();
        this.showToast('Added to Cart', `${product.name} has been added to your cart`, 'success');
    }
    
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.productId !== productId);
        this.saveToStorage('cart', this.cart);
        this.updateCartUI();
        this.showToast('Removed from Cart', 'Item has been removed from your cart', 'success');
    }
    
    updateCartQuantity(productId, quantity) {
        if (quantity <= 0) {
            this.removeFromCart(productId);
            return;
        }
        
        const cartItem = this.cart.find(item => item.productId === productId);
        if (cartItem) {
            cartItem.quantity = quantity;
            this.saveToStorage('cart', this.cart);
            this.updateCartUI();
        }
    }
    
    updateCartUI() {
        const cartCount = document.getElementById('cartCount');
        const cartItems = document.getElementById('cartItems');
        const cartSubtotal = document.getElementById('cartSubtotal');
        const cartTax = document.getElementById('cartTax');
        const cartTotal = document.getElementById('cartTotal');
        const checkoutBtn = document.getElementById('checkoutBtn');
        
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = this.getCartSubtotal();
        const tax = subtotal * 0.08; // 8% tax
        const total = subtotal + tax;
        
        // Update cart count
        cartCount.textContent = totalItems;
        cartCount.classList.toggle('show', totalItems > 0);
        
        // Update cart totals
        cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        cartTax.textContent = `$${tax.toFixed(2)}`;
        cartTotal.textContent = `$${total.toFixed(2)}`;
        
        // Enable/disable checkout button
        checkoutBtn.disabled = this.cart.length === 0;
        
        // Render cart items
        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                    <h3>Your cart is empty</h3>
                    <p>Add some products to get started!</p>
                </div>
            `;
        } else {
            cartItems.innerHTML = this.cart.map(item => this.createCartItem(item)).join('');
            this.setupCartItemListeners();
        }
    }
    
    createCartItem(cartItem) {
        const product = this.products.find(p => p.id === cartItem.productId);
        if (!product) return '';
        
        const itemTotal = product.price * cartItem.quantity;
        
        return `
            <div class="cart-item" data-product-id="${product.id}">
                <img src="${product.image}" alt="${product.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-name">${product.name}</div>
                    <div class="cart-item-price">$${product.price.toFixed(2)} each</div>
                    <div class="cart-item-controls">
                        <button class="qty-btn decrease-qty" data-product-id="${product.id}">-</button>
                        <input type="number" class="qty-input" value="${cartItem.quantity}" min="1" max="10" data-product-id="${product.id}">
                        <button class="qty-btn increase-qty" data-product-id="${product.id}">+</button>
                        <button class="remove-item" data-product-id="${product.id}">Remove</button>
                    </div>
                </div>
                <div class="cart-item-total">$${itemTotal.toFixed(2)}</div>
            </div>
        `;
    }
    
    setupCartItemListeners() {
        // Quantity controls
        const decreaseBtns = document.querySelectorAll('.decrease-qty');
        const increaseBtns = document.querySelectorAll('.increase-qty');
        const qtyInputs = document.querySelectorAll('.qty-input');
        const removeButtons = document.querySelectorAll('.remove-item');
        
        decreaseBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = btn.dataset.productId;
                const cartItem = this.cart.find(item => item.productId === productId);
                if (cartItem && cartItem.quantity > 1) {
                    this.updateCartQuantity(productId, cartItem.quantity - 1);
                }
            });
        });
        
        increaseBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = btn.dataset.productId;
                const cartItem = this.cart.find(item => item.productId === productId);
                if (cartItem && cartItem.quantity < 10) {
                    this.updateCartQuantity(productId, cartItem.quantity + 1);
                }
            });
        });
        
        qtyInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                const productId = input.dataset.productId;
                const quantity = parseInt(e.target.value);
                if (quantity >= 1 && quantity <= 10) {
                    this.updateCartQuantity(productId, quantity);
                }
            });
        });
        
        removeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = btn.dataset.productId;
                this.removeFromCart(productId);
            });
        });
    }
    
    getCartSubtotal() {
        return this.cart.reduce((sum, item) => {
            const product = this.products.find(p => p.id === item.productId);
            return sum + (product ? product.price * item.quantity : 0);
        }, 0);
    }
    
    toggleWishlist(productId) {
        const index = this.wishlist.indexOf(productId);
        const product = this.products.find(p => p.id === productId);
        
        if (index > -1) {
            this.wishlist.splice(index, 1);
            this.showToast('Removed from Wishlist', `${product.name} has been removed from your wishlist`, 'success');
        } else {
            this.wishlist.push(productId);
            this.showToast('Added to Wishlist', `${product.name} has been added to your wishlist`, 'success');
        }
        
        this.saveToStorage('wishlist', this.wishlist);
        this.updateWishlistUI();
        this.renderProducts(); // Re-render to update wishlist buttons
    }
    
    updateWishlistUI() {
        const wishlistCount = document.getElementById('wishlistCount');
        wishlistCount.textContent = this.wishlist.length;
        wishlistCount.classList.toggle('show', this.wishlist.length > 0);
    }
    
    renderCheckout() {
        const checkoutItems = document.getElementById('checkoutItems');
        const checkoutSubtotal = document.getElementById('checkoutSubtotal');
        const checkoutTax = document.getElementById('checkoutTax');
        const checkoutTotal = document.getElementById('checkoutTotal');
        
        const subtotal = this.getCartSubtotal();
        const tax = subtotal * 0.08;
        const total = subtotal + tax;
        
        checkoutSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        checkoutTax.textContent = `$${tax.toFixed(2)}`;
        checkoutTotal.textContent = `$${total.toFixed(2)}`;
        
        checkoutItems.innerHTML = this.cart.map(item => {
            const product = this.products.find(p => p.id === item.productId);
            if (!product) return '';
            
            return `
                <div class="summary-item">
                    <img src="${product.image}" alt="${product.name}" class="summary-item-image">
                    <div class="summary-item-details">
                        <div class="summary-item-name">${product.name}</div>
                        <div class="summary-item-quantity">Qty: ${item.quantity}</div>
                    </div>
                    <div class="summary-item-price">$${(product.price * item.quantity).toFixed(2)}</div>
                </div>
            `;
        }).join('');
    }
    
    validateField(input) {
        const value = input.value.trim();
        const type = input.type;
        const name = input.name;
        let isValid = true;
        let message = '';
        
        if (!value) {
            isValid = false;
            message = 'This field is required';
        } else {
            switch (type) {
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        isValid = false;
                        message = 'Please enter a valid email address';
                    }
                    break;
                case 'text':
                    if (name === 'cardNumber') {
                        const cardRegex = /^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/;
                        if (!cardRegex.test(value)) {
                            isValid = false;
                            message = 'Please enter a valid card number';
                        }
                    } else if (name === 'expiryDate') {
                        const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
                        if (!expiryRegex.test(value)) {
                            isValid = false;
                            message = 'Please enter a valid expiry date (MM/YY)';
                        }
                    } else if (name === 'cvv') {
                        const cvvRegex = /^\d{3,4}$/;
                        if (!cvvRegex.test(value)) {
                            isValid = false;
                            message = 'Please enter a valid CVV';
                        }
                    } else if (name === 'zipCode') {
                        const zipRegex = /^\d{5}(-\d{4})?$/;
                        if (!zipRegex.test(value)) {
                            isValid = false;
                            message = 'Please enter a valid ZIP code';
                        }
                    }
                    break;
            }
        }
        
        const errorElement = input.parentElement.querySelector('.error-message');
        if (isValid) {
            input.classList.remove('error');
            errorElement.textContent = '';
        } else {
            input.classList.add('error');
            errorElement.textContent = message;
        }
        
        return isValid;
    }
    
    clearFieldError(input) {
        input.classList.remove('error');
        const errorElement = input.parentElement.querySelector('.error-message');
        errorElement.textContent = '';
    }
    
    processOrder() {
        const form = document.getElementById('checkoutForm');
        const formData = new FormData(form);
        const formInputs = form.querySelectorAll('input[required]');
        
        // Validate all fields
        let isFormValid = true;
        formInputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });
        
        if (!isFormValid) {
            this.showToast('Validation Error', 'Please correct the errors in the form', 'error');
            return;
        }
        
        // Simulate order processing
        const placeOrderBtn = document.querySelector('.place-order-btn');
        placeOrderBtn.disabled = true;
        placeOrderBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="animate-spin">
                <path d="M21 12a9 9 0 11-6.219-8.56"></path>
            </svg>
            Processing Order...
        `;
        
        setTimeout(() => {
            // Clear cart
            this.cart = [];
            this.saveToStorage('cart', this.cart);
            this.updateCartUI();
            
            // Close modals
            document.getElementById('checkoutOverlay').classList.remove('show');
            document.getElementById('cartSidebar').classList.remove('open');
            
            // Show success message
            this.showToast('Order Placed!', 'Your order has been successfully placed', 'success');
            
            // Reset button
            placeOrderBtn.disabled = false;
            placeOrderBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 12l2 2 4-4"></path>
                    <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.66 0 3.22.45 4.56 1.24"></path>
                </svg>
                Place Order
            `;
            
            // Reset form
            form.reset();
        }, 2000);
    }
    
    showToast(title, message, type = 'success') {
        const toastContainer = document.getElementById('toastContainer');
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        toast.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                ${type === 'success' ? '<path d="M9 12l2 2 4-4"></path><path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.66 0 3.22.45 4.56 1.24"></path>' : 
                  type === 'error' ? '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>' : 
                  '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>'}
            </svg>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;
        
        toastContainer.appendChild(toast);
        
        // Close button functionality
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            toast.remove();
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
    }
    
    lazyLoadImages() {
        const images = document.querySelectorAll('.product-image.lazy-loading');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.addEventListener('load', () => {
                        img.classList.remove('lazy-loading');
                        img.classList.add('lazy-loaded');
                    });
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
        }
    }
    
    loadFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Failed to load from localStorage:', e);
            return null;
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ECommerceApp();
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .animate-spin {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);