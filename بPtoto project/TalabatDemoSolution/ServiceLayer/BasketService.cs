
using AutoMapper;
using DomainLayer.Exceptions;
using DomainLayer.Contracts;
using DomainLayer.Models.Products;
using ServiceAbstractionLayer;
using ServiceLayer.Specifications;
using Shared;
using Shared.DTOS.BasketDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DomainLayer.Models.Basket;

namespace ServiceLayer
{
    internal class BasketService(IBasketRepository basketRepository, IMapper mapper)
    : IBasketService
    {
        public async Task DeleteAsync(string id) => await basketRepository.DeleteAsync(id);

        public async Task<BasketDTO> GetAsync(string id)
        {
            
            var basket = await basketRepository.GetAsync(id) ??
                throw new BasketNotFoundException(id);

            return mapper.Map<CustomerBasket, BasketDTO>(basket);

        }

        public async Task<BasketDTO> UpdateAsync(BasketDTO basketDTO)
        {
            var basket = mapper.Map<CustomerBasket>(basketDTO);
            var updatedBasket = await basketRepository.UpdateAsync(basket) ??
                throw new Exception("Can't Create or Update Basket Now ");  

            return mapper.Map<BasketDTO>(updatedBasket);
        }
    }
}
