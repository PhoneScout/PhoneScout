using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using PhonesAPI3.Models;
using System.Collections.Generic;

[Route("api/[controller]")]
[ApiController]
public class testController : ControllerBase
{
    private readonly string connectionString = "Server=localhost;Database=phone;User=root;Password=;";

    [HttpGet]
    public ActionResult<IEnumerable<Phone>> GetPhones()
    {
        var tests = new List<test>();
        using (var connection = new MySqlConnection(connectionString))
        {
            connection.Open();

            // Query to group prices and inStore status for each phone
            var query = @"
                SELECT user.name AS name, 
               GROUP_CONCAT(orders.product ORDER BY orders.product SEPARATOR ', ') AS products, 
               GROUP_CONCAT(orders.amount ORDER BY orders.product SEPARATOR ', ') AS amounts
                FROM user
                JOIN orders ON user.id = orders.user_id
                GROUP BY user.name
                HAVING COUNT(orders.product) > 1;";

            using (var command = new MySqlCommand(query, connection))
            using (var reader = command.ExecuteReader())
            {
                while (reader.Read())
                {
                    tests.Add(new test
                    {
                        name = reader.GetString("name"),
                        products = reader.GetString("products"),  // Now it's a concatenated string
                        amounts = reader.GetString("amounts")   // Also concatenated
                    });
                }
            }
        }
        return Ok(tests);
    }
}
