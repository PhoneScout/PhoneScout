using System;
using System.Collections.Generic;

namespace PhoneScout_GitHub.Models;

public partial class Privilege
{
    public int Id { get; set; }

    public int Level { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
