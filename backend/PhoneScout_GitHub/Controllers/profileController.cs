using Microsoft.AspNetCore.DataProtection.XmlEncryption;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpLogging;
using Microsoft.AspNetCore.Mvc;
using PhoneScout_GitHub.DTOs;
using PhoneScout_GitHub.Models;
using Swashbuckle.AspNetCore.Annotations;


namespace PhoneScout_GitHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {

        private readonly PhoneContext cx;

        public ProfileController(PhoneContext context)
        {
            cx = context;
        }






        [HttpGet("GetAllRepair")]
        [SwaggerOperation(
           Summary = "Az összes javítás lekérése.",
           Description = "Admin felülethez az összes elérhatő javítás lekérése."
       )]
        public IActionResult GetAllRepair()
        {
            try
            {

                var selectRepairs = cx.Connectionservices
                                      .ToList(); // <- important


                List<profileRepairGetDTO> repairs = new List<profileRepairGetDTO>();

                foreach (var aRepair in selectRepairs)
                {
                    var user = cx.Users.FirstOrDefault(u => u.Id == aRepair.UserId);

                    // Materialize parts list to avoid connection reuse issues
                    var parts = cx.Connectionparts
                                  .Where(p => p.RepairId == aRepair.RepairId)
                                  .ToList(); // <- important

                    profileRepairGetDTO repair = new profileRepairGetDTO
                    {
                        repairID = aRepair.RepairId,
                        userID = aRepair.UserId,
                        name = user.Email,
                        postalCode = aRepair.PostalCode,
                        city = aRepair.City,
                        address = aRepair.Address,
                        phoneNumber = aRepair.PhoneNumber,
                        phoneName = aRepair.PhoneName,
                        price = aRepair.Price,
                        status = aRepair.Status,
                        manufacturerName = aRepair.ManufacturerName,
                        phoneInspection = aRepair.PhoneInspection,
                        problemDescription = aRepair.ProblemDescription,
                        parts = new List<string>()
                    };

                    foreach (var part in parts)
                    {
                        var partName = cx.Parts.FirstOrDefault(pn => pn.Id == part.PartId);
                        if (partName != null)
                            repair.parts.Add(partName.PartName);
                    }

                    repairs.Add(repair);
                }

                return Ok(repairs);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet("GetAllOrder")]
        [SwaggerOperation(
            Summary = "Az összes rendelés lekérése.",
            Description = "Admin felülethez az összes elérhatő rendelés lekérése."
        )]
        public IActionResult GetAllOrders()
        {
            try
            {

                var orders = cx.Connuserorders

                    .Select(anOrder => new profileCartGetDTO
                    {
                        orderID = anOrder.Id,
                        userID = cx.Users.FirstOrDefault(u => u.Id == anOrder.UserId).Id,
                        userEmail = cx.Users.FirstOrDefault(u => u.Id == anOrder.UserId).Email,
                        postalCode = anOrder.PostalCode,
                        city = anOrder.City,
                        address = anOrder.Address,
                        phoneNumber = anOrder.PhoneNumber,
                        phoneName = anOrder.PhoneName,
                        phoneColorName = anOrder.PhoneColorName,
                        phoneColorHex = anOrder.PhoneColorHex,
                        phoneRam = anOrder.PhoneRam,
                        phoneStorage = anOrder.PhoneStorage,
                        price = anOrder.Price,
                        amount = anOrder.Amount,
                        status = anOrder.Status
                    })
                    .ToList();

                return Ok(orders);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetRepair/{userID}")]
        [SwaggerOperation(
            Summary = "Egy javítás lekérése.",
            Description = "A felhasználó ID megadás után, a hozzá tartozó összes javítás lekérése."
        )]
        public IActionResult GetRepairs(int userID)
        {
            try
            {

                var selectRepairs = cx.Connectionservices
                                      .Where(r => r.UserId == userID)
                                      .ToList(); // <- important

                var user = cx.Users.FirstOrDefault(u => u.Id == userID);

                List<profileRepairGetDTO> repairs = new List<profileRepairGetDTO>();

                foreach (var aRepair in selectRepairs)
                {
                    // Materialize parts list to avoid connection reuse issues
                    var parts = cx.Connectionparts
                                  .Where(p => p.RepairId == aRepair.RepairId)
                                  .ToList(); // <- important

                    profileRepairGetDTO repair = new profileRepairGetDTO
                    {
                        repairID = aRepair.RepairId,
                        name = user.Name,
                        postalCode = aRepair.PostalCode,
                        city = aRepair.City,
                        address = aRepair.Address,
                        phoneNumber = aRepair.PhoneNumber,
                        phoneName = aRepair.PhoneName,
                        price = aRepair.Price,
                        status = aRepair.Status,
                        manufacturerName = aRepair.ManufacturerName,
                        phoneInspection = aRepair.PhoneInspection,
                        problemDescription = aRepair.ProblemDescription,
                        parts = new List<string>()
                    };

                    foreach (var part in parts)
                    {
                        var partName = cx.Parts.FirstOrDefault(pn => pn.Id == part.PartId);
                        if (partName != null)
                            repair.parts.Add(partName.PartName);
                    }

                    repairs.Add(repair);
                }

                return Ok(repairs);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet("GetOrder/{userID}")]
        [SwaggerOperation(
            Summary = "Egy rendelés lekérése.",
            Description = "A felhasználó ID megadás után, a hozzá tartozó összes rendelés lekérése."
        )]
        public IActionResult GetOrders(int userID)
        {
            try
            {
                var userExists = cx.Users.Any(u => u.Id == userID);
                if (!userExists)
                {
                    return BadRequest("Nem található felhasználó!");
                }

                var orders = cx.Connuserorders
                    .Where(o => o.UserId == userID)
                    .Select(anOrder => new profileCartGetDTO
                    {
                        userID = anOrder.UserId,
                        postalCode = anOrder.PostalCode,
                        city = anOrder.City,
                        address = anOrder.Address,
                        phoneNumber = anOrder.PhoneNumber,
                        phoneName = anOrder.PhoneName,
                        phoneColorName = anOrder.PhoneColorName,
                        phoneColorHex = anOrder.PhoneColorHex,
                        phoneRam = anOrder.PhoneRam,
                        phoneStorage = anOrder.PhoneStorage,
                        price = anOrder.Price,
                        amount = anOrder.Amount,
                        status = anOrder.Status
                    })
                    .ToList();

                return Ok(orders);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }




        [HttpPost("postOrder")]
        [SwaggerOperation(
            Summary = "Rendelés feltöltése.",
            Description = "Az adatok kitöltése után, a rendelés feltöltése az adatbázisba."
        )]

        public IActionResult postOrder([FromBody] profileCartGetDTO dto)
        {

            try
            {
                if (cx.Users.FirstOrDefault(u => u.Id == dto.userID) == null)
                {
                    return BadRequest("A felhasználó nem található");
                }
                else
                {
                    var order = new Connuserorder();
                    order.UserId = dto.userID;
                    order.PostalCode = dto.postalCode;
                    order.City = dto.city;
                    order.Address = dto.address;
                    order.PhoneNumber = dto.phoneNumber;
                    order.PhoneName = dto.phoneName;
                    order.PhoneColorName = dto.phoneColorName;
                    order.PhoneColorHex = dto.phoneColorHex;
                    order.PhoneRam = dto.phoneRam;
                    order.PhoneStorage = dto.phoneStorage;
                    order.Price = dto.price;
                    order.Amount = dto.amount;
                    order.Status = dto.status;

                    cx.Connuserorders.Add(order);
                    cx.SaveChanges();
                    return Ok("A rendelés befejezve.");
                }

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpPost("postRepair")]
        [SwaggerOperation(
            Summary = "Javítás feltöltése.",
            Description = "Az adatok kitöltése után, a javítás feltöltése az adatbázisba."
        )]

        public IActionResult postRepair([FromBody] profileRepairPostDTO dto)
        {
            try
            {
                var user = cx.Users.FirstOrDefault(u => u.Id == dto.userID);

                if (user == null)
                    return BadRequest("A felhasználó nem található.");

                if (dto.parts == null || !dto.parts.Any())
                    return BadRequest("Nincsenek megadva alkatrészek.");


                var repair = new Connectionservice
                {
                    RepairId = dto.repairID,
                    UserId = dto.userID,
                    PostalCode = dto.postalCode,
                    City = dto.city,
                    Address = dto.address,
                    PhoneNumber = dto.phoneNumber,
                    PhoneName = dto.phoneName,
                    Price = dto.price,
                    Status = dto.status,

                    ManufacturerName = dto.manufacturerName,
                    PhoneInspection = dto.phoneInspection,
                    ProblemDescription = dto.problemDescription
                };

                cx.Connectionservices.Add(repair);


                foreach (var partName in dto.parts)
                {
                    var part = cx.Parts.FirstOrDefault(p => p.PartName == partName);

                    if (part == null)
                        return BadRequest($"Az alkatrész nem létezik: {partName}");

                    var record = new Connectionpart
                    {
                        PartId = part.Id,
                        RepairId = repair.RepairId
                    };

                    cx.Connectionparts.Add(record);
                }


                cx.SaveChanges();

                return Ok("A szerviz igénylés befejeződött.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpPut("UpdateUser/{email}")]
        [SwaggerOperation(
            Summary = "Felhasználó módosítása.",
            Description = "A felhasználó e-mail címének és a szükséges adatok megadása után, a kiválasztott felhasználó adatainak módosítása."
        )]
        public IActionResult UpdateUser([FromBody] profileUserUpdateDTO dto, string email)
        {
            try
            {
                var selectedUser = cx.Users.FirstOrDefault(u => u.Email == email);

                selectedUser.Email = dto.userEmail;
                selectedUser.Name = dto.userFullName;

                cx.SaveChanges();

                return Ok("Sikeres frissítés");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPut("updateRepair/{repairID}")]
        [SwaggerOperation(
            Summary = "Javítás módosítása.",
            Description = "A javítás azonosítójának és a szükséges adatok megadása után, a kiválasztott javítás adatainak módosítása."
        )]
        public IActionResult updateRepair([FromBody] profileRepairPostDTO dto, string repairID)
        {
            try
            {
                // 1. Find the existing repair
                var selectedRepair = cx.Connectionservices.FirstOrDefault(sr => sr.RepairId == repairID);
                if (selectedRepair == null)
                    return NotFound("A szerviz igénylés nem található.");

                // 2. Validate the user
                var user = cx.Users.FirstOrDefault(u => u.Id == dto.userID);
                if (user == null)
                    return BadRequest("A felhasználó nem található.");

                // 3. Validate parts list
                if (dto.parts == null || !dto.parts.Any())
                    return BadRequest("Nincsenek megadva alkatrészek.");

                // 4. Update repair properties
                selectedRepair.UserId = dto.userID;
                selectedRepair.PostalCode = dto.postalCode;
                selectedRepair.City = dto.city;
                selectedRepair.Address = dto.address;
                selectedRepair.PhoneNumber = dto.phoneNumber;
                selectedRepair.PhoneName = dto.phoneName;
                selectedRepair.Price = dto.price;
                selectedRepair.Status = dto.status;
                selectedRepair.ManufacturerName = dto.manufacturerName;
                selectedRepair.PhoneInspection = dto.phoneInspection;
                selectedRepair.ProblemDescription = dto.problemDescription;

                // 5. Update parts (add only if not already linked)
                foreach (var partName in dto.parts)
                {
                    var part = cx.Parts.FirstOrDefault(p => p.PartName == partName);
                    if (part == null)
                        return BadRequest($"Az alkatrész nem létezik: {partName}");

                    bool partConnExist = cx.Connectionparts
                        .Any(p => p.RepairId == selectedRepair.RepairId && p.PartId == part.Id);

                    if (!partConnExist)
                    {
                        var record = new Connectionpart
                        {
                            PartId = part.Id,
                            RepairId = selectedRepair.RepairId
                        };
                        cx.Connectionparts.Add(record);
                    }
                }

                // 6. Save all changes
                cx.SaveChanges();

                return Ok("A szerviz igénylés befejeződött.");
            }
            catch (Exception ex)
            {
                // Return a safe error message
                return BadRequest($"Hiba történt a mentés során: {ex.Message}");
            }
        }




        [HttpPut("updateOrder/{orderID}")]
        [SwaggerOperation(
            Summary = "Rendelés módosítása.",
            Description = "A rendelés azonosítójának és a szükséges adatok megadása után, a kiválasztott rendelés adatainak módosítása."
        )]
        public IActionResult updateOrderStatus([FromBody] profileCartGetDTO dto, int orderID)
        {
            try
            {
                var order = cx.Connuserorders.FirstOrDefault(o => o.Id == orderID);
                if (order != null)
                {
                    order.PostalCode = dto.postalCode;
                    order.City = dto.city;
                    order.Address = dto.address;
                    order.PhoneNumber = dto.phoneNumber;
                    order.PhoneName = dto.phoneName;
                    order.PhoneColorHex = dto.phoneColorHex;
                    order.PhoneColorName = dto.phoneColorName;
                    order.PhoneRam = dto.phoneRam;
                    order.PhoneStorage = dto.phoneStorage;
                    order.Price = dto.price;
                    order.Amount = dto.amount;
                    order.Status = dto.status;


                    cx.SaveChanges();

                    return Ok("A cég adatai frissítve");
                }
                else
                {
                    return BadRequest("A megrendelés nem található.");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }






        [HttpDelete("deleteRepair/{repairID}")]
        [SwaggerOperation(
            Summary = "Javítás törlése.",
            Description = "A javítás azonosítójának megadása után, a kiválasztott javítás törlése."
        )]

        public IActionResult deleteRepair(string repairID)
        {
            try
            {
                var repair = cx.Connectionservices.FirstOrDefault(o => o.RepairId == repairID);
                if (repair != null)
                {
                    cx.Connectionservices.Remove(repair);
                    cx.SaveChanges();
                    return Ok("Javítás törölve.");
                }
                else
                {
                    return BadRequest("A javítás nem található, így nem törölhető.");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpDelete("deleteOrder/{orderID}")]
        [SwaggerOperation(
            Summary = "Rendelés törlése.",
            Description = "A rendelés azonosítójának megadása után, a kiválasztott rendelés törlése."
        )]

        public IActionResult deleteOrder(int orderID)
        {
            try
            {
                var order = cx.Connuserorders.FirstOrDefault(o => o.Id == orderID);
                if (order != null)
                {
                    cx.Connuserorders.Remove(order);
                    cx.SaveChanges();
                    return Ok("Megrendelés törölve.");
                }
                else
                {
                    return BadRequest("A megrendelés nem található, így nem törölhető.");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



    }
}
