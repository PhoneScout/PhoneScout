using System;
using System.Collections.Generic;

namespace PhoneScout_GitHub.Models;

public partial class Ramstorage
{
    public int Id { get; set; }

    public int? RamAmount { get; set; }

    public int? StorageAmount { get; set; }

    public virtual ICollection<Connphoneramstorage> Connphoneramstorages { get; set; } = new List<Connphoneramstorage>();
}
