namespace PhoneScout_GitHub.DTOs
{
    public class mainPageDTO
    {        

        public int? phoneID {  get; set; }
        public string? phoneName { get; set; }
        public int? phonePrice { get; set; }
        public int? phoneInStore { get; set; }
        public List<colorDTO> colors { get; set; }
        public List<ramStorageDTO> ramStoragePairs { get; set; }
    }
}
