using Microsoft.Net.Http.Headers;

namespace PhoneScout_GitHub.DTOs
{
    public class addressDTO
    {
        // Unique database identifier, used for updates/deletes
        public int Id { get; set; }

        public int postalCode {get;set;}
        public string city {get;set;}
        public string address {get;set;}
        public long phoneNumber {get;set;}
        public int addressType {get;set;}
        public int userID {get;set;}
    }
}
