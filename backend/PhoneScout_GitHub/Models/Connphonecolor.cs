using System;
using System.Collections.Generic;

namespace PhoneScout_GitHub.Models;

public partial class Connphonecolor
{
    public int Id { get; set; }

    public int PhoneId { get; set; }

    public int ColorId { get; set; }

    public virtual Color Color { get; set; } = null!;

    public virtual Phonedata Phone { get; set; } = null!;
}
