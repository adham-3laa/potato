const ApiService = {
    baseUrl: 'https://localhost:7015',
    pageSize: 6,
    defaultImage: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',

    async testConnection() {
        const response = await fetch(`${this.baseUrl}/api/Products/test`);
        return response.ok;
    },

    async getProducts(page = 1, brandId = '', typeId = '', search = '') {
        const params = new URLSearchParams({
            PageIndex: page,
            PageSize: this.pageSize
        });

        if (brandId) params.append('BrandId', brandId);
        if (typeId) params.append('TypeId', typeId);
        if (search) params.append('SearchValue', search);

        const response = await fetch(`${this.baseUrl}/api/Products?${params}`);
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
    },

    async getProductById(id) {
        const response = await fetch(`${this.baseUrl}/api/Products/${id}`);
        const product = await response.json();

        return {
            ...product,
            pictureUrl: product.pictureUrl || this.defaultImage
        };
    },

    async getBrands() {
        const response = await fetch(`${this.baseUrl}/api/Products/brands`);
        return await response.json();
    },

    async getTypes() {
        const response = await fetch(`${this.baseUrl}/api/Products/types`);
        return await response.json();
    }
};
