using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhoneScout_GitHub.DTOs;
using PhoneScout_GitHub.Models;
using System;
using System.Linq;
using System.Threading.Tasks;
using Swashbuckle.AspNetCore.Annotations;


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
        [SwaggerOperation(
            Summary = "Felhasználó regisztrálása",
            Description = "Felhasználói adatok rögzítése az adatbázisban, ha még nincs regisztrálva."
        )]
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
                var privilege = await _cx.Privileges.FirstOrDefaultAsync(f => f.Level == 5);
                if (privilege == null)
                {
                    return BadRequest("Nincs ilyen jogosultság az adatbázisban!");
                }

                // Felhasználói adatok előkészítése
                user.privilegeID = privilege.Id;
                user.active = 0;

                // Jelszó hashelés és sózás
                string veglegesHash = Program.CreateSHA256(user.HASH);
                string userSalt = user.SALT;

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
                    <div style=""background: linear-gradient(135deg, #2300B3 0%, #68F145 100%); margin: 0; padding: 0; min-height: 100vh;"">
                        <!-- Külső táblázat a teljes magasság és a vertikális középre igazítás miatt -->
                        <table width=""100%"" height=""100%"" cellpadding=""0"" cellspacing=""0"" border=""0"" style=""min-height: 100vh; width: 100%;"">
                            <tr>
                                <td align=""center"" valign=""middle"" style=""padding: 20px;"">
                                    
                                    <!-- Fehér kártya (formContainer stílus) -->
                                    <div style=""max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; box-shadow: 0 0 20px rgba(0, 0, 0, 0.25); overflow: hidden; display: inline-block; text-align: left;"">
                                        <div style=""padding: 40px 30px; text-align: center;"">
                                            
                                            <h2 style=""color: #333333; font-size: 28px; margin-bottom: 30px; margin-top: 0; font-family: Arial, sans-serif;"">Regisztráció a PhoneScout oldalra</h2>
                                            
                                            <h3 style=""color: #333333; font-size: 18px; margin-bottom: 20px; font-family: Arial, sans-serif;"">Kedves {user.name}!</h3>
                                            
                                            <p style=""color: #555555; font-size: 16px; line-height: 1.5; margin-bottom: 35px; font-family: Arial, sans-serif;"">
                                                A regisztráció befejezéséhez kattints az alábbi linkre:
                                            </p>

                                            <!-- Gomb -->
                                            <div style=""margin-bottom: 10px;"">
                                                <a href=""http://localhost:3000/fiokaktivalas?name={user.name}&email={user.email}"" 
                                                target=""_blank"" 
                                                style=""display: inline-block; width: 80%; max-width: 280px; background-color: #28a745; color: #ffffff; padding: 18px 25px; text-decoration: none; border-radius: 4px; font-size: 18px; font-weight: bold; font-family: Arial, sans-serif;"">
                                                Fiók aktiválása
                                                </a>
                                            </div>

                                            <!-- Lábjegyzet -->
                                            <div style=""margin-top: 45px; border-top: 1px solid #eeeeee; padding-top: 20px; text-align: left;"">
                                                <p style=""color: #333333; font-size: 14px; margin: 0; font-family: Arial, sans-serif;"">Üdvözlettel,<br><strong>PhoneScout Team</strong></p>
                                                <p style=""font-size: 12px; color: #777777; margin-top: 15px; line-height: 1.4; font-family: Arial, sans-serif;"">Ez egy automatikusan generált üzenet, kérjük ne válaszoljon rá.</p>
                                            </div>
                                        </div>
                                    </div>

                                </td>
                            </tr>
                        </table>
                    </div>";



                // Email küldése (Program.cs-ben lévő metódussal)
                await Program.SendEmail(user.email, emailTargy, emailTorzs);

                return Ok("Sikeres regisztráció. A regisztrációt fejezze be az email címére küldött link segítségével.");
            }
            catch (Exception ex)
            {
                return BadRequest($"Hiba történt: {ex.Message}");
            }
        }

        [HttpPut]
        [SwaggerOperation(
            Summary = "Fiók aktiválás",
            Description = "A regisztrációnál kapott emailen keresztül elérhető, fiók aktiválás után jogosult az oldalra történő bejelentkezésre."
        )]
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

        [HttpPut("ActivateAccountWPF")]
        [SwaggerOperation(
            Summary = "Fiók aktiválás WPF",
            Description = "A regisztrációnál kapott emailen keresztül elérhető, fiók aktiválás után jogosult az oldalra történő bejelentkezésre."
        )]
        
        public async Task<IActionResult> ActivateAccountWPF([FromQuery] string email)
        {
            try
            {
                // Felhasználó megkeresése
                User? user = await _cx.Users.FirstOrDefaultAsync(f => f.Email == email);

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

        [HttpGet("GetId/{Email}")]
        [SwaggerOperation(
            Summary = "Email lekérése ID alapján",
            Description = "A profil adatok megváltoztatásához szükséges, email cím alapján visszaadja a felhasználó ID-ét"
        )]
        public IActionResult GetId(string Email)
        {
            // NINCS using (var cx = new PhoneContext())
            try
            {
                var user = _cx.Users.FirstOrDefault(f => f.Email == Email);
                if (user == null)
                {
                    return BadRequest("Nincs ilyen email című felhasználó!");
                }
                return Ok(user.Id);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("ChangePassword")]
        [SwaggerOperation(
            Summary = "Jelszóváltoztatás",
            Description = "Amennyiben a régi jelszót helyesen adta meg a felhasználó, tudja módosítani a bejelentkezéshez használt jelszavát"
        )]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDTO request)
        {
            try
            {
                var user = await _cx.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

                if (user == null)
                {
                    return NotFound("A felhasználó nem található.");
                }

                string oldHashCheck = Program.CreateSHA256(request.OldPassword);

                if (user.Hash != oldHashCheck)
                {
                    return BadRequest("A régi jelszó nem megfelelő.");
                }

                user.Hash = Program.CreateSHA256(request.NewPassword);
                user.Salt = request.SALT;

                _cx.Users.Update(user);
                await _cx.SaveChangesAsync();

                return Ok("A jelszó sikeresen módosítva.");
            }
            catch (Exception ex)
            {
                return BadRequest($"Hiba történt a módosítás során: {ex.Message}");
            }
        }
    }
}
