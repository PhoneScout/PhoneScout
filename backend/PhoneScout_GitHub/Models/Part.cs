using System;
using System.Collections.Generic;

namespace PhoneScout_GitHub.Models;

public partial class Part
{
    public int Id { get; set; }

    public string PartName { get; set; } = null!;

    public int PartStock { get; set; }

    public virtual ICollection<Connectionpart> Connectionparts { get; set; } = new List<Connectionpart>();
}
