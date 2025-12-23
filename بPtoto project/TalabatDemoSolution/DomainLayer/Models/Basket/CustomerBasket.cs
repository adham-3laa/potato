
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Models.Basket
{
    public class CustomerBasket
    {
        public string Id { get; set; } // GUID , Generated From Client 
        public IEnumerable<BasketItem> Items { get; set; }

       
    }
}