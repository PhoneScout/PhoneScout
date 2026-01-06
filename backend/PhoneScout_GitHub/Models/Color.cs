using System;
using System.Collections.Generic;

namespace PhoneScout_GitHub.Models;

public partial class Color
{
    public int Id { get; set; }

    public string? ColorName { get; set; }

    public string? ColorHex { get; set; }

    public virtual ICollection<Connphonecolor> Connphonecolors { get; set; } = new List<Connphonecolor>();
}
