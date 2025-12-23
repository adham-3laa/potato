using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ServiceAbstractionLayer;

namespace ServiceLayer;
public static class ApplicationServicesRegistration
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IServiceManager, ServiceManager>();
        services.AddAutoMapper((x) => { }, typeof(ServiceLayerAssemblyReference).Assembly);

        return services;
    }
}
