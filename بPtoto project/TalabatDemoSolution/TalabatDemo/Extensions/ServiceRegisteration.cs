using TalabatDemo.Filters;

namespace TalabatDemo.Extensions
{
    public static class ServiceRegisteration
    {
        public static IServiceCollection AddSwaggerService(this IServiceCollection Services)
        {
            Services.AddEndpointsApiExplorer();
            Services.AddSwaggerGen();
            return Services;
        }

        public static IServiceCollection AddWebApplicationServises(this IServiceCollection Services)
        {
            Services.AddControllers(options =>
            {
                options.Filters.Add<ValidateModelAttribute>();
            });
            return Services;
        }
    }
}
