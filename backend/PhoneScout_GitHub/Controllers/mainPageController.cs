using Microsoft.AspNetCore.DataProtection.XmlEncryption;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using PhoneScout_GitHub.DTOs;
using PhoneScout_GitHub.Models;
using Swashbuckle.AspNetCore.Annotations;


namespace PhoneScout_GitHub.Controllers
{
    public class mainPageController : ControllerBase
    {
        private readonly PhoneContext _context;

        public mainPageController(PhoneContext context)
        {
            _context = context;
        }


        [HttpGet("mainPage")]
        [SwaggerOperation(
            Summary = "Legnépszerűbb telefonok lekérése.",
            Description = "Főoldalhoz szükséges, nyolc legnépszerűbb telefon lekérése."
        )]
        public IActionResult mainPage()
        {
            var phoneDatas = _context.Phonedatas
                .OrderByDescending(p => p.PhonePopularity)
                .Take(8)
                .Select(p => new mainPageDTO
                {
                    phoneID = p.PhoneId,
                    phoneName = p.PhoneName,
                    phonePrice = p.PhonePrice,
                    phoneInStore = p.PhoneInStore,
                    colors = p.Connphonecolors
                        .Select(c => new colorDTO
                        {
                            colorName = c.Color.ColorName,
                            colorHex = c.Color.ColorHex
                        }).ToList(),
                    ramStoragePairs = p.Connphoneramstorages
                        .Select(r => new ramStorageDTO { ramAmount = r.Ramstorage.RamAmount, storageAmount = r.Ramstorage.StorageAmount })
                        .ToList()
                })
                .ToList();

            return Ok(phoneDatas);
        }

        [HttpGet("allPhonesName")]
        [SwaggerOperation(
            Summary = "Minden telefonnév lekérése.",
            Description = "A keresősávhoz szükséges, összes telefonnév lekérése."
        )]
        public IActionResult allPhonesName()
        {
            var phoneDatas = _context.Phonedatas
                .OrderBy(p => p.PhoneName)
                .Select(p => new mainPageDTO
                {
                    phoneID = p.PhoneId,
                    phoneName = p.PhoneName
                })
                .ToList();

            return Ok(phoneDatas);
        }
    }
}
