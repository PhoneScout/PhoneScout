using System;
using System.Collections.Generic;

namespace PhoneScout_GitHub.Models;

public partial class Connectionservice
{
    public string RepairId { get; set; } = null!;

    public int UserId { get; set; }

    public int PostalCode { get; set; }

    public string City { get; set; } = null!;

    public string Address { get; set; } = null!;

    public long PhoneNumber { get; set; }

    public string PhoneName { get; set; } = null!;

    public int Price { get; set; }

    public int Status { get; set; }

    public string ManufacturerName { get; set; } = null!;

    public sbyte PhoneInspection { get; set; }

    public string ProblemDescription { get; set; } = null!;

    public virtual ICollection<Connectionpart> Connectionparts { get; set; } = new List<Connectionpart>();

    public virtual User User { get; set; } = null!;
}
