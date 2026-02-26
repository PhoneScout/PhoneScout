using PhoneScout_GitHub.Models;

namespace PhoneScout_GitHub.DTOs
{
    public class eventDTO
    {
        public int eventID {get; set;}
        public string eventHostName {get; set;}
        public string eventHostURL {get; set;}
        public string eventName {get; set;}
        public DateTime eventDate {get; set;}
        public string eventURL {get; set;}

    }
}