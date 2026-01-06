using System;
using System.Collections.Generic;

namespace PhoneScout_GitHub.Models;

public partial class Connphoneramstorage
{
    public int Id { get; set; }

    public int PhoneId { get; set; }

    public int RamstorageId { get; set; }

    public virtual Phonedata Phone { get; set; } = null!;

    public virtual Ramstorage Ramstorage { get; set; } = null!;
}
