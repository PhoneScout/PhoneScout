using System;
using System.Collections.Generic;

namespace PhoneScout_GitHub.Models;

public partial class Connectionservice
{
    public string RepairId { get; set; } = null!;

    public int UserId { get; set; }

    public int BillingPostalCode { get; set; }

    public string BillingCity { get; set; } = null!;

    public string BillingAddress { get; set; } = null!;

    public long BillingPhoneNumber { get; set; }

    public int DeliveryPostalCode { get; set; }

    public string DeliveryCity { get; set; } = null!;

    public string DeliveryAddress { get; set; } = null!;

    public long DeliveryPhoneNumber { get; set; }

    public string PhoneName { get; set; } = null!;

    public int BasePrice { get; set; }

    public int RepairPrice { get; set; }

    public int IsPriceAccepted { get; set; }

    public int Status { get; set; }

    public string ManufacturerName { get; set; } = null!;

    public sbyte PhoneInspection { get; set; }

    public string ProblemDescription { get; set; } = null!;

    public virtual ICollection<Connectionpart> Connectionparts { get; set; } = new List<Connectionpart>();

    public virtual User User { get; set; } = null!;
}
