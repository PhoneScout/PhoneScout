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
            try
            {
                var user = _cx.Users.FirstOrDefault(u => u.Email == loginDTO.Email);

                if (user == null)
                {
                    return BadRequest("Hibás jelszó vagy email!");
                }

                // Inaktív fiók ellenőrzése
                if (user.Active == 0)
                {
                    return BadRequest("A fiók még nincs aktiválva! Kérjük, ellenőrizze az email fiókját.");
                }

                //  A kliensről érkező TmpHash (hash+salt) újra-hashelése a szerver oldalon
                string finalHash = Program.CreateSHA256(loginDTO.TmpHash);

                // 4. Az újra-hashelt érték összehasonlítása az adatbázisban tárolttal
                if (user.Hash != finalHash)
                {
                    return BadRequest("Hibás jelszó vagy email!");
                }

                // 5. Sikeres bejelentkezés: Token generálás
                string token = Guid.NewGuid().ToString();

                lock (Program.LoggedInUsers)
                {
                    // Biztonsági generálás, ha véletlen ütközne a GUID
                    while (Program.LoggedInUsers.ContainsKey(token))
                    {
                        token = Guid.NewGuid().ToString();
                    }
                    Program.LoggedInUsers.Add(token, user);
                }

                return Ok(new LoggedUser
                {
                    FirstName = user.Name,
                    Email = user.Email,
                    Privilege = (int)user.PrivilegeId,
                    Token = token
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException != null ? ex.InnerException.Message : ex.Message);
            }
        }
    }
}
