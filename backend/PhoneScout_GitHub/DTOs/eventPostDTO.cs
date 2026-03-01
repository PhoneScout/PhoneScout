using PhoneScout_GitHub.Models;

namespace PhoneScout_GitHub.DTOs
{
    public class eventPostDTO
    {
        public int eventID { get; set; }
        public string eventHostName { get; set; }
        public string eventName { get; set; }
        public DateTime eventDate { get; set; }
        public string eventURL { get; set; }

        public string? imageBase64 { get; set; }
        public string? contentType { get; set; }


    }
}