using System;
using System.Collections.Generic;

namespace PhoneScout_GitHub.Models;

public partial class Phonepicture
{
    public int Id { get; set; }

    public int PhoneId { get; set; }

    public byte[] PhonePicture1 { get; set; } = null!;

    public string ContentType { get; set; } = null!;

    public int IsIndex { get; set; }

    public virtual Phonedata Phone { get; set; } = null!;
}
