using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhoneScout_GitHub.DTOs;
using PhoneScout_GitHub.Models;

namespace PhoneScout_GitHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class filterPageController : ControllerBase
    {
        private readonly PhoneContext _context;

        public filterPageController(PhoneContext context)
        {
            _context = context;
        }

        [HttpPost("GetFilteredPhones")]

        public IActionResult GetFilteredPhones([FromBody] filterPageDTO filters)
        {
            try
            {
                var phones = _context.Phonedatas
                    .Where(p => p.PhoneDeleted == 0
                    && (!filters.manufacturerNames.Any() || filters.manufacturerNames.Contains(p.Manufacturer.ManufacturerName))
                    && (!filters.cpuNames.Any() || filters.cpuNames.Contains(p.Cpu.CpuName))
                    && (filters.phoneAntutu == 0 || filters.phoneAntutu < p.PhoneAntutu)
                    && (filters.cpuMaxClockSpeed == 0 || filters.cpuMaxClockSpeed < p.Cpu.CpuMaxClockSpeed)
                    && (filters.cpuCoreNumber == 0 || filters.cpuCoreNumber < p.Cpu.CpuCoreNumber)
                    && (filters.screenSizeMin == 0 || filters.screenSizeMin < p.ScreenSize)
                    && (filters.screenSizeMax == 0 || filters.screenSizeMax > p.ScreenSize)
                    && (filters.screenRefreshRateMin == 0 || filters.screenRefreshRateMin < p.ScreenRefreshRate)
                    && (filters.screenRefreshRateMax == 0 || filters.screenRefreshRateMax > p.ScreenRefreshRate)
                    && (filters.phoneWeightMin == 0 || filters.phoneWeightMin < p.PhoneWeight)
                    && (filters.phoneWeightMax == 0 || filters.phoneWeightMax > p.PhoneWeight)
                    && (filters.screenMaxBrightness == 0 || filters.screenMaxBrightness < p.ScreenMaxBrightness)
                    && (filters.ramAmount == 0 || filters.ramAmount < p.Connphoneramstorages.Max(r => r.Ramstorage.RamAmount))
                    && (filters.storageAmount == 0 || filters.storageAmount < p.Connphoneramstorages.Max(r => r.Ramstorage.StorageAmount))
                    && (filters.batteryCapacity == 0 || filters.batteryCapacity < p.BatteryCapacity)
                    && (filters.phoneReleaseDate == 0 || p.PhoneReleaseDate.HasValue && p.PhoneReleaseDate.Value.Year >= filters.phoneReleaseDate)
                    )
                    .Select(p => new mainPageDTO
                    {
                        phoneID = p.PhoneId,
                        phoneName = p.PhoneName,
                        phoneInStore = p.PhoneInStore,
                        phonePrice = p.PhonePrice
                    });
                if (phones != null)
                {
                    return Ok(phones);
                }
                else
                {
                    return BadRequest("Nincsenek megfelelő telefonok a szűrt feltételekhez.");
                }

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet("GetDatasForFilters")]

        public IActionResult GetDatasForFilters()
        {
            try
            {
                var manufacturerNames = _context.Phonedatas
                    .Select(m => m.Manufacturer.ManufacturerName)
                    .Distinct()
                    .ToList();

                var cpuNames = _context.Phonedatas
                    .Select(c => c.Cpu.CpuName)
                    .Distinct()
                    .ToList();

                var maxAntutu = _context.Phonedatas
                    .Max(c => c.PhoneAntutu);

                var minAntutu = _context.Phonedatas
                    .Min(c => c.PhoneAntutu);

                return Ok(new { manufacturerNames, cpuNames, maxAntutu, minAntutu });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetAllPhones")]

        public IActionResult GetAllPhones()
        {
            try
            {
                var phoneDatas = _context.Phonedatas
                .OrderByDescending(p => p.PhonePopularity)
                .Select(p => new mainPageDTO
                {
                    phoneID = p.PhoneId,
                    phoneName = p.PhoneName,
                    phonePrice = p.PhonePrice,
                    phoneInStore = p.PhoneInStore,
                })
                .ToList();



                return Ok(phoneDatas);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
