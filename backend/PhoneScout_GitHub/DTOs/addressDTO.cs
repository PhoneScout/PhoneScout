using Microsoft.Net.Http.Headers;

namespace PhoneScout_GitHub.DTOs
{
    public class addressDTO
    {
        public int postalCode {get;set;}
        public string city {get;set;}
        public string address {get;set;}
        public long phoneNumber {get;set;}
        public int addressType {get;set;}
        public int userID {get;set;}
    }
}
