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
        [SwaggerOperation(
            Summary = "Események lekérése.",
            Description = "Visszaadja az összes eseményt. Ha nincs találat, üres tömböt ad vissza."
        )]
        public IActionResult GetAllEvents()
        {
            try
            {
                var allEvents = cx.Events
                    .Select(e => new eventDTO
                    {
                        eventID = e.EventId,
                        eventHostName = cx.Manufacturers
                            .Where(m => m.Id == e.EventHostId)
                            .Select(m => m.ManufacturerName)
                            .FirstOrDefault(),

                        eventHostURL = cx.Manufacturers
                            .Where(m => m.Id == e.EventHostId)
                            .Select(m => m.ManufacturerUrl)
                            .FirstOrDefault(),

                        eventName = e.EventName,
                        eventDate = e.EventDate,
                        eventURL = e.EventUrl,

                        imageBase64 = e.EventImage != null
                            ? Convert.ToBase64String(e.EventImage)
                            : null,

                        contentType = e.ContentType
                    })
                    .ToList();

                return Ok(allEvents);
            }
            catch (Exception ex)
            {
                return BadRequest($"Hiba történt: {ex.Message}");
            }
        }
        

        [HttpGet("{eventID}")]
                [SwaggerOperation(
            Summary = "Egy esemény lekérése.",
            Description = "Visszaad egy eseményt azonosító alapján. Ha nincs találat, üres tömböt ad vissza."
        )]
public IActionResult GetEvent(int eventID)
{
    try
    {
        var oneEvent = cx.Events
            .Where(e => e.EventId == eventID)
            .Select(e => new eventDTO
            {
                eventID = e.EventId,
                eventHostName = cx.Manufacturers
                    .Where(m => m.Id == e.EventHostId)
                    .Select(m => m.ManufacturerName)
                    .FirstOrDefault(),

                eventHostURL = cx.Manufacturers
                    .Where(m => m.Id == e.EventHostId)
                    .Select(m => m.ManufacturerUrl)
                    .FirstOrDefault(),

                eventName = e.EventName,
                eventDate = e.EventDate,
                eventURL = e.EventUrl,

                imageBase64 = e.EventImage != null
                    ? Convert.ToBase64String(e.EventImage)
                    : null,

                contentType = e.ContentType
            })
            .FirstOrDefault();

        if (oneEvent == null)
            return NotFound("Az esemény nem található");

        return Ok(oneEvent);
    }
    catch (Exception ex)
    {
        return BadRequest($"Hiba történt: {ex.Message}");
    }
}

[HttpGet("/{eventManufacturerName}")]
        [SwaggerOperation(
            Summary = "Gyártó események lekérése.",
            Description = "Visszaadja a megadott gyártóhoz tartozó összes eseményt. Ha nincs találat, üres tömböt ad vissza."
        )]
public IActionResult GetManufacturersEvents(string mannufacturerName)
{
    try
    {
        var manufacturer = cx.Manufacturers.FirstOrDefault(m=>m.ManufacturerName == mannufacturerName).Id;

        var oneEvent = cx.Events
            .Where(e => e.EventHostId == manufacturer)
            .Select(e => new eventDTO
            {
                eventID = e.EventId,
                eventHostName = cx.Manufacturers
                    .Where(m => m.Id == e.EventHostId)
                    .Select(m => m.ManufacturerName)
                    .FirstOrDefault(),

                eventHostURL = cx.Manufacturers
                    .Where(m => m.Id == e.EventHostId)
                    .Select(m => m.ManufacturerUrl)
                    .FirstOrDefault(),

                eventName = e.EventName,
                eventDate = e.EventDate,
                eventURL = e.EventUrl,

                imageBase64 = e.EventImage != null
                    ? Convert.ToBase64String(e.EventImage)
                    : null,

                contentType = e.ContentType
            })
            .FirstOrDefault();

        if (oneEvent == null)
            return NotFound("Az nem található esemény a megadott gyártóhoz!");

        return Ok(oneEvent);
    }
    catch (Exception ex)
    {
        return BadRequest($"Hiba történt: {ex.Message}");
    }
}



[HttpPost]
        [SwaggerOperation(
            Summary = "Események hozzáadása.",
            Description = "Szükséges adatok megadása után feltölt egy eseményt."
        )]
public async Task<IActionResult> PostEvent(
    [FromForm] eventPostDTO dto,
    IFormFile? file)
{
    try
    {
        var manufacturer = cx.Manufacturers
            .FirstOrDefault(m => m.ManufacturerName == dto.eventHostName);

        if (manufacturer == null)
            return BadRequest("A cég nem található");

        byte[]? imageData = null;
        string? contentType = null;

        if (file != null && file.Length > 0)
        {
            using var ms = new MemoryStream();
            await file.CopyToAsync(ms);
            imageData = ms.ToArray();
            contentType = file.ContentType;
        }

        var newEvent = new Event
        {
            EventHostId = manufacturer.Id,
            EventName = dto.eventName,
            EventDate = dto.eventDate,
            EventUrl = dto.eventURL,
            EventImage = imageData,
            ContentType = contentType
        };

        cx.Events.Add(newEvent);
        await cx.SaveChangesAsync();

        return Ok("Az esemény sikeresen hozzáadva.");
    }
    catch (Exception ex)
    {
        return BadRequest($"Hiba történt: {ex.Message}");
    }
}

[HttpPut("{eventID}")]
        [SwaggerOperation(
            Summary = "Események frissítése.",
            Description = "Szükséges adatok megadása után frissíti a megadott azonosítójú eseményt."
        )]
public async Task<IActionResult> UpdateEvent(
    int eventID,
    [FromForm] eventPostDTO dto,
    IFormFile? file)
{
    try
    {
        var selectedEvent = await cx.Events.FindAsync(eventID);
        if (selectedEvent == null)
            return NotFound("Az esemény nem található");

        var manufacturer = cx.Manufacturers
            .FirstOrDefault(m => m.ManufacturerName == dto.eventHostName);

        if (manufacturer == null)
            return BadRequest("A cég nem található");

        selectedEvent.EventHostId = manufacturer.Id;
        selectedEvent.EventName = dto.eventName;
        selectedEvent.EventDate = dto.eventDate;
        selectedEvent.EventUrl = dto.eventURL;

        if (file != null && file.Length > 0)
        {
            using var ms = new MemoryStream();
            await file.CopyToAsync(ms);
            selectedEvent.EventImage = ms.ToArray();
            selectedEvent.ContentType = file.ContentType;
        }

        await cx.SaveChangesAsync();

        return Ok("Az esemény sikeresen frissítve.");
    }
    catch (Exception ex)
    {
        return BadRequest($"Hiba történt: {ex.Message}");
    }
}

[HttpDelete("{eventID}")]
        [SwaggerOperation(
            Summary = "Események törlése.",
            Description = "A megadott azonosítójú esemény törlése. Ha nincs találat, akkor hibaüzenetet ad vissza."
        )]
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
