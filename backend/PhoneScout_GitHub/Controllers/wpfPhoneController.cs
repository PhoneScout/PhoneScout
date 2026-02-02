using Microsoft.AspNetCore.DataProtection.XmlEncryption;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PhoneScout_GitHub.DTOs;
using PhoneScout_GitHub.Models;

namespace PhoneScout_GitHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class wpfPhoneController : ControllerBase
    {

        private readonly PhoneContext cx;

        public wpfPhoneController(PhoneContext context)
        {
            cx = context;
        }

        [HttpGet]
        public IActionResult GetPhonesWPF()
        {
            try
            {
                var phones = cx.Phonedatas
                .OrderBy(m => m.PhoneId)
                .Select(m => new wpfPhonesDTO
                {
                    phoneID = m.PhoneId,
                    phoneName = m.PhoneName,
                    manufacturerName = m.Manufacturer.ManufacturerName,
                    phoneInstore = m.PhoneInStore,
                    phonePrice = m.PhonePrice,
                    phoneAvailable = m.PhoneDeleted,
                })
                .ToList();


                return Ok(phones);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public IActionResult UpdatePhoneWPF([FromBody] wpfPhonesDTO dto, int id)
        {
            try
            {
                var phone = cx.Phonedatas
                    .FirstOrDefault(m => m.PhoneId == id);

                if (phone == null)
                {
                    return NotFound("A telefon nem található");
                }

                phone.PhoneName = dto.phoneName;
                phone.PhoneInStore = dto.phoneInstore;
                phone.PhonePrice = dto.phonePrice;
                phone.PhoneDeleted = dto.phoneAvailable;

                cx.SaveChanges();

                return Ok("A telefon adatai frissítve");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



        [HttpDelete("{id}")]
        public IActionResult DeletePhoneWPF(int id)
        {
            try
            {
                var phone = cx.Phonedatas.FirstOrDefault(m => m.PhoneId == id);
                if (phone == null)
                {
                    return BadRequest("A telefon nem található.");
                }
                else
                {
                    cx.Phonedatas.Remove(phone);
                }
                cx.SaveChanges();
                return Ok("A telefon törölve");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }




    }
}