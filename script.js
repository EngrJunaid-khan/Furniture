// ===== CONFIGURATION =====
const CONFIG = {
    whatsappNumber: '00966550661689',
    cartStorageKey: 'elite_furniture_cart',
    slideDuration: 5000,
    currency: 'SAR'
};

// ===== PRODUCT DATA =====
const products = [
    {
        id: 1,
        name: "Modern Leather Sofa",
        category: "living",
        price: 1299,
        originalPrice: 1599,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        description: "Premium Italian leather sofa with comfortable cushions",
        features: ["Italian Leather", "Stainless Steel", "Premium Cushions"],
        stock: 10
    },
    {
        id: 2,
        name: "Royal King Bed",
        category: "bedroom",
        price: 2499,
        originalPrice: 2999,
        rating: 5,
        image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        description: "Solid oak king size bed with luxurious headboard",
        features: ["Solid Oak", "Upholstered", "King Size"],
        stock: 5
    },
    {
        id: 3,
        name: "Dining Table Set",
        category: "dining",
        price: 1599,
        originalPrice: 1999,
        rating: 4,
        image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        description: "6-seater dining table with matching chairs",
        features: ["6 Seater", "Tempered Glass", "Matching Chairs"],
        stock: 8
    },
    {
        id: 4,
        name: "Ergonomic Office Chair",
        category: "office",
        price: 499,
        originalPrice: 699,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        description: "Adjustable office chair with lumbar support",
        features: ["Lumbar Support", "Breathable Mesh", "Adjustable"],
        stock: 15
    },
    {
        id: 5,
        name: "Sectional Sofa Set",
        category: "living",
        price: 2199,
        originalPrice: 2699,
        rating: 4,
        image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        description: "L-shaped sectional sofa with chaise",
        features: ["L-Shaped", "Storage", "Chaise"],
        stock: 6
    },
    {
        id: 6,
        name: "Nightstand Set",
        category: "bedroom",
        price: 349,
        originalPrice: 449,
        rating: 4,
        image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        description: "Set of 2 modern nightstands",
        features: ["Set of 2", "Soft-close", "Modern"],
        stock: 12
    },
    {
        id: 7,
        name: "Buffet Cabinet",
        category: "dining",
        price: 799,
        originalPrice: 999,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1605774337664-7a846e9cdf17?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        description: "Wooden buffet cabinet with glass doors",
        features: ["Glass Doors", "LED Lighting", "Wooden"],
        stock: 7
    },
    {
        id: 8,
        name: "Executive Desk",
        category: "office",
        price: 899,
        originalPrice: 1199,
        rating: 5,
        image: "https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        description: "Large executive desk with cable management",
        features: ["Cable Management", "Built-in Power", "Large"],
        stock: 4
    }
];

// ===== STATE MANAGEMENT =====
let cart = [];
let currentSlide = 0;
let slideInterval;
let currentFilter = 'all';

// ===== DOM ELEMENTS =====
const elements = {
    // Navigation
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    navMenu: document.getElementById('navMenu'),
    cartIcon: document.getElementById('cartIcon'),
    cartCount: document.getElementById('cartCount'),
    
    // Cart
    cartSidebar: document.getElementById('cartSidebar'),
    cartClose: document.getElementById('cartClose'),
    cartItems: document.getElementById('cartItems'),
    cartTotal: document.getElementById('cartTotal'),
    checkoutBtn: document.getElementById('checkoutBtn'),
    continueShopping: document.getElementById('continueShopping'),
    
    // Slider
    slidePrev: document.getElementById('slidePrev'),
    slideNext: document.getElementById('slideNext'),
    dots: document.querySelectorAll('.dot'),
    
    // Products
    productsGrid: document.getElementById('productsGrid'),
    filterBtns: document.querySelectorAll('.filter-btn'),
    
    // Forms
    inquiryForm: document.getElementById('inquiryForm'),
    
    // WhatsApp
    whatsappBtn: document.getElementById('whatsappBtn'),
    
    // Toast
    toast: document.getElementById('toast')
};

// ===== UTILITY FUNCTIONS =====
function formatPrice(price) {
    return `SAR ${price.toLocaleString('en-SA')}`;
}

