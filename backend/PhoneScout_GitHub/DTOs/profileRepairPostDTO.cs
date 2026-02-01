using PhoneScout_GitHub.Models;

namespace PhoneScout_GitHub.DTOs
{
    public class profileRepairPostDTO
    {
        public string repairID { get; set; }

        public int userID { get; set; }
        public int postalCode { get; set; }
        public string city { get; set; }
        public string address { get; set; }
        public long phoneNumber { get; set; }

        public string phoneName { get; set; }

        public int price { get; set; }

        public int status { get; set; }

        public string manufacturerName { get; set; } = null!;

        public sbyte phoneInspection { get; set; }
    
        public string problemDescription { get; set; } = null!;

        public List<string>? parts { get; set; }
    }
}
