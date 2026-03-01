using System;
using System.Collections.Generic;

namespace PhoneScout_GitHub.Models;

public partial class Event
{
    public int EventId { get; set; }

    public int EventHostId { get; set; }

    public string EventName { get; set; } = null!;

    public DateTime EventDate { get; set; }

    public string EventUrl { get; set; } = null!;

    public byte[] EventImage { get; set; } = null!;

    public string ContentType { get; set; } = null!;

    public virtual Manufacturer EventHost { get; set; } = null!;
}
