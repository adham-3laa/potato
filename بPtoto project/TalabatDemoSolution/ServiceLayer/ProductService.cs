using AutoMapper;
using DomainLayer.Exceptions;
using DomainLayer.Contracts;
using DomainLayer.Models.Products;
using ServiceAbstractionLayer;
using ServiceLayer.Specifications;
using Shared;
using Shared.DTOS.ProductDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer
{
    public class ProductService(IUnitOfWork _unitOfWork , IMapper _mapper) : IProductService
    {
       
        #region Types and Brands

        public async Task<IEnumerable<TypeDto>> GetAllTypesAsync()
        {
            var types = await _unitOfWork.GetRepository<ProductType, int>().GetAllAsync();
            return _mapper.Map<IEnumerable<TypeDto>>(types);
        }

        public async Task<IEnumerable<BrandDto>> GetAllBrandsAsync()
        {
            var repo = _unitOfWork.GetRepository<ProductBrand, int>();
            var brands = await repo.GetAllAsync();
            return _mapper.Map<IEnumerable<BrandDto>>(brands);

        }
        #endregion


        public async Task<PaginatedResult<ProductDto>> GetAllProductsAsync(ProductQueryParams queryParams)
        {
            var repo = _unitOfWork.GetRepository<Product, int>();

            var specs = new ProductWithBrandAndTypeSpecifications(queryParams);
            var products = await repo.GetAllAsync(specs);
            var mappedProducts = _mapper.Map<IEnumerable<ProductDto>>(products);

            var countSpecs = new ProductCountSpecifications(queryParams);
            var totalCount = await repo.CountAsync(countSpecs);

            return new PaginatedResult<ProductDto>(queryParams.PageIndex, queryParams.PageSize, totalCount, mappedProducts);
        }

        public async Task<ProductDto> GetProductByIdAsync(int id)
        {
            var specs = new ProductWithBrandAndTypeSpecifications(id);

            var product = await _unitOfWork.GetRepository<Product, int>().GetByIdAsync(specs);
            if (product is null) throw new ProductNotFoundException(id);
            return _mapper.Map<ProductDto>(product);
        }
    }
}
