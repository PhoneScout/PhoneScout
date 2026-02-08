using Microsoft.AspNetCore.DataProtection.XmlEncryption;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PhoneScout_GitHub.DTOs;
using PhoneScout_GitHub.Models;
using Swashbuckle.AspNetCore.Annotations;


namespace PhoneScout_GitHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class wpfManufacturerController : ControllerBase
    {

        private readonly PhoneContext cx;

        public wpfManufacturerController(PhoneContext context)
        {
            cx = context;
        }

        [HttpGet]
        [SwaggerOperation(
            Summary = "Cégek lekérése.",
            Description = "Admin felülethez az összes cég lekérése."
        )]
        public IActionResult GetManufacturers()
        {
            try
            {
                var manufacturers = cx.Manufacturers
                .OrderBy(m => m.Id)
                .Select(m => new wpfManufacturerDTO
                {
                    manufacturerID = m.Id,
                    manufacturerName = m.ManufacturerName,
                    manufacturerURL = m.ManufacturerUrl,
                    manufacturerEmail = m.ManufacturerEmail
                })
                .ToList();


                return Ok(manufacturers);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        [SwaggerOperation(
            Summary = "Cég módosítása.",
            Description = "Admin felülethez a cég azonosítójának és a szükséges adatok megadása után a cég módosítása."
        )]
        public IActionResult UpdateManufacturer([FromBody] wpfManufacturerDTO dto, int id)
        {
            try
            {
                var manufacturer = cx.Manufacturers
                    .FirstOrDefault(m => m.Id == id);

                if (manufacturer == null)
                {
                    return NotFound("A cég nem található");
                }

                manufacturer.ManufacturerName = dto.manufacturerName;
                manufacturer.ManufacturerEmail = dto.manufacturerEmail;
                manufacturer.ManufacturerUrl = dto.manufacturerURL;

                cx.SaveChanges();

                return Ok("A cég adatai frissítve");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



        [HttpDelete("{id}")]
        [SwaggerOperation(
            Summary = "Cég törlése.",
            Description = "Admin felülethez a cég azonosítójának megadása után a cég törlése."
        )]
        public IActionResult DeleteManufacturer(int id)
        {
            try
            {
                var manufacturer = cx.Manufacturers.FirstOrDefault(m => m.Id == id);
                if (manufacturer == null)
                {
                    return BadRequest("A cég nem található.");
                }
                else
                {
                    cx.Manufacturers.Remove(manufacturer);
                }
                cx.SaveChanges();
                return Ok("A cég törölve");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }




    }
}