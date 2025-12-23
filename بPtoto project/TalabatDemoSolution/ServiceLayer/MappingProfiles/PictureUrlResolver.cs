using AutoMapper;
using AutoMapper.Execution;
using DomainLayer.Models.Products;
using Microsoft.Extensions.Configuration;
using Shared.DTOS.ProductDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Net.WebRequestMethods;

namespace ServiceLayer.MappingProfiles
{
    internal class PictureUrlResolver(IConfiguration _configuration) : IValueResolver<Product, ProductDto, string> 
    {
        public string Resolve(Product source, ProductDto destination, string destMember, ResolutionContext context)
        {
            if(string.IsNullOrWhiteSpace(source.PictureUrl))
                return string.Empty;
            else
            {
                var url =

                    $"{_configuration.GetSection("Urls")["baseUrl"]}{source.PictureUrl}";
                return url ;
            }
        }
    }
}
