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
    public class blobController : ControllerBase
    {
        private readonly PhoneContext cx;

        public blobController(PhoneContext context)
        {
            cx = context;
        }



        [HttpGet("GetIndex/{phoneID}")]
        [SwaggerOperation(
            Summary = "Egy telefonhoz tartozó indexkép lekérése.",
            Description = "A telefon azonosító megadása után, találat esetén visszadja a telefonhoz tartozó indexképet."
        )]
        public async Task<IActionResult> GetIndex(int phoneID)
        {
            var picture = await cx.Phonepictures
                .FirstOrDefaultAsync(p => p.PhoneId == phoneID && p.IsIndex == 1);

            if (picture == null)
                return NotFound("Nem található indexkép.");

            return File(picture.PhonePicture1, picture.ContentType);
        }

        [HttpGet("GetAllPictures/{phoneID}")]
        [SwaggerOperation(
            Summary = "Egy telefonhoz tartozó összes kép lekérése.",
            Description = "A telefon azonosító megadása után, találat esetén visszadja a telefonhoz tartozó összes képet."
        )]
        public async Task<IActionResult> GetAllPictures(int phoneID)
        {
            var pictures = await cx.Phonepictures
                .Where(p => p.PhoneId == phoneID)
                .Select(p => new
                {
                    p.Id,
                    p.ContentType,
                    ImageUrl = Url.Action("GetPictureById", new { id = p.Id }),
                    p.IsIndex
                })
                .ToListAsync();

            if (!pictures.Any())
                return NotFound("Nem található kép.");

            return Ok(pictures);

        }

        [HttpGet("GetPictureById/{id}")]
        [SwaggerOperation(
            Summary = "Egy kép lekérése.",
            Description = "A kép azonosítójának megadása után, találat esetén visszaadja a képet."
        )]
        public async Task<IActionResult> GetPictureById(int id)
        {
            var picture = await cx.Phonepictures.FindAsync(id);

            if (picture == null)
                return NotFound();

            return File(picture.PhonePicture1, picture.ContentType);
        }


        [HttpPost("PostPicture/{phoneID}/{isIndex}")]
        [SwaggerOperation(
            Summary = "Kép feltöltése",
            Description = "A szükséges adatok megadása után, feltölti a képet a megadott telefonhoz. Az isIndex paraméterrel megadható, hogy a kép indexkép-e vagy sem. Egy telefonhoz csak egy indexkép tartozhat."
        )]
        public async Task<IActionResult> PostPicture(int phoneID, IFormFile file, bool isIndex)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Invalid file.");

            if (isIndex == true && cx.Phonepictures.Where(p => p.PhoneId == phoneID).FirstOrDefault(x => x.IsIndex == 1) == null || isIndex == false)
            {
                using var ms = new MemoryStream();
                await file.CopyToAsync(ms);
 
                var newPicture = new Phonepicture
                {
                    PhoneId = phoneID,
                    PhonePicture1 = ms.ToArray(),
                    ContentType = file.ContentType,
                    IsIndex = isIndex ? 1 : 0,
                };

                cx.Phonepictures.Add(newPicture);
                await cx.SaveChangesAsync();

                return Ok("A kép feltöltve.");
            }
            else
            {
                return BadRequest("A telefonhoz már tartozik indexkép.");
            }
        }

       

        [HttpPut("SetIndex/{phoneId}/{pictureId}")]
        [SwaggerOperation(
            Summary = "Kép megjelölése indexképként",
            Description = "A megadott kép megjelölése indexképként a megadott telefonhoz. Egy telefonhoz csak egy indexkép tartozhat, így a művelet során a többi kép indexkép jelölése törlődik."
        )]
        public async Task<IActionResult> SetIndex(int phoneId, int pictureId)
        {
            var pictures = await cx.Phonepictures
                .Where(p => p.PhoneId == phoneId)
                .ToListAsync();

            if (!pictures.Any())
                return NotFound("No pictures found.");

            foreach (var pic in pictures)
                pic.IsIndex = 0;

            var selected = pictures.FirstOrDefault(p => p.Id == pictureId);

            if (selected == null)
                return NotFound("Picture not found.");

            selected.IsIndex = 1;

            await cx.SaveChangesAsync();

            return Ok("Index updated.");
        }

        [HttpDelete("DeletePicture/{id}")]
        [SwaggerOperation(
            Summary = "Kép törlése",
            Description = "A megadott azonosítóval rendelkező kép törlése. Ha a kép indexkép volt, akkor a telefonhoz nem marad indexkép."
        )]
        public async Task<IActionResult> DeletePicture(int id)
        {
            var picture = await cx.Phonepictures.FindAsync(id);

            if (picture == null)
                return NotFound();

            cx.Phonepictures.Remove(picture);
            await cx.SaveChangesAsync();

            return Ok("A kép törölve.");
        }
    }
}