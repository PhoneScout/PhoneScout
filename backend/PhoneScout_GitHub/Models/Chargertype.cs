using System;
using System.Collections.Generic;

namespace PhoneScout_GitHub.Models;

public partial class Chargertype
{
    public int Id { get; set; }

    public string? ChargerType1 { get; set; }

    public virtual ICollection<Phonedata> Phonedata { get; set; } = new List<Phonedata>();
}
