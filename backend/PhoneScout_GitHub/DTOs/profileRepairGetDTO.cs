using PhoneScout_GitHub.Models;

namespace PhoneScout_GitHub.DTOs
{
    public class profilerepairGetDTO
    {
        public string repairID { get; set; }
        public string name { get; set; }
        public int postalCode { get; set; }
        public string city { get; set; }
        public string address { get; set; }
        public long phoneNumber { get; set; }
        public string phoneName { get; set; }
        public int price { get; set; }
        public int status { get; set; }
        public string manufacturerName { get; set; }
        public int phoneInspection { get; set; }
        public string problemDescription { get; set; }
        public List<string> parts { get; set; }
    }
}
