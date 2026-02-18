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
                .FirstOrDefaultAsync(p => p.PhoneId == phoneID && p.IsIndex == 0);

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

        [HttpPut("UpdatePicture/{id}")]
        public async Task<IActionResult> UpdatePicture(int id, IFormFile file, bool isIndex)
        {
            var picture = await cx.Phonepictures.FindAsync(id);

            if (picture == null)
                return NotFound();

            using var ms = new MemoryStream();
            await file.CopyToAsync(ms);

            picture.PhonePicture1 = ms.ToArray();
            picture.ContentType = file.ContentType;
            picture.IsIndex = isIndex ? 0 : 1;

            await cx.SaveChangesAsync();

            return Ok("Picture updated.");
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

        // GET
        /*[HttpGet("GetPicture/{phoneID}/{position}")]
        [SwaggerOperation(
            Summary = "Telefonhoz tartozó egy kép lekérése.",
            Description = "A phoneID megadása utás, a string mezőbe a kép típusát kell megadni. Ez lehet: 'front', 'back', 'top', 'bottom', '_'"
        )]
        public async Task<IActionResult> GetPicture(int phoneID, string position)
        {
            var phonePictures = cx.Phonepictures.FirstOrDefault(p => p.PhoneId == phoneID);

            if (phonePictures == null)
                return NotFound("A telefonhoz tartozó képek nem találhatók.");

            byte[]? fileBytes = position.ToLower() switch
            {
                "front" => phonePictures.PictureFront,
                "back" => phonePictures.PictureBack,
                "top" => phonePictures.PictureTop,
                "bottom" => phonePictures.PictureBottom,
                _ => null
            };

            if (fileBytes == null)
                return NotFound("Ez a kép nem található.");

            return File(fileBytes, "application/octet-stream", $"{position}_{phoneID}.jpg");
        }

        [HttpGet("GetPicturesZip/{phoneID}")]
        [SwaggerOperation(
            Summary = "Telefonhoz tartozó összes kép lekérése",
            Description = "ZIP fájlt ad vissza, a telefonhoz tartozó összes képpel"
        )]
        public IActionResult GetPicturesZip(int phoneID)
        {
            var phonePictures = cx.Phonepictures.FirstOrDefault(p => p.PhoneId == phoneID);

            if (phonePictures == null)
                return NotFound("A telefonhoz tartozó képek nem találhatók.");

            using var ms = new MemoryStream();
            using (var zip = new System.IO.Compression.ZipArchive(ms, System.IO.Compression.ZipArchiveMode.Create, true))
            {
                if (phonePictures.PictureFront != null)
                {
                    var entry = zip.CreateEntry($"front_{phoneID}.jpg");
                    using var entryStream = entry.Open();
                    entryStream.Write(phonePictures.PictureFront, 0, phonePictures.PictureFront.Length);
                }

                if (phonePictures.PictureBack != null)
                {
                    var entry = zip.CreateEntry($"back_{phoneID}.jpg");
                    using var entryStream = entry.Open();
                    entryStream.Write(phonePictures.PictureBack, 0, phonePictures.PictureBack.Length);
                }

                if (phonePictures.PictureTop != null)
                {
                    var entry = zip.CreateEntry($"top_{phoneID}.jpg");
                    using var entryStream = entry.Open();
                    entryStream.Write(phonePictures.PictureTop, 0, phonePictures.PictureTop.Length);
                }

                if (phonePictures.PictureBottom != null)
                {
                    var entry = zip.CreateEntry($"bottom_{phoneID}.jpg");
                    using var entryStream = entry.Open();
                    entryStream.Write(phonePictures.PictureBottom, 0, phonePictures.PictureBottom.Length);
                }
            }

            ms.Position = 0;
            return File(ms.ToArray(), "application/zip", $"phone_{phoneID}_pictures.zip");
        }


        // POST
        [HttpPost("PostBlob/{phoneID}")]
        [SwaggerOperation(
            Summary = "Egy telefonhoz tartozó képek feltöltése.",
            Description = "Szükséges a phoneID megadása, a képek feltöltése nem kötelező. Maximum 16 MB, ha nincs feltöltve kép, NULL érték kerül az adatbázisba."
        )]
        public async Task<IActionResult> PostBlob(
    IFormFile? pictureFront,
    IFormFile? pictureBack,
    IFormFile? pictureTop,
    IFormFile? pictureBottom, int phoneID)
        {
            try
            {

                var phone = cx.Phonedatas.FirstOrDefault(p => p.PhoneId == phoneID);
                if (phone == null)
                {
                    return BadRequest("A telefon nem található!");
                }
                else
                {
                    var newPhonePictures = new Phonepicture
                    {
                        PhoneId = phone.PhoneId,
                        PictureFront = pictureFront != null ? await GetBytesAsync(pictureFront) : null,
                        PictureBack = pictureBack != null ? await GetBytesAsync(pictureBack) : null,
                        PictureTop = pictureTop != null ? await GetBytesAsync(pictureTop) : null,
                        PictureBottom = pictureBottom != null ? await GetBytesAsync(pictureBottom) : null
                    };
                    cx.Phonepictures.Add(newPhonePictures);
                    await cx.SaveChangesAsync();

                    return Ok("A telefonhoz tartozó képek sikeresen feltöltve.");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message, inner = ex.InnerException?.Message });
            }
        }

        private async Task<byte[]> GetBytesAsync(IFormFile file)
        {
            using var ms = new MemoryStream();
            await file.CopyToAsync(ms);
            return ms.ToArray();
        }


        [HttpPut("UpdatePicture/{phoneID}/{position}")]
        [SwaggerOperation(
            Summary = "Telefonhoz tartozó egy kép frissítése.",
            Description = "PhoneID és position ('front', 'back', 'top', 'bottom') megadása után frissíti a képet."
        )]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UpdatePicture(int phoneID, string position, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var phone = cx.Phonepictures.FirstOrDefault(p => p.PhoneId == phoneID);
            if (phone == null)
                return NotFound("A telefonhoz tartozó képek nem találhatók.");

            // Convert uploaded file to byte array
            byte[] fileBytes;
            using (var ms = new MemoryStream())
            {
                await file.CopyToAsync(ms);
                fileBytes = ms.ToArray();
            }

            // Update the correct column based on position
            switch (position.ToLower())
            {
                case "front":
                    phone.PictureFront = fileBytes;
                    break;
                case "back":
                    phone.PictureBack = fileBytes;
                    break;
                case "top":
                    phone.PictureTop = fileBytes;
                    break;
                case "bottom":
                    phone.PictureBottom = fileBytes;
                    break;
                default:
                    return BadRequest("Invalid position. Must be 'front', 'back', 'top', or 'bottom'.");
            }

            cx.Phonepictures.Update(phone);
            await cx.SaveChangesAsync();

            return Ok("Picture updated successfully.");
        }


        [HttpDelete("DeletePicture/{phoneID}/{position}")]
        [SwaggerOperation(
            Summary = "Egy kép törlése.",
            Description = "Egy telefonhoz tartozó képet töröl, phoneID és position ('front', 'back', 'top', 'bottom') megadása után."
        )]
        public async Task<IActionResult> DeletePicture(int phoneID, string position)
        {
            var phonePictures = cx.Phonepictures.FirstOrDefault(p => p.PhoneId == phoneID);
            if (phonePictures == null)
                return NotFound("No pictures found for this phone.");

            switch (position.ToLower())
            {
                case "front":
                    phonePictures.PictureFront = null;
                    break;
                case "back":
                    phonePictures.PictureBack = null;
                    break;
                case "top":
                    phonePictures.PictureTop = null;
                    break;
                case "bottom":
                    phonePictures.PictureBottom = null;
                    break;
                default:
                    return BadRequest("Invalid position. Must be 'front', 'back', 'top', or 'bottom'.");
            }

            cx.Phonepictures.Update(phonePictures);
            await cx.SaveChangesAsync();

            return Ok($"Picture '{position}' deleted successfully.");
        }


        [HttpDelete("DeletePictures/{phoneID}")]
        [SwaggerOperation(
            Summary = "Egy telefonhoz tartozó összes képet törli..",
            Description = "PhoneID megadása után, az egész rekordot törli."
        )]
        public async Task<IActionResult> DeletePictures(int phoneID)
        {
            var phonePictures = cx.Phonepictures.FirstOrDefault(p => p.PhoneId == phoneID);
            if (phonePictures == null)
                return NotFound("No pictures found for this phone.");

            cx.Phonepictures.Remove(phonePictures);
            await cx.SaveChangesAsync();

            return Ok("All pictures deleted successfully.");
        }*/

    }

}
