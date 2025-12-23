using DomainLayer.Models.Products;
using Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.Specifications
{
    public class ProductCountSpecifications : BaseSpecifications<Product, int>
    {
        // Get All Products With Types And Brands
        public ProductCountSpecifications(ProductQueryParams queryParams)
            : base(p => (!queryParams.BrandId.HasValue || p.BrandId == queryParams.BrandId)
                        && (!queryParams.TypeId.HasValue || p.TypeId == queryParams.TypeId)
                        && (string.IsNullOrWhiteSpace(queryParams.SearchValue) || p.Name.ToLower().Contains(queryParams.SearchValue.ToLower())))
        {
        }
    }
}
