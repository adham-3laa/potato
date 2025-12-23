

using DomainLayer.Contracts;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PersintenceLayer.Data;
using PersintenceLayer.Repositorys;
using StackExchange.Redis;

namespace PersintenceLayer;
public static class InfrastructureServicesRegistration
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection Services, IConfiguration _configuration)
        
    {
       Services.AddDbContext<StoreDbContext>(options =>
        {
            options.UseSqlServer(_configuration.GetConnectionString("DefaultConnection"));
        }
            );
        Services.AddScoped<IDataSeeding, DataSeeding>();
        Services.AddScoped<IUnitOfWork, UnitOfWork>();
        Services.AddScoped<IBasketRepository, BasketRepository>();


        Services.AddSingleton<IConnectionMultiplexer>(_ =>
        {
            var connectionString = _configuration.GetConnectionString("RedisConnection");
            return ConnectionMultiplexer.Connect(connectionString!, o => o.AbortOnConnectFail = false);
        });



        return Services;
    }
}