function showToast(message, type = 'success') {
    const toast = elements.toast;
    toast.textContent = message;
    toast.className = 'toast';
    
    // Set color based on type
    if (type === 'error') {
        toast.style.backgroundColor = 'var(--danger)';
    } else if (type === 'warning') {
        toast.style.backgroundColor = 'var(--warning)';
        toast.style.color = 'var(--dark)';
    } else {
        toast.style.backgroundColor = 'var(--success)';
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===== CART FUNCTIONS =====
function loadCart() {
    const savedCart = localStorage.getItem(CONFIG.cartStorageKey);
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

function saveCart() {
    localStorage.setItem(CONFIG.cartStorageKey, JSON.stringify(cart));
}

function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    saveCart();
    updateCartCount();
    showToast(`${product.name} added to cart!`);
    
    if (elements.cartSidebar.classList.contains('active')) {
        updateCartDisplay();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    updateCartDisplay();
    showToast('Item removed from cart', 'error');
}

function updateQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (quantity < 1) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            saveCart();
            updateCartDisplay();
        }
    }
}

function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    elements.cartCount.textContent = totalItems;
}

function updateCartDisplay() {
    const cartItems = elements.cartItems;
    const cartTotal = elements.cartTotal;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        cartTotal.textContent = formatPrice(0);
        return;
    }
    
    let itemsHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        itemsHTML += `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <div class="cart-item-price">${formatPrice(item.price)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" 
                               onchange="updateQuantity(${item.id}, parseInt(this.value) || 1)">
                        <button class="quantity-btn plus" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    cartItems.innerHTML = itemsHTML;
    cartTotal.textContent = formatPrice(total);
    
    // Update WhatsApp checkout link
    const checkoutBtn = elements.checkoutBtn;
    const cartSummary = cart.map(item => 
        `${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`
    ).join('%0A');
    
    const message = `Order Inquiry:%0A%0A${cartSummary}%0A%0ATotal: ${formatPrice(total)}%0A%0APlease contact me to proceed with this order.`;
    checkoutBtn.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${message}`;
}

// ===== SLIDER FUNCTIONS =====
function showSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;
}

function nextSlide() {
    const slides = document.querySelectorAll('.slide');
    const nextIndex = (currentSlide + 1) % slides.length;
    showSlide(nextIndex);
}

function prevSlide() {
    const slides = document.querySelectorAll('.slide');
    const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prevIndex);
}

function startSlider() {
    slideInterval = setInterval(nextSlide, CONFIG.slideDuration);
}

function stopSlider() {
    clearInterval(slideInterval);
}

// ===== PRODUCT FUNCTIONS =====
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

function renderProducts(filter = 'all') {
    const productsGrid = elements.productsGrid;
    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(product => product.category === filter);
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products" style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <h3 style="color: var(--primary); margin-bottom: 1rem;">No products found</h3>
                <p style="color: var(--gray);">Please select another category</p>
            </div>
        `;
        return;
    }
    
    let productsHTML = '';
    
    filteredProducts.forEach(product => {
        const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
        const stars = generateStars(product.rating);
        
        productsHTML += `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    ${discount > 0 ? `<span class="product-badge">${discount}% OFF</span>` : ''}
                </div>
                <div class="product-content">
                    <div class="product-category">${product.category.toUpperCase()}</div>
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    
                    <div class="product-price">
                        <span class="current-price">${formatPrice(product.price)}</span>
                        ${product.originalPrice > product.price ? 
                            `<span class="original-price">${formatPrice(product.originalPrice)}</span>` : ''}
                        ${discount > 0 ? `<span class="discount-badge">${discount}% OFF</span>` : ''}
                    </div>
                    
                    <div class="product-rating">
                        ${stars}
                        <span style="color: var(--gray); margin-left: 5px;">(${product.rating})</span>
                    </div>
                    
                    <div class="product-actions">
                        <button class="btn btn-primary add-to-cart" data-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                        <a href="https://wa.me/${CONFIG.whatsappNumber}?text=I'm interested in ${encodeURIComponent(product.name)} - ${formatPrice(product.price)}" 
                           class="btn btn-whatsapp" 
                           target="_blank">
                            <i class="fab fa-whatsapp"></i> Inquire
                        </a>
                    </div>
                </div>
            </div>
        `;
    });
    
    productsGrid.innerHTML = productsHTML;
    
    // Add event listeners to new cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// ===== FORM FUNCTIONS =====
function setupForm() {
    const form = elements.inquiryForm;
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const interest = document.getElementById('interest').value;
        const message = document.getElementById('message').value;
        
        const whatsappMessage = `New Inquiry from ${name}%0A%0A` +
                               `Phone: ${phone}%0A` +
                               `Interest: ${interest}%0A` +
                               `Message: ${message || 'No message provided'}%0A%0A` +
                               `Please contact me for more details.`;
        
        const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${whatsappMessage}`;
        
        window.open(whatsappUrl, '_blank');
        
        // Reset form
        form.reset();
        
        showToast('Inquiry sent! Check WhatsApp.');
    });
}

