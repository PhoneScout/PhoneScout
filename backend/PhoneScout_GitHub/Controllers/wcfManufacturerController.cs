using Microsoft.AspNetCore.DataProtection.XmlEncryption;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PhoneScout_API_v2.DTOs;
using PhoneScout_GitHub.DTOs;
using PhoneScout_GitHub.Models;

namespace PhoneScout_GitHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class wcfManufacturerController : ControllerBase
    {

        private readonly PhoneContext cx;

        public wcfManufacturerController(PhoneContext context)
        {
            cx = context;
        }

        [HttpGet]
        public IActionResult GetManufacturers()
        {
            try
            {
                var manufacturers = cx.Manufacturers
                .OrderByDescending(m => m.ManufacturerName)
                .Select(m => new wcfManufacturerDTO
                {
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

        [HttpPut("{name}")]
public IActionResult UpdateManufacturer([FromBody] wcfManufacturerDTO dto,string name)
{
    try
    {
        var manufacturer = cx.Manufacturers
            .FirstOrDefault(m => m.ManufacturerName == name);

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



        [HttpDelete("/{id}")]
        public IActionResult DeleteManufacturer(int id)
        {
            try
            {
                var manufacturer = cx.Manufacturers.FirstOrDefault(m => m.Id == id);
                cx.Manufacturers.Remove(manufacturer);
                cx.SaveChanges();
                return Ok("A cég törölve");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



        /*[HttpGet("GetRepair/{userID}")]
        public IActionResult GetRepairs(int userID)
        {
            try
            {

                var selectRepairs = cx.Connectionservices
                                      .Where(r => r.UserId == userID)
                                      .ToList(); // <- important

                var user = cx.Users.FirstOrDefault(u => u.Id == userID);

                List<profilerepairGetDTO> repairs = new List<profilerepairGetDTO>();

                foreach (var aRepair in selectRepairs)
                {
                    // Materialize parts list to avoid connection reuse issues
                    var parts = cx.Connectionparts
                                  .Where(p => p.RepairId == aRepair.RepairId)
                                  .ToList(); // <- important

                    profilerepairGetDTO repair = new profilerepairGetDTO
                    {
                        repairID = aRepair.RepairId,
                        name = user.Name,
                        postalCode = aRepair.PostalCode,
                        city = aRepair.City,
                        address = aRepair.Address,
                        phoneNumber = aRepair.PhoneNumber,
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

        public IActionResult postRepair([FromBody] profileRepairPostDTO dto)
        {
            try
            {
                var user = cx.Users.FirstOrDefault(u => u.Id == dto.userID);

                if (user == null)
                    return BadRequest("A felhasználó nem található.");

                if (dto.partNames == null || !dto.partNames.Any())
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


                foreach (var partName in dto.partNames)
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

        [HttpPut("updateOrderStatus {orderID}")]

        public IActionResult updateOrderStatus(int orderID, int status)
        {
            try
            {
                var order = cx.Connuserorders.FirstOrDefault(o => o.Id == orderID);
                if (order != null)
                {
                    order.Status = status;
                    cx.Connuserorders.Update(order);
                    cx.SaveChanges();
                    return Ok("Megrendelés státusza frissítve.");
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


        [HttpPut("updateRepairStatus {repairID}")]

        public IActionResult updateRepairStatus(string repairID, int status)
        {
            try
            {
                var repair = cx.Connectionservices.FirstOrDefault(o => o.RepairId == repairID);
                if (repair != null)
                {
                    repair.Status = status;
                    cx.Connectionservices.Update(repair);
                    cx.SaveChanges();
                    return Ok("Javítás státusza frissítve.");
                }
                else
                {
                    return BadRequest("A javítás nem található.");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("updateRepairPrice {repairID}")]

        public IActionResult updateRepairPrice(string repairID, int price)
        {
            try
            {
                var repair = cx.Connectionservices.FirstOrDefault(o => o.RepairId == repairID);
                if (repair != null)
                {
                    repair.Price = price;
                    cx.Connectionservices.Update(repair);
                    cx.SaveChanges();
                    return Ok("Javítás státusza frissítve.");
                }
                else
                {
                    return BadRequest("A javítás nem található.");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }




        [HttpDelete("deleteRepair/{repairID}")]

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



    }*/

    }
}