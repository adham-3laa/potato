using Shared;
using Shared.DTOS.ProductDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceAbstractionLayer
{
    public interface IProductService
    {
        Task<PaginatedResult<ProductDto>> GetAllProductsAsync(ProductQueryParams queryParams);

        Task<ProductDto> GetProductByIdAsync(int id);

        Task<IEnumerable<TypeDto>> GetAllTypesAsync();

        Task<IEnumerable<BrandDto>> GetAllBrandsAsync();

    }
}
