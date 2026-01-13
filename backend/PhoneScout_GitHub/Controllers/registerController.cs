using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhoneScout_GitHub.DTOs;
using PhoneScout_GitHub.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace PhoneScout_GitHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegistrationController : ControllerBase
    {
        // Az adatbázis kontextus eltárolása
        private readonly PhoneContext _cx;

        // A konstruktorban kérjük el a kontextust, amit a Program.cs-ben regisztráltál
        public RegistrationController(PhoneContext context)
        {
            _cx = context;
        }

        [HttpPost]
        public async Task<IActionResult> Registration(registerDTO user)
        {
            try
            {
                // Ellenőrizzük, létezik-e már az email
                if (await _cx.Users.AnyAsync(f => f.Email == user.email))
                {
                    return Ok("Létezik ilyen email cím!");
                }

                // Jogosultság lekérése
                var privilege = await _cx.Privileges.FirstOrDefaultAsync(f => f.Level == 1);
                if (privilege == null)
                {
                    return BadRequest("Nincs ilyen jogosultság az adatbázisban!");
                }

                // Felhasználói adatok előkészítése
                user.privilegeID = privilege.Id;
                user.active = 0;
                
                // Jelszó hashelés és sózás
                string plainPasswordHash = Program.CreateSHA256(user.HASH);
                string userSalt = Program.GenerateSalt();
                string veglegesHash = Program.CreateSHA256(plainPasswordHash + userSalt);

                var newUser = new User
                {
                    Name = user.name,
                    Email = user.email,
                    Salt = userSalt,
                    Hash = veglegesHash,
                    PrivilegeId = privilege.Id,
                    Active = 0
                };

                // Mentés az adatbázisba
                await _cx.Users.AddAsync(newUser);
                await _cx.SaveChangesAsync();

                // Email tartalom összeállítása
                string emailTargy = "Regisztráció a PhoneScout rendszerbe.";
                string emailTorzs = $@"
                <div style=""font-family:Arial,sans-serif;background-color:#f5f5f5;color:#004c4c"">
                    <div style=""max-width:600px;margin:auto;padding:20px;border:1px solid #166b6b;border-radius:10px"">
                        <h2 style=""color:#166b6b"">Regisztráció a PhoneScout oldalra</h2>
                        <h3>Kedves {user.name}!</h3>
                        <p>
                            A regisztráció befejezéséhez kattints az alábbi linkre:
                            <br><br>
                            <a style=""display:inline-block;padding:10px 20px;background-color:#166b6b;color:white;text-decoration:none;border-radius:5px;font-weight:bold"" 
                               href=""https://localhost:7179/api/registration?name={user.name}&email={user.email}"" 
                               target=""_blank"">Fiók aktiválása</a>
                        </p>
                        <p>Üdvözlettel,<br>PhoneScout Team</p>
                        <p style=""font-size:12px;color:#004c4c"">Ez egy automatikusan generált üzenet, kérjük ne válaszoljon rá.</p>
                    </div>
                </div>";

                // Email küldése (Program.cs-ben lévő metódussal)
                // await Program.SendEmail(user.email, emailTargy, emailTorzs);

                return Ok("Sikeres regisztráció. A regisztrációt fejezze be az email címére küldött link segítségével.");
            }
            catch (Exception ex)
            {
                return BadRequest($"Hiba történt: {ex.Message}");
            }
        }

        [HttpGet]
        public async Task<IActionResult> ActivateAccount(string name, string email)
        {
            try
            {
                // Felhasználó megkeresése
                User? user = await _cx.Users.FirstOrDefaultAsync(f => f.Name == name && f.Email == email);
                
                if (user == null)
                {
                    return Ok("Sikertelen aktiválás. Nincs ilyen felhasználó!");
                }

                if (user.Active != 0)
                {
                    return Ok("A regisztráció befejezése már korábban megtörtént.");
                }

                // Aktiválás
                user.Active = 1;
                _cx.Users.Update(user);
                await _cx.SaveChangesAsync();

                return Ok("Sikeres aktiválás! Most már bejelentkezhet.");
            }
            catch (Exception ex)
            {
                return BadRequest($"Hiba az aktiválás során: {ex.Message}");
            }
        }
    }
}
