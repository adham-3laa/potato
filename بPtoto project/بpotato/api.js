const ApiService = {
    baseUrl: 'https://localhost:7015',
    pageSize: 6,
    defaultImage: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',

    async testConnection() {
        try {
            const response = await fetch(`${this.baseUrl}/api/Products/test`);
            return response.ok;
        } catch {
            return false;
        }
    },

    async getProducts(page = 1, brandId = '', typeId = '', search = '') {
        const params = new URLSearchParams({
            PageIndex: page,
            PageSize: this.pageSize
        });
        
        if (brandId) params.append('BrandId', brandId);
        if (typeId) params.append('TypeId', typeId);
        if (search) params.append('SearchValue', search);

        try {
            const response = await fetch(`${this.baseUrl}/api/Products?${params}`);
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const result = await response.json();
            
            return {
                products: result.data.map(p => ({
                    ...p,
                    pictureUrl: p.pictureUrl || this.defaultImage
                })),
                pagination: {
                    currentPage: result.pageIndex,
                    totalPages: Math.ceil(result.totalCount / this.pageSize),
                    totalCount: result.totalCount
                }
            };
        } catch (error) {
            console.error('API Error:', error);
            return { products: [], pagination: { currentPage: 1, totalPages: 1, totalCount: 0 } };
        }
    },

    async getProductById(id) {
        try {
            const response = await fetch(`${this.baseUrl}/api/Products/${id}`);
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const product = await response.json();
            return { ...product, pictureUrl: product.pictureUrl || this.defaultImage };
        } catch {
            return null;
        }
    },

    async getBrands() {
        try {
            const response = await fetch(`${this.baseUrl}/api/Products/brands`);
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            return await response.json();
        } catch {
            return [];
        }
    },

    async getTypes() {
        try {
            const response = await fetch(`${this.baseUrl}/api/Products/types`);
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            return await response.json();
        } catch {
            return [];
        }
    }
};