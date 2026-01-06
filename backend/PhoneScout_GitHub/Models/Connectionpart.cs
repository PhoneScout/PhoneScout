using System;
using System.Collections.Generic;

namespace PhoneScout_GitHub.Models;

public partial class Connectionpart
{
    public int Id { get; set; }

    public string RepairId { get; set; } = null!;

    public int PartId { get; set; }

    public virtual Part Part { get; set; } = null!;

    public virtual Connectionservice Repair { get; set; } = null!;
}
