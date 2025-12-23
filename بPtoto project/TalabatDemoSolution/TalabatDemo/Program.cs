using DomainLayer.Contracts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using PersintenceLayer;
using PersintenceLayer.Data;
using PersintenceLayer.Repositorys;
using ServiceAbstractionLayer;
using ServiceLayer;
using ServiceLayer.MappingProfiles;
using System.Threading.Tasks;
using TalabatDemo.CustomMiddleWares;
using TalabatDemo.Extensions;
using TalabatDemo.Factories;
using TalabatDemo.Filters;

namespace TalabatDemo
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            #region Add services to the container.
            builder.Services.AddControllers();
            builder.Services.AddSwaggerService();
            builder.Services.AddInfrastructureServices(builder.Configuration);
            builder.Services.AddApplicationServices();
            builder.Services.AddWebApplicationServises();

            #endregion

            // Get allowed origins from configuration
            var allowedOrigins = new[]
            {
                "http://127.0.0.1:5500",    // Live Server default
                "http://localhost:5500",     // Live Server alternative
                "http://localhost:3000",     // React default
                "http://localhost:4200",     // Angular default
                "http://localhost:8080",     // Vue default
                "https://localhost:7015",    // Your API
                "http://localhost:5173",     // Vite default
                "null"                       // For file:// URLs
            };

            builder.Services.AddCors(options =>
            {
                // Policy for development with credentials
                options.AddPolicy("AllowWithCredentials",
                    builder =>
                    {
                        builder.WithOrigins(allowedOrigins)
                               .AllowAnyMethod()
                               .AllowAnyHeader()
                               .AllowCredentials();
                    });

                // Policy for development without credentials (for file://)
                options.AddPolicy("AllowAllOrigins",
                    builder =>
                    {
                        builder.AllowAnyOrigin()
                               .AllowAnyMethod()
                               .AllowAnyHeader();
                    });
            });

            var app = builder.Build();

            await app.SeedDatabaseAsync();

            app.UseCustomExceptionMiddleware();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // Use CORS before other middleware
            app.UseCors("AllowWithCredentials");

            app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseStaticFiles();

            app.MapControllers();

            app.Run();
        }
    }
}