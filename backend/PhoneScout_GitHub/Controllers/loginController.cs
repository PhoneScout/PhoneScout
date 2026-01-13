using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhoneScout_GitHub.DTOs;
using PhoneScout_GitHub.Models;
using System;
using System.Linq;

namespace PhoneScout_GitHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        // Adatbázis kontextus mező
        private readonly PhoneContext _cx;

        // Konstruktor, amin keresztül megkapja a kontrollert a PhoneContext-et
        public LoginController(PhoneContext context)
        {
            _cx = context;
        }

        [HttpGet("GetSalt/{Email}")]
        public IActionResult GetSalt(string Email)
        {
            // NINCS using (var cx = new PhoneContext())
            try
            {
                var user = _cx.Users.FirstOrDefault(f => f.Email == Email);
                if (user == null)
                {
                    return BadRequest("Nincs ilyen email című felhasználó!");
                }
                return Ok(user.Salt);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public IActionResult Login(LoginDTO loginDTO)
        {
            // NINCS using (var cx = new PhoneContext())
            try
            {

                // Felhasználó keresése az email, hash és aktív állapot alapján
                User? loggedUser = _cx.Users.FirstOrDefault(f =>
                    f.Email == loginDTO.Email &&
                    f.Hash == loginDTO.TmpHash &&
                    f.Active == 1);

                if (loggedUser == null)
                {
                    // Érdemes megnézni, hogy létezik-e az email, de inaktív-e, vagy a jelszó rossz
                    var checkUser = _cx.Users.FirstOrDefault(u => u.Email == loginDTO.Email);
                    if (checkUser != null && checkUser.Active == 0)
                    {
                        return BadRequest("A fiók még nincs aktiválva! Kérjük, ellenőrizze az email fiókját.");
                    }

                    return BadRequest("Hibás jelszó vagy email!");
                }
                else
                {
                    // Token generálás és bejelentkezett felhasználók listájához adás
                    string token = Guid.NewGuid().ToString();

                    lock (Program.LoggedInUsers)
                    {
                        // Ha ugyanaz a felhasználó többször jelentkezne be, elkerüljük a kulcs-ütközést
                        if (Program.LoggedInUsers.ContainsKey(token))
                        {
                            token = Guid.NewGuid().ToString();
                        }
                        Program.LoggedInUsers.Add(token, loggedUser);
                    }

                    return Ok(new LoggedUser
                    {
                        FirstName = loggedUser.Name,
                        Email = loggedUser.Email,
                        Privilege = (int)loggedUser.PrivilegeId,
                        Token = token
                    });
                }
            }
            catch (Exception ex)
            {
                // Ha van InnerException, azt adjuk vissza, egyébként a sima üzenetet
                return BadRequest(ex.InnerException != null ? ex.InnerException.Message : ex.Message);
            }
        }
    }
}
