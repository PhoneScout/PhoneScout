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
    public class eventController : ControllerBase
    {

        private readonly PhoneContext cx;

        public eventController(PhoneContext context)
        {
            cx = context;
        }


        [HttpGet]
        public IActionResult GetAllEvents()
        {
            try
            {
                var allEvent = cx.Events.Select(e => new eventDTO
                {
                    eventID = e.EventId,
                    eventHostName = cx.Manufacturers.FirstOrDefault(m => m.Id == e.EventHostId).ManufacturerName,
                    eventHostURL = cx.Manufacturers.FirstOrDefault(m => m.Id == e.EventHostId).ManufacturerUrl,
                    eventName = e.EventName,
                    eventDate = e.EventDate,
                    eventURL = e.EventUrl
                });

                return Ok(allEvent);
            }
            catch (Exception ex)
            {
                return BadRequest($"Hiba történt a feldolgozás során: {ex}");
            }
        }

        [HttpGet("{eventID}")]

        public IActionResult GetEvent(int eventID)
        {
            try
            {
                var oneEvent = cx.Events.Where(e => e.EventId == eventID).Select(e => new eventDTO
                {
                    eventID = e.EventId,
                    eventHostName = cx.Manufacturers.FirstOrDefault(m => m.Id == e.EventHostId).ManufacturerName,
                    eventHostURL = cx.Manufacturers.FirstOrDefault(m => m.Id == e.EventHostId).ManufacturerUrl,
                    eventName = e.EventName,
                    eventDate = e.EventDate,
                    eventURL = e.EventUrl
                });

                if (oneEvent == null)
                {
                    return BadRequest("Az esemény nem található");
                }
                else
                {
                    return Ok(oneEvent);
                }
            }
            catch (Exception ex)
            {
                return BadRequest($"Hiba történt a feldolgozás során: {ex}");
            }
        }

        [HttpGet("/{eventManufacturerName}")]
        public IActionResult GetManufacturersEvents(string mannufacturerName)
        {
            try
            {
                var manufacturer = cx.Manufacturers.FirstOrDefault(m => m.ManufacturerName == mannufacturerName);

                var manufacturersEvents = cx.Events.Where(e => e.EventHostId == manufacturer.Id).Select(e => new eventDTO
                {
                    eventID = e.EventId,
                    eventHostName = manufacturer.ManufacturerName,
                    eventHostURL = manufacturer.ManufacturerUrl,
                    eventName = e.EventName,
                    eventDate = e.EventDate,
                    eventURL = e.EventUrl
                });

                if (manufacturersEvents == null)
                {
                    return BadRequest("A céghez nem tartozik esemény.");
                }
                else
                {
                    return Ok(manufacturersEvents);
                }
            }
            catch (Exception ex)
            {
                return BadRequest($"Hiba történt a feldolgozás során: {ex}");
            }
        }

        [HttpPost]
        public IActionResult PostEvent([FromBody] eventPostDTO dto)
        {
            try
            {
                var manufacturer = cx.Manufacturers.FirstOrDefault(m => m.ManufacturerName == dto.eventHostName);

                if (manufacturer == null)
                {
                    return BadRequest("A cég nem található");
                }
                else
                {
                    var newEvent = new Event
                    {
                        EventId = dto.eventID,
                        EventHostId = manufacturer.Id,
                        EventName = dto.eventName,
                        EventDate = dto.eventDate,
                        EventUrl = dto.eventURL
                    };

                    cx.Events.Add(newEvent);
                    cx.SaveChanges();
                    return Ok("Az esemény sikeresen hozzáadva.");
                }
            }
            catch (Exception ex)
            {
                return BadRequest($"Hiba történt a feldolgozás során: {ex}");
            }
        }

        [HttpPut("{eventID}")]
        public IActionResult UpdateEvent([FromBody] eventPostDTO dto, int eventID)
        {
            try
            {
                var manufacturer = cx.Manufacturers.FirstOrDefault(m => m.ManufacturerName == dto.eventHostName);

                if (manufacturer == null)
                {
                    return BadRequest("A cég nem található");
                }
                else
                {
                    var selectedEvent = cx.Events.FirstOrDefault(e => e.EventId == eventID);
                    if (selectedEvent == null)
                    {
                        return BadRequest("Az esemény nem található");
                    }
                    else
                    {

                        selectedEvent.EventId = selectedEvent.EventId;
                        selectedEvent.EventHostId = manufacturer.Id;
                        selectedEvent.EventName = dto.eventName;
                        selectedEvent.EventDate = dto.eventDate;
                        selectedEvent.EventUrl = dto.eventURL;


                        cx.Events.Update(selectedEvent);
                        cx.SaveChanges();
                        return Ok("Az esemény sikeresen frissítve.");
                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest($"Hiba történt a feldolgozás során: {ex}");
            }
        }

        [HttpDelete("{eventID}")]
        public IActionResult DeleteEvent(int eventID)
        {
            try
            {

                var selectedEvent = cx.Events.FirstOrDefault(e => e.EventId == eventID);
                if (selectedEvent == null)
                {
                    return BadRequest("Az esemény nem található");
                }
                else
                {
                    cx.Events.Remove(selectedEvent);
                    cx.SaveChanges();
                    return Ok("Az esemény sikeresen eltávolítva.");
                }

            }
            catch (Exception ex)
            {
                return BadRequest($"Hiba történt a feldolgozás során: {ex}");
            }
        }

    }
}
