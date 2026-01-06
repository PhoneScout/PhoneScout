using System;
using System.Collections.Generic;

namespace PhoneScout_GitHub.Models;

public partial class Manufacturer
{
    public int Id { get; set; }

    public string? ManufacturerName { get; set; }

    public string? ManufacturerUrl { get; set; }

    public virtual ICollection<Phonedata> Phonedata { get; set; } = new List<Phonedata>();
}
