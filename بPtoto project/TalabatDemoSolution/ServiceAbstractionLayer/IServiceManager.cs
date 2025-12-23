using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceAbstractionLayer
{
    public interface IServiceManager
    {
        public IProductService ProductService { get; }
        IBasketService BasketService { get; }

    }
}
