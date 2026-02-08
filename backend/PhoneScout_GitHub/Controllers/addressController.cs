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
    public class addressController : ControllerBase
    {

        private readonly PhoneContext cx;

        public addressController(PhoneContext context)
        {
            cx = context;
        }

        [HttpGet("GetAddresses/{userID}/{addressType}")]
        [SwaggerOperation(
            Summary = "Egy profilhoz tartozó címek lekérése.",
            Description = "Az elérési útban a felhasználó azonosítóját, és a cím típusát kell megadni, ami lehet: 0 - számlázási | 1 - szállítási."
        )]
        public IActionResult GetAddresses(int userID, int addressType)
        {
            try
            {

                var selectedAddresses = cx.Addresses.Where(a => a.AddressType == addressType && a.UserId == userID).ToList();

                List<addressDTO> addresses = new List<addressDTO>();

                foreach (var address in selectedAddresses)
                {
                    addresses.Add(new addressDTO
                    {
                        postalCode = address.PostalCode,
                        city = address.City,
                        address = address.Address1,
                        phoneNumber = address.PhoneNumber,
                        addressType = address.AddressType,
                        userID = userID,
                    });

                }

                return Ok(addresses);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost("PostAddress")]
        [SwaggerOperation(
            Summary = "Egy profilhoz tartozó cím feltöltése.",
            Description = "Az adatok megadása után a felhasználóhoz rendelt cím feltöltésre kerül."
        )]
        public IActionResult PostAddress([FromBody] addressDTO address)
        {
            try
            {
                var newAddress = new Address()
                {
                    PostalCode = address.postalCode,
                    City = address.city,
                    Address1 = address.address,
                    PhoneNumber = address.phoneNumber,
                    AddressType = address.addressType,
                    UserId = address.userID,
                };

                cx.Addresses.Add(newAddress);
                cx.SaveChanges();
                return Ok("A cím sikeresen felvéve.");

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("PutAddress/{userID}/{addressType}")]
        [SwaggerOperation(
                Summary = "Egy profilhoz tartozó cím módosítása.",
                Description = "Az elérési útban a felhasználó azonosítóját, és a cím típusát kell megadni, ami lehet: 0 - számlázási | 1 - szállítási, majd az adatok megadása után frissül a kiválasztott cím."
            )]
        public IActionResult PutAddress(int userID, int addressType, [FromBody] addressDTO address)
        {
            try
            {
                var selectedAddress = cx.Addresses.FirstOrDefault(a => a.UserId == userID && a.AddressType == addressType);
                selectedAddress.PostalCode = address.postalCode;
                selectedAddress.City = address.city;
                selectedAddress.Address1 = address.address;
                selectedAddress.PhoneNumber = address.phoneNumber;
                selectedAddress.AddressType = address.addressType;
                selectedAddress.UserId = userID;




                cx.Addresses.Update(selectedAddress);
                cx.SaveChanges();
                return Ok("A cím sikeresen frissítve.");

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("DeleteAddress/{userID}/{addressType}")]
        [SwaggerOperation(
            Summary = "Egy profilhoz tartozó cím törlése.",
            Description = "Az elérési útban a felhasználó azonosítóját, és a cím típusát kell megadni, ami lehet: 0 - számlázási | 1 - szállítási, majd a kiválasztott cím törlésre kerül."
        )]
        public IActionResult PutAddress(int userID, int addressType)
        {
            try
            {
                var selectedAddress = cx.Addresses.FirstOrDefault(a => a.UserId == userID && a.AddressType == addressType);

                cx.Addresses.Remove(selectedAddress);
                cx.SaveChanges();
                return Ok("A cím sikeresen törölve.");

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



    }
}
