using System;
using System.Collections.Generic;

namespace PhoneScout_GitHub.Models;

public partial class Connuserorder
{
    public int Id { get; set; }

    public string OrderId { get; set; } = null!;

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

    public string PhoneColorName { get; set; } = null!;

    public string PhoneColorHex { get; set; } = null!;

    public int PhoneRam { get; set; }

    public int PhoneStorage { get; set; }

    public int Price { get; set; }

    public int Amount { get; set; }

    public int Status { get; set; }

    public virtual User User { get; set; } = null!;
}
