using AutoMapper;
using DomainLayer.Models.Products;
using Shared.DTOS.ProductDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.MappingProfiles
{
    public class productProfile :Profile
    {
        public productProfile()
        {
            CreateMap<Product, ProductDto>()
                .ForMember(dest => dest.BrandName, options => options.MapFrom(src => src.ProductBrand.Name))
                                .ForMember(dest => dest.TypeName, options => options.MapFrom(src => src.ProductType.Name))
                                .ForMember(dest => dest.PictureUrl, options => options.MapFrom<PictureUrlResolver>());

            CreateMap<ProductType, TypeDto>();
            CreateMap<ProductBrand, BrandDto>();

        }

    }
}
