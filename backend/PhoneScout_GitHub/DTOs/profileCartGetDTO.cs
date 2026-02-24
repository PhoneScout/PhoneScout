namespace PhoneScout_GitHub.DTOs
{
    public class profileCartGetDTO
    {
        public int ID { get; set; }
        public string orderID { get; set; }
        public int userID { get; set; }
        public string userEmail { get; set; }
        public int billingPostalCode { get; set; }
        public string billingCity { get; set; }
        public string billingAddress { get; set; }
        public long billingPhoneNumber { get; set; } 
        public int deliveryPostalCode { get; set; }
        public string deliveryCity { get; set; }
        public string deliveryAddress { get; set; }
        public long deliveryPhoneNumber { get; set; } 
        public string phoneName { get; set; }
        public string phoneColorName { get; set; }
        public string phoneColorHex { get; set; }
        public int phoneRam { get; set; }
        public int phoneStorage { get; set; }
        public int price { get; set; }
        public int amount { get; set; }
        public int status { get; set; }
    }
}
