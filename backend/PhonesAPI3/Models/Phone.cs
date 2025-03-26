namespace PhonesAPI3.Models
{
    public class Phone
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Price { get; set; }
        public string inStore { get; set; }
        public DateOnly? releaseDate { get; set; }


        
    }


}
