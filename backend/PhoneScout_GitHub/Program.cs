using Microsoft.EntityFrameworkCore;
using PhoneScout_GitHub.Models;
using DotNetEnv;

namespace PhoneScout_GitHub
{
    public class Program
    {
        public static void Main(string[] args)
        {

            Env.Load();

            var builder = WebApplication.CreateBuilder(args);


            var connectionString = $"Server={Environment.GetEnvironmentVariable("DB_SERVER")};" +
                                   $"Database={Environment.GetEnvironmentVariable("DB_DATABASE")};" +
                                   $"User={Environment.GetEnvironmentVariable("DB_USER")};" +
                                   $"Password={Environment.GetEnvironmentVariable("DB_PASSWORD")};";


            builder.Services.AddDbContext<PhoneContext>(options =>
                options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));


            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll",
                    policy =>
                    {
                        policy
                            .AllowAnyOrigin()
                            .AllowAnyMethod()
                            .AllowAnyHeader();
                    });
            });


            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();


            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();


            app.UseCors("AllowAll");

            app.UseAuthorization();
            app.MapControllers();
            app.Run();
        }
    }
}
