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
                    .Where(p => 
                    p.PhoneDeleted == 0
                    && (string.IsNullOrEmpty(filters.manufacturerName) || filters.manufacturerName == p.Manufacturer.ManufacturerName)
                    && (string.IsNullOrEmpty(filters.cpuName) || filters.cpuName == p.Cpu.CpuName)
                    && (filters.phoneAntutu == 0 || filters.phoneAntutu > p.PhoneAntutu)
                    && (filters.cpuMaxClockSpeed == 0 || filters.cpuMaxClockSpeed < p.Cpu.CpuMaxClockSpeed)
                    && (filters.cpuCoreNumber == 0 || filters.cpuCoreNumber < p.Cpu.CpuCoreNumber)
                    && (filters.screenSizeMin == 0 || filters.screenSizeMin < p.ScreenSize)
                    && (filters.screenSizeMax == 0 || filters.screenSizeMax > p.ScreenSize)
                    && (filters.screenRefreshRateMin == 0 || filters.screenRefreshRateMin < p.ScreenRefreshRate)
                    && (filters.screenRefreshRateMax == 0 || filters.screenRefreshRateMax > p.ScreenRefreshRate)
                    && (filters.screenMaxBrightness == 0 || filters.screenMaxBrightness < p.ScreenMaxBrightness)
                    && (filters.ramAmount == 0 || filters.ramAmount < p.Connphoneramstorages.Max(r => r.Ramstorage.RamAmount))
                    && (filters.storageAmount == 0 || filters.storageAmount < p.Connphoneramstorages.Max(r => r.Ramstorage.StorageAmount))
                    && (filters.batteryCapacity == 0 || filters.batteryCapacity < p.BatteryCapacity)
                    

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

                return Ok(new { manufacturerNames, cpuNames });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


    }
}
