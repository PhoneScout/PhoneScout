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
    public class wpfPhoneController : ControllerBase
    {

        private readonly PhoneContext cx;

        public wpfPhoneController(PhoneContext context)
        {
            cx = context;
        }

        [HttpGet]
        [SwaggerOperation(
            Summary = "Telefonok lekérése.",
            Description = "Admin felülethez az összes telefon lekérése."
        )]
        public IActionResult GetPhonesWPF()
        {
            try
            {
                var phones = cx.Phonedatas
                .OrderBy(m => m.PhoneId)
                .Select(m => new wpfPhonesDTO
                {
                    phoneID = m.PhoneId,
                    phoneName = m.PhoneName,
                    manufacturerName = m.Manufacturer.ManufacturerName,
                    phoneInstore = m.PhoneInStore,
                    phonePrice = m.PhonePrice,
                    phoneAvailable = m.PhoneDeleted,
                })
                .ToList();


                return Ok(phones);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        [SwaggerOperation(
            Summary = "Telefon módosítása.",
            Description = "Admin felülethez a telefon azonosítójának és a szükséges adatok megadása után a telefon módosítása."
        )]
        public IActionResult UpdatePhoneWPF([FromBody] wpfPhonesDTO dto, int id)
        {
            try
            {
                var phone = cx.Phonedatas
                    .FirstOrDefault(m => m.PhoneId == id);

                if (phone == null)
                {
                    return NotFound("A telefon nem található");
                }

                phone.PhoneName = dto.phoneName;
                phone.PhoneInStore = dto.phoneInstore;
                phone.PhonePrice = dto.phonePrice;
                phone.PhoneDeleted = dto.phoneAvailable;

                cx.SaveChanges();

                return Ok("A telefon adatai frissítve");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



        [HttpDelete("{id}")]
        [SwaggerOperation(
            Summary = "Telefon törlése.",
            Description = "Admin felülethez a telefon azonosítójának megadása után a telefon törlése."
        )]
        public IActionResult DeletePhoneWPF(int id)
        {
            try
            {
                var phone = cx.Phonedatas.FirstOrDefault(m => m.PhoneId == id);
                if (phone == null)
                {
                    return BadRequest("A telefon nem található.");
                }
                else
                {
                    cx.Phonedatas.Remove(phone);
                }
                cx.SaveChanges();
                return Ok("A telefon törölve");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

            [HttpPost("phonePost")]
    public IActionResult PostPhone([FromBody] phoneDTO dto)
    {
        if (dto == null)
            return BadRequest("Phone data is null");

        // --- Step 1: Check or create single-value entities ---
        Cpu cpu = cx.Cpus.FirstOrDefault(c => c.CpuName == dto.cpuName);
        if (cpu == null)
        {
            cpu = new Cpu
            {
                CpuName = dto.cpuName,
                CpuMaxClockSpeed = dto.cpuClock,
                CpuCoreNumber = dto.cpuCores,
                CpuManufacturingTechnology = dto.cpuTech
            };
            cx.Cpus.Add(cpu);
            cx.SaveChanges();
        }

        Manufacturer manufacturer = cx.Manufacturers.FirstOrDefault(m => m.ManufacturerName == dto.manufacturerName);
        if (manufacturer == null)
        {
            manufacturer = new Manufacturer
            {
                ManufacturerName = dto.manufacturerName,
                ManufacturerUrl = dto.manufacturerURL
            };
            cx.Manufacturers.Add(manufacturer);
            cx.SaveChanges();
        }

        Backmaterial backMaterial = cx.Backmaterials.FirstOrDefault(b => b.BackMaterial1 == dto.backMaterial);
        if (backMaterial == null)
        {
            backMaterial = new Backmaterial { BackMaterial1 = dto.backMaterial };
            cx.Backmaterials.Add(backMaterial);
            cx.SaveChanges();
        }

        Batterytype batteryType = cx.Batterytypes.FirstOrDefault(b => b.BatteryType1 == dto.batteryType);
        if (batteryType == null)
        {
            batteryType = new Batterytype { BatteryType1 = dto.batteryType };
            cx.Batterytypes.Add(batteryType);
            cx.SaveChanges();
        }

        Chargertype chargerType = cx.Chargertypes.FirstOrDefault(c => c.ChargerType1 == dto.chargerType);
        if (chargerType == null)
        {
            chargerType = new Chargertype { ChargerType1 = dto.chargerType };
            cx.Chargertypes.Add(chargerType);
            cx.SaveChanges();
        }

        Ramspeed ramSpeed = cx.Ramspeeds.FirstOrDefault(r => r.RamSpeed1 == dto.ramSpeed);
        if (ramSpeed == null)
        {
            ramSpeed = new Ramspeed { RamSpeed1 = dto.ramSpeed };
            cx.Ramspeeds.Add(ramSpeed);
            cx.SaveChanges();
        }

        Screentype screenType = cx.Screentypes.FirstOrDefault(s => s.ScreenType1 == dto.screenType);
        if (screenType == null)
        {
            screenType = new Screentype { ScreenType1 = dto.screenType };
            cx.Screentypes.Add(screenType);
            cx.SaveChanges();
        }

        Sensorsfingerprinttype fingerprintType = cx.Sensorsfingerprinttypes.FirstOrDefault(f => f.SensorsFingerprintType1 == dto.fingerprintType);
        if (fingerprintType == null)
        {
            fingerprintType = new Sensorsfingerprinttype { SensorsFingerprintType1 = dto.fingerprintType };
            cx.Sensorsfingerprinttypes.Add(fingerprintType);
            cx.SaveChanges();
        }

        Sensorsfingerprintplace fingerprintPlace = cx.Sensorsfingerprintplaces.FirstOrDefault(f => f.SensorsFingerprintPlace1 == dto.fingerprintPlace);
        if (fingerprintPlace == null)
        {
            fingerprintPlace = new Sensorsfingerprintplace { SensorsFingerprintPlace1 = dto.fingerprintPlace };
            cx.Sensorsfingerprintplaces.Add(fingerprintPlace);
            cx.SaveChanges();
        }

        Storagespeed storageSpeed = cx.Storagespeeds.FirstOrDefault(s => s.StorageSpeed1 == dto.storageSpeed);
        if (storageSpeed == null)
        {
            storageSpeed = new Storagespeed { StorageSpeed1 = dto.storageSpeed };
            cx.Storagespeeds.Add(storageSpeed);
            cx.SaveChanges();
        }

        Waterprooftype waterproofType = cx.Waterprooftypes.FirstOrDefault(w => w.WaterproofType1 == dto.waterproofType);
        if (waterproofType == null)
        {
            waterproofType = new Waterprooftype { WaterproofType1 = dto.waterproofType };
            cx.Waterprooftypes.Add(waterproofType);
            cx.SaveChanges();
        }

        Speakertype speakerType = cx.Speakertypes.FirstOrDefault(s => s.SpeakerType1 == dto.speakerType);
        if (speakerType == null)
        {
            speakerType = new Speakertype { SpeakerType1 = dto.speakerType };
            cx.Speakertypes.Add(speakerType);
            cx.SaveChanges();
        }

        // --- Step 2: Create the phone entity ---
        var phone = new Phonedata
        {
            PhoneName = dto.phoneName,
            PhoneAntutu = dto.phoneAntutu,
            PhoneResolutionHeight = dto.phoneResolutionHeight,
            PhoneResolutionWidth = dto.phoneResolutionWidth,
            ScreenSize = dto.screenSize,
            ScreenRefreshRate = dto.screenRefreshRate,
            ScreenMaxBrightness = dto.screenMaxBrightness,
            ScreenSharpness = dto.screenSharpness,
            ConnectionMaxWifi = (int?)dto.connectionMaxWifi,
            ConnectionMaxBluetooth = (decimal?)dto.connectionMaxBluetooth,
            ConnectionMaxMobileNetwork = dto.connectionMaxMobileNetwork,
            ConnectionDualSim = dto.connectionDualSim,
            ConnectionEsim = dto.connectionEsim,
            ConnectionNfc = dto.connectionNfc,
            ConnectionConnectionSpeed = (int?)dto.connectionConnectionSpeed,
            ConnectionJack = dto.connectionJack,
            SensorsInfrared = dto.sensorsInfrared,
            BatteryCapacity = dto.batteryCapacity,
            BatteryMaxChargingWired = dto.batteryMaxChargingWired,
            BatteryMaxChargingWireless = dto.batteryMaxChargingWireless,
            CaseHeight = dto.caseHeight,
            CaseWidth = dto.caseWidth,
            CaseThickness = dto.caseThickness,
            PhoneWeight = dto.phoneWeight,
            PhoneReleaseDate = dto.phoneReleaseDate,
            PhonePrice = dto.phonePrice,
            PhoneInStore = dto.phoneInStore,
            PhoneInStoreAmount = dto.phoneInStoreAmount,
            CpuId = cpu.Id,
            ManufacturerId = manufacturer.Id,
            BackMaterialId = backMaterial.Id,
            BatteryTypeId = batteryType.Id,
            ChargerTypeId = chargerType.Id,
            RamSpeedId = ramSpeed.Id,
            ScreenTypeId = screenType.Id,
            SensorsFingerprintTypeId = fingerprintType.Id,
            SensorsFingerprintPlaceId = fingerprintPlace.Id,
            StorageSpeedId = storageSpeed.Id,
            WaterproofTypeId = waterproofType.Id,
            SpeakerTypeId = speakerType.Id
        };

        cx.Phonedatas.Add(phone);
        cx.SaveChanges();

        // --- Step 3: Handle multi-value collections ---
        // Colors
        foreach (var colorDto in dto.colors)
        {
            var color = cx.Colors.FirstOrDefault(c => c.ColorName == colorDto.colorName && c.ColorHex == colorDto.colorHex);
            if (color == null)
            {
                color = new Color { ColorName = colorDto.colorName, ColorHex = colorDto.colorHex };
                cx.Colors.Add(color);
                cx.SaveChanges();
            }

            phone.Connphonecolors.Add(new Connphonecolor { ColorId = color.Id });
        }

        // RAM + Storage
        foreach (var rs in dto.ramStoragePairs)
        {
            var ramStorage = cx.Ramstorages.FirstOrDefault(r => r.RamAmount == rs.ramAmount && r.StorageAmount == rs.storageAmount);
            if (ramStorage == null)
            {
                ramStorage = new Ramstorage { RamAmount = rs.ramAmount, StorageAmount = rs.storageAmount };
                cx.Ramstorages.Add(ramStorage);
                cx.SaveChanges();
            }

            phone.Connphoneramstorages.Add(new Connphoneramstorage { RamstorageId = ramStorage.Id });
        }

        // Cameras
        for (int i = 0; i < dto.cameras.Count; i++)
        {
            var camDto = dto.cameras[i];
            var camera = cx.Cameras.FirstOrDefault(c => c.CameraName == camDto.cameraName);
            if (camera == null)
            {
                camera = new Camera
                {
                    CameraName = camDto.cameraName,
                    CameraResolution = camDto.cameraResolution,
                    CameraAperture = camDto.cameraAperture,
                    CameraFocalLength = camDto.cameraFocalLength,
                    CameraOis = camDto.cameraOis
                };
                cx.Cameras.Add(camera);
                cx.SaveChanges();
            }

            var cameraType = cx.Cameratypes.FirstOrDefault(ct => ct.CameraType1 == camDto.cameraType);
            if (cameraType == null)
            {
                cameraType = new Cameratype { CameraType1 = camDto.cameraType };
                cx.Cameratypes.Add(cameraType);
                cx.SaveChanges();
            }

            phone.Connphonecameras.Add(new Connphonecamera
            {
                CameraId = camera.Id,
                CameraTypeId = cameraType.Id
            });
        }

        cx.SaveChanges();

        return Ok(phone.PhoneId);
    }

    [HttpPut("phoneUpdate/{id}")]
public IActionResult UpdatePhone(int id, [FromBody] phoneDTO dto)
{
    if (dto == null)
        return BadRequest("Phone data is null");

    var phone = cx.Phonedatas
        .Include(p => p.Connphonecolors)
        .Include(p => p.Connphoneramstorages)
        .Include(p => p.Connphonecameras)
        .FirstOrDefault(p => p.PhoneId == id);

    if (phone == null)
        return NotFound("Phone not found");

    // ===============================
    // STEP 1: Single-value entities
    // ===============================

    Cpu cpu = cx.Cpus.FirstOrDefault(c => c.CpuName == dto.cpuName)
              ?? cx.Cpus.Add(new Cpu
              {
                  CpuName = dto.cpuName,
                  CpuMaxClockSpeed = dto.cpuClock,
                  CpuCoreNumber = dto.cpuCores,
                  CpuManufacturingTechnology = dto.cpuTech
              }).Entity;

    Manufacturer manufacturer = cx.Manufacturers.FirstOrDefault(m => m.ManufacturerName == dto.manufacturerName)
              ?? cx.Manufacturers.Add(new Manufacturer
              {
                  ManufacturerName = dto.manufacturerName,
                  ManufacturerUrl = dto.manufacturerURL
              }).Entity;

    Backmaterial backMaterial = cx.Backmaterials.FirstOrDefault(b => b.BackMaterial1 == dto.backMaterial)
              ?? cx.Backmaterials.Add(new Backmaterial { BackMaterial1 = dto.backMaterial }).Entity;

    Batterytype batteryType = cx.Batterytypes.FirstOrDefault(b => b.BatteryType1 == dto.batteryType)
              ?? cx.Batterytypes.Add(new Batterytype { BatteryType1 = dto.batteryType }).Entity;

    Chargertype chargerType = cx.Chargertypes.FirstOrDefault(c => c.ChargerType1 == dto.chargerType)
              ?? cx.Chargertypes.Add(new Chargertype { ChargerType1 = dto.chargerType }).Entity;

    Ramspeed ramSpeed = cx.Ramspeeds.FirstOrDefault(r => r.RamSpeed1 == dto.ramSpeed)
              ?? cx.Ramspeeds.Add(new Ramspeed { RamSpeed1 = dto.ramSpeed }).Entity;

    Screentype screenType = cx.Screentypes.FirstOrDefault(s => s.ScreenType1 == dto.screenType)
              ?? cx.Screentypes.Add(new Screentype { ScreenType1 = dto.screenType }).Entity;

    Sensorsfingerprinttype fingerprintType = cx.Sensorsfingerprinttypes
              .FirstOrDefault(f => f.SensorsFingerprintType1 == dto.fingerprintType)
              ?? cx.Sensorsfingerprinttypes.Add(
                  new Sensorsfingerprinttype { SensorsFingerprintType1 = dto.fingerprintType }).Entity;

    Sensorsfingerprintplace fingerprintPlace = cx.Sensorsfingerprintplaces
              .FirstOrDefault(f => f.SensorsFingerprintPlace1 == dto.fingerprintPlace)
              ?? cx.Sensorsfingerprintplaces.Add(
                  new Sensorsfingerprintplace { SensorsFingerprintPlace1 = dto.fingerprintPlace }).Entity;

    Storagespeed storageSpeed = cx.Storagespeeds.FirstOrDefault(s => s.StorageSpeed1 == dto.storageSpeed)
              ?? cx.Storagespeeds.Add(new Storagespeed { StorageSpeed1 = dto.storageSpeed }).Entity;

    Waterprooftype waterproofType = cx.Waterprooftypes.FirstOrDefault(w => w.WaterproofType1 == dto.waterproofType)
              ?? cx.Waterprooftypes.Add(new Waterprooftype { WaterproofType1 = dto.waterproofType }).Entity;

    Speakertype speakerType = cx.Speakertypes.FirstOrDefault(s => s.SpeakerType1 == dto.speakerType)
              ?? cx.Speakertypes.Add(new Speakertype { SpeakerType1 = dto.speakerType }).Entity;

    // ===============================
    // STEP 2: Update main phone fields
    // ===============================

    phone.PhoneName = dto.phoneName;
    phone.PhoneAntutu = dto.phoneAntutu;
    phone.PhoneResolutionHeight = dto.phoneResolutionHeight;
    phone.PhoneResolutionWidth = dto.phoneResolutionWidth;
    phone.ScreenSize = dto.screenSize;
    phone.ScreenRefreshRate = dto.screenRefreshRate;
    phone.ScreenMaxBrightness = dto.screenMaxBrightness;
    phone.ScreenSharpness = dto.screenSharpness;
    phone.ConnectionMaxWifi = (int?)dto.connectionMaxWifi;
    phone.ConnectionMaxBluetooth = dto.connectionMaxBluetooth;
    phone.ConnectionMaxMobileNetwork = dto.connectionMaxMobileNetwork;
    phone.ConnectionDualSim = dto.connectionDualSim;
    phone.ConnectionEsim = dto.connectionEsim;
    phone.ConnectionNfc = dto.connectionNfc;
    phone.ConnectionConnectionSpeed = (int?)dto.connectionConnectionSpeed;
    phone.ConnectionJack = dto.connectionJack;
    phone.SensorsInfrared = dto.sensorsInfrared;
    phone.BatteryCapacity = dto.batteryCapacity;
    phone.BatteryMaxChargingWired = dto.batteryMaxChargingWired;
    phone.BatteryMaxChargingWireless = dto.batteryMaxChargingWireless;
    phone.CaseHeight = dto.caseHeight;
    phone.CaseWidth = dto.caseWidth;
    phone.CaseThickness = dto.caseThickness;
    phone.PhoneWeight = dto.phoneWeight;
    phone.PhoneReleaseDate = dto.phoneReleaseDate;
    phone.PhonePrice = dto.phonePrice;
    phone.PhoneInStore = dto.phoneInStore;
    phone.PhoneInStoreAmount = dto.phoneInStoreAmount;

    // FK assignments
    phone.Cpu = cpu;
    phone.Manufacturer = manufacturer;
    phone.BackMaterial = backMaterial;
    phone.BatteryType = batteryType;
    phone.ChargerType = chargerType;
    phone.RamSpeed = ramSpeed;
    phone.ScreenType = screenType;
    phone.SensorsFingerprintType = fingerprintType;
    phone.SensorsFingerprintPlace = fingerprintPlace;
    phone.StorageSpeed = storageSpeed;
    phone.WaterproofType = waterproofType;
    phone.SpeakerType = speakerType;

    // ===============================
    // STEP 3: Merge multi-value tables
    // ===============================

    // COLORS
    foreach (var colorDto in dto.colors)
    {
        var color = cx.Colors.FirstOrDefault(c =>
            c.ColorName == colorDto.colorName &&
            c.ColorHex == colorDto.colorHex)
            ?? cx.Colors.Add(new Color
            {
                ColorName = colorDto.colorName,
                ColorHex = colorDto.colorHex
            }).Entity;

        if (!phone.Connphonecolors.Any(x => x.ColorId == color.Id))
        {
            phone.Connphonecolors.Add(new Connphonecolor
            {
                Color = color
            });
        }
    }

    // RAM + STORAGE
    foreach (var rs in dto.ramStoragePairs)
    {
        var ramStorage = cx.Ramstorages.FirstOrDefault(r =>
            r.RamAmount == rs.ramAmount &&
            r.StorageAmount == rs.storageAmount)
            ?? cx.Ramstorages.Add(new Ramstorage
            {
                RamAmount = rs.ramAmount,
                StorageAmount = rs.storageAmount
            }).Entity;

        if (!phone.Connphoneramstorages.Any(x => x.RamstorageId == ramStorage.Id))
        {
            phone.Connphoneramstorages.Add(new Connphoneramstorage
            {
                Ramstorage = ramStorage
            });
        }
    }

    // CAMERAS
    foreach (var camDto in dto.cameras)
    {
        var camera = cx.Cameras.FirstOrDefault(c =>
            c.CameraName == camDto.cameraName)
            ?? cx.Cameras.Add(new Camera
            {
                CameraName = camDto.cameraName,
                CameraResolution = camDto.cameraResolution,
                CameraAperture = camDto.cameraAperture,
                CameraFocalLength = camDto.cameraFocalLength,
                CameraOis = camDto.cameraOis
            }).Entity;

        var cameraType = cx.Cameratypes.FirstOrDefault(ct =>
            ct.CameraType1 == camDto.cameraType)
            ?? cx.Cameratypes.Add(new Cameratype
            {
                CameraType1 = camDto.cameraType
            }).Entity;

        if (!phone.Connphonecameras.Any(x =>
            x.CameraId == camera.Id &&
            x.CameraTypeId == cameraType.Id))
        {
            phone.Connphonecameras.Add(new Connphonecamera
            {
                Camera = camera,
                CameraType = cameraType
            });
        }
    }

    // ===============================
    // FINAL SAVE
    // ===============================
    cx.SaveChanges();

    return Ok("Telefon sikeresen frissítve!");
}
    }}


