/*using Microsoft.AspNetCore.Mvc;
using PhoneScout_GitHub.DTOs;
using PhoneScout_GitHub.Models;
using Swashbuckle.AspNetCore.Annotations;


namespace PhoneScout_GitHub.Controllers
{
    public class cartPageController : ControllerBase
    {
        private readonly PhoneContext _context;

        public cartPageController(PhoneContext context)
        {
            _context = context;
        }

        [HttpGet("getCart")]
        [SwaggerOperation(
            Summary = "A kosár oldalhoz szükséges adatok lekérése.",
            Description = "Az összes telefon, kosár oldalhoz szükséges adatainak lekérése."
        )]
        public IActionResult getCartPage()
        {
            var phones = _context.Phonedatas
                .Select(p => new cartDTO
                {
                    phoneID = p.PhoneId,
                    phoneInStore = p.PhoneInStore,
                    phoneName = p.PhoneName,
                    phonePrice = p.PhonePrice,
                    Color = p.Connphonecolors
                        .Select(c => new colorDTO
                        {
                            colorName = c.Color.ColorName,
                            colorHex = c.Color.ColorHex
                        }).FirstOrDefault(),
                    ramStorage = p.Connphoneramstorages
                        .Select(r => new ramStorageDTO
                        {
                            ramAmount = r.Ramstorage.RamAmount,
                            storageAmount = r.Ramstorage.StorageAmount
                        }).FirstOrDefault()
                }).ToList();

            if (phones != null)
            {
                return Ok(phones);
            }
            else
            {
                return BadRequest("A telefon nem található");
            }
        }
    }
}
*/