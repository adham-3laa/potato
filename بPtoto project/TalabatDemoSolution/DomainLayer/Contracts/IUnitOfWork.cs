using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Contracts
{
    public interface IUnitOfWork
    {
        public IGenericRepository<TEntity,Tkey> GetRepository<TEntity, Tkey>() where TEntity :BaseEntity<Tkey>;
        Task<int> SaveChangesAsync();
    }
}
