namespace PhoneScout_GitHub.DTOs
{
    public class filterPageDTO 
    {
        public int phoneID { get; set; }
        public List<string> manufacturerNames { get; set; }
        public int phoneReleaseDate { get; set; }
        public List<string> cpuNames { get; set; }
        public int phoneAntutu { get; set; }
        public int cpuMaxClockSpeed { get; set; }
        public int cpuCoreNumber { get; set; }
        public decimal screenSizeMin { get; set; }
        public decimal screenSizeMax { get; set; }
        public int screenRefreshRateMin { get; set; }
        public int screenRefreshRateMax { get; set; }
        public int screenMaxBrightness { get; set; }
        public int ramAmount { get; set; }
        public int storageAmount { get; set; }
        public int batteryCapacity { get; set; }
        public decimal phoneWeightMin { get; set; }
        public decimal phoneWeightMax { get; set; }

    }
}