using Microsoft.AspNetCore.DataProtection.XmlEncryption;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration.UserSecrets;
using PhoneScout_GitHub.DTOs;
using PhoneScout_GitHub.Models;
using Swashbuckle.AspNetCore.Annotations;


namespace PhoneScout_GitHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class wpfUsersController : ControllerBase
    {

        private readonly PhoneContext cx;

        public wpfUsersController(PhoneContext context)
        {
            cx = context;
        }

        [HttpGet]
        [SwaggerOperation(
            Summary = "Felhasználók lekérése.",
            Description = "Admin felülethez az összes felhasználók lekérése."
        )]
        public IActionResult GetUsersWPF()
        {
            try
            {
                var users = cx.Users
                .OrderBy(u => u.Id)
                .Select(u => new wpfUsersDTO
                {
                    userID = u.Id,
                    userFullName = u.Name,
                    userEmail = u.Email,
                    userPrivilegeLevel = u.Privilege.Level,
                    userPrivilegeName = u.Privilege.Name,
                    userActive = u.Active,
                })
                .ToList();


                return Ok(users);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        [SwaggerOperation(
            Summary = "Felhasználó módosítása.",
            Description = "Admin felülethez a felhasználó azonosítójának és a szükséges adatok megadása után a felhasználó módosítása."
        )]
        public IActionResult UpdateUserWPF([FromBody] wpfUsersDTO dto, int id)
        {
            try
            {
                var user = cx.Users
                    .FirstOrDefault(m => m.Id == id);

                if (user == null)
                {
                    return NotFound("A felhasználó nem található");
                }

                var privilege = cx.Privileges.FirstOrDefault(p=>p.Level == dto.userPrivilegeLevel);
                if(privilege == null)
                {
                    return NotFound("A jogosultsági szint nem található");
                }


                
                user.Name = dto.userFullName;
                user.Email = dto.userEmail;
                user.Privilege = privilege;
                user.Active = dto.userActive;

                cx.SaveChanges();

                return Ok("A felhasználó adatai frissítve");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



        [HttpDelete("{id}")]
        [SwaggerOperation(
            Summary = "Felhasználó törlése.",
            Description = "Admin felülethez a felhasználó azonosítójának megadása után a felhasználó törlése."
        )]
        public IActionResult DeleteUserWPF(int id)
        {
            try
            {
                var user = cx.Users.FirstOrDefault(m => m.Id == id);
                if (user == null)
                {
                    return BadRequest("A felhasználó nem található.");
                }
                else
                {
                    cx.Users.Remove(user);
                }
                cx.SaveChanges();
                return Ok("A felhasználó törölve");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}