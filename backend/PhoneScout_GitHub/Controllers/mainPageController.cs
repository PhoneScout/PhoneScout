using Microsoft.AspNetCore.DataProtection.XmlEncryption;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using PhoneScout_GitHub.DTOs;
using PhoneScout_GitHub.Models;

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
                })
                .ToList();

            return Ok(phoneDatas);
        }

        [HttpGet("allPhonesName")]
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
