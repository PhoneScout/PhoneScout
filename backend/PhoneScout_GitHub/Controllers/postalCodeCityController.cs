using Microsoft.AspNetCore.DataProtection.XmlEncryption;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PhoneScout_GitHub.DTOs;
using PhoneScout_GitHub.Models;

namespace PhoneScout_GitHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostalCodeCityController : ControllerBase
    {

        private readonly PhoneContext cx;

        public PostalCodeCityController(PhoneContext context)
        {
            cx = context;
        }

        [HttpPost("autoFillPCC")]

        public IActionResult autoFillPCC([FromBody] PostalCodeDTO dto) {

            try
            {
                if(dto.postalCode != 0)
                {
                    var requiredPostalCode = cx.Postalcodes.FirstOrDefault(p => p.Iranyitoszam == dto.postalCode);
                    if(requiredPostalCode == null)
                    {
                        return BadRequest("Az irányítószám nem található.");
                    }
                    else
                    {
                        return Ok(requiredPostalCode);
                    }
                }
                else if (dto.city != "")
                {
                    var requiredCity = cx.Postalcodes.FirstOrDefault(p => p.Telepules == dto.city);
                    if (requiredCity == null)
                    {
                        return BadRequest("A város nem található.");
                    }
                    else
                    {
                        return Ok(requiredCity);
                    }                   
                }
                else
                {
                    return BadRequest("Az egyik adatot legalább meg kell adni");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}