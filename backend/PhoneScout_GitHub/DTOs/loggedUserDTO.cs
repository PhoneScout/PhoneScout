namespace PhoneScout_GitHub.DTOs
{
    public class LoggedUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public int Privilege { get; set; }
        public string Token { get; set; }
    }
}