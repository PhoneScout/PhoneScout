using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using Org.BouncyCastle.Asn1;
using PhonesAPI3.Models;
using System.Collections.Generic;
using System.Data;

[Route("api/[controller]")]
[ApiController]
public class PhoneController : ControllerBase
{
    private readonly string connectionString = "Server=localhost;Database=phone;User=root;Password=;";

    [HttpGet]
    public ActionResult<IEnumerable<Phone>> GetGames()
    {
        var phones = new List<Phone>();
        using (var connection = new MySqlConnection(connectionString))
        {
            connection.Open();
            var query = "SELECT ID, Name, price, inStore, releaseDate FROM phones";
            using (var command = new MySqlCommand(query, connection))
            using (var reader = command.ExecuteReader())
            {
                while (reader.Read())
                {
                    phones.Add(new Phone
                    {
                        Id = reader.GetInt32("Id"),
                        Name = reader.GetString("Name"),
                        Price = reader.GetInt32("price"),
                        inStore = reader.GetString("inStore"),
                        releaseDate = reader.IsDBNull("releaseDate") ? null : reader.GetDateOnly("releaseDate")
                    });

                }
            }
        }
        return Ok(phones);
    }


    [HttpPost("phonePost")]
    public IActionResult PhonePost([FromBody] Phone phone)
    {
        if (string.IsNullOrEmpty(phone.Name) || string.IsNullOrEmpty(phone.inStore))
            return BadRequest("All fields are required.");



        using (MySqlConnection conn = new MySqlConnection(connectionString))
        {
            conn.Open();
            string query = "INSERT INTO phones (Name, price, inStore, releaseDate) VALUES (@name, @price, @inStore, @releaseDate)";
            

            using (MySqlCommand cmd = new MySqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@name", phone.Name);                
                cmd.Parameters.AddWithValue("@price", phone.Price);
                cmd.Parameters.AddWithValue("@inStore", phone.inStore);
                cmd.Parameters.AddWithValue("@ReleaseDate", phone.releaseDate.HasValue ? phone.releaseDate.Value.ToString("yyyy-MM-dd") : DBNull.Value);


                try
                {
                    cmd.ExecuteNonQuery();
                    return Ok("Telefon sikeresen felvéve");
                }
                catch (MySqlException ex)
                {
                    return BadRequest("Error: " + ex.Message);
                }
            }
        }
    }

}
