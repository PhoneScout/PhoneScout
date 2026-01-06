using System;
using System.Collections.Generic;

namespace PhoneScout_GitHub.Models;

public partial class User
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Salt { get; set; } = null!;

    public string Hash { get; set; } = null!;

    public int PrivilegeId { get; set; }

    public int Active { get; set; }

    public virtual ICollection<Address> Addresses { get; set; } = new List<Address>();

    public virtual ICollection<Connectionservice> Connectionservices { get; set; } = new List<Connectionservice>();

    public virtual ICollection<Connuserorder> Connuserorders { get; set; } = new List<Connuserorder>();

    public virtual Privilege Privilege { get; set; } = null!;
}
