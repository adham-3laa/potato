using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using ServiceAbstractionLayer;
using Shared;
using Shared.DTOS;
using Shared.DTOS.ProductDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PresentationLayer
{
    [ApiController]
    [Route("api/[Controller]")]
    [EnableCors("AllowWithCredentials")] // استخدم السياسة الصحيحة
    public class ProductsController(IServiceManager _serviceManager) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<PaginatedResult<ProductDto>>> GetAllProducts([FromQuery] ProductQueryParams queryParams)
        {
            try
            {
                var result = await _serviceManager.ProductService.GetAllProductsAsync(queryParams);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetProductById(int id)
        {
            try
            {
                var product = await _serviceManager.ProductService.GetProductByIdAsync(id);
                if (product == null)
                    return NotFound(new { message = "Product not found" });

                return Ok(product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("brands")]
        public async Task<ActionResult<IEnumerable<BrandDto>>> GetAllBrands()
        {
            try
            {
                var brands = await _serviceManager.ProductService.GetAllBrandsAsync();
                return Ok(brands);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("types")]
        public async Task<ActionResult<IEnumerable<TypeDto>>> GetAllTypes()
        {
            try
            {
                var types = await _serviceManager.ProductService.GetAllTypesAsync();
                return Ok(types);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("test")]
        public IActionResult TestApi()
        {
            return Ok(new
            {
                message = "Potato Restaurant API is running!",
                version = "1.0",
                timestamp = DateTime.Now,
                cors = "CORS enabled for frontend",
                endpoints = new
                {
                    products = "/api/Products",
                    productById = "/api/Products/{id}",
                    brands = "/api/Products/brands",
                    types = "/api/Products/types"
                }
            });
        }

        [HttpOptions]
        public IActionResult Options()
        {
            // Handle preflight requests
            return Ok();
        }
    }
}