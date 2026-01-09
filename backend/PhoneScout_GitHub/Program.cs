using Microsoft.EntityFrameworkCore;
using PhoneScout_GitHub.Models;
using DotNetEnv;

namespace PhoneScout_GitHub
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // Load .env file
            Env.Load();

            var builder = WebApplication.CreateBuilder(args);

            // Build connection string from environment variables
            var connectionString = $"Server={Environment.GetEnvironmentVariable("DB_SERVER")};" +
                                   $"Database={Environment.GetEnvironmentVariable("DB_DATABASE")};" +
                                   $"User={Environment.GetEnvironmentVariable("DB_USER")};" +
                                   $"Password={Environment.GetEnvironmentVariable("DB_PASSWORD")};";

            // Register DbContext
            builder.Services.AddDbContext<PhoneContext>(options =>
                options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

            // Add services to the container
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Configure middleware
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseAuthorization();
            app.MapControllers();
            app.Run();
        }
    }
}
