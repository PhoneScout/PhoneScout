using Microsoft.Net.Http.Headers;

namespace PhoneScout_GitHub.DTOs
{
    public class ChangePasswordDTO
    {
        public string Email { get; set; }
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
        public string SALT { get; set; }
    }
}
