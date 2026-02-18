using PhoneScout_GitHub.Models;

namespace PhoneScout_GitHub.DTOs
{
    public class comparePageDTO
    {

        //Egyszerű adatok
        public int? phoneID { get; set; }
        public string? phoneName { get; set; }
        public int? phoneAntutu { get; set; }
        public int? phoneResolutionHeight { get; set; }
        public int? phoneResolutionWidth { get; set; }
        public string? screenType { get; set; }
        public decimal? screenSize { get; set; }
        public int? screenRefreshRate { get; set; }
        public int? screenMaxBrightness { get; set; }
        public int? screenSharpness { get; set; }
        public int? connectionMaxWifi { get; set; }
        public decimal? connectionMaxBluetooth { get; set; }
        public int? connectionMaxMobileNetwork { get; set; }
        public int? batteryCapacity { get; set; }
        public int? batteryMaxChargingWired { get; set; }
        public int? batteryMaxChargingWireless { get; set; }
        public int? phonePrice { get; set; }
        public int? phoneInStore { get; set; }

        //Adatok kapcsolótáblákból
        public string? cpuName { get; set; }
        public int? cpuMaxClockSpeed { get; set; }
        public int? cpuCoreNumber { get; set; }
        public int? cpuManufacturingTechnology { get; set; }
        public string? ramSpeed { get; set; }
        public string? sensorsFingerprintPlace { get; set; }
        public string? sensorsFingerprintType { get; set; }
        public string? storageSpeed { get; set; }
        public string? waterproofType { get; set; }

        //Összetett adatok
        public List<ramStorageDTO> ramStorage { get; set; }
    }
}