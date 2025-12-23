const App = {
    state: {
        products: [],
        brands: [],
        types: [],
        cart: JSON.parse(localStorage.getItem('potatoCart')) || [],
        selectedBrand: "",
        selectedType: "",
        searchValue: "",
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        isLoading: false
    },

    dom: {},

    async init() {
        this.cacheDomElements();
        this.bindEvents();
        await this.loadInitialData();
        this.render();
    },

    cacheDomElements() {
        this.dom = {
            productsGrid: document.getElementById('productsGrid'),
            loadingSpinner: document.getElementById('loadingSpinner'),
            emptyState: document.getElementById('emptyState'),
            searchInput: document.getElementById('searchInput'),
            brandFilter: document.getElementById('brandFilter'),
            typeFilter: document.getElementById('typeFilter'),
            productModal: document.getElementById('productModal'),
            productDetail: document.getElementById('productDetail'),
            closeModal: document.getElementById('closeModal'),
            cartIcon: document.getElementById('cartIcon'),
            cartSidebar: document.getElementById('cartSidebar'),
            closeCart: document.getElementById('closeCart'),
            cartItems: document.getElementById('cartItems'),
            cartTotal: document.getElementById('cartTotal'),
            cartCount: document.querySelector('.cart-count'),
            checkoutBtn: document.getElementById('checkoutBtn'),
            pageTitle: document.querySelector('.page-title'),
            paginationControls: document.getElementById('paginationControls')
        };
    },

    bindEvents() {
        this.dom.searchInput.addEventListener('input', (e) => {
            this.state.searchValue = e.target.value;
            this.debouncedSearch();
        });
        
        this.dom.brandFilter.addEventListener('change', (e) => {
            this.state.selectedBrand = e.target.value;
            this.loadProducts();
        });
        
        this.dom.typeFilter.addEventListener('change', (e) => {
            this.state.selectedType = e.target.value;
            this.loadProducts();
        });
        
        this.dom.closeModal.addEventListener('click', () => this.closeProductModal());
        
        window.addEventListener('click', (e) => {
            if (e.target === this.dom.productModal) this.closeProductModal();
        });
        
        this.dom.cartIcon.addEventListener('click', () => this.openCart());
        this.dom.closeCart.addEventListener('click', () => this.closeCart());
        this.dom.checkoutBtn.addEventListener('click', () => this.handleCheckout());
        
        window.addEventListener('beforeunload', () => {
            localStorage.setItem('potatoCart', JSON.stringify(this.state.cart));
        });
    },

    debounce(func, wait = 500) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    },

    async loadInitialData() {
        this.showLoading(true);
        
        try {
            const isConnected = await ApiService.testConnection();
            if (!isConnected) {
                alert('⚠️ Cannot connect to server. Please check if the API is running.');
                return;
            }
            
            const [brands, types] = await Promise.all([
                ApiService.getBrands(),
                ApiService.getTypes()
            ]);
            
            this.state.brands = brands;
            this.state.types = types;
            this.populateFilters();
            await this.loadProducts();
            
        } catch (error) {
            console.error('Initialization error:', error);
            alert('❌ Failed to load data from server');
        } finally {
            this.showLoading(false);
        }
    },

    populateFilters() {
        this.dom.brandFilter.innerHTML = '<option value="">All Brands</option>';
        this.dom.typeFilter.innerHTML = '<option value="">All Types</option>';
        
        this.state.brands.forEach(brand => {
            const option = document.createElement('option');
            option.value = brand.id;
            option.textContent = brand.name;
            this.dom.brandFilter.appendChild(option);
        });
        
        this.state.types.forEach(type => {
            const option = document.createElement('option');
            option.value = type.id;
            option.textContent = type.name;
            this.dom.typeFilter.appendChild(option);
        });
    },

    async loadProducts(page = 1) {
        this.showLoading(true);
        this.state.currentPage = page;
        
        try {
            const result = await ApiService.getProducts(
                page,
                this.state.selectedBrand,
                this.state.selectedType,
                this.state.searchValue
            );
            
            this.state.products = result.products;
            this.state.totalPages = result.pagination.totalPages;
            this.state.totalCount = result.pagination.totalCount;
            
            this.renderProducts();
            this.renderPagination();
            this.updatePageTitle();
            
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            this.showLoading(false);
        }
    },

    renderProducts() {
        this.dom.productsGrid.innerHTML = '';
        
        if (this.state.products.length === 0) {
            this.dom.emptyState.style.display = 'block';
            return;
        }
        
        this.dom.emptyState.style.display = 'none';
        
        this.state.products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-image">
                    <img src="${product.pictureUrl}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-meta">
                        <span class="product-brand">${product.brandName || 'No Brand'}</span>
                        <span class="product-type">${product.typeName || 'No Type'}</span>
                    </div>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <button class="add-to-cart-btn" data-id="${product.id}">
                        <i class="fas fa-plus"></i> Add to Order
                    </button>
                </div>
            `;
            
            card.querySelector('.add-to-cart-btn').addEventListener('click', () => this.addToCart(product.id));
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.add-to-cart-btn')) {
                    this.showProductDetail(product.id);
                }
            });
            
            this.dom.productsGrid.appendChild(card);
        });
    },

    renderPagination() {
        this.dom.paginationControls.innerHTML = '';
        
        if (this.state.totalPages <= 1) return;
        
        const prevBtn = document.createElement('button');
        prevBtn.className = 'pagination-btn';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i> Previous';
        prevBtn.disabled = this.state.currentPage === 1;
        prevBtn.addEventListener('click', () => this.loadProducts(this.state.currentPage - 1));
        
        const pageInfo = document.createElement('span');
        pageInfo.className = 'page-info';
        pageInfo.textContent = `Page ${this.state.currentPage} of ${this.state.totalPages}`;
        
        const nextBtn = document.createElement('button');
        nextBtn.className = 'pagination-btn';
        nextBtn.innerHTML = 'Next <i class="fas fa-chevron-right"></i>';
        nextBtn.disabled = this.state.currentPage === this.state.totalPages;
        nextBtn.addEventListener('click', () => this.loadProducts(this.state.currentPage + 1));
        
        const pageSizeSelect = document.createElement('select');
        pageSizeSelect.className = 'page-size-select';
        pageSizeSelect.innerHTML = `
            <option value="6" ${ApiService.pageSize === 6 ? 'selected' : ''}>6 per page</option>
            <option value="12" ${ApiService.pageSize === 12 ? 'selected' : ''}>12 per page</option>
            <option value="24" ${ApiService.pageSize === 24 ? 'selected' : ''}>24 per page</option>
        `;
        pageSizeSelect.addEventListener('change', (e) => {
            ApiService.pageSize = parseInt(e.target.value);
            this.loadProducts(1);
        });
        
        this.dom.paginationControls.append(prevBtn, pageInfo, nextBtn, pageSizeSelect);
    },

    updatePageTitle() {
        this.dom.pageTitle.innerHTML = `Our Menu <small style="font-size: 0.6em; color: #e67e22;">(${this.state.products.length} of ${this.state.totalCount} items)</small>`;
    },

    async showProductDetail(id) {
        const product = await ApiService.getProductById(id);
        if (!product) return;
        
        this.dom.productDetail.innerHTML = `
            <div class="detail-image">
                <img src="${product.pictureUrl}" alt="${product.name}">
            </div>
            <div class="detail-info">
                <h2 class="detail-name">${product.name}</h2>
                <div class="detail-price">$${product.price.toFixed(2)}</div>
                <p class="detail-description">${product.description}</p>
                <div class="detail-meta">
                    <span class="product-brand">${product.brandName || 'No Brand'}</span>
                    <span class="product-type">${product.typeName || 'No Type'}</span>
                </div>
                <button class="add-to-cart-btn" data-id="${product.id}" style="padding:15px 30px; font-size:1.1rem;">
                    <i class="fas fa-cart-plus"></i> Add to Order - $${product.price.toFixed(2)}
                </button>
            </div>
        `;
        
        this.dom.productDetail.querySelector('.add-to-cart-btn').addEventListener('click', () => {
            this.addToCart(id);
            this.closeProductModal();
        });
        
        this.dom.productModal.style.display = 'flex';
    },

    closeProductModal() {
        this.dom.productModal.style.display = 'none';
    },

    addToCart(productId) {
        const product = this.state.products.find(p => p.id === productId);
        if (!product) return;
        
        const existingItem = this.state.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.state.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                pictureUrl: product.pictureUrl,
                quantity: 1
            });
        }
        
        this.updateCartDisplay();
        this.showNotification(`✅ ${product.name} added to cart!`);
    },

    updateCartDisplay() {
        const totalItems = this.state.cart.reduce((sum, item) => sum + item.quantity, 0);
        this.dom.cartCount.textContent = totalItems;
        
        this.dom.cartItems.innerHTML = '';
        
        if (this.state.cart.length === 0) {
            this.dom.cartItems.innerHTML = `
                <div class="empty-state" style="padding:40px 20px;">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                </div>`;
            this.dom.cartTotal.textContent = '$0.00';
            return;
        }
        
        let totalPrice = 0;
        
        this.state.cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.pictureUrl}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn decrease-quantity" data-id="${item.id}">-</button>
                        <span class="cart-item-quantity">${item.quantity}</span>
                        <button class="quantity-btn increase-quantity" data-id="${item.id}">+</button>
                        <span class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></span>
                    </div>
                </div>
            `;
            
            cartItem.querySelector('.decrease-quantity').addEventListener('click', () => this.updateCartQuantity(item.id, -1));
            cartItem.querySelector('.increase-quantity').addEventListener('click', () => this.updateCartQuantity(item.id, 1));
            cartItem.querySelector('.remove-item').addEventListener('click', () => this.removeFromCart(item.id));
            
            this.dom.cartItems.appendChild(cartItem);
        });
        
        this.dom.cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
    },

    updateCartQuantity(productId, change) {
        const item = this.state.cart.find(item => item.id === productId);
        if (!item) return;
        
        item.quantity += change;
        
        if (item.quantity <= 0) {
            this.removeFromCart(productId);
        } else {
            this.updateCartDisplay();
        }
    },

    removeFromCart(productId) {
        this.state.cart = this.state.cart.filter(item => item.id !== productId);
        this.updateCartDisplay();
        this.showNotification('🗑️ Item removed from cart');
    },

    openCart() {
        this.dom.cartSidebar.classList.add('open');
    },

    closeCart() {
        this.dom.cartSidebar.classList.remove('open');
    },

    handleCheckout() {
        if (this.state.cart.length === 0) {
            alert('❌ Your cart is empty!');
            return;
        }
        
        const totalPrice = this.state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const itemCount = this.state.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        if (confirm(`Confirm your order?\n\nTotal: $${totalPrice.toFixed(2)}\nItems: ${itemCount}\n\nClick OK to proceed.`)) {
            alert('✅ Order placed successfully!\n\nYour food will be ready in 20-30 minutes.');
            
            this.state.cart = [];
            this.updateCartDisplay();
            this.closeCart();
        }
    },

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #2ecc71;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 3000;
            font-weight: 600;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    },

    showLoading(show) {
        this.dom.loadingSpinner.style.display = show ? 'block' : 'none';
    },

    render() {
        this.renderProducts();
        this.renderPagination();
        this.updateCartDisplay();
        this.updatePageTitle();
    },

    debouncedSearch: null
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    App.debouncedSearch = App.debounce(() => {
        App.loadProducts(1);
    }, 500);
    
    App.init();
});