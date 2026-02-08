using Microsoft.AspNetCore.Mvc;
using PhoneScout_GitHub.DTOs;
using PhoneScout_GitHub.Models;
using Swashbuckle.AspNetCore.Annotations;


namespace PhoneScout_GitHub.Controllers
{
    public class phonePageController : ControllerBase
    {
        private readonly PhoneContext _context;

        public phonePageController(PhoneContext context)
        {
            _context = context;
        }

        [HttpGet("phonePage/{id}")]
        [SwaggerOperation(
            Summary = "Telefon oldalhoz szükséges információk lekérése.",
            Description = "A telefon ID megadása utás, az adott telefonról található összes adat lekérése az adatbázisból."
        )]
        public ActionResult<phoneDTO> GetPhonePage(int id)
        {
            var phone = _context.Phonedatas
                .Where(p => p.PhoneId == id)
                .Select(p => new phoneDTO
                {
                    phoneId = p.PhoneId,
                    phoneName = p.PhoneName,
                    phoneAntutu = p.PhoneAntutu,
                    phoneResolutionHeight = p.PhoneResolutionHeight,
                    phoneResolutionWidth = p.PhoneResolutionWidth,
                    screenSize = p.ScreenSize,
                    screenRefreshRate = p.ScreenRefreshRate,
                    screenMaxBrightness = p.ScreenMaxBrightness,
                    screenSharpness = p.ScreenSharpness,
                    connectionMaxWifi = p.ConnectionMaxWifi,
                    connectionMaxBluetooth = p.ConnectionMaxBluetooth,
                    connectionMaxMobileNetwork = p.ConnectionMaxMobileNetwork,
                    connectionDualSim = p.ConnectionDualSim,
                    connectionEsim = p.ConnectionEsim,
                    connectionNfc = p.ConnectionNfc,
                    connectionConnectionSpeed = p.ConnectionConnectionSpeed,
                    connectionJack = p.ConnectionJack,
                    sensorsInfrared = p.SensorsInfrared,
                    batteryCapacity = p.BatteryCapacity,
                    batteryMaxChargingWired = p.BatteryMaxChargingWired,
                    batteryMaxChargingWireless = p.BatteryMaxChargingWireless,
                    caseHeight = p.CaseHeight,
                    caseWidth = p.CaseWidth,
                    caseThickness = p.CaseThickness,
                    phoneWeight = p.PhoneWeight,
                    phoneReleaseDate = p.PhoneReleaseDate,
                    phonePrice = p.PhonePrice,
                    phoneInStore = p.PhoneInStore,
                    phoneInStoreAmount = p.PhoneInStoreAmount,
                    backMaterial = p.BackMaterial.BackMaterial1,
                    batteryType = p.BatteryType.BatteryType1,
                    chargerType = p.ChargerType.ChargerType1,
                    cpuName = p.Cpu.CpuName,
                    cpuClock = p.Cpu.CpuMaxClockSpeed,
                    cpuCores = p.Cpu.CpuCoreNumber,
                    cpuTech = p.Cpu.CpuManufacturingTechnology,
                    manufacturerName = p.Manufacturer.ManufacturerName,
                    manufacturerURL = p.Manufacturer.ManufacturerUrl,
                    ramSpeed = p.RamSpeed.RamSpeed1,
                    screenType = p.ScreenType.ScreenType1,
                    fingerprintType = p.SensorsFingerprintType.SensorsFingerprintType1,
                    fingerprintPlace = p.SensorsFingerprintPlace.SensorsFingerprintPlace1,
                    storageSpeed = p.StorageSpeed.StorageSpeed1,
                    waterproofType = p.WaterproofType.WaterproofType1,
                    speakerType = p.SpeakerType.SpeakerType1,
                    colors = p.Connphonecolors
                        .Select(c => new colorDTO
                        {
                            colorName = c.Color.ColorName,
                            colorHex = c.Color.ColorHex
                        }).ToList(),
                    cameras = p.Connphonecameras
                        .Select(c => new cameraDTO
                        {
                            cameraName = c.Camera.CameraName,
                            cameraResolution = c.Camera.CameraResolution,
                            cameraAperture = c.Camera.CameraAperture,
                            cameraFocalLength = c.Camera.CameraFocalLength,
                            cameraOis = c.Camera.CameraOis,
                            cameraType = c.CameraType.CameraType1
                        }).ToList(),
                    ramStoragePairs = p.Connphoneramstorages
                        .Select(r => new ramStorageDTO { ramAmount = r.Ramstorage.RamAmount, storageAmount = r.Ramstorage.StorageAmount })
                        .ToList()
                })
                .FirstOrDefault();

            if(phone != null)
            {
                return Ok(phone);
            }
            else
            {
                return BadRequest("A telefon nem található!");
            }            
        }
    }
}