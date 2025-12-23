using DomainLayer.Contracts;
using DomainLayer.Exceptions;
using DomainLayer.Models;
using DomainLayer.Models.Basket;
using Microsoft.EntityFrameworkCore;
using PersintenceLayer.Data;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace PersintenceLayer.Repositorys
{
    public class BasketRepository : IBasketRepository
    {
        private readonly IDatabase _database;
        private readonly IConnectionMultiplexer _connection;


        public BasketRepository(IConnectionMultiplexer connection)
        {
            _connection = connection;
            _database = connection.GetDatabase();
        }

        private void EnsureRedisAvailable()
        {
            if (!_connection.IsConnected)
                throw new RedisNotAvailableException("Redis server is not available right now.");
        }
        public async Task DeleteAsync(string id)
        {
            EnsureRedisAvailable();
            await _database.KeyDeleteAsync(id);
        }

        public async Task<CustomerBasket?> GetAsync(string id)
        {
            EnsureRedisAvailable();
            var basket = await _database.StringGetAsync(id);

            if (basket.IsNullOrEmpty) return null;

            return JsonSerializer.Deserialize<CustomerBasket>(basket!);
        }

        public async Task<CustomerBasket?> UpdateAsync(CustomerBasket basket, TimeSpan? timeSpan = null)
        {
            EnsureRedisAvailable();
            var jsonBasket = JsonSerializer.Serialize(basket);
            var isCreatedOrUpdated = await _database.StringSetAsync(
                basket.Id,
                jsonBasket,
                timeSpan ?? TimeSpan.FromDays(30)
            );

            return isCreatedOrUpdated ? await GetAsync(basket.Id) : null;
        }
    }
}