// ===== MOBILE MENU FUNCTIONS =====
function setupMobileMenu() {
    const mobileMenuBtn = elements.mobileMenuBtn;
    const navMenu = elements.navMenu;
    
    if (!mobileMenuBtn || !navMenu) return;
    
    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        mobileMenuBtn.innerHTML = navMenu.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking on links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !mobileMenuBtn.contains(e.target)) {
            navMenu.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = '';
        }
    });
}

// ===== CART SIDEBAR FUNCTIONS =====
function setupCart() {
    const cartIcon = elements.cartIcon;
    const cartSidebar = elements.cartSidebar;
    const cartClose = elements.cartClose;
    const continueShopping = elements.continueShopping;
    
    if (!cartIcon || !cartSidebar) return;
    
    cartIcon.addEventListener('click', function(e) {
        e.preventDefault();
        cartSidebar.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateCartDisplay();
    });
    
    cartClose.addEventListener('click', function() {
        cartSidebar.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    continueShopping.addEventListener('click', function() {
        cartSidebar.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Close cart when clicking outside on mobile
    cartSidebar.addEventListener('click', function(e) {
        if (e.target === cartSidebar) {
            cartSidebar.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ===== FILTER FUNCTIONS =====
function setupFilters() {
    const filterBtns = elements.filterBtns;
    
    filterBtns.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            currentFilter = this.getAttribute('data-category');
            
            // Render filtered products
            renderProducts(currentFilter);
            
            // Scroll to products section on mobile
            if (window.innerWidth < 768) {
                document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ===== SMOOTH SCROLL =====
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (!target) return;
            
            // Calculate position with offset for fixed navbar
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const announcementHeight = document.querySelector('.announcement-bar').offsetHeight;
            const offset = navbarHeight + announcementHeight;
            const targetPosition = target.offsetTop - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Update active nav link
            updateActiveNavLink(href);
        });
    });
}

function updateActiveNavLink(href) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`.nav-link[href="${href}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// ===== INITIALIZATION =====
function init() {
    // Load cart from localStorage
    loadCart();
    
    // Setup mobile menu
    setupMobileMenu();
    
    // Setup cart sidebar
    setupCart();
    
    // Setup filters
    setupFilters();
    
    // Setup form
    setupForm();
    
    // Setup smooth scroll
    setupSmoothScroll();
    
    // Render initial products
    renderProducts(currentFilter);
    
    // Setup slider controls
    if (elements.slidePrev && elements.slideNext) {
        elements.slidePrev.addEventListener('click', () => {
            prevSlide();
            stopSlider();
            startSlider();
        });
        
        elements.slideNext.addEventListener('click', () => {
            nextSlide();
            stopSlider();
            startSlider();
        });
        
        // Dot navigation
        elements.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                stopSlider();
                startSlider();
            });
        });
        
        // Start slider
        startSlider();
        
        // Pause slider on hover/touch
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.addEventListener('mouseenter', stopSlider);
            hero.addEventListener('mouseleave', startSlider);
            hero.addEventListener('touchstart', stopSlider);
            hero.addEventListener('touchend', () => setTimeout(startSlider, 3000));
        }
    }
    
    // Handle resize events
    window.addEventListener('resize', function() {
        // Update cart display on resize
        if (elements.cartSidebar.classList.contains('active')) {
            updateCartDisplay();
        }
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                updateActiveNavLink(`#${sectionId}`);
            }
        });
    });
    
    // Setup collection links
    document.querySelectorAll('.collection-link').forEach(link => {
        link.addEventListener('click', function() {
            const collection = this.getAttribute('data-collection');
            currentFilter = collection;
            
            // Update filter buttons
            elements.filterBtns.forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-category') === collection) {
                    btn.classList.add('active');
                }
            });
            
            // Render products
            renderProducts(collection);
            
            // Scroll to products
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    console.log('Elite Furniture Website Initialized!');
}

// ===== START EVERYTHING =====
document.addEventListener('DOMContentLoaded', init);

// Export functions for HTML onclick events
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;