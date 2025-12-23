using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shared.DTOS;
using Shared.DTOS.BasketDtos;


namespace ServiceAbstractionLayer
{

    public interface IBasketService
    {
        Task<BasketDTO> GetAsync(string id);
        Task<BasketDTO> UpdateAsync(BasketDTO basketDTO);
        Task DeleteAsync(string id);


    }
}

