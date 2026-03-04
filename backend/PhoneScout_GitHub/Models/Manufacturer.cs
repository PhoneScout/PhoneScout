using System;
using System.Collections.Generic;

namespace PhoneScout_GitHub.Models;

public partial class Manufacturer
{
    public int Id { get; set; }

    public string? ManufacturerName { get; set; }

    public string? ManufacturerUrl { get; set; }

    public string ManufacturerEmail { get; set; } = null!;

    public string Salt { get; set; } = null!;

    public string Hash { get; set; } = null!;

    public virtual ICollection<Event> Events { get; set; } = new List<Event>();

    public virtual ICollection<Phonedata> Phonedata { get; set; } = new List<Phonedata>();
}
