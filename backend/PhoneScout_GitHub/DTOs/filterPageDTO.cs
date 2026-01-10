namespace PhoneScout_GitHub.DTOs
{
    public class filterPageDTO
    {
        public int phoneID { get; set; }
        public string manufacturerName { get; set; }
        public string phoneName { get; set; }
        public DateTime? phoneReleaseDate { get; set; }
        public string cpuName { get; set; }
        public int phoneAntutu { get; set; }
        public int cpuMaxClockSpeed { get; set; }
        public int cpuCoreNumber { get; set; }
        public decimal screenSizeMin { get; set; }
        public decimal screenSizeMax { get; set; }
        public int screenRefreshRateMin { get; set; }
        public int screenRefreshRateMax { get; set; }
        public int screenMaxBrightness { get; set; }
        public int connectionMaxWifi { get; set; }
        public decimal connectionMaxBluetooth { get; set; }
        public int connectionMaxMobileNetwork { get; set; }
        public string connectionDualSim { get; set; }
        public string connectionESim { get; set; }
        public string connectionNfc { get; set; }
        public int ramAmount { get; set; }
        public int storageAmount { get; set; }
        public int batteryCapacity { get; set; }
        public int batteryMaxChargingWired { get; set; }
        public int batteryMaxChargingWireless { get; set; }
        public decimal phoneWeightMin { get; set; }
        public decimal phoneWeightMax { get; set; }
        public string waterproofType { get; set; }
    }
}