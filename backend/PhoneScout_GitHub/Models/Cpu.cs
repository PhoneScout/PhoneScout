using System;
using System.Collections.Generic;

namespace PhoneScout_GitHub.Models;

public partial class Cpu
{
    public int Id { get; set; }

    public string? CpuName { get; set; }

    public int? CpuMaxClockSpeed { get; set; }

    public int? CpuCoreNumber { get; set; }

    public int? CpuManufacturingTechnology { get; set; }

    public virtual ICollection<Phonedata> Phonedata { get; set; } = new List<Phonedata>();
}
