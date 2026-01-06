using System;
using System.Collections.Generic;

namespace PhoneScout_GitHub.Models;

public partial class Ramspeed
{
    public int Id { get; set; }

    public string? RamSpeed1 { get; set; }

    public virtual ICollection<Phonedata> Phonedata { get; set; } = new List<Phonedata>();
}
