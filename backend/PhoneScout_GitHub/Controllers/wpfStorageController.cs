using Microsoft.AspNetCore.DataProtection.XmlEncryption;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhoneScout_GitHub.DTOs;
using PhoneScout_GitHub.Models;
using Swashbuckle.AspNetCore.Annotations;


namespace PhoneScout_GitHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class wpfStorageController : ControllerBase
    {

        private readonly PhoneContext cx;

        public wpfStorageController(PhoneContext context)
        {
            cx = context;
        }

        [HttpGet]
        [SwaggerOperation(
            Summary = "Raktár lekérése.",
            Description = "Admin felülethez az összes raktár lekérése."
        )]
        public IActionResult GetStorageWPF()
        {
            try
            {
                var parts = cx.Parts
                .OrderBy(p => p.Id)
                .Select(p => new wpfStorageDTO
                {
                    partID = p.Id,
                    partName = p.PartName,
                    partAmount = p.PartStock,
                })
                .ToList();


                return Ok(parts);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [SwaggerOperation(
            Summary = "Alkatrész feltöltése.",
            Description = "Admin felülethez egy alkatrész feltöltése, a szükséges adatok megadása után."
        )]
        public IActionResult UpdateStorageWPF([FromBody] wpfStorageDTO dto)
        {
            try
            {
                var part = cx.Parts
                    .FirstOrDefault(p => p.PartName == dto.partName);

                if (part != null)
                {
                    return BadRequest("Az alkatrész már létezik.");
                }
                else
                {
                    var newPart = new Part
                    {
                        PartName = dto.partName,
                        PartStock = dto.partAmount
                    };

                    cx.Parts.Add(newPart);
                    cx.SaveChanges();
                    return Ok("Az alkatrész sikeresen feltöltve.");

                }                

                

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPut("{id}")]
        [SwaggerOperation(
            Summary = "Alkatrész módosítása.",
            Description = "Admin felülethez egy alkatrész azonosítójának és a szükséges adatok megadása után az alkatrész módosítása."
        )]
        public IActionResult UpdateStorageWPF([FromBody] wpfStorageDTO dto, int id)
        {
            try
            {
                var part = cx.Parts
                    .FirstOrDefault(p => p.Id == id);

                if (part == null)
                {
                    return NotFound("Az alkatrész nem található");
                }

                


                
                part.PartName = dto.partName;
                part.PartStock = dto.partAmount;

                cx.SaveChanges();

                return Ok("Az alkatrész adatai frissítve");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



        [HttpDelete("{id}")]
        [SwaggerOperation(
            Summary = "Alkatrész törlése.",
            Description = "Admin felülethez a alkatrész azonosítójának megadása után a alkatrész törlése."
        )]
        public IActionResult DeleteStorageWPF(int id)
        {
            try
            {
                var part = cx.Parts.FirstOrDefault(p => p.Id == id);
                if (part == null)
                {
                    return BadRequest("Az alkatrész nem található.");
                }
                else
                {
                    cx.Parts.Remove(part);
                }
                cx.SaveChanges();
                return Ok("Az alkatrész törölve");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }}