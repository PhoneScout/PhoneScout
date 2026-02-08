using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;


namespace PhoneScout_GitHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LogoutController : ControllerBase
    {
        [HttpPost("{token}")]
        [SwaggerOperation(
            Summary = "",
            Description = ""
        )]

        public IActionResult Logout(string token)
        {
            if (Program.LoggedInUsers.ContainsKey(token))
            {
                Program.LoggedInUsers.Remove(token);
                return Ok("Sikeres kijelentkezés");
            }
            else
            {
                return BadRequest("Sikertelen kijelentkezés, nincs ilyen token");
            }
        }
    }
}
