using Microsoft.AspNetCore.Mvc;
using PhoneScout_GitHub.DTOs;
using PhoneScout_GitHub.Models;
using Swashbuckle.AspNetCore.Annotations;


namespace PhoneScout_GitHub.Controllers
{
    public class comparePageController : ControllerBase
    {
        private readonly PhoneContext _context;

        public comparePageController(PhoneContext context)
        {
            _context = context;
        }

        [HttpGet("comparePage/{id}")]
        [SwaggerOperation(
            Summary = "Az összehasonlítás oldalhoz szükséges adatok lekérése.",
            Description = "A kiválasztott telefon, összehasonlítás oldalhoz szükséges adatainak lekérése."
        )]
        public IActionResult comparePage(int id)
        {
            var phone = _context.Phonedatas
                .Where(p => p.PhoneId == id)
            .Select(p => new comparePageDTO
            {
                phoneID = p.PhoneId,
                phoneName = p.PhoneName,
                phoneAntutu = p.PhoneAntutu,
                phoneResolutionHeight = p.PhoneResolutionHeight,
                phoneResolutionWidth = p.PhoneResolutionWidth,
                screenSize = p.ScreenSize,
                screenMaxBrightness = p.ScreenMaxBrightness,
                screenSharpness = p.ScreenSharpness,
                connectionMaxWifi = p.ConnectionMaxWifi,
                connectionMaxBluetooth = p.ConnectionMaxBluetooth,
                connectionMaxMobileNetwork = p.ConnectionMaxMobileNetwork,

                batteryCapacity = p.BatteryCapacity,
                batteryMaxChargingWired = p.BatteryMaxChargingWired,
                batteryMaxChargingWireless = p.BatteryMaxChargingWireless,

                phonePrice = p.PhonePrice,
                phoneInStore = p.PhoneInStore,

                cpuName = p.Cpu.CpuName,
                cpuMaxClockSpeed = p.Cpu.CpuMaxClockSpeed,
                cpuCoreNumber = p.Cpu.CpuCoreNumber,
                cpuManufacturingTechnology = p.Cpu.CpuManufacturingTechnology,

                ramSpeed = p.RamSpeed.RamSpeed1,
                screenType = p.ScreenType.ScreenType1,
                sensorsFingerprintPlace = p.SensorsFingerprintPlace.SensorsFingerprintPlace1,
                sensorsFingerprintType = p.SensorsFingerprintType.SensorsFingerprintType1,
                storageSpeed = p.StorageSpeed.StorageSpeed1,
                waterproofType = p.WaterproofType.WaterproofType1,

                ramStorage = p.Connphoneramstorages.Select(p => new ramStorageDTO
                {
                    ramAmount = p.Ramstorage.RamAmount,
                    storageAmount = p.Ramstorage.StorageAmount
                }).ToList()
            });

        
            return Ok(phone);
        }
    }
}
