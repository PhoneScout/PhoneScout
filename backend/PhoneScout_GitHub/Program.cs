using Microsoft.EntityFrameworkCore;
using PhoneScout_GitHub.Models;
using DotNetEnv;
using System.Text;
using System.Net.Mail;
using System.Security.Cryptography;
using System.ComponentModel.DataAnnotations;

namespace PhoneScout_GitHub
{
    public class Program
    {
        /*
     Adatbázis frissítés esetén:
    dotnet ef dbcontext scaffold "server=localhost;database=phonescout;user=PSAdmin;password=PASSWORD" Pomelo.EntityFrameworkCore.MySql --output-dir Models --context PhoneContext --force  */

        const int SaltLength = 64;
        public static Dictionary<string, User> LoggedInUsers = new Dictionary<string, User>();

        public static string GenerateSalt()
        {
            Random random = new Random();
            string karakterek = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            string salt = "";
            for (int i = 0; i < SaltLength; i++)
            {
                salt += karakterek[random.Next(karakterek.Length)];
            }
            return salt;
        }
        public static string CreateSHA256(string input)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] data = sha256.ComputeHash(Encoding.UTF8.GetBytes(input));
                var sBuilder = new StringBuilder();
                for (int i = 0; i < data.Length; i++)
                {
                    sBuilder.Append(data[i].ToString("x2"));
                }
                return sBuilder.ToString();
            }
        }
        public static async Task SendEmail(string mailAddressTo, string subject, string body)
        {
            Env.Load();

            string EmailAddress = Environment.GetEnvironmentVariable("EMAIL");
            string EmailPassword = Environment.GetEnvironmentVariable("EMAIL_PASSWORD");

            MailMessage mail = new MailMessage();
            SmtpClient SmtpServer = new SmtpClient("smtp.gmail.com");
            mail.From = new MailAddress(EmailAddress);
            mail.To.Add(mailAddressTo);
            mail.Subject = subject;
            mail.IsBodyHtml = true;
            mail.Body = body;

            /*System.Net.Mail.Attachment attachment;
            attachment = new System.Net.Mail.Attachment("");
            mail.Attachments.Add(attachment);*/

            SmtpServer.Port = 587;
            SmtpServer.Credentials = new System.Net.NetworkCredential(EmailAddress, EmailPassword);


            SmtpServer.EnableSsl = true;

            await SmtpServer.SendMailAsync(mail);

        }
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

            builder.Services.AddSwaggerGen(c =>
            {
                c.EnableAnnotations();
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
