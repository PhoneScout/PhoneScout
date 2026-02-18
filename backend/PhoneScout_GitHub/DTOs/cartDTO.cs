using PhoneScout_GitHub.DTOs;

namespace PhoneScout_GitHub.DTOs
{
    public class cartDTO
    {
        public int? phoneID { get; set; }
        public string phoneName { get; set; }
        public int? phonePrice { get; set; }
        public int? phoneInStore { get; set; }
        public colorDTO Color { get; set; }
        public ramStorageDTO ramStorage { get; set; }
    }
}
