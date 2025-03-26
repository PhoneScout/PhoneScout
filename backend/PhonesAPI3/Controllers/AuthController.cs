using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MySql.Data.MySqlClient;
using PhonesAPI3.Models;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private string connectionString = "Server=localhost;Database=phone;User=root;Password=;";
    private string secretKey = "YourSuperSecretKeyHereThatIsAtLeast32CharactersLong!";

    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterUser user)
    {
        if (string.IsNullOrEmpty(user.Username) || string.IsNullOrEmpty(user.Email) || string.IsNullOrEmpty(user.Password))
            return BadRequest("All fields are required.");

        string hashedPassword = HashPassword(user.Password);

        using (MySqlConnection conn = new MySqlConnection(connectionString))
        {
            conn.Open();
            string query = "INSERT INTO users (username, email, password) VALUES (@username, @email, @password)";

            using (MySqlCommand cmd = new MySqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@username", user.Username);
                cmd.Parameters.AddWithValue("@email", user.Email);
                cmd.Parameters.AddWithValue("@password", hashedPassword);

                try
                {
                    cmd.ExecuteNonQuery();
                    return Ok("User registered successfully.");
                }
                catch (MySqlException ex)
                {
                    return BadRequest("Error: " + ex.Message);
                }
            }
        }
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginUser user)
    {
        if (string.IsNullOrEmpty(user.Username) || string.IsNullOrEmpty(user.Password))
            return BadRequest("Username and password are required.");

        using (MySqlConnection conn = new MySqlConnection(connectionString))
        {
            conn.Open();
            string query = "SELECT password FROM users WHERE LOWER(username) = LOWER(@username) LIMIT 1";

            using (MySqlCommand cmd = new MySqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@username", user.Username);

                using (var reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        string storedPassword = reader.GetString("password");

                        if (VerifyPassword(user.Password, storedPassword))
                        {
                            string token = GenerateJwtToken(user.Username);
                            return Ok(new { token });
                        }
                        else
                        {
                            return Unauthorized("Incorrect password.");
                        }
                    }
                    else
                    {
                        return Unauthorized("User not found.");
                    }
                }
            }
        }
    }


    [Authorize]
    [HttpGet("protected-resource")]
    public IActionResult GetProtectedData()
    {
        var username = User.Identity.Name; // Extract username from token
        return Ok(new { message = $"Hello {username}, you accessed a protected resource!" });
    }

    //  Password Hashing
    private string HashPassword(string password)
    {
        using (SHA256 sha256 = SHA256.Create())
        {
            byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }
    }

    //  Password Verification
    private bool VerifyPassword(string enteredPassword, string storedPassword)
    {
        string hashedEnteredPassword = HashPassword(enteredPassword);
        return hashedEnteredPassword == storedPassword;
    }

    //  Generate JWT Token
    private string GenerateJwtToken(string username)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(secretKey);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[] { new Claim(ClaimTypes.Name, username) }),
            Expires = DateTime.UtcNow.AddHours(1), // Token expires in 1 hour
            Issuer = "YourAppName",
            Audience = "YourAppName",
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}
