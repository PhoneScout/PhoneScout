using System;
using System.Collections.Generic;

namespace PhoneScout_GitHub.Models;

public partial class Backmaterial
{
    public int Id { get; set; }

    public string? BackMaterial1 { get; set; }

    public virtual ICollection<Phonedata> Phonedata { get; set; } = new List<Phonedata>();
}
