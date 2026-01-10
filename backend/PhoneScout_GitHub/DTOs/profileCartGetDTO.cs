namespace PhoneScout_API_v2.DTOs
{
    public class profileCartGetDTO
    {
        public int userID { get; set; }
        public int postalCode { get; set; }
        public string city { get; set; }
        public string address { get; set; }
        public long phoneNumber { get; set; } 
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
