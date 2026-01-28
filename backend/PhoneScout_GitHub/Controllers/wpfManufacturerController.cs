using Microsoft.AspNetCore.DataProtection.XmlEncryption;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PhoneScout_GitHub.DTOs;
using PhoneScout_GitHub.Models;

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