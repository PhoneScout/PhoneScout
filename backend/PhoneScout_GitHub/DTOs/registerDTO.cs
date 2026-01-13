namespace PhoneScout_GitHub.DTOs
{
    public class registerDTO
    {
        public string name { get; set; } = null!;

        public string email { get; set; } = null!;

        public string SALT { get; set; } = null!;

        public string HASH { get; set; } = null!;

        public int privilegeID { get; set; }

        public int active { get; set; }
    }
}