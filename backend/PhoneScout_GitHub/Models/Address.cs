using System;
using System.Collections.Generic;

namespace PhoneScout_GitHub.Models;

public partial class Address
{
    public int Id { get; set; }

    public int PostalCode { get; set; }

    public string City { get; set; } = null!;

    public string Address1 { get; set; } = null!;

    public long PhoneNumber { get; set; }

    public int AddressType { get; set; }

    public int UserId { get; set; }

    public virtual User User { get; set; } = null!;
}
