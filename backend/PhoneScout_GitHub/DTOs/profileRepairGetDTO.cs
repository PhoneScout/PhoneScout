using PhoneScout_GitHub.Models;

namespace PhoneScout_GitHub.DTOs
{
    public class profileRepairGetDTO
    {
        public string repairID { get; set; }
        public int userID { get; set; }
        public string userEmail { get; set; }
        public string userName { get; set; }
        public int billingPostalCode { get; set; }
        public string billingCity { get; set; }
        public string billingAddress { get; set; }
        public long billingPhoneNumber { get; set; } 
        public int deliveryPostalCode { get; set; }
        public string deliveryCity { get; set; }
        public string deliveryAddress { get; set; }
        public long deliveryPhoneNumber { get; set; } 
        public string phoneName { get; set; }
        public int basePrice { get; set; }
        public int repairPrice { get; set; }
        public int isPriceAccepted { get; set; }        public int status { get; set; }
        public string manufacturerName { get; set; }
        public int phoneInspection { get; set; }
        public string problemDescription { get; set; }
        public List<string> parts { get; set; }
    }
}
