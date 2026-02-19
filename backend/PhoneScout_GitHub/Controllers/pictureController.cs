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
        public async Task<IActionResult> GetIndex(int phoneID)
        {
            var picture = await cx.Phonepictures
                .FirstOrDefaultAsync(p => p.PhoneId == phoneID && p.IsIndex == 1);

            if (picture == null || picture.PhonePicture1 == null)
                return NotFound("Index picture not found.");

            return File(picture.PhonePicture1, picture.ContentType);
        }

        [HttpGet("GetAllPictures/{phoneID}")]
        public async Task<IActionResult> GetAllPictures(int phoneID)
        {
            var pictures = await cx.Phonepictures
                .Where(p => p.PhoneId == phoneID)
                .Select(p => new
                {
                    p.Id,
                    p.ContentType,
                    ImageUrl = Url.Action("GetPictureById", new { id = p.Id })
                })
                .ToListAsync();

            if (!pictures.Any())
                return NotFound("No pictures found.");

            return Ok(pictures);

        }

        [HttpGet("GetPictureById/{id}")]
        public async Task<IActionResult> GetPictureById(int id)
        {
            var picture = await cx.Phonepictures.FindAsync(id);

            if (picture == null)
                return NotFound();

            return File(picture.PhonePicture1, picture.ContentType);
        }


        [HttpPost("PostPicture/{phoneID}")]
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
                    IsIndex = isIndex ? 0 : 1
                };

                cx.Phonepictures.Add(newPicture);
                await cx.SaveChangesAsync();

                return Ok("Picture uploaded.");
            }
            else
            {
                return BadRequest("A telefonhoz már tartozik indexkép.");
            }
        }

        [HttpPut("UpdatePicture/{id}")]
        public async Task<IActionResult> UpdatePicture(int id, IFormFile file, bool isIndex)
        {
            var picture = await cx.Phonepictures.FindAsync(id);

            if (picture == null)
                return NotFound();

            if (isIndex == true && cx.Phonepictures.Where(x=>x.IsIndex == 1).FirstOrDefault(p=>p.Id == id) != null  || isIndex == true && cx.Phonepictures.Where(x=>x.IsIndex == 0).Where(y=>y.PhoneId == picture.PhoneId).Count() == cx.Phonepictures.Where(z=>z.PhoneId==picture.PhoneId).Count() || isIndex == false)
            {
                using var ms = new MemoryStream();
                await file.CopyToAsync(ms);

                picture.PhonePicture1 = ms.ToArray();
                picture.ContentType = file.ContentType;
                picture.IsIndex = isIndex ? 1 : 0;

                await cx.SaveChangesAsync();

                return Ok("Picture updated.");
            }
            else
            {
                return BadRequest("A telefonhoz már tartozik indexkép.");
            }


        }


        [HttpDelete("DeletePicture/{id}")]
        public async Task<IActionResult> DeletePicture(int id)
        {
            var picture = await cx.Phonepictures.FindAsync(id);

            if (picture == null)
                return NotFound();

            cx.Phonepictures.Remove(picture);
            await cx.SaveChangesAsync();

            return NoContent();
        }
    }
}