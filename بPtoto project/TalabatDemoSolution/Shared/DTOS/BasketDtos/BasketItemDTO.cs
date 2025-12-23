using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTOS.BasketDtos
{
    public class BasketItemDTO
    {
        public int Id { get; init; }

        public string ProductName { get; init; }
        public string PictureUrl { get; init; }
        [Range(1, short.MaxValue)]
        public decimal Price { get; init; }
        [Range(1, short.MaxValue)]
        public int Quantity { get; init; }
    }
}
